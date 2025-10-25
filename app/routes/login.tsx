import { useEffect } from "react";
import type { Route } from "./+types/home";
import { useNavigate } from "react-router";
import { useAuth } from "~/context/Auth";
import { Button } from "~/components/Buttons";
import { LayoutPanelTop } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Autenticación" },
    { name: "description", content: "Página de autenticación" },
  ];
}

export default function Login() {
  const { getAuth, auth } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (auth) {
      navigate("/");
    }
  }, [auth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-300">
      <div className="text-center bg-white p-10 rounded-2xl shadow-xl max-w-lg w-full mx-4">
        <div className="mb-8">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LayoutPanelTop className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="font-logo-primary text-4xl font-bold px-2 pb-4">
            Truck
            <span className="font-logo-secondary font-semibold italic text-indigo-600 dark:text-indigo-400">
              Flow
            </span>
          </h1>

          <p className="text-gray-600 text-lg">
            Organiza tus procesos de manera eficiente
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-500 mb-3">
              Inicia sesión para acceder a:
            </p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Gestión de pedidos</li>
              <li>• Listado de Clientes</li>
            </ul>
          </div>

          <Button onClick={getAuth}>Iniciar sesión con Google</Button>

          <p className="text-xs text-gray-500">
            Tu información está protegida y segura
          </p>
        </div>
      </div>
    </div>
  );
}
