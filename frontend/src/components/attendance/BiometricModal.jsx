import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Fingerprint, CheckCircle2, AlertTriangle, ShieldCheck, Lock, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { authenticateWithPasskey } from '../../utils/webauthn';
import { Button } from '../common/Button';

export const BiometricModal = ({
  isOpen,
  onClose,
  onSuccess,
  actionType,
  userName,
}) => {
  const [step, setStep] = useState('idle');
  const [statusMessage, setStatusMessage] = useState('Ready for biometric verification');

  useEffect(() => {
    if (isOpen) {
      setStep('scanning');
      setStatusMessage('Requesting WebAuthn Passkey Authenticator...');
      executeBiometricScan();
    } else {
      setStep('idle');
    }
  }, [isOpen]);

  const executeBiometricScan = async () => {
    try {
      setStep('scanning');
      setStatusMessage('Waiting for Passkey authorization (Fingerprint / Face / PIN / Phone QR)...');

      const result = await authenticateWithPasskey();

      if (result.success) {
        setStatusMessage('Passkey signature verified successfully!');
        setStep('success');

        // Confetti burst
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });

        setTimeout(() => {
          onSuccess({
            verified: true,
            method: result.method,
            assertionResponse: result.assertionResponse,
          });
          onClose();
        }, 1100);
      } else {
        setStep('failed');
        if (result.code === 'NO_PASSKEY_REGISTERED') {
          setStatusMessage('No TrackZone passkey is registered. Please register your passkey in Profile first.');
        } else {
          setStatusMessage(result.error || 'Biometric authentication failed');
        }
      }
    } catch (err) {
      setStep('failed');
      setStatusMessage(err.message || 'Authentication error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/75 backdrop-blur-md"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative z-10 w-full max-w-sm rounded-3xl bg-gray-900 border border-gray-800 p-6 text-center shadow-2xl text-white overflow-hidden"
      >
        {/* Glowing Background Ring */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Title */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <ShieldCheck className="w-5 h-5 text-indigo-400" />
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
            Biometric Security Gateway
          </span>
        </div>

        <h3 className="text-xl font-black text-white">
          {actionType === 'checkIn' ? 'Check-In Passkey Verification' : 'Check-Out Passkey Verification'}
        </h3>
        <p className="text-xs text-gray-400 mt-1">
          Authenticating with WebAuthn Passkey for {userName}
        </p>

        {/* Fingerprint Scanner Interactive Graphic */}
        <div className="my-8 flex justify-center items-center relative">
          {/* Pulsing Radar Ring */}
          {step === 'scanning' && (
            <>
              <div className="absolute w-36 h-36 rounded-full border border-indigo-500/30 radar-ring pointer-events-none" />
              <div className="absolute w-44 h-44 rounded-full border border-indigo-500/20 radar-ring pointer-events-none delay-300" />
            </>
          )}

          <div
            className={`relative w-28 h-28 rounded-2xl flex items-center justify-center transition-all duration-300 ${
              step === 'success'
                ? 'bg-emerald-500/20 border-2 border-emerald-500 shadow-lg shadow-emerald-500/30'
                : step === 'failed'
                ? 'bg-rose-500/20 border-2 border-rose-500 shadow-lg shadow-rose-500/30'
                : 'bg-indigo-950/60 border-2 border-indigo-500/60 shadow-lg shadow-indigo-500/20'
            }`}
          >
            {step === 'success' ? (
              <CheckCircle2 className="w-14 h-14 text-emerald-400 animate-bounce" />
            ) : step === 'failed' ? (
              <AlertTriangle className="w-14 h-14 text-rose-400" />
            ) : (
              <div className="relative">
                <Fingerprint className="w-14 h-14 text-indigo-400 animate-pulse" />
                {/* Vertical Laser Scan Beam */}
                <motion.div
                  animate={{ y: [-24, 24, -24] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_8px_#38bdf8]"
                />
              </div>
            )}
          </div>
        </div>

        {/* Status Text & Progress Bar */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-300 leading-relaxed px-2">{statusMessage}</p>

          {step === 'scanning' && (
            <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full"
                animate={{ width: ['10%', '60%', '95%'] }}
                transition={{ duration: 1.6, ease: 'easeInOut' }}
              />
            </div>
          )}
        </div>

        {/* Retry button on failed */}
        {step === 'failed' && (
          <div className="mt-4">
            <Button
              size="sm"
              variant="outline"
              onClick={executeBiometricScan}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              className="text-xs"
            >
              Try Passkey Again
            </Button>
          </div>
        )}

        {/* Action Controls */}
        <div className="mt-6 pt-4 border-t border-gray-800/80 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[10px] text-gray-400">
            <Lock className="w-3 h-3 text-indigo-400" />
            FIDO2 / WebAuthn Hardware Protected
          </span>
          <button
            onClick={onClose}
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
};
