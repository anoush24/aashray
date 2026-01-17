import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;


const userIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});


const hospitalIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Component to auto-center map when markers change
const RecenterMap = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 13);
    }
  }, [center, map]);
  return null;
};

const MapSection = ({ hospitals, userLocation, onHospitalSelect }) => {
  const defaultCenter = [19.0760, 72.8777];
  const center = userLocation ? [userLocation.lat, userLocation.lng] : defaultCenter;

  return (
    <div className="w-full h-[500px] rounded-3xl overflow-hidden border border-[var(--color-border)] shadow-lg relative z-0">
      <MapContainer 
        center={center} 
        zoom={13} 
        scrollWheelZoom={true} 
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User Location Marker */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup>
              <div className="font-bold text-center">You are here</div>
            </Popup>
          </Marker>
        )}


        {hospitals.map((hospital) => {
          const lat = hospital.lat || hospital.location?.coordinates[1] || hospital.latitude;
          const lng = hospital.lng || hospital.location?.coordinates[0] || hospital.longitude;

          if (lat && lng) {
            return (
              <Marker key={hospital.id || hospital._id} position={[lat, lng]} icon={hospitalIcon} eventHandlers={{
                click: () => {
                  onHospitalSelect?.(hospital._id)
                }
              }}>
                <Popup>
                  <div className="text-sm font-semibold">{hospital.username}</div>
                  <div className="text-xs text-gray-500">{hospital.address}</div>
                </Popup>
              </Marker>
            );
          }
          return null;
        })}

        <RecenterMap center={center} />
      </MapContainer>
      
      {/* Legend / Overlay */}
      <div className="absolute top-4 left-14 z-[400] bg-white px-4 py-2 rounded-xl shadow-md text-sm font-semibold text-[var(--color-text-main)] border border-gray-100">
        Results near you
      </div>
    </div>
  );
};

export default MapSection;