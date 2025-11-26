// Configuración para el servicio Georef
export const GEOREF_CONFIG = {
  // URL base de la API
  BASE_URL: 'https://apis.datos.gob.ar/georef/api',
  
  // Límites de rate limiting (ULTRA conservadores para producción)
  RATE_LIMIT: {
    MIN_INTERVAL: 3000, // 3 segundos entre requests (ULTRA conservador)
    MAX_REQUESTS_PER_MINUTE: 8, // Máximo 8 requests por minuto (ULTRA conservador)
    WINDOW_SIZE: 60000, // Ventana de 1 minuto
  },

  // Configuración para desarrollo (conservadora)
  RATE_LIMIT_DEV: {
    MIN_INTERVAL: 2000, // 2 segundos entre requests para desarrollo
    MAX_REQUESTS_PER_MINUTE: 15, // 15 requests por minuto para desarrollo
    WINDOW_SIZE: 60000,
  },
  
  // Configuración de cache
  CACHE: {
    DEFAULT_TTL: 5 * 60 * 1000, // 5 minutos por defecto
    PROVINCIAS_TTL: 30 * 60 * 1000, // 30 minutos para provincias (datos estáticos)
    LOCALIDADES_TTL: 15 * 60 * 1000, // 15 minutos para localidades
    ALL_LOCALIDADES_TTL: 60 * 60 * 1000, // 1 hora para listados completos
  },
  
  // Configuración de reintentos (más conservadora)
  RETRY: {
    MAX_ATTEMPTS: 3, // Menos intentos para activar fallback más rápido
    BASE_BACKOFF: 5000, // 5 segundos base (más tiempo)
    MAX_BACKOFF: 120000, // Máximo 2 minutos
    JITTER: 3000, // Random hasta 3 segundos
  },
  
  // Límites de paginación
  PAGINATION: {
    DEFAULT_PROVINCIAS: 25,
    DEFAULT_LOCALIDADES: 100,
    MAX_LOCALIDADES_SEARCH: 200,
    MAX_ALL_LOCALIDADES: 1000,
  },
  
  // Mensajes de error
  ERROR_MESSAGES: {
    400: "Error en los parámetros de la solicitud. Por favor, contacta al soporte técnico.",
    429: "Demasiadas solicitudes. Por favor, espera unos segundos e intenta nuevamente.",
    NETWORK: "Error de conexión. Verifica tu conexión a internet.",
    TIMEOUT: "La solicitud tardó demasiado tiempo. Intenta nuevamente.",
    GENERIC: "Error al cargar los datos. Intenta nuevamente en unos momentos.",
  }
} as const;

export type GeorefConfig = typeof GEOREF_CONFIG;

// Función para obtener configuración según el entorno
export function getRateLimitConfig() {
  const isProduction = typeof window !== 'undefined' 
    ? window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    : process.env.NODE_ENV === 'production';
    
  return isProduction ? GEOREF_CONFIG.RATE_LIMIT : GEOREF_CONFIG.RATE_LIMIT_DEV;
}