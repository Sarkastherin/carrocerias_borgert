import {
  type RouteConfig,
  index,
  prefix,
  route,
  layout,
} from "@react-router/dev/routes";
export default [
  route("login", "routes/login.tsx"),
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
      ]),
    ]),
    ...prefix("settings", [
      index("routes/settings/home.tsx"),
      route("generales", "routes/settings/generales.tsx"),
      /* layout("layouts/layoutSettings.tsx", [
        route("/", "routes/settings/home.tsx"),
      ]), */
    ]),
    ...prefix("ayuda", [
      index("routes/ayuda/home.tsx"),
      route("clientes", "routes/ayuda/clientes.tsx"),
      route("pedidos", "routes/ayuda/pedidos.tsx"),
      route("configuracion", "routes/ayuda/configuracion.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
