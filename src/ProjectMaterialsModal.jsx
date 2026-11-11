import { X, Printer } from 'lucide-react';

export default function ProjectMaterialsModal({ isOpen, onClose, project, movements, items }) {
  if (!isOpen || !project) return null;

  // Kunin ang lahat ng OUT movements para sa project na ito
  const projectMovements = movements.filter(
    m => m.project === project.name && m.type === 'OUT'
  );

  // I-compute ang total price per item
  const materialsList = projectMovements.map(move => {
    const itemData = items.find(i => i.name === move.item);
    const unitPrice = itemData ? itemData.price : 0;
    const totalPrice = unitPrice * move.qty;
    return {
      ...move,
      unitPrice,
      totalPrice
    };
  });

  // Grand Total
  const grandTotal = materialsList.reduce((sum, m) => sum + m.totalPrice, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 modal-overlay">
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] modal-content print:max-h-none print:overflow-visible print:shadow-none print:w-full print:max-w-full print:rounded-none">
        
        {/* HEADER - HINDI LALABAS SA PRINT */}
        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700 print:hidden">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Project Materials</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{project.name} · {project.client}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* PRINTABLE AREA - GAYAHIN ANG EXCEL LAYOUT */}
        <div className="p-6 overflow-y-auto print:overflow-visible print:p-0 print:text-black">
          
          {/* HEADER: Company Info */}
          <div className="mb-4">
            <h1 className="text-xl font-bold uppercase">LRT Décor Products</h1>
            <div className="flex justify-between text-sm mt-2">
              <div>
                <p><strong>Client:</strong> {project.client}</p>
                <p><strong>Jobsite:</strong> {project.address}</p>
              </div>
              <div className="text-right">
                <p><strong>Status:</strong> {project.status}</p>
                <p><strong>Project:</strong> {project.name}</p>
              </div>
            </div>
          </div>

          <div className="mb-4 border-b-2 border-black"></div>

          {/* TABLE - GAYAHIN ANG EXCEL COLUMNS */}
          <table className="w-full border-collapse border border-black text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 print:bg-gray-200">
                <th className="border border-black p-2 text-left w-16">Qty</th>
                <th className="border border-black p-2 text-left">Description</th>
                <th className="border border-black p-2 text-right w-24">Unit Price</th>
                <th className="border border-black p-2 text-right w-28">Total Price</th>
              </tr>
            </thead>
            <tbody>
              {materialsList.length > 0 ? (
                materialsList.map((m, index) => (
                  <tr key={index} className="border-b border-gray-300 print:border-black">
                    <td className="border border-black p-2 text-center">{m.qty}</td>
                    <td className="border border-black p-2">{m.item}</td>
                    <td className="border border-black p-2 text-right">₱{m.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="border border-black p-2 text-right font-bold">₱{m.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="border border-black p-4 text-center text-gray-500">No materials assigned yet.</td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 dark:bg-gray-900 print:bg-white">
                <td colSpan="3" className="border border-black p-2 text-right font-bold uppercase">Grand Total:</td>
                <td className="border border-black p-2 text-right font-bold text-lg">
                  ₱{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* SIGNATURE AREA */}
          <div className="flex justify-between mt-12 px-8 text-sm">
            <div className="text-center w-48">
              <p className="mb-8">Prepared By:</p>
              <p className="border-t border-black pt-1">Signature</p>
            </div>
            <div className="text-center w-48">
              <p className="mb-8">Received By:</p>
              <p className="border-t border-black pt-1">Signature</p>
            </div>
          </div>

        </div>

        {/* FOOTER BUTTONS - HINDI LALABAS SA PRINT */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-900 print:hidden">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Close</button>
          <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0e2a21] hover:bg-[#184536] rounded-lg">
            <Printer className="w-4 h-4" /> Print Breakdown
          </button>
        </div>
      </div>
    </div>
  );
}