import { useUIModals } from "~/context/ModalsContext";
import OrdenTrabajoModal from "~/components/modals/customs/OrdenTrabajoModal";
import type { PedidosUI, OrdenesBD } from "~/types/pedidos";
import { tipoOrdenOptions } from "~/types/pedidos";

export const useOrdenTrabajoModal = () => {
  const { showCustomModal, closeModal } = useUIModals();

  const openOrdenModal = (
    tipoOrden: typeof tipoOrdenOptions[number]["value"],
    pedidoData?: PedidosUI,
    order?: OrdenesBD
  ) => {
    showCustomModal(OrdenTrabajoModal, {
      tipoOrden,
      pedidoData,
      order, 
    });
  };

  return {
    openOrdenModal,
    closeOrdenModal: closeModal,
  };
};
