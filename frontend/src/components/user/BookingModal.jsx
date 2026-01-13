import React, { useState } from "react";
import { X } from "lucide-react";
import { useEffect } from "react";
import api from "../../services/api";
import toast from "react-hot-toast"

const BookingModal = ({ hospital, onClose }) => {
  const [weekSchedule,setWeekSchedule] = useState({})
  const [dates,setDates] = useState([])
  const [pets, setPets] = useState([]);
  const [loadingPets, setLoadingPets] = useState(true);
  const [selectedPet, setSelectedPet] = useState(null);
  const [reason, setReason] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoadingPets(true)
        const res = await api.get('/pets/my-pets')
        setPets(res.data.pets)

        if (res.data.pets && res.data.pets.length > 0) {
          setSelectedPet(res.data.pets[0]);
        }
      }
      catch(err) {
        console.error("Error fetching user pets",err)
      }
      finally {
        setLoadingPets(false)
      }
    }

    fetchPets();
  },[])


  useEffect(() => {
    const fetchWeekSlots = async () => {
      try {
        const res = await api.get(`/users/slots/week?hospitalId=${hospital._id}`)
        const schedule = res.data.schedule;
        setWeekSchedule(schedule)

        const dateKeys = Object.keys(schedule)
        setDates(dateKeys)

        if (dateKeys.length > 0) {
          setSelectedDate(dateKeys[0]);
        }
      }catch(err) {
        console.error("Error fetching weekly slots",err)
      }
    }
    fetchWeekSlots()
  },[hospital._id])

  const handlebooking = async () => {
    try {
      const res = await api.post('/users/book-slot', {
        slot_id: selectedSlot._id,
        pet_id: selectedPet._id,
        reason
      })
      toast.success("Appointment booked successfully!");
      onClose();
    }
    catch(err) {
      console.error("Booking error",err)
    }
  }


  const currentSlots = selectedDate && weekSchedule[selectedDate] ? weekSchedule[selectedDate].slots : []
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-xl overflow-hidden animate-fade-in">

        {/* Header */}
        <div className="p-5 flex justify-between items-center border-b border-gray-100">
          <h2 className="text-xl font-extrabold font-nunito">Book Appointment</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3">
          
          {/* LEFT - Inputs */}
          <div className="p-6 md:col-span-2 space-y-8">

            {/* Pet */}
            <div>
              <label className="font-bold text-gray-800 text-sm">Select Pet</label>
              <div className="flex gap-4 mt-3">
                {loadingPets ? (
                  <div className="text-gray-500 text-sm">Loading pets...</div>
                ) : pets.length === 0 ? (
                  <div className="p-4 bg-orange-50 text-orange-600 text-sm rounded-xl">
                    No pets found. Please add a pet in your profile.
                  </div>
                ) : (
                  <div className="flex gap-4 mt-3">
                    {pets.map((p) => (
                      <div
                        key={p._id}
                        onClick={() => setSelectedPet(p)}
                        className={`flex items-center gap-3 px-4 py-2 rounded-2xl border cursor-pointer transition ${
                          selectedPet?._id === p._id
                            ? "border-orange-500 bg-orange-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <img
                          src={p.file_url}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <span className="font-semibold capitalize">{p.name}</span>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </div>

            {/* Date */}
            <div>
              <label className="font-bold text-gray-800 text-sm">Select Date</label>
              <div className="flex gap-3 overflow-x-auto py-3">
                {dates.map((dateKey) => (
                  <div
                    key={dateKey}
                    onClick={() => {
                      setSelectedDate(dateKey)
                      setSelectedSlot(null);
                    }}
                    className={`min-w-[70px] rounded-xl p-3 cursor-pointer text-center border transition ${
                      selectedDate === dateKey
                        ? "bg-orange-500 text-white border-orange-500"
                        : "bg-gray-100 border-gray-200"
                    }`}
                  >
                    <span className="block text-xs opacity-80"> {weekSchedule[dateKey].day}</span>
                    <span className="block text-lg font-bold"> {new Date(dateKey).getDate()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Slots */}
            <div className="grid grid-cols-3 gap-3 mt-3">
              {currentSlots.length === 0 ? (
                <div className="col-span-3 text-gray-500 text-sm">No slots available</div>
              ) : (
                currentSlots.map((slot) => (
                  <button
                    key={slot._id}
                    onClick={() => setSelectedSlot(slot)}
                    className={`px-4 py-2 text-sm font-semibold rounded-xl border transition ${
                      setSelectedSlot?._id === slot._id
                        ? "bg-orange-500 text-white border-orange-500"
                        : "bg-white border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {new Date(slot.startTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </button>
                ))
              )}
            </div>


            {/* Reason */}
            <div>
              <label className="font-bold text-gray-800 text-sm">Reason for Visit</label>
              <textarea
                rows="3"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Describe the issue..."
                className="w-full mt-3 p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              ></textarea>
            </div>

          </div>

          {/* RIGHT - Summary */}
          <div className="bg-gray-50 p-6 border-l border-gray-200">
            <h3 className="font-bold text-lg mb-4">Summary</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span>Clinic</span><span>{hospital?.name}</span></div>
              <div className="flex justify-between"><span>Pet</span><span>{selectedPet?.name || "Select a pet"}</span></div>
              <div className="flex justify-between"><span>Date</span><span>Oct {selectedDate}</span></div>
              <div className="flex justify-between"><span>Time</span><span>{selectedSlot? new Date(selectedSlot.startTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}):"Select a time"}</span></div>
              <div className="flex justify-between"><span>Reason</span><span>{reason || "Not added"}</span></div>
            </div>

            <div className="pt-6 mt-4 border-t border-gray-300">
              <div className="flex justify-between text-base mb-3">
                <span className="font-semibold">Consultation Fee</span>
                <span className="text-orange-600 font-bold">$25.00</span>
              </div>
            </div>

            <button
              disabled={!reason || !selectedPet || !selectedSlot}
              onClick={handlebooking}
              className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold mt-4 disabled:opacity-50"
            >
              Confirm Appointment
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};

export default BookingModal;
