import { useState } from 'react';
import { useUIModals } from '~/context/ModalsContext';
import OrdenTrabajoModal, { type TipoOrden } from '~/components/modals/customs/OrdenTrabajoModal';
import type { PedidosUI } from '~/types/pedidos';

export const useOrdenTrabajoModal = () => {
  const { showCustomModal, closeModal } = useUIModals();

  const openOrdenModal = (tipoOrden: TipoOrden, pedidoData?: PedidosUI) => {
    showCustomModal(OrdenTrabajoModal, {
      tipoOrden,
      pedidoData,
    });
  };

  return {
    openOrdenModal,
    closeOrdenModal: closeModal,
  };
};