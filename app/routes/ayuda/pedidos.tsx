import type { Route } from "../+types/home";
import {
  TutorialLayout,
  TutorialSection,
  Step,
  Alert,
} from "~/components/TutorialLayout";
import {
  FileText,
  Info,
  BookOpen,
  LayoutPanelTop,
  Truck,
  Drill,
  ScrollText,
  ExternalLink,
} from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Tutorial: Gestión de Pedidos" },
    {
      name: "description",
      content:
        "Aprende a gestionar pedidos completos desde la creación hasta la entrega",
    },
  ];
}

export default function AyudaPedidos() {
  const sections = [
    { id: "introduccion", title: "Introducción" },
    { id: "home", title: "Lista de pedidos (Home)" },
    { id: "crear", title: "Crear nuevo pedido" },
    { id: "carroceria", title: "Configurar carrocería" },
    { id: "camion", title: "Configurar camión" },
    { id: "trabajo-chasis", title: "Configurar trabajos en chasis" },
    { id: "info", title: "Visualizar información completa" },
  ];

  return (
    <TutorialLayout
      title="Tutorial: Gestión de Pedidos"
      subtitle="Desde la creación hasta el seguimiento del estado del pedido"
      icon={<FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
      sections={sections}
      completion={{
        message: "¡Has completado el tutorial de pedidos! 🎉",
        description:
          "Ahora podés crear, editar y seguir pedidos de punta a punta. Recordá mantener los parámetros generales actualizados para una experiencia fluida.",
        primaryAction: {
          label: "Ir a Pedidos",
          to: "/pedidos",
          icon: <FileText className="w-4 h-4" />,
        },
      }}
    >
      <TutorialSection
        title="Introducción"
        id="introduccion"
        icon={<Info className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          El módulo de <strong>Pedidos</strong> centraliza toda la operativa:
          creación del pedido, datos comerciales, fabricación de la carrocería,
          datos del camión y trabajos de chasis. Este tutorial recorre el flujo
          completo y las validaciones clave.
        </p>
        <Alert type="info">
          Requisitos previos: tener configurados{" "}
          <strong>
            Vendedores, Tipos de Carrozado, Puertas Traseras y Colores{" "}
          </strong>
          en <em>Parámetros Generales</em>, para habilitar las listas
          desplegables de los formularios.
        </Alert>
      </TutorialSection>
      <TutorialSection
        title="Acceder al Módulo de Pedidos"
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
              Navega a la sección "Pedidos" en el menú principal de la
              aplicación.
            </p>
          </div>
          <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4 border border-gray-200/50 dark:border-gray-700/50">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              🔗 URL directa
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">
                /pedidos
              </code>{" "}
              te llevará directamente a la lista de pedidos.
            </p>
          </div>
        </div>
      </TutorialSection>
      <TutorialSection
        title="Visualizar Lista de Pedidos"
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
              <strong>Número de Pedido:</strong> Identificador único del pedido
            </li>
            <li>
              <strong>Cliente:</strong> Nombre del cliente
            </li>
            <li>
              <strong>Fecha prevista:</strong> Fecha en que se espera completar
              el pedido
            </li>
            <li>
              <strong>Fecha de pedido:</strong> Fecha en que se realizó el
              pedido a producción
            </li>
            <li>
              <strong>Vendedor:</strong> Nombre del vendedor asignado al pedido
            </li>
            <li>
              <strong>Estado:</strong> Estado actual del pedido (Nuevo, En
              producción, Finalizado, Entregado, Cancelado)
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Alert type="success">
            <strong>Con pedidos:</strong> Muestra la tabla con todos los
            datos y opciones de filtrado
          </Alert>
          <Alert type="info">
            <strong>Sin pedidos:</strong> Presenta una imagen explicativa y
            botón directo para agregar el primer pedido
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
                visualización y edición del pedido seleccionado
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <strong>Botón "Nuevo Pedido":</strong> Abre el formulario para
                crear un pedido (flotante en inferior derecha)
              </div>
            </div>
          </div>
        </div>
      </TutorialSection>

      <TutorialSection
        title="Crear nuevo pedido (Inicializar pedido)"
        id="crear"
        icon={
          <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
        }
      >
        <Step number={1} title="Acceso al formulario">
          <ul className="space-y-2">
            <li>
              • Desde la lista: botón <strong>Nuevo Pedido</strong> (flotante
              inferior derecha).
            </li>
            <li>
              • URL directa:{" "}
              <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">
                /pedidos/nuevo
              </code>
            </li>
          </ul>
        </Step>
        <Step number={2} title="Completar datos básicos" variant="info">
          <div className="space-y-3">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Fecha de pedido</strong> (obligatoria).
              </li>
              <li>
                <strong>Cliente</strong>: buscá y seleccioná con{" "}
                <em>El campo de cliente</em> o crealo desde el botón “+” (abre un
                modal).
              </li>
              <li>
                <strong>Vendedor</strong> (obligatorio).
              </li>
              <li>
                <strong>Status</strong>: se muestra bloqueado al crear; se
                habilita al editar.
              </li>
            </ul>
            <Alert type="tip">
              Si el cliente no existe, puedes crearlo sin salir del flujo usando
              el modal <em>Nuevo Cliente</em>.
            </Alert>
          </div>
        </Step>
        <Step number={3} title="Condiciones comerciales" variant="warning">
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong>Fecha prevista de entrega</strong>.
            </li>
            <li>
              <strong>Precio total</strong>: campo de monto con formateo en ARS.
            </li>
            <li>
              <strong>Forma de pago</strong>: 6 cheques/eCheqs, 40% + 4 cheques
              (5% desc.) o Contado/transferencia (10% desc.).
            </li>
          </ul>
        </Step>
        <Step number={4} title="Guardar" variant="success">
          <ul className="list-disc list-inside space-y-1">
            <li>
              Revisá que todos los campos obligatorios estén completos.
            </li>
            <li>Presioná <strong>Crear Pedido</strong>.</li>
            <li>
              Los errores de validación se muestran debajo de cada campo.
            </li>
            <li>Al guardar te redirigirá al pedido recien creado, donde podras completar los detalles de la solicitud.</li>
          </ul>
        </Step>
      </TutorialSection>

      <TutorialSection
        title="Configurar carrocería"
        id="carroceria"
        icon={
          <LayoutPanelTop className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
        }
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Configurá la fabricación en <code>/pedidos/carroceria</code> con datos
          técnicos y de terminación.
        </p>
        <Step number={1} title="Datos principales">
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong>Carrozado</strong> (obligatorio) y{" "}
              <strong>Material</strong> (Chapa/Fibra).
            </li>
            <li>
              <strong>Espesor chapa</strong>: 3.2, 2.9, 2.6 o 2.2 mm.
            </li>
            <li>
              Medidas: <strong>Largo int/ext</strong>,{" "}
              <strong>Ancho ext</strong> (2000/2200/2300/2400/2600),{" "}
              <strong>Alto</strong> y <strong>Alt. baranda</strong>.
            </li>
          </ul>
        </Step>
        <Step number={2} title="Puertas y estructura" variant="info">
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong>Puerta trasera</strong>, <strong>ptas. por lado</strong>,{" "}
              <strong>arcos por puerta</strong>.
            </li>
            <li>
              <strong>Refuerzos</strong>: cúmbreras, líneas de refuerzo, tipo de
              zócalo.
            </li>
            <li>Otros: corte de guardabarros.</li>
          </ul>
        </Step>
        <Step number={3} title="Colores y accesorios" variant="warning">
          <ul className="list-disc list-inside space-y-1">
            <li>
              Color de <strong>carrozado</strong>, <strong>zócalo</strong> y{" "}
              <strong>lona</strong>; notas de color.
            </li>
            <li>
              Piso (liso/semillado), boquillas, cajón de herramientas, luces.
            </li>
            <li>Alargue, quiebre, guardabarros, depósito de agua.</li>
            <li>Cintas reflectivas: nacionales o importadas.</li>
          </ul>
        </Step>
        <Alert type="tip">
          Las listas desplegables se cargan automáticamente (colores, tipos de
          carrozado, puertas). Si no aparecen, verificá los{" "}
          <em>Parámetros Generales</em>.
        </Alert>
      </TutorialSection>

      <TutorialSection
        title="Configurar camión"
        id="camion"
        icon={<Truck className="w-6 h-6 text-red-600 dark:text-red-400" />}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Carga los datos del vehículo en <code>/pedidos/camion</code>.
        </p>
        <Step number={1} title="Datos del camión">
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong>Marca</strong> y <strong>Modelo</strong> (obligatorios).
            </li>
            <li>
              <strong>Patente</strong> (opcional).
            </li>
            <li>
              <strong>Larguero</strong>: recto/curvo y <strong>medida</strong>{" "}
              en mm (obligatoria).
            </li>
          </ul>
        </Step>
        <Step number={2} title="Observaciones" variant="info">
          Campo libre para detalles relevantes de montaje o particularidades del
          chasis.
        </Step>
        <Step number={3} title="Guardar" variant="success">
          Confirmá con <strong>Guardar</strong>. Los errores de validación se
          muestran debajo de cada campo.
        </Step>
      </TutorialSection>

      <TutorialSection
        title="Configurar trabajos en chasis"
        id="trabajo-chasis"
        icon={
          <Drill className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        }
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Administrá los trabajos a realizar en{" "}
          <code>/pedidos/trabajo-chasis</code>.
        </p>
        <Step number={1} title="Agregar trabajos" variant="success">
          Usa <strong>Agregar trabajo</strong> para añadir filas. Seleccioná el{" "}
          <em>tipo de trabajo</em> (según configuración general) y escribí una{" "}
          <em>descripción</em> opcional.
        </Step>
        <Step number={2} title="Eliminar trabajos" variant="warning">
          Quita filas con el icono 🗑️. Los cambios se aplican al guardar.
        </Step>
        <Alert type="info">
          Los tipos disponibles provienen de{" "}
          <em>Parámetros Generales → Tipos de Trabajos</em> y sólo muestra los
          activos.
        </Alert>
      </TutorialSection>

      <TutorialSection
        title="Visualizar información completa"
        id="info"
        icon={
          <ScrollText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        }
      >
        <Step number={1} title="Acceso al detalle">
          Ingresa <code>/pedidos/info/{"{id}"}</code> desde la lista haciendo
          clic en una fila.
        </Step>
        <Step number={2} title="Qué vas a ver">
          <ul className="list-disc list-inside space-y-1">
            <li>
              Datos comerciales del pedido: fechas, cliente, vendedor, status y
              condiciones.
            </li>
            <li>
              Secciones para <strong>Carrocería</strong>,{" "}
              <strong>Camión</strong> y <strong>Trabajos de chasis</strong>.
            </li>
          </ul>
        </Step>
        <Alert type="tip">
          Podés actualizar el <strong>Status</strong> del pedido únicamente en
          modo edición. Usa los estados para el seguimiento:
          <em>Nuevo → En producción → Finalizado → Entregado</em> (o{" "}
          <em>Cancelado</em>).
        </Alert>
      </TutorialSection>
    </TutorialLayout>
  );
}
