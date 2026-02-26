import { create } from 'zustand';
import { Transaction } from '@/types/transaction';
import { mockTransactions } from '@/data/mockTransactions';

interface TransactionState {
  transactions: Transaction[];
  selectedTransaction: Transaction | null;
  isLoading: boolean;
  setTransactions: (transactions: Transaction[]) => void;
  setSelectedTransaction: (transaction: Transaction | null) => void;
  fetchTransactions: () => Promise<void>;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  transactions: [],
  selectedTransaction: null,
  isLoading: false,

  setTransactions: (transactions) => set({ transactions }),

  setSelectedTransaction: (transaction) => set({ selectedTransaction: transaction }),

  fetchTransactions: async () => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 500));
    set({ transactions: mockTransactions, isLoading: false });
  },
}));
