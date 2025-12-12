
import { Candle, CurrencyPair, Timeframe } from '../types';

// Map valid pairs to Binance symbols. 
// Note: Limited to pairs available on public crypto APIs (Binance) as proxies.
const BINANCE_SYMBOL_MAP: Record<string, string> = {
  'BTC/USD': 'BTCUSDT',
  'XAU/USD': 'PAXGUSDT', // Paxos Gold as proxy
  'EUR/USD': 'EURUSDT',
  'GBP/JPY': '', // Not available on public Binance Spot
  'AUD/USD': 'AUDUSDT',
  'USD/CAD': '', // Not available
  'USD/JPY': '', // Not available
  'USD/CHF': '', // Not available
  'NZD/USD': ''  // Not available
};

const INTERVAL_MAP: Record<Timeframe, string> = {
  '1m': '1m',
  '5m': '5m',
  '15m': '15m',
  '1h': '1h',
  '4h': '4h'
};

const SYNTHETIC_BASE_PRICES: Record<string, number> = {
    'GBP/JPY': 191.50,
    'USD/CAD': 1.3600,
    'USD/JPY': 151.20,
    'USD/CHF': 0.9050,
    'NZD/USD': 0.5950
};

// List of API endpoints to try in order. 
// data-api.binance.vision is often more permissive with CORS and rate limits for public data.
const API_ENDPOINTS = [
    'https://data-api.binance.vision/api/v3/klines', 
    'https://api.binance.com/api/v3/klines',
    'https://api1.binance.com/api/v3/klines'
];

interface MarketDataResponse {
    data: Candle[];
    source: 'API' | 'Synthetic';
}

const getIntervalMs = (tf: Timeframe): number => {
    switch(tf) {
        case '1m': return 60 * 1000;
        case '5m': return 5 * 60 * 1000;
        case '15m': return 15 * 60 * 1000;
        case '1h': return 60 * 60 * 1000;
        case '4h': return 4 * 60 * 60 * 1000;
        default: return 60 * 1000;
    }
};

export const fetchMarketData = async (pair: CurrencyPair, timeframe: Timeframe, count: number): Promise<MarketDataResponse> => {
  const symbol = BINANCE_SYMBOL_MAP[pair];
  
  // If no API symbol is available, generate synthetic data for demo/simulation
  if (!symbol) {
      // console.warn(`Live data not available for ${pair}. Generating synthetic data for demo purposes.`);
      
      const intervalMs = getIntervalMs(timeframe);
      const now = Date.now();
      const candles: Candle[] = [];
      
      let basePrice = SYNTHETIC_BASE_PRICES[pair] || 1.0000;
      
      // Generate a random walk
      const prices: number[] = [basePrice];
      const volatility = basePrice * 0.0005; // 0.05% per period roughly

      // Create a sequence
      for (let i = 1; i < count; i++) {
          const change = (Math.random() - 0.5) * volatility;
          prices.push(prices[i-1] + change);
      }
      
      // Map to candles (reverse order to match time)
      for (let i = 0; i < count; i++) {
           const time = now - ((count - 1 - i) * intervalMs);
           const close = prices[i];
           // Open is previous close, or close +/- small random if first
           const open = i > 0 ? prices[i-1] : close - ((Math.random() - 0.5) * volatility);
           
           const range = Math.abs(open - close);
           const high = Math.max(open, close) + (Math.random() * range);
           const low = Math.min(open, close) - (Math.random() * range);
           
           candles.push({
               timestamp: time,
               open, high, low, close
           });
      }
      
      // Small artificial delay to mimic API fetch
      await new Promise(resolve => setTimeout(resolve, 400));
      
      return { data: candles, source: 'Synthetic' };
  }

  const interval = INTERVAL_MAP[timeframe];
  let lastError: any;

  // Try each endpoint until one works
  for (const baseUrl of API_ENDPOINTS) {
      try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout per request

          const url = `${baseUrl}?symbol=${symbol}&interval=${interval}&limit=${count}`;
          
          const response = await fetch(url, {
              signal: controller.signal,
              method: 'GET',
              headers: {
                  'Accept': 'application/json',
              }
          });
          
          clearTimeout(timeoutId);
          
          if (!response.ok) {
            // If 403 or 429, throw specifically to try next endpoint
            throw new Error(`HTTP ${response.status}`);
          }

          const rawData = await response.json();
          
          if (!Array.isArray(rawData)) {
              throw new Error('Invalid data format received.');
          }

          if (rawData.length === 0) {
              throw new Error('No data returned for this timeframe.');
          }

          // Binance format: [open_time, open, high, low, close, volume, close_time, ...]
          const candles = rawData.map((d: any) => ({
            timestamp: d[0],
            open: parseFloat(d[1]),
            high: parseFloat(d[2]),
            low: parseFloat(d[3]),
            close: parseFloat(d[4])
          }));

          return { data: candles, source: 'API' };

      } catch (error: any) {
          console.warn(`Failed to fetch from ${baseUrl}:`, error.message);
          lastError = error;
          // Continue to next endpoint
      }
  }

  // If all endpoints failed
  throw new Error(`Failed to connect to Market Data API. Network or CORS issue. (${lastError?.message || 'Unknown'})`);
};
