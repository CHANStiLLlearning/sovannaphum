import classroomIcon from '../../assets/icons/Classroom management.svg';
import examIcon from '../../assets/icons/Exam.svg';
import paymentIcon from '../../assets/icons/Payment.svg';
import settingIcon from '../../assets/icons/Setting.svg';
import studentRegiIcon from '../../assets/icons/Student Regi.svg';

const features = [
  {
    title: 'Classroom Management',
    icon: classroomIcon,
    description: 'Nurturing student interaction and positive behaviors to create a highly collaborative classroom learning environment.',
    bgColor: 'bg-blue-500/10 text-blue-600 border-blue-100'
  },
  {
    title: 'Exam & Assessments',
    icon: examIcon,
    description: 'Comprehensive testing and tracking systems to measure academic milestones and ensure success for every student.',
    bgColor: 'bg-amber-500/10 text-amber-600 border-amber-100'
  },
  {
    title: 'Flexible Payments',
    icon: paymentIcon,
    description: 'Providing modern, secure, and hassle-free payment structures for convenient tuitions and school services.',
    bgColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-100'
  },
  {
    title: 'Student Registration',
    icon: studentRegiIcon,
    description: 'Seamless online enrollment, registration, and documentation designed to make school onboarding easy for parents.',
    bgColor: 'bg-[#9A2220]/10 text-[#9A2220] border-[#9A2220]/20'
  },
  {
    title: 'Advanced Settings',
    icon: settingIcon,
    description: 'Tailored school rules, configurations, and state-of-the-art facilities adapted to individual student needs.',
    bgColor: 'bg-purple-500/10 text-purple-600 border-purple-100'
  }
];

const KeyFeatures = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#9A2220] mb-4">Our Key School Features</h2>
          <div className="w-24 h-1 bg-[#EBA525] mx-auto rounded-full"></div>
          <p className="mt-6 text-gray-600 max-w-2xl mx-auto text-lg">
            We provide a highly structured, modern, and student-focused environment to maximize academic achievement.
          </p>
        </div>

        {/* Features Layout (Centering the 5 cards cleanly) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center items-stretch">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`bg-gray-50/50 rounded-3xl p-8 border border-gray-100 hover:border-transparent hover:bg-white shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group ${
                index === 4 ? 'md:col-span-2 lg:col-span-1 md:max-w-md md:mx-auto lg:max-w-none' : ''
              }`}
            >
              <div className={`w-16 h-16 rounded-2xl ${feature.bgColor} border flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
                <img src={feature.icon} className="w-9 h-9 object-contain" alt="" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#9A2220] transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 text-sm leading-relaxed flex-grow">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default KeyFeatures;
