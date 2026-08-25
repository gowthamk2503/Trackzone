import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  MapPin,
  Fingerprint,
  CheckCircle2,
  Navigation,
  Clock,
  Building2,
  Sparkles,
  Shield,
  Radio,
  Check
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AuthVisualPanel = ({
  headline = 'Attendance.\nVerified by Presence.',
  subtitle = 'Track employee presence with secure location verification and biometric authentication.',
  variant = 'login',
  badges = [
    '✓ GPS Verified',
    '✓ Biometric Ready',
    '✓ Secure Attendance',
    '✓ Real-time Presence',
  ],
}) => {
  const [currentTime, setCurrentTime] = useState('09:09:14 AM');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-8 sm:p-12 lg:p-14 overflow-hidden rounded-[32px] bg-gradient-to-br from-[#F5EFFF] via-[#E5D9F2]/70 to-[#CDC1FF]/40 border border-[#CDC1FF]/80 shadow-2xl shadow-[#7967DE]/10">
      {/* Background Soft Ambient Light Blobs */}
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-[#A294F9]/25 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-[#7967DE]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-white/40 rounded-full blur-[90px] pointer-events-none" />

      {/* Top Brand Logo Bar */}
      <div className="relative z-10">
        <Link to="/" className="inline-flex items-center gap-3 group">
          <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#7967DE] to-[#A294F9] text-white shadow-md shadow-[#7967DE]/25 transition-transform duration-300 group-hover:scale-105">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-slate-900 font-sans flex items-center gap-1.5">
              TRACKZONE
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#7967DE] font-mono font-semibold -mt-1">
              Presence Verified
            </span>
          </div>
        </Link>
      </div>

      {/* Main Copy & Typography */}
      <div className="relative z-10 my-8 sm:my-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#CDC1FF] text-xs font-mono text-[#614FC4] font-semibold mb-5 shadow-sm">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7967DE] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7967DE]"></span>
          </span>
          <span>{variant === 'login' ? 'VERIFIED ATTENDANCE GATEWAY' : 'WORKFORCE ENROLLMENT'}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-950 leading-[1.12]">
          {headline.split('\n').map((line, i) => (
            <span key={i} className="block">
              {i === 1 ? (
                <span className="font-serif italic font-normal text-[#7967DE]">{line}</span>
              ) : (
                line
              )}
            </span>
          ))}
        </h1>

        <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-md leading-relaxed font-normal">
          {subtitle}
        </p>
      </div>

      {/* Animated Attendance Terminal Illustration Mockup */}
      <div className="relative z-10 mt-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-2xl p-5 sm:p-6 bg-white/95 backdrop-blur-xl border border-white shadow-xl shadow-slate-900/[0.06]"
        >
          {/* Card Top Title & Live Status Beacon */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wider">
                Employee Presence
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-mono font-semibold">
              <Check className="w-3 h-3 stroke-[3]" />
              <span>Verified Presence</span>
            </div>
          </div>

          {/* Mini Radar / Geofence + Biometric Visual Centerpiece */}
          <div className="py-5 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            {/* Left: Geofence Radar Circle */}
            <div className="sm:col-span-6 relative flex items-center justify-center py-2">
              <div className="relative w-36 h-36 flex items-center justify-center">
                {/* Pulsing Outer Rings */}
                <motion.div
                  animate={{ scale: [1, 1.35, 1.6], opacity: [0.6, 0.2, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' }}
                  className="absolute inset-0 rounded-full border border-[#7967DE]/40 bg-[#7967DE]/5"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1.4], opacity: [0.8, 0.3, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeOut', delay: 1 }}
                  className="absolute inset-2 rounded-full border border-[#A294F9]/50"
                />
                <div className="absolute inset-6 rounded-full border border-dashed border-[#7967DE]/30" />
                <div className="absolute inset-10 rounded-full border border-slate-200 bg-[#F8F9FD]" />

                {/* HQ Center Marker */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-9 h-9 rounded-xl bg-[#7967DE] text-white flex items-center justify-center shadow-md shadow-[#7967DE]/30">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-mono font-bold text-slate-700 bg-white px-1.5 py-0.2 rounded border border-slate-200 mt-1">
                    GeoZone
                  </span>
                </div>

                {/* Verified Employee Beacon */}
                <motion.div
                  animate={{ y: [-2, 2, -2] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-2 right-2 z-20 flex flex-col items-center"
                >
                  <div className="relative flex items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-5 w-5 rounded-full bg-emerald-400 opacity-60" />
                    <div className="relative w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md ring-2 ring-white">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  </div>
                  <span className="text-[8px] font-mono text-emerald-700 font-bold bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200 mt-0.5">
                    16m
                  </span>
                </motion.div>
              </div>
            </div>

            {/* Right: Telemetry Key-Value Statuses */}
            <div className="sm:col-span-6 space-y-2">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-slate-800 font-semibold text-[11px]">Location Verified</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-700 font-bold">✓ INSIDE</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[#F5EFFF] text-[#7967DE] flex items-center justify-center">
                    <Fingerprint className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-slate-800 font-semibold text-[11px]">Biometric Match</span>
                </div>
                <span className="text-[10px] font-mono text-[#614FC4] font-bold">✓ FIDO2</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-slate-800 font-semibold text-[11px]">Timestamp</span>
                </div>
                <span className="text-[10px] font-mono text-slate-700 font-bold">{currentTime}</span>
              </div>
            </div>
          </div>

          {/* Bottom Badges */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-500">
            <span className="flex items-center gap-1 text-slate-700 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#7967DE]" />
              Haversine GPS ±2.4m
            </span>
            <span className="flex items-center gap-1 text-slate-700 font-medium">
              <Shield className="w-3.5 h-3.5 text-[#7967DE]" />
              Hardware Enclave
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthVisualPanel;
