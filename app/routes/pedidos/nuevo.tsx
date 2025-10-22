import { useEffect } from "react";
import type { Route } from "../+types/home";
import { useData } from "~/context/DataContext";
import { Subheader } from "~/components/Headers";
import { FilePlus2 } from "lucide-react";
import PedidosForm from "~/components/forms/PedidosForm";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Agregar Pedido" },
    { name: "description", content: "Agregar pedido" },
  ];
}
export default function PedidosNuevo() {
  const { setPedido } = useData();
  useEffect(() => {
    setPedido(null);
  }, []);
  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto">
      <Subheader title="Nuevo Pedido" icon={<FilePlus2 className="w-6 h-6 text-green" />} />
      <main className="w-full max-w-5xl p-6">
        <PedidosForm />
      </main>
    </div>
  )
}