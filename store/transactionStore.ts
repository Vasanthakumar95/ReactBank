import { create } from 'zustand';
import { Transaction } from '@/types/transaction';
import { mockTransactions } from '@/data/mockTransactions';

interface TransactionState {
  transactions: Transaction[];
  selectedTransaction: Transaction | null;
  isLoading: boolean;
  isRefreshing: boolean;
  lastUpdated: Date | null;
  setTransactions: (transactions: Transaction[]) => void;
  setSelectedTransaction: (transaction: Transaction | null) => void;
  fetchTransactions: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  selectedTransaction: null,
  isLoading: false,
  isRefreshing: false,
  lastUpdated: null,

  setTransactions: (transactions) => set({ transactions }),

  setSelectedTransaction: (transaction) => set({ selectedTransaction: transaction }),

  fetchTransactions: async () => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 500));
    set({ transactions: mockTransactions, isLoading: false });
  },

  refreshTransactions: async () => {
    set({ isRefreshing: true });
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const current = get().transactions;
    set({ transactions: [...current].reverse(), isRefreshing: false, lastUpdated: new Date() });
  },
}));
