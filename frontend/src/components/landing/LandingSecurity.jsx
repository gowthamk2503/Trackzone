import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, KeyRound, Lock, FileText, CheckCircle2, EyeOff } from 'lucide-react';

export const LandingSecurity = () => {
  const securityPillars = [
    {
      id: 'gps-verification',
      title: 'GPS Verification & Anti-Spoof',
      tag: 'Spatial Integrity',
      description:
        'Multi-signal triangulation analyzes satellite accuracy, mock provider flags, and altitude drift to prevent GPS emulator exploitation.',
      icon: ShieldCheck,
      details: ['Mock Location Detection', '±3m Coordinate Precision', 'Instant Geofence Calculation'],
    },
    {
      id: 'webauthn',
      title: 'WebAuthn (FIDO2 Standard)',
      tag: 'Cryptographic Standard',
      description:
        'Industry-standard W3C / FIDO2 authentication replaces vulnerable passwords with asymmetric public-key cryptography stored on device security chips.',
      icon: KeyRound,
      details: ['Asymmetric Keypairs', 'Phishing-Resistant Protocol', 'Hardware Enclave Security'],
    },
    {
      id: 'passkeys',
      title: 'Biometric Passkeys',
      tag: 'Zero Shared Secrets',
      description:
        'Employees authenticate using native Touch ID, Face ID, or Windows Hello. Raw biometric data never leaves the employee’s local device.',
      icon: Lock,
      details: ['Touch ID / Face ID Native', 'Zero Server Biometric Storage', 'Instant Touch Verification'],
    },
    {
      id: 'audit-logging',
      title: 'Immutable Audit Logging',
      tag: 'Compliance Assurance',
      description:
        'Every single attendance attempt is cryptographically logged with IP origin, client user-agent, timestamp, and boundary result for full auditability.',
      icon: FileText,
      details: ['Chronological Event Stream', 'Tamper-Evident Trail', 'Exportable for Compliance'],
    },
  ];

  return (
    <section id="security" className="relative py-24 md:py-36 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[#E5D9F2]/50 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#CDC1FF] text-xs font-mono text-[#614FC4] font-semibold mb-6 shadow-sm"
          >
            <Lock className="w-3.5 h-3.5 text-[#7967DE]" />
            ZERO-TRUST ARCHITECTURE
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-950"
          >
            Built for{' '}
            <span className="font-serif italic font-normal text-[#7967DE]">
              trusted attendance.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-slate-600 font-normal leading-relaxed"
          >
            Every verification is cryptographically signed and mathematically proved before being committed to your records.
          </motion.p>
        </div>

        {/* 4 Security Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {securityPillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.12 }}
                className="group relative rounded-3xl p-8 bg-white border border-slate-200/90 hover:border-[#CDC1FF] transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-slate-900/[0.03] hover:shadow-xl hover:shadow-[#7967DE]/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#F5EFFF] border border-[#CDC1FF] flex items-center justify-center text-[#7967DE] group-hover:scale-105 transition-transform shadow-sm">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#614FC4] bg-[#F5EFFF] px-2.5 py-1 rounded-full border border-[#CDC1FF] font-semibold">
                      {pillar.tag}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    {pillar.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {pillar.description}
                  </p>
                </div>

                {/* Micro checklist */}
                <div className="pt-6 border-t border-slate-100 space-y-2.5">
                  {pillar.details.map((detail, dIdx) => (
                    <div key={dIdx} className="flex items-center gap-2 text-xs font-mono text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Privacy Callout Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-[#F5EFFF]/90 to-white border border-[#CDC1FF] flex flex-col sm:flex-row items-center gap-6 shadow-sm"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#7967DE] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#7967DE]/20">
            <EyeOff className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-900 mb-1">
              Privacy by Design: Point-in-Time Verification Only
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              TrackZone verifies GPS coordinates <strong className="text-slate-900">only at the precise moment of punch-in and punch-out</strong>. There is zero continuous tracking, background monitoring, or battery drain when off shift.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LandingSecurity;
