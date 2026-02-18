import type { ClientesBD } from "./clientes";
import type { ProveedoresBD } from "./proveedores";
import type { DocumentosCtasCtesBD } from "./pedidos";

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
  { value: "efectivo", label: "Efectivo", tipo: "efectivo" },
  { value: "transferencia", label: "Transferencia", tipo: "efectivo" },
  { value: "carroceria_usada", label: "Carrocería usada", tipo: "carroceria_usada" },
  { value: "cheque", label: "Cheque", tipo: "cheque" },
  { value: "no aplica", label: "No aplica", tipo: "otro" },
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
export type MvtosDB = {
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
};
export type MvtosWithCheques = MvtosDB & {
  cheques?: ChequesEnriched[];
  documentos?: DocumentosCtasCtesBD[];
}
export type CtaCte = ClientesBD & {
  debe: number;
  haber: number;
  saldo: number;
  movimientos: MvtosWithCheques[];
}
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
  ctaCte: MvtosDB;
  cliente: ClientesBD;
  nombre_banco: string;
  proveedor?: ProveedoresBD;
}
export type BancosProps = {
  value: string;
  label: string;
}
export type CtasCtesWithCheque = MvtosDB & {
  cheques?: ChequesDB[];
};
export type ChequesEnriched = ChequesDB & {
  proveedor?: ProveedoresBD;
  nombre_banco?: string;
}
export type ChequesEnrichWithCtaCte = ChequesEnriched & {
  ctaCte: CtaCte;
};