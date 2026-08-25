import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';

export const LandingHero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.18,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const scrollToPreview = (e) => {
    e.preventDefault();
    const element = document.querySelector('#product-preview');
    if (element) {
      const navOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 overflow-hidden">
      {/* Ambient background soft light pastel glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-[#E5D9F2]/70 via-[#CDC1FF]/40 to-[#F5EFFF]/80 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-[#CDC1FF]/30 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-[#E5D9F2]/50 rounded-full blur-[110px] pointer-events-none -z-10" />

      {/* Subtle grid pattern background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000006_1px,transparent_1px),linear-gradient(to_bottom,#00000006_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center"
        >
          {/* Top Pill Badge */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/90 border border-[#CDC1FF] shadow-sm shadow-slate-900/[0.04] backdrop-blur-md">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7967DE] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7967DE]"></span>
              </span>
              <span className="text-xs font-mono tracking-wider uppercase text-[#614FC4] font-semibold">
                Next-Gen Workforce Presence
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-xs font-medium text-slate-700 flex items-center gap-1">
                FIDO2 & Geofencing <Sparkles className="w-3 h-3 text-[#7967DE]" />
              </span>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-slate-950 leading-[1.06] max-w-4xl"
          >
            Attendance.{' '}
            <span className="block mt-1 sm:mt-2 bg-gradient-to-r from-[#614FC4] via-[#7967DE] to-[#8E7DEE] bg-clip-text text-transparent font-serif italic font-normal">
              Verified by Presence.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="mt-8 text-lg sm:text-xl md:text-2xl text-slate-600 max-w-2xl font-normal leading-relaxed"
          >
            Smart workforce attendance powered by real-time location verification and secure biometric authentication.
          </motion.p>

          {/* Call-to-Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-base font-semibold text-white bg-gradient-to-r from-[#7967DE] via-[#8E7DEE] to-[#9181F4] hover:from-[#6B57D8] hover:to-[#7967DE] shadow-xl shadow-[#7967DE]/25 hover:shadow-2xl hover:shadow-[#7967DE]/35 transition-all duration-300 hover:-translate-y-1 active:translate-y-0"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <a
              href="#product-preview"
              onClick={scrollToPreview}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-base font-medium text-slate-800 bg-white hover:bg-slate-50 border border-slate-200/90 shadow-sm shadow-slate-900/[0.04] transition-all duration-300 hover:-translate-y-0.5"
            >
              <span>Explore TrackZone</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>
          </motion.div>

          {/* Key Value Micro-Badges */}
          <motion.div
            variants={itemVariants}
            className="mt-14 pt-8 border-t border-slate-200/80 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-600 font-medium"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#7967DE]" />
              <span>Zero Buddy Punching</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#7967DE]" />
              <span>Anti-Spoof Hardware GPS</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#7967DE]" />
              <span>WebAuthn Cryptographic Keys</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default LandingHero;
