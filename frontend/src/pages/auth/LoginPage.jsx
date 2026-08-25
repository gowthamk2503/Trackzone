import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Fingerprint,
  Lock,
  Mail,
  Shield,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ArrowLeft,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { AuthVisualPanel } from '../../components/auth/AuthVisualPanel';

export const LoginPage = () => {
  const [email, setEmail] = useState('sarah.chen@trackzone.com');
  const [password, setPassword] = useState('Employee@123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login, quickDemoLogin } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    const res = await login(email, password);
    setIsLoading(false);

    if (res.success) {
      navigate('/dashboard');
    } else {
      setErrorMsg(res.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleQuickLogin = async (role) => {
    setIsLoading(true);
    await quickDemoLogin(role);
    setIsLoading(false);
    navigate(role === 'admin' ? '/admin' : '/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-slate-900 flex flex-col justify-center p-4 sm:p-6 lg:p-8 relative selection:bg-[#CDC1FF] selection:text-[#1E164D]">
      {/* Background Soft Gradients */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-1/4 w-[600px] h-[500px] bg-gradient-to-b from-[#E5D9F2]/60 via-[#F5EFFF]/40 to-transparent blur-[140px]" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[#CDC1FF]/25 rounded-full blur-[130px]" />
      </div>

      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch min-h-[85vh]">
        {/* LEFT COLUMN: Visual Panel (Branding & Live Terminal Illustration) */}
        <div className="lg:col-span-6 xl:col-span-7 flex">
          <AuthVisualPanel
            headline={`Attendance.\nVerified by Presence.`}
            subtitle="Track employee presence with secure location verification and biometric authentication."
            variant="login"
            badges={[
              '✓ GPS Location Verified',
              '✓ WebAuthn Hardware Match',
              '✓ Real-time Geofence Radar',
              '✓ Zero Buddy Punching',
            ]}
          />
        </div>

        {/* RIGHT COLUMN: Premium Authentication Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center"
        >
          <div className="w-full max-w-lg mx-auto bg-white/95 backdrop-blur-2xl rounded-[32px] p-8 sm:p-10 border border-slate-200/90 shadow-2xl shadow-slate-900/[0.06] flex flex-col justify-between">
            <div>
              {/* Back to Home Link */}
              <div className="flex items-center justify-between mb-8">
                <Link
                  to="/"
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-500 hover:text-[#7967DE] transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to TrackZone</span>
                </Link>
                <div className="flex items-center gap-1.5 text-[11px] font-mono font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Secure Gateway</span>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="mb-6">
                <h2 className="text-3xl font-bold tracking-tight text-slate-950 font-sans">
                  Welcome back
                </h2>
                <p className="mt-2 text-sm text-slate-600 font-normal leading-relaxed">
                  Sign in to continue to your TrackZone workspace.
                </p>
              </div>

              {/* Instant 1-Click Demo Logins */}
              <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-[#F5EFFF] to-[#E5D9F2]/50 border border-[#CDC1FF]">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#614FC4]">
                    <Sparkles className="w-3.5 h-3.5 text-[#7967DE]" />
                    <span>Instant 1-Click Demo Logins</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#7967DE] font-semibold">PRE-FILLED</span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('employee')}
                    className="px-3 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-[#CDC1FF] text-xs font-bold text-slate-800 shadow-sm flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    <Fingerprint className="w-4 h-4 text-[#7967DE]" />
                    <span>Employee Demo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('admin')}
                    className="px-3 py-2.5 rounded-xl bg-gradient-to-r from-[#7967DE] to-[#8E7DEE] hover:from-[#6B57D8] hover:to-[#7967DE] text-xs font-bold text-white shadow-md shadow-[#7967DE]/20 flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Admin Demo</span>
                  </button>
                </div>
              </div>

              {/* Main Login Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                {errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start gap-2"
                  >
                    <div className="w-4 h-4 rounded-full bg-rose-200 text-rose-700 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">!</div>
                    <span>{errorMsg}</span>
                  </motion.div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Corporate Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 font-medium placeholder-slate-400 focus:bg-white focus:border-[#7967DE] focus:ring-4 focus:ring-[#7967DE]/10 outline-none transition-all"
                      placeholder="employee@trackzone.com"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-xs text-[#7967DE] hover:text-[#614FC4] font-semibold hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 font-medium placeholder-slate-400 focus:bg-white focus:border-[#7967DE] focus:ring-4 focus:ring-[#7967DE]/10 outline-none transition-all"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#7967DE] via-[#8E7DEE] to-[#9181F4] hover:from-[#6B57D8] hover:to-[#7967DE] shadow-xl shadow-[#7967DE]/25 hover:shadow-2xl hover:shadow-[#7967DE]/35 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isLoading ? (
                    <span>Authenticating...</span>
                  ) : (
                    <>
                      <span>Sign In to TrackZone</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Security Bullet Points */}
              <div className="mt-6 pt-5 border-t border-slate-100 space-y-2 text-xs font-mono text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Haversine GPS Precision Perimeter Verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>WebAuthn FIDO2 Biometric Hardware Match</span>
                </div>
              </div>
            </div>

            {/* Footer Prompt */}
            <div className="mt-8 text-center pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-600 font-medium">
                New employee?{' '}
                <Link
                  to="/register"
                  className="text-[#7967DE] font-bold hover:underline"
                >
                  Create your account
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
