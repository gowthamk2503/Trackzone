import React from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Fingerprint,
  BarChart3,
  Users2,
  CalendarCheck2,
  ShieldCheck,
  FileSpreadsheet,
  Layers,
  ArrowUpRight
} from 'lucide-react';

export const LandingFeatures = () => {
  const features = [
    {
      id: 'gps-geofencing',
      title: 'GPS Geofencing',
      tag: 'Spatial Intelligence',
      description:
        'Define polygonal or radial zones around offices and job sites. Automatically validate employee proximity in sub-second precision.',
      icon: MapPin,
      highlight: 'Multi-office radius support',
      colSpan: 'lg:col-span-7',
    },
    {
      id: 'biometric-auth',
      title: 'Biometric Authentication',
      tag: 'Cryptographic FIDO2',
      description:
        'Leverage browser WebAuthn and passkeys. Zero passwords stored on servers, eliminating credential theft and impersonation.',
      icon: Fingerprint,
      highlight: 'Hardware secure enclave',
      colSpan: 'lg:col-span-5',
    },
    {
      id: 'attendance-analytics',
      title: 'Attendance Analytics',
      tag: 'Live Telemetry',
      description:
        'Visualize workforce attendance trends, punctuality patterns, and shift distributions with interactive real-time dashboards.',
      icon: BarChart3,
      highlight: 'Automated trend insights',
      colSpan: 'lg:col-span-4',
    },
    {
      id: 'employee-management',
      title: 'Employee Management',
      tag: 'Role-Based Control',
      description:
        'Manage staff directories, department hierarchies, assign customized office locations, and configure granular permissions.',
      icon: Users2,
      highlight: 'Seamless team onboarding',
      colSpan: 'lg:col-span-4',
    },
    {
      id: 'leave-management',
      title: 'Leave Management',
      tag: 'Workflow Automation',
      description:
        'Streamline PTO, sick leave, and vacation requests with integrated approval workflows and synchronized attendance quotas.',
      icon: CalendarCheck2,
      highlight: 'Instant manager sign-off',
      colSpan: 'lg:col-span-4',
    },
    {
      id: 'security-audit',
      title: 'Security Audit',
      tag: 'Compliance Ready',
      description:
        'Complete chronological audit logging of every punch attempt, IP address, device user-agent, and geofence boundary deviation.',
      icon: ShieldCheck,
      highlight: 'Immutable event stream',
      colSpan: 'lg:col-span-6',
    },
    {
      id: 'reports',
      title: 'Reports & Export',
      tag: 'Payroll Ready',
      description:
        'Generate structured PDF summaries and Excel workbooks for payroll processing, tax auditing, and compliance reporting in seconds.',
      icon: FileSpreadsheet,
      highlight: 'One-click PDF & XLSX export',
      colSpan: 'lg:col-span-6',
    },
  ];

  return (
    <section id="features" className="relative py-24 md:py-36 overflow-hidden border-t border-slate-200/80">
      {/* Background glow accents */}
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-[#E5D9F2]/40 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-[#CDC1FF]/30 rounded-full blur-[140px] pointer-events-none -z-10" />

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
            <Layers className="w-3.5 h-3.5 text-[#7967DE]" />
            COMPLETE CAPABILITIES
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-950"
          >
            Built for modern{' '}
            <span className="font-serif italic font-normal text-[#7967DE]">
              enterprise workforces.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-slate-600 font-normal leading-relaxed"
          >
            From geofence perimeter calibration to payroll-ready compliance summaries, TrackZone equips operations teams with total certainty.
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className={`${item.colSpan} group relative rounded-3xl p-8 bg-white border border-slate-200/90 hover:border-[#CDC1FF] transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-slate-900/[0.03] hover:shadow-xl hover:shadow-[#7967DE]/10 flex flex-col justify-between`}
              >
                <div>
                  {/* Top Bar: Icon & Tag */}
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

                  {/* Description */}
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Highlight Tag */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500">{item.highlight}</span>
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-[#7967DE]" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LandingFeatures;
