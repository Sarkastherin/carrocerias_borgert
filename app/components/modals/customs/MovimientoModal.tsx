import ModalBase from "../ModalBase";
import { useState } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";
import { AddChequeForm } from "~/components/forms/AddChequeForm";
import { AddPagoForm } from "~/components/forms/AddPagoForm";
import { AddDeudaForm } from "~/components/forms/AddDeudaForm";
export type TipoMovimiento =
  | "cheque"
  | "efectivo"
  | "carroceria_usada"
  | "deuda"
  | "nota_credito";

export default function MovimientoModal({
  onClose,
  type,
  clienteId,
  redirect
}: {
  onClose: () => void;
  type: TipoMovimiento;
  clienteId: string;
  redirect?: boolean;
}) {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const titulo = () => {
    switch (type) {
      case "cheque":
        return "Registrar Cheque";
      case "efectivo":
        return "Registrar Efectivo";
      case "carroceria_usada":
        return "Registrar Carrocería Usada";
      case "nota_credito":
        return "Registrar Nota de Crédito";
      case "deuda":
        return "Registrar Deuda";
      default:
        return "";
    }
  };

  return (
    <ModalBase
      open={true}
      title={titulo()}
      onClose={onClose}
      zIndex={50}
      width="max-w-4xl"
    >
      <div className="py-4">
        {/* Mensaje de éxito */}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{successMessage}</span>
          </div>
        )}

        {/* Mensaje de error */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{errorMessage}</span>
          </div>
        )}
        {type === "cheque" && <AddChequeForm clienteId={clienteId} redirect={redirect || false} />}
        {(type !== "cheque" && type !== "deuda") && (
          <AddPagoForm clienteId={clienteId} type={type} redirect={redirect} />
        )}
        {type === "deuda" && <AddDeudaForm clienteId={clienteId} redirect={redirect} />}
      </div>
    </ModalBase>
  );
}
