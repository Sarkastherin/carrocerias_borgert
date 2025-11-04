import type { Route } from "../+types/home";
import { Subheader } from "~/components/Headers";
import {
  HelpCircle,
  BookOpen,
  Users,
  FileText,
  Settings,
  Clock,
  Search,
} from "lucide-react";
import { NavLink } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Centro de Ayuda" },
    {
      name: "description",
      content:
        "Aprende a usar todas las funcionalidades del sistema de carrocerías",
    },
  ];
}

const tutorials = [
  {
    id: "clientes",
    title: "Gestión de Clientes",
    description:
      "Aprende a agregar, modificar y eliminar clientes. Incluye validaciones, direcciones georreferenciadas y mejores prácticas.",
    icon: <Users className="w-6 h-6" />,
    category: "Gestión",
    duration: "15 min",
    difficulty: "Básico",
    to: "/ayuda/clientes",
    topics: [
      "Crear nuevos clientes",
      "Editar información existente",
      "Sistema de direcciones",
      "Validación de CUIT/CUIL",
      "Eliminación segura",
    ],
  },
  {
    id: "pedidos",
    title: "Gestión de Pedidos",
    description:
      "Domina el flujo completo de pedidos: desde la creación hasta la finalización, incluyendo carrocerías, camiones y trabajos de chasis.",
    icon: <FileText className="w-6 h-6" />,
    category: "Operaciones",
    duration: "25 min",
    difficulty: "Intermedio",
    to: "/ayuda/pedidos",
    topics: [
      "Crear pedidos paso a paso",
      "Configurar carrocerías",
      "Gestionar datos de camiones",
      "Trabajos de chasis",
      "Estados y seguimiento",
    ],
  },
  {
    id: "configuracion",
    title: "Configuración del Sistema",
    description:
      "Personaliza el sistema según tus necesidades: colores, carrozados, vendedores y otras configuraciones importantes.",
    icon: <Settings className="w-6 h-6" />,
    category: "Administración",
    duration: "10 min",
    difficulty: "Básico",
    to: "/ayuda/configuracion",
    topics: [
      "Gestionar colores disponibles",
      "Configurar tipos de carrozado",
      "Administrar vendedores",
      "Opciones de trabajos de chasis",
      "Configuraciones generales",
    ],
  },
];

const quickLinks = [
  {
    title: "¿Cómo empezar?",
    description: "Guía rápida para nuevos usuarios",
    icon: <BookOpen className="w-5 h-5" />,
    action: "Próximamente",
  },
  {
    title: "Preguntas frecuentes",
    description: "Respuestas a las dudas más comunes",
    icon: <HelpCircle className="w-5 h-5" />,
    action: "Próximamente",
  },
  {
    title: "Novedades",
    description: "Últimas actualizaciones del sistema",
    icon: <Clock className="w-5 h-5" />,
    action: "Próximamente",
  },
];

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const colors = {
    Básico:
      "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
    Intermedio:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
    Avanzado: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${colors[difficulty as keyof typeof colors] || colors.Básico}`}
    >
      {difficulty}
    </span>
  );
}

function CategoryBadge({ category }: { category: string }) {
  const colors = {
    Gestión: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
    Operaciones:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300",
    Administración:
      "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300",
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${colors[category as keyof typeof colors] || colors.Gestión}`}
    >
      {category}
    </span>
  );
}

export default function AyudaHome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-primary-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-6 py-8">
        <Subheader
          title="Centro de Ayuda"
          icon={{
            component: HelpCircle,
            color: "text-blue-600 dark:text-blue-400",
          }}
        />

        {/* Hero Section */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/50 dark:border-gray-700/50 shadow-lg">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              ¡Bienvenido al Centro de Ayuda! 👋
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              Aquí encontrarás guías detalladas, tutoriales paso a paso y
              consejos para aprovechar al máximo todas las funcionalidades del
              sistema de gestión de carrocerías.
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Search className="w-4 h-4" />
                <span>Encuentra respuestas rápidamente</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <BookOpen className="w-4 h-4" />
                <span>Tutoriales actualizados</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tutoriales Principales */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Tutoriales Disponibles
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {tutorials.map((tutorial) => (
              <NavLink
                key={tutorial.id}
                to={tutorial.to}
                className="group block"
              >
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-white/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] group-hover:border-blue-300/70 dark:group-hover:border-blue-600/50">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                        {tutorial.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {tutorial.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <CategoryBadge category={tutorial.category} />
                          <DifficultyBadge difficulty={tutorial.difficulty} />
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {tutorial.duration}
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                    {tutorial.description}
                  </p>

                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Aprenderás sobre:
                    </p>
                    <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                      {tutorial.topics.slice(0, 3).map((topic, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                          {topic}
                        </li>
                      ))}
                      {tutorial.topics.length > 3 && (
                        <li className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                          <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                          +{tutorial.topics.length - 3} temas más
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </NavLink>
            ))}
          </div>
        </div>

        {/* Enlaces Rápidos */}
        <div>
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            Enlaces Rápidos
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickLinks.map((link, index) => (
              <div
                key={index}
                className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg p-4 border border-white/50 dark:border-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                    {link.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                      {link.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      {link.description}
                    </p>
                    <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                      {link.action} →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer de ayuda */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-600/10 dark:to-purple-600/10 rounded-lg p-6 border border-blue-200/30 dark:border-blue-700/30">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              ¿No encuentras lo que buscas?
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Estamos trabajando constantemente en agregar más contenido y
              mejorar la experiencia.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Para soporte técnico o sugerencias, contacta al equipo de
              desarrollo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
