import { Link } from "react-router";
import type { LucideProps } from "lucide-react";
type IconType = React.ForwardRefExoticComponent<
  Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
>;
export type CardLinkProps = {
  name: string;
  path: string;
  icon: IconType;
  description: string;
  variant: keyof typeof variants;
};
export const variants = {
  blue: "bg-blue-100 text-blue-700 hover:bg-blue-200/60 dark:bg-blue-950/80 dark:hover:bg-blue-900 dark:text-blue-400",
  green: "bg-green-100 text-green-700 hover:bg-green-200/60 dark:bg-green-950/80 dark:hover:bg-green-900 dark:text-green-400",
  red: "bg-red-100 text-red-700 hover:bg-red-200/60 dark:bg-red-950/80 dark:hover:bg-red-900 dark:text-red-400",
  yellow: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200/60 dark:bg-yellow-950/80 dark:hover:bg-yellow-900 dark:text-yellow-400",
  purple: "bg-purple-100 text-purple-700 hover:bg-purple-200/60 dark:bg-purple-950/80 dark:hover:bg-purple-900 dark:text-purple-400",
  cyan: "bg-cyan-100 text-cyan-700 hover:bg-cyan-200/60 dark:bg-cyan-950/80 dark:hover:bg-cyan-900 dark:text-cyan-400",
  pink: "bg-pink-100 text-pink-700 hover:bg-pink-200/60 dark:bg-pink-950/80 dark:hover:bg-pink-900 dark:text-pink-400",
  teal: "bg-teal-100 text-teal-700 hover:bg-teal-200/60 dark:bg-teal-950/80 dark:hover:bg-teal-900 dark:text-teal-400",
  
};
export const CardLink = ({
  name,
  path,
  icon,
  description,
  variant,
}: CardLinkProps) => {
  const getIcon = () => {
    const IconComponent: IconType = icon;
    return <IconComponent className="w-6 h-6" />;
  };
  return (
    <Link
      key={name}
      to={path}
      className={`rounded-2xl shadow-sm p-6 flex flex-col items-start transition ${variants[variant]}`}
    >
      <div className="mb-3">{getIcon()}</div>
      <h2 className="text-lg font-semibold">{name}</h2>
      <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
        {description}
      </p>
    </Link>
  );
};
