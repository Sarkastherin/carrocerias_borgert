/**
 * Configuración centralizada de z-index para mantener una jerarquía correcta
 * Los valores están organizados de menor a mayor importancia visual
 */

export const Z_INDEX = {
  // Elementos base
  BASE: 0,
  CONTENT: 1,
  
  // Elementos de navegación
  SIDEBAR: 10,
  SIDEBAR_TOGGLE: 20,
  MOBILE_OVERLAY: 5,
  
  // Elementos de interfaz
  DROPDOWN: 9999,
  TOOLTIP: 60,
  
  // Elementos flotantes
  FOOTER: 40,
  HEADER: 30,
  
  // Modales y overlays críticos
  MODAL_BACKDROP: 100,
  MODAL_CONTENT: 101,
  CONFIRMATION_MODAL: 110,
  LOADING_OVERLAY: 120,
  
  // Elementos de máxima prioridad
  TOAST: 200,
  CRITICAL_ALERT: 300,
} as const;

export type ZIndexLevel = typeof Z_INDEX[keyof typeof Z_INDEX];

/**
 * Genera una clase CSS para z-index con valor dinámico
 * @param level - Nivel de z-index del enum Z_INDEX
 * @returns string - Clase CSS con z-index
 */
export const getZIndexClass = (level: ZIndexLevel): string => {
  return `z-[${level}]`;
};

/**
 * Jerarquía recomendada:
 * 
 * 0-10: Elementos base y navegación
 * 20-50: Elementos de interfaz normal
 * 60-90: Elementos flotantes
 * 100-199: Modales y overlays
 * 200+: Elementos críticos y notificaciones
 */