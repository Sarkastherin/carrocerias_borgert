import { set, useForm } from "react-hook-form";
import type { CarroceriaBD, DocumentosBD } from "~/types/pedidos";
import { useUIModals } from "~/context/ModalsContext";
import { useData } from "~/context/DataContext";
import { useState, useEffect } from "react";
import { carroceriaAPI } from "~/backend/sheetServices";
import { prepareUpdatePayload } from "~/utils/prepareUpdatePayload";
import { useFormNavigationBlock } from "./useFormNavigationBlock";
import {
  updateFilePDFPedidos,
  type FileTypeActions,
} from "~/components/FileUpladerComponent";
type CarroceriaFormData = CarroceriaBD & {
  documentos?: DocumentosBD[] | null;
};
export function useCarroceriaForm(
  files: FileTypeActions,
  setFiles: React.Dispatch<React.SetStateAction<FileTypeActions>>,
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
  const { carroceria, id, numero_pedido, documentos } = pedido || {};
  const existingPedido = carroceria || null;

  const form = useForm<CarroceriaFormData>({
    defaultValues: existingPedido
      ? {
          ...existingPedido,
          documentos: documentos || null,
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
          alargue_tipo_2: "N/A",
          cant_alargue_2: 0,
          med_alargue_2: 0,
          quiebre_alargue_2: false,
          observaciones: "",
          documentos: null,
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
  const addFiles = async ({
    id,
    numero_pedido,
    files,
    formData,
  }: {
    id: string;
    numero_pedido: string;
    files: FileList;
    formData: CarroceriaFormData;
  }) => {
    const response = await uploadFilesToPedidos(
      id,
      numero_pedido,
      files,
      "carroceria",
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
    formData: CarroceriaFormData;
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
  const handleSubmit = async (formData: CarroceriaFormData) => {
    try {
      setIsLoading(true);
      showLoading();
      let updated = false;
      let created = false;
      let uploaded = false;
      let isNew = false;
      if (existingPedido) {
        // Verificar si hay cambios en el formulario
        const hasDirtyFields =
          form.formState.dirtyFields &&
          Object.keys(form.formState.dirtyFields).length > 0;

        // Si no hay campos dirty, no actualizar
        if (!hasDirtyFields && (!files || (!files.add && !files.remove))) {
          setIsLoading(false);
          showInfo("No se realizaron cambios en el formulario.");
          return;
        }
        if (hasDirtyFields) {
          const updatePayload = prepareUpdatePayload<CarroceriaBD>({
            dirtyFields: form.formState.dirtyFields,
            formData: formData,
          });
          const response = await carroceriaAPI.update(
            existingPedido?.id || "",
            updatePayload,
          );
          if (!response.success) {
            throw new Error(
              response.message ||
                "Error desconocido al actualizar la carrocería",
            );
          }
          await refreshPedidoByIdAndTable("carroceria");
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
        const response = await carroceriaAPI.create(formData);
        if (!response.success) {
          throw new Error(
            response.message || "Error desconocido al crear carrocería",
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
          await refreshPedidoByIdAndTable("carroceria");
          await refreshPedidoByIdAndTable("documentos");
          uploaded = true;
        }
      }
      if (updated || created || uploaded) {
        // Usar los valores actuales del formulario (incluyendo documentos actualizados)
        form.reset(form.getValues());
        setIsLoading(false);
        if (isNew) {
          showSuccess("Carrocería creada exitosamente");
        } else {
          showSuccess("Carrocería actualizada exitosamente");
        }
      }
    } catch (error) {
      setIsLoading(false);
      showError(
        typeof error === "string" ? error : "Error al guardar la carrocería",
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
    form.reset({
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
    });
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
