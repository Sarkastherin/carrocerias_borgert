import ModalBase from "../ModalBase";
import { useState } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";
import { AddChequeForm } from "~/components/forms/AddChequeForm";
import { AddPagoForm } from "~/components/forms/AddPagoForm";
import { AddDeudaForm } from "~/components/forms/AddDeudaForm";
import type {
  CtaCteConCliente,
  CtasCtesWithCheque,
} from "~/types/ctas_corrientes";
import MovimientosForm from "~/components/forms/MovimientosForm";
export type TipoMovimiento =
  | "cheque"
  | "efectivo"
  | "carroceria_usada"
  | "deuda"
  | "nota_credito";

export default function EditMovimientoModal({
  onClose,
  data,
  client,
}: {
  onClose: () => void;
  data: CtasCtesWithCheque;
  client: CtaCteConCliente | null;
}) {

  return (
    <ModalBase
      open={true}
      title={" Movimiento"}
      onClose={onClose}
      zIndex={50}
      width="max-w-4xl"
    >
      <div className="py-4">
        <MovimientosForm data={data} client={client} />
      </div>
    </ModalBase>
  );
}
