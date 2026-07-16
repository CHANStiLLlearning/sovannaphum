import { useState, useEffect } from 'react';
import { Quote } from 'lucide-react';
import { API_BASE_URL } from '../config';

type Testimonial = {
  id: number;
  name: string;
  role: string;
  image: string;
  quote: string;
};

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/testimonials`)
      .then(res => res.json())
      .then(data => setTestimonials(data))
      .catch(err => console.error("Failed to fetch testimonials", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-[#1A627B] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center"><div className="w-8 h-8 border-4 border-[#EBA525] border-t-transparent rounded-full animate-spin"></div></div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) return null;

  return (
    <section className="py-16 bg-[#1A627B] text-white relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#EBA525] opacity-10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What People Say About Us</h2>
          <div className="w-24 h-1 bg-[#EBA525] mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl relative">
              <Quote className="absolute top-6 right-6 w-10 h-10 text-white/20 transform rotate-180" />
              <p className="text-gray-100 mb-8 italic relative z-10 leading-relaxed">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center">
                <img 
                  src={testimonial.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=random`} 
                  alt={testimonial.name} 
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#EBA525] mr-4"
                />
                <div>
                  <h4 className="font-bold text-lg">{testimonial.name}</h4>
                  <p className="text-[#EBA525] text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
