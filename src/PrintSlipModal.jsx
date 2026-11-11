import { X, Printer } from 'lucide-react';
import { formatCurrency } from './formatCurrency';

export default function PrintSlipModal({ isOpen, onClose, item, qty, projectName, userName }) {
  if (!isOpen || !item) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header - itatago sa print */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 print:hidden">
          <h2 className="text-lg font-bold text-gray-900">Stock Out Slip</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Printable Content */}
        <div className="p-6 overflow-y-auto print-content">
          
          {/* Print Header */}
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-gray-900">LRT DECOR PRODUCTS</h1>
            <p className="text-xs text-gray-500">San Jose del Monte, Bulacan</p>
            <h2 className="text-md font-semibold mt-2">STOCK OUT SLIP</h2>
            <hr className="my-2 border-gray-300" />
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Date:</span>
              <span className="font-medium">{new Date().toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Item:</span>
              <span className="font-medium">{item.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Quantity:</span>
              <span className="font-medium">{qty} {item.unit}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Unit Price:</span>
              <span className="font-medium">{formatCurrency(item.price)}</span>
            </div>
            <div className="flex justify-between border-t border-gray-300 pt-2 mt-2">
              <span className="text-gray-600 font-semibold">Total Cost:</span>
              <span className="font-bold text-green-600">{formatCurrency(item.price * qty)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Project:</span>
              <span className="font-medium">{projectName || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Issued By:</span>
              <span className="font-medium">{userName || 'Admin'}</span>
            </div>
          </div>

          {/* Signature Area */}
          <div className="mt-12 pt-6 border-t border-gray-300">
            <div className="flex justify-between text-sm">
              <div className="text-center">
                <p className="text-gray-500 mb-8">Received By:</p>
                <p className="border-t border-gray-400 pt-1 w-40">Signature</p>
              </div>
              <div className="text-center">
                <p className="text-gray-500 mb-8">Issued By:</p>
                <p className="border-t border-gray-400 pt-1 w-40">Signature</p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Buttons - itatago sa print */}
        <div className="p-4 border-t border-gray-200 flex justify-end gap-3 print:hidden">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">Close</button>
          <button onClick={handlePrint} className="flex items-center gap-2 bg-[#0e2a21] hover:bg-[#184536] text-white px-4 py-2 rounded-lg text-sm font-medium">
            <Printer className="w-4 h-4" /> Print
          </button>
        </div>
      </div>
    </div>
  );
}