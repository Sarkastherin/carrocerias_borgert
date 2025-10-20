import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronDown, Search, Check, X } from "lucide-react";

interface Option {
  id: string;
  label: string;
  description?: string;
}

interface SelectFieldProps {
  label: string;
  value?: string;
  onChange: (value: string, option: Option) => void;
  options: Option[];
  onSearch?: (query: string) => void;
  isLoading?: boolean;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  searchPlaceholder?: string;
  noOptionsText?: string;
  emptyOptionText?: string;
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  onSearch,
  isLoading = false,
  error,
  placeholder = "Seleccionar...",
  required = false,
  disabled = false,
  searchPlaceholder = "Buscar...",
  noOptionsText = "No se encontraron opciones",
  emptyOptionText = "Seleccione una opción"
}: SelectFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Encontrar la opción seleccionada
  const selectedOption = options.find(option => option.id === value);

  // Filtrar opciones localmente si no hay función de búsqueda externa
  useEffect(() => {
    if (!onSearch) {
      const filtered = options.filter(option =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(options);
    }
  }, [options, searchQuery, onSearch]);

  // Búsqueda externa con useCallback para evitar bucles infinitos
  const debouncedSearch = useCallback(
    (query: string) => {
      if (onSearch) {
        onSearch(query);
      }
    },
    [onSearch]
  );

  useEffect(() => {
    if (searchQuery) {
      const timeoutId = setTimeout(() => {
        debouncedSearch(searchQuery);
      }, 300); // Debounce de 300ms

      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery, debouncedSearch]);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Enfocar el input de búsqueda cuando se abre el dropdown
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setSearchQuery("");
    }
  };

  const handleSelect = (option: Option) => {
    onChange(option.id, option);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("", { id: "", label: "" });
  };

  return (
    <div className="relative">
      <label className={`block mb-2 text-sm ${label ? "" : "sr-only"}`}>
        {label}
      </label>
      
      <div className="relative" ref={dropdownRef}>
        {/* Campo principal */}
        <button
          type="button"
          className={`
            relative w-full cursor-default text-left
            bg-gray-50 border border-gray-300 dark:bg-gray-700 dark:border-gray-600  text-text-primary text-sm rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 
            block p-2.5 pr-10
            ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}
            ${error ? 'focus:border-red-500 focus:ring-red-500 border-red-500' : ''}
          `}
          onClick={handleToggle}
          disabled={disabled}
        >
          <span className={`block truncate ${!selectedOption ? 'text-text-secondary' : 'text-text-primary'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </button>

        {/* Iconos del lado derecho - fuera del botón principal */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          {selectedOption && !disabled && (
            <button
              type="button"
              className="mr-2 text-gray-400 hover:text-gray-600 pointer-events-auto"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <ChevronDown
            className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-50 mt-1 w-full rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5">
            {/* Campo de búsqueda */}
            <div className="p-2 border-b border-gray-200 dark:border-gray-600">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  ref={searchInputRef}
                  type="text"
                  className="bg-background border border-gray-300 dark:border-gray-500 text-text-primary text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 block w-full pl-10 pr-3 p-2.5 placeholder:text-gray-400"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  autoComplete="off"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Lista de opciones */}
            <div className="max-h-60 overflow-auto py-1">
              {isLoading ? (
                <div className="px-3 py-2 text-sm text-text-secondary text-center">
                  Cargando...
                </div>
              ) : filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-sm text-text-secondary text-center">
                  {searchQuery ? noOptionsText : emptyOptionText}
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={`
                      relative w-full cursor-default select-none py-2 pl-3 pr-9 text-left text-sm
                      hover:bg-blue-50 dark:hover:bg-gray-900 focus:bg-blue-50 focus:outline-none
                      ${selectedOption?.id === option.id ? 'bg-blue-100 text-blue-900' : 'text-text-primary'}
                    `}
                    onClick={() => handleSelect(option)}
                  >
                    <div>
                      <span className="block font-medium">{option.label}</span>
                      {option.description && (
                        <span className="block text-text-secondary text-xs mt-1">
                          {option.description}
                        </span>
                      )}
                    </div>
                    
                    {selectedOption?.id === option.id && (
                      <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <Check className="h-4 w-4 text-blue-600" />
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mensaje de error */}
      {error && (
        <span className="block mt-0.5 text-red-500 text-xs">{error}</span>
      )}
    </div>
  );
}

// Componente específico para provincias
export interface ProvinciaSelectProps {
  label?: string;
  value?: string;
  onChange: (provinciaId: string, provincia: any) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

export function ProvinciaSelect({ 
  label = "Provincia", 
  ...props 
}: ProvinciaSelectProps) {
  // Este componente será implementado con el hook useAddressForm
  return <div>Implementar ProvinciaSelect</div>;
}

// Componente específico para localidades
export interface LocalidadSelectProps {
  label?: string;
  value?: string;
  provinciaId?: string;
  onChange: (localidadId: string, localidad: any) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

export function LocalidadSelect({ 
  label = "Localidad", 
  ...props 
}: LocalidadSelectProps) {
  // Este componente será implementado con el hook useAddressForm
  return <div>Implementar LocalidadSelect</div>;
}