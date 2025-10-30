import type { Route } from "../+types/home";
import {
  Users,
  Info,
  Lightbulb,
  ExternalLink,
  BookOpen,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import {
  TutorialLayout,
  TutorialSection,
  Step,
  Alert,
} from "~/components/TutorialLayout";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Tutorial: Gestión de Clientes" },
    {
      name: "description",
      content:
        "Aprende a gestionar clientes: agregar, modificar, eliminar y mejores prácticas",
    },
  ];
}

export default function AyudaClientes() {
  const sections = [
    { id: "introduccion", title: "Introducción" },
    { id: "acceso", title: "Acceder al Módulo" },
    { id: "visualizar", title: "Visualizar Lista de Clientes" },
    { id: "agregar", title: "Agregar Nuevo Cliente" },
    { id: "modificar", title: "Modificar Cliente" },
    { id: "eliminar", title: "Eliminar Cliente" },
    { id: "buscar", title: "Filtrar y Buscar" },
    { id: "validaciones", title: "Validaciones y Errores" },
    { id: "tips", title: "Tips y Mejores Prácticas" },
  ];

  return (
    <TutorialLayout
      title="Tutorial: Gestión de Clientes"
      subtitle="Aprende a gestionar clientes: agregar, modificar, eliminar y mejores prácticas"
      icon={<Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
      sections={sections}
      completion={{
        message: "¡Has completado el tutorial de gestión de clientes! 🎉",
        description:
          "El sistema de gestión de clientes está diseñado para ser intuitivo y seguro. Las validaciones automáticas te protegen de errores comunes, mientras que la integración con sistemas oficiales garantiza la calidad de los datos de ubicación.",
        primaryAction: {
          label: "Crear tu primer cliente",
          to: "/clientes/nuevo",
          icon: <Users className="w-4 h-4" />,
        },
      }}
    >
      <TutorialSection
        title="Introducción"
        id="introduccion"
        icon={<Info className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
      >
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          El módulo de gestión de clientes te permite administrar toda la
          información de tus clientes de manera centralizada. Incluye
          funcionalidades para crear, modificar, eliminar y buscar clientes, con
          validaciones automáticas y un sistema de direcciones
          georreferenciadas.
        </p>

        <Alert type="tip">
          <strong>Tip:</strong> Este tutorial te llevará aproximadamente 15
          minutos y cubrirá todos los aspectos esenciales para gestionar
          clientes eficientemente.
        </Alert>
      </TutorialSection>

      <TutorialSection
        title="Acceder al Módulo de Clientes"
        id="acceso"
        icon={
          <ExternalLink className="w-6 h-6 text-green-600 dark:text-green-400" />
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4 border border-gray-200/50 dark:border-gray-700/50">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              🎯 Desde el menú principal
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Navega a la sección "Clientes" en el menú principal de la
              aplicación.
            </p>
          </div>
          <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4 border border-gray-200/50 dark:border-gray-700/50">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              🔗 URL directa
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">
                /clientes
              </code>{" "}
              te llevará directamente a la lista de clientes.
            </p>
          </div>
        </div>
      </TutorialSection>

      <TutorialSection
        title="Visualizar Lista de Clientes"
        id="visualizar"
        icon={
          <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        }
      >
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Vista Principal
          </h4>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            La pantalla principal muestra una tabla con los siguientes datos:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
            <li>
              <strong>Razón Social:</strong> Nombre de la empresa o persona
            </li>
            <li>
              <strong>Nombre de Contacto:</strong> Persona de contacto principal
            </li>
            <li>
              <strong>Teléfono:</strong> Número de contacto
            </li>
            <li>
              <strong>Email:</strong> Correo electrónico
            </li>
            <li>
              <strong>CUIT/CUIL:</strong> Número de identificación fiscal
              (formateado automáticamente como XX-XXXXXXXX-X)
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Alert type="success">
            <strong>Con clientes:</strong> Muestra la tabla con todos los
            datos y opciones de filtrado
          </Alert>
          <Alert type="info">
            <strong>Sin clientes:</strong> Presenta una imagen explicativa y
            botón directo para agregar el primer cliente
          </Alert>
        </div>

        <div className="mt-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Interacciones Disponibles
          </h4>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <strong>Hacer clic en una fila:</strong> Abre el formulario de
                edición del cliente seleccionado
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <strong>Botón "Nuevo Cliente":</strong> Abre el formulario para
                crear un cliente (flotante en inferior derecha)
              </div>
            </div>
          </div>
        </div>
      </TutorialSection>

      <TutorialSection
        title="Agregar Nuevo Cliente"
        id="agregar"
        icon={<Users className="w-6 h-6 text-green-600 dark:text-green-400" />}
      >
        <Step number={1} title="Acceder al Formulario de Creación">
          <ul className="space-y-2">
            <li>
              • <strong>Desde la lista principal:</strong> Botón "Nuevo Cliente"
              (flotante inferior derecha)
            </li>
            <li>
              • <strong>Si no hay clientes:</strong> Botón "Agregar Cliente" en
              la pantalla vacía
            </li>
            <li>
              • <strong>URL directa:</strong>{" "}
              <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">
                /clientes/nuevo
              </code>
            </li>
          </ul>
        </Step>

        <Step number={2} title="Completar Información Básica" variant="warning">
          <div className="space-y-4">
            <Alert type="warning">
              <strong>Campos Obligatorios:</strong>
              <ul className="mt-2 space-y-1">
                <li>
                  • <strong>Razón Social:</strong> Nombre de la empresa o
                  persona
                </li>
                <li>
                  • <strong>CUIT/CUIL:</strong> Número de identificación fiscal
                  (validado automáticamente)
                </li>
                <li>
                  • <strong>Dirección Completa:</strong> Provincia, localidad y
                  dirección específica
                </li>
              </ul>
            </Alert>

            <div>
              <strong>Campos Opcionales:</strong>
              <ul className="mt-2 space-y-1 text-gray-600 dark:text-gray-300">
                <li>
                  • <strong>Nombre de Contacto:</strong> Persona responsable o
                  contacto principal
                </li>
                <li>
                  • <strong>Teléfono:</strong> Número de contacto (formato
                  automático)
                </li>
                <li>
                  • <strong>Email:</strong> Correo electrónico (validación de
                  formato)
                </li>
              </ul>
            </div>
          </div>
        </Step>

        <Step
          number={3}
          title="Configurar Dirección Georreferenciada"
          variant="info"
        >
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              El sistema utiliza datos oficiales de Argentina para garantizar
              direcciones precisas:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h5 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                  1. Provincia
                </h5>
                <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                  <li>• Lista de provincias argentinas</li>
                  <li>• Carga automática desde API oficial</li>
                </ul>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <h5 className="font-semibold text-green-900 dark:text-green-200 mb-2">
                  2. Localidad
                </h5>
                <ul className="text-sm text-green-800 dark:text-green-300 space-y-1">
                  <li>• Se habilita tras seleccionar provincia</li>
                  <li>• Búsqueda en tiempo real</li>
                </ul>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                <h5 className="font-semibold text-purple-900 dark:text-purple-200 mb-2">
                  3. Dirección
                </h5>
                <ul className="text-sm text-purple-800 dark:text-purple-300 space-y-1">
                  <li>• Campo libre (calle, número, piso)</li>
                  <li>• Se combina automáticamente</li>
                </ul>
              </div>
            </div>
          </div>
        </Step>

        <Step number={4} title="Completar Otros Datos">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-semibold text-gray-900 dark:text-white mb-3">
                Información Comercial
              </h5>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>
                  • <strong>Condición frente al IVA:</strong> Responsable
                  Inscripto, Monotributista, Exento, Consumidor Final
                </li>
                <li>
                  • <strong>Vendedor Asignado:</strong> Selecciona de la lista
                  de vendedores registrados
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 dark:text-white mb-3">
                Control y Estado
              </h5>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>
                  • <strong>Activo:</strong> Define si el cliente está
                  habilitado para nuevos pedidos
                </li>
                <li>
                  • <strong>Observaciones:</strong> Campo libre para notas
                  adicionales
                </li>
              </ul>
            </div>
          </div>
        </Step>

        <Step number={5} title="Guardar y Finalizar" variant="success">
          <ol className="space-y-2">
            <li>1. Completa todos los campos obligatorios (marcados con ⚠️)</li>
            <li>
              2. Verifica que el CUIT/CUIL sea válido (validación automática)
            </li>
            <li>
              3. El sistema verificará automáticamente que el CUIT no esté
              duplicado
            </li>
            <li>4. Asegúrate de que la dirección esté completa</li>
            <li>
              5. Haz clic en <strong>"Crear Cliente"</strong>
            </li>
            <li>
              6. El sistema confirmará la creación y te redirigirá a la lista
            </li>
          </ol>

          <Alert type="info">
            <strong>Validaciones Automáticas:</strong> Durante el guardado se
            verifican formato de CUIT, duplicados, dirección completa y formato
            de email (si se proporciona).
          </Alert>
        </Step>
      </TutorialSection>

      <TutorialSection
        title="Modificar Cliente Existente"
        id="modificar"
        icon={
          <Users className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
        }
      >
        <div className="space-y-6">
          <Alert type="info">
            <strong>Acceso:</strong> Haz clic en cualquier fila de la tabla de
            clientes o usa la URL directa
            <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm ml-1">
              /clientes/{"{id}"}
            </code>
          </Alert>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Comportamiento Inteligente del Formulario
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h5 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                  📋 Precargado
                </h5>
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  Todos los campos se cargan con la información actual del
                  cliente.
                </p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <h5 className="font-semibold text-green-900 dark:text-green-200 mb-2">
                  🔍 Detección de Cambios
                </h5>
                <p className="text-sm text-green-800 dark:text-green-300">
                  Solo se actualizan los campos que realmente modificaste.
                </p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                <h5 className="font-semibold text-purple-900 dark:text-purple-200 mb-2">
                  ✅ Validación
                </h5>
                <p className="text-sm text-purple-800 dark:text-purple-300">
                  Las mismas reglas de validación que para clientes nuevos,
                  incluyendo verificación de CUIT duplicado.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Casos Especiales
            </h4>
            <div className="space-y-3">
              <Alert type="warning">
                <strong>Sin cambios:</strong> Si no modificas nada, el sistema
                te informa que no hay cambios para actualizar.
              </Alert>
              <Alert type="success">
                <strong>Solo dirección:</strong> Los cambios de dirección se
                detectan correctamente, incluso si son los únicos cambios.
              </Alert>
              <Alert type="info">
                <strong>Campos obligatorios:</strong> No puedes dejar vacíos los
                campos requeridos durante la edición.
              </Alert>
            </div>
          </div>
        </div>
      </TutorialSection>

      <TutorialSection
        title="Eliminar Cliente"
        id="eliminar"
        icon={
          <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
        }
      >
        <Alert type="warning">
          <strong>Importante:</strong> La eliminación solo está disponible en el
          formulario de edición de un cliente existente.
        </Alert>

        <div className="space-y-6 mt-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              🚨 Zona de Peligro
            </h4>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              En la parte inferior del formulario de edición encontrarás la
              "Zona de Peligro" con:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li>
                <strong>Advertencia clara:</strong> Acción irreversible
              </li>
              <li>
                <strong>Botón rojo:</strong> "Eliminar Cliente"
              </li>
              <li>
                <strong>Confirmación:</strong> Dialog de confirmación antes de
                eliminar
              </li>
            </ul>
          </div>

          <Alert type="warning">
            <strong>Restricción de Seguridad 🛡️:</strong>
            <br />
            <strong>
              No se puede eliminar un cliente que tenga pedidos asociados
            </strong>
            <br />
            <br />
            Si intentas eliminar un cliente con pedidos:
            <ul className="mt-2 space-y-1">
              <li>1. El sistema verifica automáticamente</li>
              <li>2. Te muestra un mensaje indicando cuántos pedidos tiene</li>
              <li>3. Te solicita eliminar primero los pedidos relacionados</li>
            </ul>
          </Alert>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Proceso de Eliminación
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li>Haz clic en "Eliminar Cliente" en la zona de peligro</li>
              <li>Lee cuidadosamente el mensaje de confirmación</li>
              <li>Confirma la acción haciendo clic en "Eliminar"</li>
              <li>El sistema te redirige a la lista de clientes</li>
            </ol>
          </div>
        </div>
      </TutorialSection>

      <TutorialSection
        title="Filtrar y Buscar Clientes"
        id="buscar"
        icon={
          <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              🔍 Filtro por Razón Social
            </h4>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li>
                • <strong>Ubicación:</strong> Campo de búsqueda en la parte
                superior de la tabla
              </li>
              <li>
                • <strong>Funcionamiento:</strong> Búsqueda en tiempo real
                mientras escribes
              </li>
              <li>
                • <strong>Criterio:</strong> Busca coincidencias en el nombre de
                la razón social
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              📊 Ordenamiento
            </h4>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li>
                • <strong>Por defecto:</strong> Los clientes se muestran
                ordenados por fecha de creación
              </li>
              <li>
                • <strong>Interactivo:</strong> Haz clic en los encabezados de
                columna para ordenar
              </li>
            </ul>
          </div>
        </div>
      </TutorialSection>

      <TutorialSection
        title="Validaciones y Errores"
        id="validaciones"
        icon={
          <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
        }
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                CUIT/CUIL
              </h4>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>
                  • <strong>Formato automático:</strong> Se formatea como
                  XX-XXXXXXXX-X mientras escribes
                </li>
                <li>
                  • <strong>Algoritmo oficial:</strong> Verifica el dígito
                  verificador argentino
                </li>
                <li>
                  • <strong>Validación de duplicados:</strong> El sistema
                  verifica automáticamente que no exista otro cliente con el
                  mismo CUIT
                </li>
              </ul>

              <Alert type="warning">
                <strong>Mensajes de Error CUIT:</strong>
                <br />
                • "El CUIT/CUIL ingresado no es válido" - Formato o dígito
                verificador incorrecto
                <br />• "Ya existe un cliente registrado con este CUIT/CUIL" -
                Se detectó un duplicado
              </Alert>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mt-3">
                <h5 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                  Comportamiento de Duplicados:
                </h5>
                <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                  <li>
                    • <strong>Cliente nuevo:</strong> Verifica que el CUIT no
                    esté registrado
                  </li>
                  <li>
                    • <strong>Editando cliente:</strong> Permite mantener el
                    mismo CUIT al editar otros datos
                  </li>
                  <li>
                    • <strong>Cambio de CUIT:</strong> Verifica que el nuevo
                    CUIT no esté duplicado
                  </li>
                  <li>
                    • <strong>Verificación automática:</strong> Se ejecuta antes
                    de guardar
                  </li>
                </ul>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                Email y Teléfono
              </h4>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>
                  • <strong>Email:</strong> Validación de formato estándar (no
                  obligatorio)
                </li>
                <li>
                  • <strong>Teléfono:</strong> Formato inteligente para números
                  argentinos (no obligatorio)
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Direcciones
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Alert type="warning">
                <strong>Provincia obligatoria:</strong> Debe seleccionarse de la
                lista oficial
              </Alert>
              <Alert type="warning">
                <strong>Localidad obligatoria:</strong> Debe corresponder a la
                provincia seleccionada
              </Alert>
              <Alert type="warning">
                <strong>Dirección específica:</strong> Campo de texto libre
                obligatorio
              </Alert>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Mensajes del Sistema
            </h4>
            <div className="space-y-3">
              <Alert type="success">
                <strong>Éxito:</strong> "Cliente creado/actualizado
                exitosamente"
              </Alert>
              <Alert type="warning">
                <strong>Errores de validación:</strong> Específicos por cada
                campo problemático
              </Alert>
              <Alert type="info">
                <strong>Errores de servidor:</strong> Mensajes descriptivos del
                problema encontrado
              </Alert>
            </div>
          </div>
        </div>
      </TutorialSection>

      <TutorialSection
        title="Tips y Mejores Prácticas"
        id="tips"
        icon={
          <Lightbulb className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
        }
      >
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
              <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Datos de Calidad
              </h4>
              <ul className="space-y-2 text-blue-800 dark:text-blue-300">
                <li>
                  • <strong>CUIT/CUIL completo:</strong> Siempre ingresa los 11
                  dígitos
                </li>
                <li>
                  • <strong>Razón social precisa:</strong> Usa el nombre oficial
                  de la empresa
                </li>
                <li>
                  • <strong>Email actualizado:</strong> Facilita la comunicación
                </li>
                <li>
                  • <strong>Teléfono con característica:</strong> Incluye código
                  de área
                </li>
              </ul>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
              <h4 className="text-lg font-semibold text-green-900 dark:text-green-200 mb-4 flex items-center gap-2">
                <ExternalLink className="w-5 h-5" />
                Gestión de Direcciones
              </h4>
              <ul className="space-y-2 text-green-800 dark:text-green-300">
                <li>
                  • <strong>Selecciona provincia primero:</strong> Las
                  localidades se cargan después
                </li>
                <li>
                  • <strong>Usa la búsqueda:</strong> Escribe para filtrar
                  localidades
                </li>
                <li>
                  • <strong>Dirección completa:</strong> Incluye calle, número,
                  piso, etc.
                </li>
                <li>
                  • <strong>Verifica antes de guardar:</strong> Difícil de
                  modificar después
                </li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
              <h4 className="text-lg font-semibold text-purple-900 dark:text-purple-200 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Organización
              </h4>
              <ul className="space-y-2 text-purple-800 dark:text-purple-300">
                <li>
                  • <strong>Asigna vendedores:</strong> Facilita el seguimiento
                  comercial
                </li>
                <li>
                  • <strong>Usa observaciones:</strong> Para información
                  relevante adicional
                </li>
                <li>
                  • <strong>Mantén estado actualizado:</strong> Marca inactivos
                  los que no operen
                </li>
              </ul>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 border border-yellow-200 dark:border-yellow-800">
              <h4 className="text-lg font-semibold text-yellow-900 dark:text-yellow-200 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Eliminación Segura
              </h4>
              <ul className="space-y-2 text-yellow-800 dark:text-yellow-300">
                <li>
                  • <strong>Verifica pedidos primero:</strong> Aunque el sistema
                  te protege
                </li>
                <li>
                  • <strong>Respalda información:</strong> Antes de eliminar,
                  guarda datos relevantes
                </li>
                <li>
                  • <strong>Considera inactivar:</strong> En lugar de eliminar
                  completamente
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              Errores Frecuentes y Cómo Resolverlos
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-semibold text-gray-900 dark:text-white mb-2">
                  "No se detectan cambios"
                </h5>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <li>• Verifica que hayas modificado al menos un campo</li>
                  <li>
                    • Los cambios de dirección a veces necesitan confirmación
                    adicional
                  </li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-900 dark:text-white mb-2">
                  "CUIT/CUIL inválido"
                </h5>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <li>• Verifica que tenga exactamente 11 dígitos</li>
                  <li>• Usa una calculadora de CUIT online para verificar</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-900 dark:text-white mb-2">
                  "Ya existe un cliente registrado con este CUIT/CUIL"
                </h5>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <li>
                    • El sistema detectó un cliente existente con el mismo
                    número
                  </li>
                  <li>
                    • Busca el cliente existente usando el filtro de la lista
                  </li>
                  <li>
                    • Si es correcto, modifica el cliente existente en lugar de
                    crear uno nuevo
                  </li>
                  <li>
                    • Si el CUIT está mal en el cliente existente, corrígelo
                    desde su formulario
                  </li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-900 dark:text-white mb-2">
                  "No se puede eliminar cliente"
                </h5>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <li>• Busca los pedidos asociados en el módulo de pedidos</li>
                  <li>
                    • Elimina o reasigna los pedidos antes de eliminar el
                    cliente
                  </li>
                </ul>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-4">
              <div>
                <h5 className="font-semibold text-gray-900 dark:text-white mb-2">
                  "Error al cargar localidades"
                </h5>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <li>• Verifica tu conexión a internet</li>
                  <li>• Intenta seleccionar la provincia nuevamente</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </TutorialSection>
    </TutorialLayout>
  );
}
