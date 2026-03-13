import { useToastContext } from '../context/ToastContext.jsx';

export function useToast() {
  const { showToast, removeToast, toasts } = useToastContext();

  return {
    toasts,
    show: showToast,
    success: (message, duration) => showToast(message, 'success', duration),
    error: (message, duration) => showToast(message, 'error', duration),
    info: (message, duration) => showToast(message, 'info', duration),
    remove: removeToast
  };
}

