import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, ArrowLeft, CheckCircle2, ArrowRight } from 'lucide-react';
import { authService } from '../../services/api';
import { AuthVisualPanel } from '../../components/auth/AuthVisualPanel';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.forgotPassword({ email });
      setSubmitted(true);
    } catch (err) {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-slate-900 flex flex-col justify-center p-4 sm:p-6 lg:p-8 relative selection:bg-[#CDC1FF] selection:text-[#1E164D]">
      {/* Background Soft Gradients */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-1/4 w-[600px] h-[500px] bg-gradient-to-b from-[#E5D9F2]/60 via-[#F5EFFF]/40 to-transparent blur-[140px]" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[#CDC1FF]/25 rounded-full blur-[130px]" />
      </div>

      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch min-h-[85vh]">
        {/* LEFT COLUMN: Visual Panel */}
        <div className="lg:col-span-6 xl:col-span-7 flex">
          <AuthVisualPanel
            headline={`Secure Access.\nRestored in Minutes.`}
            subtitle="Recover your corporate account credentials via cryptographic email verification token."
            variant="login"
            badges={[
              '✓ Encrypted Reset Token',
              '✓ 15-Minute Expiry Window',
              '✓ Audit-Logged Request',
              '✓ Anti-Tamper Security',
            ]}
          />
        </div>

        {/* RIGHT COLUMN: Reset Form Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center"
        >
          <div className="w-full max-w-lg mx-auto bg-white/95 backdrop-blur-2xl rounded-[32px] p-8 sm:p-10 border border-slate-200/90 shadow-2xl shadow-slate-900/[0.06]">
            {/* Back to Login Link */}
            <div className="flex items-center justify-between mb-8">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-500 hover:text-[#7967DE] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </Link>
              <div className="flex items-center gap-1.5 text-[11px] font-mono font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Account Recovery</span>
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight text-slate-950 font-sans">
                Reset password
              </h2>
              <p className="mt-2 text-sm text-slate-600 font-normal leading-relaxed">
                Enter your registered corporate email to receive recovery instructions.
              </p>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 space-y-4"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">
                  Recovery Link Dispatched
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
                  If <strong className="text-slate-900">{email}</strong> exists in the TrackZone directory, you will receive password reset instructions shortly.
                </p>
                <div className="pt-4">
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#7967DE] to-[#8E7DEE] shadow-md shadow-[#7967DE]/25 hover:shadow-lg transition-all"
                  >
                    <span>Return to Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Corporate Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="employee@trackzone.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 font-medium placeholder-slate-400 focus:bg-white focus:border-[#7967DE] focus:ring-4 focus:ring-[#7967DE]/10 outline-none transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#7967DE] via-[#8E7DEE] to-[#9181F4] hover:from-[#6B57D8] hover:to-[#7967DE] shadow-xl shadow-[#7967DE]/25 hover:shadow-2xl hover:shadow-[#7967DE]/35 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {loading ? <span>Sending Link...</span> : <span>Send Reset Instructions</span>}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
