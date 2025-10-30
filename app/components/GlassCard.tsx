import { cn } from "../utils/cn";

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
export function AuthGlassCard({ children, className }: { children: React.ReactNode; className?: string }) {
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

// Componente para cards de navegación en home
export function NavGlassCard({ 
  children, 
  className,
  onClick 
}: { 
  children: React.ReactNode; 
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-5 sm:p-6",
        "hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-3xl group",
        "min-h-[180px] sm:min-h-[200px] cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}