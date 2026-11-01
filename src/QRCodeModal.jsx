import { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { X, Printer } from 'lucide-react';

export default function QRCodeModal({ isOpen, onClose, item }) {
  const qrRef = useRef(null);

  if (!isOpen || !item) return null;

  const handlePrint = () => {
    // Kunin ang QR code bilang image data URL
    const canvas = qrRef.current.querySelector('canvas');
    const qrImageUrl = canvas.toDataURL('image/png');

    // Gumawa ng bagong window para sa print
    const printWindow = window.open('', '_blank', 'width=600,height=600');
    printWindow.document.write(`
      <html>
        <head>
          <title>QR Code - ${item.name}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              display: flex; 
              flex-direction: column; 
              align-items: center; 
              justify-content: center; 
              height: 100vh; 
              margin: 0;
              text-align: center;
            }
            .qr-container {
              border: 2px solid #000;
              padding: 20px;
              border-radius: 8px;
              width: 350px;
            }
            h1 { font-size: 16px; margin-bottom: 10px; letter-spacing: 1px; }
            h2 { font-size: 22px; margin: 10px 0; }
            p { font-size: 14px; color: #333; margin: 5px 0; }
            img { margin-top: 15px; width: 200px; height: 200px; }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <h1>LRT DECOR PRODUCTS</h1>
            <h2>${item.name}</h2>
            <p>ID: ${item.id}</p>
            <p>Spec: ${item.spec || '-'}</p>
            <img src="${qrImageUrl}" alt="QR Code" />
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-sm overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Item QR Code</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"><X className="w-5 h-5 text-gray-500" /></button>
        </div>

        <div className="p-8 flex flex-col items-center justify-center space-y-4">
          <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-sm" ref={qrRef}>
            <QRCodeCanvas 
              value={item.id} 
              size={200}
              level={"H"}
              includeMargin={true}
            />
          </div>
          
          <div className="text-center">
            <p className="font-bold text-gray-800 dark:text-white text-lg">{item.name}</p>
            <p className="text-sm text-gray-500">ID: {item.id}</p>
            <p className="text-xs text-gray-400 mt-1">{item.spec}</p>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Close</button>
          <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0e2a21] hover:bg-[#184536] rounded-lg">
            <Printer className="w-4 h-4" /> Print
          </button>
        </div>
      </div>
    </div>
  );
}