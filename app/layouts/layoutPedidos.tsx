import {
  Outlet,
  NavLink,
  useParams,
  useOutletContext,
  href,
} from "react-router";
import { FolderOpenDotIcon, ClipboardList, Drill, Wrench } from "lucide-react";
import { useEffect } from "react";
import { useData } from "~/context/DataContext";

type MenuLinkProps = {
  to: string;
  children: React.ReactNode;
};
export default function PedidosLayout() {
  const { pedidoId } = useParams();
  const { getPedidoById, pedido } = useData();
  useEffect(() => {
    if (pedidoId) getPedidoById(pedidoId);
  }, []);

  const menuItems = (id: string | undefined) => {
    if (!id) return [];
    return [
      {
        title: "Pedido",
        href: `/pedidos/info/${id}`,
        icon: <FolderOpenDotIcon className="size-4" />,
      },
      {
        title: "Fabricación",
        href: `/pedidos/fabricacion/${id}`,
        icon: <Drill className="size-4" />,
      },
      {
        title: "Servicios",
        href: `/pedidos/servicios/${id}`,
        icon: <Wrench className="size-4" />,
      },
    ];
  };
  const menu = menuItems(pedidoId);
  const MenuLink = ({ to, children }: MenuLinkProps) => {
    return (
      <NavLink
        className={({ isActive }) =>
          `block rounded-lg px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-indigo-100 dark:hover:bg-slate-800 hover:text-primary-light ${
            isActive ? "bg-indigo-100 dark:bg-slate-800 text-primary-light" : ""
          }`
        }
        to={to}
      >
        {children}
      </NavLink>
    );
  };
  useEffect(() => {
    getPedidoById(pedidoId || "");
  }, []);
  return (
    <div className="flex h-screen">
      {pedido ? (
        <>
          <div className="flex h-screen flex-col justify-between border-e border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700/20">
            <div className="px-4">
              <div className="text-center mt-4">
                <span className="text-text-secondary text-sm font-bold">
                  {pedido.numero_pedido}
                </span>
              </div>
              <ul className="mt-6 space-y-1">
                {menu.map((item) => (
                  <li key={item.title}>
                    <MenuLink to={item.href}>
                      <div className="flex items-center gap-2">
                        {item.icon}
                        {item.title}
                      </div>
                    </MenuLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <Outlet />
        </>
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-gray-500">Cargando proyecto...</p>
        </div>
      )}
    </div>
  );
}
