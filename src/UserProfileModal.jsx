import { useState } from 'react';
import { X, User, Lock, CheckCircle } from 'lucide-react';
import { doc, updateDoc } from "firebase/firestore";
import { updatePassword, getAuth } from "firebase/auth";
import { db } from './firebase';

export default function UserProfileModal({ isOpen, onClose, currentUser }) {
  const [name, setName] = useState(currentUser?.name || '');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !currentUser) return null;

  const handleUpdateName = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const userRef = doc(db, "users", currentUser.id);
      await updateDoc(userRef, { name: name });
      setMessage("Name updated successfully!");
    } catch {
      // Tinanggal natin ang "err" variable para wala nang warning
      setError("Failed to update name.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) return setError("Password must be at least 6 characters.");
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const auth = getAuth();
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
        setMessage("Password updated successfully!");
        setNewPassword('');
      }
    } catch (err) {
      if (err.code === 'auth/requires-recent-login') {
        setError("Please sign out and sign in again before changing password.");
      } else {
        setError("Failed to update password: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Profile Settings</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"><X className="w-5 h-5 text-gray-500" /></button>
        </div>

        <div className="p-6 space-y-6">
          {message && (
            <div className="p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm rounded-lg flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> {message}
            </div>
          )}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-lg">
              {error}
            </div>
          )}

          {/* UPDATE NAME */}
          <form onSubmit={handleUpdateName} className="space-y-3">
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User className="h-5 w-5 text-gray-400" /></div>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-800 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
            </div>
            <button type="submit" disabled={loading} className="w-full py-2 text-sm font-medium text-white bg-[#0e2a21] hover:bg-[#184536] rounded-lg transition-colors">Update Name</button>
          </form>

          <div className="border-t border-gray-200 dark:border-gray-700"></div>

          {/* UPDATE PASSWORD */}
          <form onSubmit={handleUpdatePassword} className="space-y-3">
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">New Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-400" /></div>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min. 6 characters" className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-800 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
            </div>
            <button type="submit" disabled={loading} className="w-full py-2 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors">Change Password</button>
            <p className="text-xs text-gray-400 text-center">Note: You may need to re-login to change password.</p>
          </form>
        </div>
      </div>
    </div>
  );
}