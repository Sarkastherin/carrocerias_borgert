import { useForm } from "react-hook-form";
import type {
  ClientesBD,
  ClienteFormData,
  DireccionCompleta,
} from "~/types/clientes";
import { useUIModals } from "~/context/ModalsContext";
import { useData } from "~/context/DataContext";
import { useState, useCallback, useEffect } from "react";
import { clientesAPI } from "~/backend/sheetServices";
import { useNavigate } from "react-router";
import { prepareUpdatePayload } from "~/utils/prepareUpdatePayload";

// Función para validar CUIT/CUIL
const validateCuit = (cuit: string): boolean => {
  if (!cuit) return false;
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

export function useClienteForm({modal = false}: {modal?: boolean}) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [direccionData, setDireccionData] = useState<DireccionCompleta | null>(
    null
  );
  const [hasAddressChanged, setHasAddressChanged] = useState(false);

  const { showLoading, showSuccess, showError, showInfo, closeModal } = useUIModals();
  const { cliente, getClientes } = useData();
  const isEditMode = Boolean(cliente);
  const existingCliente = cliente as ClientesBD | null;

  const form = useForm<ClienteFormData>({
    defaultValues: existingCliente
      ? {
          ...existingCliente,
          // Mapear campos existentes a los nuevos campos estructurados
          provincia_id: existingCliente.provincia_id || "",
          provincia_nombre: existingCliente.provincia,
          localidad_id: existingCliente.localidad_id || "",
          localidad_nombre: existingCliente.localidad,
        }
      : {
          razon_social: "",
          nombre_contacto: "",
          telefono: "",
          email: "",
          cuit_cuil: "",
          direccion: "",
          provincia_id: "",
          provincia_nombre: "",
          localidad_id: "",
          localidad_nombre: "",
          pais: "Argentina",
          condicion_iva: "",
          medio_contacto: "",
          vendedor_asignado: "",
          activo: true,
          observaciones: "",
        },
    mode: "onChange", // Para validar en tiempo real
  });
  
  // Efecto para resetear el estado de cambios de dirección cuando se carga un cliente existente
  useEffect(() => {
    if (isEditMode && existingCliente) {
      setHasAddressChanged(false);
      // También resetear los dirty fields después de un pequeño delay
      // para permitir que la inicialización complete
      setTimeout(() => {
        form.reset({
          ...existingCliente,
          provincia_id: existingCliente.provincia_id || "",
          provincia_nombre: existingCliente.provincia,
          localidad_id: existingCliente.localidad_id || "",
          localidad_nombre: existingCliente.localidad,
        });
      }, 100);
    }
  }, [isEditMode, existingCliente?.id, form]);
  
  useEffect(() => {
  }, [form.formState.dirtyFields]);
  const handleSubmit = async (formData: ClienteFormData) => {
    try {
      // Validar CUIT antes de enviar
      if (formData.cuit_cuil && !validateCuit(formData.cuit_cuil)) {
        showError("El CUIT/CUIL ingresado no es válido");
        return;
      }

      // Validar dirección obligatoria
      const direccionFinal = direccionData?.direccion || formData.direccion;
      const provinciaFinal = direccionData?.provinciaNombre || formData.provincia_nombre;
      const localidadFinal = direccionData?.localidadNombre || formData.localidad_nombre;

      if (!direccionFinal || direccionFinal.trim() === "") {
        showError("La dirección es obligatoria");
        return;
      }

      if (!provinciaFinal || provinciaFinal.trim() === "") {
        showError("La provincia es obligatoria");
        return;
      }

      if (!localidadFinal || localidadFinal.trim() === "") {
        showError("La localidad es obligatoria");
        return;
      }

      showLoading(
        isEditMode ? "Actualizando cliente..." : "Creando nuevo cliente..."
      );
      // Preparar datos finales mezclando form data con dirección estructurada
      const finalData: ClientesBD = {
        ...(isEditMode && { id: existingCliente?.id || "" }),
        fecha_creacion:
          existingCliente?.fecha_creacion || new Date().toISOString(),
        razon_social: formData.razon_social,
        nombre_contacto: formData.nombre_contacto,
        telefono: formData.telefono || "",
        email: formData.email || "",
        cuit_cuil: formData.cuit_cuil || "",
        // Usar dirección estructurada si está disponible, sino usar la dirección simple
        direccion: direccionData?.direccion || formData.direccion,
        localidad:
          direccionData?.localidadNombre || formData.localidad_nombre || "",
        provincia:
          direccionData?.provinciaNombre || formData.provincia_nombre || "",
        // Nuevos campos: IDs oficiales de Georef
        provincia_id:
          direccionData?.provinciaId || formData.provincia_id || undefined,
        localidad_id:
          direccionData?.localidadId || formData.localidad_id || undefined,
        pais: formData.pais || "Argentina",
        condicion_iva: formData.condicion_iva || "",
        medio_contacto: formData.medio_contacto || "",
        vendedor_asignado: formData.vendedor_asignado || "",
        activo: formData.activo ?? true,
        observaciones: formData.observaciones || "",
      } as ClientesBD;

      if (isEditMode) {
        // Verificar si hay cambios en el formulario
        const hasDirtyFields = form.formState.dirtyFields && 
          Object.keys(form.formState.dirtyFields).length > 0;
        
        console.log("Submit check:", {
          hasDirtyFields,
          hasAddressChanged,
          dirtyFieldsCount: Object.keys(form.formState.dirtyFields || {}).length,
          direccionFinal,
          provinciaFinal,
          localidadFinal
        });
        
        // Si no hay campos dirty y no hay cambios de dirección, no actualizar
        if (!hasDirtyFields && !hasAddressChanged) {
          showInfo("No se realizaron cambios en el formulario.");
          return;
        }
        
        // Si hay cambios de dirección, forzar la inclusión de campos de dirección
        let effectiveDirtyFields = { ...form.formState.dirtyFields };
        if (hasAddressChanged) {
          effectiveDirtyFields = {
            ...effectiveDirtyFields,
            direccion: true,
            localidad_nombre: true,
            provincia_nombre: true,
            localidad_id: true,
            provincia_id: true
          };
        }
        
        const updatePayload = prepareUpdatePayload<ClientesBD>({
          dirtyFields: effectiveDirtyFields,
          formData: finalData,
        });
        const response = await clientesAPI.update(
          existingCliente?.id || "",
          updatePayload
        );
        if (!response.success) {
          console.log(response);
          throw new Error(
            response.message || "Error desconocido al actualizar el cliente"
          );
        }
        getClientes();
        navigate("/clientes");
        showSuccess("Cliente actualizado exitosamente");
      } else {
        const response = await clientesAPI.create(finalData);
        if (!response.success) {
          throw new Error(
            response.message || "Error desconocido al crear el cliente"
          );
        }
        getClientes();
        if(modal) {
          showSuccess("Cliente creado exitosamente", () => {
            // Cerrar el modal después de mostrar el éxito
            closeModal();
          });
          return;
        }
        navigate("/clientes");
        showSuccess("Cliente creado exitosamente");
      }
    } catch (error) {
      showError(
        typeof error === "string" ? error : "Error al guardar el cliente"
      );
    }
  };
  const resetForm = () => {
    form.reset();
    setDireccionData(null);
    setHasAddressChanged(false);
  };

  const handleDireccionChange = useCallback(
    (direccion: DireccionCompleta | null) => {
      setDireccionData(direccion);

      // Función auxiliar para comparar valores que pueden ser null, undefined o string vacío
      const isEmptyOrNull = (value: any) => !value || value === "" || value === null || value === undefined;
      const isSameValue = (val1: any, val2: any) => {
        // Si ambos son "vacíos" (null, undefined, ""), considerarlos iguales
        if (isEmptyOrNull(val1) && isEmptyOrNull(val2)) return true;
        // Si uno es vacío y el otro no, son diferentes
        if (isEmptyOrNull(val1) || isEmptyOrNull(val2)) return false;
        // Comparación normal
        return val1 === val2;
      };

      // Detección más precisa de inicialización vs cambio de usuario
      const isLikelyInitialization = isEditMode && 
        !hasAddressChanged && 
        existingCliente &&
        (
          // Caso 1: Ambas direcciones son nulas/vacías
          (isEmptyOrNull(direccion) && 
           isEmptyOrNull(existingCliente.direccion) && 
           isEmptyOrNull(existingCliente.localidad) && 
           isEmptyOrNull(existingCliente.provincia)) ||
          
          // Caso 2: Las direcciones coinciden exactamente
          (direccion && 
           isSameValue(direccion.direccion, existingCliente.direccion) &&
           isSameValue(direccion.localidadNombre, existingCliente.localidad) &&
           isSameValue(direccion.provinciaNombre, existingCliente.provincia) &&
           isSameValue(direccion.provinciaId, existingCliente.provincia_id) &&
           isSameValue(direccion.localidadId, existingCliente.localidad_id))
        );
      
      // Solo marcar como cambio si definitivamente NO es inicialización
      if (!isLikelyInitialization) {
        setHasAddressChanged(true);
      }

      // Actualizar los campos del formulario con los datos de la dirección
      if (direccion) {
        // Durante la inicialización, no marcar como dirty
        if (isLikelyInitialization) {
          form.setValue("direccion", direccion.direccion, { shouldDirty: false });
          form.setValue("provincia_id", direccion.provinciaId, { shouldDirty: false });
          form.setValue("provincia_nombre", direccion.provinciaNombre, { shouldDirty: false });
          form.setValue("localidad_id", direccion.localidadId, { shouldDirty: false });
          form.setValue("localidad_nombre", direccion.localidadNombre, { shouldDirty: false });
        } else {
          // Marcar como dirty solo cuando es un cambio real del usuario
          form.setValue("direccion", direccion.direccion, { shouldDirty: true });
          form.setValue("provincia_id", direccion.provinciaId, { shouldDirty: true });
          form.setValue("provincia_nombre", direccion.provinciaNombre, { shouldDirty: true });
          form.setValue("localidad_id", direccion.localidadId, { shouldDirty: true });
          form.setValue("localidad_nombre", direccion.localidadNombre, { shouldDirty: true });
        }
      }
    },
    [form, isEditMode, hasAddressChanged, existingCliente]
  );

  // Función para validar dirección en tiempo real
  const validateAddress = useCallback(() => {
    const direccionFinal = direccionData?.direccion || form.getValues("direccion");
    const provinciaFinal = direccionData?.provinciaNombre || form.getValues("provincia_nombre");
    const localidadFinal = direccionData?.localidadNombre || form.getValues("localidad_nombre");

    const errors = {
      direccion: !direccionFinal || direccionFinal.trim() === "" ? "La dirección es obligatoria" : "",
      provincia: !provinciaFinal || provinciaFinal.trim() === "" ? "La provincia es obligatoria" : "",
      localidad: !localidadFinal || localidadFinal.trim() === "" ? "La localidad es obligatoria" : ""
    };

    return errors;
  }, [direccionData, form]);

  return {
    // Form methods
    register: form.register,
    handleSubmit: form.handleSubmit,
    formState: form.formState,
    reset: resetForm,
    setValue: form.setValue,
    getValues: form.getValues,
    watch: form.watch,

    // Custom submit handler
    onSubmit: handleSubmit,
    isLoading,

    // Dirección handling
    direccionData,
    handleDireccionChange,
    validateAddress,

    // Helper texts
    submitButtonText: isEditMode ? "Actualizar Cliente" : "Crear Cliente",
    formTitle: isEditMode ? "Editar Cliente" : "Nuevo Cliente",

    // Initial values for address fields
    initialAddress: {
      provinciaId: existingCliente?.provincia_id || "",
      localidadId: existingCliente?.localidad_id || "",
      direccion: existingCliente?.direccion || "",
      // También pasamos los nombres para casos donde no tengamos IDs (datos legacy)
      provinciaNombre: existingCliente?.provincia || "",
      localidadNombre: existingCliente?.localidad || "",
    },
  };
}
