import React, { useEffect } from 'react';
import {
  LandingNavbar,
  LandingHero,
  LandingMockup,
  LandingProblems,
  LandingHowItWorks,
  LandingFeatures,
  LandingSecurity,
  LandingCTA,
  LandingFooter,
} from '../components/landing';

export const LandingPage = () => {
  useEffect(() => {
    // Set page title for premium presence branding
    const previousTitle = document.title;
    document.title = 'TrackZone — Attendance. Verified by Presence.';
    window.scrollTo(0, 0);

    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-slate-900 selection:bg-[#CDC1FF] selection:text-[#1E164D] font-sans antialiased overflow-x-hidden relative">
      {/* Subtle global ambient light background mesh */}
      <div className="fixed inset-0 pointer-events-none -z-50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[700px] bg-gradient-to-b from-[#E5D9F2]/60 via-[#F5EFFF]/40 to-transparent blur-[140px]" />
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-[#CDC1FF]/25 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-[#E5D9F2]/30 rounded-full blur-[140px]" />
      </div>

      {/* 1. Navbar */}
      <LandingNavbar />

      <main>
        {/* 2. Hero Section */}
        <LandingHero />

        {/* 3. Product Preview (Visual Mockup) */}
        <LandingMockup />

        {/* 4. Problem Section ("Attendance should reflect reality.") */}
        <LandingProblems />

        {/* 5. How It Works (01 Real Location → 02 Geofence → 03 Biometric → 04 Recorded) */}
        <LandingHowItWorks />

        {/* 6. Features Grid (7 Core Capabilities) */}
        <LandingFeatures />

        {/* 7. Security Section ("Built for trusted attendance.") */}
        <LandingSecurity />

        {/* 8. Final CTA ("Make every check-in count.") */}
        <LandingCTA />
      </main>

      {/* 9. Footer */}
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
