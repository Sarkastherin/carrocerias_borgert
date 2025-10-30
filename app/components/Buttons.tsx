import { PlusIcon } from "lucide-react";
import type { JSX, ButtonHTMLAttributes } from "react";
import { NavLink } from "react-router";
import type { NavLinkProps } from "react-router";
import { COLOR_TOKENS, CSS_CLASSES } from "~/config/colorSystem";

// Variantes mejoradas usando el nuevo sistema de tokens
export const variants = {
  // Botón primario usando tokens semánticos
  primary: `text-[${COLOR_TOKENS.BUTTON_PRIMARY_TEXT}] bg-[${COLOR_TOKENS.BUTTON_PRIMARY}] hover:bg-[${COLOR_TOKENS.BUTTON_PRIMARY_HOVER}] active:bg-[${COLOR_TOKENS.BUTTON_PRIMARY_ACTIVE}] disabled:bg-[${COLOR_TOKENS.BUTTON_PRIMARY_DISABLED}] focus:ring-[${COLOR_TOKENS.PRIMARY_FOCUS}]`,
  
  // Variantes de estado usando tokens semánticos
  success: `text-white bg-[${COLOR_TOKENS.SUCCESS}] hover:bg-green-hover focus:ring-green-focus`,
  warning: `text-zinc-800 bg-[${COLOR_TOKENS.WARNING}] hover:bg-yellow-hover focus:ring-yellow-focus`,
  error: `text-white bg-[${COLOR_TOKENS.ERROR}] hover:bg-red-hover focus:ring-red-focus`,
  info: `text-white bg-[${COLOR_TOKENS.INFO}] hover:bg-[${COLOR_TOKENS.PRIMARY_HOVER}] focus:ring-[${COLOR_TOKENS.PRIMARY_FOCUS}]`,
  
  // Otros colores (mantener para compatibilidad)
  blue: "text-white bg-blue hover:bg-blue-hover focus:ring-blue-focus",
  green: "text-white bg-green hover:bg-green-hover focus:ring-green-focus",
  red: "text-white bg-red hover:bg-red-hover focus:ring-red-focus",
  yellow: "text-zinc-800 bg-yellow hover:bg-yellow-hover focus:ring-yellow-focus",
  purple: "text-white bg-purple hover:bg-purple-hover focus:ring-purple-focus",
  
  // Variantes de superficie
  light: `text-[${COLOR_TOKENS.TEXT_PRIMARY}] bg-[${COLOR_TOKENS.SURFACE}] border border-[${COLOR_TOKENS.BORDER}] hover:bg-slate-100 focus:ring-slate-100 dark:bg-slate-800 dark:text-white dark:border-slate-600 dark:hover:bg-slate-700 dark:hover:border-slate-600 dark:focus:ring-slate-700`,
  dark: "text-white bg-stone-800 hover:bg-stone-800 focus:ring-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 dark:focus:ring-stone-700 dark:border-stone-700",
  
  // Variantes outline usando tokens semánticos
  outlinePrimary: `text-[${COLOR_TOKENS.PRIMARY}] hover:text-[${COLOR_TOKENS.BUTTON_PRIMARY_TEXT}] border border-[${COLOR_TOKENS.PRIMARY}] hover:bg-[${COLOR_TOKENS.BUTTON_PRIMARY_HOVER}] focus:ring-[${COLOR_TOKENS.PRIMARY_FOCUS}]`,
  outlineSuccess: `text-[${COLOR_TOKENS.SUCCESS}] hover:text-white border border-[${COLOR_TOKENS.SUCCESS}] hover:bg-green-hover focus:ring-green-focus`,
  outlineWarning: `text-[${COLOR_TOKENS.WARNING}] hover:text-white border border-[${COLOR_TOKENS.WARNING}] hover:bg-yellow-hover focus:ring-yellow-focus`,
  outlineError: `text-[${COLOR_TOKENS.ERROR}] hover:text-white border border-[${COLOR_TOKENS.ERROR}] hover:bg-red-hover focus:ring-red-focus`,
  
  // Mantener variantes legacy para compatibilidad
  outlineBlue: "text-blue hover:text-white border border-blue hover:bg-blue-hover focus:ring-blue-focus",
  outlineGreen: "text-green hover:text-white border border-green hover:bg-green-hover focus:ring-green-focus",
  outlineRed: "text-red hover:text-white border border-red hover:bg-red-hover focus:ring-red-focus",
  outlineYellow: "text-zinc-800 hover:text-white border border-yellow hover:bg-yellow-hover focus:ring-yellow-focus",
  outlinePurple: "text-purple hover:text-white border border-purple hover:bg-purple-hover focus:ring-purple-focus",
  outlineDark: "text-stone-800 hover:text-white border border-stone-800 hover:bg-stone-800 focus:ring-stone-300 dark:border-stone-600 dark:text-stone-400 dark:hover:text-white dark:hover:bg-stone-600 dark:focus:ring-gray-800",
};
const basesClass =
  "w-full cursor-pointer font-medium focus:outline-none focus:ring-4 text-center rounded-lg disabled:cursor-not-allowed disabled:opacity-50 transition-all";
const sizes = {
  sm: "px-3 py-2 text-xs",
  md: "px-5 p-2.5 text-sm",
};

type ButtonProps = {
  children?: React.ReactNode;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
};
type ButtonNativeProps = ButtonHTMLAttributes<HTMLButtonElement>;
type Props = ButtonProps & ButtonNativeProps;
type ButtonLinkProps = Props & NavLinkProps;
export const Button = ({
  variant = "primary",
  size = "md",
  children,
  className,
  ...buttonProps
}: Props): JSX.Element => {
  return (
    <button
      className={`${basesClass} ${sizes[size]} ${variants[variant]} ${className}`}
      {...buttonProps}
    >
      {children}
    </button>
  );
};
export const ButtonLink = ({
  variant = "primary",
  size = "md",
  children,
  to,
}: ButtonLinkProps): JSX.Element => {
  return (
    <Button variant={variant} size={size}>
      <NavLink to={to}>{children}</NavLink>
    </Button>
  );
};
export const ButtonLinkAdd = ({
  variant = "primary",
  children,
  to,
}: ButtonLinkProps) => {
  return (
    <NavLink
      to={to}
      className={`fixed bottom-8 right-8 ${variants[variant]} rounded-full flex items-center transition-all duration-400 ease-in-out hover:gap-2 group shadow-md shadow-blue-600/30 px-2 py-1.5 hover:px-4`}
    >
      <PlusIcon className="w-5 h-5 flex-shrink-0" />
      <span className="overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out w-0 group-hover:w-auto group-hover:opacity-100 opacity-0">
        {children}
      </span>
    </NavLink>
  );
};
export const ButtonAdd = ({
  variant = "primary",
  children,
  onClick,
}: Props) => {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-8 right-8 ${variants[variant]} rounded-full flex items-center transition-all duration-400 ease-in-out hover:gap-2 group shadow-md shadow-blue-600/30 px-2 py-1.5 hover:px-4`}
    >
      <PlusIcon className="w-5 h-5 flex-shrink-0" />
      <span className="overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out w-0 group-hover:w-auto group-hover:opacity-100 opacity-0">
        {children}
      </span>
    </button>
  );
};
export const IconButton = ({
  variant = "primary",
  size = "md",
  children,
  className,
  ...buttonProps
}: Props): JSX.Element => {
  const sizes = {
  sm: "p-2 text-xs",
  md: "p-3 text-sm",
};
  return (
    <button
      className={`${basesClass} ${variants[variant]} ${className} ${sizes[size]} flex items-center justify-center`}
      {...buttonProps}
    >
      {children}
    </button>
  );
};