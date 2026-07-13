

const ManagementTeam = () => {
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
                src="https://portfolio-web-eosin-alpha.vercel.app/assets/keokimchan-CZlzWr5F.png" 
                alt="CEO" 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 text-center">Mr. CHAN</h3>
            <p className="text-[#D76918] font-semibold text-center">Chief Executive Officer</p>
          </div>
          
          <div className="w-full md:w-2/3">
            <h4 className="text-2xl font-bold text-[#9A2220] mb-4">Welcome to Khmer America School</h4>
            <div className="prose prose-lg text-gray-600 text-justify">
              <p className="mb-4">
                Education is the most powerful weapon which you can use to change the world. At Khmer America School, we are committed to providing the highest quality education to build the future leaders of Cambodia.
              </p>
              <p className="mb-4">
                Since our founding, we have continuously strived for excellence, expanding our reach and improving our curriculum to meet international standards while preserving our rich Khmer culture and heritage.
              </p>
              <p>
                I invite you to join our growing community of learners, educators, and parents who share a common vision: empowering the next generation with knowledge, character, and skills for success in a rapidly changing world.
              </p>
            </div>
            <div className="mt-8">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Signature_of_John_Hancock.svg" 
                alt="Signature" 
                className="h-12 opacity-70"
                style={{ filter: 'grayscale(100%) brightness(0)' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManagementTeam;
