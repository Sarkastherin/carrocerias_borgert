import { Textarea, Select, ToggleCheckbox, InputWithIcon } from "../Inputs";
import { Button } from "../Buttons";
import { useCarroceriaForm } from "~/hooks/useCarroceriaForm";
import { CardToggle } from "../CardToggle";
import { useData } from "~/context/DataContext";
import { RulerDimensionLine } from "lucide-react";
import { useDataLoader } from "~/hooks/useDataLoader";
import { FooterForm } from "./Footer";
import LoadingComponent from "../LoadingComponent";
import { Badge } from "../Badge";
import {
  materialOptions,
  anchoOptions,
  arcosOptions,
  tiposArcosOptions,
  espesorOptions,
  lineasRefOptions,
  pisoOptions,
  cintasOptions,
  zocaloOptions,
  tiposBoquillasOptions,
  ubicacionOptions,
} from "~/config/atributosMetadata";
import { useEffect } from "react";
import { useUIModals } from "~/context/ModalsContext";

export default function DatosColocacionForm() {
  const { openModal, closeModal } = useUIModals();
  const {
    colores,
    getColores,
    carrozados,
    getCarrozados,
    puertasTraseras,
    getPuertasTraseras,
    selectedCarrozado,
    setSelectedCarrozado,
    getCarrozadoByID,
  } = useData(true);

  const { isLoading: isLoadingData } = useDataLoader({
    loaders: [getColores, getCarrozados, getPuertasTraseras],
    forceLoad: true,
    errorMessage: "Error loading carroceria data",
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    onSubmit,
    submitButtonText,
    isLoading,
    setIsLoading,
    watch,
    setValue,
    resetForm,
  } = useCarroceriaForm();

  // Reset selectedCarrozado al montar el componente
  useEffect(() => {
    setSelectedCarrozado(null);
  }, [setSelectedCarrozado]);

  const handleCarrozadoDefault = async (carrozadoId: string) => {
    resetForm();
    setValue("tipo_carrozado_id", carrozadoId);
    // Si no hay carrozadoId, limpiar selectedCarrozado
    if (!carrozadoId) {
      setSelectedCarrozado(null);
      return;
    }
    try {
      openModal("LOADING", { message: "Cargando parámetros del carrozado..." });
      setIsLoading(true);
      await getCarrozadoByID(carrozadoId);
    } finally {
      closeModal();
      setIsLoading(false);
    }
  };

  useEffect(() => {    
    if (!selectedCarrozado) return;
    setIsLoading(true);
    for (const item of selectedCarrozado) {
      const { atributo, valor, tipo } = item;
      setValue(atributo as any, valor);
      const elements = document.getElementsByName(atributo);
      elements.forEach((el) => {
        (el as HTMLInputElement | HTMLSelectElement).disabled = tipo === "fijo";
      });
    }
    setIsLoading(false);
  }, [selectedCarrozado, setValue, setIsLoading]);

  const handleChangeBoquillasField = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedBoquillas = e.target.value;
    if (selectedBoquillas === "N/A") {
      setValue("boquillas", 0);
    }
  };
  const handleChangeCajonField = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCajon = e.target.value;
    if (selectedCajon === "N/A") {
      setValue("med_cajon_herramientas", 0);
    }
  };
  const handleToggleAlargue1 = (checked: boolean) => {
    setValue("alargue_tipo_1", checked ? "baranda a cumbrera" : "N/A", {shouldDirty: true});
  };
  const handleToggleAlargue2 = (checked: boolean) => {
    setValue("alargue_tipo_2", checked ? "sobre cumbrera" : "N/A", {shouldDirty: true});
  };
  if (isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingComponent content="Cargando parametros..." />
        </div>
      </div>
    );
  }
  
  return (
    <>
      {!isLoadingData && (
        <>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <CardToggle title="Accessorios">
              <fieldset className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-end">
                <Select
                  label="Tipos de boquillas"
                  {...register("tipo_boquillas", {
                    onChange: handleChangeBoquillasField,
                    required: "Este campo es obligatorio",
                  })}
                  error={errors.tipo_boquillas?.message}
                  requiredField
                >
                  <option value="" disabled>
                    Sin selección
                  </option>
                  {tiposBoquillasOptions.map((boquilla) => (
                    <option key={boquilla.value} value={boquilla.value}>
                      {boquilla.label}
                    </option>
                  ))}
                </Select>
                <InputWithIcon
                  type="number"
                  label="Cantidad de boquillas"
                  {...register("boquillas", {
                    required: "Este campo es obligatorio",
                    min: {
                      value: watch("tipo_boquillas") !== "N/A" ? 0.1 : 0,
                      message: "La medida debe ser mayor a 0",
                    },
                  })}
                  requiredField={watch("tipo_boquillas") !== "N/A"}
                  icon={RulerDimensionLine}
                  error={errors.boquillas?.message}
                  disabled={watch("tipo_boquillas") === "N/A"}
                />
                <Select
                  label="Ubic. cajón de herramientas"
                  {...register("ubicacion_cajon_herramientas", {
                    onChange: handleChangeCajonField,
                    required: "Este campo es obligatorio",
                  })}
                  error={errors.ubicacion_cajon_herramientas?.message}
                  requiredField
                >
                  <option value="" disabled>
                    Sin selección
                  </option>
                  {ubicacionOptions.map((ubicacion) => (
                    <option key={ubicacion.value} value={ubicacion.value}>
                      {ubicacion.label}
                    </option>
                  ))}
                </Select>
                <InputWithIcon
                  type="number"
                  label="Medida cajón de herramientas"
                  {...register("med_cajon_herramientas", {
                    required: "Este campo es obligatorio",
                    min: {
                      value:
                        watch("ubicacion_cajon_herramientas") !== "N/A"
                          ? 0.1
                          : 0,
                      message: "La medida debe ser mayor a 0",
                    },
                  })}
                  icon={RulerDimensionLine}
                  error={errors.med_cajon_herramientas?.message}
                  disabled={
                    watch("ubicacion_cajon_herramientas") === "N/A" ||
                    watch("ubicacion_cajon_herramientas") === undefined
                  }
                  requiredField
                />

                <InputWithIcon
                  type="number"
                  label="Cantidad de luces"
                  {...register("luces")}
                  icon={RulerDimensionLine}
                  error={errors.luces?.message}
                />
                <Select
                  label="Cintas reflectivas"
                  {...register("cintas_reflectivas")}
                  error={errors.cintas_reflectivas?.message}
                >
                  <option value="">Sin selección</option>
                  {cintasOptions.map((cinta) => (
                    <option key={cinta.value} value={cinta.value}>
                      {cinta.label}
                    </option>
                  ))}
                </Select>
                <ToggleCheckbox
                  id="guardabarros"
                  label="Guardabarros"
                  checked={watch("guardabarros")}
                  onChange={(checked) => setValue("guardabarros", checked)}
                />
                <ToggleCheckbox
                  id="dep_agua"
                  label="Depósito de agua"
                  checked={watch("dep_agua")}
                  onChange={(checked) => {
                    setValue("dep_agua", checked);
                    setValue("ubicacion_dep_agua", checked ? "" : "N/A");
                  }}
                />
                <Select
                  label="Ubic. depósito de agua"
                  {...register("ubicacion_dep_agua", {
                    required: "Este campo es obligatorio",
                  })}
                  error={errors.ubicacion_dep_agua?.message}
                  disabled={!watch("dep_agua")}
                  requiredField={watch("dep_agua")}
                >
                  <option value="" disabled>
                    Sin selección
                  </option>
                  {ubicacionOptions.map((ubicacion) => (
                    <option key={ubicacion.value} value={ubicacion.value}>
                      {ubicacion.label}
                    </option>
                  ))}
                </Select>
              </fieldset>
            </CardToggle>
            <CardToggle title="Alargues">
              <fieldset className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <ToggleCheckbox
                  id="alargue_tipo_1"
                  label="Baranda a Cumbrera"
                  checked={
                    watch("alargue_tipo_1") !== "N/A" &&
                    watch("alargue_tipo_1") !== ""
                  }
                  onChange={(checked) => handleToggleAlargue1(checked)}
                />
                <InputWithIcon
                  disabled={
                    watch("alargue_tipo_1") === "N/A" ||
                    watch("alargue_tipo_1") === "" || undefined
                  }
                  type="number"
                  label="Cantidad"
                  {...register("cant_alargue_1", {
                    min: {
                      value: watch("alargue_tipo_1") !== "N/A" ? 0.1 : 0,
                      message: "La medida debe ser mayor a 0",
                    },
                    required:
                      watch("alargue_tipo_1") !== "N/A"
                        ? "Este campo es obligatorio"
                        : false,
                  })}
                  requiredField={watch("alargue_tipo_1") !== "N/A"}
                  icon={RulerDimensionLine}
                  error={errors.cant_alargue_1?.message}
                />
                <InputWithIcon
                  disabled={
                    watch("alargue_tipo_1") === "N/A" ||
                    watch("alargue_tipo_1") === ""
                  }
                  type="number"
                  label="Medida"
                  {...register("med_alargue_1", {
                    min: {
                      value: watch("alargue_tipo_1") !== "N/A" ? 0.1 : 0,
                      message: "La medida debe ser mayor a 0",
                    },
                    required:
                      watch("alargue_tipo_1") !== "N/A"
                        ? "Este campo es obligatorio"
                        : false,
                  })}
                  requiredField={watch("alargue_tipo_1") !== "N/A"}
                  icon={RulerDimensionLine}
                  error={errors.med_alargue_1?.message}
                />
                <ToggleCheckbox
                  id="quiebre_alargue_1"
                  label="Quiebre en alargue"
                  checked={watch("quiebre_alargue_1")}
                  onChange={(checked) => setValue("quiebre_alargue_1", checked)}
                />
                <ToggleCheckbox
                  id="alargue_tipo_2"
                  label="Sobre Cumbrera"
                  checked={
                    watch("alargue_tipo_2") !== "N/A" &&
                    watch("alargue_tipo_2") !== ""
                  }
                  onChange={(checked) => handleToggleAlargue2(checked)}
                />
                <InputWithIcon
                  disabled={
                    watch("alargue_tipo_2") === "N/A" ||
                    watch("alargue_tipo_2") === ""
                  }
                  type="number"
                  label="Cantidad"
                  {...register("cant_alargue_2", {
                    min: {
                      value: watch("alargue_tipo_2") !== "N/A" ? 0.1 : 0,
                      message: "La medida debe ser mayor a 0",
                    },
                    required:
                      watch("alargue_tipo_2") !== "N/A"
                        ? "Este campo es obligatorio"
                        : false,
                  })}
                  requiredField={watch("alargue_tipo_2") !== "N/A"}
                  icon={RulerDimensionLine}
                  error={errors.cant_alargue_2?.message}
                />
                <InputWithIcon
                  disabled={
                    watch("alargue_tipo_2") === "N/A" ||
                    watch("alargue_tipo_2") === ""
                  }
                  type="number"
                  label="Medida"
                  {...register("med_alargue_2", {
                    min: {
                      value: watch("alargue_tipo_2") !== "N/A" ? 0.1 : 0,
                      message: "La medida debe ser mayor a 0",
                    },
                    required:
                      watch("alargue_tipo_2") !== "N/A"
                        ? "Este campo es obligatorio"
                        : false,
                  })}
                  requiredField={watch("alargue_tipo_2") !== "N/A"}
                  icon={RulerDimensionLine}
                  error={errors.med_alargue_2?.message}
                />
                <ToggleCheckbox
                  id="quiebre_alargue_2"
                  label="Quiebre en alargue"
                  checked={watch("quiebre_alargue_2")}
                  onChange={(checked) => setValue("quiebre_alargue_2", checked)}
                />
              </fieldset>
            </CardToggle>
            <FooterForm>
              <Button
                type="submit"
                variant="blue"
                disabled={isLoading || isLoadingData}
              >
                {isLoading ? "Guardando..." : submitButtonText}
              </Button>
            </FooterForm>
          </form>
        </>
      )}
    </>
  );
}
