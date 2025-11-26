import React from "react";
import { useState, useEffect } from "react";
import type {
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  SelectHTMLAttributes,
} from "react";
import { ChevronDown, IdCard, Phone, Banknote, Upload } from "lucide-react";
import type { IconType } from "./IconComponent";
import { getIcon } from "./IconComponent";
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
type CuitInputProps = {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  requiredField?: boolean;
  [key: string]: any;
};
type PhoneInputProps = {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  requiredField?: boolean;
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
    <span className={`block mb-2 text-sm ${label ? "" : "sr-only"}`}>
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
export function InputWithIcon({
  id,
  label,
  type,
  error,
  hidden,
  requiredField,
  icon,
  ...props
}: InputProps & { icon: IconType }) {
  const { ref } = props;
  if (label === "Razón Social") {
  }
  const IconComponent = getIcon({ icon, size: 5 });
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
          {IconComponent}
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
    <InputWithIcon
      {...props}
      label={label}
      type="text"
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      icon={Banknote}
      error={error}
    />
  );
}

export function CuitInput({
  label,
  value,
  onChange,
  error,
  requiredField,
  ...props
}: CuitInputProps) {
  const [displayValue, setDisplayValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // Función para formatear CUIT: "12345678901" -> "12-34567890-1"
  const formatCuit = (value: string): string => {
    if (!value) return "";
    const cleaned = value.replace(/\D/g, ""); // Solo números
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 10) {
      return `${cleaned.slice(0, 2)}-${cleaned.slice(2)}`;
    }
    return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 10)}-${cleaned.slice(10, 11)}`;
  };

  // Función para extraer solo números del CUIT formateado
  const parseCuit = (formattedValue: string): string => {
    return formattedValue.replace(/\D/g, "");
  };

  // Función para validar CUIT/CUIL
  const validateCuit = (cuit: string): boolean => {
    const cleaned = cuit.replace(/\D/g, "");
    if (cleaned.length !== 11) return false;

    // Algoritmo de validación de CUIT/CUIL
    const sequence = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    const digits = cleaned.split("").map(Number);
    const checkDigit = digits[10];

    let sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += digits[i] * sequence[i];
    }

    const remainder = sum % 11;
    const calculatedDigit = remainder < 2 ? remainder : 11 - remainder;

    return calculatedDigit === checkDigit;
  };

  useEffect(() => {
    if (value !== undefined && !isFocused) {
      setDisplayValue(formatCuit(value));
    }
  }, [value, isFocused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Permitir solo números y guiones
    if (/^[\d-]*$/.test(inputValue) || inputValue === "") {
      const cleanedValue = parseCuit(inputValue);

      // Limitar a máximo 11 dígitos
      if (cleanedValue.length <= 11) {
        // Aplicar formato automático mientras escribe
        const formattedValue = formatCuit(cleanedValue);
        setDisplayValue(formattedValue);
        onChange(cleanedValue);
      }
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    // Mantener el valor actual formateado para facilitar la edición
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (displayValue) {
      const cleanedValue = parseCuit(displayValue);
      setDisplayValue(formatCuit(cleanedValue));
      onChange(cleanedValue);
    } else {
      setDisplayValue("");
      onChange("");
    }
  };

  const cleanedValue = parseCuit(displayValue);
  const isValidLength = cleanedValue.length === 11;
  const isValidCuit = isValidLength && validateCuit(cleanedValue);

  // Determinar el error a mostrar (solo mostrar errores si hay contenido)
  let errorMessage = error;
  if (cleanedValue && cleanedValue.length > 0) {
    if (cleanedValue.length < 11) {
      errorMessage = "El CUIT/CUIL debe tener 11 dígitos";
    } else if (cleanedValue.length === 11 && !isValidCuit) {
      errorMessage = "El CUIT/CUIL no es válido";
    }
  }

  return (
    <InputWithIcon
      {...props}
      label={label}
      type="text"
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      error={errorMessage}
      requiredField={requiredField}
      placeholder="Ej: 20-22173992-3"
      icon={IdCard}
    />
  );
}

export function PhoneInput({
  label,
  value,
  onChange,
  error,
  requiredField,
  ...props
}: PhoneInputProps) {
  const [displayValue, setDisplayValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // Función para formatear teléfono argentino de manera simple
  const formatPhone = (phone: string): string => {
    if (!phone) return "";
    const cleaned = phone.replace(/\D/g, "");

    // Remover código de país si está presente
    let workingNumber = cleaned;
    if (cleaned.startsWith("54") && cleaned.length > 11) {
      workingNumber = cleaned.substring(2);
    }

    // Formatear según la longitud
    if (workingNumber.length <= 4) {
      return workingNumber;
    } else if (workingNumber.length <= 8) {
      return `${workingNumber.slice(0, 4)}-${workingNumber.slice(4)}`;
    } else if (workingNumber.length <= 10) {
      // Formato: XXX XXXX-XXXX o XX XXXX-XXXX
      const areaLength =
        workingNumber.length === 10 && workingNumber.startsWith("0") ? 3 : 2;
      return `${workingNumber.slice(0, areaLength)} ${workingNumber.slice(areaLength, areaLength + 4)}-${workingNumber.slice(areaLength + 4)}`;
    } else {
      // Para números más largos (celulares con 15)
      return `${workingNumber.slice(0, 3)} ${workingNumber.slice(3, 5)} ${workingNumber.slice(5, 9)}-${workingNumber.slice(9)}`;
    }
  };

  // Función para extraer solo números del teléfono formateado
  const parsePhone = (formattedValue: string): string => {
    return formattedValue.replace(/\D/g, "");
  };

  // Función para validar teléfono argentino (más flexible)
  const validatePhone = (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, "");

    // Permitir vacío (campo opcional)
    if (cleaned.length === 0) return true;

    // Muy corto (menos de 7 dígitos local)
    if (cleaned.length < 7) return false;

    // Muy largo (más de 15 dígitos total)
    if (cleaned.length > 15) return false;

    // Si tiene código de país, debe empezar con 54
    if (cleaned.length > 11 && !cleaned.startsWith("54")) return false;

    // Validaciones básicas: no puede empezar con 0 después del código de área
    const phoneWithoutCountry = cleaned.startsWith("54")
      ? cleaned.substring(2)
      : cleaned;

    // Si es un número de 8-13 dígitos, es probablemente válido
    return phoneWithoutCountry.length >= 7 && phoneWithoutCountry.length <= 13;
  };

  useEffect(() => {
    if (value !== undefined && !isFocused) {
      setDisplayValue(formatPhone(value));
    }
  }, [value, isFocused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Permitir solo números, espacios, guiones, paréntesis y +
    if (/^[\d\s\-\(\)\+]*$/.test(inputValue) || inputValue === "") {
      const cleanedValue = parsePhone(inputValue);

      // Limitar a máximo 15 dígitos
      if (cleanedValue.length <= 15) {
        const formattedValue = formatPhone(cleanedValue);
        setDisplayValue(formattedValue);
        onChange(cleanedValue);
      }
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (displayValue) {
      const cleanedValue = parsePhone(displayValue);
      setDisplayValue(formatPhone(cleanedValue));
      onChange(cleanedValue);
    } else {
      setDisplayValue("");
      onChange("");
    }
  };

  const cleanedValue = parsePhone(displayValue);
  const isValidPhone = validatePhone(cleanedValue);

  // Determinar el error a mostrar
  let errorMessage = error;
  if (cleanedValue && cleanedValue.length > 0 && !isValidPhone) {
    if (cleanedValue.length < 7) {
      errorMessage = "El teléfono debe tener al menos 7 dígitos";
    } else if (cleanedValue.length > 15) {
      errorMessage = "El teléfono no puede tener más de 15 dígitos";
    } else {
      errorMessage = "Formato de teléfono no válido";
    }
  }

  return (
    <InputWithIcon
      {...props}
      label={label}
      type="text"
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      error={errorMessage}
      requiredField={requiredField}
      placeholder="Ej: 011 1234-5678"
      icon={Phone}
    />
  );
}

export function FileInput({
  id,
  label,
  error,
  requiredField,
  hidden,
  accept,
  onChange,
  multiple,
  ...props
}: InputProps & { accept?: string; multiple?: boolean }) {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files.map(file => file.name));
    onChange?.(e);
  };

  const displayText = selectedFiles.length > 0 
    ? multiple 
      ? `${selectedFiles.length} archivo(s) seleccionado(s)`
      : selectedFiles[0]
    : multiple 
      ? "Subir archivos" 
      : "Subir archivo";

  return (
    <div className={hidden ? "sr-only" : ""}>
      <Label label={label ?? ""} requiredField={requiredField} />
      <label 
        htmlFor={id} 
        className={`flex flex-col items-center rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-4 text-text-primary shadow-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-blue-500 sm:p-6 ${
          error ? "border-red-500 ring-2 ring-red-500" : ""
        }`}
      >
        <Upload className="w-6 h-6 text-text-secondary" />
        
        <span className="mt-4 font-medium text-text-primary text-center">
          {displayText}
        </span>
        
        <span className="mt-2 inline-block rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-1.5 text-center text-xs font-medium text-text-secondary shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
          Explorar archivos
        </span>
        
        <input
          id={id}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="sr-only"
          {...props}
        />
      </label>
      {error && <SpanError error={error} />}
    </div>
  );
}
