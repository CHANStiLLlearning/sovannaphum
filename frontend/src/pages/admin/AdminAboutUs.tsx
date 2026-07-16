import React, { useState, useEffect } from 'react';
import { CheckCircle2, Image as ImageIcon, Save, Info, Target, Eye } from 'lucide-react';
import { API_BASE_URL } from '../../config';

const AdminAboutUs = () => {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    about_hero_title: '',
    about_hero_image: '',
    about_mission_title: '',
    about_mission_desc: '',
    about_vision_title: '',
    about_vision_desc: '',
    mgmt_name: '',
    mgmt_title: '',
    mgmt_photo: '',
    mgmt_welcome_title: '',
    mgmt_message_1: '',
    mgmt_message_2: '',
    mgmt_message_3: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [mgmtPhotoFile, setMgmtPhotoFile] = useState<File | null>(null);

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
          about_hero_title: data.about_hero_title || 'About Us',
          about_hero_image: data.about_hero_image || '',
          about_mission_title: data.about_mission_title || 'Our Mission',
          about_mission_desc: data.about_mission_desc || '',
          about_vision_title: data.about_vision_title || 'Our Vision',
          about_vision_desc: data.about_vision_desc || '',
          mgmt_name: data.mgmt_name || 'Mr. CHAN',
          mgmt_title: data.mgmt_title || 'Chief Executive Officer',
          mgmt_photo: data.mgmt_photo || '',
          mgmt_welcome_title: data.mgmt_welcome_title || 'Welcome to Khmer America School',
          mgmt_message_1: data.mgmt_message_1 || '',
          mgmt_message_2: data.mgmt_message_2 || '',
          mgmt_message_3: data.mgmt_message_3 || '',
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
    let uploadedImageUrl = formData.about_hero_image;
    let uploadedMgmtPhotoUrl = formData.mgmt_photo;

    try {
      // 1. Handle hero image upload if a file was chosen
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

      // 2. Handle management photo upload if a file was chosen
      if (mgmtPhotoFile) {
        const uploadData = new FormData();
        uploadData.append('image', mgmtPhotoFile);
        const uploadRes = await fetch(`${API_BASE_URL}/api/upload`, { method: 'POST', body: uploadData });
        if (uploadRes.ok) {
          const uploadResult = await uploadRes.json();
          uploadedMgmtPhotoUrl = uploadResult.url;
        } else {
          showToast('Management photo upload failed');
          setIsSubmitting(false);
          return;
        }
      }

      // 2. Save settings to DB
      const finalSettings = {
        ...formData,
        about_hero_image: uploadedImageUrl,
        mgmt_photo: uploadedMgmtPhotoUrl,
      };

      const saveRes = await fetch(`${API_BASE_URL}/api/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalSettings),
      });

      if (saveRes.ok) {
        showToast('Settings saved successfully!');
        setImageFile(null);
        setMgmtPhotoFile(null);
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
          <h1 className="text-3xl font-bold text-gray-800">About Us Page Settings</h1>
          <p className="text-gray-500 mt-1">Configure banner images, missions, and visions for the school profile page.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#9A2220] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8 font-sans max-w-4xl">
          {/* Hero Section Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-150 space-y-6">
            <h2 className="text-lg font-bold text-gray-900 border-b pb-3 flex items-center gap-2">
              <Info className="w-5 h-5 text-[#9A2220]" />
              Hero Banner Section
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Hero Title</label>
                <input
                  type="text"
                  required
                  value={formData.about_hero_title}
                  onChange={(e) => setFormData({ ...formData, about_hero_title: e.target.value })}
                  placeholder="e.g. About Us"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9A2220] outline-none text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Banner Background Image</label>
                <div className="flex gap-4 items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="w-24 h-16 bg-gray-200 border border-gray-300 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                    {imageFile ? (
                      <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-full h-full object-cover" />
                    ) : formData.about_hero_image ? (
                      <img src={formData.about_hero_image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 w-full">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => { if (e.target.files?.[0]) setImageFile(e.target.files[0]); }}
                      className="text-xs text-gray-500 cursor-pointer w-full file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#9A2220]/10 file:text-[#9A2220] hover:file:bg-[#9A2220]/20 file:cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mission Card Settings */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-150 space-y-6">
            <h2 className="text-lg font-bold text-gray-900 border-b pb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-[#9A2220]" />
              Our Mission Statement
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Card Title</label>
                <input
                  type="text"
                  required
                  value={formData.about_mission_title}
                  onChange={(e) => setFormData({ ...formData, about_mission_title: e.target.value })}
                  placeholder="e.g. Our Mission"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9A2220] outline-none text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mission Description</label>
                <textarea
                  required
                  rows={4}
                  value={formData.about_mission_desc}
                  onChange={(e) => setFormData({ ...formData, about_mission_desc: e.target.value })}
                  placeholder="Write the school mission statement..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9A2220] outline-none text-gray-900 resize-none leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Vision Card Settings */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-150 space-y-6">
            <h2 className="text-lg font-bold text-gray-900 border-b pb-3 flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#EBA525]" />
              Our Vision Statement
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Card Title</label>
                <input
                  type="text"
                  required
                  value={formData.about_vision_title}
                  onChange={(e) => setFormData({ ...formData, about_vision_title: e.target.value })}
                  placeholder="e.g. Our Vision"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9A2220] outline-none text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Vision Description</label>
                <textarea
                  required
                  rows={4}
                  value={formData.about_vision_desc}
                  onChange={(e) => setFormData({ ...formData, about_vision_desc: e.target.value })}
                  placeholder="Write the school vision statement..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9A2220] outline-none text-gray-900 resize-none leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Management Team Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-150 space-y-6">
            <h2 className="text-lg font-bold text-gray-900 border-b pb-3 flex items-center gap-2">
              <Info className="w-5 h-5 text-[#9A2220]" />
              Management Team Section
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.mgmt_name}
                  onChange={(e) => setFormData({ ...formData, mgmt_name: e.target.value })}
                  placeholder="e.g. Mr. CHAN"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9A2220] outline-none text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title / Position</label>
                <input
                  type="text"
                  value={formData.mgmt_title}
                  onChange={(e) => setFormData({ ...formData, mgmt_title: e.target.value })}
                  placeholder="e.g. Chief Executive Officer"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9A2220] outline-none text-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Welcome Title</label>
              <input
                type="text"
                value={formData.mgmt_welcome_title}
                onChange={(e) => setFormData({ ...formData, mgmt_welcome_title: e.target.value })}
                placeholder="e.g. Welcome to Khmer America School"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9A2220] outline-none text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Profile Photo</label>
              <div className="flex gap-4 items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="w-16 h-16 rounded-full bg-gray-200 border border-gray-300 overflow-hidden shrink-0 flex items-center justify-center">
                  {mgmtPhotoFile ? (
                    <img src={URL.createObjectURL(mgmtPhotoFile)} alt="Preview" className="w-full h-full object-cover" />
                  ) : formData.mgmt_photo ? (
                    <img src={formData.mgmt_photo} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => { if (e.target.files?.[0]) setMgmtPhotoFile(e.target.files[0]); }}
                  className="text-xs text-gray-500 cursor-pointer w-full file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#9A2220]/10 file:text-[#9A2220] hover:file:bg-[#9A2220]/20 file:cursor-pointer"
                />
              </div>
            </div>

            {(['mgmt_message_1', 'mgmt_message_2', 'mgmt_message_3'] as const).map((key, i) => (
              <div key={key}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message Paragraph {i + 1}</label>
                <textarea
                  rows={3}
                  value={formData[key]}
                  onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                  placeholder={`Paragraph ${i + 1}...`}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9A2220] outline-none text-gray-900 resize-none leading-relaxed"
                />
              </div>
            ))}
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-4 border-t">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#9A2220] hover:bg-[#8A1A18] text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-2.5 shadow-md active:scale-[0.98] transition-all disabled:opacity-75 cursor-pointer text-sm"
            >
              {isSubmitting ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Saving Settings...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save About Us Settings
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AdminAboutUs;
