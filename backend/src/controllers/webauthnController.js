import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';
import { User } from '../models/User.js';
import { logAudit } from '../utils/audit.js';

const getRPName = () => process.env.WEBAUTHN_RP_NAME || 'TrackZone';

const getRPID = (req) => {
  if (req?.headers?.origin) {
    try {
      const url = new URL(req.headers.origin);
      return url.hostname;
    } catch {}
  }
  return process.env.WEBAUTHN_RP_ID || 'localhost';
};

const getOrigin = (req) => {
  if (req?.headers?.origin) {
    return req.headers.origin;
  }
  return process.env.WEBAUTHN_ORIGIN || 'http://localhost:5173';
};

/**
 * 1. Generate Registration Options (Server -> Client)
 */
export const getRegistrationOptions = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const rpName = getRPName();
    const rpID = getRPID(req);

    // Map existing credentials to prevent duplicate hardware key registration
    const excludeCredentials = (user.webauthnCredentials || []).map((cred) => ({
      id: cred.credentialID,
      transports: cred.transports,
    }));

    const options = await generateRegistrationOptions({
      rpName,
      rpID,
      userID: new Uint8Array(Buffer.from(user._id.toString())),
      userName: user.email,
      userDisplayName: user.name,
      attestationType: 'none',
      excludeCredentials,
      authenticatorSelection: {
        residentKey: 'preferred',
        userVerification: 'preferred',
      },
    });

    // Save temporary challenge on user
    user.currentChallenge = options.challenge;
    await user.save();

    res.json({
      success: true,
      options,
    });
  } catch (error) {
    console.error('Error generating registration options:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 2. Verify Registration Response (Client -> Server)
 */
export const verifyRegistration = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const expectedChallenge = user.currentChallenge;
    if (!expectedChallenge) {
      res.status(400).json({
        success: false,
        message: 'No active passkey registration challenge found. Please restart registration.',
      });
      return;
    }

    const rpID = getRPID(req);
    const origin = getOrigin(req);

    const verification = await verifyRegistrationResponse({
      response: req.body,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      requireUserVerification: false,
    });

    if (!verification.verified || !verification.registrationInfo) {
      res.status(400).json({
        success: false,
        message: 'Cryptographic passkey registration verification failed.',
      });
      return;
    }

    const { credentialID, credentialPublicKey, counter } = verification.registrationInfo;

    const newCredential = {
      credentialID,
      publicKey: Buffer.from(credentialPublicKey).toString('base64url'),
      counter,
      transports: req.body.response?.transports || ['internal', 'hybrid'],
      createdAt: new Date(),
    };

    user.webauthnCredentials = user.webauthnCredentials || [];
    user.webauthnCredentials.push(newCredential);
    user.biometricRegistered = true;
    user.biometricCredentialId = credentialID;
    user.currentChallenge = '';
    await user.save();

    await logAudit(
      'PASSKEY_REGISTERED',
      'AUTH',
      `User ${user.name} enrolled new WebAuthn passkey credential (ID: ${credentialID.substring(0, 16)}...)`,
      req,
      user._id,
      user.name,
      user.role
    );

    res.json({
      success: true,
      verified: true,
      message: 'Passkey registered successfully! Biometric authentication is now active.',
      credentialId: credentialID,
    });
  } catch (error) {
    console.error('Error verifying registration response:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * 3. Generate Authentication Options (Server -> Client)
 */
export const getAuthenticationOptions = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const rpID = getRPID(req);

    const allowCredentials = (user.webauthnCredentials || []).map((cred) => ({
      id: cred.credentialID,
      transports: cred.transports,
    }));

    if (allowCredentials.length === 0) {
      res.status(400).json({
        success: false,
        code: 'NO_PASSKEY_REGISTERED',
        message: 'No TrackZone passkey is registered. Please register your passkey in Profile first.',
      });
      return;
    }

    const options = await generateAuthenticationOptions({
      rpID,
      allowCredentials,
      userVerification: 'preferred',
    });

    user.currentChallenge = options.challenge;
    await user.save();

    res.json({
      success: true,
      options,
    });
  } catch (error) {
    console.error('Error generating authentication options:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 4. Helper to verify a WebAuthn Authentication assertion
 */
export const verifyWebAuthnAssertion = async (user, assertionResponse, req) => {
  try {
    if (!assertionResponse || !assertionResponse.id) {
      return { verified: false, error: 'Missing WebAuthn assertion payload' };
    }

    const expectedChallenge = user.currentChallenge;
    if (!expectedChallenge) {
      return { verified: false, error: 'No active authentication challenge found' };
    }

    // Find the matching registered credential
    const matchingCred = (user.webauthnCredentials || []).find(
      (c) => c.credentialID === assertionResponse.id
    );

    if (!matchingCred) {
      return {
        verified: false,
        error: 'Passkey credential not recognized for this user profile',
      };
    }

    const rpID = getRPID(req);
    const origin = getOrigin(req);

    const verification = await verifyAuthenticationResponse({
      response: assertionResponse,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      authenticator: {
        credentialID: matchingCred.credentialID,
        credentialPublicKey: new Uint8Array(Buffer.from(matchingCred.publicKey, 'base64url')),
        counter: matchingCred.counter,
        transports: matchingCred.transports,
      },
      requireUserVerification: false,
    });

    if (verification.verified && verification.authenticationInfo) {
      // Update counter and clear challenge
      matchingCred.counter = verification.authenticationInfo.newCounter;
      user.currentChallenge = '';
      await user.save();
      return { verified: true };
    }

    return { verified: false, error: 'WebAuthn assertion cryptographic verification failed' };
  } catch (err) {
    return { verified: false, error: err.message || 'Passkey verification failed' };
  }
};

/**
 * 5. Standalone WebAuthn Verification Endpoint
 */
export const verifyAuthentication = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const result = await verifyWebAuthnAssertion(user, req.body);
    if (result.verified) {
      res.json({
        success: true,
        verified: true,
        message: 'Passkey authenticated successfully',
      });
    } else {
      res.status(400).json({
        success: false,
        verified: false,
        message: result.error || 'Passkey authentication failed',
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
