import type { Route } from "../+types/home";
import { Subheader } from "~/components/Headers";
import { Drill } from "lucide-react";
import TrabajoChasisForm from "~/components/forms/TrabajoChasisForm";
import { ContainerToForms } from "~/components/Containers";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Trabajos en Chasis" },
    { name: "description", content: "Gestión de la fabricación del pedido" },
  ];
}
export default function PedidosTrabajoChasis() {
  return (
    <ContainerToForms>
      <Subheader
        title="Trabajos en Chasis"
        icon={{component: Drill, color: "text-purple-600 dark:text-purple-400"}}
      />
      <TrabajoChasisForm />
    </ContainerToForms>
  );
}
