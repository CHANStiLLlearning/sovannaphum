import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Calendar, GraduationCap, Compass } from 'lucide-react';
import { NavLink } from 'react-router-dom';

type Slide = {
  image: string;
  tag: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  primaryBtn: { text: string; link: string };
  secondaryBtn: { text: string; link: string };
};

const slides: Slide[] = [
  {
    image: "/images/a.png",
    tag: "WELCOME TO KHMER AMERICA SCHOOL",
    title: "Shaping Leaders of the Digital Era",
    description: "Offering high-quality education programs from kindergarten through high school, integrated with global standards and values.",
    icon: <GraduationCap className="w-5 h-5 text-[#EBA525]" />,
    primaryBtn: { text: "Our Programs", link: "/programs" },
    secondaryBtn: { text: "Contact Us", link: "/contact" }
  },
  {
    image: "/images/b.png",
    tag: "ADMISSIONS OPEN FOR 2026-2027",
    title: "Secure Your Child's Education Today",
    description: "Register early to receive special enrollment privileges. Guided campus tours and consultations are available daily.",
    icon: <Compass className="w-5 h-5 text-[#EBA525]" />,
    primaryBtn: { text: "Admission Info", link: "/admissions" },
    secondaryBtn: { text: "Inquire Now", link: "/contact" }
  },
  {
    image: "/images/c.png",
    tag: "DIVERSE & VIBRANT SCHOOL LIFE",
    title: "A Community Built on Excellence",
    description: "Engage in sports tournaments, science exhibitions, and art festivals to discover your inner talents and build confidence.",
    icon: <Calendar className="w-5 h-5 text-[#EBA525]" />,
    primaryBtn: { text: "School Events", link: "/eventpage" },
    secondaryBtn: { text: "Read Latest News", link: "/news" }
  },
  {
    image: "/images/d.png",
    tag: "INTEGRATED ENGLISH & CHINESE",
    title: "Fluent in Language, Global in Outlook",
    description: "Master foreign languages from certified native instructors using interactive, modern classroom teaching technology.",
    icon: <GraduationCap className="w-5 h-5 text-[#EBA525]" />,
    primaryBtn: { text: "Language Courses", link: "/programs" },
    secondaryBtn: { text: "Contact Office", link: "/contact" }
  }
];

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = slides.length;

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);

  // Auto-play feature
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 7000); // Change slide every 7 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[75vh] min-h-[500px] overflow-hidden bg-black select-none font-sans">
      
      {/* Background Slides */}
      <div className="absolute inset-0 w-full h-full">
        {slides.map((slide, idx) => (
          <div 
            key={idx} 
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              currentSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Slide Background Image with Ken Burns zoom effect */}
            <img 
              src={slide.image} 
              alt=""
              className={`w-full h-full object-cover object-center transition-transform duration-[7000ms] ease-out ${
                currentSlide === idx ? 'scale-105' : 'scale-100'
              }`}
            />
            {/* Dark Solid Overlay for high text legibility */}
            <div className="absolute inset-0 bg-black/50 z-10"></div>
          </div>
        ))}
      </div>

      {/* Slide Content Layout */}
      <div className="relative z-20 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-2xl text-white">
          {slides.map((slide, idx) => (
            <div 
              key={idx} 
              className={currentSlide === idx ? 'block space-y-6' : 'hidden'}
            >
              {/* Highlight Tag */}
              <div 
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#EBA525] transform transition-all duration-700 translate-y-4 opacity-0 animate-fade-in-up"
              >
                {slide.icon}
                {slide.tag}
              </div>

              {/* Slide Title */}
              <h1 
                style={{ animationDelay: '200ms' }}
                className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] transform transition-all duration-700 translate-y-4 opacity-0 animate-fade-in-up"
              >
                {slide.title}
              </h1>

              {/* Slide Description */}
              <p 
                style={{ animationDelay: '400ms' }}
                className="text-sm sm:text-base md:text-lg text-white/85 max-w-xl font-medium leading-relaxed transform transition-all duration-700 translate-y-4 opacity-0 animate-fade-in-up"
              >
                {slide.description}
              </p>

              {/* Action Buttons */}
              <div 
                style={{ animationDelay: '600ms' }}
                className="flex flex-wrap items-center gap-4 pt-2 transform transition-all duration-700 translate-y-4 opacity-0 animate-fade-in-up"
              >
                <NavLink 
                  to={slide.primaryBtn.link}
                  className="inline-flex items-center justify-center gap-2 bg-[#9A2220] hover:bg-[#8A1A18] text-white font-bold py-3.5 px-8 rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                >
                  {slide.primaryBtn.text}
                  <ArrowRight className="w-4 h-4" />
                </NavLink>
                <NavLink 
                  to={slide.secondaryBtn.link}
                  className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white font-bold py-3.5 px-8 rounded-xl border border-white/20 transition-all duration-300 hover:-translate-y-0.5"
                >
                  {slide.secondaryBtn.text}
                </NavLink>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 bg-white/10 hover:bg-white/25 text-white backdrop-blur-md flex items-center justify-center rounded-full transition-all duration-300 group border border-white/10 cursor-pointer"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 bg-white/10 hover:bg-white/25 text-white backdrop-blur-md flex items-center justify-center rounded-full transition-all duration-300 group border border-white/10 cursor-pointer"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Pagination Bar Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className="group relative flex flex-col items-center py-2 cursor-pointer"
            aria-label={`Go to slide ${idx + 1}`}
          >
            {/* Visual indicator lines */}
            <div className={`h-1 rounded-full transition-all duration-500 ${
              currentSlide === idx 
                ? 'bg-[#EBA525] w-8 sm:w-12' 
                : 'bg-white/30 hover:bg-white/60 w-4 sm:w-6'
            }`} />
          </button>
        ))}
      </div>

    </div>
  );
};

export default HeroBanner;
