import { useEffect } from "react";
import type { Route } from "./+types/home";
import { useNavigate } from "react-router";
import { useAuth } from "~/context/Auth";
import { AuthGlassCard } from "~/components/GlassCard";
import { LogoComponent } from "~/components/LogoComponent";
import PaintRollerIcon from "~/components/PaintRollerIcon";

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
    <div className="min-h-screen relative">
      {/* Hero Background - Overlay más sutil */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/cover.jpg")' }}
      >
        {/* Overlay más sutil para mejor contraste */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/60 to-black/70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <AuthGlassCard>
          <div className="mb-8">
            {/* Logo con mejor contraste */}
            <div className="w-16 h-16 backdrop-blur-sm bg-white/30 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/40 shadow-lg">
              <PaintRollerIcon size={38} color="#ffffff" />
            </div>

            {/* Título */}
            <h1 className="px-2 pb-4 scale-180">
              <LogoComponent noTheme />
            </h1>

            <p className="text-gray-300 text-lg font-light">
              Organiza tus procesos de manera eficiente
            </p>
          </div>

          <div className="space-y-6">
            <div className="backdrop-blur-sm bg-white/10 rounded-xl p-4 border border-white/20">
              <p className="text-sm text-gray-300 mb-3 font-medium">
                Inicia sesión para acceder a:
              </p>
              <ul className="text-sm text-gray-300 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full"></span>
                  Gestión de pedidos
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full"></span>
                  Listado de Clientes
                </li>
              </ul>
            </div>

            {/* Botón modernizado */}
            <div className="pt-2">
              <button
                onClick={getAuth}
                className="w-full backdrop-blur-sm bg-[var(--color-primary)]/90 hover:bg-[var(--color-primary-hover)] border border-[var(--color-primary)] hover:border-[var(--color-primary-hover)] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                Iniciar sesión con Google
              </button>
            </div>

            <p className="text-xs text-gray-400">
              Tu información está protegida y segura
            </p>
          </div>
        </AuthGlassCard>
      </div>
    </div>
  );
}
