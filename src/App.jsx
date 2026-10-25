import { useState } from 'react';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { signInWithEmailAndPassword } from "firebase/auth"; // Tinanggal ang onAuthStateChanged
import { auth } from './firebase'; 
import Dashboard from './Dashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState(''); // I-save natin ang email dito
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password.trim());
      setUserEmail(userCredential.user.email); // Kunin ang email ng naka-login
      setIsLoggedIn(true);
    } catch (err) {
      console.error(err);
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isLoggedIn) {
    return <Dashboard onLogout={() => setIsLoggedIn(false)} userEmail={userEmail} />;
  }

  return (
    <div className="flex h-screen w-full font-sans">
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 bg-[#0e2a21] text-white">
        <div>
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-[#0e2a21]">LRT</div>
            <div>
              <h1 className="font-bold tracking-widest text-sm">LRT DECOR</h1>
              <p className="text-xs text-green-400">PRODUCTS · EST. 2008</p>
            </div>
          </div>
          <div className="space-y-6">
            <p className="text-green-400 tracking-widest text-xs font-semibold uppercase">Inventory Console</p>
            <h2 className="text-5xl font-bold leading-tight">Precision inventory<br />for operable wall<br />partition builds.</h2>
            <p className="text-gray-400 text-sm max-w-md">Track every panel, roller, and rivet. Assign materials to projects. Never run out of stock during installation again.</p>
          </div>
        </div>
        <div className="flex gap-12 border-t border-green-900 pt-6">
          <div><h3 className="text-3xl font-bold">17+</h3><p className="text-xs text-green-400 tracking-wider">YEARS OF CRAFT</p></div>
          <div><h3 className="text-3xl font-bold">100%</h3><p className="text-xs text-green-400 tracking-wider">STOCK ACCURACY</p></div>
          <div><h3 className="text-3xl font-bold">24/7</h3><p className="text-xs text-green-400 tracking-wider">REAL-TIME ACCESS</p></div>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 bg-gray-50 p-8">
        <div className="w-full max-w-md">
          <p className="text-green-800 tracking-widest text-xs font-semibold uppercase mb-2">Sign In</p>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Welcome back.</h2>
          <p className="text-gray-500 mb-8 text-sm">Enter your credentials to access your inventory workspace.</p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-gray-400" /></div>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-800 bg-white text-gray-900 sm:text-sm" placeholder="admin@lrtdecor.ph" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-400" /></div>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-800 bg-white text-gray-900 sm:text-sm" placeholder="••••••••" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#0e2a21] hover:bg-[#184536] transition-colors disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;