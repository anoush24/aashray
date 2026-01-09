import React from 'react';
import { MapPin, Heart, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PetCard = ({ pet }) => {
  const navigate = useNavigate();

  // Guard clause to prevent crashes if data is missing
  if (!pet) return null;

  return (
    <div 
      onClick={() => navigate(`/user/adopt/pet/${pet._id}`)}
      // Added 'w-full max-w-[300px] mx-auto' to reduce width and center it
      className="group w-full max-w-[335px] mx-auto bg-white rounded-[1.5rem] shadow-sm hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-300 border border-slate-100 overflow-hidden cursor-pointer flex flex-col h-full relative"
    >
      {/* --- Image Section (Compact Height: h-52) --- */}
      <div className="relative h-52 overflow-hidden">
        <img 
          src={pet.image} 
          alt={pet.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Floating Heart Button */}
        <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-md rounded-full hover:bg-white text-slate-400 hover:text-red-500 transition-colors shadow-sm">
          <Heart size={18} className={pet.isFavorite ? "fill-red-500 text-red-500" : ""} />
        </button>
        
        {/* Floating Tags */}
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5 pr-4">
          {pet.tags && pet.tags.map((tag, index) => (
            <span key={index} className="px-2.5 py-0.5 bg-white/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-indigo-600 rounded-full shadow-sm">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* --- Content Section (Compact Padding: p-4) --- */}
      <div className="p-4 flex flex-col flex-grow">
        
        {/* Header (Compact Margin: mb-2) */}
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2 group-hover:text-indigo-700 transition-colors">
              {pet.name}
              {/* Gender Icon */}
              <span className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] ${pet.gender === 'Male' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}`}>
                {pet.gender === 'Male' ? '♂' : '♀'}
              </span>
            </h3>
            <p className="text-slate-500 font-medium text-xs mt-0.5">{pet.breed}</p>
          </div>
          
          {/* Age Badge */}
          <div className="flex flex-col items-end">
             <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-lg border border-indigo-100">
               {pet.age}
             </span>
          </div>
        </div>

        {/* Location (Compact Margin: mb-3) */}
        <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium mb-3 mt-auto">
          <MapPin size={14} className="text-indigo-400" />
          <span>{pet.location}</span>
        </div>

        {/* Action Button (Compact Padding: py-2.5) */}
        <button className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs tracking-wide hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-200 transition-all duration-300 flex justify-center items-center gap-2 group-hover:translate-y-[-2px]">
          <Sparkles size={14} />
          Meet {pet.name}
        </button>
      </div>
    </div>
  );
};

export default PetCard;