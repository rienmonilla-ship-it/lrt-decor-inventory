import { Scanner } from '@yudiel/react-qr-scanner';
import { X, CameraOff } from 'lucide-react';

export default function QRScanner({ isOpen, onClose, onScan }) {
  if (!isOpen) return null;

  // Ito ang magiging function kapag may na-scan
  const handleScan = (detectedCodes) => {
    if (detectedCodes && detectedCodes.length > 0) {
      onScan(detectedCodes[0].rawValue); // Kunin ang value ng na-scan
    }
  };

  // Function para sa error handling
  const handleError = (error) => {
    console.error("Scanner Error:", error);
    // Dito natin pwedeng ipakita ang error message
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden relative">
        <button onClick={onClose} className="absolute top-3 right-3 p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 z-10">
          <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">Scan Item QR</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-4">Itutok ang camera sa QR code ng item.</p>
          
          {/* Ang Scanner component na mismo ang humahawak sa camera */}
          <div className="w-full rounded-lg overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 bg-black">
            <Scanner 
              onScan={handleScan} 
              onError={handleError}
              components={{
                finder: false, // Itago ang default na finder UI para mas malinis
              }}
            />
          </div>
          
          <p className="text-xs text-gray-400 text-center mt-4">Kung hindi lumabas ang camera, i-check ang browser permissions.</p>
        </div>
      </div>
    </div>
  );
}