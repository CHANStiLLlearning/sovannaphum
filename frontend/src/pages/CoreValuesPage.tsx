import { HeartHandshake, Lightbulb, Users, Briefcase } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const coreValues = [
  {
    title: 'Ownership',
    icon: <Users className="w-10 h-10" />,
    description: 'We take responsibility for our actions and learning. We act like owners of our school community, fostering a sense of belonging and accountability.',
    color: 'bg-blue-600',
    hoverColor: 'group-hover:text-blue-600',
    borderColor: 'border-blue-100',
    shadowColor: 'hover:shadow-blue-500/10'
  },
  {
    title: 'Innovation',
    icon: <Lightbulb className="w-10 h-10" />,
    description: 'We embrace change and continuously seek new, creative ways to improve our teaching, learning, and operational processes.',
    color: 'bg-[#EBA525]',
    hoverColor: 'group-hover:text-[#EBA525]',
    borderColor: 'border-amber-100',
    shadowColor: 'hover:shadow-[#EBA525]/10'
  },
  {
    title: 'Respect',
    icon: <HeartHandshake className="w-10 h-10" />,
    description: 'We honor the dignity of every individual. We celebrate diversity and treat everyone with kindness, fairness, and understanding.',
    color: 'bg-green-600',
    hoverColor: 'group-hover:text-green-600',
    borderColor: 'border-green-100',
    shadowColor: 'hover:shadow-green-500/10'
  },
  {
    title: 'Professionalism',
    icon: <Briefcase className="w-10 h-10" />,
    description: 'We maintain high standards of integrity, ethical behavior, and dedication in everything we do, serving as role models for our students.',
    color: 'bg-[#1E3A8A]',
    hoverColor: 'group-hover:text-[#1E3A8A]',
    borderColor: 'border-blue-100',
    shadowColor: 'hover:shadow-[#1E3A8A]/10'
  }
];

const CoreValuesPage = () => {
  return (
    <div className="w-full bg-white flex flex-col min-h-screen">
      <Helmet>
        <title>Our Core Values - Khmer America School</title>
        <meta name="description" content="Discover the core values and pillars that guide our daily actions, decisions, and community at Khmer America School." />
      </Helmet>



      {/* Main Content Section */}
      <section className="py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Description */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A8A] mb-4">The Pillars of KAS</h2>
            <div className="w-24 h-1 bg-[#EBA525] mx-auto rounded-full"></div>
            <p className="mt-6 text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
              At Khmer America School, our daily interactions, academic expectations, and character development programs are guided by four foundational pillars. These values define our culture and help shape our students into tomorrow's leaders.
            </p>
          </div>

          {/* Core Values Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {coreValues.map((value, index) => (
              <div 
                key={index} 
                className={`bg-white rounded-3xl p-8 border ${value.borderColor} shadow-sm hover:shadow-2xl ${value.shadowColor} hover:-translate-y-1.5 transition-all duration-300 group`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
                  <div className={`w-20 h-20 rounded-2xl ${value.color} text-white flex items-center justify-center flex-shrink-0 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                    {value.icon}
                  </div>
                  <div>
                    <h3 className={`text-2xl font-bold text-gray-800 transition-colors ${value.hoverColor}`}>
                      {value.title}
                    </h3>
                    <span className="text-xs uppercase tracking-wider font-semibold text-gray-400">
                      Pillar #{index + 1}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed text-[16px]">
                  {value.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
};

export default CoreValuesPage;
