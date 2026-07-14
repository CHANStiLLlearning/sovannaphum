import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Newspaper, Calendar, Mail, Users, LogOut, GraduationCap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" />, exact: true },
    { name: 'News Articles', path: '/admin/news', icon: <Newspaper className="w-5 h-5" /> },
    { name: 'Events', path: '/admin/events', icon: <Calendar className="w-5 h-5" /> },
    { name: 'Faculty', path: '/admin/faculty', icon: <GraduationCap className="w-5 h-5" /> },
    { name: 'Contact Messages', path: '/admin/contacts', icon: <Mail className="w-5 h-5" /> },
    { name: 'Subscribers', path: '/admin/subscribers', icon: <Users className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#1D055F] text-white flex flex-col shadow-xl z-10">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <img src="/images/logo.png" alt="SPS Logo" className="w-12 h-12 rounded-lg p-1 object-contain shadow-inner" />
          <div>
            <h2 className="text-xl font-bold tracking-tight">SPS Admin</h2>
            <p className="text-xs text-white/70 mt-0.5">Management Dashboard</p>
          </div>
        </div>

        <nav className="flex-1 py-4 px-3 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.exact}
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
          <NavLink to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:bg-white/10 hover:text-white transition-all duration-200 font-medium w-full">
            Back to Website
          </NavLink>
          <button 
            onClick={() => {
              logout();
              navigate('/admin/login');
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
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-50 -z-10"></div>
        <div className="p-6 md:p-10 flex-1">
          <Outlet />
        </div>
      </main>

    </div>
  );
};

export default AdminLayout;
