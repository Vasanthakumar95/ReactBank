import { forwardRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ViewShot from 'react-native-view-shot';
import { format } from 'date-fns';

import { Transaction } from '@/types/transaction';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { BASE_CURRENCY, CurrencyCode } from '@/constants/currencies';
import { getConvertedAmount } from '@/store/currencyStore';

interface TransactionReceiptProps {
  transaction: Transaction;
  currencyCode?: CurrencyCode;
  exchangeRates?: Record<string, number> | null;
}

const TransactionReceipt = forwardRef<ViewShot, TransactionReceiptProps>(
  ({ transaction, currencyCode = BASE_CURRENCY, exchangeRates = null }, ref) => {
    const convertedAmount = getConvertedAmount(transaction.amount, exchangeRates, currencyCode);
    const { display, isNegative } = formatCurrency(convertedAmount, currencyCode);
    const { display: originalDisplay } = formatCurrency(transaction.amount, BASE_CURRENCY, { showSign: false });
    const generatedAt = format(new Date(), 'd MMM yyyy, hh:mm a');

    return (
      <ViewShot ref={ref} style={styles.root}>
        {/* Header banner */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <Text style={styles.logoEmoji}>🏦</Text>
            <Text style={styles.brandName}>ReactBank</Text>
          </View>
          <Text style={styles.receiptTitle}>Transaction Receipt</Text>
        </View>

        {/* Amount spotlight */}
        <View style={styles.amountSection}>
          <Text style={styles.amountLabel}>Amount ({currencyCode})</Text>
          <Text style={[styles.amount, isNegative ? styles.negative : styles.positive]}>
            {display}
          </Text>
          {currencyCode !== BASE_CURRENCY && (
            <Text style={styles.originalAmountLabel}>≈ Original: {originalDisplay}</Text>
          )}
          <View style={[styles.typeBadge, isNegative ? styles.typeBadgeDebit : styles.typeBadgeCredit]}>
            <Text style={[styles.typeBadgeText, isNegative ? styles.typeBadgeTextDebit : styles.typeBadgeTextCredit]}>
              {isNegative ? 'OUTGOING' : 'INCOMING'}
            </Text>
          </View>
        </View>

        {/* Perforated divider */}
        <View style={styles.dividerRow}>
          <View style={styles.halfCircleLeft} />
          <View style={styles.dottedLine} />
          <View style={styles.halfCircleRight} />
        </View>

        {/* Detail rows */}
        <View style={styles.details}>
          <ReceiptRow label="Reference ID" value={transaction.refId} />
          <ReceiptRow label="Date" value={formatDate(transaction.transferDate)} />
          <ReceiptRow label="Recipient Name" value={transaction.recipientName} />
          <ReceiptRow label="Transfer Type" value={transaction.transferName} last />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerDivider} />
          <Text style={styles.footerTimestamp}>Generated on {generatedAt}</Text>
          <Text style={styles.footerWatermark}>Powered by ReactBank</Text>
        </View>
      </ViewShot>
    );
  }
);

TransactionReceipt.displayName = 'TransactionReceipt';

export default TransactionReceipt;

function ReceiptRow({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.row, !last && styles.rowDivider]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue} numberOfLines={2}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },

  // Header banner
  header: {
    backgroundColor: '#1a3c6e',
    paddingTop: 24,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  logoEmoji: {
    fontSize: 22,
  },
  brandName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  receiptTitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.65)',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },

  // Amount spotlight
  amountSection: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: '#FAFBFF',
  },
  amountLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  amount: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 4,
  },
  originalAmountLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  positive: {
    color: '#16A34A',
  },
  negative: {
    color: '#DC2626',
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  typeBadgeCredit: {
    backgroundColor: '#DCFCE7',
  },
  typeBadgeDebit: {
    backgroundColor: '#FEE2E2',
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  typeBadgeTextCredit: {
    color: '#16A34A',
  },
  typeBadgeTextDebit: {
    color: '#DC2626',
  },

  // Perforated divider
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  halfCircleLeft: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#F5F7FA',
    marginLeft: -8,
  },
  dottedLine: {
    flex: 1,
    borderTopWidth: 1.5,
    borderTopColor: '#E5E7EB',
    borderStyle: 'dashed',
    marginHorizontal: 4,
  },
  halfCircleRight: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#F5F7FA',
    marginRight: -8,
  },

  // Detail rows
  details: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  rowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F3F4F6',
  },
  rowLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    flex: 1,
    marginRight: 8,
  },
  rowValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A2E',
    flex: 1.5,
    textAlign: 'right',
  },

  // Footer
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  footerDivider: {
    width: '100%',
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E5E7EB',
    marginBottom: 12,
  },
  footerTimestamp: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  footerWatermark: {
    fontSize: 11,
    fontWeight: '600',
    color: '#C7D2FE',
    letterSpacing: 0.3,
  },
});
