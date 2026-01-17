import React, { useCallback, useEffect, useState } from 'react';
import UpcomingList from '../../components/hospital/UpcomingList';
import ManageSlots from '../../components/hospital/ManageSlots';
import AppointmentModal from '../../components/hospital/AppointmentModal';
import { toast } from "react-hot-toast";
import api from "../../services/api";

const HospitalAppointments = () => {

  const [activeTab, setActiveTab] = useState('upcoming'); 
  const [selectedAppointment, setSelectedAppointment] = useState(null); 
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false); 
  const [creationMode, setCreationMode] = useState('single'); 
  const [isLoading, setIsLoading] = useState(false);
  const [slots, setSlots] = useState([]);
  const [upcomingList , setUpcomingList] = useState([])

  const fetchSlots = useCallback(async () => {
    try {
      const { data } = await api.get('/hospital/slots');
      setSlots(data.slots || data);
    } catch (error) {
      console.error("Failed to fetch slots", error);
      toast.error("Could not load slots");
    }
  }, []);


  const fetchUpcomingList = useCallback(async () => {
    try {
      
      const { data } = await api.get('/hospital/appointments/upcoming'); 

      const formattedAppointments = data.map(appt => {
        const pet = appt.pet_id || {}; 
        const slot = appt.slot_id || {};

        return {
          _id: appt._id,            
          slotDateTime: slot.startTime, 
          isBooked: true,          

          patientName: pet.name || 'Unknown',
          patientBreed: pet.breed || 'Unknown',
          ownerName: pet.owner_name || 'Unknown',
          ownerPhone: pet.contactNumber || 'N/A',
          image: pet.file_url || 'https://via.placeholder.com/150',
          reason: appt.reason || 'Checkup', 
          status: appt.status,
        };
      });

      setUpcomingList(formattedAppointments);
    }
    catch(error)
    {
      console.error("Failed to fetch appointments", error);
      toast.error("Could not load appointments");
    }
  }, []);

  const handleCreate = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsLoading(true);

    const form = new FormData(e.target);
    const dataToSubmit = Object.fromEntries(form.entries());

    try {
      if (creationMode === 'single') {
        const dateTimeString = `${dataToSubmit.date}T${dataToSubmit.singleTime}`;
        const startTime = new Date(dateTimeString);

        await api.post('/hospital/slots', {
          startTime: startTime,
          duration: parseInt(dataToSubmit.duration)
        });

        toast.success("Single slot created successfully!");
      } else {
        await api.post('/hospital/slots/bulk', {
          date: dataToSubmit.date,
          startTime: dataToSubmit.startTime,
          endTime: dataToSubmit.endTime,
          interval: parseInt(dataToSubmit.duration)
        });
        toast.success("Bulk slots generated successfully!");
      }
      fetchSlots();
    } catch (error) {
      const msg = error.response?.data?.message || "Error creating slots";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
      fetchUpcomingList();
      fetchSlots();
  
  }, [fetchUpcomingList, fetchSlots]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this slot?")) return;

    try {
      await api.delete(`/hospital/slots/${id}`);
      toast.success("Slot deleted");
      fetchSlots();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete slot");
    }
  };

  const handleComplete = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const diagnosis = formData.get('diagnosis');
    const medicines = formData.get('medicines');
    const notes = formData.get('notes');
    try {
      await api.post(`/hospital/appointments/${selectedAppointment._id}/complete`, {
        diagnosis,
        medicines,
        notes,
        status: 'completed'
      });
      toast.success("Visit completed!");
      setSelectedAppointment(null);
      fetchUpcomingList()
    } catch (error) {
      console.error(error);
      toast.error("Error completing visit");
    }
  };

  const handleOpenModal = (slot) => {
    setSelectedAppointment(slot);
    setShowPrescriptionForm(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 relative">

      {/* 1. HEADER & STATS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-main)]">Appointments</h1>
          <p className="text-[var(--color-text-muted)]">Manage schedule & patient records.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white px-5 py-2 rounded-xl border border-[var(--color-border)] shadow-sm text-center">
            <span className="block text-2xl font-bold text-[var(--color-primary)]">{upcomingList.length}</span>
            <span className="text-xs text-[var(--color-text-muted)] uppercase font-bold">Upcoming</span>
          </div>
          <div className="bg-white px-5 py-2 rounded-xl border border-[var(--color-border)] shadow-sm text-center">
            <span className="block text-2xl font-bold text-green-600">{slots.length}</span>
            <span className="text-xs text-[var(--color-text-muted)] uppercase font-bold">Open Slots</span>
          </div>
        </div>
      </div>

      {/* 2. TABS NAVIGATION */}
      <div className="flex gap-6 border-b border-[var(--color-border)] mb-8">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`pb-3 text-sm font-bold transition relative ${activeTab === 'upcoming' ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'}`}
        >
          Upcoming Bookings
          {activeTab === 'upcoming' && <span className="absolute bottom-0 left-0 w-full h-1 bg-[var(--color-primary)] rounded-t-full"></span>}
        </button>
        <button
          onClick={() => setActiveTab('manage')}
          className={`pb-3 text-sm font-bold transition relative ${activeTab === 'manage' ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'}`}
        >
          Manage Slots
          {activeTab === 'manage' && <span className="absolute bottom-0 left-0 w-full h-1 bg-[var(--color-primary)] rounded-t-full"></span>}
        </button>
      </div>

      {/* 3. TAB CONTENT */}
      {activeTab === 'upcoming' ? (
        <UpcomingList
          slots={upcomingList}
          onViewDetails={handleOpenModal}
        />
      ) : (
        <ManageSlots
          slots={slots}
          creationMode={creationMode}
          setCreationMode={setCreationMode}
          onCreate={handleCreate}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      )}

      {/* 4. MODAL */}
      {selectedAppointment && (
        <AppointmentModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          showPrescriptionForm={showPrescriptionForm}
          setShowPrescriptionForm={setShowPrescriptionForm}
          onComplete={handleComplete}
        />
      )}
    </div>
  );
};

export default HospitalAppointments;