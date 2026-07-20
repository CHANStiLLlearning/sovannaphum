import { useState } from 'react';
import { Search, Menu, X, ChevronDown } from 'lucide-react';
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
    <header className="w-full bg-white text-black shadow-md sticky top-0 z-50">
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
              <span className="">សាលាខ្មែរ-អាមេរិកកាំង</span>
              <p className="text-sm text-gray-500">Khmer America School </p> 
            </h1>
          </NavLink>

          {/* Navigation Desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `px-4 py-2 text-[15px] font-semibold transition-all border-b-2 ${isActive ? 'border-[#2563EB] text-[#2563EB]' : 'border-transparent text-gray-700 hover:text-[#2563EB] hover:border-[#2563EB]/30'}`}
            >
              Home
            </NavLink>
             <NavLink
              to="/eventpage"
              className={({ isActive }) => `px-4 py-2 text-[15px] font-semibold transition-all border-b-2 ${isActive ? 'border-[#2563EB] text-[#2563EB]' : 'border-transparent text-gray-700 hover:text-[#2563EB] hover:border-[#2563EB]/30'}`}
            >
              Events
            </NavLink>

            <NavLink
              to="/news"
              className={({ isActive }) => `px-4 py-2 text-[15px] font-semibold transition-all border-b-2 ${isActive ? 'border-[#2563EB] text-[#2563EB]' : 'border-transparent text-gray-700 hover:text-[#2563EB] hover:border-[#2563EB]/30'}`}
            >
              News
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) => `px-4 py-2 text-[15px] font-semibold transition-all border-b-2 ${isActive ? 'border-[#2563EB] text-[#2563EB]' : 'border-transparent text-gray-700 hover:text-[#2563EB] hover:border-[#2563EB]/30'}`}
            >
              Contact Us
            </NavLink>
           {/* [] */}
             <div className="relative group flex items-center py-2">
              <NavLink
                to="/about"
                className={({ isActive }) => `px-4 py-2 text-[15px] font-semibold transition-all border-b-2 flex items-center gap-1 ${isActive ? 'border-[#2563EB] text-[#2563EB]' : 'border-transparent text-gray-700 hover:text-[#2563EB] hover:border-[#2563EB]/30'}`}
              >
                About Us
                <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180 opacity-70" />
              </NavLink>
              
              {/* Dropdown Menu */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full w-52 bg-white border border-gray-100 rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
                <NavLink
                  to="/about/core-values"
                  className="block px-4 py-2.5 text-sm text-gray-700 hover:text-[#1E3A8A] hover:bg-gray-50 transition-colors font-medium border-l-4 border-transparent hover:border-[#1E3A8A]"
                >
                  Core Values
                </NavLink>
                <NavLink
                  to="/faculty"
                  className="block px-4 py-2.5 text-sm text-gray-700 hover:text-[#1E3A8A] hover:bg-gray-50 transition-colors font-medium border-l-4 border-transparent hover:border-[#1E3A8A]"
                >
                  Faculty
                </NavLink>
              </div>
            </div>
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
            end
            onClick={toggleMobileMenu}
            className={({ isActive }) => `px-6 py-3 font-semibold ${isActive ? 'text-[#2563EB] bg-blue-50 border-l-4 border-[#2563EB]' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            Home
          </NavLink>

          <NavLink
            to="/about"
            onClick={toggleMobileMenu}
            className={({ isActive }) => `px-6 py-3 font-semibold border-b border-gray-100 ${isActive ? 'text-[#2563EB] bg-blue-50 border-l-4 border-[#2563EB]' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            About Us
          </NavLink>

          <NavLink
            to="/about/core-values"
            onClick={toggleMobileMenu}
            className={({ isActive }) => `pl-12 pr-6 py-2.5 text-[15px] font-semibold border-b border-gray-100 flex items-center gap-1.5 ${isActive ? 'text-[#2563EB] bg-blue-50/30' : 'text-gray-500 hover:text-black hover:bg-gray-50/50'} transition-colors`}
          >
            <span className="text-gray-300 font-normal">└</span> Core Values
          </NavLink>
          <NavLink
            to="/faculty"
            onClick={toggleMobileMenu}
            className={({ isActive }) => `pl-12 pr-6 py-2.5 text-[15px] font-semibold border-b border-gray-100 flex items-center gap-1.5 ${isActive ? 'text-[#2563EB] bg-blue-50/30' : 'text-gray-500 hover:text-black hover:bg-gray-50/50'} transition-colors`}
          >
            <span className="text-gray-300 font-normal">└</span> Faculty
          </NavLink>

          <NavLink
            to="/news"
            onClick={toggleMobileMenu}
            className={({ isActive }) => `px-6 py-3 font-semibold border-b border-gray-100 ${isActive ? 'text-[#2563EB] bg-blue-50 border-l-4 border-[#2563EB]' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            News
          </NavLink>

          <NavLink
            to="/contact"
            onClick={toggleMobileMenu}
            className={({ isActive }) => `px-6 py-3 font-semibold border-b border-gray-100 ${isActive ? 'text-[#2563EB] bg-blue-50 border-l-4 border-[#2563EB]' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            Contact Us
          </NavLink>
          <NavLink
            to="/eventpage"
            onClick={toggleMobileMenu}
            className={({ isActive }) => `px-6 py-3 font-semibold border-b border-gray-100 ${isActive ? 'text-[#2563EB] bg-blue-50 border-l-4 border-[#2563EB]' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            Events
          </NavLink>
        </div>
      )}
    </header>
  );
};

export default Header;
