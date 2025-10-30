# Sistema de Colores Profesional - Guía de Uso

## 🎯 Resumen

Tu nuevo sistema de colores está diseñado para ser **profesional**, **mantenible** y **escalable**. Aquí tienes todo lo que necesitas saber para usarlo efectivamente.

## 🔄 Para cambiar el color primario de toda la app

### Opción 1: Cambio rápido en CSS (Recomendado)
En `app/app.css`, cambia la línea 14-15 de:
```css
/* Brand Primary Color - Blue Palette */
--brand-primary-50: var(--color-blue-50);
```
A:
```css
/* Brand Primary Color - Indigo Palette */
--brand-primary-50: var(--color-indigo-50);
```

Y actualiza todas las líneas `--brand-primary-*` de `blue` a tu color preferido (`indigo`, `purple`, `green`, etc.).

### Opción 2: Usando la configuración TypeScript
En `app/config/colorSystem.ts`, cambia:
```ts
export const BRAND_PRIMARY_COLOR = 'blue' as const;
```
A:
```ts
export const BRAND_PRIMARY_COLOR = 'indigo' as const;
```

## 🎨 Tokens de Color Recomendados

### Para Botones
```tsx
// ✅ RECOMENDADO - Usa tokens semánticos
<button className="bg-[var(--color-button-primary)] hover:bg-[var(--color-button-primary-hover)] text-[var(--color-button-primary-text)]">
  Botón Primario
</button>

// ✅ ALTERNATIVA - Usa las variantes del componente Button
<Button variant="primary">Botón Primario</Button>
```

### Para Enlaces
```tsx
// ✅ RECOMENDADO
<Link className="text-[var(--color-link-primary)] hover:text-[var(--color-link-primary-hover)]">
  Enlace primario
</Link>
```

### Para Fondos y Superficies
```tsx
// ✅ Para fondos primarios
<div className="bg-[var(--color-primary)]">Fondo primario</div>

// ✅ Para fondos suaves/muted
<div className="bg-[var(--color-primary-muted)]">Fondo suave</div>

// ✅ Para superficies generales
<div className="bg-[var(--color-surface)]">Superficie</div>
```

### Para Texto
```tsx
// ✅ Texto primario (negro/blanco según tema)
<p className="text-[var(--color-text-primary)]">Texto principal</p>

// ✅ Texto secundario (gris)
<p className="text-[var(--color-text-secondary)]">Texto secundario</p>

// ✅ Texto de color primario
<p className="text-[var(--color-primary)]">Texto de marca</p>
```

### Para Bordes
```tsx
// ✅ Bordes neutrales
<div className="border border-[var(--color-border)]">Con borde</div>

// ✅ Bordes primarios
<div className="border border-[var(--color-primary)]">Borde de marca</div>
```

## 🚫 Qué EVITAR

```tsx
// ❌ NO hagas esto - clases específicas de tono
<button className="bg-blue-600 hover:bg-blue-700">Botón</button>

// ❌ NO hagas esto - referencias directas a colores
<div className="bg-primary-600">Contenido</div>

// ❌ NO hagas esto - mezclar sistemas
<button className="bg-[var(--color-primary)] hover:bg-blue-700">Botón</button>
```

## 🔄 Migración desde el Sistema Anterior

### Cambios automáticos recomendados:

| Clase Antigua | Nueva Clase Recomendada |
|---------------|-------------------------|
| `bg-primary-600` | `bg-[var(--color-primary)]` |
| `hover:bg-primary-700` | `hover:bg-[var(--color-primary-hover)]` |
| `text-primary` | `text-[var(--color-primary)]` |
| `border-primary` | `border-[var(--color-primary)]` |
| `bg-primary-100` | `bg-[var(--color-primary-muted)]` |
| `ring-primary-300` | `ring-[var(--color-primary-focus)]` |

### Para casos específicos donde necesites un tono exacto:
```tsx
// ✅ Solo cuando necesites un tono específico de la paleta
<div className="bg-[var(--brand-primary-200)]">Fondo muy claro</div>
<div className="bg-[var(--brand-primary-800)]">Fondo muy oscuro</div>
```

## 🎭 Estados y Variantes

### Estados Interactivos
```tsx
// ✅ Estados de botón completos
<button className="
  bg-[var(--color-button-primary)]
  hover:bg-[var(--color-button-primary-hover)]
  active:bg-[var(--color-button-primary-active)]
  disabled:bg-[var(--color-button-primary-disabled)]
  focus:ring-[var(--color-primary-focus)]
">
  Botón con todos los estados
</button>
```

### Estados de Aplicación
```tsx
// ✅ Para notificaciones de éxito
<div className="bg-[var(--color-success)] text-white">Éxito</div>

// ✅ Para advertencias
<div className="bg-[var(--color-warning)] text-zinc-800">Advertencia</div>

// ✅ Para errores
<div className="bg-[var(--color-error)] text-white">Error</div>

// ✅ Para información
<div className="bg-[var(--color-info)] text-white">Información</div>
```

## 🌙 Compatibilidad con Dark Mode

El sistema automáticamente ajusta los colores para tema oscuro. No necesitas clases `dark:` adicionales cuando uses los tokens:

```tsx
// ✅ Se adapta automáticamente al tema
<div className="bg-[var(--color-primary)] text-[var(--color-primary-foreground)]">
  Funciona en claro y oscuro
</div>

// ❌ No necesitas esto con el nuevo sistema
<div className="bg-blue-600 dark:bg-blue-500 text-white dark:text-gray-100">
  Demasiado verbose
</div>
```

## 🧪 Testing del Sistema

Para probar que el sistema funciona correctamente:

1. **Cambia el color primario** en `colorSystem.ts` de `'blue'` a `'purple'`
2. **Recarga la aplicación** - todos los elementos primarios deberían cambiar a purple
3. **Alterna entre modo claro y oscuro** - los colores deberían ajustarse automáticamente
4. **Revierte el cambio** para confirmar que vuelve al estado original

## 📚 Beneficios del Nuevo Sistema

1. **Cambio global**: Modifica un archivo y cambia toda la app
2. **Consistencia**: Todos los componentes usan los mismos tokens
3. **Accesibilidad**: Los contrastes se mantienen en ambos temas
4. **Mantenibilidad**: Menos código duplicado
5. **Escalabilidad**: Fácil agregar nuevos tokens cuando sea necesario
6. **Profesionalismo**: Sigue las mejores prácticas de design systems

## 🚀 Próximos Pasos

1. **Migra gradualmente** los componentes existentes al nuevo sistema
2. **Usa siempre los tokens semánticos** en lugar de clases específicas
3. **Documenta** cualquier caso de uso especial que encuentres
4. **Considera crear** componentes wrapper para patrones comunes

¿Necesitas ayuda con algún componente específico? ¡Pregúntame y te ayudo a migrarlo!