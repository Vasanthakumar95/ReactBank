import { useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { useTransactionStore } from '@/store/transactionStore';
import TransactionCard from '@/components/TransactionCard';
import { Transaction } from '@/types/transaction';

export default function TransactionListScreen() {
  const { transactions, isLoading, fetchTransactions } = useTransactionStore();

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Transactions</Text>
        <Text style={styles.headerSubtitle}>{transactions.length} transactions</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Loading transactions...</Text>
        </View>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item: Transaction) => item.refId}
          renderItem={({ item }: { item: Transaction }) => (
            <TransactionCard
              transaction={item}
              onPress={() =>
                router.push({ pathname: '/transaction/[id]', params: { id: item.refId } })
              }
            />
          )}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    backgroundColor: '#1A1A2E',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
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
    paddingVertical: 12,
  },
});
