export type CurrencyCode = 'EUR' | 'GBP' | 'AUD' | 'JPY' | 'HKD' | 'MYR' | 'SGD';

export interface Currency {
  code: CurrencyCode;
  label: string;
  symbol: string;
}

export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: 'EUR', label: 'Euro', symbol: '€' },
  { code: 'GBP', label: 'British Pound', symbol: '£' },
  { code: 'AUD', label: 'Australian Dollar', symbol: 'A$' },
  { code: 'JPY', label: 'Japanese Yen', symbol: '¥' },
  { code: 'HKD', label: 'Hong Kong Dollar', symbol: 'HK$' },
  { code: 'MYR', label: 'Malaysian Ringgit', symbol: 'RM' },
  { code: 'SGD', label: 'Singapore Dollar', symbol: 'S$' },
];

export const BASE_CURRENCY: CurrencyCode = 'MYR';

export const CURRENCY_DECIMAL_PLACES: Record<CurrencyCode, number> = {
  EUR: 2,
  GBP: 2,
  AUD: 2,
  JPY: 0,
  HKD: 2,
  MYR: 2,
  SGD: 2,
};
