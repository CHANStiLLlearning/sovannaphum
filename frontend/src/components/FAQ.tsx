import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface FAQItem {
  question: string;
  answer_kh: string;
  answer_en: string;
}

const faqs: FAQItem[] = [
  {
    question: "ដាក់ពាក្យបម្រើការងារ / Work with Us",
    answer_kh: "ជំរាបសួរបង\nសម្រាប់ព័ត៌មានទាក់ទងនឹងការដាក់ពាក្យបម្រើការងារ សូមផ្ញើប្រវត្តិរូបសង្ខេបមកកាន់\n→អ៊ីម៉ែល: recruitment@sovannaphumi.edu.kh\n→ទំនាក់ទំនងផ្នែកធនធានមនុស្សតាមរយៈលេខទូរស័ព្ទ: 015 838 944",
    answer_en: "Dear Richard Ntc,\nPlease send your CVs to our HR Department via\n→email: recruitment@sovannaphumi.edu.kh\n→call: 015 838 499."
  },
  {
    question: "សូមស្វាគមន៍មកកាន់ផេកសាលារៀនសុវណ្ណភូមិ!!!",
    answer_kh: "សូមស្វាគមន៍មកកាន់ផេកសាលារៀនសុវណ្ណភូមិ!!!",
    answer_en: "Welcome to Sovannaphumi School Page!!!"
  },
  {
    question: "អាសយដ្ឋាន និងលេខទំនាក់ទំនងតាមទីតាំងនីមួយៗ | Address and Contact Details",
    answer_kh: "ជំរាបសួរបង🙏\nអរគុណសម្រាប់សំនួរ។ បងអាចទាក់ទងទីតាំងនីមួយៗតាមតំណរភ្ជាប់នេះ\nhttps://t.me/SPSCustomerService\nសូមអរគុណ!",
    answer_en: "Dear Mr./Ms,\nPlease contact our campuses here:\nhttps://t.me/SPSCustomerService\nWarm Regards!"
  },
  {
    question: "ចាប់ទទួលសិស្សពីអាយុប៉ុន្មាន? / Eligible age to enroll in our programs!",
    answer_kh: "ជំរាបសួរបង​🙏\nសាលាយើងខ្ញុំចាប់ទទួលសិស្សពីអាយុពី​ ៣ឆ្នាំ ឡើងទៅ\nព៌ត៌មានលម្អិតសូមទាក់ទង\n→☎️ទូរស័ព្ទលេខ: 015 ​838​ 902\n→📩តេឡេក្រាម:\nhttps://t.me/SPSCustomerService",
    answer_en: "Dear Mr./Ms,\nChidren in the age from 3 years old are eligible to enroll in our programs.\nFor more information, please contact\n→☎️Tel: 015 838 902\n→📩Telegram:\nhttps://t.me/SPSCustomerService\nWarm Regards!"
  },
  {
    question: "កម្មវិធីសិក្សា / Programs",
    answer_kh: "សាលារៀនសុវណ្ណភូមិផ្តល់ជូននូវកម្មវិធីសិក្សាដូចតទៅ📚៖\n១. កម្មវិធីចំណេះទូទៅខ្មែរ\n២. កម្មវិធីអន្តរភាសា ខែ្មរ-អង់គ្លេស-ចិន\n៣. កម្មវិធីភាសាអង់គ្លេសពេញម៉ោង និងក្រៅម៉ោងគ្រប់កម្រិត\n៤. កម្មវិធីភាសាចិនក្រៅម៉ោង",
    answer_en: "Sovannaphumi School provides educational programs as follwoings📚:\n1. Khmer General Education\n2. Integrated English Program\n3. General English Program\n4. Chinese Part-Time Program"
  },
  {
    question: "តម្លៃសិក្សា / Tuition Fees",
    answer_kh: "ជម្រាបសួរបង 🙏\nអរគុណសម្រាប់ការសាកសួររបស់បង។​\nបងអាចពិនិត្យចម្លើយតាម\n→📩 តេឡេក្រាម https://t.me/SPSCustomerService\n→☎️ ទាក់ទងទូរស័ព្ទលេខ 015 838 902\nសូមអរគុណ!",
    answer_en: "Dear Mr./Ms,\nThank you for your question.\nPlease kindly check out the answer on\n→📩 telegram: https://t.me/SPSCustomerService\n→☎️ call 015​ 838 902\nRegards,\nWarm Regards!"
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-white py-12 md:py-20 relative z-10">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-10">FAQs</h2>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            
            return (
              <div 
                key={index} 
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
