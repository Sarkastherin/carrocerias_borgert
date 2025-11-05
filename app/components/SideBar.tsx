import { useState } from "react";
import { Menu, X } from "lucide-react";
export default function SideBar({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  return (
    <div
      className={`z-20 flex flex-col justify-between border-e border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 transition-all duration-300 ease-in-out relative ${
        sidebarOpen ? "w-64" : "w-16"
      }`}
    >
      {/* Botón toggle integrado en el sidebar */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-4 z-30 p-1.5 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-full shadow-md hover:shadow-lg transition-all duration-300 ease-in-out"
        aria-label={sidebarOpen ? "Contraer sidebar" : "Expandir sidebar"}
      >
        {sidebarOpen ? (
          <X className="size-4 text-gray-600 dark:text-gray-400" />
        ) : (
          <Menu className="size-4 text-gray-600 dark:text-gray-400" />
        )}
      </button>

      {children}
    </div>
  );
}
