import React from 'react';
import { motion } from 'framer-motion';
import { UserX, Globe2, FileQuestion, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';

export const LandingProblems = () => {
  const problems = [
    {
      id: 'buddy-punching',
      icon: UserX,
      tag: 'Identity Vulnerability',
      title: 'Buddy Punching',
      flaw: 'Employees sharing badges, credentials, or pins to clock in for absent coworkers.',
      solution: 'WebAuthn hardware passkeys ensure only the physical employee can authenticate.',
      impact: '100% buddy punch elimination',
    },
    {
      id: 'remote-checkins',
      icon: Globe2,
      tag: 'Location Spoofing',
      title: 'Remote Check-ins',
      flaw: 'Staff marking attendance from home, during transit, or using mock GPS apps.',
      solution: 'Strict geofence radius calculation with anti-spoof and mock provider rejection.',
      impact: 'Zero off-site punch acceptance',
    },
    {
      id: 'unverified-attendance',
      icon: FileQuestion,
      tag: 'Audit Friction',
      title: 'Unverified Attendance',
      flaw: 'Unreliable paper logs, spreadsheet disputes, and lack of tamper-proof records.',
      solution: 'Immutable telemetry logs recording exact distance, coordinates, and public-key signatures.',
      impact: 'Complete compliance readiness',
    },
  ];

  return (
    <section className="relative py-20 md:py-32 overflow-hidden border-t border-slate-200/80">
      {/* Background radial accent */}
      <div className="absolute top-1/2 right-10 w-[500px] h-[500px] bg-[#E5D9F2]/40 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#CDC1FF] text-xs font-mono text-[#614FC4] font-semibold mb-6 shadow-sm"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-[#7967DE]" />
            THE INTEGRITY GAP
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-950 leading-tight"
          >
            Attendance should{' '}
            <span className="font-serif italic font-normal text-[#7967DE]">
              reflect reality.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-slate-600 font-normal leading-relaxed"
          >
            Traditional systems rely on trust rather than proof. TrackZone replaces honor codes with verifiable cryptographic and spatial truth.
          </motion.p>
        </div>

        {/* 3 Problem Cards Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {problems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="group relative rounded-3xl p-8 bg-white border border-slate-200/90 hover:border-[#CDC1FF] transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-slate-900/[0.03] hover:shadow-xl hover:shadow-[#7967DE]/10 flex flex-col justify-between"
              >
                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#F5EFFF] border border-[#CDC1FF] flex items-center justify-center text-[#7967DE] group-hover:scale-105 transition-transform shadow-sm">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200 font-medium">
                      {item.tag}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    {item.title}
                  </h3>

                  {/* Problem vs Solution Comparison */}
                  <div className="space-y-3 my-6">
                    <div className="flex items-start gap-2.5 text-xs text-rose-800 bg-rose-50 p-3 rounded-xl border border-rose-200">
                      <XCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                      <span>{item.flaw}</span>
                    </div>

                    <div className="flex items-start gap-2.5 text-xs text-emerald-800 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                      <span>{item.solution}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Impact Metric */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500">Outcome:</span>
                  <span className="font-bold text-[#614FC4]">{item.impact}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LandingProblems;
