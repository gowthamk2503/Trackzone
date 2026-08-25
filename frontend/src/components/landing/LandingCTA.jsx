import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export const LandingCTA = () => {
  return (
    <section className="relative py-24 md:py-36 overflow-hidden border-t border-slate-200/80">
      {/* Glowing background halo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-[#E5D9F2]/70 via-[#CDC1FF]/40 to-[#F5EFFF]/80 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-[32px] p-10 sm:p-16 md:p-20 bg-gradient-to-b from-[#F5EFFF]/90 via-white to-white border border-[#CDC1FF] shadow-2xl shadow-slate-900/[0.06] backdrop-blur-2xl text-center overflow-hidden"
        >
          {/* Subtle top pill */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#CDC1FF] text-xs font-mono text-[#614FC4] font-semibold mb-8 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#7967DE]" />
            DEPLOY VERIFIED ATTENDANCE TODAY
          </div>

          {/* Headline */}
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-slate-950 leading-tight">
            Make every check-in{' '}
            <span className="font-serif italic font-normal text-[#7967DE]">
              count.
            </span>
          </h2>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Eliminate buddy punching and spoofed time logs forever with cryptographic presence intelligence.
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-9 py-4 rounded-full text-base font-semibold text-white bg-gradient-to-r from-[#7967DE] via-[#8E7DEE] to-[#9181F4] hover:from-[#6B57D8] hover:to-[#7967DE] shadow-xl shadow-[#7967DE]/30 hover:shadow-2xl hover:shadow-[#7967DE]/40 transition-all duration-300 hover:-translate-y-1 active:translate-y-0"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-9 py-4 rounded-full text-base font-medium text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition-all duration-300 hover:-translate-y-0.5"
            >
              <span>Sign In</span>
            </Link>
          </div>

          {/* Guarantee Badges */}
          <div className="mt-12 pt-8 border-t border-slate-100 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-600 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Instant 2-Minute Setup</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Hardware-Free Deployment</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Enterprise Ready</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LandingCTA;
