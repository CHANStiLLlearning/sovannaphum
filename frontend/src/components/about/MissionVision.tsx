import { Target, Eye } from 'lucide-react';

const MissionVision = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Mission Card */}
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12 border-t-8 border-[#9A2220] shadow-md hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-[#9A2220]/10 flex items-center justify-center">
                <Target className="w-8 h-8 text-[#9A2220]" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800">Our Mission</h2>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed">
              To provide our students with the highest quality of education, combining international academic standards with rich Cambodian cultural values. We aim to nurture young minds to become innovative thinkers and responsible global citizens.
            </p>
          </div>
          
          {/* Vision Card */}
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12 border-t-8 border-[#EBA525] shadow-md hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-[#EBA525]/10 flex items-center justify-center">
                <Eye className="w-8 h-8 text-[#EBA525]" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800">Our Vision</h2>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed">
              To be the leading educational institution in Cambodia that is recognized internationally for academic excellence, character development, and equipping students with the essential skills to thrive in the 21st century.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default MissionVision;
