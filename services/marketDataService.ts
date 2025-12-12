
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

interface MarketDataResponse {
    data: Candle[];
    source: 'API';
}

export const fetchMarketData = async (pair: CurrencyPair, timeframe: Timeframe, count: number): Promise<MarketDataResponse> => {
  const symbol = BINANCE_SYMBOL_MAP[pair];
  
  // Strict check: if no symbol mapping exists, we cannot provide real live data.
  if (!symbol) {
    throw new Error(`Live data not available for ${pair}. API source required.`);
  }

  const interval = INTERVAL_MAP[timeframe];
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout for market data

  try {
      const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${count}`, {
          signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Data Provider Error: ${response.status}`);
      }

      const rawData = await response.json();
      
      if (!Array.isArray(rawData)) {
          throw new Error('Invalid data format received from provider.');
      }

      // Binance format: [open_time, open, high, low, close, volume, close_time, ...]
      const candles = rawData.map((d: any) => ({
        timestamp: d[0],
        open: parseFloat(d[1]),
        high: parseFloat(d[2]),
        low: parseFloat(d[3]),
        close: parseFloat(d[4])
      }));

      if (candles.length === 0) {
          throw new Error('Provider returned no data for this timeframe.');
      }

      return { data: candles, source: 'API' };

  } catch (error) {
      clearTimeout(timeoutId);
      // Re-throw exact error to be displayed in UI
      throw error;
  }
};
