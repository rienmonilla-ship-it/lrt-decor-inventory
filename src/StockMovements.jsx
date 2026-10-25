import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export default function StockMovements({ movements }) {
  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-xs text-gray-500 font-semibold tracking-wider uppercase mb-1">Activity Ledger</p>
          <h1 className="text-3xl font-bold text-gray-900">Stock Movements</h1>
          <p className="text-sm text-gray-500 mt-1">A chronological record of every stock change.</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
              <th className="p-4 font-semibold">When</th>
              <th className="p-4 font-semibold">Type</th>
              <th className="p-4 font-semibold">Item</th>
              <th className="p-4 font-semibold text-right">Qty</th>
              <th className="p-4 font-semibold text-center">Reason</th>
              <th className="p-4 font-semibold text-center">Project</th>
              <th className="p-4 font-semibold text-right">User</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {movements && movements.length > 0 ? (
              movements.map((move) => (
                <tr key={move.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm text-gray-600">{move.date}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                      move.type === 'IN' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {move.type === 'IN' ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                      {move.type}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-semibold text-gray-800">{move.item}</td>
                  <td className={`p-4 text-sm font-bold text-right ${move.type === 'IN' ? 'text-green-600' : 'text-red-600'}`}>
                    {move.type === 'IN' ? '+' : '-'} {move.qty}
                  </td>
                  <td className="p-4 text-sm text-gray-500 text-center">{move.reason}</td>
                  <td className="p-4 text-sm text-gray-500 text-center">{move.project}</td>
                  <td className="p-4 text-sm text-gray-500 text-right">{move.user}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-8 text-center text-gray-500">No stock movements yet. Try doing a Stock In or Stock Out.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}