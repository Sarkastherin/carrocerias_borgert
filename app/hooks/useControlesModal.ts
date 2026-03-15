import { useUIModals } from "~/context/ModalsContext";
import ControlesModal from "~/components/modals/customs/ControlesModal";
import type { PedidosUI, OrdenesYControlesBD, ControlesBD } from "~/types/pedidos";
import { tipoControlOptions } from "~/types/pedidos";
import type { ControlPorCarrozadoDB } from "~/types/settings";

export const useControlesModal = () => {
  const { showCustomModal, closeModal } = useUIModals();

  const openControlesModal = (
    tipoOrden: (typeof tipoControlOptions)[number]["value"],
    pedidoData?: PedidosUI,
    order?: OrdenesYControlesBD,
    ctrlCarrozadoByCarrozadoId?: ControlPorCarrozadoDB[]
  ) => {
    showCustomModal(ControlesModal, {
      tipoOrden,
      pedidoData,
      order,
      ctrlCarrozadoByCarrozadoId
    });
  };

  return {
    openControlesModal,
    closeControlesModal: closeModal,
  };
};
