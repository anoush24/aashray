import React from 'react';
import { Clock, Stethoscope, ChevronRight, Pill } from "lucide-react";

const AppointmentCard = ({ appointment, onView }) => {

  const slotStart = new Date(appointment.slot_id?.startTime || appointment.slotDateTime || Date.now());
  const day = slotStart.getDate();
  const month = slotStart.toLocaleString("default", { month: "short" }).toUpperCase();
  const time = slotStart.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const isCompleted = appointment.status === 'Completed';

  
  return (
    <div className="bg-white rounded-3xl border border-[var(--color-border)] shadow-md hover:shadow-xl transition-all duration-300 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 m-4 relative overflow-hidden group">
      
      {/* LEFT: DATE BOX */}
      <div className={`w-20 h-20 md:w-24 md:h-24 rounded-3xl border flex flex-col items-center justify-center shadow-inner flex-shrink-0 transition-colors
        ${isCompleted 
            ? 'bg-green-50 border-green-200 text-green-700' 
            : 'bg-[var(--color-primary-light)] border-[var(--color-primary-border)] text-[var(--color-primary)]'
        }`}>
        <span className="text-2xl md:text-3xl font-extrabold">{day}</span>
        <span className="text-xs font-bold uppercase opacity-70">{month}</span>
      </div>

      {/* CENTER: CONTENT */}
      <div className="flex-1 space-y-2 w-full">
        
        {/* ROW 1: HOSPITAL + STATUS */}
        <div className="flex justify-between md:justify-start items-center gap-3">
          <h2 className="text-lg md:text-2xl font-bold capitalize text-[var(--color-text-main)] truncate">
            {appointment.hospital_id?.username || "Unknown Hospital"}
          </h2>

          <span className={`px-3 py-1 rounded-full text-[10px] md:text-xs font-bold shadow-sm uppercase tracking-wider ${
            isCompleted
              ? "bg-green-100 text-green-700 border border-green-200"
              : "bg-yellow-100 text-yellow-700 border border-yellow-200"
          }`}>
            {appointment.status}
          </span>
        </div>

        {/* ROW 2: PET info */}
        <p className="text-[var(--color-text-muted)] font-medium text-base md:text-lg capitalize flex items-center gap-2">
            <span className="text-[var(--color-primary)] font-bold">{appointment.pet_id?.name || appointment.patientName}</span>
            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
            <span>{appointment.reason}</span>
        </p>

        {/* ROW 3: CONDITIONAL DETAILS */}
        <div className="mt-3 pt-3 border-t border-dashed border-gray-200">
            {isCompleted ? (
                // --- HISTORY VIEW (Diagnosis & Meds) ---
                <div className="space-y-1 animate-in fade-in duration-300">
                    <div className="flex items-start gap-2 text-sm">
                        <Stethoscope size={16} className="text-green-600 mt-1 flex-shrink-0" />
                        <p className="text-gray-700">
                            <span className="font-bold text-gray-900">Diagnosis: </span>
                            {appointment.diagnosis || "No diagnosis recorded"}
                        </p>
                    </div>
                    {appointment.medicines && (
                        <div className="flex items-start gap-2 text-sm">
                            <Pill size={16} className="text-blue-500 mt-1 flex-shrink-0" />
                            <p className="text-gray-500 truncate max-w-md">
                                <span className="font-bold text-gray-700">Rx: </span>
                                {appointment.medicines}
                            </p>
                        </div>
                    )}
                </div>
            ) : (
                // --- UPCOMING VIEW (Time) ---
                <div className="flex gap-8 text-sm text-[var(--color-text-muted)]">
                    <span className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
                        <Clock size={16} className="text-[var(--color-primary)]"/> 
                        <span className="font-bold">{time}</span>
                    </span>
                </div>
            )}
        </div>
      </div>

      {/* RIGHT: ACTION BUTTON */}
      <button 
        // 2. Use the prop passed from parent
        onClick={() => onView(appointment)} 
        className="w-full md:w-auto px-6 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl font-bold text-sm text-[var(--color-text-main)] flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all whitespace-nowrap group-hover:border-[var(--color-primary)] group-hover:text-[var(--color-primary)]"
      >
        {isCompleted ? "View Report" : "View Details"} 
        <ChevronRight size={18} />
      </button>

    </div>
  );
};

export default AppointmentCard;