import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, CheckCircle2, BookOpen, Globe, MessageSquare, Languages, Image as ImageIcon } from 'lucide-react';
import { API_BASE_URL } from '../../../config';

type Program = {
  id: number;
  title: string;
  description: string;
  path: string;
  iconName: string;
  colorClass: string;
  ageRange?: string;
  gradeLevel?: string;
  image?: string;
};

const iconOptions = [
  { value: 'book-open', label: 'Book / Education', component: <BookOpen className="w-4 h-4" /> },
  { value: 'globe', label: 'Globe / International', component: <Globe className="w-4 h-4" /> },
  { value: 'message-square', label: 'Message / Conversation', component: <MessageSquare className="w-4 h-4" /> },
  { value: 'languages', label: 'Languages / Translation', component: <Languages className="w-4 h-4" /> },
];

const colorOptions = [
  { value: 'bg-blue-50/70 text-blue-600 border border-blue-100/50', label: 'Blue Theme' },
  { value: 'bg-amber-50/70 text-amber-500 border border-amber-100/50', label: 'Amber Theme' },
  { value: 'bg-emerald-50/70 text-emerald-600 border border-emerald-100/50', label: 'Emerald Theme' },
  { value: 'bg-blue-50/70 text-[#1E3A8A] border border-blue-100/50', label: 'Burgundy Theme' },
  { value: 'bg-violet-50/70 text-violet-600 border border-violet-100/50', label: 'Violet Theme' },
  { value: 'bg-blue-50/70 text-blue-600 border border-rose-100/50', label: 'Rose Theme' },
];

const AdminPrograms = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    path: '',
    iconName: 'book-open',
    colorClass: 'bg-blue-50/70 text-blue-600 border border-blue-100/50',
    ageRange: '3 - 18 Years',
    gradeLevel: 'Nursery - Grade 12',
    image: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Confirmation State
  const [programToDelete, setProgramToDelete] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Programs Page Header Settings
  const [programSettings, setProgramSettings] = useState({
    program_hero_title: 'Academic Programs',
    program_hero_image: '',
  });
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchProgramSettings = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/settings`);
      if (res.ok) {
        const data = await res.json();
        setProgramSettings({
          program_hero_title: data.program_hero_title || 'Academic Programs',
          program_hero_image: data.program_hero_image || '',
        });
      }
    } catch (err) {
      console.error('Failed to load program settings:', err);
    }
  };

  const handleSaveProgramSettings = async () => {
    setIsSavingSettings(true);
    let uploadedImageUrl = programSettings.program_hero_image;
    try {
      if (bannerFile) {
        const uploadData = new FormData();
        uploadData.append('image', bannerFile);
        const uploadRes = await fetch(`${API_BASE_URL}/api/upload`, { method: 'POST', body: uploadData });
        if (uploadRes.ok) {
          const uploadResult = await uploadRes.json();
          uploadedImageUrl = uploadResult.url;
        } else {
          showToast('Banner image upload failed');
          setIsSavingSettings(false);
          return;
        }
      }
      const res = await fetch(`${API_BASE_URL}/api/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...programSettings, program_hero_image: uploadedImageUrl }),
      });
      if (res.ok) {
        showToast('Programs header saved successfully!');
        setBannerFile(null);
        fetchProgramSettings();
      } else {
        showToast('Failed to save header settings');
      }
    } catch {
      showToast('An error occurred');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const fetchPrograms = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/programs`);
      if (!res.ok) throw new Error('Failed to load programs');
      const data = await res.json();
      setPrograms(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
    fetchProgramSettings();
  }, []);

  const handleOpenModal = (program?: Program) => {
    setImageFile(null);
    if (program) {
      setEditingProgram(program);
      setFormData({
        title: program.title,
        description: program.description,
        path: program.path,
        iconName: program.iconName,
        colorClass: program.colorClass,
        ageRange: program.ageRange || '3 - 18 Years',
        gradeLevel: program.gradeLevel || 'Nursery - Grade 12',
        image: program.image || '',
      });
    } else {
      setEditingProgram(null);
      setFormData({
        title: '',
        description: '',
        path: '/programs',
        iconName: 'book-open',
        colorClass: 'bg-blue-50/70 text-blue-600 border border-blue-100/50',
        ageRange: '3 - 18 Years',
        gradeLevel: 'Nursery - Grade 12',
        image: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProgram(null);
    setImageFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let uploadedImageUrl = formData.image;
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('image', imageFile);
        const uploadRes = await fetch(`${API_BASE_URL}/api/upload`, { method: 'POST', body: uploadData });
        if (uploadRes.ok) {
          const uploadResult = await uploadRes.json();
          uploadedImageUrl = uploadResult.url;
        } else {
          showToast('Image upload failed');
          setIsSubmitting(false);
          return;
        }
      }

      const url = editingProgram
        ? `${API_BASE_URL}/api/programs/${editingProgram.id}`
        : `${API_BASE_URL}/api/programs`;
      const method = editingProgram ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, image: uploadedImageUrl }),
      });

      if (res.ok) {
        handleCloseModal();
        fetchPrograms();
        showToast(editingProgram ? 'Program updated successfully!' : 'Program added successfully!');
      } else {
        showToast('Failed to save program');
      }
    } catch (err) {
      console.error(err);
      showToast('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (programToDelete === null) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/programs/${programToDelete}`, { method: 'DELETE' });
      if (res.ok) {
        setProgramToDelete(null);
        fetchPrograms();
        showToast('Program deleted successfully!');
      } else {
        showToast('Failed to delete program');
      }
    } catch (err) {
      console.error(err);
      showToast('An error occurred');
    }
  };

  const resolveIcon = (name: string, classes = 'w-5 h-5') => {
    switch (name) {
      case 'globe':
        return <Globe className={classes} />;
      case 'message-square':
        return <MessageSquare className={classes} />;
      case 'languages':
        return <Languages className={classes} />;
      case 'book-open':
      default:
        return <BookOpen className={classes} />;
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

      {/* Programs Page Header Settings Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-150 mb-8 space-y-6 font-sans">
        <h2 className="text-lg font-bold text-gray-900 border-b pb-3 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#1E3A8A]" />
          Programs Page Header Settings
        </h2>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Hero Title</label>
          <input
            type="text"
            value={programSettings.program_hero_title}
            onChange={(e) => setProgramSettings({ ...programSettings, program_hero_title: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] outline-none text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Banner Background Image</label>
          <div className="flex gap-4 items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div className="w-24 h-16 bg-gray-200 border border-gray-300 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
              {bannerFile ? (
                <img src={URL.createObjectURL(bannerFile)} alt="Preview" className="w-full h-full object-cover" />
              ) : programSettings.program_hero_image ? (
                <img src={programSettings.program_hero_image} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <div className="flex-1 w-full flex flex-col sm:flex-row gap-3 items-center">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => { if (e.target.files?.[0]) setBannerFile(e.target.files[0]); }}
                className="text-xs text-gray-500 cursor-pointer w-full file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#1E3A8A]/10 file:text-[#1E3A8A] hover:file:bg-[#1E3A8A]/20 file:cursor-pointer"
              />
              <button
                type="button"
                disabled={isSavingSettings}
                onClick={handleSaveProgramSettings}
                className="bg-[#1E3A8A] hover:bg-[#172554] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-sm shrink-0 disabled:opacity-75 text-sm cursor-pointer"
              >
                {isSavingSettings ? (
                  <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>Saving...</>
                ) : 'Save Header'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 font-sans">Programs Management</h1>
          <p className="text-gray-500 mt-1 font-sans">Configure academic programs listed on the home page.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-[#1E3A8A] hover:bg-[#172554] text-white px-5 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors whitespace-nowrap font-sans"
        >
          <Plus className="w-5 h-5" /> Add Program
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#1E3A8A] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden font-sans">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-xs font-semibold">
                  <th className="p-5 w-24">ID</th>
                  <th className="p-5 w-24">Thumbnail</th>
                  <th className="p-5">Program Details</th>
                  <th className="p-5">Route Path</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {programs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-gray-500 italic">No programs found.</td>
                  </tr>
                ) : (
                  programs.map((program, idx) => (
                    <tr key={program.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="p-5 align-middle">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gray-50 text-gray-600 text-xs font-mono font-bold border border-gray-200">
                          {String(idx + 1).padStart(4, '0')}
                        </span>
                      </td>
                      <td className="p-5 align-middle">
                        <div className="w-12 h-10 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center shrink-0">
                          {program.image ? (
                            <img src={program.image} alt={program.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className={`w-full h-full flex items-center justify-center ${program.colorClass || 'bg-gray-100'}`}>
                              {resolveIcon(program.iconName, 'w-4 h-4')}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-5 align-middle">
                        <p className="font-bold text-gray-800 text-sm">{program.title}</p>
                        <div className="flex gap-2 mt-1.5 flex-wrap">
                          <span className="text-[10px] font-bold bg-blue-50 text-[#1E3A8A] border border-blue-100 px-2 py-0.5 rounded-full">Age: {program.ageRange || '3-18 Years'}</span>
                          <span className="text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-full">Grades: {program.gradeLevel || 'Nursery - Grade 12'}</span>
                        </div>
                      </td>
                      <td className="p-5 align-middle text-gray-500 font-mono text-xs">{program.path}</td>
                      <td className="p-5 align-middle text-right whitespace-nowrap">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenModal(program)}
                            className="p-2 text-blue-600 hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors focus:ring-2 focus:ring-blue-200 outline-none"
                            title="Edit Program"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => setProgramToDelete(program.id)}
                            className="p-2 text-blue-600 hover:bg-blue-100 hover:text-red-700 rounded-lg transition-colors focus:ring-2 focus:ring-blue-200 outline-none"
                            title="Delete Program"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {programToDelete !== null && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl relative font-sans">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-center text-gray-900 mb-2">Delete Program?</h2>
            <p className="text-center text-gray-500 mb-6">Are you sure you want to permanently delete this program? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setProgramToDelete(null)}
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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl relative font-sans my-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">{editingProgram ? 'Edit Program' : 'Add Program'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Program Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Khmer General Education"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] outline-none text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="A brief description of this program..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] outline-none text-gray-900 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Route Path</label>
                  <input
                    type="text"
                    required
                    value={formData.path}
                    onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                    placeholder="e.g. /programs/kge"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] outline-none text-gray-900 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Icon Shape</label>
                  <select
                    value={formData.iconName}
                    onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] outline-none bg-white text-gray-900"
                  >
                    {iconOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Age Range</label>
                  <input
                    type="text"
                    required
                    value={formData.ageRange}
                    onChange={(e) => setFormData({ ...formData, ageRange: e.target.value })}
                    placeholder="e.g. 3 - 5 Years"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] outline-none text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Grade Level</label>
                  <input
                    type="text"
                    required
                    value={formData.gradeLevel}
                    onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
                    placeholder="e.g. Nursery - Kindergarten"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] outline-none text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Program Thumbnail Image</label>
                <div className="flex gap-4 items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="w-16 h-12 bg-gray-200 border border-gray-300 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                    {imageFile ? (
                      <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-full h-full object-cover" />
                    ) : formData.image ? (
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => { if (e.target.files?.[0]) setImageFile(e.target.files[0]); }}
                    className="text-xs text-gray-500 cursor-pointer w-full file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#1E3A8A]/10 file:text-[#1E3A8A] hover:file:bg-[#1E3A8A]/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1E3A8A] mb-2 uppercase tracking-wide text-xs">Color Theme Style</label>
                <select
                  value={formData.colorClass}
                  onChange={(e) => setFormData({ ...formData, colorClass: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] outline-none bg-white text-gray-900 font-medium"
                >
                  {colorOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-6 border-t mt-6">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleCloseModal}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#172554] transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : editingProgram ? (
                    'Save Changes'
                  ) : (
                    'Add Program'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPrograms;
