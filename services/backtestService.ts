
import { Candle, BacktestResult, Strategy } from '../types';
import { calculateIndicators } from './technicalAnalysisService';

// Standard Position size and Risk parameters for simulation
const INITIAL_BALANCE = 10000;
const RISK_PER_TRADE = 0.02; // 2% risk
const REWARD_RATIO = 1.5;

export const runBacktest = (data: Candle[], strategy: Strategy): BacktestResult => {
    const trades: BacktestResult['trades'] = [];
    let wins = 0;
    let losses = 0;
    let balance = INITIAL_BALANCE;
    let maxBalance = INITIAL_BALANCE;
    let maxDrawdown = 0;

    // Minimum data required for indicators (e.g. 50 candles for safe calculation)
    const LOOKBACK = 50; 
    
    if (data.length < LOOKBACK) {
        return { totalTrades: 0, wins: 0, losses: 0, winRate: 0, profitFactor: 0, maxDrawdown: 0, netProfit: 0, trades: [] };
    }

    // Iterate through historical data, simulating "Live" arrival of candles
    for (let i = LOOKBACK; i < data.length - 1; i++) {
        // Slice data to simulate history at index 'i'
        const currentData = data.slice(0, i + 1);
        const indicators = calculateIndicators(currentData);
        
        // Next candle (future) to check outcome
        const nextCandle = data[i + 1]; 
        const currentCandle = data[i];

        let signal: 'BUY' | 'SELL' | 'NONE' = 'NONE';

        // --- STRATEGY LOGIC ---
        // simplified deterministic logic for backtesting
        
        switch (strategy) {
            case 'Trend Following':
                // Price > SMA20 AND MACD > Signal
                if (indicators.currentPrice > indicators.sma20 && indicators.macd.macd > indicators.macd.signal) {
                    signal = 'BUY';
                } else if (indicators.currentPrice < indicators.sma20 && indicators.macd.macd < indicators.macd.signal) {
                    signal = 'SELL';
                }
                break;
            
            case 'Mean Reversion':
                // RSI Oversold (<30) -> Buy, RSI Overbought (>70) -> Sell
                if (indicators.rsi < 30) signal = 'BUY';
                else if (indicators.rsi > 70) signal = 'SELL';
                break;

            case 'CCI Strategy':
                if (indicators.cci < -100) signal = 'BUY';
                else if (indicators.cci > 100) signal = 'SELL';
                break;

            case 'Breakout Strategy':
                // Close outside Bollinger Bands
                if (currentCandle.close > indicators.bollingerBands.upper) signal = 'BUY';
                else if (currentCandle.close < indicators.bollingerBands.lower) signal = 'SELL';
                break;

            case 'Scalping':
                // Stochastic Crossovers in extreme zones
                if (indicators.stochastic.k < 20 && indicators.stochastic.k > indicators.stochastic.d) signal = 'BUY';
                if (indicators.stochastic.k > 80 && indicators.stochastic.k < indicators.stochastic.d) signal = 'SELL';
                break;

            default:
                // For unsupported/fundamental strategies in backtest, random-ish logic based on RSI to prevent crash
                if (indicators.rsi < 35) signal = 'BUY';
                else if (indicators.rsi > 65) signal = 'SELL';
                break;
        }

        // --- TRADE EXECUTION SIMULATION ---
        if (signal !== 'NONE') {
            const entryPrice = currentCandle.close;
            // Simplified TP/SL based on ATR
            const slDistance = indicators.atr * 1.5; 
            const tpDistance = indicators.atr * 1.5 * REWARD_RATIO;
            
            let exitPrice = 0;
            let profit = 0;
            let outcome: 'Win' | 'Loss' = 'Loss';

            // Check next candle High/Low to see if TP or SL hit
            // In a real binary option, it's just based on expiry, here we simulate a spot trade with SL/TP
            if (signal === 'BUY') {
                if (nextCandle.low <= entryPrice - slDistance) {
                    exitPrice = entryPrice - slDistance;
                    profit = - (balance * RISK_PER_TRADE);
                    outcome = 'Loss';
                } else if (nextCandle.high >= entryPrice + tpDistance) {
                    exitPrice = entryPrice + tpDistance;
                    profit = (balance * RISK_PER_TRADE * REWARD_RATIO);
                    outcome = 'Win';
                } else {
                    // Closed at end of next candle (simplified time expiry)
                    exitPrice = nextCandle.close;
                    profit = (exitPrice - entryPrice) * (balance / entryPrice); // Raw PnL
                    outcome = profit > 0 ? 'Win' : 'Loss';
                }
            } else { // SELL
                if (nextCandle.high >= entryPrice + slDistance) {
                    exitPrice = entryPrice + slDistance;
                    profit = - (balance * RISK_PER_TRADE);
                    outcome = 'Loss';
                } else if (nextCandle.low <= entryPrice - tpDistance) {
                    exitPrice = entryPrice - tpDistance;
                    profit = (balance * RISK_PER_TRADE * REWARD_RATIO);
                    outcome = 'Win';
                } else {
                     // Closed at end of next candle
                    exitPrice = nextCandle.close;
                    profit = (entryPrice - exitPrice) * (balance / entryPrice);
                    outcome = profit > 0 ? 'Win' : 'Loss';
                }
            }
            
            // Avoid taking a trade every single candle if logic persists
            const lastTrade = trades[trades.length - 1];
            if (!lastTrade || (i - lastTrade.entryIndex > 2)) {
                 trades.push({
                    entryIndex: i,
                    exitIndex: i + 1,
                    type: signal,
                    entryPrice,
                    exitPrice,
                    profit
                });

                if (outcome === 'Win') wins++;
                else losses++;
                
                balance += profit;
                
                // Drawdown calc
                if (balance > maxBalance) maxBalance = balance;
                const dd = ((maxBalance - balance) / maxBalance) * 100;
                if (dd > maxDrawdown) maxDrawdown = dd;
            }
        }
    }

    const totalTrades = wins + losses;
    const winRate = totalTrades > 0 ? Math.round((wins / totalTrades) * 100) : 0;
    const grossProfit = trades.filter(t => t.profit > 0).reduce((sum, t) => sum + t.profit, 0);
    const grossLoss = Math.abs(trades.filter(t => t.profit < 0).reduce((sum, t) => sum + t.profit, 0));
    const profitFactor = grossLoss === 0 ? grossProfit : parseFloat((grossProfit / grossLoss).toFixed(2));

    return {
        totalTrades,
        wins,
        losses,
        winRate,
        profitFactor,
        maxDrawdown: parseFloat(maxDrawdown.toFixed(2)),
        netProfit: parseFloat((balance - INITIAL_BALANCE).toFixed(2)),
        trades
    };
};
