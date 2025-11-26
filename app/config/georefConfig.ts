// Configuración para el servicio Georef
export const GEOREF_CONFIG = {
  // URL base de la API
  BASE_URL: 'https://apis.datos.gob.ar/georef/api',
  
  // Límites de rate limiting (conservadores para evitar 429)
  RATE_LIMIT: {
    MIN_INTERVAL: 150, // 150ms entre requests (más conservador)
    MAX_REQUESTS_PER_MINUTE: 40, // Máximo 40 requests por minuto (más conservador)
    WINDOW_SIZE: 60000, // Ventana de 1 minuto
  },
  
  // Configuración de cache
  CACHE: {
    DEFAULT_TTL: 5 * 60 * 1000, // 5 minutos por defecto
    PROVINCIAS_TTL: 30 * 60 * 1000, // 30 minutos para provincias (datos estáticos)
    LOCALIDADES_TTL: 15 * 60 * 1000, // 15 minutos para localidades
    ALL_LOCALIDADES_TTL: 60 * 60 * 1000, // 1 hora para listados completos
  },
  
  // Configuración de reintentos
  RETRY: {
    MAX_ATTEMPTS: 3,
    BASE_BACKOFF: 1000, // 1 segundo base
    MAX_BACKOFF: 30000, // Máximo 30 segundos
    JITTER: 1000, // Random hasta 1 segundo
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