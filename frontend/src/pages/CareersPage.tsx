import { useState, useEffect } from 'react';
import { Briefcase, MapPin, ChevronRight, GraduationCap, Users, HeartPulse, Sparkles } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { API_BASE_URL } from '../config';

type Job = {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  posted: string;
};

const CareersPage = () => {
  const [jobOpenings, setJobOpenings] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/jobs`);
        if (!response.ok) throw new Error('Failed to fetch jobs');
        const result = await response.json();
        setJobOpenings(result.data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const benefits = [
    {
      icon: <GraduationCap className="w-8 h-8 text-[#A02828]" />,
      title: "Professional Growth",
      description: "Continuous learning opportunities and career advancement paths within our growing network of campuses."
    },
    {
      icon: <Users className="w-8 h-8 text-[#A02828]" />,
      title: "Collaborative Environment",
      description: "Work with a team of passionate educators and professionals dedicated to shaping the future of Cambodia."
    },
    {
      icon: <HeartPulse className="w-8 h-8 text-[#A02828]" />,
      title: "Health & Well-being",
      description: "Comprehensive benefits packages including health insurance and wellness programs for you and your family."
    },
    {
      icon: <Sparkles className="w-8 h-8 text-[#A02828]" />,
      title: "Rewarding Experience",
      description: "Make a real impact on students' lives while enjoying competitive compensation and performance bonuses."
    }
  ];

  return (
    <div className="w-full bg-[#f8f9fa] flex flex-col min-h-screen font-sans">
      
      {/* Hero Section */}
      <div className="relative w-full h-[40vh] min-h-[350px] bg-gradient-to-r from-[#9A2220] via-[#D76918] to-[#EBA525] flex flex-col justify-center items-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-5%] w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute bottom-[-10%] right-[-5%] w-80 h-80 rounded-full bg-white/10 blur-3xl"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-md text-sm font-semibold uppercase tracking-wider mb-4 border border-white/30">
            Join Our Team
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 drop-shadow-md">
            Build Your Career With Us
          </h1>
          <p className="text-lg md:text-xl opacity-90 drop-shadow-sm font-medium leading-relaxed">
            Discover opportunities to grow, innovate, and make a meaningful impact in the education sector of Cambodia.
          </p>
        </div>
      </div>

      {/* Why Join Us Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">Why Work With Us?</h2>
          <div className="w-20 h-1 bg-[#A02828] mx-auto rounded-full mb-4"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We offer more than just a job. We provide a supportive community where you can thrive professionally and personally.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-16 h-16 rounded-xl bg-red-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Open Positions Section */}
      <div className="bg-white py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">Current Openings</h2>
              <div className="w-20 h-1 bg-[#A02828] rounded-full mb-4"></div>
              <p className="text-lg text-gray-600 max-w-2xl">
                Explore our latest job opportunities and find the perfect role for your skills and passion.
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <select className="bg-gray-50 border border-gray-200 text-gray-700 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#A02828]/20 focus:border-[#A02828] font-medium min-w-[150px]">
                <option value="all">All Departments</option>
                <option value="academic">Academic</option>
                <option value="operations">Operations</option>
              </select>
            </div>
          </div>

          {loading && <p className="text-center text-gray-500 py-10">Loading jobs...</p>}
          {error && <p className="text-center text-red-500 py-10">Error: {error}</p>}

          {!loading && !error && (
            <div className="flex flex-col gap-4">
              {jobOpenings.map((job) => (
                <div key={job.id} className="group bg-white border border-gray-100 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-lg hover:border-gray-200 transition-all duration-300">
                  
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-red-50 text-[#A02828] text-xs font-bold uppercase tracking-wider rounded-full">
                        {job.department}
                      </span>
                      <span className="text-sm font-medium text-gray-400">
                        Posted {job.posted}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#A02828] transition-colors">
                      {job.title}
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-5 text-gray-500 text-sm font-medium">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4" />
                        {job.type}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 mt-2 md:mt-0">
                    <button className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-white text-gray-900 font-bold py-3 px-8 rounded-xl border-2 border-gray-200 hover:border-[#A02828] hover:text-[#A02828] transition-all duration-300 group-hover:shadow-sm">
                      Apply Now
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
          
          <div className="mt-12 text-center">
            <button className="inline-flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3.5 px-8 rounded-xl transition-colors">
              View All Positions
            </button>
          </div>

        </div>
      </div>

      {/* General Application CTA */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#9A2220] to-[#EBA525] opacity-5"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Don't see a perfect fit?</h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
            We are always looking for talented individuals to join our team. Send us your resume and we'll keep you in mind for future opportunities.
          </p>
          <NavLink to="/contact" className="inline-flex items-center justify-center gap-2 bg-[#9A2220] hover:bg-[#8A1A18] text-white font-bold py-4 px-10 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
            Submit General Application
            <ChevronRight className="w-5 h-5" />
          </NavLink>
        </div>
      </div>

    </div>
  );
};

export default CareersPage;
