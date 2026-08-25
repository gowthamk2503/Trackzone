import React, { useState, useEffect } from 'react';
import { Building2, MapPin, Users } from 'lucide-react';
import { GeofenceMap } from '../../components/attendance/GeofenceMap';
import { geofenceService } from '../../services/api';
import { Badge } from '../../components/common/Badge';

export const OfficeLocationsPage = () => {
  const [offices, setOffices] = useState([]);
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffices = async () => {
      try {
        const res = await geofenceService.list();
        if (res.data.success) {
          const list = res.data.offices || [];
          setOffices(list);
          if (list.length > 0) setSelectedOffice(list[0]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchOffices();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 border border-gray-200/80 dark:border-gray-800/80">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-indigo-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Multi-Office Geofence Infrastructure
          </span>
        </div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mt-1">
          Authorized Office Facilities & Geofences
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          View official facility boundaries, perimeter radiuses, and physical coordinates
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Office Cards List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {offices.map((office) => {
            const isSelected = selectedOffice?._id === office._id;
            return (
              <button
                key={office._id}
                onClick={() => setSelectedOffice(office)}
                className={`w-full text-left p-5 rounded-3xl border transition-all ${
                  isSelected
                    ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500 shadow-lg shadow-indigo-500/10 scale-[1.01]'
                    : 'glass-card border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
                    {office.code}
                  </span>
                  <Badge variant={office.isActive ? 'success' : 'neutral'} dot>
                    {office.isActive ? 'Active Zone' : 'Inactive'}
                  </Badge>
                </div>

                <h3 className="text-base font-bold text-gray-900 dark:text-white mt-2">
                  {office.officeName}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-indigo-500" />
                  <span>{office.address}, {office.city}, {office.country}</span>
                </p>

                <div className="mt-4 pt-3 border-t border-gray-200/60 dark:border-gray-700/60 flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-gray-600 dark:text-gray-300">
                    Perimeter: <strong className="text-indigo-600 dark:text-indigo-400">{office.radius}m</strong>
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Users className="w-3 h-3 text-gray-400" />
                    {office.staffCount || 0} assigned staff
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Selected Office Map & Detailed GPS Coordinates (7 cols) */}
        <div className="lg:col-span-7">
          {selectedOffice && (
            <div className="glass-card rounded-3xl p-6 border border-gray-200/80 dark:border-gray-800/80 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {selectedOffice.officeName}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Coordinates: {selectedOffice.latitude.toFixed(4)}° N, {selectedOffice.longitude.toFixed(4)}° E
                  </p>
                </div>

                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  {selectedOffice.radius}m Boundary Circle
                </span>
              </div>

              {/* Map Preview */}
              <GeofenceMap
                office={selectedOffice}
                userCoords={{ latitude: selectedOffice.latitude, longitude: selectedOffice.longitude }}
                distanceMeters={0}
                isInside={true}
                className="h-80"
              />

              <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/60">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                    Timezone & Region
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {selectedOffice.timezone || 'Asia/Kolkata'}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/60">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                    WiFi BSSID Filter (Optional)
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white truncate block">
                    {selectedOffice.wifiSSID || 'TrackZone_Secure_Mesh'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
