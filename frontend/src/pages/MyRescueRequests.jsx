import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ArrowLeft, Calendar, MapPin, Clock, Trash2, 
  CheckCircle2, Loader2, ExternalLink, AlertCircle, Heart 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyRescueRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // API Config
  const API_BASE_URL = 'http://localhost:5000/resc'; 

  // Fetch Data
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/getReq`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setRequests(res.data.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // Delete Handler
  const handleDelete = async (id, e) => {
    e.stopPropagation(); // Prevent card click
    if(!window.confirm("Are you sure you want to delete this request?")) return;

    try {
        const token = localStorage.getItem('token');
        await axios.post(`${API_BASE_URL}/deleteReq`, 
            { id }, 
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setRequests(prev => prev.filter(req => req._id !== id));
    } catch (err) {
        console.error(err);
        alert("Failed to delete request. It might already be removed.");
    }
  };

  // Helper for Status Styles
  const getStatusStyle = (status) => {
    switch(status?.toLowerCase()) {
        case 'resolved': return 'bg-emerald-500/10 text-emerald-600 border-emerald-200 shadow-emerald-500/20';
        case 'accepted': return 'bg-blue-500/10 text-blue-600 border-blue-200 shadow-blue-500/20';
        default: return 'bg-amber-500/10 text-amber-600 border-amber-200 shadow-amber-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans relative overflow-x-hidden selection:bg-indigo-500/30">
      
      {/* Dynamic Animated Background */}
      <div className="fixed inset-0 z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-400/30 rounded-full blur-[120px] animate-pulse"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-400/30 rounded-full blur-[120px] animate-pulse delay-1000"></div>
         <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-purple-400/20 rounded-full blur-[100px] animate-bounce delay-700"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto pt-10 px-6 pb-20">
        
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => navigate('/user/rescue')} 
                    className="p-3 bg-white/80 backdrop-blur-md border border-white/40 shadow-lg shadow-indigo-500/5 rounded-2xl hover:scale-105 hover:bg-white transition-all group"
                >
                    <ArrowLeft className="text-slate-600 group-hover:text-indigo-600 transition-colors" size={22} />
                </button>
                <div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
                        My Rescue Cases
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Track the lives you've helped save.</p>
                </div>
            </div>

            {/* Stats Pill (Optional Visual Flair) */}
            {!loading && requests.length > 0 && (
                <div className="hidden md:flex items-center gap-3 px-5 py-2.5 bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl shadow-sm">
                    <Heart className="text-rose-500 fill-rose-500" size={20} />
                    <span className="font-bold text-slate-700">{requests.length} Active Cases</span>
                </div>
            )}
        </div>

        {/* Content Area */}
        {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 bg-indigo-50 rounded-full"></div>
                    </div>
                </div>
                <p className="text-slate-400 font-bold mt-6 tracking-wide animate-pulse">SYNCING DATA...</p>
            </div>
        ) : error ? (
            <div className="max-w-md mx-auto p-8 bg-red-50/50 backdrop-blur-xl border border-red-100 rounded-3xl text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-red-700">Oops! Something went wrong</h3>
                <p className="text-red-500/80 mt-2">{error}</p>
            </div>
        ) : requests.length === 0 ? (
            <div className="text-center py-24 px-6 bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-white/60 shadow-xl shadow-indigo-500/5">
                <div className="w-24 h-24 bg-gradient-to-tr from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <Clock className="text-indigo-400" size={40} />
                </div>
                <h3 className="text-2xl font-black text-slate-700 mb-3">No Requests Yet</h3>
                <p className="text-slate-500 max-w-md mx-auto mb-10 leading-relaxed">
                    You haven't reported any animals in need yet. When you do, they will appear here for you to track.
                </p>
                <button 
                    onClick={() => navigate('/user/rescue')} 
                    className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold hover:shadow-lg hover:shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all duration-300"
                >
                    Start a New Request
                </button>
            </div>
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {requests.map((req) => {
                    // Normalize Map Link
                    const mapLink = req.gmap && req.gmap.startsWith('http') 
                        ? req.gmap 
                        : (req.location?.coordinates 
                            ? `http://googleusercontent.com/maps.google.com/maps?q=${req.location.coordinates[1]},${req.location.coordinates[0]}`
                            : '#');

                    return (
                        <div 
                            key={req._id} 
                            className="group relative bg-white/70 backdrop-blur-xl border border-white/60 rounded-[2.5rem] p-4 hover:bg-white hover:border-white hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 ease-out hover:-translate-y-2 flex flex-col sm:flex-row gap-5"
                        >
                            
                            {/* Image Container with Floating Badge */}
                            <div className="relative w-full sm:w-48 h-56 sm:h-auto flex-shrink-0 rounded-[2rem] overflow-hidden shadow-inner bg-slate-100 group-hover:shadow-md transition-all">
                                <img 
                                    src={req.file_url} 
                                    alt="Rescued Animal" 
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60"></div>
                                
                                {/* Status Badge */}
                                <div className={`absolute top-3 left-3 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border backdrop-blur-md flex items-center gap-1.5 ${getStatusStyle(req.status)}`}>
                                    <span className="relative flex h-2 w-2">
                                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${req.status === 'resolved' ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                                      <span className={`relative inline-flex rounded-full h-2 w-2 ${req.status === 'resolved' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                    </span>
                                    {req.status || 'Pending'}
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="flex-grow flex flex-col justify-between py-2 pr-2">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-800 leading-tight group-hover:text-indigo-700 transition-colors">
                                                Rescue Request
                                            </h3>
                                            <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-slate-400">
                                                <Calendar size={12} />
                                                {new Date(req.requestTime).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                            </div>
                                        </div>
                                        
                                        <button 
                                            onClick={(e) => handleDelete(req._id, e)}
                                            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all hover:rotate-12"
                                            title="Delete Record"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    {/* Action Chips */}
                                    <div className="flex flex-wrap gap-2 mt-5">
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100/80 rounded-lg text-slate-500 text-xs font-semibold">
                                            <Clock size={12} className="text-indigo-500" />
                                            {new Date(req.requestTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        
                                        <a 
                                            href={mapLink} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50/80 hover:bg-indigo-100 text-indigo-600 rounded-lg text-xs font-bold transition-colors"
                                        >
                                            <MapPin size={12} />
                                            Location
                                            <ExternalLink size={10} className="opacity-50" />
                                        </a>
                                    </div>
                                </div>

                                {/* Dynamic Footer */}
                                <div className="mt-6 pt-4 border-t border-dashed border-slate-200">
                                    {req.acceptedBy ? (
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-emerald-500/30">
                                                <CheckCircle2 size={14} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Accepted By</p>
                                                <p className="text-sm font-bold text-slate-700">{req.acceptedBy}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center animate-pulse">
                                                <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</p>
                                                <p className="text-sm font-bold text-slate-500">Waiting for responder...</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    );
                })}
            </div>
        )}
      </div>
    </div>
  );
};

export default MyRescueRequests;