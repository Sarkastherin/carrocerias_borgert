// crea un home simple para la sección de administración, con un título y un mensaje de bienvenida
import type { Route } from "../+types/home";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Administración" },
    { name: "description", content: "Bienvenido a la gestión de la sección de administración" },
  ];
}

export default function HomeAdministracion() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Administración</h1>
      <p>Bienvenido a la sección de administración. Aquí puedes gestionar las cuentas corrientes, cheques y otros aspectos administrativos de tu negocio.</p>
    </div>
  );
}