import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const KhmerGeneralEducation = () => {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link 
          to="/programs" 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-[#9A2220] mb-6 font-bold transition-all hover:-translate-x-1 group text-sm"
        >
          <ChevronLeft className="w-5 h-5" /> Back to Programs
        </Link>
        <h2 className="text-3xl font-bold text-[#9A2220] mb-6">Khmer General Education</h2>
        <div className="prose prose-lg text-gray-600 max-w-none">
          <p>
            Our Khmer General Education program strictly follows the curriculum set by the Ministry of Education, Youth and Sport (MoEYS) of Cambodia. It is designed to provide students with a strong foundation in national subjects, fostering a deep understanding of Cambodian culture, history, and values while ensuring academic excellence in core subjects like Mathematics, Science, and Khmer Literature.
          </p>
          <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Program Highlights</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Fully accredited by the Ministry of Education, Youth and Sport.</li>
            <li>Experienced and certified teachers dedicated to student success.</li>
            <li>Comprehensive coverage of all national syllabus requirements.</li>
            <li>Focus on critical thinking, problem-solving, and civic responsibility.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default KhmerGeneralEducation;
