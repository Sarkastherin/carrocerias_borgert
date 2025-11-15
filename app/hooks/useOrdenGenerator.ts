import React, { useState } from 'react';
import { pdf, Document } from '@react-pdf/renderer';
import type { TipoOrden } from '~/components/modals/customs/OrdenTrabajoModal';
import type { PedidosUI } from '~/types/pedidos';
import { OrdenFabricacionTemplate } from '~/components/pdf/OrdenFabricacionTemplate';

interface OrdenData {
  [key: string]: any;
}

interface PDFGenerationOptions {
  tipoOrden: TipoOrden;
  formData: OrdenData;
  pedidoData?: PedidosUI;
}

export const useOrdenGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateOrdenPDF = async ({ tipoOrden, formData, pedidoData }: PDFGenerationOptions): Promise<Blob> => {
    setIsGenerating(true);
    setError(null);

    try {
      let pdfDocument: React.ReactElement<any>;

      // Seleccionar el template según el tipo de orden
      switch (tipoOrden) {
        case 'fabricacion':
          pdfDocument = React.createElement(OrdenFabricacionTemplate, { 
            pedidoData, 
            formData 
          });
          break;
        case 'pintura':
          // TODO: Crear template de pintura
          throw new Error('Template de pintura no implementado aún');
        case 'chasis':
          // TODO: Crear template de chasis
          throw new Error('Template de chasis no implementado aún');
        default:
          throw new Error('Tipo de orden no reconocido');
      }

      // Generar el PDF usando react-pdf
      const blob = await pdf(pdfDocument).toBlob();
      return blob;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error generando PDF';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const savePDFToDrive = async (pdfBlob: Blob, fileName: string): Promise<string> => {
    setIsSaving(true);
    setError(null);

    try {
      // TODO: Implementar guardado en Google Drive
      // const formData = new FormData();
      // formData.append('file', pdfBlob, fileName);
      // formData.append('parentFolder', 'ordenes-trabajo');
      
      // const response = await fetch('/api/drive/upload', {
      //   method: 'POST',
      //   body: formData,
      // });
      
      // if (!response.ok) throw new Error('Error subiendo archivo');
      // const { fileId, webViewLink } = await response.json();
      
      // Simulación temporal
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Devolver URL simulada
      return `https://drive.google.com/file/d/simulatedId/view`;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error guardando archivo';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const generateFileName = (tipoOrden: TipoOrden, formData: OrdenData, pedidoData?: PedidosUI): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    const tipoPrefix = {
      fabricacion: 'OT-FAB',
      pintura: 'OT-PIN', 
      chasis: 'OT-CHA'
    };

    const clienteNombre = pedidoData?.cliente_nombre ? 
      pedidoData.cliente_nombre.replace(/[^a-zA-Z0-9]/g, '').substring(0, 15) : 'SinCliente';

    const pedidoNum = pedidoData?.numero_pedido ? 
      `-P${pedidoData.numero_pedido}` : '';

    return `${tipoPrefix[tipoOrden]}-${year}${month}${day}${pedidoNum}-${clienteNombre}.pdf`;
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
    isGenerating,
    isSaving,
    error,
    resetState,
  };
};