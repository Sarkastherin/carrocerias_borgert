import type { FilterField } from "~/components/EntityTable";
import type { IconType } from "~/components/IconComponent";
import type { CRUDMethods } from "~/backend/crudFactory";
import type { TableColumn } from "react-data-table-component";
import { useMemo } from "react";
import { useData } from "~/context/DataContext";
import { useDataLoader } from "~/hooks/useDataLoader";
import { getIcon } from "~/components/IconComponent";
import { PaintBucket, Truck, DoorOpen, ContactRound, Drill, PencilRuler } from "lucide-react";
import {
  coloresAPI,
  carrozadoAPI,
  puertasTraserasAPI,
  vendedoresAPI,
  configTrabajoChasisAPI,
  configItemsControlAPI,
} from "~/backend/sheetServices";

export type ConfigField = {
  name: string;
  label: string;
  type: "text" | "boolean" | "select" | "textarea";
  required?: boolean;
  options?: { value: string | number; label: string }[];
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

export type ConfigItemWithData = ConfigItem & {
  data: any[];
};

export type SettingsDataContext = {
  colores?: any[] | null;
  carrozados?: any[] | null;
  puertasTraseras?: any[] | null;
  vendedores?: any[] | null;
  configTrabajosChasis?: any[] | null;
  configItemsControl?: any[] | null;
};

export type SettingsDataLoaders = {
  getColores: () => Promise<any>;
  getCarrozados: () => Promise<any>;
  getPuertasTraseras: () => Promise<any>;
  getVendedores: () => Promise<any>;
  getConfigTrabajosChasis: () => Promise<any>;
  getConfigItemsControl: () => Promise<any>;
};

export const createSettingsConfig = (loaders: SettingsDataLoaders): ConfigItem[] => [
  {
    title: "colores",
    icon: PaintBucket,
    reloadData: loaders.getColores,
    columns: [
      {
        name: "Nombre",
        selector: (row: any) => row.nombre,
        sortable: true,
      },
      {
        name: "Tipo",
        selector: (row: any) => capitalize(row.tipo),
        sortable: false,
        width: "120px",
      },
      {
        name: "Activo",
        selector: (row: any) => (row.activo ? "Activo" : "Inactivo"),
        sortable: false,
        width: "100px",
      },
    ],
    formFields: [
      { name: "nombre", label: "Nombre", type: "text", required: true },
      {
        name: "tipo",
        label: "Tipo",
        type: "select",
        required: true,
        options: [
          { value: "esmalte", label: "Esmalte" },
          { value: "lona", label: "Lona" },
        ],
      },
      {
        name: "activo",
        label: "Activo",
        type: "boolean",
        required: false,
      },
    ],
    api: coloresAPI,
    filterFields: [
      { key: "nombre", label: "Nombre", autoFilter: true },
      {
        key: "tipo",
        label: "Tipo",
        autoFilter: true,
        type: "select",
        options: (
          <>
          <option value="">Tipo de pintura</option>
            <option value="esmalte">Esmalte</option>
            <option value="lona">Lona</option>
          </>
        ),
      },
    ],
  },
  {
    title: "carrozado",
    icon: Truck,
    reloadData: loaders.getCarrozados,
    columns: [
      {
        name: "Nombre",
        selector: (row: any) => row.nombre,
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
      { name: "nombre", label: "Nombre", type: "text", required: true },
      {
        name: "activo",
        label: "Activo",
        type: "boolean",
        required: false,
      },
    ],
    api: carrozadoAPI,
    filterFields: [{ key: "nombre", label: "Nombre", autoFilter: true }],
  },
  {
    title: "puertas traseras",
    icon: DoorOpen,
    reloadData: loaders.getPuertasTraseras,
    columns: [
      {
        name: "Nombre",
        selector: (row: any) => row.nombre,
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
      { name: "nombre", label: "Nombre", type: "text", required: true },
      {
        name: "activo",
        label: "Activo",
        type: "boolean",
        required: false,
      },
    ],
    api: puertasTraserasAPI,
    filterFields: [{ key: "nombre", label: "Nombre", autoFilter: true }],
  },
  {
    title: "vendedores",
    icon: ContactRound,
    reloadData: loaders.getVendedores,
    columns: [
      {
        name: "Nombre",
        selector: (row: any) => row.nombre,
        sortable: true,
      },
      {
        name: "Apellido",
        selector: (row: any) => row.apellido || "-",
        sortable: false,
      },
      {
        name: "Activo",
        selector: (row: any) => (row.activo ? "Activo" : "Inactivo"),
        sortable: false,
        width: "100px",
      },
    ],
    formFields: [
      { name: "nombre", label: "Nombre", type: "text", required: true },
      {
        name: "apellido",
        label: "Apellido",
        type: "text",
        required: false,
      },
      {
        name: "activo",
        label: "Activo",
        type: "boolean",
        required: false,
      },
    ],
    api: vendedoresAPI,
    filterFields: [
      { key: "nombre", label: "Nombre", autoFilter: true },
      { key: "apellido", label: "Apellido", autoFilter: true },
    ],
  },
  {
    title: "tipos de trabajos",
    icon: Drill,
    reloadData: loaders.getConfigTrabajosChasis,
    columns: [
      {
        name: "Descripción del trabajo",
        selector: (row: any) => row.nombre,
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
        name: "nombre",
        label: "Descripción del trabajo",
        type: "text",
        required: true,
      },
      {
        name: "activo",
        label: "Activo",
        type: "boolean",
        required: false,
      },
    ],
    api: configTrabajoChasisAPI,
    filterFields: [{ key: "nombre", label: "Nombre", autoFilter: true }],
  },
  {
    title: "items de control",
    icon: PencilRuler,
    reloadData: loaders.getConfigItemsControl,
    columns: [
      {
        name: "Nombre",
        selector: (row: any) => row.nombre,
        sortable: true,
      },
      {
        name: "Control",
        selector: (row: any) => capitalize(row.control),
        sortable: false,
        width: "150px",
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
        name: "nombre",
        label: "Descripción del trabajo",
        type: "text",
        required: true,
      },
      {
        name: "control",
        label: "Control",
        type: "select",
        options: [{ value: "carrozado", label: "Carrozado" }],
        required: true,
      },
      {
        name: "activo",
        label: "Activo",
        type: "boolean",
        required: false,
      },
    ],
    api: configItemsControlAPI,
    filterFields: [{ key: "nombre", label: "Nombre", autoFilter: true }, {
      key: "control",
      label: "Control", autoFilter: true,}],
  },
];

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const getSettingsWithData = (
  dataContext: SettingsDataContext,
  loaders: SettingsDataLoaders
): ConfigItemWithData[] => {
  const settingsConfig = createSettingsConfig(loaders);
  const dataMapping = {
    "colores": dataContext.colores || [],
    "carrozado": dataContext.carrozados || [],
    "puertas traseras": dataContext.puertasTraseras || [],
    "vendedores": dataContext.vendedores || [],
    "tipos de trabajos": dataContext.configTrabajosChasis || [],
    "items de control": dataContext.configItemsControl || [],
  };

  return settingsConfig.map((config) => ({
    ...config,
    data: dataMapping[config.title as keyof typeof dataMapping] || [],
  }));
};

// Hook personalizado que maneja toda la lógica de datos de settings
export const useSettingsData = () => {
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
    configItemsControl,
    getConfigItemsControl,
  } = useData();

  // Usar el hook useDataLoader para cargar todos los datos
  const { isLoading } = useDataLoader({
    loaders: [
      getColores,
      getCarrozados,
      getPuertasTraseras,
      getVendedores,
      getConfigTrabajosChasis,
      getConfigItemsControl,
    ],
    dependencies: [
      colores,
      carrozados,
      puertasTraseras,
      vendedores,
      configTrabajosChasis,
      configItemsControl,
    ],
    errorMessage: "Error cargando configuraciones",
  });

  // Crear la configuración de items con datos incorporados
  const itemsConfiguraciones = useMemo(() => {
    if (isLoading) return null;

    return getSettingsWithData(
      {
        colores,
        carrozados,
        puertasTraseras,
        vendedores,
        configTrabajosChasis,
        configItemsControl,
      },
      {
        getColores,
        getCarrozados,
        getPuertasTraseras,
        getVendedores,
        getConfigTrabajosChasis,
        getConfigItemsControl,
      }
    ).map((config) => ({
      ...config,
      icon: getIcon({ icon: config.icon, size: 4 }),
    }));
  }, [
    isLoading,
    colores,
    carrozados,
    puertasTraseras,
    vendedores,
    configTrabajosChasis,
    configItemsControl,
    getColores,
    getCarrozados,
    getPuertasTraseras,
    getVendedores,
    getConfigTrabajosChasis,
    getConfigItemsControl,
  ]);

  return {
    isLoading,
    itemsConfiguraciones,
    // También exponemos los datos individuales por si se necesitan
    colores,
    carrozados,
    puertasTraseras,
    vendedores,
    configTrabajosChasis,
    configItemsControl,
  };
};
