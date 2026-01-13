import React from 'react';
import { User } from 'lucide-react';

const UpcomingList = ({ slots, onViewDetails }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {slots.map((slot) => (
        <div key={slot._id} className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--color-border)] flex flex-col md:flex-row justify-between items-center gap-4 hover:border-[var(--color-primary)] transition">
          {/* Time & Patient */}
          <div className="flex items-center gap-4">
            <div className="bg-[var(--color-primary-light)] text-[var(--color-primary)] w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-bold">
              <span className="text-xl">{new Date(slot.slotDateTime).getDate()}</span>
              <span className="text-xs uppercase">{new Date(slot.slotDateTime).toLocaleString('default', { month: 'short' })}</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-[var(--color-text-main)]">
                {new Date(slot.slotDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </h3>
              <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                  <User size={14}/> {slot.patientName} ({slot.patientBreed})
              </div>
            </div>
          </div>
          {/* Action Button */}
          <button 
            onClick={() => onViewDetails(slot)} 
            className="px-6 py-2 text-sm font-bold text-[var(--color-primary)] border border-[var(--color-border)] rounded-xl hover:bg-[var(--color-primary-light)] transition"
          >
            View Details
          </button>
        </div>
      ))}
    </div>
  );
};

export default UpcomingList;