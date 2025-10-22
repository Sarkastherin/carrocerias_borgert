import type { Route } from "./+types/home";
import { Link } from "react-router";
import { ReceiptText, NotebookTabs, FileCog } from "lucide-react";
import pkg from "package.json";
const appVersion = pkg.version;

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Menú" },
    { name: "description", content: "Bienvenido al sistema de carrocerías Borgert" },
  ];
}

export default function HomePage() {
  const modules = [
    {
      name: "Pedidos",
      description: "Gestiona tus pedidos y controla tus avances.",
      icon: <ReceiptText className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      path: "/pedidos",
      color:
        "bg-blue-100/80 hover:bg-blue-200/60 dark:bg-blue-950 dark:hover:bg-blue-900",
    },
    {
      name: "Clientes",
      description: "Organiza tus clientes y gestiona su información.",
      icon: (
        <NotebookTabs className="w-6 h-6 text-green-600 dark:text-green-400" />
      ),
      path: "/clientes",
      color:
        "bg-green-100/80 hover:bg-green-200/60 dark:bg-green-950 dark:hover:bg-green-900",
    },
    {
      name: "Parametros",
      description: "Gestiona los parametros y configuraciones.",
      icon: (
        <FileCog className="w-6 h-6 text-purple-600 dark:text-purple-400" />
      ),
      path: "/parametros",
      color:
        "bg-purple-100/80 hover:bg-purple-200/60 dark:bg-purple-950 dark:hover:bg-purple-900",
    },
  ];

  return (
    <div className="flex justify-center">
      {/* Main content */}
      <main className="flex-1 w-full max-w-5xl p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((mod) => (
          <Link
            key={mod.name}
            to={mod.path}
            className={`rounded-2xl shadow-sm p-6 flex flex-col items-start transition ${mod.color}`}
          >
            <div className="mb-3">{mod.icon}</div>
            <h2 className="text-lg font-semibold">{mod.name}</h2>
            <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
              {mod.description}
            </p>
          </Link>
        ))}
      </main>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 p-4 text-gray-400 text-xs w-full text-center">
        v{appVersion} — App Personal de Gestión Freelance
      </footer>
    </div>
  );
}
