import React from "react";
import { PDFViewer } from "@react-pdf/renderer";
import { OrdenFabricacionTemplate } from "~/components/pdf/OrdenFabricacionTemplate";
import type { PedidosUI } from "~/types/pedidos";

export default function PDFDev() {
  // Datos de ejemplo para desarrollo del PDF
  const mockPedidoData = {
    id: "24a30726-3a93-4e29-80f6-f84fedc07dfe",
    fecha_creacion: "2025-11-12",
    fecha_pedido: "2025-11-11",
    fecha_fabricacion: "",
    numero_pedido: "PED-0005",
    cliente_id: "7d938a54-c195-44e1-96e4-f7280afeee5d",
    fecha_entrega_estimada: "2026-01-16",
    precio_total: 22000000,
    forma_pago: "Contado/transferencia (10% de descuento)",
    forma_pago_otros: "",
    valor_tasacion: "",
    vendedor_id: "b0b3b406-223c-48d7-92c3-e72983ece72e",
    status: "nuevo",
    cliente_nombre: "RODE RICARDO",
    vendedor_nombre: "Elbio Borgert",
    carroceria: {
        id: "dccb1e1d-0e8d-4de0-ba47-4764df30f85c",
        fecha_creacion: "2025-11-12",
        pedido_id: "24a30726-3a93-4e29-80f6-f84fedc07dfe",
        tipo_carrozado_id: "80d95e92-0860-479d-8c25-52457e65f6dd",
        material: "chapa",
        largo_int: 5600,
        largo_ext: 5700,
        ancho_ext: 2600,
        alto: 1200,
        alt_baranda: 800,
        ptas_por_lado: 3,
        puerta_trasera_id: "d8f19370-a628-4a78-af15-b252f5229df1",
        arcos_por_puerta: 1,
        corte_guardabarros: false,
        cumbreras: false,
        espesor_chapa: "3.2",
        tipo_zocalo: "gross_nuevo",
        lineas_refuerzo: 5,
        cuchetin: false,
        med_cuchetin: 0,
        alt_pta_cuchetin: 0,
        alt_techo_cuchetin: 0,
        color_lona_id: "A CONFIRMAR",
        tipo_piso: "liso",
        color_carrozado_id: "41f02df1-fc51-42c7-b110-d4c0adbea7a7",
        color_zocalo_id: "1d3c61aa-1a4c-44b4-87c4-8247d37d5ce6",
        notas_color: "NO LLEVA LONA - COLOR CAROCERÍA MARFIL 011 - NO HAY ESPESOR DE CHAPA",
        boquillas: 0,
        med_cajon_herramientas: 0,
        luces: 0,
        guardabarros: true,
        dep_agua: true,
        cintas_reflectivas: "nacionales",
        med_alargue: 0,
        quiebre_alargue: false,
        observaciones: "VER PLANO - DECIDIR ESPESOR DE CHAPA",
        carrozado_nombre: "VOLCADORA BILATERAL",
        puerta_trasera_nombre: "LIBRO CON CEREALERA",
        color_carrozado_nombre: "A CONFIRMAR",
        color_zocalo_nombre: "BERMELLÓN"
    },
    trabajo_chasis: [],
    camion: {
        id: "0ed81a6a-c33e-4b7a-8008-b2d3190f22f8",
        fecha_creacion: "2025-11-12",
        pedido_id: "24a30726-3a93-4e29-80f6-f84fedc07dfe",
        marca: "scania",
        modelo: "NO",
        patente: "",
        tipo_larguero: "curvo",
        med_larguero: 770,
        centro_eje: 0,
        voladizo_trasero: 2000,
        observaciones: "LARGUERO 77 CON CURVA 50 CM"
    }
} as PedidosUI;
  const mockFormData = {
    responsable: "Juan Pérez",
    observaciones:
      "Fabricación prioritaria. Cliente requiere entrega antes del 30/11. Verificar medidas especiales para puertas laterales.",
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <div
        style={{
          padding: "10px",
          background: "#f5f5f5",
          borderBottom: "1px solid #ddd",
          fontSize: "14px",
          fontWeight: "bold",
        }}
      >
        🔧 Modo Desarrollo PDF - Orden de Fabricación
      </div>

      <PDFViewer
        style={{
          width: "100%",
          height: "calc(100vh - 50px)",
          border: "none",
        }}
      >
        <OrdenFabricacionTemplate
          pedidoData={mockPedidoData}
          formData={mockFormData}
        />
      </PDFViewer>
    </div>
  );
}
