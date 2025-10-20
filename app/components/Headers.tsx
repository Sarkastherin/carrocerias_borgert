import { useAuth } from "~/context/Auth";
import { useUI } from "~/context/UIContext";
import { useNavigate } from "react-router";

export function Header() {
  const { toggleTheme, theme } = useUI();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 w-full flex justify-between items-center p-6 dark:bg-gray-800 bg-white shadow-md">
      <h1 className="text-2xl font-semibold ">Carrocerías Borgert</h1>
      <div className="flex items-center gap-4">
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 dark:text-red-300 hover:bg-light rounded-lg px-2 py-1"
        >
          🚪 Cerrar sesión
        </button>
        <button className="text-sm hover:bg-light rounded-lg px-2 py-1">
          ⚙️ Configuración
        </button>
        <button
          className="text-sm hover:bg-light rounded-lg px-2 py-1"
          onClick={toggleTheme}
        >
          {theme === "dark" ? "🌞 Modo claro" : "🌙 Modo oscuro"}
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
    <header className="w-full flex justify-between items-center p-6">
      <h2 className="text-2xl font-semibold flex items-center gap-2">
        {icon}
        {title}
      </h2>
    </header>
  );
}
