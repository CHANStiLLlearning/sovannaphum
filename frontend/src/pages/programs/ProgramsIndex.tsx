import { Link } from 'react-router-dom';
import { BookOpen, Globe2, Languages, MessageSquare } from 'lucide-react';

const ProgramsIndex = () => {
  const programs = [
    {
      title: 'Khmer General Education',
      icon: <BookOpen className="w-8 h-8" />,
      path: '/programs/kge',
      description: 'A comprehensive national curriculum recognized by the Ministry of Education, Youth and Sport.',
      color: 'text-blue-600',
      bgHover: 'group-hover:bg-blue-600',
    },
    {
      title: 'Integrated English Program (IEP)',
      icon: <Globe2 className="w-8 h-8" />,
      path: '/programs/iep',
      description: 'An advanced dual-curriculum blending Cambodian national standards with international English proficiency.',
      color: 'text-[#EBA525]',
      bgHover: 'group-hover:bg-[#EBA525]',
    },
    {
      title: 'General English Program (GEP)',
      icon: <MessageSquare className="w-8 h-8" />,
      path: '/programs/gep',
      description: 'Dedicated English language instruction focused on listening, speaking, reading, and writing skills.',
      color: 'text-emerald-600',
      bgHover: 'group-hover:bg-emerald-600',
    },
    {
      title: 'Chinese Language Program',
      icon: <Languages className="w-8 h-8" />,
      path: '/programs/chinese',
      description: 'Standardized Chinese language courses equipping students for international opportunities.',
      color: 'text-[#9A2220]',
      bgHover: 'group-hover:bg-[#9A2220]',
    },
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#9A2220] mb-4">Explore Our Programs</h2>
          <div className="w-24 h-1 bg-[#EBA525] mx-auto rounded-full"></div>
          <p className="mt-6 text-gray-600 max-w-2xl mx-auto text-lg">
            Choose from a wide variety of academic programs tailored to foster intellectual growth, cultural appreciation, and global readiness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {programs.map((program, index) => (
            <Link 
              key={index} 
              to={program.path}
              className="bg-white rounded-2xl p-8 flex flex-col justify-between shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group overflow-hidden relative"
            >
              {/* Subtle hover gradient decoration */}
              <div className="absolute -right-20 -top-20 w-40 h-40 bg-gray-50 rounded-full group-hover:scale-150 transition-transform duration-700 ease-out z-0"></div>
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center ${program.color} ${program.bgHover} group-hover:text-white transition-colors duration-300 shadow-sm`}>
                    {program.icon}
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgramsIndex;
