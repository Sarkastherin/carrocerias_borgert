import { useForm } from "react-hook-form";
import type { PedidosBD } from "~/types/pedidos";
import { useUIModals } from "~/context/ModalsContext";
import { useData } from "~/context/DataContext";
import { useState, useEffect } from "react";
import { pedidosAPI } from "~/backend/sheetServices";
import { useNavigate } from "react-router";
import { prepareUpdatePayload } from "~/utils/prepareUpdatePayload";

export function usePedidosForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { showLoading, showSuccess, showError, showInfo } = useUIModals();
  const { pedido, getPedidos } = useData();
  const isEditMode = Boolean(pedido);
  const existingPedido = pedido as PedidosBD | null;

  const form = useForm<PedidosBD>({
    defaultValues: existingPedido
      ? {
          ...existingPedido,
          // Mapear campos existentes a los nuevos campos estructurados
        }
      : {
          numero_pedido: "",
          fecha_entrega_estimada: "",
          cliente_id: "",
          precio_total: 0,
          forma_pago: "",
          status: "nuevo",
          fecha_entrega: "",
          notas_entrega: "",
          vendedor_asignado: "",
        },
  });
  useEffect(() => {
    //console.log(form.formState.dirtyFields)
  }, [form.formState.dirtyFields]);
  const handleSubmit = async (formData: PedidosBD) => {
    try {
      showLoading(
        isEditMode ? "Actualizando pedido..." : "Creando nuevo pedido..."
      );
      if (isEditMode) {
        // Verificar si hay cambios en el formulario
        const hasDirtyFields =
          form.formState.dirtyFields &&
          Object.keys(form.formState.dirtyFields).length > 0;

        // Si no hay campos dirty y no hay cambios de dirección, no actualizar
        if (!hasDirtyFields) {
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
        getPedidos();
        navigate("/pedidos");
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
        getPedidos();
        navigate("/pedidos");
        showSuccess("Pedido creado exitosamente");
      }
    } catch (error) {
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
    if (response.data && response.data.length > 0) {
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
