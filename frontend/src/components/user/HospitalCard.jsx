import { Star, MapPin, Phone, ArrowRight } from "lucide-react";
import haversineDistance from "../../utils/haversine.js"

const HospitalCard = ({ hospital, onBook,userLocation }) => {
  const rating = hospital.consultationFee
    ? (4 + Math.random() * 1).toFixed(1) //fake rating
    : "4.2";

  const specialties = Array.isArray(hospital.services)
    ? hospital.services
    : [];

  const [hospitalLng, hospitalLat] = hospital.location.coordinates;
  const distanceKm = haversineDistance(userLocation.lat,userLocation.lng,hospitalLat,hospitalLng)

  return (
    <div className="bg-white border border-[var(--color-border)] rounded-3xl shadow-md p-6 hover:border-[var(--color-primary)] hover:shadow-xl transition cursor-pointer">

      {/* NAME + RATING */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-2xl font-bold text-[var(--color-text-main)]">
          {hospital.username}
        </h3>

        <span className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold shadow flex items-center gap-1">
          <Star size={14} fill="currentColor" />
          {rating}
        </span>
      </div>

      {/* ADDRESS + DISTANCE (FAKE NOW) */}
      <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-2">
        <MapPin size={16} className="text-[var(--color-primary)]" />
        {hospital.address}
        <span className="mx-1">•</span>
        {distanceKm.toFixed(1)} km
      </div>

      {/* SPECIALTIES */}
      <div className="flex flex-wrap gap-2 mt-3 mb-4">
        {specialties.length > 0 ? (
          specialties.map((spec, idx) => (
            <span
              key={idx}
              className="px-3 py-1 text-xs font-bold rounded-lg bg-gray-100 border border-gray-200 uppercase text-gray-600"
            >
              {spec}
            </span>
          ))
        ) : (
          <span className="text-xs text-gray-400">No specialties listed</span>
        )}
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">

        {/* CALL BUTTON */}
        <a
          href={`tel:${hospital.contactNumber}`}
          className="flex items-center gap-2 text-[var(--color-text-muted)] font-semibold hover:text-[var(--color-primary)] transition"
        >
          <Phone size={18} /> Call Now
        </a>

        {/* BOOK BUTTON */}
        <button
          onClick={onBook}
          className="px-7 py-2.5 bg-[var(--color-primary)] text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-[var(--color-primary-hover)] shadow"
        >
          Book Visit <ArrowRight size={18} />
        </button>
      </div>

    </div>
  );
};

export default HospitalCard;
