// Servicio para la API Georef del estado argentino
// Documentación: https://apis.datos.gob.ar/georef/api/v2.0

import { GEOREF_CONFIG, getRateLimitConfig } from "~/config/georefConfig";
import { getProvinciasFallback, getLocalidadesFallback } from "~/config/fallbackData";

// Sistema de caché para evitar solicitudes repetidas
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

class CacheManager {
  private cache = new Map<string, CacheEntry<any>>();

  set<T>(key: string, data: T, ttl: number = GEOREF_CONFIG.CACHE.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresIn: ttl
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.expiresIn) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  clear(): void {
    this.cache.clear();
  }
}

// Gestor de rate limiting
class RateLimitManager {
  private lastRequestTime = 0;
  private requestCount = 0;
  private requestTimes: number[] = [];
  private config = getRateLimitConfig();

  async waitIfNeeded(): Promise<void> {
    const now = Date.now();
    
    // Limpiar requests antiguos
    this.requestTimes = this.requestTimes.filter(
      time => now - time < this.config.WINDOW_SIZE
    );

    // Verificar si hemos excedido el límite
    if (this.requestTimes.length >= this.config.MAX_REQUESTS_PER_MINUTE) {
      const oldestRequest = this.requestTimes[0];
      const waitTime = this.config.WINDOW_SIZE - (now - oldestRequest);
      if (waitTime > 0) {
        console.log(`🚀 Rate limit alcanzado, esperando ${waitTime}ms (producción: ${this.config.MIN_INTERVAL}ms interval)`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }

    // Esperar el intervalo mínimo entre requests
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.config.MIN_INTERVAL) {
      await new Promise(resolve => 
        setTimeout(resolve, this.config.MIN_INTERVAL - timeSinceLastRequest)
      );
    }

    this.lastRequestTime = Date.now();
    this.requestTimes.push(this.lastRequestTime);
  }

  async retryWithBackoff<T>(
    operation: () => Promise<T>, 
    maxRetries: number = GEOREF_CONFIG.RETRY.MAX_ATTEMPTS
  ): Promise<T> {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        await this.waitIfNeeded();
        return await operation();
      } catch (error: any) {
        const is429 = error.message?.includes('429') || error.status === 429;
        const is400 = error.message?.includes('400') || error.status === 400;
        const isNetworkError = error.message?.includes('Failed to fetch') || error.name === 'TypeError';
        
        // No reintentar en errores 400 (Bad Request) ya que son problemas de parámetros
        if (is400) {
          console.error('Error 400 - Parámetros incorrectos:', error);
          throw new Error(GEOREF_CONFIG.ERROR_MESSAGES[400]);
        }
        
        if ((is429 || isNetworkError) && attempt < maxRetries) {
          const baseBackoff = Math.pow(2, attempt) * GEOREF_CONFIG.RETRY.BASE_BACKOFF;
          const jitter = Math.random() * GEOREF_CONFIG.RETRY.JITTER;
          const backoffTime = Math.min(baseBackoff + jitter, GEOREF_CONFIG.RETRY.MAX_BACKOFF);
          
          console.log(`Error detectado (${is429 ? '429' : 'red'}), reintentando en ${Math.round(backoffTime)}ms (intento ${attempt + 1}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, backoffTime));
          continue;
        }
        
        // Mejorar el mensaje de error
        if (is429) {
          throw new Error(GEOREF_CONFIG.ERROR_MESSAGES[429]);
        } else if (isNetworkError) {
          throw new Error(GEOREF_CONFIG.ERROR_MESSAGES.NETWORK);
        }
        
        throw error;
      }
    }
    
    throw new Error(GEOREF_CONFIG.ERROR_MESSAGES.GENERIC);
  }
}

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
  private cache = new CacheManager();
  private rateLimitManager = new RateLimitManager();
  private pendingRequests = new Map<string, Promise<any>>();

  private async request<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const url = new URL(`${GEOREF_CONFIG.BASE_URL}${endpoint}`);
    
    // Agregar parámetros de consulta
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        url.searchParams.append(key, value);
      }
    });

    // Generar clave de caché
    const cacheKey = url.toString();
    
    // Verificar caché primero
    const cachedData = this.cache.get<T>(cacheKey);
    if (cachedData) {
      console.log('Datos obtenidos desde caché:', endpoint);
      return cachedData;
    }

    // Si no está en caché, hacer la solicitud con rate limiting
    return this.rateLimitManager.retryWithBackoff(async () => {
      console.log(`🌐 Georef API Request: ${url.toString()}`);
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        console.error(`❌ Georef API Error: ${response.status} - ${url.toString()}`);
        throw new Error(`Error en la API Georef: ${response.status}`);
      }

      const data = await response.json();
      console.log(`✅ Georef API Success: ${endpoint} - ${data.cantidad || 0} resultados`);
      
      // Guardar en caché con TTL apropiado según el tipo de datos
      let ttl = GEOREF_CONFIG.CACHE.DEFAULT_TTL;
      if (endpoint.includes('provincias')) {
        ttl = GEOREF_CONFIG.CACHE.PROVINCIAS_TTL;
      } else if (endpoint.includes('localidades')) {
        ttl = GEOREF_CONFIG.CACHE.LOCALIDADES_TTL;
      }
      
      this.cache.set(cacheKey, data, ttl);
      
      return data;
    });
  }

  /**
   * Evita llamadas duplicadas usando una clave de cache
   */
  private async deduplicateRequest<T>(key: string, fn: () => Promise<T>): Promise<T> {
    // Si ya hay una petición pendiente con esta clave, esperar su resultado
    if (this.pendingRequests.has(key)) {
      console.log(`🔄 Evitando llamada duplicada para: ${key}`);
      return this.pendingRequests.get(key) as Promise<T>;
    }

    // Crear nueva petición
    const promise = fn().finally(() => {
      // Limpiar la petición pendiente cuando termine
      this.pendingRequests.delete(key);
    });

    // Guardar la petición pendiente
    this.pendingRequests.set(key, promise);
    
    return promise;
  }

  /**
   * Obtiene todas las provincias argentinas
   * @param nombre Filtro opcional por nombre de provincia
   * @param max Cantidad máxima de resultados
   */
  async getProvincias(nombre?: string, max: number = GEOREF_CONFIG.PAGINATION.DEFAULT_PROVINCIAS): Promise<Provincia[]> {
    const cacheKey = `provincias_${nombre || 'all'}_${max}`;
    
    return this.deduplicateRequest(cacheKey, async () => {
      try {
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
      } catch (error) {
        console.warn('⚠️  API Georef no disponible, usando datos de fallback para provincias');
        const fallbackData = getProvinciasFallback();
        
        if (nombre) {
          return fallbackData.filter(p => 
            p.nombre.toLowerCase().includes(nombre.toLowerCase())
          );
        }
        
        return fallbackData;
      }
    });
  }

  /**
   * Obtiene localidades filtradas por provincia
   * @param provinciaId ID de la provincia (requerido)
   * @param nombre Filtro opcional por nombre de localidad
   * @param max Cantidad máxima de resultados
   */
  async getLocalidades(
    provinciaId: string, 
    nombre?: string, 
    max: number = GEOREF_CONFIG.PAGINATION.DEFAULT_LOCALIDADES
  ): Promise<Localidad[]> {
    // Validar que el provinciaId sea válido
    if (!provinciaId || provinciaId.trim() === '') {
      throw new Error('El ID de provincia es requerido');
    }

    const cacheKey = `localidades_${provinciaId}_${nombre || 'all'}_${max}`;
    
    return this.deduplicateRequest(cacheKey, async () => {
      try {
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
      } catch (error) {
        console.warn(`⚠️  API Georef no disponible para búsqueda, usando datos de fallback para provincia ${provinciaId}`);
        
        const fallbackLocalidades = getLocalidadesFallback(provinciaId);
        const localidadesCompletas: Localidad[] = fallbackLocalidades
          .filter(loc => !nombre || loc.nombre.toLowerCase().includes(nombre.toLowerCase()))
          .map(loc => ({
            id: loc.id,
            nombre: loc.nombre,
            departamento: { id: '', nombre: '' },
            provincia: { id: provinciaId, nombre: '' },
            municipio: { id: '', nombre: '' },
            categoria: 'Localidad',
            centroide: { lat: 0, lon: 0 }
          }));
        
        return localidadesCompletas;
      }
    });
  }

  /**
   * Obtiene todas las localidades de una provincia (para casos donde se necesita el listado completo)
   * Usa caché agresivo para evitar requests repetidos
   */
  async getAllLocalidades(provinciaId: string): Promise<Localidad[]> {
    // Validar que el provinciaId sea válido
    if (!provinciaId || provinciaId.trim() === '') {
      throw new Error('El ID de provincia es requerido');
    }
    
    const cacheKey = `all_localidades_${provinciaId}`;
    
    // Verificar caché específico para localidades completas (TTL más largo)
    const cached = this.cache.get<Localidad[]>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const params: Record<string, string> = {
        provincia: provinciaId,
        campos: 'estandar',
        max: GEOREF_CONFIG.PAGINATION.MAX_ALL_LOCALIDADES.toString(),
        orden: 'nombre'
      };

      const response = await this.request<LocalidadesResponse>('/localidades', params);
      
      // Caché específico para listados completos
      this.cache.set(cacheKey, response.localidades, GEOREF_CONFIG.CACHE.ALL_LOCALIDADES_TTL);
      
      return response.localidades;
    } catch (error) {
      console.warn(`⚠️  API Georef no disponible, usando datos de fallback para localidades de provincia ${provinciaId}`);
      
      const fallbackLocalidades = getLocalidadesFallback(provinciaId);
      const localidadesCompletas: Localidad[] = fallbackLocalidades.map(loc => ({
        id: loc.id,
        nombre: loc.nombre,
        departamento: { id: '', nombre: '' },
        provincia: { id: provinciaId, nombre: '' },
        municipio: { id: '', nombre: '' },
        categoria: 'Localidad',
        centroide: { lat: 0, lon: 0 }
      }));
      
      // Cachear datos de fallback también
      this.cache.set(cacheKey, localidadesCompletas, GEOREF_CONFIG.CACHE.ALL_LOCALIDADES_TTL);
      
      return localidadesCompletas;
    }
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

// Función para precargar provincias al inicio de la aplicación
export async function precargarProvincias(): Promise<void> {
  try {
    console.log('🚀 Precargando provincias al inicio...');
    await georefService.getProvincias();
    console.log('✅ Provincias precargadas correctamente');
  } catch (error) {
    console.warn('⚠️ No se pudieron precargar provincias desde la API, se usarán datos de fallback cuando sea necesario');
  }
}

// Función para obtener información del estado del sistema
export function getGeorefSystemInfo() {
  const config = getRateLimitConfig();
  const isProduction = config.MIN_INTERVAL >= 500;
  
  return {
    isProduction,
    minInterval: config.MIN_INTERVAL,
    maxRequestsPerMinute: config.MAX_REQUESTS_PER_MINUTE,
    fallbackAvailable: true,
    cacheEnabled: true
  };
}

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