import type { ClientesBD } from "./clientes";
import type { ProveedoresBD } from "./proveedores";

export const optionsTypeMov = [
  { value: "deuda", label: "Deuda" },
  { value: "pago", label: "Pago" },
  { value: "nota_credito", label: "Nota crédito" },
];
export const optionsOrigen = [
  { value: "pedido", label: "Pedido" },
  { value: "manual", label: "Manual" },
  { value: "cheque", label: "Cheque" },
];
export const optionsMedioPago = [
  { value: "efectivo", label: "Efectivo", origen: "manual" },
  { value: "transferencia", label: "Transferencia", origen: "manual" },
  { value: "carroceria_usada", label: "Carrocería usada", origen: "vehiculo" },
  { value: "cheque", label: "Cheque", origen: "cheque" },
  { value: "no aplica", label: "No aplica", origen: "otro" },
];
export const optionsTipoCheque = [
  { value: "fisico", label: "Físico" },
  { value: "echeq", label: "Echeq" },
];
export const optionsStatusCheque = [
  { value: "recibido", label: "Recibido" },
  { value: "depositado", label: "Depositado" },
  { value: "acreditado", label: "Acreditado" },
  { value: "endosado", label: "Endosado" },
  { value: "rechazado", label: "Rechazado" },
  { value: "anulado", label: "Anulado" },
  { value: "vencido", label: "Vencido" },
];
export type CtasCtesDB = {
  id: string;
  fecha_creacion: string;
  cliente_id: string;
  fecha_movimiento: string;
  tipo_movimiento: (typeof optionsTypeMov)[number]["value"];
  origen: (typeof optionsOrigen)[number]["value"];
  medio_pago: (typeof optionsMedioPago)[number]["value"];
  referencia?: string;
  concepto?: string;
  debe: number;
  haber: number;
  usuario_id?: string;
  documento_cta_cte?: string;
};
export type CtaCteConCliente = CtasCtesDB & {
  razon_social: string;
  cuit_cuil: string;
  condicion_iva: string;
};
export type ChequesDB = {
  id: string;
  fecha_creacion: string;
  cta_cte_id: string;
  tipo: (typeof optionsTipoCheque)[number]["value"];
  banco: string;
  numero: string;
  fecha_ingreso: string;
  fecha_cobro: string;
  importe: number;
  status: (typeof optionsStatusCheque)[number]["value"];
  proveedor_id?: string;
  fecha_deposito?: string;
  fecha_acreditacion?: string;
  fecha_endoso?: string;
  fecha_anulacion?: string;
  motivo_anulacion?: string;
  fecha_rechazo?: string;
  motivo_rechazo?: string;
  observacion?: string;
};
export type ChequesWithTerceros = ChequesDB & {
  ctaCte: CtasCtesDB;
  cliente: ClientesBD;
  nombre_banco: string;
  proveedor?: ProveedoresBD;
}
export type BancosProps = {
  value: string;
  label: string;
}
export type CtasCtesWithCheque = CtasCtesDB & {
  cheques?: ChequesDB[];
};