import { Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Tinatanggap natin ang "items" prop
export default function Reports({ items }) {
  
  // Kinukuha natin ang totoong category data galing sa items
  const categoryData = items.reduce((acc, item) => {
    const existing = acc.find(a => a.name === item.category);
    if (existing) {
      existing.value += (item.qty * item.price);
    } else {
      acc.push({ name: item.category, value: (item.qty * item.price) });
    }
    return acc;
  }, []);

  // Kinukuha natin ang Top 10 items base sa value
  const topItemsData = [...items]
    .sort((a, b) => (b.qty * b.price) - (a.qty * a.price))
    .slice(0, 10)
    .map((item, index) => ({ name: `${index + 1}. ${item.name}`, value: (item.qty * item.price) }));

  const handleExportCSV = () => {
    let csvContent = "Category,Value (PHP)\n";
    categoryData.forEach(row => {
      csvContent += `"${row.name}",${row.value}\n`;
    });

    csvContent += "\n\nTop Highest Value Items,Value (PHP)\n";
    topItemsData.forEach(row => {
      csvContent += `"${row.name}",${row.value}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `LRT_Inventory_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-xs text-gray-500 font-semibold tracking-wider uppercase mb-1">Insights</p>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        </div>
        <button onClick={handleExportCSV} className="flex items-center gap-2 bg-[#0e2a21] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#184536] transition-colors">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Total Items</p>
          <h2 className="text-2xl font-bold text-gray-900 mt-1">{items.length}</h2>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Total Value</p>
          <h2 className="text-2xl font-bold text-gray-900 mt-1">₱{items.reduce((total, item) => total + (item.qty * item.price), 0).toLocaleString()}</h2>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Stock In Transactions</p>
          <h2 className="text-2xl font-bold text-gray-900 mt-1">--</h2>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Stock Out Transactions</p>
          <h2 className="text-2xl font-bold text-gray-900 mt-1">--</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-6">Inventory Value by Category</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 0, right: 0, left: 40, bottom: 0 }}>
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#888'}} tickFormatter={(val) => `${val/1000}k`} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#666'}} width={130} />
                <Tooltip cursor={{fill: 'transparent'}} formatter={(val) => `₱${val.toLocaleString()}`} />
                <Bar dataKey="value" fill="#1b4d3e" radius={[0, 4, 4, 0]} barSize={20}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#1b4d3e' : '#40916c'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-6">Top 10 Highest Value Items</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topItemsData} layout="vertical" margin={{ top: 0, right: 30, left: 60, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#333', fontWeight: 'bold'}} width={130} />
                <Tooltip cursor={{fill: 'transparent'}} formatter={(val) => `₱${val.toLocaleString()}`} />
                <Bar dataKey="value" fill="#1b4d3e" radius={[0, 4, 4, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}