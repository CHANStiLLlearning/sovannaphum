

import { Link } from 'react-router-dom';
import { BookOpen, Globe, MessageSquare, Languages, ChevronRight } from 'lucide-react';

const programs = [
  {
    title: 'Khmer General Education',
    description: 'A comprehensive national curriculum recognized by the Ministry of Education, Youth and Sport.',
    path: '/programs/kge',
    icon: BookOpen,
    color: 'bg-blue-50/70 text-blue-600 border border-blue-100/50',
  },
  {
    title: 'Integrated English Program (IEP)',
    description: 'An advanced dual-curriculum blending Cambodian national standards with international English proficiency.',
    path: '/programs/iep',
    icon: Globe,
    color: 'bg-amber-50/70 text-amber-500 border border-amber-100/50',
  },
  {
    title: 'General English Program (GEP)',
    description: 'Dedicated English language instruction focused on listening, speaking, reading, and writing skills.',
    path: '/programs/gep',
    icon: MessageSquare,
    color: 'bg-emerald-50/70 text-emerald-600 border border-emerald-100/50',
  },
  {
    title: 'Chinese Language Program',
    description: 'Standardized Chinese language courses equipping students for international opportunities.',
    path: '/programs/chinese',
    icon: Languages,
    color: 'bg-red-50/70 text-[#9A2220] border border-red-100/50',
  },
];

const ProgramsSection = () => {
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {programs.map((program, index) => {
            const IconComponent = program.icon;
            return (
              <Link
                key={index}
                to={program.path}
                className="relative bg-white rounded-2xl p-8 md:p-10 border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_-5px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 group flex flex-col items-start text-left cursor-pointer"
              >
                {/* Decorative background shape in top right corner */}
                <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden rounded-tr-2xl pointer-events-none">
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-gray-50 rounded-full transition-all duration-300 group-hover:bg-[#9A2220]/5 group-hover:scale-110"></div>
                </div>

                {/* Arrow Icon in Top Right */}
                <div className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-[#9A2220] group-hover:border-[#9A2220]/30 transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.02)] z-10">
                  <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </div>

                {/* Program Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${program.color} mb-6 transition-transform duration-300 group-hover:scale-105`}>
                  <IconComponent className="w-6 h-6" />
                </div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-bold font-serif text-gray-800 mb-3 group-hover:text-[#9A2220] transition-colors leading-tight">
                  {program.title}
                </h3>

                {/* Description */}
                <p className="text-gray-500 text-sm md:text-[14px] leading-relaxed font-sans pr-4">
                  {program.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;
