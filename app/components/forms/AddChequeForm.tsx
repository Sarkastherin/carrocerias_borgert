import { Input, Textarea, Select, CurrencyInput } from "../Inputs";
import { Button } from "../Buttons";
import { useForm, useFieldArray } from "react-hook-form";
import { optionsTipoCheque } from "~/types/ctas_corrientes";
import type { CtasCtesDB, ChequesDB } from "~/types/ctas_corrientes";
import { useState, useMemo } from "react";
import { ctaCorrienteAPI, chequesAPI } from "~/backend/sheetServices";
import { BancosComponentArray } from "../Bancos";
import LoadingComponent from "../LoadingComponent";
import {
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  DollarSign,
} from "lucide-react";
import { useData } from "~/context/DataContext";
import { ButtonLinkAdd } from "../Buttons";
import FileUploderComponent, {
  updateFilePDFCtaCte,
} from "../FileUpladerComponent";

export type AddChequeFormProps = CtasCtesDB & {
  cheques: ChequesDB[];
};

type FormState = "form" | "loading" | "success" | "error";

export const AddChequeForm = ({
  clienteId,
  redirect,
}: {
  clienteId: string;
  redirect: boolean;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [formState, setFormState] = useState<FormState>("form");
  const [successData, setSuccessData] = useState<any>(null);
  const [totalCheques, setTotalCheques] = useState<number>(0);
  const { getCtaCteWithCheques, getCtasCtesByClientes } = useData();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AddChequeFormProps>({
    mode: "onBlur",
    defaultValues: {
      cliente_id: clienteId,
      fecha_movimiento: new Date().toISOString().split("T")[0],
      tipo_movimiento: "pago",
      origen: "cheque",
      debe: 0,
      medio_pago: "cheque",
      cheques: [
        {
          numero: "",
          importe: 0,
          banco: "",
          fecha_cobro: "",
          fecha_ingreso: "",
          observacion: "",
          status: "recibido",
        } as ChequesDB,
      ],
    },
  });

  const { append, remove, fields } = useFieldArray({
    control,
    name: "cheques",
  });

  useState(() => {
    setValue("haber", totalCheques, { shouldDirty: true });
  });

  const handleAddCheque = () => {
    append({
      numero: "",
      tipo: "",
      importe: 0,
      banco: "",
      fecha_cobro: "",
      fecha_ingreso: "",
      observacion: "",
      status: "recibido",
    } as ChequesDB);
  };

  const onSubmit = async (data: AddChequeFormProps) => {
    const { cheques, ...rest } = data;
    if (cheques.length === 0) return;
    setFormState("loading");
    try {
      if (file) {
        const fileLink = await updateFilePDFCtaCte(file);
        data.documento_cta_cte = fileLink;
        setValue("documento_cta_cte", fileLink, { shouldDirty: true });
      }
      // 1. Crear el movimiento en cuentas corrientes
      const resposeMovimiento = await ctaCorrienteAPI.create(rest);
      if (!resposeMovimiento.success)
        throw new Error(resposeMovimiento.message);
      if (resposeMovimiento.data?.id === undefined)
        throw new Error("No se pudo obtener el ID del movimiento");
      const movimientoId = resposeMovimiento.data.id;
      // 2. Crear los cheques asociados al movimiento
      await Promise.all(
        cheques.map(async (cheque) => {
          const responseCheque = await chequesAPI.create({
            ...cheque,
            cta_cte_id: movimientoId,
          });
          if (!responseCheque.success) throw new Error(responseCheque.message);
        }),
      );
      await getCtaCteWithCheques(true);
      await getCtasCtesByClientes();
      setFormState("success");
      setSuccessData({
        numeroCheque: cheques[0].numero,
        importe: data.haber,
        banco: cheques[0].banco,
        fechaCobro: cheques[0].fecha_cobro,
        cantidadCheques: cheques.length,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormState("error");
    }
  };
  const handleImporteChange = (index: number, value: number) => {
    setValue(`cheques.${index}.importe`, Number(value) || 0, {
      shouldDirty: true,
    });
    const cheques = watch("cheques") || [];
    const total = cheques.reduce((sum, cheque) => {
      const importe = typeof cheque.importe === "number" ? cheque.importe : 0;
      return sum + importe;
    }, 0);
    setValue("haber", total, { shouldDirty: true });
    setTotalCheques(total);
  };

  return (
    <div className="w-full">
      {/* FORMULARIO PRINCIPAL */}
      {formState === "form" && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Sección 1: Datos del Movimiento */}
          <fieldset className="border border-gray-300 dark:border-gray-600 rounded-lg p-5 bg-white dark:bg-gray-800">
            <legend className="px-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              📅 Información del Movimiento
            </legend>

            <div className="flex items-end gap-4">
              <Input
                label="Fecha de movimiento"
                type="date"
                {...register("fecha_movimiento", {
                  required: "La fecha es obligatoria",
                })}
                error={errors.fecha_movimiento?.message as string}
                requiredField={true}
              />
              <div className="w-full bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-800 rounded-lg p-2 shadow-lg text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-6 h-6" />
                    <div>
                      <p className="text-xs font-medium opacity-90">
                        Total a pagar
                      </p>
                      <p className="text-2xl font-bold">
                        $
                        {totalCheques.toLocaleString("es-AR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">{fields.length}</p>
                    <p className="text-xs opacity-90">
                      cheque{fields.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </fieldset>

          {/* Sección 2: Lista de Cheques */}
          <div className="border-2 border-blue-300 dark:border-blue-700 rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20 space-y-4">
            <div className="flex items-center justify-between">
              <legend className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                💳 Cheques a registrar
              </legend>
              <div className="w-fit">
                <Button
                  type="button"
                  onClick={handleAddCheque}
                  variant="green"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  Agregar otro cheque
                </Button>
              </div>
            </div>

            {/* Cards de cheques */}
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  {/* Encabezado de card */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="font-bold text-gray-700 dark:text-gray-300 text-sm flex items-center gap-4">
                      #{index + 1}
                      <span>Tipo de Cheque:</span>
                      <Select
                        {...register(`cheques.${index}.tipo`, {
                          required: "Debe seleccionar un tipo",
                        })}
                        error={errors.cheques?.[index]?.tipo?.message as string}
                        requiredField={true}
                      >
                        <option value="">Seleccionar tipo</option>
                        {optionsTipoCheque.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Select>
                    </div>
                    {fields.length > 1 && (
                      <div className="w-fit">
                        <Button
                          type="button"
                          onClick={() => remove(index)}
                          variant="red"
                          size="sm"
                          className="!p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <fieldset
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2"
                    disabled={watch(`cheques.${index}.tipo`) === ""}
                  >
                    <Input
                      label="Fecha de pago"
                      type="date"
                      {...register(`cheques.${index}.fecha_cobro`, {
                        required: "Requerido",
                      })}
                      error={
                        errors.cheques?.[index]?.fecha_cobro?.message as string
                      }
                      requiredField={true}
                    />
                    <BancosComponentArray
                      register={register}
                      errors={errors}
                      watch={watch}
                      index={index}
                    />
                    <Input
                      label="N° Cheque"
                      placeholder="Ej: 123456"
                      {...register(`cheques.${index}.numero`, {
                        required: "Requerido",
                      })}
                      error={errors.cheques?.[index]?.numero?.message as string}
                      requiredField={true}
                    />
                    <CurrencyInput
                      label="Importe"
                      value={watch(`cheques.${index}.importe`) || 0}
                      onChange={(value) =>
                        handleImporteChange(index, value || 0)
                      }
                      error={
                        errors.cheques?.[index]?.importe?.message as string
                      }
                      requiredField={true}
                    />
                    <Input
                      label="Fecha ingreso"
                      type="date"
                      {...register(`cheques.${index}.fecha_ingreso`, {
                        required: "Requerido",
                      })}
                      error={
                        errors.cheques?.[index]?.fecha_ingreso
                          ?.message as string
                      }
                      requiredField={true}
                    />
                    <div className="md:col-span-2 lg:col-span-3">
                      <Textarea
                        label="Observación"
                        placeholder="Notas adicionales sobre este cheque (opcional)"
                        {...register(`cheques.${index}.observacion`)}
                        error={
                          errors.cheques?.[index]?.observacion
                            ?.message as string
                        }
                      />
                    </div>
                  </fieldset>

                  {/* Observación en segunda fila */}
                </div>
              ))}
            </div>
          </div>

          {/* Sección 4: Datos Adicionales */}
          <fieldset className="border border-gray-300 dark:border-gray-600 rounded-lg p-5 bg-white dark:bg-gray-800">
            <legend className="px-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              📝 Detalles Adicionales
            </legend>
            <div className="mb-4 space-y-1">
              <FileUploderComponent
                value={watch("documento_cta_cte") || ""}
                setFile={setFile}
              />
            </div>
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

          {/* Campo oculto: haber */}
          <input
            type="hidden"
            {...register("haber", {
              required: "Este campo es requerido",
              valueAsNumber: true,
            })}
          />

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
          <LoadingComponent content="Registrando cheque..." />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Por favor espere mientras procesamos su solicitud...
          </p>
        </div>
      )}

      {/* ESTADO SUCCESS */}
      {formState === "success" && successData && (
        <div className="space-y-6">
          <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-400 dark:border-green-700 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-green-800 dark:text-green-300 text-lg">
                  ¡Cheque registrado exitosamente!
                </h3>
                <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                  El movimiento y cheque han sido guardados en el sistema.
                </p>
                {redirect && (
                  <div className="mt-6 flex gap-3">
                    <ButtonLinkAdd
                      to={`/administracion/cuentas-corrientes/${clienteId}`}
                      variant="green"
                      className="w-full md:w-auto"
                    >
                      Ir a la cuenta corriente
                    </ButtonLinkAdd>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Resumen de datos guardados */}
          <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-5">
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Resumen del cheque registrado
            </h4>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-gray-500 dark:text-gray-400 font-medium">
                  Cantidad de cheques:
                </dt>
                <dd className="text-gray-900 dark:text-white font-semibold">
                  {successData.cantidadCheques}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500 dark:text-gray-400 font-medium">
                  Importe total:
                </dt>
                <dd className="text-gray-900 dark:text-white font-semibold">
                  $
                  {successData.importe?.toLocaleString("es-AR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </dd>
              </div>
            </dl>
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
                Error al registrar el cheque
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
