import { useForm, useFieldArray } from "react-hook-form";
import type { TrabajoChasisBD } from "~/types/pedidos";
import { useUIModals } from "~/context/ModalsContext";
import { useData } from "~/context/DataContext";
import { useState, useEffect } from "react";
import { trabajoChasisAPI } from "~/backend/sheetServices";
import { useNavigate } from "react-router";
import { prepareUpdatePayload } from "~/utils/prepareUpdatePayload";

export function useTrabajoChasisForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);

  const { showLoading, showSuccess, showError, showInfo, closeModal } =
    useUIModals();
  const { pedido, getPedidos } = useData();
  const isEditMode = Boolean(pedido);
  const { trabajo_chasis } = pedido || {};
  const existingPedido = trabajo_chasis || null;
  const defaulValuesEmpty = {
    pedido_id: pedido?.id,
    tipo_trabajo: "",
    descripcion: "",
    observaciones: "",
  } as TrabajoChasisBD;

  const form = useForm<{ trabajo_chasis: TrabajoChasisBD[] }>({
    defaultValues: existingPedido
      ? {
          trabajo_chasis: existingPedido,
        }
      : {
          trabajo_chasis: [defaulValuesEmpty],
        },
  });
  const fieldsArray = useFieldArray({
    control: form.control,
    name: "trabajo_chasis",
  });
  useEffect(() => {
    //console.log(form.formState.dirtyFields)
  }, [form.formState.dirtyFields]);
  const handleSubmit = async (formData: {
    trabajo_chasis: TrabajoChasisBD[];
  }) => {
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
        const dirtyFields = form.formState.dirtyFields["trabajo_chasis"] ?? [];
        const data = formData.trabajo_chasis;
        await Promise.all(
          data.map(async (trabajo, index) => {
            const hasId = "id" in trabajo && trabajo.id;
            const dirty = dirtyFields[index];
            if (hasId && dirty) {
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
              const response = await trabajoChasisAPI.create(trabajo);
              if (!response.success) {
                throw new Error(
                  response.message || "Error desconocido al crear carrocería"
                );
              }
            }
          })
        );
        for (const id of deletedIds) {
          const response = await trabajoChasisAPI.delete(id);
          if (!response.success) {
            throw new Error(
              response.message || "Error desconocido al eliminar carrocería"
            );
          }
        }
      } else {
        await Promise.all(
          formData.trabajo_chasis.map(async (trabajo) => {
            const response = await trabajoChasisAPI.create(trabajo);
            if (!response.success) {
              throw new Error(
                response.message || "Error desconocido al crear carrocería"
              );
            }
          })
        );
      }
      getPedidos();
      form.reset(formData); // Resetea el formulario con los datos actuales
      showSuccess("Trabajos de chasis guardados exitosamente");
    } catch (error) {
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
    if (item && item.id) {
      setDeletedIds((prev) => [...prev, item.id]);
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
    defaulValuesEmpty,
    handleRemove,

    // Helper texts
    submitButtonText: isEditMode ? "Actualizar Trabajos" : "Iniciar Trabajos",
    formTitle: isEditMode ? "Editar Trabajos" : "Nuevo Trabajos",
  };
}
