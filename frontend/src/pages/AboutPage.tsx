import { useState, useEffect } from 'react';
import MissionVision from '../components/about/MissionVision';
import KeyFeatures from '../components/about/KeyFeatures';
import FAQ from '../components/FAQ';
import { settingsService } from '../services/settingsService';
import { featureService } from '../services/featureService';
import { useSEO } from '../hooks/useSEO';

const AboutPage = () => {
  useSEO('about');
  const [settings, setSettings] = useState<any>(null);
  const [features, setFeatures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuresLoading, setFeaturesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    settingsService.get()
      .then(data => {
        setSettings(data || {});
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch settings from API:', err);
        setError('Failed to load page settings. Please check your internet connection or try again later.');
        setLoading(false);
      });

    featureService.getAll()
      .then(data => {
        setFeatures(data || []);
        setFeaturesLoading(false);
      })
      .catch(err => {
        console.error('Failed to load key features:', err);
        setFeaturesLoading(false);
      });
  }, []);

  if (error) {
    return (
      <div className="w-full bg-white flex flex-col items-center justify-center min-h-[60vh] py-20 font-sans text-center px-4">
        <p className="text-red-500 font-bold text-lg mb-2">Oops! Something went wrong</p>
        <p className="text-gray-500 text-sm mb-6 max-w-md">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-[#1E3A8A] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#172554] transition-all active:scale-[0.98] shadow-md cursor-pointer"
        >
          Reload Page
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full bg-white flex flex-col min-h-screen">
        {/* Shimmer Hero Banner */}
        <section className="relative w-full bg-gray-200 h-[70vh] flex items-center justify-center animate-pulse">
          <div className="relative z-10 text-center px-4 max-w-xl flex flex-col items-center gap-4">
            <div className="h-10 bg-gray-300 rounded w-64"></div>
            <div className="flex gap-2 items-center">
              <div className="h-4 bg-gray-300 rounded w-16"></div>
              <span className="text-gray-300">/</span>
              <div className="h-4 bg-gray-300 rounded w-20"></div>
            </div>
          </div>
        </section>

        {/* Shimmer Mission & Vision */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {[1, 2].map((idx) => (
                <div key={idx} className="bg-gray-50 rounded-2xl p-8 md:p-12 border-t-8 border-gray-200 shadow-sm animate-pulse">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-gray-200 shrink-0"></div>
                    <div className="h-8 bg-gray-200 rounded w-48"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-11/12"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Shimmer Key Features */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
            <div className="text-center mb-16 flex flex-col items-center gap-3">
              <div className="h-9 bg-gray-200 rounded w-72"></div>
              <div className="w-24 h-1 bg-gray-200 rounded-full"></div>
              <div className="h-5 bg-gray-200 rounded w-96 mt-3"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((idx) => (
                <div key={idx} className="bg-gray-50 rounded-3xl p-8 border border-gray-100 flex flex-col gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gray-200"></div>
                  <div className="h-6 bg-gray-200 rounded w-32"></div>
                  <div className="space-y-2">
                    <div className="h-3.5 bg-gray-200 rounded w-full"></div>
                    <div className="h-3.5 bg-gray-200 rounded w-11/12"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="w-full bg-white flex flex-col">
      {/* Hero Banner for About Page */}
      <section className="relative w-full bg-black h-[70vh] flex items-center justify-center">
        <div className="absolute inset-0 w-full h-full">
          <img 
            src={settings.about_hero_image} 
            alt="Students collaborating" 
            className="w-full h-full object-cover opacity-90"
          />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{settings.about_hero_title}</h1>
          <div className="flex items-center justify-center gap-2 text-white/80 font-medium">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span>/</span>
            <span className="text-[#EBA525]">About Us</span>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <MissionVision 
        missionTitle={settings.about_mission_title}
        missionDesc={settings.about_mission_desc}
        visionTitle={settings.about_vision_title}
        visionDesc={settings.about_vision_desc}
      />
      <KeyFeatures features={features} loading={featuresLoading} />
      <FAQ />
    </div>
  );
};

export default AboutPage;
