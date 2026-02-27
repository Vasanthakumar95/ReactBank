import { format, parseISO } from 'date-fns';
import { BASE_CURRENCY, CURRENCY_DECIMAL_PLACES, CurrencyCode, SUPPORTED_CURRENCIES } from '@/constants/currencies';

export function formatDate(isoString: string): string {
  return format(parseISO(isoString), 'd MMM yyyy, hh:mm a');
}

export interface FormattedCurrency {
  display: string;
  isNegative: boolean;
}

export function formatCurrency(
  amount: number,
  currencyCode: CurrencyCode = BASE_CURRENCY,
  options: { showSign?: boolean } = {}
): FormattedCurrency {
  const { showSign = true } = options;
  const isNegative = amount < 0;
  const decimalPlaces = CURRENCY_DECIMAL_PLACES[currencyCode];
  const currency = SUPPORTED_CURRENCIES.find((c) => c.code === currencyCode)!;

  const absolute = Math.abs(amount).toLocaleString('en-MY', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });

  const sign = showSign ? (isNegative ? '-' : '+') : '';
  // Symbols ending with a letter (e.g. "RM") get a separating space; others (€, £, ¥, A$) do not
  const needsSpace = /[a-zA-Z]$/.test(currency.symbol);
  const display = `${sign}${currency.symbol}${needsSpace ? ' ' : ''}${absolute}`;

  return { display, isNegative };
}
