
import { Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sok Dara',
    role: 'Alumni, Class of 2024',
    image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=200',
    quote: 'Sovannaphumi School provided me with the best foundation for my university studies. The teachers are incredibly supportive and the environment is highly encouraging for students to grow.',
  },
  {
    name: 'Chea Sreyneath',
    role: 'Grade 12 Student',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    quote: 'I have been studying here since kindergarten. The English program here is top-notch, and it gave me the confidence to participate in international competitions.',
  },
  {
    name: 'Meas Sopheap',
    role: 'Parent',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
    quote: 'As a parent, I am very satisfied with the curriculum and the care that the school provides. My children are always happy to go to school and their academic results are excellent.',
  }
];

const Testimonials = () => {
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
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl relative">
              <Quote className="absolute top-6 right-6 w-10 h-10 text-white/20 transform rotate-180" />
              <p className="text-gray-100 mb-8 italic relative z-10 leading-relaxed">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center">
                <img 
                  src={testimonial.image} 
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
