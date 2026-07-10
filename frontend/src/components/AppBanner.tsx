

const AppBanner = () => {
  return (
    <section className="bg-gradient-to-r from-[#9A2220] to-[#D76918] py-16 relative overflow-hidden">
      {/* Abstract background shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#EBA525] opacity-20 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          
          <div className="w-full md:w-1/2 text-white text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
              Stay Connected With The SPS Mobile App
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-xl">
              Track your child's progress, receive important announcements, and stay in touch with teachers directly from your smartphone. Download the Sovannaphumi School app today!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
              <a href="#" className="hover:scale-105 transition-transform">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" 
                  alt="Download on the App Store" 
                  className="h-12"
                />
              </a>
              <a href="#" className="hover:scale-105 transition-transform">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
                  alt="Get it on Google Play" 
                  className="h-12"
                />
              </a>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
            <div className="relative">
              <div className="w-64 h-[500px] bg-gray-900 rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden relative z-20 mx-auto transform rotate-6">
                <div className="absolute top-0 w-full h-6 bg-gray-800 flex justify-center rounded-b-xl z-30">
                  <div className="w-20 h-4 bg-black rounded-b-full"></div>
                </div>
                {/* Simulated App UI */}
                <div className="w-full h-full bg-gray-100 flex flex-col">
                  <div className="bg-[#9A2220] h-20 w-full text-white p-4 pt-8 flex items-center shadow-md">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex-shrink-0"></div>
                    <div className="ml-3">
                      <div className="w-24 h-3 bg-white/30 rounded-full mb-1.5"></div>
                      <div className="w-16 h-2 bg-white/20 rounded-full"></div>
                    </div>
                  </div>
                  <div className="p-4 space-y-4 flex-grow">
                    <div className="w-full h-32 bg-white rounded-xl shadow-sm border border-gray-200"></div>
                    <div className="w-full h-20 bg-white rounded-xl shadow-sm border border-gray-200 flex p-3 gap-3">
                      <div className="w-14 h-14 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1 space-y-2 py-1">
                        <div className="w-full h-2 bg-gray-200 rounded-full"></div>
                        <div className="w-2/3 h-2 bg-gray-200 rounded-full"></div>
                      </div>
                    </div>
                    <div className="w-full h-20 bg-white rounded-xl shadow-sm border border-gray-200 flex p-3 gap-3">
                      <div className="w-14 h-14 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1 space-y-2 py-1">
                        <div className="w-full h-2 bg-gray-200 rounded-full"></div>
                        <div className="w-4/5 h-2 bg-gray-200 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <div className="h-16 bg-white border-t border-gray-200 flex justify-around items-center px-4">
                    <div className="w-6 h-6 rounded-md bg-[#9A2220]"></div>
                    <div className="w-6 h-6 rounded-md bg-gray-300"></div>
                    <div className="w-6 h-6 rounded-md bg-gray-300"></div>
                    <div className="w-6 h-6 rounded-md bg-gray-300"></div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements behind phone */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/10 rounded-full blur-xl z-10"></div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default AppBanner;
