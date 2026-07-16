import { useState, useEffect } from 'react';
import MissionVision from '../components/about/MissionVision';
import KeyFeatures from '../components/about/KeyFeatures';
import { API_BASE_URL } from '../config';

const AboutPage = () => {
  const [settings, setSettings] = useState({
    about_hero_title: 'About Us',
    about_hero_image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1920',
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/settings`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch settings');
        return res.json();
      })
      .then(data => {
        setSettings(prev => ({
          ...prev,
          about_hero_title: data.about_hero_title || prev.about_hero_title,
          about_hero_image: data.about_hero_image || prev.about_hero_image,
        }));
      })
      .catch(err => {
        console.warn('Fallback to local About page settings:', err);
      });
  }, []);

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
      <MissionVision />
      <KeyFeatures />
    </div>
  );
};

export default AboutPage;
