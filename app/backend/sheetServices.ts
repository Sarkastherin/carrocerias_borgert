import { createCrud } from "./crudFactory";
import type { ClientesBD } from "~/types/clientes";
import type {
  CarroceriaBD,
  PedidosBD,
  CamionBD,
  TrabajoChasisBD,
  OrdenesBD,
  ControlesBD,
} from "~/types/pedidos";
import type {
  ColoresBD,
  CarrozadosBD,
  PuertasTraserasBD,
  PersonalBD,
  ConfigTrabajosChasisBD,
  ConfigItemsControlBD,
  DefaultDB,
  ControlCarrozadoDB,
} from "~/types/settings";

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
export const personalAPI = createCrud<PersonalBD>({
  sheetId: import.meta.env.VITE_SHEET_ID_CONFIGURACIONES,
  nameSheet: "Personal",
  nameFile: "Parámetros y Configuraciones",
});
export const configTrabajoChasisAPI = createCrud<ConfigTrabajosChasisBD>({
  sheetId: import.meta.env.VITE_SHEET_ID_CONFIGURACIONES,
  nameSheet: "Tipos trabajos",
  nameFile: "Parámetros y Configuraciones",
});
export const configItemsControlAPI = createCrud<ConfigItemsControlBD>({
  sheetId: import.meta.env.VITE_SHEET_ID_CONFIGURACIONES,
  nameSheet: "Ítems de Control",
  nameFile: "Parámetros y Configuraciones",
});
export const defaultAPI = createCrud<DefaultDB>({
  sheetId: import.meta.env.VITE_SHEET_ID_ESPECIALES,
  nameSheet: "Valores Predeterminados",
  nameFile: "Parámetros Especiales: carrozados",
});
export const controlCarrozadoAPI = createCrud<ControlCarrozadoDB>({
  sheetId: import.meta.env.VITE_SHEET_ID_ESPECIALES,
  nameSheet: "Ítems de Control",
  nameFile: "Parámetros Especiales: carrozados",
});
export const ordenesAPI =  createCrud<OrdenesBD>({
  sheetId: import.meta.env.VITE_SHEET_ID_ORDENES,
  nameSheet: "Ordenes",
  nameFile: "Órdenes de Trabajo",
});
export const controlesAPI =  createCrud<ControlesBD>({
  sheetId: import.meta.env.VITE_SHEET_ID_ORDENES,
  nameSheet: "Controles",
  nameFile: "Órdenes de Trabajo",
});
