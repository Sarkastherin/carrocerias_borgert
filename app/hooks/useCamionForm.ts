import { useForm } from "react-hook-form";
import type { PedidosBD, CamionBD } from "~/types/pedidos";
import { useUIModals } from "~/context/ModalsContext";
import { useData } from "~/context/DataContext";
import { useState, useEffect } from "react";
import { camionAPI } from "~/backend/sheetServices";
import { useNavigate } from "react-router";
import { prepareUpdatePayload } from "~/utils/prepareUpdatePayload";

export function useCamionForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { showLoading, showSuccess, showError, showInfo } = useUIModals();
  const { pedido, getPedidos } = useData();
  const isEditMode = Boolean(pedido);
  const { camion } = pedido || {};
  const existingPedido = camion || null;
  const form = useForm<CamionBD>({
    defaultValues: existingPedido
      ? {
          ...existingPedido,
          // Mapear campos existentes a los nuevos campos estructurados
        }
      : {
          pedido_id: pedido?.id,
          patente: "",
          marca: "",
          modelo: "",
          tipo_larguero: "",
          med_larguero: 0,
          observaciones: "",
        },
  });
  useEffect(() => {}, [form.formState.dirtyFields]);
  const handleSubmit = async (formData: CamionBD) => {
    try {
      showLoading();
      if (existingPedido) {
        // Verificar si hay cambios en el formulario
        const hasDirtyFields =
          form.formState.dirtyFields &&
          Object.keys(form.formState.dirtyFields).length > 0;

        // Si no hay campos dirty y no hay cambios de dirección, no actualizar
        if (!hasDirtyFields) {
          showInfo("No se realizaron cambios en el formulario.");
          return;
        }

        const updatePayload = prepareUpdatePayload<CamionBD>({
          dirtyFields: form.formState.dirtyFields,
          formData: formData,
        });
        const response = await camionAPI.update(
          existingPedido?.id || "",
          updatePayload
        );
        if (!response.success) {
          throw new Error(
            response.message || "Error desconocido al actualizar el camión"
          );
        }
      } else {
        const response = await camionAPI.create(formData);
        if (!response.success) {
          throw new Error(
            response.message || "Error desconocido al crear el camión"
          );
        }
      }
      getPedidos();
      form.reset(formData); // Resetea el formulario con los datos actuales
      showSuccess("Camión actualizado exitosamente");
    } catch (error) {
      showError(
        typeof error === "string" ? error : "Error al guardar el camión"
      );
    }
  };
  const resetForm = () => {
    form.reset();
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
    submitButtonText: isEditMode ? "Actualizar Camión" : "Iniciar Camión",
    formTitle: isEditMode ? "Editar Camión" : "Nuevo Camión",
  };
}
