import type { Route } from "./+types/home";
import { FileInput, Input, Label } from "~/components/Inputs";
import { uploadPDFToDrive } from "~/backend/driveAPI";

const folderId = "1mQ1tRDEeHpmE1zEbQB-NjZNXaODUlPVS";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Developer" },
    {
      name: "description",
      content: "Testing and developer tools",
    },
  ];
}

export default function UploadFile() {
  //
  return (
    <FileInput
      id="documento"
      label="Upload files"
      accept=".pdf,.doc,.docx"
      onChange={async (e) => {
        const files = e.target.files?.[0];
        if (!files) return;

        // Validaciones básicas
        if (files.type !== "application/pdf") {
          alert("Solo se permiten PDFs");
          return;
        }

        if (files.size === 0) {
          alert("El archivo está vacío");
          return;
        }
        try {
          const response = await uploadPDFToDrive(files, files.name, folderId);
          console.log("File uploaded successfully:", response);
          //webViewLink
        } catch (error) {
          console.error("Error uploading files:", error);
        }
      }}
      requiredField
    />
  );
}
