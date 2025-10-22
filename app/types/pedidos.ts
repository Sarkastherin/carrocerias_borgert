export type StatusPedidos = "nuevo" | "en_produccion" | "finalizado" | "entregado" | "cancelado";
export type PedidosBD = {
  id: string;
  fecha_creacion: string;
  fecha_fabricacion: string;
  numero_pedido: string;
  cliente_id: string;
  precio_total: number;
  forma_pago: string;
  fecha_entrega_estimada: string;
  status: StatusPedidos;
  // campos a cargar a posteriori
  fecha_entrega: string;
  notas_entrega: string;
  vendedor_asignado: string;
}
export type PedidosTable = PedidosBD & {
  cliente_nombre: string;
}