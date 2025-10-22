import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { variants } from "~/components/Buttons";
export type ModalType =
  | "LOADING"
  | "SUCCESS"
  | "ERROR"
  | "CONFIRMATION"
  | "PROGRESSIVE"
  | "INFORMATION"
  | "CUSTOM";

// Props específicos para cada tipo de modal
export type ModalProps = {
  LOADING: {
    title?: string;
    message?: string;
  };
  SUCCESS: {
    title?: string;
    message?: string;
    btnPrimary?: ButtonAction;
    onSuccess?: () => void;
  };
  ERROR: {
    title?: string;
    message?: string;
    btnPrimary?: ButtonAction;
    onError?: () => void;
  };
  CONFIRMATION: {
    title?: string;
    message?: string | React.ReactNode;
    onConfirm: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
  };
  PROGRESSIVE: {
    title?: string;
    steps?: Step[];
  };
  INFORMATION: {
    title?: string;
    message?: string | React.ReactNode;
    btnPrimary?: ButtonAction;
  };
  CUSTOM: {
    component: React.ComponentType<any>;
    props?: Record<string, any>;
    title?: string;
  };
};

export type ButtonAction = {
  label: string;
  handleOnClick: () => void;
  variant?: keyof typeof variants;
};

type ModalState<T extends ModalType = ModalType> = {
  type: T | null;
  props?: T extends keyof ModalProps ? ModalProps[T] : Record<string, any>;
};

export type Step = {
  label: string;
  status: "done" | "in-progress" | "error" | "pending";
};
type UIModalsContextType = {
  modal: ModalState;
  openModal: <T extends ModalType>(
    type: T,
    props?: T extends keyof ModalProps ? ModalProps[T] : Record<string, any>
  ) => void;
  closeModal: () => void;
  clearModalQueue: () => void;
  progressiveSteps: Step[];
  setProgressiveSteps: React.Dispatch<React.SetStateAction<Step[]>>;
  updateStep: (index: number, status: Step["status"]) => void;
  // Nuevos métodos de utilidad
  showLoading: (message?: string, title?: string) => void;
  showSuccess: (message?: string, onSuccess?: () => void) => void;
  showError: (message?: string, onError?: () => void) => void;
  showConfirmation: (
    message: string | React.ReactNode,
    onConfirm: () => void,
    options?: { title?: string; confirmText?: string; cancelText?: string }
  ) => void;
  showInfo: (message: string | React.ReactNode, title?: string) => void;
  showCustomModal: (component: React.ComponentType<any>, props?: Record<string, any>) => void;
};

const UIModalsContext = createContext<UIModalsContextType | undefined>(undefined);

export const UIModalsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [modal, setModal] = useState<ModalState>({ type: null });
  const [modalQueue, setModalQueue] = useState<ModalState[]>([]);
  const [progressiveSteps, setProgressiveSteps] = useState<Step[]>([]);

  const openModal = useCallback(<T extends ModalType>(
    type: T,
    props?: T extends keyof ModalProps ? ModalProps[T] : Record<string, any>
  ) => {
    const newModal = { type, props };
    
    // Modales prioritarios que se muestran inmediatamente por encima de otros
    const priorityModals: ModalType[] = ["LOADING", "SUCCESS", "ERROR"];
    
    if (modal.type === null) {
      // No hay modal activo, mostrar inmediatamente
      setModal(newModal);
    } else if (priorityModals.includes(type)) {
      // Si es un modal prioritario, guardar el modal actual en la cola y mostrar el prioritario
      setModalQueue(prev => [modal, ...prev]);
      setModal(newModal);
    } else {
      // Hay un modal activo y no es prioritario, agregar a la cola
      setModalQueue(prev => [...prev, newModal]);
    }
  }, [modal]);

  const closeModal = useCallback(() => {
    // Si hay modales en cola, mostrar el siguiente
    if (modalQueue.length > 0) {
      const nextModal = modalQueue[0];
      setModal(nextModal);
      setModalQueue(prev => prev.slice(1));
    } else {
      setModal({ type: null });
    }
  }, [modalQueue]);

  const clearModalQueue = useCallback(() => {
    setModalQueue([]);
    setModal({ type: null });
  }, []);

  // Cleanup: cerrar modales al desmontar el componente
  useEffect(() => {
    return () => {
      setModal({ type: null });
      setModalQueue([]);
    };
  }, []);

  // Cerrar modal con tecla Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && modal.type) {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [modal.type, closeModal]);

  const updateStep = useCallback((index: number, status: Step["status"]) => {
    setProgressiveSteps((prev) =>
      prev.map((step, i) => (i === index ? { ...step, status } : step))
    );
  }, []);

  // Métodos de utilidad optimizados
  const showLoading = useCallback((message?: string, title?: string) => {
    openModal("LOADING", { message, title });
  }, [openModal]);

  const showSuccess = useCallback((message?: string, onSuccess?: () => void) => {
    openModal("SUCCESS", { message, onSuccess });
  }, [openModal]);

  const showError = useCallback((message?: string, onError?: () => void) => {
    openModal("ERROR", { message, onError });
  }, [openModal]);

  const showConfirmation = useCallback((
    message: string | React.ReactNode,
    onConfirm: () => void,
    options?: { title?: string; confirmText?: string; cancelText?: string }
  ) => {
    openModal("CONFIRMATION", {
      message,
      onConfirm,
      title: options?.title,
      confirmText: options?.confirmText,
      cancelText: options?.cancelText,
    });
  }, [openModal]);

  const showInfo = useCallback((message: string | React.ReactNode, title?: string) => {
    openModal("INFORMATION", { message, title });
  }, [openModal]);

  const showCustomModal = useCallback((component: React.ComponentType<any>, props?: Record<string, any>) => {
    openModal("CUSTOM", { component, props });
  }, [openModal]);
  
  return (
    <UIModalsContext.Provider
      value={{
        modal,
        openModal,
        closeModal,
        clearModalQueue,
        progressiveSteps,
        setProgressiveSteps,
        updateStep,
        showLoading,
        showSuccess,
        showError,
        showConfirmation,
        showInfo,
        showCustomModal,
      }}
    >
      {children}
    </UIModalsContext.Provider>
  );
};

export const useUIModals = () => {
  const context = useContext(UIModalsContext);
  if (!context)
    throw new Error("useUIModals must be used within UIModalsProvider");
  return context;
};
