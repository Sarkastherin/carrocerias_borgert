import ModalBase from "../ModalBase";
import ClienteForm from "../../forms/ClienteForm";
import { useState } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";
import type { ClientesBD } from "~/types/clientes";
import type { ProveedoresBD } from "~/types/proveedores";
import ProveedorForm from "~/components/forms/ProveedorForm";

export default function ProveedorNuevoModal({
  onClose,
  handleSelectedProveedor,
}: {
  onClose: () => void;
  handleSelectedProveedor?: (item: ProveedoresBD) => void;
}) {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Callback para cerrar el modal después de éxito
  const handleSuccess = (message: string) => {
    setSuccessMessage(message);
    setErrorMessage("");
    // Cerrar el modal después de 2 segundos
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const handleError = (message: string) => {
    setErrorMessage(message);
    setSuccessMessage("");
    setIsLoading(false);
  };

  const handleLoadingStart = () => {
    setIsLoading(true);
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleLoadingEnd = () => {
    setIsLoading(false);
  };

  return (
    <ModalBase 
      open={true} 
      title="Agregar Nuevo Proveedor" 
      onClose={onClose} 
      zIndex={40}
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

        <ProveedorForm 
          modal 
          onSuccess={handleSuccess}
          onError={handleError}
          onLoadingStart={handleLoadingStart}
          onLoadingEnd={handleLoadingEnd}
          isLoading={isLoading}
          handleSelectedProveedor={handleSelectedProveedor}
        />
      </div>
    </ModalBase>
  );
}
