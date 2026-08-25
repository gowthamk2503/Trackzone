import React from 'react';
import { motion } from 'framer-motion';
import { Navigation2, MapPin, Fingerprint, DatabaseZap, CheckCircle2 } from 'lucide-react';

export const LandingHowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'Real Location',
      tagline: 'High-Precision Telemetry Lock',
      description:
        'When the employee initiates check-in, the browser queries device GPS coordinates with hardware accuracy filters and mock-location detection.',
      icon: Navigation2,
      badge: 'GPS ±2.5m Lock',
    },
    {
      number: '02',
      title: 'Geofence Verification',
      tagline: 'Mathematical Polygon Check',
      description:
        'The server computes the exact distance against the organization’s designated office perimeter to confirm physical presence.',
      icon: MapPin,
      badge: 'Radial / Boundary Check',
    },
    {
      number: '03',
      title: 'Biometric Verification',
      tagline: 'FIDO2 / WebAuthn Hardware Keys',
      description:
        'The employee touches their fingerprint sensor or Face ID on their trusted device, creating an asymmetric cryptographic signature.',
      icon: Fingerprint,
      badge: 'Zero Password Auth',
    },
    {
      number: '04',
      title: 'Attendance Recorded',
      tagline: 'Immutable Audit Log & Sync',
      description:
        'The validated check-in is logged with timestamp, distance offset, and cryptographic proof, updating payroll and analytics instantly.',
      icon: DatabaseZap,
      badge: 'Tamper-Proof Record',
    },
  ];

  return (
    <section id="how-it-works" className="relative py-24 md:py-36 overflow-hidden">
      {/* Soft central glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-b from-[#E5D9F2]/40 via-[#F5EFFF]/50 to-transparent rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#CDC1FF] text-xs font-mono text-[#614FC4] font-semibold mb-6 shadow-sm"
          >
            THE VERIFICATION PIPELINE
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-950"
          >
            How presence becomes{' '}
            <span className="font-serif italic font-normal text-[#7967DE]">
              proof.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-slate-600 font-normal leading-relaxed"
          >
            Four instantaneous steps to guarantee authentic employee presence with zero hardware punch-clocks required.
          </motion.p>
        </div>

        {/* 4-Step Grid with Connecting Aesthetics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.12 }}
                className="relative rounded-3xl p-8 bg-white border border-slate-200/90 hover:border-[#CDC1FF] transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-slate-900/[0.03] hover:shadow-xl hover:shadow-[#7967DE]/10 flex flex-col justify-between group"
              >
                {/* Step Number & Badge */}
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-4xl font-mono font-bold text-slate-200 group-hover:text-[#CDC1FF] transition-colors">
                      {step.number}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#F5EFFF] border border-[#CDC1FF] flex items-center justify-center text-[#7967DE] group-hover:scale-110 transition-transform shadow-sm">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-xl font-bold text-slate-900 mb-1">
                    {step.title}
                  </h3>
                  <div className="text-xs font-mono text-[#7967DE] font-semibold mb-4">
                    {step.tagline}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Bottom Spec Badge */}
                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                  <span className="text-emerald-700 font-semibold flex items-center gap-1.5 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {step.badge}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LandingHowItWorks;
