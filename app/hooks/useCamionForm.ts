import { useForm } from "react-hook-form";
import type { CamionBD } from "~/types/pedidos";
import { useUIModals } from "~/context/ModalsContext";
import { useData } from "~/context/DataContext";
import { useState } from "react";
import { camionAPI } from "~/backend/sheetServices";
import { prepareUpdatePayload } from "~/utils/prepareUpdatePayload";
import { useFormNavigationBlock } from "./useFormNavigationBlock";

export function useCamionForm() {
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
          centro_eje: 0,
          voladizo_trasero: 0,
        },
  });
  
  // Hook para bloquear navegación si hay cambios sin guardar
  useFormNavigationBlock({
    isDirty: form.formState.isDirty,
    isSubmitSuccessful: form.formState.isSubmitSuccessful,
    message: "Tienes cambios sin guardar en el camión. Si sales ahora, perderás todos los cambios realizados.",
    title: "¿Salir sin guardar?",
    confirmText: "Sí, salir",
    cancelText: "No, continuar editando",
  });
  
  const handleSubmit = async (formData: CamionBD) => {
    try {
      setIsLoading(true);
      showLoading();
      if (existingPedido) {
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
      await getPedidos();
      form.reset(formData); // Resetea el formulario con los datos actuales
      setIsLoading(false);
      showSuccess("Camión guardado exitosamente");
    } catch (error) {
      setIsLoading(false);
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
