import React, { useEffect, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import type { OrdenesBD, PedidosUI } from "~/types/pedidos";
import { OrdenFabricacionTemplate } from "~/components/pdf/OrdenFabricacionTemplate";
import { OrdenPinturaTemplate } from "~/components/pdf/OrdenPinturaTemplate";
import { OrdenMontajeTemplate } from "~/components/pdf/OrdenMontajeTemplate";
import { ControlCarrozadoTemplate } from "~/components/pdf/ControlCarrozadoTemplate";
import { uploadOrderPDF } from "~/backend/driveAPI";
import { ordenesAPI, pedidosAPI } from "~/backend/sheetServices";
import { tipoOrdenOptions } from "~/types/pedidos";
import type { ControlCarrozadoDB } from "~/types/settings";
import { useData } from "~/context/DataContext";

interface PDFGenerationOptions {
  tipoOrden: (typeof tipoOrdenOptions)[number]["value"];
  formData: Partial<OrdenesBD>;
  pedidoData?: PedidosUI;
  itemsControl?: ControlCarrozadoDB[];
}

export const useOrdenGenerator = () => {
  const { personal, getPersonal } = useData();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!personal) getPersonal();
  }, []);

  const generateOrdenPDF = async ({
    tipoOrden,
    formData,
    pedidoData,
    itemsControl,
  }: PDFGenerationOptions): Promise<Blob> => {
    if (!personal) return new Blob();
    const dataResponsable = personal.find((p) => p.id === formData.responsable_id)
    const responsable = dataResponsable ? `${dataResponsable.nombre} ${dataResponsable.apellido}` : "No asignado";
    setIsGenerating(true);
    setError(null);

    try {
      let pdfDocument: React.ReactElement<any>;

      // Seleccionar el template según el tipo de orden
      switch (tipoOrden) {
        case "fabricacion":
          pdfDocument = React.createElement(OrdenFabricacionTemplate, {
            pedidoData,
            formData,
            responsable,
          });
          break;
        case "pintura":
          pdfDocument = React.createElement(OrdenPinturaTemplate, {
            pedidoData,
            formData,
            responsable,
          });
          break;
        case "montaje":
          pdfDocument = React.createElement(OrdenMontajeTemplate, {
            pedidoData,
            responsable,
          });
          break;
        case "carrozado":
          pdfDocument = React.createElement(ControlCarrozadoTemplate, {
            pedidoData,
            formData,
            responsable,
            itemsControl,
          });
          break;
        default:
          throw new Error("Tipo de orden no reconocido");
      }

      const pdfInstance = pdf(pdfDocument);

      const blob = await pdfInstance.toBlob();

      if (blob.size === 0) {
        throw new Error(
          "El PDF generado está vacío. Puede ser un problema con los datos o el template."
        );
      }

      return blob;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error generando PDF";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const savePDFToDrive = async (
    pdfBlob: Blob,
    fileName: string,
    tipoOrden: string,
    existingOrder?: OrdenesBD
  ): Promise<string> => {
    setIsSaving(true);
    setError(null);

    try {
      // Verificar si el blob está vacío antes de subirlo
      if (pdfBlob.size === 0) {
        throw new Error("El PDF que se va a subir está vacío");
      }
      // Subir el PDF con estructura de carpetas automática
      const uploadedFile = await uploadOrderPDF(
        pdfBlob,
        fileName,
        tipoOrden,
        existingOrder
      );

      // Devolver el enlace para ver el archivo
      return (
        uploadedFile.webViewLink ||
        `https://drive.google.com/file/d/${uploadedFile.id}/view`
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error guardando archivo";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };
  const createRegisterAndUpdatePedido = async (
    urlFile: string,
    pedidoId: string,
    tipoOrden: (typeof tipoOrdenOptions)[number]["value"],
    responsable_id?: string,
    order?: OrdenesBD
  ) => {
    try {
      // Preparar datos para el registro de orden según la estructura OrdenesBD
      const ordenData = {
        pedido_id: pedidoId,
        tipo_orden: tipoOrden, // campo correcto según el tipo
        responsable_id: responsable_id || "sistema", // valor por defecto si no se proporciona
        fecha_ejecucion: "", // dejar vacío para que se llene luego
        url_archivo: urlFile,
        fecha_creacion: new Date().toISOString().split("T")[0], // formato YYYY-MM-DD
      };

      // Guardar registro en sheet de ordenes
      if (order) {
        await ordenesAPI.update(order.id, ordenData);
      } else {
        await ordenesAPI.create(ordenData);
      }

      // Actualizar pedido con link de orden y fecha
      if (ordenData.tipo_orden === "fabricacion") {
        await pedidosAPI.update(pedidoId, {
          fecha_fabricacion: new Date().toISOString().split("T")[0],
          status: "en_produccion",
          armador_id: responsable_id || "sistema",
        });
      }
      if (ordenData.tipo_orden === "pintura") {
        await pedidosAPI.update(pedidoId, {
          status: "en_pintura",
        });
      }
      if (ordenData.tipo_orden === "montaje") {
        await pedidosAPI.update(pedidoId, {
          status: "pintada",
        });
      }
    } catch (error) {
      console.error("❌ Error en createRegisterAndUpdatePedido:", error);
      throw new Error(
        `Error registrando orden: ${error instanceof Error ? error.message : "Error desconocido"}`
      );
    }
  };
  const closeOrder = async (
    orderId: string,
    formData: Partial<OrdenesBD>,
    tipoOrden: (typeof tipoOrdenOptions)[number]["value"],
    pedidoId: string
  ) => {
    try {
      const result = await ordenesAPI.update(orderId, formData);
      if (!result.success) {
        throw new Error("Fallo al cerrar la orden en la base de datos");
      }
      // Actualizar pedido con link de orden y fecha
      if (tipoOrden === "montaje" && formData.status === "completada") {
        const pedidoUpdated = await pedidosAPI.update(pedidoId, {
          status: "finalizado",
        });
      }
      return result;
      // Lógica para cerrar la orden
    } catch (error) {
      console.error("❌ Error cerrando la orden:", error);
      throw new Error(
        `Error cerrando la orden: ${error instanceof Error ? error.message : "Error desconocido"}`
      );
    }
  };

  const generateFileName = (
    tipoOrden: (typeof tipoOrdenOptions)[number]["value"],
    pedidoData?: PedidosUI
  ): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    const tipoPrefix: Record<
      (typeof tipoOrdenOptions)[number]["value"],
      string
    > = {
      fabricacion: "OT-FAB",
      pintura: "OT-PIN",
      montaje: "OT-MON",
    };

    const pedidoNum = pedidoData?.numero_pedido
      ? `-${pedidoData.numero_pedido}`
      : "";

    return `${tipoPrefix[tipoOrden]}-${year}${month}${day}${pedidoNum}.pdf`;
  };

  const generateAndSaveOrderPDF = async ({
    tipoOrden,
    formData,
    pedidoData,
  }: PDFGenerationOptions): Promise<string> => {
    try {
      const pdfBlob = await generateOrdenPDF({
        tipoOrden,
        formData,
        pedidoData,
      });
      const fileName = generateFileName(tipoOrden, pedidoData);
      const driveLink = await savePDFToDrive(pdfBlob, fileName, tipoOrden);

      return driveLink;
    } catch (error) {
      console.error("Error en generateAndSaveOrderPDF:", error);
      throw error;
    }
  };

  const resetState = () => {
    setError(null);
    setIsGenerating(false);
    setIsSaving(false);
  };

  return {
    generateOrdenPDF,
    savePDFToDrive,
    generateFileName,
    generateAndSaveOrderPDF,
    createRegisterAndUpdatePedido,
    closeOrder,
    isGenerating,
    isSaving,
    error,
    resetState,
  };
};
