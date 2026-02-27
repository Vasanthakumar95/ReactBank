import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import ViewShot from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';

import { useTransactionStore } from '@/store/transactionStore';
import { useAuthStore } from '@/store/authStore';
import { useCurrencyStore, getConvertedAmount } from '@/store/currencyStore';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { BASE_CURRENCY } from '@/constants/currencies';
import TransactionReceipt from '@/components/TransactionReceipt';

type Feedback = { text: string; isError: boolean } | null;

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { transactions, isLoading, fetchTransactions } = useTransactionStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { selectedCurrency, exchangeRates } = useCurrencyStore();

  const viewShotRef = useRef<ViewShot>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated]);

  // Support deep-linking: fetch if the store hasn't loaded yet
  useEffect(() => {
    if (transactions.length === 0) {
      fetchTransactions();
    }
  }, []);

  const showFeedback = useCallback((text: string, isError: boolean) => {
    setFeedback({ text, isError });
    setTimeout(() => setFeedback(null), 3000);
  }, []);

  const captureReceipt = useCallback(async (): Promise<string | null> => {
    const uri = await viewShotRef.current?.capture?.();
    return uri ?? null;
  }, []);

  const handleSaveToPhotos = useCallback(async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        showFeedback('Permission denied. Please allow photo access in Settings.', true);
        return;
      }
      const uri = await captureReceipt();
      if (!uri) return;
      await MediaLibrary.saveToLibraryAsync(uri);
      showFeedback('Receipt saved to Photos!', false);
    } catch {
      showFeedback('Failed to save receipt. Please try again.', true);
    } finally {
      setIsSaving(false);
    }
  }, [isSaving, captureReceipt, showFeedback]);

  const handleShareReceipt = useCallback(async () => {
    if (isSharing) return;
    setIsSharing(true);
    try {
      const uri = await captureReceipt();
      if (!uri) return;
      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: 'Share Transaction Receipt',
      });
    } catch {
      showFeedback('Failed to share receipt. Please try again.', true);
    } finally {
      setIsSharing(false);
    }
  }, [isSharing, captureReceipt, showFeedback]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      </SafeAreaView>
    );
  }

  const transaction = transactions.find((t) => t.refId === id);

  if (!transaction) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
        <View style={styles.centered}>
          <Text style={styles.notFoundText}>Transaction not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const convertedAmount = getConvertedAmount(transaction.amount, exchangeRates, selectedCurrency);
  const { display, isNegative } = formatCurrency(convertedAmount, selectedCurrency);
  const { display: originalDisplay } = formatCurrency(transaction.amount, BASE_CURRENCY, { showSign: false });

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      {/* Off-screen receipt rendered for capture only */}
      <View style={styles.offScreen}>
        <TransactionReceipt ref={viewShotRef} transaction={transaction} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Summary card */}
        <View style={styles.summaryCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {transaction.recipientName.charAt(0).toUpperCase()}
            </Text>
          </View>

          <Text style={styles.transferName}>{transaction.transferName}</Text>

          <View style={[styles.badge, isNegative ? styles.badgeOutgoing : styles.badgeIncoming]}>
            <Text style={[styles.badgeText, isNegative ? styles.badgeTextOutgoing : styles.badgeTextIncoming]}>
              {isNegative ? 'OUTGOING' : 'INCOMING'}
            </Text>
          </View>

          <Text style={[styles.amount, isNegative ? styles.negative : styles.positive]}>
            {display}
          </Text>
          {selectedCurrency !== BASE_CURRENCY && (
            <Text style={styles.originalAmount}>Original: {originalDisplay}</Text>
          )}
        </View>

        {/* Detail rows card */}
        <View style={styles.detailCard}>
          <DetailRow label="Reference ID" value={transaction.refId} />
          <DetailRow label="Transfer Date" value={formatDate(transaction.transferDate)} />
          <DetailRow label="Recipient Name" value={transaction.recipientName} />
          <DetailRow label="Transfer Name" value={transaction.transferName} last />
        </View>

        {/* Action buttons */}
        <View style={styles.actions}>
          {feedback !== null && (
            <View style={[styles.feedbackRow, feedback.isError ? styles.feedbackError : styles.feedbackSuccess]}>
              <Text style={[styles.feedbackText, feedback.isError ? styles.feedbackTextError : styles.feedbackTextSuccess]}>
                {feedback.text}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary, (isSaving || isSharing) && styles.buttonDisabled]}
            onPress={handleSaveToPhotos}
            disabled={isSaving || isSharing}
            activeOpacity={0.85}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonTextPrimary}>Save to Photos</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary, (isSaving || isSharing) && styles.buttonSecondaryDisabled]}
            onPress={handleShareReceipt}
            disabled={isSaving || isSharing}
            activeOpacity={0.85}
          >
            {isSharing ? (
              <ActivityIndicator size="small" color="#1a3c6e" />
            ) : (
              <Text style={[styles.buttonTextSecondary, (isSaving || isSharing) && styles.buttonTextSecondaryDisabled]}>
                Share Receipt
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailRow({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.row, !last && styles.rowDivider]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    fontSize: 16,
    color: '#6B7280',
  },

  // Off-screen receipt for ViewShot capture
  offScreen: {
    position: 'absolute',
    left: -9999,
    top: -9999,
  },

  content: {
    padding: 20,
    gap: 16,
  },

  // Summary card
  summaryCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 28,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#4F46E5',
  },
  transferName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 10,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 16,
  },
  badgeIncoming: {
    backgroundColor: '#DCFCE7',
  },
  badgeOutgoing: {
    backgroundColor: '#FEE2E2',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  badgeTextIncoming: {
    color: '#16A34A',
  },
  badgeTextOutgoing: {
    color: '#DC2626',
  },
  amount: {
    fontSize: 34,
    fontWeight: '800',
  },
  originalAmount: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  positive: {
    color: '#16A34A',
  },
  negative: {
    color: '#DC2626',
  },

  // Detail card
  detailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  rowLabel: {
    fontSize: 13,
    color: '#6B7280',
    flex: 1,
  },
  rowValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A2E',
    flex: 1,
    textAlign: 'right',
  },

  // Action buttons
  actions: {
    gap: 10,
  },
  feedbackRow: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
  },
  feedbackSuccess: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  feedbackError: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  feedbackText: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  feedbackTextSuccess: {
    color: '#16A34A',
  },
  feedbackTextError: {
    color: '#DC2626',
  },
  button: {
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#1a3c6e',
    shadowColor: '#1a3c6e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonSecondary: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#1a3c6e',
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonSecondaryDisabled: {
    borderColor: '#D1D5DB',
  },
  buttonTextPrimary: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  buttonTextSecondary: {
    color: '#1a3c6e',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  buttonTextSecondaryDisabled: {
    color: '#9CA3AF',
  },
});
