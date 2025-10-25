import {
  Input,
  Textarea,
  Select,
  ToggleCheckbox,
  InputWithIIcon,
} from "../Inputs";
import { Button } from "../Buttons";
import { useCarroceriaForm } from "~/hooks/useCarroceriaForm";
import { CardToggle } from "../CardToggle";
import { useData } from "~/context/DataContext";
import { useEffect } from "react";
import { useUIModals } from "~/context/ModalsContext";
import { RulerDimensionLine } from "lucide-react";
import { FooterForm } from "./Footer";

export default function CarroceriaForm() {
  const { clientes, getClientes } = useData();
  const { openModal, closeModal } = useUIModals();
  useEffect(() => {
    if (!clientes) {
      getClientes();
    }
  }, []);
  const {
    register,
    handleSubmit,
    formState: { errors },
    onSubmit,
    isLoading,
    submitButtonText,
    watch,
    setValue,
    isEditMode,
  } = useCarroceriaForm();
  return (
    <>
      {clientes && (
        <>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <CardToggle title="Detalle de carrocería">
              <fieldset className="grid grid-cols-5 gap-4 items-end">
                <div className="col-span-3">
                  <Select
                    label="Carrozado"
                    {...register("tipo_carrozado", {
                      required: "Este campo es obligatorio",
                    })}
                  >
                    <option value="">Tipo de Carrozado</option>
                    <option value="furgon">Furgón</option>
                  </Select>
                </div>
                <Select
                  label="Material"
                  {...register("material", {
                    required: "Este campo es obligatorio",
                  })}
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
                >
                  <option value="">Seleccione una opción</option>
                  <option value="3.2">3.2 mm</option>
                  <option value="2.9">2.9 mm</option>
                  <option value="2.6">2.6 mm</option>
                  <option value="2.2">2.2 mm</option>
                </Select>

                <InputWithIIcon
                  type="number"
                  label="Largo int"
                  {...register("largo_int", {
                    required: "Este campo es obligatorio",
                  })}
                  icon={<RulerDimensionLine className="w-4 h-4" />}
                />
                <InputWithIIcon
                  type="number"
                  label="Largo ext"
                  {...register("largo_ext", {
                    required: "Este campo es obligatorio",
                  })}
                  icon={<RulerDimensionLine className="w-4 h-4" />}
                />

                <Select
                  label="Ancho"
                  {...register("ancho_ext", {
                    required: "Este campo es obligatorio",
                  })}
                >
                  <option value="">Ancho ext</option>
                  <option value="2000">2000 mm</option>
                  <option value="2200">2200 mm</option>
                  <option value="2300">2300 mm</option>
                  <option value="2400">2400 mm</option>
                  <option value="2600">2600 mm</option>
                </Select>
                <InputWithIIcon
                  type="number"
                  label="Alto"
                  {...register("alto", {
                    required: "Este campo es obligatorio",
                  })}
                  icon={<RulerDimensionLine className="w-4 h-4" />}
                />
                <InputWithIIcon
                  type="number"
                  label="Alt. baranda"
                  {...register("alt_baranda", {
                    required: "Este campo es obligatorio",
                  })}
                  icon={<RulerDimensionLine className="w-4 h-4" />}
                />
                <InputWithIIcon
                  type="number"
                  label="Ptas. por lado"
                  {...register("ptas_por_lado", {
                    required: "Este campo es obligatorio",
                  })}
                  icon={<RulerDimensionLine className="w-4 h-4" />}
                />
                <InputWithIIcon
                  type="number"
                  label="Arcos por puerta"
                  {...register("arcos_por_puerta", {
                    required: "Este campo es obligatorio",
                  })}
                  icon={<RulerDimensionLine className="w-4 h-4" />}
                />
                <div className="col-span-3">
                  <Select
                    label="Puerta trasera"
                    {...register("puerta_trasera", {
                      required: "Este campo es obligatorio",
                    })}
                  >
                    <option value="">Seleccione una opción</option>
                    <option value="batiente">Batiente</option>
                  </Select>
                </div>
                <ToggleCheckbox
                  id="corte_guardabarros"
                  label="Corte guardabarros"
                  checked={watch("corte_guardabarros")}
                  onChange={(checked) =>
                    setValue("corte_guardabarros", checked)
                  }
                />
                <ToggleCheckbox
                  id="Cumbreras"
                  label="Cumbreras"
                  checked={watch("cumbreras")}
                  onChange={(checked) => setValue("cumbreras", checked)}
                />
                <Select
                  label="Líneas de refuerzo"
                  {...register("lineas_refuerzo", {
                    required: "Este campo es obligatorio",
                    valueAsNumber: true,
                  })}
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
                >
                  <option value="">Tipo de zócalo</option>
                  <option value="recto">Recto</option>
                  <option value="gross_viejo">Gross viejo</option>
                </Select>
                <Select
                  label="Tipo piso"
                  {...register("tipo_piso", {
                    required: "Este campo es obligatorio",
                  })}
                >
                  <option value="">Tipo de piso</option>
                  <option value="liso">Liso</option>
                  <option value="semillado">Semillado</option>
                </Select>
              </fieldset>
            </CardToggle>
            <CardToggle title="Colores">
              <fieldset className="grid grid-cols-3 gap-4">
                <Select
                  label="Color lona"
                  {...register("color_lona", {
                    required: "Este campo es obligatorio",
                  })}
                >
                  <option value="">Seleccione una opción</option>
                  <option value="color1">Color 1</option>
                  <option value="color2">Color 2</option>
                  <option value="color3">Color 3</option>
                </Select>
                <Select
                  label="Color carrozado"
                  {...register("color_carrozado", {
                    required: "Este campo es obligatorio",
                  })}
                >
                  <option value="">Seleccione una opción</option>
                  <option value="color1">Color 1</option>
                  <option value="color2">Color 2</option>
                  <option value="color3">Color 3</option>
                </Select>
                <Select
                  label="Color zócalo"
                  {...register("color_zocalo", {
                    required: "Este campo es obligatorio",
                  })}
                >
                  <option value="">Seleccione una opción</option>
                  <option value="color1">Color 1</option>
                  <option value="color2">Color 2</option>
                  <option value="color3">Color 3</option>
                </Select>
                <div className="col-span-3">
                  <Textarea
                    label="Observaciones del color"
                    {...register("notas_color")}
                  />
                </div>
              </fieldset>
            </CardToggle>
            <CardToggle title="Cuchetín">
              <fieldset className="grid grid-cols-4 gap-4 items-end">
                <ToggleCheckbox
                  id="cuchetin"
                  label="Cuchetín"
                  checked={watch("cuchetin")}
                  onChange={(checked) => setValue("cuchetin", checked)}
                />
                <InputWithIIcon
                  disabled={!watch("cuchetin")}
                  type="number"
                  label="Medida cuchetín (mm)"
                  {...register("med_cuchetin", {
                    required: "Este campo es obligatorio",
                  })}
                  icon={<RulerDimensionLine className="w-4 h-4" />}
                />
                <InputWithIIcon
                  disabled={!watch("cuchetin")}
                  type="number"
                  label="Altura puerta cuchetín (mm)"
                  {...register("alt_pta_cuchetin", {
                    required: "Este campo es obligatorio",
                  })}
                  icon={<RulerDimensionLine className="w-4 h-4" />}
                />
                <InputWithIIcon
                  disabled={!watch("cuchetin")}
                  type="number"
                  label="Altura techo cuchetín (mm)"
                  {...register("alt_techo_cuchetin", {
                    required: "Este campo es obligatorio",
                  })}
                  icon={<RulerDimensionLine className="w-4 h-4" />}
                />
              </fieldset>
            </CardToggle>
            <CardToggle title="Accessorios">
              <fieldset className="grid grid-cols-4 gap-4 items-end">
                <InputWithIIcon
                  type="number"
                  label="Cantidad de boquillas"
                  {...register("boquillas", {
                    required: "Este campo es obligatorio",
                  })}
                  icon={<RulerDimensionLine className="w-4 h-4" />}
                />
                <InputWithIIcon
                  type="number"
                  label="Medida cajón de herramientas"
                  {...register("med_cajon_herramientas", {
                    required: "Este campo es obligatorio",
                  })}
                  icon={<RulerDimensionLine className="w-4 h-4" />}
                />
                <InputWithIIcon
                  type="number"
                  label="Cantidad de luces"
                  {...register("luces", {
                    required: "Este campo es obligatorio",
                  })}
                  icon={<RulerDimensionLine className="w-4 h-4" />}
                />
                <Select
                  label="Cintas reflectivas"
                  {...register("cintas_reflectivas", {
                    required: "Este campo es obligatorio",
                  })}
                >
                  <option value="">Seleccione una opción</option>
                  <option value="nacionales">Nacionales</option>
                  <option value="importados">Importados</option>
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

                <InputWithIIcon
                  type="number"
                  label="Medida alargue (mm)"
                  {...register("med_alargue", {
                    required: "Este campo es obligatorio",
                  })}
                  icon={<RulerDimensionLine className="w-4 h-4" />}
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
              <Button type="submit" variant="blue" disabled={isLoading}>
                {isLoading ? "Guardando..." : submitButtonText}
              </Button>
            </FooterForm>
          </form>
        </>
      )}
    </>
  );
}
