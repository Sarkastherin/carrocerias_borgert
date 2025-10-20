import { createCrud } from "./crudFactory";
import type { ClientesBD } from "~/types/clientes";

export const clientesAPI = createCrud<ClientesBD>({
  sheetId: import.meta.env.VITE_SHEET_ID_CLIENTES,
  nameSheet: "Datos",
  nameFile: "Clientes",
});
