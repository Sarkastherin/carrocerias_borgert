import { useAuth } from "~/context/Auth";
import { useUI } from "~/context/UIContext";
import { useNavigate, NavLink } from "react-router";
import {
  LogOut,
  Sun,
  Moon,
  HelpCircle,
  ArrowLeft,
  Menu,
  Users,
  Package,
  Settings,
} from "lucide-react";
import { LogoComponent } from "./LogoComponent";
import type { IconType } from "./IconComponent";
import { getIcon } from "./IconComponent";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Z_INDEX } from "~/config/zIndexConfig";
import { modules } from "~/routes/home";
export function Header() {
  const { toggleTheme, theme } = useUI();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleMenu = () => {
    if (!isMenuOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 8,
        left: rect.left,
      });
    }
    setIsMenuOpen(!isMenuOpen);
  };

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedOnButton =
        buttonRef.current && buttonRef.current.contains(target);
      const clickedOnMenu =
        document.querySelector("[data-dropdown-menu]") &&
        document.querySelector("[data-dropdown-menu]")!.contains(target);

      if (!clickedOnButton && !clickedOnMenu) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);
  return (
    <header className="w-full flex justify-between items-center px-6 py-4 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 shadow-lg border-b border-white/20 dark:border-gray-700/30">
      <div className="flex items-center gap-4">
        <NavLink to={"/"}>
          <LogoComponent />
        </NavLink>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Menú desplegable */}
        <div className="relative" ref={menuRef}>
          <button
            ref={buttonRef}
            onClick={toggleMenu}
            className="flex items-center gap-2 px-2 md:px-3 py-2 text-sm text-primary-700 dark:text-primary-200 hover:bg-primary-100/80 dark:hover:bg-primary-700/50 backdrop-blur-sm rounded-lg transition-all duration-200 border border-primary-200/50 dark:border-primary-600/30 hover:border-primary-300/70 dark:hover:border-primary-500/50"
            title="Menú principal"
          >
            <Menu className="w-4 h-4" />
            <span className="hidden md:inline">Menú</span>
          </button>

          {/* Dropdown menu */}
          {isMenuOpen &&
            createPortal(
              <div
                data-dropdown-menu
                className="fixed w-48 backdrop-blur-lg bg-white/95 dark:bg-slate-950/50 shadow-xl border border-white/20 dark:border-slate-700/30 rounded-lg overflow-hidden"
                style={{
                  top: `${menuPosition.top}px`,
                  left: `${menuPosition.left}px`,
                  zIndex: Z_INDEX.DROPDOWN,
                }}
              >
                {modules.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={(e) => {
                      // Permitir que la navegación ocurra primero, luego cerrar menú
                      setTimeout(() => setIsMenuOpen(false), 100);
                    }}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200 hover:bg-gray-100/80 dark:hover:bg-primary-900/20 ${
                        isActive
                          ? "text-primary-600 dark:text-primary-400 bg-primary-50/80 dark:bg-primary-900/20"
                          : "text-gray-700 dark:text-gray-200"
                      }`
                    }
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </NavLink>
                ))}
              </div>,
              document.body
            )}
        </div>
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
          {theme === "dark" ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
          <span className="hidden md:inline">
            {theme === "dark" ? "Modo claro" : "Modo oscuro"}
          </span>
        </button>
      </div>
    </header>
  );
}
export function Subheader({
  title,
  icon,
  back_path,
}: {
  title: string;
  icon: { component: IconType; color: string };
  back_path?: string;
}) {
  const IconComponent = getIcon({
    icon: icon.component,
    size: 6,
    color: icon.color,
  });
  return (
    <header className="w-full flex justify-between items-center py-8">
      <div className="flex items-center gap-3">
        {back_path && (
          <NavLink
            to={back_path}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-purple-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200"
            title="Volver"
          >
            <ArrowLeft className="w-5 h-5" />
          </NavLink>
        )}
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          {IconComponent}
          {title}
        </h2>
      </div>
    </header>
  );
}
