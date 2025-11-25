import { useUIModals } from "~/context/ModalsContext";
import ControlesModal from "~/components/modals/customs/ControlesModal";
import type { PedidosUI, OrdenesBD, ControlesBD } from "~/types/pedidos";
import { tipoControlOptions } from "~/types/pedidos";

export const useControlesModal = () => {
  const { showCustomModal, closeModal } = useUIModals();

  const openControlesModal = (
    tipoOrden: (typeof tipoControlOptions)[number]["value"],
    pedidoData?: PedidosUI,
    control?: ControlesBD
  ) => {
    showCustomModal(ControlesModal, {
      tipoOrden,
      pedidoData,
      control
    });
  };

  return {
    openControlesModal,
    closeControlesModal: closeModal,
  };
};
