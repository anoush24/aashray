import React, { useRef } from 'react';
import { X, Camera, Heart, Ruler, Loader2, AlertCircle } from 'lucide-react';
import { useAddPetForm } from '../hooks/useAddPetForm';

const AddPetModal = ({ isOpen, onClose, onPetAdded }) => {
  const fileInputRef = useRef(null);

  const {
    formData,
    previewUrl,
    loading,
    error,
    handleChange,
    handleCategorySelect,
    handleImageChange,
    handleSubmit
  } = useAddPetForm(onPetAdded, onClose);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl relative flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
          <div>
            <h2 className="text-2xl font-extrabold font-nunito text-[var(--color-text-main)]">Add New Pet</h2>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">Enter your pet's basic details.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-[var(--color-text-muted)]"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="p-6 space-y-8 overflow-y-auto custom-scrollbar flex-1">
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}

          {/* Section 1: Photo & Main Info */}
          <div className="flex flex-col sm:flex-row gap-6">
            
            {/* Image Upload Area */}
            <div className="shrink-0 flex justify-center sm:justify-start">
               <input 
                 type="file" 
                 ref={fileInputRef} 
                 onChange={handleImageChange} 
                 className="hidden" 
                 accept="image/*"
               />
               <div 
                 onClick={() => fileInputRef.current.click()}
                 className={`w-32 h-32 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden group
                   ${previewUrl ? 'border-[var(--color-primary)]' : 'border-[var(--color-border)] bg-gray-50 hover:bg-[var(--color-primary)]/5 hover:border-[var(--color-primary)]'}
                 `}
               >
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <Camera className="w-8 h-8 text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] transition-colors mb-1" />
                      <span className="text-xs text-[var(--color-text-muted)] font-bold group-hover:text-[var(--color-primary)]">Add Photo</span>
                    </>
                  )}
               </div>
            </div>
            
            {/* Essential Inputs */}
            <div className="flex-1 space-y-4">
               <div className="space-y-1.5">
                 <label className="text-sm font-bold text-[var(--color-text-main)]">Pet Name <span className="text-red-500">*</span></label>
                 <input 
                   name="name"
                   value={formData.name}
                   onChange={handleChange}
                   type="text" 
                   placeholder="e.g. Bruno" 
                   className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition-all"
                 />
               </div>
               
               {/* Categories mapped to 'species' in schema */}
               <div className="space-y-1.5">
                 <label className="text-sm font-bold text-[var(--color-text-main)]">Category (Species) <span className="text-red-500">*</span></label>
                 <div className="flex flex-wrap gap-2">
                    {['Dog', 'Cat', 'Bird', 'Other'].map((type) => (
                      <button 
                        key={type} 
                        onClick={() => handleCategorySelect(type)}
                        className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all focus:ring-2 focus:ring-[var(--color-primary)]/20
                          ${formData.category === type 
                            ? 'bg-[var(--color-primary)]/10 border-[var(--color-primary)] text-[var(--color-primary)]' 
                            : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] bg-white'
                          }
                        `}
                      >
                        {type}
                      </button>
                    ))}
                 </div>
               </div>
            </div>
          </div>

          <hr className="border-[var(--color-border)]" />

          {/* Section 2: Physical Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[var(--color-text-main)]">Breed</label>
              <input 
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                type="text" 
                placeholder="e.g. Labrador Retriever" 
                className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[var(--color-text-main)]">Age</label>
                <div className="flex items-center">
                  <input 
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    type="number" 
                    placeholder="0" 
                    min="0"
                    className="w-full px-4 py-3 rounded-l-xl border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none border-r-0"
                  />
                  <div className="px-3 py-3 bg-gray-50 border border-[var(--color-border)] border-l-0 rounded-r-xl text-sm text-[var(--color-text-muted)] font-medium">
                    Yrs
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[var(--color-text-main)]">Gender</label>
                <select 
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none bg-white"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

             <div className="space-y-1.5">
                <label className="text-sm font-bold text-[var(--color-text-main)] flex items-center gap-2">
                  Weight <span className="text-[var(--color-text-muted)] font-normal text-xs">(kg)</span>
                </label>
                <div className="relative">
                  <Ruler className="absolute left-3 top-3.5 w-4 h-4 text-[var(--color-text-muted)]" />
                  <input 
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    type="number" 
                    placeholder="e.g. 12.5" 
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition-all"
                  />
                </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[var(--color-border)] flex gap-3 justify-end bg-gray-50/50 rounded-b-3xl">
          <button 
            onClick={onClose}
            disabled={loading}
            className="px-6 py-3 rounded-xl border border-[var(--color-border)] text-[var(--color-text-muted)] font-bold hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-3 rounded-xl bg-[var(--color-primary)] text-white font-bold hover:opacity-90 shadow-lg shadow-[var(--color-primary)]/20 transition-all flex items-center gap-2 transform active:scale-95 disabled:opacity-70 disabled:active:scale-100"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Adding...</span>
              </>
            ) : (
              <>
                <Heart className="w-5 h-5 fill-white/20" />
                <span>Add to Family</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AddPetModal;