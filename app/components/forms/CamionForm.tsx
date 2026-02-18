import { Input, Textarea, Select, InputWithIcon } from "../Inputs";
import { Button } from "../Buttons";
import { useCamionForm } from "~/hooks/useCamionForm";
import { CardToggle } from "../CardToggle";
import { RulerDimensionLine } from "lucide-react";
import { FooterForm } from "./Footer";
import { useState, type ChangeEvent } from "react";
import FilesUploderComponent from "../FileUpladerComponent";
import type { DocumentosBD } from "~/types/pedidos";
import type { FileTypeActions } from "../FileUpladerComponent";

export default function CamionForm() {
  const [files, setFiles] = useState<FileTypeActions<DocumentosBD>>({
    add: null,
    remove: null,
  });
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    onSubmit,
    isLoading,
    submitButtonText,
  } = useCamionForm(files, setFiles);
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <CardToggle title="Datos del camión">
        <fieldset className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Marca"
            {...register("marca", {
              required: "Este campo es obligatorio",
            })}
            error={errors.marca?.message}
            requiredField={true}
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
            placeholder="Ingrese el modelo"
            {...register("modelo", {
              required: "Este campo es obligatorio",
            })}
            error={errors.modelo?.message}
            requiredField={true}
          />
          <Input label="Patente" {...register("patente")} />
          <Select
            label="Larguero"
            {...register("tipo_larguero", {
              required: "Este campo es obligatorio",
            })}
            requiredField={true}
            error={errors.tipo_larguero?.message}
          >
            <option value="">Sin selección</option>
            <option value="recto">Recto</option>
            <option value="curvo">Curvo</option>
          </Select>
          <InputWithIcon
            type="text"
            placeholder="Ingrese un valor"
            label="Medida Larguero (mm)"
            {...register("med_larguero", {
              required: "Este campo es obligatorio",
            })}
            icon={RulerDimensionLine}
            requiredField={true}
            error={errors.med_larguero?.message}
          />
          <InputWithIcon
            type="number"
            placeholder="Ingrese un valor"
            label="Centro de Eje (mm)"
            {...register("centro_eje", {
              required: "Este campo es obligatorio",
            })}
            icon={RulerDimensionLine}
            requiredField={true}
            error={errors.centro_eje?.message}
          />
          <InputWithIcon
            requiredField={true}
            type="number"
            placeholder="Ingrese un valor"
            label="Voladizo Trasero (mm)"
            {...register("voladizo_trasero", {
              required: "Este campo es obligatorio",
            })}
            icon={RulerDimensionLine}
            error={errors.voladizo_trasero?.message}
          />
        </fieldset>
      </CardToggle>

      {watch("marca") === "scania" && (
        <div className="font-bold p-4 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded dark:bg-yellow-200 dark:border-yellow-400 dark:text-yellow-900">
          ⚠️ SCANIA V4x2 – Atención: Requiere modificación de escaleras del lado
          acompañante por interferencia con el tanque.
        </div>
      )}
      <FilesUploderComponent
        tipoDocumento="camion"
        documentos={watch("documentos")}
        setFiles={setFiles}
        files={files}
      />

      <Textarea label="Observaciones" {...register("observaciones")} />
      <FooterForm>
        <Button type="submit" variant="blue" disabled={isLoading}>
          {isLoading ? "Guardando..." : submitButtonText}
        </Button>
      </FooterForm>
    </form>
  );
}
