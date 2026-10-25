import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Phone, Mail } from 'lucide-react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from './firebase';
import SupplierModal from './SupplierModal';

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  // Kunin ang data mula sa Firebase
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
      } else {
        await addDoc(collection(db, "suppliers"), formData);
      }
      closeModal();
    } catch (error) {
      console.error("Error saving supplier: ", error);
      alert("Failed to save supplier.");
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete supplier "${name}"?`)) {
      try {
        await deleteDoc(doc(db, "suppliers", id));
      } catch (error) {
        console.error("Error deleting supplier: ", error);
      }
    }
  };

  const openAddModal = () => { setEditingSupplier(null); setIsModalOpen(true); };
  const openEditModal = (supplier) => { setEditingSupplier(supplier); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setEditingSupplier(null); };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-xs text-gray-500 font-semibold tracking-wider uppercase mb-1">Vendor Directory</p>
          <h1 className="text-3xl font-bold text-gray-900">Suppliers</h1>
        </div>
        <button onClick={openAddModal} className="flex items-center gap-2 bg-[#0e2a21] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#184536] transition-colors">
          <Plus className="w-4 h-4" /> New Supplier
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.map((supplier) => (
          <div key={supplier.id} className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-gray-900">{supplier.name}</h3>
                <p className="text-xs text-gray-500 uppercase tracking-wider mt-0.5">{supplier.contact}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEditModal(supplier)} className="p-1.5 text-gray-400 hover:text-blue-600 rounded">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(supplier.id, supplier.name)} className="p-1.5 text-gray-400 hover:text-red-600 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="space-y-2 mt-auto">
              <div className="flex items-center gap-2 text-sm text-gray-600"><Phone className="w-4 h-4 text-red-500" />{supplier.phone}</div>
              <div className="flex items-center gap-2 text-sm text-gray-600"><Mail className="w-4 h-4 text-gray-400" />{supplier.email}</div>
              <p className="text-sm text-gray-500 mt-2">{supplier.address}</p>
            </div>
          </div>
        ))}
        {suppliers.length === 0 && (
          <div className="col-span-full text-center p-8 text-gray-500 bg-white rounded-xl border border-gray-200">
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
    </div>
  );
}