
import { Candle, CurrencyPair, Timeframe } from '../types';

// In a real application, this would fetch data from a live API (e.g., WebSocket or REST).
// For this demo, we simulate realistic-looking market data.

export const fetchMarketData = (pair: CurrencyPair, timeframe: Timeframe, count: number): Candle[] => {
  const data: Candle[] = [];
  let lastClose = getBasePrice(pair);
  const volatility = getVolatility(pair);
  const now = Date.now();
  const timeInterval = getTimeInterval(timeframe);

  for (let i = 0; i < count; i++) {
    const timestamp = now - (count - 1 - i) * timeInterval;
    const open = lastClose * (1 + (Math.random() - 0.5) * volatility * 0.1);
    const high = Math.max(open, lastClose) * (1 + Math.random() * volatility);
    const low = Math.min(open, lastClose) * (1 - Math.random() * volatility);
    const close = low + Math.random() * (high - low);

    data.push({ timestamp, open, high, low, close });
    lastClose = close;
  }
  return data;
};

const getBasePrice = (pair: CurrencyPair): number => {
  switch (pair) {
    case 'EUR/USD': return 1.08;
    case 'GBP/JPY': return 201.50;
    case 'AUD/USD': return 0.66;
    case 'USD/CAD': return 1.37;
    case 'USD/JPY': return 157.00;
    case 'USD/CHF': return 0.91;
    case 'NZD/USD': return 0.61;
    case 'BTC/USD': return 65000;
    default: return 1.0;
  }
};

const getVolatility = (pair: CurrencyPair): number => {
    switch (pair) {
        case 'EUR/USD': return 0.001;
        case 'GBP/JPY': return 0.005;
        case 'AUD/USD': return 0.002;
        case 'USD/CAD': return 0.0015;
        case 'USD/JPY': return 0.003;
        case 'USD/CHF': return 0.001;
        case 'NZD/USD': return 0.002;
        case 'BTC/USD': return 0.02;
        default: return 0.002;
    }
}

const getTimeInterval = (timeframe: Timeframe): number => {
    switch (timeframe) {
        case '1m': return 60 * 1000;
        case '5m': return 5 * 60 * 1000;
        case '15m': return 15 * 60 * 1000;
        case '1h': return 60 * 60 * 1000;
        case '4h': return 4 * 60 * 60 * 1000;
        default: return 5 * 60 * 1000;
    }
}
