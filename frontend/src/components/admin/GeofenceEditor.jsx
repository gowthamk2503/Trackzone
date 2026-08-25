import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { GeofenceMap } from '../attendance/GeofenceMap';
import { geofenceService } from '../../services/api';
import { Sliders } from 'lucide-react';

export const GeofenceEditor = ({
  isOpen,
  onClose,
  officeToEdit,
  onSaved,
}) => {
  const [formData, setFormData] = useState({
    officeName: '',
    code: '',
    address: '',
    city: 'Coimbatore',
    country: 'India',
    latitude: 10.826844,
    longitude: 77.058983,
    radius: 150,
    timezone: 'Asia/Kolkata',
    wifiSSID: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (officeToEdit) {
      setFormData({
        officeName: officeToEdit.officeName,
        code: officeToEdit.code,
        address: officeToEdit.address,
        city: officeToEdit.city,
        country: officeToEdit.country,
        latitude: officeToEdit.latitude,
        longitude: officeToEdit.longitude,
        radius: officeToEdit.radius,
        timezone: officeToEdit.timezone,
        wifiSSID: officeToEdit.wifiSSID || '',
      });
    } else {
      setFormData({
        officeName: '',
        code: '',
        address: '',
        city: 'Coimbatore',
        country: 'India',
        latitude: 10.826844,
        longitude: 77.058983,
        radius: 150,
        timezone: 'Asia/Kolkata',
        wifiSSID: '',
      });
    }
    setErrorMsg('');
  }, [officeToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (officeToEdit) {
        await geofenceService.update(officeToEdit._id, formData);
      } else {
        await geofenceService.create(formData);
      }
      onSaved();
      onClose();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to save geofence settings');
    } finally {
      setLoading(false);
    }
  };

  const previewOffice = {
    _id: officeToEdit?._id || 'preview',
    ...formData,
    isActive: true,
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={officeToEdit ? 'Modify Office Geofence' : 'Register New Geofenced Zone'}
      subtitle="Configure physical GPS boundary, perimeter radius, and location metadata"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 font-medium">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
              Office Facility Name
            </label>
            <input
              type="text"
              required
              placeholder="E.g. TrackZone Tech Hub Bangalore"
              value={formData.officeName}
              onChange={(e) => setFormData({ ...formData, officeName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
              Office Identifier Code
            </label>
            <input
              type="text"
              required
              placeholder="BLR-HQ"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
              Street Address
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
              City
            </label>
            <input
              type="text"
              required
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
              Country
            </label>
            <input
              type="text"
              required
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
              Latitude GPS Coordinate
            </label>
            <input
              type="number"
              step="0.0001"
              required
              value={formData.latitude}
              onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
              Longitude GPS Coordinate
            </label>
            <input
              type="number"
              step="0.0001"
              required
              value={formData.longitude}
              onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="sm:col-span-2">
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-indigo-500" />
                Geofence Radius Perimeter: <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{formData.radius} meters</span>
              </label>
            </div>
            <input
              type="range"
              min="20"
              max="1000"
              step="10"
              value={formData.radius}
              onChange={(e) => setFormData({ ...formData, radius: parseInt(e.target.value, 10) || 150 })}
              className="w-full accent-indigo-600"
            />
          </div>
        </div>

        {/* Live Boundary Preview Map */}
        <div className="mt-4">
          <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
            Live Geofence Boundary Map Preview
          </label>
          <GeofenceMap
            office={previewOffice}
            userCoords={{ latitude: formData.latitude, longitude: formData.longitude }}
            distanceMeters={0}
            isInside={true}
            className="h-48"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={loading}>
            {officeToEdit ? 'Update Geofence' : 'Create Geofenced Office'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
