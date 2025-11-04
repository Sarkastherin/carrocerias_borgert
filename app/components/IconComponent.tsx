import type { LucideProps } from "lucide-react";
export type IconType = React.ForwardRefExoticComponent<
  Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
>;
export const getIcon = ({icon, size, color}: {icon: IconType, size?: number, color?: string}) => {
  const IconComponent: IconType = icon;
  return <IconComponent className={`w-${size || 6} h-${size || 6} ${color ? color : ''}`} />;
};
