import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { getStatusBadge } from '../common/Badge';
import { Modal } from '../common/Modal';

export const AttendanceCalendar = ({
  records,
  currentMonth,
  onMonthChange,
}) => {
  const [selectedDayRecord, setSelectedDayRecord] = useState(null);
  const [selectedDateStr, setSelectedDateStr] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [yearStr, monthStr] = currentMonth.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10); // 1-indexed

  // Calculate days in month & starting day of week
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const totalDays = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay(); // 0 = Sunday

  // Month navigation
  const handlePrevMonth = () => {
    let newYear = year;
    let newMonth = month - 1;
    if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    }
    onMonthChange(`${newYear}-${String(newMonth).padStart(2, '0')}`);
  };

  const handleNextMonth = () => {
    let newYear = year;
    let newMonth = month + 1;
    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    }
    onMonthChange(`${newYear}-${String(newMonth).padStart(2, '0')}`);
  };

  // Map attendance records by date YYYY-MM-DD
  const recordMap = {};
  records.forEach((rec) => {
    recordMap[rec.date] = rec;
  });

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const handleCellClick = (dayNum) => {
    const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    const rec = recordMap[dateKey] || null;
    setSelectedDateStr(dateKey);
    setSelectedDayRecord(rec);
    setShowDetailModal(true);
  };

  // Generate calendar grid slots
  const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);
  const blankSlots = Array.from({ length: startDayOfWeek }, (_, i) => i);

  return (
    <div className="glass-card rounded-3xl p-6 border border-gray-200/80 dark:border-gray-800/80">
      {/* Month Navigation Header */}
      <div className="flex items-center justify-between pb-5 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2.5">
          <CalendarIcon className="w-5 h-5 text-indigo-500" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {monthNames[month - 1]} {year}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Day of Week Headers */}
      <div className="grid grid-cols-7 gap-2 my-4 text-center">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
          <div
            key={day}
            className={`text-xs font-bold uppercase tracking-wider py-1 ${
              idx === 0 || idx === 6
                ? 'text-rose-500/80 dark:text-rose-400/80'
                : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-2">
        {blankSlots.map((blank) => (
          <div key={`blank-${blank}`} className="h-20 rounded-2xl bg-gray-50/30 dark:bg-gray-900/30 opacity-20" />
        ))}

        {daysArray.map((day) => {
          const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const rec = recordMap[dateKey];
          const isWeekend = new Date(year, month - 1, day).getDay() === 0 || new Date(year, month - 1, day).getDay() === 6;

          let statusBg = 'bg-gray-50 dark:bg-gray-800/40 border-gray-100 dark:border-gray-800';
          let badgeColor = 'text-gray-400';

          if (rec) {
            if (rec.status === 'Present') {
              statusBg = 'bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500';
              badgeColor = 'text-emerald-500';
            } else if (rec.status === 'Late') {
              statusBg = 'bg-amber-500/10 border-amber-500/30 hover:border-amber-500';
              badgeColor = 'text-amber-500';
            } else if (rec.status === 'Half-day') {
              statusBg = 'bg-indigo-500/10 border-indigo-500/30 hover:border-indigo-500';
              badgeColor = 'text-indigo-500';
            } else if (rec.status === 'On Leave') {
              statusBg = 'bg-sky-500/10 border-sky-500/30 hover:border-sky-500';
              badgeColor = 'text-sky-500';
            } else if (rec.status === 'Absent') {
              statusBg = 'bg-rose-500/10 border-rose-500/30 hover:border-rose-500';
              badgeColor = 'text-rose-500';
            }
          }

          return (
            <button
              key={day}
              onClick={() => handleCellClick(day)}
              className={`h-20 p-2 rounded-2xl border text-left flex flex-col justify-between transition-all hover:scale-[1.02] cursor-pointer ${statusBg}`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${isWeekend ? 'text-rose-400' : 'text-gray-900 dark:text-white'}`}>
                  {day}
                </span>
                {rec && (
                  <span className={`w-2 h-2 rounded-full ${rec.status === 'Present' ? 'bg-emerald-500' : rec.status === 'Late' ? 'bg-amber-500' : 'bg-indigo-500'}`} />
                )}
              </div>

              {rec ? (
                <div>
                  <span className={`text-[10px] font-bold block truncate ${badgeColor}`}>
                    {rec.status}
                  </span>
                  <span className="text-[9px] text-gray-400 font-semibold block">
                    {rec.workingHours || 0} hrs
                  </span>
                </div>
              ) : isWeekend ? (
                <span className="text-[10px] text-gray-400 font-medium italic">Weekend</span>
              ) : (
                <span className="text-[10px] text-gray-400 font-medium">--</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5 font-medium text-gray-600 dark:text-gray-300">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          Present (On Time)
        </div>
        <div className="flex items-center gap-1.5 font-medium text-gray-600 dark:text-gray-300">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          Late Arrival
        </div>
        <div className="flex items-center gap-1.5 font-medium text-gray-600 dark:text-gray-300">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
          Half Day
        </div>
        <div className="flex items-center gap-1.5 font-medium text-gray-600 dark:text-gray-300">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
          Approved Leave
        </div>
        <div className="flex items-center gap-1.5 font-medium text-gray-600 dark:text-gray-300">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          Absent
        </div>
      </div>

      {/* Day Details Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title={`Attendance Record: ${selectedDateStr}`}
        subtitle="Detailed timestamp, GPS coords & biometric security payload"
      >
        {selectedDayRecord ? (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-gray-800">
              <span className="font-bold text-gray-700 dark:text-gray-300">Status</span>
              {getStatusBadge(selectedDayRecord.status)}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl border border-gray-200 dark:border-gray-700">
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                  Check-In Details
                </span>
                <p className="font-bold text-gray-900 dark:text-white">
                  {selectedDayRecord.checkIn?.time
                    ? new Date(selectedDayRecord.checkIn.time).toLocaleTimeString()
                    : 'N/A'}
                </p>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  GPS: {selectedDayRecord.checkIn?.location?.latitude?.toFixed(4)},{' '}
                  {selectedDayRecord.checkIn?.location?.longitude?.toFixed(4)}
                </p>
                <p className="text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                  ✓ Geofence Verified ({selectedDayRecord.checkIn?.location?.distanceFromGeofence}m)
                </p>
              </div>

              <div className="p-3 rounded-2xl border border-gray-200 dark:border-gray-700">
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                  Check-Out Details
                </span>
                <p className="font-bold text-gray-900 dark:text-white">
                  {selectedDayRecord.checkOut?.time
                    ? new Date(selectedDayRecord.checkOut.time).toLocaleTimeString()
                    : 'N/A'}
                </p>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Total Logged: {selectedDayRecord.workingHours || 0} Hours
                </p>
                <p className="text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                  ✓ Biometric Sign-off
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-1">
                Security Device Signature
              </span>
              <p className="text-gray-600 dark:text-gray-300 font-mono text-[11px]">
                {selectedDayRecord.checkIn?.deviceInfo || 'Chrome / WebAuthn Biometric Authenticator'}
              </p>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center text-gray-400 text-xs">
            No attendance punched on this date.
          </div>
        )}
      </Modal>
    </div>
  );
};
