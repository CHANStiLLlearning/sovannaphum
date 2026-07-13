import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const ChineseLanguage = () => {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link 
          to="/programs" 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-[#9A2220] mb-6 font-bold transition-all hover:-translate-x-1 group text-sm"
        >
          <ChevronLeft className="w-5 h-5" /> Back to Programs
        </Link>
        <h2 className="text-3xl font-bold text-[#9A2220] mb-6">Chinese Language Program</h2>
        <div className="prose prose-lg text-gray-600 max-w-none">
          <p>
            Recognizing the growing importance of Mandarin Chinese in the global economy, Khmer America School offers a comprehensive Chinese Language Program. This program is designed to take students from foundational pinyin and basic characters to advanced conversational and written fluency.
          </p>
          <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Program Features</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Structured levels aligning with standard HSK proficiency exams.</li>
            <li>Instruction by experienced, native-level Chinese educators.</li>
            <li>Focus on practical communication, cultural nuances, and business vocabulary.</li>
            <li>Cultural immersion activities, including calligraphy and traditional festivals.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChineseLanguage;
