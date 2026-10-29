import { ArrowDownLeft, ArrowUpRight, X } from 'lucide-react';

export default function ScanActionModal({ isOpen, onClose, item, onSelectAction }) {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Select Action</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border border-gray-100 dark:border-gray-700 mb-6 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Scanned Item</p>
            <p className="font-bold text-gray-800 dark:text-white text-lg">{item.name}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Current Stock: <span className="font-bold">{item.qty} {item.unit}</span></p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => onSelectAction('IN')}
              className="flex flex-col items-center justify-center gap-2 p-4 bg-green-50 dark:bg-green-900/30 border-2 border-green-200 dark:border-green-800 hover:border-green-500 rounded-xl transition-all"
            >
              <ArrowDownLeft className="w-8 h-8 text-green-600" />
              <span className="font-bold text-green-700 dark:text-green-400">Stock IN</span>
            </button>

            <button 
              onClick={() => onSelectAction('OUT')}
              className="flex flex-col items-center justify-center gap-2 p-4 bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-800 hover:border-red-500 rounded-xl transition-all"
            >
              <ArrowUpRight className="w-8 h-8 text-red-600" />
              <span className="font-bold text-red-700 dark:text-red-400">Stock OUT</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}