// Tipos para Google Drive API
interface DriveFileMetadata {
  name: string;
  mimeType: string;
  parents?: string[];
}

interface DriveFile {
  id: string;
  name: string;
  parents?: string[];
  createdTime?: string;
  modifiedTime?: string;
  webViewLink?: string;
  webContentLink?: string;
}

interface DriveApiResponse {
  result: DriveFile;
}

interface DriveListResponse {
  result: {
    files: DriveFile[];
  };
}

// Declaración global para gapi (Google API client)
declare global {
  interface Window {
    gapi: {
      client: {
        drive: {
          files: {
            create: (params: {
              resource: DriveFileMetadata;
              media?: {
                mimeType: string;
                body: string | Blob;
              };
              fields: string;
            }) => Promise<DriveApiResponse>;
            list: (params: {
              q?: string;
              fields: string;
              pageSize?: number;
            }) => Promise<DriveListResponse>;
          };
        };
      };
    };
  }
  const gapi: typeof window.gapi & {
    client: {
      request: (params: {
        path: string;
        method: string;
        params?: any;
        headers?: any;
        body?: string | ArrayBuffer | Blob;
      }) => Promise<any>;
      drive: {
        files: {
          create: (params: {
            resource: DriveFileMetadata;
            media?: {
              mimeType: string;
              body: string | Blob;
            };
            fields: string;
          }) => Promise<DriveApiResponse>;
          list: (params: {
            q?: string;
            fields: string;
            pageSize?: number;
          }) => Promise<DriveListResponse>;
        };
      };
    };
  };
}

/**
 * Crea una nueva carpeta en Google Drive
 * @param name - Nombre de la carpeta a crear
 * @param parentId - ID de la carpeta padre (opcional). Si no se especifica, se creará en Mi unidad
 * @returns Objeto con información de la carpeta creada (incluyendo id, name)
 */
export async function createFolder(
  name: string,
  parentId?: string
): Promise<DriveFile> {
  try {
    if (!name) {
      throw new Error("El nombre de la carpeta es requerido");
    }

    // Metadatos de la carpeta
    const fileMetadata: DriveFileMetadata = {
      name: name,
      mimeType: "application/vnd.google-apps.folder",
    };

    // Si se especifica una carpeta padre, agregarla a los metadatos
    if (parentId) {
      fileMetadata.parents = [parentId];
    }

    // Crear la carpeta
    const response = await gapi.client.drive.files.create({
      resource: fileMetadata,
      fields: "id,name,parents,createdTime,modifiedTime",
    });

    console.log("Carpeta creada exitosamente:", response.result);
    return response.result;
  } catch (error) {
    console.error("Error al crear la carpeta:", error);
    throw new Error(
      `No se pudo crear la carpeta: ${error instanceof Error ? error.message : "Error desconocido"}`
    );
  }
}

/**
 * Busca una carpeta por nombre en una ubicación específica
 * @param folderName - Nombre de la carpeta a buscar
 * @param parentId - ID de la carpeta padre donde buscar (opcional)
 * @returns Información de la carpeta encontrada o null si no existe
 */
export async function findFolder(
  folderName: string,
  parentId?: string
): Promise<DriveFile | null> {
  try {
    let query = `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;

    if (parentId) {
      query += ` and '${parentId}' in parents`;
    }

    const response = await gapi.client.drive.files.list({
      q: query,
      fields: "files(id,name,parents,createdTime,modifiedTime)",
    });
    const folders = response.result.files;
    return folders.length > 0 ? folders[0] : null;
  } catch (error) {
    console.error("Error al buscar la carpeta:", error);
    throw new Error(
      `No se pudo buscar la carpeta: ${error instanceof Error ? error.message : "Error desconocido"}`
    );
  }
}

/**
 * Crea una carpeta si no existe, o devuelve la existente
 * @param name - Nombre de la carpeta
 * @param parentId - ID de la carpeta padre (opcional)
 * @returns Información de la carpeta (creada o existente)
 */
export async function createFolderIfNotExists(
  name: string,
  parentId?: string
): Promise<DriveFile> {
  try {
    // Primero buscar si la carpeta ya existe
    const existingFolder = await findFolder(name, parentId);

    if (existingFolder) {
      console.log("La carpeta ya existe:", existingFolder);
      return existingFolder;
    }

    // Si no existe, crearla
    return await createFolder(name, parentId);
  } catch (error) {
    console.error("Error en createFolderIfNotExists:", error);
    throw error;
  }
}

/**
 * Convierte un Blob a Base64
 * @param blob - El blob a convertir
 * @returns String en base64
 */
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        // Remover el prefijo data:application/pdf;base64,
        const base64 = reader.result.split(",")[1];
        resolve(base64);
      } else {
        reject(new Error("Failed to convert blob to base64"));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Sube un archivo PDF a Google Drive
 * @param pdfBlob - El blob del archivo PDF
 * @param fileName - Nombre del archivo (incluir .pdf)
 * @param folderId - ID de la carpeta donde subir el archivo (opcional)
 * @returns Información del archivo subido
 */
export async function uploadPDFToDrive(
  pdfBlob: Blob,
  fileName: string,
  folderId?: string
): Promise<DriveFile> {
  try {
    if (!fileName) {
      throw new Error("El nombre del archivo es requerido");
    }
    if (!fileName.toLowerCase().endsWith(".pdf")) {
      fileName += ".pdf";
    }

    // Verificar que el blob no esté vacío
    if (pdfBlob.size === 0) {
      throw new Error("El archivo PDF está vacío");
    }

    // Metadatos del archivo
    const fileMetadata: DriveFileMetadata = {
      name: fileName,
      mimeType: "application/pdf",
    };

    // Si se especifica una carpeta padre, agregarla a los metadatos
    if (folderId) {
      fileMetadata.parents = [folderId];
    }
    // Crear un nuevo Blob con el tipo MIME correcto
    const pdfBlobWithCorrectType = new Blob([pdfBlob], {
      type: "application/pdf",
    });

    // Crear boundary para multipart según especificación de Google
    const boundary = "-------314159265358979323846";

    // Preparar metadatos limpios
    const cleanMetadata: any = {
      name: fileName,
      mimeType: "application/pdf",
    };

    if (folderId) {
      cleanMetadata.parents = [folderId];
    }

    // Convertir el blob a base64 para incluir en el multipart string
    const base64Data = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Extraer solo la parte base64 (después de "data:application/pdf;base64,")
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.readAsDataURL(pdfBlobWithCorrectType);
    });

    // Crear el cuerpo multipart como string según especificación RFC 2046
    const multipartBody = [
      `--${boundary}`,
      "Content-Type: application/json; charset=UTF-8",
      "",
      JSON.stringify(cleanMetadata),
      "",
      `--${boundary}`,
      "Content-Type: application/pdf",
      "Content-Transfer-Encoding: base64",
      "",
      base64Data,
      `--${boundary}--`,
    ].join("\r\n");

    const response = await gapi.client.request({
      path: "https://www.googleapis.com/upload/drive/v3/files",
      method: "POST",
      params: {
        uploadType: "multipart",
        fields:
          "id,name,parents,createdTime,modifiedTime,webViewLink,webContentLink,mimeType",
      },
      headers: {
        "Content-Type": `multipart/related; boundary="${boundary}"`,
      },
      body: multipartBody,
    });
    // Verificar que el archivo realmente se creó
    if (!response.result || !response.result.id) {
      throw new Error(
        "La respuesta de Google Drive no contiene información del archivo"
      );
    }
    return response.result;
  } catch (error) {
    console.error("❌ Error detallado en uploadPDFToDrive:", error);
    console.error("📊 Información adicional:", {
      fileName,
      folderId,
      blobSize: pdfBlob?.size,
      blobType: pdfBlob?.type,
    });
    throw new Error(
      `No se pudo subir el archivo PDF: ${error instanceof Error ? error.message : "Error desconocido"}`
    );
  }
}

/**
 * Crea una estructura de carpetas para organizar las órdenes de trabajo
 * @param tipoOrden - Tipo de orden (fabricacion, pintura, chasis)
 * @param year - Año para organizar por fecha
 * @returns ID de la carpeta final donde subir el archivo
 */
export async function createOrderFolderStructure(
  tipoOrden: string,
  year: number
): Promise<string> {
  try {
    console.log(
      `📁 Creando estructura de carpetas para ${tipoOrden} - ${year}`
    );

    // 1. Crear/encontrar carpeta principal "Órdenes de Trabajo"
    console.log("🔍 Buscando/creando carpeta principal...");
    const mainFolder = await createFolderIfNotExists("Órdenes de Trabajo");
    console.log("✅ Carpeta principal:", mainFolder);

    // 2. Crear/encontrar carpeta del año
    console.log("🔍 Buscando/creando carpeta del año...");
    const yearFolder = await createFolderIfNotExists(
      year.toString(),
      mainFolder.id
    );
    console.log("✅ Carpeta del año:", yearFolder);

    // 3. Crear/encontrar carpeta del tipo de orden
    const tipoFormateado =
      tipoOrden.charAt(0).toUpperCase() + tipoOrden.slice(1);
    console.log(`🔍 Buscando/creando carpeta del tipo: ${tipoFormateado}`);
    const typeFolder = await createFolderIfNotExists(
      tipoFormateado,
      yearFolder.id
    );
    console.log("✅ Carpeta del tipo:", typeFolder);

    const folderStructure = {
      main: { name: mainFolder.name, id: mainFolder.id },
      year: { name: yearFolder.name, id: yearFolder.id },
      type: { name: typeFolder.name, id: typeFolder.id },
      finalId: typeFolder.id,
    };

    console.log("🏗️ Estructura de carpetas completada:", folderStructure);

    // Verificar que el ID final sea válido
    if (!typeFolder.id) {
      throw new Error("El ID de la carpeta final no es válido");
    }

    return typeFolder.id;
  } catch (error) {
    console.error("❌ Error creando estructura de carpetas:", error);
    throw error;
  }
}

/**
 * Función completa para subir un PDF con estructura de carpetas automática
 * @param pdfBlob - El blob del archivo PDF
 * @param fileName - Nombre del archivo
 * @param tipoOrden - Tipo de orden para organizar en carpetas
 * @returns Información del archivo subido con enlaces
 */
/**
 * Verifica que un archivo existe en Google Drive
 * @param fileId - ID del archivo a verificar
 * @returns Información del archivo si existe
 */
export async function verifyFileExists(
  fileId: string
): Promise<DriveFile | null> {
  try {
    const response = await (gapi.client.drive.files as any).get({
      fileId: fileId,
      fields: "id,name,parents,mimeType,size,webViewLink",
    });

    console.log("✅ Archivo verificado:", response.result);
    return response.result;
  } catch (error) {
    console.error("❌ Error verificando archivo:", error);
    return null;
  }
}

export async function uploadOrderPDF(
  pdfBlob: Blob,
  fileName: string,
  tipoOrden: string
): Promise<DriveFile & { webViewLink?: string; webContentLink?: string }> {
  try {
    const currentYear = new Date().getFullYear();
    // Crear estructura de carpetas
    const folderId = await createOrderFolderStructure(tipoOrden, currentYear);
    // Subir el archivo
    const uploadedFile = await uploadPDFToDrive(pdfBlob, fileName, folderId);
    const verification = await verifyFileExists(uploadedFile.id);
    if (!verification) {
      throw new Error("El archivo no se encontró después de la subida");
    }
    return uploadedFile;
  } catch (error) {
    throw error;
  }
}
