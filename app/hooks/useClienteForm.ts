import { useForm } from "react-hook-form";
import type { ClientesBD, ClienteFormData, DireccionCompleta } from "~/types/clientes";
import { useUIModals } from "~/context/ModalsContext";
import { useData } from "~/context/DataContext";
import { useState, useCallback } from "react";
import { clientesAPI } from "~/backend/sheetServices";

export function useClienteForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [direccionData, setDireccionData] = useState<DireccionCompleta | null>(null);
  
  const { showLoading, showSuccess, showError, showInfo } = useUIModals();
  const { cliente } = useData();
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
  const handleSubmit = async (formData: ClienteFormData) => {
    try {
      showLoading(isEditMode ? "Actualizando cliente..." : "Creando nuevo cliente...");
      
      // Preparar datos finales mezclando form data con dirección estructurada
      const finalData: ClientesBD = {
        ...(isEditMode && { id: existingCliente?.id || "" }),
        fecha_creacion: existingCliente?.fecha_creacion || new Date().toISOString(),
        razon_social: formData.razon_social,
        nombre_contacto: formData.nombre_contacto,
        telefono: formData.telefono || "",
        email: formData.email || "",
        cuit_cuil: formData.cuit_cuil || "",
        // Usar dirección estructurada si está disponible, sino usar la dirección simple
        direccion: direccionData?.direccion || formData.direccion,
        localidad: direccionData?.localidadNombre || formData.localidad_nombre || "",
        provincia: direccionData?.provinciaNombre || formData.provincia_nombre || "",
        // Nuevos campos: IDs oficiales de Georef
        provincia_id: direccionData?.provinciaId || formData.provincia_id || undefined,
        localidad_id: direccionData?.localidadId || formData.localidad_id || undefined,
        pais: formData.pais || "Argentina",
        condicion_iva: formData.condicion_iva || "",
        medio_contacto: formData.medio_contacto || "",
        vendedor_asignado: formData.vendedor_asignado || "",
        activo: formData.activo ?? true,
        observaciones: formData.observaciones || "",
      } as ClientesBD;

      if(isEditMode){
        // Lógica para actualizar cliente
        console.log("Actualizando cliente:", finalData);
        showSuccess("Cliente actualizado exitosamente");
      }
      else {
        const response = await clientesAPI.create(finalData);
        if(!response.success){
          throw new Error(response.message || "Error desconocido al crear el cliente");
        }
        console.log("Creando cliente:", finalData);
        showSuccess("Cliente creado exitosamente");
      }
    } catch (error) {
      showError(typeof error === "string" ? error : "Error al guardar el cliente");
    }
  };
  const resetForm = () => {
    form.reset();
    setDireccionData(null);
  };

  const handleDireccionChange = useCallback((direccion: DireccionCompleta | null) => {
    setDireccionData(direccion);
    
    // Actualizar los campos del formulario con los datos de la dirección
    if (direccion) {
      form.setValue("direccion", direccion.direccion);
      form.setValue("provincia_id", direccion.provinciaId);
      form.setValue("provincia_nombre", direccion.provinciaNombre);
      form.setValue("localidad_id", direccion.localidadId);
      form.setValue("localidad_nombre", direccion.localidadNombre);
    }
  }, [form]);

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

  // Debug: Verificar datos del cliente existente
  console.log("🔧 useClienteForm existingCliente:", existingCliente);
  console.log("🔧 useClienteForm initialAddress:", {
    provinciaId: existingCliente?.provincia_id || "",
    localidadId: existingCliente?.localidad_id || "",
    direccion: existingCliente?.direccion || "",
    provinciaNombre: existingCliente?.provincia || "",
    localidadNombre: existingCliente?.localidad || "",
  });

  // Debug: Verificar datos del cliente existente
  console.log("🔧 useClienteForm existingCliente:", existingCliente);

  return {
    // React Hook Form methods
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
