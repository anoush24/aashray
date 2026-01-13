import React from 'react';
import { Plus, Layers, Zap, Trash2, Clock } from 'lucide-react';

const ManageSlots = ({ slots, creationMode, setCreationMode, onCreate, onDelete, isLoading }) => {
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
       
       {/* Left: The Form Panel */}
       <div className="bg-white p-6 rounded-2xl border border-[var(--color-border)] h-fit shadow-sm sticky top-24">
         
         {/* Toggle Switch */}
         <div className="flex bg-[var(--color-bg-body)] p-1 rounded-xl mb-6 border border-[var(--color-border)]">
             <button onClick={() => setCreationMode('single')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition flex items-center justify-center gap-2 ${creationMode === 'single' ? 'bg-white text-[var(--color-primary)] shadow-sm' : 'text-[var(--color-text-muted)]'}`}><Plus size={16} /> Single</button>
             <button onClick={() => setCreationMode('bulk')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition flex items-center justify-center gap-2 ${creationMode === 'bulk' ? 'bg-white text-[var(--color-primary)] shadow-sm' : 'text-[var(--color-text-muted)]'}`}><Layers size={16} /> Bulk</button>
         </div>

         <form onSubmit={onCreate} className="flex flex-col gap-4 animate-in fade-in">
             
             {/* Common: Date Field */}
             <div>
                 <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase mb-2 block">Date</label>
                 <input 
                    type="date" 
                    name="date" 
                    required
                    className="w-full p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-body)] outline-none focus:border-[var(--color-primary)]"
                 />
             </div>
             
             {creationMode === 'single' ? (
               /* --- FIXED SECTION: ALIGNMENT CORRECTION --- */
               <div className="flex gap-3">
                   {/* Time Input */}
                   <div className="flex-1">
                       {/* Added 'flex items-center h-5' to match the neighbor label height */}
                       <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase mb-2 flex items-center h-5">
                         Time
                       </label>
                       <input 
                          type="time" 
                          name="singleTime" 
                          required
                          className="w-full p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-body)] outline-none focus:border-[var(--color-primary)]"
                       />
                   </div>
                   
                   {/* Duration Input */}
                   <div className="flex-1">
                       <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase mb-2 flex items-center gap-2 h-5">
                           <Clock size={14} /> Duration
                       </label>
                       <select 
                           name="duration" 
                           defaultValue="30"
                           className="w-full p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-body)] outline-none focus:border-[var(--color-primary)] appearance-none"
                       >
                           <option value="15">15 Min</option>
                           <option value="30">30 Min</option>
                           <option value="45">45 Min</option>
                           <option value="60">60 Min</option>
                       </select>
                   </div>
               </div>
             ) : (
               /* --- BULK MODE --- */
               <>
                 <div className="flex gap-3">
                     <div className="flex-1">
                         <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase mb-2 block">Start</label>
                         <input 
                            type="time" 
                            name="startTime" 
                            defaultValue="09:00" 
                            required
                            className="w-full p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-body)] outline-none focus:border-[var(--color-primary)]"
                         />
                     </div>
                     <div className="flex-1">
                         <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase mb-2 block">End</label>
                         <input 
                            type="time" 
                            name="endTime" 
                            defaultValue="17:00" 
                            required
                            className="w-full p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-body)] outline-none focus:border-[var(--color-primary)]"
                         />
                     </div>
                 </div>

                 {/* Bulk Interval */}
                 <div>
                    <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase mb-2 flex items-center gap-2">
                        <Clock size={14} /> Interval (Min)
                    </label>
                    <select 
                        name="duration" 
                        defaultValue="30"
                        className="w-full p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-body)] outline-none focus:border-[var(--color-primary)] appearance-none"
                    >
                        <option value="15">15 Minutes</option>
                        <option value="30">30 Minutes</option>
                        <option value="45">45 Minutes</option>
                        <option value="60">60 Minutes</option>
                    </select>
                 </div>
               </>
             )}

             <button 
                type="submit" 
                disabled={isLoading}
                className="bg-[var(--color-primary)] text-white font-bold py-3 rounded-xl hover:bg-[var(--color-primary-hover)] transition mt-2 shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
             >
               {isLoading ? (
                 <span>Processing...</span>
               ) : (
                 <>
                    {creationMode === 'single' ? <Plus size={18} /> : <Zap size={18} />} 
                    {creationMode === 'single' ? 'Create Slot' : 'Generate Slots'}
                 </>
               )}
             </button>
         </form>
       </div>

       {/* Right: Available Slots Grid  */}
       <div className="lg:col-span-2">
         <h2 className="text-lg font-bold mb-4 text-[var(--color-text-main)]">Open Slots ({slots.length})</h2>
         <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
             {slots.map(slot => (
               <div key={slot._id} className="p-4 rounded-xl border border-[var(--color-border)] bg-white flex flex-col gap-3 group hover:border-[var(--color-primary)] transition hover:shadow-md relative overflow-hidden">
                   <div className="flex justify-between items-start">
                       <div>
                           <p className="font-bold text-[var(--color-text-main)]">
                           {new Date(slot.slotDateTime || slot.startTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                           </p>
                           <p className="text-sm font-semibold text-[var(--color-primary)] mt-1">
                           {new Date(slot.slotDateTime || slot.startTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                           </p>
                       </div>
                       <button onClick={() => onDelete(slot._id)} className="text-gray-300 hover:text-red-500 transition bg-gray-50 p-2 rounded-lg hover:bg-red-50"><Trash2 size={16} /></button>
                   </div>
                   <div className="w-full h-1 bg-[var(--color-primary)]/20 rounded-full mt-1"><div className="w-1/3 h-full bg-[var(--color-primary)] rounded-full"></div></div>
               </div>
             ))}
         </div>
       </div>
    </div>
  );
};

export default ManageSlots;