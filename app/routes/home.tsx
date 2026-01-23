import type { Route } from "./+types/home";
import { ReceiptText, NotebookTabs, FileCog, Wallet, Banknote } from "lucide-react";
import pkg from "package.json";
import type { CardLinkProps } from "~/components/GlassCard";
import { LogoComponent } from "~/components/LogoComponent";
import { NavGlassCard } from "~/components/GlassCard";
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
export const modules: CardLinkProps[] = [
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
  /* {
    name: "Cuentas Corrientes",
    description: "Gestiona las cuentas corrientes de tus clientes.",
    icon: Wallet,
    path: "administracion/cuentas-corrientes",
  },
  {
    name: "Cheques",
    description: "Gestiona los cheques de tus clientes.",
    icon: Banknote,
    path: "administracion/cheques",
  }, */
];

export default function HomePage() {
  //
  return (
    <div
      className="flex flex-col justify-between relative"
      style={{ minHeight: "calc(100vh - 71px)" }}
    >
      <main className="flex-1 relative flex flex-col items-center justify-center overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="scale-200 mb-4">
              <LogoComponent noTheme />
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-100 font-light px-4 mb-10">
              Sistema de gestión profesional para tu empresa
            </p>
          </div>
          <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-0">
            {modules.map((mod) => {
              return (
                <NavGlassCard
                  key={mod.name}
                  name={mod.name}
                  path={mod.path}
                  icon={mod.icon}
                  description={mod.description}
                />
              );
            })}
          </div>
        </div>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("/cover.jpg")' }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80"></div>
        </div>
      </main>
      <footer className="p-2 sm:p-4 text-text-secondary text-xs text-center backdrop-blur-sm bg-black/20 border-t border-white/10">
        <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center">
          v{appVersion}{" "}
          <span className="-ms-5 scale-60 inline-block">
            <LogoComponent />
          </span>
        </div>
      </footer>
    </div>
  );
}
