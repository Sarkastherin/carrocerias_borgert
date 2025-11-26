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
import { useFormNavigationBlock } from "./useFormNavigationBlock";
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

export function useClienteForm({
  modal = false,
  onSuccess,
  onError,
  onLoadingStart,
  onLoadingEnd,
}: {
  modal?: boolean;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
  onLoadingStart?: () => void;
  onLoadingEnd?: () => void;
}) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [direccionData, setDireccionData] = useState<DireccionCompleta | null>(
    null
  );
  const [hasAddressChanged, setHasAddressChanged] = useState(false);
  const [isFormInitialized, setIsFormInitialized] = useState(false);
  const [initializationTimestamp, setInitializationTimestamp] = useState<number>(0);
  const [hasBeenSubmittedSuccessfully, setHasBeenSubmittedSuccessfully] = useState(false);

  const { showLoading, showSuccess, showError, showInfo } = useUIModals();
  const { cliente, getClientes, checkCuitExists } = useData();
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
          vendedor_id: "",
          activo: true,
          observaciones: "",
        },
    mode: "onChange", // Para validar en tiempo real
  });
  
  // Hook para bloquear navegación si hay cambios sin guardar
  useFormNavigationBlock({
    isDirty: form.formState.isDirty && !hasBeenSubmittedSuccessfully,
    isSubmitSuccessful: form.formState.isSubmitSuccessful || hasBeenSubmittedSuccessfully,
    message: "Tienes cambios sin guardar en clientes. Si sales ahora, perderás todos los cambios realizados.",
    title: "¿Salir sin guardar?",
    confirmText: "Sí, salir",
    cancelText: "No, continuar editando",
  });
  
  // Efecto para resetear el estado de cambios de dirección cuando se carga un cliente existente
  useEffect(() => {
    if (isEditMode && existingCliente) {
      setHasAddressChanged(false);
      setIsFormInitialized(false);
      setHasBeenSubmittedSuccessfully(false);
      
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
        
        // Marcar como inicializado después de un delay adicional
        setInitializationTimestamp(Date.now());
        setTimeout(() => {
          setIsFormInitialized(true);
        }, 500); // Incrementar el delay para dar más tiempo a la inicialización completa
      }, 200); // También incrementar este delay
    } else {
      // Para formularios nuevos, marcar como inicializado después de un pequeño delay
      setInitializationTimestamp(Date.now());
      setTimeout(() => {
        setIsFormInitialized(true);
        setHasBeenSubmittedSuccessfully(false);
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, existingCliente?.id]);

  // Efecto para resetear hasBeenSubmittedSuccessfully cuando el usuario hace cambios después de un submit exitoso
  useEffect(() => {
    if (hasBeenSubmittedSuccessfully && form.formState.isDirty) {
      setHasBeenSubmittedSuccessfully(false);
    }
  }, [form.formState.isDirty, hasBeenSubmittedSuccessfully]);

  // Efecto adicional para limpiar cualquier estado dirty que se haya establecido durante la inicialización
  useEffect(() => {
    if (isFormInitialized && isEditMode && existingCliente && form.formState.isDirty) {
      // Si el formulario se marca como dirty inmediatamente después de la inicialización,
      // probablemente es debido a la inicialización de componentes, no a cambios del usuario
      const timeoutId = setTimeout(() => {
        if (form.formState.isDirty && !hasBeenSubmittedSuccessfully) {
          // Forzar un reset suave que mantenga los valores pero limpie el estado dirty
          const currentValues = form.getValues();
          form.reset(currentValues, {
            keepValues: true,
            keepDirty: false,
            keepTouched: false,
            keepErrors: false,
          });
          setHasAddressChanged(false);
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [isFormInitialized, isEditMode, existingCliente, form, hasBeenSubmittedSuccessfully]);
  
  const handleSubmit = async (formData: ClienteFormData) => {
    try {
      // Validar CUIT antes de enviar
      if (formData.cuit_cuil && !validateCuit(formData.cuit_cuil)) {
        const errorMsg = "El CUIT/CUIL ingresado no es válido";
        if (modal && onError) {
          onError(errorMsg);
        } else {
          showError(errorMsg);
        }
        return;
      }

      // Verificar CUIT duplicado
      if (formData.cuit_cuil) {
        const cuitExists = await checkCuitExists(
          formData.cuit_cuil, 
          isEditMode ? existingCliente?.id : undefined
        );
        
        if (cuitExists) {
          const errorMsg = "Ya existe un cliente registrado con este CUIT/CUIL";
          if (modal && onError) {
            onError(errorMsg);
          } else {
            showError(errorMsg);
          }
          return;
        }
      }

      // Validar campos de ubicación obligatorios (solo provincia y localidad)
      const direccionFinal = direccionData?.direccion || formData.direccion || "";
      const provinciaFinal = direccionData?.provinciaNombre || formData.provincia_nombre;
      const localidadFinal = direccionData?.localidadNombre || formData.localidad_nombre;

      if (!provinciaFinal || provinciaFinal.trim() === "") {
        const errorMsg = "La provincia es obligatoria";
        if (modal && onError) {
          onError(errorMsg);
        } else {
          showError(errorMsg);
        }
        return;
      }

      if (!localidadFinal || localidadFinal.trim() === "") {
        const errorMsg = "La localidad es obligatoria";
        if (modal && onError) {
          onError(errorMsg);
        } else {
          showError(errorMsg);
        }
        return;
      }

      // Iniciar loading
      setIsLoading(true);
      if (modal && onLoadingStart) {
        onLoadingStart();
      } else {
        showLoading(
          isEditMode ? "Actualizando cliente..." : "Creando nuevo cliente..."
        );
      }
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
        vendedor_id: formData.vendedor_id || "",
        activo: formData.activo ?? true,
        observaciones: formData.observaciones || "",
      } as ClientesBD;

      if (isEditMode) {
        // Verificar si hay cambios en el formulario
        const hasDirtyFields = form.formState.dirtyFields && 
          Object.keys(form.formState.dirtyFields).length > 0;
        
        // Si no hay campos dirty y no hay cambios de dirección, no actualizar
        if (!hasDirtyFields && !hasAddressChanged) {
          setIsLoading(false);
          const infoMsg = "No se realizaron cambios en el formulario.";
          if (modal && onError) {
            onError(infoMsg);
          } else {
            showInfo(infoMsg);
          }
          return;
        }
        
        // Si hay cambios de dirección, forzar la inclusión de campos de dirección
        let effectiveDirtyFields = { ...form.formState.dirtyFields };
        if (hasAddressChanged) {
          effectiveDirtyFields = {
            ...effectiveDirtyFields,
            direccion: true,
            localidad: true,  // Campo real en BD
            provincia: true,  // Campo real en BD
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
        await getClientes();
        
        // Marcar como exitosamente enviado
        setHasBeenSubmittedSuccessfully(true);
        
        // Resetear el formulario después de una actualización exitosa
        form.reset(finalData, { 
          keepValues: true,
          keepDirty: false,
          keepTouched: false,
          keepErrors: false,
          keepIsSubmitted: false,
          keepSubmitCount: false
        });
        setHasAddressChanged(false);
        
        // Finalizar loading
        setIsLoading(false);
        if (modal && onLoadingEnd) {
          onLoadingEnd();
        }
        
        // Mostrar éxito
        if (modal && onSuccess) {
          onSuccess("Cliente actualizado exitosamente");
        } else {
          showSuccess("Cliente actualizado exitosamente");
          // Pequeño delay para asegurar que el estado se actualice antes de la navegación
          setTimeout(() => {
            navigate("/clientes");
          }, 100);
        }
      } else {
        const response = await clientesAPI.create(finalData);
        if (!response.success) {
          throw new Error(
            response.message || "Error desconocido al crear el cliente"
          );
        }
        await getClientes();
        
        // Marcar como exitosamente enviado
        setHasBeenSubmittedSuccessfully(true);
        
        // Resetear el formulario después de una creación exitosa
        form.reset();
        setHasAddressChanged(false);
        
        // Finalizar loading
        setIsLoading(false);
        if (modal && onLoadingEnd) {
          onLoadingEnd();
        }
        
        // Mostrar éxito
        if (modal && onSuccess) {
          onSuccess("Cliente creado exitosamente");
        } else {
          showSuccess("Cliente creado exitosamente");
          // Pequeño delay para asegurar que el estado se actualice antes de la navegación
          setTimeout(() => {
            navigate("/clientes");
          }, 100);
        }
      }
    } catch (error) {
      // Finalizar loading en caso de error
      setIsLoading(false);
      if (modal && onLoadingEnd) {
        onLoadingEnd();
      }
      
      // Mostrar error
      const errorMsg = error instanceof Error 
        ? error.message 
        : (typeof error === "string" ? error : "Error al guardar el cliente");
      
      if (modal && onError) {
        onError(errorMsg);
      } else {
        showError(errorMsg);
      }
    }
  };
  const resetForm = () => {
    form.reset();
    setDireccionData(null);
    setHasAddressChanged(false);
    setIsFormInitialized(true);
    setHasBeenSubmittedSuccessfully(false);
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
      const timeElapsed = Date.now() - (initializationTimestamp || 0);
      const isWithinInitializationWindow = timeElapsed < 3000; // 3 segundos de ventana
      
      const isLikelyInitialization = !isFormInitialized || 
        isWithinInitializationWindow || 
        (isEditMode && 
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
          ));
      
      // Solo marcar como cambio si definitivamente NO es inicialización
      if (!isLikelyInitialization && isFormInitialized) {
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
    [form, isEditMode, hasAddressChanged, existingCliente, isFormInitialized, initializationTimestamp]
  );

  // Función para validar dirección en tiempo real
  const validateAddress = useCallback(() => {
    const provinciaFinal = direccionData?.provinciaNombre || form.getValues("provincia_nombre");
    const localidadFinal = direccionData?.localidadNombre || form.getValues("localidad_nombre");

    const errors = {
      direccion: "", // La dirección ya no es obligatoria
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
