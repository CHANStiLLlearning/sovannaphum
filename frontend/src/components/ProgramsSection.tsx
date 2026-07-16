

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Globe, MessageSquare, Languages } from 'lucide-react';
import { API_BASE_URL } from '../config';

type BackendProgram = {
  id: number;
  title: string;
  description: string;
  path: string;
  iconName: string;
  colorClass: string;
};

const ProgramsSection = () => {
  const [programs, setPrograms] = useState<BackendProgram[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/programs`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch programs');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setPrograms(data);
        }
      })
      .catch(err => {
        console.warn('Failed to fetch programs:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const resolveIcon = (name: string) => {
    switch (name) {
      case 'globe':
        return Globe;
      case 'message-square':
        return MessageSquare;
      case 'languages':
        return Languages;
      case 'book-open':
      default:
        return BookOpen;
    }
  };

  const getThemeClasses = (colorClass: string) => {
    if (colorClass.includes('blue')) return 'text-blue-600 group-hover:bg-blue-600';
    if (colorClass.includes('amber')) return 'text-[#EBA525] group-hover:bg-[#EBA525]';
    if (colorClass.includes('emerald')) return 'text-emerald-600 group-hover:bg-emerald-600';
    if (colorClass.includes('red')) return 'text-[#9A2220] group-hover:bg-[#9A2220]';
    if (colorClass.includes('violet')) return 'text-violet-600 group-hover:bg-violet-600';
    if (colorClass.includes('rose')) return 'text-rose-600 group-hover:bg-rose-600';
    return 'text-[#9A2220] group-hover:bg-[#9A2220]'; // Default fallback
  };

  return (
    <section className="py-20 bg-gray-50/40 border-y border-gray-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-serif text-[#9A2220]">
            Explore Our Programs
          </h2>
          <div className="w-16 h-1 bg-[#EBA525] mx-auto rounded-full mt-3"></div>
          <p className="max-w-2xl mx-auto mt-5 text-gray-500 text-sm md:text-[15px] font-sans leading-relaxed">
            Choose from a wide variety of academic programs tailored to foster intellectual growth, cultural appreciation, and global readiness.
          </p>
        </div>

        {/* Programs Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-4 border-[#9A2220] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : programs.length === 0 ? (
          <div className="text-center py-12 text-gray-500 font-medium bg-white rounded-2xl border border-gray-100 shadow-sm max-w-5xl mx-auto">
            No academic programs have been added yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {programs.map((program, index) => {
            const IconComponent = resolveIcon(program.iconName);
            const themeClasses = getThemeClasses(program.colorClass);
            
            return (
              <Link 
                key={index} 
                to={program.path}
                className="bg-white rounded-2xl p-8 flex flex-col justify-between shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group overflow-hidden relative text-left"
              >
                {/* Subtle hover gradient decoration */}
                <div className="absolute -right-20 -top-20 w-40 h-40 bg-gray-50 rounded-full group-hover:scale-150 transition-transform duration-700 ease-out z-0"></div>
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center ${themeClasses} group-hover:text-white transition-colors duration-300 shadow-sm`}>
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-[#EBA525] group-hover:text-[#EBA525] group-hover:bg-yellow-50 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-[#9A2220] transition-colors">{program.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {program.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
        )}
      </div>
    </section>
  );
};

export default ProgramsSection;
