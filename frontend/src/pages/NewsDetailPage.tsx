import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronLeft } from 'lucide-react';
import { API_BASE_URL } from '../config';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/news`);
        const result = await res.json();
        const data = result.data || [];
        const found = data.find((item: Article) => item.id.toString() === id);
        if (found) {
          setArticle(found);
        }
      } catch (err) {
        console.error('Failed to fetch article', err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-[#9A2220] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col justify-center items-center gap-4">
        <h2 className="text-3xl font-bold text-gray-900">Article not found</h2>
        <Link to="/news" className="text-[#9A2220] font-medium hover:underline flex items-center gap-2">
          <ChevronLeft className="w-4 h-4" /> Back to News
        </Link>
      </div>
    );
  }

  // Strip HTML tags for the meta description
  const plainTextDescription = article.description.replace(/<[^>]+>/g, '').substring(0, 150) + '...';

  return (
    <div className="w-full bg-white flex flex-col min-h-screen font-sans">
      <Helmet>
        <title>{article.title} | Sovannaphumi School News</title>
        <meta name="description" content={plainTextDescription} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={plainTextDescription} />
        <meta property="og:image" content={article.image} />
      </Helmet>

      {/* Hero Section */}
      <div className="relative w-full h-[35vh] min-h-[300px] bg-gradient-to-r from-[#9A2220] via-[#D76918] to-[#EBA525] flex flex-col justify-end overflow-hidden pb-12">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 w-full">
          <Link to="/news" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 font-medium transition-colors">
            <ChevronLeft className="w-5 h-5" /> Back to News
          </Link>
          <div className="inline-block px-3 py-1 bg-[#EBA525] text-white text-sm font-bold rounded-full mb-4">
            {article.date}
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-md leading-tight">
            {article.title}
          </h1>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16 w-full flex-grow">
        <img 
          src={article.image} 
          alt={article.title} 
          className="w-full rounded-2xl shadow-lg mb-12 max-h-[500px] object-cover"
        />
        
        {/* Render Rich Text Content */}
        <div 
          className="prose prose-lg max-w-none text-gray-800 leading-relaxed prose-headings:text-[#9A2220] prose-a:text-[#D76918] hover:prose-a:text-[#9A2220]"
          dangerouslySetInnerHTML={{ __html: article.description }}
        />
      </div>
    </div>
  );
};

export default NewsDetailPage;
