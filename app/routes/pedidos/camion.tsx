import type { Route } from "../+types/home";
import { Subheader } from "~/components/Headers";
import { Truck } from "lucide-react";
import CamionForm from "~/components/forms/CamionForm";
import { ContainerToForms } from "~/components/Containers";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Carrocería" },
    { name: "description", content: "Gestión de la fabricación del pedido" },
  ];
}
export default function CamionPedidos() {
  return (
    <ContainerToForms>
      <Subheader title="Camión" icon={{component: Truck, color: "text-red-600 dark:text-red-400"}} />
      <CamionForm />
    </ContainerToForms>
  );
}
