import { useState, useEffect } from 'react';
import { Calendar, MapPin, ArrowRight, Sparkles, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';

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

const stripStyles = (html: string) =>
  (html || '')
    .replace(/ style="[^"]*"/gi, '')
    .replace(/<span\b[^>]*>([^<]*)<\/span>/gi, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;nbsp;/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&nbsp/g, ' ')
    .replace(/\u00A0/g, ' ')
    .trim();

const EventsSection = () => {
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/events?limit=3`)
      .then(res => res.json())
      .then(result => {
        setEvents(result.data ? result.data.slice(0, 3) : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch events for homepage', err);
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-16 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12 border-b-2 border-gray-200 pb-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A8A] mb-2">Upcoming Events</h2>
            <div className="w-24 h-1 bg-[#EBA525] rounded-full"></div>
          </div>
          <Link 
            to="/eventpage" 
            className="hidden sm:inline-flex items-center gap-2 px-6 py-2 border-2 border-[#1E3A8A] text-[#1E3A8A] font-semibold rounded-lg hover:bg-[#1E3A8A] hover:text-white transition-colors text-sm"
          >
            All Events
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex flex-col animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6 flex flex-col gap-3">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <p className="text-gray-500 font-medium">No upcoming events listed at this time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {events.map((event) => (
              <div 
                key={event.id} 
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
              >
                <div className="relative h-80 bg-gray-105 overflow-hidden">
                  <img 
                    src={event.image || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800'} 
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800';
                    }}
                  />
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-gray-900 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 border border-white/20 z-10">
                    <span className={`w-2 h-2 rounded-full ${event.status === 'Closed' ? 'bg-gray-400' : 'bg-green-500'}`}></span>
                    {event.status === 'Closed' ? 'Closed' : 'Open'}
                  </div>
                  {event.badge && event.badge !== 'None' && (
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-gray-900 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 border border-white/20 z-10">
                      {event.badge === 'Featured' ? (
                        <Sparkles className="w-3.5 h-3.5 text-[#EBA525]" />
                      ) : (
                        <Star className="w-3.5 h-3.5 text-blue-500" />
                      )}
                      {event.badge} Event
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#1E3A8A]" />
                      {event.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#1E3A8A]" />
                      {event.location}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#1E3A8A] transition-colors line-clamp-2 leading-tight">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">
                    {stripStyles(event.description)}
                  </p>
                  <Link 
                    to="/eventpage" 
                    className="inline-flex items-center gap-1 text-sm font-bold text-[#D76918] hover:underline"
                  >
                    View Details
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link 
            to="/eventpage" 
            className="w-full inline-flex justify-center items-center gap-2 px-6 py-3 border-2 border-[#1E3A8A] text-[#1E3A8A] font-semibold rounded-lg hover:bg-[#1E3A8A] hover:text-white transition-colors"
          >
            All Events
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
