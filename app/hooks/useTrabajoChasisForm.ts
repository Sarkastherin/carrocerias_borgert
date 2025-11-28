import { useForm, useFieldArray } from "react-hook-form";
import type { TrabajoChasisBD } from "~/types/pedidos";
import { useUIModals } from "~/context/ModalsContext";
import { useData } from "~/context/DataContext";
import { useState } from "react";
import { trabajoChasisAPI } from "~/backend/sheetServices";
import { useFormNavigationBlock } from "./useFormNavigationBlock";
export function useTrabajoChasisForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);

  const { showLoading, showSuccess, showError, showInfo, closeModal } =
    useUIModals();
  const { pedido, getPedidos, refreshPedidoByIdAndTable } = useData();
  const isEditMode = Boolean(pedido);
  const { trabajo_chasis } = pedido || {};
  const existingPedido = trabajo_chasis || null;
  const defaultValuesEmpty: Partial<TrabajoChasisBD> = {
    pedido_id: pedido?.id,
    tipo_trabajo_id: "",
    descripcion: "",
  };

  const form = useForm<{ trabajo_chasis: Partial<TrabajoChasisBD>[] }>({
    defaultValues: existingPedido
      ? {
          trabajo_chasis: existingPedido,
        }
      : {
          trabajo_chasis: [defaultValuesEmpty],
        },
  });
  // Hook para bloquear navegación si hay cambios sin guardar
      useFormNavigationBlock({
        isDirty: form.formState.isDirty,
        isSubmitSuccessful: form.formState.isSubmitSuccessful,
        message: "Tienes cambios sin guardar en los trabajos en chasis. Si sales ahora, perderás todos los cambios realizados.",
        title: "¿Salir sin guardar?",
        confirmText: "Sí, salir",
        cancelText: "No, continuar editando",
      });
  const fieldsArray = useFieldArray({
    control: form.control,
    name: "trabajo_chasis",
  });

  const handleSubmit = async (formData: {
    trabajo_chasis: Partial<TrabajoChasisBD>[];
  }) => {
    try {
      setIsLoading(true);
      showLoading();
      if (existingPedido) {
        // Verificar si hay cambios en el formulario
        const hasDirtyFields =
          form.formState.dirtyFields &&
          Object.keys(form.formState.dirtyFields).length > 0;

        // Si no hay campos dirty y no hay IDs eliminados, no actualizar
        if (!hasDirtyFields && deletedIds.length === 0) {
          setIsLoading(false);
          showInfo("No se realizaron cambios en el formulario.");
          return;
        }
        const dirtyFields = form.formState.dirtyFields["trabajo_chasis"] ?? [];
        const data = formData.trabajo_chasis;
        await Promise.all(
          data.map(async (trabajo, index) => {
            const hasId = "id" in trabajo && trabajo.id;
            const dirty = dirtyFields[index];
            if (hasId && dirty && trabajo.id) {
              const fieldsChanged = Object.keys(
                dirty
              ) as (keyof TrabajoChasisBD)[];
              const updates = fieldsChanged.reduce((acc, key) => {
                acc[key] = trabajo[key];
                return acc;
              }, {} as Partial<TrabajoChasisBD>);
              const response = await trabajoChasisAPI.update(
                trabajo.id,
                updates
              );
              if (!response.success) {
                throw new Error(
                  response.message ||
                    "Error desconocido al actualizar trabajo de chasis"
                );
              }
            }
            if (!hasId) {
              const response = await trabajoChasisAPI.create(trabajo as Omit<TrabajoChasisBD, "id">);
              if (!response.success) {
                throw new Error(
                  response.message || "Error desconocido al crear trabajo de chasis"
                );
              }
            }
          })
        );
        for (const id of deletedIds) {
          const response = await trabajoChasisAPI.delete(id);
          if (!response.success) {
            throw new Error(
              response.message || "Error desconocido al eliminar trabajo de chasis"
            );
          }
        }
        setDeletedIds([]); // Limpiar IDs eliminados después de procesar
      } else {
        await Promise.all(
          formData.trabajo_chasis.map(async (trabajo) => {
            const response = await trabajoChasisAPI.create(trabajo as Omit<TrabajoChasisBD, "id">);
            if (!response.success) {
              throw new Error(
                response.message || "Error desconocido al crear trabajo de chasis"
              );
            }
          })
        );
      }
      await refreshPedidoByIdAndTable("trabajo_chasis");
      form.reset(formData); // Resetea el formulario con los datos actuales
      setIsLoading(false);
      showSuccess("Trabajos de chasis guardados exitosamente");
    } catch (error) {
      setIsLoading(false);
      showError(
        typeof error === "string" ? error : "Error al guardar el trabajo de chasis"
      );
    }
  };
  const resetForm = () => {
    form.reset();
  };
  const handleRemove = (index: number) => {
    const currentItems = form.watch("trabajo_chasis");
    const item = currentItems[index];
    if (item?.id) {
      setDeletedIds((prev) => [...prev, item.id!]);
    }
    fieldsArray.remove(index);
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
    fieldsArray,

    // Custom submit handler
    onSubmit: handleSubmit,
    isLoading,
    isEditMode,
    defaultValuesEmpty,
    handleRemove,

    // Helper texts
    submitButtonText: isEditMode ? "Actualizar Trabajos" : "Iniciar Trabajos",
    formTitle: isEditMode ? "Editar Trabajos" : "Nuevo Trabajos",
  };
}
