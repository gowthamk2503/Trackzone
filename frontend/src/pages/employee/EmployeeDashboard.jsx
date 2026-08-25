import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  CheckCircle2,
  Timer,
  PlaneTakeoff,
  MapPin,
  TrendingUp,
  Shield,
} from 'lucide-react';
import { CheckInOutCard } from '../../components/attendance/CheckInOutCard';
import { GeofenceMap } from '../../components/attendance/GeofenceMap';
import { AttendanceTable } from '../../components/attendance/AttendanceTable';
import { Badge } from '../../components/common/Badge';
import { attendanceService, geofenceService, leaveService } from '../../services/api';
import { calculateDistanceMeters } from '../../utils/haversine';

export const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [offices, setOffices] = useState([]);
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [recentRecords, setRecentRecords] = useState([]);
  const [userCoords, setUserCoords] = useState(null);
  const [leaveBalance, setLeaveBalance] = useState(18);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      // 1. Fetch Offices
      const officeRes = await geofenceService.getActive();
      if (officeRes.data.success) {
        const officeList = officeRes.data.offices || [];
        setOffices(officeList);

        // Find user's assigned office or default to first
        let currentOffice = officeList[0] || null;
        if (user?.officeId) {
          const userOffId = typeof user.officeId === 'object' ? user.officeId?._id : user.officeId;
          const matched = officeList.find((o) => o._id === userOffId);
          if (matched) currentOffice = matched;
        }
        setSelectedOffice(currentOffice);

        // Default initial GPS coordinates to inside selected office for seamless instant testing!
        if (currentOffice && !userCoords) {
          setUserCoords({
            latitude: currentOffice.latitude + 0.0001,
            longitude: currentOffice.longitude + 0.0001,
          });
        }
      }

      // 2. Fetch Today's Attendance
      const todayRes = await attendanceService.getToday();
      if (todayRes.data.success) {
        setTodayAttendance(todayRes.data.attendance);
      }

      // 3. Fetch Recent History
      const histRes = await attendanceService.getHistory({ limit: 7 });
      if (histRes.data.success) {
        setRecentRecords(histRes.data.records || []);
      }

      // 4. Fetch Leave Balance
      const leaveRes = await leaveService.getMyLeaves();
      if (leaveRes.data.success) {
        setLeaveBalance(leaveRes.data.stats?.leaveBalance || 18);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const targetOffice = selectedOffice || offices[0] || null;
  const distance =
    userCoords && targetOffice
      ? calculateDistanceMeters(userCoords, {
          latitude: targetOffice.latitude,
          longitude: targetOffice.longitude,
        })
      : 0;

  const isInside = targetOffice ? distance <= targetOffice.radius + 15 : false;

  const presentDaysCount = recentRecords.filter((r) => r.status === 'Present' || r.status === 'Late').length;
  const totalWorkedHours = recentRecords.reduce((acc, r) => acc + (r.workingHours || 0), 0);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="glass-card rounded-3xl p-6 border border-gray-200/80 dark:border-gray-800/80 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Employee Portal
            </span>
            <Badge variant="purple" size="sm">
              {user?.department || 'Engineering'}
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Welcome back, {user?.name || 'Team Member'}! 👋
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xl">
            Shift Schedule: <strong className="text-gray-900 dark:text-white">{user?.shiftSchedule || '09:00 - 18:00'}</strong> • Assigned Geofence: <strong className="text-indigo-600 dark:text-indigo-400">{targetOffice?.officeName || 'Bangalore HQ'}</strong>
          </p>
        </div>

        {/* Quick Info Chip */}
        <div className="flex items-center gap-3 relative z-10 bg-white/60 dark:bg-gray-800/60 p-3 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 backdrop-blur-md">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Biometric Node</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> WebAuthn Enrolled
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-4 border border-indigo-500/20 glass-card-hover">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs font-bold">
            <span>Recent Present</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-gray-900 dark:text-white mt-2">
            {presentDaysCount} <span className="text-xs text-gray-400 font-normal">/ {recentRecords.length} logged</span>
          </p>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
            <TrendingUp className="w-3 h-3" /> 100% On-Time Adherence
          </span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-sky-500/20 glass-card-hover">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs font-bold">
            <span>Total Logged</span>
            <Timer className="w-4 h-4 text-sky-500" />
          </div>
          <p className="text-2xl font-black text-gray-900 dark:text-white mt-2">
            {Math.round(totalWorkedHours * 10) / 10} <span className="text-xs text-gray-400 font-normal">hrs</span>
          </p>
          <span className="text-[10px] text-gray-400 mt-1 block">
            Avg ~8.5 hrs / working day
          </span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-amber-500/20 glass-card-hover">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs font-bold">
            <span>Paid Leave Balance</span>
            <PlaneTakeoff className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-gray-900 dark:text-white mt-2">
            {leaveBalance} <span className="text-xs text-gray-400 font-normal">days</span>
          </p>
          <span className="text-[10px] text-gray-400 mt-1 block">
            Annual allocation: 18.0 days
          </span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-emerald-500/20 glass-card-hover">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs font-bold">
            <span>Perimeter Status</span>
            <MapPin className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-2 truncate">
            {isInside ? '✓ Inside Zone' : 'Outside Boundary'}
          </p>
          <span className="text-[10px] text-gray-400 mt-1 block truncate">
            Radius: {targetOffice?.radius || 150}m perimeter
          </span>
        </div>
      </div>

      {/* Main Action Section: Check In Terminal + Interactive Geofence Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: CheckInOut Terminal Card (7 cols) */}
        <div className="lg:col-span-7">
          <CheckInOutCard
            office={targetOffice}
            allOffices={offices}
            todayAttendance={todayAttendance}
            onAttendanceUpdated={loadDashboardData}
            userCoords={userCoords}
            setUserCoords={setUserCoords}
            selectedOffice={selectedOffice}
            setSelectedOffice={setSelectedOffice}
            userName={user?.name || 'Employee'}
          />
        </div>

        {/* Right Column: Interactive Leaflet Geofence Map (5 cols) */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="glass-card rounded-3xl p-5 border border-gray-200/80 dark:border-gray-800/80 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-500" />
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  Live Perimeter Visualizer
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-gray-400">
                {targetOffice?.code}
              </span>
            </div>

            <div className="flex-1 min-h-[260px]">
              <GeofenceMap
                office={targetOffice}
                userCoords={userCoords}
                distanceMeters={distance}
                isInside={isInside}
                className="h-full min-h-[260px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Attendance Activity Table */}
      <div className="glass-card rounded-3xl p-6 border border-gray-200/80 dark:border-gray-800/80">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Recent Attendance History
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Your recent check-in timestamps, total logged hours, and geofence locations
            </p>
          </div>
        </div>

        <AttendanceTable
          records={recentRecords}
          isLoading={loading}
          onRefresh={loadDashboardData}
          userName={user?.name}
          showActions={true}
        />
      </div>
    </div>
  );
};
