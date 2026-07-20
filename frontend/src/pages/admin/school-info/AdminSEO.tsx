import React, { useState, useEffect } from 'react';
import { CheckCircle2, Save, Globe } from 'lucide-react';
import { settingsService } from '../../../services/settingsService';

const AdminSEO = () => {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Pages SEO State
  const [seoData, setSeoData] = useState({
    seo_title_home: '',
    seo_desc_home: '',
    seo_keywords_home: '',
    seo_title_about: '',
    seo_desc_about: '',
    seo_keywords_about: '',
    seo_title_programs: '',
    seo_desc_programs: '',
    seo_keywords_programs: '',
    seo_title_events: '',
    seo_desc_events: '',
    seo_keywords_events: '',
    seo_title_contact: '',
    seo_desc_contact: '',
    seo_keywords_contact: '',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchSEOSettings = async () => {
    try {
      const data = await settingsService.get();
      setSeoData({
        seo_title_home: data.seo_title_home || 'Khmer America School | Premium International Education',
        seo_desc_home: data.seo_desc_home || 'Welcome to Khmer America School in Phnom Penh. We provide high-quality bilingual education, nurturing young minds to become innovative global thinkers.',
        seo_keywords_home: data.seo_keywords_home || 'khmer america school, education cambodia, international school phnom penh, bilingual school',
        seo_title_about: data.seo_title_about || 'About Us | Khmer America School',
        seo_desc_about: data.seo_desc_about || 'Learn about the mission, vision, key features, and leadership history of Khmer America School.',
        seo_keywords_about: data.seo_keywords_about || 'about kas, school mission, education values cambodia',
        seo_title_programs: data.seo_title_programs || 'Academic Programs | Khmer America School',
        seo_desc_programs: data.seo_desc_programs || 'Explore our academic pathways including general education, computer science, and language programs.',
        seo_keywords_programs: data.seo_keywords_programs || 'school curriculum, general education khmer, language class phnom penh',
        seo_title_events: data.seo_title_events || 'School Events & Activities | Khmer America School',
        seo_desc_events: data.seo_desc_events || 'Stay updated with upcoming exhibitions, academic sports championships, and cultural holiday events at KAS.',
        seo_keywords_events: data.seo_keywords_events || 'school calendar, activities, events phnom penh',
        seo_title_contact: data.seo_title_contact || 'Contact Us | Khmer America School',
        seo_desc_contact: data.seo_desc_contact || 'Get in touch with the admissions and information office of Khmer America School.',
        seo_keywords_contact: data.seo_keywords_contact || 'contact school, location, telephone, email address',
      });
    } catch (err) {
      console.error('Failed to load SEO settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSEOSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await settingsService.save(seoData);
      showToast('SEO settings updated successfully!');
    } catch {
      showToast('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const pages = [
    { key: 'home', label: 'Home Page' },
    { key: 'about', label: 'About Us Page' },
    { key: 'programs', label: 'Programs Index' },
    { key: 'events', label: 'School Events Page' },
    { key: 'contact', label: 'Contact Us Page' },
  ] as const;

  return (
    <div className="relative font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[100] bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-fade-in-down font-sans">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">SEO Meta Tags Manager</h1>
          <p className="text-gray-500 mt-1">Configure search engine titles, keywords, and description metadata for public pages.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#1E3A8A] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
          {pages.map((page) => {
            const titleKey = `seo_title_${page.key}` as keyof typeof seoData;
            const descKey = `seo_desc_${page.key}` as keyof typeof seoData;
            const keywordsKey = `seo_keywords_${page.key}` as keyof typeof seoData;

            return (
              <div key={page.key} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-150 space-y-6">
                <h2 className="text-lg font-bold text-gray-900 border-b pb-3 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[#1E3A8A]" />
                  {page.label} SEO Configurations
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Meta Page Title</label>
                    <input
                      type="text"
                      required
                      value={seoData[titleKey]}
                      onChange={(e) => setSeoData({ ...seoData, [titleKey]: e.target.value })}
                      placeholder="e.g. Page Title | School Name"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] outline-none text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Meta Keywords (Comma separated)</label>
                    <input
                      type="text"
                      required
                      value={seoData[keywordsKey]}
                      onChange={(e) => setSeoData({ ...seoData, [keywordsKey]: e.target.value })}
                      placeholder="e.g. school, education, bilingual"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] outline-none text-gray-900 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Meta Description</label>
                    <textarea
                      required
                      rows={3}
                      value={seoData[descKey]}
                      onChange={(e) => setSeoData({ ...seoData, [descKey]: e.target.value })}
                      placeholder="Enter description snippet that appears on Google search results..."
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] outline-none text-gray-900 resize-none leading-relaxed text-sm"
                    />
                    <div className="flex justify-between items-center mt-1 text-xs text-gray-400">
                      <span>Recommended: 150-160 characters</span>
                      <span className="font-mono">{seoData[descKey].length} characters</span>
                    </div>
                  </div>

                  {/* Google Search Result Preview Simulator */}
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mt-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Google Search Snippet Preview</p>
                    <div className="space-y-1">
                      <p className="text-blue-800 text-lg hover:underline font-medium cursor-pointer truncate max-w-xl">{seoData[titleKey] || 'Please enter a title'}</p>
                      <p className="text-emerald-700 text-xs truncate max-w-xl">https://khmeramericaschool.edu.kh/{page.key === 'home' ? '' : page.key}</p>
                      <p className="text-gray-600 text-xs leading-relaxed max-w-2xl line-clamp-2">
                        {seoData[descKey] || 'Please enter a description to view the simulated search results snippet here.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Submit */}
          <div className="flex justify-end pt-4 border-t">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#1E3A8A] hover:bg-[#172554] text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-2.5 shadow-md active:scale-[0.98] transition-all disabled:opacity-75 cursor-pointer text-sm"
            >
              {isSubmitting ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Saving SEO Tagging...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save SEO Configurations
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AdminSEO;
