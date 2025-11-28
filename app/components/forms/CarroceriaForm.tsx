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
  espesorOptions,
  lineasRefOptions,
  pisoOptions,
  cintasOptions,
  zocaloOptions,
} from "~/config/atributosMetadata";
import { useEffect } from "react";
import { useUIModals } from "~/context/ModalsContext";

export default function CarroceriaForm() {
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
  } = useCarroceriaForm();

  // Reset selectedCarrozado al montar el componente
  useEffect(() => {
    setSelectedCarrozado(null);
  }, [setSelectedCarrozado]);

  const handleCarrozadoDefault = async (carrozadoId: string) => {
    console.log("Selected Carrozado ID:", carrozadoId);

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
    if (selectedCarrozado && selectedCarrozado.length > 0) {
      setIsLoading(true);
      selectedCarrozado.forEach((item) => {
        const { atributo, valor } = item;
        console.log(`Setting ${atributo} to ${valor}`);
        setValue(atributo as any, valor);
      });
      setIsLoading(false);
    }
  }, [selectedCarrozado, setValue, setIsLoading]);
  const handleChangeMaterialField = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedMaterial = e.target.value;
    if (selectedMaterial === "fibra") {
      setValue("espesor_chapa", "0");
    }
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
            <CardToggle title="Detalle de carrocería">
              <fieldset className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-end">
                <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-2">
                  <Select
                    requiredField
                    label="Carrozado"
                    {...register("tipo_carrozado_id", {
                      required: "Este campo es obligatorio",
                      onChange: (e) => {
                        handleCarrozadoDefault(e.target.value);
                      },
                    })}
                    error={errors.tipo_carrozado_id?.message}
                  >
                    <option value="">Sin selección</option>
                    {carrozados?.map((carrozado) => (
                      <option key={carrozado.id} value={carrozado.id}>
                        {carrozado.nombre}
                      </option>
                    ))}
                  </Select>
                </div>
                <Select
                  label="Material"
                  {...register("material", {
                    required: "Este campo es obligatorio",
                    onChange: handleChangeMaterialField,
                  })}
                  requiredField
                  error={errors.material?.message}
                >
                  <option value="">Sin selección</option>
                  {materialOptions.map((material) => (
                    <option key={material.value} value={material.value}>
                      {material.label}
                    </option>
                  ))}
                </Select>
                <Select
                  label="Espesor chapa"
                  {...register("espesor_chapa", {
                    required: "Este campo es obligatorio",
                  })}
                  requiredField
                  error={errors.espesor_chapa?.message}
                  disabled={watch("material") === "fibra"}
                >
                  <option value={0}>No aplica</option>
                  {espesorOptions.map((espesor) => (
                    <option key={espesor.value} value={espesor.value}>
                      {espesor.label}
                    </option>
                  ))}
                </Select>
                  <InputWithIcon
                    type="number"
                    label="Largo int"
                    {...register("largo_int", {
                      required: "Este campo es obligatorio",
                    })}
                    icon={RulerDimensionLine}
                    error={errors.largo_int?.message}
                    requiredField
                  />
                  
                <InputWithIcon
                  type="number"
                  label="Largo ext"
                  {...register("largo_ext", {
                    required: "Este campo es obligatorio",
                  })}
                  icon={RulerDimensionLine}
                  requiredField
                  error={errors.largo_ext?.message}
                />

                <Select
                  label="Ancho"
                  {...register("ancho_ext", {
                    required: "Este campo es obligatorio",
                  })}
                  requiredField
                  error={errors.ancho_ext?.message}
                >
                  <option value="">Sin selección</option>
                  {anchoOptions.map((ancho) => (
                    <option key={ancho.value} value={ancho.value}>
                      {ancho.label}
                    </option>
                  ))}
                </Select>
                <InputWithIcon
                  type="number"
                  label="Alto"
                  {...register("alto", {
                    required: "Este campo es obligatorio",
                  })}
                  icon={RulerDimensionLine}
                  requiredField
                  error={errors.alto?.message}
                />
                <InputWithIcon
                  type="number"
                  label="Alt. baranda"
                  {...register("alt_baranda", {
                    required: "Este campo es obligatorio",
                  })}
                  icon={RulerDimensionLine}
                  requiredField
                  error={errors.alt_baranda?.message}
                />
                <InputWithIcon
                  type="number"
                  label="Ptas. por lado"
                  {...register("ptas_por_lado", {
                    required: "Este campo es obligatorio",
                  })}
                  icon={RulerDimensionLine}
                  requiredField
                  error={errors.ptas_por_lado?.message}
                />
                <Select
                  label="Arcos por puerta"
                  {...register("arcos_por_puerta")}
                  error={errors.arcos_por_puerta?.message}
                >
                  <option value="">Sin selección</option>
                  {arcosOptions.map((arco) => (
                    <option key={arco.value} value={arco.value}>
                      {arco.label}
                    </option>
                  ))}
                </Select>
                <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-2">
                  <Select
                    label="Puerta trasera"
                    {...register("puerta_trasera_id", {
                      required: "Este campo es obligatorio",
                    })}
                    requiredField
                    error={errors.puerta_trasera_id?.message}
                  >
                    <option value="">Sin selección</option>
                    {puertasTraseras?.map((puerta) => (
                      <option key={puerta.id} value={puerta.id}>
                        {puerta.nombre}
                      </option>
                    ))}
                  </Select>
                </div>
                <ToggleCheckbox
                  id="corte_guardabarros"
                  label="Corte guardabarros"
                  checked={watch("corte_guardabarros")}
                  onChange={(checked) =>
                    setValue("corte_guardabarros", checked)
                  }
                  requiredField
                  error={errors.corte_guardabarros?.message}
                />
                <ToggleCheckbox
                  id="Cumbreras"
                  label="Cumbreras"
                  checked={watch("cumbreras")}
                  onChange={(checked) => setValue("cumbreras", checked)}
                  requiredField
                  error={errors.cumbreras?.message}
                />
                <Select
                  label="Líneas de refuerzo"
                  {...register("lineas_refuerzo", {
                    required: "Este campo es obligatorio",
                    valueAsNumber: true,
                  })}
                  requiredField
                  error={errors.lineas_refuerzo?.message}
                >
                  <option value="">Sin selección</option>
                  {lineasRefOptions.map((linea) => (
                    <option key={linea.value} value={linea.value}>
                      {linea.label}
                    </option>
                  ))}
                </Select>
                <Select
                  label="Tipo zócalo"
                  {...register("tipo_zocalo", {
                    required: "Este campo es obligatorio",
                  })}
                  requiredField
                  error={errors.tipo_zocalo?.message}
                >
                  <option value="">Sin selección</option>
                  {zocaloOptions.map((zocalo) => (
                    <option key={zocalo.value} value={zocalo.value}>
                      {zocalo.label}
                    </option>
                  ))}
                </Select>
                <Select
                  label="Tipo piso"
                  {...register("tipo_piso", {
                    required: "Este campo es obligatorio",
                  })}
                  requiredField
                  error={errors.tipo_piso?.message}
                >
                  <option value="">Sin selección</option>
                  {pisoOptions.map((piso) => (
                    <option key={piso.value} value={piso.value}>
                      {piso.label}
                    </option>
                  ))}
                </Select>
              </fieldset>
            </CardToggle>
            <CardToggle title="Colores">
              <fieldset className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Select
                  label="Color carrozado"
                  {...register("color_carrozado_id", {
                    required: "Este campo es obligatorio",
                  })}
                  requiredField
                  error={errors.color_carrozado_id?.message}
                >
                  <option value="">Sin selección</option>
                  {colores
                    ?.filter((item) => item.tipo === "esmalte")
                    .map((color) => (
                      <option key={color.id} value={color.id}>
                        {color.nombre}
                      </option>
                    ))}
                </Select>
                <Select
                  label="Color zócalo"
                  {...register("color_zocalo_id", {
                    required: "Este campo es obligatorio",
                  })}
                  requiredField
                  error={errors.color_zocalo_id?.message}
                >
                  <option value="">Sin selección</option>
                  {colores
                    ?.filter((item) => item.tipo === "esmalte")
                    .map((color) => (
                      <option key={color.id} value={color.id}>
                        {color.nombre}
                      </option>
                    ))}
                </Select>
                <Select
                  label="Color lona"
                  {...register("color_lona_id")}
                  error={errors.color_lona_id?.message}
                >
                  <option value="">Sin selección</option>
                  {colores
                    ?.filter((item) => item.tipo === "lona")
                    .map((color) => (
                      <option key={color.id} value={color.id}>
                        {color.nombre}
                      </option>
                    ))}
                </Select>
                <div className="col-span-1 md:col-span-2 lg:col-span-3">
                  <Textarea
                    label="Observaciones del color"
                    placeholder="Agregue notas u observaciones del color adiconales si son necesarias"
                    {...register("notas_color")}
                  />
                </div>
              </fieldset>
            </CardToggle>
            <CardToggle title="Cuchetín">
              <fieldset className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <ToggleCheckbox
                  id="cuchetin"
                  label="Cuchetín"
                  checked={watch("cuchetin")}
                  onChange={(checked) => setValue("cuchetin", checked)}
                />
                <InputWithIcon
                  disabled={!watch("cuchetin")}
                  type="number"
                  label="Medida cuchetín (mm)"
                  {...register("med_cuchetin", {
                    required: "Este campo es obligatorio",
                  })}
                  icon={RulerDimensionLine}
                  requiredField
                  error={errors.med_cuchetin?.message}
                />
                <InputWithIcon
                  disabled={!watch("cuchetin")}
                  type="number"
                  label="Altura puerta cuchetín (mm)"
                  {...register("alt_pta_cuchetin", {
                    required: "Este campo es obligatorio",
                  })}
                  icon={RulerDimensionLine}
                  requiredField
                  error={errors.alt_pta_cuchetin?.message}
                />
                <InputWithIcon
                  disabled={!watch("cuchetin")}
                  type="number"
                  label="Altura techo cuchetín (mm)"
                  {...register("alt_techo_cuchetin", {
                    required: "Este campo es obligatorio",
                  })}
                  icon={RulerDimensionLine}
                  requiredField
                  error={errors.alt_techo_cuchetin?.message}
                />
                <div className="col-span-4">
                  <Textarea
                    disabled={!watch("cuchetin")}
                    label="Observaciones cuchetín"
                    placeholder="Agregue notas u observaciones para el cuchetpin si son necesarias"
                    {...register("notas_cuchetin")}
                    rows={2}
                  />
                </div>
              </fieldset>
            </CardToggle>
            <CardToggle title="Accessorios">
              <fieldset className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-end">
                <InputWithIcon
                  type="number"
                  label="Cantidad de boquillas"
                  {...register("boquillas")}
                  icon={RulerDimensionLine}
                  error={errors.boquillas?.message}
                />
                <InputWithIcon
                  type="number"
                  label="Medida cajón de herramientas"
                  {...register("med_cajon_herramientas")}
                  icon={RulerDimensionLine}
                  error={errors.med_cajon_herramientas?.message}
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
                  onChange={(checked) => setValue("dep_agua", checked)}
                />

                <InputWithIcon
                  type="number"
                  label="Medida alargue (mm)"
                  {...register("med_alargue")}
                  icon={RulerDimensionLine}
                  error={errors.med_alargue?.message}
                />
                <ToggleCheckbox
                  id="quiebre_alargue"
                  label="Quiebre en alargue"
                  checked={watch("quiebre_alargue")}
                  onChange={(checked) => setValue("quiebre_alargue", checked)}
                />
              </fieldset>
            </CardToggle>
            <Textarea label="Observaciones" {...register("observaciones")} />
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
