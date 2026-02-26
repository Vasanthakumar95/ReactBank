import { create } from 'zustand';
import { Transaction } from '@/types/transaction';

interface TransactionState {
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  transactions: [],
  setTransactions: (transactions) => set({ transactions }),
}));
