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
  { value: "disponible", label: "Disponible" },
  { value: "depositado", label: "Depositado" },
  { value: "endosado", label: "Endosado" },
  { value: "rechazado", label: "Rechazado" },
];
export type CtasCorrientesDB = {
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
  saldo: number;
  usuario_id: string;
};
export type CtaCorrienteConCliente = CtasCorrientesDB & {
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
  destino: string;
  observacion?: string;
};
