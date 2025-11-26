# Servicio Georef - Manejo de Rate Limiting

## Problema Identificado

La API de Georef (https://apis.datos.gob.ar/georef/api) tiene límites de tasa que pueden causar errores 429 (Too Many Requests) cuando se hacen demasiadas solicitudes en poco tiempo.

## Soluciones Implementadas

### 1. Sistema de Caché Inteligente
- **Provincias**: Cache por 30 minutos (datos estáticos)
- **Localidades**: Cache por 15 minutos 
- **Listados completos**: Cache por 1 hora
- Evita solicitudes repetidas innecesarias

### 2. Rate Limiting
- Máximo 40 requests por minuto (conservador)
- Mínimo 150ms entre requests
- Sistema de ventana deslizante para control de límites

### 3. Reintentos con Backoff Exponencial
- Hasta 3 intentos automáticos
- Tiempo de espera progresivo: 1s, 2s, 4s + jitter
- Manejo específico de errores 429 y de red

### 4. Optimizaciones de Carga
- Búsquedas con debounce de 300ms
- Carga diferida de localidades (solo cuando se selecciona provincia)
- Paginación inteligente según el contexto

### 5. Manejo de Errores Mejorado
- Mensajes específicos para cada tipo de error
- Botón de "Intentar nuevamente" en errores
- Indicadores de estado de carga claros

## Archivos Modificados

### Servicios
- `/app/services/georefService.ts` - Lógica principal con caché y rate limiting
- `/app/config/georefConfig.ts` - Configuración centralizada

### Hooks
- `/app/hooks/useAddressForm.ts` - Hook optimizado con debounce y manejo de errores

### Componentes
- `/app/components/AddressFields.tsx` - UI con manejo de errores y botón de retry
- `/app/components/Notification.tsx` - Componente para notificaciones de estado

## Configuración

Puedes ajustar los límites en `/app/config/georefConfig.ts`:

```typescript
export const GEOREF_CONFIG = {
  RATE_LIMIT: {
    MIN_INTERVAL: 150, // ms entre requests
    MAX_REQUESTS_PER_MINUTE: 40, // límite conservador
  },
  
  CACHE: {
    PROVINCIAS_TTL: 30 * 60 * 1000, // 30 minutos
    LOCALIDADES_TTL: 15 * 60 * 1000, // 15 minutos
  },
  
  RETRY: {
    MAX_ATTEMPTS: 3,
    BASE_BACKOFF: 1000, // 1 segundo base
  }
};
```

## Monitoreo

El servicio incluye logs en consola para monitorear:
- Hits de caché vs requests a la API
- Tiempos de espera por rate limiting
- Intentos de retry y backoff

## Recomendaciones

1. **En desarrollo**: Los límites conservadores pueden hacer que la app se sienta lenta. Puedes reducir los intervalos.

2. **En producción**: Mantén los límites conservadores para evitar bloqueos de la API.

3. **Monitoreo**: Revisa los logs de consola para identificar patrones de uso y optimizar further.

4. **Fallback**: Considera implementar un servicio de backup o datos estáticos como fallback para casos de alta disponibilidad.

## Solución de Problemas

### Error 400 (Bad Request):
1. Verifica que los parámetros de la API sean correctos
2. Revisa que no haya caracteres especiales en los parámetros de ordenamiento
3. Usa el script `debug-georef.js` en la consola del navegador para probar manualmente
4. Si persiste, contacta al soporte técnico

### Error 429 persistente:
1. Verifica que no hay múltiples instancias haciendo requests simultáneos
2. Incrementa los intervalos en la configuración
3. Usa el botón "Intentar nuevamente" después de esperar

### Carga lenta:
1. El caché mejorará la velocidad después de la primera carga
2. Las búsquedas están optimizadas con debounce
3. Considera pre-cargar provincias en el inicio de la aplicación

### Datos obsoletos:
1. El caché expira automáticamente
2. Puedes limpiar manualmente desde las herramientas de desarrollo
3. Los errores de red fuerzan refresh automático