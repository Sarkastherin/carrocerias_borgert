import { SelectField } from "./SelectField";
import { Input } from "./Inputs";
import { useAddressForm } from "~/hooks/useAddressForm";
import { useEffect, useCallback } from "react";
import type { DireccionCompleta } from "~/types/clientes";

interface AddressFieldsProps {
  // Valores iniciales
  provinciaId?: string;
  localidadId?: string;
  direccion?: string;
  // Nombres para búsqueda inicial (datos legacy)
  provinciaNombre?: string;
  localidadNombre?: string;
  
  // Callbacks para el formulario principal
  onChange?: (direccion: DireccionCompleta | null) => void;
  
  // Props para validación
  errors?: {
    provincia?: string;
    localidad?: string;
    direccion?: string;
  };
  
  // Props de control
  disabled?: boolean;
  required?: boolean;
}

export function AddressFields({
  provinciaId: initialProvinciaId = "",
  localidadId: initialLocalidadId = "",
  direccion: initialDireccion = "",
  provinciaNombre: initialProvinciaNombre = "",
  localidadNombre: initialLocalidadNombre = "",
  onChange,
  errors = {},
  disabled = false,
  required = false
}: AddressFieldsProps) {
  const {
    addressData,
    provinciaOptions,
    localidadOptions,
    provinciasLoading,
    localidadesLoading,
    provinciasError,
    localidadesError,
    handleProvinciaChange,
    handleLocalidadChange,
    handleDireccionChange,
    handleLocalidadSearch,
    loadProvincias,
    retryLoadData,
    isFormValid,
    getFormattedAddress
  } = useAddressForm({
    initialValues: {
      provinciaId: initialProvinciaId,
      localidadId: initialLocalidadId,
      direccion: initialDireccion
    },
    initialProvinciaNombre,
    initialLocalidadNombre
  });

  // Notificar cambios al componente padre solo cuando hay cambios relevantes
  useEffect(() => {
    if (!onChange) return;

    // Solo requiere provincia y localidad, la dirección es opcional
    const hasValidData = addressData.provincia && addressData.localidad;
    
    if (hasValidData && addressData.provincia && addressData.localidad) {
      const direccionCompleta: DireccionCompleta = {
        provinciaId: addressData.provinciaId,
        provinciaNombre: addressData.provincia.nombre,
        localidadId: addressData.localidadId,
        localidadNombre: addressData.localidad.nombre,
        direccion: addressData.direccion || "", // Permitir direccion vacía
        direccionCompleta: getFormattedAddress()
      };
      onChange(direccionCompleta);
    } else {
      onChange(null);
    }
  }, [
    addressData.provinciaId,
    addressData.localidadId, 
    addressData.direccion,
    isFormValid,
    onChange,
    getFormattedAddress
  ]);

  return (
    <div className="space-y-4">
      {/* Campo Provincia */}
      <SelectField
        label="Provincia"
        value={addressData.provinciaId}
        onChange={(provinciaId, option) => {
          const provincia = provinciaOptions.find(p => p.id === provinciaId);
          const provinciaData = provincia ? {
            id: provincia.id,
            nombre: provincia.label,
            nombre_largo: provincia.description || provincia.label,
            iso_id: "",
            iso_nombre: provincia.label,
            categoria: "Provincia",
            centroide: { lat: 0, lon: 0 }
          } : undefined;
          handleProvinciaChange(provinciaId, provinciaData);
        }}
        options={provinciaOptions}
        onSearch={loadProvincias}
        isLoading={provinciasLoading}
        error={errors.provincia || provinciasError}
        placeholder="Seleccione una provincia..."
        searchPlaceholder="Buscar provincia..."
        required={required}
        disabled={disabled}
        noOptionsText="No se encontraron provincias"
        emptyOptionText="Cargando provincias..."
      />

      {/* Campo Localidad */}
      <SelectField
        label="Localidad"
        value={addressData.localidadId}
        onChange={(localidadId, option) => {
          const localidad = localidadOptions.find(l => l.id === localidadId);
          const localidadData = localidad && addressData.provincia ? {
            id: localidad.id,
            nombre: localidad.label,
            departamento: { id: "", nombre: "" },
            provincia: { id: addressData.provincia.id, nombre: addressData.provincia.nombre },
            municipio: { id: "", nombre: "" },
            categoria: "Localidad",
            centroide: { lat: 0, lon: 0 }
          } : undefined;
          handleLocalidadChange(localidadId, localidadData);
        }}
        options={localidadOptions}
        onSearch={handleLocalidadSearch}
        isLoading={localidadesLoading}
        error={errors.localidad || localidadesError}
        placeholder={
          addressData.provinciaId 
            ? "Seleccione una localidad..." 
            : "Primero seleccione una provincia"
        }
        searchPlaceholder="Buscar localidad..."
        required={required}
        disabled={disabled || !addressData.provinciaId}
        noOptionsText="No se encontraron localidades"
        emptyOptionText={
          addressData.provinciaId 
            ? "Cargando localidades..." 
            : "Seleccione una provincia primero"
        }
      />

      {/* Campo Dirección */}
      <Input
        label="Dirección"
        value={addressData.direccion}
        onChange={(e) => handleDireccionChange(e.target.value)}
        error={errors.direccion}
        placeholder="Ej: Av. Corrientes 1234, Piso 5, Depto B (Opcional)"
        disabled={disabled}
      />

      {/* Mensaje de error con opción de reintentar */}
      {(provinciasError || localidadesError) && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3 mt-1">
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-red-800 dark:text-red-200">
                Error de conexión
              </h4>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                {provinciasError || localidadesError}
              </p>
              <button
                type="button"
                onClick={retryLoadData}
                className="text-sm text-red-800 dark:text-red-200 underline hover:no-underline mt-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 rounded"
              >
                Intentar nuevamente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Previsualización de la dirección completa */}
      {isFormValid && (
        <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md p-3 mt-1">
          <p className="text-sm text-text-secondary mb-1">Dirección completa:</p>
          <p className="text-sm font-medium text-text-primary">
            {getFormattedAddress()}
          </p>
        </div>
      )}
    </div>
  );
}

// Componente más simple para casos donde solo se necesita mostrar la dirección
interface AddressDisplayProps {
  direccion?: string;
  localidad?: string;
  provincia?: string;
  className?: string;
}

export function AddressDisplay({ 
  direccion, 
  localidad, 
  provincia, 
  className = "" 
}: AddressDisplayProps) {
  const parts = [direccion, localidad, provincia].filter(Boolean);
  
  if (parts.length === 0) {
    return <span className={`text-gray-400 ${className}`}>Sin dirección</span>;
  }
  
  return (
    <span className={className}>
      {parts.join(", ")}
    </span>
  );
}