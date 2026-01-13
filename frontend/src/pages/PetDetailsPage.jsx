import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, Heart, Share2, ArrowLeft, CheckCircle2, 
  Clock, ShieldCheck, Mail, Phone, Sparkles, Award, Loader2 
} from 'lucide-react';

const PetDetailsPage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  // Dynamic State
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  
  // UI State
  const [activeTab, setActiveTab] = useState('about');
  const [isLiked, setIsLiked] = useState(false);
  const [adoptLoading, setAdoptLoading] = useState(false);

  // 1. FETCH PET DATA ON MOUNT
  useEffect(() => {
    const fetchPetDetails = async () => {
      try {
        // UPDATED: Using the route you specified
        const response = await fetch(`http://localhost:5000/users/adopt/${id}`);
        
        if (!response.ok) throw new Error('Could not fetch pet details');
        
        const data = await response.json();
        
        // Check if data is wrapped in { success: true, pet: {...} } or just {...}
        // Based on standard API practices, it's usually data.pet, but let's handle both
        const petData = data.pet || data; 
        
        setPet(petData);
        
        // Handle images: Map the 'file_url' from your DB screenshot to the UI
        // If you have multiple images later, you can add them to this array
        const initialImage = petData.file_url || "https://via.placeholder.com/400";
        setMainImage(initialImage); 
        
      } catch (err) {
        console.error("Error fetching pet:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPetDetails();
  }, [id]);

  // 2. INTEGRATE ADOPTION API
  const handleAdopt = async () => {
    const token = localStorage.getItem('token'); 
    
    if (!token) {
      alert("You must be logged in to adopt!");
      return navigate('/login');
    }

    setAdoptLoading(true);
    try {
      const response = await fetch('http://localhost:5000/users/wantToAdopt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ animalId: id })
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message || "Owner details have been sent to your email!");
      } else {
        alert(result.error || "Something went wrong. Please try again.");
        if (response.status === 401) navigate('/login');
      }
    } catch (err) {
      console.error("Adoption error:", err);
      alert("Network error. Please try again later.");
    } finally {
      setAdoptLoading(false);
    }
  };

  // --- LOADING & ERROR STATES ---
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-indigo-600" size={48} />
    </div>
  );

  if (error || !pet) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
      <h2 className="text-2xl font-bold text-slate-800">Pet not found</h2>
      <button onClick={() => navigate(-1)} className="text-indigo-600 hover:underline">Go Back</button>
    </div>
  );

  // --- DATA NORMALIZATION (Matching your Screenshot Schema) ---
  const displayLocation = pet.location || "Mumbai, India"; // Fallback as location wasn't in screenshot
  const displayOwnerName = pet.owner_name || "Hope Animal Shelter";
  const displayOwnerEmail = pet.email || "Contact for info";
  const displayOwnerPhone = pet.contactNumber || "Hidden";
  
  // Create an image array for the gallery (using file_url repeatedly or placeholders if only 1 exists)
  const petImages = [pet.file_url];

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-700 pb-12 relative overflow-hidden">
      
      {/* --- BACKGROUND EFFECTS --- */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
         <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-700"></div>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-b from-white/50 via-transparent to-transparent"></div>
      </div>

      {/* --- NAVIGATION HEADER --- */}
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
          
          {/* --- LEFT: IMAGE GALLERY --- */}
          <div className="lg:col-span-5 bg-slate-100 relative group h-[400px] lg:h-auto min-h-[400px]">
             <img 
               src={mainImage} 
               alt={pet.name} 
               className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>
          </div>

          {/* --- RIGHT: DETAILED INFO --- */}
          <div className="lg:col-span-7 p-8 lg:p-12 flex flex-col h-full bg-white/50">
            
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-md shadow-emerald-200 uppercase tracking-wider flex items-center gap-1">
                        <Sparkles size={12} /> {pet.status || 'Available'}
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
                    <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex flex-col items-center justify-center text-center gap-1">
                        <Clock className="text-indigo-500 mb-1" size={20} />
                        <span className="text-xs text-slate-500 font-bold uppercase">Age</span>
                        <span className="text-slate-800 font-bold">{pet.age} Years</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100 flex flex-col items-center justify-center text-center gap-1">
                        <Award className="text-pink-500 mb-1" size={20} />
                        <span className="text-xs text-slate-500 font-bold uppercase">Weight</span>
                        <span className="text-slate-800 font-bold">{pet.weight || "N/A"} kg</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex flex-col items-center justify-center text-center gap-1">
                        <ShieldCheck className="text-emerald-500 mb-1" size={20} />
                        <span className="text-xs text-slate-500 font-bold uppercase">Health</span>
                        <span className="text-slate-800 font-bold">100%</span>
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
                        activeTab === tab ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full"></span>
                    )}
                  </button>
               ))}
            </div>

            {/* Tab Content */}
            <div className="flex-grow mb-10 overflow-y-auto pr-2 custom-scrollbar h-48">
                {activeTab === 'about' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <p className="text-slate-600 leading-relaxed text-lg mb-6 font-medium">
                            {pet.description || "No description provided."}
                        </p>
                    </div>
                )}

                {activeTab === 'health' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                          <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-2 border-b border-emerald-100 last:border-0">
                                    <span className="text-slate-600 font-medium">Vaccinations</span>
                                    {/* Checks if vaccinations array exists and has items */}
                                    {pet.vaccinations && pet.vaccinations.length > 0 ? (
                                        <span className="text-emerald-700 font-bold text-sm">
                                            {pet.vaccinations.length} Recorded
                                        </span>
                                    ) : (
                                        <span className="text-slate-400">-</span>
                                    )}
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-emerald-100 last:border-0">
                                    <span className="text-slate-600 font-medium">Fit for Adoption</span>
                                    <CheckCircle2 className="text-emerald-500" size={20} />
                                </div>
                            </div>
                          </div>
                    </div>
                )}

                {activeTab === 'owner' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-indigo-200">
                                {displayOwnerName.charAt(0)}
                            </div>
                            <div className="flex-1">
                                <h4 className="text-xl font-bold text-slate-900">{displayOwnerName}</h4>
                                <p className="text-indigo-600 font-bold text-sm mb-4 uppercase tracking-wide">Owner / NGO</p>
                                
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3 text-slate-600 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                                        <Mail size={18} className="text-indigo-400" />
                                        <span className="font-medium">{displayOwnerEmail}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-600 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                                        <Phone size={18} className="text-indigo-400" />
                                        <span className="font-medium">{displayOwnerPhone}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4 mt-auto">
               <button 
                 onClick={handleAdopt}
                 disabled={adoptLoading || !pet}
                 className="flex-1 bg-[#1a1b4b] hover:bg-[#2e2e6e] text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-indigo-200 hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
               >
                 {adoptLoading ? (
                    <>
                        <Loader2 className="animate-spin" size={20} />
                        <span>Processing...</span>
                    </>
                 ) : (
                    <>
                        <span>Adopt {pet ? pet.name : 'this pet'}</span>
                        <Heart className="group-hover:text-red-400 transition-colors" fill="currentColor" size={20} />
                    </>
                 )}
               </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetailsPage;