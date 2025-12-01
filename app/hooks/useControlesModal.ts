import { useUIModals } from "~/context/ModalsContext";
import ControlesModal from "~/components/modals/customs/ControlesModal";
import type { PedidosUI, OrdenesBD, ControlesBD } from "~/types/pedidos";
import { tipoControlOptions } from "~/types/pedidos";
import type { ControlCarrozadoDB } from "~/types/settings";

export const useControlesModal = () => {
  const { showCustomModal, closeModal } = useUIModals();

  const openControlesModal = (
    tipoOrden: (typeof tipoControlOptions)[number]["value"],
    pedidoData?: PedidosUI,
    control?: ControlesBD,
    ctrlCarrozadoByCarrozadoId?: ControlCarrozadoDB[]
  ) => {
    showCustomModal(ControlesModal, {
      tipoOrden,
      pedidoData,
      control,
      ctrlCarrozadoByCarrozadoId
    });
  };

  return {
    openControlesModal,
    closeControlesModal: closeModal,
  };
};
