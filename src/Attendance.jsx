import { useState, useEffect } from 'react';
import { collection, onSnapshot } from "firebase/firestore";
import { db } from './firebase';
import { Clock, User, LogIn, LogOut } from 'lucide-react';

export default function Attendance() {
  const [records, setRecords] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const unsubRecords = onSnapshot(collection(db, "attendance"), (snapshot) => {
      const sorted = snapshot.docs
        .map(doc => ({ ...doc.data(), id: doc.id }))
        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      setRecords(sorted);
    });

    const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });

    return () => {
      unsubRecords();
      unsubUsers();
    };
  }, []);

  const getDisplayName = (email) => {
    const user = users.find(u => u.email === email);
    return user ? user.name : email;
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold tracking-wider uppercase mb-1">Time Tracking</p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Attendance</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Record of all user time in and time out.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-x-auto transition-colors">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold">User</th>
              <th className="p-4 font-semibold text-center">Time In</th>
              <th className="p-4 font-semibold text-center">Time Out</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {records.length > 0 ? (
              records.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{record.date}</td>
                  <td className="p-4 text-sm font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" /> {getDisplayName(record.email)}
                  </td>
                  <td className="p-4 text-center">
                    {record.type === 'TIME_IN' ? (
                      <span className="inline-flex items-center gap-1 text-sm font-bold text-green-600">
                        <LogIn className="w-4 h-4" /> {record.timeIn}
                      </span>
                    ) : '-'}
                  </td>
                  <td className="p-4 text-center">
                    {record.type === 'TIME_OUT' ? (
                      <span className="inline-flex items-center gap-1 text-sm font-bold text-red-600">
                        <LogOut className="w-4 h-4" /> {record.timeOut}
                      </span>
                    ) : '-'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-500 dark:text-gray-400">No attendance records yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}