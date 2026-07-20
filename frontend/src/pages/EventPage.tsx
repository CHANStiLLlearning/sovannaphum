import { useState, useEffect } from 'react';
import { Calendar, MapPin, Search, Sparkles, ChevronRight, X, Star } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { eventService } from '../services/eventService';
import { settingsService } from '../services/settingsService';
import { useSEO } from '../hooks/useSEO';

type SchoolEvent = {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
  image?: string;
  status?: string;
  badge?: string;
};

// Strip inline style attributes from HTML to avoid editor color overrides
const stripStyles = (html: string) =>
  (html || '')
    .replace(/ style="[^"]*"/gi, '')
    .replace(/<span\b[^>]*>([^<]*)<\/span>/gi, '$1')
    .replace(/&amp;nbsp;/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&nbsp/g, ' ')
    .replace(/\u00A0/g, ' ');

const EventPage = () => {
  useSEO('events');
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampus, setSelectedCampus] = useState('all');
  const [selectedDateFilter, setSelectedDateFilter] = useState('all');
  const [selectedSpecificDate, setSelectedSpecificDate] = useState('');
  const [settings, setSettings] = useState({
    event_hero_title: 'School Events & Activities',
    event_hero_subtitle: 'Stay updated with our upcoming events, academic exhibitions, sports championships, and cultural celebrations.',
    event_hero_image: '',
  });

  const fetchEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await eventService.getAll({ limit: 50, search: searchQuery, date: selectedSpecificDate });
      setEvents((result as any).data || result);
    } catch (err: any) {
      setError(err.message || 'Something went wrong while fetching events.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const data = await settingsService.get();
      setSettings({
        event_hero_title: data.event_hero_title || 'School Events & Activities',
        event_hero_subtitle: data.event_hero_subtitle || 'Stay updated with our upcoming events, academic exhibitions, sports championships, and cultural celebrations.',
        event_hero_image: data.event_hero_image || '',
      });
    } catch { /* silent */ }
  };

  useEffect(() => {
    fetchEvents();
  }, [searchQuery, selectedSpecificDate]);

  useEffect(() => {
    fetchSettings();
  }, []);

  // Filter events client-side for campus locations & date timeframe
  const filteredEvents = events.filter(event => {
    // 1. Campus location filter
    const matchesCampus = selectedCampus === 'all' || event.location.toLowerCase().includes(selectedCampus.toLowerCase());
    
    // 2. Date timeframe filter
    const eventTime = Date.parse(event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let matchesDate = true;
    if (!isNaN(eventTime)) {
      const eventDate = new Date(eventTime);
      eventDate.setHours(0, 0, 0, 0);
      
      if (selectedDateFilter === 'upcoming') {
        matchesDate = eventDate >= today;
      } else if (selectedDateFilter === 'past') {
        matchesDate = eventDate < today;
      }
    } else {
      // Fallback for unparseable dates: show under "all" and "upcoming"
      if (selectedDateFilter === 'past') {
        matchesDate = false;
      }
    }
    
    return matchesCampus && matchesDate;
  });

  // Sort events chronologically based on timeframe selection:
  // - Upcoming: Show nearest events first (ascending order)
  // - Past / All: Show newest events first (descending order)
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const timeA = Date.parse(a.date);
    const timeB = Date.parse(b.date);
    
    if (isNaN(timeA)) return 1;
    if (isNaN(timeB)) return -1;
    
    if (selectedDateFilter === 'upcoming') {
      return timeA - timeB;
    }
    return timeB - timeA;
  });

  return (
    <div className="w-full bg-[#f8f9fa] flex flex-col min-h-screen font-sans">
      
      {/* Hero Section */}
      <div className="relative w-full h-[70vh] min-h-[350px] flex flex-col justify-center items-center text-white overflow-hidden">
        {settings.event_hero_image ? (
          <div className="absolute inset-0 w-full h-full">
            <img
              src={settings.event_hero_image}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
        ) : (
          <>
            <div className="absolute inset-0 bg-[#1E3A8A]"></div>
            <div className="absolute inset-0 bg-black/35"></div>
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute top-[-10%] left-[-5%] w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
              <div className="absolute bottom-[-10%] right-[-5%] w-80 h-80 rounded-full bg-white/10 blur-3xl"></div>
            </div>
          </>
        )}

        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <span className="inline-flex py-1 px-3.5 rounded-full bg-white/20 backdrop-blur-md text-sm font-semibold uppercase tracking-wider mb-4 border border-white/30">
            Life at SPS
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 drop-shadow-md">
            {settings.event_hero_title}
          </h1>
          <p className="text-lg md:text-xl opacity-95 drop-shadow-sm font-medium leading-relaxed">
            {settings.event_hero_subtitle}
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-grow">
        
        {/* Search & Filter Controls */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Search bar */}
          <div className="relative w-full md:max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </span>
            <input
              type="text"
              placeholder="Search events by title or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] outline-none text-sm text-gray-900 placeholder-gray-400 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            
            {/* Campus Filter */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label className="text-sm font-bold text-gray-600 whitespace-nowrap hidden sm:inline">Campus:</label>
              <select
                value={selectedCampus}
                onChange={(e) => setSelectedCampus(e.target.value)}
                className="w-full sm:w-auto bg-gray-50 border border-gray-200 text-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] font-semibold text-sm cursor-pointer"
              >
                <option value="all">All Campuses</option>
                <option value="Phnom Penh">Phnom Penh Campus</option>
                <option value="Siem Reap">Siem Reap Campus</option>
                <option value="Head Office">Head Office</option>
              </select>
            </div>

            {/* Date Filter */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label className="text-sm font-bold text-gray-600 whitespace-nowrap hidden sm:inline">Timeframe:</label>
              <select
                value={selectedDateFilter}
                onChange={(e) => setSelectedDateFilter(e.target.value)}
                className="w-full sm:w-auto bg-gray-50 border border-gray-200 text-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] font-semibold text-sm cursor-pointer"
              >
                <option value="all">All Events</option>
                <option value="upcoming">Upcoming Events</option>
                <option value="past">Past Events</option>
              </select>
            </div>

            {/* Specific Date Picker */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label className="text-sm font-bold text-gray-600 whitespace-nowrap hidden sm:inline">Specific Date:</label>
              <div className="relative w-full sm:w-auto flex items-center">
                <input
                  type="date"
                  value={selectedSpecificDate}
                  onChange={(e) => setSelectedSpecificDate(e.target.value)}
                  className="w-full sm:w-auto bg-gray-50 border border-gray-200 text-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] font-semibold text-sm cursor-pointer"
                />
                {selectedSpecificDate && (
                  <button 
                    onClick={() => setSelectedSpecificDate('')}
                    className="absolute right-2 text-gray-400 hover:text-red-500 font-extrabold text-lg"
                    style={{ zIndex: 10 }}
                    title="Clear Date"
                  >
                    &times;
                  </button>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                  <div className="flex gap-4 pt-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm px-6 max-w-lg mx-auto">
            <p className="text-blue-500 font-semibold mb-4">Error loading events: {error}</p>
            <button 
              onClick={fetchEvents}
              className="px-6 py-2.5 bg-[#1E3A8A] text-white font-semibold rounded-xl hover:bg-[#172554] transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Events Grid */}
        {!loading && !error && (
          <>
            {sortedEvents.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm px-6">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Events Found</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  We couldn't find any events matching your criteria. Try adjusting your search query or filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sortedEvents.map((event) => (
                  <div 
                    key={event.id} 
                    className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
                  >
                    {/* Event image with fallback */}
                    <div className="relative h-48 md:h-52 bg-gray-100 overflow-hidden shrink-0">
                      <img 
                        src={event.image || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800'} 
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800';
                        }}
                      />
                      {event.badge && event.badge !== 'None' && (
                        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-gray-900 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 border border-white/20">
                          {event.badge === 'Featured' ? (
                            <Sparkles className="w-3.5 h-3.5 text-[#EBA525]" />
                          ) : (
                            <Star className="w-3.5 h-3.5 text-blue-500" />
                          )}
                          {event.badge} Event
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      {/* Meta dates and location */}
                      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#1E3A8A]" />
                          {event.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#1E3A8A]" />
                          {event.location}
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#1E3A8A] transition-colors leading-snug">
                        {event.title}
                      </h3>

                      <div 
                        className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-5"
                        dangerouslySetInnerHTML={{ __html: stripStyles(event.description) }}
                      />

                      <div className="pt-4 border-t border-gray-50 mt-auto flex items-center justify-between">
                        <span className={`text-xs font-bold uppercase tracking-wider ${
                          event.status === 'Closed' ? 'text-gray-500' : 'text-[#1E3A8A]'
                        }`}>
                          {event.status === 'Closed' ? 'Closed Event' : 'Open Event'}
                        </span>
                        <NavLink 
                          to="/contact" 
                          className="inline-flex items-center gap-1 text-sm font-bold text-gray-900 hover:text-[#1E3A8A] transition-colors"
                        >
                          Inquire Details
                          <ChevronRight className="w-4 h-4" />
                        </NavLink>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

      </div>

      {/* General Inquiry Banner */}
      <div className="relative py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Want to schedule a campus tour?</h2>
          <p className="text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto text-base">
            We hold regular parent information sessions and interactive tours during our school events. Let us know when you'd like to visit!
          </p>
          <NavLink 
            to="/contact" 
            className="inline-flex items-center justify-center gap-2 bg-[#1E3A8A] hover:bg-[#172554] text-white font-bold py-3.5 px-8 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Contact Admissions
            <ChevronRight className="w-4 h-4" />
          </NavLink>
        </div>
      </div>

    </div>
  );
};

export default EventPage;