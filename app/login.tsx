import { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { useBiometricAuth } from '@/hooks/useBiometricAuth';
import { useAuthStore } from '@/store/authStore';

export default function LoginScreen() {
  const { isSupported, isEnrolled, isAuthenticating, authenticate } = useBiometricAuth();
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isAvailable = isSupported && isEnrolled;
  const isDisabled = !isAvailable || isAuthenticating;

  const unavailableMessage = !isSupported
    ? 'Biometric authentication is not available on this device'
    : !isEnrolled
      ? 'No biometrics enrolled. Please set up Face ID or fingerprint in device settings'
      : null;

  const handleLogin = async () => {
    setErrorMessage(null);
    const result = await authenticate();
    if (result.success) {
      setAuthenticated(true);
      router.replace('/');
    } else {
      setErrorMessage(result.reason ?? 'Authentication failed. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Branding section */}
      <View style={styles.hero}>
        <View style={styles.logoRing}>
          <Text style={styles.logoEmoji}>🏦</Text>
        </View>
        <Text style={styles.appName}>ReactBank</Text>
        <Text style={styles.tagline}>Banking Made Simple</Text>
      </View>

      {/* Authentication section */}
      <View style={styles.card}>
        <MaterialCommunityIcons
          name="fingerprint"
          size={80}
          color={isAvailable ? '#1a3c6e' : '#9CA3AF'}
          style={styles.fingerprintIcon}
        />

        <Text style={styles.welcomeTitle}>Welcome Back</Text>

        <Text style={styles.instruction}>
          {unavailableMessage ?? 'Use biometrics to securely access your account'}
        </Text>

        <TouchableOpacity
          style={[styles.button, isDisabled && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={isDisabled}
          activeOpacity={0.85}
        >
          {isAuthenticating ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.buttonText}>Login with Biometrics</Text>
          )}
        </TouchableOpacity>

        {errorMessage !== null && (
          <View style={styles.errorRow}>
            <MaterialCommunityIcons name="alert-circle-outline" size={15} color="#DC2626" />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a3c6e',
  },

  // ── Hero (top, deep-blue) ──────────────────────────────────────────────────
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 48,
    paddingBottom: 32,
  },
  logoRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoEmoji: {
    fontSize: 40,
  },
  appName: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  tagline: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.65)',
    letterSpacing: 0.3,
  },

  // ── Card (bottom, white) ───────────────────────────────────────────────────
  card: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 32,
    paddingBottom: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  fingerprintIcon: {
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 8,
  },
  instruction: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
    paddingHorizontal: 8,
  },

  // ── Button ─────────────────────────────────────────────────────────────────
  button: {
    width: '100%',
    height: 52,
    backgroundColor: '#1a3c6e',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1a3c6e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // ── Error ──────────────────────────────────────────────────────────────────
  errorRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 16,
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: '100%',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: '#DC2626',
    lineHeight: 18,
  },
});
