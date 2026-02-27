import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack } from 'expo-router';
import { useCallback, useEffect } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import TransactionListScreen from '@/screens/TransactionListScreen';
import { useAuthStore } from '@/store/authStore';
import { useTransactionStore } from '@/store/transactionStore';

export default function IndexScreen() {
  const { isLoading, fetchTransactions, } = useTransactionStore();
  const { isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      setTimeout(() => router.replace('/login'), 100);
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
      
      <TransactionListScreen/>  

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

