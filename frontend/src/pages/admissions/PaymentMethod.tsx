const PaymentMethod = () => {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-[#9A2220] mb-6">Payment Method</h2>
        <div className="bg-gray-50 p-12 rounded-xl border border-gray-100 shadow-sm">
          <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Information Coming Soon</h3>
          <p className="text-gray-500">
            We are currently updating our payment method details. Please contact the school office for immediate assistance regarding payments and tuition fees.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
