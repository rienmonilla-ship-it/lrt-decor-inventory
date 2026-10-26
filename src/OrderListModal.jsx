import { X, Printer, Download } from 'lucide-react';

export default function OrderListModal({ isOpen, onClose, lowStockItems }) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let csvContent = "Item Name,Category,Current Stock,Min Stock,Order Qty\n";
    lowStockItems.forEach(item => {
      const orderQty = Math.max(item.min * 2 - item.qty, 0);
      csvContent += `"${item.name}","${item.category}",${item.qty},${item.min},${orderQty}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `LRT_Order_List_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-2xl overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Supplier Order List</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Items below minimum stock level</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"><X className="w-5 h-5 text-gray-500" /></button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="p-3 font-semibold">Item</th>
                <th className="p-3 font-semibold text-right">Current</th>
                <th className="p-3 font-semibold text-right">Min</th>
                <th className="p-3 font-semibold text-right text-green-600">Order Qty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {lowStockItems.map((item) => {
                const orderQty = Math.max(item.min * 2 - item.qty, 0);
                return (
                  <tr key={item.id}>
                    <td className="p-3 text-sm font-semibold text-gray-800 dark:text-white">{item.name}</td>
                    <td className="p-3 text-sm text-right text-red-500 font-bold">{item.qty}</td>
                    <td className="p-3 text-sm text-right text-gray-500">{item.min}</td>
                    <td className="p-3 text-sm text-right font-bold text-green-600">+{orderQty}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Close</button>
          <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0e2a21] hover:bg-[#184536] rounded-lg">
            <Printer className="w-4 h-4" /> Print
          </button>
        </div>
      </div>
    </div>
  );
}