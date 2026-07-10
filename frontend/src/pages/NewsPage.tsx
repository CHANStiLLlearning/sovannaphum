import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import HeroBanner from '../components/HeroBanner';

// Define the type for the article
interface Article {
  id: number;
  title: string;
  image: string;
  date: string;
  description: string;
};

const NewsPage = () => {
  const [newsArticles, setNewsArticles] = useState<Article[]>([]);
  const [recentNews, setRecentNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/news`);
        if (!response.ok) throw new Error('Failed to fetch news');
        const result = await response.json();
        const data = result.data || [];
        setNewsArticles(data);
        setRecentNews(data.slice(0, 2)); // Just take top 2 for recent
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="w-full bg-white flex flex-col min-h-screen">
      <HeroBanner/>
     
      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: News & Update */}
          <div className="lg:col-span-8">
            <h2 className="text-[22px] font-bold text-gray-800 flex items-center gap-3 border-b-2 border-gray-100 pb-3 mb-8">
              <div className="w-1.5 h-6 bg-[#9A2220] rounded-full shadow-sm"></div>
              News & Update
            </h2>

            {loading && <p className="text-gray-500">Loading latest news...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}

            {!loading && !error && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {newsArticles.map((article) => (
                  <Link to={`/news/${article.id}`} key={article.id} className="bg-[#f9fafb] rounded-2xl overflow-hidden hover:shadow-md transition-shadow duration-300 border border-gray-100 flex flex-col group cursor-pointer">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img 
                        src={article.image} 
                        alt={article.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5 flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                        <Calendar className="w-4 h-4 text-[#9A2220]" />
                        <span>{article.date}</span>
                      </div>
                      <h3 className="font-bold text-gray-800 leading-snug group-hover:text-[#9A2220] transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                        {article.description.replace(/<[^>]+>/g, '')}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-10">
            
            {/* New Course Banner */}
            <div>
              <h2 className="text-[22px] font-bold text-gray-800 flex items-center gap-3 border-b-2 border-gray-100 pb-3 mb-8">
                <div className="w-1.5 h-6 bg-[#9A2220] rounded-full shadow-sm"></div>
                New course, General English class!
              </h2>
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 cursor-pointer">
                <img 
                  src="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=600" 
                  alt="New Course Poster" 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

            {/* Recent News */}
            <div>
              <h2 className="text-[22px] font-bold text-gray-800 flex items-center gap-3 border-b-2 border-gray-100 pb-3 mb-8">
                <div className="w-1.5 h-6 bg-[#9A2220] rounded-full shadow-sm"></div>
                Recent News
              </h2>
              <div className="flex flex-col gap-4">
                {recentNews.map((news) => (
                  <Link to={`/news/${news.id}`} key={news.id} className="flex gap-4 items-start p-3 rounded-xl hover:bg-[#f9fafb] transition-colors cursor-pointer group">
                    <div className="w-24 h-20 shrink-0 overflow-hidden rounded-lg">
                      <img 
                        src={news.image} 
                        alt={news.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h4 className="font-bold text-gray-800 text-sm leading-tight line-clamp-3 group-hover:text-[#9A2220] transition-colors">
                        {news.title}
                      </h4>
                      <div className="flex items-center gap-1.5 text-gray-400 text-xs mt-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{news.date}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};

export default NewsPage;
