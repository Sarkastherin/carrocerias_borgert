import type { Route } from "../+types/home";
import { Subheader } from "~/components/Headers";
import { Truck } from "lucide-react";
import { ContainerToForms } from "~/components/Containers";
import DatosColocacionForm from "~/components/forms/DatosColocacionForm";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Datos de Colocación" },
    { name: "description", content: "Datos relacionados con la colocación del camión" },
  ];
}
export default function DatosColocacionPedidos() {
  return (
    <ContainerToForms>
      <Subheader title="Datos de Colocación" icon={{component: Truck, color: "text-cyan-600 dark:text-cyan-400"}} />
      <DatosColocacionForm />
    </ContainerToForms>
  );
}
