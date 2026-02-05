import { useForm } from "react-hook-form";
import type { PedidosBD, PedidosUI } from "~/types/pedidos";
import { useUIModals } from "~/context/ModalsContext";
import { useData } from "~/context/DataContext";
import { useState } from "react";
import { pedidosAPI, ctaCorrienteAPI } from "~/backend/sheetServices";
import { useNavigate } from "react-router";
import { prepareUpdatePayload } from "~/utils/prepareUpdatePayload";
import { useFormNavigationBlock } from "./useFormNavigationBlock";
import type { CtasCtesDB } from "~/types/ctas_corrientes";
import { useAuth } from "~/context/Auth";
export function usePedidosForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { showLoading, showSuccess, showError, showInfo } = useUIModals();
  const {
    pedido,
    getPedidos,
    getCtasCtes,
    getCtasCtesByClientes,
  } = useData();
  const isEditMode = Boolean(pedido);
  const existingPedido: PedidosUI | null = pedido;

  const form = useForm<PedidosUI>({
    defaultValues: existingPedido
      ? {
          ...existingPedido,
        }
      : {
          numero_pedido: "",
          fecha_entrega_estimada: "",
          cliente_id: "",
          precio_total: 0,
          forma_pago: "",
          valor_tasacion: 0,
          status: "nuevo",
          vendedor_id: "",
        },
  });
  // Hook para bloquear navegación si hay cambios sin guardar
  useFormNavigationBlock({
    isDirty: form.formState.isDirty,
    isSubmitSuccessful: form.formState.isSubmitSuccessful,
    message:
      "Tienes cambios sin guardar en el pedido. Si sales ahora, perderás todos los cambios realizados.",
    title: "¿Salir sin guardar?",
    confirmText: "Sí, salir",
    cancelText: "No, continuar editando",
  });
  const createMtoCtaCorriente = async ({
    clienteId,
    monto,
    numeroPedido,
    tasacion,
  }: {
    clienteId: string;
    monto: number;
    numeroPedido: string;
    tasacion?: number;
  }) => {
    try {
      const newDeuda: Omit<CtasCtesDB, "id" | "fecha_creacion"> = {
        cliente_id: clienteId,
        fecha_movimiento: new Date().toISOString().split("T")[0],
        tipo_movimiento: "deuda",
        origen: "pedido",
        medio_pago: "no aplica",
        referencia: numeroPedido,
        concepto: `Deuda generada por pedido ${numeroPedido}`,
        debe: monto,
        haber: 0,
      };
      const response = await ctaCorrienteAPI.create(newDeuda);
      if (!response.success)
        throw new Error(
          response.message ||
            "Error desconocido al crear movimiento de cta corriente"
        );
      if (tasacion && tasacion > 0) {
        const newPago: Omit<CtasCtesDB, "id" | "fecha_creacion"> = {
          cliente_id: clienteId,
          fecha_movimiento: new Date().toISOString().split("T")[0],
          tipo_movimiento: "pago",
          origen: "pedido",
          medio_pago: "carroceria_usada",
          referencia: numeroPedido,
          concepto: `Pago generado por pedido ${numeroPedido}`,
          debe: 0,
          haber: tasacion,
        };
        const responsePago = await ctaCorrienteAPI.create(newPago);
        if (!responsePago.success)
          throw new Error(
            responsePago.message ||
              "Error desconocido al crear movimiento de cta corriente por tasación"
          );
      }
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

  const handleSubmit = async (formData: PedidosBD) => {
    try {
      setIsLoading(true);
      showLoading(
        isEditMode ? "Actualizando pedido..." : "Creando nuevo pedido..."
      );
      if (isEditMode) {
        // Verificar si hay cambios en el formulario
        const hasDirtyFields =
          form.formState.dirtyFields &&
          Object.keys(form.formState.dirtyFields).length > 0;

        // Si no hay campos dirty, no actualizar
        if (!hasDirtyFields) {
          setIsLoading(false);
          showInfo("No se realizaron cambios en el formulario.");
          return;
        }

        const updatePayload = prepareUpdatePayload<PedidosBD>({
          dirtyFields: form.formState.dirtyFields,
          formData: formData,
        });
        const response = await pedidosAPI.update(
          existingPedido?.id || "",
          updatePayload
        );
        if (!response.success) {
          throw new Error(
            response.message || "Error desconocido al actualizar el pedido"
          );
        }
        await getPedidos();
        form.reset(formData); // Resetea el formulario con los datos actuales
        setIsLoading(false);
        showSuccess("Pedido actualizado exitosamente");
      } else {
        const numeroPedido = await getNextPedidoNumber();
        formData.numero_pedido = numeroPedido;
        const response = await pedidosAPI.create(formData);
        if (!response.success) {
          throw new Error(
            response.message || "Error desconocido al crear el pedido"
          );
        }
        const createdId = response.data?.id;
        // Crear movimiento en cuenta corriente si el precio total es mayor a 0
        if (formData.precio_total <= 0) return;
        const iscreated = await createMtoCtaCorriente({
          clienteId: formData.cliente_id,
          monto: formData.precio_total,
          numeroPedido,
          tasacion: formData.valor_tasacion,
        });
        if (formData.valor_tasacion && formData.valor_tasacion > 0) {
        }
        if (!iscreated) {
          setIsLoading(false);
          navigate("/pedidos");
          throw new Error("Error al crear movimiento en cuenta corriente");
        }
        await getPedidos();
        if (!createdId) {
          setIsLoading(false);
          navigate("/pedidos");
          throw new Error("No se obtuvo el ID del pedido creado");
        }
        setIsLoading(false);
        navigate(`/pedidos/info/${createdId}`);
        showSuccess(
          `Pedido creado exitosamente. ${iscreated ? "Se ha creado un movimiento en cuenta corriente." : ""}`
        );
      }
    } catch (error) {
      setIsLoading(false);
      showError(
        typeof error === "string" ? error : "Error al guardar el pedido"
      );
    }
  };
  const resetForm = () => {
    form.reset();
  };
  const getNextPedidoNumber = async (): Promise<string> => {
    // Crear numero de pedido único (puedes ajustar esto según tus necesidades)
    const response = await pedidosAPI.read();
    if (!response.success) {
      throw new Error("Error al obtener los pedidos");
    }
    if (
      response.data &&
      Array.isArray(response.data) &&
      response.data.length > 0
    ) {
      const numerosPedidos = response.data.map(
        (pedido: PedidosBD) => pedido.numero_pedido
      );
      const ultimoNumero = numerosPedidos.reduce((max: string, num: string) => {
        return num > max ? num : max;
      }, "PED-0000");
      const siguienteNumero = parseInt(ultimoNumero.split("-")[1]) + 1;
      return `PED-${String(siguienteNumero).padStart(4, "0")}`;
    } else {
      return "PED-0001";
    }
  };
  return {
    // Form methods
    register: form.register,
    handleSubmit: form.handleSubmit,
    formState: form.formState,
    reset: resetForm,
    setValue: form.setValue,
    getValues: form.getValues,
    watch: form.watch,

    // Custom submit handler
    onSubmit: handleSubmit,
    isLoading,
    isEditMode,

    // Helper texts
    submitButtonText: isEditMode ? "Actualizar Pedido" : "Iniciar Pedido",
    formTitle: isEditMode ? "Editar Pedido" : "Nuevo Pedido",
  };
}
