export type ConfigField = {
  name: string;
  label: string;
  type: "text" | "boolean" | "select" | "textarea";
  required?: boolean;
  options?: { value: string | number; label: string }[];
};

export type ConfigItem = {
  title: string;
  icon: "PaintBucket" | "Truck" | "Package" | "DoorOpen";
  columns: Array<{
    name: string;
    selector: (row: any) => any;
    sortable?: boolean;
    width?: string;
  }>;
  formFields: ConfigField[];
  api: string; // Nombre de la API para evitar imports circulares
  filterFields?: Array<{
    key: string;
    label: string;
    autoFilter?: boolean;
  }>;
};

export const settingsConfig: ConfigItem[] = [
  {
    title: "colores",
    icon: "PaintBucket",
    columns: [
      {
        name: "ID",
        selector: (row: any) => row.id,
        sortable: true,
        width: "80px",
      },
      {
        name: "Nombre",
        selector: (row: any) => row.nombre,
        sortable: true,
      },
      {
        name: "Observaciones",
        selector: (row: any) => row.observaciones || "-",
        sortable: false,
      },
    ],
    formFields: [
      { name: "nombre", label: "Nombre", type: "text", required: true },
      {
        name: "observaciones",
        label: "Observaciones",
        type: "textarea",
        required: false,
      },
    ],
    api: "coloresAPI", // Nombre de la API para evitar imports circulares
    filterFields: [
      { key: "nombre", label: "Nombre", autoFilter: true },
    ],
  },
  {
    title: "carrozado",
    icon: "Truck",
    columns: [
      {
        name: "ID",
        selector: (row: any) => row.id,
        sortable: true,
        width: "80px",
      },
      {
        name: "Nombre",
        selector: (row: any) => row.nombre,
        sortable: true,
      },
      {
        name: "Observaciones",
        selector: (row: any) => row.observaciones || "-",
        sortable: false,
      },
    ],
    formFields: [
      { name: "nombre", label: "Nombre", type: "text", required: true },
      {
        name: "observaciones",
        label: "Observaciones",
        type: "textarea",
        required: false,
      },
    ],
    api: "carrozadoAPI", // Nombre de la API para evitar imports circulares
    filterFields: [
      { key: "nombre", label: "Nombre", autoFilter: true },
    ],
  },
  {
    title: "puertasTraseras",
    icon: "DoorOpen",
    columns: [
      {
        name: "ID",
        selector: (row: any) => row.id,
        sortable: true,
        width: "80px",
      },
      {
        name: "Nombre",
        selector: (row: any) => row.nombre,
        sortable: true,
      },
      {
        name: "Observaciones",
        selector: (row: any) => row.observaciones || "-",
        sortable: false,
      },
    ],
    formFields: [
      { name: "nombre", label: "Nombre", type: "text", required: true },
      {
        name: "observaciones",
        label: "Observaciones",
        type: "textarea",
        required: false,
      },
    ],
    api: "puertasTraserasAPI",
    filterFields: [
      { key: "nombre", label: "Nombre", autoFilter: true },
    ],
  },
];

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);