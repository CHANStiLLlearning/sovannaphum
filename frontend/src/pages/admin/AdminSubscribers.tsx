import { useState, useEffect } from 'react';
import { Trash2, CheckCircle2, Send } from 'lucide-react';
import { API_BASE_URL } from '../../config';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

type Subscriber = {
  id: number;
  email: string;
  createdAt: string;
};

const AdminSubscribers = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  // Delete Confirmation Modal state
  const [subToDelete, setSubToDelete] = useState<number | null>(null);

  // Broadcast Modal State
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [broadcastSubject, setBroadcastSubject] = useState('');
  const [broadcastBody, setBroadcastBody] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  // Toast Message State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const fetchSubscribers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/subscribe`);
      const data = await res.json();
      setSubscribers(data);
    } catch (err) {
      // Silently handle
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const confirmDelete = async () => {
    if (subToDelete === null) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/subscribe/${subToDelete}`, { method: 'DELETE' });
      if (res.ok) {
        setSubToDelete(null);
        fetchSubscribers();
        showToast('Subscriber removed successfully!');
      }
    } catch (err) {
      // Silently handle
    }
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastSubject.trim() || !broadcastBody.trim()) {
      showToast('Subject and body are required.');
      return;
    }
    
    setIsBroadcasting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/subscribe/broadcast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: broadcastSubject, body: broadcastBody })
      });
      
      if (res.ok) {
        showToast('Newsletter broadcasted successfully!');
        setIsBroadcastModalOpen(false);
        setBroadcastSubject('');
        setBroadcastBody('');
      } else {
        showToast('Failed to broadcast newsletter.');
      }
    } catch (error) {
      showToast('Error broadcasting newsletter.');
    } finally {
      setIsBroadcasting(false);
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

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Newsletter Subscribers</h1>
          <p className="text-gray-500 mt-1">Manage people subscribed to your newsletter.</p>
        </div>
        <button 
          onClick={() => setIsBroadcastModalOpen(true)}
          className="bg-[#D76918] hover:bg-[#c25e15] text-white px-5 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
        >
          <Send className="w-5 h-5" /> Broadcast Email
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-[#1E3A8A] border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-w-4xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[550px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-xs">
                  <th className="p-4 md:p-5 font-semibold">Email Address</th>
                  <th className="p-4 md:p-5 font-semibold">Subscribed Date</th>
                  <th className="p-4 md:p-5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {subscribers.length === 0 ? (
                  <tr><td colSpan={3} className="p-10 text-center text-gray-500 italic">No subscribers found.</td></tr>
                ) : subscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-4 md:p-5 align-middle font-medium text-gray-800 text-sm whitespace-nowrap">{sub.email}</td>
                    <td className="p-4 md:p-5 align-middle text-gray-500 text-xs md:text-sm whitespace-nowrap">{new Date(sub.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 md:p-5 align-middle text-right flex items-center justify-end">
                      <button 
                        onClick={() => setSubToDelete(sub.id)} 
                        className="p-2 text-blue-600 hover:bg-blue-100 hover:text-red-700 rounded-lg transition-colors focus:ring-2 focus:ring-blue-200 outline-none"
                        title="Remove Subscriber"
                      >
                        <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {subToDelete !== null && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl relative">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-center text-gray-900 mb-2">Remove Subscriber?</h2>
            <p className="text-center text-gray-500 mb-6">Are you sure you want to permanently remove this subscriber from the mailing list? This action cannot be undone.</p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setSubToDelete(null)} 
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete} 
                className="flex-1 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Broadcast Modal */}
      {isBroadcastModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl relative">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Send className="w-6 h-6 text-[#D76918]" /> Broadcast Newsletter
            </h2>
            <form onSubmit={handleBroadcast} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input 
                  type="text" required
                  value={broadcastSubject} onChange={e => setBroadcastSubject(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D76918] outline-none text-gray-900 bg-white"
                  placeholder="Newsletter subject line"
                />
              </div>
              <div className="pb-10">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Body</label>
                <ReactQuill 
                  theme="snow"
                  value={broadcastBody} 
                  onChange={setBroadcastBody}
                  className="bg-white text-gray-900 h-64 mb-8"
                />
              </div>
              
              <div className="flex gap-3 pt-4 border-t mt-6">
                <button type="button" onClick={() => setIsBroadcastModalOpen(false)} className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  Cancel
                </button>
                <button type="submit" disabled={isBroadcasting} className="flex-1 py-2.5 bg-[#D76918] text-white rounded-lg hover:bg-[#c25e15] transition-colors font-medium disabled:opacity-70 flex items-center justify-center gap-2">
                  {isBroadcasting ? 'Sending...' : <><Send className="w-4 h-4" /> Send Broadcast</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSubscribers;
