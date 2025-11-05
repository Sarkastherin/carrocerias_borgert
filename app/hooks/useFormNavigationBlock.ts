import { useEffect, useCallback, useRef } from "react";
import { useBlocker, type BlockerFunction } from "react-router";
import { useUIModals } from "~/context/ModalsContext";

interface UseFormNavigationBlockProps {
  /**
   * Indica si el formulario tiene cambios sin guardar (isDirty de react-hook-form)
   */
  isDirty: boolean;
  
  /**
   * Indica si el formulario se guardó exitosamente (isSubmitSuccessful de react-hook-form)
   */
  isSubmitSuccessful: boolean;
  
  /**
   * Mensaje personalizado para mostrar en la confirmación
   * @default "Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?"
   */
  message?: string;
  
  /**
   * Título del modal de confirmación
   * @default "Cambios sin guardar"
   */
  title?: string;
  
  /**
   * Texto del botón de confirmar
   * @default "Salir sin guardar"
   */
  confirmText?: string;
  
  /**
   * Texto del botón de cancelar
   * @default "Continuar editando"
   */
  cancelText?: string;
}

/**
 * Hook que bloquea la navegación cuando hay cambios sin guardar en un formulario
 * 
 * @example
 * ```tsx
 * const { formState: { isDirty, isSubmitSuccessful } } = useForm();
 * 
 * useFormNavigationBlock({
 *   isDirty,
 *   isSubmitSuccessful,
 *   message: "¿Deseas salir sin guardar los cambios?",
 *   title: "Cambios sin guardar"
 * });
 * ```
 */
export function useFormNavigationBlock({
  isDirty,
  isSubmitSuccessful,
  message = "Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?",
  title = "Cambios sin guardar",
  confirmText = "Salir sin guardar",
  cancelText = "Continuar editando",
}: UseFormNavigationBlockProps) {
  const { openModal } = useUIModals();
  const hasShownModalRef = useRef(false);
  
  // Bloquear navegación solo si hay cambios sin guardar Y no se ha guardado exitosamente
  const shouldBlock = isDirty && !isSubmitSuccessful;

  // useBlocker acepta una función que devuelve true/false o directamente el booleano
  const blocker = useBlocker(
    useCallback<BlockerFunction>(
      ({ currentLocation, nextLocation }) => {
        // Solo bloquear si hay cambios y las rutas son diferentes
        return shouldBlock && currentLocation.pathname !== nextLocation.pathname;
      },
      [shouldBlock]
    )
  );

  // Advertencia al cerrar o recargar la página
  useEffect(() => {
    if (!shouldBlock) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // Algunos navegadores modernos ignoran el mensaje personalizado
      e.returnValue = message;
      return message;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [shouldBlock, message]);

  // Mostrar modal de confirmación personalizado cuando se intenta navegar
  useEffect(() => {
    if (blocker.state === "blocked" && !hasShownModalRef.current) {
      hasShownModalRef.current = true;
      
      openModal("CONFIRMATION", {
        title,
        message,
        confirmText,
        cancelText,
        onConfirm: () => {
          // Si el usuario confirma, permitir la navegación
          // Esperar un tick para que el modal se cierre primero
          setTimeout(() => {
            blocker.proceed();
            hasShownModalRef.current = false;
          }, 0);
        },
        onCancel: () => {
          // Si el usuario cancela, resetear el blocker
          // Esperar un tick para que el modal se cierre primero
          setTimeout(() => {
            blocker.reset();
            hasShownModalRef.current = false;
          }, 0);
        },
      });
    }
    
    // Resetear la referencia cuando el blocker ya no esté bloqueado
    if (blocker.state !== "blocked" && hasShownModalRef.current) {
      hasShownModalRef.current = false;
    }
  }, [blocker.state, message, title, confirmText, cancelText, openModal]);

  return {
    isBlocked: blocker.state === "blocked",
    shouldBlock,
  };
}
