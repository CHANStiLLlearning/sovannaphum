import React, { useState, useEffect } from 'react';
import { Handshake, Plus, Edit2, Trash2, X, Save, Image as ImageIcon } from 'lucide-react';
import { API_BASE_URL } from '../../config';

type Partner = {
  id: number;
  name: string;
  logo: string;
};

const AdminPartners = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', logo: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchPartners = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/partners`);
      if (res.ok) setPartners(await res.json());
    } catch (err) {
      console.error('Failed to fetch partners', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleOpenModal = (partner?: Partner) => {
    if (partner) {
      setEditingId(partner.id);
      setFormData({ name: partner.name, logo: partner.logo });
    } else {
      setEditingId(null);
      setFormData({ name: '', logo: '' });
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    let uploadedLogoUrl = formData.logo;

    try {
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('image', imageFile);
        const uploadRes = await fetch(`${API_BASE_URL}/api/upload`, { method: 'POST', body: uploadData });
        if (uploadRes.ok) {
          const uploadResult = await uploadRes.json();
          uploadedLogoUrl = uploadResult.url;
        } else {
          showToast('Logo upload failed');
          setIsSubmitting(false);
          return;
        }
      }

      const payload = { ...formData, logo: uploadedLogoUrl };
      const url = editingId ? `${API_BASE_URL}/api/partners/${editingId}` : `${API_BASE_URL}/api/partners`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast(editingId ? 'Partner updated!' : 'Partner added!');
        setIsModalOpen(false);
        fetchPartners();
      } else {
        showToast('Failed to save partner');
      }
    } catch (err) {
      showToast('Error saving partner');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this partner?')) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/partners/${id}`, { method: 'DELETE' });
        if (res.ok) {
          showToast('Partner deleted');
          fetchPartners();
        }
      } catch (err) {
        showToast('Failed to delete partner');
      }
    }
  };

  return (
    <div className="font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Handshake className="w-6 h-6 text-[#9A2220]" />
            Partners Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage school partner logos and names.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-[#9A2220] hover:bg-[#8A1A18] text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Partner
        </button>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in-up">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <p className="font-medium text-sm">{toastMessage}</p>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center p-12"><div className="w-8 h-8 border-4 border-[#9A2220] border-t-transparent rounded-full animate-spin" /></div>
      ) : partners.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-500">
          <Handshake className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="font-medium">No partners added yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map(partner => (
            <div key={partner.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center group transition-shadow hover:shadow-md">
              <div className="w-32 h-24 mb-4 flex items-center justify-center bg-gray-50 rounded-xl border border-gray-100 overflow-hidden p-2">
                {partner.logo ? (
                  <img src={partner.logo} alt={partner.name} className="max-w-full max-h-full object-contain" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-gray-300" />
                )}
              </div>
              <h3 className="font-bold text-gray-900 text-center">{partner.name}</h3>
              
              <div className="mt-6 flex items-center justify-center gap-2 w-full pt-4 border-t border-gray-100 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleOpenModal(partner)} className="flex-1 py-2 flex items-center justify-center text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm font-semibold transition-colors">
                  <Edit2 className="w-4 h-4 mr-1.5" /> Edit
                </button>
                <button onClick={() => handleDelete(partner.id)} className="flex-1 py-2 flex items-center justify-center text-red-600 bg-red-50 hover:bg-red-100 rounded-lg text-sm font-semibold transition-colors">
                  <Trash2 className="w-4 h-4 mr-1.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900">{editingId ? 'Edit Partner' : 'Add Partner'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <form id="partner-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Partner Name</label>
                  <input
                    required type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9A2220] outline-none"
                    placeholder="e.g. Cambridge Assessment"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Logo</label>
                  <div className="flex flex-col gap-3">
                    <div className="h-24 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center p-2">
                      {imageFile ? <img src={URL.createObjectURL(imageFile)} className="max-w-full max-h-full object-contain" /> 
                       : formData.logo ? <img src={formData.logo} className="max-w-full max-h-full object-contain" /> 
                       : <ImageIcon className="w-6 h-6 text-gray-400" />}
                    </div>
                    <input
                      type="file" accept="image/*"
                      onChange={e => e.target.files && setImageFile(e.target.files[0])}
                      className="text-xs text-gray-500 w-full file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 cursor-pointer"
                    />
                  </div>
                </div>
              </form>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-200 rounded-lg">
                Cancel
              </button>
              <button type="submit" form="partner-form" disabled={isSubmitting} className="bg-[#9A2220] hover:bg-[#8A1A18] text-white px-5 py-2 rounded-lg font-bold text-sm shadow-sm flex items-center gap-2 disabled:opacity-70">
                {isSubmitting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPartners;
