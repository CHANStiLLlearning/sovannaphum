import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Globe, Languages, MessageSquare } from 'lucide-react';
import { API_BASE_URL } from '../../config';
import { useSEO } from '../../hooks/useSEO';

const ProgramsIndex = () => {
  useSEO('programs');
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/programs`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPrograms(data);
        }
      })
      .catch(err => console.error('Failed to fetch programs:', err))
      .finally(() => setLoading(false));
  }, []);

  const resolveIcon = (name: string, classes = "w-8 h-8") => {
    switch (name) {
      case 'globe': return <Globe className={classes} />;
      case 'message-square': return <MessageSquare className={classes} />;
      case 'languages': return <Languages className={classes} />;
      case 'book-open':
      default: return <BookOpen className={classes} />;
    }
  };

  const getThemeClasses = (colorClass: string) => {
    if (colorClass.includes('emerald')) return { text: 'text-emerald-600', hoverBg: 'group-hover:bg-emerald-600' };
    if (colorClass.includes('amber') || colorClass.includes('yellow')) return { text: 'text-[#EBA525]', hoverBg: 'group-hover:bg-[#EBA525]' };
    if (colorClass.includes('red') || colorClass.includes('#1E3A8A')) return { text: 'text-[#1E3A8A]', hoverBg: 'group-hover:bg-[#1E3A8A]' };
    return { text: 'text-blue-600', hoverBg: 'group-hover:bg-blue-600' };
  };

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#1E3A8A] mb-4">Explore Our Programs</h2>
          <div className="w-24 h-1 bg-[#EBA525] mx-auto rounded-full"></div>
          <p className="mt-6 text-gray-600 max-w-2xl mx-auto text-lg">
            Choose from a wide variety of academic programs tailored to foster intellectual growth, cultural appreciation, and global readiness.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-4 border-[#1E3A8A] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : programs.length === 0 ? (
          <div className="text-center py-12 text-gray-500 font-medium bg-white rounded-2xl border border-gray-100 shadow-sm">
            No academic programs have been added yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {programs.map((program: any) => {
              const theme = getThemeClasses(program.colorClass || '');
              return (
                <Link 
                  key={program.id} 
                  to={program.path || '#'}
                  className="bg-white rounded-3xl overflow-hidden flex flex-col shadow-sm border border-gray-150/60 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group relative font-sans"
                >
                  {/* Card Image Banner */}
                  <div className="h-48 w-full bg-gray-100 relative overflow-hidden shrink-0">
                    {program.image ? (
                      <img 
                        src={program.image} 
                        alt={program.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100/50`}>
                        <div className={`w-16 h-16 rounded-2xl bg-white flex items-center justify-center ${theme.text} shadow-sm border border-gray-100`}>
                          {resolveIcon(program.iconName, "w-8 h-8")}
                        </div>
                      </div>
                    )}
                    {/* Floating badge for icon if image exists */}
                    {program.image && (
                      <div className={`absolute bottom-4 left-6 w-12 h-12 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center ${theme.text} shadow-md border border-white/20`}>
                        {resolveIcon(program.iconName, "w-6 h-6")}
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Meta stats badges */}
                      <div className="flex gap-2.5 mb-4 flex-wrap">
                        <span className="text-[10px] uppercase font-bold tracking-wider bg-blue-50/80 text-[#1E3A8A] border border-blue-100/60 px-3 py-1 rounded-full">
                          Age: {program.ageRange || '3 - 18 Years'}
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-wider bg-amber-50/80 text-amber-700 border border-amber-100/60 px-3 py-1 rounded-full">
                          Grades: {program.gradeLevel || 'Nursery - Grade 12'}
                        </span>
                      </div>

                      <h3 className="text-xl font-black text-gray-800 mb-3 group-hover:text-[#1E3A8A] transition-colors line-clamp-1">
                        {program.title}
                      </h3>
                      
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                        {program.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 text-sm font-bold text-[#1E3A8A] mt-6 group-hover:translate-x-1 transition-transform duration-300">
                      Learn Program Details
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgramsIndex;
