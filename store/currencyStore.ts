import { create } from 'zustand';
import { BASE_CURRENCY, CURRENCY_DECIMAL_PLACES, CurrencyCode } from '@/constants/currencies';
import { convertAmount, fetchExchangeRates } from '@/services/exchangeRateService';

interface CurrencyState {
  selectedCurrency: CurrencyCode;
  exchangeRates: Record<string, number> | null;
  isFetchingRates: boolean;
  rateError: string | null;
  lastFetchedCurrency: CurrencyCode | null;
  setCurrency: (currency: CurrencyCode) => Promise<void>;
}

export const useCurrencyStore = create<CurrencyState>((set, get) => ({
  selectedCurrency: BASE_CURRENCY,
  exchangeRates: null,
  isFetchingRates: false,
  rateError: null,
  lastFetchedCurrency: null,

  setCurrency: async (currency) => {
    const { selectedCurrency } = get();

    if (currency === selectedCurrency) return;

    if (currency === BASE_CURRENCY) {
      set({ selectedCurrency: BASE_CURRENCY, exchangeRates: null, rateError: null });
      return;
    }

    set({ isFetchingRates: true, rateError: null });
    try {
      const rates = await fetchExchangeRates(BASE_CURRENCY);
      set({ exchangeRates: rates, selectedCurrency: currency, lastFetchedCurrency: currency });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to fetch exchange rates. Please check your connection.';
      set({ rateError: message });
    } finally {
      set({ isFetchingRates: false });
    }
  },
}));

export function getConvertedAmount(
  amount: number,
  rates: Record<string, number> | null,
  targetCurrency: CurrencyCode
): number {
  if (rates === null || targetCurrency === BASE_CURRENCY) return amount;

  const rate = rates[targetCurrency.toLowerCase()];
  if (rate === undefined) {
    console.warn(`Exchange rate not found for currency: ${targetCurrency}`);
    return amount;
  }

  return convertAmount(amount, rate, CURRENCY_DECIMAL_PLACES[targetCurrency]);
}
