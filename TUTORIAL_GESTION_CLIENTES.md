# Tutorial: Gestión de Clientes

## Índice
1. [Introducción](#introducción)
2. [Acceder al Módulo de Clientes](#acceder-al-módulo-de-clientes)
3. [Visualizar Lista de Clientes](#visualizar-lista-de-clientes)
4. [Agregar Nuevo Cliente](#agregar-nuevo-cliente)
5. [Modificar Cliente Existente](#modificar-cliente-existente)
6. [Eliminar Cliente](#eliminar-cliente)
7. [Filtrar y Buscar Clientes](#filtrar-y-buscar-clientes)
8. [Validaciones y Errores](#validaciones-y-errores)
9. [Tips y Mejores Prácticas](#tips-y-mejores-prácticas)

---

## Introducción

El módulo de gestión de clientes te permite administrar toda la información de tus clientes de manera centralizada. Incluye funcionalidades para crear, modificar, eliminar y buscar clientes, con validaciones automáticas y un sistema de direcciones georreferenciadas.

## Acceder al Módulo de Clientes

1. **Desde el menú principal**: Navega a la sección "Clientes"
2. **URL directa**: `/clientes` te llevará a la lista principal de clientes

## Visualizar Lista de Clientes

### Vista Principal
La pantalla principal muestra una tabla con los siguientes datos:
- **Razón Social**: Nombre de la empresa o persona
- **Nombre de Contacto**: Persona de contacto principal
- **Teléfono**: Número de contacto
- **Email**: Correo electrónico
- **CUIT/CUIL**: Número de identificación fiscal (formateado automáticamente)

### Estados de la Lista
- **Con clientes**: Muestra la tabla con todos los datos y opciones de filtrado
- **Sin clientes**: Presenta una imagen explicativa y botón directo para agregar el primer cliente

### Interacciones
- **Hacer clic en una fila**: Abre el formulario de edición del cliente seleccionado
- **Botón "Nuevo Cliente"**: Abre el formulario para crear un cliente

## Agregar Nuevo Cliente

### Acceso
1. **Desde la lista principal**: Botón "Nuevo Cliente" (flotante inferior derecha)
2. **Si no hay clientes**: Botón "Agregar Cliente" en la pantalla vacía
3. **URL directa**: `/clientes/nuevo`

### Información del Cliente

#### Campos Obligatorios
- **Razón Social** ⚠️: Nombre de la empresa o persona
- **CUIT/CUIL** ⚠️: Número de identificación fiscal (validado automáticamente)
- **Dirección Completa** ⚠️: Provincia, localidad y dirección específica

#### Campos Opcionales
- **Nombre de Contacto**: Persona responsable o contacto principal
- **Teléfono**: Número de contacto (formato automático)
- **Email**: Correo electrónico (validación de formato)

### Información de Dirección

#### Sistema de Georreferenciación
El sistema utiliza datos oficiales de Argentina para garantizar direcciones precisas:

1. **Provincia**: 
   - Selecciona de lista desplegable con todas las provincias argentinas
   - Carga automática desde API gubernamental

2. **Localidad**:
   - Se habilita después de seleccionar provincia
   - Lista filtrada según la provincia elegida
   - Búsqueda en tiempo real mientras escribes

3. **Dirección**:
   - Campo libre para calle, número, piso, etc.
   - Se combina automáticamente con provincia y localidad

#### Validaciones de Dirección
- Provincia y localidad deben ser seleccionadas de las listas oficiales
- No se pueden ingresar ubicaciones que no existan en el sistema oficial

### Otros Datos

#### Información Comercial
- **Condición frente al IVA**: 
  - Responsable Inscripto
  - Monotributista
  - Exento
  - Consumidor Final

- **Vendedor Asignado**: Selecciona de la lista de vendedores registrados

#### Control y Estado
- **Activo**: Define si el cliente está habilitado para nuevos pedidos
- **Observaciones**: Campo libre para notas adicionales

### Proceso de Creación
1. Completa todos los campos obligatorios (marcados con ⚠️)
2. Verifica que el CUIT/CUIL sea válido (validación automática)
3. El sistema verificará automáticamente que el CUIT no esté duplicado
4. Asegúrate de que la dirección esté completa
5. Haz clic en "Crear Cliente"
6. El sistema confirmará la creación y te redirigirá a la lista

#### Validaciones Automáticas Durante la Creación
- **Formato de CUIT**: Verifica que el dígito verificador sea correcto
- **CUIT único**: Confirma que no exista otro cliente con el mismo número
- **Dirección completa**: Valida que provincia, localidad y dirección estén presentes
- **Formato de email**: Si se proporciona, verifica que sea válido

## Modificar Cliente Existente

### Acceso
1. **Desde la lista**: Haz clic en cualquier fila de la tabla
2. **URL directa**: `/clientes/{id}` donde {id} es el identificador del cliente

### Comportamiento del Formulario
- **Precargado**: Todos los campos se cargan con la información actual
- **Detección de cambios**: Solo se actualizan los campos modificados
- **Validación**: Las mismas reglas que para clientes nuevos
- **CUIT en edición**: Puedes mantener el mismo CUIT o cambiarlo por uno no duplicado

### Proceso de Modificación
1. Modifica los campos que necesites cambiar
2. El sistema detecta automáticamente qué campos cambiaron
3. Si cambias el CUIT, se verifica que no esté duplicado
4. Haz clic en "Actualizar Cliente"
5. Recibe confirmación y redirección a la lista

### Casos Especiales
- **Sin cambios**: Si no modificas nada, el sistema te informa que no hay cambios
- **Solo dirección**: Los cambios de dirección se detectan correctamente
- **Campos obligatorios**: No puedes dejar vacíos los campos requeridos

## Eliminar Cliente

### Acceso
Solo disponible en el formulario de edición de un cliente existente.

### Zona de Peligro
En la parte inferior del formulario de edición encontrarás la "Zona de Peligro" con:
- ⚠️ **Advertencia clara**: Acción irreversible
- **Botón rojo**: "Eliminar Cliente"
- **Confirmación**: Dialog de confirmación antes de eliminar

### Restricciones
**No se puede eliminar un cliente que tenga pedidos asociados**

Si intentas eliminar un cliente con pedidos:
1. El sistema verifica automáticamente
2. Te muestra un mensaje indicando cuántos pedidos tiene
3. Te solicita eliminar primero los pedidos relacionados

### Proceso de Eliminación
1. Haz clic en "Eliminar Cliente" en la zona de peligro
2. Lee cuidadosamente el mensaje de confirmación
3. Confirma la acción haciendo clic en "Eliminar"
4. El sistema te redirige a la lista de clientes

## Filtrar y Buscar Clientes

### Filtro por Razón Social
- **Ubicación**: Campo de búsqueda en la parte superior de la tabla
- **Funcionamiento**: Búsqueda en tiempo real mientras escribes
- **Criterio**: Busca coincidencias en el nombre de la razón social

### Ordenamiento
- **Por defecto**: Los clientes se muestran ordenados por fecha de creación
- **Interactivo**: Haz clic en los encabezados de columna para ordenar

## Validaciones y Errores

### CUIT/CUIL
- **Formato automático**: Se formatea como XX-XXXXXXXX-X mientras escribes
- **Algoritmo de validación**: Verifica el dígito verificador oficial
- **Validación de duplicados**: El sistema verifica que no exista otro cliente con el mismo CUIT/CUIL
- **Mensajes de error**: 
  - "El CUIT/CUIL ingresado no es válido" (formato incorrecto)
  - "Ya existe un cliente registrado con este CUIT/CUIL" (duplicado detectado)

#### Comportamiento de Duplicados
- **Cliente nuevo**: Verifica que el CUIT no esté registrado en el sistema
- **Cliente existente**: Permite mantener el mismo CUIT al editar otros datos
- **Cambio de CUIT**: Al modificar el CUIT de un cliente, verifica que el nuevo no esté duplicado
- **Verificación automática**: Se ejecuta antes de guardar, sin necesidad de acción manual

### Email
- **Validación de formato**: Verifica estructura válida de email
- **No obligatorio**: Puedes dejarlo vacío si no tienes email

### Teléfono
- **Formato inteligente**: Detecta y formatea números argentinos
- **No obligatorio**: Campo opcional

### Direcciones
- **Provincia obligatoria**: Debe seleccionarse de la lista
- **Localidad obligatoria**: Debe corresponder a la provincia seleccionada
- **Dirección específica**: Campo de texto libre obligatorio

### Mensajes del Sistema
- **Éxito**: "Cliente creado/actualizado exitosamente"
- **Errores de validación**: Específicos por campo
- **Errores de servidor**: Mensajes descriptivos del problema

## Tips y Mejores Prácticas

### Datos de Calidad
1. **CUIT/CUIL completo**: Siempre ingresa los 11 dígitos
2. **Razón social precisa**: Usa el nombre oficial de la empresa
3. **Email actualizado**: Facilita la comunicación
4. **Teléfono con característica**: Incluye código de área

### Gestión de Direcciones
1. **Selecciona provincia primero**: Las localidades se cargan después
2. **Usa la búsqueda de localidades**: Escribe para filtrar opciones
3. **Dirección específica completa**: Incluye calle, número, piso, etc.
4. **Verifica antes de guardar**: Las direcciones no se pueden modificar fácilmente

### Organización
1. **Asigna vendedores**: Facilita el seguimiento comercial
2. **Usa observaciones**: Para información relevante adicional
3. **Mantén estado actualizado**: Marca como inactivos los clientes que no operen

### Eliminación Segura
1. **Verifica pedidos primero**: El sistema te protege pero es buena práctica verificar
2. **Respalda información importante**: Antes de eliminar, guarda datos relevantes
3. **Considera inactivar**: En lugar de eliminar, considera marcar como inactivo

### Eficiencia
1. **Usa filtros**: Para encontrar clientes rápidamente en listas grandes
2. **Aprovecha la búsqueda**: Escribe parte de la razón social para filtrar
3. **Mantén datos actualizados**: Facilita la gestión de pedidos posteriores

### Troubleshooting Común

#### "No se detectan cambios"
- Verifica que hayas modificado al menos un campo
- Los cambios de dirección a veces necesitan confirmación adicional

#### "CUIT/CUIL inválido"
- Verifica que tenga 11 dígitos
- Usa una calculadora de CUIT online para verificar el dígito verificador

#### "Ya existe un cliente registrado con este CUIT/CUIL"
- El sistema detectó un cliente existente con el mismo número
- Verifica si no estás duplicando información
- Busca el cliente existente en la lista usando el filtro
- Si es correcto, modifica el cliente existente en lugar de crear uno nuevo
- Si el CUIT está mal en el cliente existente, corrígelo desde su formulario de edición

#### "No se puede eliminar cliente"
- Busca los pedidos asociados en el módulo de pedidos
- Elimina o reasigna los pedidos antes de eliminar el cliente

#### "Error al cargar localidades"
- Verifica tu conexión a internet
- Intenta seleccionar la provincia nuevamente
- Contacta al administrador si persiste el problema

---

## Conclusión

El sistema de gestión de clientes está diseñado para ser intuitivo y seguro. Las validaciones automáticas te protegen de errores comunes, mientras que la integración con sistemas oficiales garantiza la calidad de los datos de ubicación.

Para consultas adicionales o problemas técnicos, contacta al equipo de soporte del sistema.