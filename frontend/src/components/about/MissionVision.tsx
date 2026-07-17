import { useState, useEffect } from 'react';
import { Target, Eye } from 'lucide-react';
import { API_BASE_URL } from '../../config';

const MissionVision = () => {
  const [settings, setSettings] = useState({
    about_mission_title: 'Our Mission',
    about_mission_desc: 'To provide our students with the highest quality of education, combining international academic standards with rich Cambodian cultural values. We aim to nurture young minds to become innovative thinkers and responsible global citizens.',
    about_vision_title: 'Our Vision',
    about_vision_desc: 'To be the leading educational institution in Cambodia that is recognized internationally for academic excellence, character development, and equipping students with the essential skills to thrive in the 21st century.',
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/settings`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch settings');
        return res.json();
      })
      .then(data => {
        setSettings({
          about_mission_title: data.about_mission_title || settings.about_mission_title,
          about_mission_desc: data.about_mission_desc || settings.about_mission_desc,
          about_vision_title: data.about_vision_title || settings.about_vision_title,
          about_vision_desc: data.about_vision_desc || settings.about_vision_desc,
        });
      })
      .catch(err => {
        console.warn('Fallback to local Mission/Vision text:', err);
      });
  }, []);

  return (
    <section id="mission-vision" className="py-16 bg-white scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Mission Card */}
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12 border-t-8 border-[#1E3A8A] shadow-md hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-[#1E3A8A]/10 flex items-center justify-center">
                <Target className="w-8 h-8 text-[#1E3A8A]" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800">{settings.about_mission_title}</h2>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-line">
              {settings.about_mission_desc}
            </p>
          </div>
          
          {/* Vision Card */}
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12 border-t-8 border-[#EBA525] shadow-md hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-[#EBA525]/10 flex items-center justify-center">
                <Eye className="w-8 h-8 text-[#EBA525]" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800">{settings.about_vision_title}</h2>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-line">
              {settings.about_vision_desc}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default MissionVision;
