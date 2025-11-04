import ModalBase from "../ModalBase";
import { Input, Select, Textarea } from "~/components/Inputs";
import { Button } from "~/components/Buttons";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";

type Field = {
  name: string;
  label: string;
  type: "text" | "boolean" | "select" | "textarea";
  required?: boolean;
  options?: { value: string | number; label: string }[];
};

export default function SettingsFormModal({
  title,
  fields,
  onClose,
  onSubmit,
  data,
}: {
  title: string;
  fields: Field[];
  onClose: () => void;
  onSubmit: (
    data: any, 
    helpers: { 
      reset: () => void; 
      setSuccessMessage: (msg: string) => void;
      setErrorMessage: (error: string | { message: string; type?: string; details?: any }) => void;
    }
  ) => Promise<{ success: boolean; keepOpen?: boolean; autoClose?: number } | void>;
  data?: any;
}) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: data || {},
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      setSuccessMessage(""); // Limpiar mensaje anterior
      setErrorMessage(""); // Limpiar mensaje de error anterior
      
      const result = await onSubmit(data, { 
        reset, 
        setSuccessMessage: (msg: string) => {
          setSuccessMessage(msg);
          setErrorMessage(""); // Limpiar errores cuando hay éxito
          // Limpiar el mensaje después de 3 segundos
          setTimeout(() => setSuccessMessage(""), 3000);
        },
        setErrorMessage: (error: string | { message: string; type?: string; details?: any }) => {
          console.error("Error recibido del onSubmit:", error);
          
          // Extraer el mensaje de error según el tipo
          let errorMsg = "";
          if (typeof error === "string") {
            errorMsg = error;
          } else if (error && typeof error === "object" && "message" in error) {
            errorMsg = error.message;
            
            // Si hay detalles adicionales, agregarlos al mensaje
            if (error.details && error.details.invalidColumns) {
              errorMsg += `. Columnas inválidas: ${error.details.invalidColumns.join(", ")}`;
            }
          } else {
            errorMsg = "Error desconocido al procesar la solicitud";
          }
          
          setErrorMessage(errorMsg);
          setSuccessMessage(""); // Limpiar éxitos cuando hay error
          // Limpiar el mensaje después de 5 segundos
          setTimeout(() => setErrorMessage(""), 5000);
        }
      });
      
      // Manejar cierre automático para ediciones
      if (result?.autoClose) {
        setTimeout(() => {
          onClose();
        }, result.autoClose);
        return;
      }
      
      // Si no retorna keepOpen: true, cerrar el modal
      if (!result?.keepOpen) {
        onClose();
      }
    } catch (error) {
      console.error("Error en el formulario:", error);
      // Mostrar el error al usuario
      setErrorMessage(error instanceof Error ? error.message : "Error desconocido al procesar el formulario");
      setSuccessMessage(""); // Limpiar mensajes de éxito
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalBase
      open={true}
      title={title}
      onClose={onClose}
      zIndex={50} // Z-index intermedio para permitir que loading/success se muestren encima
      width="max-w-md"
    >
      <div className="py-4">
        {/* Mensaje de éxito */}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{successMessage}</span>
          </div>
        )}

        {/* Mensaje de error */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{errorMessage}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 ">
          {fields.map((f) => (
            <div key={f.name}>
              {f.type === "text" && (
                <Input
                  label={f.label}
                  {...register(f.name, { required: f.required })}
                />
              )}

              {f.type === "boolean" && (
                <label className="inline-flex gap-2 text-sm items-center">
                  <input type="checkbox" {...register(f.name)} />
                  {f.label}
                </label>
              )}

              {f.type === "select" && (
                <>
                  <Select
                    label={f.label}
                    {...register(f.name, { required: f.required })}
                    defaultValue=""
                  >
                    <option value="">— Seleccionar —</option>
                    {f.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </Select>
                </>
              )}
              {f.type === "textarea" && (
                <Textarea
                  label={f.label}
                  {...register(f.name, { required: f.required })}
                />
              )}
            </div>
          ))}
          <div className="flex justify-end gap-4">
            <Button variant="light" type="button" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </div>
    </ModalBase>
  );
}
