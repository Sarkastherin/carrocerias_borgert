import { useForm } from "react-hook-form";
import type { CarroceriaBD } from "~/types/pedidos";
import { useUIModals } from "~/context/ModalsContext";
import { useData } from "~/context/DataContext";
import { useState, useEffect } from "react";
import { carroceriaAPI } from "~/backend/sheetServices";
import { prepareUpdatePayload } from "~/utils/prepareUpdatePayload";
import { useFormNavigationBlock } from "./useFormNavigationBlock";

export function useCarroceriaForm() {
  const [isLoading, setIsLoading] = useState(false);

  const { showLoading, showSuccess, showError, showInfo } = useUIModals();
  const { pedido, getPedidos } = useData();
  const isEditMode = Boolean(pedido);
  const { carroceria } = pedido || {};
  const existingPedido = carroceria || null;

  const form = useForm<CarroceriaBD>({
    defaultValues: existingPedido
      ? {
          ...existingPedido,
          // Mapear campos existentes a los nuevos campos estructurados
        }
      : {
          pedido_id: pedido?.id,
          tipo_carrozado_id: "",
          largo_int: 0,
          largo_ext: 0,
          material: "",
          ancho_ext: 0,
          alto: 0,
          alt_baranda: 0,
          ptas_por_lado: 0,
          puerta_trasera_id: "",
          arcos_por_puerta: 0,
          corte_guardabarros: false,
          cumbreras: false,
          espesor_chapa: "",
          tipo_zocalo: "",
          lineas_refuerzo: 0,
          cuchetin: false,
          med_cuchetin: 0,
          alt_pta_cuchetin: 0,
          alt_techo_cuchetin: 0,
          color_lona: "",
          tipo_piso: "",
          color_carrozado_id: "",
          color_zocalo_id: "",
          notas_color: "",
          boquillas: 0,
          med_cajon_herramientas: 0,
          luces: 0,
          med_alargue: 0,
          quiebre_alargue: false,
          observaciones: "",
        },
  });
  // Hook para bloquear navegación si hay cambios sin guardar
  useFormNavigationBlock({
    isDirty: form.formState.isDirty,
    isSubmitSuccessful: form.formState.isSubmitSuccessful,
    message: "Tienes cambios sin guardar en la carrocería. Si sales ahora, perderás todos los cambios realizados.",
    title: "¿Salir sin guardar?",
    confirmText: "Sí, salir",
    cancelText: "No, continuar editando",
  });
  const handleSubmit = async (formData: CarroceriaBD) => {
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

        const updatePayload = prepareUpdatePayload<CarroceriaBD>({
          dirtyFields: form.formState.dirtyFields,
          formData: formData,
        });
        const response = await carroceriaAPI.update(
          existingPedido?.id || "",
          updatePayload
        );
        if (!response.success) {
          throw new Error(
            response.message || "Error desconocido al actualizar la carrocería"
          );
        }
      } else {
        const response = await carroceriaAPI.create(formData);
        if (!response.success) {
          throw new Error(
            response.message || "Error desconocido al crear carrocería"
          );
        }
      }
      await getPedidos();
      form.reset(formData); // Resetea el formulario con los datos actuales
      setIsLoading(false);
      showSuccess("Carrocería guardada exitosamente");
    } catch (error) {
      setIsLoading(false);
      showError(
        typeof error === "string" ? error : "Error al guardar la carrocería"
      );
    }
  };
  const handleChangeFieldCuchetin = () => {
    const cuchetinValue = form.watch("cuchetin");
    if (!cuchetinValue) {
      form.setValue("med_cuchetin", 0);
      form.setValue("alt_pta_cuchetin", 0);
      form.setValue("alt_techo_cuchetin", 0);
    }
  };
  const resetForm = () => {
    form.reset();
  };
  
  useEffect(() => {
    handleChangeFieldCuchetin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch("cuchetin")]);
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
    submitButtonText: isEditMode
      ? "Actualizar Carrocería"
      : "Iniciar Carrocería",
    formTitle: isEditMode ? "Editar Carrocería" : "Nuevo Carrocería",
  };
}
