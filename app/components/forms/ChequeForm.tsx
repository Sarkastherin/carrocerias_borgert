import { Input, Textarea, formatCuit, Select } from "../Inputs";
import { Button } from "../Buttons";
import { useState } from "react";
import { GlassCard } from "../GlassCard";
import { useForm } from "react-hook-form";
import type { ChequesWithTerceros, ChequesDB } from "~/types/ctas_corrientes";
import { BancosComponent } from "../Bancos";
import ProveedorField from "../ProveedorField";
import { BadgeStatusCheque } from "../Badge";
import { capitalize } from "~/config/settingsConfig";
import { useUIModals } from "~/context/ModalsContext";
import { useFormNavigationBlock } from "~/hooks/useFormNavigationBlock";
import { prepareUpdatePayload } from "~/utils/prepareUpdatePayload";
import { chequesAPI, ctaCorrienteAPI } from "~/backend/sheetServices";
import { useData } from "~/context/DataContext";
import { useNavigate } from "react-router";
import type { CtasCtesDB } from "~/types/ctas_corrientes";
type AccionTypes = "depositar" | "endosar" | "anular" | "acreditar" | "rechazar";
export default function ChequeForm({ data }: { data?: ChequesWithTerceros }) {
  const navigate = useNavigate();
  const { refreshChequesWithTerceros, getCtasCtes, getCtasCtesByClientes } = useData();
  const { showInfo, showLoading, showError, showSuccess } = useUIModals();
  const [accion, setAccion] = useState<AccionTypes | "">("");
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: {
      errors,
      isSubmitting,
      isDirty,
      dirtyFields,
      isSubmitSuccessful,
    },
  } = useForm<ChequesWithTerceros>({
    defaultValues: data,
  });
  useFormNavigationBlock({
    isDirty:
      isDirty && dirtyFields ? Object.keys(dirtyFields).length > 0 : false,
    isSubmitSuccessful: isSubmitSuccessful,
    message:
      "Tienes cambios sin guardar en cheques. Si sales ahora, perderás todos los cambios realizados.",
    title: "¿Salir sin guardar?",
    confirmText: "Sí, salir",
    cancelText: "No, continuar editando",
  });
  const createMtoCtaCorriente = async ({
      clienteId,
      monto,
    }: {
      clienteId: string;
      monto: number;
    }) => {
      try {
        const newDeuda: Omit<CtasCtesDB, "id" | "fecha_creacion"> = {
          cliente_id: clienteId,
          fecha_movimiento: new Date().toISOString().split("T")[0],
          tipo_movimiento: "deuda",
          origen: "rechazo de cheque",
          medio_pago: "no aplica",
          concepto: `Deuda generada por rechazo de cheque`,
          debe: monto,
          haber: 0,
        };
        const response = await ctaCorrienteAPI.create(newDeuda);
        if (!response.success)
          throw new Error(
            response.message ||
              "Error desconocido al crear movimiento de cta corriente"
          );
        await getCtasCtes();
        await getCtasCtesByClientes();
        return true;
      } catch (error) {
        throw new Error(
          typeof error === "string"
            ? error
            : "Error al crear movimiento de cuenta corriente"
        );
      }
    };
  const onSubmit = async (formData: ChequesWithTerceros) => {
    showLoading("Guardando cambios...", "Por favor, espere.");
    const { cliente, proveedor, nombre_banco, ...rest } = formData;
    const hasDirtyFields = dirtyFields && Object.keys(dirtyFields).length > 0;
    if (!hasDirtyFields) {
      showInfo("No hay cambios para guardar.");
      return;
    }
    const updatePayload = prepareUpdatePayload<ChequesDB>({
      dirtyFields: dirtyFields,
      formData: rest,
    });
    try {
      const response = await chequesAPI.update(rest.id, updatePayload);
      if (!response.success) throw new Error(response.message);
      if(accion === "rechazar"){
        await createMtoCtaCorriente({
          clienteId: formData.cliente.id,
          monto: formData.importe,
        });
      }
      // Forzar recarga completa de cheques invalidando el caché primero
      const isRefreshed = await refreshChequesWithTerceros();
      // mostrar modal de exito
      if (isRefreshed) {
        showSuccess("Cheque actualizado con éxito.", () => {
          setTimeout(() => {
            navigate("/administracion/cheques");
          }, 200);
        });
      } else {
        showInfo(
          "Cheque actualizado, pero no se pudieron refrescar los datos. Actualice la página manualmente.",
        );
      }
      reset(formData);
    } catch (error) {
      showError(
        "Error al actualizar el cheque. Por favor, intente nuevamente más tarde.",
      );
    }
  };
  const handleSetAction = (actionType: AccionTypes) => {
    const today = new Date().toISOString().split("T")[0];

    const actionConfig = {
      depositar: {
        set: { fecha_deposito: today, status: "depositado" as const },
        clear: ["fecha_endoso", "proveedor_id", "fecha_anulacion"] as const,
      },
      endosar: {
        set: { fecha_endoso: today, status: "endosado" as const },
        clear: ["fecha_deposito", "fecha_anulacion"] as const,
      },
      anular: {
        set: { fecha_anulacion: today, status: "anulado" as const },
        clear: ["fecha_deposito", "fecha_endoso", "proveedor_id"] as const,
      },
      acreditar: {
        set: { fecha_acreditacion: today, status: "acreditado" as const },
        clear: ["fecha_rechazo", "motivo_rechazo"] as const,
      },
      rechazar:{
        set: { fecha_rechazo: today,  status: "rechazado" as const },
        clear: ["fecha_acreditacion"] as const,
      }
    };

    const config = actionConfig[actionType];

    // Establecer valores
    Object.entries(config.set).forEach(([key, value]) => {
      setValue(key as any, value, { shouldDirty: true });
    });

    // Limpiar campos
    config.clear.forEach((field) => setValue(field as any, undefined));

    setAccion(actionType);
  };
  const isEditable = data?.status === "recibido" || data?.status === "depositado";
  return (
    <>
      <GlassCard
        size="full"
        blur="lg"
        opacity="low"
        padding="md"
        className="!border-gray-300/80 dark:!border-white/20 mb-6"
      >
        <>
          <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Razón social
                </p>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  {data?.cliente.razon_social}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  CUIT: {formatCuit(data?.cliente.cuit_cuil || "")}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Estado actual:{" "}
                  <BadgeStatusCheque status={data?.status as string}>
                    {capitalize(data?.status || "-")}
                  </BadgeStatusCheque>
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Importe del cheque
              </span>
              <div
                className={`mt-2 inline-flex items-center px-2 py-1 rounded-xl text-white text-xl font-bold bg-green-600`}
              >
                {data?.importe.toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </div>
            </div>
          </div>
          {data?.status !== "recibido" && (
            <>
              <hr className="mt-3 mb-4 text-gray-300 dark:text-gray-600" />
              <h2 className="font-medium mb-2 italic">Detalles del cheque</h2>
              <div className="grid grid-cols-3 gap-3">
                <p className="text-sm text-gray-600 dark:text-gray-300 ">
                  Tipo de cheque:{" "}
                  <strong>{capitalize(data?.tipo || "") || "-"}</strong>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 ">
                  Banco: <strong>{data?.nombre_banco || "-"}</strong>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 ">
                  Número de cheque: <strong>{data?.numero || "-"}</strong>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 ">
                  Fecha de pago: <strong>{data?.fecha_cobro || "-"}</strong>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 ">
                  Fecha de ingreso:{" "}
                  <strong>{data?.fecha_ingreso || "-"}</strong>
                </p>
                {data?.status === "depositado" && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 ">
                    Fecha de depósito:{" "}
                    <strong>{data?.fecha_deposito || "-"}</strong>
                  </p>
                )}
                {data?.status === "endosado" && (
                  <>
                    <p className="text-sm text-gray-600 dark:text-gray-300 ">
                      Fecha de endoso:{" "}
                      <strong>{data?.fecha_endoso || "-"}</strong>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 flex-2">
                      Destino (Proveedor):{" "}
                      <strong>{data?.proveedor?.razon_social || "-"}</strong>
                    </p>
                  </>
                )}
                {data?.status === "anulado" && (
                  <>
                    <p className="text-sm text-gray-600 dark:text-gray-300 ">
                      Fecha de anulación:{" "}
                      <strong>{data?.fecha_anulacion || "-"}</strong>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 ">
                      Motivo de anulación:{" "}
                      <strong>{data?.motivo_anulacion || "-"}</strong>
                    </p>
                  </>
                )}
              </div>
            </>
          )}
        </>
      </GlassCard>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {data?.status === "recibido" && (
          <>
            <fieldset className="border border-gray-300 dark:border-gray-600 rounded-lg p-5 bg-white dark:bg-gray-800">
              <legend className="px-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                ✍️​ Campos editables
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Fecha de pago"
                  type="date"
                  {...register(`fecha_cobro`, {
                    required: "Requerido",
                  })}
                  error={errors.fecha_cobro?.message as string}
                  requiredField={true}
                />
                <BancosComponent
                  register={register}
                  errors={errors}
                  watch={watch}
                />
                <Input
                  label="N° Cheque"
                  placeholder="Ej: 123456"
                  {...register(`numero`, {
                    required: "Requerido",
                  })}
                  error={errors.numero?.message as string}
                  requiredField={true}
                />
                <Input
                  label="Fecha ingreso"
                  type="date"
                  {...register(`fecha_ingreso`, {
                    required: "Requerido",
                  })}
                  error={errors.fecha_ingreso?.message as string}
                  requiredField={true}
                />

                <div className="md:col-span-2">
                  <Textarea
                    label="Observación"
                    placeholder="Notas adicionales sobre este cheque (opcional)"
                    {...register(`observacion`)}
                    error={errors.observacion?.message as string}
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className="border border-gray-300 dark:border-gray-600 rounded-lg p-5 bg-white dark:bg-gray-800">
              <legend className="px-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                🔀​ Acciones disponibles
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Button
                  variant="outlineGreen"
                  type="button"
                  onClick={() => handleSetAction("depositar")}
                >
                  Depositar
                </Button>
                <Button
                  variant="outlineDark"
                  type="button"
                  onClick={() => handleSetAction("endosar")}
                >
                  Endosar
                </Button>
                <Button
                  variant="outlineRed"
                  type="button"
                  onClick={() => handleSetAction("anular")}
                >
                  Anular
                </Button>
              </div>
              {accion === "depositar" && (
                <Input
                  label="Fecha de deposito"
                  type="date"
                  {...register(`fecha_deposito`, {
                    required: "Requerido",
                  })}
                  error={errors.fecha_deposito?.message as string}
                  requiredField
                />
              )}
              {accion === "endosar" && (
                <div className="flex gap-4">
                  <Input
                    label="Fecha de endoso"
                    type="date"
                    {...register(`fecha_endoso`, {
                      required: "Requerido",
                    })}
                    error={errors.fecha_endoso?.message as string}
                    requiredField
                  />
                  <div className="flex-1">
                    <ProveedorField
                      value={watch("proveedor.razon_social")}
                      register={register}
                      setValue={setValue}
                      errors={errors}
                      required
                    />
                  </div>
                </div>
              )}
              {accion === "anular" && (
                <div className="flex gap-4">
                  <Input
                    label="Fecha de anulación"
                    type="date"
                    {...register(`fecha_anulacion`, {
                      required: "Requerido",
                    })}
                    error={errors.fecha_anulacion?.message as string}
                    requiredField
                  />
                  <div className="flex-1">
                    <Textarea
                      label="Motivo de anulación"
                      placeholder="Ingrese el motivo de la anulación del cheque"
                      {...register(`motivo_anulacion`, {
                        required: "Requerido",
                      })}
                      error={errors.motivo_anulacion?.message as string}
                      requiredField
                    />
                  </div>
                </div>
              )}
            </fieldset>
          </>
        )}
        {data?.status === "depositado" && (
          <fieldset className="border border-gray-300 dark:border-gray-600 rounded-lg p-5 bg-white dark:bg-gray-800">
            <legend className="px-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              🔀​ Acciones disponibles
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Button
                variant="outlineGreen"
                type="button"
                onClick={() => handleSetAction("acreditar")}
              >
                Acreditar
              </Button>
              <Button
                variant="outlineRed"
                type="button"
                onClick={() => handleSetAction("rechazar")}
              >
                Rechazar
              </Button>
            </div>
            {accion === "acreditar" && (
              <Input
                label="Fecha de acreditación"
                type="date"
                {...register(`fecha_acreditacion`, {
                  required: "Requerido",
                })}
                error={errors.fecha_acreditacion?.message as string}
                requiredField
              />
            )}
            
            {accion === "rechazar" && (
              <div className="flex gap-4">
                <Input
                  label="Fecha de rechazo"
                  type="date"
                  {...register(`fecha_rechazo`, {
                    required: "Requerido",
                  })}
                  error={errors.fecha_rechazo?.message as string}
                  requiredField
                />
                <div className="flex-1">
                  <Textarea
                    label="Motivo de rechazo"
                    placeholder="Ingrese el motivo del rechazo del cheque"
                    {...register(`motivo_rechazo`, {
                      required: "Requerido",
                    })}
                    error={errors.motivo_rechazo?.message as string}
                    requiredField
                  />
                </div>
              </div>
            )}
          </fieldset>
        )}
        {isEditable && (
          <div className="w-fit">
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        )}
      </form>
    </>
  );
}
