import type { Route } from "../+types/home";
import { Subheader } from "~/components/Headers";
import { ScrollText } from "lucide-react";
import PedidosForm from "~/components/forms/PedidosForm";
import { ContainerToForms } from "~/components/Containers";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Editar Pedido" },
    { name: "description", content: "Edita los detalles del pedido" },
  ];
}
export default function PedidosPedido() {
  return (
      <ContainerToForms>
        <Subheader
          title="Pedido"
          icon={{component: ScrollText, color: "text-blue-600 dark:text-blue-400"}}
        />
        <PedidosForm />
      </ContainerToForms>
  );
}