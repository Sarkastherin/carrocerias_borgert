import { useData } from "~/context/DataContext";
import { useDataLoader } from "~/hooks/useDataLoader";
import { useMemo } from "react";
import { getIcon } from "~/components/IconComponent";
import type { IconType } from "~/components/IconComponent";
import type { TableColumn } from "react-data-table-component";
import type { CRUDMethods } from "~/backend/crudFactory";
import type { FilterField } from "~/components/EntityTable";
import { FileCode, PencilRuler } from "lucide-react";
import { capitalize } from "./settingsConfig";
import { defaultAPI, controlCarrozadoAPI } from "~/backend/sheetServices";
import { getAtributoMetadata, getAtributoMetadataWithOptions, atributosConMetadata, atributos } from "./atributosMetadata";
export type SettingsDataContext = {
  defaults?: any[] | null;
  controlCarrozado?: any[] | null;
};
export type SettingsDataLoaders = {
  getDefaults: () => Promise<any>;
  getControlCarrozado: () => Promise<any>;
};
export type ConfigItemWithData = ConfigItem & {
  data: any[];
};
export type ConfigItem = {
  title: string;
  icon: IconType;
  columns: TableColumn<any>[];
  formFields: ConfigField[];
  api: CRUDMethods<any>; // API con tipo CRUDMethods
  reloadData: () => Promise<void>; // Función para recargar datos específicos
  filterFields?: FilterField[];
};
export type ConfigField = {
  name: string;
  label: string;
  type: "text" | "boolean" | "select" | "textarea" | "number" | "dynamic";
  required?: boolean;
  options?: { value: string | number | boolean; label: string }[];
  dependsOn?: string; // Para campos dinámicos
  getDynamicConfig?: (dependentValue: any) => Partial<ConfigField>;
  placeholder?: string;
  min?: number;
  max?: number;
};
export const createSettingsConfig = (
  loaders: SettingsDataLoaders,
  itemsControlOptions: { value: string | number; label: string }[] = [],
  dynamicOptions?: {
    puertasTraseras?: { value: string | number; label: string }[];
    colores?: { value: string | number; label: string }[];
  }
): ConfigItem[] => [
  {
    title: "valores por defecto",
    icon: FileCode,
    reloadData: loaders.getDefaults,
    columns: [
      {
        name: "Nombre de campo",
        selector: (row: any) => capitalize(row.etiqueta),
        sortable: true,
      },
      {
        name: "Valor por defecto",
        selector: (row: any) =>
          typeof row.valor === "string" ? capitalize(row.valor) : row.valor,
        sortable: true,
      },
      {
        name: "Tipo",
        selector: (row: any) => row.tipo === "fijo" ? "🔒 Fijo" : "🟢 Seleccionable",
        sortable: false,
        width: "160px",
      },
      {
        name: "Activo",
        selector: (row: any) => (row.activo ? "Activo" : "Inactivo"),
        sortable: false,
        width: "100px",
      },
    ],
    formFields: [
      {
        name: "atributo",
        label: "Nombre de campo",
        type: "select",
        required: true,
        options: atributos,
      },
      {
        name: "valor",
        label: "Valor por defecto",
        type: "dynamic",
        required: true,
        dependsOn: "atributo",
        getDynamicConfig: (atributoValue: string) => {
          let metadata = getAtributoMetadata(atributoValue as any);
          
          if (!metadata) {
            return { type: "text" as const };
          }

          // Aplicar opciones dinámicas para ciertos atributos
          if (atributoValue === "puerta_trasera_id" && dynamicOptions?.puertasTraseras) {
            metadata = getAtributoMetadataWithOptions(atributoValue as any, dynamicOptions.puertasTraseras);
          } else if ((atributoValue === "color_carrozado_id" || atributoValue === "color_zocalo_id") && dynamicOptions?.colores) {
            metadata = getAtributoMetadataWithOptions(atributoValue as any, dynamicOptions.colores);
          }

          if (!metadata) {
            return { type: "text" as const };
          }
          
          return {
            type: metadata.fieldType as "text" | "boolean" | "select" | "textarea" | "number",
            options: metadata.options,
            placeholder: metadata.placeholder,
            min: metadata.min,
            max: metadata.max,
          };
        },
      },
      {
        name: "tipo",
        label: "Tipo",
        type: "select",
        required: true,
        options: [
          { value: "fijo", label: "🔒 Fijo" },
          { value: "seleccionable", label: "🟢 Seleccionable" },
        ],
      },
      {
        name: "activo",
        label: "Activo",
        type: "boolean",
        required: false,
      },
    ],
    api: defaultAPI,
    filterFields: [
      { key: "atributo", label: "Nombre de campo", autoFilter: true },
      {
        key: "tipo",
        label: "Tipo",
        autoFilter: true,
        type: "select",
        options: (
          <>
            <option value="">Tipo de dato</option>
            <option value="fijo">🔒 Fijo</option>
            <option value="seleccionable">🟢 Seleccionable</option>
          </>
        ),
      },
    ],
  },
  {
    title: "control de carrozado",
    icon: PencilRuler,
    reloadData: loaders.getControlCarrozado,
    columns: [
      {
        name: "Ítem de control",
        selector: (row: any) => row.nombre_item_control,
        sortable: true,
      },
      {
        name: "Activo",
        selector: (row: any) => (row.activo ? "Activo" : "Inactivo"),
        sortable: false,
        width: "100px",
      },
    ],
    formFields: [
      {
        name: "item_control_id",
        label: "Item Control",
        type: "select",
        required: true,
        options: itemsControlOptions
      },
      {
        name: "activo",
        label: "Activo",
        type: "boolean",
        required: false,
      },
    ],
    api: controlCarrozadoAPI,
    filterFields: [
      { key: "nombre_item_control", label: "Ítem de control", autoFilter: true },
    ],
  },
];
export const getSettingsWithData = (
  dataContext: SettingsDataContext,
  loaders: SettingsDataLoaders,
  itemsControlOptions: { value: string | number; label: string }[] = [],
  dynamicOptions?: {
    puertasTraseras?: { value: string | number; label: string }[];
    colores?: { value: string | number; label: string }[];
  }
): ConfigItemWithData[] => {
  const settingsConfig = createSettingsConfig(loaders, itemsControlOptions, dynamicOptions);
  const dataMapping = {
    "valores por defecto": dataContext.defaults || [],
    "control de carrozado": dataContext.controlCarrozado || [],
  };

  return settingsConfig.map((config) => ({
    ...config,
    data: dataMapping[config.title as keyof typeof dataMapping] || [],
  }));
};
export const useSettingsData = (carrozadoId?: string) => {
  const { 
    defaults, 
    getDefaults, 
    controlCarrozado, 
    getControlCarrozado,
    configItemsControl,
    getConfigItemsControl,
    puertasTraseras,
    getPuertasTraseras,
    colores,
    getColores
  } = useData();

  // Usar el hook useDataLoader para cargar todos los datos
  const { isLoading } = useDataLoader({
    loaders: [getDefaults, getControlCarrozado, getConfigItemsControl, getPuertasTraseras, getColores],
    dependencies: [defaults, controlCarrozado, configItemsControl, puertasTraseras, colores],
    errorMessage: "Error cargando configuraciones",
  });

  // Filtrar datos por carrozadoId si está disponible
  const filteredDefaults = useMemo(() => {
    if (!defaults || !carrozadoId) return defaults;
    const defaultaData = defaults.filter(
      (item) => item.carrozado_id === carrozadoId
    );
    const filteredDefaultsWithLabels = defaultaData.map((item) => {
      return {
        ...item,
        etiqueta:
          atributosConMetadata.find((attr) => attr.value === item.atributo)?.label ||
          item.atributo,
      };
    });
    return filteredDefaultsWithLabels;
  }, [defaults, carrozadoId]);

  const filteredControlCarrozado = useMemo(() => {
    if (!controlCarrozado || !carrozadoId) return controlCarrozado;
    const filtered = controlCarrozado.filter((item) => item.carrozado_id === carrozadoId);
    
    // Mapear con configItemsControl para obtener el nombre del item de control
    return filtered.map((item) => {
      const itemControl = configItemsControl?.find((config) => config.id === item.item_control_id);
      return {
        ...item,
        nombre_item_control: itemControl?.nombre || 'Item no encontrado'
      };
    });
  }, [controlCarrozado, carrozadoId, configItemsControl]);

  // Crear opciones para configItemsControl
  const itemsControlOptions = useMemo(() => {
    if (!configItemsControl) return [];
    return configItemsControl.map((item) => ({
      value: item.id,
      label: item.nombre
    }));
  }, [configItemsControl]);

  // Crear opciones dinámicas para campos que dependen de otros datos
  const puertasTraserasOptions = useMemo(() => {
    if (!puertasTraseras) return [];
    return puertasTraseras.map((puerta) => ({
      value: puerta.id,
      label: puerta.nombre
    }));
  }, [puertasTraseras]);

  const coloresOptions = useMemo(() => {
    if (!colores) return [];
    return colores.map((color) => ({
      value: color.id,
      label: color.nombre
    }));
  }, [colores]);

  // Crear la configuración de items con datos incorporados
  const itemsConfiguraciones = useMemo(() => {
    if (isLoading) return null;

    return getSettingsWithData(
      {
        defaults: filteredDefaults,
        controlCarrozado: filteredControlCarrozado,
      },
      {
        getDefaults,
        getControlCarrozado,
      },
      itemsControlOptions,
      {
        puertasTraseras: puertasTraserasOptions,
        colores: coloresOptions,
      }
    ).map((config) => ({
      ...config,
      icon: getIcon({ icon: config.icon, size: 4 }),
    }));
  }, [
    isLoading,
    filteredDefaults,
    filteredControlCarrozado,
    getDefaults,
    getControlCarrozado,
    itemsControlOptions,
    puertasTraserasOptions,
    coloresOptions,
  ]);

  return {
    isLoading,
    itemsConfiguraciones,
    // También exponemos los datos individuales filtrados por carrozadoId
    defaults: filteredDefaults,
    controlCarrozado: filteredControlCarrozado,
  };
};
