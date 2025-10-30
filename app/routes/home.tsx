import type { Route } from "./+types/home";
import { ReceiptText, NotebookTabs, FileCog } from "lucide-react";
import { Link } from "react-router";
import pkg from "package.json";
import { CardLink } from "~/components/Cards";
import type { CardLinkProps } from "~/components/Cards";
import { LogoComponent } from "~/components/LogoComponent";
const appVersion = pkg.version;


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Menú" },
    {
      name: "description",
      content: "Bienvenido al sistema de carrocerías Borgert",
    },
  ];
}

export default function HomePage() {
  const modules: CardLinkProps[] = [
    {
      name: "Pedidos",
      description: "Gestiona tus pedidos y controla tus avances.",
      icon: ReceiptText,
      path: "/pedidos",
      variant: "blue",
    },
    {
      name: "Clientes",
      description: "Organiza tus clientes y gestiona su información.",
      icon: NotebookTabs,
      path: "/clientes",
      variant: "green",
    },
    {
      name: "Parametros",
      description: "Gestiona los parametros y configuraciones.",
      icon: FileCog,
      path: "/settings",
      variant: "yellow",
    },
  ];

  return (
    <div className="min-h-screen relative">
      {/* Hero Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/cover.jpg")' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Hero Section */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pt-16 sm:pt-20 pb-8 sm:pb-12">
          {/* Título principal */}
          <div className="text-center mb-8 sm:mb-12 max-w-4xl">
            <h1 className="scale-200 mb-4">
              <LogoComponent noTheme/>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-100 font-light px-4">
              Sistema de gestión profesional para tu empresa
            </p>
          </div>

          {/* Cards con Glassmorphism */}
          <main className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-0">
            {modules.map((mod) => {
              const IconComponent = mod.icon;
              return (
                <Link
                  key={mod.name}
                  to={mod.path}
                  className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-5 sm:p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-3xl group min-h-[160px] sm:min-h-[180px]"
                >
                  <div className="flex flex-col items-start h-full">
                    <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 rounded-xl bg-white/20 backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-semibold text-white mb-2 group-hover:text-gray-100 transition-colors">
                      {mod.name}
                    </h2>
                    <p className="text-sm text-gray-200 group-hover:text-gray-100 transition-colors leading-relaxed flex-1">
                      {mod.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </main>
        </div>

        {/* Footer */}
        <footer className="p-2 sm:p-4 text-gray-300 text-xs text-center backdrop-blur-sm bg-black/20 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center">
            v{appVersion} <span className="-ms-5 scale-60 inline-block"><LogoComponent noTheme/></span>
          </div>
        </footer>
      </div>
    </div>
  );
}
