import ModalBase from "../ModalBase";
import { useState } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";
import { TemplateMovimientosForm } from "~/components/forms/TemplateMovimientosForm";
import {
  optionsMedioPago,
  optionsTypeMov,
  type CtaCte,
  type MvtosWithCheques,
} from "~/types/ctas_corrientes";
import TemplateMovtoEdit from "~/components/forms/TemplateMovtoEdit";
import { capitalize } from "~/config/settingsConfig";
export default function MovimientoModal({
  onClose,
  data,
  clienteId,
  redirect,
  tipoMovimiento,
  medioPago,
  mode,
  ctaCte,
}: {
  onClose: () => void;
  data?: MvtosWithCheques;
  clienteId: string;
  redirect?: boolean;
  tipoMovimiento: (typeof optionsTypeMov)[number]["value"];
  medioPago: (typeof optionsMedioPago)[number]["value"];
  mode: "create" | "edit";
  ctaCte: CtaCte | null;
}) {
  return (
    <ModalBase
      open={true}
      title={`${mode === "create" ? "Registrar nuevo movimiento: " + capitalize(tipoMovimiento) : "Editar movimiento"}`}
      onClose={onClose}
      width="max-w-4xl"
    >
      <div className="py-4">
        {mode === "edit" && data && (
          <TemplateMovtoEdit data={data} ctaCte={ctaCte} />
        )}
        {mode === "create" && (
          <TemplateMovimientosForm
            redirect={redirect || false}
            clienteId={clienteId}
            tipoMovimiento={tipoMovimiento}
            medioPago={medioPago}
            ctaCte={ctaCte}
          />
        )}
      </div>
    </ModalBase>
  );
}
