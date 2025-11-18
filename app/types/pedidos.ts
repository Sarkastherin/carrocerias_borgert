import {
  materialOptions,
  anchoOptions,
  arcosOptions,
  espesorOptions,
  zocaloOptions,
  lineasRefOptions,
  pisoOptions,
  cintasOptions,
} from "~/config/atributosMetadata";
import type { ClientesBD } from "./clientes";
export const statusOptions = [
  { value: "nuevo", label: "🆕 Nuevo" },
  { value: "en_produccion", label: "🏭 En Producción" },
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
  forma_pago_otros: string;
  fecha_entrega_estimada: string;
  status: (typeof statusOptions)[number]["value"];
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
  material: (typeof materialOptions)[number]["value"];
  ancho_ext: (typeof anchoOptions)[number]["value"];
  alto: number;
  alt_baranda: number;
  ptas_por_lado: number;
  puerta_trasera_id: string;
  arcos_por_puerta: (typeof arcosOptions)[number]["value"];
  corte_guardabarros: boolean;
  cumbreras: boolean;
  espesor_chapa: (typeof espesorOptions)[number]["value"];
  tipo_zocalo: (typeof zocaloOptions)[number]["value"];
  lineas_refuerzo: (typeof lineasRefOptions)[number]["value"];
  /* cuchetin */
  cuchetin: boolean;
  med_cuchetin: number;
  alt_pta_cuchetin: number;
  alt_techo_cuchetin: number;
  notas_cuchetin: string;
  /* color */
  color_lona_id: string;
  color_carrozado_id: string;
  color_zocalo_id: string;
  notas_color: string;
  tipo_piso: (typeof pisoOptions)[number]["value"];
  boquillas: number;
  med_cajon_herramientas: number;
  luces: number;
  med_alargue: number;
  quiebre_alargue: boolean;
  guardabarros: boolean;
  dep_agua: boolean;
  cintas_reflectivas: (typeof cintasOptions)[number]["value"];
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
export type PedidosUI = PedidosTable & {
  carroceria:
    | (CarroceriaBD & {
        carrozado_nombre: string;
        puerta_trasera_nombre: string;
        color_carrozado_nombre: string;
        color_zocalo_nombre: string;
        color_lona_nombre: string;
      })
    | null;
} & {
  trabajo_chasis: (TrabajoChasisBD & { tipo_trabajo_nombre: string })[];
} & { camion: CamionBD | null };
export type OrdenesBD = {
  id: string;
  fecha_creacion: string;
  pedido_id: string;
  tipo_orden: "fabricacion" | "pintura" | "chasis";
  responsable_id: string;
  fecha_ejecucion: string;
  url_archivo: string;
}