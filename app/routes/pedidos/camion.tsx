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
export default function CamionFabricacion() {
  return (
    <ContainerToForms>
      <Subheader title="Camión" icon={<Truck className="w-6 h-6 text-red" />} />
      <CamionForm />
    </ContainerToForms>
  );
}
