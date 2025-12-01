import React from "react";
import { PDFViewer } from "@react-pdf/renderer";
import { OrdenFabricacionTemplate } from "~/components/pdf/OrdenFabricacionTemplate";
import { OrdenPinturaTemplate } from "~/components/pdf/OrdenPinturaTemplate";
import { OrdenMontajeTemplate } from "~/components/pdf/OrdenMontajeTemplate";
import { ControlCarrozadoTemplate } from "~/components/pdf/ControlCarrozadoTemplate";
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
    saldo_restante: 0,
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
      tipos_arcos: "Estándar",
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
      boquillas: 2,
      tipo_boquillas: "Común",
      ubicacion_boquillas: "Delantera",
      med_cajon_herramientas: 600,
      ubicacion_cajon_herramientas: "LADO CONDUCTOR",
      luces: 6,
      guardabarros: true,
      dep_agua: true,
      ubicacion_dep_agua: "LADO ACOMPAÑANTE",
      cintas_reflectivas: "nacionales",
      alargue_tipo_1: "baranda a cumbrera",
      cant_alargue_1: 2,
      med_alargue_1: 300,
      quiebre_alargue_1: false,
      alargue_tipo_2: "N/A",
      cant_alargue_2: 0,
      med_alargue_2: 0,
      quiebre_alargue_2: false,
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
  const mockItemsControl = [
    {
        "id": "7adc04c6-5669-41b2-a0b6-626d73b052fc",
        "fecha_creacion": "2025-11-11",
        "carrozado_id": "9707fd91-08df-4251-bab1-bb8e9a6b5d53",
        "item_control_id": "ec531e18-ca4a-4d2f-b909-7c34cdeb6696",
        "atributo_relacionado": "largo_int",
        "activo": true,
        "item_control_nombre": "Longitud interna de carrocería"
    },
    {
        "id": "fc526fe8-817f-4b81-b64a-c9c9380fd8e9",
        "fecha_creacion": "2025-11-21",
        "carrozado_id": "9707fd91-08df-4251-bab1-bb8e9a6b5d53",
        "item_control_id": "6292772d-4ef6-4e58-a8bf-e714b309ed6b",
        "atributo_relacionado": "",
        "activo": true,
        "item_control_nombre": "Ancho interno de carrocería"
    },
    {
        "id": "bf7f335e-7464-4fde-9338-dc1f188674d8",
        "fecha_creacion": "2025-11-21",
        "carrozado_id": "9707fd91-08df-4251-bab1-bb8e9a6b5d53",
        "item_control_id": "52b219f9-49c3-4e0b-ae12-66d9556616e0",
        "atributo_relacionado": "",
        "activo": true,
        "item_control_nombre": "Distancia de centro de eje"
    },
    {
        "id": "be9ccb70-598c-4cca-a954-2fca0560312f",
        "fecha_creacion": "2025-11-21",
        "carrozado_id": "9707fd91-08df-4251-bab1-bb8e9a6b5d53",
        "item_control_id": "21cc0abf-7a7e-462f-9e46-e120af2a28d7",
        "atributo_relacionado": "alto",
        "activo": true,
        "item_control_nombre": "Altura de carrocería"
    },
    {
        "id": "b786fc5b-3be8-41b6-9da2-3ebb5c682493",
        "fecha_creacion": "2025-11-21",
        "carrozado_id": "9707fd91-08df-4251-bab1-bb8e9a6b5d53",
        "item_control_id": "08a401d4-62c3-456d-a814-c11793d41b01",
        "atributo_relacionado": "",
        "activo": true,
        "item_control_nombre": "Distancia exterior entre largueros"
    },
    {
        "id": "3e2bcd77-fae5-49cb-9022-d5525f490842",
        "fecha_creacion": "2025-11-21",
        "carrozado_id": "9707fd91-08df-4251-bab1-bb8e9a6b5d53",
        "item_control_id": "eb2d5054-7026-4497-85c9-a7bf581cdacf",
        "atributo_relacionado": "",
        "activo": true,
        "item_control_nombre": "Distancia entre larguero y zócalo laterales equidistantes."
    },
    {
        "id": "625ea7da-9d9c-4365-a8d7-b3b825feaf2c",
        "fecha_creacion": "2025-11-21",
        "carrozado_id": "9707fd91-08df-4251-bab1-bb8e9a6b5d53",
        "item_control_id": "5458366f-4247-4560-a22e-a6b5db98ebfb",
        "atributo_relacionado": "",
        "activo": true,
        "item_control_nombre": "Soldaduras de vinculación de largueros con teleras"
    },
    {
        "id": "77da07e6-f870-4cc5-bf18-c63e9ae20b54",
        "fecha_creacion": "2025-11-21",
        "carrozado_id": "9707fd91-08df-4251-bab1-bb8e9a6b5d53",
        "item_control_id": "aaa6965f-4c4c-47a8-8c53-6e855aa34dad",
        "atributo_relacionado": "tipo_piso",
        "activo": true,
        "item_control_nombre": "Tipo de piso"
    },
    {
        "id": "7c90d224-a8c3-475a-96a9-996b44a1fd91",
        "fecha_creacion": "2025-11-21",
        "carrozado_id": "9707fd91-08df-4251-bab1-bb8e9a6b5d53",
        "item_control_id": "1592b7ac-490a-4fb4-aa91-03b616b115b5",
        "atributo_relacionado": "",
        "activo": true,
        "item_control_nombre": "Ubicación y calidad de soldaduras inferiores de piso"
    },
    {
        "id": "9928432d-eca2-4d5a-94ac-31a96b8a6e7a",
        "fecha_creacion": "2025-11-21",
        "carrozado_id": "9707fd91-08df-4251-bab1-bb8e9a6b5d53",
        "item_control_id": "058afcaf-d34f-4922-aa85-e72a656f1b86",
        "atributo_relacionado": "",
        "activo": true,
        "item_control_nombre": "Ubicación y calidad de soldaduras superiores de piso"
    },
    {
        "id": "e0a30d5a-0185-4fbf-a6bb-7804077f927e",
        "fecha_creacion": "2025-11-21",
        "carrozado_id": "9707fd91-08df-4251-bab1-bb8e9a6b5d53",
        "item_control_id": "1f8b754a-88c7-41fd-86cb-4d5193ee4013",
        "atributo_relacionado": "",
        "activo": true,
        "item_control_nombre": "Escuadra 90° en luz de puertas laterales."
    },
    {
        "id": "15b57466-d5c7-46a4-ab1a-5547b46a0291",
        "fecha_creacion": "2025-11-21",
        "carrozado_id": "9707fd91-08df-4251-bab1-bb8e9a6b5d53",
        "item_control_id": "a757a84c-ab82-4f80-a199-3aba2ddb99df",
        "atributo_relacionado": "",
        "activo": true,
        "item_control_nombre": "Escuadra 90° en puertas/barandas laterales."
    },
    {
        "id": "0b8bb179-4dd1-41a7-a5c7-daf63fe8be1d",
        "fecha_creacion": "2025-11-21",
        "carrozado_id": "9707fd91-08df-4251-bab1-bb8e9a6b5d53",
        "item_control_id": "b33c9f8f-d8d5-4017-bc47-3fc1c6b07696",
        "atributo_relacionado": "",
        "activo": true,
        "item_control_nombre": "Alineación de chapas moldura en puertas/barandas laterales."
    },
    {
        "id": "0a9fef55-176b-47d4-980e-7ff63d79253c",
        "fecha_creacion": "2025-11-21",
        "carrozado_id": "9707fd91-08df-4251-bab1-bb8e9a6b5d53",
        "item_control_id": "1d9c87a8-6771-459d-aed6-ab9bef3f2574",
        "atributo_relacionado": "",
        "activo": true,
        "item_control_nombre": "Ubicación y calidad de soldaduras en puertas/barandas laterales"
    },
    {
        "id": "ed2b5201-3bac-490c-bc9e-49f87c19b56d",
        "fecha_creacion": "2025-11-21",
        "carrozado_id": "9707fd91-08df-4251-bab1-bb8e9a6b5d53",
        "item_control_id": "508983c4-0e02-48e8-8fba-7a269e82f4c2",
        "atributo_relacionado": "",
        "activo": true,
        "item_control_nombre": "Cierre de puertas de cuchetín (ajuste)"
    },
    {
        "id": "cb13cf8a-8b01-4679-82bf-5a83fe84554d",
        "fecha_creacion": "2025-11-21",
        "carrozado_id": "9707fd91-08df-4251-bab1-bb8e9a6b5d53",
        "item_control_id": "261e79ee-9497-4d5b-9d43-1eca64152003",
        "atributo_relacionado": "",
        "activo": true,
        "item_control_nombre": "Alineación de manijas en puertas/barandas laterales"
    },
    {
        "id": "575f8f83-3914-4966-bb02-7cd48e89f909",
        "fecha_creacion": "2025-11-21",
        "carrozado_id": "9707fd91-08df-4251-bab1-bb8e9a6b5d53",
        "item_control_id": "04cc9dfb-a57e-43ff-84f4-9a35580c2a9f",
        "atributo_relacionado": "",
        "activo": true,
        "item_control_nombre": "Alineación y soldaduras en trabas “L” y “J” en zócalos laterales."
    },
    {
        "id": "06a6729c-5681-4267-953a-c9ac2749cea5",
        "fecha_creacion": "2025-11-21",
        "carrozado_id": "9707fd91-08df-4251-bab1-bb8e9a6b5d53",
        "item_control_id": "f24a9bb8-fa27-47c1-b5cf-8ab68dc782bc",
        "atributo_relacionado": "arcos_por_puerta",
        "activo": true,
        "item_control_nombre": "Cantidad de porta arcos por baranda"
    },
    {
        "id": "a1f9d718-1508-4ac4-b823-9ae4a572ff1a",
        "fecha_creacion": "2025-11-21",
        "carrozado_id": "9707fd91-08df-4251-bab1-bb8e9a6b5d53",
        "item_control_id": "babc0a4d-13ef-4cbf-ae75-03353bf3a479",
        "atributo_relacionado": "tipos_arcos",
        "activo": true,
        "item_control_nombre": "Tipos de arcos"
    },
    {
        "id": "226f70a0-e672-425a-bebc-3e2ad58226dd",
        "fecha_creacion": "2025-11-21",
        "carrozado_id": "9707fd91-08df-4251-bab1-bb8e9a6b5d53",
        "item_control_id": "baddc085-86a3-4fc2-9f98-4d21252173f0",
        "atributo_relacionado": "",
        "activo": true,
        "item_control_nombre": "Distribución equidistante de porta arcos en barandas"
    },
    {
        "id": "33b06ea5-fa30-42b4-b8d2-1d6bf6490021",
        "fecha_creacion": "2025-11-21",
        "carrozado_id": "9707fd91-08df-4251-bab1-bb8e9a6b5d53",
        "item_control_id": "937e20b9-817e-492a-ad0c-a881e7d4562c",
        "atributo_relacionado": "",
        "activo": true,
        "item_control_nombre": "Numeración de puertas."
    },
    {
        "id": "b23f6ce3-a4a2-456b-b8fc-c0f7b129c732",
        "fecha_creacion": "2025-11-21",
        "carrozado_id": "9707fd91-08df-4251-bab1-bb8e9a6b5d53",
        "item_control_id": "ec2b18ce-2d33-4ede-9b18-0f08e91ec628",
        "atributo_relacionado": "",
        "activo": true,
        "item_control_nombre": "Ubicación y calidad de soldaduras en parantes laterales."
    },
    {
        "id": "b5e167d7-7c07-40a8-9330-3a948e8c920b",
        "fecha_creacion": "2025-11-21",
        "carrozado_id": "9707fd91-08df-4251-bab1-bb8e9a6b5d53",
        "item_control_id": "9a80f5ae-2203-4d4b-a43f-263adbcb1c28",
        "atributo_relacionado": "",
        "activo": true,
        "item_control_nombre": "Porta separadores en parantes (ubicación y soldadura)"
    },
    {
        "id": "3b827149-6bf2-4de0-aefa-7437c5a759bb",
        "fecha_creacion": "2025-11-21",
        "carrozado_id": "9707fd91-08df-4251-bab1-bb8e9a6b5d53",
        "item_control_id": "0d8fe93d-30a3-4f2f-930c-83412f8640cf",
        "atributo_relacionado": "",
        "activo": true,
        "item_control_nombre": "Numeración de parantes laterales."
    },
    {
        "id": "5f4aeaba-62eb-4258-bc7d-1d9f5af08b55",
        "fecha_creacion": "2025-11-21",
        "carrozado_id": "9707fd91-08df-4251-bab1-bb8e9a6b5d53",
        "item_control_id": "21c5db7d-b7fd-43fc-8fd9-dc1fb77d9740",
        "atributo_relacionado": "",
        "activo": true,
        "item_control_nombre": "Escuadra 90° en frente de carrocería"
    },
    {
        "id": "fef3ac62-3621-4deb-9d98-4adfdf82103c",
        "fecha_creacion": "2025-11-21",
        "carrozado_id": "9707fd91-08df-4251-bab1-bb8e9a6b5d53",
        "item_control_id": "b0a3c08a-385d-4b7c-b0c2-7549f34bce74",
        "atributo_relacionado": "",
        "activo": true,
        "item_control_nombre": "Alineación de chapa moldura en frente de carrocería."
    },
    {
        "id": "6bc3c036-960e-4326-8d8f-ba1ab1a48990",
        "fecha_creacion": "2025-11-21",
        "carrozado_id": "9707fd91-08df-4251-bab1-bb8e9a6b5d53",
        "item_control_id": "dd4d0f6a-e95b-40d9-8afd-f22da02c3598",
        "atributo_relacionado": "",
        "activo": true,
        "item_control_nombre": "Alineación de parantes y esquineros delanteros."
    },
    {
        "id": "57f4d4a4-a1e0-4220-b273-257ff9700ded",
        "fecha_creacion": "2025-11-21",
        "carrozado_id": "9707fd91-08df-4251-bab1-bb8e9a6b5d53",
        "item_control_id": "72cf8833-a3bb-42dc-af03-2af12826abc9",
        "atributo_relacionado": "",
        "activo": true,
        "item_control_nombre": "Ubicación y calidad de soldaduras en frente de carrocería."
    },
    {
        "id": "4dc4aab8-1a43-44e2-ba01-b07d1e724572",
        "fecha_creacion": "2025-11-21",
        "carrozado_id": "9707fd91-08df-4251-bab1-bb8e9a6b5d53",
        "item_control_id": "3488d0f9-60df-4b64-9a0f-fffd7991fefa",
        "atributo_relacionado": "",
        "activo": true,
        "item_control_nombre": "Escuadra 90° en luz de puerta trasera"
    },
    {
        "id": "4a26d016-933e-46ee-bb30-3d7c56752972",
        "fecha_creacion": "2025-11-21",
        "carrozado_id": "9707fd91-08df-4251-bab1-bb8e9a6b5d53",
        "item_control_id": "dfa8bde2-c8e5-4a83-85f3-bbf247963cf3",
        "atributo_relacionado": "",
        "activo": true,
        "item_control_nombre": "Escuadra 90° en puerta/baranda trasera o contrafrente (tolva)."
    },
    {
        "id": "8820614e-62d4-4dcc-b1fd-691a34843ed7",
        "fecha_creacion": "2025-11-21",
        "carrozado_id": "9707fd91-08df-4251-bab1-bb8e9a6b5d53",
        "item_control_id": "401c6f1a-07f8-4b8c-9f7f-ee6a449d89bc",
        "atributo_relacionado": "",
        "activo": true,
        "item_control_nombre": "Ubicación y calidad de soldaduras en puertas/barandas traseras"
    },
    {
        "id": "d7cf1481-53dc-4f5a-80f8-34db63271459",
        "fecha_creacion": "2025-11-21",
        "carrozado_id": "9707fd91-08df-4251-bab1-bb8e9a6b5d53",
        "item_control_id": "1c05d468-08a5-42ed-8311-5a5d135f3e0f",
        "atributo_relacionado": "",
        "activo": true,
        "item_control_nombre": "Alineación de chapa moldura de puerta/baranda trasera"
    },
    {
        "id": "549e8176-e710-4783-8312-31ef62f57b38",
        "fecha_creacion": "2025-11-21",
        "carrozado_id": "9707fd91-08df-4251-bab1-bb8e9a6b5d53",
        "item_control_id": "10d0a665-22f1-4289-8ef9-45553044530b",
        "atributo_relacionado": "",
        "activo": true,
        "item_control_nombre": "Cierre de puertas/barandas traseras (ajuste)"
    },
    {
        "id": "8acdfd27-340b-41a2-880b-ebf21ff91f08",
        "fecha_creacion": "2025-11-21",
        "carrozado_id": "9707fd91-08df-4251-bab1-bb8e9a6b5d53",
        "item_control_id": "5e7551cf-8505-4fe3-887a-bb9b3ffb1c12",
        "atributo_relacionado": "",
        "activo": true,
        "item_control_nombre": "Alineación de manijas en puertas/barandas traseras"
    },
    {
        "id": "ef8f6dba-2d97-401d-979f-a741e1506283",
        "fecha_creacion": "2025-11-21",
        "carrozado_id": "9707fd91-08df-4251-bab1-bb8e9a6b5d53",
        "item_control_id": "0c80272a-d8cc-4fdf-9a80-260f9c65b00f",
        "atributo_relacionado": "",
        "activo": true,
        "item_control_nombre": "Alineación de bisagras de puertas traseras."
    },
    {
        "id": "5c71a42e-c39f-4357-bf77-4e084c7e1b90",
        "fecha_creacion": "2025-11-21",
        "carrozado_id": "9707fd91-08df-4251-bab1-bb8e9a6b5d53",
        "item_control_id": "b31e6baa-25ec-4f38-8729-df89421d817f",
        "atributo_relacionado": "",
        "activo": true,
        "item_control_nombre": "Alineación de bisagras de puertas cerealeras traseras."
    },
    {
        "id": "308998a7-2194-4508-b5f4-f922dbb8e579",
        "fecha_creacion": "2025-11-21",
        "carrozado_id": "9707fd91-08df-4251-bab1-bb8e9a6b5d53",
        "item_control_id": "00745000-07bd-435e-ba3e-e664b9ea643d",
        "atributo_relacionado": "",
        "activo": true,
        "item_control_nombre": "Alineación y soldaduras en trabas “L” y “J” en zócalo trasero."
    },
    {
        "id": "3c10bff5-682e-41e5-9dfe-c9ffed35036f",
        "fecha_creacion": "2025-11-21",
        "carrozado_id": "9707fd91-08df-4251-bab1-bb8e9a6b5d53",
        "item_control_id": "3a7d4aa8-9bdc-4aac-a6f6-a435aa3acb46",
        "atributo_relacionado": "",
        "activo": true,
        "item_control_nombre": "Alineación de escalera delantera / Anclajes de escaleras delanteras."
    },
    {
        "id": "4707c7e0-f26a-4e3a-930e-10a5080afb2c",
        "fecha_creacion": "2025-11-21",
        "carrozado_id": "9707fd91-08df-4251-bab1-bb8e9a6b5d53",
        "item_control_id": "3f39ba46-ca86-4db3-ad74-5f976dee657c",
        "atributo_relacionado": "",
        "activo": true,
        "item_control_nombre": "Soldadura en porta arcos enfrente de carrocería"
    }
]

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
        🔧 Modo Desarrollo PDF - Pedido de Fabricación
      </div>

      <PDFViewer
        style={{
          width: "100%",
          height: "calc(100vh - 50px)",
          border: "none",
        }}
      >
        <ControlCarrozadoTemplate
          pedidoData={mockPedidoData}
          formData={mockFormData}
          itemsControl={mockItemsControl}
        />
      </PDFViewer>
    </div>
  );
}
