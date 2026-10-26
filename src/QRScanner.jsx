import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode'; // Binago natin ang import
import { X, CameraOff } from 'lucide-react';

export default function QRScanner({ isOpen, onClose, onScan }) {
  const scannerRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let html5QrCode = null;

    if (isOpen) {
      // Gagamit tayo ng Html5Qrcode (lower-level) para mas kontrolado natin ang camera
      html5QrCode = new Html5Qrcode("reader");
      scannerRef.current = html5QrCode;

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        showTorchButtonIfSupported: true
      };

      // Pilitin ang "environment" (likod ng phone) na camera
      html5QrCode.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          onScan(decodedText);
          html5QrCode.stop().then(() => {
            html5QrCode.clear();
            onClose();
          }).catch(err => console.error(err));
        },
        () => {
          // Walang laman para hindi mag-warning sa console
        }
      ).catch((err) => {
        console.error("Camera start error:", err);
        if (err.includes("NotAllowedError") || err.includes("Permission")) {
          setError("Camera permission denied. Please allow camera access in your browser settings.");
        } else if (err.includes("NotFoundError")) {
          setError("No camera found on this device.");
        } else {
          setError("Failed to start camera. Please try again or check permissions.");
        }
      });
    }

    return () => {
      if (scannerRef.current) {
        // Siguraduhing nag-stop ang scanner pagkatapos
        if (scannerRef.current.isScanning) {
          scannerRef.current.stop().then(() => {
            scannerRef.current.clear();
          }).catch(e => console.error(e));
        } else {
          scannerRef.current.clear();
        }
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
                Note: Camera requires HTTPS or localhost.
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