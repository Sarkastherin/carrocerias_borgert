// Servicio para la API Georef del estado argentino
// Documentación: https://apis.datos.gob.ar/georef/api/v2.0

const GEOREF_BASE_URL = 'https://apis.datos.gob.ar/georef/api';

// Tipos para la respuesta de la API Georef
export interface Provincia {
  id: string;
  nombre: string;
  nombre_largo: string;
  iso_id: string;
  iso_nombre: string;
  categoria: string;
  centroide: {
    lat: number;
    lon: number;
  };
}

export interface Localidad {
  id: string;
  nombre: string;
  departamento: {
    id: string;
    nombre: string;
  };
  provincia: {
    id: string;
    nombre: string;
  };
  municipio: {
    id: string;
    nombre: string;
  };
  categoria: string;
  centroide: {
    lat: number;
    lon: number;
  };
}

export interface DireccionNormalizada {
  altura: {
    valor: number;
    unidad: string;
  };
  calle: {
    id: string;
    nombre: string;
    categoria: string;
  };
  nomenclatura: string;
  ubicacion: {
    lat: number;
    lon: number;
  };
  provincia: {
    id: string;
    nombre: string;
  };
  departamento: {
    id: string;
    nombre: string;
  };
  localidad_censal: {
    id: string;
    nombre: string;
  };
}

interface GeorefResponse<T> {
  cantidad: number;
  total: number;
  inicio: number;
  parametros: Record<string, any>;
}

interface ProvinciasResponse extends GeorefResponse<Provincia> {
  provincias: Provincia[];
}

interface LocalidadesResponse extends GeorefResponse<Localidad> {
  localidades: Localidad[];
}

interface DireccionesResponse extends GeorefResponse<DireccionNormalizada> {
  direcciones: DireccionNormalizada[];
}

class GeorefService {
  private async request<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const url = new URL(`${GEOREF_BASE_URL}${endpoint}`);
    
    // Agregar parámetros de consulta
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        url.searchParams.append(key, value);
      }
    });

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Error en la API Georef: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Obtiene todas las provincias argentinas
   * @param nombre Filtro opcional por nombre de provincia
   * @param max Cantidad máxima de resultados (default: 25, máximo: 5000)
   */
  async getProvincias(nombre?: string, max: number = 25): Promise<Provincia[]> {
    const params: Record<string, string> = {
      campos: 'estandar',
      max: max.toString(),
      orden: 'nombre'
    };

    if (nombre) {
      params.nombre = nombre;
    }

    const response = await this.request<ProvinciasResponse>('/provincias', params);
    return response.provincias;
  }

  /**
   * Obtiene localidades filtradas por provincia
   * @param provinciaId ID de la provincia (requerido)
   * @param nombre Filtro opcional por nombre de localidad
   * @param max Cantidad máxima de resultados (default: 50, máximo: 5000)
   */
  async getLocalidades(
    provinciaId: string, 
    nombre?: string, 
    max: number = 50
  ): Promise<Localidad[]> {
    const params: Record<string, string> = {
      provincia: provinciaId,
      campos: 'estandar',
      max: max.toString(),
      orden: 'nombre'
    };

    if (nombre) {
      params.nombre = nombre;
    }

    const response = await this.request<LocalidadesResponse>('/localidades', params);
    return response.localidades;
  }

  /**
   * Normaliza una dirección usando la API Georef
   * @param direccion Dirección a normalizar (ej: "Av. Corrientes 1234")
   * @param provinciaId ID de la provincia (opcional, mejora la precisión)
   * @param localidadId ID de la localidad (opcional, mejora la precisión)
   * @param max Cantidad máxima de resultados (default: 10)
   */
  async normalizarDireccion(
    direccion: string,
    provinciaId?: string,
    localidadId?: string,
    max: number = 10
  ): Promise<DireccionNormalizada[]> {
    const params: Record<string, string> = {
      direccion,
      campos: 'estandar',
      max: max.toString()
    };

    if (provinciaId) {
      params.provincia = provinciaId;
    }

    if (localidadId) {
      params.localidad = localidadId;
    }

    const response = await this.request<DireccionesResponse>('/direcciones', params);
    return response.direcciones;
  }

  /**
   * Búsqueda avanzada de localidades por texto libre
   * Útil para autocompletado
   * @param texto Texto de búsqueda
   * @param provinciaId ID de la provincia (opcional)
   * @param max Cantidad máxima de resultados
   */
  async buscarLocalidades(
    texto: string,
    provinciaId?: string,
    max: number = 20
  ): Promise<Localidad[]> {
    const params: Record<string, string> = {
      nombre: texto,
      campos: 'estandar',
      max: max.toString(),
      orden: 'nombre'
    };

    if (provinciaId) {
      params.provincia = provinciaId;
    }

    const response = await this.request<LocalidadesResponse>('/localidades', params);
    return response.localidades;
  }
}

// Instancia singleton del servicio
export const georefService = new GeorefService();

// Función utilitaria para formatear nombres de localidades
export function formatearLocalidad(localidad: Localidad): string {
  const partes = [localidad.nombre];
  
  if (localidad.departamento.nombre !== localidad.nombre) {
    partes.push(localidad.departamento.nombre);
  }
  
  partes.push(localidad.provincia.nombre);
  
  return partes.join(', ');
}

// Función utilitaria para validar si una dirección está completa
export function isDireccionCompleta(direccion: {
  provincia?: string;
  localidad?: string;
  direccion?: string;
}): boolean {
  return !!(direccion.provincia && direccion.localidad && direccion.direccion);
}