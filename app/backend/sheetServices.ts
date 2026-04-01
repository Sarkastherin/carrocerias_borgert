import { createCrud } from "./crudFactory";
import type { ClientesBD } from "~/types/clientes";
// Selecciona el sheetId de clientes según el entorno
const sheetIdClientes =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_SHEET_ID_CLIENTES_DEV
    : import.meta.env.VITE_SHEET_ID_CLIENTES;
const sheetIdProveedores =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_SHEET_ID_PROVEEDORES_DEV
    : import.meta.env.VITE_SHEET_ID_PROVEEDORES;
const sheetIdPedidos =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_SHEET_ID_PEDIDOS_DEV
    : import.meta.env.VITE_SHEET_ID_PEDIDOS;
const sheetIdConfiguraciones =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_SHEET_ID_CONFIGURACIONES_DEV
    : import.meta.env.VITE_SHEET_ID_CONFIGURACIONES;
const sheetIdEspeciales =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_SHEET_ID_ESPECIALES_DEV
    : import.meta.env.VITE_SHEET_ID_ESPECIALES;
const sheetIdCtasCtes =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_SHEET_ID_CTAS_CORRI_DEV
    : import.meta.env.VITE_SHEET_ID_CTAS_CORRI;

import type { MvtosDB, ChequesDB } from "~/types/ctas_corrientes";
import type {
  CarroceriaBD,
  PedidosBD,
  CamionBD,
  TrabajoChasisBD,
  OrdenesYControlesBD,
  DocumentosBD,
  DocumentosCtasCtesBD,
} from "~/types/pedidos";
import type { ProveedoresBD } from "~/types/proveedores";
import type {
  ColoresBD,
  CarrozadosBD,
  PuertasTraserasBD,
  PersonalBD,
  ConfigTrabajosChasisBD,
  ItemsControlBD,
  DefaultDB,
  ControlPorCarrozadoDB,
} from "~/types/settings";

export const clientesAPI = createCrud<ClientesBD>({
  sheetId: sheetIdClientes,
  nameSheet: "Datos",
  nameFile: "Clientes",
});
export const pedidosAPI = createCrud<PedidosBD>({
  sheetId: sheetIdPedidos,
  nameSheet: "Pedidos",
  nameFile: "Pedidos",
});
export const carroceriaAPI = createCrud<CarroceriaBD>({
  sheetId: sheetIdPedidos,
  nameSheet: "Carrocerías",
  nameFile: "Pedidos",
});
export const trabajoChasisAPI = createCrud<TrabajoChasisBD>({
  sheetId: sheetIdPedidos,
  nameSheet: "Trabajo Chasis",
  nameFile: "Pedidos",
});
export const camionAPI = createCrud<CamionBD>({
  sheetId: sheetIdPedidos,
  nameSheet: "Camiones",
  nameFile: "Pedidos",
});
export const coloresAPI = createCrud<ColoresBD>({
  sheetId: sheetIdConfiguraciones,
  nameSheet: "Colores",
  nameFile: "Parámetros y Configuraciones",
});
export const carrozadoAPI = createCrud<CarrozadosBD>({
  sheetId: sheetIdConfiguraciones,
  nameSheet: "Carrozados",
  nameFile: "Parámetros y Configuraciones",
});
export const puertasTraserasAPI = createCrud<PuertasTraserasBD>({
  sheetId: sheetIdConfiguraciones,
  nameSheet: "Puertas Traseras",
  nameFile: "Parámetros y Configuraciones",
});
export const personalAPI = createCrud<PersonalBD>({
  sheetId: sheetIdConfiguraciones,
  nameSheet: "Personal",
  nameFile: "Parámetros y Configuraciones",
});
export const configTrabajoChasisAPI = createCrud<ConfigTrabajosChasisBD>({
  sheetId: sheetIdConfiguraciones,
  nameSheet: "Tipos trabajos",
  nameFile: "Parámetros y Configuraciones",
});
export const itemsControlAPI = createCrud<ItemsControlBD>({
  sheetId: sheetIdConfiguraciones,
  nameSheet: "Ítems de Control",
  nameFile: "Parámetros y Configuraciones",
});
export const defaultAPI = createCrud<DefaultDB>({
  sheetId: sheetIdEspeciales,
  nameSheet: "Valores Predeterminados",
  nameFile: "Parámetros Especiales: carrozados",
});
export const controlCarrozadoAPI = createCrud<ControlPorCarrozadoDB>({
  sheetId: sheetIdEspeciales,
  nameSheet: "Controles por carrozado",
  nameFile: "Parámetros Especiales: carrozados",
});
export const ordenesyControlesAPI =  createCrud<OrdenesYControlesBD>({
  sheetId: sheetIdPedidos,
  nameSheet: "Ordenes y Controles",
  nameFile: "Pedidos",
});
export const mvtosAPI = createCrud<MvtosDB>({
  sheetId: sheetIdCtasCtes,
  nameSheet: "movimientos",
  nameFile: "Cuentas Corrientes",
});
export const chequesAPI = createCrud<ChequesDB>({
  sheetId: sheetIdCtasCtes,
  nameSheet: "cheques",
  nameFile: "Cheques",
});
export const proveedoresAPI = createCrud<ProveedoresBD>({
  sheetId: sheetIdProveedores,
  nameSheet: "Datos",
  nameFile: "Proveedores",
});
export const documentosPedidosAPI = createCrud<DocumentosBD>({
  sheetId: sheetIdPedidos,
  nameSheet: "Documentos",
  nameFile: "Pedidos",
});
export const documentosCtasCtesAPI = createCrud<DocumentosCtasCtesBD>({
  sheetId: sheetIdCtasCtes,
  nameSheet: "documentos",
  nameFile: "Cuentas Corrientes",
});