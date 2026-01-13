import React from 'react';
import { X, CalendarDays, MapPin, Phone, Stethoscope, Pill, Clipboard, PawPrint } from 'lucide-react';

const AppointDetailsModal = ({ appointment, onClose }) => {
  if (!appointment) return null;

  const isCompleted = appointment.status === 'Completed';

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    return {
        date: d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
        time: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };
  };

  const { date, time } = formatDate(appointment.slot_id?.startTime || appointment.slotDateTime);
  const hospital = appointment.hospital_id || {};
  const pet = appointment.pet_id || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* BACKDROP */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      {/* MODAL CARD */}
      <div className="bg-white rounded-3xl w-full max-w-lg relative z-10 shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* 1. HEADER */}
        <div className={`p-6 flex justify-between items-center border-b ${
            isCompleted 
            ? 'bg-green-50 border-green-100' 
            : 'bg-[var(--color-primary-light)] border-[var(--color-primary-border)]'
        }`}>
          <div>
            <h2 className={`text-xl font-extrabold ${
                isCompleted ? 'text-green-800' : 'text-[var(--color-primary)]'
            }`}>
              {isCompleted ? 'Medical Report' : 'Appointment Details'}
            </h2>
            <div className={`flex items-center gap-2 text-sm font-bold mt-1 ${
                isCompleted ? 'text-green-600/70' : 'text-[var(--color-primary)] opacity-80'
            }`}>
               <CalendarDays size={16} /> 
               {date} at {time}
            </div>
          </div>
          
          <button 
            onClick={onClose} 
            className="p-2 bg-white rounded-full hover:bg-gray-50 transition shadow-sm border border-[var(--color-border)] group"
          >
            <X size={20} className="text-[var(--color-text-muted)] group-hover:text-[var(--color-text-main)]"/>
          </button>
        </div>

        {/* 2. BODY CONTENT */}
        <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar">

          {/* HOSPITAL INFO */}
          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[var(--color-primary)] flex items-center justify-center flex-shrink-0 border border-orange-100">
               <MapPin size={22} />
            </div>
            <div>
               <h3 className="font-bold text-[var(--color-text-main)] text-lg leading-tight">
                 {hospital.username || "Hospital Name"}
               </h3>
               <p className="text-[var(--color-text-muted)] text-sm mt-1">
                 {hospital.address || "Address not available"}
               </p>
               <p className="text-[var(--color-text-muted)] text-sm flex items-center gap-1 mt-1 font-medium">
                 <Phone size={12}/> {hospital.contactNumber || "N/A"}
               </p>
            </div>
          </div>

          <hr className="border-dashed border-[var(--color-border)]" />

          {/* PET INFO */}
          <div className="flex justify-between items-center bg-[var(--color-bg-body)] border border-[var(--color-border)] p-4 rounded-2xl">
             <div className="flex items-center gap-3">
                <div className="bg-white p-2.5 rounded-xl shadow-sm border border-gray-100">
                   <PawPrint size={20} className="text-[var(--color-primary)]" />
                </div>
                <div>
                   <p className="text-[10px] text-[var(--color-text-muted)] font-bold uppercase tracking-wider">Patient</p>
                   <p className="font-bold text-[var(--color-text-main)] capitalize text-base">
                     {pet.name || appointment.patientName || "Unknown Pet"}
                   </p>
                </div>
             </div>
             <div className="text-right pl-4 border-l border-gray-200">
                <p className="text-[10px] text-[var(--color-text-muted)] font-bold uppercase tracking-wider">Reason</p>
                <p className="font-bold text-[var(--color-primary)] capitalize text-base">{appointment.reason}</p>
             </div>
          </div>

          {/* 3. CONDITIONAL MEDICAL REPORT (If Completed) */}
          {isCompleted ? (
            <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
              
              {/* Diagnosis */}
              <div className="bg-green-50 p-5 rounded-2xl border border-green-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-green-100 rounded-bl-full -mr-8 -mt-8 opacity-50"></div>
                <div className="flex items-center gap-2 text-green-800 font-bold mb-2 text-xs uppercase tracking-widest">
                  <Stethoscope size={14}/> Diagnosis
                </div>
                <p className="text-green-900 font-medium ml-1 text-sm leading-relaxed">
                  {appointment.diagnosis || "No diagnosis recorded."}
                </p>
              </div>

              {/* Medicines */}
              <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100 rounded-bl-full -mr-8 -mt-8 opacity-50"></div>
                <div className="flex items-center gap-2 text-blue-800 font-bold mb-2 text-xs uppercase tracking-widest">
                  <Pill size={14}/> Prescriptions
                </div>
                <p className="text-blue-900 font-medium ml-1 text-sm whitespace-pre-line leading-relaxed">
                  {appointment.medicines || "No medicines prescribed."}
                </p>
              </div>

              {/* Notes */}
              {appointment.notes && (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-2 text-gray-500 font-bold mb-1 text-[10px] uppercase tracking-wider">
                    <Clipboard size={14}/> Vet Notes
                  </div>
                  <p className="text-gray-600 italic ml-1 text-sm">
                    "{appointment.notes}"
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-[var(--color-border)]">
              <p className="text-[var(--color-text-muted)] text-sm">
                Medical report will be available here <br/> after the visit is completed.
              </p>
            </div>
          )}

        </div>

        {/* FOOTER */}
        <div className="p-5 border-t border-[var(--color-border)] bg-[var(--color-bg-body)]">
          <button 
            onClick={onClose} 
            className="w-full py-3.5 bg-[var(--color-primary)] text-white font-bold rounded-xl hover:bg-[var(--color-primary-hover)] transition-all shadow-lg shadow-orange-200 active:scale-[0.98]"
          >
            Close Details
          </button>
        </div>

      </div>
    </div>
  );
};

export default AppointDetailsModal;