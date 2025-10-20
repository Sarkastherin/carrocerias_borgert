import { PlusIcon } from "lucide-react";
import type { JSX, ButtonHTMLAttributes } from "react";
import { NavLink } from "react-router";
import type { NavLinkProps } from "react-router";
export const variants = {
  primary:
    "text-white bg-primary hover:bg-primary-hover focus:ring-primary-focus",
  blue: "text-white bg-blue hover:bg-blue-hover focus:ring-blue-focus",
  green: "text-white bg-green hover:bg-green-hover focus:ring-green-focus",
  red: "text-white bg-red hover:bg-red-hover focus:ring-red-focus",
  yellow:
    "text-zinc-800 bg-yellow hover:bg-yellow-hover focus:ring-yellow-focus",
  purple: "text-white bg-purple hover:bg-purple-hover focus:ring-purple-focus",
  light:
    "text-slate-800 bg-white border border-slate-300 hover:bg-slate-100 focus:ring-slate-100 dark:bg-slate-800 dark:text-white dark:border-slate-600 dark:hover:bg-slate-700 dark:hover:border-slate-600 dark:focus:ring-slate-700",
  dark: "text-white bg-stone-800 hover:bg-stone-800 focus:ring-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 dark:focus:ring-stone-700 dark:border-stone-700",
  outlinePrimary:
    "text-primary hover:text-white border border-primary hover:bg-primary-hover focus:ring-primary-focus",
  outlineBlue:
    "text-blue hover:text-white border border-blue hover:bg-blue-hover focus:ring-blue-focus",
  outlineGreen:
    "text-green hover:text-white border border-green hover:bg-green-hover focus:ring-green-focus",
  outlineRed:
    "text-red hover:text-white border border-red hover:bg-red-hover focus:ring-red-focus",
  outlineYellow:
    "text-zinc-800 hover:text-white border border-yellow hover:bg-yellow-hover focus:ring-yellow-focus",
  outlinePurple:
    "text-purple hover:text-white border border-purple hover:bg-purple-hover focus:ring-purple-focus",
  outlineDark:
    "text-stone-800 hover:text-white border border-stone-800 hover:bg-stone-800 focus:ring-stone-300 dark:border-stone-600 dark:text-stone-400 dark:hover:text-white dark:hover:bg-stone-600 dark:focus:ring-gray-800",
};
const basesClass =
  "w-full cursor-pointer font-medium focus:outline-none focus:ring-4 text-center rounded-lg disabled:cursor-not-allowed disabled:opacity-50 transition-all";
const sizes = {
  sm: "px-3 py-2 text-xs",
  md: "px-5 py-2.5 text-sm",
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
