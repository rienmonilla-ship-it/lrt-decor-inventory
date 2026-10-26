import { AlertTriangle } from 'lucide-react';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", isDestructive = true }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 text-center">
          <div className="flex items-center justify-center mb-5">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isDestructive ? 'bg-red-100 dark:bg-red-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30'}`}>
              <AlertTriangle className={`w-8 h-8 ${isDestructive ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'}`} />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">{message}</p>
          
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors">
              Cancel
            </button>
            <button onClick={() => { onConfirm(); onClose(); }} className={`flex-1 py-3 text-sm font-semibold text-white rounded-xl transition-colors ${isDestructive ? 'bg-red-600 hover:bg-red-700' : 'bg-[#0e2a21] hover:bg-[#184536]'}`}>
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}