import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Globe, Languages, MessageSquare } from 'lucide-react';
import { API_BASE_URL } from '../../config';

const ProgramsIndex = () => {
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
                  className="bg-white rounded-2xl p-8 flex flex-col justify-between shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group overflow-hidden relative"
                >
                  <div className="absolute -right-20 -top-20 w-40 h-40 bg-gray-50 rounded-full group-hover:scale-150 transition-transform duration-700 ease-out z-0"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div className={`w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center ${theme.text} ${theme.hoverBg} group-hover:text-white transition-colors duration-300 shadow-sm`}>
                        {resolveIcon(program.iconName)}
                      </div>
                      <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-[#EBA525] group-hover:text-[#EBA525] group-hover:bg-yellow-50 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-[#1E3A8A] transition-colors">{program.title}</h3>
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
    </div>
  );
};

export default ProgramsIndex;
