import { useState } from 'react';
import { Search, ArrowDownLeft, ArrowUpRight, Calendar, Trash2 } from 'lucide-react';
import { doc, deleteDoc, updateDoc, increment } from "firebase/firestore";
import { db } from './firebase';
import ConfirmModal from './ConfirmModal';
import Toast from './Toast';

export default function StockMovements({ movements, items, projects, userRole, onMovementDeleted }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  // States para sa Confirm Modal at Toast
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [movementToReverse, setMovementToReverse] = useState(null);
  const [toast, setToast] = useState(null);

  const filteredMovements = (movements || [])
    .filter(move => {
      const matchSearch = 
        move.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
        move.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (move.project && move.project.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchDate = filterDate 
        ? move.date.includes(filterDate.split('-').slice(1).join('/') + '/' + filterDate.split('-')[0]) 
        : true;

      return matchSearch && matchDate;
    })
    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

  const confirmReverse = async () => {
    if (!movementToReverse) return;
    setIsDeleting(true);
    const move = movementToReverse;
    
    try {
      const itemToAdjust = items.find(i => i.name === move.item);
      if (itemToAdjust) {
        const itemRef = doc(db, "items", itemToAdjust.id);
        const adjustment = move.type === 'IN' ? -move.qty : move.qty;
        await updateDoc(itemRef, { qty: increment(adjustment) });
      }

      if (move.type === 'OUT' && move.project && move.project !== '-') {
        const projectToAdjust = projects.find(p => p.name === move.project);
        if (projectToAdjust) {
          const projectRef = doc(db, "projects", projectToAdjust.id);
          const itemPrice = itemToAdjust ? itemToAdjust.price : 0;
          const costAdjustment = move.qty * itemPrice;
          
          await updateDoc(projectRef, {
            materials: increment(-move.qty),
            cost: increment(-costAdjustment)
          });
        }
      }

      await deleteDoc(doc(db, "movements", move.id));
      
      setToast({ message: 'Transaction reversed successfully!', type: 'success' });
      if (onMovementDeleted) onMovementDeleted();
    } catch (error) {
      console.error("Error reversing movement: ", error);
      setToast({ message: 'Failed to reverse transaction.', type: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReverseClick = (move) => {
    setMovementToReverse(move);
    setIsConfirmOpen(true);
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold tracking-wider uppercase mb-1">Activity Ledger</p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Stock Movements</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">A chronological record of every stock change.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-800 focus:border-green-800 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            placeholder="Search by item, user, or project..."
          />
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Calendar className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-800 focus:border-green-800 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
          />
        </div>
        {(searchTerm || filterDate) && (
          <button 
            onClick={() => { setSearchTerm(''); setFilterDate(''); }}
            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-x-auto transition-colors">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <th className="p-4 font-semibold">When</th>
              <th className="p-4 font-semibold">Type</th>
              <th className="p-4 font-semibold">Item</th>
              <th className="p-4 font-semibold text-right">Qty</th>
              <th className="p-4 font-semibold text-center">Reason</th>
              <th className="p-4 font-semibold text-center">Project</th>
              <th className="p-4 font-semibold text-right">User</th>
              {userRole === 'admin' && <th className="p-4 font-semibold text-center">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {filteredMovements.length > 0 ? (
              filteredMovements.map((move) => (
                <tr key={move.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{move.date}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                      move.type === 'IN' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {move.type === 'IN' ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                      {move.type}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-semibold text-gray-800 dark:text-white">{move.item}</td>
                  <td className={`p-4 text-sm font-bold text-right ${move.type === 'IN' ? 'text-green-600' : 'text-red-600'}`}>
                    {move.type === 'IN' ? '+' : '-'} {move.qty}
                  </td>
                  <td className="p-4 text-sm text-gray-500 dark:text-gray-400 text-center">{move.reason}</td>
                  <td className="p-4 text-sm text-gray-500 dark:text-gray-400 text-center">{move.project}</td>
                  <td className="p-4 text-sm text-gray-500 dark:text-gray-400 text-right">{move.user}</td>
                  {userRole === 'admin' && (
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => handleReverseClick(move)}
                        disabled={isDeleting}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded transition-colors disabled:opacity-50"
                        title="Reverse Transaction"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={userRole === 'admin' ? "8" : "7"} className="p-8 text-center text-gray-500 dark:text-gray-400">No movements found matching your filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmReverse}
        title="Reverse Transaction"
        message={`Are you sure you want to REVERSE this ${movementToReverse?.type} transaction for "${movementToReverse?.item}"? This will adjust the stock and project cost.`}
        confirmText="Reverse Transaction"
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}