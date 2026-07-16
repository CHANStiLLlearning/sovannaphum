import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, User, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { API_BASE_URL } from '../../config';

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
    <div className="min-h-screen bg-gray-50 flex font-sans overflow-hidden">
      {/* Dynamic Keyframe Style Definition */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          50% { transform: translateY(-25px) rotate(10deg) scale(1.05); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          50% { transform: translateY(-18px) rotate(-8deg) scale(0.95); }
        }
        .animate-float-slow {
          animation: float-slow 12s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float-medium 8s ease-in-out infinite;
        }
      `}} />

      {/* Left Panel: Hero Graphic Sidebar (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-tr from-[#1D055F] via-[#9A2220] to-[#EBA525] text-white flex-col justify-between p-12">
        {/* Animated decorative shapes */}
        <div className="absolute top-[-10%] left-[-10%] w-72 h-72 rounded-full bg-white/10 blur-2xl animate-float-slow z-0"></div>
        <div className="absolute bottom-[-15%] right-[-5%] w-96 h-96 rounded-full bg-white/10 blur-3xl animate-float-medium z-0"></div>
        <div className="absolute top-[40%] right-[-10%] w-60 h-60 rounded-full bg-[#EBA525]/15 blur-2xl animate-float-slow z-0"></div>
        
        {/* Header logo / back link */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-semibold bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl">
            <ArrowLeft className="w-4 h-4" />
            Back to Website
          </Link>
        </div>

        {/* Center welcome content */}
        <div className="relative z-10 max-w-lg my-auto space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-lg border border-white/20 p-2 overflow-hidden animate-float-medium">
            <img src="/images/logo.png" alt="KAS Logo" className="w-full h-full object-contain" />
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-tight">
              Khmer America School
            </h1>
            <p className="text-lg text-white/80 font-medium">
              Management Portal & Central Administration
            </p>
          </div>
          <p className="text-sm text-white/70 leading-relaxed max-w-md">
            Enter your administrative credentials to manage programs, slides, faculty records, student submissions, news, and school events.
          </p>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-white/60">
          &copy; {new Date().getFullYear()} Khmer America School. All rights reserved.
        </div>
      </div>

      {/* Right Panel: Login Form (Occupies full screen on small layouts) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-20 relative bg-white">
        {/* Small floating bubble on mobile for accent */}
        <div className="lg:hidden absolute top-[-5%] right-[-5%] w-48 h-48 rounded-full bg-[#EBA525]/10 blur-2xl"></div>
        <div className="lg:hidden absolute bottom-[-5%] left-[-5%] w-48 h-48 rounded-full bg-[#9A2220]/10 blur-2xl"></div>

        <div className="w-full max-w-md space-y-8 relative z-10">
          {/* Mobile school branding header */}
          <div className="lg:hidden flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 p-2 overflow-hidden shadow-sm">
              <img src="/images/logo.png" alt="KAS Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
              <p className="text-sm text-gray-500 mt-1">Sign in to manage Khmer America School content</p>
            </div>
          </div>

          {/* Desktop header title */}
          <div className="hidden lg:block space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 p-2 overflow-hidden shadow-sm">
              <img src="/images/logo.png" alt="KAS Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Welcome back
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Please enter your admin credentials below
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100/80 shadow-2xl shadow-gray-200/50 p-6 sm:p-10 space-y-6">
            <form className="space-y-6" onSubmit={handleLogin}>
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm text-center font-semibold transition-all duration-300">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type="text" 
                    required 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-11 w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#9A2220]/20 focus:border-[#9A2220] transition-all outline-none text-gray-900 placeholder:text-gray-400 bg-gray-50/50 focus:bg-white" 
                    placeholder="Enter username"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-semibold text-gray-700">Password</label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 pr-11 w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#9A2220]/20 focus:border-[#9A2220] transition-all outline-none text-gray-900 placeholder:text-gray-400 bg-gray-50/50 focus:bg-white" 
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-[#9A2220] transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-gradient-to-r from-[#9A2220] to-[#b32724] hover:from-[#8A1A18] hover:to-[#9A2220] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9A2220] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg shadow-[#9A2220]/10"
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
          
          <div className="lg:hidden text-center text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Khmer America School.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
