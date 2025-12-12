
import { CURRENCY_PAIRS, TIME_FRAMES, TRADING_STRATEGIES, ANALYSIS_TYPES } from './constants';

export type Signal = 'BUY' | 'SELL' | 'HOLD';

export type CurrencyPair = typeof CURRENCY_PAIRS[number];
export type Timeframe = typeof TIME_FRAMES[number];
export type Strategy = (typeof TRADING_STRATEGIES)[number];
export type AnalysisType = typeof ANALYSIS_TYPES[number];
export type SessionName = 'London' | 'New York' | 'Tokyo';

export interface Candle {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface FibonacciLevels {
    level0: number;   // Low
    level236: number;
    level382: number;
    level500: number;
    level618: number;
    level786: number;
    level100: number; // High
    trend: 'Up' | 'Down';
}

export interface Indicators {
  rsi: number;
  sma20: number;
  currentPrice: number;
  divergence: 'Bullish' | 'Bearish' | 'None';
  bollingerBands: {
    upper: number;
    middle: number;
    lower: number;
  };
  macd: {
    macd: number;
    signal: number;
    histogram: number;
  };
  stochastic: {
    k: number;
    d: number;
  };
  atr: number;
  cci: number;
  fibonacci: FibonacciLevels; // Added
}

export interface SignalResponse {
  signal: Signal;
  reasoning: string;
  confidence: number;
  stopLoss: number;
  takeProfit: number;
}

export interface TradingSessionInfo {
  name: SessionName;
  isActive: boolean;
  isPeak: boolean;
  hoursUTC: string;
}

export interface MarketSentiment {
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  keywords: string[];
}

export interface FundamentalData {
    interestRateDifferential: string;
    gdpOutlook: string;
    inflationaryPressure: string;
    keyReports: string;
}

export interface EconomicEvent {
    time: string;
    currency: string;
    impact: 'High' | 'Medium' | 'Low';
    event: string;
}

export interface VolatilityInfo {
    atr: number;
    level: 'Low' | 'Moderate' | 'High' | 'Very High';
}

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export interface Trade {
    id: string;
    pair: CurrencyPair;
    timeframe: Timeframe;
    strategy: Strategy;
    analysisType: AnalysisType;
    signal: Signal;
    entryPrice: number;
    exitPrice?: number;
    outcome: 'Win' | 'Loss' | 'Breakeven' | 'Ongoing';
    notes: string;
    timestamp: number;
}

export interface BacktestResult {
    totalTrades: number;
    wins: number;
    losses: number;
    winRate: number; // percentage
    profitFactor: number;
    maxDrawdown: number; // percentage
    netProfit: number;
    trades: {
        entryIndex: number;
        exitIndex: number;
        type: 'BUY' | 'SELL';
        entryPrice: number;
        exitPrice: number;
        profit: number;
    }[];
}
