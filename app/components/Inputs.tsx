import React from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import type {
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  SelectHTMLAttributes,
} from "react";
import { ChevronDown } from "lucide-react";
type CommonInputsProps = {
  id?: string;
  label?: string;
  register?: UseFormRegisterReturn;
  error?: string;
};
type InputProps = CommonInputsProps &
  InputHTMLAttributes<HTMLInputElement> & { ref?: React.Ref<HTMLInputElement> };
type TextareaProps = CommonInputsProps &
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    ref?: React.Ref<HTMLTextAreaElement>;
  };
type SelectProps = CommonInputsProps &
  SelectHTMLAttributes<HTMLSelectElement> & {
    ref?: React.Ref<HTMLSelectElement>;
  };
const basesClass = (error: string) => {
  return `bg-gray-50 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 text-text-primary text-sm rounded-lg focus:ring focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 block w-full p-2.5 placeholder:text-gray-400 ${
    error ? "focus:border-red-500 focus:ring-red-500 border-red-500" : ""
  }`;
};
function SpanError({ error }: { error: string }) {
  return <span className="block mt-0.5 text-red-500 text-xs">{error}</span>;
}
export function Input({
  id,
  label,
  type,
  register,
  error,
  ...props
}: InputProps) {
  return (
    <label htmlFor={id}>
      <span className={`block mb-2 text-sm  ${label ? "" : "sr-only"}`}>
        {label}
      </span>
      <input
        type={type ? type : "text"}
        {...register}
        {...props}
        autoComplete="off"
        className={basesClass(error || "")}
      />
      {error && <SpanError error={error} />}
    </label>
  );
}
export function Textarea({
  id,
  label,
  rows,
  register,
  error,
  ...props
}: TextareaProps) {
  return (
    <label htmlFor={id}>
      <span className={`block mb-2 text-sm  ${label ? "" : "sr-only"}`}>
        {label}
      </span>
      <textarea
        id={id}
        rows={rows ? rows : 2}
        {...register}
        {...props}
        className={`${basesClass(error || "")} field-sizing-content`}
      />
      {error && <SpanError error={error} />}
    </label>
  );
}
export function Select({
  id,
  label,
  register,
  error,
  children,
  ...props
}: SelectProps) {
  return (
    <label htmlFor={id}>
      <span className={`block mb-2 text-sm ${label ? "" : "sr-only"}`}>
        {label}
      </span>
      <div className="relative">
        <select
          {...register}
          {...props}
          className={`${basesClass(error || "")} appearance-none pr-8`}
        >
          {children}
        </select>
        {error && <SpanError error={error} />}
        <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
          <ChevronDown className="w-4 h-4 text-text-primary" />
        </div>
      </div>
    </label>
  );
}
