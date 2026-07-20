import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { FaTelegramPlane, FaTiktok, FaInstagram, FaFacebook, FaLinkedin } from 'react-icons/fa';
import { API_BASE_URL } from '../config';
import { useSEO } from '../hooks/useSEO';

const ContactPage = () => {
  useSEO('contact');
  const [settings, setSettings] = useState({
    contact_hero_title: 'Contact Us',
    contact_hero_subtitle: 'Get in touch with Khmer America School',
    contact_hero_image: '',
    contact_phone: '(+855) 15 838 015',
    contact_email: 'info@khmeramericaschool.edu.kh',
    contact_telegram: 't.me/khmeramericaschoolcambodia',
    contact_address: 'St. 60CVV Dermkor Village, Sangkat Chrouy changvar, Khan Chrouy Changvar, Phnom Penh.',
    contact_linkedin: '@khmeramericaschoolcambodia',
    contact_facebook: 'Khmer America School, Cambodia',
    contact_instagram: '@khmeramericaschool',
    contact_tiktok: '@khmeramericaschool',
    contact_map_iframe: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15635.882414777322!2d104.915725!3d11.5594002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3109513e9a5a3a71%3A0x6e0988ccafcb89af!2sSovannaphumi%20School!5e0!3m2!1sen!2skh!4v1700000000000!5m2!1sen!2skh',
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/settings`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch settings');
        return res.json();
      })
      .then(data => {
        setSettings({
          contact_hero_title: data.contact_hero_title || settings.contact_hero_title,
          contact_hero_subtitle: data.contact_hero_subtitle || settings.contact_hero_subtitle,
          contact_hero_image: data.contact_hero_image || settings.contact_hero_image,
          contact_phone: data.contact_phone || settings.contact_phone,
          contact_email: data.contact_email || settings.contact_email,
          contact_telegram: data.contact_telegram || settings.contact_telegram,
          contact_address: data.contact_address || settings.contact_address,
          contact_linkedin: data.contact_linkedin || settings.contact_linkedin,
          contact_facebook: data.contact_facebook || settings.contact_facebook,
          contact_instagram: data.contact_instagram || settings.contact_instagram,
          contact_tiktok: data.contact_tiktok || settings.contact_tiktok,
          contact_map_iframe: data.contact_map_iframe || settings.contact_map_iframe,
        });
      })
      .catch(err => {
        console.warn('Fallback to local Contact page settings:', err);
      });
  }, []);

  const contactItems = [
    {
      icon: <Phone className="w-6 h-6 text-[#1E3A8A]" />,
      title: "Phone",
      content: settings.contact_phone,
      link: `tel:${settings.contact_phone.replace(/[^\d+]/g, '')}`
    },
    {
      icon: <Mail className="w-6 h-6 text-[#1E3A8A]" />,
      title: "Mail",
      content: settings.contact_email,
      link: `mailto:${settings.contact_email}`
    },
    {
      icon: <FaTelegramPlane className="w-6 h-6 text-[#1E3A8A]" />,
      title: "Telegram",
      content: settings.contact_telegram,
      link: settings.contact_telegram.startsWith('http') ? settings.contact_telegram : `https://${settings.contact_telegram}`
    },
    {
      icon: <MapPin className="w-6 h-6 text-[#1E3A8A]" />,
      title: "Location",
      content: settings.contact_address,
      link: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.contact_address)}`
    },
    {
      icon: <FaLinkedin className="w-6 h-6 text-[#1E3A8A]" />,
      title: "LinkedIn",
      content: settings.contact_linkedin,
      link: `https://linkedin.com`
    },
    {
      icon: <FaFacebook className="w-6 h-6 text-[#1E3A8A]" />,
      title: "Facebook",
      content: settings.contact_facebook,
      link: `https://facebook.com`
    },
    {
      icon: <FaInstagram className="w-6 h-6 text-[#1E3A8A]" />,
      title: "Instagram",
      content: settings.contact_instagram,
      link: `https://instagram.com/${settings.contact_instagram.replace('@', '')}`
    },
    {
      icon: <FaTiktok className="w-6 h-6 text-[#1E3A8A]" />,
      title: "TikTok",
      content: settings.contact_tiktok,
      link: `https://tiktok.com/@${settings.contact_tiktok.replace('@', '')}`
    }
  ];

  return (
    <div className="w-full bg-white flex flex-col min-h-screen font-sans">
      
      {/* Hero Section */}
      <div className="relative w-full h-[70vh] bg-black min-h-[220px] flex flex-col justify-center items-center text-white overflow-hidden">
        {settings.contact_hero_image && (
          <div className="absolute inset-0 w-full h-full">
            <img 
              src={settings.contact_hero_image} 
              alt="" 
              className="w-full h-full object-cover opacity-90"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-[#1E3A8A]/20"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2 drop-shadow-md">{settings.contact_hero_title}</h1>
          <p className="text-lg md:text-xl opacity-90 font-medium">
            {settings.contact_hero_subtitle}
          </p>
        </div>
      </div>

      {/* Main Content Area - Form and Grid Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 w-full">
        
        {/* Contact Form */}
        <div className="max-w-3xl mx-auto mb-20 bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Send us a Message</h2>
          <form 
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const formData = new FormData(form);
              const data = {
                name: formData.get('name') as string,
                email: formData.get('email') as string,
                subject: formData.get('subject') as string,
                message: formData.get('message') as string,
              };
              
              try {
                const res = await fetch(`${API_BASE_URL}/api/contact`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(data)
                });
                if (res.ok) {
                  alert('Message sent successfully!');
                  form.reset();
                } else {
                  try {
                    const errResult = await res.json();
                    alert(errResult.error || 'Failed to send message.');
                  } catch {
                    alert('Failed to send message.');
                  }
                }
              } catch (err) {
                alert('An error occurred. Please try again later.');
              }
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" id="name" name="name" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] outline-none transition-colors text-gray-900" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" id="email" name="email" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] outline-none transition-colors text-gray-900" />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input type="text" id="subject" name="subject" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] outline-none transition-colors text-gray-900" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea id="message" name="message" rows={4} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] outline-none transition-colors resize-none text-gray-900"></textarea>
            </div>
            <button type="submit" className="w-full bg-[#1E3A8A] text-white font-bold py-3 rounded-lg hover:bg-[#172554] transition-colors">
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Grid */}
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4 text-center tracking-tight">Other Ways to Connect</h2>
        <p className="text-gray-500 text-center max-w-xl mx-auto mb-12 text-sm md:text-base font-medium">
          Choose your preferred channel to reach out. Our team is available to assist you across all platforms.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactItems.map((item, index) => {
            const cardClasses = "bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group cursor-pointer hover:border-[#1E3A8A]/20";
            
            const cardContent = (
              <>
                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-[#1E3A8A]/5 group-hover:border-[#1E3A8A]/10 transition-colors duration-300 mb-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                  <div className="group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2 tracking-wide group-hover:text-[#1E3A8A] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed font-semibold break-all max-w-[200px]">
                  {item.content}
                </p>
              </>
            );

            if (item.link) {
              return (
                <a
                  key={index}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cardClasses}
                >
                  {cardContent}
                </a>
              );
            }

            return (
              <div key={index} className={cardClasses}>
                {cardContent}
              </div>
            );
          })}
        </div>
      </div>

      {/* Map Section */}
      <div className="w-full bg-white mt-auto">
        <div className="w-full h-[400px] md:h-[500px] bg-gray-200 relative">
          <iframe 
            src={settings.contact_map_iframe} 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Khmer America School Locations"
            className="absolute inset-0 w-full h-full object-cover"
          ></iframe>
        </div>
      </div>

    </div>
  );
};

export default ContactPage;
