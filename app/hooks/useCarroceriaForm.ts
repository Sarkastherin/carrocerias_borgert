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
  const { pedido, getPedidos, refreshPedidoByIdAndTable } = useData();
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
          /* datos generales */
          tipo_carrozado_id: "",
          largo_int: null,
          largo_ext: null,
          material: "",
          ancho_ext: null,
          alto: null,
          alt_baranda: null,
          ptas_por_lado: null,
          puerta_trasera_id: "",
          arcos_por_puerta: null,
          tipos_arcos: "",
          corte_guardabarros: false,
          cumbreras: false,
          espesor_chapa: "",
          tipo_zocalo: "",
          lineas_refuerzo: null,
          tipo_piso: "",
          /* cuchetin */
          cuchetin: false,
          med_cuchetin: 0,
          alt_pta_cuchetin: 0,
          alt_techo_cuchetin: 0,
          notas_cuchetin: "",
          /* color */
          color_lona_id: "",
          color_carrozado_id: "",
          color_zocalo_id: "",
          notas_color: "",
          /* Boquillas */
          boquillas: null,
          tipo_boquillas: "",
          ubicacion_boquillas: "",
          /* Cajon de herramientas */
          med_cajon_herramientas: null,
          ubicacion_cajon_herramientas: "",
          /* Accesorios */
          luces: null,
          guardabarros: false,
          dep_agua: false,
          ubicacion_dep_agua: "",
          cintas_reflectivas: "",
          /* Alargue */
          alargue_tipo_1: "N/A",
          cant_alargue_1: 0,
          med_alargue_1: 0,
          quiebre_alargue_1: false,
          alargue_tipo_2: "",
          cant_alargue_2: 0,
          med_alargue_2: 0,
          quiebre_alargue_2: false,
          observaciones: "",
        },
  });
  // Hook para bloquear navegación si hay cambios sin guardar
  useFormNavigationBlock({
    isDirty: form.formState.isDirty,
    isSubmitSuccessful: form.formState.isSubmitSuccessful,
    message:
      "Tienes cambios sin guardar en la carrocería. Si sales ahora, perderás todos los cambios realizados.",
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
      await refreshPedidoByIdAndTable("carroceria");
      await getPedidos(); // Refresca la lista de pedidos
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
  const handleChangeFieldAlargue1 = () => {
    const alargue1Value = form.watch("alargue_tipo_1");
    if (alargue1Value === "N/A" || alargue1Value === "") {
      form.setValue("cant_alargue_1", 0, { shouldDirty: true });
      form.setValue("med_alargue_1", 0, { shouldDirty: true });
      form.setValue("quiebre_alargue_1", false, { shouldDirty: true });
    }
  };
  const handleChangeFieldAlargue2 = () => {
    const alargue2Value = form.watch("alargue_tipo_2");
    if (alargue2Value === "N/A" || alargue2Value === "") {
      form.setValue("cant_alargue_2", 0, { shouldDirty: true });
      form.setValue("med_alargue_2", 0, { shouldDirty: true });
      form.setValue("quiebre_alargue_2", false, { shouldDirty: true });
    }
  };
  const resetForm = () => {
    form.reset();
  };

  useEffect(() => {
    handleChangeFieldCuchetin();
  }, [form.watch("cuchetin")]);
  useEffect(() => {
    handleChangeFieldAlargue1();
  }, [form.watch("alargue_tipo_1")]);
  useEffect(() => {
    handleChangeFieldAlargue2();
  }, [form.watch("alargue_tipo_2")]);
  return {
    // Form methods
    register: form.register,
    handleSubmit: form.handleSubmit,
    formState: form.formState,
    resetForm: resetForm,
    setValue: form.setValue,
    getValues: form.getValues,
    watch: form.watch,
    reset: form.reset,

    // Custom submit handler
    onSubmit: handleSubmit,
    isLoading,
    setIsLoading,
    isEditMode,

    // Helper texts
    submitButtonText: isEditMode
      ? "Actualizar Carrocería"
      : "Iniciar Carrocería",
    formTitle: isEditMode ? "Editar Carrocería" : "Nuevo Carrocería",
  };
}
