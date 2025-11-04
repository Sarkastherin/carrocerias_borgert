import type { Route } from "./+types/home";
import { ReceiptText, NotebookTabs, FileCog } from "lucide-react";
import pkg from "package.json";
import type { CardLinkProps } from "~/components/Cards";
import { LogoComponent } from "~/components/LogoComponent";
import { CardLink } from "~/components/Cards";
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
    },
    {
      name: "Clientes",
      description: "Organiza tus clientes y gestiona su información.",
      icon: NotebookTabs,
      path: "/clientes",
    },
    {
      name: "Parametros",
      description: "Gestiona los parametros y configuraciones.",
      icon: FileCog,
      path: "/settings",
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
              <LogoComponent noTheme />
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
                <CardLink
                  key={mod.name}
                  name={mod.name}
                  path={mod.path}
                  icon={IconComponent}
                  description={mod.description}
                />
              );
            })}
          </main>
        </div>

        {/* Footer */}
        <footer className="p-2 sm:p-4 text-gray-300 text-xs text-center backdrop-blur-sm bg-black/20 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center">
            v{appVersion}{" "}
            <span className="-ms-5 scale-60 inline-block">
              <LogoComponent noTheme />
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
