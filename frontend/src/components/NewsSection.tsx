import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';

type NewsArticle = {
  id: number;
  title: string;
  image: string;
  date: string;
  description: string;
};

const NewsSection = () => {
  const [newsItems, setNewsItems] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/news`)
      .then(res => res.json())
      .then(result => {
        // Only show the top 3 latest news items on the homepage
        setNewsItems(result.data ? result.data.slice(0, 3) : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch news', err);
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12 border-b-2 border-gray-100 pb-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#9A2220] mb-2">News & Updates</h2>
            <div className="w-24 h-1 bg-[#EBA525] rounded-full"></div>
          </div>
          <Link to="/news" className="hidden sm:block px-6 py-2 border-2 border-[#9A2220] text-[#9A2220] font-semibold rounded-lg hover:bg-[#9A2220] hover:text-white transition-colors">
            View All News
          </Link>
        </div>
        
        {loading ? (
          <p className="text-center text-gray-500 py-10">Loading latest news...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsItems.map((news) => (
              <div key={news.id} className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col">
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img 
                    src={news.image} 
                    alt={news.title} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546410531-f10edefc31f0?auto=format&fit=crop&q=80&w=600';
                    }}
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Calendar className="w-4 h-4 mr-2" />
                    {news.date}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 hover:text-[#9A2220] cursor-pointer transition-colors line-clamp-2">
                    {news.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                    {news.description.replace(/<[^>]+>/g, '')}
                  </p>
                  <Link to={`/news/${news.id}`} className="text-[#D76918] font-semibold text-sm hover:underline self-start">
                    Read Article
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-8 text-center sm:hidden">
          <Link to="/news" className="px-6 py-2 border-2 border-[#9A2220] text-[#9A2220] font-semibold rounded-lg hover:bg-[#9A2220] hover:text-white transition-colors">
            View All News
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
