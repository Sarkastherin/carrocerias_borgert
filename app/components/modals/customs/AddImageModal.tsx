import ModalBase from "../ModalBase";
import { FileInput } from "~/components/Inputs";
import { Button } from "~/components/Buttons";
import { useState } from "react";
import { carrozadoAPI } from "~/backend/sheetServices";
import { AlertCircle, CheckCircle } from "lucide-react";
const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;

type AddImageModalProps = {
  onClose: () => void;
  carrozadoId: string;
};

export function AddImageModal({ onClose, carrozadoId }: AddImageModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleSelectFile = (file: File | null) => {
    setSelectedFile(file);
  };
  const handleUploadImage = async () => {
    if (!selectedFile) return;
    try {
      setIsLoading(true);
      setSuccessMessage(""); // Limpiar mensaje anterior
      setErrorMessage(""); // Limpiar mensaje de error anterior
      const imageUrl = await uploadToCloudinary(selectedFile);
      if (imageUrl) {
        console.log("Uploaded image URL:", imageUrl);
        // Aquí puedes agregar la lógica para guardar la URL en tu backend o estado
        const response = await carrozadoAPI.update(carrozadoId, {
          imagen: imageUrl,
        });
        if (!response.success)
          throw new Error("Error updating carrozado with image URL");
        setSuccessMessage("Imagen subida exitosamente.");
      }
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
    }
  };
  const uploadToCloudinary = async (selectedFile: File) => {
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("upload_preset", "carrocerias borgert");
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      return data.url;
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
    }
  };
  return (
    <ModalBase
      open={true}
      title={"Agregar imagen"}
      onClose={onClose}
      zIndex={50}
      width="max-w-md"
    >
      <div className="space-y-4">
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
        <p className="text-sm text-text-secondary">
          Selecciona una imagen del modelo de carrozado, esta aparecerá como
          portada
        </p>

        <FileInput
          accept="image/*"
          label="Imagen de carrocería"
          onChange={(e) =>
            handleSelectFile(e.target.files ? e.target.files[0] : null)
          }
        />

        <div className="flex gap-3 justify-end pt-4">
          <Button
            variant="light"
            onClick={() => {
              setSelectedFile(null);
              onClose();
            }}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleUploadImage}
            disabled={isLoading}
          >
            Subir Imagen
          </Button>
        </div>
      </div>
    </ModalBase>
  );
}
