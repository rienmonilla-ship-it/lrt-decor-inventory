import { Activity, User, Package, Trash2, Edit, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export default function ActivityLogs({ logs }) {
  const getActionIcon = (action) => {
    switch(action) {
      case 'ADD_ITEM': return <Package className="w-4 h-4 text-green-600" />;
      case 'EDIT_ITEM': return <Edit className="w-4 h-4 text-blue-600" />;
      case 'DELETE_ITEM': return <Trash2 className="w-4 h-4 text-red-600" />;
      case 'STOCK_IN': return <ArrowDownLeft className="w-4 h-4 text-green-600" />;
      case 'STOCK_OUT': return <ArrowUpRight className="w-4 h-4 text-red-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold tracking-wider uppercase mb-1">System History</p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Activity Logs</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">A chronological record of all user actions.</p>
      </div>

      {/* DINAGDAGAN NATIN NG overflow-x-auto AT min-w PARA SCROLLABLE SA PHONE */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-x-auto transition-colors">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <th className="p-4 font-semibold whitespace-nowrap">When</th>
              <th className="p-4 font-semibold">User</th>
              <th className="p-4 font-semibold text-center">Action</th>
              <th className="p-4 font-semibold">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {logs && logs.length > 0 ? (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">{log.date}</td>
                  <td className="p-4 text-sm font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" /> {log.user}
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center justify-center gap-2 px-2.5 py-1 rounded-md text-xs font-bold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      {getActionIcon(log.action)} {log.action.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{log.details}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-500 dark:text-gray-400">No activity logs yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}