import { X, Printer } from 'lucide-react';

export default function PrintSlipModal({ isOpen, onClose, item, qty, projectName, userName }) {
  if (!isOpen || !item) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleString();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Stock Out Slip</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"><X className="w-5 h-5 text-gray-500" /></button>
        </div>

        <div className="p-8 space-y-4">
          <div className="text-center border-b border-dashed border-gray-300 dark:border-gray-600 pb-4 mb-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">LRT DECOR PRODUCTS</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">San Jose del Monte, Bulacan</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Date: {currentDate}</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Item:</span>
              <span className="font-semibold text-gray-800 dark:text-white">{item.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Specification:</span>
              <span className="text-gray-800 dark:text-white">{item.spec || '-'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Quantity:</span>
              <span className="font-bold text-gray-800 dark:text-white">{qty} {item.unit}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Project:</span>
              <span className="font-semibold text-gray-800 dark:text-white">{projectName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Released By:</span>
              <span className="text-gray-800 dark:text-white">{userName}</span>
            </div>
          </div>

          <div className="pt-8 mt-4 border-t border-dashed border-gray-300 dark:border-gray-600">
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">Received by:</p>
            <div className="mt-8 border-b border-gray-400 w-3/4 mx-auto"></div>
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-1">Signature over Printed Name</p>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Close</button>
          <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0e2a21] hover:bg-[#184536] rounded-lg">
            <Printer className="w-4 h-4" /> Print Slip
          </button>
        </div>
      </div>
    </div>
  );
}