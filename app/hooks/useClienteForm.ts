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

export function useClienteForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [direccionData, setDireccionData] = useState<DireccionCompleta | null>(
    null
  );
  const [hasAddressChanged, setHasAddressChanged] = useState(false);

  const { showLoading, showSuccess, showError, showInfo } = useUIModals();
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
  });
  useEffect(() => {
    //console.log(form.formState.dirtyFields)
  }, [form.formState.dirtyFields]);
  const handleSubmit = async (formData: ClienteFormData) => {
    try {
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
        
        // Si no hay campos dirty y no hay cambios de dirección, no actualizar
        if (!hasDirtyFields && !hasAddressChanged) {
          showInfo("No se realizaron cambios en el formulario.");
          return;
        }

        console.log("✅ Cambios detectados, procediendo con actualización");
        
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
        console.log("Actualizando cliente:", updatePayload);
        showSuccess("Cliente actualizado exitosamente");
      } else {
        const response = await clientesAPI.create(finalData);
        if (!response.success) {
          throw new Error(
            response.message || "Error desconocido al crear el cliente"
          );
        }
        getClientes();
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

      // Mejorar la detección de inicialización vs cambio de usuario
      // Es inicialización solo si:
      // 1. Está en modo edición
      // 2. Aún no se han registrado cambios de dirección 
      // 3. Los datos coinciden con los datos originales del cliente
      const isLikelyInitialization = isEditMode && 
        !hasAddressChanged && 
        existingCliente && 
        direccion &&
        (
          direccion.direccion === existingCliente.direccion ||
          direccion.localidadNombre === existingCliente.localidad ||
          direccion.provinciaNombre === existingCliente.provincia
        );
      
      if (!isLikelyInitialization) {
        setHasAddressChanged(true);
      }

      // Actualizar los campos del formulario con los datos de la dirección
      if (direccion) {
        // Solo marcar como dirty si no es inicialización
        const options = !isLikelyInitialization ? { shouldDirty: true } : {};
        
        form.setValue("direccion", direccion.direccion, options);
        form.setValue("provincia_id", direccion.provinciaId, options);
        form.setValue("provincia_nombre", direccion.provinciaNombre, options);
        form.setValue("localidad_id", direccion.localidadId, options);
        form.setValue("localidad_nombre", direccion.localidadNombre, options);
      }
    },
    [form, isEditMode, hasAddressChanged, existingCliente]
  );

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
