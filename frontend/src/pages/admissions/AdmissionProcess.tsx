const AdmissionProcess = () => {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-[#9A2220] mb-8 text-center">Admission Process</h2>
        
        <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
          
          {/* Step 1 */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-[#9A2220] text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-bold">
              1
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-2">School Visit & Information</h3>
              <p className="text-gray-600">
                Parents are welcome to visit the school campus to learn more about our curriculum, facilities, and the programs we offer. Our admissions officers are ready to guide you.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-[#EBA525] text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-bold">
              2
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Making Your Application</h3>
              <p className="text-gray-600 mb-3">
                Please bring the completed application forms and documents. Check each item as a reminder for you:
              </p>
              <ul className="list-disc pl-5 text-gray-600 space-y-1 text-sm">
                <li>Application Forms with photos attached</li>
                <li>Cambodian Family Book</li>
                <li>Admission / Material Fee</li>
              </ul>
              <p className="text-gray-600 text-sm mt-3">
                If you require bus transportation, the office will help you complete these forms. Before School starts, we will notify you of the time that the bus will call for your child. Uniforms will be available for purchase from the School office.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-[#9A2220] text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-bold">
              3
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Admission & Interview</h3>
              <p className="text-gray-600">
                The principal and staff will be able to provide information about the possibilities for your child studying at the school. Once this has been agreed upon, your child will be able to start the class. Once the application has been received by the school office, an interview will be arranged for you and your child with the principal.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdmissionProcess;
