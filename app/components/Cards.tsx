import { Link } from "react-router";
import type { IconType } from "./IconComponent";
import { getIcon } from "./IconComponent";
export type CardLinkProps = {
  name: string;
  path: string;
  icon: IconType;
  description: string;
};
export const CardLink = ({
  name,
  path,
  icon,
  description,
}: CardLinkProps) => {
  return (
    <Link
      key={name}
      to={path}
      className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-5 sm:p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-3xl group min-h-[160px] sm:min-h-[180px]"
    >
      <div className="flex flex-col items-start h-full">
        <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 rounded-xl bg-white/20 backdrop-blur-sm group-hover:bg-white/30 transition-colors">
          {getIcon({ icon, size: 6 })}
        </div>
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-2 group-hover:text-gray-100 transition-colors">
          {name}
        </h2>
        <p className="text-sm text-gray-200 group-hover:text-gray-100 transition-colors leading-relaxed flex-1">
          {description}
        </p>
      </div>
    </Link>
  );
};
