import { useUIModals } from "~/context/ModalsContext";
import type { ModalProps } from "~/context/ModalsContext";
import {
  ModalConfirmation,
  ModalLoading,
  ModalSuccess,
  ModalError,
  ModalProgressive,
  ModalInformation
} from "./ModalsGlobal";

export function ModalManager() {
  const { modal, closeModal, progressiveSteps } = useUIModals();
  const { type, props } = modal;

  if (!type) return null;

  switch (type) {
    case "LOADING": {
      const loadingProps = props as ModalProps["LOADING"];
      return (
        <ModalLoading
          message={loadingProps?.message}
          title={loadingProps?.title}
        />
      );
    }
    case "SUCCESS": {
      const successProps = props as ModalProps["SUCCESS"];
      return (
        <ModalSuccess
          onClose={closeModal}
          message={successProps?.message}
          title={successProps?.title}
          btnPrimary={successProps?.btnPrimary}
          btnSecondary={{ 
            label: "Aceptar", 
            handleOnClick: () => {
              closeModal();
              successProps?.onSuccess?.();
            }, 
            variant: "green" 
          }}
        />
      );
    }
    case "ERROR": {
      const errorProps = props as ModalProps["ERROR"];
      return (
        <ModalError
          onClose={closeModal}
          message={errorProps?.message}
          title={errorProps?.title}
          btnSecondary={{ 
            label: "Aceptar", 
            handleOnClick: () => {
              closeModal();
              errorProps?.onError?.();
            }, 
            variant: "red" 
          }}
        />
      );
    }
    case "CONFIRMATION": {
      const confirmProps = props as ModalProps["CONFIRMATION"];
      return (
        <ModalConfirmation
          onClose={() => {
            closeModal();
            confirmProps?.onCancel?.();
          }}
          message={confirmProps?.message || "¿Estás seguro?"}
          onConfirm={() => {
            closeModal();
            confirmProps?.onConfirm();
          }}
        />
      );
    }
    case "PROGRESSIVE": {
      const progressiveProps = props as ModalProps["PROGRESSIVE"];
      return (
        <ModalProgressive
          onClose={closeModal}
          steps={progressiveProps?.steps || progressiveSteps}
        />
      );
    }
    case "INFORMATION": {
      const infoProps = props as ModalProps["INFORMATION"];
      return (
        <ModalInformation
          onClose={closeModal}
          message={typeof infoProps?.message === 'string' ? infoProps.message : undefined}
          title={infoProps?.title}
          btnSecondary={{ 
            label: "Aceptar", 
            handleOnClick: closeModal, 
            variant: "blue" 
          }}
        />
      );
    }
    case "CUSTOM": {
      const customProps = props as ModalProps["CUSTOM"];
      const CustomComponent = customProps?.component;
      
      if (!CustomComponent) return null;
      
      return (
        <CustomComponent
          {...customProps?.props}
          onClose={closeModal}
        />
      );
    }
    default:
      return null;
  }
}
