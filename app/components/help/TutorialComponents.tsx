import React from "react";
import { CheckCircle, AlertTriangle, Info, Lightbulb, ExternalLink, BookOpen } from "lucide-react";

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
    default: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    success: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    info: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200/50 dark:border-gray-700/50 mb-6">
      <div className="flex items-start gap-4">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${variants[variant]}`}>
          {number}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            {title}
          </h3>
          <div className="text-gray-600 dark:text-gray-300">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente para tips y alertas
export function Alert({ 
  type = "info", 
  children 
}: { 
  type?: "info" | "warning" | "success" | "tip";
  children: React.ReactNode;
}) {
  const styles = {
    info: {
      container: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
      icon: <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      text: "text-blue-800 dark:text-blue-200"
    },
    warning: {
      container: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
      icon: <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />,
      text: "text-yellow-800 dark:text-yellow-200"
    },
    success: {
      container: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
      icon: <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />,
      text: "text-green-800 dark:text-green-200"
    },
    tip: {
      container: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800",
      icon: <Lightbulb className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      text: "text-purple-800 dark:text-purple-200"
    }
  };

  const style = styles[type];

  return (
    <div className={`border rounded-lg p-4 my-4 ${style.container}`}>
      <div className="flex items-start gap-3">
        {style.icon}
        <div className={`flex-1 ${style.text}`}>
          {children}
        </div>
      </div>
    </div>
  );
}

// Componente para tabla de contenidos genérica
export function TableOfContents({ 
  sections 
}: { 
  sections: Array<{ id: string; title: string }>
}) {
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
            className="block text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700/50"
          >
            {section.title}
          </a>
        ))}
      </nav>
    </div>
  );
}

// Badges para categorías y dificultad
export function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const colors = {
    "Básico": "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
    "Intermedio": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
    "Avanzado": "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
  };
  
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[difficulty as keyof typeof colors] || colors.Básico}`}>
      {difficulty}
    </span>
  );
}

export function CategoryBadge({ category }: { category: string }) {
  const colors = {
    "Gestión": "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
    "Operaciones": "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300",
    "Administración": "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
  };
  
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[category as keyof typeof colors] || colors.Gestión}`}>
      {category}
    </span>
  );
}

// Componente para layout de tutorial con header y navegación
export function TutorialLayout({
  title,
  icon,
  backUrl = "/ayuda",
  backText = "Volver al Centro de Ayuda",
  children,
  gradientFrom = "blue-50",
  gradientTo = "indigo-100",
  gradientFromDark = "gray-900",
  gradientToDark = "gray-800"
}: {
  title: string;
  icon: React.ReactNode;
  backUrl?: string;
  backText?: string;
  children: React.ReactNode;
  gradientFrom?: string;
  gradientTo?: string;
  gradientFromDark?: string;
  gradientToDark?: string;
}) {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-${gradientFrom} to-${gradientTo} dark:from-${gradientFromDark} dark:to-${gradientToDark}`}>
      <div className="container mx-auto px-6 py-8">
        {/* Header con navegación */}
        <div className="flex items-center gap-4 mb-6">
          <a 
            href={backUrl}
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="text-sm">{backText}</span>
          </a>
        </div>

        <div className="flex items-center gap-3 mb-8">
          {icon}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
        </div>

        {children}
      </div>
    </div>
  );
}

// Componente para páginas en construcción
export function ConstructionPage({
  title,
  icon,
  description,
  features,
  actionUrl,
  actionText,
  gradientFrom = "purple-50",
  gradientTo = "pink-100"
}: {
  title: string;
  icon: React.ReactNode;
  description: string;
  features: Array<{ title: string; items: string[]; color: string }>;
  actionUrl: string;
  actionText: string;
  gradientFrom?: string;
  gradientTo?: string;
}) {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-${gradientFrom} to-${gradientTo} dark:from-gray-900 dark:to-gray-800`}>
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-12 border border-white/50 dark:border-gray-700/50 shadow-lg max-w-4xl">
            <div className="mb-6">
              {icon}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {title}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto">
              {description}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left">
              {features.map((feature, index) => (
                <div key={index} className={`bg-${feature.color}-50 dark:bg-${feature.color}-900/20 rounded-lg p-4`}>
                  <h4 className={`font-semibold text-${feature.color}-900 dark:text-${feature.color}-200 mb-2`}>
                    {feature.title}
                  </h4>
                  <ul className={`text-sm text-${feature.color}-800 dark:text-${feature.color}-300 space-y-1`}>
                    {feature.items.map((item, itemIndex) => (
                      <li key={itemIndex}>• {item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              <p className="mb-2">⏰ <strong>Fecha estimada de finalización:</strong> Próximas semanas</p>
              <p>Mientras tanto, puedes explorar el módulo directamente en la aplicación.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href={actionUrl}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 justify-center"
              >
                {actionText}
              </a>
              <a 
                href="/ayuda"
                className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 justify-center"
              >
                <ExternalLink className="w-4 h-4" />
                Volver a Ayuda
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}