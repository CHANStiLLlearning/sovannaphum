import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Lock, User, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { API_BASE_URL } from '../../../config';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        login(data.token);
        navigate('/admin');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] flex flex-col justify-center items-center p-6 relative font-sans">
      {/* Floating Back Link */}
      <div className="absolute top-6 left-6">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-500 hover:text-gray-900 hover:bg-gray-100/50 transition-all border border-transparent hover:border-gray-200/50"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Website
        </Link>
      </div>

      <div className="w-full max-w-[440px] space-y-6">
        {/* Main Logo Container */}
        <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center border border-gray-200/60 shadow-md mx-auto p-2.5 overflow-hidden transition-transform duration-300 hover:scale-105">
          <img src="/images/logo.png" alt="Khmer America School Logo" className="w-full h-full object-contain" />
        </div>

        {/* Branding Headers */}
        <div className="text-center space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Khmer America School
          </h1>
          <p className="text-sm font-medium text-gray-500">
            Sign in to manage your school content
          </p>
        </div>

        {/* Card Component */}
        <div className="bg-white rounded-3xl border border-gray-200/60 shadow-xl shadow-slate-200/50 p-6 sm:p-10">
          <form className="space-y-5" onSubmit={handleLogin}>
            {error && (
              <div className="bg-blue-50 border border-blue-100 text-blue-600 px-4 py-3 rounded-xl text-sm text-center font-medium transition-all duration-300">
                {error}
              </div>
            )}
            
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-[-10px] flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  required 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10.5 w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E3A8A]/10 focus:border-[#1E3A8A] transition-all outline-none text-gray-900 text-sm placeholder:text-gray-400 bg-gray-50/30 focus:bg-white" 
                  placeholder="admin"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-[-10px]  flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10.5 pr-11 w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E3A8A]/10 focus:border-[#1E3A8A] transition-all outline-none text-gray-900 text-sm placeholder:text-gray-400 bg-gray-50/30 focus:bg-white" 
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-[#1E3A8A] hover:bg-[#172554] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E3A8A] transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg shadow-[#1E3A8A]/10 mt-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-gray-400/90 font-medium">
          &copy; {new Date().getFullYear()} Khmer America School. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
