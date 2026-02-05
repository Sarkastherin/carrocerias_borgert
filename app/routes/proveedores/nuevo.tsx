import { useEffect } from "react";
import type { Route } from "../+types/home";
import { useData } from "~/context/DataContext";
import { Subheader } from "~/components/Headers";
import { UserRoundPlus } from "lucide-react";
import ClienteForm from "~/components/forms/ClienteForm";
import  ProveedorForm from "~/components/forms/ProveedorForm";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Agregar Proveedor" },
    { name: "description", content: "Agregar proveedor" },
  ];
}
export default function ProveedoresNuevo() {
  const { setProveedor } = useData();
  useEffect(() => {
    setProveedor(null);
  }, []);
  return (
    <div className="flex flex-col items-center w-full px-6">
      <Subheader
        title="Agregar Proveedor"
        icon={{
          component: UserRoundPlus,
          color: "text-orange-600 dark:text-orange-400",
        }}
        back_path="/proveedores"
      />
      <main className="w-full max-w-5xl p-6">
        <ProveedorForm />
      </main>
    </div>
  )
}