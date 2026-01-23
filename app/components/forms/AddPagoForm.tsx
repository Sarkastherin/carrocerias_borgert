import { Input, Textarea, Select, CurrencyInput } from "../Inputs";
import { Button } from "../Buttons";
import { useForm } from "react-hook-form";
import { optionsMedioPago } from "~/types/ctas_corrientes";
import type { CtasCorrientesDB } from "~/types/ctas_corrientes";
import { useState } from "react";
import { ctaCorrienteAPI } from "~/backend/sheetServices";
import BancosComponent from "../Bancos";
import LoadingComponent from "../LoadingComponent";
import { CheckCircle, AlertCircle, DollarSign } from "lucide-react";
import { useData } from "~/context/DataContext";
import type { TipoMovimiento } from "../modals/customs/MovimientoModal";

export type AddPagoFormProps = CtasCorrientesDB;

type FormState = "form" | "loading" | "success" | "error";
const variantsTypes: { [key: string]: { filter: string; medio_pago: string } } = {
  efectivo: { filter: "manual", medio_pago: "" },
  carroceria_usada: { filter: "vehiculo", medio_pago: "carroceria_usada" },
  nota_credito: { filter: "otro", medio_pago: "no aplica" },
};

export const AddPagoForm = ({
  clienteId,
  type,
}: {
  clienteId?: string;
  type: TipoMovimiento;
}) => {
  const [formState, setFormState] = useState<FormState>("form");
  const { getCuentasCorrientes, getCuentasCorrientesByClientes } = useData();
  const optionsMedioPagoFiltered = () => {
    const text = variantsTypes[type].filter;
    return optionsMedioPago.filter((op) => op.origen === text);
  };
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<AddPagoFormProps>({
    mode: "onBlur",
    defaultValues: {
      cliente_id: clienteId,
      fecha_movimiento: new Date().toISOString().split("T")[0],
      tipo_movimiento: type === "nota_credito" ? "nota_credito" : "pago",
      origen: "manual",
      debe: 0,
      medio_pago: variantsTypes[type].medio_pago,
    },
  });

  const onSubmit = async (data: AddPagoFormProps) => {
    setFormState("loading");
    try {
      // 1. Crear el movimiento en cuentas corrientes
      const response = await ctaCorrienteAPI.create(data);
      if (!response.success)
        throw new Error("Error creating movimiento in cuenta corriente");
      // 2. Refrescar los datos en el contexto
      await getCuentasCorrientes();
      await getCuentasCorrientesByClientes();
      // 3. Actualizar el estado del formulario a éxito
      setFormState("success");
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormState("error");
    }
  };
  const onError = (errors: any) => {
    console.log("Form errors:", errors);
  };

  return (
    <div className="w-full">
      {/* FORMULARIO PRINCIPAL */}
      {formState === "form" && (
        <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
          {/* Sección 1: Datos del Movimiento */}
          <fieldset className="border border-gray-300 dark:border-gray-600 rounded-lg p-5 bg-white dark:bg-gray-800">
            <legend className="px-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              📅 Información del Movimiento
            </legend>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-end gap-4">
              <Input
                label="Fecha de movimiento"
                type="date"
                {...register("fecha_movimiento", {
                  required: "La fecha es obligatoria",
                })}
                error={errors.fecha_movimiento?.message as string}
                requiredField={true}
              />
              <Select
                label="Medio de pago"
                {...register("medio_pago", {
                  required: "El medio de pago es obligatorio",
                })}
                error={errors.medio_pago?.message as string}
                requiredField={true}
                disabled={type !== "efectivo"}
              >
                <option value="">Seleccionar medio de pago</option>
                {optionsMedioPagoFiltered().map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              <CurrencyInput
                label="Importe del pago"
                placeholder="0.00"
                onChange={(value) => setValue("haber", value || 0)}
                requiredField={true}
                error={errors.haber?.message as string}
                icon={<DollarSign className="w-4 h-4 text-gray-500" />}
              />
              <input
                type="hidden"
                {...register("haber", {
                  required: "El importe es obligatorio",
                  valueAsNumber: true,
                })}
              />
            </div>
          </fieldset>

          {/* Sección 4: Datos Adicionales */}
          <fieldset className="border border-gray-300 dark:border-gray-600 rounded-lg p-5 bg-white dark:bg-gray-800">
            <legend className="px-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              📝 Detalles Adicionales
            </legend>
            <Textarea
              label="Concepto / Detalle del movimiento"
              placeholder="Describa el motivo o concepto del movimiento"
              {...register("concepto", {
                required: {
                  value:
                    watch("medio_pago") === "No aplica" &&
                    watch("tipo_movimiento") === "pago",
                  message:
                    "El concepto es obligatorio cuando el medio de pago sea 'No aplica'",
                },
              })}
              error={errors.concepto?.message as string}
              requiredField={watch("medio_pago") === "No aplica"}
            />
          </fieldset>

          {/* Barra de acciones */}
          <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-300 dark:border-gray-600">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Los campos marcados con <span className="text-red-500">*</span>{" "}
              son obligatorios
            </div>
            <Button
              type="submit"
              variant="blue"
              disabled={isSubmitting}
              className="w-full md:w-auto"
            >
              {isSubmitting ? "Registrando..." : "✓ Registrar Pago"}
            </Button>
          </div>
        </form>
      )}

      {/* ESTADO LOADING */}
      {formState === "loading" && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <LoadingComponent content="Registrando pago..." />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Por favor espere mientras procesamos su solicitud...
          </p>
        </div>
      )}

      {/* ESTADO SUCCESS */}
      {formState === "success" && (
        <div className="space-y-6">
          <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-400 dark:border-green-700 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-green-800 dark:text-green-300 text-lg">
                  ¡Pago registrado exitosamente!
                </h3>
                <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                  El movimiento ha sido guardado en el sistema.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ESTADO ERROR */}
      {formState === "error" && (
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-400 dark:border-red-700 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-800 dark:text-red-300 text-lg">
                Error al registrar el pago
              </h3>
              <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                Ocurrió un problema al procesar su solicitud. Por favor, intente
                nuevamente.
              </p>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <Button
              variant="red"
              onClick={() => setFormState("form")}
              className="w-full md:w-auto"
            >
              Reintentar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
