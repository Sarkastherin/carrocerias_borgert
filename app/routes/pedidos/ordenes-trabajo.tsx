import type { Route } from "../+types/home";
import { Subheader } from "~/components/Headers";
import { Hammer, BrushCleaning, ToolCase, FileBox } from "lucide-react";
import { ContainerToForms } from "~/components/Containers";
import { GlassCard } from "~/components/GlassCard";
import { getIcon } from "~/components/IconComponent";
import { useOrdenTrabajoModal } from "~/hooks/useOrdenTrabajoModal";
import { useData } from "~/context/DataContext";
import { useEffect } from "react";
import { Badge, BadgeStatusOrden } from "~/components/Badge";
import { tipoOrdenOptions } from "~/types/pedidos";
import { LinkDocument } from "~/components/FileUpladerComponent";
import { capitalize } from "~/config/settingsConfig";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Órdenes de Trabajo" },
    { name: "description", content: "Generar Ordenes de trabajo" },
  ];
}
export default function OrdenesPedidos() {
  const { pedido, getOrdenesByPedidoId, ordenesByPedido } = useData();
  const { openOrdenModal } = useOrdenTrabajoModal();

  // Cargar las órdenes del pedido actual
  useEffect(() => {
    if (pedido?.id) {
      getOrdenesByPedidoId(pedido.id);
    }
  }, [pedido?.id, getOrdenesByPedidoId]);
  const tipoOrdenes = [
    {
      name: "Fabricación de Carrocerías",
      description:
        "Generar órden de trabajo para la fabricación de la carrocería según las especificaciones del pedido.",
      icon: Hammer,
      tipo: "fabricacion" as (typeof tipoOrdenOptions)[number]["value"],
      isCreated: ordenesByPedido
        ? ordenesByPedido.some((orden) => orden.tipo_orden === "fabricacion")
        : false,
      urlFile: ordenesByPedido?.find(
        (order) => order.tipo_orden === "fabricacion",
      )?.url_archivo,
      order: ordenesByPedido?.find(
        (order) => order.tipo_orden === "fabricacion",
      ),
      disabled: false,
    },
    {
      name: "Pintura y Acabados",
      description:
        "Generar órden de trabajo para la pintura y acabados de componentes de la carrocería",
      icon: BrushCleaning,
      tipo: "pintura" as (typeof tipoOrdenOptions)[number]["value"],
      isCreated: ordenesByPedido
        ? ordenesByPedido.some((orden) => orden.tipo_orden === "pintura")
        : false,
      urlFile: ordenesByPedido?.find((order) => order.tipo_orden === "pintura")
        ?.url_archivo,
      order: ordenesByPedido?.find((order) => order.tipo_orden === "pintura"),
      disabled: false
    },
    {
      name: "Colocación y trabajos en chasis",
      description:
        "Generar órden de trabajo para la colocación y ensamblaje de componentes de la carrocería",
      icon: ToolCase,
      tipo: "montaje" as (typeof tipoOrdenOptions)[number]["value"],
      isCreated: ordenesByPedido
        ? ordenesByPedido.some((orden) => orden.tipo_orden === "montaje")
        : false,
      urlFile: ordenesByPedido?.find((order) => order.tipo_orden === "montaje")
        ?.url_archivo,
      order: ordenesByPedido?.find((order) => order.tipo_orden === "montaje"),
      disabled: ordenesByPedido?.find((order) => order.tipo_orden === "pintura")?.status !== "completada" // Deshabilitar si la orden de pintura no está completada
    },
  ];
  return (
    <ContainerToForms>
      <Subheader
        title="Órdenes de Trabajo"
        icon={{
          component: FileBox,
          color: "text-green-600 dark:text-green-400",
        }}
      />
      {pedido?.carroceria ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tipoOrdenes.map((orden) => {
            const IconComponent = getIcon({
              icon: orden.icon as any,
              size: 6,
              color: "text-gray-500 dark:text-gray-200",
            });
            return (
              <GlassCard
                key={orden.tipo}
                size="md"
                blur="lg"
                opacity="low"
                padding="md"
                className={`!border-gray-300/80 dark:!border-white/20 hover:bg-gray-100/50 dark:hover:bg-white/20 transition-all duration-300  hover:shadow-2xl overflow-hidden ${orden.disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-105 cursor-pointer"}`}
              >
                <button
                  className="flex flex-col items-start h-full text-start"
                  disabled={orden.disabled}
                  onClick={() => {
                    if (pedido) openOrdenModal(orden.tipo, pedido, orden.order);
                  }}
                >
                  <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 rounded-xl bg-gray-500/20 dark:bg-white/20 backdrop-blur-sm group-hover:bg-white/30  transition-colors">
                    {IconComponent}
                  </div>
                  <h2 className="text-lg sm:text-xl font-semibold text-text-primary mb-2 group-hover:text-gray-100 transition-colors">
                    {orden.name}
                  </h2>
                  <p className="text-sm text-text-secondary group-hover:text-gray-100 transition-colors leading-relaxed flex-1">
                    {orden.description}
                  </p>
                  {orden.order && orden.order.status && (
                    <BadgeStatusOrden status={orden.order.status}>
                      {capitalize(orden.order.status.replace("_", " "))}
                    </BadgeStatusOrden>
                  )}
                </button>
              </GlassCard>
            );
          })}
          {pedido?.documentos && pedido.documentos.length > 0 && (
            <GlassCard
              size="full"
              blur="lg"
              opacity="low"
              padding="md"
              className="!border-gray-300/80 dark:!border-white/20 col-span-3"
            >
              <div className="flex flex-col items-start h-full">
                <h2 className="text-lg sm:text-xl font-semibold text-text-primary mb-2">
                  Documentos asociados
                </h2>
                {pedido.documentos.map((doc) => (
                  <LinkDocument key={doc.id} url={doc.url} label={doc.nombre} />
                ))}
              </div>
            </GlassCard>
          )}
        </div>
      ) : (
        <p className="text-center text-text-secondary mt-8">
          No hay carrocería asociada a este pedido.
        </p>
      )}
    </ContainerToForms>
  );
}
