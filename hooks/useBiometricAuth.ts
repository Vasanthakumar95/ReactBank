import { useState, useEffect, useCallback } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';

export interface BiometricAuthResult {
  success: boolean;
  reason?: string;
}

interface UseBiometricAuthReturn {
  isSupported: boolean;
  isEnrolled: boolean;
  isAuthenticating: boolean;
  authenticate: () => Promise<BiometricAuthResult>;
}

export function useBiometricAuth(): UseBiometricAuthReturn {
  const [isSupported, setIsSupported] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    async function checkBiometrics() {
      const hardware = await LocalAuthentication.hasHardwareAsync();
      const enrolled = hardware && await LocalAuthentication.isEnrolledAsync();
      setIsSupported(hardware);
      setIsEnrolled(!!enrolled);
    }
    checkBiometrics();
  }, []);

  const authenticate = useCallback(async (): Promise<BiometricAuthResult> => {
    if (!isSupported) {
      return { success: false, reason: 'Biometric hardware is not available on this device' };
    }
    if (!isEnrolled) {
      return { success: false, reason: 'No biometrics enrolled. Please set up Face ID or fingerprint in device settings' };
    }

    setIsAuthenticating(true);
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access ReactBank',
        fallbackLabel: 'Use Passcode',
        cancelLabel: 'Cancel',
      });

      if (result.success) {
        return { success: true };
      }

      const reason = result.error === 'user_cancel'
        ? 'Authentication was cancelled'
        : result.error === 'user_fallback'
          ? 'Passcode fallback selected'
          : result.error === 'lockout' || result.error === 'lockout_permanent'
            ? 'Biometrics locked out due to too many failed attempts'
            : result.error === 'not_enrolled'
              ? 'No biometrics enrolled on this device'
              : `Authentication failed: ${result.error}`;

      return { success: false, reason };
    } finally {
      setIsAuthenticating(false);
    }
  }, [isSupported, isEnrolled]);

  return { isSupported, isEnrolled, isAuthenticating, authenticate };
}
