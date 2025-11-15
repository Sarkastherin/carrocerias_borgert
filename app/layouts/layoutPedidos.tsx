import { Outlet, NavLink, useParams, useNavigate } from "react-router";
import {
  FolderOpenDotIcon,
  Truck,
  Drill,
  LayoutPanelTop,
  Menu,
  X,
  ArrowLeft,
  FileBox,
  ShieldCheck
} from "lucide-react";
import { useEffect, useState } from "react";
import { useData } from "~/context/DataContext";
import LoadingComponent from "~/components/LoadingComponent";
import { BadgeStatus } from "~/components/Badge";
import { Button } from "~/components/Buttons";
import { useUIModals } from "~/context/ModalsContext";
import type { IconType } from "~/components/IconComponent";
import { getIcon } from "~/components/IconComponent";

export default function PedidosLayout() {
  const navigate = useNavigate();
  const { showConfirmation } = useUIModals();
  const { pedidoId } = useParams();
  const { getPedidoById, pedido, deletePedidoById } = useData();
  const [isDeleting, setIsDeleting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleDeletePedido = async () => {
    if (!pedido || !pedidoId) return;

    showConfirmation(
      `¿Estás seguro de que deseas eliminar el pedido ${pedido.numero_pedido}? Esta acción no se puede deshacer y eliminará todos los datos asociados.`,
      async () => {
        try {
          setIsDeleting(true);
          await deletePedidoById(pedidoId);
          navigate("/pedidos");
        } catch (error) {
          console.error("Error eliminando pedido:", error);
        } finally {
          setIsDeleting(false);
        }
      },
      {
        title: "Eliminar Pedido",
        confirmText: "Eliminar",
        cancelText: "Cancelar",
      }
    );
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  useEffect(() => {
    if (pedidoId) getPedidoById(pedidoId);
  }, []);

  const menuItems = (id: string | undefined) => {
    if (!id) return [];
    return [
      {
        title: "Pedido",
        href: `/pedidos/info/${id}`,
        icon: FolderOpenDotIcon,
      },
      {
        title: "Camión",
        href: `/pedidos/camion/${id}`,
        icon: Truck,
      },
      {
        title: "Carrocería",
        href: `/pedidos/carroceria/${id}`,
        icon: LayoutPanelTop,
      },
      {
        title: "Trabajo en Chasis",
        href: `/pedidos/trabajo-chasis/${id}`,
        icon: Drill,
      },
      /* {
        title: "Órdenes de Trabajo",
        href: `/pedidos/ordenes-trabajo/${id}`,
        icon: FileBox,
      },
      {
        title: "Controles de Calidad",
        href: `/pedidos/controles-calidad/${id}`,
        icon: ShieldCheck,
      } */
    ];
  };
  const menu = menuItems(pedidoId);

  useEffect(() => {
    getPedidoById(pedidoId || "");
  }, []);

  return (
    <div className="flex" style={{ minHeight: "calc(100vh - 67px)" }}>
      {pedido ? (
        <>
          {/* Sidebar */}
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

            <div className={`${sidebarOpen ? "px-4" : "px-2"}`}>
              {sidebarOpen && (
                <>
                  <span className="flex items-center gap-3 font-bold text-text-secondary bg-primary-100 dark:bg-gray-700/50 rounded-md mt-2">
                    <NavLink
                      to={"/pedidos"}
                      className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-primary-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200"
                      title="Volver"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </NavLink>
                    {pedido.numero_pedido}
                  </span>
                </>
              )}
              <ul
                className={`${sidebarOpen ? "mt-6 space-y-1" : "mt-16 space-y-2"}`}
              >
                {menu.map((item) => {
                  const IconComponent = getIcon({
                    icon: item.icon as IconType,
                    size: 4,
                  });
                  return (
                    <li key={item.title}>
                      <NavLink
                        className={({ isActive }) =>
                          `block rounded-lg ${sidebarOpen ? "px-4 py-2" : "px-3 py-3"} text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-[var(--color-primary-muted)] dark:hover:bg-slate-800 hover:text-primary-light ${
                            isActive
                              ? "bg-[var(--color-primary-muted)] dark:bg-slate-800 text-primary-light"
                              : ""
                          }`
                        }
                        to={item.href}
                        title={!sidebarOpen ? item.title : undefined}
                      >
                        {sidebarOpen ? (
                          <div className="flex items-center gap-2">
                            {IconComponent}
                            {item.title}
                          </div>
                        ) : (
                          <div className="flex justify-center">
                            {IconComponent}
                          </div>
                        )}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
            {sidebarOpen && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-sm text-text-secondary">
                  Estado:{" "}
                  <span className="font-medium text-text-primary">
                    {
                      <BadgeStatus status={pedido.status}>
                        {pedido.status.slice(0, 1).toUpperCase() +
                          pedido.status.replaceAll("_", " ").slice(1)}
                      </BadgeStatus>
                    }
                  </span>
                </span>
                {/* Zona de peligro */}
                <div className="mt-6 p-3 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/20">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <h4 className="text-sm font-semibold text-red-700 dark:text-red-400">
                      Zona de Peligro
                    </h4>
                  </div>
                  <p className="text-xs text-red-600 dark:text-red-300 mb-3 leading-relaxed">
                    Una vez eliminado, este pedido y todos sus datos asociados
                    se perderán permanentemente.
                  </p>
                  <Button
                    type="button"
                    variant="red"
                    size="sm"
                    onClick={handleDeletePedido}
                    disabled={isDeleting}
                    className="w-full text-xs"
                  >
                    {isDeleting ? "Eliminando..." : "Eliminar Pedido"}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Overlay para móvil cuando el sidebar está abierto */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
              onClick={toggleSidebar}
            />
          )}

          {/* Contenido principal */}
          <div className="flex-1 z-0">
            <Outlet />
          </div>
        </>
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <LoadingComponent content="Cargando proyecto..." />
        </div>
      )}
    </div>
  );
}
