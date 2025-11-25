import React from "react";
import { PDFViewer } from "@react-pdf/renderer";
import { OrdenFabricacionTemplate } from "~/components/pdf/OrdenFabricacionTemplate";
import { OrdenPinturaTemplate } from "~/components/pdf/OrdenPinturaTemplate";
import { OrdenCarrozadoTemplate } from "~/components/pdf/OrdenCarrozadoTemplate";
import type { PedidosUI } from "~/types/pedidos";

export default function PDFDev() {
  // Datos de ejemplo para desarrollo del PDF
  const mockPedidoData = {
    id: "b72dedae-e9e0-488f-b118-d91d01c121b3",
    fecha_creacion: "2025-11-20",
    fecha_pedido: "2025-11-15",
    fecha_fabricacion: "",
    numero_pedido: "PED-0010",
    cliente_id: "a9c230cd-4798-4315-8600-b1d56c5e85a3",
    fecha_entrega_estimada: "2025-12-20",
    precio_total: 14460000,
    forma_pago: "6 cheques/echeqs 0-150 días (Precio Neto)",
    forma_pago_otros: "",
    valor_tasacion: 0,
    vendedor_id: "fb3fe8a9-4ffd-492b-bc14-43b3a1e9a542",
    status: "nuevo",
    cliente_nombre: "CARRERA PALACIOS GUSTAVO",
    vendedor_nombre: "Lucas Alzugaray",
    carroceria: {
      id: "72838285-3970-4bf2-93ab-eb34b7e0be18",
      fecha_creacion: "2025-11-20",
      pedido_id: "b72dedae-e9e0-488f-b118-d91d01c121b3",
      tipo_carrozado_id: "9707fd91-08df-4251-bab1-bb8e9a6b5d53",
      material: "chapa",
      largo_int: 4400,
      largo_ext: 4500,
      ancho_ext: 2600,
      alto: 1500,
      alt_baranda: 800,
      ptas_por_lado: 2,
      puerta_trasera_id: "d8f19370-a628-4a78-af15-b252f5229df1",
      arcos_por_puerta: 2,
      corte_guardabarros: false,
      cumbreras: false,
      espesor_chapa: "2.2",
      tipo_zocalo: "gross_viejo",
      lineas_refuerzo: 5,
      cuchetin: false,
      med_cuchetin: 0,
      alt_pta_cuchetin: 0,
      alt_techo_cuchetin: 0,
      notas_cuchetin: "",
      color_lona_id: "",
      tipo_piso: "liso",
      color_carrozado_id: "71cc1e1b-b92f-48f2-bf65-17130ba12818",
      color_zocalo_id: "1a9f29ac-b58e-4d8d-b6c2-a8acea10c427",
      notas_color: "ZÓCALO GRIS IVECO OSCURO ? - PUERTA TRASERA BLANCA",
      boquillas: 0,
      med_cajon_herramientas: 0,
      luces: 0,
      guardabarros: true,
      dep_agua: true,
      cintas_reflectivas: "",
      med_alargue: 0,
      quiebre_alargue: false,
      observaciones: "NO COLOCAR ESCALERAS LATERALES",
      carrozado_nombre: "BARANDA VOLCABLE",
      puerta_trasera_nombre: "LIBRO CON CEREALERA",
      color_carrozado_nombre: "TRAFUL",
      color_zocalo_nombre: "GRIS 7016",
    },
    trabajo_chasis: [
      {
        id: "c2456c0e-c953-4441-8f3d-27e33ebad38b",
        fecha_creacion: "2025-11-20",
        pedido_id: "b72dedae-e9e0-488f-b118-d91d01c121b3",
        tipo_trabajo_id: "0ae9b73e-0bd7-4349-a9da-a0dd632947ea",
        descripcion: "VOLADIZO TRASERO",
        tipo_trabajo_nombre: "ALARGUE DE CHASIS",
      },
      {
        id: "3e18bdb4-7068-4676-83b9-e726ada4a28b",
        fecha_creacion: "2025-11-20",
        pedido_id: "b72dedae-e9e0-488f-b118-d91d01c121b3",
        tipo_trabajo_id: "6a7c9035-28f6-459d-965c-6ff2f46e172c",
        tipo_trabajo_nombre: "ENVAINADO",
      },
      {
        id: "a7827b53-facc-46fd-9f56-9c4ba7e896dc",
        fecha_creacion: "2025-11-20",
        pedido_id: "b72dedae-e9e0-488f-b118-d91d01c121b3",
        tipo_trabajo_id: "1f61515d-01e0-4a6c-b708-3ccc13d580be",
        tipo_trabajo_nombre: "SEPARADOR",
      },
      {
        id: "b4ba1bd4-00a2-49b3-89a9-ceb9982dba76",
        fecha_creacion: "2025-11-20",
        pedido_id: "b72dedae-e9e0-488f-b118-d91d01c121b3",
        tipo_trabajo_id: "cb443f97-e6b8-4283-bc30-1bfccb8ffc76",
        tipo_trabajo_nombre: "ENGANCHE",
      },
      {
        id: "c009905c-63fc-4028-b469-8fd35baec8ec",
        fecha_creacion: "2025-11-20",
        pedido_id: "b72dedae-e9e0-488f-b118-d91d01c121b3",
        tipo_trabajo_id: "b3178857-7764-4ee9-ae10-a008b572ce53",
        tipo_trabajo_nombre: "PARAGOLPES",
      },
    ],
    camion: {
      id: "ab2d5851-ada1-4e28-b280-bc5cc3f3a14c",
      fecha_creacion: "2025-11-20",
      pedido_id: "b72dedae-e9e0-488f-b118-d91d01c121b3",
      marca: "otros",
      modelo: "SHACMAN X5000",
      patente: "",
      tipo_larguero: "recto",
      med_larguero: 850,
      centro_eje: 2600,
      voladizo_trasero: 0,
    },
    cliente: null,
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
        <OrdenCarrozadoTemplate
          pedidoData={mockPedidoData}
          formData={mockFormData}
        />
      </PDFViewer>
    </div>
  );
}
