import { useState, useEffect } from 'react';
import { X, Plus, PackageSearch } from 'lucide-react';
import { formatCurrency } from './formatCurrency';

export default function ProjectModal({ isOpen, onClose, onSave, editingProject, items = [], onAddMaterial }) {
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    address: '',
    status: 'Active',
    materials: 0,
    cost: 0,
    contractPrice: 0
  });

  const [selectedItemId, setSelectedItemId] = useState('');
  const [qtyToAdd, setQtyToAdd] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [searchItem, setSearchItem] = useState(''); // Search input state

  useEffect(() => {
    if (editingProject) {
      setFormData(editingProject);
    } else {
      setFormData({
        name: '',
        client: '',
        address: '',
        status: 'Active',
        materials: 0,
        cost: 0,
        contractPrice: 0
      });
    }
  }, [editingProject, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'materials' || name === 'cost' || name === 'contractPrice' ? Number(value) : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleAddMaterialClick = async () => {
    if (!selectedItemId || qtyToAdd <= 0) return;
    setIsAdding(true);
    const item = items.find(i => i.id === selectedItemId);
    
    if (item) {
      await onAddMaterial(editingProject.id, editingProject.name, item, Number(qtyToAdd));
      setSelectedItemId('');
      setQtyToAdd(1);
      setSearchItem('');
    }
    setIsAdding(false);
  };

  // I-filter ang dropdown base sa search bar
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchItem.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{editingProject ? 'Edit Project' : 'Add New Project'}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Enter project details below.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"><X className="w-5 h-5 text-gray-500" /></button>
        </div>

        <div className="overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase">Project Name</label>
              <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-800 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase">Client Name</label>
                <input required type="text" name="client" value={formData.client} onChange={handleChange} className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-800 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-800 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600">
                  <option value="Active">Active</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase">Address</label>
              <input required type="text" name="address" value={formData.address} onChange={handleChange} className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-800 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600" />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase">Materials Used</label>
                <input 
                  type="number" 
                  name="materials" 
                  value={formData.materials} 
                  readOnly 
                  className="w-full border rounded-lg p-2.5 text-sm bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600 cursor-not-allowed" 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase">Total Cost (₱)</label>
                <input 
                  type="number" 
                  name="cost" 
                  value={formData.cost} 
                  readOnly 
                  className="w-full border rounded-lg p-2.5 text-sm bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600 cursor-not-allowed" 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase">Contract Price (₱)</label>
                <input type="number" name="contractPrice" min="0" step="0.01" value={formData.contractPrice} onChange={handleChange} className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-800 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600" />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formatCurrency(formData.contractPrice || 0)}
                </p>
              </div>
            </div>

            {/* BINALIK NA SECTION (Search + Dropdown) */}
            {editingProject && (
              <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                  <PackageSearch className="w-4 h-4" /> Allocate Material
                </h3>
                
                <div className="flex flex-col gap-2">
                  {/* SEARCH BAR */}
                  <input 
                    type="text" 
                    placeholder="Search item name..." 
                    value={searchItem}
                    onChange={(e) => setSearchItem(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-800 outline-none"
                  />
                  
                  <div className="flex gap-2 items-end">
                    {/* DROPDOWN */}
                    <div className="flex-1">
                      <select 
                        value={selectedItemId} 
                        onChange={(e) => setSelectedItemId(e.target.value)}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-green-800 outline-none"
                      >
                        <option value="">-- Choose Item --</option>
                        {filteredItems.map(item => (
                          <option key={item.id} value={item.id} disabled={item.qty <= 0}>
                            {item.name} (Stock: {item.qty}) - ₱{item.price}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* QTY INPUT */}
                    <div className="w-20">
                      <input 
                        type="number" 
                        min="1"
                        value={qtyToAdd} 
                        onChange={(e) => setQtyToAdd(e.target.value)}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-green-800 outline-none"
                        placeholder="Qty"
                      />
                    </div>

                    {/* ADD BUTTON */}
                    <button 
                      type="button" 
                      onClick={handleAddMaterialClick}
                      disabled={!selectedItemId || qtyToAdd <= 0 || isAdding}
                      className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50 transition-colors"
                    >
                      <Plus className="w-4 h-4" /> Add
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 mt-6">
              <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Cancel</button>
              <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-[#0e2a21] hover:bg-[#184536] rounded-lg">
                {editingProject ? 'Update Project' : 'Save Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}