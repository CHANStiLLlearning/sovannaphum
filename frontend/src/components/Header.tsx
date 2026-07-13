import { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';

const Header = () => {
  const logo = "/images/logo.png"
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/news?search=${encodeURIComponent(searchQuery.trim())}`);
    setIsSearchOpen(false);
  };

  return (
    <header className="w-full bg-white text-black shadow-md sticky top-0 z-50 relative">
      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <form
          onSubmit={handleSearchSubmit}
          className="absolute inset-0 bg-[#BD0B32] px-4 flex items-center justify-between z-50 lg:hidden"
        >
          <div className="flex-1 max-w-2xl mx-auto flex items-center gap-2 bg-white text-black px-3 py-2 rounded-lg shadow-inner">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-black outline-none bg-transparent text-sm sm:text-base"
              autoFocus
            />
          </div>
          <button
            type="button"
            onClick={() => setIsSearchOpen(false)}
            className="p-2 hover:bg-black/10 rounded-full transition-colors ml-2"
            aria-label="Close search"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </form>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo Section */}
          <NavLink to="/" className="flex items-center gap-3 cursor-pointer">
            {/* Logo Emblem Placeholder */}
            <img src={logo} alt="Khmer America School" className="w-25 h-16" />
            <h1 className="text-xl font-bold">
              <span className="">AMERICA SCHOOL</span>
            </h1>
          </NavLink>

          {/* Navigation Desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            <NavLink
              to="/"
              className={({ isActive }) => `px-4 py-2 text-[15px] font-semibold transition-all border-b-2 ${isActive ? 'border-white text-black' : 'border-transparent text-black/90 hover:text-black hover:border-black/30'}`}
            >
              Home
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) => `px-4 py-2 text-[15px] font-semibold transition-all border-b-2 ${isActive ? 'border-white text-black' : 'border-transparent text-black/90 hover:text-black hover:border-black/30'}`}
            >
              About Us
            </NavLink>
            <NavLink
              to="/admissions"
              className={({ isActive }) => `px-4 py-2 text-[15px] font-semibold transition-all border-b-2 ${isActive ? 'border-white text-black' : 'border-transparent text-black/90 hover:text-black hover:border-black/30'}`}
            >
              Admissions
            </NavLink>
            <NavLink
              to="/programs"
              className={({ isActive }) => `px-4 py-2 text-[15px] font-semibold transition-all border-b-2 ${isActive ? 'border-white text-black' : 'border-transparent text-black/90 hover:text-black hover:border-black/30'}`}
            >
              Programs
            </NavLink>
            <NavLink
              to="/news"
              className={({ isActive }) => `px-4 py-2 text-[15px] font-semibold transition-all border-b-2 ${isActive ? 'border-white text-black' : 'border-transparent text-black/90 hover:text-black hover:border-black/30'}`}
            >
              News
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) => `px-4 py-2 text-[15px] font-semibold transition-all border-b-2 ${isActive ? 'border-white text-black' : 'border-transparent text-black/90 hover:text-black hover:border-black/30'}`}
            >
              Contact Us
            </NavLink>
            <NavLink
              to="/eventpage"
              className={({ isActive }) => `px-4 py-2 text-[15px] font-semibold transition-all border-b-2 ${isActive ? 'border-white text-black' : 'border-transparent text-black/90 hover:text-black hover:border-black/30'}`}
            >
              Events
            </NavLink>
          </nav>
        
          {/* Action Icons */}
          <div className="flex items-center gap-2">
            {/* Desktop Search Bar (visible on lg and up) */}
            <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center gap-2 text-black px-3 py-1.5 rounded-lg shadow-inner">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-black outline-none bg-transparent w-36 focus:w-48 transition-all duration-300 text-sm"
              />
              <button type="submit" className="text-gray-500 hover:text-[#BD0B32] transition-colors" aria-label="Submit search">
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Mobile Search Button (visible under lg) */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="lg:hidden p-2 hover:bg-black/10 rounded-full transition-colors"
              aria-label="Open search overlay"
            >
              <Search className="w-5 h-5 text-black" />
            </button>

            {/* Mobile Menu Toggle (visible under lg) */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 hover:bg-black/10 rounded-full transition-colors ml-1"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6 text-black" /> : <Menu className="w-6 h-6 text-black" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-white shadow-xl border-t border-gray-200 py-4 flex flex-col z-50">
          {/* Mobile Search inside Drawer */}
          <form onSubmit={handleSearchSubmit} className="px-6 py-2 mb-2">
            <div className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none flex-grow text-sm text-gray-800"
              />
              <button type="submit" className="hidden" />
            </div>
          </form>

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
            to="/eventpage"
            onClick={toggleMobileMenu}
            className={({ isActive }) => `px-6 py-3 font-semibold border-b border-gray-100 ${isActive ? 'text-[#A32924] bg-red-50 border-l-4 border-[#A32924]' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            Events
          </NavLink>
        </div>
      )}
    </header>
  );
};

export default Header;
