import { PaintBucket, Truck, Package, DoorOpen } from "lucide-react";

// Mapeo de iconos disponibles
export const iconMap = {
  PaintBucket: PaintBucket,
  Truck: Truck,
  Package: Package,
  DoorOpen: DoorOpen,
} as const;

// Función para obtener el componente de icono
export const getIcon = (iconName: keyof typeof iconMap) => {
  const IconComponent = iconMap[iconName];
  return <IconComponent className="w-4 h-4" />;
};