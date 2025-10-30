import { useAuth } from "~/context/Auth";
import { useUI } from "~/context/UIContext";
import { useNavigate, NavLink } from "react-router";
import { LogOut, Sun, Moon, HelpCircle } from "lucide-react";
import { LogoComponent } from "./LogoComponent";

export function Header() {
  const { toggleTheme, theme } = useUI();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="w-full flex justify-between items-center px-6 py-4 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 shadow-lg border-b border-white/20 dark:border-gray-700/30">
      <NavLink to={"/"}>
        <LogoComponent />
      </NavLink>
      <div className="flex items-center gap-2 md:gap-4">
        <NavLink
          to="/ayuda"
          className="flex items-center gap-2 px-2 md:px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50/80 dark:hover:bg-blue-900/20 backdrop-blur-sm rounded-lg transition-all duration-200 border border-blue-200/50 dark:border-blue-700/30 hover:border-blue-300/70 dark:hover:border-blue-600/50"
          title="Centro de ayuda"
        >
          <HelpCircle className="w-4 h-4" />
          <span className="hidden md:inline">Ayuda</span>
        </NavLink>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-2 md:px-3 py-2 text-sm text-red-600 dark:text-red-300 hover:bg-red-50/80 dark:hover:bg-red-900/20 backdrop-blur-sm rounded-lg transition-all duration-200 border border-red-200/50 dark:border-red-700/30 hover:border-red-300/70 dark:hover:border-red-600/50"
          title="Cerrar sesión"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden md:inline">Cerrar sesión</span>
        </button>
        <button
          className="flex items-center gap-2 px-2 md:px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100/80 dark:hover:bg-gray-700/50 backdrop-blur-sm rounded-lg transition-all duration-200 border border-gray-200/50 dark:border-gray-600/30 hover:border-gray-300/70 dark:hover:border-gray-500/50"
          onClick={toggleTheme}
          title={theme === "dark" ? "Modo claro" : "Modo oscuro"}
        >
          {theme === "dark" ? <Sun className="w-4 h-4"/> : <Moon className="w-4 h-4"/>}
          <span className="hidden md:inline">{theme === "dark" ? "Modo claro" : "Modo oscuro"}</span>
        </button>
      </div>
    </header>
  );
}
export function Subheader({
  title,
  icon,
  color,
}: {
  title: string;
  icon: React.ReactNode;
  color?: string;
}) {
  return (
    <header className="w-full flex justify-between items-center py-8">
      <h2 className="text-2xl font-semibold flex items-center gap-2">
        {icon}
        {title}
      </h2>
    </header>
  );
}
