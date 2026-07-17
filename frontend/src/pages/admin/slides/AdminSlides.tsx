import { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit, 
  CheckCircle2, 
  Image as ImageIcon, 
  GraduationCap, 
  Compass, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { API_BASE_URL } from '../../../config';

type Slide = {
  id: number;
  image: string;
  tag: string;
  title: string;
  description: string;
  iconName: string;
  primaryBtnText: string;
  primaryBtnLink: string;
  secondaryBtnText: string;
  secondaryBtnLink: string;
};

const iconOptions = [
  { value: 'graduation-cap', label: 'Graduation Cap', component: <GraduationCap className="w-4 h-4" /> },
  { value: 'compass', label: 'Compass', component: <Compass className="w-4 h-4" /> },
  { value: 'calendar', label: 'Calendar', component: <Calendar className="w-4 h-4" /> }
];

const AdminSlides = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  
  const [formData, setFormData] = useState({
    image: '',
    tag: '',
    title: '',
    description: '',
    iconName: 'graduation-cap',
    primaryBtnText: '',
    primaryBtnLink: '',
    secondaryBtnText: '',
    secondaryBtnLink: ''
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slideToDelete, setSlideToDelete] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchSlides = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/slides`);
      if (!res.ok) throw new Error('Failed to load slides');
      const data = await res.json();
      setSlides(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleOpenModal = (slide?: Slide) => {
    if (slide) {
      setEditingSlide(slide);
      setFormData({
        image: slide.image,
        tag: slide.tag,
        title: slide.title,
        description: slide.description,
        iconName: slide.iconName || 'graduation-cap',
        primaryBtnText: slide.primaryBtnText,
        primaryBtnLink: slide.primaryBtnLink,
        secondaryBtnText: slide.secondaryBtnText,
        secondaryBtnLink: slide.secondaryBtnLink
      });
    } else {
      setEditingSlide(null);
      setFormData({
        image: '',
        tag: '',
        title: '',
        description: '',
        iconName: 'graduation-cap',
        primaryBtnText: '',
        primaryBtnLink: '',
        secondaryBtnText: '',
        secondaryBtnLink: ''
      });
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSlide(null);
    setImageFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    let uploadedImageUrl = formData.image;

    try {
      // 1. Upload image if selected
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('image', imageFile);
        
        const uploadRes = await fetch(`${API_BASE_URL}/api/upload`, {
          method: 'POST',
          body: uploadData
        });
        
        if (!uploadRes.ok) throw new Error('Image upload failed');
        const uploadResult = await uploadRes.json();
        uploadedImageUrl = uploadResult.url;
      }

      if (!uploadedImageUrl) {
        showToast('Please upload or specify a slide image.');
        setIsSubmitting(false);
        return;
      }

      const bodyData = { ...formData, image: uploadedImageUrl };

      // 2. Save or Update Slide
      const url = editingSlide 
        ? `${API_BASE_URL}/api/slides/${editingSlide.id}` 
        : `${API_BASE_URL}/api/slides`;
      const method = editingSlide ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });

      if (!res.ok) throw new Error('Failed to save slide');
      
      showToast(editingSlide ? 'Slide updated successfully!' : 'Slide created successfully!');
      fetchSlides();
      handleCloseModal();
    } catch (err: any) {
      showToast(err.message || 'An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!slideToDelete) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/slides/${slideToDelete}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete slide');
      
      showToast('Slide deleted successfully!');
      fetchSlides();
      setSlideToDelete(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to delete slide');
    }
  };

  const resolveIcon = (name: string) => {
    switch (name) {
      case 'compass': return <Compass className="w-4 h-4" />;
      case 'calendar': return <Calendar className="w-4 h-4" />;
      default: return <GraduationCap className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-gray-900 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 z-50 animate-fade-in border border-gray-800 text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Homepage Hero Slides</h1>
          <p className="text-gray-500">Manage interactive banner slides rendered at the top of the homepage.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 bg-[#1E3A8A] hover:bg-[#172554] text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all duration-200 hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" /> Add Slide
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-[#1E3A8A] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : slides.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 px-6 shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Slides Configured</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            Add your first slider banner to display dynamic information on the school portal landing page.
          </p>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 bg-[#1E3A8A] hover:bg-[#172554] text-white font-bold py-3 px-6 rounded-xl transition-all shadow"
          >
            <Plus className="w-5 h-5" /> Add Your First Slide
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {slides.map((slide, idx) => (
            <div 
              key={slide.id} 
              className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group relative"
            >
              {/* Slide Detail Info */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-50 text-gray-600 text-xs font-mono font-bold border border-gray-200">
                      {String(idx + 1).padStart(4, '0')}
                    </span>
                    <span className="text-[#D76918] font-bold text-xs uppercase tracking-wider">
                      {slide.tag || "WELCOME TAGLINE"}
                    </span>
                  </div>
                  <div className="bg-gray-50 text-gray-700 px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 border border-gray-150 shrink-0">
                    {resolveIcon(slide.iconName)}
                    <span className="uppercase tracking-wider">{slide.iconName}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-[#1E3A8A] transition-colors">
                  {slide.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                  {slide.description}
                </p>



                {/* Operations */}
                <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 mt-auto">
                  <button
                    onClick={() => handleOpenModal(slide)}
                    className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-colors"
                    title="Edit Slide"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSlideToDelete(slide.id)}
                    className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-colors"
                    title="Delete Slide"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Slide Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleCloseModal}></div>
          <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-10 border border-gray-100 animate-fade-in duration-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {editingSlide ? 'Edit Slide Details' : 'Add New Landing Slide'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Tag and Icon */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Tagline Subtitle</label>
                  <input 
                    type="text"
                    required
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    placeholder="e.g. WELCOME TO KHMER AMERICA SCHOOL"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] outline-none text-sm text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Tagline Icon</label>
                  <select 
                    value={formData.iconName}
                    onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 bg-white rounded-xl focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] outline-none text-sm text-gray-900 cursor-pointer"
                  >
                    {iconOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Slide Title</label>
                <input 
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Shaping Leaders of the Digital Era"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] outline-none text-sm text-gray-900"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Slide Description Text</label>
                <textarea 
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Summarize key features, programs, or admission details details..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] outline-none text-sm text-gray-900 resize-none"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Slide Banner Image</label>
                <div className="flex flex-col sm:flex-row gap-4 items-center bg-gray-50 p-4 rounded-2xl border border-gray-150">
                  {/* Preview Thumbnail */}
                  <div className="w-24 h-16 bg-gray-200 border border-gray-300 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                    {imageFile ? (
                      <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-full h-full object-cover" />
                    ) : formData.image ? (
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 w-full">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileChange}
                      className="text-xs text-gray-500 cursor-pointer w-full file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#1E3A8A]/10 file:text-[#1E3A8A] hover:file:bg-[#1E3A8A]/20 file:cursor-pointer"
                    />
                    <p className="text-[10px] text-gray-400 mt-2">Recommended resolution: 1920x1080px (landscape aspect).</p>
                  </div>
                </div>
              </div>



              {/* Action Operations */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-xl transition-colors cursor-pointer text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white font-bold rounded-xl shadow-md transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer text-sm"
                >
                  {isSubmitting ? 'Saving Slide...' : 'Save Slide'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {slideToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSlideToDelete(null)}></div>
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full relative z-10 border border-gray-150 flex flex-col items-center text-center animate-fade-in duration-200">
            <div className="w-16 h-16 bg-blue-50 text-rose-500 rounded-full flex items-center justify-center mb-6 shadow-sm">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Slide</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Are you sure you want to delete this hero slide banner? This action cannot be undone.
            </p>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setSlideToDelete(null)}
                className="flex-1 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold rounded-xl transition-colors cursor-pointer text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSlides;
