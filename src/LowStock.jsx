import { AlertTriangle, ArrowRightLeft, ShoppingCart } from 'lucide-react';

export default function LowStock({ items, setActiveMenu, openStockModal }) {
  // Kunin lahat ng low stock items at i-sort (pinaka-ubos muna)
  const lowStockItems = items
    .filter(item => item.qty <= item.min)
    .sort((a, b) => (a.qty / a.min) - (b.qty / b.min)); 

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <p className="text-xs text-red-500 font-semibold tracking-wider uppercase mb-1 flex items-center gap-1">
            <AlertTriangle className="w-4 h-4" /> Action Required
          </p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Low Stock</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {lowStockItems.length} items are at or below minimum stock level.
          </p>
        </div>
        <button 
          onClick={() => setActiveMenu('Items')} 
          className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Back to All Items
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-x-auto transition-colors">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-red-50 dark:bg-red-900/20 border-b border-gray-200 dark:border-gray-700 text-xs text-red-600 dark:text-red-400 uppercase tracking-wider">
              <th className="p-4 font-semibold">Item Name</th>
              <th className="p-4 font-semibold">Category</th>
              <th className="p-4 font-semibold text-center">Current Stock</th>
              <th className="p-4 font-semibold text-center">Min Stock</th>
              <th className="p-4 font-semibold text-center">Suggested Order</th>
              <th className="p-4 font-semibold text-center sticky right-0 bg-red-50 dark:bg-red-900/20 border-l border-gray-200 dark:border-gray-700">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {lowStockItems.length > 0 ? (
              lowStockItems.map((item) => {
                // Compute kung ilan ang kulang para umabot sa minimum
                const suggestedOrder = item.min - item.qty > 0 ? (item.min - item.qty) * 2 : item.min; 

                return (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-gray-800 dark:text-white text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.spec} · {item.unit}</p>
                    </td>
                    <td className="p-4">
                      <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-md border border-gray-200 dark:border-gray-600 whitespace-nowrap">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-block px-2.5 py-1 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400 font-bold text-sm rounded-md">
                        {item.qty}
                      </span>
                    </td>
                    <td className="p-4 text-center text-sm font-semibold text-gray-600 dark:text-gray-400">
                      {item.min}
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center gap-1 text-sm font-bold text-green-600 dark:text-green-400">
                        <ShoppingCart className="w-4 h-4" /> {suggestedOrder} {item.unit}
                      </span>
                    </td>
                    <td className="p-4 text-center sticky right-0 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 shadow-[-4px_0_6px_-4px_rgba(0,0,0,0.1)]">
                      <button 
                        onClick={() => openStockModal(item, 'IN')} 
                        className="inline-flex items-center gap-1 bg-green-700 hover:bg-green-800 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                      >
                        <ArrowRightLeft className="w-3 h-3" /> Restock Now
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="p-12 text-center">
                  <div className="flex flex-col items-center justify-center text-green-600 dark:text-green-400">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                      <AlertTriangle className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">All Stock Levels are Good!</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Wala kang kailangang i-restock sa ngayon.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}