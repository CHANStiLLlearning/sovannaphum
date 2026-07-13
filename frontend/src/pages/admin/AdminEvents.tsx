import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, CheckCircle2, Calendar, MapPin, Image as ImageIcon } from 'lucide-react';
import { API_BASE_URL } from '../../config';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

type SchoolEvent = {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
  image?: string;
};

const AdminEvents = () => {
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination & Search
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<SchoolEvent | null>(null);
  const [formData, setFormData] = useState({ title: '', description: '', location: '', date: '', image: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Delete Confirmation Modal state
  const [eventToDelete, setEventToDelete] = useState<number | null>(null);
  
  // Toast Message State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/events?page=${page}&limit=5&search=${encodeURIComponent(searchQuery)}`);
      const result = await res.json();
      setEvents(result.data || []);
      setTotalPages(result?.pagination?.totalPages || 1);
    } catch (err) {
      // Silently handle
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [page, searchQuery]);

  const handleOpenModal = (event?: SchoolEvent) => {
    if (event) {
      setEditingEvent(event);
      setFormData({ 
        title: event.title, 
        description: event.description, 
        location: event.location,
        date: event.date,
        image: event.image || ''
      });
    } else {
      setEditingEvent(null);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const today = new Date();
      const formattedDate = `${months[today.getMonth()]} ${String(today.getDate()).padStart(2, '0')}, ${today.getFullYear()}`;
      setFormData({ title: '', description: '', location: 'Phnom Penh Campus', date: formattedDate, image: '' });
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
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

      const url = editingEvent 
        ? `${API_BASE_URL}/api/events/${editingEvent.id}` 
        : `${API_BASE_URL}/api/events`;
      
      const method = editingEvent ? 'PUT' : 'POST';
      const finalData = { ...formData, image: uploadedImageUrl };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData)
      });
      if (res.ok) {
        handleCloseModal();
        fetchEvents();
        showToast(editingEvent ? 'Event updated successfully!' : 'Event created successfully!');
      }
    } catch (err) {
      // Silently handle
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (eventToDelete === null) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/events/${eventToDelete}`, { method: 'DELETE' });
      if (res.ok) {
        setEventToDelete(null);
        fetchEvents();
        showToast('Event deleted successfully!');
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
          <h1 className="text-3xl font-bold text-gray-800 font-sans">Event Management</h1>
          <p className="text-gray-500 mt-1 font-sans">Add, edit, or remove school events and activities.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Search events..." 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9A2220] outline-none text-sm w-full sm:w-64 font-sans text-gray-900"
          />
          <button 
            onClick={() => handleOpenModal()}
            className="bg-[#9A2220] hover:bg-[#8A1A18] text-white px-5 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors whitespace-nowrap font-sans"
          >
            <Plus className="w-5 h-5" /> Add Event
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#9A2220] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden font-sans">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-xs font-semibold">
                  <th className="p-5">Image</th>
                  <th className="p-5">Title</th>
                  <th className="p-5">Date</th>
                  <th className="p-5">Location</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {events.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-gray-500 italic">No events found.</td>
                  </tr>
                ) : events.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-5 align-middle">
                      <div className="w-16 h-10 rounded overflow-hidden bg-gray-100 border border-gray-200">
                        <img 
                          src={event.image || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=200'} 
                          alt="" 
                          className="w-full h-full object-cover" 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=200';
                          }}
                        />
                      </div>
                    </td>
                    <td className="p-5 align-middle font-bold text-gray-800">{event.title}</td>
                    <td className="p-5 align-middle text-gray-600 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-[#9A2220]" />
                        {event.date}
                      </span>
                    </td>
                    <td className="p-5 align-middle text-gray-600">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-[#9A2220]" />
                        {event.location}
                      </span>
                    </td>
                    <td className="p-5 align-middle text-right whitespace-nowrap">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleOpenModal(event)} 
                          className="p-2 text-blue-600 hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors focus:ring-2 focus:ring-blue-200 outline-none" 
                          title="Edit Event"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => setEventToDelete(event.id)} 
                          className="p-2 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-lg transition-colors focus:ring-2 focus:ring-red-200 outline-none" 
                          title="Delete Event"
                        >
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
      {eventToDelete !== null && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl relative font-sans">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-center text-gray-900 mb-2">Delete Event?</h2>
            <p className="text-center text-gray-500 mb-6">Are you sure you want to permanently delete this event? This action cannot be undone.</p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setEventToDelete(null)} 
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
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl relative font-sans my-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">{editingEvent ? 'Edit Event' : 'Add New Event'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Event Title</label>
                <input 
                  type="text" required
                  value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9A2220] outline-none text-gray-900"
                  placeholder="e.g. Annual Graduation Day"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Event Date</label>
                  <input 
                    type="text" required
                    value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9A2220] outline-none text-gray-900"
                    placeholder="e.g. 20 October 2026"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
                  <select 
                    value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9A2220] outline-none bg-white text-gray-900"
                  >
                    <option value="Phnom Penh Campus">Phnom Penh Campus</option>
                    <option value="Siem Reap Campus">Siem Reap Campus</option>
                    <option value="Head Office Main Hall">Head Office Main Hall</option>
                    <option value="Online / Virtual">Online / Virtual</option>
                  </select>
                </div>
              </div>

              {/* Image Upload / URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Event Image</label>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="w-full">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setImageFile(e.target.files[0]);
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9A2220] outline-none file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#9A2220]/10 file:text-[#9A2220] hover:file:bg-[#9A2220]/20 text-gray-600 cursor-pointer"
                    />
                  </div>
                  {formData.image && !imageFile && (
                    <div className="shrink-0 text-xs font-medium text-gray-400 max-w-xs truncate">
                      Current: {formData.image.split('/').pop()}
                    </div>
                  )}
                  {imageFile && (
                    <div className="shrink-0 text-xs font-semibold text-green-600 flex items-center gap-1">
                      <ImageIcon className="w-4 h-4" /> Ready to upload
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <div className="h-48 pb-10">
                  <ReactQuill 
                    theme="snow" 
                    value={formData.description} 
                    onChange={val => setFormData({ ...formData, description: val })}
                    className="h-full"
                  />
                </div>
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
                  className="flex-1 py-2.5 bg-[#9A2220] text-white rounded-lg hover:bg-[#8A1A18] transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : editingEvent ? (
                    'Save Changes'
                  ) : (
                    'Create Event'
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

export default AdminEvents;
