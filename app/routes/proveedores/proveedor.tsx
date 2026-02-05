import type { Route } from "../+types/home";
import { Subheader } from "~/components/Headers";
import { UserRoundPen } from "lucide-react";
import ProveedorForm from "~/components/forms/ProveedorForm";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Editar Proveedor" },
    { name: "description", content: "Edita los detalles del proveedor" },
  ];
}
export default function ProveedorID() {
  return (
    <div className="flex flex-col items-center w-full px-6">
      <Subheader
        title="Editar Proveedor"
        icon={{
          component: UserRoundPen,
          color: "text-orange-600 dark:text-orange-400",
        }}
        back_path="/proveedores"
      />
      <main className="w-full max-w-5xl p-6">
        <ProveedorForm />
      </main>
    </div>
  );
}
