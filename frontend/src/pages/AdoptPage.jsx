import React, { useState, useEffect } from 'react';
import { Search, MapPin, SlidersHorizontal, Loader2 } from 'lucide-react';
import axios from 'axios';
import PetCard from '../components/PetCard'; 

const AdoptPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Pets');
  
  // --- DYNAMIC STATE ---
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- API CONFIGURATION ---
  const API_BASE_URL = 'http://localhost:5000/users'; 

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/getAllPets`); 
        
        const backendData = response.data["List of all available pets"] || [];

        const formattedPets = backendData.map(pet => ({
          _id: pet._id,
          name: pet.name,
          breed: pet.breed || 'Unknown Mix',
          species: pet.species, 
          gender: pet.gender,
          age: pet.age ? `${pet.age} Yrs` : 'Young',
          location: "Mumbai", 
          image: pet.file_url || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80", 
          tags: [pet.species, "Vaccinated"],
          description: pet.description || "Looking for a loving home.",
          ownerEmail: pet.email
        }));

        setPets(formattedPets);
        setError(null);
      } catch (err) {
        console.error("Error fetching pets:", err);
        setError("Failed to load pets. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  // --- ADOPTION HANDLER ---
  const handleAdopt = async (animalId) => {
    try {
        const token = localStorage.getItem('token'); 
        
        if (!token) {
            alert("Please login to adopt a pet!");
            return;
        }

        const response = await axios.post(
            `${API_BASE_URL}/wantToAdopt`, 
            { animalId },
            { headers: { Authorization: `Bearer ${token}` } } 
        );

        alert(`Success! Contact details sent to your email. \nOwner: ${response.data.emailResponse || 'Check your inbox'}`);
    } catch (err) {
        console.error("Adoption request failed:", err);
        alert("Failed to send request. " + (err.response?.data?.error || err.message));
    }
  };

  const categories = ['All Pets', 'Dogs', 'Cats', 'Birds'];

  // --- FILTER LOGIC ---
  const filteredPets = pets.filter(pet => {
    const matchesCategory = 
      activeCategory === 'All Pets' || 
      (activeCategory === 'Dogs' && pet.species?.toLowerCase() === 'dog') ||
      (activeCategory === 'Cats' && pet.species?.toLowerCase() === 'cat') ||
      (activeCategory === 'Birds' && pet.species?.toLowerCase() === 'bird');

    const matchesSearch = 
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      pet.breed.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20 -mt-12 -mx-8">
      
      {/* --- HERO SECTION --- */}
      <div className="relative pt-6 pb-12 lg:pt-10 lg:pb-20 overflow-hidden bg-gradient-to-b from-indigo-50/50 via-white to-white">
        
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
            <div className="absolute -top-10 left-1/4 w-96 h-96 bg-indigo-200/50 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
            <div className="absolute -top-10 right-1/4 w-96 h-96 bg-pink-200/50 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          
          {/* --- NEW LIVE STATUS PILL (Replaces 500+ Families) --- */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-slate-200 cursor-default transition-transform hover:scale-105">
                {/* Pulse Animation */}
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                
                {/* Dynamic Counter */}
                <span className="text-sm font-semibold text-slate-700">
                    {loading ? "Updating feed..." : (
                        <>
                            <span className="text-emerald-600 font-bold">{pets.length}</span> verified pets looking for a home
                        </>
                    )}
                </span>
            </div>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
            Find Your New <br className="hidden md:block" />
            <span className="relative inline-block px-2">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600">
                    Best Friend
                </span>
                <span className="ml-4 inline-block animate-bounce text-slate-900">🐾</span>
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-indigo-300 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" />
                </svg>
            </span> 
          </h1>

          <p className="text-slate-600 mb-8 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
            Browse through verified profiles, medical history, and personality traits. 
            <span className="text-indigo-600 font-bold"> Adoption is free</span> on PetUnity.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full opacity-20 blur-lg transition duration-200 group-hover:opacity-40"></div>
            
            <div className="relative bg-white p-2 rounded-full shadow-2xl shadow-indigo-100/50 flex items-center border border-white/50 backdrop-blur-xl">
                <div className="pl-6 text-slate-400">
                  <Search size={24} />
                </div>
                <input 
                  type="text" 
                  placeholder="What are you looking for? (e.g., Golden Retriever)..." 
                  className="flex-grow px-4 py-4 outline-none text-slate-700 placeholder-slate-400 bg-transparent text-lg font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="hidden md:flex items-center gap-2 px-6 border-l border-slate-100 text-slate-500 font-semibold cursor-pointer hover:text-indigo-600 transition-colors">
                  <MapPin size={20} className="text-indigo-500" />
                  <span>Mumbai</span>
                </div>
                <button className="bg-[#1a1b4b] hover:bg-[#2e2e6e] text-white p-4 rounded-full transition-all transform hover:scale-105 shadow-lg active:scale-95">
                  <Search size={20} />
                </button>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 shadow-sm border ${
                  activeCategory === cat 
                    ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200 transform scale-105' 
                    : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600 hover:-translate-y-1'
                }`}
              >
                {cat}
              </button>
            ))}
            <button className="px-8 py-3 rounded-full bg-white text-slate-600 border border-slate-200 text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm">
              <SlidersHorizontal size={16} /> More Filters
            </button>
          </div>

        </div>
      </div>

      {/* --- GRID SECTION --- */}
      <div className="max-w-[1400px] mx-auto px-6 relative z-20">
        
        {/* Loading State */}
        {loading && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <Loader2 size={48} className="animate-spin mb-4 text-indigo-600" />
                <p>Fetching furry friends...</p>
            </div>
        )}

        {/* Error State */}
        {error && (
            <div className="text-center py-10 text-red-500 bg-red-50 rounded-xl border border-red-100 mb-10">
                {error}
            </div>
        )}

        {/* Success State Grid */}
        {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredPets.map((pet) => (
                <PetCard 
                    key={pet._id} 
                    pet={pet} 
                    onAdopt={() => handleAdopt(pet._id)} 
                />
            ))}
            </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredPets.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100 mt-8">
            <div className="inline-block p-6 rounded-full bg-indigo-50 mb-4">
              <Search size={40} className="text-indigo-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-700">No pets found</h3>
            <p className="text-slate-400 mt-2">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdoptPage;