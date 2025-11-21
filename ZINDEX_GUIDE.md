# Guía de Z-Index

Esta guía explica cómo se maneja el z-index en la aplicación para evitar problemas de superposición entre elementos.

## Problema Resuelto

**Antes**: El sidebar tenía `z-20` y el modal `z-100`, pero el sidebar se superponía al modal debido a:
- Conflictos en el contexto de apilamiento
- Z-index mal aplicado en el ModalBase (`z-[zIndex]` en lugar del valor dinámico)
- Botón toggle con `z-30` que creaba interferencias

**Después**: Implementamos una configuración centralizada con jerarquía clara.

## Configuración Centralizada

Se creó `app/config/zIndexConfig.ts` que define todos los niveles de z-index:

```typescript
export const Z_INDEX = {
  // Elementos base (0-10)
  BASE: 0,
  CONTENT: 1,
  MOBILE_OVERLAY: 5,
  SIDEBAR: 10,
  
  // Elementos de interfaz (20-50)
  SIDEBAR_TOGGLE: 20,
  HEADER: 30,
  FOOTER: 40,
  DROPDOWN: 50,
  
  // Elementos flotantes (60-90)
  TOOLTIP: 60,
  
  // Modales y overlays críticos (100-199)
  MODAL_BACKDROP: 100,
  MODAL_CONTENT: 101,
  CONFIRMATION_MODAL: 110,
  LOADING_OVERLAY: 120,
  
  // Elementos de máxima prioridad (200+)
  TOAST: 200,
  CRITICAL_ALERT: 300,
}
```

## Uso

### Importar la configuración
```typescript
import { Z_INDEX, getZIndexClass } from "~/config/zIndexConfig";
```

### Aplicar z-index
```typescript
// En lugar de: className="z-50"
// Usar: className={getZIndexClass(Z_INDEX.DROPDOWN)}
```

## Jerarquía Visual

```
┌─────────────────┐ z-300: CRITICAL_ALERT
│ ┌─────────────┐ │ z-200: TOAST  
│ │ ┌─────────┐ │ │ z-120: LOADING_OVERLAY
│ │ │ ┌─────┐ │ │ │ z-110: CONFIRMATION_MODAL
│ │ │ │ ┌─┐ │ │ │ │ z-101: MODAL_CONTENT
│ │ │ │ │█│ │ │ │ │ z-100: MODAL_BACKDROP
│ │ │ │ └─┘ │ │ │ │ z-50:  DROPDOWN
│ │ │ └─────┘ │ │ │ z-40:  FOOTER
│ │ └─────────┘ │ │ z-30:  HEADER
│ └─────────────┘ │ z-20:  SIDEBAR_TOGGLE
└─────────────────┘ z-10:  SIDEBAR
```

## Componentes Actualizados

- **ModalBase**: Usa `Z_INDEX.MODAL_BACKDROP` por defecto
- **SideBar**: Usa `Z_INDEX.SIDEBAR`
- **layoutPedidos**: Usa configuración centralizada
- **SelectField**: Usa `Z_INDEX.DROPDOWN`
- **Footer**: Usa `Z_INDEX.FOOTER`

## Mejores Prácticas

1. **Siempre usar la configuración centralizada** en lugar de valores hardcodeados
2. **No usar z-index arbitrarios** - agregar nuevos valores al enum si es necesario
3. **Mantener la jerarquía lógica** - elementos más importantes tienen valores más altos
4. **Probar en diferentes pantallas** - especialmente con sidebars y modales abiertos

## Resolución de Problemas

Si un elemento se superpone incorrectamente:

1. Verificar que use `getZIndexClass()` en lugar de clases hardcodeadas
2. Confirmar que el z-index asignado esté en el nivel correcto de la jerarquía
3. Revisar si hay elementos padre con `position: relative` que creen nuevos contextos de apilamiento

## Extensión

Para agregar nuevos niveles de z-index, editar `zIndexConfig.ts` y mantener la numeración lógica según la importancia visual del elemento.