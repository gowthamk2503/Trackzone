import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  MapPin,
  Fingerprint,
  CheckCircle2,
  Clock,
  Navigation,
  RefreshCw,
  Compass,
  Radio,
  Building2,
  Check
} from 'lucide-react';

export const LandingMockup = () => {
  const [activeTab, setActiveTab] = useState('live');
  const [isPunching, setIsPunching] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(true);

  const simulatePunch = () => {
    setIsPunching(true);
    setTimeout(() => {
      setIsCheckedIn(prev => !prev);
      setIsPunching(false);
    }, 1200);
  };

  return (
    <section id="product-preview" className="relative py-12 md:py-24 overflow-hidden">
      {/* Background glow beneath mockup */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-gradient-to-tr from-[#E5D9F2]/60 via-[#CDC1FF]/40 to-[#F5EFFF]/70 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#CDC1FF] text-xs font-mono text-[#614FC4] font-semibold mb-4 shadow-sm">
            <Radio className="w-3.5 h-3.5 animate-pulse text-[#7967DE]" />
            LIVE VERIFICATION INTERFACE MOCKUP
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-950">
            Presence telemetry in action.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Real-time geofence calculation meets hardware-grade biometric passkeys.
          </p>
        </div>

        {/* Main Mockup Container Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto rounded-3xl p-1 bg-gradient-to-b from-white via-slate-50 to-slate-100 border border-slate-200/90 shadow-2xl shadow-slate-900/[0.08]"
        >
          <div className="rounded-[22px] bg-white/95 backdrop-blur-2xl border border-slate-100 overflow-hidden p-6 sm:p-8 md:p-10">
            {/* Top Mockup App Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <span className="text-xs font-mono text-slate-500 pl-2 border-l border-slate-200">
                  trackzone-terminal://hq-san-francisco
                </span>
              </div>

              {/* View Selector Tabs */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
                <button
                  onClick={() => setActiveTab('live')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'live'
                      ? 'bg-white text-slate-900 shadow-sm font-semibold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Live Radar View
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'security'
                      ? 'bg-white text-slate-900 shadow-sm font-semibold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Biometric Telemetry
                </button>
              </div>
            </div>

            {/* Mockup Core Grid */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Interactive Radar / Geofence Visualizer */}
              <div className="lg:col-span-7 relative flex flex-col items-center justify-center p-8 sm:p-12 rounded-2xl bg-[#F8F9FD] border border-slate-200/90 overflow-hidden min-h-[380px]">
                {/* Radar Grid Backdrop */}
                <div className="absolute inset-0 bg-[radial-gradient(#7967DE_1px,transparent_1px)] [background-size:20px_20px] opacity-10" />

                {/* Animated Pulsing Radar Rings */}
                <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.45, 1.8], opacity: [0.6, 0.25, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' }}
                    className="absolute inset-0 rounded-full border border-[#7967DE]/30 bg-[#7967DE]/5"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.3, 1.6], opacity: [0.8, 0.3, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeOut', delay: 1 }}
                    className="absolute inset-4 rounded-full border border-[#A294F9]/40"
                  />
                  <div className="absolute inset-8 rounded-full border border-dashed border-[#7967DE]/30" />
                  <div className="absolute inset-16 rounded-full border border-slate-200 bg-white/80" />

                  {/* Office Headquarters Center Pin */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#7967DE] to-[#8E7DEE] text-white flex items-center justify-center shadow-lg shadow-[#7967DE]/30 ring-4 ring-[#E5D9F2]">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <span className="mt-2 text-[11px] font-mono font-semibold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-sm">
                      Headquarters HQ
                    </span>
                  </div>

                  {/* Verified User Position Beacon (16m offset) */}
                  <motion.div
                    animate={{ y: [-4, 4, -4] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-12 right-12 z-20 flex flex-col items-center"
                  >
                    <div className="relative flex items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-7 w-7 rounded-full bg-emerald-400 opacity-60" />
                      <div className="relative w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/40 ring-2 ring-white">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-[10px] font-mono font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shadow-sm">
                      <Navigation className="w-2.5 h-2.5" />
                      <span>You (16m)</span>
                    </div>
                  </motion.div>
                </div>

                {/* Radar Floating Info Bar */}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3 z-10">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-emerald-200 text-emerald-700 text-xs font-semibold shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Inside Geofence (100m Radius)</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-mono font-medium shadow-sm">
                    <Compass className="w-3.5 h-3.5 text-[#7967DE]" />
                    <span>GPS Accuracy: ±2.4m</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Attendance Verification Status Card */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                {/* Status Hero Card */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-[#F5EFFF]/80 via-white to-slate-50 border border-[#CDC1FF] shadow-lg shadow-[#7967DE]/5 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono uppercase tracking-widest text-[#614FC4] font-bold">
                        Status Indicator
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {isCheckedIn ? 'Checked In' : 'Ready for Check-In'}
                    </span>
                  </div>

                  {/* 4 Required Showcase Items in clean visual badges */}
                  <div className="space-y-3">
                    {/* Item 1: Inside Geofence */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200/90 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-900">Inside Geofence</div>
                          <div className="text-xs text-slate-500">Office Perimeter Verified</div>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        ✓ MATCH
                      </span>
                    </div>

                    {/* Item 2: Biometric Verified */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200/90 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#F5EFFF] text-[#7967DE] flex items-center justify-center">
                          <Fingerprint className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-900">Biometric Verified</div>
                          <div className="text-xs text-slate-500">WebAuthn FIDO2 Passkey</div>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-semibold text-[#614FC4] bg-[#F5EFFF] border border-[#CDC1FF] px-2 py-0.5 rounded">
                        SECURE
                      </span>
                    </div>

                    {/* Item 3: 16m from Office */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200/90 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                          <Navigation className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-900">16m from Office</div>
                          <div className="text-xs text-slate-500">Current Distance Offset</div>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        0.016 km
                      </span>
                    </div>

                    {/* Item 4: Checked In Timestamp */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200/90 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#F5EFFF] text-[#7967DE] flex items-center justify-center">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-900">
                            {isCheckedIn ? 'Checked In' : 'Shift Off'}
                          </div>
                          <div className="text-xs text-slate-500">09:02:14 AM (On Time)</div>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        RECORDED
                      </span>
                    </div>
                  </div>

                  {/* Interactive Trigger Demo Button */}
                  <div className="mt-5 pt-4 border-t border-slate-200/80">
                    <button
                      onClick={simulatePunch}
                      disabled={isPunching}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-[#7967DE] to-[#8E7DEE] hover:from-[#6B57D8] hover:to-[#7967DE] transition-all shadow-md shadow-[#7967DE]/25 active:scale-[0.99] disabled:opacity-70 cursor-pointer"
                    >
                      {isPunching ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Verifying Biometric Passkey...</span>
                        </>
                      ) : (
                        <>
                          <Fingerprint className="w-4 h-4" />
                          <span>{isCheckedIn ? 'Test Check-Out Simulation' : 'Test Check-In Simulation'}</span>
                        </>
                      )}
                    </button>
                    <p className="mt-2 text-center text-[11px] text-slate-500 font-mono">
                      * Interactive visual preview simulation only
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LandingMockup;
