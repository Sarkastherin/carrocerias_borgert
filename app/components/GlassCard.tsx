import { cn } from "../utils/cn";
import type { IconType } from "./IconComponent";
import { getIcon } from "./IconComponent";
import { Link } from "react-router";
export interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  blur?: "sm" | "md" | "lg" | "xl";
  opacity?: "low" | "medium" | "high";
  padding?: "sm" | "md" | "lg" | "xl";
  centered?: boolean;
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

const blurClasses = {
  sm: "backdrop-blur-sm",
  md: "backdrop-blur-md",
  lg: "backdrop-blur-lg",
  xl: "backdrop-blur-xl",
};

const opacityClasses = {
  low: "bg-white/10 border-white/20",
  medium: "bg-white/20 border-white/30",
  high: "bg-white/30 border-white/40",
};

const paddingClasses = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8 sm:p-10",
  xl: "p-10 sm:p-12",
};

export function GlassCard({
  children,
  className,
  size = "lg",
  blur = "xl",
  opacity = "medium",
  padding = "lg",
  centered = false,
}: GlassCardProps) {
  return (
    <div
      className={cn(
        // Base styles
        "border rounded-2xl shadow-xl w-full",
        // Dynamic styles
        sizeClasses[size],
        blurClasses[blur],
        opacityClasses[opacity],
        paddingClasses[padding],
        // Conditional centering
        centered && "text-center",
        // Custom className
        className
      )}
    >
      {children}
    </div>
  );
}

// Componente especializado para login/auth
export function AuthGlassCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <GlassCard
      size="lg"
      blur="xl"
      opacity="medium"
      padding="lg"
      centered={true}
      className={className}
    >
      {children}
    </GlassCard>
  );
}
export type CardLinkProps = {
  name: string;
  path: string;
  icon: IconType;
  description: string;
};

// Componente para cards de navegación en home
export function NavGlassCard({ name, path, icon, description }: CardLinkProps) {
  const IconComponent = getIcon({ icon, size: 6, color: "text-white" });
  return (
    <Link to={path} className="block group">
      <GlassCard
        size="md"
        blur="lg"
        opacity="low"
        padding="md"
        className="hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl min-h-[160px] sm:min-h-[180px]"
      >
        <div className="flex flex-col items-start h-full">
          <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 rounded-xl bg-white/20 backdrop-blur-sm group-hover:bg-white/30 transition-colors">
            {IconComponent}
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-2 group-hover:text-gray-100 transition-colors">
            {name}
          </h2>
          <p className="text-sm text-gray-200 group-hover:text-gray-100 transition-colors leading-relaxed flex-1">
            {description}
          </p>
        </div>
      </GlassCard>
    </Link>
  );
}
export type ConfigCardProps = {
  name: string;
  path: string;
  icon: IconType;
  description?: string;
  imageUrl?: string;
};

// Componente para cards de configuración con imagen opcional
export function ConfigGlassCard({
  name,
  path,
  icon,
  description,
  imageUrl,
}: ConfigCardProps) {
  const IconComponent = getIcon({ icon, size: 8, color: "text-gray-800 dark:text-white" });

  return (
    <Link to={path} className="block group">
      <GlassCard
        size="md"
        blur="lg"
        opacity="low"
        padding="sm"
        className="!border-gray-300/80 dark:!border-white/20 hover:bg-gray-100/50 dark:hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden"
      >
        <div className="flex flex-col h-full">
          {/* Imagen o Ícono predeterminado */}
          <div className="relative w-full h-32 sm:h-40 mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-gray-200/50 to-gray-300/50 dark:from-white/10 dark:to-white/5">
            {imageUrl ? (
              <>
                <img
                  src={imageUrl}
                  alt={name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="p-4 rounded-xl bg-gray-300/60 dark:bg-white/20 backdrop-blur-sm group-hover:bg-gray-400/70 dark:group-hover:bg-white/30 transition-colors">
                  {IconComponent}
                </div>
              </div>
            )}
          </div>

          {/* Contenido */}
          <div className="px-2 pb-2 flex flex-col flex-1">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-gray-700 dark:group-hover:text-gray-100 transition-colors">
              {name}
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-200 group-hover:text-gray-600 dark:group-hover:text-gray-100 transition-colors leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </GlassCard>
    </Link>
  );
}
