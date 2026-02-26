import { useEffect } from 'react';
import { ActivityIndicator, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format, parseISO } from 'date-fns';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useTransactionStore } from '@/store/transactionStore';
import { formatCurrency, formatDate } from '@/utils/formatters';

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { transactions, isLoading, fetchTransactions } = useTransactionStore();

  // Support deep-linking: fetch if the store hasn't loaded yet
  useEffect(() => {
    if (transactions.length === 0) {
      fetchTransactions();
    }
  }, []);

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

  const { value, isNegative } = formatCurrency(transaction.amount);

  const handleShare = async () => {
    const dateOnly = format(parseISO(transaction.transferDate), 'd MMM yyyy');
    await Share.share({
      message: [
        'Transaction Receipt',
        `Ref: ${transaction.refId}`,
        `Date: ${dateOnly}`,
        `Recipient: ${transaction.recipientName}`,
        `Amount: ${value}`,
      ].join('\n'),
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={handleShare} hitSlop={8}>
              <Ionicons name="share-outline" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          ),
        }}
      />

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
            {value}
          </Text>
        </View>

        {/* Detail rows card */}
        <View style={styles.detailCard}>
          <DetailRow label="Reference ID" value={transaction.refId} />
          <DetailRow label="Transfer Date" value={formatDate(transaction.transferDate)} />
          <DetailRow label="Recipient Name" value={transaction.recipientName} />
          <DetailRow label="Transfer Name" value={transaction.transferName} last />
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
});
