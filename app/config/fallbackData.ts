// Datos de fallback para provincias argentinas
// Datos obtenidos de la API Georef para usar cuando la API no está disponible

import type { Provincia } from "~/services/georefService";

export const PROVINCIAS_FALLBACK: Provincia[] = [
  {
    id: "02",
    nombre: "Buenos Aires",
    nombre_largo: "Provincia de Buenos Aires",
    iso_id: "AR-B",
    iso_nombre: "Buenos Aires",
    categoria: "Provincia",
    centroide: { lat: -36.6769, lon: -60.5588 }
  },
  {
    id: "06",
    nombre: "Buenos Aires",
    nombre_largo: "Ciudad Autónoma de Buenos Aires",
    iso_id: "AR-C",
    iso_nombre: "Ciudad Autónoma de Buenos Aires",
    categoria: "Ciudad Autónoma",
    centroide: { lat: -34.6118, lon: -58.3960 }
  },
  {
    id: "10",
    nombre: "Catamarca",
    nombre_largo: "Provincia de Catamarca",
    iso_id: "AR-K",
    iso_nombre: "Catamarca",
    categoria: "Provincia",
    centroide: { lat: -27.3358, lon: -67.4114 }
  },
  {
    id: "22",
    nombre: "Chaco",
    nombre_largo: "Provincia del Chaco",
    iso_id: "AR-H",
    iso_nombre: "Chaco",
    categoria: "Provincia",
    centroide: { lat: -26.3864, lon: -60.7658 }
  },
  {
    id: "26",
    nombre: "Chubut",
    nombre_largo: "Provincia del Chubut",
    iso_id: "AR-U",
    iso_nombre: "Chubut",
    categoria: "Provincia",
    centroide: { lat: -43.7886, lon: -68.5290 }
  },
  {
    id: "14",
    nombre: "Córdoba",
    nombre_largo: "Provincia de Córdoba",
    iso_id: "AR-X",
    iso_nombre: "Córdoba",
    categoria: "Provincia",
    centroide: { lat: -32.1426, lon: -63.8018 }
  },
  {
    id: "18",
    nombre: "Corrientes",
    nombre_largo: "Provincia de Corrientes",
    iso_id: "AR-W",
    iso_nombre: "Corrientes",
    categoria: "Provincia",
    centroide: { lat: -28.7743, lon: -57.8017 }
  },
  {
    id: "30",
    nombre: "Entre Ríos",
    nombre_largo: "Provincia de Entre Ríos",
    iso_id: "AR-E",
    iso_nombre: "Entre Ríos",
    categoria: "Provincia",
    centroide: { lat: -32.0588, lon: -59.2014 }
  },
  {
    id: "34",
    nombre: "Formosa",
    nombre_largo: "Provincia de Formosa",
    iso_id: "AR-P",
    iso_nombre: "Formosa",
    categoria: "Provincia",
    centroide: { lat: -24.8949, lon: -60.0300 }
  },
  {
    id: "38",
    nombre: "Jujuy",
    nombre_largo: "Provincia de Jujuy",
    iso_id: "AR-Y",
    iso_nombre: "Jujuy",
    categoria: "Provincia",
    centroide: { lat: -23.8141, lon: -65.6926 }
  },
  {
    id: "42",
    nombre: "La Pampa",
    nombre_largo: "Provincia de La Pampa",
    iso_id: "AR-L",
    iso_nombre: "La Pampa",
    categoria: "Provincia",
    centroide: { lat: -37.1316, lon: -64.2990 }
  },
  {
    id: "46",
    nombre: "La Rioja",
    nombre_largo: "Provincia de La Rioja",
    iso_id: "AR-F",
    iso_nombre: "La Rioja",
    categoria: "Provincia",
    centroide: { lat: -29.6837, lon: -67.1817 }
  },
  {
    id: "50",
    nombre: "Mendoza",
    nombre_largo: "Provincia de Mendoza",
    iso_id: "AR-M",
    iso_nombre: "Mendoza",
    categoria: "Provincia",
    centroide: { lat: -34.6297, lon: -68.5906 }
  },
  {
    id: "54",
    nombre: "Misiones",
    nombre_largo: "Provincia de Misiones",
    iso_id: "AR-N",
    iso_nombre: "Misiones",
    categoria: "Provincia",
    centroide: { lat: -26.4906, lon: -54.6448 }
  },
  {
    id: "58",
    nombre: "Neuquén",
    nombre_largo: "Provincia del Neuquén",
    iso_id: "AR-Q",
    iso_nombre: "Neuquén",
    categoria: "Provincia",
    centroide: { lat: -38.6418, lon: -70.1109 }
  },
  {
    id: "62",
    nombre: "Río Negro",
    nombre_largo: "Provincia de Río Negro",
    iso_id: "AR-R",
    iso_nombre: "Río Negro",
    categoria: "Provincia",
    centroide: { lat: -40.4019, lon: -66.9511 }
  },
  {
    id: "66",
    nombre: "Salta",
    nombre_largo: "Provincia de Salta",
    iso_id: "AR-A",
    iso_nombre: "Salta",
    categoria: "Provincia",
    centroide: { lat: -24.7821, lon: -65.4232 }
  },
  {
    id: "70",
    nombre: "San Juan",
    nombre_largo: "Provincia de San Juan",
    iso_id: "AR-J",
    iso_nombre: "San Juan",
    categoria: "Provincia",
    centroide: { lat: -30.8653, lon: -68.8894 }
  },
  {
    id: "74",
    nombre: "San Luis",
    nombre_largo: "Provincia de San Luis",
    iso_id: "AR-D",
    iso_nombre: "San Luis",
    categoria: "Provincia",
    centroide: { lat: -33.7577, lon: -66.0285 }
  },
  {
    id: "78",
    nombre: "Santa Cruz",
    nombre_largo: "Provincia de Santa Cruz",
    iso_id: "AR-Z",
    iso_nombre: "Santa Cruz",
    categoria: "Provincia",
    centroide: { lat: -48.8064, lon: -69.9592 }
  },
  {
    id: "82",
    nombre: "Santa Fe",
    nombre_largo: "Provincia de Santa Fe",
    iso_id: "AR-S",
    iso_nombre: "Santa Fe",
    categoria: "Provincia",
    centroide: { lat: -30.7069, lon: -60.9481 }
  },
  {
    id: "86",
    nombre: "Santiago del Estero",
    nombre_largo: "Provincia de Santiago del Estero",
    iso_id: "AR-G",
    iso_nombre: "Santiago del Estero",
    categoria: "Provincia",
    centroide: { lat: -27.7824, lon: -63.2523 }
  },
  {
    id: "90",
    nombre: "Tucumán",
    nombre_largo: "Provincia de Tucumán",
    iso_id: "AR-T",
    iso_nombre: "Tucumán",
    categoria: "Provincia",
    centroide: { lat: -26.9478, lon: -65.3647 }
  },
  {
    id: "94",
    nombre: "Tierra del Fuego",
    nombre_largo: "Provincia de Tierra del Fuego, Antártida e Islas del Atlántico Sur",
    iso_id: "AR-V",
    iso_nombre: "Tierra del Fuego",
    categoria: "Provincia",
    centroide: { lat: -54.0000, lon: -68.0000 }
  }
];

// Principales localidades por provincia (datos básicos para fallback)
export const LOCALIDADES_PRINCIPALES: Record<string, Array<{id: string, nombre: string}>> = {
  "02": [ // Buenos Aires Provincia
    { id: "0200100", nombre: "La Plata" },
    { id: "0282800", nombre: "Mar del Plata" },
    { id: "0254000", nombre: "Bahía Blanca" },
    { id: "0255000", nombre: "Tandil" },
    { id: "0263000", nombre: "Quilmes" },
    { id: "0245000", nombre: "San Nicolás" }
  ],
  "06": [ // CABA
    { id: "0600000", nombre: "Ciudad Autónoma de Buenos Aires" }
  ],
  "10": [ // Catamarca
    { id: "1000100", nombre: "San Fernando del Valle de Catamarca" },
    { id: "1001400", nombre: "Belén" }
  ],
  "14": [ // Córdoba
    { id: "1401401", nombre: "Córdoba" },
    { id: "1427000", nombre: "Río Cuarto" },
    { id: "1434300", nombre: "Villa María" }
  ],
  "22": [ // Chaco
    { id: "2207000", nombre: "Resistencia" }
  ],
  "26": [ // Chubut
    { id: "2601400", nombre: "Rawson" },
    { id: "2602800", nombre: "Comodoro Rivadavia" }
  ],
  "30": [ // Entre Ríos
    { id: "3007000", nombre: "Paraná" },
    { id: "3014000", nombre: "Concordia" }
  ],
  "50": [ // Mendoza
    { id: "5001400", nombre: "Mendoza" }
  ],
  "66": [ // Salta
    { id: "6600700", nombre: "Salta" }
  ],
  "82": [ // Santa Fe
    { id: "8200700", nombre: "Santa Fe" },
    { id: "8230700", nombre: "Rosario" }
  ]
};

export function getProvinciasFallback(): Provincia[] {
  console.log('📋 Usando datos de fallback para provincias');
  return PROVINCIAS_FALLBACK;
}

export function getLocalidadesFallback(provinciaId: string): Array<{id: string, nombre: string}> {
  console.log(`📋 Usando datos de fallback para localidades de provincia ${provinciaId}`);
  return LOCALIDADES_PRINCIPALES[provinciaId] || [];
}