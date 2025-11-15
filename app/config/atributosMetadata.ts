import type { CarroceriaBD } from "~/types/pedidos";

export type AtributoFieldType = "text" | "number" | "boolean" | "select" | "textarea";

export type AtributoMetadata = {
  value: keyof CarroceriaBD;
  label: string;
  fieldType: AtributoFieldType;
  options?: { value: string | number | boolean; label: string }[];
  placeholder?: string;
  min?: number;
  max?: number;
};
export const materialOptions = [
  { value: "chapa", label: "Chapa" },
  { value: "fibra", label: "Fibra" },
];
export const anchoOptions = [
  { value: 2000, label: "2000 mm" },
  { value: 2200, label: "2200 mm" },
  { value: 2300, label: "2300 mm" },
  { value: 2400, label: "2400 mm" },
  { value: 2600, label: "2600 mm" },
]
export const arcosOptions = [
  { value: 0, label: "0 arcos" },
  { value: 1, label: "1 arco" },
  { value: 2, label: "2 arcos" },
  { value: 3, label: "3 arcos" },
];
export const espesorOptions = [
  { value: "3.2", label: "3.2 mm" },
  { value: "2.9", label: "2.9 mm" },
  { value: "2.6", label: "2.6 mm" },
  { value: "2.2", label: "2.2 mm" },
];
export const zocaloOptions = [
  { value: "recto", label: "Recto" },
  { value: "gross_viejo", label: "Gross Viejo" },
  { value: "gross_nuevo", label: "Gross Nuevo" },
];
export const lineasRefOptions = [
  { value: 0, label: "Sin refuerzo" },
  { value: 3, label: "3 líneas" },
  { value: 5, label: "5 líneas" },
];
export const pisoOptions = [
  { value: "liso", label: "Liso" },
  { value: "semillado", label: "Semillado" },
];
export const cintasOptions = [
  { value: "nacionales", label: "Nacionales" },
  { value: "internacionales", label: "Internacionales" },
];

export const atributosConMetadata: AtributoMetadata[] = [
  {
    value: "material",
    label: "Material",
    fieldType: "select",
    options: materialOptions,
  },
  {
    value: "largo_int",
    label: "Largo interior",
    fieldType: "number",
    placeholder: "Ingrese largo interior en metros",
    min: 0,
  },
  {
    value: "largo_ext",
    label: "Largo exterior",
    fieldType: "number",
    placeholder: "Ingrese largo exterior en metros",
    min: 0,
  },
  {
    value: "ancho_ext",
    label: "Ancho exterior",
    fieldType: "select",
    options: anchoOptions,
  },
  {
    value: "alto",
    label: "Alto",
    fieldType: "number",
    placeholder: "Ingrese alto en metros",
    min: 0,
  },
  {
    value: "alt_baranda",
    label: "Altura baranda",
    fieldType: "number",
    placeholder: "Ingrese altura baranda en metros",
    min: 0,
  },
  {
    value: "ptas_por_lado",
    label: "Puertas por lado",
    fieldType: "number",
    placeholder: "Número de puertas por lado",
    min: 0,
  },
  {
    value: "puerta_trasera_id",
    label: "Puerta trasera",
    fieldType: "select", // Cambiado de text a select
    placeholder: "Seleccione puerta trasera",
    // Las opciones se configurarán dinámicamente desde el contexto
  },
  {
    value: "arcos_por_puerta",
    label: "Arcos por puerta",
    fieldType: "select",
    options: arcosOptions,
  },
  {
    value: "corte_guardabarros",
    label: "Corte guardabarros",
    fieldType: "boolean",
  },
  {
    value: "cumbreras",
    label: "Cumbreras",
    fieldType: "boolean",
  },
  {
    value: "espesor_chapa",
    label: "Espesor chapa",
    fieldType: "select",
    options: espesorOptions
  },
  {
    value: "tipo_zocalo",
    label: "Tipo zócalo",
    fieldType: "select",
    options: zocaloOptions
  },
  {
    value: "lineas_refuerzo",
    label: "Líneas de refuerzo",
    fieldType: "select",
    options: lineasRefOptions
  },
  {
    value: "cuchetin",
    label: "Cuchetín",
    fieldType: "boolean",
  },
  {
    value: "med_cuchetin",
    label: "Medida cuchetín",
    fieldType: "number",
    placeholder: "Medida en metros",
    min: 0,
  },
  {
    value: "alt_pta_cuchetin",
    label: "Altura puerta cuchetín",
    fieldType: "number",
    placeholder: "Altura en metros",
    min: 0,
  },
  {
    value: "alt_techo_cuchetin",
    label: "Altura techo cuchetín",
    fieldType: "number",
    placeholder: "Altura en metros",
    min: 0,
  },
  /* {
    value: "color_lona_id",
    label: "Color lona",
    fieldType: "text",
    placeholder: "Color de la lona",
  }, */
  {
    value: "tipo_piso",
    label: "Tipo de piso",
    fieldType: "select",
    options: pisoOptions
  },
  /* {
    value: "color_carrozado_id",
    label: "Color carrozado",
    fieldType: "select", // Cambiado de text a select
    placeholder: "Seleccione color de carrozado",
    // Las opciones se configurarán dinámicamente desde el contexto
  },
  {
    value: "color_zocalo_id",
    label: "Color zócalo",
    fieldType: "select", // Cambiado de text a select
    placeholder: "Seleccione color del zócalo",
    // Las opciones se configurarán dinámicamente desde el contexto
  }, */
  /* {
    value: "notas_color",
    label: "Notas color",
    fieldType: "textarea",
    placeholder: "Notas sobre el color",
  }, */
  {
    value: "boquillas",
    label: "Boquillas",
    fieldType: "number",
    placeholder: "Número de boquillas",
    min: 0,
  },
  {
    value: "med_cajon_herramientas",
    label: "Medida cajón de herramientas",
    fieldType: "number",
    placeholder: "Medida en metros",
    min: 0,
  },
  {
    value: "luces",
    label: "Luces",
    fieldType: "number",
    placeholder: "Número de luces",
    min: 0,
  },
  {
    value: "guardabarros",
    label: "Guardabarros",
    fieldType: "boolean",
  },
  {
    value: "dep_agua",
    label: "Depósito de agua",
    fieldType: "boolean",
  },
  {
    value: "cintas_reflectivas",
    label: "Cintas reflectivas",
    fieldType: "select",
    options: cintasOptions
  },
  {
    value: "med_alargue",
    label: "Medida alargue",
    fieldType: "number",
    placeholder: "Medida en metros",
    min: 0,
  },
  {
    value: "quiebre_alargue",
    label: "Quiebre alargue",
    fieldType: "boolean",
  },
  /* {
    value: "observaciones",
    label: "Observaciones",
    fieldType: "textarea",
    placeholder: "Observaciones adicionales",
  }, */
];

// Función helper para obtener metadata de un atributo
export const getAtributoMetadata = (atributo: keyof CarroceriaBD): AtributoMetadata | undefined => {
  return atributosConMetadata.find(attr => attr.value === atributo);
};

// Función para obtener metadata con opciones dinámicas
export const getAtributoMetadataWithOptions = (
  atributo: keyof CarroceriaBD, 
  dynamicOptions?: { value: string | number | boolean; label: string }[]
): AtributoMetadata | undefined => {
  const metadata = getAtributoMetadata(atributo);
  if (!metadata) return undefined;
  
  // Si hay opciones dinámicas y el atributo las necesita, las usa
  if (dynamicOptions && (atributo === "puerta_trasera_id" || atributo === "color_carrozado_id" || atributo === "color_zocalo_id")) {
    return {
      ...metadata,
      options: dynamicOptions
    };
  }
  
  return metadata;
};

// Mantener compatibilidad con el array original
export const atributos = atributosConMetadata.map(attr => ({
  value: attr.value,
  label: attr.label
}));