import { useEffect } from "react";
import type { Route } from "./+types/home";
import { useNavigate } from "react-router";
import { useAuth } from "~/context/Auth";
import { Button } from "~/components/Buttons";


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
            <svg
              className="w-8 h-8 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Carrocerías Borgert
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

          <Button
            onClick={getAuth}
          >
            Iniciar sesión con Google
          </Button>

          <p className="text-xs text-gray-500">
            Tu información está protegida y segura
          </p>
        </div>
      </div>
    </div>
  );
}
