import {
  Input,
  Textarea,
  Select,
  InputWithIcon,
} from "../Inputs";
import { Button } from "../Buttons";
import { useCamionForm } from "~/hooks/useCamionForm";
import { CardToggle } from "../CardToggle";
import { RulerDimensionLine } from "lucide-react";
import { FooterForm } from "./Footer";

export default function CamionForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    onSubmit,
    isLoading,
    submitButtonText,
  } = useCamionForm();
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <CardToggle title="Datos del camión">
        <fieldset className="grid grid-cols-3 gap-4">
          <Select
            label="Marca"
            {...register("marca", {
              required: "Este campo es obligatorio",
            })}
            error={errors.marca?.message}
          >
            <option value="">Marca</option>
            <option value="scania">Scania</option>
            <option value="ford">Ford</option>
            <option value="volvo">Volvo</option>
            <option value="mercedes benz">Mercedes Benz</option>
            <option value="iveco">Iveco</option>
            <option value="volkswagen">Volkswagen</option>
            <option value="otros">Otros</option>
          </Select>
          <Input
            label="Modelo"
            {...register("modelo", {
              required: "Este campo es obligatorio",
            })}
            error={errors.modelo?.message}
          />
          <Input label="Patente" {...register("patente")} />
          <Select
            label="Larguero"
            {...register("tipo_larguero", {
              required: "Este campo es obligatorio",
            })}
          >
            <option value="">Seleccione una opción</option>
            <option value="recto">Recto</option>
            <option value="curvo">Curvo</option>
          </Select>
          <InputWithIcon
            type="number"
            label="Medida Larguero (mm)"
            {...register("med_larguero", {
              required: "Este campo es obligatorio",
            })}
            icon={<RulerDimensionLine className="w-4 h-4" />}
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
  );
}
