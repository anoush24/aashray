import React from 'react';
import { MoreVertical } from 'lucide-react'; 

const MyPetCard = ({ pet }) => {
  // Destructure safely. 
  // We use `|| {}` to prevent errors if pet data is still loading or null.
  const { 
    name = "Unknown", 
    breed, 
    species,
    file_url,
    age, 
    gender, 
    weight 
  } = pet || {};

  // Helper for generic fallback image based on species if no photo uploaded
  const getImageSrc = () => {
    if (file_url) return file_url;
    
    // Simple placeholders based on species
    const type = species?.toLowerCase();
    if (type === 'cat') return "https://placekitten.com/300/300";
    if (type === 'bird') return "https://images.unsplash.com/photo-1552728089-57bdde30ebd1?w=300&h=300&fit=crop";
    return "https://placedog.net/500/500"; // Default Dog
  };

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-[var(--color-border)] flex flex-col items-center w-full relative hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
      
      {/* Edit Menu Button - Only visible on Hover for a cleaner look */}
      <button className="absolute top-5 right-5 text-gray-300 hover:text-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-opacity">
        <MoreVertical size={20} />
      </button>

      {/* 1. Circular Avatar Image */}
      <div className="mb-4 relative">
        <div className="w-24 h-24 rounded-full p-1 border-[3px] border-[var(--color-primary)]/20 group-hover:border-[var(--color-primary)] transition-colors">
          <img 
            src={getImageSrc()} 
            alt={name} 
            className="w-full h-full rounded-full object-cover"
            onError={(e) => {e.target.src = "https://placedog.net/500/500"}} // Safety fallback
          />
        </div>
      </div>

      {/* 2. Name & Breed */}
      <h3 className="text-xl font-extrabold text-[var(--color-text-main)] font-nunito mb-1 text-center truncate w-full px-2">
        {name}
      </h3>
      <p className="text-sm text-[var(--color-text-muted)] font-medium mb-6 text-center truncate w-full px-4">
        {breed || species || "Unknown Pet"}
      </p>

      {/* 3. Divider */}
      <div className="w-full h-px bg-gray-100 mb-4"></div>

      {/* 4. Stats Row */}
      <div className="flex justify-between w-full px-2">
        
        {/* Age */}
        <div className="flex flex-col items-center w-1/3">
          <span className="text-[var(--color-primary)] font-extrabold text-sm">
            {/* Check specifically for undefined so '0' is valid */}
            {age !== undefined && age !== null ? `${age} Yrs` : '-'}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mt-1">Age</span>
        </div>

        {/* Vertical Divider */}
        <div className="w-px h-8 bg-gray-100"></div>

        {/* Gender */}
        <div className="flex flex-col items-center w-1/3">
          <span className="text-[var(--color-primary)] font-extrabold text-sm capitalize truncate max-w-full px-1">
            {gender || '-'}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mt-1">Sex</span>
        </div>

        {/* Vertical Divider */}
        <div className="w-px h-8 bg-gray-100"></div>

        {/* Weight */}
        <div className="flex flex-col items-center w-1/3">
          <span className="text-[var(--color-primary)] font-extrabold text-sm">
             {weight ? `${weight}kg` : '-'}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mt-1">Weight</span>
        </div>

      </div>
    </div>
  );
};

export default MyPetCard;