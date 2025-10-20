import { useState, useEffect, useCallback } from "react";
import { georefService, formatearLocalidad } from "~/services/georefService";
import type { Provincia, Localidad } from "~/services/georefService";

interface AddressData {
  provinciaId: string;
  provincia?: Provincia;
  localidadId: string;
  localidad?: Localidad;
  direccion: string;
}

interface UseAddressFormOptions {
  initialValues?: Partial<AddressData>;
  // Para datos legacy: buscar por nombres cuando no hay IDs
  initialProvinciaNombre?: string;
  initialLocalidadNombre?: string;
  onChange?: (data: AddressData) => void;
}

export function useAddressForm(options: UseAddressFormOptions = {}) {
  const { initialValues = {}, initialProvinciaNombre, initialLocalidadNombre, onChange } = options;

  // Estados para las provincias
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [provinciasLoading, setProvinciasLoading] = useState(false);
  const [provinciasError, setProvinciasError] = useState<string>("");

  // Estados para las localidades
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [localidadesLoading, setLocalidadesLoading] = useState(false);
  const [localidadesError, setLocalidadesError] = useState<string>("");

  // Estado del formulario
  const [addressData, setAddressData] = useState<AddressData>({
    provinciaId: String(initialValues.provinciaId || ""),
    provincia: initialValues.provincia,
    localidadId: String(initialValues.localidadId || ""),
    localidad: initialValues.localidad,
    direccion: initialValues.direccion || "",
  });

  // Cargar provincias al montar el componente
  useEffect(() => {
    loadProvincias();
  }, []);

  // Cargar localidades cuando cambia la provincia
  useEffect(() => {
    if (addressData.provinciaId) {
      loadLocalidades(addressData.provinciaId);
    } else {
      setLocalidades([]);
      setAddressData(prev => ({ 
        ...prev, 
        localidadId: "", 
        localidad: undefined 
      }));
    }
  }, [addressData.provinciaId]);

  // Notificar cambios al padre
  useEffect(() => {
    if (onChange) {
      onChange(addressData);
    }
  }, [addressData, onChange]);

  const loadProvincias = useCallback(async (searchTerm?: string) => {
    try {
      setProvinciasLoading(true);
      setProvinciasError("");
      
      const data = await georefService.getProvincias(searchTerm, 25);
      setProvincias(data);
    } catch (error) {
      console.error("Error loading provincias:", error);
      setProvinciasError("Error al cargar las provincias");
    } finally {
      setProvinciasLoading(false);
    }
  }, []);

  const loadLocalidades = useCallback(async (provinciaId: string, searchTerm?: string) => {
    try {
      setLocalidadesLoading(true);
      setLocalidadesError("");
      
      // Traer todas las localidades (máximo 500 para asegurar cobertura completa)
      const data = await georefService.getLocalidades(provinciaId, searchTerm, 500);
      setLocalidades(data);
    } catch (error) {
      console.error("Error loading localidades:", error);
      setLocalidadesError("Error al cargar las localidades");
    } finally {
      setLocalidadesLoading(false);
    }
  }, []);

  const handleProvinciaChange = useCallback((provinciaId: string, provincia?: Provincia) => {
    setAddressData(prev => ({
      ...prev,
      provinciaId,
      provincia,
      localidadId: "", // Reset localidad al cambiar provincia
      localidad: undefined,
    }));
  }, []);

  const handleLocalidadChange = useCallback((localidadId: string, localidad?: Localidad) => {
    setAddressData(prev => ({
      ...prev,
      localidadId,
      localidad,
    }));
  }, []);

  const handleDireccionChange = useCallback((direccion: string) => {
    setAddressData(prev => ({
      ...prev,
      direccion,
    }));
  }, []);

  const handleLocalidadSearch = useCallback((searchTerm: string) => {
    if (addressData.provinciaId) {
      loadLocalidades(addressData.provinciaId, searchTerm);
    }
  }, [addressData.provinciaId, loadLocalidades]);

  // Formatear opciones para los SelectField
  const provinciaOptions = provincias.map(provincia => ({
    id: provincia.id,
    label: provincia.nombre,
    description: provincia.nombre_largo
  }));

  const localidadOptions = localidades.map(localidad => ({
    id: localidad.id,
    label: localidad.nombre,
    description: formatearLocalidad(localidad)
  }));

  // Validaciones
  const isProvinciaSelected = !!addressData.provinciaId;
  const isLocalidadSelected = !!addressData.localidadId;
  const isDireccionComplete = !!addressData.direccion.trim();
  
  const isFormValid = isProvinciaSelected && isLocalidadSelected && isDireccionComplete;

  // Función para limpiar todo el formulario
  const resetForm = useCallback(() => {
    setAddressData({
      provinciaId: "",
      provincia: undefined,
      localidadId: "",
      localidad: undefined,
      direccion: "",
    });
  }, []);

  // Función para establecer valores del formulario
  const setFormValues = useCallback((values: Partial<AddressData>) => {
    setAddressData(prev => ({
      ...prev,
      ...values,
    }));
  }, []);

  // Función para obtener la dirección formateada completa
  const getFormattedAddress = useCallback(() => {
    const parts = [];
    
    if (addressData.direccion) {
      parts.push(addressData.direccion);
    }
    
    if (addressData.localidad) {
      parts.push(addressData.localidad.nombre);
    }
    
    if (addressData.provincia) {
      parts.push(addressData.provincia.nombre);
    }
    
    return parts.join(", ");
  }, [addressData]);

  // Buscar provincia por nombre si no hay ID pero hay nombre (datos legacy)
  useEffect(() => {
    if (!addressData.provinciaId && initialProvinciaNombre && provincias.length > 0) {
      const foundProvincia = provincias.find(p => 
        p.nombre.toLowerCase() === initialProvinciaNombre.toLowerCase() ||
        p.nombre_largo.toLowerCase().includes(initialProvinciaNombre.toLowerCase())
      );
      
      if (foundProvincia) {
        console.log(`🔍 Provincia encontrada por nombre: "${initialProvinciaNombre}" → ${foundProvincia.nombre} (${foundProvincia.id})`);
        handleProvinciaChange(foundProvincia.id, foundProvincia);
      }
    } else if (addressData.provinciaId && provincias.length > 0) {
      // Si ya tenemos ID, buscar la provincia por ID
      const foundProvincia = provincias.find(p => p.id === String(addressData.provinciaId));
      if (foundProvincia && !addressData.provincia) {
        setAddressData(prev => ({
          ...prev,
          provincia: foundProvincia
        }));
      }
    }
  }, [provincias, initialProvinciaNombre, addressData.provinciaId, handleProvinciaChange]);

  // Buscar localidad por nombre si no hay ID pero hay nombre (datos legacy)
  useEffect(() => {
    if (addressData.provinciaId && !addressData.localidadId && initialLocalidadNombre && localidades.length > 0) {
      const foundLocalidad = localidades.find(l => 
        l.nombre.toLowerCase() === initialLocalidadNombre.toLowerCase()
      );
      
      if (foundLocalidad) {
        console.log(`🔍 Localidad encontrada por nombre: "${initialLocalidadNombre}" → ${foundLocalidad.nombre} (${foundLocalidad.id})`);
        handleLocalidadChange(foundLocalidad.id, foundLocalidad);
      }
    } else if (addressData.localidadId && localidades.length > 0 && !addressData.localidad) {
      // Si ya tenemos ID, buscar la localidad por ID
      const foundLocalidad = localidades.find(l => l.id === String(addressData.localidadId));
      if (foundLocalidad) {
        setAddressData(prev => ({
          ...prev,
          localidad: foundLocalidad
        }));
      }
    }
  }, [localidades, initialLocalidadNombre, addressData.localidadId, addressData.provinciaId, addressData.localidad, handleLocalidadChange]);

  return {
    // Estado del formulario
    addressData,
    
    // Opciones para los selects
    provinciaOptions,
    localidadOptions,
    
    // Estados de carga
    provinciasLoading,
    localidadesLoading,
    
    // Errores
    provinciasError,
    localidadesError,
    
    // Handlers
    handleProvinciaChange,
    handleLocalidadChange,
    handleDireccionChange,
    handleLocalidadSearch,
    loadProvincias,
    
    // Validaciones
    isProvinciaSelected,
    isLocalidadSelected,
    isDireccionComplete,
    isFormValid,
    
    // Utilidades
    resetForm,
    setFormValues,
    getFormattedAddress,
  };
}