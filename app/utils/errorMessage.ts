// Diccionario base: palabra clave del error → mensaje amigable

interface ErrorDetails {
  operation?: string;
  originalError?: {
    result?: {
      error?: {
        code?: number;
        message?: string;
        status?: string;
      };
    };
  };
  fileName?: string;
  sheetName?: string;
  sheetId?: string;
}

interface CustomError {
  type?: string;
  message?: string;
  details?: ErrorDetails;
  code?: number;
}

// Diccionario de mensajes de error amigables
const ERROR_MESSAGES = {
  // Errores de Google Sheets
  'Unable to parse range': (details: ErrorDetails) => {
    const fileName = details.fileName || 'archivo';
    const sheetName = details.sheetName || 'hoja';
    return `❌ No se puede acceder a la hoja "${sheetName}" en el archivo "${fileName}". 
    
🔧 Posibles soluciones:
• Verifica que la hoja se llame exactamente "${sheetName}"
• Revisa que no haya espacios extra en el nombre
• Asegúrate de que la hoja no haya sido eliminada o renombrada`;
  },
  
  'INVALID_ARGUMENT': () => 
    `❌ Los datos enviados no son válidos. Por favor revisa la información e intenta nuevamente.`,
  
  'PERMISSION_DENIED': (details: ErrorDetails) => {
    const fileName = details.fileName || 'archivo';
    return `❌ No tienes permisos para acceder al archivo "${fileName}".
    
🔧 Solicita acceso al propietario del documento o verifica tus permisos.`;
  },
  
  'NOT_FOUND': (details: ErrorDetails) => {
    const fileName = details.fileName || 'archivo';
    return `❌ No se encontró el archivo "${fileName}".
    
🔧 Verifica que el enlace del documento sea correcto y que el archivo exista.`;
  },
  
  'RATE_LIMIT_EXCEEDED': () => 
    `⏳ Se ha excedido el límite de solicitudes. Por favor espera unos momentos e intenta nuevamente.`,
  
  // Errores de validación
  'VALIDATION_ERROR': (details: ErrorDetails) => {
    if (details.originalError?.result?.error?.message?.includes('Unable to parse range')) {
      return ERROR_MESSAGES['Unable to parse range'](details);
    }
    return `❌ Error de validación: ${details.originalError?.result?.error?.message || 'Datos inválidos'}`;
  },
  
  // Error genérico de conexión
  'NETWORK_ERROR': () => 
    `🌐 Error de conexión. Verifica tu conexión a internet e intenta nuevamente.`,
  
  // Error genérico
  'UNKNOWN_ERROR': () => 
    `❌ Ocurrió un error inesperado. Por favor intenta nuevamente.`
};

/**
 * Convierte errores técnicos en mensajes amigables para el usuario
 * @param error - El objeto de error (puede ser string, Error, o el objeto personalizado)
 * @returns Mensaje de error amigable
 */
export function getFormattedError(error: unknown): string {
  // Si es un string simple, devolverlo tal como está
  if (typeof error === 'string') {
    return error;
  }

  // Si es un Error estándar
  if (error instanceof Error) {
    return error.message;
  }

  // Si es nuestro objeto de error personalizado
  const customError = error as CustomError;
  
  if (customError.type) {
    const errorHandler = ERROR_MESSAGES[customError.type as keyof typeof ERROR_MESSAGES];
    if (errorHandler) {
      return typeof errorHandler === 'function' 
        ? errorHandler(customError.details || {})
        : errorHandler;
    }
  }

  // Buscar por el mensaje específico en el error original
  const originalMessage = customError.details?.originalError?.result?.error?.message || customError.message;
  
  if (originalMessage) {
    // Buscar coincidencias parciales en los mensajes
    for (const [key, handler] of Object.entries(ERROR_MESSAGES)) {
      if (originalMessage.includes(key)) {
        return typeof handler === 'function' 
          ? handler(customError.details || {})
          : handler;
      }
    }
  }

  // Buscar por el status del error
  const errorStatus = customError.details?.originalError?.result?.error?.status;
  if (errorStatus && ERROR_MESSAGES[errorStatus as keyof typeof ERROR_MESSAGES]) {
    const handler = ERROR_MESSAGES[errorStatus as keyof typeof ERROR_MESSAGES];
    return typeof handler === 'function' 
      ? handler(customError.details || {})
      : handler;
  }

  // Si no encontramos nada específico, devolver mensaje genérico
  return ERROR_MESSAGES.UNKNOWN_ERROR();
}

/**
 * Función helper para mostrar errores en desarrollo (solo en console)
 */
export function logDetailedError(error: unknown): void {
  if (process.env.NODE_ENV === 'development') {
    console.group('🔍 Detailed Error Information');
    console.log('Original Error:', error);
    console.log('Formatted Message:', getFormattedError(error));
    console.groupEnd();
  }
}
