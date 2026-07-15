import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';


type Slide = {
  image: string;
};

const slides: Slide[] = [
  { image: "/images/a.png" },
  { image: "/images/b.png" },
  { image: "/images/c.png" },
  { image: "/images/d.png" },
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
