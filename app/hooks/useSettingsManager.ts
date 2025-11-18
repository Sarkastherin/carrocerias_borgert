import { useEffect, useMemo, useState, useCallback } from "react";
import { useUIModals } from "~/context/ModalsContext";
import { Trash2Icon } from "lucide-react";
import { IconButton } from "~/components/Buttons";
import SettingsFormModal from "~/components/modals/customs/SettingsFormModal";
import { useConfigValidator } from "./useConfigValidator";
import type { 
  UseSettingsManagerProps, 
  UseSettingsManagerReturn, 
  FormHandlerParams,
  SettingsConfig,
  UseConfigValidatorProps
} from "~/types/settingsManager";

export const useSettingsManager = ({
  settingsConfigs,
  dataLoaders,
  apiMap,
  validationMap,
  defaultTab
}: UseSettingsManagerProps): UseSettingsManagerReturn => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(defaultTab || settingsConfigs[0]?.title || "");
  const { openModal } = useUIModals();

  // Cargar todos los datos iniciales
  useEffect(() => {
    const loadAllData = async () => {
      try {
        setIsLoading(true);
        await Promise.all(Object.values(dataLoaders).map(loader => loader()));
      } catch (error) {
        console.error("Error loading settings data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAllData();
  }, []); // Solo ejecutar una vez al montar

  // Recargar datos de una configuración específica
  const reloadData = useCallback(async (configTitle: string) => {
    const loader = dataLoaders[configTitle];
    if (loader) {
      await loader();
    }
  }, []); // Usar referencia estable

  // Crear configuración de validación para el hook useConfigValidator
  const validatorConfig: UseConfigValidatorProps = useMemo(() => {
    const validationRules: Record<string, any> = {};
    const currentData: Record<string, any> = {};

    settingsConfigs.forEach(config => {
      // Reglas de validación basadas en el validationMap o configuración por defecto
      validationRules[config.title] = validationMap?.[config.title] || {
        uniqueNameValidation: config.title !== "personal", // El personal pueden repetir nombres
        usageValidation: validationMap?.[config.title]?.usageValidation
      };

      // Datos actuales para validación
      currentData[config.title] = config.data || [];
    });

    return { validationRules, currentData };
  }, [settingsConfigs, validationMap]);

  // Hook de validación
  const {
    validateUniqueNameBeforeCreate,
    validateBeforeDelete
  } = useConfigValidator(validatorConfig);

  // Configuraciones de items procesadas
  const itemsConfiguraciones = useMemo((): SettingsConfig[] | null => {
    if (isLoading) return null;

    return settingsConfigs.map(config => ({
      ...config,
      api: apiMap[config.api as keyof typeof apiMap] || config.api,
    }));
  }, [isLoading, settingsConfigs, apiMap]);

  // Manejar apertura de formularios
  const handleOpenForm = useCallback(({
    form,
    mode,
    api,
    data,
    configTitle,
  }: FormHandlerParams) => {
    const defaultData = mode === "create" ? { activo: true, ...data } : data;

    openModal("CUSTOM", {
      component: SettingsFormModal,
      props: {
        title: mode === "create" ? "Crear Nuevo Registro" : "Editar Registro",
        fields: form,
        onSubmit: async (
          formData: any,
          { reset, setSuccessMessage, setErrorMessage }: any
        ) => {
          try {
            if (mode === "create") {
              // Validar nombre único antes de crear
              if (formData.nombre && !validateUniqueNameBeforeCreate(formData.nombre, configTitle)) {
                setErrorMessage(
                  `Ya existe un ${configTitle.slice(0, -1)} con el nombre "${formData.nombre}". Por favor, utiliza un nombre diferente.`
                );
                return { success: false, keepOpen: true };
              }

              const response = await api.create(formData);
              if (response.success) {
                await reloadData(configTitle);
                reset();
                setSuccessMessage("¡Registro creado exitosamente!");
                return { success: true, keepOpen: true };
              } else {
                setErrorMessage(response.error || "Error al crear el registro");
                return { success: false, keepOpen: true };
              }
            }

            if (mode === "edit") {
              const response = await api.update(formData.id, formData);
              if (response.success) {
                await reloadData(configTitle);
                setSuccessMessage("¡Registro actualizado exitosamente!");
                return { success: true, keepOpen: true, autoClose: 1500 };
              } else {
                setErrorMessage(response.error || "Error al actualizar el registro");
                return { success: false, keepOpen: true };
              }
            }
          } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "Error desconocido");
            return { success: false, keepOpen: true };
          }
        },
        data: defaultData,
      },
    });
  }, [openModal, reloadData, validateUniqueNameBeforeCreate]);

  // Manejar click en fila
  const handleOnRowClick = useCallback((row: any) => {
    const activeItem = itemsConfiguraciones?.find(
      (item) => item.title === activeTab
    );
    if (activeItem) {
      handleOpenForm({
        form: activeItem.formFields,
        mode: "edit",
        api: activeItem.api,
        data: row,
        configTitle: activeTab,
      });
    }
  }, [itemsConfiguraciones, activeTab, handleOpenForm]);

  // Manejar eliminación
  const handleDelete = useCallback(async (row: any) => {
    try {
      // Validar si se puede eliminar
      const validation = await validateBeforeDelete(row.id, activeTab);

      if (!validation.canDelete) {
        openModal("ERROR", {
          title: "⚠️ Elemento en Uso",
          message: `No se puede eliminar este ${activeTab.slice(0, -1)} porque ${validation.reason}. Para eliminarlo, primero debes actualizar o eliminar los registros que lo utilizan.`,
        });
        return;
      }

      // Confirmar eliminación
      openModal("CONFIRMATION", {
        title: "Confirmar Eliminación",
        message: `¿Estás seguro de que deseas eliminar este ${activeTab.slice(0, -1)}? Esta acción no se puede deshacer.`,
        confirmText: "Eliminar",
        cancelText: "Cancelar",
        onConfirm: async () => {
          const activeItem = itemsConfiguraciones?.find(
            (item) => item.title === activeTab
          );

          if (activeItem) {
            const response = await activeItem.api.delete(row.id);
            if (response.success) {
              await reloadData(activeTab);
              openModal("SUCCESS", {
                title: "✅ Eliminación Exitosa",
                message: `El ${activeTab.slice(0, -1)} ha sido eliminado correctamente.`,
              });
            } else {
              const errorMessage = typeof response.error === "string"
                ? response.error
                : "Error al eliminar el registro";
              throw new Error(errorMessage);
            }
          }
        },
      });
    } catch (error) {
      console.error("Error al eliminar:", error);
      openModal("ERROR", {
        title: "❌ Error",
        message: `Error al eliminar el ${activeTab.slice(0, -1)}: ${error instanceof Error ? error.message : "Error desconocido"}`,
      });
    }
  }, [activeTab, validateBeforeDelete, itemsConfiguraciones, reloadData, openModal]);

  // La columna de acciones se maneja en el componente SettingsManager

  return {
    activeTab,
    setActiveTab,
    isLoading,
    itemsConfiguraciones,
    handleOpenForm,
    handleOnRowClick,
    handleDelete,
    reloadData,
  };
};