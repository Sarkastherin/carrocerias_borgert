import { useUIModals } from "~/context/ModalsContext";
import type { TipoMovimiento } from "./modals/customs/MovimientoModal";
import MovimientoModal from "./modals/customs/MovimientoModal";
import { Banknote, HandCoins, Truck } from "lucide-react";
import { IconButton } from "./Buttons";
export default function ButtonsActionsCtaCte({clienteId, redirect}: {clienteId: string, redirect?: boolean}) {
  const { openModal } = useUIModals();
  const handleMovimientoModal = (type: TipoMovimiento) => {
      openModal("CUSTOM", {
        component: MovimientoModal,
        props: {
          type: type,
          clienteId: clienteId,
          redirect: redirect,
        },
      });
    };
  return (
    <div className="flex justify-between gap-4 mb-4">
      <fieldset className="flex w-full gap-4 border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800">
        <legend className="px-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          💳 Registrar movimientos
        </legend>
        <IconButton
          variant="light"
          onClick={() => handleMovimientoModal("deuda")}
        >
          <Banknote className="w-5 h-5 mr-2" />
          Deuda
        </IconButton>
        <IconButton
          variant="dark"
          onClick={() => handleMovimientoModal("nota_credito")}
        >
          <Banknote className="w-5 h-5 mr-2" />
          Nota de crédito
        </IconButton>

        <IconButton
          variant="green"
          onClick={() => handleMovimientoModal("cheque")}
        >
          <Banknote className="w-5 h-5 mr-2" />
          Cheque
        </IconButton>
        <IconButton
          variant="blue"
          onClick={() => handleMovimientoModal("efectivo")}
        >
          <HandCoins className="w-5 h-5 mr-2" />
          Efectivo/Tranferencia
        </IconButton>
        <IconButton
          variant="yellow"
          onClick={() => handleMovimientoModal("carroceria_usada")}
        >
          <Truck className="w-5 h-5 mr-2" />
          Carrocería
        </IconButton>
      </fieldset>
    </div>
  );
}
