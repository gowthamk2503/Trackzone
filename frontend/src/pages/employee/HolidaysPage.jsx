import React, { useState, useEffect } from 'react';
import { PartyPopper } from 'lucide-react';
import { holidayService } from '../../services/api';
import { Badge } from '../../components/common/Badge';

export const HolidaysPage = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const res = await holidayService.getHolidays({ year: 2026 });
        if (res.data.success) {
          setHolidays(res.data.holidays || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchHolidays();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 border border-gray-200/80 dark:border-gray-800/80">
        <div className="flex items-center gap-2">
          <PartyPopper className="w-4 h-4 text-indigo-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Official Corporate Calendar
          </span>
        </div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mt-1">
          Company Holidays (2026)
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Official statutory holidays and company-wide paid observances
        </p>
      </div>

      {/* Holidays Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {holidays.map((holiday) => (
          <div
            key={holiday._id}
            className="glass-card rounded-3xl p-5 border border-indigo-500/10 glass-card-hover flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  {holiday.dayOfWeek}
                </span>
                <Badge variant={holiday.isOptional ? 'warning' : 'success'}>
                  {holiday.isOptional ? 'Optional' : 'Statutory'}
                </Badge>
              </div>

              <h3 className="text-base font-black text-gray-900 dark:text-white mt-2">
                {holiday.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {holiday.description || 'Public celebration & holiday'}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-gray-900 dark:text-white">
                {holiday.date}
              </span>
              <span className="text-[10px] uppercase font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                Paid Off
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
