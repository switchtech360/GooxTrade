
import { Strategy, AnalysisType } from "./types";

export const CURRENCY_PAIRS = ['EUR/USD', 'GBP/JPY', 'AUD/USD', 'USD/CAD', 'USD/JPY', 'USD/CHF', 'NZD/USD', 'BTC/USD', 'XAU/USD'] as const;
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

const QUANTITATIVE_STRATEGIES = [
    'Statistical Arbitrage',
    'Volatility Scalping',
    'Algorithmic Trend'
] as const;

const INTERMARKET_STRATEGIES = [
    'Correlation Hedge',
    'Risk-On/Risk-Off Rotation',
    'Commodity Correlation'
] as const;

export const TRADING_STRATEGIES = [
    ...TECHNICAL_STRATEGIES,
    ...FUNDAMENTAL_STRATEGIES,
    ...SENTIMENT_STRATEGIES,
    ...QUANTITATIVE_STRATEGIES,
    ...INTERMARKET_STRATEGIES
] as const;


export const ANALYSIS_TYPES = ['Technical', 'Fundamental', 'Sentiment', 'Quantitative', 'Intermarket'] as const;

export const STRATEGY_ANALYSIS_MAP: Record<AnalysisType, readonly Strategy[]> = {
    'Technical': TECHNICAL_STRATEGIES,
    'Fundamental': FUNDAMENTAL_STRATEGIES,
    'Sentiment': SENTIMENT_STRATEGIES,
    'Quantitative': QUANTITATIVE_STRATEGIES,
    'Intermarket': INTERMARKET_STRATEGIES
};

export const STRATEGY_DESCRIPTIONS: Record<Strategy, string> = {
    // Technical
    'Trend Following': 'Aims to profit by trading in the direction of the current market trend. Buys in uptrends and sells in downtrends.',
    'Mean Reversion': 'Based on the theory that prices tend to revert to their historical average. Sells when prices are high and buys when they are low.',
    'Breakout Strategy': 'Involves entering a trade when the price moves outside a defined support or resistance level, often with increased volume.',
    'Scalping': 'A very short-term trading style that involves making numerous small trades to profit from minor price changes.',
    'Momentum Trading': 'Focuses on trading assets with strong upward or downward trends. The goal is to ride the momentum until it fades.',
    'CCI Strategy': 'Uses the Commodity Channel Index (CCI) to identify overbought or oversold conditions, signaling potential trend reversals.',
    
    // Fundamental
    'Macro Trend Riding': 'A long-term strategy that aims to profit from major economic trends and shifts in monetary policy identified through fundamental analysis.',
    'Economic Divergence': 'Trades on the difference in economic performance between two countries. Buys the currency of the stronger economy and sells the weaker one.',
    
    // Sentiment
    'News-Driven Momentum': 'A strategy that enters trades based on the initial market reaction to major news events, aiming to capture the resulting momentum.',
    'Contrarian Trading': 'Involves trading against the prevailing market sentiment. Sells into extreme optimism (greed) and buys into extreme pessimism (fear).',

    // Quantitative
    'Statistical Arbitrage': 'Exploits pricing inefficiencies between related assets using mathematical models to bet on mean reversion of the spread.',
    'Volatility Scalping': 'Capitalizes on rapid changes in volatility (ATR) rather than directional bias. Best for high-frequency environments.',
    'Algorithmic Trend': 'Uses mathematical smoothing algorithms (like Kalman filters or multiple Moving Averages) to strip out noise and identify the pure trend.',

    // Intermarket
    'Correlation Hedge': 'Trades a pair based on the movement of a correlated asset (e.g., Stocks or Bonds) to reduce risk or confirm direction.',
    'Risk-On/Risk-Off Rotation': 'Rotates capital between safe-haven currencies (JPY, CHF) and high-yield currencies (AUD, NZD) based on global risk sentiment.',
    'Commodity Correlation': 'Trades currencies ("Commodity Dollars") based on the price action of their primary export (e.g., Oil for CAD, Gold for AUD).'
};

export const ANALYSIS_DESCRIPTIONS: Record<AnalysisType, string> = {
    'Technical': 'Focuses exclusively on historical price charts and market statistics. It uses technical indicators to identify patterns and predict future price movements.',
    'Fundamental': 'Evaluates an asset\'s intrinsic value by examining economic factors like interest rates, GDP, and inflation. Aims to trade based on the economic health of the currencies.',
    'Sentiment': 'Gauges the overall mood of the market. It tries to determine whether the market is bullish (optimistic) or bearish (pessimistic) and trades based on crowd psychology.',
    'Quantitative': 'Uses mathematical models, statistical analysis, and data inputs (volatility, volume, probability) to identify algorithmic trading edges.',
    'Intermarket': 'Analyzes the relationships between different asset classes (Currencies, Stocks, Bonds, Commodities) to predict the movement of currency pairs.'
};

export const PAIR_RECOMMENDATIONS: Record<string, { strategy: Strategy; analysis: AnalysisType; indicators: string; reason: string }> = {
    'XAU/USD': {
        strategy: 'Breakout Strategy',
        analysis: 'Technical',
        indicators: 'Bollinger Bands, RSI, MACD',
        reason: 'Gold often consolidates before making explosive moves. Breakout strategies capture these high-volatility events.'
    },
    'BTC/USD': {
        strategy: 'Algorithmic Trend',
        analysis: 'Quantitative',
        indicators: 'MACD, Volatility (ATR)',
        reason: 'Bitcoin responds well to pure mathematical trend following due to its high noise-to-signal ratio.'
    },
    'EUR/USD': {
        strategy: 'Statistical Arbitrage',
        analysis: 'Quantitative',
        indicators: 'Standard Deviation, RSI',
        reason: 'The most liquid pair in the world often reverts to the mean, making it perfect for statistical models.'
    },
    'GBP/JPY': {
        strategy: 'Volatility Scalping',
        analysis: 'Quantitative',
        indicators: 'ATR, CCI, Bollinger Bands',
        reason: 'Known as "The Beast", its extreme volatility allows quants to scalp rapid price deviations.'
    },
    'USD/CAD': {
        strategy: 'Commodity Correlation',
        analysis: 'Intermarket',
        indicators: 'Oil Prices, CAD GDP',
        reason: 'The Canadian Dollar is heavily correlated with Crude Oil prices. Analyzing Oil gives a leading edge.'
    },
    'AUD/USD': {
        strategy: 'Risk-On/Risk-Off Rotation',
        analysis: 'Intermarket',
        indicators: 'S&P 500, Gold, VIX',
        reason: 'AUD is a proxy for global risk. It rises when stocks/gold rise and falls when fear (VIX) increases.'
    },
    'USD/JPY': {
        strategy: 'Correlation Hedge',
        analysis: 'Intermarket',
        indicators: 'US Treasury Yields',
        reason: 'This pair is mathematically locked to the 10-year US Treasury Yields. When yields rise, USD/JPY rises.'
    },
    'USD/CHF': {
        strategy: 'Mean Reversion',
        analysis: 'Technical',
        indicators: 'RSI, Stochastic',
        reason: 'Often range-bound due to the safe-haven nature of both currencies, suitable for mean reversion.'
    },
    'NZD/USD': {
        strategy: 'Economic Divergence',
        analysis: 'Fundamental',
        indicators: 'Dairy Prices, RBNZ Rates',
        reason: 'Driven by New Zealand\'s commodity exports and interest rate gaps with the US Fed.'
    }
};
