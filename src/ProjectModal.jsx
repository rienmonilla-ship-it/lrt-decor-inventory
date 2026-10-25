import { useState } from 'react';
import { X } from 'lucide-react';

export default function ProjectModal({ isOpen, onClose, onSave, editingProject }) {
  const [formData, setFormData] = useState(
    editingProject || { name: '', client: '', address: '', status: 'Active', materials: 0, cost: 0 }
  );

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ 
      ...formData, 
      [name]: name === 'materials' || name === 'cost' ? Number(value) : value 
    });
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
            <h2 className="text-xl font-bold text-gray-900">{editingProject ? 'Edit Project' : 'Add New Project'}</h2>
            <p className="text-sm text-gray-500">Enter project details below.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5 text-gray-500" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Project Name</label>
            <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-800 outline-none" placeholder="e.g. Jollibee Muzon" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Client Name</label>
              <input required type="text" name="client" value={formData.client} onChange={handleChange} className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-800 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-800 outline-none bg-white">
                <option value="Active">Active</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Address</label>
            <input required type="text" name="address" value={formData.address} onChange={handleChange} className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-800 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Materials Used</label>
              <input type="number" name="materials" min="0" value={formData.materials} onChange={handleChange} className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-800 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Total Cost (₱)</label>
              <input type="number" name="cost" min="0" step="0.01" value={formData.cost} onChange={handleChange} className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-800 outline-none" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-[#0e2a21] hover:bg-[#184536] rounded-lg">
              {editingProject ? 'Update Project' : 'Save Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}