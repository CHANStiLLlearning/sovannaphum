import { useState, useEffect } from 'react';
import { FaFacebook, FaYoutube, FaInstagram, FaTelegram } from 'react-icons/fa';
import { settingsService } from '../services/settingsService';
import { subscriberService } from '../services/subscriberService';
import { NavLink } from 'react-router-dom';

const Footer = () => {
  const [modal, setModal] = useState<{ open: boolean; message: string; type: 'success' | 'error' }>({
    open: false,
    message: '',
    type: 'success'
  });

  const [socials, setSocials] = useState({
    contact_facebook: '#',
    contact_instagram: '#',
    contact_telegram: '#',
    contact_youtube: '#',
  });

  useEffect(() => {
    settingsService.get()
      .then(data => {
        setSocials({
          contact_facebook: data.contact_facebook || '#',
          contact_instagram: data.contact_instagram || '#',
          contact_telegram: data.contact_telegram ? `https://${data.contact_telegram.replace(/^https?:\/\//, '')}` : '#',
          contact_youtube: data.contact_youtube || '#',
        });
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-[#002768] text-white pt-16 pb-8 relative overflow-hidden">
      {/* Decorative dot pattern background */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
          
          {/* Contact Us */}
          <div>
            <h3 className="text-xl font-bold mb-6 pb-2 border-b border-white/20 inline-block">CONTACT US</h3>
            <ul className="space-y-3">
              <li><NavLink to="/contact" className="hover:text-[#EBA525] transition-colors">Contact to America School</NavLink></li>
              <li><NavLink to="/contact" className="hover:text-[#EBA525] transition-colors">Location &amp; Maps</NavLink></li>
              <li><NavLink to="/events" className="hover:text-[#EBA525] transition-colors">Events</NavLink></li>
              <li><a href="#" className="hover:text-[#EBA525] transition-colors">E-Class</a></li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="text-xl font-bold mb-6 pb-2 border-b border-white/20 inline-block">FOLLOW US</h3>
            <p className="mb-6 text-white/90 leading-relaxed">Follow us on social media to receive important updates:</p>
            <div className="flex gap-4">
              <a
                href={socials.contact_instagram !== '#' ? `https://instagram.com/${socials.contact_instagram.replace(/^@/, '')}` : '#'}
                target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#E1306C] flex items-center justify-center hover:scale-110 transition-transform"
              >
                <FaInstagram className="text-white text-xl" />
              </a>
              <a
                href={socials.contact_telegram}
                target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#0088cc] flex items-center justify-center hover:scale-110 transition-transform"
              >
                <FaTelegram className="text-white text-xl" />
              </a>
              <a
                href={socials.contact_youtube !== '#' ? socials.contact_youtube : '#'}
                target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#FF0000] flex items-center justify-center hover:scale-110 transition-transform"
              >
                <FaYoutube className="text-white text-xl" />
              </a>
              <a
                href={socials.contact_facebook !== '#' ? `https://facebook.com/${socials.contact_facebook.replace(/^@/, '')}` : '#'}
                target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center hover:scale-110 transition-transform"
              >
                <FaFacebook className="text-white text-xl" />
              </a>
            </div>
          </div>
          
          {/* Subscribe Us */}
          <div>
            <h3 className="text-xl font-bold mb-6 pb-2 border-b border-white/20 inline-block">SUBSCRIBE US</h3>
            <form className="mb-8" onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const emailInput = form.elements.namedItem('email') as HTMLInputElement;
              const email = emailInput.value;
              
              try {
                await subscriberService.subscribe(email);
                setModal({ open: true, message: 'Thank you! You have subscribed successfully to our newsletter.', type: 'success' });
                form.reset();
              } catch (err: any) {
                setModal({ open: true, message: err?.message || 'Failed to subscribe. Please verify your details.', type: 'error' });
              }
            }}>
              <label htmlFor="footer-email" className="block text-sm mb-2 text-white/90">Email</label>
              <input 
                type="email" 
                id="footer-email"
                name="email"
                placeholder="Enter your email address" 
                className="w-full px-4 py-3 rounded-lg text-gray-800 mb-3 outline-none focus:ring-2 focus:ring-[#EBA525]"
                required
              />
              <button 
                type="submit" 
                className="w-full px-4 py-3 border bg-[#FE0034] border-white/40 rounded-lg font-semibold hover:bg-white hover:text-[#FE0034] transition-colors"
              >
                Subscribe
              </button>
            </form>
            
            <h3 className="text-sm font-bold mb-3 uppercase tracking-wider">Accredited by</h3>
          </div>
          
        </div>
        
        <div className="border-t border-white/20 pt-8 text-center text-sm text-white/70">
          <p>©{new Date().getFullYear()} America School (AS). All Rights Reserved. Designed with passion.</p>
        </div>
      </div>

      {/* Modal Popup overlay */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setModal(prev => ({ ...prev, open: false }))}
          />
          
          <div className="relative bg-white text-gray-800 rounded-3xl shadow-2xl p-8 max-w-sm w-full border border-gray-100 flex flex-col items-center text-center animate-fade-in duration-200">
            {modal.type === 'success' ? (
              <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-sm">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            ) : (
              <div className="w-16 h-16 bg-blue-50 text-rose-500 rounded-full flex items-center justify-center mb-6 shadow-sm">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
            )}
            
            <h4 className="text-xl font-bold text-gray-900 mb-2">
              {modal.type === 'success' ? 'Subscription Complete' : 'Subscription Error'}
            </h4>
            <p className="text-gray-500 mb-6 text-sm leading-relaxed">
              {modal.message}
            </p>
            
            <button 
              onClick={() => setModal(prev => ({ ...prev, open: false }))}
              className="w-full py-3.5 bg-[#1E3A8A] hover:bg-[#172554] text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer text-sm"
            >
              Great, thanks!
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
