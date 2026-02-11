import type { CamionBD, CarroceriaBD } from "~/types/pedidos";

export type AtributoFieldType =
  | "text"
  | "number"
  | "boolean"
  | "select"
  | "textarea";

export type AtributoMetadata = {
  value: keyof CarroceriaBD | keyof CamionBD;
  label: string;
  fieldType: AtributoFieldType;
  options?: { value: string | number | boolean; label: string }[];
  placeholder?: string;
  min?: number;
  max?: number;
  disabledDefaultValues?: boolean;
  unit?: string;
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
];
export const arcosOptions = [
  { value: 0, label: "No aplica" },
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
export const tiposArcosOptions = [
  { value: "Estándar", label: "Estándar" },
  { value: "Reforzado", label: "Reforzado" },
  { value: "Reforzados + Estándar", label: "Reforzados + Estándar" },
  { value: "N/A", label: "No aplica" },
];
export const tiposBoquillasOptions = [
  { value: "Común", label: "Común" },
  { value: "Guillotinada", label: "Guillotinada" },
  { value: "N/A", label: "No aplica" },
];
export const ubicacionOptions = [
  { value: "Lado conductor", label: "Lado conductor" },
  { value: "Lado acompañante", label: "Lado acompañante" },
  { value: "A confirmar", label: "A confirmar" },
  { value: "N/A", label: "No aplica" },
];
export const atributosConMetadata: AtributoMetadata[] = [
  /* datos generales */
  {
    value: "tipo_carrozado_id",
    label: "Tipo de Carrozado",
    fieldType: "select",
    placeholder: "Seleccione tipo de carrozado",
    disabledDefaultValues: true,
    // Las opciones se configurarán dinámicamente desde el contexto
  },
  {
    value: "largo_int",
    label: "Largo interior",
    fieldType: "number",
    placeholder: "Ingrese largo interior en metros",
    min: 0,
    unit: "mm",
  },
  {
    value: "largo_ext",
    label: "Largo exterior",
    fieldType: "number",
    placeholder: "Ingrese largo exterior en metros",
    min: 0,
    unit: "mm",
  },
  {
    value: "material",
    label: "Material",
    fieldType: "select",
    options: materialOptions,
  },

  {
    value: "ancho_ext",
    label: "Ancho exterior",
    fieldType: "select",
    options: anchoOptions,
    unit: "mm",
  },
  {
    value: "alto",
    label: "Alto",
    fieldType: "number",
    placeholder: "Ingrese alto en metros",
    min: 0,
    unit: "mm",
  },
  {
    value: "alt_baranda",
    label: "Altura baranda",
    fieldType: "number",
    placeholder: "Ingrese altura baranda en metros",
    min: 0,
    unit: "mm",
  },
  {
    value: "ptas_por_lado",
    label: "Puertas por lado",
    fieldType: "number",
    placeholder: "Número de puertas por lado",
    min: 0,
    unit: "ptas",
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
    unit: "arcos",
  },
  {
    value: "tipos_arcos",
    label: "Tipos de arcos",
    fieldType: "select",
    options: tiposArcosOptions,
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
    options: espesorOptions,
    unit: "mm",
  },
  {
    value: "tipo_zocalo",
    label: "Tipo zócalo",
    fieldType: "select",
    options: zocaloOptions,
  },
  {
    value: "lineas_refuerzo",
    label: "Líneas de refuerzo",
    fieldType: "select",
    options: lineasRefOptions,
    unit: "líneas",
  },
  {
    value: "tipo_piso",
    label: "Tipo de piso",
    fieldType: "select",
    options: pisoOptions,
  },
  /* cuchetin */
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
    unit: "mm",
  },
  {
    value: "alt_pta_cuchetin",
    label: "Altura puerta cuchetín",
    fieldType: "number",
    placeholder: "Altura en metros",
    min: 0,
    unit: "mm",
  },
  {
    value: "alt_techo_cuchetin",
    label: "Altura techo cuchetín",
    fieldType: "number",
    placeholder: "Altura en metros",
    min: 0,
    unit: "mm",
  },
  {
    value: "notas_cuchetin",
    label: "Notas cuchetín",
    fieldType: "textarea",
    placeholder: "Notas sobre el cuchetín",
    disabledDefaultValues: true,
  },
  /* color */
  {
    value: "color_lona_id",
    label: "Color lona",
    fieldType: "text",
    placeholder: "Color de la lona",
  },
  {
    value: "color_carrozado_id",
    label: "Color carrozado",
    fieldType: "select", // Cambiado de text a select
    placeholder: "Seleccione color de carrozado",
    // Las opciones se configurarán dinámicamente desde el contexto
    disabledDefaultValues: true,
  },
  {
    value: "color_zocalo_id",
    label: "Color zócalo",
    fieldType: "select", // Cambiado de text a select
    placeholder: "Seleccione color del zócalo",
    // Las opciones se configurarán dinámicamente desde el contexto
    disabledDefaultValues: true,
  },
  {
    value: "notas_color",
    label: "Notas color",
    fieldType: "textarea",
    placeholder: "Notas sobre el color",
    disabledDefaultValues: true,
  },
  /* Boquillas */
  {
    value: "boquillas",
    label: "Boquillas",
    fieldType: "number",
    placeholder: "Número de boquillas",
    min: 0,
    unit: "boquillas",
  },
  {
    value: "tipo_boquillas",
    label: "Tipo de boquillas",
    fieldType: "select",
    options: tiposBoquillasOptions,
  },
  {
    value: "ubicacion_boquillas",
    label: "Ubicación de boquillas",
    fieldType: "select",
    options: ubicacionOptions,
  },
  /* Cajon de herramientas */
  {
    value: "med_cajon_herramientas",
    label: "Medida cajón de herramientas",
    fieldType: "number",
    placeholder: "Medida en metros",
    min: 0,
  },
  {
    value: "ubicacion_cajon_herramientas",
    label: "Ubicación cajón de herramientas",
    fieldType: "select",
    options: ubicacionOptions,
  },
  /* Accesorios */
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
    value: "ubicacion_dep_agua",
    label: "Ubicación depósito de agua",
    fieldType: "select",
    options: ubicacionOptions,
  },
  {
    value: "cintas_reflectivas",
    label: "Cintas reflectivas",
    fieldType: "select",
    options: cintasOptions,
  },
  /* Alargue */
  {
    value: "alargue_tipo_1",
    label: "Baranda a cumbrera",
    fieldType: "boolean",
    disabledDefaultValues: true,
  },
  {
    value: "cant_alargue_1",
    label: "Cantidad alargue 1",
    fieldType: "number",
    disabledDefaultValues: true,
    min: 0,
  },
  {
    value: "med_alargue_1",
    label: "Medida alargue 1",
    fieldType: "number",
    placeholder: "Medida en metros",
    min: 0,
    disabledDefaultValues: true,
  },
  {
    value: "quiebre_alargue_1",
    label: "Quiebre alargue 1",
    fieldType: "boolean",
    disabledDefaultValues: true,
  },
  {
    value: "alargue_tipo_2",
    label: "Baranda a cumbrera",
    fieldType: "boolean",
    disabledDefaultValues: true,
  },
  {
    value: "cant_alargue_2",
    label: "Cantidad alargue 1",
    fieldType: "number",
    disabledDefaultValues: true,
    min: 0,
  },
  {
    value: "med_alargue_2",
    label: "Medida alargue 1",
    fieldType: "number",
    placeholder: "Medida en metros",
    min: 0,
    disabledDefaultValues: true,
  },
  {
    value: "quiebre_alargue_2",
    label: "Quiebre alargue 2",
    fieldType: "boolean",
    disabledDefaultValues: true,
  },
  {
    value: "observaciones",
    label: "Observaciones",
    fieldType: "textarea",
    placeholder: "Observaciones adicionales",
    disabledDefaultValues: true,
  },
  // Datos de camión relacionados con carrocería
  {
    value: "centro_eje",
    label: "Centro de eje",
    fieldType: "number",
    placeholder: "Medida en metros",
    min: 0,
    unit: "mm",
  },
  {
    value: "marca",
    label: "Marca",
    fieldType: "text",
    placeholder: "marca del camión",
    disabledDefaultValues: true,
  },
  {
    value: "modelo",
    label: "Modelo",
    fieldType: "text",
    placeholder: "modelo del camión",
    disabledDefaultValues: true,
  },
  {
    value: "patente",
    label: "Patente",
    fieldType: "text",
    placeholder: "patente del camión",
    disabledDefaultValues: true,
  },
  {
    value: "tipo_larguero",
    label: "Tipo de larguero",
    fieldType: "select",
    placeholder: "Seleccione tipo de larguero",
    options: [
      { value: "recto", label: "Recto" },
      { value: "curvo", label: "Curvo" },
    ],
  },
  {
    value: "med_larguero",
    label: "Medida de larguero",
    fieldType: "text",
    placeholder: "medida del larguero",
    unit: "mm",
  },
   {
    value: "voladizo_trasero",
    label: "Medida de voladizo trasero",
    fieldType: "text",
    placeholder: "medida del voladizo trasero",
  },
];

// Función helper para obtener metadata de un atributo
export const getAtributoMetadata = (
  atributo: keyof CarroceriaBD
): AtributoMetadata | undefined => {
  return atributosConMetadata.find((attr) => attr.value === atributo);
};

// Función para obtener metadata con opciones dinámicas
export const getAtributoMetadataWithOptions = (
  atributo: keyof CarroceriaBD,
  dynamicOptions?: { value: string | number | boolean; label: string }[]
): AtributoMetadata | undefined => {
  const metadata = getAtributoMetadata(atributo);
  if (!metadata) return undefined;

  // Si hay opciones dinámicas y el atributo las necesita, las usa
  if (
    dynamicOptions &&
    (atributo === "puerta_trasera_id" ||
      atributo === "color_carrozado_id" ||
      atributo === "color_zocalo_id")
  ) {
    return {
      ...metadata,
      options: dynamicOptions,
    };
  }

  return metadata;
};

// Mantener compatibilidad con el array original
export const atributos = atributosConMetadata
  .filter((attr) => !attr.disabledDefaultValues)
  .map((attr) => ({
    value: attr.value,
    label: attr.label,
  }));
