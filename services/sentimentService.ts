
import { CurrencyPair, MarketSentiment } from '../types';

const sentimentData: Record<string, MarketSentiment> = {
    'EUR/USD': { sentiment: 'Neutral', keywords: ['ECB meeting', 'US inflation data', 'geopolitical tensions'] },
    'GBP/JPY': { sentiment: 'Bullish', keywords: ['BoE rate hike rumors', 'risk-on appetite', 'carry trade'] },
    'AUD/USD': { sentiment: 'Bearish', keywords: ['China economic slowdown', 'commodity prices falling', 'RBA dovish'] },
    'USD/CAD': { sentiment: 'Neutral', keywords: ['oil price volatility', 'Fed policy', 'Canadian employment data'] },
    'USD/JPY': { sentiment: 'Bullish', keywords: ['BoJ policy divergence', 'yield curve control', 'importer demand'] },
    'USD/CHF': { sentiment: 'Neutral', keywords: ['safe-haven flows', 'SNB policy', 'risk sentiment'] },
    'NZD/USD': { sentiment: 'Bearish', keywords: ['global growth concerns', 'RBNZ stance', 'commodity prices'] },
    'BTC/USD': { sentiment: 'Bullish', keywords: ['institutional adoption', 'halving cycle', 'positive ETF flows'] },
    'XAU/USD': { sentiment: 'Bullish', keywords: ['Safe-haven demand', 'Geopolitical tension', 'Central bank buying'] }
};

// In a real application, this would fetch data from news APIs (e.g., NewsAPI, Bloomberg)
// or social media sentiment analysis services.
export const getMarketSentiment = (pair: CurrencyPair): MarketSentiment => {
  // Simulate changing sentiment
  const sentiments: MarketSentiment['sentiment'][] = ['Bullish', 'Bearish', 'Neutral'];
  const baseSentiment = sentimentData[pair] || { sentiment: 'Neutral', keywords: ['general market news']};
  
  // Randomly return base sentiment or a different one to simulate market changes
  if (Math.random() > 0.7) {
      const randomSentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
      return { ...baseSentiment, sentiment: randomSentiment };
  }

  return baseSentiment;
};
