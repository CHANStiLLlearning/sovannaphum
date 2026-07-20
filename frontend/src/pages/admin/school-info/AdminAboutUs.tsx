import React, { useState, useEffect } from 'react';
import { CheckCircle2, Image as ImageIcon, Save, Info, Target, Eye, Trash2, Edit2, Star, Sparkles } from 'lucide-react';
import { API_BASE_URL } from '../../../config';

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

  // Dynamic Key Features States
  const [features, setFeatures] = useState<any[]>([]);
  const [isEditingFeature, setIsEditingFeature] = useState(false);
  const [featureForm, setFeatureForm] = useState({
    id: 0,
    title: '',
    description: '',
    iconName: 'classroom-management',
    bgColor: 'bg-blue-500/10 text-blue-600 border-blue-100',
  });
  const [featureSubmitting, setFeatureSubmitting] = useState(false);

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

  const fetchFeatures = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/features`);
      if (res.ok) {
        const data = await res.json();
        setFeatures(data || []);
      }
    } catch (err) {
      console.error('Failed to load features:', err);
    }
  };

  const handleSaveFeature = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeatureSubmitting(true);
    try {
      const url = isEditingFeature
        ? `${API_BASE_URL}/api/features/${featureForm.id}`
        : `${API_BASE_URL}/api/features`;
      const method = isEditingFeature ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: featureForm.title,
          description: featureForm.description,
          iconName: featureForm.iconName,
          bgColor: featureForm.bgColor,
        }),
      });

      if (res.ok) {
        showToast(isEditingFeature ? 'Feature updated successfully!' : 'Feature created successfully!');
        setFeatureForm({ id: 0, title: '', description: '', iconName: 'classroom-management', bgColor: 'bg-blue-500/10 text-blue-600 border-blue-100' });
        setIsEditingFeature(false);
        fetchFeatures();
      } else {
        showToast('Failed to save feature');
      }
    } catch (err) {
      showToast('An error occurred');
    } finally {
      setFeatureSubmitting(false);
    }
  };

  const handleDeleteFeature = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this feature?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/features/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        showToast('Feature deleted successfully!');
        fetchFeatures();
      } else {
        showToast('Failed to delete feature');
      }
    } catch (err) {
      showToast('An error occurred');
    }
  };

  useEffect(() => {
    fetchSettings();
    fetchFeatures();
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
          <div className="w-8 h-8 border-4 border-[#1E3A8A] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
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
                  value={formData.about_hero_title}
                  onChange={(e) => setFormData({ ...formData, about_hero_title: e.target.value })}
                  placeholder="e.g. About Us"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] outline-none text-gray-900"
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
                      className="text-xs text-gray-500 cursor-pointer w-full file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#1E3A8A]/10 file:text-[#1E3A8A] hover:file:bg-[#1E3A8A]/20 file:cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mission Card Settings */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-150 space-y-6">
            <h2 className="text-lg font-bold text-gray-900 border-b pb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-[#1E3A8A]" />
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
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] outline-none text-gray-900"
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
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] outline-none text-gray-900 resize-none leading-relaxed"
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
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] outline-none text-gray-900"
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
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] outline-none text-gray-900 resize-none leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Management Team Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-150 space-y-6">
            <h2 className="text-lg font-bold text-gray-900 border-b pb-3 flex items-center gap-2">
              <Info className="w-5 h-5 text-[#1E3A8A]" />
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
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] outline-none text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title / Position</label>
                <input
                  type="text"
                  value={formData.mgmt_title}
                  onChange={(e) => setFormData({ ...formData, mgmt_title: e.target.value })}
                  placeholder="e.g. Chief Executive Officer"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] outline-none text-gray-900"
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
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] outline-none text-gray-900"
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
                  className="text-xs text-gray-500 cursor-pointer w-full file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#1E3A8A]/10 file:text-[#1E3A8A] hover:file:bg-[#1E3A8A]/20 file:cursor-pointer"
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
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] outline-none text-gray-900 resize-none leading-relaxed"
                />
              </div>
            ))}
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
                  Save About Us Settings
                </>
              )}
            </button>
          </div>
        </form>

        {/* Dynamic Key Features CRUD Panel */}
        <div className="mt-12 bg-white rounded-2xl p-6 shadow-sm border border-gray-150 space-y-6 font-sans max-w-4xl">
          <h2 className="text-lg font-bold text-gray-900 border-b pb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#1E3A8A]" />
            Manage Key School Features
          </h2>

          {/* Form to add/edit features */}
          <form onSubmit={handleSaveFeature} className="bg-gray-50/50 border border-gray-200/50 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider">
              {isEditingFeature ? 'Edit Key Feature' : 'Create New Key Feature'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Feature Title</label>
                <input
                  type="text"
                  required
                  value={featureForm.title}
                  onChange={(e) => setFeatureForm({ ...featureForm, title: e.target.value })}
                  placeholder="e.g. Classroom Management"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm text-gray-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Icon Style</label>
                <select
                  value={featureForm.iconName}
                  onChange={(e) => setFeatureForm({ ...featureForm, iconName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm text-gray-700 bg-white"
                >
                  <option value="classroom-management">Classroom Management Icon</option>
                  <option value="exam">Exam & Assessments Icon</option>
                  <option value="payment">Flexible Payments Icon</option>
                  <option value="student-regi">Student Registration Icon</option>
                  <option value="setting">Advanced Settings Icon</option>
                  <option value="star">Default Star Icon</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Theme (Background & Border)</label>
                <select
                  value={featureForm.bgColor}
                  onChange={(e) => setFeatureForm({ ...featureForm, bgColor: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm text-gray-700 bg-white"
                >
                  <option value="bg-blue-500/10 text-blue-600 border-blue-100">Blue Theme</option>
                  <option value="bg-amber-500/10 text-amber-600 border-amber-100">Amber Theme</option>
                  <option value="bg-emerald-500/10 text-emerald-600 border-emerald-100">Emerald Theme</option>
                  <option value="bg-[#1E3A8A]/10 text-[#1E3A8A] border-[#1E3A8A]/20">Royal Blue Theme</option>
                  <option value="bg-purple-500/10 text-purple-600 border-purple-100">Purple Theme</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
              <textarea
                required
                rows={2}
                value={featureForm.description}
                onChange={(e) => setFeatureForm({ ...featureForm, description: e.target.value })}
                placeholder="Briefly describe this school feature..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm text-gray-900 resize-none leading-relaxed bg-white"
              />
            </div>

            <div className="flex justify-end gap-3">
              {isEditingFeature && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingFeature(false);
                    setFeatureForm({ id: 0, title: '', description: '', iconName: 'classroom-management', bgColor: 'bg-blue-500/10 text-blue-600 border-blue-100' });
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-150 transition-colors text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={featureSubmitting}
                className="bg-[#1E3A8A] hover:bg-[#172554] text-white px-5 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-70 text-xs shrink-0 cursor-pointer"
              >
                {featureSubmitting ? 'Saving...' : (isEditingFeature ? 'Update Feature' : 'Create Feature')}
              </button>
            </div>
          </form>

          {/* List of active features */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider">
              Active Key Features ({features.length})
            </h3>
            
            {features.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6 font-sans">No key features defined. Add one above.</p>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {features.map((feature) => (
                  <div key={feature.id} className="flex items-start justify-between p-4 bg-gray-50/50 border border-gray-200/60 rounded-xl hover:shadow-sm transition-shadow">
                    <div className="flex gap-4 items-start">
                      <div className={`w-10 h-10 shrink-0 rounded-lg ${feature.bgColor} border flex items-center justify-center`}>
                        <Star className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 text-sm">{feature.title}</h4>
                        <p className="text-gray-500 text-xs mt-1 leading-relaxed">{feature.description}</p>
                        <div className="flex gap-2 mt-2">
                          <span className="text-[10px] bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded uppercase">Icon: {feature.iconName}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingFeature(true);
                          setFeatureForm({
                            id: feature.id,
                            title: feature.title,
                            description: feature.description,
                            iconName: feature.iconName,
                            bgColor: feature.bgColor,
                          });
                        }}
                        className="p-1.5 text-gray-500 hover:text-[#1E3A8A] hover:bg-gray-150 rounded-lg transition-colors cursor-pointer"
                        title="Edit Feature"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteFeature(feature.id)}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Feature"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        </>
      )}
    </div>
  );
};

export default AdminAboutUs;
