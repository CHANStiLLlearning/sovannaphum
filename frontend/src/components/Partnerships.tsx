

const partners = [
  { name: 'Cambridge Assessment', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/ef/Cambridge_Assessment_logo.svg/300px-Cambridge_Assessment_logo.svg.png' },
  { name: 'IDP Education', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/IDP_Education_logo.svg/300px-IDP_Education_logo.svg.png' },
  { name: 'IELTS', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/IELTS_logo.svg/300px-IELTS_logo.svg.png' },
  { name: 'Ministry of Education', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Emblem_of_the_Ministry_of_Education%2C_Youth_and_Sport_of_Cambodia.svg/300px-Emblem_of_the_Ministry_of_Education%2C_Youth_and_Sport_of_Cambodia.svg.png' },
];

const Partnerships = () => {
  return (
    <section className="py-16 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#9A2220] mb-4">Our Partnerships</h2>
          <div className="w-24 h-1 bg-[#EBA525] mx-auto rounded-full"></div>
          <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
            We collaborate with leading educational institutions and organizations to ensure our curriculum meets both national and international standards.
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {partners.map((partner, index) => (
            <div key={index} className="w-32 md:w-48 h-24 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100">
              <img 
                src={partner.logo} 
                alt={partner.name} 
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  // Fallback for placeholder logos if they fail to load
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).parentElement!.innerHTML = `<span class="font-bold text-gray-400 text-center">${partner.name}</span>`;
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partnerships;
