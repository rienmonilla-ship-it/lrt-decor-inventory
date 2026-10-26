import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Phone, Mail } from 'lucide-react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from './firebase';
import SupplierModal from './SupplierModal';
import ConfirmModal from './ConfirmModal';
import Toast from './Toast';

export default function Suppliers({ userRole }) {
  const [suppliers, setSuppliers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [toast, setToast] = useState(null);
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "suppliers"), (snapshot) => {
      setSuppliers(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });
    return () => unsub();
  }, []);

  const handleSaveSupplier = async (formData) => {
    try {
      if (editingSupplier) {
        const supplierRef = doc(db, "suppliers", editingSupplier.id);
        await updateDoc(supplierRef, formData);
        setToast({ message: 'Supplier updated.', type: 'success' });
      } else {
        await addDoc(collection(db, "suppliers"), formData);
        setToast({ message: 'Supplier added.', type: 'success' });
      }
      closeModal();
    } catch (error) {
      console.error("Error saving supplier: ", error);
      setToast({ message: 'Failed to save supplier.', type: 'error' });
    }
  };

  const confirmDelete = async () => {
    if (!supplierToDelete) return;
    try {
      await deleteDoc(doc(db, "suppliers", supplierToDelete.id));
      setToast({ message: 'Supplier deleted.', type: 'success' });
    } catch (error) {
      console.error("Error deleting supplier: ", error);
      setToast({ message: 'Failed to delete supplier.', type: 'error' });
    }
  };

  const handleDeleteClick = (id, name) => {
    setSupplierToDelete({ id, name });
    setIsConfirmOpen(true);
  };

  const openAddModal = () => { setEditingSupplier(null); setIsModalOpen(true); };
  const openEditModal = (supplier) => { setEditingSupplier(supplier); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setEditingSupplier(null); };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold tracking-wider uppercase mb-1">Vendor Directory</p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Suppliers</h1>
        </div>
        <button onClick={openAddModal} className="flex items-center gap-2 bg-[#0e2a21] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#184536] transition-colors">
          <Plus className="w-4 h-4" /> New Supplier
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.map((supplier) => (
          <div key={supplier.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{supplier.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-0.5">{supplier.contact}</p>
              </div>
              <div className="flex gap-1">
                {userRole === 'admin' && (
                  <>
                    <button onClick={() => openEditModal(supplier)} className="p-1.5 text-gray-400 hover:text-blue-600 rounded">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteClick(supplier.id, supplier.name)} className="p-1.5 text-gray-400 hover:text-red-600 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="space-y-2 mt-auto">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"><Phone className="w-4 h-4 text-red-500" />{supplier.phone}</div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"><Mail className="w-4 h-4 text-gray-400" />{supplier.email}</div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{supplier.address}</p>
            </div>
          </div>
        ))}
        {suppliers.length === 0 && (
          <div className="col-span-full text-center p-8 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            No suppliers yet. Add your first vendor.
          </div>
        )}
      </div>

      <SupplierModal 
        key={editingSupplier ? editingSupplier.id : 'new-supplier'}
        isOpen={isModalOpen} 
        onClose={closeModal} 
        onSave={handleSaveSupplier} 
        editingSupplier={editingSupplier}
      />

      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Supplier"
        message={`Are you sure you want to delete "${supplierToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete Supplier"
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}