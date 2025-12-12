
import { Strategy, AnalysisType } from "./types";

export const CURRENCY_PAIRS = ['EUR/USD', 'GBP/JPY', 'AUD/USD', 'USD/CAD', 'USD/JPY', 'USD/CHF', 'NZD/USD', 'BTC/USD'] as const;
export const TIME_FRAMES = ['1m', '5m', '15m', '1h', '4h'] as const;

const TECHNICAL_STRATEGIES = [
  'Trend Following', 
  'Mean Reversion', 
  'Breakout Strategy',
  'Scalping',
  'Momentum Trading',
  'CCI Strategy'
] as const;

const FUNDAMENTAL_STRATEGIES = [
    'Macro Trend Riding',
    'Economic Divergence'
] as const;

const SENTIMENT_STRATEGIES = [
    'News-Driven Momentum',
    'Contrarian Trading'
] as const;

export const TRADING_STRATEGIES = [
    ...TECHNICAL_STRATEGIES,
    ...FUNDAMENTAL_STRATEGIES,
    ...SENTIMENT_STRATEGIES
] as const;


export const ANALYSIS_TYPES = ['Technical', 'Fundamental', 'Sentiment'] as const;

export const STRATEGY_ANALYSIS_MAP: Record<AnalysisType, readonly Strategy[]> = {
    'Technical': TECHNICAL_STRATEGIES,
    'Fundamental': FUNDAMENTAL_STRATEGIES,
    'Sentiment': SENTIMENT_STRATEGIES
};

export const STRATEGY_DESCRIPTIONS: Record<Strategy, string> = {
    'Trend Following': 'Aims to profit by trading in the direction of the current market trend. Buys in uptrends and sells in downtrends.',
    'Mean Reversion': 'Based on the theory that prices tend to revert to their historical average. Sells when prices are high and buys when they are low.',
    'Breakout Strategy': 'Involves entering a trade when the price moves outside a defined support or resistance level, often with increased volume.',
    'Scalping': 'A very short-term trading style that involves making numerous small trades to profit from minor price changes.',
    'Momentum Trading': 'Focuses on trading assets with strong upward or downward trends. The goal is to ride the momentum until it fades.',
    'CCI Strategy': 'Uses the Commodity Channel Index (CCI) to identify overbought or oversold conditions, signaling potential trend reversals.',
    'Macro Trend Riding': 'A long-term strategy that aims to profit from major economic trends and shifts in monetary policy identified through fundamental analysis.',
    'Economic Divergence': 'Trades on the difference in economic performance between two countries. Buys the currency of the stronger economy and sells the weaker one.',
    'News-Driven Momentum': 'A strategy that enters trades based on the initial market reaction to major news events, aiming to capture the resulting momentum.',
    'Contrarian Trading': 'Involves trading against the prevailing market sentiment. Sells into extreme optimism (greed) and buys into extreme pessimism (fear).'
};

export const ANALYSIS_DESCRIPTIONS: Record<AnalysisType, string> = {
    'Technical': 'Focuses exclusively on historical price charts and market statistics. It uses technical indicators to identify patterns and predict future price movements.',
    'Fundamental': 'Evaluates an asset\'s intrinsic value by examining economic factors like interest rates, GDP, and inflation. Aims to trade based on the economic health of the currencies.',
    'Sentiment': 'Gauges the overall mood of the market. It tries to determine whether the market is bullish (optimistic) or bearish (pessimistic) and trades based on crowd psychology.'
};
