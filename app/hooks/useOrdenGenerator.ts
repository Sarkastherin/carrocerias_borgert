import React, { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import type { TipoOrden } from '~/components/modals/customs/OrdenTrabajoModal';
import type { PedidosUI } from '~/types/pedidos';
import { OrdenFabricacionTemplate } from '~/components/pdf/OrdenFabricacionTemplate';
import { uploadOrderPDF} from '~/backend/driveAPI';
import { ordenesAPI, pedidosAPI } from '~/backend/sheetServices';
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
      console.log('📄 Generando PDF con react-pdf...');
      console.log('📋 Datos del documento:', { tipoOrden, formData, pedidoData });
      
      const pdfInstance = pdf(pdfDocument);
      console.log('✅ Instancia de PDF creada');
      
      const blob = await pdfInstance.toBlob();
      console.log('📦 Blob generado:', { 
        size: blob.size, 
        type: blob.type,
        isEmpty: blob.size === 0 
      });
      
      if (blob.size === 0) {
        throw new Error('El PDF generado está vacío. Puede ser un problema con los datos o el template.');
      }
      
      return blob;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error generando PDF';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const savePDFToDrive = async (pdfBlob: Blob, fileName: string, tipoOrden: string): Promise<string> => {
    setIsSaving(true);
    setError(null);

    try {
      // Verificar si el blob está vacío antes de subirlo
      if (pdfBlob.size === 0) {
        throw new Error('El PDF que se va a subir está vacío');
      }      
      // Subir el PDF con estructura de carpetas automática
      const uploadedFile = await uploadOrderPDF(pdfBlob, fileName, tipoOrden);
      
      // Devolver el enlace para ver el archivo
      return uploadedFile.webViewLink || `https://drive.google.com/file/d/${uploadedFile.id}/view`;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error guardando archivo';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };
  const createRegisterAndUpdatePedido = async (
    urlFile: string, 
    pedidoId: string, 
    tipoOrden: TipoOrden, 
    responsableId?: string
  ) => {
    try {
      console.log('📝 Creando registro de orden en Google Sheets...');
      
      // Preparar datos para el registro de orden según la estructura OrdenesBD
      const ordenData = {
        pedido_id: pedidoId,
        tipo_orden: tipoOrden, // campo correcto según el tipo
        responsable_id: responsableId || 'sistema', // valor por defecto si no se proporciona
        fecha_ejecucion: new Date().toISOString().split('T')[0], // fecha de ejecución en formato YYYY-MM-DD
        url_archivo: urlFile,
        fecha_creacion: new Date().toISOString().split('T')[0] // formato YYYY-MM-DD
      };
      
      // Guardar registro en sheet de ordenes
      const ordenCreated = await ordenesAPI.create(ordenData);
      console.log('✅ Registro de orden creado:', ordenCreated);
      
      // Preparar datos para actualizar pedido
      const pedidoUpdate = {
        fecha_fabricacion: new Date().toISOString().split('T')[0], // formato YYYY-MM-DD
        url_orden_fabricacion: urlFile
      };
      
      console.log('📝 Actualizando pedido con fecha de fabricación...');
      
      // Actualizar pedido con link de orden y fecha
      const pedidoUpdated = await pedidosAPI.update(pedidoId, pedidoUpdate);
      console.log('✅ Pedido actualizado:', pedidoUpdated);
      
      return {
        orden: ordenCreated,
        pedido: pedidoUpdated
      };
      
    } catch (error) {
      console.error('❌ Error en createRegisterAndUpdatePedido:', error);
      throw new Error(`Error registrando orden: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

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
      `-${pedidoData.numero_pedido}` : '';

    return `${tipoPrefix[tipoOrden]}-${year}${month}${day}${pedidoNum}.pdf`;
  };

  const generateAndSaveOrderPDF = async ({ tipoOrden, formData, pedidoData }: PDFGenerationOptions): Promise<string> => {
    try {
      console.log('📄 Generando PDF...');
      const pdfBlob = await generateOrdenPDF({ tipoOrden, formData, pedidoData });
      
      console.log('📁 Generando nombre de archivo...');
      const fileName = generateFileName(tipoOrden, formData, pedidoData);
      
      console.log('☁️ Guardando en Google Drive...');
      const driveLink = await savePDFToDrive(pdfBlob, fileName, tipoOrden);
      
      return driveLink;
    } catch (error) {
      console.error('Error en generateAndSaveOrderPDF:', error);
      throw error;
    }
  };

  const generateCompleteOrder = async (
    { tipoOrden, formData, pedidoData }: PDFGenerationOptions,
    responsableId?: string
  ): Promise<{ driveLink: string; orden: any; pedido: any }> => {
    try {
      // Validar que tenemos pedidoData
      if (!pedidoData?.id) {
        throw new Error('Se requiere información del pedido para crear la orden completa');
      }

      console.log('🚀 Iniciando proceso completo de generación de orden...');
      
      // 1. Generar y subir PDF a Google Drive
      const driveLink = await generateAndSaveOrderPDF({ tipoOrden, formData, pedidoData });
      
      // 2. Crear registro en sheet de órdenes y actualizar pedido
      console.log('📋 Registrando orden y actualizando pedido...');
      const { orden, pedido } = await createRegisterAndUpdatePedido(
        driveLink, 
        pedidoData.id, 
        tipoOrden, 
        responsableId
      );
      
      console.log('✅ Proceso completo de orden finalizado exitosamente');
      
      return {
        driveLink,
        orden,
        pedido
      };
      
    } catch (error) {
      console.error('❌ Error en generateCompleteOrder:', error);
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
    generateCompleteOrder,
    isGenerating,
    isSaving,
    error,
    resetState,
  };
};