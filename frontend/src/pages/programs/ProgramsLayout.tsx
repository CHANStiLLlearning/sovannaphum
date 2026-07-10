import { Outlet, Link, useLocation } from 'react-router-dom';

const ProgramsLayout = () => {
  const location = useLocation();
  
  // Format the current path for the breadcrumb
  const pathParts = location.pathname.split('/').filter(Boolean);
  const isIndex = pathParts.length === 1;

  return (
    <div className="w-full bg-white flex flex-col min-h-screen">
      {/* Shared Hero Banner */}
      <section className="relative w-full h-[400px] bg-gray-900 flex items-center justify-center">
        <div className="absolute inset-0 w-full h-full">
          <img 
            src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=1920" 
            alt="Academic Programs" 
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="relative z-10 text-center px-4 w-full">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Academic Programs</h1>
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
