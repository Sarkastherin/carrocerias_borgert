export type ClientesBD = {
  id: string;
  fecha_creacion: string;
  razon_social: string;
  nombre_contacto: string;
  telefono: string;
  email: string;
  cuit_cuil: string;
  direccion: string;
  // Campos de ubicación - nombres para display
  localidad: string;
  provincia: string;
  pais: string;
  // Campos de ubicación - IDs oficiales de Georef (nuevos campos)
  provincia_id?: string;  // ID oficial de la provincia en Georef
  localidad_id?: string;  // ID oficial de la localidad en Georef
  // Resto de campos
  condicion_iva: string;
  medio_contacto: string;
  vendedor_id: string;
  activo: boolean;
  observaciones: string;
}

// Tipos para el formulario con direcciones georreferencadas
export type ClienteFormData = {
  razon_social: string;
  nombre_contacto: string;
  telefono: string;
  email: string;
  cuit_cuil: string;
  // Nuevos campos para la dirección estructurada
  provincia_id?: string;
  provincia_nombre?: string;
  localidad_id?: string;
  localidad_nombre?: string;
  direccion: string;
  // Campos originales mantenidos para compatibilidad
  localidad?: string;
  provincia?: string;
  pais?: string;
  condicion_iva?: string;
  medio_contacto?: string;
  vendedor_id?: string;
  activo?: boolean;
  observaciones?: string;
}

// Tipos para la dirección completa
export type DireccionCompleta = {
  provinciaId: string;
  provinciaNombre: string;
  localidadId: string;
  localidadNombre: string;
  direccion: string;
  direccionCompleta: string; // Dirección formateada completa
}