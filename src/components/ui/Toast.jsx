import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const toastVariants = {
  success: {
    icon: CheckCircleIcon,
    bgColor: 'bg-green-50',
    textColor: 'text-green-800',
    iconColor: 'text-green-400',
    borderColor: 'border-green-200',
  },
  error: {
    icon: ExclamationCircleIcon,
    bgColor: 'bg-red-50',
    textColor: 'text-red-800',
    iconColor: 'text-red-400',
    borderColor: 'border-red-200',
  },
  warning: {
    icon: ExclamationCircleIcon,
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-800',
    iconColor: 'text-yellow-400',
    borderColor: 'border-yellow-200',
  },
  info: {
    icon: InformationCircleIcon,
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-800',
    iconColor: 'text-blue-400',
    borderColor: 'border-blue-200',
  },
};

const Toast = ({ message, type = 'info', onClose, duration = 5000 }) => {
  const { icon: Icon, bgColor, textColor, iconColor, borderColor } = toastVariants[type] || toastVariants.info;

  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{ duration: 0.2, type: 'spring', damping: 25, stiffness: 300 }}
      className={`pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg shadow-lg ${bgColor} border ${borderColor}`}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className={`h-6 w-6 ${iconColor}`} aria-hidden="true" />
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className={`text-sm font-medium ${textColor}`}>{message}</p>
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <button
              type="button"
              className="inline-flex rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={onClose}
            >
              <span className="sr-only">Cerrar</span>
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ToastContainer = ({ toasts, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50 w-full max-w-xs space-y-4">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => onClose(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export { Toast, ToastContainer };

export const useToast = () => {
  const [toasts, setToasts] = React.useState([]);

  const showToast = React.useCallback((message, options = {}) => {
    const id = Date.now().toString();
    const { type = 'info', duration = 5000 } = options;

    setToasts((prevToasts) => [
      ...prevToasts,
      { id, message, type, duration },
    ]);

    return id;
  }, []);

  const removeToast = React.useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const toast = React.useMemo(() => ({
    success: (message, options) => showToast(message, { ...options, type: 'success' }),
    error: (message, options) => showToast(message, { ...options, type: 'error' }),
    warning: (message, options) => showToast(message, { ...options, type: 'warning' }),
    info: (message, options) => showToast(message, { ...options, type: 'info' }),
    dismiss: removeToast,
  }), [showToast, removeToast]);

  return { toasts, toast, removeToast };
};
