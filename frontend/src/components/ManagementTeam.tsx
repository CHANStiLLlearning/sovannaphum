import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const ManagementTeam = () => {
  const [settings, setSettings] = useState({
    mgmt_name: 'Mr. CHAN',
    mgmt_title: 'Chief Executive Officer',
    mgmt_photo: 'https://portfolio-web-eosin-alpha.vercel.app/assets/keokimchan-CZlzWr5F.png',
    mgmt_welcome_title: 'Welcome to Khmer America School',
    mgmt_message_1: 'Education is the most powerful weapon which you can use to change the world. At Khmer America School, we are committed to providing the highest quality education to build the future leaders of Cambodia.',
    mgmt_message_2: 'Since our founding, we have continuously strived for excellence, expanding our reach and improving our curriculum to meet international standards while preserving our rich Khmer culture and heritage.',
    mgmt_message_3: 'I invite you to join our growing community of learners, educators, and parents who share a common vision: empowering the next generation with knowledge, character, and skills for success in a rapidly changing world.',
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/settings`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          setSettings(prev => ({
            mgmt_name: data.mgmt_name || prev.mgmt_name,
            mgmt_title: data.mgmt_title || prev.mgmt_title,
            mgmt_photo: data.mgmt_photo || prev.mgmt_photo,
            mgmt_welcome_title: data.mgmt_welcome_title || prev.mgmt_welcome_title,
            mgmt_message_1: data.mgmt_message_1 || prev.mgmt_message_1,
            mgmt_message_2: data.mgmt_message_2 || prev.mgmt_message_2,
            mgmt_message_3: data.mgmt_message_3 || prev.mgmt_message_3,
          }));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#9A2220] mb-4">Message from Management</h2>
          <div className="w-24 h-1 bg-[#EBA525] mx-auto rounded-full"></div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-12 bg-gray-50 rounded-2xl p-8 md:p-12 border border-gray-100 shadow-sm">
          <div className="w-full md:w-1/3 flex flex-col items-center">
            <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-[#9A2220] mb-6 shadow-xl">
              <img
                src={settings.mgmt_photo}
                alt={settings.mgmt_name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(settings.mgmt_name)}&background=9A2220&color=fff&size=300`;
                }}
              />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 text-center">{settings.mgmt_name}</h3>
            <p className="text-[#D76918] font-semibold text-center">{settings.mgmt_title}</p>
          </div>

          <div className="w-full md:w-2/3">
            <h4 className="text-2xl font-bold text-[#9A2220] mb-4">{settings.mgmt_welcome_title}</h4>
            <div className="prose prose-lg text-gray-600 text-justify">
              {settings.mgmt_message_1 && <p className="mb-4">{settings.mgmt_message_1}</p>}
              {settings.mgmt_message_2 && <p className="mb-4">{settings.mgmt_message_2}</p>}
              {settings.mgmt_message_3 && <p>{settings.mgmt_message_3}</p>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManagementTeam;
