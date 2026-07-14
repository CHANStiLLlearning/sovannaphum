import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, CheckCircle2, User, BookOpen, Globe, Image as ImageIcon } from 'lucide-react';
import { API_BASE_URL } from '../../config';

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
      const res = await fetch(`${API_BASE_URL}/api/teachers?page=${page}&limit=10&search=${encodeURIComponent(searchQuery)}`);
      const result = await res.json();
      setTeachers(result.data || []);
      setTotalPages(result?.pagination?.totalPages || 1);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [page, searchQuery]);

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

      const url = editingTeacher
        ? `${API_BASE_URL}/api/teachers/${editingTeacher.id}`
        : `${API_BASE_URL}/api/teachers`;
      const method = editingTeacher ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, image: uploadedImageUrl }),
      });

      if (res.ok) {
        handleCloseModal();
        fetchTeachers();
        showToast(editingTeacher ? 'Teacher updated successfully!' : 'Teacher added successfully!');
      }
    } catch {
      // silent
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (teacherToDelete === null) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/teachers/${teacherToDelete}`, { method: 'DELETE' });
      if (res.ok) {
        setTeacherToDelete(null);
        fetchTeachers();
        showToast('Teacher deleted successfully!');
      }
    } catch {
      // silent
    }
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
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9A2220] outline-none text-sm w-full sm:w-64 font-sans text-gray-900"
          />
          <button
            onClick={() => handleOpenModal()}
            className="bg-[#9A2220] hover:bg-[#8A1A18] text-white px-5 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors whitespace-nowrap font-sans"
          >
            <Plus className="w-5 h-5" /> Add Teacher
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#9A2220] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden font-sans">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-xs font-semibold">
                  <th className="p-5">Photo</th>
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
                ) : teachers.map(teacher => (
                  <tr key={teacher.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-5 align-middle">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                        <img
                          src={teacher.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.name)}&background=9A2220&color=fff&size=100`}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.name)}&background=9A2220&color=fff&size=100`;
                          }}
                        />
                      </div>
                    </td>
                    <td className="p-5 align-middle font-bold text-gray-800">{teacher.name}</td>
                    <td className="p-5 align-middle text-gray-600 font-medium">{teacher.role}</td>
                    <td className="p-5 align-middle text-gray-600">
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-[#9A2220]" /> {teacher.subject}
                      </span>
                    </td>
                    <td className="p-5 align-middle text-gray-600">
                      <span className="flex items-center gap-1.5">
                        <Globe className="w-4 h-4 text-[#9A2220]" /> {teacher.nationality}
                      </span>
                    </td>
                    <td className="p-5 align-middle text-right whitespace-nowrap">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleOpenModal(teacher)} className="p-2 text-blue-600 hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors outline-none" title="Edit">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button onClick={() => setTeacherToDelete(teacher.id)} className="p-2 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-lg transition-colors outline-none" title="Delete">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4 mx-auto">
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
              <User className="w-6 h-6 text-[#9A2220]" />
              {editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text" required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9A2220] outline-none text-gray-900"
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
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9A2220] outline-none text-gray-900"
                    placeholder="e.g. Senior Teacher"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
                  <input
                    type="text" required
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9A2220] outline-none text-gray-900"
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
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9A2220] outline-none text-gray-900"
                  placeholder="e.g. Cambodian, American, Chinese..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Profile Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => { if (e.target.files?.[0]) setImageFile(e.target.files[0]); }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9A2220] outline-none file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#9A2220]/10 file:text-[#9A2220] hover:file:bg-[#9A2220]/20 text-gray-600 cursor-pointer"
                />
                {imageFile && (
                  <p className="text-xs font-semibold text-green-600 flex items-center gap-1 mt-1">
                    <ImageIcon className="w-3.5 h-3.5" /> Ready to upload
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-4 border-t mt-2">
                <button type="button" disabled={isSubmitting} onClick={handleCloseModal} className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-2.5 bg-[#9A2220] text-white rounded-lg hover:bg-[#8A1A18] font-semibold flex items-center justify-center gap-2 disabled:opacity-75">
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
