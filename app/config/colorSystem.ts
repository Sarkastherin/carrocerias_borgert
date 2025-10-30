/**
 * Design System Color Configuration
 * 
 * Este archivo centraliza la configuración de colores del design system.
 * Para cambiar el color primario de toda la aplicación, solo modifica
 * la variable BRAND_PRIMARY_COLOR.
 */

// Configuración principal - cambiar aquí para modificar todo el sistema
export const BRAND_PRIMARY_COLOR = 'purple' as const;

// Colores alternativos disponibles
export const AVAILABLE_BRAND_COLORS = [
  'blue',
  'indigo', 
  'purple',
  'violet',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'rose',
  'pink',
  'orange',
  'amber',
  'yellow',
  'lime',
] as const;

// Mapeo de tokens semánticos para diferentes componentes
export const COLOR_TOKENS = {
  // Botones
  BUTTON_PRIMARY: 'var(--color-button-primary)',
  BUTTON_PRIMARY_HOVER: 'var(--color-button-primary-hover)',
  BUTTON_PRIMARY_ACTIVE: 'var(--color-button-primary-active)',
  BUTTON_PRIMARY_DISABLED: 'var(--color-button-primary-disabled)',
  BUTTON_PRIMARY_TEXT: 'var(--color-button-primary-text)',

  // Enlaces
  LINK_PRIMARY: 'var(--color-link-primary)',
  LINK_PRIMARY_HOVER: 'var(--color-link-primary-hover)',
  LINK_PRIMARY_VISITED: 'var(--color-link-primary-visited)',

  // Estados
  PRIMARY: 'var(--color-primary)',
  PRIMARY_HOVER: 'var(--color-primary-hover)',
  PRIMARY_ACTIVE: 'var(--color-primary-active)',
  PRIMARY_FOCUS: 'var(--color-primary-focus)',
  PRIMARY_DISABLED: 'var(--color-primary-disabled)',
  PRIMARY_FOREGROUND: 'var(--color-primary-foreground)',
  PRIMARY_MUTED: 'var(--color-primary-muted)',
  PRIMARY_MUTED_FOREGROUND: 'var(--color-primary-muted-foreground)',

  // Estados de aplicación
  SUCCESS: 'var(--color-success)',
  WARNING: 'var(--color-warning)',
  ERROR: 'var(--color-error)',
  INFO: 'var(--color-info)',

  // Superficies
  BACKGROUND: 'var(--color-background)',
  SURFACE: 'var(--color-surface)',
  BORDER: 'var(--color-border)',

  // Texto
  TEXT_PRIMARY: 'var(--color-text-primary)',
  TEXT_SECONDARY: 'var(--color-text-secondary)',
} as const;

// Función helper para generar CSS custom properties dinámicamente
export function generateBrandColorCSS(colorName: typeof BRAND_PRIMARY_COLOR) {
  return `
    /* Brand Primary Color - ${colorName.charAt(0).toUpperCase() + colorName.slice(1)} Palette */
    --brand-primary-50: var(--color-${colorName}-50);
    --brand-primary-100: var(--color-${colorName}-100);
    --brand-primary-200: var(--color-${colorName}-200);
    --brand-primary-300: var(--color-${colorName}-300);
    --brand-primary-400: var(--color-${colorName}-400);
    --brand-primary-500: var(--color-${colorName}-500);
    --brand-primary-600: var(--color-${colorName}-600);
    --brand-primary-700: var(--color-${colorName}-700);
    --brand-primary-800: var(--color-${colorName}-800);
    --brand-primary-900: var(--color-${colorName}-900);
    --brand-primary-950: var(--color-${colorName}-950);
  `;
}

// Clases CSS recomendadas para usar en componentes
export const CSS_CLASSES = {
  // Botones primarios
  BUTTON_PRIMARY: 'bg-[var(--color-button-primary)] hover:bg-[var(--color-button-primary-hover)] active:bg-[var(--color-button-primary-active)] disabled:bg-[var(--color-button-primary-disabled)] text-[var(--color-button-primary-text)]',
  
  // Enlaces primarios
  LINK_PRIMARY: 'text-[var(--color-link-primary)] hover:text-[var(--color-link-primary-hover)] visited:text-[var(--color-link-primary-visited)]',
  
  // Fondos primarios
  BG_PRIMARY: 'bg-[var(--color-primary)]',
  BG_PRIMARY_MUTED: 'bg-[var(--color-primary-muted)]',
  
  // Texto primario
  TEXT_PRIMARY_COLOR: 'text-[var(--color-primary)]',
  TEXT_PRIMARY_MUTED: 'text-[var(--color-primary-muted-foreground)]',
  
  // Bordes primarios
  BORDER_PRIMARY: 'border-[var(--color-primary)]',
  
  // Estados de focus y anillos
  RING_PRIMARY: 'ring-[var(--color-primary-focus)]',
  FOCUS_PRIMARY: 'focus:ring-[var(--color-primary-focus)]',
} as const;

// Migraciones recomendadas (mapeo de clases antiguas a nuevas)
export const MIGRATION_MAP = {
  // Reemplazar estas clases antiguas...
  'bg-primary-600': CSS_CLASSES.BG_PRIMARY,
  'hover:bg-primary-700': '', // Se maneja automáticamente con el nuevo token
  'text-primary': CSS_CLASSES.TEXT_PRIMARY_COLOR,
  'border-primary': CSS_CLASSES.BORDER_PRIMARY,
  'ring-primary-300': CSS_CLASSES.RING_PRIMARY,
  
  // Clases específicas por tonos (usar solo cuando sea necesario)
  'bg-primary-50': 'bg-[var(--brand-primary-50)]',
  'bg-primary-100': 'bg-[var(--brand-primary-100)]',
  'bg-primary-200': 'bg-[var(--brand-primary-200)]',
  'bg-primary-300': 'bg-[var(--brand-primary-300)]',
  'bg-primary-400': 'bg-[var(--brand-primary-400)]',
  'bg-primary-500': 'bg-[var(--brand-primary-500)]',
  // ... etc
} as const;