import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Heart, 
  Share2, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Mail,
  Phone,
  Sparkles,
  Award
} from 'lucide-react';

const PetDetailsPage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('about');
  const [isLiked, setIsLiked] = useState(false);

  // --- STATIC MOCK DATA ---
  const pet = {
    _id: "101",
    name: "Bella",
    breed: "Golden Retriever Mix",
    species: "Dog",
    age: "2 Yrs",
    gender: "Female",
    location: "Bandra, Mumbai",
    price: "Free",
    images: [
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80", 
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80"
    ],
    tags: ["Vaccinated", "House Trained", "Friendly"],
    description: "Bella is a ray of sunshine! She loves morning walks along the beach and is great with kids. She was rescued from a shelter last year and has been rehabilitated. She is looking for a forever home where she can get plenty of belly rubs. She is slightly shy at first but warms up very quickly with treats.",
    health: {
      vaccinated: true,
      spayed: true,
      dewormed: true,
      medicalHistory: "Clean bill of health. Last checkup was in Dec 2025."
    },
    owner: {
      name: "Riya Sharma",
      email: "riya.adoption@example.com",
      phone: "+91 98765 43210",
      type: "Foster Parent"
    }
  };

  const [mainImage, setMainImage] = useState(pet.images[0]);

  return (
    // Added -mt-12 and -mx-8 to counteract parent padding and stick to the top
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-700 pb-12 relative overflow-hidden -mt-12 -mx-8">
      
      {/* --- BACKGROUND EFFECTS --- */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
         <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-700"></div>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-b from-white/50 via-transparent to-transparent"></div>
      </div>

      {/* --- NAVIGATION HEADER --- */}
      {/* Adjusted padding-top (pt-8) to ensure it doesn't look too cramped against the navbar */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 pt-8 pb-6 flex justify-between items-center">
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 bg-white/80 backdrop-blur-md px-5 py-3 rounded-full text-slate-600 hover:text-indigo-600 shadow-sm border border-slate-200 transition-all hover:shadow-md active:scale-95"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
          <span className="font-bold">Back</span>
        </button>

        <div className="flex gap-3">
            <button 
                onClick={() => setIsLiked(!isLiked)}
                className={`p-3 rounded-full backdrop-blur-md shadow-sm border transition-all hover:scale-110 active:scale-90 ${isLiked ? 'bg-pink-50 border-pink-200 text-pink-500' : 'bg-white/80 border-slate-200 text-slate-400 hover:text-pink-500'}`}
            >
                <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
            </button>
            <button className="p-3 rounded-full bg-white/80 backdrop-blur-md text-slate-400 hover:text-indigo-600 shadow-sm border border-slate-200 transition-all hover:scale-110">
                <Share2 size={20} />
            </button>
        </div>
      </div>

      {/* --- MAIN CONTENT CARD --- */}
      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-100/50 overflow-hidden border border-white/60 backdrop-blur-xl grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* --- LEFT: IMMERSIVE IMAGE GALLERY (5 Cols) --- */}
          <div className="lg:col-span-5 bg-slate-100 relative group h-full min-h-[400px] lg:min-h-[600px]">
             <img 
               src={mainImage} 
               alt={pet.name} 
               className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>
             
             {/* Floating Thumbnails */}
             <div className="absolute bottom-6 left-6 right-6 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {pet.images.map((img, idx) => (
                    <button 
                        key={idx}
                        onClick={() => setMainImage(img)}
                        className={`relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                            mainImage === img 
                            ? 'border-white shadow-lg scale-110 ring-2 ring-indigo-500 ring-offset-2 ring-offset-black/20' 
                            : 'border-white/50 opacity-80 hover:opacity-100 hover:scale-105'
                        }`}
                    >
                        <img src={img} alt="thumb" className="w-full h-full object-cover" />
                    </button>
                ))}
             </div>
          </div>

          {/* --- RIGHT: DETAILED INFO (7 Cols) --- */}
          <div className="lg:col-span-7 p-8 lg:p-12 flex flex-col h-full bg-white/50">
            
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-md shadow-emerald-200 uppercase tracking-wider flex items-center gap-1">
                        <Sparkles size={12} /> Available for Adoption
                    </span>
                    <span className="bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-bold border border-indigo-100 uppercase tracking-wider">
                        {pet.species}
                    </span>
                </div>

                <h1 className="text-5xl lg:text-6xl font-black text-slate-900 mb-2 tracking-tight">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600">
                        {pet.name}
                    </span>
                </h1>
                <p className="text-xl font-semibold text-slate-500 flex items-center gap-2">
                    {pet.breed}
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                    <span className="text-slate-400 font-medium text-lg">{pet.gender}</span>
                </p>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8">
                    <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex flex-col items-center justify-center text-center gap-1 hover:bg-indigo-50 transition-colors">
                        <Clock className="text-indigo-500 mb-1" size={20} />
                        <span className="text-xs text-slate-500 font-bold uppercase">Age</span>
                        <span className="text-slate-800 font-bold">{pet.age}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100 flex flex-col items-center justify-center text-center gap-1 hover:bg-pink-50 transition-colors">
                        <MapPin className="text-pink-500 mb-1" size={20} />
                        <span className="text-xs text-slate-500 font-bold uppercase">Location</span>
                        <span className="text-slate-800 font-bold text-sm">{pet.location.split(',')[0]}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex flex-col items-center justify-center text-center gap-1 hover:bg-emerald-50 transition-colors">
                        <Award className="text-emerald-500 mb-1" size={20} />
                        <span className="text-xs text-slate-500 font-bold uppercase">Health</span>
                        <span className="text-slate-800 font-bold text-sm">100%</span>
                    </div>
                </div>
            </div>

            {/* Custom Tabs */}
            <div className="flex gap-8 border-b border-slate-100 mb-6">
               {['about', 'health', 'owner'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-sm font-bold uppercase tracking-widest transition-all relative ${
                        activeTab === tab 
                        ? 'text-indigo-600' 
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.5)]"></span>
                    )}
                  </button>
               ))}
            </div>

            {/* Tab Content */}
            <div className="flex-grow mb-10 overflow-y-auto pr-2 custom-scrollbar">
                {activeTab === 'about' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <p className="text-slate-600 leading-relaxed text-lg mb-6 font-medium">
                            {pet.description}
                        </p>
                        <h4 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wide">Personality Traits</h4>
                        <div className="flex flex-wrap gap-2">
                            {pet.tags.map((tag) => (
                                <span key={tag} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold border border-slate-200">
                                    # {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'health' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                         <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                                    <ShieldCheck size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-emerald-900">Health Status</h4>
                                    <p className="text-emerald-700 text-sm">Verified by Vet</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-2 border-b border-emerald-100 last:border-0">
                                    <span className="text-slate-600 font-medium">Vaccinated</span>
                                    {pet.health.vaccinated ? <CheckCircle2 className="text-emerald-500" size={20} /> : <span className="text-slate-400">-</span>}
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-emerald-100 last:border-0">
                                    <span className="text-slate-600 font-medium">Spayed/Neutered</span>
                                    {pet.health.spayed ? <CheckCircle2 className="text-emerald-500" size={20} /> : <span className="text-slate-400">-</span>}
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-emerald-100 last:border-0">
                                    <span className="text-slate-600 font-medium">Dewormed</span>
                                    {pet.health.dewormed ? <CheckCircle2 className="text-emerald-500" size={20} /> : <span className="text-slate-400">-</span>}
                                </div>
                            </div>
                         </div>
                         <p className="text-slate-500 text-sm italic pl-2">Note: {pet.health.medicalHistory}</p>
                    </div>
                )}

                {activeTab === 'owner' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-indigo-200">
                                {pet.owner.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                                <h4 className="text-xl font-bold text-slate-900">{pet.owner.name}</h4>
                                <p className="text-indigo-600 font-bold text-sm mb-4 uppercase tracking-wide">{pet.owner.type}</p>
                                
                                <div className="space-y-2">
                                    <div className="flex items-center justify-center sm:justify-start gap-3 text-slate-600 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                                        <Mail size={18} className="text-indigo-400" />
                                        <span className="font-medium">{pet.owner.email}</span>
                                    </div>
                                    <div className="flex items-center justify-center sm:justify-start gap-3 text-slate-600 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                                        <Phone size={18} className="text-indigo-400" />
                                        <span className="font-medium">{pet.owner.phone}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4 mt-auto">
               <button className="flex-1 bg-[#1a1b4b] hover:bg-[#2e2e6e] text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-indigo-200 hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2 group">
                 <span>Adopt {pet.name}</span>
                 <Heart className="group-hover:text-red-400 transition-colors" fill="currentColor" size={20} />
               </button>
               <button className="px-6 py-4 border-2 border-slate-200 rounded-xl font-bold text-slate-700 hover:border-indigo-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                 <Mail size={24} />
               </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetailsPage;