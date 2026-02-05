import { FileInput } from "./Inputs";
import { useState, type ChangeEvent } from "react";
import { FileText } from "lucide-react";
import { createFolderIfNotExists, uploadPDFToDrive } from "~/backend/driveAPI";
export const updateFilePDFPedidos = async (file: File, numeroPedido?: string) => {
  try {
    const folder = await createFolderIfNotExists("Documentos de Pedidos");
    const folderPedido = await createFolderIfNotExists(
      `${numeroPedido}`,
      folder.id,
    );
    const response = await uploadPDFToDrive(file, file.name, folderPedido.id);
    if (!response || !response.webViewLink) {
      throw new Error("Error al subir el archivo PDF");
    }
    return response.webViewLink;
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};
export const updateFilePDFCtaCte = async (file: File) => {
  try {
    const folder = await createFolderIfNotExists("Documentos de Ctas Ctes");
    const response = await uploadPDFToDrive(file, file.name, folder.id);
    if (!response || !response.webViewLink) {
      throw new Error("Error al subir el archivo PDF");
    }
    return response.webViewLink;
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};
export const LinkDocument = ({
  value,
  label,
}: {
  value: string;
  label?: string;
}) => {
  return (
    <a
      href={value}
      target="_blank"
      rel="noopener noreferrer"
      className="font-bold text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-700/30 dark:text-blue-500 px-2 py-1 rounded inline-block"
    >
      <FileText className="inline w-5 h-5 mr-2" />
      {label || "Ver documento cargado"}
    </a>
  );
};
export default function FileUploderComponent({
  value,
  setFile,
}: {
  value: string;
  setFile: (file: File | null) => void;
}) {
  const handleUploadFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Validaciones básicas
    if (file.type !== "application/pdf")
      throw new Error("Solo se permiten PDFs");

    if (file.size === 0) throw new Error("El archivo está vacío");
    setFile(file);
  };
  return (
    <>
      {!value && (
        <FileInput
          id="documento"
          label="Subir documento"
          accept=".pdf"
          onChange={(e) => handleUploadFile(e)}
        />
      )}
      {value && (
        <div className="w-fit">
          <LinkDocument value={value} label="Documento cargado" />
        </div>
      )}
    </>
  );
}
