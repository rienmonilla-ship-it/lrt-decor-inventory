import { useState } from 'react';
import { X } from 'lucide-react';

export default function UserModal({ isOpen, onClose, onSave, editingUser, isSaving }) {
  const [formData, setFormData] = useState(
    editingUser || { name: '', email: '', password: '', role: 'staff' }
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
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{editingUser ? 'Edit User' : 'Add New User'}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Enter account details below.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"><X className="w-5 h-5 text-gray-500" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase">Full Name</label>
            <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-800 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600" placeholder="e.g. Juan Dela Cruz" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase">Email Address</label>
            <input required type="email" name="email" value={formData.email} onChange={handleChange} disabled={!!editingUser} className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-800 outline-none disabled:bg-gray-100 dark:disabled:bg-gray-800 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600" placeholder="juan@lrtdecor.ph" />
            {editingUser && <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>}
          </div>
          
          {!editingUser && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase">Password</label>
              <input required type="password" name="password" value={formData.password} onChange={handleChange} className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-800 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600" placeholder="Min. 6 characters" minLength="6" />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase">Role</label>
            <select name="role" value={formData.role} onChange={handleChange} className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-800 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600">
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Cancel</button>
            <button type="submit" disabled={isSaving} className="px-4 py-2 text-sm font-medium text-white bg-[#0e2a21] hover:bg-[#184536] rounded-lg disabled:opacity-50">
              {isSaving ? 'Saving...' : (editingUser ? 'Update User' : 'Create Account')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}