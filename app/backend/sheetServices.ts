import { createCrud } from "./crudFactory";
import type { ClientesBD } from "~/types/clientes";
import type { PedidosBD } from "~/types/pedidos";

export const clientesAPI = createCrud<ClientesBD>({
  sheetId: import.meta.env.VITE_SHEET_ID_CLIENTES,
  nameSheet: "Datos",
  nameFile: "Clientes",
});
export const pedidosAPI = createCrud<PedidosBD>({
  sheetId: import.meta.env.VITE_SHEET_ID_PEDIDOS,
  nameSheet: "Registro",
  nameFile: "Pedidos",
});
