import React from 'react';
import { X, FileText, User, Stethoscope, CheckCircle } from 'lucide-react';

const AppointmentModal = ({ appointment, onClose, showPrescriptionForm, setShowPrescriptionForm, onComplete }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white rounded-3xl w-full max-w-2xl relative z-10 shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden flex flex-col max-h-[90vh]">
          
          {/* Modal Header */}
          <div className="bg-[var(--color-primary-light)] p-6 flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold text-[var(--color-text-main)]">
                {showPrescriptionForm ? 'Complete Visit' : 'Appointment Details'}
              </h3>
              <p className="text-[var(--color-primary)] font-bold text-sm">
                {new Date(appointment.slotDateTime).toLocaleString()}
              </p>
            </div>
            <button onClick={onClose} className="p-2 bg-white/50 rounded-full hover:bg-white transition"><X size={20}/></button>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto">
            {!showPrescriptionForm ? (
              /* VIEW A: Patient Info */
              <div className="space-y-6">
                <div className="flex gap-4">
                  <img src={appointment.image} className="w-24 h-24 rounded-2xl object-cover shadow-sm" alt="pet"/>
                  <div className="flex-1 space-y-2">
                      <h4 className="text-xl font-bold text-[var(--color-text-main)]">{appointment.patientName}</h4>
                      <div className="flex items-center gap-2 text-gray-600"><FileText size={16}/> <strong>Reason:</strong> {appointment.reason}</div>
                      <div className="flex items-center gap-2 text-gray-600"><User size={16}/> <strong>Owner:</strong> {appointment.ownerName} ({appointment.ownerPhone})</div>
                  </div>
                </div>
                
                <div className="flex gap-4 mt-8">
                  <button 
                    onClick={() => setShowPrescriptionForm(true)} 
                    className="flex-1 bg-[var(--color-primary)] text-white py-4 rounded-xl font-bold hover:bg-[var(--color-primary-hover)] transition flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Stethoscope size={20} /> Start Consultation
                  </button>
                </div>
              </div>
            ) : (
              /* VIEW B: Prescription Form */
              <form onSubmit={onComplete} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Diagnosis</label>
                  <input required type="text" name="diagnosis" className="w-full p-3 border border-gray-200 rounded-xl focus:border-[var(--color-primary)] outline-none" placeholder="e.g. Fever"/>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Medicines</label>
                  <textarea required rows="3" name="medicines" className="w-full p-3 border border-gray-200 rounded-xl focus:border-[var(--color-primary)] outline-none" placeholder="Rx..."></textarea>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Additional Notes (Optional)</label>
                  <textarea 
                    rows="2" 
                    name="notes" 
                    className="w-full p-3 border border-gray-200 rounded-xl focus:border-[var(--color-primary)] outline-none" 
                    placeholder="Dietary advice, next follow-up, etc..."
                  ></textarea>
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setShowPrescriptionForm(false)} className="px-6 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl">Back</button>
                  <button type="submit" className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition flex items-center justify-center gap-2 shadow-md">
                    <CheckCircle size={20} /> Complete Visit
                  </button>
                </div>
              </form>
            )}
          </div>
      </div>
    </div>
  );
};

export default AppointmentModal;