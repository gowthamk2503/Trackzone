import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  ArrowRight,
  ArrowLeft,
  Building,
  Briefcase,
  Eye,
  EyeOff,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AuthVisualPanel } from '../../components/auth/AuthVisualPanel';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    department: 'Engineering',
    designation: 'Software Developer',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    const res = await register(formData);
    setIsLoading(false);

    if (res.success) {
      navigate('/dashboard');
    } else {
      setErrorMsg(res.message || 'Registration failed. Please review your details.');
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
        {/* LEFT COLUMN: Visual Panel (Branding & Live Terminal Illustration) */}
        <div className="lg:col-span-6 xl:col-span-7 flex">
          <AuthVisualPanel
            headline={`Build a workplace\nyou can trust.`}
            subtitle="Connect people, presence, and secure attendance in one intelligent platform."
            variant="register"
            badges={[
              '✓ GPS Verified',
              '✓ Biometric Ready',
              '✓ Secure Attendance',
              '✓ Real-time Presence',
            ]}
          />
        </div>

        {/* RIGHT COLUMN: Premium Signup Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center"
        >
          <div className="w-full max-w-lg mx-auto bg-white/95 backdrop-blur-2xl rounded-[32px] p-8 sm:p-10 border border-slate-200/90 shadow-2xl shadow-slate-900/[0.06] flex flex-col justify-between">
            <div>
              {/* Back to Home Link */}
              <div className="flex items-center justify-between mb-6">
                <Link
                  to="/"
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-500 hover:text-[#7967DE] transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to TrackZone</span>
                </Link>
                <div className="flex items-center gap-1.5 text-[11px] font-mono font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Employee Enrollment</span>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="mb-6">
                <h2 className="text-3xl font-bold tracking-tight text-slate-950 font-sans">
                  Create your account
                </h2>
                <p className="mt-2 text-sm text-slate-600 font-normal leading-relaxed">
                  Start building secure, verified attendance.
                </p>
              </div>

              {/* Signup Form */}
              <form onSubmit={handleRegister} className="space-y-3.5">
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

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="E.g. Elena Rostova"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 font-medium placeholder-slate-400 focus:bg-white focus:border-[#7967DE] focus:ring-4 focus:ring-[#7967DE]/10 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Corporate Email */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Corporate Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="elena.rostova@trackzone.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 font-medium placeholder-slate-400 focus:bg-white focus:border-[#7967DE] focus:ring-4 focus:ring-[#7967DE]/10 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Department & Designation Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Department
                    </label>
                    <div className="relative">
                      <select
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium focus:bg-white focus:border-[#7967DE] focus:ring-4 focus:ring-[#7967DE]/10 outline-none transition-all"
                      >
                        <option value="Engineering">Engineering</option>
                        <option value="Product & Design">Product & Design</option>
                        <option value="Infrastructure & DevOps">DevOps</option>
                        <option value="Human Resources">HR</option>
                        <option value="Marketing & Sales">Marketing</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Designation
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="Frontend Engineer"
                        value={formData.designation}
                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium placeholder-slate-400 focus:bg-white focus:border-[#7967DE] focus:ring-4 focus:ring-[#7967DE]/10 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="+1 (555) 019-2834"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 font-medium placeholder-slate-400 focus:bg-white focus:border-[#7967DE] focus:ring-4 focus:ring-[#7967DE]/10 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 font-medium placeholder-slate-400 focus:bg-white focus:border-[#7967DE] focus:ring-4 focus:ring-[#7967DE]/10 outline-none transition-all"
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
                  className="w-full mt-3 py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#7967DE] via-[#8E7DEE] to-[#9181F4] hover:from-[#6B57D8] hover:to-[#7967DE] shadow-xl shadow-[#7967DE]/25 hover:shadow-2xl hover:shadow-[#7967DE]/35 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isLoading ? (
                    <span>Enrolling Profile...</span>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Footer Prompt */}
            <div className="mt-6 text-center pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-600 font-medium">
                Already registered?{' '}
                <Link
                  to="/login"
                  className="text-[#7967DE] font-bold hover:underline"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
