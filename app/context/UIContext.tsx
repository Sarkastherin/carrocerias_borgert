import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
type ThemeProps = "dark" | "light";
type UIContextType = {
  toggleTheme: () => void;
  theme: ThemeProps;
};
const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  // Inicializar con 'light' por defecto para evitar problemas de SSR
  const [theme, setTheme] = useState<ThemeProps>("light");

  // Usar useEffect para detectar el tema preferido después del montaje
  useEffect(() => {
    if (typeof window !== "undefined") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    
    // Verificar que document esté disponible antes de usarlo
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", newTheme);
    }
  };

  return (
    <UIContext.Provider
      value={{
        toggleTheme,
        theme,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (!context) throw new Error("useUI debe usarse dentro de <UIProvider>");
  return context;
}
