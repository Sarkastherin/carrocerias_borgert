import { useEffect } from "react";
import type { Route } from "../+types/home";
import { useData } from "~/context/DataContext";
import { Subheader } from "~/components/Headers";
import { UserRoundPlus } from "lucide-react";
import ClienteForm from "~/components/forms/ClienteForm";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Agregar Cliente" },
    { name: "description", content: "Agregar cliente" },
  ];
}
export default function ClientesNuevo() {
  const { setCliente } = useData();
  useEffect(() => {
    setCliente(null);
  }, []);
  return (
    <div className="flex flex-col items-center w-full px-6">
      <Subheader
        title="Agregar Cliente"
        icon={{
          component: UserRoundPlus,
          color: "text-blue-600 dark:text-blue-400",
        }}
        back_path="/clientes"
      />
      <main className="w-full max-w-5xl p-6">
        <ClienteForm />
      </main>
    </div>
  )
}