import { FaFacebook, FaYoutube, FaInstagram, FaTelegram } from 'react-icons/fa';
import { API_BASE_URL } from '../config';

const Footer = () => {
  return (
    <footer className="bg-[#9A2220] text-white pt-16 pb-8 relative overflow-hidden">
      {/* Decorative dot pattern background */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
          
          {/* Contact Us */}
          <div>
            <h3 className="text-xl font-bold mb-6 pb-2 border-b border-white/20 inline-block">CONTACT US</h3>
            <ul className="space-y-3 mb-8">
              <li><a href="#" className="hover:text-[#EBA525] transition-colors">Contact Sovannaphumi school</a></li>
              <li><a href="#" className="hover:text-[#EBA525] transition-colors">Location & Maps</a></li>
              <li><a href="#" className="hover:text-[#EBA525] transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-[#EBA525] transition-colors">E-Class</a></li>
            </ul>
            
            <p className="mb-4 text-white/90">Follow us on social media to receive important updates:</p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 flex items-center justify-center hover:scale-110 transition-transform">
                <FaInstagram className="text-white text-xl" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#0088cc] flex items-center justify-center hover:scale-110 transition-transform">
                <FaTelegram className="text-white text-xl" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#FF0000] flex items-center justify-center hover:scale-110 transition-transform">
                <FaYoutube className="text-white text-xl" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center hover:scale-110 transition-transform">
                <FaFacebook className="text-white text-xl" />
              </a>
            </div>
          </div>
          
          {/* Download SPS App */}
          <div>
            <h3 className="text-xl font-bold mb-6 pb-2 border-b border-white/20 inline-block">DOWNLOAD SPS APP</h3>
            <p className="mb-6 text-white/90 leading-relaxed">
              Stay connected to your child's school experience like never before. Our app is designed to keep parents and guardians informed and engaged.
            </p>
            <div className="flex flex-col gap-3">
              <a href="#" className="hover:opacity-80 transition-opacity w-36">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" 
                  alt="App Store" 
                  className="w-full"
                />
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity w-36">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
                  alt="Google Play" 
                  className="w-full"
                />
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
                const res = await fetch(`${API_BASE_URL}/api/subscribe`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email })
                });
                if (res.ok) {
                  alert('Subscribed successfully!');
                  form.reset();
                } else {
                  const data = await res.json();
                  alert(data.error || 'Failed to subscribe');
                }
              } catch (err) {
                alert('An error occurred. Please try again later.');
              }
            }}>
              <label htmlFor="email" className="block text-sm mb-2 text-white/90">Email</label>
              <input 
                type="email" 
                id="email"
                name="email"
                placeholder="Enter your email address" 
                className="w-full px-4 py-3 rounded-lg text-gray-800 mb-3 outline-none focus:ring-2 focus:ring-[#EBA525]"
                required
              />
              <button 
                type="submit" 
                className="w-full px-4 py-3 border border-white/40 rounded-lg font-semibold hover:bg-white hover:text-[#9A2220] transition-colors"
              >
                Subscribe
              </button>
            </form>
            
            <h3 className="text-sm font-bold mb-3 uppercase tracking-wider">Accredited by</h3>
            {/* <div className="bg-white p-3 rounded-lg flex items-center gap-4">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Emblem_of_the_Ministry_of_Education%2C_Youth_and_Sport_of_Cambodia.svg/100px-Emblem_of_the_Ministry_of_Education%2C_Youth_and_Sport_of_Cambodia.svg.png" alt="MoEYS" className="h-10 object-contain" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/IELTS_logo.svg/100px-IELTS_logo.svg.png" alt="IELTS" className="h-6 object-contain" />
              <img src="https://upload.wikimedia.org/wikipedia/en/thumb/e/ef/Cambridge_Assessment_logo.svg/100px-Cambridge_Assessment_logo.svg.png" alt="Cambridge Assessment" className="h-6 object-contain" />
            </div> */}
          </div>
          
        </div>
        
        <div className="border-t border-white/20 pt-8 text-center text-sm text-white/70">
          <p>©2026 Sovannaphumi School (SPS). All Rights Reserved. Designed with passion.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
