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
        icon={<Drill className="w-6 h-6 text-purple" />}
      />
      <TrabajoChasisForm />
    </ContainerToForms>
  );
}
