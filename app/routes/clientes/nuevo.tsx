import { useEffect } from "react";
import type { Route } from "../+types/home";
import { useData } from "~/context/DataContext";
import { Spinning } from "~/components/Spinning";
import { Button, ButtonLink } from "~/components/Buttons";
import { PlusIcon } from "lucide-react";
import { EntityTable } from "~/components/EntityTable";
import type { ClientesBD } from "~/types/clientes"
import { Subheader } from "~/components/Headers";
import { FolderKanban, UserRoundPlus } from "lucide-react";
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
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto">
      <Subheader title="Nuevo Cliente" icon={<UserRoundPlus className="w-6 h-6 text-purple" />} />
      <main className="w-full max-w-5xl p-6">
        <ClienteForm />
      </main>
    </div>
  )
}