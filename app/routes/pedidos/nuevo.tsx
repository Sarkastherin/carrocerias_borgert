import { useEffect } from "react";
import type { Route } from "../+types/home";
import { Subheader } from "~/components/Headers";
import { FilePlus2 } from "lucide-react";
import PedidosForm from "~/components/forms/PedidosForm";
import { usePedido } from "~/context/PedidoContext";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Agregar Pedido" },
    { name: "description", content: "Agregar pedido" },
  ];
}
export default function PedidosNuevo() {
  const { setPedido } = usePedido();
  useEffect(() => {
    setPedido(null);
  }, []);
  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto">
      <Subheader title="Nuevo Pedido" icon={{component: FilePlus2, color: "text-green-600 dark:text-green-400"}}   back_path="/pedidos"/>
      <main className="w-full max-w-5xl p-6">
        <PedidosForm />
      </main>
    </div>
  )
}