import { useState, useEffect } from 'react';
import { Trash2, CheckCircle2 } from 'lucide-react';
import { API_BASE_URL } from '../../../config';

type ContactMessage = {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
};

const AdminContacts = () => {
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  // Delete Confirmation Modal state
  const [messageToDelete, setMessageToDelete] = useState<number | null>(null);

  // Toast Message State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const fetchContacts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/contact`);
      const data = await res.json();
      setContacts(data);
    } catch (err) {
      // Silently handle
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const confirmDelete = async () => {
    if (messageToDelete === null) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/contact/${messageToDelete}`, { method: 'DELETE' });
      if (res.ok) {
        setMessageToDelete(null);
        fetchContacts();
        showToast('Message deleted successfully!');
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

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Contact Messages</h1>
        <p className="text-gray-500 mt-1">Review messages submitted through the contact form.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-[#1E3A8A] border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contacts.length === 0 ? (
            <div className="col-span-full p-8 text-center text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100 italic">
              No messages found.
            </div>
          ) : contacts.map((contact) => (
            <div key={contact.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col relative group hover:shadow-md transition-shadow">
              <button 
                onClick={() => setMessageToDelete(contact.id)} 
                className="absolute top-4 right-4 p-2 text-blue-500 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:ring-2 focus:ring-blue-200 outline-none"
                title="Delete Message"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              
              <div className="mb-4 pr-8">
                <h3 className="font-bold text-lg text-gray-900">{contact.subject || 'No Subject'}</h3>
                <div className="text-sm text-gray-500 mt-1">
                  From: <span className="font-medium text-gray-800">{contact.name}</span> ({contact.email})
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Received: {new Date(contact.createdAt).toLocaleString()}
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 text-gray-700 text-sm flex-1 whitespace-pre-wrap border border-gray-100">
                {contact.message}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {messageToDelete !== null && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl relative">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-center text-gray-900 mb-2">Delete Message?</h2>
            <p className="text-center text-gray-500 mb-6">Are you sure you want to permanently delete this contact message? This action cannot be undone.</p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setMessageToDelete(null)} 
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
    </div>
  );
};

export default AdminContacts;
