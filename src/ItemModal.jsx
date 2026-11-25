import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function ItemModal({ isOpen, onClose, onSave, editingItem, isSaving }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Structural & Track Systems',
    spec: '',
    unit: 'pcs',
    qty: 0,
    min: 0,
    price: 0
  });

  // I-reset o i-load ang data kapag binuksan/isinarado ang modal
  useEffect(() => {
    if (isOpen) {
      if (editingItem) {
        setFormData(editingItem);
      } else {
        setFormData({
          name: '',
          category: 'Structural & Track Systems',
          spec: '',
          unit: 'pcs',
          qty: 0,
          min: 0,
          price: 0
        });
      }
    }
  }, [isOpen, editingItem]);

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* HEADER */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {editingItem ? 'Edit Item' : 'Add New Item'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Enter item details below.</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* BODY */}
        <div className="overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* ITEM NAME */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase">Item Name</label>
              <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-800 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600" placeholder="e.g. 5mm Insulation" />
            </div>

            {/* CATEGORY & SPEC */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase">Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-800 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600">
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
                <input type="text" name="spec" value={formData.spec} onChange={handleChange} className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-800 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600" placeholder="e.g. 5mm" />
              </div>
            </div>

            {/* UNIT, QTY, MIN, PRICE */}
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase">Unit</label>
                <input required type="text" name="unit" value={formData.unit} onChange={handleChange} className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-800 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600" placeholder="pcs" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase">Qty</label>
                <input required type="number" name="qty" min="0" value={formData.qty} onChange={handleChange} className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-800 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase">Min Stock</label>
                <input required type="number" name="min" min="0" value={formData.min} onChange={handleChange} className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-800 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase">Price (₱)</label>
                <input required type="number" name="price" min="0" step="0.01" value={formData.price} onChange={handleChange} className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-800 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600" />
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 mt-6">
              <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Cancel</button>
              <button 
                type="submit" 
                disabled={isSaving} 
                className="px-4 py-2 text-sm font-medium text-white bg-[#0e2a21] hover:bg-[#184536] rounded-lg disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : (editingItem ? 'Update Item' : 'Save Item')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}