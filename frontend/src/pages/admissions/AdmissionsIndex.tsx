import { Link } from 'react-router-dom';
import { CreditCard, Users, ClipboardCheck } from 'lucide-react';

const AdmissionsIndex = () => {
  const cards = [
    {
      title: 'Payment Method',
      icon: <CreditCard className="w-8 h-8" />,
      path: '/admissions/payment',
    },
    {
      title: 'Our Teachers',
      icon: <Users className="w-8 h-8" />,
      path: '/admissions/teachers',
    },
    {
      title: 'Admission Process',
      icon: <ClipboardCheck className="w-8 h-8" />,
      path: '/admissions/process',
    },
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6">
          {cards.map((card, index) => (
            <Link 
              key={index} 
              to={card.path}
              className="bg-white rounded-xl p-8 flex items-center justify-between shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-[#9A2220] group-hover:bg-[#9A2220] group-hover:text-white transition-colors duration-300">
                  {card.icon}
                </div>
                <h2 className="text-2xl font-bold text-gray-800">{card.title}</h2>
              </div>
              <div className="text-gray-400 group-hover:text-[#EBA525] transition-colors duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdmissionsIndex;
