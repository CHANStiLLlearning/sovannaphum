import { MapPin, Phone, Mail } from 'lucide-react';
import { FaTelegramPlane, FaTiktok, FaInstagram, FaFacebook, FaLinkedin } from 'react-icons/fa';
import { API_BASE_URL } from '../config';

const ContactPage = () => {
  const contactItems = [
    {
      icon: <Phone className="w-7 h-7 text-[#A02828] stroke-[1.5]" />,
      title: "Phone",
      content: "(+855) 15 838 015",
    },
    {
      icon: <Mail className="w-7 h-7 text-[#A02828] stroke-[1.5]" />,
      title: "Mail",
      content: "info@sovannaphumi.edu.kh",
    },
    {
      icon: <FaTelegramPlane className="w-7 h-7 text-[#A02828]" />,
      title: "Telegram",
      content: "t.me/sovannaphumischoolcambodia",
    },
    {
      icon: <MapPin className="w-7 h-7 text-[#A02828] stroke-[1.5]" />,
      title: "Location",
      content: "St. 60CVV Dermkor Village, Sangkat Chrouy changvar, Khan Chrouy Changvar, Phnom Penh.",
    },
    {
      icon: <FaLinkedin className="w-7 h-7 text-[#A02828]" />,
      title: "Linkln",
      content: "@sovannaphumischoolcambodia",
    },
    {
      icon: <FaFacebook className="w-7 h-7 text-[#A02828]" />,
      title: "Facebook",
      content: "Sovannaphumi School, Cambodia",
    },
    {
      icon: <FaInstagram className="w-7 h-7 text-[#A02828]" />,
      title: "Instagram",
      content: "@sovannaphumi",
    },
    {
      icon: <FaTiktok className="w-7 h-7 text-[#A02828]" />,
      title: "Toktok",
      content: "@sovannaphumi",
    }
  ];

  return (
    <div className="w-full bg-white flex flex-col min-h-screen font-sans">
      
      {/* Hero Section */}
      <div className="relative w-full h-[25vh] min-h-[220px] bg-gradient-to-r from-[#9A2220] via-[#D76918] to-[#EBA525] flex flex-col justify-center items-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2 drop-shadow-md">Contact Us</h1>
          <p className="text-lg md:text-xl opacity-90 font-medium">
            Get in touch with Sovannaphumi School
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
                  alert('Failed to send message.');
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
                <input type="text" id="name" name="name" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9A2220] focus:border-[#9A2220] outline-none transition-colors text-gray-900" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" id="email" name="email" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9A2220] focus:border-[#9A2220] outline-none transition-colors text-gray-900" />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input type="text" id="subject" name="subject" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9A2220] focus:border-[#9A2220] outline-none transition-colors text-gray-900" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea id="message" name="message" rows={4} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9A2220] focus:border-[#9A2220] outline-none transition-colors resize-none text-gray-900"></textarea>
            </div>
            <button type="submit" className="w-full bg-[#9A2220] text-white font-bold py-3 rounded-lg hover:bg-[#8A1A18] transition-colors">
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Grid */}
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Other Ways to Connect</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {contactItems.map((item, index) => (
            <div key={index} className="flex items-start gap-5">
              <div className="w-16 h-16 shrink-0 bg-[#f9fafb] rounded-2xl flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-50">
                {item.icon}
              </div>
              <div className="flex flex-col pt-1">
                <h3 className="text-[17px] font-bold text-gray-900 mb-1 leading-tight tracking-wide">{item.title}</h3>
                <p className="text-[14px] text-gray-500 leading-relaxed font-medium">
                  {item.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map Section */}
      <div className="w-full bg-white mt-auto">
        <div className="w-full h-[400px] md:h-[500px] bg-gray-200 relative">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15635.882414777322!2d104.915725!3d11.5594002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3109513e9a5a3a71%3A0x6e0988ccafcb89af!2sSovannaphumi%20School!5e0!3m2!1sen!2skh!4v1700000000000!5m2!1sen!2skh" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Sovannaphumi School Locations"
            className="absolute inset-0 w-full h-full object-cover"
          ></iframe>
        </div>
      </div>

    </div>
  );
};

export default ContactPage;
