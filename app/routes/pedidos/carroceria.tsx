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
export default function PedidosCarroceria() {
  return (
    <ContainerToForms>
      <Subheader
        title="Carrocería"
        icon={{component: LayoutPanelTop, color: "text-yellow-600 dark:text-yellow-400"}}
      />
      <CarroceriaForm />
    </ContainerToForms>
  );
}