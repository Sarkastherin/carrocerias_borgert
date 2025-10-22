import ModalBase from "../ModalBase";
import ClienteForm from "../../forms/ClienteForm";

export default function ClienteNuevoModal({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <ModalBase 
      open={true} 
      title="Agregar Nuevo Cliente" 
      onClose={onClose} 
      zIndex={50} // Z-index intermedio para permitir que loading/success se muestren encima
      width="max-w-4xl"
    >
      <div className="py-4">
        <ClienteForm modal />
      </div>
    </ModalBase>
  );
}
