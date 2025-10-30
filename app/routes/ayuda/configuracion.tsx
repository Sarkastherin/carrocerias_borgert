import type { Route } from "../+types/home";
import { Settings, Info, Lightbulb, PaintBucket, Truck, RectangleVertical, Users, Drill, Plus, Edit, Trash2, Search, Grid, AlertTriangle, CheckCircle } from "lucide-react";
import { TutorialLayout, TutorialSection, Step, Alert } from "~/components/TutorialLayout";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Tutorial: Configuración del Sistema" },
    { name: "description", content: "Aprende a personalizar y configurar el sistema según tus necesidades" },
  ];
}

export default function ConfiguracionTutorial() {
  const sections = [
    { id: "introduccion", title: "Introducción" },
    { id: "acceso", title: "Acceder a Configuraciones" },
    { id: "interfaz", title: "Entender la Interfaz" },
    { id: "gestion-elementos", title: "Gestión de Elementos" },
    { id: "operaciones", title: "Operaciones Comunes" },
    { id: "tips", title: "Tips y Mejores Prácticas" }
  ];

  return (
    <TutorialLayout
      title="Tutorial: Parámetros Generales"
      subtitle="Configuración y gestión de elementos del sistema"
      icon={<Settings className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
      sections={sections}
      completion={{
        message: "¡Has completado el tutorial de configuraciones! 🎉",
        description: "Ahora tienes el conocimiento necesario para gestionar todas las configuraciones del sistema. Estas configuraciones son la base que permite que todos los demás módulos funcionen correctamente y se adapten a las necesidades específicas de tu negocio.",
        primaryAction: {
          label: "Ir a Configuraciones",
          to: "/settings/generales",
          icon: <Settings className="w-4 h-4" />
        }
      }}
    >
            <TutorialSection 
              title="Introducción" 
              id="introduccion"
              icon={<Info className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
            >
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Los <strong>Parámetros Generales</strong> son la base fundamental del sistema de gestión de carrocerías. 
                Aquí configuras todos los elementos que se utilizarán posteriormente en la creación de pedidos y 
                gestión de clientes.
              </p>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-6">
                <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-4">🎯 ¿Qué puedes configurar?</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ul className="space-y-2 text-blue-800 dark:text-blue-300">
                    <li className="flex items-center gap-2">
                      <PaintBucket className="w-4 h-4" />
                      <span><strong>Colores:</strong> Paleta disponible para carrocerías</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      <span><strong>Carrozados:</strong> Tipos de carrocería</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <RectangleVertical className="w-4 h-4" />
                      <span><strong>Puertas:</strong> Tipos de puertas traseras</span>
                    </li>
                  </ul>
                  <ul className="space-y-2 text-blue-800 dark:text-blue-300">
                    <li className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span><strong>Vendedores:</strong> Equipo de ventas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Drill className="w-4 h-4" />
                      <span><strong>Trabajos:</strong> Tipos de trabajos de chasis</span>
                    </li>
                  </ul>
                </div>
              </div>

              <Alert type="info">
                <strong>📋 Patrón Común:</strong> Todos los elementos siguen el mismo flujo de gestión: 
                consultar, crear, editar y eliminar con validaciones inteligentes.
              </Alert>
            </TutorialSection>

            <TutorialSection 
              title="Acceder a Configuraciones" 
              id="acceso"
              icon={<Settings className="w-6 h-6 text-green-600 dark:text-green-400" />}
            >
              <Step number={1} title="Navegación Principal">
                <p>Desde el menú principal, accede a <strong>"Configuraciones"</strong> → <strong>"Parámetros Generales"</strong></p>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 mt-2">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>Ruta:</strong> /settings/generales
                  </p>
                </div>
              </Step>

              <Step number={2} title="Seleccionar Tipo de Configuración">
                <p>Una vez en la sección, utiliza el panel lateral izquierdo para cambiar entre los diferentes tipos de elementos:</p>
                <ul className="mt-2 space-y-1">
                  <li>• <strong>Colores</strong> - Gestiona la paleta de colores</li>
                  <li>• <strong>Carrozado</strong> - Define tipos de carrocería</li>
                  <li>• <strong>Puertas Traseras</strong> - Configura tipos de puertas</li>
                  <li>• <strong>Vendedores</strong> - Administra el equipo de ventas</li>
                  <li>• <strong>Tipos de Trabajos</strong> - Define trabajos de chasis</li>
                </ul>
              </Step>
            </TutorialSection>

            <TutorialSection 
              title="Entender la Interfaz" 
              id="interfaz"
              icon={<Grid className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />}
            >
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                La interfaz está diseñada para ser consistente y fácil de usar. Cada sección de configuración 
                presenta la misma estructura y funcionalidades.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">📱 Panel Lateral</h4>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    <li>• Navegación entre tipos de elementos</li>
                    <li>• Iconos identificativos para cada sección</li>
                    <li>• Indicador visual del elemento activo</li>
                  </ul>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">📊 Área Principal</h4>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    <li>• Tabla con listado de elementos</li>
                    <li>• Campo de búsqueda y filtros</li>
                    <li>• Botones de acción (agregar, editar, eliminar)</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">🔍 Funcionalidades de la Tabla</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Alert type="success">
                    <strong>Búsqueda automática:</strong> Filtra resultados mientras escribes en el campo de búsqueda
                  </Alert>
                  <Alert type="info">
                    <strong>Ordenamiento:</strong> Haz clic en los encabezados de columna para ordenar
                  </Alert>
                  <Alert type="tip">
                    <strong>Estado visual:</strong> Los elementos inactivos se muestran con menor opacidad 
                    y un borde gris para distinguirlos fácilmente de los elementos activos
                  </Alert>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">👁️ Indicadores Visuales</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <h5 className="font-semibold text-gray-900 dark:text-white mb-2">✅ Elementos Activos</h5>
                    <div className="bg-white dark:bg-gray-700 rounded p-3 border">
                      <div className="flex justify-between">
                        <span className="text-sm">Azul Metalizado</span>
                        <span className="text-xs text-green-600 font-medium">Activo</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-2">
                      Apariencia normal, totalmente visible y disponible para uso.
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <h5 className="font-semibold text-gray-900 dark:text-white mb-2">⚪ Elementos Inactivos</h5>
                    <div className="bg-white dark:bg-gray-700 rounded p-3 border border-l-4 border-l-gray-400 opacity-60">
                      <div className="flex justify-between">
                        <span className="text-sm">Rojo Ferrari</span>
                        <span className="text-xs text-red-600 font-medium">Inactivo</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-2">
                      Opacidad reducida y borde gris para indicar estado inactivo.
                    </p>
                  </div>
                </div>
                <Alert type="tip">
                  <strong>💡 Consejo:</strong> Esta diferenciación visual te ayuda a identificar rápidamente 
                  qué elementos están disponibles para nuevos pedidos y cuáles han sido descontinuados.
                </Alert>
              </div>
            </TutorialSection>

            <TutorialSection 
              title="Gestión de Elementos de Configuración" 
              id="gestion-elementos"
              icon={<Settings className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
            >
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Todos los elementos en Parámetros Generales siguen el mismo flujo de gestión: consultar, crear, editar y eliminar. 
                Esta sección explica el proceso común que aplica a <strong>colores, carrozados, puertas traseras, vendedores y tipos de trabajos</strong>.
              </p>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-6">
                <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-4 flex items-center gap-2">
                  <Grid className="w-5 h-5" />
                  Elementos Disponibles
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-white dark:bg-blue-800/30 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <PaintBucket className="w-4 h-4 text-orange-500" />
                      <span className="font-semibold">Colores</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Paleta de colores para carrocerías y zócalos
                    </p>
                  </div>
                  <div className="bg-white dark:bg-blue-800/30 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Truck className="w-4 h-4 text-blue-500" />
                      <span className="font-semibold">Carrozados</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Tipos de carrocería disponibles
                    </p>
                  </div>
                  <div className="bg-white dark:bg-blue-800/30 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <RectangleVertical className="w-4 h-4 text-green-500" />
                      <span className="font-semibold">Puertas Traseras</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Configuraciones de puertas posteriores
                    </p>
                  </div>
                  <div className="bg-white dark:bg-blue-800/30 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-purple-500" />
                      <span className="font-semibold">Vendedores</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Equipo de ventas y asignaciones
                    </p>
                  </div>
                  <div className="bg-white dark:bg-blue-800/30 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Drill className="w-4 h-4 text-yellow-500" />
                      <span className="font-semibold">Tipos de Trabajos</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Trabajos de modificación de chasis
                    </p>
                  </div>
                </div>
              </div>

              <Step number={1} title="Navegar entre Elementos">
                <p>Utiliza el panel lateral izquierdo para cambiar entre los diferentes tipos de configuración. 
                Cada sección muestra una tabla con los elementos existentes y sus estados (activo/inactivo).</p>
                
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mt-4">
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-2">🔍 Funcionalidades de la Tabla</h5>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    <li>• <strong>Búsqueda:</strong> Filtra elementos escribiendo en el campo de búsqueda</li>
                    <li>• <strong>Ordenamiento:</strong> Haz clic en los encabezados para ordenar columnas</li>
                    <li>• <strong>Indicadores visuales:</strong> Elementos inactivos se muestran con opacidad reducida</li>
                    <li>• <strong>Edición rápida:</strong> Clic en cualquier fila para editar</li>
                  </ul>
                </div>
              </Step>

              <Step number={2} title="Crear Nuevos Elementos" variant="success">
                <ol className="space-y-3">
                  <li><strong>1. Ubicar el botón:</strong> Busca el botón "Agregar [elemento]" en la esquina inferior derecha</li>
                  <li><strong>2. Completar formulario:</strong> Se abrirá un modal con los campos necesarios
                    <ul className="ml-4 mt-2 space-y-1">
                      <li>• <strong>Nombre:</strong> Denominación del elemento (debe ser único*)</li>
                      <li>• <strong>Activo:</strong> Marcado por defecto como ✅ (listo para usar)</li>
                      <li>• <strong>Otros campos:</strong> Según el tipo de elemento</li>
                    </ul>
                  </li>
                  <li><strong>3. Validación automática:</strong> El sistema verifica que el nombre sea único</li>
                  <li><strong>4. Guardar:</strong> El nuevo elemento queda disponible inmediatamente</li>
                </ol>

                <Alert type="info">
                  <strong>*Excepción - Vendedores:</strong> Los vendedores pueden tener nombres duplicados 
                  (para casos de homónimos en el equipo de ventas).
                </Alert>
              </Step>

              <Step number={3} title="Editar Elementos Existentes" variant="warning">
                <div className="space-y-3">
                  <p><strong>Edición directa:</strong> Haz clic en cualquier fila de la tabla para abrir el formulario de edición.</p>
                  
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                    <h5 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-2">📝 Campos Editables</h5>
                    <ul className="text-sm text-yellow-800 dark:text-yellow-300 space-y-1">
                      <li>• <strong>Nombre:</strong> Cambiar denominación (única validación aplicable)</li>
                      <li>• <strong>Estado Activo:</strong> Activar/desactivar disponibilidad</li>
                      <li>• <strong>Campos específicos:</strong> Según el tipo de elemento</li>
                    </ul>
                  </div>

                  <Alert type="tip">
                    <strong>💡 Recomendación:</strong> Prefiere <strong>desactivar elementos</strong> en lugar de eliminarlos 
                    para preservar el historial de pedidos existentes.
                  </Alert>
                </div>
              </Step>

              <Step number={4} title="Eliminar Elementos" variant="warning">
                <div className="space-y-4">
                  <p><strong>Eliminación protegida:</strong> Haz clic en el ícono de basura 🗑️ en la columna "Acciones".</p>
                  
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                    <h5 className="font-semibold text-red-900 dark:text-red-200 mb-3">🛡️ Validaciones de Seguridad</h5>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 px-2 py-1 rounded text-sm font-semibold">1</span>
                        <div>
                          <strong>Verificación de uso:</strong> El sistema busca si el elemento está siendo usado en pedidos
                          <ul className="text-sm text-red-700 dark:text-red-300 mt-1 ml-4">
                            <li>• <strong>Si está en uso:</strong> Muestra mensaje de error con cantidad de pedidos</li>
                            <li>• <strong>Si no está en uso:</strong> Solicita confirmación</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded text-sm font-semibold">2</span>
                        <div>
                          <strong>Confirmación doble:</strong> Solicita confirmación explícita del usuario
                          <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                            Evita eliminaciones accidentales con mensaje claro sobre irreversibilidad
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Step>

              <Alert type="tip">
                <strong>💡 Consejo:</strong> Mantén una nomenclatura clara y consistente. Esto facilita la búsqueda 
                y selección cuando los usuarios estén creando pedidos.
              </Alert>
            </TutorialSection>

            <TutorialSection 
              title="Operaciones Comunes" 
              id="operaciones"
              icon={<Settings className="w-6 h-6 text-gray-600 dark:text-gray-400" />}
            >
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🔍 Buscar y Filtrar</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                      <h5 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
                        <Search className="w-4 h-4" />
                        Búsqueda en Tiempo Real
                      </h5>
                      <p className="text-sm text-blue-800 dark:text-blue-300">
                        Escribe en el campo de búsqueda para filtrar elementos instantáneamente por nombre.
                      </p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                      <h5 className="font-semibold text-green-900 dark:text-green-200 mb-2">🔤 Ordenamiento</h5>
                      <p className="text-sm text-green-800 dark:text-green-300">
                        Haz clic en cualquier encabezado de columna para ordenar los resultados ascendente o descendentemente.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">➕ Agregar Nuevos Elementos</h4>
                  <div className="space-y-4">
                    <p>En cada sección, encontrarás un botón flotante para agregar nuevos elementos:</p>
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                          <Plus className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">Botón "Agregar [elemento]"</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 ml-11">
                        Ubicado en la esquina inferior derecha de cada sección
                      </p>
                    </div>

                    <Alert type="success">
                      <strong>🛡️ Validación de Nombres Únicos:</strong> El sistema automáticamente verifica que no existan nombres duplicados al crear nuevos elementos (excepto vendedores).
                    </Alert>

                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                      <h5 className="text-md font-semibold text-blue-900 dark:text-blue-200 mb-3">🔍 Proceso de Validación</h5>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-sm font-semibold">1</span>
                          <div>
                            <strong>Verificación automática:</strong> Al intentar crear un elemento, el sistema verifica nombres existentes
                            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                              La comparación se hace sin importar mayúsculas/minúsculas ni espacios extra
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded text-sm font-semibold">2</span>
                          <div>
                            <strong>Prevención de duplicados:</strong> Si ya existe, muestra mensaje de error
                            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                              Te sugiere usar un nombre diferente y específico
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-2 py-1 rounded text-sm font-semibold">3</span>
                          <div>
                            <strong>Creación exitosa:</strong> Si es único, procede con la creación normal
                            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                              El elemento se agrega y la lista se actualiza automáticamente
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Alert type="info">
                      <strong>📝 Excepción - Vendedores:</strong> Los vendedores pueden tener nombres duplicados ya que pueden existir homónimos en el equipo de ventas.
                    </Alert>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">✏️ Editar Elementos</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                      <h5 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-2 flex items-center gap-2">
                        <Edit className="w-4 h-4" />
                        Edición Directa
                      </h5>
                      <p className="text-sm text-yellow-800 dark:text-yellow-300">
                        Haz clic en cualquier fila de la tabla para abrir inmediatamente el formulario de edición.
                      </p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                      <h5 className="font-semibold text-purple-900 dark:text-purple-200 mb-2">📝 Campos Modificables</h5>
                      <p className="text-sm text-purple-800 dark:text-purple-300">
                        Puedes cambiar el nombre, el estado activo/inactivo y otros campos específicos según el tipo de elemento.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🗑️ Eliminar Elementos</h4>
                  <Alert type="success">
                    <strong>✅ Validación Inteligente:</strong> El sistema ahora valida automáticamente si un elemento 
                    está siendo usado en pedidos antes de permitir su eliminación, protegiendo la integridad de los datos.
                  </Alert>
                  
                  <div className="mt-6 space-y-4">
                    <h5 className="text-md font-semibold text-gray-800 dark:text-gray-200">🛡️ Proceso de Validación</h5>
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-sm font-semibold">1</span>
                        <div>
                          <strong>Verificación automática:</strong> El sistema verifica si el elemento está en uso
                          <ul className="text-sm text-gray-600 dark:text-gray-300 mt-1 ml-4">
                            <li>• <strong>Colores:</strong> Busca en color_carrozado_id y color_zocalo_id</li>
                            <li>• <strong>Vendedores:</strong> Verifica en pedidos activos</li>
                            <li>• <strong>Tipos de trabajo:</strong> Revisa trabajos de chasis</li>
                            <li>• <strong>Otros elementos:</strong> Valida en carrocerías relacionadas</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded text-sm font-semibold">2</span>
                        <div>
                          <strong>Protección de datos:</strong> Si está en uso, muestra mensaje informativo
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            Indica cuántos pedidos utilizan el elemento y sugiere actualizar antes de eliminar
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-2 py-1 rounded text-sm font-semibold">3</span>
                        <div>
                          <strong>Confirmación segura:</strong> Si no está en uso, solicita confirmación
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            Doble confirmación para evitar eliminaciones accidentales
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Alert type="tip">
                    <strong>💡 Recomendación:</strong> Aunque la eliminación es segura, considera 
                    <strong> inactivar elementos</strong> en lugar de eliminarlos para preservar el historial completo.
                  </Alert>
                </div>
              </div>
            </TutorialSection>

            <TutorialSection 
              title="Tips y Mejores Prácticas" 
              id="tips"
              icon={<Lightbulb className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />}
            >
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                    <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Organización Eficiente
                    </h4>
                    <ul className="space-y-2 text-blue-800 dark:text-blue-300">
                      <li>• <strong>Nomenclatura consistente:</strong> Usa nombres claros y descriptivos</li>
                      <li>• <strong>Categorización lógica:</strong> Agrupa elementos similares</li>
                      <li>• <strong>Actualización regular:</strong> Revisa y actualiza las configuraciones periódicamente</li>
                      <li>• <strong>Documentación:</strong> Mantén registro de cambios importantes</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
                    <h4 className="text-lg font-semibold text-green-900 dark:text-green-200 mb-4 flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Gestión de Estados
                    </h4>
                    <ul className="space-y-2 text-green-800 dark:text-green-300">
                      <li>• <strong>Inactivar vs Eliminar:</strong> Prefiere inactivar elementos en lugar de eliminarlos</li>
                      <li>• <strong>Preservar historial:</strong> Mantiene la integridad de pedidos anteriores</li>
                      <li>• <strong>Planificación:</strong> Inactiva elementos antes de descontinuarlos</li>
                      <li>• <strong>Comunicación:</strong> Informa al equipo sobre cambios importantes</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 border border-yellow-200 dark:border-yellow-800">
                  <h4 className="text-lg font-semibold text-yellow-900 dark:text-yellow-200 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Consideraciones Importantes
                  </h4>
                  <ul className="space-y-2 text-yellow-800 dark:text-yellow-300">
                    <li>• <strong>Backup regular:</strong> Las configuraciones son críticas para el funcionamiento</li>
                    <li>• <strong>Acceso controlado:</strong> Solo usuarios autorizados deberían modificar configuraciones</li>
                    <li>• <strong>Pruebas:</strong> Verifica cambios en un entorno de prueba cuando sea posible</li>
                    <li>• <strong>Rollback:</strong> Ten un plan para revertir cambios si es necesario</li>
                  </ul>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                    Troubleshooting Común
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-semibold text-gray-900 dark:text-white mb-2">"No aparece en los formularios"</h5>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                        <li>• Verifica que el elemento esté marcado como "Activo"</li>
                        <li>• Refresca la página donde intentas usarlo</li>
                        <li>• Revisa que el nombre no tenga caracteres especiales</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 dark:text-white mb-2">"Error al guardar cambios"</h5>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                        <li>• Asegúrate de completar todos los campos obligatorios</li>
                        <li>• Verifica tu conexión a internet</li>
                        <li>• Intenta cerrar y reabrir el modal</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 dark:text-white mb-2">"Los datos no se actualizan"</h5>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                        <li>• Espera unos segundos para que se sincronicen</li>
                        <li>• Cambia de pestaña y vuelve para forzar actualización</li>
                        <li>• Contacta al administrador si persiste</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 dark:text-white mb-2">✅ "Elementos duplicados" (Protegido)</h5>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                        <li>• <strong>Validación automática:</strong> El sistema previene nombres duplicados</li>
                        <li>• <strong>Si aparece error:</strong> Usa un nombre más específico o descriptivo</li>
                        <li>• <strong>Vendedores:</strong> Pueden tener nombres iguales (homónimos permitidos)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
                  <h4 className="text-lg font-semibold text-purple-900 dark:text-purple-200 mb-4">🚀 Próximos Pasos</h4>
                  <ul className="space-y-2 text-purple-800 dark:text-purple-300">
                    <li>• <strong>Practica:</strong> Crea algunos elementos de prueba para familiarizarte</li>
                    <li>• <strong>Planifica:</strong> Define qué elementos necesitas para tu negocio</li>
                    <li>• <strong>Configura:</strong> Establece la base de datos de configuraciones</li>
                    <li>• <strong>Capacitación:</strong> Facilita el entrenamiento de nuevos usuarios</li>
                  </ul>
                </div>
              </div>
            </TutorialSection>
    </TutorialLayout>
  );
}