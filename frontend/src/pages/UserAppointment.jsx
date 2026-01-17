import React, { useState, useEffect } from "react";
import api from "../services/api";

import AppointmentTabs from "../components/user/AppointmentTabs";
import AppointmentCard from "../components/user/AppointmentCard";
import HospitalCard from "../components/user/HospitalCard";
import MapSection from "../components/user/MapSection";
import BookingModal from "../components/user/BookingModal";

import { Search, Hospital } from "lucide-react";
import AppointDetailsModal from "../components/user/AppointDetailsModal";

const UserAppointments = () => {
  const [activeTab, setActiveTab] = useState("appointments");
  const [filterStatus, setFilterStatus] = useState("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState(null);

  const [openModal, setOpenModal] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [activeHospitalId, setActiveHospitalId] = useState(null);

  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);

  const [hospitals, setHospitals] = useState([]);
  const [loadingHosp, setLoadingHosp] = useState(true);

  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const filteredAppointments = appointments.filter((a) => {
    if (filterStatus === "upcoming") {
      return a.status === "Scheduled";
    }
    return a.status !== "Scheduled";
  });

  useEffect(() => {
    const fetchNearbyHosp = async () => {
      try {
        setLoadingHosp(true);
        const res = await api.post("/users/nearby");
        setHospitals(res.data.hospitals);
        console.log(res);
      } catch (err) {
        console.error("Error fetching nearbyy hosps", err);
      } finally {
        setLoadingHosp(false);
      }
    };

    if (activeTab === "booking") {
      fetchNearbyHosp();
    }
  }, [activeTab]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get("/users/appointments");
        setAppointments(res.data.appointments);
      } catch (err) {
        console.error("Error fetching appointments:", err);
      } finally {
        setLoadingAppointments(false);
      }
    };

    fetchAppointments();
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
           setUserLocation({
            lat: 19.0760,
            lng: 72.8777,
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }
  }, []);

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-extrabold font-nunito text-[var(--color-text-main)]">
              My Schedule
            </h1>
            <p className="text-[var(--color-text-muted)] text-lg mt-1">
              Manage your upcoming and past visits with ease
            </p>
          </div>

          {/* TAB SWITCH BUTTONS */}
          <div className="flex bg-white border border-[var(--color-border)] rounded-2xl shadow-md p-1 mt-6 md:mt-0 backdrop-blur-sm">
            <button
              onClick={() => setActiveTab("appointments")}
              className={`px-7 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all duration-200 ${
                activeTab === "appointments"
                  ? "bg-[var(--color-primary)] text-white shadow-lg scale-[1.02]"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]"
              }`}
            >
              My Appointments
            </button>

            <button
              onClick={() => setActiveTab("booking")}
              className={`px-7 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all duration-200 ${
                activeTab === "booking"
                  ? "bg-[var(--color-primary)] text-white shadow-lg scale-[1.02]"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]"
              }`}
            >
              <Hospital size={18} /> Find Hospital
            </button>
          </div>
        </div>

        {/* ===================== APPOINTMENTS TAB ===================== */}
        {activeTab === "appointments" && (
          <>
            <AppointmentTabs
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
            />

            <div className="mt-8">
              {filteredAppointments.length > 0 &&
                filteredAppointments.map((app) => (
                  <AppointmentCard
                    key={app._id}
                    appointment={app}
                    onView={(appt) => {
                      setSelectedAppointment(appt);
                      setViewDetailsOpen(true);
                    }}
                  />
                ))}
            </div>
          </>
        )}

        {/* ===================== FIND HOSPITAL TAB ===================== */}
        {activeTab === "booking" && (
          <div className="mt-8">
            {/* SEARCH BAR */}
            <div className="relative mb-10 max-w-3xl mx-auto lg:mx-0">
              <Search
                size={22}
                className="absolute left-5 top-3 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search hospitals, locations or specialties..."
                className="w-full bg-white border-2 border-[var(--color-border)] rounded-2xl px-14 py-4 text-[var(--color-text-main)] focus:border-[var(--color-primary)] outline-none shadow-lg hover:shadow-xl transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* MAIN CONTENT GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
              
              {/* LEFT: STICKY MAP */}
              <div className="sticky top-30">
                <MapSection 
                  hospitals={hospitals}
                  userLocation={userLocation}
                  onHospitalSelect = {(hospitalId) => {
                    setActiveHospitalId(hospitalId)
                    const el = document.getElementById(`hospital-${hospitalId}`)
                    el?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }}
                />
              </div>

              {/* RIGHT: SCROLLABLE HOSPITAL LIST */}
              <div className="flex flex-col gap-6">
                {hospitals.map((h) => (
                  <div
                    key={h._id}
                    id={`hospital-${h._id}`}
                    className={`transition-all ${activeHospitalId === h._id? "ring-2 ring-orange-500 bg-blue-50 rounded-3xl": ""}`}
                  >
                    <HospitalCard
                      hospital={h}
                      userLocation={userLocation}
                      onBook={() => {
                        setSelectedHospital(h);
                        setOpenModal(true);
                      }}
                    />
                  </div>  
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {openModal && (
        <BookingModal
          hospital={selectedHospital}
          onClose={() => setOpenModal(false)}
        />
      )}

      {viewDetailsOpen && selectedAppointment && (
        <AppointDetailsModal
          appointment={selectedAppointment}
          onClose={() => setViewDetailsOpen(false)}
        />
      )}
    </>
  );
};

export default UserAppointments;