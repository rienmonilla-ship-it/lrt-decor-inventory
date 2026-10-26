import { useState } from 'react';
import { X, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export default function StockModal({ isOpen, onClose, onConfirm, item, type, projects }) {
  const [qty, setQty] = useState(1);
  const [reason, setReason] = useState('');
  const [selectedProject, setSelectedProject] = useState('');

  if (!isOpen || !item) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // VALIDATION: Dapat positive number at hindi zero
    const quantity = Number(qty);
    if (!quantity || quantity <= 0) {
      return alert("Quantity must be a positive number greater than 0.");
    }
    
    // VALIDATION: Hindi pwedeng mag-Stock Out ng mas marami sa stock
    if (type === 'OUT' && quantity > item.qty) {
      return alert(`Not enough stock! Only ${item.qty} ${item.unit} available.`);
    }

    // VALIDATION: Kailangan may project kapag Stock Out
    if (type === 'OUT' && !selectedProject) {
      return alert("Please select a project for this stock out.");
    }

    onConfirm(item, type, quantity, reason, selectedProject);
    setQty(1);
    setReason('');
    setSelectedProject('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-sm overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            {type === 'IN' ? <ArrowDownLeft className="text-green-600"/> : <ArrowUpRight className="text-red-600"/>}
            Stock {type}
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"><X className="w-5 h-5 text-gray-500" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Item</p>
            <p className="font-bold text-gray-800 dark:text-white">{item.name}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Current Stock: <span className="font-bold">{item.qty} {item.unit}</span></p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase">Quantity to {type}</label>
            <input 
              type="number" 
              min="1" 
              step="1"
              value={qty} 
              onChange={(e) => setQty(e.target.value)} 
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-800 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
            />
          </div>

          {type === 'OUT' && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase">Assign to Project</label>
              <select 
                value={selectedProject} 
                onChange={(e) => setSelectedProject(e.target.value)} 
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-800 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">-- Select Project --</option>
                {projects?.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase">Reason / Note (Optional)</label>
            <input 
              type="text" 
              value={reason} 
              onChange={(e) => setReason(e.target.value)} 
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-800 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
              placeholder={type === 'IN' ? "e.g. New delivery" : "e.g. Installation"}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Cancel</button>
            <button type="submit" className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${type === 'IN' ? 'bg-green-700 hover:bg-green-800' : 'bg-red-600 hover:bg-red-700'}`}>
              Confirm {type}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}