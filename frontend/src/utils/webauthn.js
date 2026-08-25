/**
 * WebAuthn Passkey Registration & Biometric Authentication Engine
 * Powered by @simplewebauthn/browser (W3C WebAuthn Level 3 & FIDO2)
 */
import { startRegistration, startAuthentication } from '@simplewebauthn/browser';
import { webauthnService } from '../services/api.js';

/**
 * Check if the current browser environment supports WebAuthn / Passkeys
 */
export const isWebAuthnAvailable = async () => {
  if (
    typeof window !== 'undefined' &&
    window.PublicKeyCredential &&
    typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function'
  ) {
    try {
      return await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    } catch {
      return !!window.PublicKeyCredential;
    }
  }
  return typeof window !== 'undefined' && !!window.PublicKeyCredential;
};

/**
 * 1. Register a new WebAuthn Passkey (TouchID, Windows Hello, Security Key, or Phone QR)
 */
export const registerPasskey = async () => {
  try {
    // 1. Fetch challenge and registration options from backend
    const optionsRes = await webauthnService.getRegistrationOptions();
    if (!optionsRes.data.success || !optionsRes.data.options) {
      throw new Error(optionsRes.data.message || 'Failed to obtain registration options from server');
    }

    // 2. Open browser / device passkey creation dialog
    const registrationResponse = await startRegistration(optionsRes.data.options);

    // 3. Send raw cryptographic registration credential to backend for validation & storage
    const verifyRes = await webauthnService.verifyRegistration(registrationResponse);

    if (verifyRes.data.success && verifyRes.data.verified) {
      return {
        success: true,
        credentialId: verifyRes.data.credentialId,
        message: verifyRes.data.message || 'Passkey registered successfully',
      };
    }

    return {
      success: false,
      error: verifyRes.data.message || 'Passkey verification failed on server',
    };
  } catch (err) {
    console.error('Passkey registration error:', err);
    let errorMessage = err.message || 'Passkey registration cancelled or failed';
    if (err.name === 'NotAllowedError') {
      errorMessage = 'Passkey registration was cancelled or timed out.';
    } else if (err.name === 'InvalidStateError') {
      errorMessage = 'This hardware authenticator or passkey is already registered.';
    }
    return {
      success: false,
      error: errorMessage,
    };
  }
};

/**
 * 2. Authenticate using an existing registered Passkey
 */
export const authenticateWithPasskey = async () => {
  try {
    // 1. Fetch challenge & allowed credentials from backend
    let optionsRes;
    try {
      optionsRes = await webauthnService.getAuthenticationOptions();
    } catch (apiErr) {
      if (apiErr.response?.data?.code === 'NO_PASSKEY_REGISTERED') {
        return {
          success: false,
          method: 'webauthn',
          code: 'NO_PASSKEY_REGISTERED',
          error: 'No TrackZone passkey is registered. Please register your passkey in Profile first.',
        };
      }
      throw apiErr;
    }

    if (!optionsRes.data.success || !optionsRes.data.options) {
      throw new Error(optionsRes.data.message || 'Failed to obtain authentication options');
    }

    // 2. Prompt user with native Passkey dialog (Fingerprint / Face / PIN / Phone QR)
    const assertionResponse = await startAuthentication(optionsRes.data.options);

    // 3. Return the complete signed assertion payload for backend verification during checkin
    return {
      success: true,
      method: 'webauthn',
      assertionResponse,
      credentialId: assertionResponse.id,
    };
  } catch (err) {
    console.error('Passkey authentication error:', err);
    let errorMessage = err.message || 'Biometric authentication failed';
    if (err.name === 'NotAllowedError') {
      errorMessage = 'Passkey authentication prompt was cancelled or timed out.';
    }
    return {
      success: false,
      method: 'webauthn',
      error: errorMessage,
    };
  }
};

/**
 * Universal Biometric Verification (Real WebAuthn with isolated dev fallback)
 */
export const verifyBiometrics = async (userId, userName) => {
  // Always attempt real WebAuthn authentication
  const result = await authenticateWithPasskey();

  if (result.success) {
    return result;
  }

  // If user has not registered passkey yet, return specific failure
  if (result.code === 'NO_PASSKEY_REGISTERED') {
    return result;
  }

  // If real WebAuthn failed, report error
  return result;
};
