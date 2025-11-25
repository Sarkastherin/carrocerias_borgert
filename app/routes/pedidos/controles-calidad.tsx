import type { Route } from "../+types/home";
import { Subheader } from "~/components/Headers";
import { Badge, FileBox } from "lucide-react";
import { ContainerToForms } from "~/components/Containers";
import { getIcon } from "~/components/IconComponent";
import { GlassCard } from "~/components/GlassCard";
import { tipoControlOptions } from "~/types/pedidos";
import { useControlesModal } from "~/hooks/useControlesModal";
import { useData } from "~/context/DataContext";
import { useEffect } from "react";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Controles de Calidad" },
    { name: "description", content: "Generar Controles de Calidad" },
  ];
}
export default function ControlesCalidad() {
  const { pedido, getControlesByPedidoId, controlesByPedido } = useData();
  const { openControlesModal } = useControlesModal();
  // Cargar las órdenes del pedido actual
  useEffect(() => {
    if (pedido?.id) {
      getControlesByPedidoId(pedido.id);
    }
  }, [pedido?.id, getControlesByPedidoId]);
  const tipoControles = [
    {
      name: "Control de Carrozado",
      description:
        "Generar control de calidad para la carrocería ensamblada según las especificaciones del pedido.",
      icon: FileBox,
      tipo: "carrozado" as (typeof tipoControlOptions)[number]["value"],
      disabled: false,
      control: controlesByPedido?.find(
        (control) => control.tipo_control === "carrozado"
      ),
    },
    {
      name: "Control de Pintura",
      description:
        "Proximamente: Generar control de calidad para la pintura y acabados de componentes de la carrocería",
      icon: FileBox,
      tipo: "pintura" as (typeof tipoControlOptions)[number]["value"],
      disabled: true,
      control: controlesByPedido?.find(
        (control) => control.tipo_control === "pintura"
      ),
    },
    {
      name: "Control final",
      description: "Proximamente: Generar control de calidad final",
      icon: FileBox,
      tipo: "final" as (typeof tipoControlOptions)[number]["value"],
      disabled: true,
      control: controlesByPedido?.find(
        (control) => control.tipo_control === "final"
      ),
    },
  ];
  return (
    <ContainerToForms>
      <Subheader
        title="Controles de Calidad"
        icon={{ component: FileBox, color: "text-pink-600 dark:text-pink-400" }}
      />
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="text-center">
          <div className="mb-6">
            <FileBox className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Próximamente
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md">
            Estamos trabajando en esta funcionalidad. Los controles de calidad
            estarán disponibles muy pronto.
          </p>
        </div>
      </div>
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tipoControles.map((control) => {
          const IconComponent = getIcon({
            icon: control.icon as any,
            size: 6,
            color: "text-gray-500 dark:text-gray-200",
          });
          return (
            <GlassCard
              key={control.tipo}
              size="md"
              blur="lg"
              opacity="low"
              padding="md"
              className={`!border-gray-300/80 dark:!border-white/20 ${control.disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100/50 dark:hover:bg-white/20 hover:scale-105 hover:shadow-2xl"} transition-all duration-300  overflow-hidden`}
            >
              <div
                className={`flex flex-col items-start h-full cursor-pointer ${control.disabled ? "pointer-events-none" : ""}`}
                onClick={() => {
                  if (!pedido) return;
                  console.log('Abriendo modal para control:', control.tipo);
                  openControlesModal(control.tipo, pedido, control.control);
                }}
              >
                <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 rounded-xl bg-gray-500/20 dark:bg-white/20 backdrop-blur-sm group-hover:bg-white/30  transition-colors">
                  {IconComponent}
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-text-primary mb-2 group-hover:text-gray-100 transition-colors">
                  {control.name}
                </h2>
                <p className="text-sm text-text-secondary group-hover:text-gray-100 transition-colors leading-relaxed flex-1">
                  {control.description}
                </p>
              </div>
            </GlassCard>
          );
        })}
      </div> */}
    </ContainerToForms>
  );
}
