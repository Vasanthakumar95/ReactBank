import { Transaction } from '@/types/transaction';

export const mockTransactions: Transaction[] = [
  { refId: '123ABC', transferDate: '2024-10-15T12:34:56Z', recipientName: 'John Doe', transferName: 'Salary Payment', amount: 1500.00 },
  { refId: '456DEF', transferDate: '2024-09-21T09:12:45Z', recipientName: 'Jane Smith', transferName: 'Invoice Payment', amount: 2300.75 },
  { refId: '789GHI', transferDate: '2024-10-05T16:18:30Z', recipientName: 'Robert Brown', transferName: 'Refund', amount: -500.00 },
  { refId: '101JKL', transferDate: '2024-08-30T11:47:22Z', recipientName: 'Emily Davis', transferName: 'Bonus Payment', amount: 1200.00 },
  { refId: 'FGT536', transferDate: '2025-09-21T07:12:45Z', recipientName: 'Jane Smith', transferName: 'Invoice Payment', amount: 2399.75 },
  { refId: 'KWP017', transferDate: '2024-11-01T16:19:30Z', recipientName: 'Robert Brown', transferName: 'Refund', amount: -129.00 },
  { refId: 'P77561', transferDate: '2026-07-20T11:48:22Z', recipientName: 'Emily Davis', transferName: 'Bonus Payment', amount: 1970.75 },
];
