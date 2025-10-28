import type { Route } from "../+types/home";
import { useEffect, useMemo, useState } from "react";
import { useData } from "~/context/DataContext";
import { EntityTable } from "~/components/EntityTable";
import { Button, ButtonAdd } from "~/components/Buttons";
import NoDataComponent from "~/components/NoDataComponent";
import SettingsFormModal from "~/components/modals/customs/SettingsFormModal";
import { useUIModals } from "~/context/ModalsContext";
import { coloresAPI, carrozadoAPI,puertasTraserasAPI, vendedoresAPI } from "~/backend/sheetServices";
import { settingsConfig, capitalize } from "~/config/settingsConfig";
import { getIcon } from "~/config/settingsIcons";
import LoadingComponent from "~/components/LoadingComponent";
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
} as const;

type MenuOpenProps = {
  title: string;
  icon: React.ReactNode;
};

export default function SettingsLayout() {
  const { colores, getColores, carrozados, getCarrozados, puertasTraseras, getPuertasTraseras, vendedores, getVendedores } = useData();
  const [isLoading, setIsLoading] = useState(true);
  const { openModal } = useUIModals();

  //Carga de recursos
  useEffect(() => {
    const loadData = async () => {
      await getColores();
      await getCarrozados();
      await getPuertasTraseras();
      await getVendedores();
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
        case "puertasTraseras":
          data = puertasTraseras || [];
          break;
        case "vendedores":
          data = vendedores || [];
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
  }, [isLoading, colores, carrozados, puertasTraseras, vendedores]);
  const MenuOpen = ({ title, icon }: MenuOpenProps) => {
    return (
      <button
        key={title}
        type="button"
        onClick={() => setActiveTab(title)}
        className={`block rounded-lg px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-indigo-100 dark:hover:bg-slate-800 hover:text-primary-light ${activeTab === title ? "bg-indigo-100 dark:bg-slate-800 text-primary-light" : ""}`}
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
      case "puertasTraseras":
        await getPuertasTraseras();
        break;
      case "vendedores":
        await getVendedores();
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
    openModal("CUSTOM", {
      component: SettingsFormModal,
      props: {
        title: mode === "create" ? "Crear Nuevo Registro" : "Editar Registro",
        fields: form,
        onSubmit: async (data: any, { reset, setSuccessMessage }: any) => {
          if (mode === "create") {
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
              throw new Error(response.error || "Error al crear el registro");
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
              throw new Error(
                response.error || "Error al actualizar el registro"
              );
            }
          }
        },
        data: data,
      },
    });
  };
  const handleOnRowClick = (row: any) => {
    const activeItem = itemsConfiguraciones?.find((item) => item.title === activeTab);
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
              itemsConfiguraciones.map(
                (item) =>
                  activeTab === item.title && (
                    <div key={item.title}>
                      <EntityTable
                        key={item.title}
                        columns={item.columns}
                        data={item.data}
                        filterFields={[
                          { key: "nombre", label: "Nombre", autoFilter: true },
                        ]}
                        onRowClick={handleOnRowClick}
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
              )}
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
