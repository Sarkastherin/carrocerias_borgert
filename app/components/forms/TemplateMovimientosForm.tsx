import { Input, Textarea, Select, CurrencyInput } from "../Inputs";
import { Button } from "../Buttons";
import { useForm, useFieldArray, set } from "react-hook-form";
import {
  optionsMedioPago,
  optionsTipoCheque,
  optionsTypeMov,
  type ChequesDB,
  type ChequesEnriched,
  type CtaCte,
  type MvtosWithCheques,
} from "~/types/ctas_corrientes";
import { useState, useEffect } from "react";
import { mvtosAPI, chequesAPI } from "~/backend/sheetServices";
import LoadingComponent from "../LoadingComponent";
import { CheckCircle, AlertCircle, Trash2, DollarSign } from "lucide-react";
import { useData } from "~/context/DataContext";
import FilesUploderComponent from "../FileUpladerComponent";
import { useUIModals } from "~/context/ModalsContext";
import { useNavigate } from "react-router";
import type { FileTypeActions } from "../FileUpladerComponent";
import type { DocumentosCtasCtesBD } from "~/types/pedidos";
import { capitalize } from "~/config/settingsConfig";
type FormState = "form" | "loading" | "success" | "error";

export const TemplateMovimientosForm = ({
  clienteId,
  redirect,
  data,
  tipoMovimiento,
  medioPago,
  ctaCte,
}: {
  clienteId: string;
  redirect?: boolean;
  data?: MvtosWithCheques;
  tipoMovimiento: (typeof optionsTypeMov)[number]["value"];
  medioPago: (typeof optionsMedioPago)[number]["value"];
  ctaCte: CtaCte | null;
}) => {
  const [files, setFiles] = useState<FileTypeActions<DocumentosCtasCtesBD>>({
    add: null,
    remove: null,
  });
  const [formState, setFormState] = useState<FormState>("form");
  const [successData, setSuccessData] = useState<{
    cantidadCheques: number;
    importe: number;
  } | null>(null);
  const [errorData, setErrorData] = useState<{ message: string } | null>(null);
  const [totalCheques, setTotalCheques] = useState<number>(0);
  const {
    refreshCtasCtes,
    bancos,
    getBancos,
    uploadFilesToCtasCtes,
    cheques: chequesContext,
    getCheques,
    ctasCtes,
    getCtasCtes,
  } = useData();
  useEffect(() => {
    if (!ctasCtes) getCtasCtes();
  }, []);
  const navigate = useNavigate();
  const { closeModal } = useUIModals();

  useEffect(() => {
    if (!bancos) getBancos();
  }, [bancos, getBancos]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<MvtosWithCheques>({
    defaultValues: data || {
      cliente_id: clienteId,
      fecha_movimiento: new Date().toISOString().split("T")[0],
      tipo_movimiento: tipoMovimiento,
      origen: medioPago === "cheque" ? "cheque" : "manual",
      medio_pago: medioPago,
      debe: 0,
      haber: 0,
      cheques:
        medioPago === "cheque"
          ? [
              {
                numero: "",
                tipo: "",
                importe: 0,
                banco: "",
                fecha_cobro: "",
                fecha_ingreso: "",
                observacion: "",
                status: "recibido",
              },
            ]
          : undefined,
      documentos: [],
    },
  });

  const { append, remove, fields } = useFieldArray({
    control,
    name: "cheques",
  });

  useEffect(() => {
    if (medioPago !== "cheque") return;
    setValue("haber", totalCheques, { shouldDirty: true });
  }, [totalCheques, setValue]);

  const handleAddCheque = () => {
    if (!ultimaFechaIngreso) return;
    append({
      numero: "",
      tipo: "",
      importe: 0,
      banco: "",
      fecha_cobro: "",
      fecha_ingreso: ultimaFechaIngreso,
      observacion: "",
      status: "recibido",
    } as ChequesDB);
  };
  const addFiles = async ({
    id,
    files,
    formData,
  }: {
    id: string;
    files: FileList;
    formData: MvtosWithCheques;
  }) => {
    const response = await uploadFilesToCtasCtes(id, files, "movimiento");
    if (!response.success) {
      throw new Error(
        response.message || "Error desconocido al subir los archivos",
      );
    }
    if (response.data && response.data.length > 0) {
      const newDocs = [...(formData.documentos || []), ...response.data];
      formData.documentos = newDocs;
      setValue("documentos", newDocs, { shouldDirty: true });
    }
    setFiles((prev) => ({ ...prev, add: null })); // Limpiar archivos a subir después de subirlos
  };
  const onSubmit = async (formData: MvtosWithCheques) => {
    const { cheques, documentos, ...rest } = formData;
    setFormState("loading");
    let loadMvto = false;
    let loadCheques = false;
    let loadFiles = false;
    try {
      // Validación adicional para cheques
      if (medioPago === "cheque") {
        if (!cheques || cheques.length === 0) {
          // Validar que se haya agregado al menos un cheque
          throw new Error(
            "Debe agregar al menos un cheque para este medio de pago",
          );
        }
        // Validar que el numeo de cheque y el cuit del cliente no se repitan en los cheques ingresados

        // 1. Registrar movimiento
        if (ctaCte && ctaCte.movimientos) {
          const allCheques = ctaCte.movimientos?.flatMap(
            (movimiento) => movimiento.cheques || [],
          );
          if (allCheques && allCheques.length > 0) {
            cheques?.forEach((cheque) => {
              if (findDuplicateCheques(allCheques, String(cheque.numero))) {
                throw new Error(
                  `El número de cheque ${cheque.numero} ya existe para este cliente. Por favor verifique los datos ingresados.`,
                ); // Validar que el número de cheque no se repita
              }
            });
          }
        }
      }

      const nuevoMovimiento = await mvtosAPI.create({ ...rest });
      if (!nuevoMovimiento.success)
        throw new Error("Error al registrar movimiento");
      loadMvto = true;
      if (nuevoMovimiento.data && nuevoMovimiento.data.id) {
        const ctaCteID = nuevoMovimiento.data.id;
        // 2. Registrar cheques (si corresponde)
        if (medioPago === "cheque" && cheques) {
          await Promise.all(
            cheques.map(async (cheque) => {
              const response = await chequesAPI.create({
                ...cheque,
                cta_cte_id: ctaCteID,
              } as Omit<ChequesDB, "id">);
              if (!response.success) {
                throw new Error(
                  response.message || "Error desconocido al crear cheque",
                );
              }
            }),
          );
          const cantidadCheques = cheques.length;
          const importeTotalCheques = cheques.reduce(
            (sum, cheque) => sum + (cheque.importe || 0),
            0,
          );
          setSuccessData({ cantidadCheques, importe: importeTotalCheques });
          loadCheques = true;
        }
        // 3. Registrar documentos (si corresponde)
        if (files) {
          if (files.add) {
            await addFiles({ id: ctaCteID, files: files.add, formData });
            loadFiles = true;
          }
        }
      }

      const refresh = await refreshCtasCtes({
        refMvto: loadMvto,
        refCheque: loadCheques,
        refDocu: loadFiles,
      });
      if (!refresh) throw new Error("Error refreshing cuentas corrientes data");
      if (refresh) {
        if (redirect && nuevoMovimiento.data && nuevoMovimiento.data.id) {
          navigate(
            `/administracion/cuentas-corrientes/${nuevoMovimiento.data.cliente_id}`,
          );
        }
        setFormState("success");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorData({ message: (error as Error).message });
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

  const renderGenericFields = ({
    medioPago,
  }: {
    medioPago: (typeof optionsMedioPago)[number]["value"];
  }) => {
    const optionsMedioPagoFiltered = () => {
      if (medioPago !== "efectivo") {
        return optionsMedioPago.filter((op) => op.value === medioPago);
      } else {
        return optionsMedioPago.filter(
          (op) => op.value === "efectivo" || op.value === "transferencia",
        );
      }
    };
    return (
      <>
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
              disabled={medioPago !== "efectivo"}
            >
              <option value="">Seleccionar medio de pago</option>
              {optionsMedioPagoFiltered().map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            {tipoMovimiento === "deuda" && (
              <>
                <CurrencyInput
                  label="Importe (DEBE)"
                  placeholder="0.00"
                  onChange={(value) => setValue("debe", value || 0)}
                  requiredField={true}
                  error={errors.debe?.message as string}
                  icon={<DollarSign className="w-4 h-4 text-gray-500" />}
                />
                <input
                  type="hidden"
                  {...register("debe", {
                    required: "El importe es obligatorio",
                    valueAsNumber: true,
                  })}
                />
              </>
            )}
            {tipoMovimiento !== "deuda" && (
              <>
                <CurrencyInput
                  label="Importe (HABER)"
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
              </>
            )}
          </div>
        </fieldset>
      </>
    );
  };
  const renderChequeFields = () => {
    return (
      <>
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
                  {bancos && (
                    <Select
                      label="Banco"
                      {...register(`cheques.${index}.banco`, {
                        required: {
                          value: watch(`cheques.${index}.tipo`) === "fisico",
                          message: "El banco es obligatorio",
                        },
                      })}
                      error={
                        Array.isArray(errors.cheques)
                          ? errors.cheques[index]?.banco?.message
                          : undefined
                      }
                      requiredField={
                        watch(`cheques.${index}.tipo`) === "fisico"
                      }
                    >
                      <option value="">Seleccione un banco</option>
                      {bancos?.map((banco) => (
                        <option key={banco.value} value={banco.value}>
                          {banco.label}
                        </option>
                      ))}
                    </Select>
                  )}
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
                    onChange={(value) => handleImporteChange(index, value || 0)}
                    error={errors.cheques?.[index]?.importe?.message as string}
                    requiredField={true}
                  />
                  <Input
                    label="Fecha ingreso"
                    type="date"
                    {...register(`cheques.${index}.fecha_ingreso`, {
                      required: "Requerido",
                    })}
                    error={
                      errors.cheques?.[index]?.fecha_ingreso?.message as string
                    }
                    requiredField={true}
                  />
                  <div className="md:col-span-2 lg:col-span-3">
                    <Textarea
                      label="Observación"
                      placeholder="Notas adicionales sobre este cheque (opcional)"
                      {...register(`cheques.${index}.observacion`)}
                      error={
                        errors.cheques?.[index]?.observacion?.message as string
                      }
                    />
                  </div>
                </fieldset>

                {/* Observación en segunda fila */}
              </div>
            ))}
          </div>
          <div className="w-fit">
            <Button
              type="button"
              onClick={handleAddCheque}
              variant="green"
              size="sm"
              className="flex items-center gap-2"
              disabled={!ultimaFechaIngreso}
            >
              Agregar otro cheque
            </Button>
          </div>
        </div>
      </>
    );
  };
  const findDuplicateCheques = (
    allCheques: ChequesEnriched[],
    numeroCheque: string,
  ) => {
    const duplicateCheque = allCheques.some(
      (cheque) => String(cheque.numero) === numeroCheque,
    );
    if (duplicateCheque) {
      return true;
    }
    return false;
  };
  const ultimaFechaIngreso = watch("cheques")?.at(-1)?.fecha_ingreso;
  return (
    <div className="w-full">
      {/* FORMULARIO PRINCIPAL */}
      {formState === "form" && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Sección 1: Formulario */}
          {medioPago !== "cheque" && renderGenericFields({ medioPago })}
          {medioPago === "cheque" && renderChequeFields()}
          {/* Sección 2: Datos Adicionales */}
          <fieldset className="border border-gray-300 dark:border-gray-600 rounded-lg p-5 bg-white dark:bg-gray-800">
            <legend className="px-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              📝 Detalles Adicionales
            </legend>
            <div className="flex flex-col gap-4">
              <FilesUploderComponent
                tipoDocumento="camion"
                documentos={watch("documentos")}
                setFiles={setFiles}
                files={files}
              />
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
            </div>
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
          <LoadingComponent content={`Registrando ${medioPago}...`} />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Por favor espere mientras procesamos su solicitud...
          </p>
        </div>
      )}

      {/* ESTADO SUCCESS */}
      {formState === "success" && medioPago !== "cheque" && (
        <div className="space-y-6">
          <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-400 dark:border-green-700 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-green-800 dark:text-green-300 text-lg">
                  ¡{capitalize(tipoMovimiento)} registrado exitosamente!
                </h3>
                <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                  El movimiento ha sido guardado en el sistema.
                </p>
                <div className="mt-6 w-fit ms-auto">
                  <Button variant="green" onClick={closeModal}>
                    Cerrar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {formState === "success" && successData && medioPago === "cheque" && (
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
          <div className="mt-6 w-fit ms-auto">
            <Button variant="green" onClick={closeModal}>
              Cerrar
            </Button>
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
              {errorData ? (
                <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                  {errorData.message}
                </p>
              ) : (
                <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                  Ocurrió un problema al procesar su solicitud. Por favor,
                  intente nuevamente.
                </p>
              )}
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
