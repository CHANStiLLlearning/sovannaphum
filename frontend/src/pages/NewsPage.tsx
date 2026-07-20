import { useState, useEffect } from 'react';
import { Calendar, Search } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { newsService } from '../services/newsService';
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
  const [recentLoading, setRecentLoading] = useState(true);
  const [error, setError] = useState('');
  const [visibleCount, setVisibleCount] = useState(6);
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') || '';

  // Fetch recent news once
  useEffect(() => {
    const fetchRecentNews = async () => {
      setRecentLoading(true);
      try {
        const result = await newsService.getAll({ limit: 5 });
        setRecentNews((result as any).data || result);
      } catch (err) {
        console.error('Failed to fetch recent news', err);
      } finally {
        setRecentLoading(false);
      }
    };
    fetchRecentNews();
  }, []);

  // Fetch news articles when search query changes
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const result = await newsService.getAll({ search });
        const data = (result as any).data || result;
        setNewsArticles(data);
        setVisibleCount(6);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [search]);

  return (
    <div className="w-full bg-white flex flex-col min-h-screen">
      <HeroBanner/>
     
      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: News & Update */}
          <div className="lg:col-span-8">
            <h2 className="text-[22px] font-bold text-gray-800 flex items-center justify-between border-b-2 border-gray-100 pb-3 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-[#1E3A8A] rounded-full shadow-sm"></div>
                <span>{search ? `Search Results for "${search}"` : 'News & Update'}</span>
              </div>
              {search && (
                <Link to="/news" className="text-sm font-semibold text-[#1E3A8A] hover:underline">
                  Clear Search
                </Link>
              )}
            </h2>

            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((index) => (
                  <div key={index} className="bg-[#f9fafb] rounded-2xl overflow-hidden border border-gray-100 flex flex-col animate-pulse">
                    <div className="relative aspect-[4/3] bg-gray-200"></div>
                    <div className="p-5 flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </div>
                      <div className="h-5 bg-gray-200 rounded w-5/6"></div>
                      <div className="space-y-2 mt-1">
                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {error && <p className="text-blue-500">Error: {error}</p>}

            {!loading && !error && newsArticles.length === 0 && (
              <div className="text-center py-16 bg-[#f9fafb] rounded-2xl border border-gray-100 px-4">
                <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-lg font-semibold text-gray-700">No articles found</p>
                <p className="text-sm text-gray-500 mt-1">We couldn't find any news articles matching "{search}".</p>
                <Link to="/news" className="inline-block mt-4 bg-[#1E3A8A] hover:bg-[#172554] text-white px-5 py-2 rounded-xl text-sm font-semibold transition-colors">
                  View All News
                </Link>
              </div>
            )}

            {!loading && !error && newsArticles.length > 0 && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {newsArticles.slice(0, visibleCount).map((article) => (
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
                          <Calendar className="w-4 h-4 text-[#1E3A8A]" />
                          <span>{article.date}</span>
                        </div>
                        <h3 className="font-bold text-gray-800 leading-snug group-hover:text-[#1E3A8A] transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                          {(article.description || '')
                            .replace(/<[^>]+>/g, '')
                            .replace(/\u00A0/g, ' ')
                            .replace(/&amp;nbsp;/g, ' ')
                            .replace(/&nbsp;/g, ' ')
                            .replace(/&nbsp/g, ' ')}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
                
                {newsArticles.length > visibleCount && (
                  <div className="flex justify-center mt-6">
                    <button
                      onClick={() => setVisibleCount((prev) => prev + 6)}
                      className="bg-[#1E3A8A] hover:bg-[#172554] text-white font-bold py-3.5 px-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                    >
                      View More
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-10 lg:sticky lg:top-24 h-fit">
            


            {/* Recent News */}
            <div>
              <h2 className="text-[22px] font-bold text-gray-800 flex items-center gap-3 border-b-2 border-gray-100 pb-3 mb-8">
                <div className="w-1.5 h-6 bg-[#1E3A8A] rounded-full shadow-sm"></div>
                Recent News
              </h2>
              <div className="flex flex-col gap-4">
                {recentLoading ? (
                  // Loading Skeleton for Recent News
                  [1, 2, 3, 4].map((index) => (
                    <div key={index} className="flex gap-4 items-start p-3 rounded-xl animate-pulse">
                      <div className="w-24 h-20 shrink-0 bg-gray-200 rounded-lg"></div>
                      <div className="flex flex-col gap-2 w-full mt-1">
                        <div className="h-4 bg-gray-200 rounded w-11/12"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        <div className="flex items-center gap-1.5 mt-2">
                          <div className="w-3.5 h-3.5 bg-gray-200 rounded-full"></div>
                          <div className="h-3 bg-gray-200 rounded w-16"></div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  recentNews.map((news) => (
                    <Link to={`/news/${news.id}`} key={news.id} className="flex gap-4 items-start p-3 rounded-xl hover:bg-[#f9fafb] transition-colors cursor-pointer group">
                      <div className="w-24 h-20 shrink-0 overflow-hidden rounded-lg">
                        <img 
                          src={news.image} 
                          alt={news.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <h4 className="font-bold text-gray-800 text-sm leading-tight line-clamp-3 group-hover:text-[#1E3A8A] transition-colors">
                          {news.title}
                        </h4>
                        <div className="flex items-center gap-1.5 text-gray-400 text-xs mt-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{news.date}</span>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};

export default NewsPage;
