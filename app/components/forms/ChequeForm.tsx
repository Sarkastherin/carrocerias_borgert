import { Input, Textarea, formatCuit, Select } from "../Inputs";
import { Button } from "../Buttons";
import { useState, useEffect } from "react";
import { getChequeTransition, chequeStateMachine } from "~/config/chequeStateMachine";
import { GlassCard } from "../GlassCard";
import { useForm } from "react-hook-form";
import type { ChequesEnrichWithCtaCte, ChequesDB } from "~/types/ctas_corrientes";
import ProveedorField from "../ProveedorField";
import { BadgeStatusCheque } from "../Badge";
import { capitalize } from "~/config/settingsConfig";
import { useUIModals } from "~/context/ModalsContext";
import { useFormNavigationBlock } from "~/hooks/useFormNavigationBlock";
import { prepareUpdatePayload } from "~/utils/prepareUpdatePayload";
import { chequesAPI, mvtosAPI } from "~/backend/sheetServices";
import type { MvtosDB } from "~/types/ctas_corrientes";
import { useCtaCte } from "~/context/CtaCteContext";
type AccionTypes = "depositar" | "endosar" | "anular" | "acreditar" | "rechazar" | "anularEndoso";
export default function ChequeForm({ data }: { data?: ChequesEnrichWithCtaCte }) {
  const { bancos, getBancos, getCheques, getMvtos } = useCtaCte();
  const { showInfo, showLoading, showError, showSuccess, showConfirmation } = useUIModals();
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
  } = useForm<ChequesEnrichWithCtaCte>({
    defaultValues: data,
  });
  useEffect(() => {
      if (!bancos) getBancos();
    }, [bancos, getBancos]);
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
      accion,
    }: {
      clienteId: string;
      monto: number;
      accion: "rechazar" | "anular";
    }) => {
      try {
        const origen = accion === "rechazar" ? "rechazo de cheque" : "anulacion de cheque";
        const concepto =
          accion === "rechazar"
            ? "Deuda generada por rechazo de cheque"
            : "Deuda generada por anulacion de cheque";
        const newDeuda: Omit<MvtosDB, "id" | "fecha_creacion"> = {
          cliente_id: clienteId,
          fecha_movimiento: new Date().toISOString().split("T")[0],
          tipo_movimiento: "deuda",
          origen,
          medio_pago: "no aplica",
          concepto,
          debe: monto,
          haber: 0,
        };
        const response = await mvtosAPI.create(newDeuda);
        if (!response.success)
          throw new Error(
            response.message ||
              "Error desconocido al crear movimiento de cta corriente"
          );
        return true;
      } catch (error) {
        throw new Error(
          typeof error === "string"
            ? error
            : "Error al crear movimiento de cuenta corriente"
        );
      }
    };
  // Centraliza efectos secundarios según la máquina de estados
  const onSubmit = async (formData: ChequesEnrichWithCtaCte) => {
    showLoading("Guardando cambios...", "Por favor, espere.");
    const { ctaCte, proveedor, nombre_banco, ...rest } = formData;
    const hasDirtyFields = dirtyFields && Object.keys(dirtyFields).length > 0;
    if (!hasDirtyFields) {
      showInfo("No hay cambios para guardar.");
      return;
    }
    // Determinar transición y efecto secundario
    const currentStatus = data?.status as any;
    const transition = getChequeTransition(currentStatus, accion as any);
    const updatePayload = prepareUpdatePayload<ChequesDB>({
      dirtyFields: dirtyFields,
      formData: rest,
    });
    try {
      const response = await chequesAPI.update(rest.id, updatePayload);
      if (!response.success) throw new Error(response.message);
      // actualizar cheques
      await getCheques();
      // Si la transición requiere generar deuda, hacerlo automáticamente
      if (transition && transition.effect === "generarDeuda") {
        await createMtoCtaCorriente({
          clienteId: formData.ctaCte.id,
          monto: formData.importe,
          accion: accion === "anular" ? "anular" : "rechazar",
        });
        // Recargar movimientos para reflejar nueva deuda generada
        await getMvtos();
      }
      setAccion("");
      showSuccess("Cheque actualizado con éxito.");
    } catch (error) {
      showError(
        "Error al actualizar el cheque. Por favor, intente nuevamente más tarde.",
      );
    }
  };
  // Centraliza la transición de estado usando la máquina de estados
  const handleSetAction = (actionType: AccionTypes) => {
    const currentStatus = data?.status as any;
    const transition = getChequeTransition(currentStatus, actionType);
    if (!transition) {
      showError("Transición no permitida desde el estado actual.");
      return;
    }
    const today = new Date().toISOString().split("T")[0];
    // Setea el nuevo estado y campos asociados según la acción
    switch (actionType) {
      case "depositar":
        setValue("fecha_deposito", today, { shouldDirty: true });
        setValue("status", "depositado", { shouldDirty: true });
        setValue("fecha_endoso", undefined);
        setValue("proveedor_id", undefined);
        setValue("fecha_anulacion", undefined);
        break;
      case "endosar":
        setValue("fecha_endoso", today, { shouldDirty: true });
        setValue("status", "endosado", { shouldDirty: true });
        setValue("fecha_deposito", undefined);
        setValue("fecha_anulacion", undefined);
        break;
      case "anular":
        setValue("fecha_anulacion", today, { shouldDirty: true });
        setValue("status", "anulado", { shouldDirty: true });
        setValue("fecha_deposito", undefined);
        setValue("fecha_endoso", undefined);
        setValue("proveedor_id", undefined);
        break;
      case "acreditar":
        setValue("fecha_acreditacion", today, { shouldDirty: true });
        setValue("status", "acreditado", { shouldDirty: true });
        setValue("fecha_rechazo", undefined);
        setValue("motivo_rechazo", undefined);
        break;
      case "rechazar":
        setValue("fecha_rechazo", today, { shouldDirty: true });
        setValue("status", "rechazado", { shouldDirty: true });
        setValue("fecha_acreditacion", undefined);
        break;
      case "anularEndoso":
        // Esta acción se maneja aparte (ver anularEndoso)
        break;
      default:
        break;
    }
    setAccion(actionType);
  };
  // Usa la máquina de estados para validar la transición de anularEndoso
  const anularEndoso = async () => {
    const currentStatus = data?.status as any;
    const transition = getChequeTransition(currentStatus, "anularEndoso");
    if (!transition) {
      showError("No se puede anular el endoso desde el estado actual.");
      return;
    }
    showLoading("Anulando endoso...", "Por favor, espere.");
    try {
      const response = await chequesAPI.update(data!.id, {
        status: transition.to,
        fecha_endoso: "",
        proveedor_id: "",
      });
      if (!response.success) throw new Error(response.message);
      await getCheques();
      // resetear formulario a data actualizada
      data!.status = transition.to;
      data!.fecha_endoso = "";
      data!.proveedor_id = "";
      data!.proveedor = undefined;
      reset(data);
      showSuccess("Endoso anulado. El cheque ha vuelto a estado de recibido.");
    } catch (error) {
      showError("Error al anular el endoso. Por favor, intente nuevamente más tarde.");
    }
  };
  const handleBackToReceived = () => {
    showConfirmation("El cheque volverá a estado de recibido, ¿Desea continuar?", anularEndoso, {
      title: "¿Anular endoso?",
      confirmText: "Sí, anular y volver a recibido",
      cancelText: "No, mantener endosado",
    });
  };
  
  // Type guard para ChequeStatus
  const chequeStatuses = [
    'recibido',
    'endosado',
    'depositado',
    'anulado',
    'rechazado',
    'acreditado',
  ] as const;
  type ChequeStatus = typeof chequeStatuses[number];
  const statusIsValid = (status: any): status is ChequeStatus =>
    chequeStatuses.includes(status);

  const validActions = statusIsValid(data?.status)
    ? Object.keys(chequeStateMachine[data.status])
    : [];
  const isEditable = validActions.length > 0;
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
                  {data?.ctaCte.razon_social}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  CUIT: {formatCuit(data?.ctaCte.cuit_cuil || "")}
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
        {/* Campos editables generales (siempre que sea editable) */}
        {isEditable && (
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
              {bancos && (
                <Select
                  label="Banco"
                  {...register(`banco`, {
                    required: {
                      value: watch(`tipo`) === "fisico",
                      message: "El banco es obligatorio",
                    },
                  })}
                  error={errors.banco?.message as string}
                  requiredField={watch(`tipo`) === "fisico"}
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
        )}
        {/* Acciones disponibles según la máquina de estados */}
        {isEditable && (
          <fieldset className="border border-gray-300 dark:border-gray-600 rounded-lg p-5 bg-white dark:bg-gray-800">
            <legend className="px-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              🔀​ Acciones disponibles
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {validActions.includes("depositar") && (
                <Button
                  variant="outlineGreen"
                  type="button"
                  onClick={() => handleSetAction("depositar")}
                >
                  Depositar
                </Button>
              )}
              {validActions.includes("endosar") && (
                <Button
                  variant="outlineDark"
                  type="button"
                  onClick={() => handleSetAction("endosar")}
                >
                  Endosar
                </Button>
              )}
              {validActions.includes("anular") && (
                <Button
                  variant="outlineRed"
                  type="button"
                  onClick={() => handleSetAction("anular")}
                >
                  Anular
                </Button>
              )}
              {/* Oculta 'Rechazar' si el estado es 'recibido' */}
              {validActions.includes("rechazar") && data?.status !== "recibido" && (
                <Button
                  variant="outlineRed"
                  type="button"
                  onClick={() => handleSetAction("rechazar")}
                >
                  Rechazar
                </Button>
              )}
              {validActions.includes("acreditar") && (
                <Button
                  variant="outlineGreen"
                  type="button"
                  onClick={() => handleSetAction("acreditar")}
                >
                  Acreditar
                </Button>
              )}
              {/* Anular endoso como acción visible cuando está endosado */}
              {data?.status === "endosado" && validActions.includes("anularEndoso") && (
                <Button
                  variant="outlineDark"
                  type="button"
                  onClick={handleBackToReceived}
                >
                  Anular endoso
                </Button>
              )}
            </div>
            {/* Campos adicionales según acción seleccionada */}
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
