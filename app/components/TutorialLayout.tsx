import { ArrowLeft, BookOpen, CheckCircle } from "lucide-react";
import { NavLink } from "react-router";
import { Subheader } from "~/components/Headers";

// Componente para secciones del tutorial
export function TutorialSection({ 
  title, 
  children, 
  icon, 
  id 
}: { 
  title: string; 
  children: React.ReactNode; 
  icon?: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="mb-12">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-3 border-b border-gray-200 dark:border-gray-700 pb-3">
        {icon}
        {title}
      </h2>
      <div className="prose prose-gray dark:prose-invert max-w-none">
        {children}
      </div>
    </section>
  );
}

// Componente para pasos numerados
export function Step({ 
  number, 
  title, 
  children, 
  variant = "default" 
}: { 
  number: number; 
  title: string; 
  children: React.ReactNode;
  variant?: "default" | "warning" | "success" | "info";
}) {
  const variants = {
    default: {
      bg: "bg-gray-50 dark:bg-gray-800/50",
      border: "border-gray-200 dark:border-gray-700",
      number: "bg-blue-600 text-white",
      title: "text-gray-900 dark:text-white"
    },
    success: {
      bg: "bg-green-50 dark:bg-green-900/20",
      border: "border-green-200 dark:border-green-800",
      number: "bg-green-600 text-white",
      title: "text-green-900 dark:text-green-200"
    },
    warning: {
      bg: "bg-yellow-50 dark:bg-yellow-900/20",
      border: "border-yellow-200 dark:border-yellow-800",
      number: "bg-yellow-600 text-white",
      title: "text-yellow-900 dark:text-yellow-200"
    },
    info: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-blue-200 dark:border-blue-800",
      number: "bg-blue-600 text-white",
      title: "text-blue-900 dark:text-blue-200"
    }
  };

  const style = variants[variant];

  return (
    <div className={`${style.bg} rounded-lg p-6 border ${style.border} mb-6`}>
      <div className="flex items-start gap-4">
        <div className={`${style.number} w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0`}>
          {number}
        </div>
        <div className="flex-1">
          <h4 className={`text-lg font-semibold ${style.title} mb-3`}>{title}</h4>
          <div className="text-gray-700 dark:text-gray-300">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente para alertas/avisos
export function Alert({ type, children }: { type: "info" | "warning" | "success" | "tip"; children: React.ReactNode }) {
  const styles = {
    info: {
      container: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
      icon: "ℹ️",
      text: "text-blue-800 dark:text-blue-200"
    },
    warning: {
      container: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
      icon: "⚠️",
      text: "text-yellow-800 dark:text-yellow-200"
    },
    success: {
      container: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
      icon: "✅",
      text: "text-green-800 dark:text-green-200"
    },
    tip: {
      container: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800",
      icon: "💡",
      text: "text-purple-800 dark:text-purple-200"
    }
  };

  const style = styles[type];

  return (
    <div className={`border rounded-lg p-4 my-6 ${style.container}`}>
      <div className="flex items-start gap-3">
        <span className="text-lg">{style.icon}</span>
        <div className={`flex-1 ${style.text}`}>
          {children}
        </div>
      </div>
    </div>
  );
}

// Componente para tabla de contenidos
export function TableOfContents({ sections }: { sections: Array<{ id: string; title: string }> }) {
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200/50 dark:border-gray-700/50 mb-8 sticky top-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <BookOpen className="w-5 h-5" />
        Contenido del Tutorial
      </h3>
      <nav className="space-y-2">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="block text-sm text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {section.title}
          </a>
        ))}
      </nav>
    </div>
  );
}

// Componente principal para el layout del tutorial
interface TutorialLayoutProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  sections: Array<{ id: string; title: string }>;
  children: React.ReactNode;
  completion: {
    message: string;
    description: string;
    primaryAction: {
      label: string;
      to: string;
      icon: React.ReactNode;
    };
  };
}

export function TutorialLayout({
  title,
  subtitle,
  icon,
  sections,
  children,
  completion
}: TutorialLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-6 py-8">
        {/* Header con navegación */}
        <div className="flex items-center gap-4 mb-6">
          <NavLink 
            to="/ayuda"
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Volver al Centro de Ayuda</span>
          </NavLink>
        </div>

        <Subheader 
          title={title}
          icon={icon}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Tabla de contenidos */}
          <div className="lg:col-span-1">
            <TableOfContents sections={sections} />
          </div>

          {/* Contenido principal */}
          <div className="lg:col-span-3">
            {children}

            {/* Sección de finalización */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-8 border border-blue-200/50 dark:border-blue-700/50 text-center">
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {completion.message}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                {completion.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <NavLink 
                  to={completion.primaryAction.to}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 justify-center"
                >
                  {completion.primaryAction.icon}
                  {completion.primaryAction.label}
                </NavLink>
                <NavLink 
                  to="/ayuda"
                  className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 justify-center"
                >
                  <BookOpen className="w-4 h-4" />
                  Ver más tutoriales
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}