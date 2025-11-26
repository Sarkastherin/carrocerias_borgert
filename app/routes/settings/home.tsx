import type { Route } from "../+types/home";
import { Settings, Wrench } from "lucide-react";
import { NavGlassCard } from "~/components/GlassCard";
import pkg from "package.json";

const appVersion = pkg.version;

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Parámetros y Configuraciones" },
    { name: "description", content: "Gestión de los parámetros generales" },
  ];
}

export default function ParametrosGenerales() {
  // Configuración de módulos de parámetros (preparado para futuras expansiones)
  const parametersModules = [
    {
      name: "Parámetros Generales",
      description:
        "Gestión de colores, carrozado y puertas traseras. Ítems de control.",
      icon: Settings,
      path: "generales",
    },/* 
    {
      name: "Configuración Avanzada",
      description: "Ajustes avanzados por tipo de carrozados.",
      icon: Wrench,
      path: "carrozados",
    }, */
  ];

  return (
    <div className="min-h-screen relative">
      {/* Hero Background - usando una imagen por defecto, puedes cambiarla */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%), url("/settings-cover.jpg")',
          backgroundBlendMode: "overlay",
        }}
      >
        {/* Overlay para mejorar legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Hero Section */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pt-16 sm:pt-20 pb-8 sm:pb-12">
          {/* Título principal */}
          <div className="text-center mb-8 sm:mb-12 max-w-4xl">
            <div className="mb-6 flex justify-center">
              <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30">
                <Settings className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 font-logo-primary leading-tight">
              Parámetros y Configuraciones
            </h1>
            <p className="text-lg sm:text-xl text-gray-200 font-light px-4">
              Gestiona los parámetros y configuraciones de tu sistema
            </p>
          </div>

          {/* Cards con Glassmorphism */}
          <main className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 px-4 sm:px-0">
            {parametersModules.map((module) => (
              <NavGlassCard
                key={module.name}
                name={module.name}
                path={module.path}
                icon={module.icon}
                description={module.description}
              />
            ))}
          </main>
        </div>

        {/* Footer */}
        <footer className="p-4 sm:p-6 text-gray-300 text-xs text-center backdrop-blur-sm bg-black/20 border-t border-white/10">
          <div className="max-w-4xl mx-auto">
            v{appVersion} — Sistema de Configuraciones Avanzadas
          </div>
        </footer>
      </div>
    </div>
  );
}
