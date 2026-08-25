import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import { formatDistance } from '../../utils/haversine';

// Fix default Leaflet icon paths
const customOfficeIcon = L.divIcon({
  className: 'custom-office-icon',
  html: `<div style="background-color: #4f46e5; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(79, 70, 229, 0.4); border: 2px solid white;">
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>
  </div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

const customUserIcon = (isInside) =>
  L.divIcon({
    className: 'custom-user-icon',
    html: `<div style="background-color: ${isInside ? '#10b981' : '#ef4444'}; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 20px ${isInside ? 'rgba(16, 185, 129, 0.6)' : 'rgba(239, 68, 68, 0.6)'}; border: 2.5px solid white;">
    <div style="width: 10px; height: 10px; background-color: white; border-radius: 50%;"></div>
  </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 16);
  }, [center, map]);
  return null;
};

export const GeofenceMap = ({
  office,
  userCoords,
  distanceMeters,
  isInside,
  className = 'h-72',
}) => {
  if (!office) {
    return (
      <div className={`${className} rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm text-gray-400`}>
        No Office Geofence Selected
      </div>
    );
  }

  const officePos = [office.latitude, office.longitude];
  const userPos = userCoords
    ? [userCoords.latitude, userCoords.longitude]
    : officePos;

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 ${className}`}>
      {/* Top Status Overlay Badge */}
      <div className="absolute top-3 left-3 z-[400] bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md flex items-center gap-2">
        {isInside ? (
          <>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              Inside Geofence ({formatDistance(distanceMeters)})
            </span>
          </>
        ) : (
          <>
            <AlertCircle className="w-4 h-4 text-rose-500 animate-pulse" />
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
              Outside Geofence ({formatDistance(distanceMeters)} away)
            </span>
          </>
        )}
      </div>

      {/* Office Radius Indicator */}
      <div className="absolute bottom-3 right-3 z-[400] bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 text-[11px] text-gray-600 dark:text-gray-300 font-medium">
        Perimeter: <span className="font-bold text-indigo-500">{office.radius}m</span>
      </div>

      <MapContainer
        center={officePos}
        zoom={16}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <MapUpdater center={userCoords ? userPos : officePos} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Geofence Perimeter Boundary Circle */}
        <Circle
          center={officePos}
          radius={office.radius}
          pathOptions={{
            color: isInside ? '#10b981' : '#6366f1',
            fillColor: isInside ? '#10b981' : '#6366f1',
            fillOpacity: 0.15,
            weight: 2,
            dashArray: isInside ? undefined : '6, 6',
          }}
        />

        {/* Office Center Marker */}
        <Marker position={officePos} icon={customOfficeIcon}>
          <Popup>
            <div className="text-xs">
              <p className="font-bold text-gray-900">{office.officeName}</p>
              <p className="text-gray-500">{office.address}</p>
              <p className="text-indigo-600 font-semibold mt-1">Geofence: {office.radius} meters</p>
            </div>
          </Popup>
        </Marker>

        {/* User GPS Position Marker */}
        {userCoords && (
          <Marker position={userPos} icon={customUserIcon(isInside)}>
            <Popup>
              <div className="text-xs">
                <p className="font-bold text-gray-900">Your Current Position</p>
                <p className="text-gray-500">
                  Distance: {formatDistance(distanceMeters)} from {office.officeName}
                </p>
                <p className={`font-semibold mt-1 ${isInside ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {isInside ? '✓ Inside Authorized Perimeter' : '✗ Outside Office Boundary'}
                </p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};
