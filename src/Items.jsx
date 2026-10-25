import { useState } from 'react';
import { Search, Plus, Edit, Trash2, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { collection, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore"; 
import { db } from './firebase';
import ItemModal from './ItemModal'; 
import StockModal from './StockModal';

export default function Items({ items, defaultFilterLowStock, currentUserName }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [stockItem, setStockItem] = useState(null);
  const [stockType, setStockType] = useState('IN');

  const calculateTotalValue = () => {
    return items.reduce((total, item) => total + (item.qty * item.price), 0).toLocaleString('en-PH', { style: 'currency', currency: 'PHP' });
  };

  const handleSaveItem = async (formData) => {
    try {
      if (editingItem) {
        const itemRef = doc(db, "items", editingItem.id);
        await updateDoc(itemRef, formData);
      } else {
        await addDoc(collection(db, "items"), formData);
      }
      closeModal();
    } catch (error) {
      console.error("Error saving item: ", error);
      alert("Failed to save item.");
    }
  };

  const handleDeleteItem = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await deleteDoc(doc(db, "items", id));
      } catch (error) {
        console.error("Error deleting item: ", error);
      }
    }
  };

  const handleStockConfirm = async (item, type, qty, reason) => {
    try {
      const itemRef = doc(db, "items", item.id);
      const newQty = type === 'IN' ? item.qty + qty : item.qty - qty;
      
      await updateDoc(itemRef, { qty: newQty });

      await addDoc(collection(db, "movements"), {
        date: new Date().toLocaleString(),
        type: type,
        item: item.name,
        qty: qty,
        reason: reason || '-',
        project: '-',
        user: currentUserName || 'Unknown User' // ITO NA ANG DINAMIC NA USER
      });

      setIsStockModalOpen(false);
    } catch (error) {
      console.error("Error updating stock: ", error);
    }
  };

  const openAddModal = () => { setEditingItem(null); setIsModalOpen(true); };
  const openEditModal = (item) => { setEditingItem(item); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setEditingItem(null); };
  const openStockModal = (item, type) => { setStockItem(item); setStockType(type); setIsStockModalOpen(true); };

  const filteredItems = items
    .filter(item => 
      (item.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.spec || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (defaultFilterLowStock) {
        const aLow = a.qty <= a.min;
        const bLow = b.qty <= b.min;
        if (aLow && !bLow) return -1;
        if (!aLow && bLow) return 1;
      }
      return 0;
    });

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-xs text-gray-500 font-semibold tracking-wider uppercase mb-1">Inventory</p>
          <h1 className="text-3xl font-bold text-gray-900">Items</h1>
          <p className="text-sm text-gray-500 mt-1">
            {items.length} items · {calculateTotalValue()} value · {items.filter(i => i.qty <= i.min).length} low stock
          </p>
        </div>
        <button onClick={openAddModal} className="flex items-center gap-2 bg-[#0e2a21] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#184536] transition-colors">
          <Plus className="w-4 h-4" /> New Item
        </button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-4 w-4 text-gray-400" /></div>
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-800 focus:border-green-800 bg-white text-gray-900 text-sm" placeholder="Search items or specs..." />
        </div>
        <select className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white text-gray-700">
          <option>All categories</option>
          <option>Structural & Track Systems</option>
          <option>Mechanisms & Hardware</option>
          <option>Fasteners & Fixings</option>
          <option>Services & Installations</option>
        </select>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
              <th className="p-4 font-semibold">Item</th>
              <th className="p-4 font-semibold">Category</th>
              <th className="p-4 font-semibold">Spec</th>
              <th className="p-4 font-semibold text-right">Stock</th>
              <th className="p-4 font-semibold text-right">Min</th>
              <th className="p-4 font-semibold text-right">Unit Price</th>
              <th className="p-4 font-semibold text-right">Value</th>
              <th className="p-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.unit}</p>
                  </td>
                  <td className="p-4"><span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md border border-gray-200">{item.category}</span></td>
                  <td className="p-4 text-sm text-gray-600">{item.spec}</td>
                  <td className="p-4 text-right text-sm font-bold text-gray-800">{item.qty}</td>
                  <td className="p-4 text-right text-sm text-gray-500">{item.min}</td>
                  <td className="p-4 text-right text-sm text-gray-800">₱{item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="p-4 text-right text-sm font-bold text-gray-800">₱{(item.qty * item.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => openStockModal(item, 'IN')} title="Stock In" className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"><ArrowDownLeft className="w-4 h-4" /></button>
                      <button onClick={() => openStockModal(item, 'OUT')} title="Stock Out" className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"><ArrowUpRight className="w-4 h-4" /></button>
                      <div className="w-px h-4 bg-gray-300 mx-1"></div>
                      <button onClick={() => openEditModal(item)} className="p-1.5 text-gray-400 hover:text-blue-600 rounded transition-colors"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteItem(item.id, item.name)} className="p-1.5 text-gray-400 hover:text-red-600 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="8" className="p-8 text-center text-gray-500">No items found. Add a new item to get started.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <ItemModal key={editingItem ? editingItem.id : 'new-item'} isOpen={isModalOpen} onClose={closeModal} onSave={handleSaveItem} editingItem={editingItem} />
      <StockModal isOpen={isStockModalOpen} onClose={() => setIsStockModalOpen(false)} onConfirm={handleStockConfirm} item={stockItem} type={stockType} />
    </div>
  );
}