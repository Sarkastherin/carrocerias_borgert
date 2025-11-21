import type { Route } from "../+types/home";
import { Subheader } from "~/components/Headers";
import { FileBox } from "lucide-react";
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
      
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="text-center">
          <div className="mb-6">
            <FileBox className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Próximamente
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md">
            Estamos trabajando en esta funcionalidad. Los controles de calidad estarán disponibles muy pronto.
          </p>
        </div>
      </div>
    </ContainerToForms>
  );
}
