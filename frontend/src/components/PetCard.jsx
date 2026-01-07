import React from 'react'

const PetCard = ({ img, name, breed, stats }) => (
  <div className="bg-[var(--color-bg-card)] rounded-3xl p-6 shadow-sm border border-[var(--color-border)] flex flex-col items-center hover:-translate-y-1 hover:shadow-md transition duration-300">
    <div className="w-24 h-24 rounded-full p-1 border-2 border-[var(--color-primary)] mb-4">
      <img src={img} alt={name} className="w-full h-full object-cover rounded-full" />
    </div>
    <h3 className="font-bold text-xl mb-1">{name}</h3>
    <p className="text-[var(--color-text-muted)] text-sm mb-6">{breed}</p>
    
    <div className="w-full flex justify-around border-t border-[var(--color-border)] pt-4">
      {Object.entries(stats).map(([key, val]) => (
        <div key={key} className="flex flex-col items-center">
          <span className="font-bold text-[var(--color-primary)] text-sm">{val}</span>
          <span className="text-[var(--color-text-muted)] text-xs capitalize">{key}</span>
        </div>
      ))}
    </div>
  </div>
);

export default PetCard;