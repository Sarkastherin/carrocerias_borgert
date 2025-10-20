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
  const {
    initialValues = {},
    initialProvinciaNombre,
    initialLocalidadNombre,
    onChange,
  } = options;

  /**
   * Normaliza IDs de provincia para que coincidan con formato Georef
   * Convierte "6" → "06", "30" → "30", etc.
   */
  const normalizeProvinciaId = useCallback((id: string | number): string => {
    if (!id) return "";
    const idStr = String(id);
    // Si es un número de 1 dígito, agregar cero al inicio
    return idStr.length === 1 ? `0${idStr}` : idStr;
  }, []);

  /**
   * Busca provincia por ID con normalización automática
   */
  const findProvinciaById = useCallback(
    (id: string | number, provincias: Provincia[]): Provincia | undefined => {
      if (!id || !provincias.length) return undefined;

      const normalizedId = normalizeProvinciaId(id);
      const originalId = String(id);

      // Buscar con ID normalizado primero, luego con ID original
      return (
        provincias.find((p) => p.id === normalizedId) ||
        provincias.find((p) => p.id === originalId)
      );
    },
    [normalizeProvinciaId]
  );

  /**
   * Normaliza IDs de localidad agregando prefijo de provincia si falta
   */
  const normalizeLocalidadId = useCallback(
    (localidadId: string | number, provinciaId: string): string => {
      if (!localidadId || !provinciaId) return "";

      const localidadStr = String(localidadId);
      const normalizedProvinciaId = normalizeProvinciaId(provinciaId);

      // Si el ID de localidad ya tiene el prefijo de provincia, devolverlo como está
      if (localidadStr.startsWith(normalizedProvinciaId)) {
        return localidadStr;
      }

      // Casos especiales de normalización para Buenos Aires
      if (normalizedProvinciaId === "06") {
        // Para Buenos Aires, muchas localidades tienen formato: provincia + resto
        // Ejemplo: "6588110" debería ser "06588110"
        if (localidadStr.length >= 6 && !localidadStr.startsWith("0")) {
          return `0${localidadStr}`;
        }
      }

      // Si no tiene el prefijo y no es caso especial, agregarlo
      return `${normalizedProvinciaId}${localidadStr}`;
    },
    [normalizeProvinciaId]
  );

  /**
   * Busca localidad por ID con normalización automática
   */
  const findLocalidadById = useCallback(
    (
      localidadId: string | number,
      provinciaId: string,
      localidades: Localidad[]
    ): Localidad | undefined => {
      if (!localidadId || !provinciaId || !localidades.length) return undefined;

      const originalId = String(localidadId);
      const normalizedId = normalizeLocalidadId(localidadId, provinciaId);

      // Buscar con ID normalizado primero, luego con ID original
      return (
        localidades.find((l) => l.id === normalizedId) ||
        localidades.find((l) => l.id === originalId)
      );
    },
    [normalizeLocalidadId]
  );

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
      setAddressData((prev) => ({
        ...prev,
        localidadId: "",
        localidad: undefined,
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

  const loadLocalidades = useCallback(
    async (provinciaId: string, searchTerm?: string) => {
      try {
        setLocalidadesLoading(true);
        setLocalidadesError("");

        // Traer todas las localidades (máximo 1000 para asegurar cobertura completa)
        const data = await georefService.getLocalidades(
          provinciaId,
          searchTerm,
          1000
        );
        setLocalidades(data);
      } catch (error) {
        console.error("Error loading localidades:", error);
        setLocalidadesError("Error al cargar las localidades");
      } finally {
        setLocalidadesLoading(false);
      }
    },
    []
  );

  const handleProvinciaChange = useCallback(
    (provinciaId: string, provincia?: Provincia) => {
      setAddressData((prev) => ({
        ...prev,
        provinciaId,
        provincia,
        localidadId: "", // Reset localidad al cambiar provincia
        localidad: undefined,
      }));
    },
    []
  );

  const handleLocalidadChange = useCallback(
    (localidadId: string, localidad?: Localidad) => {
      setAddressData((prev) => ({
        ...prev,
        localidadId,
        localidad,
      }));
    },
    []
  );

  const handleDireccionChange = useCallback((direccion: string) => {
    setAddressData((prev) => ({
      ...prev,
      direccion,
    }));
  }, []);

  const handleLocalidadSearch = useCallback(
    (searchTerm: string) => {
      if (addressData.provinciaId) {
        loadLocalidades(addressData.provinciaId, searchTerm);
      }
    },
    [addressData.provinciaId, loadLocalidades]
  );

  // Formatear opciones para los SelectField
  const provinciaOptions = provincias.map((provincia) => ({
    id: provincia.id,
    label: provincia.nombre,
    description: provincia.nombre_largo,
  }));

  const localidadOptions = localidades.map((localidad) => ({
    id: localidad.id,
    label: localidad.nombre,
    description: formatearLocalidad(localidad),
  }));

  // Validaciones
  const isProvinciaSelected = !!addressData.provinciaId;
  const isLocalidadSelected = !!addressData.localidadId;
  const isDireccionComplete = !!addressData.direccion.trim();

  const isFormValid =
    isProvinciaSelected && isLocalidadSelected && isDireccionComplete;

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
    setAddressData((prev) => ({
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
    if (
      !addressData.provinciaId &&
      initialProvinciaNombre &&
      provincias.length > 0
    ) {
      const foundProvincia = provincias.find(
        (p) =>
          p.nombre.toLowerCase() === initialProvinciaNombre.toLowerCase() ||
          p.nombre_largo
            .toLowerCase()
            .includes(initialProvinciaNombre.toLowerCase())
      );

      if (foundProvincia) {
        console.log(
          `🔍 Provincia encontrada por nombre: "${initialProvinciaNombre}" → ${foundProvincia.nombre} (${foundProvincia.id})`
        );
        handleProvinciaChange(foundProvincia.id, foundProvincia);
      }
    } else if (addressData.provinciaId && provincias.length > 0) {
      const foundProvincia = findProvinciaById(
        addressData.provinciaId,
        provincias
      );
      if (foundProvincia && !addressData.provincia) {
        setAddressData((prev) => ({
          ...prev,
          provincia: foundProvincia,
          // Actualizar el ID al formato normalizado
          provinciaId: foundProvincia.id,
        }));
      }
    }
  }, [
    provincias,
    initialProvinciaNombre,
    addressData.provinciaId,
    handleProvinciaChange,
    findProvinciaById,
  ]);

  // Buscar localidad por nombre si no hay ID pero hay nombre (datos legacy)
  useEffect(() => {
    if (
      addressData.provinciaId &&
      !addressData.localidadId &&
      initialLocalidadNombre &&
      localidades.length > 0
    ) {
      const foundLocalidad = localidades.find(
        (l) => l.nombre.toLowerCase() === initialLocalidadNombre.toLowerCase()
      );

      if (foundLocalidad) {
        console.log(
          `🔍 Localidad encontrada por nombre: "${initialLocalidadNombre}" → ${foundLocalidad.nombre} (${foundLocalidad.id})`
        );
        handleLocalidadChange(foundLocalidad.id, foundLocalidad);
      }
    } else if (
      addressData.localidadId &&
      localidades.length > 0 &&
      !addressData.localidad
    ) {
      const foundLocalidad = findLocalidadById(
        addressData.localidadId,
        addressData.provinciaId,
        localidades
      );
      if (foundLocalidad) {
        setAddressData((prev) => ({
          ...prev,
          localidad: foundLocalidad,
          // Actualizar el ID al formato normalizado
          localidadId: foundLocalidad.id,
        }));
      } else {
        console.log(
          `❌ No se encontró localidad con ID: ${addressData.localidadId}`
        );
        const normalizedId = normalizeLocalidadId(
          addressData.localidadId,
          addressData.provinciaId
        );
        console.log(`🔍 ID normalizado sería: ${normalizedId}`);
        console.log(`🔍 Total localidades cargadas: ${localidades.length}`);
        console.log(
          `🔍 Algunos IDs disponibles:`,
          localidades.slice(0, 10).map((l) => l.id)
        );

        // Buscar localidades que contengan parte del ID
        const partialMatches = localidades.filter(
          (l) =>
            l.id.includes(String(addressData.localidadId)) ||
            l.id.includes(normalizedId)
        );
        if (partialMatches.length > 0) {
          console.log(
            `🔍 Coincidencias parciales:`,
            partialMatches.map((l) => ({ id: l.id, nombre: l.nombre }))
          );
        }
      }
    }
  }, [
    localidades,
    initialLocalidadNombre,
    addressData.localidadId,
    addressData.provinciaId,
    addressData.localidad,
    handleLocalidadChange,
    findLocalidadById,
    normalizeLocalidadId,
  ]);

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
