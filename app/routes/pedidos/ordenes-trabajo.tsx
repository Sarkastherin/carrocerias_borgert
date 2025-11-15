import type { Route } from "../+types/home";
import { Subheader } from "~/components/Headers";
import { Hammer, BrushCleaning, ToolCase, FileBox } from "lucide-react";
import { ContainerToForms } from "~/components/Containers";
import { GlassCard } from "~/components/GlassCard";
import { getIcon } from "~/components/IconComponent";
import { useOrdenTrabajoModal } from "~/hooks/useOrdenTrabajoModal";
import type { TipoOrden } from "~/components/modals/customs/OrdenTrabajoModal";
import { useData } from "~/context/DataContext";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Órdenes de Trabajo" },
    { name: "description", content: "Generar Ordenes de trabajo" },
  ];
}
export default function OrdenesPedidos() {
  const { pedido } = useData();
  const { openOrdenModal } = useOrdenTrabajoModal();

  const ordenes = [
    {
      name: "Fabricación de Carrocerías",
      description:
        "Generar órden de trabajo para la fabricación de la carrocería según las especificaciones del pedido.",
      icon: Hammer,
      tipo: "fabricacion" as TipoOrden,
    },
    {
      name: "Pintura y Acabados",
      description:
        "Generar órden de trabajo para la pintura y acabados de componentes de la carrocería",
      icon: BrushCleaning,
      tipo: "pintura" as TipoOrden,
    },
    {
      name: "Colocación y trabajos en chasis",
      description:
        "Generar órden de trabajo para la colocación y ensamblaje de componentes de la carrocería",
      icon: ToolCase,
      tipo: "chasis" as TipoOrden,
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ordenes.map((orden) => {
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
              className="!border-gray-300/80 dark:!border-white/20 hover:bg-gray-100/50 dark:hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden"
            >
              <div
                className="flex flex-col items-start h-full cursor-pointer"
                onClick={() => {
                  if (pedido) openOrdenModal(orden.tipo, pedido);
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
              </div>
            </GlassCard>
          );
        })}
      </div>
    </ContainerToForms>
  );
}
