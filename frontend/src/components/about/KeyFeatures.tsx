import { Star } from 'lucide-react';

import classroomIcon from '../../assets/icons/classroom-management.svg';
import examIcon from '../../assets/icons/exam.svg';
import paymentIcon from '../../assets/icons/payment.svg';
import settingIcon from '../../assets/icons/setting.svg';
import studentRegiIcon from '../../assets/icons/student-regi.svg';

interface Feature {
  id: number;
  title: string;
  description: string;
  iconName: string;
  bgColor: string;
}

const iconMap: Record<string, string> = {
  'classroom-management': classroomIcon,
  'exam': examIcon,
  'payment': paymentIcon,
  'student-regi': studentRegiIcon,
  'setting': settingIcon
};

interface KeyFeaturesProps {
  features: Feature[];
  loading: boolean;
}

const KeyFeatures = ({ features, loading }: KeyFeaturesProps) => {

  if (loading) {
    return (
      <section id="key-features" className="py-20 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 flex flex-col items-center gap-3">
            <div className="h-9 bg-gray-200 rounded w-72 animate-pulse"></div>
            <div className="w-24 h-1 bg-[#EBA525] mx-auto rounded-full"></div>
            <div className="h-5 bg-gray-200 rounded w-96 mt-3 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="bg-gray-50 rounded-3xl p-8 border border-gray-100 flex flex-col gap-4 animate-pulse">
                <div className="w-16 h-16 rounded-2xl bg-gray-200"></div>
                <div className="h-6 bg-gray-200 rounded w-32"></div>
                <div className="space-y-2">
                  <div className="h-3.5 bg-gray-200 rounded w-full"></div>
                  <div className="h-3.5 bg-gray-200 rounded w-11/12"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (features.length === 0) return null;

  return (
    <section id="key-features" className="py-20 bg-white scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A8A] mb-4">Our Key School Features</h2>
          <div className="w-24 h-1 bg-[#EBA525] mx-auto rounded-full"></div>
          <p className="mt-6 text-gray-600 max-w-2xl mx-auto text-lg">
            We provide a highly structured, modern, and student-focused environment to maximize academic achievement.
          </p>
        </div>

        {/* Features Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center items-stretch">
          {features.map((feature) => {
            const iconSrc = iconMap[feature.iconName];
            return (
              <div 
                key={feature.id} 
                className={`bg-gray-50/50 rounded-3xl p-8 border border-gray-100 hover:border-transparent hover:bg-white shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group`}
              >
                <div className={`w-16 h-16 rounded-2xl ${feature.bgColor || 'bg-[#1E3A8A]/10 text-[#1E3A8A] border-[#1E3A8A]/20'} border flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
                  {iconSrc ? (
                    <img src={iconSrc} className="w-9 h-9 object-contain" alt="" />
                  ) : (
                    <Star className="w-8 h-8" />
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#1E3A8A] transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 text-sm leading-relaxed flex-grow">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default KeyFeatures;
