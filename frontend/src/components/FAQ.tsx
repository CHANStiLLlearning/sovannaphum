import { useState, useEffect } from 'react';
import { Plus, Minus } from 'lucide-react';
import { API_BASE_URL } from '../config';

interface FAQItem {
  id: number;
  question: string;
  answer_kh: string;
  answer_en: string;
}

const FAQ = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/faqs`)
      .then(res => res.json())
      .then(data => setFaqs(data))
      .catch(err => console.error("Failed to fetch faqs", err))
      .finally(() => setLoading(false));
  }, []);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (loading) {
    return (
      <section className="w-full bg-white py-12 md:py-20 relative z-10">
        <div className="container mx-auto px-4 max-w-4xl flex justify-center">
          <div className="w-8 h-8 border-4 border-[#9A2220] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </section>
    );
  }

  if (faqs.length === 0) return null;

  return (
    <section className="w-full bg-white py-12 md:py-20 relative z-10">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-10">FAQs</h2>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            
            return (
              <div 
                key={faq.id} 
                className="rounded-lg overflow-hidden border border-gray-100 shadow-sm"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex justify-between items-center bg-gray-50 p-4 md:p-5 text-left hover:bg-gray-100 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-gray-800 pr-8">{faq.question}</span>
                  <span className="text-gray-500 shrink-0">
                    {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                  </span>
                </button>
                
                <div 
                  className={`transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                  } overflow-hidden bg-gray-50`}
                >
                  <div className="p-4 md:p-5 pt-0 border-t border-gray-200">
                    <div className="mb-4">
                      <p className="text-gray-700 whitespace-pre-wrap">{faq.answer_kh}</p>
                    </div>
                    <div>
                      <p className="text-gray-700 whitespace-pre-wrap">{faq.answer_en}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
