import React, { useState, useEffect } from 'react';
import {
  Clock,
  MapPin,
  Fingerprint,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Shield,
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge, getStatusBadge } from '../common/Badge';
import { BiometricModal } from './BiometricModal';
import { calculateDistanceMeters, formatDistance } from '../../utils/haversine';
import { attendanceService } from '../../services/api';

export const CheckInOutCard = ({
  office,
  allOffices,
  todayAttendance,
  onAttendanceUpdated,
  userCoords,
  setUserCoords,
  selectedOffice,
  setSelectedOffice,
  userName,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [gpsLoading, setGpsLoading] = useState(false);
  const [showBioModal, setShowBioModal] = useState(false);
  const [pendingAction, setPendingAction] = useState('checkIn');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Live Digital Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute distance from selected office
  const targetOffice = selectedOffice || office;
  const distance =
    userCoords && targetOffice
      ? calculateDistanceMeters(userCoords, {
          latitude: targetOffice.latitude,
          longitude: targetOffice.longitude,
        })
      : 0;

  const isWithinGeofence = targetOffice ? distance <= targetOffice.radius + 15 : false;

  const isCheckedIn = Boolean(todayAttendance?.checkIn?.time);
  const isCheckedOut = Boolean(todayAttendance?.checkOut?.time);

  // Acquire real GPS position
  const captureRealGPS = () => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser.');
      return;
    }

    setGpsLoading(true);
    setErrorMsg('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setGpsLoading(false);
      },
      (err) => {
        setErrorMsg('Unable to retrieve device GPS. You can simulate location below for testing.');
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Simulate location inside current selected office
  const simulateInsideOffice = () => {
    if (!targetOffice) return;
    setUserCoords({
      latitude: targetOffice.latitude + 0.0001, // ~10 meters away
      longitude: targetOffice.longitude + 0.0001,
    });
    setErrorMsg('');
  };

  // Simulate location outside office
  const simulateOutsideOffice = () => {
    if (!targetOffice) return;
    setUserCoords({
      latitude: targetOffice.latitude + 0.015, // ~1.8 km away
      longitude: targetOffice.longitude + 0.015,
    });
    setErrorMsg('');
  };

  const handleStartAction = (action) => {
    setErrorMsg('');
    setSuccessMsg('');

    if (!userCoords) {
      setErrorMsg('Please acquire or simulate GPS coordinates before marking attendance.');
      return;
    }

    if (action === 'checkIn' && !isWithinGeofence) {
      setErrorMsg(
        `Geofence Check Failed: You are ${formatDistance(distance)} from ${targetOffice?.officeName}. You must be within ${targetOffice?.radius}m.`
      );
      return;
    }

    setPendingAction(action);
    setShowBioModal(true);
  };

  const handleBiometricSuccess = async (authData) => {
    setSubmitting(true);
    setErrorMsg('');

    try {
      if (pendingAction === 'checkIn') {
        const payload = {
          latitude: userCoords?.latitude,
          longitude: userCoords?.longitude,
          officeId: targetOffice?._id,
          biometricVerified: true,
          authMethod: authData.method,
          overrideGeofence: isWithinGeofence,
          assertionResponse: authData.assertionResponse,
        };

        const res = await attendanceService.checkIn(payload);
        if (res.data.success) {
          setSuccessMsg(`✓ Successfully checked in! Status: ${res.data.attendance?.status}`);
          onAttendanceUpdated();
        }
      } else {
        const payload = {
          latitude: userCoords?.latitude,
          longitude: userCoords?.longitude,
          biometricVerified: true,
          authMethod: authData.method,
          assertionResponse: authData.assertionResponse,
        };

        const res = await attendanceService.checkOut(payload);
        if (res.data.success) {
          setSuccessMsg(`✓ Successfully checked out! Logged ${res.data.attendance?.workingHours} hrs`);
          onAttendanceUpdated();
        }
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Attendance request failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 relative overflow-hidden border border-gray-200/80 dark:border-gray-800/80 shadow-xl">
      {/* Background Accent Gradient */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header with Digital Clock */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Live Attendance Terminal
            </span>
          </div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mt-1 tracking-tight">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </h2>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">
            {currentTime.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {/* Today's Status Badge */}
        <div className="flex items-center gap-3">
          {isCheckedIn ? (
            <div className="text-right">
              <span className="text-[11px] text-gray-400 block">Today's Record</span>
              {getStatusBadge(todayAttendance?.status || 'Present')}
            </div>
          ) : (
            <Badge variant="neutral" dot>
              Not Checked In
            </Badge>
          )}
        </div>
      </div>

      {/* Office Selector & Distance Meter */}
      <div className="my-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Office Selection */}
        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200/60 dark:border-gray-700/60">
          <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5 mb-2">
            <MapPin className="w-4 h-4 text-indigo-500" />
            Geofence Office Zone
          </label>
          <select
            value={targetOffice?._id || ''}
            onChange={(e) => {
              const selected = allOffices.find((o) => o._id === e.target.value);
              if (selected) setSelectedOffice(selected);
            }}
            className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-xs font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
          >
            {allOffices.map((off) => (
              <option key={off._id} value={off._id}>
                {off.officeName} ({off.city}) — Radius: {off.radius}m
              </option>
            ))}
          </select>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1.5 truncate">
            {targetOffice?.address}
          </p>
        </div>

        {/* GPS Distance Status */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            isWithinGeofence
              ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-500/30'
              : 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-500/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
              <Shield className={`w-4 h-4 ${isWithinGeofence ? 'text-emerald-500' : 'text-rose-500'}`} />
              Perimeter Proximity
            </span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                isWithinGeofence
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
              }`}
            >
              {isWithinGeofence ? '✓ INSIDE GEOFENCE' : '✗ OUTSIDE BOUNDARY'}
            </span>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
              {formatDistance(distance)}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              from office center (Max: {targetOffice?.radius}m)
            </span>
          </div>
        </div>
      </div>

      {/* Developer / Testing Location Simulators */}
      <div className="p-3 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/50 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 dark:text-indigo-300">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span>Location Controls:</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            onClick={captureRealGPS}
            isLoading={gpsLoading}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Fetch Real GPS
          </Button>
          <Button
            size="sm"
            variant="success"
            onClick={simulateInsideOffice}
            className="text-xs"
          >
            Simulate Inside ({targetOffice?.code || 'HQ'})
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={simulateOutsideOffice}
            className="text-xs"
          >
            Simulate Outside
          </Button>
        </div>
      </div>

      {/* Error & Success Messages */}
      {errorMsg && (
        <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Check In / Check Out Action Buttons */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Button
          size="lg"
          variant="primary"
          onClick={() => handleStartAction('checkIn')}
          disabled={isCheckedIn || submitting}
          isLoading={submitting && pendingAction === 'checkIn'}
          leftIcon={<Fingerprint className="w-5 h-5" />}
          className="w-full text-sm font-bold shadow-lg shadow-indigo-500/20"
        >
          {isCheckedIn ? '✓ Already Checked In' : 'Mark Check In (Biometric)'}
        </Button>

        <Button
          size="lg"
          variant="secondary"
          onClick={() => handleStartAction('checkOut')}
          disabled={!isCheckedIn || isCheckedOut || submitting}
          isLoading={submitting && pendingAction === 'checkOut'}
          leftIcon={<Clock className="w-5 h-5" />}
          className="w-full text-sm font-bold"
        >
          {isCheckedOut ? '✓ Checked Out Today' : 'Mark Check Out'}
        </Button>
      </div>

      {/* Shift Progress / Details */}
      {isCheckedIn && (
        <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800 grid grid-cols-3 gap-2 text-center">
          <div>
            <span className="text-[10px] text-gray-400 uppercase font-semibold block">Check In Time</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {todayAttendance?.checkIn?.time
                ? new Date(todayAttendance.checkIn.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : '--:--'}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 uppercase font-semibold block">Check Out Time</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {todayAttendance?.checkOut?.time
                ? new Date(todayAttendance.checkOut.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : 'In Progress'}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 uppercase font-semibold block">Working Hours</span>
            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
              {todayAttendance?.workingHours || 0} hrs
            </span>
          </div>
        </div>
      )}

      {/* Biometric Verification Modal Dialog */}
      <BiometricModal
        isOpen={showBioModal}
        onClose={() => setShowBioModal(false)}
        onSuccess={handleBiometricSuccess}
        actionType={pendingAction}
        userName={userName}
      />
    </div>
  );
};
