import { useEffect } from 'react';
import { CheckCircle, AlertCircle, X, Undo2 } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose, actionLabel, onAction }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-slide-in">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border ${
        type === 'success' 
          ? 'bg-green-50 dark:bg-green-900/50 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400' 
          : type === 'error'
          ? 'bg-red-50 dark:bg-red-900/50 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'
          : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
      }`}>
        {type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
        <p className="text-sm font-semibold">{message}</p>
        
        {/* UNDO BUTTON */}
        {actionLabel && onAction && (
          <button 
            onClick={() => { onAction(); onClose(); }} 
            className="ml-2 px-3 py-1 text-xs font-bold bg-white/50 dark:bg-black/20 hover:bg-white dark:hover:bg-black/40 rounded transition-colors flex items-center gap-1"
          >
            <Undo2 className="w-3 h-3" /> {actionLabel}
          </button>
        )}

        <button onClick={onClose} className="ml-2 p-1 hover:bg-black/10 rounded-full">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}