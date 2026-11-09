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

  // States para sa Add Material
  const [selectedItemId, setSelectedItemId] = useState('');
  const [qtyToAdd, setQtyToAdd] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  
  // States para sa Custom Searchable Dropdown
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // I-update ang formData kapag binuksan o nag-update ang project data
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
    // Isara at i-reset ang search kapag binuksan/isinarado
    setIsDropdownOpen(false);
    setSearchQuery('');
    setSelectedItemId('');
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

  // Function para sa pag-add ng material
  const handleAddMaterialClick = async () => {
    if (!selectedItemId || qtyToAdd <= 0) return;
    setIsAdding(true);
    const item = items.find(i => i.id === selectedItemId);
    
    if (item) {
      await onAddMaterial(editingProject.id, editingProject.name, item, Number(qtyToAdd));
      // Reset input after adding
      setSelectedItemId('');
      setSearchQuery('');
      setQtyToAdd(1);
    }
    setIsAdding(false);
  };

  // Pumili ng item mula sa listahan
  const handleSelectItem = (item) => {
    setSelectedItemId(item.id);
    setSearchQuery(item.name); // I-set ang search bar sa napiling pangalan
    setIsDropdownOpen(false);
  };

  // I-filter ang mga items base sa tinype (Search Logic)
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* HEADER */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{editingProject ? 'Edit Project' : 'Add New Project'}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Enter project details below.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"><X className="w-5 h-5 text-gray-500" /></button>
        </div>

        {/* BODY */}
        <div className="overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase">Project Name</label>
              <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-800 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600" placeholder="e.g. Jollibee Muzon" />
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

            {/* BAGONG SECTION PARA SA ADD MATERIAL */}
            {editingProject && (
              <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                  <PackageSearch className="w-4 h-4" /> Allocate Material
                </h3>
                
                <div className="flex gap-2 items-start">
                  {/* CUSTOM SEARCHABLE DROPDOWN */}
                  <div className="flex-1 relative">
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase">Select Item</label>
                    <input 
                      type="text" 
                      placeholder="Type to search item..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setIsDropdownOpen(true);
                        // Kung binura ang text, i-clear ang napiling item
                        if (e.target.value === '') setSelectedItemId('');
                      }}
                      onFocus={() => setIsDropdownOpen(true)}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-green-800 outline-none"
                    />
                    
                    {/* DROPDOWN LIST */}
                    {isDropdownOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {filteredItems.length > 0 ? (
                          filteredItems.map(item => (
                            <div 
                              key={item.id}
                              onClick={() => item.qty > 0 && handleSelectItem(item)}
                              className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${item.qty <= 0 ? 'opacity-50 cursor-not-allowed text-red-500' : 'text-gray-800 dark:text-gray-200'}`}
                            >
                              <div className="font-medium">{item.name}</div>
                              <div className="text-xs text-gray-500">
                                Stock: {item.qty} {item.unit} | Price: ₱{item.price}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-sm text-gray-500 text-center">No items found</div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* QUANTITY INPUT */}
                  <div className="w-24">
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase">Qty</label>
                    <input 
                      type="number" 
                      min="1"
                      value={qtyToAdd} 
                      onChange={(e) => setQtyToAdd(e.target.value)}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-green-800 outline-none"
                    />
                  </div>

                  {/* ADD BUTTON */}
                  <div className="pt-5">
                    <button 
                      type="button" 
                      onClick={handleAddMaterialClick}
                      disabled={!selectedItemId || qtyToAdd <= 0 || isAdding}
                      className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50 transition-colors h-[38px]"
                    >
                      <Plus className="w-4 h-4" /> Add
                    </button>
                  </div>
                </div>
                
                {/* SELECTED ITEM VALIDATION INFO */}
                {selectedItemId && (
                  <div className="mt-2 text-xs text-green-600 dark:text-green-400">
                    ✓ Selected: {items.find(i => i.id === selectedItemId)?.name} 
                    (Available: {items.find(i => i.id === selectedItemId)?.qty})
                  </div>
                )}
              </div>
            )}

            {/* FOOTER BUTTONS */}
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