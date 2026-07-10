import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slideImages = [
  "/images/1.jpeg",
  "/images/2.jpeg",
  "/images/3.jpg",
  "/images/4.jpeg"
];

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = slideImages.length;

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);

  // Auto-play feature
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000); // Change slide every 6 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-white">
      
      {/* Carousel Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-40 w-6 h-6 md:w-10 md:h-10 bg-black/30 hover:bg-black/60 text-white backdrop-blur-sm flex items-center justify-center rounded-full transition-all duration-300 cursor-pointer group border border-white/20">
        <ChevronLeft className="w-4 h-4 md:w-6 md:h-6 transform group-hover:-translate-x-0.5 transition-transform" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-40 w-6 h-6 md:w-10 md:h-10 bg-black/30 hover:bg-black/60 text-white backdrop-blur-sm flex items-center justify-center rounded-full transition-all duration-300 cursor-pointer group border border-white/20">
        <ChevronRight className="w-4 h-4 md:w-6 md:h-6 transform group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Sliding Viewport */}
      <div className="w-full">
        <div 
          className="flex transition-transform duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {/* Generate Slides */}
          {slideImages.map((image, idx) => (
            <div key={idx} className="w-full flex-shrink-0 relative">
               <img 
                 src={image} 
                 alt={`Slide ${idx + 1}`} 
                 className="w-full h-auto object-contain object-center block" 
               />
               {/* Subtle dark overlay for better contrast on arrows/dots */}
               <div className="absolute inset-0 bg-black/10 z-10 pointer-events-none"></div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Pagination Dots */}
      <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5 md:gap-2">
        {slideImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`rounded-full cursor-pointer transition-all duration-500 ease-out shadow-lg border border-white/20 ${
              currentSlide === idx 
                ? 'bg-white w-4 md:w-8 h-1.5 md:h-2 scale-110' 
                : 'bg-white/50 hover:bg-white/80 w-1.5 h-1.5 md:w-2 md:h-2'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
