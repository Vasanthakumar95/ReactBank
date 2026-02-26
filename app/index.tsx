import { useCallback, useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useTransactionStore } from '@/store/transactionStore';
import { useAuthStore } from '@/store/authStore';
import TransactionCard from '@/components/TransactionCard';
import { formatCurrency } from '@/utils/formatters';
import { Transaction } from '@/types/transaction';

function SummaryHeader({ transactions }: { transactions: Transaction[] }) {
  const total = transactions.reduce((sum, t) => sum + t.amount, 0);
  const { value, isNegative } = formatCurrency(total);

  return (
    <View style={summaryStyles.card}>
      <Text style={summaryStyles.label}>Total Balance</Text>
      <Text style={[summaryStyles.amount, isNegative ? summaryStyles.negative : summaryStyles.positive]}>
        {value}
      </Text>
      <Text style={summaryStyles.count}>{transactions.length} transaction{transactions.length !== 1 ? 's' : ''}</Text>
    </View>
  );
}

function EmptyState() {
  return (
    <View style={emptyStyles.container}>
      <Text style={emptyStyles.icon}>🏦</Text>
      <Text style={emptyStyles.title}>No Transactions</Text>
      <Text style={emptyStyles.subtitle}>Your transactions will appear here</Text>
    </View>
  );
}

export default function TransactionListScreen() {
  const { transactions, isLoading, fetchTransactions } = useTransactionStore();
  const { isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    router.replace('/login');
  }, [logout]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Loading transactions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={handleLogout} hitSlop={8}>
              <Ionicons name="log-out-outline" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          ),
        }}
      />
      <FlatList<Transaction>
        data={transactions}
        keyExtractor={(item) => item.refId}
        renderItem={({ item }: ListRenderItemInfo<Transaction>) => (
          <TransactionCard
            transaction={item}
            onPress={() =>
              router.push({ pathname: '/transaction/[id]', params: { id: item.refId } })
            }
          />
        )}
        ListHeaderComponent={<SummaryHeader transactions={transactions} />}
        ListEmptyComponent={<EmptyState />}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
  },
  list: {
    paddingBottom: 24,
  },
});

const summaryStyles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    paddingVertical: 20,
    paddingHorizontal: 20,
    shadowColor: '#1a3c6e',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#EEF2FF',
  },
  label: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 6,
    fontWeight: '500',
  },
  amount: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 6,
  },
  positive: {
    color: '#16A34A',
  },
  negative: {
    color: '#DC2626',
  },
  count: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});

const emptyStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 8,
  },
  icon: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
  },
});
