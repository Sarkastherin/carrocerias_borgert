import type { Route } from "../+types/home";
import { useEffect, useMemo, useState } from "react";
import { useData } from "~/context/DataContext";
import { EntityTable } from "~/components/EntityTable";
import { ButtonAdd, IconButton } from "~/components/Buttons";
import NoDataComponent from "~/components/NoDataComponent";
import SettingsFormModal from "~/components/modals/customs/SettingsFormModal";
import { useUIModals } from "~/context/ModalsContext";
import {
  coloresAPI,
  carrozadoAPI,
  puertasTraserasAPI,
  vendedoresAPI,
  configTrabajoChasisAPI,
  carroceriaAPI,
  pedidosAPI,
  trabajoChasisAPI,
} from "~/backend/sheetServices";
import { settingsConfig, capitalize } from "~/config/settingsConfig";
import { getIcon } from "~/config/settingsIcons";
import LoadingComponent from "~/components/LoadingComponent";
import { Trash2Icon } from "lucide-react";
import { Subheader } from "~/components/Headers";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Parametros" },
    { name: "description", content: "Parametros Generales" },
  ];
}
// Mapeo de APIs disponibles
const apiMap = {
  coloresAPI: coloresAPI,
  carrozadoAPI: carrozadoAPI,
  puertasTraserasAPI: puertasTraserasAPI,
  vendedoresAPI: vendedoresAPI,
  configTrabajoChasisAPI: configTrabajoChasisAPI,
} as const;

type MenuOpenProps = {
  title: string;
  icon: React.ReactNode;
};

export default function SettingsLayout() {
  const {
    colores,
    getColores,
    carrozados,
    getCarrozados,
    puertasTraseras,
    getPuertasTraseras,
    vendedores,
    getVendedores,
    configTrabajosChasis,
    getConfigTrabajosChasis,
  } = useData();
  const [isLoading, setIsLoading] = useState(true);
  const { openModal } = useUIModals();

  //Carga de recursos
  useEffect(() => {
    const loadData = async () => {
      await getColores();
      await getCarrozados();
      await getPuertasTraseras();
      await getVendedores();
      await getConfigTrabajosChasis();
      setIsLoading(false);
    };
    loadData();
  }, []);

  const [activeTab, setActiveTab] = useState("colores");

  // Crear la configuración de items usando la configuración extraída
  const itemsConfiguraciones = useMemo(() => {
    if (isLoading) return null;

    return settingsConfig.map((config) => {
      let data: any[] = [];
      switch (config.title) {
        case "colores":
          data = colores || [];
          break;
        case "carrozado":
          data = carrozados || [];
          break;
        case "puertas traseras":
          data = puertasTraseras || [];
          break;
        case "vendedores":
          data = vendedores || [];
          break;
        case "tipos de trabajos":
          data = configTrabajosChasis || [];
          break;
        default:
          data = [];
      }

      return {
        ...config,
        icon: getIcon(config.icon),
        data: data,
        api: apiMap[config.api as keyof typeof apiMap],
      };
    });
  }, [
    isLoading,
    colores,
    carrozados,
    puertasTraseras,
    vendedores,
    configTrabajosChasis,
  ]);
  const MenuOpen = ({ title, icon }: MenuOpenProps) => {
    return (
      <button
        key={title}
        type="button"
        onClick={() => setActiveTab(title)}
        className={`block rounded-lg px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-[var(--color-primary-muted)] dark:hover:bg-slate-800 hover:text-primary-light ${activeTab === title ? "bg-[var(--color-primary-muted)] dark:bg-slate-800 text-primary-light" : ""}`}
      >
        <div className="flex items-center gap-2">
          {icon}
          {capitalize(title)}
        </div>
      </button>
    );
  };
  const reloadData = async (configTitle: string) => {
    switch (configTitle) {
      case "colores":
        await getColores();
        break;
      case "carrozado":
        await getCarrozados();
        break;
      case "puertas traseras":
        await getPuertasTraseras();
        break;
      case "vendedores":
        await getVendedores();
        break;
      case "tipos de trabajos":
        await getConfigTrabajosChasis();
        break;
    }
  };

  const handleOpenForm = ({
    form,
    mode,
    api,
    data,
    configTitle,
  }: {
    form: any;
    mode: "create" | "edit";
    api: any;
    data?: any;
    configTitle: string;
  }) => {
    // Para crear nuevos registros, establecer valores por defecto
    const defaultData = mode === "create" ? { activo: true, ...data } : data;

    openModal("CUSTOM", {
      component: SettingsFormModal,
      props: {
        title: mode === "create" ? "Crear Nuevo Registro" : "Editar Registro",
        fields: form,
        onSubmit: async (
          data: any,
          { reset, setSuccessMessage, setErrorMessage }: any
        ) => {
          if (mode === "create") {
            // Validar nombre único antes de crear (excepto para vendedores)
            if (!validateUniqueNameBeforeCreate(data.nombre, configTitle)) {
              setErrorMessage(
                `Ya existe un ${configTitle.slice(0, -1)} con el nombre "${data.nombre}". Por favor, utiliza un nombre diferente.`
              );
              return { success: false, keepOpen: true };
            }

            const response = await api.create(data);
            if (response.success) {
              // Recargar los datos después de crear
              await reloadData(configTitle);
              // Reiniciar el formulario
              reset();
              // Mostrar mensaje de éxito
              setSuccessMessage("¡Registro creado exitosamente!");
              return { success: true, keepOpen: true };
            } else {
              setErrorMessage(response.error || "Error al crear el registro");
              return { success: false, keepOpen: true };
            }
          }
          if (mode === "edit") {
            const response = await api.update(data.id, data);
            if (response.success) {
              // Recargar los datos después de actualizar
              await reloadData(configTitle);
              setSuccessMessage("¡Registro actualizado exitosamente!");
              // Para edición: cerrar después de mostrar el mensaje
              setTimeout(() => {
                return { success: true, keepOpen: false };
              }, 1500);
              return { success: true, keepOpen: true, autoClose: 1500 };
            } else {
              setErrorMessage(
                response.error || "Error al actualizar el registro"
              );
              return { success: false, keepOpen: true };
            }
          }
        },
        data: defaultData,
      },
    });
  };
  const handleOnRowClick = (row: any) => {
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
  };
  const actionColumn: any = {
    name: "Acciones",
    cell: (row: any) => (
      <div>
        <IconButton
          variant="outlineRed"
          size="sm"
          onClick={(e) => {
            e.stopPropagation(); // evita que se dispare el onRowClicked
            handleDelete(row);
          }}
        >
          <Trash2Icon className="size-4.5" />
        </IconButton>
      </div>
    ),
    width: "90px",
  };
  const handleDelete = async (row: any) => {
    try {
      // Validar si el elemento está siendo usado antes de eliminar
      const isUsed = await validateElementInUse(row.id, activeTab);

      if (isUsed.inUse) {
        openModal("ERROR", {
          title: "⚠️ Elemento en Uso",
          message: `No se puede eliminar este ${activeTab.slice(0, -1)} porque está siendo usado en ${isUsed.count} pedido(s). Para eliminarlo, primero debes actualizar o eliminar los pedidos que lo utilizan.`,
        });
        return;
      }

      // Si no está en uso, confirmar eliminación
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
              // Recargar los datos después de eliminar
              await reloadData(activeTab);
              openModal("SUCCESS", {
                title: "✅ Eliminación Exitosa",
                message: `El ${activeTab.slice(0, -1)} ha sido eliminado correctamente.`,
              });
            } else {
              const errorMessage =
                typeof response.error === "string"
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
  };

  // Función para validar si un elemento está siendo usado en pedidos
  const validateElementInUse = async (
    elementId: string,
    configType: string
  ) => {
    try {
      // Solo validamos para elementos que se usan en carrocerías
      if (
        ![
          "colores",
          "carrozado",
          "puertas traseras",
          "vendedores",
          "tipos de trabajos",
        ].includes(configType)
      ) {
        return { inUse: false, count: 0 };
      }

      let filterField = "";
      let filterValue = elementId;

      // Determinar qué campo verificar según el tipo de configuración
      switch (configType) {
        case "colores":
          // Para colores, verificamos tanto color_carrozado_id como color_zocalo_id
          const responseCarrozado = await carroceriaAPI.read({
            columnName: "color_carrozado_id",
            value: elementId,
            multiple: true,
          });

          const responseZocalo = await carroceriaAPI.read({
            columnName: "color_zocalo_id",
            value: elementId,
            multiple: true,
          });

          let totalUsages = 0;
          if (responseCarrozado.success && responseCarrozado.data) {
            totalUsages += Array.isArray(responseCarrozado.data)
              ? responseCarrozado.data.length
              : 1;
          }
          if (responseZocalo.success && responseZocalo.data) {
            totalUsages += Array.isArray(responseZocalo.data)
              ? responseZocalo.data.length
              : 1;
          }

          return { inUse: totalUsages > 0, count: totalUsages };

        case "carrozado":
          filterField = "tipo_carrozado_id";
          break;
        case "puertas traseras":
          filterField = "puerta_trasera_id";
          break;
        case "vendedores":
          // Para vendedores, verificamos en la tabla de pedidos
          const responsePedidos = await pedidosAPI.read({
            columnName: "vendedor_id",
            value: elementId,
            multiple: true,
          });

          const pedidosCount =
            responsePedidos.success && responsePedidos.data
              ? Array.isArray(responsePedidos.data)
                ? responsePedidos.data.length
                : 1
              : 0;

          return { inUse: pedidosCount > 0, count: pedidosCount };

        case "tipos de trabajos":
          // Para tipos de trabajos, verificamos en trabajo_chasis
          const responseTrabajo = await trabajoChasisAPI.read({
            columnName: "tipo_trabajo_id",
            value: elementId,
            multiple: true,
          });

          const trabajosCount =
            responseTrabajo.success && responseTrabajo.data
              ? Array.isArray(responseTrabajo.data)
                ? responseTrabajo.data.length
                : 1
              : 0;

          return { inUse: trabajosCount > 0, count: trabajosCount };
      }

      // Para carrozado y puertas traseras, verificamos en carrocerías
      if (filterField) {
        const response = await carroceriaAPI.read({
          columnName: filterField,
          value: filterValue,
          multiple: true,
        });

        const usageCount =
          response.success && response.data
            ? Array.isArray(response.data)
              ? response.data.length
              : 1
            : 0;

        return { inUse: usageCount > 0, count: usageCount };
      }

      return { inUse: false, count: 0 };
    } catch (error) {
      console.error("Error validando uso del elemento:", error);
      // En caso de error, asumimos que está en uso por seguridad
      return { inUse: true, count: 1 };
    }
  };

  // Función para validar nombres únicos antes de crear
  const validateUniqueNameBeforeCreate = (
    name: string,
    configType: string
  ): boolean => {
    try {
      // Los vendedores pueden tener nombres repetidos
      if (configType === "vendedores") {
        return true;
      }

      // Normalizar el nombre para comparación (sin espacios extra, lowercase)
      const normalizedName = name.trim().toLowerCase();

      if (!normalizedName) {
        return false; // Nombre vacío no es válido
      }

      // Obtener los datos actuales según el tipo de configuración
      let currentData: any[] = [];
      switch (configType) {
        case "colores":
          currentData = colores || [];
          break;
        case "carrozado":
          currentData = carrozados || [];
          break;
        case "puertas traseras":
          currentData = puertasTraseras || [];
          break;
        case "tipos de trabajos":
          currentData = configTrabajosChasis || [];
          break;
        default:
          return true; // Si no reconocemos el tipo, permitir
      }

      // Verificar si ya existe un elemento con el mismo nombre
      const exists = currentData.some(
        (item) =>
          item.nombre && item.nombre.trim().toLowerCase() === normalizedName
      );

      return !exists; // Retorna true si NO existe (es único)
    } catch (error) {
      console.error("Error validando nombre único:", error);
      return false; // En caso de error, no permitir por seguridad
    }
  };
  return (
    <div className="flex" style={{ minHeight: "calc(100vh - 67px)" }}>
      {!isLoading && itemsConfiguraciones ? (
        <>
          <div className="flex flex-col justify-between border-e border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700/20">
            <div className="px-4">
              <ul className="mt-6 space-y-1">
                {itemsConfiguraciones.map((item) => (
                  <li key={item.title}>
                    <MenuOpen title={item.title} icon={item.icon} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex-1 py-10 mx-auto px-10">
            {itemsConfiguraciones.length > 0 &&
              itemsConfiguraciones.map((item) => {
                return (
                  activeTab === item.title && (
                    <div key={item.title}>
                      <div className="pb-4 flex items-center">
                        <span className="scale-125 flex items-center gap-2 font-semibold text-text-primary dark:text-white">
                          {item.icon}
                          <h2>{capitalize(item.title)}</h2>
                        </span>
                      </div>
                      <EntityTable
                        key={item.title}
                        alternativeStorageKey={`entityTableFilters_settings_${item.title}`} // Clave única por configuración
                        columns={[...item.columns, actionColumn]}
                        data={item.data}
                        filterFields={item.filterFields}
                        onRowClick={handleOnRowClick}
                        inactiveField="activo" // Campo para identificar elementos inactivos
                        noDataComponent={
                          <NoDataComponent
                            word={capitalize(item.title)}
                            onClick={() =>
                              handleOpenForm({
                                form: item.formFields,
                                mode: "create",
                                api: item.api,
                                configTitle: item.title,
                              })
                            }
                          />
                        }
                      />
                      <ButtonAdd
                        onClick={() =>
                          handleOpenForm({
                            form: item.formFields,
                            mode: "create",
                            api: item.api,
                            configTitle: item.title,
                          })
                        }
                      >
                        Agregar {item.title.slice(0, -1)}
                      </ButtonAdd>
                    </div>
                  )
                );
              })}
          </div>
        </>
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <LoadingComponent content="Cargando configuraciones..." />
        </div>
      )}
    </div>
  );
}
