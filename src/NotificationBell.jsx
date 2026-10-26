import { useState } from 'react';
import { Bell, AlertTriangle, ShoppingCart } from 'lucide-react';
import OrderListModal from './OrderListModal';

export default function NotificationBell({ lowStockItems, onViewItems }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  if (!lowStockItems || lowStockItems.length === 0) return null;

  return (
    <>
      <div className="relative">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-gray-800">
            {lowStockItems.length}
          </span>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
            <div className="p-3 border-b border-gray-100 dark:border-gray-700 bg-red-50 dark:bg-red-900/30 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
              <p className="text-sm font-bold text-red-700 dark:text-red-400">Low Stock Alerts</p>
            </div>
            <div className="max-h-60 overflow-y-auto">
              {lowStockItems.map((item) => (
                <div key={item.id} className="p-3 border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">{item.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.category}</p>
                  </div>
                  <span className="text-xs font-bold text-red-600 bg-red-100 dark:bg-red-900/50 dark:text-red-400 px-2 py-1 rounded">
                    {item.qty} left
                  </span>
                </div>
              ))}
            </div>
            
            <div className="p-2 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex flex-col gap-2">
              <button 
                onClick={() => { setIsOrderModalOpen(true); setIsOpen(false); }}
                className="w-full flex items-center justify-center gap-2 p-2 text-xs font-bold text-white bg-[#0e2a21] hover:bg-[#184536] rounded-lg transition-colors"
              >
                <ShoppingCart className="w-4 h-4" /> Generate Order List
              </button>
              <button 
                onClick={() => { onViewItems(); setIsOpen(false); }}
                className="w-full p-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors text-center"
              >
                View All Items
              </button>
            </div>
          </div>
        )}
      </div>

      <OrderListModal 
        isOpen={isOrderModalOpen} 
        onClose={() => setIsOrderModalOpen(false)} 
        lowStockItems={lowStockItems} 
      />
    </>
  );
}