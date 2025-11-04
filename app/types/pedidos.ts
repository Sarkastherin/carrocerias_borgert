export type StatusPedidos =
  | "nuevo"
  | "en_produccion"
  | "finalizado"
  | "entregado"
  | "cancelado";
export type PedidosBD = {
  id: string;
  fecha_creacion: string;
  fecha_pedido: string;
  fecha_fabricacion: string;
  numero_pedido: string;
  camion_id: string;
  cliente_id: string;
  precio_total: number;
  forma_pago: string;
  forma_pago_otros: string;
  fecha_entrega_estimada: string;
  status: StatusPedidos;
  fecha_entrega: string;
  notas_entrega: string;
  vendedor_id: string;
};
export type PedidosTable = PedidosBD & {
  cliente_nombre: string;
  vendedor_nombre: string;
};
export type CarroceriaBD = {
  id: string;
  fecha_creacion: string;
  pedido_id: string;
  /* datos generales */
  tipo_carrozado_id: string;
  largo_int: number;
  largo_ext: number;
  material: string;
  ancho_ext: number;
  alto: number;
  alt_baranda: number;
  ptas_por_lado: number;
  puerta_trasera_id: string;
  arcos_por_puerta: 1 | 2 | 3 | 0;
  corte_guardabarros: boolean;
  cumbreras: boolean;
  espesor_chapa: "3.2" | "2.9" | "2.6" | "2.2" | "";
  tipo_zocalo: "recto" | "gross_viejo" | "gross_nuevo" | "";
  lineas_refuerzo: 0 | 3 | 5;
  /* cuchetin */
  cuchetin: boolean;
  med_cuchetin: number;
  alt_pta_cuchetin: number;
  alt_techo_cuchetin: number;
  /* color */
  color_lona: string;
  color_carrozado_id: string;
  color_zocalo_id: string;
  notas_color: string;
  tipo_piso: "liso" | "semillado" | "";
  boquillas: number;
  med_cajon_herramientas: number;
  luces: number;
  med_alargue: number;
  quiebre_alargue: boolean;
  guardabarros: boolean;
  dep_agua: boolean;
  cintas_reflectivas: "nacionales" | "importadas" | "";
  observaciones: string;
};
export type CamionBD = {
  id: string;
  fecha_creacion: string;
  pedido_id: string;
  patente: string;
  modelo: string;
  marca: string;
  tipo_larguero: string;
  med_larguero: number;
  centro_eje: number;
  voladizo_trasero: number;
  observaciones: string;
};
export type TrabajoChasisBD = {
  id: string;
  fecha_creacion: string;
  pedido_id: string;
  tipo_trabajo_id: string;
  descripcion: string;
};
export type PedidosUI = PedidosTable & { carroceria: CarroceriaBD | null } & {
  trabajo_chasis: TrabajoChasisBD[];
} & { camion: CamionBD | null };
