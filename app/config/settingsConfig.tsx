import type { FilterField } from "~/components/EntityTable";
export type ConfigField = {
  name: string;
  label: string;
  type: "text" | "boolean" | "select" | "textarea";
  required?: boolean;
  options?: { value: string | number; label: string }[];
};

export type ConfigItem = {
  title: string;
  icon:
    | "PaintBucket"
    | "Truck"
    | "Package"
    | "DoorOpen"
    | "ContactRound"
    | "Drill";
  columns: Array<{
    name: string;
    selector: (row: any) => any;
    sortable?: boolean;
    width?: string;
    cell?: (row: any) => React.ReactNode;
  }>;
  formFields: ConfigField[];
  api: string; // Nombre de la API para evitar imports circulares
  filterFields?: FilterField[];
};

export const settingsConfig: ConfigItem[] = [
  {
    title: "colores",
    icon: "PaintBucket",
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
    api: "coloresAPI", // Nombre de la API para evitar imports circulares
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
    icon: "Truck",
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
    api: "carrozadoAPI", // Nombre de la API para evitar imports circulares
    filterFields: [{ key: "nombre", label: "Nombre", autoFilter: true }],
  },
  {
    title: "puertas traseras",
    icon: "DoorOpen",
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
    api: "puertasTraserasAPI",
    filterFields: [{ key: "nombre", label: "Nombre", autoFilter: true }],
  },
  {
    title: "vendedores",
    icon: "ContactRound",
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
    api: "vendedoresAPI",
    filterFields: [
      { key: "nombre", label: "Nombre", autoFilter: true },
      { key: "apellido", label: "Apellido", autoFilter: true },
    ],
  },
  {
    title: "tipos de trabajos",
    icon: "Drill",
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
    api: "configTrabajoChasisAPI",
    filterFields: [{ key: "nombre", label: "Nombre", autoFilter: true }],
  },
];

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
