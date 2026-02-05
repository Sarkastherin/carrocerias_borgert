import { Textarea, formatCuit, Select } from "../Inputs";
import { Button } from "../Buttons";
import { useEffect, useState } from "react";
import { GlassCard } from "../GlassCard";
import { useForm } from "react-hook-form";
import type {
  CtasCtesWithCheque,
  CtaCteConCliente,
  CtasCtesDB,
} from "~/types/ctas_corrientes";
import { BadgeStatusCheque } from "../Badge";
import { capitalize } from "~/config/settingsConfig";
import { prepareUpdatePayload } from "~/utils/prepareUpdatePayload";
import { ctaCorrienteAPI } from "~/backend/sheetServices";
import { useData } from "~/context/DataContext";
import { optionsMedioPago } from "~/types/ctas_corrientes";
import { useUIModals } from "~/context/ModalsContext";
import { CheckCircle, AlertCircle, Info } from "lucide-react";
import LoadingComponent from "../LoadingComponent";
import { useNavigate } from "react-router";
import FileUploderComponent, {updateFilePDFCtaCte} from "../FileUpladerComponent";
import { formatDateUStoES } from "~/utils/formatDate";
type FormState = "form" | "loading" | "success" | "error" | "info";
export default function MovimientosForm({
  data,
  client,
}: {
  data: CtasCtesWithCheque;
  client: CtaCteConCliente | null;
}) {
  const navigate = useNavigate();
  const [formState, setFormState] = useState<FormState>("form");
  const { getCtaCteWithCheques, getCtasCtesByClientes, bancos, getBancos } = useData();
  const { closeModal } = useUIModals();
  const [file, setFile] = useState<File | null>(null);
  const { cheques, ...rest } = data;
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting, dirtyFields },
  } = useForm<CtasCtesDB>({
    defaultValues: rest,
  });
  useEffect(() => {
    if(!bancos) getBancos();
  },[])
  const onSubmit = async (formData: CtasCtesDB) => {
    setFormState("loading");
    if(file) {
      const fileLink = await updateFilePDFCtaCte(file);
      formData.documento_cta_cte = fileLink;
      setValue("documento_cta_cte", fileLink, { shouldDirty: true });
    }
    const hasDirtyFields = dirtyFields && Object.keys(dirtyFields).length > 0;
    if (!hasDirtyFields) {
      setFormState("info");
      return;
    }
    
    const updatePayload = prepareUpdatePayload<CtasCtesDB>({
      dirtyFields: dirtyFields,
      formData: formData,
    });
    try {
      const response = await ctaCorrienteAPI.update(rest.id, updatePayload);
      if (!response.success) throw new Error(response.message);
      await getCtaCteWithCheques(true);
      await getCtasCtesByClientes();
      // 3. Actualizar el estado del formulario a éxito
      setFormState("success");
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormState("error");
    }
  };
  return (
    <>
      {formState === "form" && bancos && (
        <GlassCard
          size="full"
          blur="lg"
          opacity="low"
          padding="md"
          className="!border-gray-300/80 dark:!border-white/20 mb-6"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-4 border-b border-gray-300 dark:border-gray-600 pb-2">
                Información del Movimiento
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                    Fecha de Movimiento
                  </span>
                  <p className="text-sm text-text-primary font-semibold">
                    {formatDateUStoES(data.fecha_movimiento)}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                    Tipo de Movimiento
                  </span>
                  <p className="text-sm text-text-primary font-semibold">
                    {capitalize(data.tipo_movimiento)}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                    Origen
                  </span>
                  <p className="text-sm text-text-primary font-semibold">
                    {capitalize(data.origen)}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                    Medio de Pago
                  </span>
                  {data.medio_pago === "transferencia" ||
                    (data.medio_pago === "efectivo" ? (
                      <Select {...register("medio_pago", { required: true })}>
                        {optionsMedioPago
                          .filter((option) => option.origen === "manual")
                          .map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                      </Select>
                    ) : (
                      <p className="text-sm text-text-primary font-semibold">
                        {capitalize(data.medio_pago)}
                      </p>
                    ))}
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                    Debe
                  </span>
                  <p className="text-sm text-text-primary font-semibold">
                    $
                    {data.debe.toLocaleString("es-AR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                    Haber
                  </span>
                  <p className="text-sm text-text-primary font-semibold">
                    $
                    {data.haber.toLocaleString("es-AR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-1">
                <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                  Concepto
                </span>
                <Textarea
                  {...register("concepto")}
                  placeholder="Describa el motivo o concepto del movimiento"
                />
              </div>

              {data.referencia && (
                <div className="mt-4 space-y-1">
                  <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                    Referencia
                  </span>
                  <p className="text-sm text-text-primary">{data.referencia}</p>
                </div>
              )}
              <div className="mt-4 space-y-1">
                <FileUploderComponent
                  value={watch("documento_cta_cte") || ""}
                  setFile={setFile}
                />
              </div>
            </div>

            {client && (
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4 border-b border-gray-300 dark:border-gray-600 pb-2">
                  Información del Cliente
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                      Razón Social
                    </span>
                    <p className="text-sm text-text-primary font-semibold">
                      {client.razon_social}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                      CUIT/CUIL
                    </span>
                    <p className="text-sm text-text-primary font-semibold">
                      {formatCuit(client.cuit_cuil)}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                      Condición IVA
                    </span>
                    <p className="text-sm text-text-primary font-semibold">
                      {client.condicion_iva}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {data.cheques && data.cheques.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4 border-b border-gray-300 dark:border-gray-600 pb-2">
                  Cheques Asociados
                </h3>
                <div className="space-y-3">
                  {data.cheques.map((cheque) => (
                    <div
                      key={cheque.id}
                      className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:shadow-md transition-shadow"
                      title="Ir al cheque"
                      onClick={() => {
                        navigate(`/administracion/${cheque.id}`);
                        closeModal();
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div className="space-y-1">
                          <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                            Número
                          </span>
                          <p className="text-sm text-text-primary font-semibold">
                            {cheque.numero}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                            Banco
                          </span>
                          <p className="text-sm text-text-primary font-semibold">
                            {bancos?.find((b) => b.value === cheque.banco)?.label ||
                              "-"}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                            Importe
                          </span>
                          <p className="text-sm text-text-primary font-semibold">
                            $
                            {cheque.importe.toLocaleString("es-AR", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                            Estado
                          </span>
                          <div className="block">
                            <BadgeStatusCheque status={cheque.status as string}>
                              {capitalize(cheque.status || "-")}
                            </BadgeStatusCheque>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                            Fecha de Cobro
                          </span>
                          <p className="text-sm text-text-primary">
                            {new Date(cheque.fecha_cobro).toLocaleDateString(
                              "es-AR",
                            )}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                            Tipo
                          </span>
                          <p className="text-sm text-text-primary">
                            {capitalize(cheque.tipo)}
                          </p>
                        </div>
                      </div>

                      {cheque.observacion && (
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                          <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                            Observaciones
                          </span>
                          <p className="text-sm text-text-primary mt-1">
                            {cheque.observacion}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex justify-end items-center gap-4 pt-4 border-t border-gray-300 dark:border-gray-600">
              <Button
                type="submit"
                variant="blue"
                disabled={isSubmitting}
                className="w-full md:w-auto"
              >
                {isSubmitting ? "Guardando..." : `✓ Guardar Cambios`}
              </Button>
            </div>
          </form>
        </GlassCard>
      )}

      {/* ESTADO LOADING */}
      {formState === "loading" && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <LoadingComponent content="Actualizando movimiento..." />
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
                  ¡Movimiento actualizado exitosamente!
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
                Error al actualizar el movimiento
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
      {/* ESTADO INFO */}
      {formState === "info" && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 dark:border-yellow-700 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <Info className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 text-lg">
                No hay cambios para guardar
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                No hay cambios para guardar.
              </p>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <Button
              variant="yellow"
              onClick={() => setFormState("form")}
              className="w-full md:w-auto"
            >
              Volver al formulario
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
