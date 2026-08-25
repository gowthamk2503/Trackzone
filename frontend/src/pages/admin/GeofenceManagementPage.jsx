import React, { useState, useEffect } from 'react';
import { Building2, Plus, Edit, Trash2, Sliders, Users } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { GeofenceEditor } from '../../components/admin/GeofenceEditor';
import { GeofenceMap } from '../../components/attendance/GeofenceMap';
import { geofenceService } from '../../services/api';

export const GeofenceManagementPage = () => {
  const [offices, setOffices] = useState([]);
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [officeToEdit, setOfficeToEdit] = useState(null);

  const loadOffices = async () => {
    setLoading(true);
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

  useEffect(() => {
    loadOffices();
  }, []);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove/deactivate ${name}?`)) {
      try {
        await geofenceService.delete(id);
        loadOffices();
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 border border-gray-200/80 dark:border-gray-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Spatial Perimeter Engine
            </span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white mt-1">
            Geofence & Office Facilities Manager
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Define corporate premises, pin GPS coordinates, and adjust Haversine boundary radius
          </p>
        </div>

        <Button
          size="md"
          variant="primary"
          onClick={() => {
            setOfficeToEdit(null);
            setShowEditor(true);
          }}
          leftIcon={<Plus className="w-4 h-4" />}
          className="font-bold shadow-lg shadow-indigo-500/20"
        >
          Add Geofenced Facility
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Office Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {offices.map((office) => {
            const isSelected = selectedOffice?._id === office._id;
            return (
              <div
                key={office._id}
                onClick={() => setSelectedOffice(office)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500 shadow-lg shadow-indigo-500/10'
                    : 'glass-card border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
                      {office.code}
                    </span>
                    <Badge variant={office.isActive ? 'success' : 'neutral'} dot>
                      {office.isActive ? 'Active' : 'Disabled'}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => {
                        setOfficeToEdit(office);
                        setShowEditor(true);
                      }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      title="Edit Geofence"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(office._id, office.officeName)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      title="Delete Facility"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-gray-900 dark:text-white mt-2">
                  {office.officeName}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {office.address}, {office.city}
                </p>

                <div className="mt-4 pt-3 border-t border-gray-200/60 dark:border-gray-700/60 flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-600 dark:text-gray-300">
                    Radius: <strong className="text-indigo-600 dark:text-indigo-400">{office.radius} meters</strong>
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-gray-400" />
                    {office.staffCount || 0} Staff
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Live Map Inspection (7 cols) */}
        <div className="lg:col-span-7">
          {selectedOffice && (
            <div className="glass-card rounded-3xl p-6 border border-gray-200/80 dark:border-gray-800/80 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {selectedOffice.officeName}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    GPS Coordinates: {selectedOffice.latitude}° N, {selectedOffice.longitude}° E
                  </p>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setOfficeToEdit(selectedOffice);
                    setShowEditor(true);
                  }}
                  leftIcon={<Sliders className="w-3.5 h-3.5" />}
                >
                  Adjust Perimeter
                </Button>
              </div>

              <GeofenceMap
                office={selectedOffice}
                userCoords={{ latitude: selectedOffice.latitude, longitude: selectedOffice.longitude }}
                distanceMeters={0}
                isInside={true}
                className="h-80"
              />

              <div className="grid grid-cols-3 gap-3 text-xs pt-2 text-center">
                <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                    Boundary Perimeter
                  </span>
                  <span className="font-black text-indigo-600 dark:text-indigo-400 text-sm">
                    {selectedOffice.radius} meters
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                    Timezone
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white text-sm truncate block">
                    {selectedOffice.timezone}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                    Active Staff
                  </span>
                  <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                    {selectedOffice.staffCount || 0} users
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Geofence Editor Modal */}
      <GeofenceEditor
        isOpen={showEditor}
        onClose={() => setShowEditor(false)}
        officeToEdit={officeToEdit}
        onSaved={loadOffices}
      />
    </div>
  );
};
