import { X, Printer } from 'lucide-react';

export default function ProjectMaterialsModal({ isOpen, onClose, project, movements, items }) {
  if (!isOpen || !project) return null;

  // 1. Kunin ang lahat ng OUT movements para sa project na ito
  const projectMovements = movements.filter(
    m => m.project === project.name && m.type === 'OUT'
  );

  // 2. I-compute ang total price per item
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

  // 3. Grand Total
  const grandTotal = materialsList.reduce((sum, m) => sum + m.totalPrice, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Project Materials</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{project.name} · {project.client}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Printable Area */}
        <div id="print-area" className="p-6 overflow-y-auto">
          {/* Header ng Resibo */}
          <div className="text-center mb-6 border-b border-dashed border-gray-300 dark:border-gray-600 pb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">LRT DECOR PRODUCTS</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">San Jose del Monte, Bulacan</p>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-2">PROJECT MATERIAL BREAKDOWN</p>
          </div>

          {/* Project Details */}
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Project:</p>
              <p className="font-bold text-gray-800 dark:text-white">{project.name}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Client:</p>
              <p className="font-bold text-gray-800 dark:text-white">{project.client}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Address:</p>
              <p className="font-bold text-gray-800 dark:text-white">{project.address}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Status:</p>
              <p className="font-bold text-gray-800 dark:text-white">{project.status}</p>
            </div>
          </div>

          {/* Table */}
          <table className="w-full text-left border-collapse mb-6">
            <thead>
              <tr className="border-b-2 border-gray-300 dark:border-gray-600 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="p-2 font-semibold">Item</th>
                <th className="p-2 font-semibold text-right">Qty</th>
                <th className="p-2 font-semibold text-right">Unit Price</th>
                <th className="p-2 font-semibold text-right">Total Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {materialsList.length > 0 ? (
                materialsList.map((m, index) => (
                  <tr key={index}>
                    <td className="p-2 text-sm text-gray-800 dark:text-white">{m.item}</td>
                    <td className="p-2 text-sm text-right text-gray-600 dark:text-gray-400">{m.qty}</td>
                    <td className="p-2 text-sm text-right text-gray-600 dark:text-gray-400">₱{m.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="p-2 text-sm text-right font-bold text-gray-800 dark:text-white">₱{m.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500 dark:text-gray-400">No materials used yet for this project.</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Grand Total */}
          <div className="border-t-2 border-gray-300 dark:border-gray-600 pt-4 flex justify-between items-center">
            <p className="text-lg font-bold text-gray-900 dark:text-white">Grand Total:</p>
            <p className="text-2xl font-bold text-[#0e2a21] dark:text-green-400">₱{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-900">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Close</button>
          <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0e2a21] hover:bg-[#184536] rounded-lg">
            <Printer className="w-4 h-4" /> Print Breakdown
          </button>
        </div>
      </div>
    </div>
  );
}