import type { Route } from "../+types/home";
import { Subheader } from "~/components/Headers";
import { Settings } from "lucide-react";
import { ContainerToForms } from "~/components/Containers";
import { NavLink } from "react-router";
import { CardLink } from "~/components/Cards";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Parametros Generales" },
    { name: "description", content: "Gestión de los parámetros generales" },
  ];
}
export default function ParametrosGenerales() {
  return (
    <ContainerToForms>
      <Subheader title="Parámetros y Configuraciones" icon={<Settings className="w-6 h-6 text-purple" />} />
      <p className="text-text-secondary">Gestión de los parámetros y configuraciones personalizados.</p>
      <div className="mt-4">
        <CardLink
          name="Parámetros Generales"
          path="generales"
          icon={Settings}
          description="Gestión de los parámetros de colores, carrozado y puertas traseras."
          variant="cyan"
        />
      </div>
    </ContainerToForms>
  );
}
