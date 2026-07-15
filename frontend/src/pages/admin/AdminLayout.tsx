import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Newspaper, Calendar, Mail, Users, LogOut, GraduationCap, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" />, exact: true },
    { name: 'News Articles', path: '/admin/news', icon: <Newspaper className="w-5 h-5" /> },
    { name: 'Events', path: '/admin/events', icon: <Calendar className="w-5 h-5" /> },
    { name: 'Faculty', path: '/admin/faculty', icon: <GraduationCap className="w-5 h-5" /> },
    { name: 'Contact Messages', path: '/admin/contacts', icon: <Mail className="w-5 h-5" /> },
    { name: 'Subscribers', path: '/admin/subscribers', icon: <Users className="w-5 h-5" /> },
  ];

  const handleLinkClick = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row relative">
      
      {/* Mobile Top Header Bar */}
      <div className="flex md:hidden items-center justify-between bg-[#1D055F] text-white p-4 sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <img src="/images/logo.png" alt="SPS Logo" className="w-10 h-10 rounded-lg p-1 object-contain bg-white/10" />
          <div>
            <h2 className="text-lg font-bold tracking-tight">SPS Admin</h2>
            <p className="text-xs text-white/70">Management Panel</p>
          </div>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all"
          aria-label="Toggle Menu"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Backdrop overlay for Mobile Sidebar */}
      <div 
        onClick={() => setIsSidebarOpen(false)}
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 md:hidden ${
          isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Sidebar Container */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-[#1D055F] text-white flex flex-col shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:relative md:flex ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 border-b border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" alt="SPS Logo" className="w-12 h-12 rounded-lg p-1 object-contain shadow-inner" />
            <div>
              <h2 className="text-xl font-bold tracking-tight">SPS Admin</h2>
              <p className="text-xs text-white/70 mt-0.5">Management Dashboard</p>
            </div>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-1.5 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.exact}
              onClick={handleLinkClick}
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                  isActive 
                    ? 'bg-white text-[#9A2220] shadow-md' 
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 flex flex-col gap-2">
          <NavLink 
            to="/" 
            onClick={handleLinkClick}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:bg-white/10 hover:text-white transition-all duration-200 font-medium w-full text-center md:text-left justify-center md:justify-start"
          >
            Back to Website
          </NavLink>
          <button 
            onClick={() => {
              logout();
              setIsSidebarOpen(false);
              navigate('/kas-portal-entry');
            }} 
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-300 hover:bg-red-500/20 hover:text-red-100 transition-all duration-200 font-medium w-full text-left"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 flex flex-col relative min-h-screen">
        <div className="p-4 sm:p-6 md:p-10 flex-1">
          <Outlet />
        </div>
      </main>

    </div>
  );
};

export default AdminLayout;
