import { useState, useEffect } from "react";
import { getAtributoMetadata } from "~/config/atributosMetadata";
import type { AtributoFieldType } from "~/config/atributosMetadata";

interface DynamicFieldProps {
  atributo: string;
  value: any;
  onChange: (value: any) => void;
  label?: string;
  required?: boolean;
}

export const DynamicField: React.FC<DynamicFieldProps> = ({
  atributo,
  value,
  onChange,
  label = "Valor por defecto",
  required = false,
}) => {
  const [fieldType, setFieldType] = useState<AtributoFieldType>("text");
  const [fieldOptions, setFieldOptions] = useState<any[]>([]);
  const [fieldProps, setFieldProps] = useState<any>({});

  useEffect(() => {
    if (atributo) {
      const metadata = getAtributoMetadata(atributo as any);
      if (metadata) {
        setFieldType(metadata.fieldType);
        setFieldOptions(metadata.options || []);
        setFieldProps({
          placeholder: metadata.placeholder,
          min: metadata.min,
          max: metadata.max,
        });
      } else {
        // Fallback para atributos sin metadata
        setFieldType("text");
        setFieldOptions([]);
        setFieldProps({});
      }
    }
  }, [atributo]);

  const renderField = () => {
    const commonProps = {
      value: value || "",
      onChange: (e: any) => {
        const newValue = e.target ? e.target.value : e;
        onChange(newValue);
      },
      required,
      className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
      ...fieldProps,
    };

    switch (fieldType) {
      case "number":
        return (
          <input
            type="number"
            {...commonProps}
            value={value || ""}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          />
        );

      case "boolean":
        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={Boolean(value)}
              onChange={(e) => onChange(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              {value ? "Sí" : "No"}
            </span>
          </div>
        );

      case "select":
        return (
          <select {...commonProps}>
            <option value="">Seleccionar...</option>
            {fieldOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "textarea":
        return (
          <textarea
            {...commonProps}
            rows={3}
            className={`${commonProps.className} resize-vertical`}
          />
        );

      default: // text
        return <input type="text" {...commonProps} />;
    }
  };

  if (!atributo) {
    return (
      <div className="text-gray-400 p-2">
        Selecciona un atributo para configurar su valor
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderField()}
      {fieldProps.placeholder && fieldType !== "boolean" && (
        <p className="text-xs text-gray-500">{fieldProps.placeholder}</p>
      )}
    </div>
  );
};