import type { Route } from "../+types/home";
import { Subheader } from "~/components/Headers";
import { FileBox } from "lucide-react";
import CamionForm from "~/components/forms/CamionForm";
import { ContainerToForms } from "~/components/Containers";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Controles de Calidad" },
    { name: "description", content: "Generar Controles de Calidad" },
  ];
}
export default function ControlesCalidad() {
  return (
    <ContainerToForms>
      <Subheader title="Controles de Calidad" icon={{component: FileBox, color: "text-pink-600 dark:text-pink-400"}} />
      
    </ContainerToForms>
  );
}
