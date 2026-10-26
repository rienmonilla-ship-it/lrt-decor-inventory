import { useState } from 'react';
import { X } from 'lucide-react';

export default function ItemModal({ isOpen, onClose, onSave, editingItem, isSaving }) {
  const [formData, setFormData] = useState(
    editingItem || { name: '', category: 'Structural & Track Systems', spec: '', unit: 'pcs', qty: 0, min: 10, price: 0 }
  );

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'qty' || name === 'min' || name === 'price' ? Number(value) : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData); 
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-lg overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{editingItem ? 'Edit Item' : 'Add New Item'}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{editingItem ? 'Update the details of this material.' : 'Enter the details of the new material.'}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase">Item Name</label>
            <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-800 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="e.g. Metal Screw 8 3/4" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-800 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option>Structural & Track Systems</option>
                <option>Mechanisms & Hardware</option>
                <option>Fasteners & Fixings</option>
                <option>Sealants, Insulation & Finishing</option>
                <option>Tools & Consumables</option>
                <option>Services & Installations</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase">Specification</label>
              <input type="text" name="spec" value={formData.spec} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-800 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="e.g. 8 3/4" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase">Unit</label>
              <select name="unit" value={formData.unit} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-800 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="pcs">pcs</option>
                <option value="ft">ft</option>
                <option value="m">m</option>
                <option value="sqm">sqm</option>
                <option value="kg">kg</option>
                <option value="sheet">sheet</option>
                <option value="roll">roll</option>
                <option value="box">box</option>
                <option value="set">set</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase">Quantity</label>
              <input type="number" name="qty" min="0" value={formData.qty} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-800 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase">Min Stock</label>
              <input type="number" name="min" min="0" value={formData.min} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-800 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase">Unit Price (₱)</label>
            <input type="number" name="price" min="0" step="0.01" value={formData.price} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-800 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">Cancel</button>
            <button type="submit" disabled={isSaving} className="px-4 py-2 text-sm font-medium text-white bg-[#0e2a21] hover:bg-[#184536] rounded-lg transition-colors disabled:opacity-50">
              {isSaving ? 'Saving...' : (editingItem ? 'Update Item' : 'Save Item')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}