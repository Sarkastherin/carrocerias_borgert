import ModalBase from "../ModalBase";
import { Input, Select, Textarea } from "~/components/Inputs";
import { Button } from "~/components/Buttons";
import { useForm } from "react-hook-form";
import { useState, useEffect, useMemo, useCallback } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";
import type { ConfigField } from "~/config/settingsConfigCarrozado";

type Field = ConfigField;

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
  const { register, handleSubmit, reset, watch, getValues } = useForm({
    defaultValues: data || {},
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dynamicFields, setDynamicFields] = useState<Record<string, Field>>({});

  // Función para actualizar campos dinámicos cuando cambia un campo dependiente
  const updateDynamicField = useCallback((fieldName: string, value: any) => {
    const dependentField = fields.find(f => f.type === "dynamic" && f.dependsOn === fieldName);
    if (dependentField && dependentField.getDynamicConfig) {
      const dynamicConfig = dependentField.getDynamicConfig(value);
      setDynamicFields(prev => ({
        ...prev,
        [dependentField.name]: {
          ...dependentField,
          ...dynamicConfig,
        }
      }));
    }
  }, [fields]);

  // Inicializar campos dinámicos
  useEffect(() => {
    const initialDynamicFields: Record<string, Field> = {};
    
    fields.forEach(field => {
      if (field.type === "dynamic") {
        initialDynamicFields[field.name] = {
          ...field,
          type: "text", // Fallback inicial
        };
      }
    });
    
    setDynamicFields(initialDynamicFields);
  }, [fields]);

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
          {fields.map((f) => {
            // Si es un campo dinámico, usar la configuración dinámica
            const fieldConfig = f.type === "dynamic" && dynamicFields[f.name] ? dynamicFields[f.name] : f;
            
            return (
              <div key={f.name}>
                {fieldConfig.type === "text" && (
                  <Input
                    label={fieldConfig.label}
                    placeholder={fieldConfig.placeholder}
                    {...register(f.name, { required: fieldConfig.required })}
                  />
                )}

                {fieldConfig.type === "number" && (
                  <Input
                    type="number"
                    label={fieldConfig.label}
                    placeholder={fieldConfig.placeholder}
                    {...register(f.name, { 
                      required: fieldConfig.required,
                      min: fieldConfig.min,
                      max: fieldConfig.max,
                      valueAsNumber: true,
                    })}
                  />
                )}

                {fieldConfig.type === "boolean" && (
                  <label className="inline-flex gap-2 text-sm items-center">
                    <input type="checkbox" {...register(f.name)} />
                    {fieldConfig.label}
                  </label>
                )}

                {fieldConfig.type === "select" && (
                  <>
                    <Select
                      label={fieldConfig.label}
                      {...register(f.name, { 
                        required: fieldConfig.required,
                        onChange: (e) => {
                          // Si este campo es dependencia de algún campo dinámico, actualizarlo
                          updateDynamicField(f.name, e.target.value);
                        }
                      })}
                      defaultValue=""
                    >
                      <option value="">— Seleccionar —</option>
                      {fieldConfig.options?.map((opt) => (
                        <option key={String(opt.value)} value={String(opt.value)}>
                          {opt.label}
                        </option>
                      ))}
                    </Select>
                  </>
                )}
                
                {fieldConfig.type === "textarea" && (
                  <Textarea
                    label={fieldConfig.label}
                    placeholder={fieldConfig.placeholder}
                    {...register(f.name, { required: fieldConfig.required })}
                  />
                )}

                {fieldConfig.type === "dynamic" && !dynamicFields[f.name] && (
                  <div className="text-gray-400 text-sm p-2 border border-dashed border-gray-300 rounded">
                    {fieldConfig.dependsOn ? 
                      `Selecciona ${fields.find(field => field.name === fieldConfig.dependsOn)?.label || fieldConfig.dependsOn} para configurar este campo` : 
                      'Campo dinámico no configurado'
                    }
                  </div>
                )}
              </div>
            );
          })}
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
