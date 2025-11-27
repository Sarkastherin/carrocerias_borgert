import { Input, Label } from "./Inputs";
import { useEffect, useCallback, useState } from "react";
import { Select } from "./Inputs";
import { ChevronDown } from "lucide-react";
import type {
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
  FieldErrors,
} from "react-hook-form";
import type { MouseEventHandler, MouseEvent } from "react";

export interface Provincia {
  id: string;
  nombre: string;
  nombre_completo: string;
  fuente: string;
  categoria: string;
  centroide: {
    lat: number;
    lon: number;
  };
  iso_id: string;
  iso_nombre: string;
}

interface Localidades {
  id: string;
  nombre: string;
  fuente: string;
  provincia: { id: string; nombre: string };
  departamento: { id: string; nombre: string };
  gobierno_local: { id: string; nombre: string };
  localidad_censal: { id: string; nombre: string };
  categoria: string;
  centroide: {
    lat: number;
    lon: number;
  };
}

interface AddressFieldsProps {
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
  errors: FieldErrors<any>;
}
export function AddressFields({
  register,
  watch,
  setValue,
  errors,
}: AddressFieldsProps) {
  const [provincias, setProvincias] = useState<Provincia[] | null>(null);
  const [localidades, setLocalidades] = useState<Localidades[] | null>(null);
  const [localidadesByProvincia, setLocalidadesByProvincia] = useState<
    Localidades[] | null
  >(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredLocalidades, setFilteredLocalidades] = useState<
    Localidades[] | null
  >(null);
  //const [isAddressCompleted, setIsAddressCompleted] = useState(false);
  const handleDropDown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const fetchProvincias = async () => {
    try {
      const data = await fetch("/provincias.json")
        .then((res) => res.json())
        .then((data) => {
          return data.provincias;
        });
      setProvincias(data);
    } catch (error) {
      console.error("Error fetching provincias:", error);
    }
  };
  const fetchLocalidades = async () => {
    try {
      const data = await fetch(`/localidades.json`)
        .then((res) => res.json())
        .then((data) => {
          return data.localidades;
        });
      setLocalidades(data);
    } catch (error) {
      console.error("Error fetching localidades:", error);
    }
  };
  useEffect(() => {
    if (!provincias) fetchProvincias();
    if (!localidades) fetchLocalidades();
  }, []);
  useEffect(() => {
    const provinciaId = watch("provincia_id");
    if (provinciaId && localidades) {
      const filteredLocalidadesAll = localidades.filter(
        (loc) => loc.provincia.id === provinciaId
      );
      setLocalidadesByProvincia(filteredLocalidadesAll);
      setFilteredLocalidades(filteredLocalidadesAll);
    } else {
      setLocalidadesByProvincia(null);
      setFilteredLocalidades(null);
    }
  }, [watch("provincia_id")]);
  useEffect(() => {}, [localidadesByProvincia]);
  const getNameById = (id: string, type: "provincia" | "localidad") => {
    if (type === "provincia" && provincias) {
      const provincia = provincias.find((prov) => prov.id === id);
      return provincia ? provincia.nombre : "";
    }
    if (type === "localidad" && localidades) {
      const localidad = localidades.find((loc) => loc.id === id);
      return localidad ? localidad.nombre : "";
    }
  };
  const handleChangeProvincia = () => {
    setIsDropdownOpen(false);
    const provinciaId = watch("provincia_id");
    const provinciaNombre = getNameById(provinciaId, "provincia");
    setValue("provincia", provinciaNombre, {shouldDirty: true});
    setValue("localidad_id", "",{shouldDirty: true});
    setValue("localidad", "",{shouldDirty: true});
    setValue("direccion", "", {shouldDirty: true});
  };
  const handleChangeLocalidad = (id: string) => {
    setValue("localidad_id", id,{shouldDirty: true});
    if (!id) {
      setValue("localidad_id", "", {shouldDirty: true});
      setValue("localidad", "", {shouldDirty: true});
      setValue("direccion", "", {shouldDirty: true});
    }
    const localidadNombre = getNameById(id, "localidad");
    setValue("localidad", localidadNombre || "",{shouldDirty: true});
    setValue("direccion", "", {shouldDirty: true});
  };
  const handleSelectedLocalidad = (e: MouseEvent<HTMLLIElement>) => {
    const localidadId = e.currentTarget.getAttribute("data-id");
    if (localidadId) handleChangeLocalidad(localidadId);
    setIsDropdownOpen(false);
  };
  const handleFilterLocalidades: MouseEventHandler<HTMLInputElement> = (e) => {
    const filterText = e.currentTarget.value.toLowerCase();
    if (localidadesByProvincia) {
      const filtered = localidadesByProvincia.filter((loc) =>
        loc.nombre.toLowerCase().includes(filterText)
      );
      setFilteredLocalidades(filtered);
    }
  };
  const disabled = !watch("provincia_id") || watch("provincia_id") === "";
  const isAddressCompleted =
    watch("provincia_id") &&
    watch("provincia_id") !== "" &&
    watch("localidad_id") &&
    watch("localidad_id") !== "" &&
    watch("direccion") &&
    watch("direccion") !== "";
  const getFormattedAddress = () => {
    const provinciaNombre = getNameById(watch("provincia_id"), "provincia");
    const localidadNombre = getNameById(watch("localidad_id"), "localidad");
    return `${localidadNombre}, ${provinciaNombre}${watch("direccion") ? `, ${watch("direccion")}` : ""}`;
  };
  return (
    <>
      {provincias && localidades && (
        <div className="flex  flex-col space-y-4">
          {/* Campo Provincia */}
          <Select
            label="Provincia"
            {...register("provincia_id", { onChange: handleChangeProvincia })}
          >
            <option value="">Seleccione una provincia</option>
            {provincias ? (
              provincias.map((provincia) => (
                <option key={provincia.id} value={provincia.id}>
                  {provincia.nombre}
                </option>
              ))
            ) : (
              <option>Cargando provincias...</option>
            )}
          </Select>
          <div>
            <Label label="Localidad" requiredField={true} />
            <button
              type="button"
              className="bg-gray-50 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 text-text-primary text-sm rounded-lg focus:ring focus:outline-none focus:ring-blue-400 focus:border-blue-500 block w-full p-2.5 placeholder:text-gray-400 disabled:opacity-70 disabled:cursor-not-allowed"
              onClick={handleDropDown}
              disabled={disabled}
            >
              <span className="float-end">
                <ChevronDown
                  className={`size-4 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
                />
              </span>
              <span className="float-start">
                {disabled
                  ? "Seleccione una provincia"
                  : watch("localidad") || "Seleccione una localidad"}
              </span>
            </button>
            <div
              className={`bg-slate-100 dark:bg-slate-900 p-4 mt-2 rounded-xl border border-slate-300 dark:border-gray-700 ${isDropdownOpen ? "" : "hidden"} transition-all ease-in-out duration-300`}
            >
              <Input
                type="search"
                placeholder="Buscar localidad"
                onInput={handleFilterLocalidades}
              />
              <ul className="mt-2 max-h-40 overflow-y-auto">
                {filteredLocalidades ? (
                  filteredLocalidades.map((loc) => (
                    <li
                      key={loc.id}
                      className="py-1 px-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md text-md text-text-secondary"
                      data-id={loc.id}
                      onClick={handleSelectedLocalidad}
                    >
                      {loc.nombre}
                    </li>
                  ))
                ) : (
                  <li>Cargando localidades...</li>
                )}
              </ul>
            </div>
          </div>
          <Input
            label="Dirección"
            placeholder="Ej: Av. Corrientes 1234, Piso 5, Depto B (Opcional)"
            disabled={disabled}
            {...register("direccion")}
          />
          {/* Previsualización de la dirección completa */}
          {isAddressCompleted && (
            <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md p-3 mt-1">
              <p className="text-sm text-text-secondary mb-1">
                Dirección completa:
              </p>
              <p className="text-sm font-medium text-text-primary">
                {getFormattedAddress()}
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
