import { useEffect } from "react";
import type { Route } from "../+types/home";
import { useData } from "~/context/DataContext";
import { Spinning } from "~/components/Spinning";
import { Button, ButtonLink, ButtonLinkAdd } from "~/components/Buttons";
import { PlusIcon } from "lucide-react";
import { EntityTable } from "~/components/EntityTable";
import type { PedidosBD, PedidosTable } from "~/types/pedidos";
import type { TableColumn } from "react-data-table-component";
import { useNavigate } from "react-router";
import { formatDateUStoES } from "~/utils/formatDate";
import { BadgeStatus } from "~/components/Badge";
import LoadingComponent from "~/components/LoadingComponent";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Pedidos" },
    { name: "description", content: "Bienvenido a la gestión de pedidos" },
  ];
}
const pedidoColumns: TableColumn<PedidosTable>[] = [
  {
    name: "Núm. Pedido",
    selector: (row) => row.numero_pedido,
    width: "150px",
  },
  {
    name: "Cliente",
    selector: (row) => row.cliente_nombre|| "",
  },
  {
    name: "Fecha prevista",
    selector: (row) => formatDateUStoES(row.fecha_entrega_estimada),
    width: "150px",
  },
  {
    name: "Fecha de pedido",
    selector: (row) => formatDateUStoES(row.fecha_pedido),
    width: "150px",
  },

  {
    name: "Precio Total",
    selector: (row) => row.precio_total.toLocaleString("es-AR", { style: "currency", currency: "ARS" }),
    width: "180px",
  },
  {
    name: "Vendedor",
    selector: (row) => row.vendedor_asignado || "",
    width: "200px",
  },
  {
    name: "Estado",
    cell: (row) => <BadgeStatus status={row.status}>{row.status.slice(0, 1).toUpperCase() + row.status.replaceAll("_", " ").slice(1)}</BadgeStatus>,
    width: "150px",
  },
];
export default function PedidosHome() {
  const { getPedidos, pedidos, setPedido } = useData();
  const navigate = useNavigate();
  useEffect(() => {
    setPedido(null);
    if (!pedidos) getPedidos();
  }, []);
  const handleRowClick = (row: PedidosBD) => {
    navigate(`/pedidos/info/${row.id}`);
  };
  if (!pedidos) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingComponent content="Cargando pedidos..." />
        </div>
      </div>
    );
  }
  return (
    <>
      {pedidos.length === 0 ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col text-center space-y-3 text-text-secondary">
            <img
              src="/search.png"
              alt="No hay Pedidos"
              className="w-48 h-48 mx-auto mb-4"
            />
            <p className="text-xl font-semibold">No hay Pedidos.</p>
            <p className="text-sm">
              Puede agregar Pedidos haciendo clic en el botón de abajo
            </p>
            <div className="w-fit mx-auto">
              <ButtonLink variant="primary" to="/pedidos/nuevo">
                <div className="flex items-center justify-center gap-2">
                  <PlusIcon className="w-4 h-4" />
                  Agregar Pedido
                </div>
              </ButtonLink>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6">
          <EntityTable
            data={pedidos}
            columns={pedidoColumns}
            onRowClick={(row) => handleRowClick(row)}
            filterFields={[
              {
                key: "numero_pedido",
                label: "Número de Pedido",
                autoFilter: true,
              },
              { key: "vendedor_asignado", label: "Vendedor", autoFilter: true },
              {
                key: "status",
                label: "Estado",
                autoFilter: true,
                type: "select",
                options: (
                  <>
                    <option value="">Seleccione un status</option>
                    <option value="nuevo">🆕 Nuevo</option>
                    <option value="en_produccion">🛠️ En Producción</option>
                    <option value="finalizado">✅ Finalizado</option>
                    <option value="entregado">📦 Entregado</option>
                    <option value="cancelado">🚫 Cancelado</option>
                  </>
                ),
              },
            ]}
          />
          <ButtonLinkAdd to="/pedidos/nuevo">Nuevo Pedido</ButtonLinkAdd>
        </div>
      )}
    </>
  );
}
