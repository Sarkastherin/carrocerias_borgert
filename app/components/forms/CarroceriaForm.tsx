import { Textarea, Select, ToggleCheckbox, InputWithIcon } from "../Inputs";
import { Button } from "../Buttons";
import { useCarroceriaForm } from "~/hooks/useCarroceriaForm";
import { CardToggle } from "../CardToggle";
import { useData } from "~/context/DataContext";
import { RulerDimensionLine } from "lucide-react";
import { useDataLoader } from "~/hooks/useDataLoader";
import { FooterForm } from "./Footer";
import LoadingComponent from "../LoadingComponent";

export default function CarroceriaForm() {
  const {
    colores,
    getColores,
    carrozados,
    getCarrozados,
    puertasTraseras,
    getPuertasTraseras,
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
    watch,
    setValue,
  } = useCarroceriaForm();
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
                    })}
                    error={errors.tipo_carrozado_id?.message}
                  >
                    <option value="">Tipo de Carrozado</option>
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
                  })}
                  requiredField
                  error={errors.material?.message}
                >
                  <option value="">Tipo de material</option>
                  <option value="chapa">Chapa</option>
                  <option value="fibra">Fibra</option>
                </Select>
                <Select
                  label="Espesor chapa"
                  {...register("espesor_chapa", {
                    required: "Este campo es obligatorio",
                  })}
                  requiredField
                  error={errors.espesor_chapa?.message}
                >
                  <option value="">Seleccione una opción</option>
                  <option value="3.2">3.2 mm</option>
                  <option value="2.9">2.9 mm</option>
                  <option value="2.6">2.6 mm</option>
                  <option value="2.2">2.2 mm</option>
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
                  <option value="">Ancho ext</option>
                  <option value="2000">2000 mm</option>
                  <option value="2200">2200 mm</option>
                  <option value="2300">2300 mm</option>
                  <option value="2400">2400 mm</option>
                  <option value="2600">2600 mm</option>
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
                  {...register("arcos_por_puerta", {
                    required: "Este campo es obligatorio",
                  })}
                  requiredField
                  error={errors.arcos_por_puerta?.message}
                >
                  <option value="">Seleccione una opción</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </Select>
                {/* <InputWithIcon
                  type="number"
                  
                  
                  icon={RulerDimensionLine }
                  
                /> */}
                <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-2">
                  <Select
                    label="Puerta trasera"
                    {...register("puerta_trasera_id", {
                      required: "Este campo es obligatorio",
                    })}
                    requiredField
                    error={errors.puerta_trasera_id?.message}
                  >
                    <option value="">Seleccione una opción</option>
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
                  <option value="">Tipo de refuerzo</option>
                  <option value="0">0</option>
                  <option value="3">3</option>
                  <option value="5">5</option>
                </Select>
                <Select
                  label="Tipo zócalo"
                  {...register("tipo_zocalo", {
                    required: "Este campo es obligatorio",
                  })}
                  requiredField
                  error={errors.tipo_zocalo?.message}
                >
                  <option value="">Tipo de zócalo</option>
                  <option value="recto">Recto</option>
                  <option value="gross_viejo">Gross viejo</option>
                  <option value="gross_nuevo">Gross nuevo</option>
                </Select>
                <Select
                  label="Tipo piso"
                  {...register("tipo_piso", {
                    required: "Este campo es obligatorio",
                  })}
                  requiredField
                  error={errors.tipo_piso?.message}
                >
                  <option value="">Tipo de piso</option>
                  <option value="liso">Liso</option>
                  <option value="semillado">Semillado</option>
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
                  <option value="">SColor de Carrozado</option>
                  {colores?.filter((item) => item.tipo === "esmalte").map((color) => (
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
                  <option value="">Color en zócalo</option>
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
                  {...register("color_lona", {
                    required: "Este campo es obligatorio",
                  })}
                  requiredField
                  error={errors.color_lona?.message}
                >
                  <option value="">Color de lona</option>
                  {colores?.filter((item) => item.tipo === "lona").map((color) => (
                    <option key={color.id} value={color.nombre}>
                      {color.nombre}
                    </option>
                  ))}
                </Select>
                <div className="col-span-1 md:col-span-2 lg:col-span-3">
                  <Textarea
                    label="Observaciones del color"
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
              </fieldset>
            </CardToggle>
            <CardToggle title="Accessorios">
              <fieldset className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-end">
                <InputWithIcon
                  type="number"
                  label="Cantidad de boquillas"
                  {...register("boquillas", {
                    required: "Este campo es obligatorio",
                  })}
                  icon={RulerDimensionLine}
                  requiredField
                  error={errors.boquillas?.message}
                />
                <InputWithIcon
                  type="number"
                  label="Medida cajón de herramientas"
                  {...register("med_cajon_herramientas", {
                    required: "Este campo es obligatorio",
                  })}
                  icon={RulerDimensionLine}
                  requiredField
                  error={errors.med_cajon_herramientas?.message}
                />
                <InputWithIcon
                  type="number"
                  label="Cantidad de luces"
                  {...register("luces", {
                    required: "Este campo es obligatorio",
                  })}
                  icon={RulerDimensionLine}
                  requiredField
                  error={errors.luces?.message}
                />
                <Select
                  label="Cintas reflectivas"
                  {...register("cintas_reflectivas", {
                    required: "Este campo es obligatorio",
                  })}
                  requiredField
                  error={errors.cintas_reflectivas?.message}
                >
                  <option value="">Seleccione una opción</option>
                  <option value="nacionales">Nacionales</option>
                  <option value="internacionales">Internacionales</option>
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
                  {...register("med_alargue", {
                    required: "Este campo es obligatorio",
                  })}
                  icon={RulerDimensionLine}
                  requiredField
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
