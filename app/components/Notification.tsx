import { useState, useEffect } from "react";

interface NotificationProps {
  show: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message?: string;
  action?: {
    text: string;
    onClick: () => void;
  };
  onClose?: () => void;
  autoClose?: number; // milisegundos
}

export function Notification({
  show,
  type,
  title,
  message,
  action,
  onClose,
  autoClose
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    setIsVisible(show);
  }, [show]);

  useEffect(() => {
    if (show && autoClose && autoClose > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, autoClose);

      return () => clearTimeout(timer);
    }
  }, [show, autoClose, onClose]);

  if (!isVisible) return null;

  const getIconAndColors = () => {
    switch (type) {
      case 'success':
        return {
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ),
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800',
          iconColor: 'text-green-500',
          titleColor: 'text-green-800 dark:text-green-200',
          messageColor: 'text-green-700 dark:text-green-300'
        };
      case 'warning':
        return {
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ),
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
          borderColor: 'border-yellow-200 dark:border-yellow-800',
          iconColor: 'text-yellow-500',
          titleColor: 'text-yellow-800 dark:text-yellow-200',
          messageColor: 'text-yellow-700 dark:text-yellow-300'
        };
      case 'error':
        return {
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ),
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-800',
          iconColor: 'text-red-500',
          titleColor: 'text-red-800 dark:text-red-200',
          messageColor: 'text-red-700 dark:text-red-300'
        };
      default: // info
        return {
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          ),
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          borderColor: 'border-blue-200 dark:border-blue-800',
          iconColor: 'text-blue-500',
          titleColor: 'text-blue-800 dark:text-blue-200',
          messageColor: 'text-blue-700 dark:text-blue-300'
        };
    }
  };

  const { icon, bgColor, borderColor, iconColor, titleColor, messageColor } = getIconAndColors();

  return (
    <div className={`${bgColor} ${borderColor} border rounded-md p-4 mb-4 transition-all duration-300 ease-in-out`}>
      <div className="flex items-start gap-3">
        <div className={`${iconColor} flex-shrink-0 mt-0.5`}>
          {icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-medium ${titleColor}`}>
            {title}
          </h4>
          
          {message && (
            <p className={`text-sm mt-1 ${messageColor}`}>
              {message}
            </p>
          )}
          
          {action && (
            <button
              type="button"
              onClick={action.onClick}
              className={`text-sm ${titleColor} underline hover:no-underline mt-2 focus:outline-none focus:ring-2 focus:ring-offset-1 rounded`}
            >
              {action.text}
            </button>
          )}
        </div>
        
        {onClose && (
          <button
            type="button"
            onClick={() => {
              setIsVisible(false);
              onClose();
            }}
            className={`${iconColor} hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-1 rounded flex-shrink-0`}
          >
            <span className="sr-only">Cerrar</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

// Hook para manejar notificaciones de forma más sencilla
export function useNotification() {
  const [notification, setNotification] = useState<NotificationProps | null>(null);

  const showNotification = (props: Omit<NotificationProps, 'show' | 'onClose'>) => {
    setNotification({
      ...props,
      show: true,
      onClose: () => setNotification(null)
    });
  };

  const hideNotification = () => {
    setNotification(null);
  };

  return {
    notification,
    showNotification,
    hideNotification
  };
}