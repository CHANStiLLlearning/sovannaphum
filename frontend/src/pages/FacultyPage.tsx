import { useState, useEffect } from 'react';
import { Search, BookOpen, Globe, X, Users } from 'lucide-react';
import { API_BASE_URL } from '../config';

type Teacher = {
  id: number;
  name: string;
  role: string;
  subject: string;
  nationality: string;
  image?: string;
};

const FacultyPage = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedNationality, setSelectedNationality] = useState('all');

  const [settings, setSettings] = useState({
    faculty_hero_title: 'Meet Our Faculty',
    faculty_hero_subtitle: 'Dedicated educators shaping the next generation with passion, expertise, and care.',
    faculty_hero_image: '',
  });

  const fetchTeachers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/teachers?limit=100`);
      if (!response.ok) throw new Error('Failed to fetch teachers');
      const result = await response.json();
      setTeachers(result.data || []);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const fetchFacultySettings = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/settings`);
      if (res.ok) {
        const data = await res.json();
        setSettings({
          faculty_hero_title: data.faculty_hero_title || settings.faculty_hero_title,
          faculty_hero_subtitle: data.faculty_hero_subtitle || settings.faculty_hero_subtitle,
          faculty_hero_image: data.faculty_hero_image || settings.faculty_hero_image,
        });
      }
    } catch (err) {
      console.warn('Fallback to local faculty page settings:', err);
    }
  };

  useEffect(() => {
    fetchTeachers();
    fetchFacultySettings();
  }, []);

  const subjects = ['all', ...Array.from(new Set(teachers.map(t => t.subject).filter(Boolean)))];
  const nationalities = ['all', ...Array.from(new Set(teachers.map(t => t.nationality).filter(Boolean)))];

  const filtered = teachers.filter(t => {
    const nameMatch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      t.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      t.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const subjectMatch = selectedSubject === 'all' || t.subject === selectedSubject;
    const nationalityMatch = selectedNationality === 'all' || t.nationality === selectedNationality;
    return nameMatch && subjectMatch && nationalityMatch;
  });

  return (
    <div className="w-full bg-[#f8f9fa] flex flex-col min-h-screen font-sans">

      {/* Hero */}
      <div className="relative w-full h-[70vh] bg-black min-h-[350px] flex flex-col justify-center items-center text-white overflow-hidden">
        {settings.faculty_hero_image ? (
          <div className="absolute inset-0 w-full h-full">
            <img 
              src={settings.faculty_hero_image} 
              alt="" 
              className="w-full h-full object-cover opacity-90"
            />
          </div>
        ) : (
          <div className="absolute inset-0 bg-black/30" />
        )}
        <div className="absolute inset-0 bg-[#1D055F]/40"></div>
        <div className="absolute top-[-10%] left-[-5%] w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <span className="inline-flex py-1 px-3.5 rounded-full bg-white/20 backdrop-blur-md text-sm font-semibold uppercase tracking-wider mb-4 border border-white/30">
            Our People
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 drop-shadow-md">
            {settings.faculty_hero_title}
          </h1>
          <p className="text-lg md:text-xl opacity-95 drop-shadow-sm font-medium leading-relaxed">
            {settings.faculty_hero_subtitle}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-grow">

        {/* Search & Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </span>
            <input
              type="text"
              placeholder="Search by teacher name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] outline-none text-sm text-gray-900 placeholder-gray-400 transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full sm:w-auto bg-gray-50 border border-gray-200 text-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] font-semibold text-sm cursor-pointer"
            >
              {subjects.map(s => (
                <option key={s} value={s}>{s === 'all' ? 'All Subjects' : s}</option>
              ))}
            </select>

            <select
              value={selectedNationality}
              onChange={(e) => setSelectedNationality(e.target.value)}
              className="w-full sm:w-auto bg-gray-50 border border-gray-200 text-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] font-semibold text-sm cursor-pointer"
            >
              {nationalities.map(n => (
                <option key={n} value={n}>{n === 'all' ? 'All Nationalities' : n}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => (
              <div key={n} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm animate-pulse flex flex-col">
                <div className="h-[480px] bg-gray-200 shrink-0" />
                <div className="p-5 flex flex-col space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-1/3 mt-2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm px-6 max-w-lg mx-auto">
            <p className="text-blue-500 font-semibold mb-4">Error: {error}</p>
            <button onClick={fetchTeachers} className="px-6 py-2.5 bg-[#1E3A8A] text-white font-semibold rounded-xl hover:bg-[#172554] transition-colors">
              Try Again
            </button>
          </div>
        )}

        {/* Teacher Grid */}
        {!loading && !error && (
          <>
            {filtered.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm px-6">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Teachers Found</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Try adjusting your search or filters.
                </p>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-6 font-medium">
                  Showing <span className="font-bold text-gray-800">{filtered.length}</span> faculty member{filtered.length !== 1 ? 's' : ''}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {filtered.slice(0, 12).map(teacher => (
                    <div
                      key={teacher.id}
                      className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
                    >
                      {/* Photo */}
                      <div className="relative h-[480px] bg-[#1D055F]/10 overflow-hidden shrink-0">
                        <img
                          src={teacher.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.name)}&background=9A2220&color=fff&size=300`}
                          alt={teacher.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.name)}&background=9A2220&color=fff&size=300`;
                          }}
                        />
                        {/* Nationality flag badge */}
                        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-gray-700 px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1">
                          <Globe className="w-3 h-3 text-[#1E3A8A]" />
                          {teacher.nationality}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-5 flex flex-col flex-grow">
                        <h3 className="text-lg font-bold text-gray-900 mb-0.5 group-hover:text-[#1E3A8A] transition-colors leading-tight">
                          {teacher.name}
                        </h3>
                        <p className="text-[#D76918] font-semibold text-sm mb-3">{teacher.role}</p>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                          <BookOpen className="w-3.5 h-3.5 text-[#1E3A8A] shrink-0" />
                          {teacher.subject}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FacultyPage;
