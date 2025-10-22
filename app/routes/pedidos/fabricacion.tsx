import type { Route } from "../+types/home";
import { Subheader } from "~/components/Headers";
import { FilePen } from "lucide-react";
import PedidosForm from "~/components/forms/PedidosForm";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Fabricación" },
    { name: "description", content: "Gestión de la fabricación del pedido" },
  ];
}
export default function PedidosFabricacion() {
  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto">
      <Subheader title="Fabricación del Pedido" icon={<FilePen className="w-6 h-6 text-blue" />} />
      <main className="w-full max-w-5xl p-6">
        <PedidosForm />
      </main>
    </div>)
}