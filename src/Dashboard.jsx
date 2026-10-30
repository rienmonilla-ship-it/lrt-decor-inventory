import { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, Package, ArrowRightLeft, FolderKanban, 
  Truck, FileText, Users, LogOut, ArrowDownLeft, ArrowUpRight, Activity, ChevronDown, Menu, X, Loader2, TrendingUp
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
import NotificationBell from './NotificationBell'; 
import ThemeToggle from './ThemeToggle';
import ActivityLogs from './ActivityLogs'; 
import UserProfileModal from './UserProfileModal'; 

export default function Dashboard({ onLogout, userEmail }) {
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  
  const [items, setItems] = useState([]);
  const [projects, setProjects] = useState([]);
  const [movements, setMovements] = useState([]);
  const [users, setUsers] = useState([]); 
  const [logs, setLogs] = useState([]); 

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
  
  const [isLoading, setIsLoading] = useState(true);

  // --- IDLE TIMEOUT LOGIC ---
  useEffect(() => {
    let idleTimer;
    const IDLE_TIMEOUT = 30 * 60 * 1000; // 30 minuto

    const resetTimer = () => {
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        alert("You have been logged out due to inactivity.");
        onLogout();
      }, IDLE_TIMEOUT);
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('click', resetTimer);
    window.addEventListener('scroll', resetTimer);

    resetTimer();

    return () => {
      if (idleTimer) clearTimeout(idleTimer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
      window.removeEventListener('scroll', resetTimer);
    };
  }, [onLogout]);

  // --- KONEKSYON SA FIREBASE ---
  useEffect(() => {
    const unsubItems = onSnapshot(collection(db, "items"), (snapshot) => {
      setItems(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      setIsLoading(false);
    });

    const unsubProjects = onSnapshot(collection(db, "projects"), (snapshot) => {
      setProjects(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });

    const unsubMovements = onSnapshot(collection(db, "movements"), (snapshot) => {
      const sortedMovements = snapshot.docs
        .map(doc => ({ ...doc.data(), id: doc.id }))
        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)); 
      setMovements(sortedMovements);
    });

    const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });

    const unsubLogs = onSnapshot(collection(db, "logs"), (snapshot) => {
      const sortedLogs = snapshot.docs
        .map(doc => ({ ...doc.data(), id: doc.id }))
        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      setLogs(sortedLogs);
    });

    return () => {
      unsubItems();
      unsubProjects();
      unsubMovements();
      unsubUsers(); 
      unsubLogs(); 
    };
  }, []);

  const currentUser = users.find(u => u.email === userEmail);
  const displayName = currentUser ? currentUser.name.split(' ')[0] : 'User';
  const userRole = currentUser ? currentUser.role : 'staff';

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'staff'] },
    { name: 'Items', icon: Package, roles: ['admin', 'staff'] },
    { name: 'Stock Movements', icon: ArrowRightLeft, roles: ['admin', 'staff'] },
    { name: 'Projects', icon: FolderKanban, roles: ['admin', 'staff'] },
    { name: 'Suppliers', icon: Truck, roles: ['admin'] }, 
    { name: 'Reports', icon: FileText, roles: ['admin'] }, 
    { name: 'Users', icon: Users, roles: ['admin'] }, 
    { name: 'Activity Logs', icon: Activity, roles: ['admin'] }, 
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(userRole));

  const totalItems = items.length;
  const totalStockValue = items.reduce((total, item) => total + (item.qty * item.price), 0);
  const totalIncome = projects.reduce((sum, p) => sum + (p.contractPrice || 0), 0);
  const lowStockItems = items.filter(item => item.qty <= item.min);
  const lowStockCount = lowStockItems.length;
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
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      last7Days.push({
        label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: date.toDateString(),
        in: 0,
        out: 0
      });
    }

    movements.forEach(move => {
      const moveDate = new Date(move.date).toDateString();
      const dayData = last7Days.find(d => d.fullDate === moveDate);
      if (dayData) {
        if (move.type === 'IN') {
          dayData.in += move.qty;
        } else if (move.type === 'OUT') {
          dayData.out += move.qty;
        }
      }
    });

    return last7Days.map(d => ({ name: d.label, in: d.in, out: d.out }));
  }, [movements]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-green-800 dark:text-green-400 animate-spin" />
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Loading inventory data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full font-sans bg-gray-50 dark:bg-gray-900 transition-colors relative">
      
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)} 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        ></div>
      )}

      {/* SIDEBAR */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0e2a21] text-white flex flex-col justify-between border-r border-[#184536] transform transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } md:relative md:translate-x-0`}>
        
        <button 
          onClick={() => setIsMobileMenuOpen(false)} 
          className="absolute top-4 right-4 md:hidden p-1.5 hover:bg-white/10 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <div className="p-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-[#0e2a21] text-xs">LRT</div>
            <div>
              <h1 className="font-bold tracking-widest text-xs">LRT DECOR</h1>
              <p className="text-[10px] text-green-400">PRODUCTS · EST. 2008</p>
            </div>
          </div>
          <nav className="mt-4 px-4 space-y-1">
            {filteredMenu.map((item) => (
              <button
                key={item.name}
                onClick={() => { setActiveMenu(item.name); setIsMobileMenuOpen(false); }}
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

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-y-auto w-full">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 md:px-8 py-4 flex justify-between items-center transition-colors sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)} 
              className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold tracking-wider uppercase">Inventory Console</p>
              <h1 className="text-sm md:text-xl font-bold text-gray-800 dark:text-white truncate max-w-[150px] sm:max-w-none">
                Welcome back, {displayName} <span className="text-xs md:text-sm font-normal text-gray-500 dark:text-gray-400">({userRole})</span>
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <div className="relative">
              <button 
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[#0e2a21] flex items-center justify-center text-white font-bold text-xs">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 hidden md:block">{displayName}</span>
                <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                  <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-sm font-bold text-gray-800 dark:text-white">{currentUser?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{currentUser?.email}</p>
                  </div>
                  <button 
                    onClick={() => { setIsProfileModalOpen(true); setIsProfileDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Profile Settings
                  </button>
                  <button 
                    onClick={onLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            <ThemeToggle />
            <NotificationBell 
              lowStockItems={lowStockItems} 
              onViewItems={() => setActiveMenu('Items')} 
            />
            <div className="hidden sm:flex items-center gap-2 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-semibold">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Cloud Live
            </div>
          </div>
        </header>

        <main className="p-4 md:p-8">
          {activeMenu === 'Dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                <div onClick={() => setActiveMenu('Items')} className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex justify-between items-start cursor-pointer hover:shadow-md hover:border-green-500 transition-all">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">Total Items</p>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{totalItems}</h2>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">SKUs tracked</p>
                  </div>
                  <div className="p-2 bg-[#0e2a21] rounded-lg"><Package className="w-5 h-5 text-white" /></div>
                </div>
                
                <div onClick={() => setActiveMenu('Reports')} className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex justify-between items-start cursor-pointer hover:shadow-md hover:border-green-500 transition-all">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">Stock Value</p>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">₱{totalStockValue.toLocaleString()}</h2>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Current inventory worth</p>
                  </div>
                  <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg"><ArrowUpRight className="w-5 h-5 text-green-600 dark:text-green-400" /></div>
                </div>

                <div onClick={() => setActiveMenu('Reports')} className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex justify-between items-start cursor-pointer hover:shadow-md hover:border-green-500 transition-all">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">Total Income</p>
                    <h2 className="text-2xl font-bold text-green-600 mt-1">₱{totalIncome.toLocaleString()}</h2>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">From all projects</p>
                  </div>
                  <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg"><TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" /></div>
                </div>
                
                <div onClick={() => setActiveMenu('Items')} className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex justify-between items-start cursor-pointer hover:shadow-md hover:border-yellow-500 transition-all">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">Low Stock</p>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{lowStockCount}</h2>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Click to view items</p>
                  </div>
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg"><ArrowDownLeft className="w-5 h-5 text-yellow-600 dark:text-yellow-400" /></div>
                </div>
                
                <div onClick={() => setActiveMenu('Projects')} className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex justify-between items-start cursor-pointer hover:shadow-md hover:border-red-500 transition-all">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">Active Projects</p>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{activeProjectsCount}</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate max-w-[150px]">{activeProjects.map(p => p.name).join(', ') || 'None'}</p>
                  </div>
                  <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg"><FolderKanban className="w-5 h-5 text-red-600 dark:text-red-400" /></div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm lg:col-span-2 transition-colors">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mb-1">{currentDate} OVERVIEW</p>
                  <h3 className="font-bold text-gray-800 dark:text-white mb-6">Stock In vs Out Trend</h3>
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

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mb-1">Portfolio</p>
                  <h3 className="font-bold text-gray-800 dark:text-white mb-6">Items by Category</h3>
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
                          <span className="text-gray-600 dark:text-gray-300 truncate max-w-[150px]">{item.name}</span>
                        </div>
                        <span className="font-bold text-gray-800 dark:text-white">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 transition-colors">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mb-1">Activity</p>
                    <h3 className="font-bold text-gray-800 dark:text-white">Recent Movements</h3>
                  </div>
                  <button onClick={() => setActiveMenu('Stock Movements')} className="text-xs font-semibold text-green-700 dark:text-green-400 hover:underline">View all</button>
                </div>
                <div className="space-y-3">
                  {movements.slice(0, 3).map((move) => (
                    <div 
                      key={move.id} 
                      onClick={() => setActiveMenu('Stock Movements')}
                      className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors px-2 rounded"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${move.type === 'IN' ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'}`}>
                          {move.type === 'IN' ? <ArrowDownLeft className="w-4 h-4 text-green-600 dark:text-green-400" /> : <ArrowUpRight className="w-4 h-4 text-red-600 dark:text-red-400" />}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800 dark:text-white">{move.item}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{move.user} · {move.date.split(',')[0]}</p>
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
              currentUserName={displayName} 
              userRole={userRole} 
              projects={projects} 
            />
          )}
          
          {activeMenu === 'Stock Movements' && (
            <StockMovements 
              movements={movements} 
              items={items} 
              projects={projects} 
              userRole={userRole} 
            />
          )}
          
          {activeMenu === 'Projects' && (
            <Projects 
              projects={projects} 
              movements={movements} 
              items={items} 
              userRole={userRole} 
            />
          )}
          
          {activeMenu === 'Suppliers' && <Suppliers userRole={userRole} />}
          {activeMenu === 'Reports' && <Reports items={items} movements={movements} projects={projects} />}
          {activeMenu === 'Users' && <UsersPage />}
          {activeMenu === 'Activity Logs' && <ActivityLogs logs={logs} />}
        </main>
      </div>

      <UserProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        currentUser={currentUser} 
      />
    </div>
  );
}