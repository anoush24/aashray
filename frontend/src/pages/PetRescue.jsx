import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import { Camera, X, CheckCircle2, AlertTriangle, Loader2, Navigation, Link as LinkIcon, History, AlertCircle, ArrowLeft, Stethoscope, Check } from 'lucide-react';

const PetRescue = () => {
  const navigate = useNavigate(); // 2. Initialize Hook
  const [loading, setLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState('idle');
  
  // State for Duplicate Detection
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicateImages, setDuplicateImages] = useState([]);

  // State for Success View
  const [isSuccess, setIsSuccess] = useState(false);
  
  // State to store the list of notified hospitals
  const [notifiedHospitals, setNotifiedHospitals] = useState([]);

  const [formData, setFormData] = useState({
    gmap: '',
    petImage: null,
    previewUrl: null
  });

  // --- API CONFIG ---
  const API_BASE_URL = 'http://localhost:5000/resc'; 

  // 1. Get Location
  const handleGetLocation = () => {
    setLocationStatus('locating');
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      setLocationStatus('error');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const gmapLink = `http://googleusercontent.com/maps.google.com/maps?q=${latitude},${longitude}`;
        
        setTimeout(() => {
            setFormData(prev => ({ ...prev, gmap: gmapLink }));
            setLocationStatus('success');
        }, 1000);
      },
      (error) => {
        console.error("Error fetching location", error);
        setLocationStatus('error');
      }
    );
  };

  // 2. Handle Image Input
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        petImage: file,
        previewUrl: URL.createObjectURL(file)
      }));
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, petImage: null, previewUrl: null }));
  };

  // 3. Initial Check (Step 1)
  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    if (!formData.gmap || !formData.petImage) {
      alert("Please provide both a location and a photo.");
      return;
    }

    setLoading(true);

    try {
        const token = localStorage.getItem('token'); 
        const res = await axios.post(`${API_BASE_URL}/initialReq`, 
            { gmap: formData.gmap },
            { headers: { Authorization: `Bearer ${token}` } } 
        );

        if (res.data.message === "Animals from same location") {
            setDuplicateImages(res.data.data); 
            setShowDuplicateModal(true);
            setLoading(false); 
        } else {
            await submitFinalRequest(); 
        }

    } catch (err) {
        console.error("Error in initial request:", err);
        alert("Connection error. Please try again.");
        setLoading(false);
    }
  };

  // 4. Final Generation (Step 2)
  const submitFinalRequest = async () => {
    try {
        setLoading(true); 

        const payload = new FormData();
        payload.append('gmap', formData.gmap);
        payload.append('file', formData.petImage);

        const token = localStorage.getItem('token');
        
        const res = await axios.post(`${API_BASE_URL}/genRequest`, payload, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
            }
        });

        // Capture list
        setNotifiedHospitals(res.data.hospitalRequests || []);

        setIsSuccess(true);
        setShowDuplicateModal(false);

    } catch (err) {
        console.error("Error generating request:", err);
        alert("Failed to send request: " + (err.response?.data?.message || err.message));
    } finally {
        setLoading(false);
    }
  };

  const handleDuplicateYes = () => {
    setShowDuplicateModal(false);
    setFormData({ gmap: '', petImage: null, previewUrl: null });
    setLocationStatus('idle');
    // Alert removed as requested
  };

  const resetAll = () => {
    setIsSuccess(false);
    setNotifiedHospitals([]); 
    setFormData({ gmap: '', petImage: null, previewUrl: null });
    setLocationStatus('idle');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20 -mt-12 -mx-8 relative overflow-hidden">
      
      {/* Background Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
         <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
         <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center pt-10 lg:pt-16 px-4">
        
        {/* Previous Requests Button (With Navigation) */}
        <button 
            onClick={() => navigate('/user/my-requests')} // 3. Added Navigation
            className="absolute top-6 right-6 md:right-12 flex items-center gap-2 px-5 py-2.5 bg-gradient-to-tr from-purple-400/20 to-red-400/20 backdrop-blur-md border border-purple-300/50 rounded-full font-bold text-sm text-purple-900 shadow-sm hover:shadow-md hover:bg-purple-400/30 transition-all cursor-pointer z-50"
        >
            <History size={18} className="text-purple-700"/>
            <span>My Requests</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100 text-red-600 font-bold text-xs uppercase tracking-wider mb-4 animate-pulse">
                <AlertTriangle size={14} /> Emergency Mode
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">
                Rescue <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Signal</span>
            </h1>
            <p className="text-slate-500 mt-3 text-lg font-medium">
                Detect location. Snap photo. Save a life.
            </p>
        </div>

        {/* --- MAIN CARD --- */}
        <div className="w-full max-w-lg bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl overflow-hidden min-h-[550px] relative transition-all duration-500 flex flex-col">
            
            {/* 1. SUCCESS VIEW (Improved Hospital List) */}
            {isSuccess ? (
                <div className="absolute inset-0 z-20 flex flex-col items-center p-6 md:p-8 animate-in zoom-in-95 duration-500">
                    
                    {/* Top Status */}
                    <div className="text-center flex-shrink-0 mb-6">
                        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 shadow-green-200 shadow-xl border-4 border-white">
                            <CheckCircle2 size={40} className="text-green-600 animate-bounce" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-800">Help is on the way!</h2>
                        <p className="text-slate-500 font-medium mt-1">
                            Broadcasted to <strong>{notifiedHospitals.length}</strong> nearby rescue centers.
                        </p>
                    </div>

                    {/* --- HOSPITAL LIST (Scrollable) --- */}
                    <div className="w-full flex-grow overflow-hidden flex flex-col mb-6">
                         <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            Live Status
                         </div>
                         
                         <div className="space-y-3 overflow-y-auto pr-1 custom-scrollbar pb-2">
                            {notifiedHospitals.length > 0 ? (
                                notifiedHospitals.map((req, index) => (
                                    <div key={index} className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                                <Stethoscope size={20} />
                                            </div>
                                            <div className="text-left overflow-hidden">
                                                <h4 className="font-bold text-slate-800 text-sm md:text-base truncate max-w-[150px] md:max-w-[200px]">
                                                    {req.hospitalName || req.requestedTo?.name || "Verified Veterinary Center"}
                                                </h4>
                                                <p className="text-xs text-green-600 font-bold flex items-center gap-1">
                                                    Emergency Alert Sent
                                                </p>
                                            </div>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                            <Check size={16} strokeWidth={3} />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                    <p className="text-slate-400 font-medium text-sm">Request broadcasted to area.</p>
                                </div>
                            )}
                         </div>
                    </div>

                    <button 
                        onClick={resetAll}
                        className="w-full py-4 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white rounded-2xl font-bold shadow-lg shadow-slate-200 transition-all transform hover:-translate-y-1 cursor-pointer flex-shrink-0"
                    >
                        Report Another Case
                    </button>
                </div>
            ) : (
                /* 2. FORM VIEW */
                <form onSubmit={handleInitialSubmit} className="p-6 md:p-8 space-y-6 flex-grow flex flex-col justify-center">
                    
                    {/* Location Input */}
                    <div className="space-y-3">
                        <div className="relative">
                            {locationStatus === 'success' ? (
                                 <div className="w-full p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center justify-between group transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-200">
                                            <CheckCircle2 size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-700">Location Locked</p>
                                            <p className="text-xs text-green-600 font-medium">Ready for transmission</p>
                                        </div>
                                    </div>
                                    <button type="button" onClick={() => setLocationStatus('idle')} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                                        <span className="text-xs font-bold underline">Change</span>
                                    </button>
                                 </div>
                            ) : (
                                <button 
                                    type="button"
                                    onClick={handleGetLocation}
                                    disabled={locationStatus === 'locating'}
                                    className={`group relative w-full h-24 rounded-2xl border-2 border-dashed border-slate-300 hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-300 flex items-center justify-center overflow-hidden cursor-pointer
                                        ${locationStatus === 'locating' ? 'bg-indigo-50 border-indigo-500 cursor-wait' : ''}
                                    `}
                                >
                                    {locationStatus === 'locating' && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-full h-1 bg-indigo-500/20 absolute animate-scan"></div>
                                            <div className="w-16 h-16 border-4 border-indigo-500 rounded-full animate-ping opacity-20"></div>
                                        </div>
                                    )}

                                    <div className="relative z-10 flex flex-col items-center gap-2">
                                        {locationStatus === 'locating' ? (
                                            <>
                                                <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
                                                <span className="text-sm font-bold text-indigo-700">Triangulating...</span>
                                            </>
                                        ) : (
                                            <>
                                                <div className="p-2 bg-indigo-100 rounded-full group-hover:scale-110 transition-transform">
                                                    <Navigation className="w-6 h-6 text-indigo-600" />
                                                </div>
                                                <span className="text-sm font-bold text-slate-600 group-hover:text-indigo-700">Tap to Auto-Detect Location</span>
                                            </>
                                        )}
                                    </div>
                                </button>
                            )}
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <LinkIcon size={18} className="text-slate-400 group-focus-within:text-red-500 transition-colors" />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Or paste Google Maps link here..." 
                                value={formData.gmap}
                                onChange={(e) => setFormData({...formData, gmap: e.target.value})}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-red-400 focus:bg-white transition-all text-sm font-semibold text-slate-600 placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    {/* Photo Upload */}
                    <div className="space-y-2">
                        {!formData.previewUrl ? (
                            <div className="relative w-full aspect-[4/3] bg-slate-900 rounded-3xl overflow-hidden border-4 border-slate-100 shadow-inner group cursor-pointer">
                                 <input 
                                    type="file" 
                                    accept="image/*"
                                    capture="environment" 
                                    onChange={handleImageChange}
                                    className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer"
                                 />
                                 <div className="absolute inset-0 pointer-events-none opacity-60">
                                    <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-white rounded-tl-lg"></div>
                                    <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-white rounded-tr-lg"></div>
                                    <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-white rounded-bl-lg"></div>
                                    <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-white rounded-br-lg"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                    </div>
                                 </div>
                                 <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                                    <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-2 group-hover:bg-white/20 transition-all">
                                        <Camera className="w-8 h-8 text-white" />
                                    </div>
                                    <span className="text-white font-medium tracking-wide text-sm">Tap to Capture</span>
                                 </div>
                            </div>
                        ) : (
                            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-lg group">
                                <img src={formData.previewUrl} alt="Evidence" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                                    <button type="button" onClick={handleRemoveImage} className="p-3 bg-red-500 text-white rounded-full hover:scale-110 transition-transform shadow-lg cursor-pointer">
                                        <X size={24} />
                                    </button>
                                </div>
                                <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/20">
                                    <span className="text-white text-xs font-bold flex items-center gap-1">
                                        <CheckCircle2 size={12} className="text-green-400" /> READY
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`w-full py-5 rounded-2xl font-black text-lg uppercase tracking-wider shadow-xl transition-all transform active:scale-95 cursor-pointer
                            ${loading 
                                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                                : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white shadow-red-200 hover:shadow-red-300'
                            }
                        `}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader2 className="animate-spin" /> Processing...
                            </span>
                        ) : (
                            "Send Rescue Request"
                        )}
                    </button>
                </form>
            )}
        </div>
      </div>

      {/* --- DUPLICATE DETECTION MODAL --- */}
      {showDuplicateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden scale-100 animate-in zoom-in-95 duration-200 border border-slate-100">
                
                {/* Modal Header */}
                <div className="bg-orange-50 p-6 text-center border-b border-orange-100">
                    <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3">
                        <AlertCircle className="text-orange-600" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Similar Report Found!</h3>
                    <p className="text-sm text-slate-500 mt-1">We found existing reports in this exact location.</p>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                    <p className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">Is this the same animal?</p>
                    
                    {/* Images Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        {duplicateImages.map((imgUrl, index) => (
                            <div key={index} className="aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
                                <img src={imgUrl} alt="Similar Report" className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col gap-3">
                        {/* 1. YES Button -> Cancel (Go Back) */}
                        <button 
                            onClick={handleDuplicateYes}
                            className="w-full py-4 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                           <ArrowLeft size={18} /> Yes, it's the same (Go Back)
                        </button>

                        {/* 2. NO Button -> Submit (Go to DB) */}
                        <button 
                            onClick={submitFinalRequest}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                            No, Different Animal (Submit Report) <CheckCircle2 size={18} /> 
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
        }
        @keyframes scan {
            0% { top: 0%; opacity: 0; }
            50% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
        }
        .animate-scan {
            animation: scan 2s linear infinite;
        }
        @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
            animation: blob 7s infinite;
        }
      `}</style>
    </div>
  );
};

export default PetRescue;