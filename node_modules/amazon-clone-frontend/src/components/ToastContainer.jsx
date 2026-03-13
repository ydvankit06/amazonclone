import { useToast } from '../hooks/useToast.js';

function ToastContainer() {
  const { toasts, remove } = useToast();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => {
        const base =
          'min-w-[220px] max-w-xs px-3 py-2 rounded shadow-lg text-sm flex items-start gap-2 border';
        const typeClasses =
          toast.type === 'success'
            ? 'bg-green-50 text-green-800 border-green-300'
            : toast.type === 'error'
            ? 'bg-red-50 text-red-800 border-red-300'
            : 'bg-gray-900/90 text-white border-gray-700';

        return (
          <div
            key={toast.id}
            className={`${base} ${typeClasses}`}
          >
            <span className="flex-1">{toast.message}</span>
            <button
              type="button"
              onClick={() => remove(toast.id)}
              className="text-xs opacity-70 hover:opacity-100"
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default ToastContainer;

