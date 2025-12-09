import type { Route } from "../+types/home";
import {
  Settings,
  Info,
  Lightbulb,
  PaintBucket,
  Truck,
  RectangleVertical,
  Users,
  Drill,
  Plus,
  Edit,
  Trash2,
  Search,
  Grid,
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
    { title: "Tutorial: Configuración Avanzadas" },
    {
      name: "description",
      content:
        "Aprende a personalizar y configurar el sistema según tus necesidades",
    },
  ];
}

export default function ConfiguracionAvanzadasTutorial() {
  const sections = [
    { id: "introduccion", title: "Introducción" },
    { id: "acceso", title: "Acceder a Configuraciones Avanzadas" },
    { id: "valores-defecto", title: "Valores por Defecto" },
    { id: "control-carrozado", title: "Control de Carrozado" },
    { id: "impacto-pedidos", title: "Impacto en Pedidos" },
    { id: "tips", title: "Tips y Mejores Prácticas" },
  ];

  return (
    <TutorialLayout
      title="Tutorial: Configuraciones Avanzadas"
      subtitle="Personalización específica por tipo de carrozado"
      sections={sections}
      icon={Settings}
      completion={{
        message:
          "¡Has completado el tutorial de Configuraciones Avanzadas! 🎉",
        description:
          "Ahora puedes configurar valores por defecto y controles de calidad específicos para cada tipo de carrozado, optimizando el flujo de trabajo y garantizando la calidad.",
        primaryAction: {
          label: "Ir a Configuraciones Avanzadas",
          to: "/settings/carrozados",
          icon: Settings,
        },
      }}
    >
      <TutorialSection
        title="Introducción"
        id="introduccion"
        icon={{
          component: Info,
          color: "text-blue-600 dark:text-blue-400",
        }}
      >
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          Las <strong>Configuraciones Avanzadas</strong> te permiten personalizar el comportamiento del sistema para cada tipo de carrozado específico. Esta funcionalidad es esencial para optimizar el flujo de trabajo y garantizar la consistencia en la producción.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-6">
          <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-4">
            🎯 ¿Qué puedes configurar por carrozado?
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ul className="space-y-2 text-blue-800 dark:text-blue-300">
              <li className="flex items-center gap-2">
                <Grid className="w-4 h-4" />
                <span>
                  <strong>Valores por Defecto:</strong> Pre-configurar campos específicos
                </span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>
                  <strong>Control de Carrozado:</strong> Ítems de control de calidad
                </span>
              </li>
            </ul>
            <ul className="space-y-2 text-blue-800 dark:text-blue-300">
              <li className="flex items-center gap-2">
                <RectangleVertical className="w-4 h-4" />
                <span>
                  <strong>Campos Fijos:</strong> Valores que no pueden modificarse
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Edit className="w-4 h-4" />
                <span>
                  <strong>Campos Seleccionables:</strong> Valores por defecto modificables
                </span>
              </li>
            </ul>
          </div>
        </div>

        <Alert type="info">
          <strong>Prerequisito:</strong> Primero debes tener configurados los tipos de carrozado en <strong>Parámetros Generales</strong> para poder acceder a sus configuraciones específicas.
        </Alert>

        <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
          <h4 className="font-semibold text-amber-900 dark:text-amber-200 mb-2">
            💡 Ejemplo Práctico: Carrozado Tolva
          </h4>
          <p className="text-amber-800 dark:text-amber-300">
            Para un <strong>Carrozado Tolva</strong> que nunca lleva puerta trasera, puedes configurar el campo "Puerta trasera" con valor <strong>"No aplica"</strong> y tipo <strong>"Fijo"</strong>. Así, en todos los pedidos de este tipo, este campo aparecerá automáticamente configurado e inmodificable.
          </p>
        </div>
      </TutorialSection>

      <TutorialSection
        title="Acceder a Configuraciones Avanzadas"
        id="acceso"
        icon={{
          component: Settings,
          color: "text-green-600 dark:text-green-400",
        }}
      >
        <Step number={1} title="Navegación Principal">
          <p className="mb-4">
            Desde el menú principal, accede a <strong>"Configuraciones"</strong> → <strong>"Configuraciones Avanzadas"</strong>
          </p>
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong>Ruta directa:</strong> <code>/settings/carrozados</code>
            </p>
          </div>
        </Step>

        <Step number={2} title="Seleccionar Carrozado">
          <p className="mb-4">
            Verás tarjetas con cada tipo de carrozado configurado en el sistema. Cada tarjeta muestra:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4 mb-4">
            <li><strong>Nombre del carrozado:</strong> Identificación clara del tipo</li>
            <li><strong>Imagen representativa:</strong> Si fue configurada previamente</li>
            <li><strong>Acceso directo:</strong> Click para acceder a la configuración específica</li>
          </ul>
        </Step>
      </TutorialSection>

      <TutorialSection
        title="Configuración de Valores por Defecto"
        id="valores-defecto"
        icon={{
          component: Grid,
          color: "text-purple-600 dark:text-purple-400",
        }}
      >
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            ¿Qué son los Valores por Defecto?
          </h4>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Son valores que se <strong>pre-cargan automáticamente</strong> al crear un pedido para un tipo específico de carrozado. Puedes configurar si estos valores son <strong>modificables</strong> o <strong>fijos</strong> durante la creación del pedido.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <h5 className="font-semibold text-green-900 dark:text-green-200 mb-2 flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Tipo: Seleccionable
            </h5>
            <p className="text-green-800 dark:text-green-300 text-sm">
              El valor se pre-carga pero puede ser modificado por el usuario durante la creación del pedido.
            </p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h5 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
              <RectangleVertical className="w-4 h-4" />
              Tipo: Fijo
            </h5>
            <p className="text-blue-800 dark:text-blue-300 text-sm">
              El valor se pre-carga y aparece <strong>inactivo</strong>, no puede ser modificado por el usuario.
            </p>
          </div>
        </div>

        <Step number={1} title="Visualizar Valores Configurados">
          <p className="mb-4">
            Al acceder a un carrozado específico, verás una tabla con los valores ya configurados mostrando:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
            <li><strong>Nombre de campo:</strong> El atributo a configurar</li>
            <li><strong>Valor por defecto:</strong> El valor que se pre-cargará</li>
            <li><strong>Tipo:</strong> 🔒 Fijo o 🟢 Seleccionable</li>
            <li><strong>Estado:</strong> Activo o Inactivo</li>
          </ul>
        </Step>

        <Step number={2} title="Crear Nuevo Valor por Defecto">
          <p className="mb-4">Para agregar un nuevo valor por defecto:</p>
          <div className="space-y-3 mb-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <strong>Botón "+":</strong> Ubicado en la parte inferior derecha de la pantalla
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <strong>Sin datos:</strong> Si no hay valores configurados, aparece un botón central <strong>"+ Agregar valores por defecto"</strong>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mt-4">
            <h5 className="font-semibold text-gray-900 dark:text-white mb-3">Formulario de Configuración:</h5>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li><strong>1. Nombre del campo:</strong> Lista desplegable con todos los campos disponibles del formulario de carrocería</li>
              <li><strong>2. Valor por defecto:</strong> El valor específico que se pre-cargará (se adapta según el campo seleccionado)</li>
              <li><strong>3. Tipo:</strong> Selecciona entre "🔒 Fijo" o "🟢 Seleccionable"</li>
              <li><strong>4. Activo:</strong> Estado del valor (por defecto aparece como activo)</li>
            </ul>
          </div>
        </Step>

        <Step number={3} title="Editar Valor Existente">
          <p className="mb-4">
            Para modificar un valor ya configurado, simplemente <strong>haz clic en la fila correspondiente</strong> en la tabla. Se abrirá el mismo formulario con los datos actuales para que puedas realizar modificaciones.
          </p>
        </Step>

        <Alert type="tip">
          <strong>Tip de Eficiencia:</strong> Configura como "Fijo" aquellos valores que nunca cambian para un tipo de carrozado específico, y como "Seleccionable" aquellos que suelen tener un valor común pero pueden variar según el cliente.
        </Alert>
      </TutorialSection>

      <TutorialSection
        title="Control de Carrozado"
        id="control-carrozado"
        icon={{
          component: CheckCircle,
          color: "text-orange-600 dark:text-orange-400",
        }}
      >
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            ¿Qué es el Control de Carrozado?
          </h4>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Define los <strong>ítems de control de calidad</strong> específicos que aparecerán en el PDF generado desde la sección de <strong>Controles de Calidad</strong> del pedido. Estos ítems se crean inicialmente en <strong>Parámetros Generales</strong> y aquí los asignas a carrozados específicos.
          </p>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-6 mb-6">
          <h4 className="text-lg font-semibold text-amber-900 dark:text-amber-200 mb-4">
            🔗 Sobre los Ítems de Control
          </h4>
          <p className="text-amber-800 dark:text-amber-300 mb-3">
            Los ítems de control que aparecen en la lista desplegable se <strong>crean y configuran desde Parámetros Generales → Ítems de Control</strong>, donde funcionan igual que otros parámetros del sistema (colores, carrozados, etc.).
          </p>
          <div className="bg-amber-100 dark:bg-amber-800/30 rounded-lg p-4">
            <p className="text-amber-900 dark:text-amber-200 font-semibold mb-2">💡 Campo Relacionado:</p>
            <p className="text-amber-800 dark:text-amber-300 mb-2">
              Al crear un ítem de control en <strong>Parámetros Generales</strong>, puedes asignarle un <strong>"Campo relacionado"</strong> que extrae automáticamente datos del pedido para mostrar en el PDF de control.
            </p>
            <p className="text-amber-900 dark:text-amber-200 font-semibold mb-1">Ejemplo:</p>
            <p className="text-amber-800 dark:text-amber-300">
              El ítem <strong>"Altura de baranda"</strong> configurado con campo relacionado <code>altura_baranda</code> mostrará automáticamente en el PDF la altura específica de esa carrocería, facilitando la verificación durante el control.
            </p>
          </div>
        </div>

        <Step number={1} title="Visualizar Controles Configurados">
          <p className="mb-4">
            La tabla de control de carrozado muestra:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
            <li><strong>Ítem de control:</strong> Nombre del control a verificar</li>
            <li><strong>Estado:</strong> Activo o Inactivo</li>
          </ul>
        </Step>

        <Step number={2} title="Agregar Ítem de Control">
          <p className="mb-4">Para añadir un nuevo ítem de control:</p>
          <div className="space-y-3 mb-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <strong>Botón "+":</strong> Ubicado en la parte inferior derecha
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <strong>Sin controles:</strong> Botón central <strong>"+ Agregar control de carrozado"</strong>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mt-4">
            <h5 className="font-semibold text-gray-900 dark:text-white mb-3">Formulario de Control:</h5>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li><strong>1. Ítem de control:</strong> Lista desplegable con todos los ítems creados en Parámetros Generales</li>
              <li><strong>2. Activo:</strong> Estado del ítem (por defecto aparece como activo)</li>
            </ul>
          </div>
        </Step>

        <Step number={3} title="Editar Control Existente">
          <p className="mb-4">
            Haz clic en cualquier fila de la tabla para modificar el estado del ítem de control o cambiar su configuración.
          </p>
        </Step>

        <Alert type="info">
          <strong>📋 Importante:</strong> Los ítems de control se crean y configuran completamente en <strong>Parámetros Generales → Ítems de Control</strong> (incluyendo nombre, descripción y campo relacionado). En Configuraciones Avanzadas solo los <strong>asignas</strong> a carrozados específicos y defines si están activos o no.
        </Alert>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mt-4">
          <p className="text-blue-800 dark:text-blue-300 text-sm">
            <strong>💡 Tip:</strong> Para entender mejor cómo crear y configurar ítems de control (incluyendo el campo relacionado), consulta el <strong>Tutorial: Parámetros Generales</strong> donde se explica detalladamente este proceso.
          </p>
        </div>
      </TutorialSection>

      <TutorialSection
        title="Impacto en el Flujo de Pedidos"
        id="impacto-pedidos"
        icon={{
          component: Truck,
          color: "text-indigo-600 dark:text-indigo-400",
        }}
      >
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Valores por Defecto en Pedidos
          </h4>
          
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6">
              <h5 className="font-semibold text-blue-900 dark:text-blue-200 mb-3">
                🔄 Flujo Automático
              </h5>
              <div className="space-y-3 text-blue-800 dark:text-blue-300">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-200 dark:bg-blue-700 rounded-full flex items-center justify-center text-blue-800 dark:text-blue-200 font-bold text-sm">1</div>
                  <span>El usuario registra un nuevo pedido y selecciona el tipo de carrozado</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-200 dark:bg-blue-700 rounded-full flex items-center justify-center text-blue-800 dark:text-blue-200 font-bold text-sm">2</div>
                  <span>Se muestra un modal de carga: <em>"Cargando parámetros del carrozado..."</em></span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-200 dark:bg-blue-700 rounded-full flex items-center justify-center text-blue-800 dark:text-blue-200 font-bold text-sm">3</div>
                  <span>El sistema busca la configuración específica del carrozado</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-200 dark:bg-blue-700 rounded-full flex items-center justify-center text-blue-800 dark:text-blue-200 font-bold text-sm">4</div>
                  <span>Los valores configurados se pre-cargan automáticamente</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <Alert type="success">
              <strong>Con configuración:</strong> Formulario pre-cargado con valores específicos, campos fijos deshabilitados
            </Alert>
            <Alert type="info">
              <strong>Sin configuración:</strong> Formulario en blanco, todos los campos habilitados para ingreso manual
            </Alert>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Control de Calidad en Pedidos
          </h4>
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-6 mb-4">
            <h5 className="font-semibold text-green-900 dark:text-green-200 mb-3">
              📋 En la pestaña "Controles de Calidad"
            </h5>
            <div className="space-y-3 text-green-800 dark:text-green-300">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 mt-0.5 text-green-600 dark:text-green-400" />
                <div>
                  <strong>Con controles configurados:</strong> Aparece una tarjeta "Control de carrozado" que permite generar el PDF con los ítems específicos
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 mt-0.5 text-yellow-600 dark:text-yellow-400" />
                <div>
                  <strong>Sin controles configurados:</strong> Mensaje informativo con enlace directo para configurar controles para ese carrozado
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h5 className="font-semibold text-gray-900 dark:text-white mb-3">Proceso de Generación de PDF:</h5>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li><strong>1.</strong> Usuario hace clic en "Control de carrozado"</li>
              <li><strong>2.</strong> Se abre modal para seleccionar responsable del control</li>
              <li><strong>3.</strong> Al generar orden, se crea PDF con los ítems configurados específicamente para ese tipo de carrozado</li>
              <li><strong>4.</strong> Los campos relacionados muestran los valores específicos del pedido</li>
            </ul>
          </div>
        </div>
      </TutorialSection>

      <TutorialSection
        title="Tips y Mejores Prácticas"
        id="tips"
        icon={{
          component: Lightbulb,
          color: "text-yellow-600 dark:text-yellow-400",
        }}
      >
        <div className="space-y-6">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-green-900 dark:text-green-200 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Configuración Eficiente de Valores por Defecto
            </h4>
            <ul className="space-y-2 text-green-800 dark:text-green-300">
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                <span><strong>Valores Fijos:</strong> Úsalos para características que NUNCA cambian en un tipo de carrozado</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                <span><strong>Valores Seleccionables:</strong> Para características comunes pero que pueden variar según el cliente</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                <span><strong>Mantén actualizados:</strong> Revisa periódicamente si los valores por defecto siguen siendo relevantes</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Optimización de Controles de Calidad
            </h4>
            <ul className="space-y-2 text-blue-800 dark:text-blue-300">
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                <span><strong>Específicos por tipo:</strong> No todos los carrozados necesitan los mismos controles</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                <span><strong>Campos relacionados:</strong> Aprovecha esta funcionalidad para controles más precisos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                <span><strong>Desactiva temporalmente:</strong> En lugar de eliminar, desactiva controles que no uses actualmente</span>
              </li>
            </ul>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-amber-900 dark:text-amber-200 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Precauciones Importantes
            </h4>
            <ul className="space-y-2 text-amber-800 dark:text-amber-300">
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></span>
                <span><strong>Dependencias:</strong> Asegúrate de tener configurados los ítems de control en Parámetros Generales antes de asignarlos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></span>
                <span><strong>Pruebas:</strong> Siempre verifica el impacto creando un pedido de prueba después de configurar</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></span>
                <span><strong>Documentación:</strong> Mantén un registro de por qué configuraste ciertos valores como fijos</span>
              </li>
            </ul>
          </div>

          <Alert type="tip">
            <strong>🚀 Flujo Recomendado:</strong> 
            <br />1. Configura primero todos los tipos de carrozado en Parámetros Generales
            <br />2. Crea los ítems de control necesarios 
            <br />3. Define valores por defecto basándote en tu experiencia de producción
            <br />4. Asigna controles de calidad específicos por tipo
            <br />5. Prueba el flujo completo con pedidos de ejemplo
          </Alert>
        </div>
      </TutorialSection>
    </TutorialLayout>
  );
}
