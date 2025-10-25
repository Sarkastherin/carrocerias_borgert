import React from "react";
import { useState, useEffect } from "react";
import type {
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  SelectHTMLAttributes,
} from "react";
import { ChevronDown } from "lucide-react";
type CommonInputsProps = {
  id?: string;
  label?: string;
  error?: string;
  hidden?: boolean;
  requiredField?: boolean;
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
type CurrencyInputProps = {
  label: string;
  value?: number;
  onChange: (value: number | "") => void;
  error?: string;
  [key: string]: any;
};
const basesClass = (error: string) => {
  return `bg-gray-50 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 text-text-primary text-sm rounded-lg focus:ring focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 block w-full p-2.5 placeholder:text-gray-400 disabled:opacity-70 disabled:cursor-not-allowed ${
    error ? "focus:border-red-500 focus:ring-red-500 border-red-500" : ""
  }`;
};
function SpanError({ error }: { error: string }) {
  return <span className="block mt-0.5 text-red-500 text-xs">{error}</span>;
}
function Label({
  label,
  requiredField,
}: {
  label: string;
  requiredField?: boolean;
}) {
  return (
    <span className={`block mb-2 text-sm  ${label ? "" : "sr-only"}`}>
      {label}
      <span className="text-red-500">{requiredField ? " *" : ""}</span>
    </span>
  );
}
export function Input({
  id,
  label,
  type,
  error,
  hidden,
  requiredField,
  ...props
}: InputProps) {
  const { ref } = props;
  if (label === "Razón Social") {
  }
  return (
    <label htmlFor={id} className={hidden ? "sr-only" : ""}>
      <Label label={label ?? ""} requiredField={requiredField} />
      <input
        type={type ? type : "text"}
        {...props}
        autoComplete="off"
        className={`dark:[&::-webkit-calendar-picker-indicator]:invert
 ${basesClass(error ?? "")}`}
      />
      {error && <SpanError error={error} />}
    </label>
  );
}
export function InputWithIIcon({
  id,
  label,
  type,
  error,
  hidden,
  requiredField,
  icon,
  ...props
}: InputProps & { icon: React.ReactNode }) {
  const { ref } = props;
  if (label === "Razón Social") {
  }
  return (
    <label htmlFor={id} className={hidden ? "sr-only" : ""}>
      <Label label={label ?? ""} requiredField={requiredField} />
      <div className="relative">
        <input
          type={type ? type : "text"}
          {...props}
          autoComplete="off"
          className={`dark:[&::-webkit-calendar-picker-indicator]:invert pr-12
 ${basesClass(error ?? "")}`}
        />
        <div className="absolute inset-y-0 end-0 top-0 flex items-center px-3 pointer-events-none border-l border-gray-300 dark:border-gray-600 text-text-secondary">
          {icon}
        </div>
      </div>
      {error && <SpanError error={error} />}
    </label>
  );
}
export function Textarea({
  id,
  label,
  rows,
  error,
  requiredField,
  hidden,
  ...props
}: TextareaProps) {
  return (
    <label htmlFor={id} className={hidden ? "sr-only" : ""}>
      <Label label={label ?? ""} requiredField={requiredField} />
      <textarea
        id={id}
        rows={rows ? rows : 2}
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
  error,
  children,
  requiredField,
  hidden,
  ...props
}: SelectProps) {
  return (
    <label htmlFor={id} className={hidden ? "sr-only" : ""}>
      <Label label={label ?? ""} requiredField={requiredField} />
      <div className="relative">
        <select
          {...props}
          className={`${basesClass(error || "")} appearance-none pr-8 text-gray-500 [&:invalid]:text-gray-400 [&>option]:text-gray-900 dark:[&>option]:text-gray-300 [&>option[value='']]:text-gray-400`}
          required
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
type ToggleCheckboxProps = CommonInputsProps & {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  name?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange">;

export function ToggleCheckbox({
  id,
  label,
  error,
  checked = false,
  onChange,
  disabled = false,
  requiredField = false,
  name,
  ...props
}: ToggleCheckboxProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.checked);
  };

  return (
    <div className="">
      <label
        htmlFor={id}
        className={`inline-flex items-end ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
      >
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className="sr-only peer"
          {...props}
        />
        <div
          className={`relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600 ${
            error ? "ring-2 ring-red-500 border-red-500" : ""
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        ></div>
        <span className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 min-w-0 flex-1">
          {label}
          <span className="text-red-500">{requiredField ? " *" : ""}</span>
        </span>
      </label>
      {error && <SpanError error={error} />}
    </div>
  );
}
export function CurrencyInput({
  label,
  value,
  onChange,
  error,
  ...props
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const formatCurrency = (value: number | string | undefined): string => {
    if (!value) return "";
    const numericValue = parseFloat(value.toString());
    if (isNaN(numericValue)) return "";

    return new Intl.NumberFormat("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericValue);
  };

  const parseCurrency = (formattedValue: string): string => {
    return formattedValue.replace(/\./g, "").replace(/,/g, ".");
  };

  useEffect(() => {
    if (value !== undefined && !isFocused) {
      setDisplayValue(formatCurrency(value));
    }
  }, [value, isFocused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Solo permitir números, punto y coma
    if (/^[\d.,]*$/.test(inputValue) || inputValue === "") {
      setDisplayValue(inputValue);
      
      if (inputValue === "") {
        onChange("");
      } else {
        const numericValue = parseCurrency(inputValue);
        const parsedValue = parseFloat(numericValue);
        if (!isNaN(parsedValue)) {
          onChange(parsedValue);
        }
      }
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    // Al enfocar, mostrar solo números sin formato para facilitar edición
    if (value) {
      setDisplayValue(value.toString());
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (displayValue) {
      const numericValue = parseFloat(parseCurrency(displayValue));
      if (!isNaN(numericValue)) {
        setDisplayValue(formatCurrency(numericValue));
        onChange(numericValue);
      }
    } else {
      setDisplayValue("");
      onChange("");
    }
  };

  return (
    <InputWithIIcon
      {...props}
      label={label}
      type="text"
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      icon={<span className="text-gray-500">$</span>}
      error={error}
    />
  );
}
