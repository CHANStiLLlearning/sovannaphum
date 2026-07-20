import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, CheckCircle2, User, BookOpen, Globe, Image as ImageIcon } from 'lucide-react';
import { facultyService } from '../../../services/facultyService';
import { settingsService } from '../../../services/settingsService';
import { api } from '../../../services/api';

type Teacher = {
  id: number;
  name: string;
  role: string;
  subject: string;
  nationality: string;
  image?: string;
};

const AdminFaculty = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  // Faculty Header Settings State
  const [facultySettings, setFacultySettings] = useState({
    faculty_hero_title: 'Meet Our Faculty',
    faculty_hero_subtitle: 'Dedicated educators shaping the next generation with passion, expertise, and care.',
    faculty_hero_image: '',
  });
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [formData, setFormData] = useState({ name: '', role: '', subject: '', nationality: 'Cambodian', image: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [teacherToDelete, setTeacherToDelete] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchTeachers = async () => {
    try {
      const result = await facultyService.getAll();
      setTeachers((result as any).data || result);
      setTotalPages((result as any)?.pagination?.totalPages || 1);
    } catch { /* silent */ } finally {
      setLoading(false);
    }
  };

  const fetchFacultySettings = async () => {
    try {
      const data = await settingsService.get();
      setFacultySettings({
        faculty_hero_title: data.faculty_hero_title || 'Meet Our Faculty',
        faculty_hero_subtitle: data.faculty_hero_subtitle || 'Dedicated educators shaping the next generation with passion, expertise, and care.',
        faculty_hero_image: data.faculty_hero_image || '',
      });
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  };

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    let uploadedImageUrl = facultySettings.faculty_hero_image;
    try {
      if (bannerFile) {
        uploadedImageUrl = await api.upload(bannerFile);
      }
      await settingsService.save({ ...facultySettings, faculty_hero_image: uploadedImageUrl });
      showToast('Faculty header saved successfully!');
      setBannerFile(null);
      fetchFacultySettings();
    } catch (err) {
      console.error(err);
      showToast('An error occurred');
    } finally {
      setIsSavingSettings(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [page, searchQuery]);

  useEffect(() => {
    fetchFacultySettings();
  }, []);

  const handleOpenModal = (teacher?: Teacher) => {
    if (teacher) {
      setEditingTeacher(teacher);
      setFormData({ name: teacher.name, role: teacher.role, subject: teacher.subject, nationality: teacher.nationality, image: teacher.image || '' });
    } else {
      setEditingTeacher(null);
      setFormData({ name: '', role: 'Teacher', subject: '', nationality: 'Cambodian', image: '' });
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTeacher(null);
    setImageFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    let uploadedImageUrl = formData.image;

    try {
      if (imageFile) {
        uploadedImageUrl = await api.upload(imageFile);
      }
      const data = { ...formData, image: uploadedImageUrl };
      if (editingTeacher) {
        await facultyService.update(editingTeacher.id, data);
      } else {
        await facultyService.create(data);
      }
      handleCloseModal();
      fetchTeachers();
      showToast(editingTeacher ? 'Teacher updated successfully!' : 'Teacher added successfully!');
    } catch { /* silent */ } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (teacherToDelete === null) return;
    try {
      await facultyService.delete(teacherToDelete);
      setTeacherToDelete(null);
      fetchTeachers();
      showToast('Teacher deleted successfully!');
    } catch { /* silent */ }
  };

  return (
    <div className="relative">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[100] bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 font-sans">Faculty Management</h1>
          <p className="text-gray-500 mt-1 font-sans">Add, edit, or remove teachers and staff profiles.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search teachers..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] outline-none text-sm w-full sm:w-64 font-sans text-gray-900"
          />
          <button
            onClick={() => handleOpenModal()}
            className="bg-[#1E3A8A] hover:bg-[#172554] text-white px-5 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors whitespace-nowrap font-sans"
          >
            <Plus className="w-5 h-5" /> Add Teacher
          </button>
        </div>
      </div>

      {/* Page Header Settings Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-150 mb-8 space-y-6 font-sans">
        <h2 className="text-lg font-bold text-gray-900 border-b pb-3 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#1E3A8A]" />
          Faculty Page Header Settings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Hero Title</label>
            <input
              type="text"
              value={facultySettings.faculty_hero_title}
              onChange={(e) => setFacultySettings({ ...facultySettings, faculty_hero_title: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] outline-none text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Hero Subtitle</label>
            <input
              type="text"
              value={facultySettings.faculty_hero_subtitle}
              onChange={(e) => setFacultySettings({ ...facultySettings, faculty_hero_subtitle: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] outline-none text-gray-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Banner Background Image</label>
          <div className="flex gap-4 items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div className="w-24 h-16 bg-gray-200 border border-gray-300 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
              {bannerFile ? (
                <img src={URL.createObjectURL(bannerFile)} alt="Preview" className="w-full h-full object-cover" />
              ) : facultySettings.faculty_hero_image ? (
                <img src={facultySettings.faculty_hero_image} alt="Preview" className="w-full h-full object-cover" />
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
                onClick={handleSaveSettings}
                className="bg-[#1E3A8A] hover:bg-[#172554] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-sm shrink-0 disabled:opacity-75 text-sm cursor-pointer"
              >
                {isSavingSettings ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Saving...
                  </>
                ) : (
                  'Save Header Settings'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden font-sans animate-pulse">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-5 w-24"><div className="h-4 bg-gray-200 rounded w-10"></div></th>
                  <th className="p-5"><div className="h-4 bg-gray-200 rounded w-24"></div></th>
                  <th className="p-5"><div className="h-4 bg-gray-200 rounded w-20"></div></th>
                  <th className="p-5"><div className="h-4 bg-gray-200 rounded w-24"></div></th>
                  <th className="p-5"><div className="h-4 bg-gray-200 rounded w-24"></div></th>
                  <th className="p-5"><div className="h-4 bg-gray-200 rounded w-16 ml-auto"></div></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {[1, 2, 3, 4, 5].map(n => (
                  <tr key={n}>
                    <td className="p-5"><div className="h-5 bg-gray-200 rounded-full w-12"></div></td>
                    <td className="p-5"><div className="h-5 bg-gray-200 rounded w-32"></div></td>
                    <td className="p-5"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                    <td className="p-5"><div className="h-4 bg-gray-200 rounded w-28"></div></td>
                    <td className="p-5"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                    <td className="p-5 flex justify-end gap-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                      <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden font-sans">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-xs font-semibold">
                  <th className="p-5 w-24">ID</th>
                  <th className="p-5">Name</th>
                  <th className="p-5">Role</th>
                  <th className="p-5">Subject</th>
                  <th className="p-5">Nationality</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {teachers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-10 text-center text-gray-500 italic">No teachers found.</td>
                  </tr>
                ) : (
                  teachers.map((teacher, idx) => {
                    const serialNum = (page - 1) * 10 + (idx + 1);
                    return (
                      <tr key={teacher.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="p-5 align-middle">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gray-50 text-gray-600 text-xs font-mono font-bold border border-gray-200">
                            {String(serialNum).padStart(4, '0')}
                          </span>
                        </td>
                        <td className="p-5 align-middle font-bold text-gray-800">{teacher.name}</td>
                        <td className="p-5 align-middle text-gray-600 font-medium">{teacher.role}</td>
                        <td className="p-5 align-middle text-gray-600">
                          <span className="flex items-center gap-1.5">
                            <BookOpen className="w-4 h-4 text-[#1E3A8A]" /> {teacher.subject}
                          </span>
                        </td>
                        <td className="p-5 align-middle text-gray-600">
                          <span className="flex items-center gap-1.5">
                            <Globe className="w-4 h-4 text-[#1E3A8A]" /> {teacher.nationality}
                          </span>
                        </td>
                        <td className="p-5 align-middle text-right whitespace-nowrap">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => handleOpenModal(teacher)} className="p-2 text-blue-600 hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors outline-none" title="Edit">
                              <Edit className="w-5 h-5" />
                            </button>
                            <button onClick={() => setTeacherToDelete(teacher.id)} className="p-2 text-blue-600 hover:bg-blue-100 hover:text-red-700 rounded-lg transition-colors outline-none" title="Delete">
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

          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50 rounded-b-2xl">
              <span className="text-sm text-gray-600">Page <span className="font-semibold text-gray-900">{page}</span> of <span className="font-semibold text-gray-900">{totalPages}</span></span>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed bg-white text-gray-700">Previous</button>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed bg-white text-gray-700">Next</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {teacherToDelete !== null && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl font-sans">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-center text-gray-900 mb-2">Delete Teacher?</h2>
            <p className="text-center text-gray-500 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setTeacherToDelete(null)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl font-sans my-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
              <User className="w-6 h-6 text-[#1E3A8A]" />
              {editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text" required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] outline-none text-gray-900"
                  placeholder="e.g. Sophea Chea"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Role / Title</label>
                  <input
                    type="text" required
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] outline-none text-gray-900"
                    placeholder="e.g. Senior Teacher"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
                  <input
                    type="text" required
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] outline-none text-gray-900"
                    placeholder="e.g. Mathematics"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nationality</label>
                <input
                  type="text" required
                  value={formData.nationality}
                  onChange={e => setFormData({ ...formData, nationality: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] outline-none text-gray-900"
                  placeholder="e.g. Cambodian, American, Chinese..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Profile Photo</label>
                <div className="flex flex-col sm:flex-row gap-4 items-center bg-gray-50 p-4 rounded-2xl border border-gray-150">
                  {/* Preview Thumbnail */}
                  <div className="w-16 h-16 rounded-full border border-gray-300 overflow-hidden shrink-0 flex items-center justify-center bg-gray-200">
                    {imageFile ? (
                      <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-full h-full object-cover" />
                    ) : formData.image ? (
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 w-full">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => { if (e.target.files?.[0]) setImageFile(e.target.files[0]); }}
                      className="text-xs text-gray-500 cursor-pointer w-full file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#1E3A8A]/10 file:text-[#1E3A8A] hover:file:bg-[#1E3A8A]/20 file:cursor-pointer"
                    />
                    <p className="text-[10px] text-gray-400 mt-2">Upload a profile picture for this teacher.</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t mt-2">
                <button type="button" disabled={isSubmitting} onClick={handleCloseModal} className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-2.5 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#172554] font-semibold flex items-center justify-center gap-2 disabled:opacity-75">
                  {isSubmitting ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : editingTeacher ? 'Save Changes' : 'Add Teacher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFaculty;
