import React, { useState, useEffect } from 'react';
import { HelpCircle, Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import { faqService, type FAQ } from '../../../services/faqService';

const AdminFAQ = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ question: '', answer_kh: '', answer_en: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchFaqs = async () => {
    try {
      const data = await faqService.getAll();
      setFaqs(data);
    } catch (err) {
      console.error('Failed to fetch FAQs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleOpenModal = (faq?: FAQ) => {
    if (faq) {
      setEditingId(faq.id);
      setFormData({ question: faq.question, answer_kh: faq.answer_kh, answer_en: faq.answer_en });
    } else {
      setEditingId(null);
      setFormData({ question: '', answer_kh: '', answer_en: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        await faqService.update(editingId, formData);
      } else {
        await faqService.create(formData);
      }
      showToast(editingId ? 'FAQ updated!' : 'FAQ added!');
      setIsModalOpen(false);
      fetchFaqs();
    } catch {
      showToast('Failed to save FAQ');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      try {
        await faqService.delete(id);
        showToast('FAQ deleted');
        fetchFaqs();
      } catch {
        showToast('Failed to delete FAQ');
      }
    }
  };

  return (
    <div className="font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-[#1E3A8A]" />
            FAQ Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage Frequently Asked Questions.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-[#1E3A8A] hover:bg-[#172554] text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Add FAQ
        </button>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in-up">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <p className="font-medium text-sm">{toastMessage}</p>
        </div>
      )}

      {/* List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-10 flex justify-center"><div className="w-8 h-8 border-4 border-[#1E3A8A] border-t-transparent rounded-full animate-spin" /></div>
        ) : faqs.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="font-medium">No FAQs added yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="py-3 px-6 font-semibold text-xs text-gray-500 uppercase tracking-wider w-1/3">Question</th>
                  <th className="py-3 px-6 font-semibold text-xs text-gray-500 uppercase tracking-wider">Khmer Answer</th>
                  <th className="py-3 px-6 font-semibold text-xs text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {faqs.map((faq) => (
                  <tr key={faq.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-bold text-gray-900 text-sm">{faq.question}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-gray-600 line-clamp-2 max-w-sm">{faq.answer_kh}</p>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleOpenModal(faq)} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(faq.id)} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900">{editingId ? 'Edit FAQ' : 'Add New FAQ'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="faq-form" onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Question</label>
                  <input
                    required type="text"
                    value={formData.question}
                    onChange={e => setFormData({ ...formData, question: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] outline-none"
                    placeholder="e.g. What age do you accept students?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Answer (Khmer)</label>
                  <textarea
                    required rows={4}
                    value={formData.answer_kh}
                    onChange={e => setFormData({ ...formData, answer_kh: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] outline-none resize-none"
                    placeholder="Khmer answer..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Answer (English)</label>
                  <textarea
                    required rows={4}
                    value={formData.answer_en}
                    onChange={e => setFormData({ ...formData, answer_en: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] outline-none resize-none"
                    placeholder="English answer..."
                  />
                </div>
              </form>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-200 rounded-lg">
                Cancel
              </button>
              <button type="submit" form="faq-form" disabled={isSubmitting} className="bg-[#1E3A8A] hover:bg-[#172554] text-white px-5 py-2 rounded-lg font-bold text-sm shadow-sm flex items-center gap-2 disabled:opacity-70">
                {isSubmitting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                {editingId ? 'Save Changes' : 'Add FAQ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFAQ;
