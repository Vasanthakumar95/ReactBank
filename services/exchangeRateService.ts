const PRIMARY_URL = (base: string) =>
  `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${base}.json`;

const FALLBACK_URL = (base: string) =>
  `https://latest.currency-api.pages.dev/v1/currencies/${base}.json`;

interface ExchangeRateResponse {
  date: string;
  [currencyCode: string]: string | Record<string, number>;
}

async function fetchFromUrl(url: string): Promise<Response> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response;
}

export async function fetchExchangeRates(baseCurrency: string): Promise<Record<string, number>> {
  const base = baseCurrency.toLowerCase();

  let response: Response;
  try {
    response = await fetchFromUrl(PRIMARY_URL(base));
  } catch {
    try {
      response = await fetchFromUrl(FALLBACK_URL(base));
    } catch {
      throw new Error('Unable to fetch exchange rates. Please check your connection.');
    }
  }

  const data: ExchangeRateResponse = await response.json();
  const rates = data[base];

  if (!rates || typeof rates !== 'object') {
    throw new Error('Unable to fetch exchange rates. Please check your connection.');
  }

  return rates as Record<string, number>;
}

export function convertAmount(amount: number, rate: number, decimalPlaces: number): number {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(amount * rate * factor) / factor;
}
