import type React from "react";
import type { StatusPedidos } from "~/types/pedidos";

const variants = {
    blue: "bg-blue-200/90 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    dark: "bg-gray-200/90 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    red: "bg-red-200/90 text-red-800 dark:bg-red-900 dark:text-red-300",
    green: "bg-green-200/90 text-green-800 dark:bg-green-900 dark:text-green-300",
    yellow: "bg-yellow-200/90 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    indigo: "bg-indigo-200/90 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
    purple: "bg-purple-200/90 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    pink: "bg-pink-200/90 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
    orange: "bg-orange-200/90 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  };

export function Badge({
  variant,
  children,
}: {
  variant: keyof typeof variants;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`text-xs font-medium px-2.5 py-0.5 rounded-sm ${variants[variant]}`}
    >
      {children}
    </span>
  );
}
export function BadgeStatus({
  status,
  children,
}: {
  status: StatusPedidos;
  children: React.ReactNode;
}) {
  //Crear una función switch para asignar el variant según el status
  const variant = () => {
    switch (status) {
      case "nuevo":
        return "purple";
      case "en_produccion":
        return "yellow";
      case "finalizado":
        return "blue";
      case "entregado":
        return "green";
      case "cancelado":
        return "red";
      default:
        return "dark";
    }
  };
  return (
    <Badge variant={variant()}>{children}</Badge>
  );
}