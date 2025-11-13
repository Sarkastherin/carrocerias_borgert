import React, { useMemo } from "react";
import { EntityTable } from "~/components/EntityTable";
import { ButtonAdd, IconButton } from "~/components/Buttons";
import NoDataComponent from "~/components/NoDataComponent";
import LoadingComponent from "~/components/LoadingComponent";
import SidebarConfig from "~/components/SidebarConfig";
import { Trash2Icon } from "lucide-react";
import { capitalize } from "~/config/settingsConfig";
import { useSettingsManager } from "~/hooks/useSettingsManager";
import type { UseSettingsManagerProps } from "~/types/settingsManager";

interface SettingsManagerProps extends UseSettingsManagerProps {
  pageTitle?: string;
  pageDescription?: string;
  className?: string;
}

export default function SettingsManager({
  settingsConfigs,
  dataLoaders,
  apiMap,
  validationMap,
  defaultTab,
  pageTitle,
  pageDescription,
  className
}: SettingsManagerProps) {
  const {
    activeTab,
    setActiveTab,
    isLoading,
    itemsConfiguraciones,
    handleOpenForm,
    handleOnRowClick,
    handleDelete,
    reloadData,
  } = useSettingsManager({
    settingsConfigs,
    dataLoaders,
    apiMap,
    validationMap,
    defaultTab
  });

  // Columna de acciones
  const actionColumn = useMemo(() => ({
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
  }), [handleDelete]);

  if (isLoading || !itemsConfiguraciones) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <LoadingComponent content="Cargando configuraciones..." />
      </div>
    );
  }

  return (
    <div className={`flex ${className}`} style={{ minHeight: "calc(100vh - 67px)" }}>
      <SidebarConfig 
        itemsConfiguraciones={itemsConfiguraciones} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
      
      <div className="flex-1 py-10 mx-auto px-10">
        {pageTitle && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-text-primary dark:text-white">
              {pageTitle}
            </h1>
            {pageDescription && (
              <p className="text-text-secondary dark:text-gray-400 mt-2">
                {pageDescription}
              </p>
            )}
          </div>
        )}

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
    </div>
  );
}