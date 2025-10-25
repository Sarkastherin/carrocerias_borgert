import type { Route } from "./+types/home";
import { ReceiptText, NotebookTabs, FileCog } from "lucide-react";
import pkg from "package.json";
import { CardLink } from "~/components/Cards";
import type { CardLinkProps } from "~/components/Cards";
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
    <div className="flex justify-center">
      {/* Main content */}
      <main className="flex-1 w-full max-w-5xl px-6 mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((mod) => (
          <CardLink
            key={mod.name}
            name={mod.name}
            path={mod.path}
            icon={mod.icon}
            description={mod.description}
            variant={mod.variant}
          />
        ))}
      </main>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 p-4 text-gray-400 text-xs w-full text-center">
        v{appVersion} — App Personal de Gestión Freelance
      </footer>
    </div>
  );
}
