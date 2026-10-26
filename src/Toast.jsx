import { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-slide-in">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border ${
        type === 'success' 
          ? 'bg-green-50 dark:bg-green-900/50 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400' 
          : 'bg-red-50 dark:bg-red-900/50 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'
      }`}>
        {type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
        <p className="text-sm font-semibold">{message}</p>
        <button onClick={onClose} className="ml-2 p-1 hover:bg-black/10 rounded-full">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}