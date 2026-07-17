import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, CheckCircle2 } from 'lucide-react';
import { API_BASE_URL } from '../../config';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

type Article = {
  id: number;
  title: string;
  image: string;
  date: string;
  description: string;
};

const AdminNews = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination & Search
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState({ title: '', image: '', date: '', description: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Delete Confirmation Modal state
  const [articleToDelete, setArticleToDelete] = useState<number | null>(null);
  
  // Toast Message State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const fetchNews = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/news?page=${page}&limit=10&search=${encodeURIComponent(searchQuery)}`);
      const result = await res.json();
      setArticles(result.data || []);
      setTotalPages(result?.pagination?.totalPages || 1);
    } catch (err) {
      // Silently handle
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [page, searchQuery]);

  const handleOpenModal = (article?: Article) => {
    if (article) {
      setEditingArticle(article);
      setFormData({ title: article.title, image: article.image, date: article.date, description: article.description || '' });
    } else {
      setEditingArticle(null);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const today = new Date();
      const formattedDate = `${months[today.getMonth()]} ${String(today.getDate()).padStart(2, '0')}, ${today.getFullYear()}`;
      setFormData({ title: '', image: '', date: formattedDate, description: '' });
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingArticle(null);
    setImageFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    let uploadedImageUrl = formData.image;

    try {
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('image', imageFile);
        
        const uploadRes = await fetch(`${API_BASE_URL}/api/upload`, {
          method: 'POST',
          body: uploadData,
        });
        
        if (uploadRes.ok) {
          const uploadResult = await uploadRes.json();
          uploadedImageUrl = uploadResult.url;
        } else {
          showToast('Image upload failed');
          setIsSubmitting(false);
          return;
        }
      }

      const url = editingArticle 
        ? `${API_BASE_URL}/api/news/${editingArticle.id}` 
        : `${API_BASE_URL}/api/news`;
      
      const method = editingArticle ? 'PUT' : 'POST';

      const finalData = { ...formData, image: uploadedImageUrl };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData)
      });
      if (res.ok) {
        handleCloseModal();
        fetchNews();
        showToast(editingArticle ? 'Article updated successfully!' : 'Article created successfully!');
      }
    } catch (err) {
      // Silently handle
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (articleToDelete === null) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/news/${articleToDelete}`, { method: 'DELETE' });
      if (res.ok) {
        setArticleToDelete(null);
        fetchNews();
        showToast('Article deleted successfully!');
      }
    } catch (err) {
      // Silently handle
    }
  };

  return (
    <div className="relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[100] bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-fade-in-down">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">News Management</h1>
          <p className="text-gray-500 mt-1">Add, edit, or remove news articles.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Search news..." 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] outline-none text-sm w-full sm:w-64"
          />
          <button 
            onClick={() => handleOpenModal()}
            className="bg-[#1E3A8A] hover:bg-[#172554] text-white px-5 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
          >
            <Plus className="w-5 h-5" /> Add Article
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-xs">
                  <th className="p-5 font-semibold w-24">ID</th>
                  <th className="p-5 font-semibold">Title</th>
                  <th className="p-5 font-semibold">Date</th>
                  <th className="p-5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="p-5 align-middle">
                      <div className="h-4 bg-gray-200 rounded w-10"></div>
                    </td>
                    <td className="p-5 align-middle">
                      <div className="h-4 bg-gray-200 rounded-md w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded-md w-1/2"></div>
                    </td>
                    <td className="p-5 align-middle">
                      <div className="h-6 bg-gray-200 rounded-full w-24"></div>
                    </td>
                    <td className="p-5 align-middle text-right whitespace-nowrap">
                      <div className="flex justify-end gap-2">
                        <div className="w-9 h-9 bg-gray-200 rounded-lg"></div>
                        <div className="w-9 h-9 bg-gray-200 rounded-lg"></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-xs">
                  <th className="p-5 font-semibold w-24">ID</th>
                  <th className="p-5 font-semibold">Title</th>
                  <th className="p-5 font-semibold">Date</th>
                  <th className="p-5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {articles.length === 0 ? (
                  <tr><td colSpan={4} className="p-10 text-center text-gray-500 italic">No news articles found.</td></tr>
                ) : (
                  articles.map((article, idx) => {
                    const serialNum = (page - 1) * 10 + (idx + 1);
                    return (
                      <tr key={article.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="p-5 align-middle">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gray-50 text-gray-600 text-xs font-mono font-bold border border-gray-200">
                            {String(serialNum).padStart(4, '0')}
                          </span>
                        </td>
                        <td className="p-5 align-middle">
                          <p className="font-bold text-gray-800 line-clamp-2 max-w-md">{article.title}</p>
                        </td>
                        <td className="p-5 align-middle">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium whitespace-nowrap">
                            {article.date}
                          </span>
                        </td>
                        <td className="p-5 align-middle text-right whitespace-nowrap">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => handleOpenModal(article)} className="p-2 text-blue-600 hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors focus:ring-2 focus:ring-blue-200 outline-none" title="Edit Article">
                              <Edit className="w-5 h-5" />
                            </button>
                            <button onClick={() => setArticleToDelete(article.id)} className="p-2 text-blue-600 hover:bg-blue-100 hover:text-red-700 rounded-lg transition-colors focus:ring-2 focus:ring-blue-200 outline-none" title="Delete Article">
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
              <span className="text-sm text-gray-600">
                Page <span className="font-semibold text-gray-900">{page}</span> of <span className="font-semibold text-gray-900">{totalPages}</span>
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white text-gray-700"
                >
                  Previous
                </button>
                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white text-gray-700"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {articleToDelete !== null && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl relative">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-center text-gray-900 mb-2">Delete Article?</h2>
            <p className="text-center text-gray-500 mb-6">Are you sure you want to permanently delete this news article? This action cannot be undone.</p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setArticleToDelete(null)} 
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete} 
                className="flex-1 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl relative">
            <h2 className="text-2xl font-bold mb-6">{editingArticle ? 'Edit Article' : 'Add New Article'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input 
                  type="text" required
                  value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] outline-none text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Article Image</label>
                {formData.image && !imageFile && (
                  <div className="mb-2">
                    <img src={formData.image} alt="Current Preview" className="h-20 rounded border border-gray-200" />
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={e => {
                    if (e.target.files && e.target.files.length > 0) {
                      setImageFile(e.target.files[0]);
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] outline-none text-gray-900 bg-white"
                  required={!editingArticle && !imageFile}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date (e.g., Jul 01, 2026)</label>
                <input 
                  type="text" required
                  value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] outline-none text-gray-900"
                />
              </div>
              <div className="pb-10">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description / Content</label>
                <ReactQuill 
                  theme="snow"
                  value={formData.description} 
                  onChange={content => setFormData({...formData, description: content})}
                  className="bg-white text-gray-900 h-48 mb-8"
                />
              </div>
              
              <div className="flex gap-3 pt-4 border-t mt-6">
                <button type="button" onClick={handleCloseModal} className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-2.5 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#172554] transition-colors font-medium disabled:opacity-70">
                  {isSubmitting ? 'Saving...' : (editingArticle ? 'Save Changes' : 'Create Article')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNews;
