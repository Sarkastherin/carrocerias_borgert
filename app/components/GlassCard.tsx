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
        "border rounded-2xl shadow-2xl w-full",
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
    <Link
      key={name}
      to={path}
      className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-5 sm:p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-3xl group min-h-[160px] sm:min-h-[180px]"
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
    </Link>
  );
}
