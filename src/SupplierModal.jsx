import { useState } from 'react';
import { X } from 'lucide-react';

export default function SupplierModal({ isOpen, onClose, onSave, editingSupplier }) {
  const [formData, setFormData] = useState(
    editingSupplier || { name: '', contact: '', phone: '', email: '', address: '' }
  );

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}</h2>
            <p className="text-sm text-gray-500">{editingSupplier ? 'Update vendor details.' : 'Enter vendor details.'}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5 text-gray-500" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Company Name</label>
            <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-800 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Contact Person</label>
            <input required type="text" name="contact" value={formData.contact} onChange={handleChange} className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-800 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Phone</label>
              <input required type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-800 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-800 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Address</label>
            <input required type="text" name="address" value={formData.address} onChange={handleChange} className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-800 outline-none" />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-[#0e2a21] hover:bg-[#184536] rounded-lg">
              {editingSupplier ? 'Update Supplier' : 'Save Supplier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}