import type { Route } from "../+types/home";
import { Subheader } from "~/components/Headers";
import { LayoutPanelTop } from "lucide-react";
import CarroceriaForm from "~/components/forms/CarroceriaForm";
import { ContainerToForms } from "~/components/Containers";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Fabricación" },
    { name: "description", content: "Gestión de la fabricación del pedido" },
  ];
}
export default function PedidosFabricacion() {
  return (
    <ContainerToForms>
      <Subheader
        title="Carrocería"
        icon={<LayoutPanelTop className="w-6 h-6 text-yellow" />}
      />
      <CarroceriaForm />
    </ContainerToForms>
  );
}
