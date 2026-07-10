const OurTeachers = () => {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-[#9A2220] mb-8 text-center">Our Teachers</h2>
        
        <div className="space-y-12">
          {/* KGE Teachers */}
          <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-[#EBA525] pb-2 inline-block">
              Khmer General Education (KGE) Teachers
            </h3>
            <p className="text-gray-700 mb-4">
              At Sovannaphumi School, all our KGE teachers are highly qualified and carefully selected to ensure the best educational outcomes for our students.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Must hold at least a Bachelor's Degree in Education or a related field.</li>
              <li>Required to have a pedagogy certificate recognized by the Ministry of Education, Youth and Sport.</li>
              <li>Must possess strong moral character, patience, and a genuine passion for teaching.</li>
              <li>Undergo regular professional development and training conducted by the school.</li>
            </ul>
          </div>

          {/* GEP Teachers */}
          <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-[#EBA525] pb-2 inline-block">
              General English Program (GEP) Teachers
            </h3>
            <p className="text-gray-700 mb-4">
              Our English program is staffed by both experienced local teachers and native English speakers to provide a balanced and immersive language experience.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Must hold a Bachelor's Degree in TEFL/TESOL or an equivalent English language teaching qualification.</li>
              <li>Native speakers must hold recognized international teaching certificates.</li>
              <li>Demonstrate excellent communication skills and an interactive teaching methodology.</li>
              <li>Committed to fostering a supportive and engaging classroom environment.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurTeachers;
