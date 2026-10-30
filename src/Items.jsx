import { useState } from 'react';
import { Search, Plus, Edit, Trash2, ArrowDownLeft, ArrowUpRight, ScanLine, QrCode } from 'lucide-react'; 
import { collection, addDoc, updateDoc, deleteDoc, doc, increment, getDoc } from "firebase/firestore"; 
import { db } from './firebase';
import ItemModal from './ItemModal'; 
import StockModal from './StockModal';
import QRScanner from './QRScanner';
import QRCodeModal from './QRCodeModal';
import PrintSlipModal from './PrintSlipModal';
import Toast from './Toast';
import ConfirmModal from './ConfirmModal';
import ScanActionModal from './ScanActionModal';

export default function Items({ items, defaultFilterLowStock, currentUserName, userRole, projects }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All categories');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [stockItem, setStockItem] = useState(null);
  const [stockType, setStockType] = useState('IN');

  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false); 
  const [qrItem, setQrItem] = useState(null); 

  const [isScanActionOpen, setIsScanActionOpen] = useState(false);
  const [scannedItem, setScannedItem] = useState(null);

  const [isSlipModalOpen, setIsSlipModalOpen] = useState(false);
  const [slipData, setSlipData] = useState({ item: null, qty: 0, projectName: '' });

  const [toast, setToast] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const calculateTotalValue = () => {
    return items.reduce((total, item) => total + (item.qty * item.price), 0).toLocaleString('en-PH', { style: 'currency', currency: 'PHP' });
  };

  const handleSaveItem = async (formData) => {
    setIsSaving(true);
    try {
      if (editingItem) {
        const itemRef = doc(db, "items", editingItem.id);
        await updateDoc(itemRef, formData);
        await addDoc(collection(db, "logs"), {
          date: new Date().toLocaleString(),
          timestamp: new Date().getTime(),
          user: currentUserName,
          action: 'EDIT_ITEM',
          details: `Updated item: ${formData.name}`
        });
        setToast({ message: 'Item updated successfully!', type: 'success' });
      } else {
        await addDoc(collection(db, "items"), formData);
        await addDoc(collection(db, "logs"), {
          date: new Date().toLocaleString(),
          timestamp: new Date().getTime(),
          user: currentUserName,
          action: 'ADD_ITEM',
          details: `Added new item: ${formData.name}`
        });
        setToast({ message: 'Item added successfully!', type: 'success' });
      }
      closeModal();
    } catch (error) {
      console.error("Error saving item: ", error);
      setToast({ message: 'Failed to save item.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteItem = async (id, name) => {
    try {
      const itemRef = doc(db, "items", id);
      const itemSnapshot = await getDoc(itemRef);
      const itemData = itemSnapshot.data();

      await deleteDoc(itemRef);
      
      await addDoc(collection(db, "logs"), {
        date: new Date().toLocaleString(),
        timestamp: new Date().getTime(),
        user: currentUserName,
        action: 'DELETE_ITEM',
        details: `Deleted item: ${name}`
      });

      setToast({ 
        message: `Deleted "${name}".`, 
        type: 'info',
        actionLabel: 'Undo',
        onAction: async () => {
          try {
            await addDoc(collection(db, "items"), itemData);
            setToast({ message: 'Item restored successfully!', type: 'success' });
          } catch {
            setToast({ message: 'Failed to restore item.', type: 'error' });
          }
        }
      });

    } catch (error) {
      console.error("Error deleting item: ", error);
      setToast({ message: 'Failed to delete item.', type: 'error' });
    }
  };

  const handleStockConfirm = async (item, type, qty, reason, projectId) => {
    try {
      const itemRef = doc(db, "items", item.id);
      const newQty = type === 'IN' ? item.qty + qty : item.qty - qty;
      
      await updateDoc(itemRef, { qty: newQty });

      const projectName = projects.find(p => p.id === projectId)?.name || '-';
      
      await addDoc(collection(db, "movements"), {
        date: new Date().toLocaleString(),
        timestamp: new Date().getTime(), 
        type: type,
        item: item.name,
        qty: qty,
        reason: reason || '-',
        project: projectName,
        user: currentUserName || 'Unknown User'
      });

      await addDoc(collection(db, "logs"), {
        date: new Date().toLocaleString(),
        timestamp: new Date().getTime(), 
        user: currentUserName,
        action: type === 'IN' ? 'STOCK_IN' : 'STOCK_OUT',
        details: `${type === 'IN' ? 'Added' : 'Removed'} ${qty} ${item.unit} of ${item.name}`
      });

      if (type === 'OUT' && projectId) {
        const projectRef = doc(db, "projects", projectId);
        const addedCost = qty * item.price;
        await updateDoc(projectRef, {
          materials: increment(qty),
          cost: increment(addedCost)
        });
      }

      setIsStockModalOpen(false);
      setToast({ message: `Stock ${type} successful!`, type: 'success' });

      if (type === 'OUT') {
        setSlipData({ 
          item: item, 
          qty: qty, 
          projectName: projectName
        });
        setIsSlipModalOpen(true);
      }
    } catch (error) {
      console.error("Error updating stock: ", error);
      setToast({ message: 'Failed to update stock.', type: 'error' });
    }
  };

  const openAddModal = () => { setEditingItem(null); setIsModalOpen(true); };
  const openEditModal = (item) => { setEditingItem(item); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setEditingItem(null); };
  const openStockModal = (item, type) => { setStockItem(item); setStockType(type); setIsStockModalOpen(true); };

  const openQRModal = (item) => {
    setQrItem(item);
    setIsQRModalOpen(true);
  };

  const handleScanSuccess = (scannedId) => {
    const item = items.find(i => i.id === scannedId);
    if (item) {
      setIsScannerOpen(false);
      setScannedItem(item);
      setTimeout(() => {
        setIsScanActionOpen(true);
      }, 100);
    } else {
      setToast({ message: 'Item not found! QR code may be invalid.', type: 'error' });
    }
  };

  const handleSelectScanAction = (actionType) => {
    setIsScanActionOpen(false);
    setTimeout(() => {
      setStockItem(scannedItem);
      setStockType(actionType);
      setIsStockModalOpen(true);
    }, 100);
  };

  const filteredItems = items
    .filter(item => {
      const matchSearch = 
        (item.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.spec || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchCategory = filterCategory === 'All categories' || item.category === filterCategory;

      return matchSearch && matchCategory;
    })
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
    <div className="p-4 md:p-8 space-y-6">
      {/* STICKY HEADER */}
      <div className="sticky top-[72px] z-20 bg-gray-50 dark:bg-gray-900 pt-4 pb-4 -mx-4 px-4 md:-mx-8 md:px-8 border-b border-gray-200 dark:border-gray-700 transition-colors">
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold tracking-wider uppercase mb-1">Inventory</p>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Items</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {items.length} items · {calculateTotalValue()} value · {items.filter(i => i.qty <= i.min).length} low stock
            </p>
          </div>
          
          <div className="flex gap-3 w-full sm:w-auto">
            <button onClick={() => setIsScannerOpen(true)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <ScanLine className="w-4 h-4" /> Scan
            </button>
            <button onClick={openAddModal} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#0e2a21] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#184536] transition-colors">
              <Plus className="w-4 h-4" /> New Item
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-4 w-4 text-gray-400" /></div>
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-800 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" placeholder="Search items or specs..." />
          </div>
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 w-full sm:w-auto"
          >
            <option>All categories</option>
            <option>Structural & Track Systems</option>
            <option>Mechanisms & Hardware</option>
            <option>Fasteners & Fixings</option>
            <option>Sealants, Insulation & Finishing</option>
            <option>Tools & Consumables</option>
            <option>Services & Installations</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-x-auto transition-colors">
        <table className="w-full text-left border-collapse min-w-[400px] md:min-w-[800px]">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <th className="p-4 font-semibold">Item</th>
              <th className="p-4 font-semibold hidden md:table-cell">Category</th>
              <th className="p-4 font-semibold hidden lg:table-cell">Spec</th>
              <th className="p-4 font-semibold text-right">Stock</th>
              <th className="p-4 font-semibold text-right hidden md:table-cell">Min</th>
              <th className="p-4 font-semibold text-right hidden lg:table-cell">Unit Price</th>
              <th className="p-4 font-semibold text-right hidden md:table-cell">Value</th>
              <th className="p-4 font-semibold text-center sticky right-0 bg-gray-50 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 shadow-[-4px_0_6px_-4px_rgba(0,0,0,0.1)]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="p-4">
                    <p className="font-semibold text-gray-800 dark:text-white text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.unit}</p>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-md border border-gray-200 dark:border-gray-600 whitespace-nowrap">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-400 hidden lg:table-cell">{item.spec}</td>
                  <td className="p-4 text-right text-sm font-bold text-gray-800 dark:text-white">{item.qty}</td>
                  <td className="p-4 text-right text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">{item.min}</td>
                  <td className="p-4 text-right text-sm text-gray-800 dark:text-white hidden lg:table-cell">₱{item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="p-4 text-right text-sm font-bold text-gray-800 dark:text-white hidden md:table-cell">₱{(item.qty * item.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="p-4 text-center sticky right-0 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 shadow-[-4px_0_6px_-4px_rgba(0,0,0,0.1)]">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => openQRModal(item)} title="View QR Code" className="p-1.5 text-gray-400 hover:text-purple-600 rounded transition-colors">
                        <QrCode className="w-4 h-4" />
                      </button>
                      
                      <button onClick={() => openStockModal(item, 'IN')} title="Stock In" className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"><ArrowDownLeft className="w-4 h-4" /></button>
                      <button onClick={() => openStockModal(item, 'OUT')} title="Stock Out" className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"><ArrowUpRight className="w-4 h-4" /></button>
                      <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1"></div>
                      
                      {userRole === 'admin' && (
                        <>
                          <button onClick={() => openEditModal(item)} className="p-1.5 text-gray-400 hover:text-blue-600 rounded transition-colors"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => { setItemToDelete({id: item.id, name: item.name}); setIsConfirmOpen(true); }} className="p-1.5 text-gray-400 hover:text-red-600 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="8" className="p-8 text-center text-gray-500 dark:text-gray-400">No items found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <ItemModal 
        key={editingItem ? editingItem.id : 'new-item'} 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        onSave={handleSaveItem} 
        editingItem={editingItem} 
        isSaving={isSaving} 
      />
      
      <StockModal isOpen={isStockModalOpen} onClose={() => setIsStockModalOpen(false)} onConfirm={handleStockConfirm} item={stockItem} type={stockType} projects={projects} />
      
      <QRScanner 
        key={isScannerOpen ? 'open' : 'closed'}
        isOpen={isScannerOpen} 
        onClose={() => setIsScannerOpen(false)} 
        onScan={handleScanSuccess} 
      />

      <ScanActionModal 
        isOpen={isScanActionOpen}
        onClose={() => setIsScanActionOpen(false)}
        item={scannedItem}
        onSelectAction={handleSelectScanAction}
      />

      <QRCodeModal 
        isOpen={isQRModalOpen} 
        onClose={() => setIsQRModalOpen(false)} 
        item={qrItem} 
      />

      <PrintSlipModal 
        isOpen={isSlipModalOpen} 
        onClose={() => setIsSlipModalOpen(false)} 
        item={slipData.item} 
        qty={slipData.qty} 
        projectName={slipData.projectName} 
        userName={currentUserName} 
      />

      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => handleDeleteItem(itemToDelete?.id, itemToDelete?.name)}
        title="Delete Item"
        message={`Are you sure you want to delete "${itemToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete Item"
      />

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
          actionLabel={toast.actionLabel}
          onAction={toast.onAction}
        />
      )}
    </div>
  );
}