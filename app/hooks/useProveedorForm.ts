import { useForm } from "react-hook-form";
import { useUIModals } from "~/context/ModalsContext";
import { useData } from "~/context/DataContext";
import { useState } from "react";
import { proveedoresAPI } from "~/backend/sheetServices";
import { useNavigate } from "react-router";
import { prepareUpdatePayload } from "~/utils/prepareUpdatePayload";
import { useFormNavigationBlock } from "./useFormNavigationBlock";
import type { ProveedoresBD } from "~/types/proveedores";
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

export function useProveedorForm({
  modal = false,
  onSuccess,
  onError,
  onLoadingStart,
  onLoadingEnd,
  handleSelectedProveedor,
}: {
  modal?: boolean;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
  onLoadingStart?: () => void;
  onLoadingEnd?: () => void;
  handleSelectedProveedor?: (item: ProveedoresBD) => void;
}) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { showLoading, showSuccess, showError, showInfo, closeModal } =
    useUIModals();
  const { proveedor, getProveedores, checkCuitExists } = useData();
  const isEditMode = Boolean(proveedor);
  const existingProveedor = proveedor as ProveedoresBD | null;
  const form = useForm<ProveedoresBD>({
    defaultValues: existingProveedor
      ? existingProveedor
      : {
          razon_social: "",
          telefono: "",
          email: "",
          cuit_cuil: "",
          direccion: "",
          provincia_id: "",
          provincia: "",
          localidad_id: "",
          localidad: "",
          pais: "Argentina",
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
      "Tienes cambios sin guardar en proveedores. Si sales ahora, perderás todos los cambios realizados.",
    title: "¿Salir sin guardar?",
    confirmText: "Sí, salir",
    cancelText: "No, continuar editando",
  });

  const handleSubmit = async (formData: ProveedoresBD) => {
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
          isEditMode ? existingProveedor?.id : undefined,
          "proveedores",
        );

        if (cuitExists) {
          const errorMsg =
            "Ya existe un proveedor registrado con este CUIT/CUIL";
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
          isEditMode
            ? "Actualizando proveedor..."
            : "Creando nuevo proveedor...",
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

        const updatePayload = prepareUpdatePayload<ProveedoresBD>({
          dirtyFields: effectiveDirtyFields,
          formData: formData,
        });
        const response = await proveedoresAPI.update(
          existingProveedor?.id || "",
          updatePayload,
        );
        if (!response.success) {
          console.log(response);
          throw new Error(
            response.message || "Error desconocido al actualizar el proveedor",
          );
        }
        await getProveedores();

        // Resetear el formulario después de una actualización exitosa
        form.reset(formData);

        // Finalizar loading
        setIsLoading(false);
        if (modal && onLoadingEnd) {
          onLoadingEnd();
        }

        // Mostrar éxito
        if (modal && onSuccess) {
          onSuccess("Proveedor actualizado exitosamente");
        } else {
          showSuccess("Proveedor actualizado exitosamente");
          // Pequeño delay para asegurar que el estado se actualice antes de la navegación
          setTimeout(() => {
            navigate("/proveedores");
          }, 100);
        }
      } else {
        const response = await proveedoresAPI.create(formData);
        if (!response.success) {
          throw new Error(
            response.message || "Error desconocido al crear el proveedor",
          );
        }
        await getProveedores();

        // Resetear el formulario después de una creación exitosa
        form.reset();

        // Finalizar loading
        setIsLoading(false);
        if (modal && onLoadingEnd) {
          onLoadingEnd();
        }

        // Ejecutar handleSelectedProveedor si está disponible (desde modal de pedidos)
        if (handleSelectedProveedor && response.data) {
          handleSelectedProveedor(response.data as ProveedoresBD);
        }

        // Mostrar éxito
        if (modal && onSuccess) {
          onSuccess("Proveedor creado exitosamente");
        } else {
          showSuccess("Proveedor creado exitosamente");
          // Pequeño delay para asegurar que el estado se actualice antes de la navegación
          setTimeout(() => {
            navigate("/proveedores");
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
            : "Error al guardar el proveedor";

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
    submitButtonText: isEditMode ? "Actualizar Proveedor" : "Crear Proveedor",
    formTitle: isEditMode ? "Editar Proveedor" : "Nuevo Proveedor",
  };
}
