

import { Link } from 'react-router-dom';

const programs = [
  {
    title: 'Khmer General Education',
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800',
    description: 'Providing a strong foundation in Khmer curriculum from Kindergarten to Grade 12.',
    path: '/programs/kge',
  },
  {
    title: 'Integrated English Program (IEP)',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800',
    description: 'A comprehensive English program designed to build fluency and confidence.',
    path: '/programs/iep',
  },
  {
    title: 'General English Program',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800',
    description: 'Full-time and part-time classes for students of all levels to master English.',
    path: '/programs/gep',
  },
  {
    title: 'Chinese Language Program',
    image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&q=80&w=800',
    description: 'Part-time Chinese classes to prepare students for a globalized world.',
    path: '/programs/chinese',
  },
];

const ProgramsSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#9A2220] mb-4">Our Programs</h2>
          <div className="w-24 h-1 bg-[#EBA525] mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {programs.map((program, index) => (
            <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={program.image} 
                  alt={program.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{program.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{program.description}</p>
                <Link 
                  to={program.path}
                  className="text-[#9A2220] font-semibold flex items-center hover:text-[#D76918] transition-colors cursor-pointer"
                >
                  Read More
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;
