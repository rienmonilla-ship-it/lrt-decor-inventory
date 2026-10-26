import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X, CameraOff } from 'lucide-react';

export default function QRScanner({ isOpen, onClose, onScan }) {
  const scannerRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let scanner = null;

    if (isOpen) {
      scanner = new Html5QrcodeScanner("reader", { 
        fps: 10, 
        qrbox: { width: 200, height: 200 },
        aspectRatio: 1.0,
        showTorchButtonIfSupported: true 
      });
      
      scannerRef.current = scanner;

      scanner.render(
        (decodedText) => {
          onScan(decodedText);
          scanner.clear();
          onClose();
        },
        (err) => {
          if (typeof err === 'string') {
            if (err.includes("NotAllowedError")) {
              setError("Camera permission denied. Please allow camera access.");
            } else if (err.includes("NotFoundError")) {
              setError("No camera found on this device.");
            }
          }
        }
      );
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(e => console.error(e));
      }
    };
  }, [isOpen, onScan, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden relative">
        <button onClick={onClose} className="absolute top-3 right-3 p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 z-10">
          <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">Scan Item QR</h2>
          
          {error ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CameraOff className="w-12 h-12 text-red-500 mb-4" />
              <p className="text-sm text-red-600 dark:text-red-400 font-semibold">{error}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Note: Camera requires HTTPS or localhost. If you are testing on a phone, make sure to use the deployed Vercel link.
              </p>
            </div>
          ) : (
            <>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-4">Itutok ang camera sa QR code ng item.</p>
              
              <div id="reader" className="w-full rounded-lg overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 bg-black"></div>
              
              <p className="text-xs text-gray-400 text-center mt-4">Kung hindi lumabas ang camera, i-check ang browser permissions.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}