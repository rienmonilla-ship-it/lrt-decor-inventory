import { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, Package, ArrowRightLeft, FolderKanban, 
  Truck, FileText, Users, LogOut, ArrowDownLeft, ArrowUpRight 
} from 'lucide-react';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { collection, onSnapshot } from "firebase/firestore";
import { db } from './firebase';

import Items from './Items'; 
import StockMovements from './StockMovements'; 
import Projects from './Projects'; 
import Suppliers from './Suppliers'; 
import Reports from './Reports'; 
import UsersPage from './Users'; 

export default function Dashboard({ onLogout, userEmail }) {
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  
  const [items, setItems] = useState([]);
  const [projects, setProjects] = useState([]);
  const [movements, setMovements] = useState([]);
  const [users, setUsers] = useState([]); 

  useEffect(() => {
    const unsubItems = onSnapshot(collection(db, "items"), (snapshot) => {
      setItems(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });

    const unsubProjects = onSnapshot(collection(db, "projects"), (snapshot) => {
      setProjects(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });

    const unsubMovements = onSnapshot(collection(db, "movements"), (snapshot) => {
      setMovements(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });

    const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });

    return () => {
      unsubItems();
      unsubProjects();
      unsubMovements();
      unsubUsers();
    };
  }, []);

  const currentUser = users.find(u => u.email === userEmail);
  const displayName = currentUser ? currentUser.name.split(' ')[0] : 'User';
  const userRole = currentUser ? currentUser.role : 'staff';

  const totalItems = items.length;
  const totalStockValue = items.reduce((total, item) => total + (item.qty * item.price), 0);
  const lowStockCount = items.filter(item => item.qty <= item.min).length;
  const activeProjects = projects.filter(p => p.status === 'Active');
  const activeProjectsCount = activeProjects.length;

  const currentDate = new Date().toLocaleString('default', { month: 'long', year: 'numeric' }).toUpperCase();

  const pieData = useMemo(() => {
    const counts = {};
    items.forEach(item => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    const colors = ['#1b4d3e', '#2d6a4f', '#40916c', '#74c69d', '#95d5b2'];
    return Object.keys(counts).map((key, index) => ({
      name: key,
      value: counts[key],
      color: colors[index % colors.length]
    }));
  }, [items]);

  const lineData = useMemo(() => {
    const totalIn = movements.filter(m => m.type === 'IN').reduce((sum, m) => sum + m.qty, 0);
    const totalOut = movements.filter(m => m.type === 'OUT').reduce((sum, m) => sum + m.qty, 0);
    
    return [
      { name: 'Day 1', in: 0, out: 0 },
      { name: 'Day 2', in: 0, out: 0 },
      { name: 'Day 3', in: totalIn > 0 ? totalIn * 0.2 : 0, out: 0 },
      { name: 'Day 4', in: totalIn > 0 ? totalIn * 0.5 : 0, out: 0 },
      { name: 'Today', in: totalIn, out: totalOut },
    ];
  }, [movements]);

  return (
    <div className="flex h-screen w-full font-sans bg-gray-50">
      <div className="w-64 bg-[#0e2a21] text-white flex flex-col justify-between">
        <div>
          <div className="p-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-[#0e2a21] text-xs">LRT</div>
            <div>
              <h1 className="font-bold tracking-widest text-xs">LRT DECOR</h1>
              <p className="text-[10px] text-green-400">PRODUCTS · EST. 2008</p>
            </div>
          </div>
          <nav className="mt-4 px-4 space-y-1">
            {[
              { name: 'Dashboard', icon: LayoutDashboard }, { name: 'Items', icon: Package },
              { name: 'Stock Movements', icon: ArrowRightLeft }, { name: 'Projects', icon: FolderKanban },
              { name: 'Suppliers', icon: Truck }, { name: 'Reports', icon: FileText },
              { name: 'Users', icon: Users },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveMenu(item.name)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                  activeMenu === item.name ? 'bg-[#1b4d3e] text-white' : 'text-gray-400 hover:text-white hover:bg-[#184536]'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-green-900">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500 font-semibold tracking-wider uppercase">Inventory Console</p>
            <h1 className="text-xl font-bold text-gray-800">
              Welcome back, {displayName} <span className="text-sm font-normal text-gray-500">({userRole})</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Cloud Live
          </div>
        </header>

        <main className="p-8">
          {activeMenu === 'Dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex justify-between items-start">
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Total Items</p>
                    <h2 className="text-2xl font-bold text-gray-900 mt-1">{totalItems}</h2>
                    <p className="text-xs text-gray-400 mt-1">SKUs tracked</p>
                  </div>
                  <div className="p-2 bg-[#0e2a21] rounded-lg"><Package className="w-5 h-5 text-white" /></div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex justify-between items-start">
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Stock Value</p>
                    <h2 className="text-2xl font-bold text-gray-900 mt-1">₱{totalStockValue.toLocaleString()}</h2>
                    <p className="text-xs text-gray-400 mt-1">Current inventory worth</p>
                  </div>
                  <div className="p-2 bg-green-100 rounded-lg"><ArrowUpRight className="w-5 h-5 text-green-600" /></div>
                </div>
                <div onClick={() => setActiveMenu('Items')} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex justify-between items-start cursor-pointer hover:border-yellow-400 transition-colors">
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Low Stock</p>
                    <h2 className="text-2xl font-bold text-gray-900 mt-1">{lowStockCount}</h2>
                    <p className="text-xs text-gray-400 mt-1">Click to view items</p>
                  </div>
                  <div className="p-2 bg-yellow-100 rounded-lg"><ArrowDownLeft className="w-5 h-5 text-yellow-600" /></div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex justify-between items-start">
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Active Projects</p>
                    <h2 className="text-2xl font-bold text-gray-900 mt-1">{activeProjectsCount}</h2>
                    <p className="text-xs text-gray-500 mt-1 truncate max-w-[150px]">{activeProjects.map(p => p.name).join(', ') || 'None'}</p>
                  </div>
                  <div className="p-2 bg-red-100 rounded-lg"><FolderKanban className="w-5 h-5 text-red-600" /></div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm lg:col-span-2">
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">{currentDate} OVERVIEW</p>
                  <h3 className="font-bold text-gray-800 mb-6">Stock In vs Out Trend</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={lineData}>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#888'}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#888'}} />
                        <Tooltip cursor={{fill: 'transparent'}} />
                        <Line type="monotone" dataKey="in" stroke="#1b4d3e" strokeWidth={3} dot={{r: 4}} name="Stock IN" />
                        <Line type="monotone" dataKey="out" stroke="#e63946" strokeWidth={3} dot={{r: 4}} name="Stock OUT" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Portfolio</p>
                  <h3 className="font-bold text-gray-800 mb-6">Items by Category</h3>
                  <div className="h-48 mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                          {pieData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2">
                    {pieData.map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                          <span className="text-gray-600 truncate max-w-[150px]">{item.name}</span>
                        </div>
                        <span className="font-bold text-gray-800">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Activity</p>
                    <h3 className="font-bold text-gray-800">Recent Movements</h3>
                  </div>
                  <button onClick={() => setActiveMenu('Stock Movements')} className="text-xs font-semibold text-green-700 hover:underline">View all</button>
                </div>
                <div className="space-y-3">
                  {movements.slice(0, 3).map((move) => (
                    <div key={move.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${move.type === 'IN' ? 'bg-green-100' : 'bg-red-100'}`}>
                          {move.type === 'IN' ? <ArrowDownLeft className="w-4 h-4 text-green-600" /> : <ArrowUpRight className="w-4 h-4 text-red-600" />}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{move.item}</p>
                          <p className="text-xs text-gray-500">{move.user} · {move.date.split(',')[0]}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-bold ${move.type === 'IN' ? 'text-green-600' : 'text-red-600'}`}>
                        {move.type === 'IN' ? '+' : '-'}{move.qty}
                      </span>
                    </div>
                  ))}
                  {movements.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No recent movements.</p>}
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'Items' && (
            <Items 
              items={items} 
              defaultFilterLowStock={lowStockCount > 0} 
              currentUserName={displayName} // IPINAPASA NATIN ANG PANGALAN DITO
            />
          )}
          {activeMenu === 'Stock Movements' && <StockMovements movements={movements} />}
          {activeMenu === 'Projects' && <Projects projects={projects} />}
          {activeMenu === 'Suppliers' && <Suppliers />}
          {activeMenu === 'Reports' && <Reports items={items} />}
          {activeMenu === 'Users' && <UsersPage />}
        </main>
      </div>
    </div>
  );
}