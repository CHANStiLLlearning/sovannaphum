import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronLeft, Calendar, BookOpen } from 'lucide-react';
import { newsService } from '../services/newsService';

type Article = {
  id: number;
  title: string;
  image: string;
  date: string;
  description: string;
};

const NewsDetailPage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [recentNews, setRecentNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Monitor scroll progress to fill progress bar
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch article details & related articles
  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const result = await newsService.getAll();
        const data = (result as any).data || result;
        const found = data.find((item: Article) => item.id.toString() === id);
        setArticle(found || null);

        // Fetch related articles (excluding current article, limit to 3)
        const related = data
          .filter((item: Article) => item.id.toString() !== id)
          .slice(0, 3);
        setRecentNews(related);
      } catch (err) {
        console.error('Failed to fetch article', err);
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full bg-white flex flex-col min-h-screen font-sans animate-pulse">
        {/* Skeleton Hero Section */}
        <div className="relative w-full h-[50vh] min-h-[400px] bg-gray-200 flex flex-col justify-end pb-24">
          <div className="relative z-10 max-w-4xl mx-auto px-4 w-full">
            <div className="w-24 h-5 bg-gray-300 rounded mb-6"></div>
            <div className="w-32 h-6 bg-gray-300 rounded-full mb-4"></div>
            <div className="h-14 bg-gray-300 rounded w-3/4"></div>
          </div>
        </div>

        {/* Skeleton Main Content Area */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative -mt-16 z-20 w-full mb-12">
          <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-12 shadow-xl space-y-6">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-[300px] bg-gray-200 rounded-2xl w-full"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-11/12"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col justify-center items-center gap-4">
        <h2 className="text-3xl font-bold text-gray-900">Article not found</h2>
        <Link to="/news" className="text-[#1E3A8A] font-medium hover:underline flex items-center gap-2">
          <ChevronLeft className="w-4 h-4" /> Back to News
        </Link>
      </div>
    );
  }

  // Replace non-breaking spaces and escaped HTML entities with normal spaces to prevent text rendering/layout bugs
  const cleanDescription = (article.description || '')
    .replace(/\u00A0/g, ' ')
    .replace(/&amp;nbsp;/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&nbsp/g, ' ');

  // Strip HTML tags for the meta description
  const plainTextDescription = cleanDescription.replace(/<[^>]+>/g, '').substring(0, 150) + '...';

  // Calculate approximate reading time (average 200 words per minute)
  const wordCount = plainTextDescription.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));



  return (
    <div className="w-full bg-[#fafafa] flex flex-col min-h-screen font-sans">
      <Helmet>
        <title>{article.title} | Khmer America School News</title>
        <meta name="description" content={plainTextDescription} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={plainTextDescription} />
        <meta property="og:image" content={article.image} />
      </Helmet>

      {/* Inline style for Drop-Cap typography */}
      <style>{`
        .premium-article p:first-of-type::first-letter {
          font-size: 3.8rem;
          font-weight: 900;
          color: #1E3A8A;
          float: left;
          line-height: 0.9;
          margin-right: 0.65rem;
          margin-top: 0.15rem;
          font-family: 'Battambang', sans-serif;
        }
      `}</style>

      {/* Reading Progress Scrollbar */}
      <div className="fixed top-0 left-0 w-full h-[4px] z-50 bg-gray-100">
        <div 
          className="h-full bg-[#1E3A8A] transition-all duration-100"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Full-bleed cover Hero Section */}
      <div className="relative w-full h-[55vh] min-h-[450px] flex flex-col justify-end overflow-hidden">
        {/* Parallax background cover image */}
        <div 
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url(${article.image})` }}
        />
        {/* Soft blur visual filter overlay */}
        <div className="absolute inset-0 bg-black/50 z-10" />

        <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 w-full pb-24 text-white">
          <Link to="/news" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 font-bold transition-all hover:-translate-x-1 group text-sm">
            <ChevronLeft className="w-5 h-5" /> Back to News
          </Link>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-[#EBA525] text-white text-[10px] font-black uppercase tracking-widest rounded-full">
              Latest News
            </span>
            <div className="flex items-center gap-1.5 text-white/90 text-xs font-semibold">
              <Calendar className="w-4 h-4 text-[#EBA525]" />
              <span>{article.date}</span>
            </div>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight drop-shadow-md">
            {article.title}
          </h1>
        </div>
      </div>

      {/* Main Content Overlapping Card */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative -mt-16 z-20 w-full flex-grow mb-16">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-12">
          
          {/* Article Meta / Actions Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-6 mb-8 gap-4">
            <div className="flex items-center gap-3 text-gray-500 text-sm font-semibold">
              <BookOpen className="w-4 h-4 text-[#1E3A8A]" />
              <span>Reading time: {readingTime} min read</span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Share on</span>
              <div className="flex items-center gap-2">
                <a 
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100/50 transition-colors flex items-center justify-center cursor-pointer shadow-sm hover:shadow"
                  title="Share on Facebook"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                  </svg>
                </a>
                <a 
                  href={`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-600 border border-sky-100/50 transition-colors flex items-center justify-center cursor-pointer shadow-sm hover:shadow"
                  title="Share on Telegram"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-1-.65-.35-1 .22-1.58.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.93 1.23-5.46 3.62-.51.35-.98.53-1.39.51-.46-.01-1.33-.26-1.98-.47-.8-.26-1.43-.4-1.37-.85.03-.23.35-.47.96-.71 3.76-1.64 6.27-2.72 7.54-3.25 3.59-1.48 4.33-1.74 4.82-1.75.11 0 .35.03.51.16.13.11.17.26.19.37z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Render Rich Text Content with Drop-Cap class styling */}
          <div 
            className="prose prose-lg max-w-none text-gray-800 leading-relaxed prose-headings:text-[#1E3A8A] prose-a:text-[#D76918] hover:prose-a:text-[#1E3A8A] break-words premium-article text-justify"
            dangerouslySetInnerHTML={{ __html: cleanDescription }}
          />

        </div>
      </div>

      {/* "Read Next" Related Articles grid footer */}
      {recentNews.length > 0 && (
        <div className="bg-white border-t border-gray-100 py-16 mt-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full">
            <h3 className="text-2xl font-black text-gray-900 mb-8 tracking-tight flex items-center gap-3">
              <div className="w-2 h-6 bg-[#1E3A8A] rounded-full"></div>
              Read Next
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentNews.map((news) => (
                <Link 
                  to={`/news/${news.id}`} 
                  key={news.id} 
                  className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100/60 hover:shadow-lg transition-all duration-300 flex flex-col group cursor-pointer hover:-translate-y-1"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                    <img 
                      src={news.image} 
                      alt={news.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-grow gap-3 justify-between">
                    <h4 className="font-bold text-gray-800 leading-snug line-clamp-3 group-hover:text-[#1E3A8A] transition-colors text-sm sm:text-base">
                      {news.title}
                    </h4>
                    <span className="text-[10px] font-black text-[#EBA525] uppercase tracking-wider">{news.date}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default NewsDetailPage;
