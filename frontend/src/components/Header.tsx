import { useState } from 'react';
import { Search, Sun, Menu, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Header = () => {
  const logo = "/images/logo.png"
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="w-full bg-[#BD0B32] text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo Section */}
          <NavLink to="/" className="flex items-center gap-3 cursor-pointer">
            {/* Logo Emblem Placeholder */}
            <img src={logo} alt="Sovannaphumi School" className="w-25 h-16" />
            <h1 className="text-xl font-bold">
              <span className="text-white">AMERICA SCHOOL</span>
            </h1> 
          </NavLink>

          {/* Navigation Desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            <NavLink
              to="/"
              className={({ isActive }) => `px-4 py-2 rounded-lg text-[15px] font-semibold transition-colors ${isActive ? 'bg-[#8A1A18] text-white' : 'text-white hover:bg-black/10'}`}
            >
              Home
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) => `px-4 py-2 rounded-lg text-[15px] font-semibold transition-colors ${isActive ? 'bg-[#8A1A18] text-white' : 'text-white hover:bg-black/10'}`}
            >
              About Us
            </NavLink>
            <NavLink
              to="/admissions"
              className={({ isActive }) => `px-4 py-2 rounded-lg text-[15px] font-semibold transition-colors ${isActive ? 'bg-[#8A1A18] text-white' : 'text-white hover:bg-black/10'}`}
            >
              Admissions
            </NavLink>
            <NavLink
              to="/programs"
              className={({ isActive }) => `px-4 py-2 rounded-lg text-[15px] font-semibold transition-colors ${isActive ? 'bg-[#8A1A18] text-white' : 'text-white hover:bg-black/10'}`}
            >
              Programs
            </NavLink>
            <NavLink
              to="/news"
              className={({ isActive }) => `px-4 py-2 rounded-lg text-[15px] font-semibold transition-colors ${isActive ? 'bg-[#8A1A18] text-white' : 'text-white hover:bg-black/10'}`}
            >
              News
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) => `px-4 py-2 rounded-lg text-[15px] font-semibold transition-colors ${isActive ? 'bg-[#8A1A18] text-white' : 'text-white hover:bg-black/10'}`}
            >
              Contact Us
            </NavLink>
            <NavLink
              to="/careers"
              className={({ isActive }) => `px-4 py-2 rounded-lg text-[15px] font-semibold transition-colors ${isActive ? 'bg-[#8A1A18] text-white' : 'text-white hover:bg-black/10'}`}
            >
              Careers
            </NavLink>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="p-2 hover:bg-black/10 rounded-full transition-colors hidden sm:block">
              <Search className="w-[18px] h-[18px] text-white font-bold" strokeWidth={2.5} />
            </button>
            <button className="p-2 hover:bg-black/10 rounded-full transition-colors hidden sm:block">
              <Sun className="w-[20px] h-[20px] text-white" />
            </button>
            <button className="ml-1 hover:opacity-80 transition-opacity flex items-center justify-center">
              {/* British Flag Placeholder */}
              <div className="w-6 h-6 rounded-full overflow-hidden border-[1.5px] border-white bg-[#012169] relative flex items-center justify-center">
                <div className="w-full h-[3px] bg-white absolute"></div>
                <div className="w-[3px] h-full bg-white absolute"></div>
                <div className="w-full h-[1px] bg-[#C8102E] absolute"></div>
                <div className="w-[1px] h-full bg-[#C8102E] absolute"></div>
                {/* Diagonals */}
                <div className="w-[120%] h-[2px] bg-white absolute transform rotate-45"></div>
                <div className="w-[120%] h-[2px] bg-white absolute transform -rotate-45"></div>
                <div className="w-[120%] h-[1px] bg-[#C8102E] absolute transform rotate-45"></div>
                <div className="w-[120%] h-[1px] bg-[#C8102E] absolute transform -rotate-45"></div>
              </div>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMobileMenu}
              className="p-2 hover:bg-black/10 rounded-full transition-colors lg:hidden ml-1"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-white shadow-xl border-t border-gray-200 py-4 flex flex-col z-50">
          <NavLink
            to="/"
            onClick={toggleMobileMenu}
            className={({ isActive }) => `px-6 py-3 font-semibold ${isActive ? 'text-[#A32924] bg-red-50 border-l-4 border-[#A32924]' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            Home
          </NavLink>

          <NavLink
            to="/about"
            onClick={toggleMobileMenu}
            className={({ isActive }) => `px-6 py-3 font-semibold border-b border-gray-100 ${isActive ? 'text-[#A32924] bg-red-50 border-l-4 border-[#A32924]' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            About Us
          </NavLink>
          <NavLink
            to="/admissions"
            onClick={toggleMobileMenu}
            className={({ isActive }) => `px-6 py-3 font-semibold border-b border-gray-100 ${isActive ? 'text-[#A32924] bg-red-50 border-l-4 border-[#A32924]' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            Admissions
          </NavLink>
          <NavLink
            to="/programs"
            onClick={toggleMobileMenu}
            className={({ isActive }) => `px-6 py-3 font-semibold border-b border-gray-100 ${isActive ? 'text-[#A32924] bg-red-50 border-l-4 border-[#A32924]' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            Programs
          </NavLink>
          <NavLink
            to="/news"
            onClick={toggleMobileMenu}
            className={({ isActive }) => `px-6 py-3 font-semibold border-b border-gray-100 ${isActive ? 'text-[#A32924] bg-red-50 border-l-4 border-[#A32924]' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            News
          </NavLink>

          <NavLink
            to="/contact"
            onClick={toggleMobileMenu}
            className={({ isActive }) => `px-6 py-3 font-semibold border-b border-gray-100 ${isActive ? 'text-[#A32924] bg-red-50 border-l-4 border-[#A32924]' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            Contact Us
          </NavLink>
          <NavLink
            to="/careers"
            onClick={toggleMobileMenu}
            className={({ isActive }) => `px-6 py-3 font-semibold border-b border-gray-100 ${isActive ? 'text-[#A32924] bg-red-50 border-l-4 border-[#A32924]' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            Careers
          </NavLink>

          {/* Mobile Action Icons */}
          <div className="px-6 py-4 flex items-center gap-4 border-t border-gray-100 mt-2 sm:hidden">
            <button className="flex items-center gap-2 text-gray-700 font-semibold bg-gray-100 px-4 py-2 rounded-lg">
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
            <button className="flex items-center gap-2 text-gray-700 font-semibold bg-gray-100 px-4 py-2 rounded-lg">
              <Sun className="w-4 h-4" />
              <span>Theme</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
