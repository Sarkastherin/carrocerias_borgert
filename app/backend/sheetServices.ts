import { createCrud } from "./crudFactory";
import type { ClientesBD } from "~/types/clientes";
import type { CarroceriaBD, PedidosBD, CamionBD, TrabajoChasisBD } from "~/types/pedidos";
import type { ColoresBD, CarrozadosBD, PuertasTraserasBD, VendedoresBD, ConfigTrabajosChasisBD } from "~/types/settings";

export const clientesAPI = createCrud<ClientesBD>({
  sheetId: import.meta.env.VITE_SHEET_ID_CLIENTES,
  nameSheet: "Datos",
  nameFile: "Clientes",
});
export const pedidosAPI = createCrud<PedidosBD>({
  sheetId: import.meta.env.VITE_SHEET_ID_PEDIDOS,
  nameSheet: "Pedidos",
  nameFile: "Pedidos",
});
export const carroceriaAPI = createCrud<CarroceriaBD>({
  sheetId: import.meta.env.VITE_SHEET_ID_PEDIDOS,
  nameSheet: "Carrocerías",
  nameFile: "Pedidos",
});
export const trabajoChasisAPI = createCrud<TrabajoChasisBD>({
  sheetId: import.meta.env.VITE_SHEET_ID_PEDIDOS,
  nameSheet: "Trabajo Chasis",
  nameFile: "Pedidos",
});
export const camionAPI = createCrud<CamionBD>({
  sheetId: import.meta.env.VITE_SHEET_ID_PEDIDOS,
  nameSheet: "Camiones",
  nameFile: "Pedidos",
});
export const coloresAPI = createCrud<ColoresBD>({
  sheetId: import.meta.env.VITE_SHEET_ID_CONFIGURACIONES,
  nameSheet: "Colores",
  nameFile: "Parámetros y Configuraciones",
});
export const carrozadoAPI = createCrud<CarrozadosBD>({
  sheetId: import.meta.env.VITE_SHEET_ID_CONFIGURACIONES,
  nameSheet: "Carrozados",
  nameFile: "Parámetros y Configuraciones",
});
export const puertasTraserasAPI = createCrud<PuertasTraserasBD>({
  sheetId: import.meta.env.VITE_SHEET_ID_CONFIGURACIONES,
  nameSheet: "Puertas Traseras",
  nameFile: "Parámetros y Configuraciones",
});
export const vendedoresAPI = createCrud<VendedoresBD>({
  sheetId: import.meta.env.VITE_SHEET_ID_CONFIGURACIONES,
  nameSheet: "Vendedores",
  nameFile: "Parámetros y Configuraciones",
});
export const configTrabajoChasisAPI = createCrud<ConfigTrabajosChasisBD>({
  sheetId: import.meta.env.VITE_SHEET_ID_CONFIGURACIONES,
  nameSheet: "Tipos trabajos",
  nameFile: "Parámetros y Configuraciones",
});
