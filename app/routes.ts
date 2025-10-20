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
  ]),
] satisfies RouteConfig;
