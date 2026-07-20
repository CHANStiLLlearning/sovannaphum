import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { settingsService } from '../../services/settingsService';

const ProgramsLayout = () => {
  const location = useLocation();
  
  // Format the current path for the breadcrumb
  const pathParts = location.pathname.split('/').filter(Boolean);
  const isIndex = pathParts.length === 1;

  const [settings, setSettings] = useState({
    program_hero_title: 'Academic Programs',
    program_hero_image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=1920',
  });

  useEffect(() => {
    settingsService.get()
      .then(data => {
        setSettings({
          program_hero_title: data.program_hero_title || 'Academic Programs',
          program_hero_image: data.program_hero_image || 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=1920',
        });
      })
      .catch(() => {});
  }, []);

  return (
    <div className="w-full bg-white flex flex-col min-h-screen">
      {/* Shared Hero Banner */}
      <section className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <img 
            src={settings.program_hero_image}
            alt="Academic Programs" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="relative z-10 text-center px-4 w-full">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{settings.program_hero_title}</h1>
          <div className="flex items-center justify-center gap-2 text-white/80 font-medium">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/programs" className={`${isIndex ? 'text-[#EBA525]' : 'hover:text-white transition-colors'}`}>
              Programs
            </Link>
            {!isIndex && (
              <>
                <span>/</span>
                <span className="text-[#EBA525] capitalize">
                  {pathParts[1].replace('-', ' ')}
                </span>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Area (Rendered by nested routes) */}
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export default ProgramsLayout;
