import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, CheckCircle2 } from 'lucide-react';
import { API_BASE_URL } from '../../config';

type Job = {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  posted: string;
};

const AdminJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination & Search
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState({ title: '', department: '', location: '', type: '', posted: '' });
  
  // Delete Confirmation Modal state
  const [jobToDelete, setJobToDelete] = useState<number | null>(null);
  
  // Toast Message State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const fetchJobs = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/jobs?page=${page}&limit=5&search=${encodeURIComponent(searchQuery)}`);
      const result = await res.json();
      setJobs(result.data || []);
      setTotalPages(result?.pagination?.totalPages || 1);
    } catch (err) {
      // Silently handle
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page, searchQuery]);

  const handleOpenModal = (job?: Job) => {
    if (job) {
      setEditingJob(job);
      setFormData({ 
        title: job.title, 
        department: job.department, 
        location: job.location,
        type: job.type,
        posted: job.posted
      });
    } else {
      setEditingJob(null);
      setFormData({ title: '', department: 'Academic', location: 'Head Office', type: 'Full-Time', posted: 'Just now' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingJob(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingJob 
      ? `${API_BASE_URL}/api/jobs/${editingJob.id}` 
      : `${API_BASE_URL}/api/jobs`;
    
    const method = editingJob ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        handleCloseModal();
        fetchJobs();
        showToast(editingJob ? 'Job updated successfully!' : 'Job created successfully!');
      }
    } catch (err) {
      // Silently handle
    }
  };

  const confirmDelete = async () => {
    if (jobToDelete === null) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/jobs/${jobToDelete}`, { method: 'DELETE' });
      if (res.ok) {
        setJobToDelete(null);
        fetchJobs();
        showToast('Job deleted successfully!');
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
          <h1 className="text-3xl font-bold text-gray-800">Job Management</h1>
          <p className="text-gray-500 mt-1">Add, edit, or remove job postings.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Search jobs..." 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9A2220] outline-none text-sm w-full sm:w-64"
          />
          <button 
            onClick={() => handleOpenModal()}
            className="bg-[#9A2220] hover:bg-[#8A1A18] text-white px-5 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
          >
            <Plus className="w-5 h-5" /> Add Job
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-[#9A2220] border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-xs">
                  <th className="p-5 font-semibold">Title</th>
                  <th className="p-5 font-semibold">Department</th>
                  <th className="p-5 font-semibold">Location</th>
                  <th className="p-5 font-semibold">Type</th>
                  <th className="p-5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {jobs.length === 0 ? (
                  <tr><td colSpan={5} className="p-10 text-center text-gray-500 italic">No jobs found.</td></tr>
                ) : jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-5 align-middle font-bold text-gray-800">{job.title}</td>
                    <td className="p-5 align-middle">
                      <span className="px-3 py-1 bg-red-50 text-[#9A2220] text-xs font-bold uppercase rounded-full whitespace-nowrap">{job.department}</span>
                    </td>
                    <td className="p-5 align-middle text-gray-600 text-sm whitespace-nowrap">{job.location}</td>
                    <td className="p-5 align-middle text-gray-600 text-sm whitespace-nowrap">{job.type}</td>
                    <td className="p-5 align-middle text-right whitespace-nowrap">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleOpenModal(job)} className="p-2 text-blue-600 hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors focus:ring-2 focus:ring-blue-200 outline-none" title="Edit Job">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button onClick={() => setJobToDelete(job.id)} className="p-2 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-lg transition-colors focus:ring-2 focus:ring-red-200 outline-none" title="Delete Job">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50 rounded-b-2xl">
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
      {jobToDelete !== null && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl relative">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-center text-gray-900 mb-2">Delete Job?</h2>
            <p className="text-center text-gray-500 mb-6">Are you sure you want to permanently delete this job opening? This action cannot be undone.</p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setJobToDelete(null)} 
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
            <h2 className="text-2xl font-bold mb-6">{editingJob ? 'Edit Job' : 'Add New Job'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <input 
                  type="text" required
                  value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9A2220] outline-none text-gray-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <input 
                    type="text" required
                    value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9A2220] outline-none text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                  <select 
                    value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9A2220] outline-none bg-white text-gray-900"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input 
                  type="text" required
                  value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9A2220] outline-none text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Posted (e.g. "2 days ago")</label>
                <input 
                  type="text" required
                  value={formData.posted} onChange={e => setFormData({...formData, posted: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9A2220] outline-none text-gray-900"
                />
              </div>
              
              <div className="flex gap-3 pt-4 border-t mt-6">
                <button type="button" onClick={handleCloseModal} className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2.5 bg-[#9A2220] text-white rounded-lg hover:bg-[#8A1A18] transition-colors font-medium">
                  {editingJob ? 'Save Changes' : 'Create Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminJobs;
