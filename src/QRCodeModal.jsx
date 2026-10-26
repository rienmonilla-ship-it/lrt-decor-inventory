import { QRCodeCanvas } from 'qrcode.react';
import { X, Printer } from 'lucide-react';

export default function QRCodeModal({ isOpen, onClose, item }) {
  if (!isOpen || !item) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-sm overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Item QR Code</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full"><X className="w-5 h-5 text-gray-500" /></button>
        </div>

        <div className="p-8 flex flex-col items-center justify-center space-y-4">
          <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-sm">
            <QRCodeCanvas 
              value={item.id} 
              size={200}
              level={"H"}
              includeMargin={true}
            />
          </div>
          
          <div className="text-center">
            <p className="font-bold text-gray-800 text-lg">{item.name}</p>
            <p className="text-sm text-gray-500">ID: {item.id}</p>
            <p className="text-xs text-gray-400 mt-1">{item.spec}</p>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">Close</button>
          <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0e2a21] hover:bg-[#184536] rounded-lg">
            <Printer className="w-4 h-4" /> Print
          </button>
        </div>
      </div>
    </div>
  );
}