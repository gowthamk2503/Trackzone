import React from 'react';
import { ShieldCheck, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LandingFooter = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#F8F9FD] border-t border-slate-200/90 pt-20 pb-12 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-slate-200">
          {/* Brand Column */}
          <div className="md:col-span-5 flex flex-col items-start">
            <Link to="/login" className="flex items-center gap-3 group">
              <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-[#7967DE] text-white shadow-md shadow-[#7967DE]/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 font-sans">
                TRACKZONE
              </span>
            </Link>

            <p className="mt-4 text-base font-semibold text-slate-700 max-w-sm leading-relaxed">
              Attendance. Verified by Presence.
            </p>
            <p className="mt-2 text-xs text-slate-500 max-w-sm leading-relaxed">
              Cryptographic workforce presence verification powered by hardware GPS and WebAuthn biometrics.
            </p>

            {/* System Status Badge */}
            <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-emerald-200 text-xs font-mono text-emerald-700 font-medium shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Systems Operational</span>
            </div>
          </div>

          {/* Navigation Links Column 1 */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#614FC4] font-bold mb-4">
              Product
            </h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li>
                <a href="#product-preview" className="hover:text-slate-950 transition-colors">
                  Live Radar View
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-slate-950 transition-colors">
                  GPS Geofencing
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-slate-950 transition-colors">
                  Biometrics & Passkeys
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-slate-950 transition-colors">
                  Payroll Reports
                </a>
              </li>
            </ul>
          </div>

          {/* Navigation Links Column 2 */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#614FC4] font-bold mb-4">
              Security
            </h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li>
                <a href="#security" className="hover:text-slate-950 transition-colors">
                  Anti-Spoof Telemetry
                </a>
              </li>
              <li>
                <a href="#security" className="hover:text-slate-950 transition-colors">
                  WebAuthn Standard
                </a>
              </li>
              <li>
                <a href="#security" className="hover:text-slate-950 transition-colors">
                  Immutable Audit
                </a>
              </li>
              <li>
                <a href="#security" className="hover:text-slate-950 transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Navigation Links Column 3 */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#614FC4] font-bold mb-4">
              Account
            </h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li>
                <Link to="/login" className="hover:text-slate-950 transition-colors">
                  Sign In to Workspace
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-slate-950 transition-colors">
                  Register Organization
                </Link>
              </li>
              <li>
                <Link to="/forgot-password" className="hover:text-slate-950 transition-colors">
                  Account Recovery
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <div>
            © {new Date().getFullYear()} TRACKZONE Technologies. All rights reserved.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-slate-950 transition-colors shadow-sm"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
