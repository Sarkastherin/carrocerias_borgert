import type { Route } from "../+types/home";
import { Subheader } from "~/components/Headers";
import { UserRoundPen } from "lucide-react";
import ClienteForm from "~/components/forms/ClienteForm";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Editar Cliente" },
    { name: "description", content: "Edita los detalles del cliente" },
  ];
}
export default function ClientesCliente() {
  return (
  <div className="flex flex-col items-center w-full max-w-6xl mx-auto px-6">
      <Subheader title="Editar Cliente" icon={<UserRoundPen className="w-6 h-6 text-blue" />} />
      <main className="w-full max-w-5xl p-6">
        <ClienteForm />
      </main>
    </div>)
}