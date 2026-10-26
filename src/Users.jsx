import { useState, useEffect } from 'react';
import { Plus, Shield, User, Trash2, Edit } from 'lucide-react';
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth"; 
import { db } from './firebase'; 
import UserModal from './UserModal';
import Toast from './Toast';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [toast, setToast] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });
    return () => unsub();
  }, []);

  const handleSaveUser = async (formData) => {
    setIsSaving(true);
    try {
      if (editingUser) {
        // UPDATE ROLE AT NAME SA FIRESTORE
        const userRef = doc(db, "users", editingUser.id);
        await updateDoc(userRef, { 
          name: formData.name,
          role: formData.role 
        });
        setToast({ message: 'User updated successfully!', type: 'success' });
      } else {
        // CREATE NEW USER SA FIREBASE AUTH
        const auth = getAuth();
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        
        // SAVE ROLE AT NAME SA FIRESTORE
        await addDoc(collection(db, "users"), {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          uid: userCredential.user.uid,
          joined: new Date().toLocaleDateString('en-US')
        });
        setToast({ message: 'User created successfully!', type: 'success' });
      }
      closeModal();
    } catch (error) {
      console.error("Error saving user: ", error);
      if (error.code === 'auth/email-already-in-use') {
        setToast({ message: 'Email is already registered.', type: 'error' });
      } else {
        setToast({ message: 'Failed to create user: ' + error.message, type: 'error' });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Remove user "${name}" from the system?`)) {
      try {
        await deleteDoc(doc(db, "users", id));
        setToast({ message: 'User removed.', type: 'success' });
      } catch (error) {
        console.error("Error deleting user: ", error);
        setToast({ message: 'Failed to delete user.', type: 'error' });
      }
    }
  };

  const openAddModal = () => { setEditingUser(null); setIsModalOpen(true); };
  const openEditModal = (user) => { setEditingUser(user); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setEditingUser(null); };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold tracking-wider uppercase mb-1">Team</p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Users</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage admin and staff accounts.</p>
        </div>
        <button onClick={openAddModal} className="flex items-center gap-2 bg-[#0e2a21] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#184536] transition-colors">
          <Plus className="w-4 h-4" /> Add user
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-x-auto transition-colors">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold">Role</th>
              <th className="p-4 font-semibold text-center">Joined</th>
              <th className="p-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs ${user.role === 'admin' ? 'bg-[#0e2a21]' : 'bg-gray-400'}`}>
                    {user.name.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="font-semibold text-gray-800 dark:text-white text-sm">{user.name}</span>
                </td>
                <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{user.email}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold ${
                    user.role === 'admin' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {user.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                    {user.role}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-500 dark:text-gray-400 text-center">{user.joined}</td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => openEditModal(user)} className="p-1.5 text-gray-400 hover:text-blue-600 rounded transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(user.id, user.name)} className="p-1.5 text-gray-400 hover:text-red-600 rounded transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
               <tr><td colSpan="5" className="p-8 text-center text-gray-500 dark:text-gray-400">No users found in database.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <UserModal 
        key={editingUser ? editingUser.id : 'new-user'}
        isOpen={isModalOpen} 
        onClose={closeModal} 
        onSave={handleSaveUser} 
        editingUser={editingUser}
        isSaving={isSaving}
      />

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
}