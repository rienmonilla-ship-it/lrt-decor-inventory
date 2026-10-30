import { Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatCurrency } from './formatCurrency'; // BAGONG IMPORT

export default function Reports({ items, movements, projects }) {
  
  const categoryData = items.reduce((acc, item) => {
    const existing = acc.find(a => a.name === item.category);
    if (existing) {
      existing.value += (item.qty * item.price);
    } else {
      acc.push({ name: item.category, value: (item.qty * item.price) });
    }
    return acc;
  }, []);

  const topItemsData = [...items]
    .sort((a, b) => (b.qty * b.price) - (a.qty * a.price))
    .slice(0, 10)
    .map((item, index) => ({ name: `${index + 1}. ${item.name}`, value: (item.qty * item.price) }));

  const stockInCount = movements?.filter(m => m.type === 'IN').length || 0;
  const stockOutCount = movements?.filter(m => m.type === 'OUT').length || 0;

  const totalIncome = projects.reduce((sum, p) => sum + (p.contractPrice || 0), 0);
  const totalExpenses = projects.reduce((sum, p) => sum + (p.cost || 0), 0);
  const totalProfit = totalIncome - totalExpenses;

  const handleExportCSV = () => {
    const date = new Date().toLocaleString();
    let csvContent = "";

    csvContent += "LRT DECOR PRODUCTS - INVENTORY REPORT\n";
    csvContent += `Generated on: ${date}\n`;
    csvContent += `Total Items: ${items.length}\n`;
    csvContent += `Total Value: PHP ${items.reduce((total, item) => total + (item.qty * item.price), 0).toLocaleString()}\n`;
    csvContent += `Stock In Transactions: ${stockInCount}\n`;
    csvContent += `Stock Out Transactions: ${stockOutCount}\n`;
    csvContent += `Total Income: PHP ${totalIncome.toLocaleString()}\n`;
    csvContent += `Total Expenses: PHP ${totalExpenses.toLocaleString()}\n`;
    csvContent += `Total Profit: PHP ${totalProfit.toLocaleString()}\n\n`;

    csvContent += "INVENTORY VALUE BY CATEGORY\n";
    csvContent += "Category,Value (PHP)\n";
    categoryData.forEach(row => {
      csvContent += `"${row.name}","${row.value.toLocaleString()}"\n`;
    });
    csvContent += "\n";

    csvContent += "TOP 10 HIGHEST VALUE ITEMS\n";
    csvContent += "Item Name,Value (PHP)\n";
    topItemsData.forEach(row => {
      csvContent += `"${row.name}","${row.value.toLocaleString()}"\n`;
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
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold tracking-wider uppercase mb-1">Insights</p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports</h1>
        </div>
        <button onClick={handleExportCSV} className="flex items-center gap-2 bg-[#0e2a21] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#184536] transition-colors">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">Total Income</p>
          <h2 className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(totalIncome)}</h2>
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">Total Expenses</p>
          <h2 className="text-2xl font-bold text-red-600 mt-1">{formatCurrency(totalExpenses)}</h2>
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">Total Profit</p>
          <h2 className={`text-2xl font-bold mt-1 ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(totalProfit)}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">Total Items</p>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{items.length}</h2>
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">Total Value</p>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(items.reduce((total, item) => total + (item.qty * item.price), 0))}</h2>
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">Stock In Transactions</p>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stockInCount}</h2>
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">Stock Out Transactions</p>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stockOutCount}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="font-bold text-gray-800 dark:text-white mb-6">Inventory Value by Category</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 0, right: 0, left: 40, bottom: 0 }}>
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#888'}} tickFormatter={(val) => `${val/1000}k`} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#666'}} width={130} />
                <Tooltip cursor={{fill: 'transparent'}} formatter={(val) => formatCurrency(val)} />
                <Bar dataKey="value" fill="#1b4d3e" radius={[0, 4, 4, 0]} barSize={20}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#1b4d3e' : '#40916c'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="font-bold text-gray-800 dark:text-white mb-6">Top 10 Highest Value Items</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topItemsData} layout="vertical" margin={{ top: 0, right: 30, left: 60, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#333', fontWeight: 'bold'}} width={130} />
                <Tooltip cursor={{fill: 'transparent'}} formatter={(val) => formatCurrency(val)} />
                <Bar dataKey="value" fill="#1b4d3e" radius={[0, 4, 4, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}