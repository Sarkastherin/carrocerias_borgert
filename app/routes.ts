import {
  type RouteConfig,
  index,
  prefix,
  route,
  layout,
} from "@react-router/dev/routes";
export default [
  route("login", "routes/login.tsx"),
  // Ruta de desarrollo para PDF (sin layout para pantalla completa)
  route("dev/pdf", "routes/dev.pdf.tsx"),

  layout("layouts/main.tsx", [
    index("routes/home.tsx"),
    ...prefix("clientes", [
      route("/", "routes/clientes/home.tsx"),
      route("nuevo", "routes/clientes/nuevo.tsx"),
      route(":clienteId", "routes/clientes/cliente.tsx"),
    ]),
    ...prefix("pedidos", [
      route("/", "routes/pedidos/home.tsx"),
      route("nuevo", "routes/pedidos/nuevo.tsx"),
      layout("layouts/layoutPedidos.tsx", [
        route("info/:pedidoId", "routes/pedidos/info.tsx"),
        route("carroceria/:pedidoId", "routes/pedidos/carroceria.tsx"),
        route("camion/:pedidoId", "routes/pedidos/camion.tsx"),
        route("trabajo-chasis/:pedidoId", "routes/pedidos/trabajo-chasis.tsx"),
        route("datos-colocacion/:pedidoId", "routes/pedidos/datos-colocacion.tsx"),
        route("ordenes-trabajo/:pedidoId", "routes/pedidos/ordenes-trabajo.tsx"),
        route("controles-calidad/:pedidoId", "routes/pedidos/controles-calidad.tsx"),
      ]),
    ]),
    ...prefix("settings", [
      index("routes/settings/home.tsx"),
      route("generales", "routes/settings/generales.tsx"),
      ...prefix("carrozados", [
        route("/", "routes/settings/carrozados/home.tsx"),
        route("parametros/:carrozadoId", "routes/settings/carrozados/parametros.tsx"),
      ])
    ]),
    ...prefix("ayuda", [
      index("routes/ayuda/home.tsx"),
      route("clientes", "routes/ayuda/clientes.tsx"),
      route("pedidos", "routes/ayuda/pedidos.tsx"),
      route("configuracion", "routes/ayuda/configuracion.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
