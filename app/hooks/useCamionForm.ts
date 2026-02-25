import { useForm } from "react-hook-form";
import type { CamionBD, DocumentosBD } from "~/types/pedidos";
import { useUIModals } from "~/context/ModalsContext";
import { useData } from "~/context/DataContext";
import { useState } from "react";
import { camionAPI } from "~/backend/sheetServices";
import { prepareUpdatePayload } from "~/utils/prepareUpdatePayload";
import { useFormNavigationBlock } from "./useFormNavigationBlock";
import type { FileTypeActions } from "../components/FileUpladerComponent";

type CamionFormData = CamionBD & {
  documentos?: DocumentosBD[] | null;
};
export function useCamionForm(
  files: FileTypeActions<DocumentosBD>,
  setFiles: React.Dispatch<React.SetStateAction<FileTypeActions<DocumentosBD>>>,
) {
  const [isLoading, setIsLoading] = useState(false);

  const { showLoading, showSuccess, showError, showInfo } = useUIModals();
  const {
    pedido,
    refreshPedidoByIdAndTable,
    uploadFilesToPedidos,
    deleteDocumentoPedido,
  } = useData();
  const isEditMode = Boolean(pedido);
  const { camion, id, numero_pedido, documentos } = pedido || {};
  const existingPedido = camion || null;
  const form = useForm<CamionFormData>({
    defaultValues: existingPedido
      ? {
          ...existingPedido,
          documentos: documentos || null,
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
          documentos: null,
        },
  });

  // Hook para bloquear navegación si hay cambios sin guardar
  useFormNavigationBlock({
    isDirty: form.formState.isDirty,
    isSubmitSuccessful: form.formState.isSubmitSuccessful,
    message:
      "Tienes cambios sin guardar en el camión. Si sales ahora, perderás todos los cambios realizados.",
    title: "¿Salir sin guardar?",
    confirmText: "Sí, salir",
    cancelText: "No, continuar editando",
  });
  const addFiles = async ({
    id,
    numero_pedido,
    files,
    formData,
  }: {
    id: string;
    numero_pedido: string;
    files: FileList;
    formData: CamionFormData;
  }) => {
    const response = await uploadFilesToPedidos(
      id,
      numero_pedido,
      files,
      "camion",
    );
    if (!response.success) {
      throw new Error(
        response.message || "Error desconocido al subir los archivos",
      );
    }
    if (response.data && response.data.length > 0) {
      const newDocs = [...(formData.documentos || []), ...response.data];
      formData.documentos = newDocs;
      form.setValue("documentos", newDocs, { shouldDirty: true });
    }
    setFiles((prev) => ({ ...prev, add: null })); // Limpiar archivos a subir después de subirlos
  };
  const deleteFiles = async ({
    files,
    formData,
  }: {
    files: DocumentosBD[];
    formData: CamionFormData;
  }) => {
    const response = await deleteDocumentoPedido(files);
    if (!response.success) {
      throw new Error(
        response.message || "Error desconocido al eliminar el documento",
      );
    }
    if (response.data && response.data.length > 0) {
      const filteredDocs =
        formData.documentos?.filter(
          (doc) =>
            !response.data?.some((deletedDoc) => deletedDoc.id === doc.id),
        ) || null;
      formData.documentos = filteredDocs;
      form.setValue("documentos", filteredDocs, { shouldDirty: true });
    }
    setFiles((prev) => ({ ...prev, remove: null })); // Limpiar archivos a eliminar después de eliminarlos
  };
  const handleSubmit = async (formData: CamionFormData) => {
    try {
      setIsLoading(true);
      showLoading();
      let updated = false;
      let created = false;
      let uploaded = false;
      let isNew = false;

      if (existingPedido) {
        const hasDirtyFields =
          form.formState.dirtyFields &&
          Object.keys(form.formState.dirtyFields).length > 0;

        if (!hasDirtyFields && (!files || (!files.add && !files.remove))) {
          setIsLoading(false);
          showInfo("No se realizaron cambios en el formulario.");
          return;
        }

        if (hasDirtyFields) {
          const updatePayload = prepareUpdatePayload<CamionBD>({
            dirtyFields: form.formState.dirtyFields,
            formData: formData,
          });
          const response = await camionAPI.update(
            existingPedido?.id || "",
            updatePayload,
          );
          if (!response.success) {
            throw new Error(
              response.message || "Error desconocido al actualizar el camión",
            );
          }
          await refreshPedidoByIdAndTable("camion");
          updated = true;
        }
        if (files && id && numero_pedido) {
          if (files.add && files.add.length > 0) {
            await addFiles({ id, numero_pedido, files: files.add, formData });
          }
          if (files.remove && files.remove.length > 0) {
            await deleteFiles({ files: files.remove, formData });
          }
          // Actualizar los documentos en formData con la respuesta del upload
          await refreshPedidoByIdAndTable("documentos");
          uploaded = true;
        }
      } else {
        const response = await camionAPI.create(formData);
        if (!response.success) {
          throw new Error(
            response.message || "Error desconocido al crear el camión",
          );
        }
        created = true;
        isNew = true;
        if (files && (files.add || files.remove) && id && numero_pedido) {
          if (files.add && files.add.length > 0) {
            await addFiles({ id, numero_pedido, files: files.add, formData });
          }
          if (files.remove && files.remove.length > 0) {
            await deleteFiles({ files: files.remove, formData });
          }
          uploaded = true;
        }
      }

      if (updated || created || uploaded) {
        if (uploaded) await refreshPedidoByIdAndTable("documentos");
        if (updated || created) {
          await refreshPedidoByIdAndTable("carroceria");
        }
        // Usar los valores actuales del formulario (incluyendo documentos actualizados)
        form.reset(form.getValues());
        setIsLoading(false);
        if (isNew) {
          showSuccess("Camión guardado exitosamente");
        } else {
          showSuccess("Camión actualizado exitosamente");
        }
      }
    } catch (error) {
      setIsLoading(false);
      showError(
        typeof error === "string" ? error : "Error al guardar el camión",
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
