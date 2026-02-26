import { format, parseISO } from 'date-fns';

export function formatDate(isoString: string): string {
  return format(parseISO(isoString), 'd MMM yyyy, hh:mm a');
}

export interface FormattedCurrency {
  value: string;
  isNegative: boolean;
}

export function formatCurrency(amount: number): FormattedCurrency {
  const isNegative = amount < 0;
  const absolute = Math.abs(amount).toLocaleString('en-MY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const value = `${isNegative ? '-' : '+'}RM ${absolute}`;
  return { value, isNegative };
}
