import { useUIModals } from "~/context/ModalsContext";
import MovimientoModal from "./modals/customs/MovimientoModal";
import { Banknote, HandCoins, Truck } from "lucide-react";
import { IconButton } from "./Buttons";
import { optionsMedioPago, optionsTypeMov, type CtaCte } from "~/types/ctas_corrientes";
export default function ButtonsActionsCtaCte({
  clienteId,
  redirect,
  ctaCte,
}: {
  clienteId: string;
  redirect?: boolean;
  ctaCte: CtaCte | null;
}) {
  const { openModal } = useUIModals();
  const handleMovimientoModal = ({
    tipoMovimiento,
    medioPago,
  }: {
    tipoMovimiento: (typeof optionsTypeMov)[number]["value"];
    medioPago: (typeof optionsMedioPago)[number]["value"];
  }) => {
    openModal("CUSTOM", {
      component: MovimientoModal,
      props: {
        clienteId: clienteId,
        redirect: redirect,
        tipoMovimiento: tipoMovimiento,
        medioPago: medioPago,
        mode: "create",
        ctaCte: ctaCte,
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
          onClick={() =>
            handleMovimientoModal({
              tipoMovimiento: "deuda",
              medioPago: "no aplica",
            })
          }
        >
          <Banknote className="w-5 h-5 mr-2" />
          Deuda
        </IconButton>
        <IconButton
          variant="dark"
          onClick={() =>
            handleMovimientoModal({
              tipoMovimiento: "nota_credito",
              medioPago: "no aplica",
            })
          }
        >
          <Banknote className="w-5 h-5 mr-2" />
          Nota de crédito
        </IconButton>

        <IconButton
          variant="green"
          onClick={() =>
            handleMovimientoModal({
              tipoMovimiento: "pago",
              medioPago: "cheque",
            })
          }
        >
          <Banknote className="w-5 h-5 mr-2" />
          Cheque
        </IconButton>
        <IconButton
          variant="blue"
          onClick={() =>
            handleMovimientoModal({
              tipoMovimiento: "pago",
              medioPago: "efectivo",
            })
          }
        >
          <HandCoins className="w-5 h-5 mr-2" />
          Efectivo/Tranferencia
        </IconButton>
        <IconButton
          variant="yellow"
          onClick={() =>
            handleMovimientoModal({
              tipoMovimiento: "carroceria_usada",
              medioPago: "carroceria_usada",
            })
          }
        >
          <Truck className="w-5 h-5 mr-2" />
          Carrocería
        </IconButton>
      </fieldset>
    </div>
  );
}
