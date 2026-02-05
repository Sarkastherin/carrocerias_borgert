import {
  materialOptions,
  anchoOptions,
  arcosOptions,
  espesorOptions,
  zocaloOptions,
  lineasRefOptions,
  pisoOptions,
  cintasOptions,
  tiposArcosOptions,
  tiposBoquillasOptions,
  ubicacionOptions,
} from "~/config/atributosMetadata";
export const statusOptions = [
  { value: "incompleto", label: "⏳ Incompleto" },
  { value: "nuevo", label: "🆕 Nuevo" },
  { value: "en_produccion", label: "🏭 En Producción" },
  { value: "en_pintura", label: "🎨 En Pintura" },
  { value: "pintada", label: "🖌️ Pintada" },
  { value: "finalizado", label: "✅ Finalizado" },
  { value: "entregado", label: "📦 Entregado" },
  { value: "cancelado", label: "❌ Cancelado" },
];
export const formaPagoOptions = [
  {
    value: "6 cheques/echeqs 0-150 días (Precio Neto)",
    label: "6 cheques/echeqs 0-150 días (Precio Neto)",
  },
  {
    value: "Entrega del 40% + 4 cheques/echeqs (5% de descuento)",
    label: "Entrega del 40% + 4 cheques/echeqs (5% de descuento)",
  },
  {
    value: "Contado/transferencia (10% de descuento)",
    label: "Contado/transferencia (10% de descuento)",
  },
  {
    value: "Carrocería usada",
    label: "Carrocería usada",
  },
  { value: "Otros", label: "Otros" },
];
export const tipoOrdenOptions = [
  { value: "fabricacion", label: "Pedido de Fabricación" },
  { value: "pintura", label: "Pedido de pintura" },
  { value: "montaje", label: "Datos de Colocación" },
];
export const tipoControlOptions = [
  { value: "carrozado", label: "Control de Carrozado" },
  { value: "pintura", label: "Control de Pintura" },
  { value: "final", label: "Control Final" },
];

export const alarguesOptions = [
  { value: "baranda a cumbrera", label: "Baranda a Cumbrera" },
  { value: "sobre cumbrera", label: "Sobre Cumbrera" },
  { value: "N/A", label: "No aplica" },
];

export type PedidosBD = {
  id: string;
  fecha_creacion: string;
  fecha_pedido: string;
  fecha_fabricacion: string;
  numero_pedido: string;
  cliente_id: string;
  precio_total: number;
  forma_pago: (typeof formaPagoOptions)[number]["value"];
  valor_tasacion?: number;
  saldo_restante: number;
  forma_pago_otros: string;
  fecha_entrega_estimada: string;
  status: (typeof statusOptions)[number]["value"];
  vendedor_id: string;
  armador_id?: string;
};
export type PedidosTable = PedidosBD & {
  razon_social: string;
  vendedor_nombre?: string;
  armador_nombre?: string;
};
export type CarroceriaBD = {
  id: string;
  fecha_creacion: string;
  pedido_id: string;
  /* datos generales */
  tipo_carrozado_id: string;
  largo_int: number | null;
  largo_ext: number | null;
  material: (typeof materialOptions)[number]["value"];
  ancho_ext: (typeof anchoOptions)[number]["value"] | null;
  alto: number | null;
  alt_baranda: number | null;
  ptas_por_lado: number | null;
  puerta_trasera_id: string;
  arcos_por_puerta: (typeof arcosOptions)[number]["value"] | null;
  tipos_arcos: (typeof tiposArcosOptions)[number]["value"];
  corte_guardabarros: boolean;
  cumbreras: boolean;
  espesor_chapa: (typeof espesorOptions)[number]["value"];
  tipo_zocalo: (typeof zocaloOptions)[number]["value"];
  lineas_refuerzo: (typeof lineasRefOptions)[number]["value"] | null;
  tipo_piso: (typeof pisoOptions)[number]["value"];
  /* cuchetin */
  cuchetin: boolean;
  med_cuchetin: number | null;
  alt_pta_cuchetin: number | null;
  alt_techo_cuchetin: number | null;
  notas_cuchetin: string;
  /* color */
  color_lona_id: string;
  color_carrozado_id: string;
  color_zocalo_id: string;
  notas_color: string;
  /* Boquillas */
  boquillas: number | null;
  tipo_boquillas: (typeof tiposBoquillasOptions)[number]["value"];
  ubicacion_boquillas: (typeof ubicacionOptions)[number]["value"];
  /* Cajon de herramientas */
  med_cajon_herramientas: number | null;
  ubicacion_cajon_herramientas: (typeof ubicacionOptions)[number]["value"];
  /* Accesorios */
  luces: number | null;
  guardabarros: boolean;
  dep_agua: boolean;
  ubicacion_dep_agua: (typeof ubicacionOptions)[number]["value"];
  cintas_reflectivas: (typeof cintasOptions)[number]["value"];
  /* Alargue */
  alargue_tipo_1: "baranda a cumbrera" | "N/A" | "";
  cant_alargue_1: number | null;
  med_alargue_1: number | null;
  quiebre_alargue_1: boolean;
  alargue_tipo_2: "sobre cumbrera" | "N/A" | "";
  cant_alargue_2: number | null;
  med_alargue_2: number | null;
  quiebre_alargue_2: boolean;
  observaciones: string;
  documento_carroceria?: string;
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
  observaciones?: string;
  documento_camion?: string;
  contacto_telefono?: string;
  contacto_nombre?: string;
};
export type TrabajoChasisBD = {
  id: string;
  fecha_creacion: string;
  pedido_id: string;
  tipo_trabajo_id: string;
  descripcion: string;
};
export type TrabajoChasisUI = TrabajoChasisBD & {
  tipo_trabajo_nombre?: string;
};
export type CarroceriaUI = CarroceriaBD & {
  carrozado_nombre?: string;
  puerta_trasera_nombre?: string;
  color_carrozado_nombre?: string;
  color_zocalo_nombre?: string;
  color_lona_nombre?: string;
};
export type PedidosUI = PedidosTable & {
  carroceria: CarroceriaUI | null;
} & {
  trabajo_chasis: TrabajoChasisUI[];
} & { camion: CamionBD | null };
export type OrdenesBD = {
  id: string;
  fecha_creacion: string;
  pedido_id: string;
  tipo_orden: (typeof tipoOrdenOptions)[number]["value"];
  responsable_id: string;
  fecha_ejecucion: string;
  url_archivo: string;
  status?: string;
  notas?: string;
};
export type ControlesBD = {
  id: string;
  fecha_creacion: string;
  pedido_id: string;
  tipo_control: (typeof tipoControlOptions)[number]["value"];
  responsable: string;
  fecha_ejecucion: string;
  url_archivo: string;
  resultado?: string;
  notas?: string;
};
