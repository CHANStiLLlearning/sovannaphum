import { NavLink } from 'react-router-dom';
import { Home, ArrowLeft, ShieldAlert } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col justify-center items-center px-4 py-16 bg-[#f8f9fa] text-gray-800 font-sans">
      <div className="max-w-md w-full text-center space-y-8">
        
        {/* Animated Icon Container */}
        <div className="relative flex justify-center">
          <div className="absolute inset-0 bg-[#9A2220]/10 rounded-full blur-2xl w-32 h-32 mx-auto animate-pulse"></div>
          <div className="relative w-28 h-28 rounded-3xl bg-white border border-gray-100 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
            <ShieldAlert className="w-14 h-14 text-[#9A2220]" />
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-3">
          <h1 className="text-7xl font-black text-gray-900 tracking-tight select-none">
            404
          </h1>
          <h2 className="text-2xl font-bold text-gray-900 leading-snug">
            Oops! Page Not Found
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        {/* Buttons / Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4">
          <NavLink
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#9A2220] hover:bg-[#8A1A18] text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <Home className="w-4 h-4" />
            Go to Home
          </NavLink>
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-bold py-3 px-6 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>

      </div>
    </div>
  );
};

export default NotFoundPage;
