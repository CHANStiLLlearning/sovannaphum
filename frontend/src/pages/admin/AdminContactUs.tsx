import React, { useState, useEffect } from 'react';
import { CheckCircle2, Save, Info, Phone, Share2, MapPin, Image as ImageIcon } from 'lucide-react';
import { API_BASE_URL } from '../../config';

const AdminContactUs = () => {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    contact_hero_title: '',
    contact_hero_subtitle: '',
    contact_hero_image: '',
    contact_phone: '',
    contact_email: '',
    contact_telegram: '',
    contact_address: '',
    contact_linkedin: '',
    contact_facebook: '',
    contact_instagram: '',
    contact_tiktok: '',
    contact_map_iframe: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/settings`);
      if (res.ok) {
        const data = await res.json();
        setFormData({
          contact_hero_title: data.contact_hero_title || 'Contact Us',
          contact_hero_subtitle: data.contact_hero_subtitle || 'Get in touch with Khmer America School',
          contact_hero_image: data.contact_hero_image || '',
          contact_phone: data.contact_phone || '',
          contact_email: data.contact_email || '',
          contact_telegram: data.contact_telegram || '',
          contact_address: data.contact_address || '',
          contact_linkedin: data.contact_linkedin || '',
          contact_facebook: data.contact_facebook || '',
          contact_instagram: data.contact_instagram || '',
          contact_tiktok: data.contact_tiktok || '',
          contact_map_iframe: data.contact_map_iframe || '',
        });
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    let uploadedImageUrl = formData.contact_hero_image;

    try {
      // 1. Handle image upload if a file was chosen
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

      // 2. Save settings to DB
      const finalSettings = {
        ...formData,
        contact_hero_image: uploadedImageUrl,
      };

      const res = await fetch(`${API_BASE_URL}/api/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalSettings),
      });

      if (res.ok) {
        showToast('Settings saved successfully!');
        setImageFile(null);
        fetchSettings();
      } else {
        showToast('Failed to save settings');
      }
    } catch (err) {
      console.error(err);
      showToast('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[100] bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-fade-in-down font-sans">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-8 gap-4 font-sans">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Contact Us Page Settings</h1>
          <p className="text-gray-500 mt-1">Configure contact numbers, physical address, map link, and social page tags.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#1E3A8A] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8 font-sans max-w-4xl">
          {/* Hero Section Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-150 space-y-6">
            <h2 className="text-lg font-bold text-gray-900 border-b pb-3 flex items-center gap-2">
              <Info className="w-5 h-5 text-[#1E3A8A]" />
              Hero Banner Section
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Hero Title</label>
                <input
                  type="text"
                  required
                  value={formData.contact_hero_title}
                  onChange={(e) => setFormData({ ...formData, contact_hero_title: e.target.value })}
                  placeholder="e.g. Contact Us"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] outline-none text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Hero Subtitle</label>
                <input
                  type="text"
                  required
                  value={formData.contact_hero_subtitle}
                  onChange={(e) => setFormData({ ...formData, contact_hero_subtitle: e.target.value })}
                  placeholder="e.g. Get in touch with Khmer America School"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] outline-none text-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Banner Background Image</label>
              <div className="flex gap-4 items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="w-24 h-16 bg-gray-200 border border-gray-300 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                  {imageFile ? (
                    <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-full h-full object-cover" />
                  ) : formData.contact_hero_image ? (
                    <img src={formData.contact_hero_image} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 w-full">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => { if (e.target.files?.[0]) setImageFile(e.target.files[0]); }}
                    className="text-xs text-gray-500 cursor-pointer w-full file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#1E3A8A]/10 file:text-[#1E3A8A] hover:file:bg-[#1E3A8A]/20 file:cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Core Channels Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-150 space-y-6">
            <h2 className="text-lg font-bold text-gray-900 border-b pb-3 flex items-center gap-2">
              <Phone className="w-5 h-5 text-[#1E3A8A]" />
              Core Channels Info
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Phone</label>
                <input
                  type="text"
                  required
                  value={formData.contact_phone}
                  onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                  placeholder="e.g. (+855) 15 838 015"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] outline-none text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Email</label>
                <input
                  type="email"
                  required
                  value={formData.contact_email}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  placeholder="e.g. info@khmeramericaschool.edu.kh"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] outline-none text-gray-900 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Telegram Handle / Link</label>
                <input
                  type="text"
                  required
                  value={formData.contact_telegram}
                  onChange={(e) => setFormData({ ...formData, contact_telegram: e.target.value })}
                  placeholder="e.g. t.me/khmeramericaschoolcambodia"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] outline-none text-gray-900 font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Physical Campus Address</label>
              <textarea
                required
                rows={2}
                value={formData.contact_address}
                onChange={(e) => setFormData({ ...formData, contact_address: e.target.value })}
                placeholder="Write the physical school address..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] outline-none text-gray-900 resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Social Links Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-150 space-y-6">
            <h2 className="text-lg font-bold text-gray-900 border-b pb-3 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-[#EBA525]" />
              Social Handles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">LinkedIn Name</label>
                <input
                  type="text"
                  required
                  value={formData.contact_linkedin}
                  onChange={(e) => setFormData({ ...formData, contact_linkedin: e.target.value })}
                  placeholder="e.g. @khmeramericaschoolcambodia"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] outline-none text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Facebook Name</label>
                <input
                  type="text"
                  required
                  value={formData.contact_facebook}
                  onChange={(e) => setFormData({ ...formData, contact_facebook: e.target.value })}
                  placeholder="e.g. Khmer America School, Cambodia"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] outline-none text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Instagram Name</label>
                <input
                  type="text"
                  required
                  value={formData.contact_instagram}
                  onChange={(e) => setFormData({ ...formData, contact_instagram: e.target.value })}
                  placeholder="e.g. @khmeramericaschool"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] outline-none text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">TikTok Name</label>
                <input
                  type="text"
                  required
                  value={formData.contact_tiktok}
                  onChange={(e) => setFormData({ ...formData, contact_tiktok: e.target.value })}
                  placeholder="e.g. @khmeramericaschool"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] outline-none text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Map Location Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-150 space-y-6">
            <h2 className="text-lg font-bold text-gray-900 border-b pb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Google Map Settings
            </h2>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Map Iframe Source URL (src)</label>
              <textarea
                required
                rows={3}
                value={formData.contact_map_iframe}
                onChange={(e) => setFormData({ ...formData, contact_map_iframe: e.target.value })}
                placeholder="https://www.google.com/maps/embed?pb=..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] outline-none text-gray-900 font-mono text-xs resize-none"
              />
              <p className="text-[10px] text-gray-400 mt-2">Paste the google maps source path (the src attribute inside the iframe tag).</p>
            </div>
          </div>

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
                  Saving Settings...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Contact Settings
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AdminContactUs;
