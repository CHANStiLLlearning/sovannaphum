import { HeartHandshake, Lightbulb, Users, Briefcase } from 'lucide-react';

const coreValues = [
  {
    title: 'Ownership',
    icon: <Users className="w-8 h-8" />,
    description: 'We take responsibility for our actions and learning. We act like owners of our school community, fostering a sense of belonging and accountability.',
    color: 'from-blue-500 to-blue-600'
  },
  {
    title: 'Innovation',
    icon: <Lightbulb className="w-8 h-8" />,
    description: 'We embrace change and continuously seek new, creative ways to improve our teaching, learning, and operational processes.',
    color: 'from-[#EBA525] to-orange-500'
  },
  {
    title: 'Respect',
    icon: <HeartHandshake className="w-8 h-8" />,
    description: 'We honor the dignity of every individual. We celebrate diversity and treat everyone with kindness, fairness, and understanding.',
    color: 'from-green-500 to-emerald-600'
  },
  {
    title: 'Professionalism',
    icon: <Briefcase className="w-8 h-8" />,
    description: 'We maintain high standards of integrity, ethical behavior, and dedication in everything we do, serving as role models for our students.',
    color: 'from-[#9A2220] to-red-700'
  }
];

const CoreValues = () => {
  return (
    <section className="py-16 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#9A2220] mb-4">Our Core Values</h2>
          <div className="w-24 h-1 bg-[#EBA525] mx-auto rounded-full"></div>
          <p className="mt-6 text-gray-600 max-w-2xl mx-auto text-lg">
            These four pillars guide our daily actions, decisions, and the way we interact with one another at Sovannaphumi School.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {coreValues.map((value, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
              <div className="flex items-start gap-6">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${value.color} text-white flex items-center justify-center flex-shrink-0 shadow-lg transform group-hover:-translate-y-2 transition-transform duration-300`}>
                  {value.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreValues;
