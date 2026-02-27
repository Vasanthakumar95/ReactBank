import { useCallback, useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItemInfo,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { format } from 'date-fns';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useTransactionStore } from '@/store/transactionStore';
import { useAuthStore } from '@/store/authStore';
import { useCurrencyStore, getConvertedAmount } from '@/store/currencyStore';
import TransactionCard from '@/components/TransactionCard';
import CurrencySelector from '@/components/CurrencySelector';
import { formatCurrency } from '@/utils/formatters';
import { Transaction } from '@/types/transaction';
import { CurrencyCode } from '@/constants/currencies';

function SummaryHeader({
  transactions,
  lastUpdated,
  selectedCurrency,
  exchangeRates,
}: {
  transactions: Transaction[];
  lastUpdated: Date | null;
  selectedCurrency: CurrencyCode;
  exchangeRates: Record<string, number> | null;
}) {
  const rawTotal = transactions.reduce((sum, t) => sum + t.amount, 0);
  const convertedTotal = getConvertedAmount(rawTotal, exchangeRates, selectedCurrency);
  const { display, isNegative } = formatCurrency(convertedTotal, selectedCurrency);

  return (
    <View style={summaryStyles.card}>
      <View style={summaryStyles.topRow}>
        <View style={summaryStyles.labelCol}>
          <Text style={summaryStyles.label}>Total Balance</Text>
          <CurrencySelector />
        </View>
        <Text style={[summaryStyles.amount, isNegative ? summaryStyles.negative : summaryStyles.positive]}>
          {display}
        </Text>
      </View>
      <Text style={summaryStyles.count}>{transactions.length} transaction{transactions.length !== 1 ? 's' : ''}</Text>
      {lastUpdated !== null && (
        <Text style={summaryStyles.lastUpdated}>Last updated: {format(lastUpdated, 'h:mm a')}</Text>
      )}
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
  const { transactions, isLoading, isRefreshing, fetchTransactions, refreshTransactions, lastUpdated } = useTransactionStore();
  const { isAuthenticated, logout } = useAuthStore();
  const { selectedCurrency, exchangeRates } = useCurrencyStore();

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
            selectedCurrency={selectedCurrency}
            exchangeRates={exchangeRates}
            onPress={() =>
              router.push({ pathname: '/transaction/[id]', params: { id: item.refId } })
            }
          />
        )}
        ListHeaderComponent={
          <SummaryHeader
            transactions={transactions}
            lastUpdated={lastUpdated}
            selectedCurrency={selectedCurrency}
            exchangeRates={exchangeRates}
          />
        }
        ListEmptyComponent={<EmptyState />}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshTransactions}
            tintColor="#1a3c6e"
            colors={['#1a3c6e']}
          />
        }
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
    backgroundColor: '#1a3c6e',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    paddingVertical: 20,
    paddingHorizontal: 20,
    shadowColor: '#1a3c6e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  labelCol: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
    fontWeight: '500',
  },
  amount: {
    fontSize: 26,
    fontWeight: '800',
    flexShrink: 1,
    textAlign: 'right',
    marginLeft: 12,
  },
  positive: {
    color: '#4ADE80',
  },
  negative: {
    color: '#F87171',
  },
  count: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  lastUpdated: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.35)',
    marginTop: 4,
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
