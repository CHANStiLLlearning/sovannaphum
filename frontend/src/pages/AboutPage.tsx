import MissionVision from '../components/about/MissionVision';
import KeyFeatures from '../components/about/KeyFeatures';
import CoreValues from '../components/about/CoreValues';

const AboutPage = () => {
  return (
    <div className="w-full bg-white flex flex-col">
      {/* Hero Banner for About Page */}
      <section className="relative w-full h-[400px] bg-gray-900 flex items-center justify-center">
        <div className="absolute inset-0 w-full h-full">
          <img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1920" 
            alt="Students collaborating" 
            className="w-full h-full object-cover opacity-50"
          />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">About Us</h1>
          <div className="flex items-center justify-center gap-2 text-white/80 font-medium">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span>/</span>
            <span className="text-[#EBA525]">About Us</span>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <MissionVision />
      <KeyFeatures />
      <CoreValues />
    </div>
  );
};

export default AboutPage;
