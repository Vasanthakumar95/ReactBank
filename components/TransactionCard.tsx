import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Transaction } from '@/types/transaction';
import { formatCurrency, formatDate } from '@/utils/formatters';

interface Props {
  transaction: Transaction;
  onPress: () => void;
}

export default function TransactionCard({ transaction, onPress }: Props) {
  const { value, isNegative } = formatCurrency(transaction.amount);
  const initial = transaction.recipientName.charAt(0).toUpperCase();

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initial}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.transferName} numberOfLines={1}>
          {transaction.transferName}
        </Text>
        <Text style={styles.recipientName} numberOfLines={1}>
          {transaction.recipientName}
        </Text>
      </View>

      <View style={styles.right}>
        <Text style={[styles.amount, isNegative ? styles.negative : styles.positive]}>
          {value}
        </Text>
        <Text style={styles.date}>{formatDate(transaction.transferDate)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4F46E5',
  },
  info: {
    flex: 1,
    marginRight: 12,
  },
  transferName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 3,
  },
  recipientName: {
    fontSize: 13,
    color: '#6B7280',
  },
  right: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 3,
  },
  positive: {
    color: '#16A34A',
  },
  negative: {
    color: '#DC2626',
  },
  date: {
    fontSize: 11,
    color: '#9CA3AF',
  },
});
