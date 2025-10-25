import { useForm } from "react-hook-form";
import type { PedidosBD, FabricacionBD } from "~/types/pedidos";
import { useUIModals } from "~/context/ModalsContext";
import { useData } from "~/context/DataContext";
import { useState, useEffect } from "react";
import { fabricacionAPI, pedidosAPI } from "~/backend/sheetServices";
import { useNavigate } from "react-router";
import { prepareUpdatePayload } from "~/utils/prepareUpdatePayload";

export function useCarroceriaForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { showLoading, showSuccess, showError, showInfo } = useUIModals();
  const { pedido, getPedidos } = useData();
  const isEditMode = Boolean(pedido);
  const { fabricacion } = pedido || {};
  const existingPedido = fabricacion || null;

  const form = useForm<FabricacionBD>({
    defaultValues: existingPedido
      ? {
          ...existingPedido,
          // Mapear campos existentes a los nuevos campos estructurados
        }
      : {
          pedido_id: pedido?.id,
          tipo_carrozado: "",
          largo_int: 0,
          largo_ext: 0,
          material: "",
          ancho_ext: 0,
          alto: 0,
          alt_baranda: 0,
          ptas_por_lado: 0,
          puerta_trasera: "",
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
          color_carrozado: "",
          color_zocalo: "",
          notas_color: "",
          boquillas: 0,
          med_cajon_herramientas: 0,
          luces: 0,
          med_alargue: 0,
          quiebre_alargue: false,
          observaciones: "",
        },
  });
  useEffect(() => {
    //console.log(form.formState.dirtyFields)
  }, [form.formState.dirtyFields]);
  const handleSubmit = async (formData: FabricacionBD) => {
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

        const updatePayload = prepareUpdatePayload<FabricacionBD>({
          dirtyFields: form.formState.dirtyFields,
          formData: formData,
        });
        const response = await fabricacionAPI.update(
          existingPedido?.id || "",
          updatePayload
        );
        if (!response.success) {
          throw new Error(
            response.message || "Error desconocido al actualizar el pedido"
          );
        }
      } else {
        const response = await fabricacionAPI.create(formData);
        if (!response.success) {
          throw new Error(
            response.message || "Error desconocido al crear carrocería"
          );
        }
      }
      getPedidos();
      form.reset(formData); // Resetea el formulario con los datos actuales
      showSuccess("Carrocería actualizada exitosamente");
    } catch (error) {
      showError(
        typeof error === "string" ? error : "Error al guardar el carrocería"
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
