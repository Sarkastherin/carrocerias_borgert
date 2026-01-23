import type { Route } from "../+types/home";
import { useMemo, useCallback, useState } from "react";
import { EntityTable } from "~/components/EntityTable";
import { ButtonAdd, IconButton } from "~/components/Buttons";
import NoDataComponent from "~/components/NoDataComponent";
import SettingsFormModal from "~/components/modals/customs/SettingsFormModal";
import { useUIModals } from "~/context/ModalsContext";
import {
  carroceriaAPI,
  pedidosAPI,
  trabajoChasisAPI,
  controlCarrozadoAPI,
} from "~/backend/sheetServices";
import { useSettingsData, capitalize } from "~/config/settingsConfig";
import LoadingComponent from "~/components/LoadingComponent";
import { Trash2Icon } from "lucide-react";
import SidebarConfig from "~/components/SidebarConfig";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Parametros" },
    { name: "description", content: "Parametros Generales" },
  ];
}

export default function SettingsLayout() {
  const [activeTab, setActiveTab] = useState("colores");
  const { openModal } = useUIModals();

  // Usar el hook personalizado que maneja toda la lógica de datos
  const {
    isLoading,
    itemsConfiguraciones,
    colores,
    carrozados,
    puertasTraseras,
    configTrabajosChasis,
  } = useSettingsData();

  const validateUniqueNameBeforeCreate = useCallback(
    (name: string, configType: string, additionalData?: any): boolean => {
      try {
        if (configType === "personal") {
          return true;
        }

        const normalizedName = name.trim().toLowerCase();
        if (!normalizedName) {
          return false;
        }

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
            return true;
        }

        // Para colores, validar considerando también el tipo (esmalte/lona)
        if (configType === "colores" && additionalData?.tipo) {
          const exists = currentData.some(
            (item) =>
              item.nombre &&
              item.nombre.trim().toLowerCase() === normalizedName &&
              item.tipo === additionalData.tipo
          );
          return !exists;
        }

        // Para otros tipos de configuración, validar solo por nombre
        const exists = currentData.some(
          (item) =>
            item.nombre && item.nombre.trim().toLowerCase() === normalizedName
        );

        return !exists;
      } catch (error) {
        console.error("Error validando nombre único:", error);
        return false;
      }
    },
    [colores, carrozados, puertasTraseras, configTrabajosChasis]
  );

  const validateElementInUse = useCallback(
    async (elementId: string, configType: string) => {
      try {
        if (
          ![
            "colores",
            "carrozado",
            "puertas traseras",
            "personal",
            "tipos de trabajos",
            "items de control",
          ].includes(configType)
        ) {
          console.log("Retornando early return - configType no válido");
          return { inUse: false, count: 0 };
        }

        switch (configType) {
          case "colores":
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
            const response1 = await carroceriaAPI.read({
              columnName: "tipo_carrozado_id",
              value: elementId,
              multiple: true,
            });
            const count1 =
              response1.success && response1.data
                ? Array.isArray(response1.data)
                  ? response1.data.length
                  : 1
                : 0;
            return { inUse: count1 > 0, count: count1 };

          case "puertas traseras":
            const response2 = await carroceriaAPI.read({
              columnName: "puerta_trasera_id",
              value: elementId,
              multiple: true,
            });
            const count2 =
              response2.success && response2.data
                ? Array.isArray(response2.data)
                  ? response2.data.length
                  : 1
                : 0;
            return { inUse: count2 > 0, count: count2 };

          case "personal":
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

          case "items de control":
            const responseControlCarrozado = await controlCarrozadoAPI.read({
              columnName: "item_control_id",
              value: elementId,
              multiple: true,
            });
            const controlCount =
              responseControlCarrozado.success && responseControlCarrozado.data
                ? Array.isArray(responseControlCarrozado.data)
                  ? responseControlCarrozado.data.length
                  : 1
                : 0;
            return { inUse: controlCount > 0, count: controlCount };
        }

        return { inUse: false, count: 0 };
      } catch (error) {
        console.error("Error validando uso del elemento:", error);
        return { inUse: true, count: 1 };
      }
    },
    []
  );

  const handleOpenForm = useCallback(
    ({
      form,
      mode,
      api,
      data,
      configTitle,
      reloadData,
    }: {
      form: any;
      mode: "create" | "edit";
      api: any;
      data?: any;
      configTitle: string;
      reloadData: () => Promise<any>;
    }) => {
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
              if (
                !validateUniqueNameBeforeCreate(data.nombre, configTitle, data)
              ) {
                let errorMessage = `Ya existe un ${configTitle.slice(0, -1)} con el nombre "${data.nombre}"`;

                // Para colores, incluir información del tipo en el mensaje de error
                if (configTitle === "colores" && data.tipo) {
                  errorMessage += ` del tipo "${data.tipo}"`;
                }

                errorMessage += ". Por favor, utiliza un nombre diferente.";

                setErrorMessage(errorMessage);
                return { success: false, keepOpen: true };
              }

              const response = await api.create(data);
              if (response.success) {
                await reloadData();
                reset();
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
                await reloadData();
                setSuccessMessage("¡Registro actualizado exitosamente!");
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
    },
    [openModal, validateUniqueNameBeforeCreate]
  );

  const handleOnRowClick = useCallback(
    (row: any) => {
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
          reloadData: activeItem.reloadData,
        });
      }
    },
    [itemsConfiguraciones, activeTab, handleOpenForm]
  );

  const handleDelete = useCallback(
    async (row: any) => {
      try {
        const isUsed = await validateElementInUse(row.id, activeTab);

        if (isUsed.inUse) {
          openModal("ERROR", {
            title: "⚠️ Elemento en Uso",
            message: `No se puede eliminar este ${activeTab.slice(0, -1)} porque está siendo usado en ${isUsed.count} pedido(s). Para eliminarlo, primero debes actualizar o eliminar los pedidos que lo utilizan.`,
          });
          return;
        }

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
                await activeItem.reloadData();
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
    },
    [validateElementInUse, activeTab, openModal, itemsConfiguraciones]
  );

  const actionColumn = useMemo(
    () => ({
      name: "Acciones",
      cell: (row: any) => (
        <div>
          <IconButton
            variant="outlineRed"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row);
            }}
          >
            <Trash2Icon className="size-4.5" />
          </IconButton>
        </div>
      ),
      width: "90px",
    }),
    [handleDelete]
  );

  return (
    <div className="flex" style={{ minHeight: "calc(100vh - 67px)" }}>
      {!isLoading && itemsConfiguraciones ? (
        <>
          <SidebarConfig
            itemsConfiguraciones={itemsConfiguraciones}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
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
                        alternativeStorageKey={`entityTableFilters_settings_${item.title}`}
                        columns={[...item.columns, actionColumn]}
                        data={item.data.sort((a: any, b: any) =>
                          a.nombre.localeCompare(b.nombre)
                        )}
                        filterFields={item.filterFields}
                        onRowClick={handleOnRowClick}
                        inactiveField="activo"
                        noDataComponent={
                          <NoDataComponent
                            word={capitalize(item.title)}
                            onClick={() =>
                              handleOpenForm({
                                form: item.formFields,
                                mode: "create",
                                api: item.api,
                                configTitle: item.title,
                                reloadData: item.reloadData,
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
                            reloadData: item.reloadData,
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
