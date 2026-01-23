import { useSettingsData } from "~/config/settingsConfigCarrozado";
import SidebarConfig from "~/components/SidebarConfig";
import { useState, useMemo, useCallback, useEffect } from "react";
import { capitalize } from "~/config/settingsConfig";
import { EntityTable } from "~/components/EntityTable";
import { Button, IconButton } from "~/components/Buttons";
import { Trash2Icon } from "lucide-react";
import NoDataComponent from "~/components/NoDataComponent";
import { ButtonAdd } from "~/components/Buttons";
import LoadingComponent from "~/components/LoadingComponent";
import { useUIModals } from "~/context/ModalsContext";
import SettingsFormModal from "~/components/modals/customs/SettingsFormModal";
import { useParams } from "react-router";
import { carrozadoAPI } from "~/backend/sheetServices";
import { ImageUp } from "lucide-react";
import { AddImageModal } from "~/components/modals/customs/AddImageModal";
export default function SettingsLayoutCarrozado() {
  const { carrozadoId } = useParams();
  const [activeTab, setActiveTab] = useState("valores por defecto");
  const { isLoading, itemsConfiguraciones, controlCarrozado, defaults } =
    useSettingsData(carrozadoId);
  const [carrozadoNombre, setCarrozadoNombre] = useState<string>("");
  useEffect(() => {
    const getNombreCarrozado = async () => {
      if (carrozadoId) {
        const response = await carrozadoAPI.read({ value: carrozadoId });
        if (!response.success || !response.data) return;
        const dataArray = Array.isArray(response.data)
          ? response.data
          : [response.data];
        const carrozado = dataArray.find((c: any) => c.id === carrozadoId);
        if (carrozado) {
          setCarrozadoNombre(carrozado.nombre);
        }
      }
    };
    getNombreCarrozado();
  }, [carrozadoId]);

  const { openModal } = useUIModals();
  const validateUniqueItemOnCarrozado = useCallback(
    (atributo: string, configType: string): boolean => {
      try {
        const normalizedAtributo = atributo.trim().toLowerCase();
        if (!normalizedAtributo) {
          return false;
        }

        let exists: boolean = false;
        switch (configType) {
          case "valores por defecto":
            exists =
              defaults?.some(
                (item) =>
                  item.atributo &&
                  item.atributo.trim().toLowerCase() === normalizedAtributo
              ) || false;
            break;
          case "control de carrozado":
            exists =
              controlCarrozado?.some(
                (item) =>
                  item.item_control_id &&
                  item.item_control_id.trim().toLowerCase() ===
                    normalizedAtributo
              ) || false;
            break;
          default:
            return true;
        }
        return !exists; // Retorna true si NO existe (validación exitosa)
      } catch (error) {
        console.error("Error validando nombre único:", error);
        return false;
      }
    },
    [defaults, controlCarrozado, carrozadoId]
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
      const defaultData =
        mode === "create"
          ? { activo: true, carrozado_id: carrozadoId, ...data }
          : data;
      openModal("CUSTOM", {
        component: SettingsFormModal,
        props: {
          title:
            mode === "create"
              ? `Agregar ${configTitle}`
              : `Editar ${configTitle}`,
          fields: form,
          onSubmit: async (
            data: any,
            { reset, setSuccessMessage, setErrorMessage }: any
          ) => {
            if (mode === "create") {
              const itemToValidate =
                configTitle === "valores por defecto"
                  ? data.atributo
                  : configTitle === "control de carrozado"
                    ? data.item_control_id
                    : null;
              const isValid = validateUniqueItemOnCarrozado(
                itemToValidate,
                configTitle
              );

              if (!isValid) {
                setErrorMessage(
                  `Ya existe un ${configTitle.slice(0, -1)} con el atributo "${data.atributo}" para este carrozado. Por favor, utiliza un nombre diferente.`
                );
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
    [validateUniqueItemOnCarrozado, carrozadoId, openModal]
  );
  const handleOpenModalImage = () => {
    openModal("CUSTOM", {
      component: AddImageModal,
      props: {carrozadoId}
    });
  }
  const handleDelete = useCallback((row: any) => {
    // Lógica para eliminar el registro
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
    try {
    } catch (e) {}
  }, []);
  const handleOnRowClick = useCallback(
    (row: any) => {
      // Lógica para manejar el clic en la fila
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
                      <div className="flex justify-between items-center mb-6">
                        <span className="inline-flex items-center gap-2 font-bold text-xl text-text-primary dark:text-white">
                          <span className="scale-125">{item.icon}</span>
                          <h2 className="">
                            {carrozadoNombre} -{" "}
                            <code>{capitalize(item.title)}</code>
                          </h2>
                        </span>
                        <div className="w-fit">
                          <Button variant="blue" onClick={handleOpenModalImage} disabled>
                            <ImageUp className="inline mr-2 h-5 w-5" />
                            Agregar imagen
                          </Button>
                        </div>
                      </div>
                      <EntityTable
                        key={item.title}
                        alternativeStorageKey={`entityTableFilters_settings_${item.title}`}
                        columns={[...item.columns, actionColumn]}
                        data={item.data}
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
