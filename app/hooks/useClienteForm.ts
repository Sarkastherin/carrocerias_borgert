import { useForm } from "react-hook-form";
import type {
  ClientesBD,
} from "~/types/clientes";
import { useUIModals } from "~/context/ModalsContext";
import { useData } from "~/context/DataContext";
import { useState } from "react";
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

  const { showLoading, showSuccess, showError, showInfo, closeModal } = useUIModals();
  const { cliente, getClientes, checkCuitExists } = useData();
  const isEditMode = Boolean(cliente);
  const existingCliente = cliente as ClientesBD | null;
  const form = useForm<ClientesBD>({
    defaultValues: existingCliente
      ? existingCliente
      : {
          razon_social: "",
          nombre_contacto: "",
          telefono: "",
          email: "",
          cuit_cuil: "",
          direccion: "",
          provincia_id: "",
          provincia: "",
          localidad_id: "",
          localidad: "",
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
    isDirty:
      form.formState.isDirty && form.formState.dirtyFields
        ? Object.keys(form.formState.dirtyFields).length > 0
        : false,
    isSubmitSuccessful: form.formState.isSubmitSuccessful,
    message:
      "Tienes cambios sin guardar en clientes. Si sales ahora, perderás todos los cambios realizados.",
    title: "¿Salir sin guardar?",
    confirmText: "Sí, salir",
    cancelText: "No, continuar editando",
  });

  const handleSubmit = async (formData: ClientesBD) => {
    try {
      showLoading("Validando datos...");
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
      // Verificar CUIT duplicado|
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
      // Validar datos en provincia y localidad
      if (!formData.provincia || formData.provincia.trim() === "") {
        const errorMsg = "La provincia es obligatoria";
        if (modal && onError) {
          onError(errorMsg);
        } else {
          showError(errorMsg);
        }
        return;
      }

      if (!formData.localidad || formData.localidad.trim() === "") {
        const errorMsg = "La localidad es obligatoria";
        if (modal && onError) {
          onError(errorMsg);
        } else {
          showError(errorMsg);
        }
        return;
      }
      closeModal();

      // Iniciar loading
      setIsLoading(true);
      if (modal && onLoadingStart) {
        onLoadingStart();
      } else {
        showLoading(
          isEditMode ? "Actualizando cliente..." : "Creando nuevo cliente..."
        );
      }

      if (isEditMode) {
        // Verificar si hay cambios en el formulario
        const hasDirtyFields =
          form.formState.dirtyFields &&
          Object.keys(form.formState.dirtyFields).length > 0;

        // Si no hay campos dirty y no hay cambios de dirección, no actualizar
        if (!hasDirtyFields) {
          setIsLoading(false);
          const infoMsg = "No se realizaron cambios en el formulario.";
          if (modal && onError) {
            onError(infoMsg);
          } else {
            showInfo(infoMsg);
          }
          return;
        }
        let effectiveDirtyFields = { ...form.formState.dirtyFields };

        const updatePayload = prepareUpdatePayload<ClientesBD>({
          dirtyFields: effectiveDirtyFields,
          formData: formData,
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

        // Resetear el formulario después de una actualización exitosa
        form.reset(formData);

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
        const response = await clientesAPI.create(formData);
        if (!response.success) {
          throw new Error(
            response.message || "Error desconocido al crear el cliente"
          );
        }
        await getClientes();

        // Resetear el formulario después de una creación exitosa
        form.reset();

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
      const errorMsg =
        error instanceof Error
          ? error.message
          : typeof error === "string"
            ? error
            : "Error al guardar el cliente";

      if (modal && onError) {
        onError(errorMsg);
      } else {
        showError(errorMsg);
      }
    }
  };

  return {
    // Form methods
    register: form.register,
    handleSubmit: form.handleSubmit,
    formState: form.formState,
    //reset: resetForm,
    setValue: form.setValue,
    getValues: form.getValues,
    watch: form.watch,

    // Custom submit handler
    onSubmit: handleSubmit,
    isLoading,

    // Helper texts
    submitButtonText: isEditMode ? "Actualizar Cliente" : "Crear Cliente",
    formTitle: isEditMode ? "Editar Cliente" : "Nuevo Cliente",
  };
}
