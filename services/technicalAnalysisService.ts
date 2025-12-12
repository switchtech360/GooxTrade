
import { Candle, Indicators, VolatilityInfo, FibonacciLevels } from '../types';

const calculateSMA = (closes: number[], period: number): number => {
  if (closes.length < period) return 0;
  const slice = closes.slice(-period);
  const sum = slice.reduce((acc, val) => acc + val, 0);
  return sum / period;
};

const calculateEMA = (closes: number[], period: number): number[] => {
    if (closes.length === 0) return [];
    const k = 2 / (period + 1);
    const emaArray = [closes[0]];
    for (let i = 1; i < closes.length; i++) {
        emaArray.push(closes[i] * k + emaArray[i - 1] * (1 - k));
    }
    return emaArray;
};

const calculateRSIValues = (closes: number[], period: number = 14): number[] => {
    if (closes.length < period + 1) return new Array(closes.length).fill(50);
    
    const rsiValues: number[] = new Array(closes.length).fill(50);
    let gains = 0;
    let losses = 0;

    // Initial RSI calculation
    for (let i = 1; i <= period; i++) {
        const diff = closes[i] - closes[i - 1];
        if (diff > 0) gains += diff;
        else losses -= diff;
    }
    
    let avgGain = gains / period;
    let avgLoss = losses / period;
    
    rsiValues[period] = avgLoss === 0 ? 100 : 100 - (100 / (1 + (avgGain / avgLoss)));

    // Smoothed RSI calculation for the rest
    for (let i = period + 1; i < closes.length; i++) {
        const diff = closes[i] - closes[i - 1];
        const gain = diff > 0 ? diff : 0;
        const loss = diff < 0 ? -diff : 0;
        
        avgGain = ((avgGain * (period - 1)) + gain) / period;
        avgLoss = ((avgLoss * (period - 1)) + loss) / period;
        
        const rs = avgGain / avgLoss;
        rsiValues[i] = avgLoss === 0 ? 100 : 100 - (100 / (1 + rs));
    }

    return rsiValues;
};

const detectDivergence = (closes: number[], rsiValues: number[], lows: number[], highs: number[], window: number = 20): 'Bullish' | 'Bearish' | 'None' => {
    if (closes.length < window || rsiValues.length < window) return 'None';
    
    const currentIdx = closes.length - 1;
    const currentClose = closes[currentIdx];
    const currentRSI = rsiValues[currentIdx];
    
    // Look back 'window' bars, excluding the current one to find previous pivot
    const startIdx = Math.max(0, currentIdx - window);
    let minLow = Number.MAX_VALUE;
    let minLowIdx = -1;
    let maxHigh = Number.MIN_VALUE;
    let maxHighIdx = -1;

    for(let i = startIdx; i < currentIdx; i++) {
        if(lows[i] < minLow) {
            minLow = lows[i];
            minLowIdx = i;
        }
        if(highs[i] > maxHigh) {
            maxHigh = highs[i];
            maxHighIdx = i;
        }
    }
    
    // Check Bullish Divergence: Price makes Lower Low (or equal), but RSI makes Higher Low
    if (minLowIdx !== -1) {
        if (currentClose <= minLow) { 
            // Current price is lower/equal to the lowest low of the window
            // Check if RSI is HIGHER than the RSI at that previous lowest point
            if (currentRSI > rsiValues[minLowIdx] && rsiValues[minLowIdx] < 40) { // Added threshold for validity
                 return 'Bullish';
            }
        }
    }

    // Check Bearish Divergence: Price makes Higher High (or equal), but RSI makes Lower High
    if (maxHighIdx !== -1) {
        if (currentClose >= maxHigh) {
             // Current price is higher/equal to the highest high of the window
             // Check if RSI is LOWER than the RSI at that previous highest point
             if (currentRSI < rsiValues[maxHighIdx] && rsiValues[maxHighIdx] > 60) { // Added threshold for validity
                 return 'Bearish';
             }
        }
    }
    
    return 'None';
}

const calculateBollingerBands = (closes: number[], period: number = 20, stdDev: number = 2) => {
    if (closes.length < period) return { upper: 0, middle: 0, lower: 0 };
    
    const middle = calculateSMA(closes, period);
    const slice = closes.slice(-period);
    const mean = slice.reduce((acc, val) => acc + val, 0) / period;
    const sqDiffs = slice.map(val => Math.pow(val - mean, 2));
    const std = Math.sqrt(sqDiffs.reduce((acc, val) => acc + val, 0) / period);

    return {
        upper: middle + std * stdDev,
        middle,
        lower: middle - std * stdDev
    };
};

const calculateMACD = (closes: number[], fastPeriod: number = 12, slowPeriod: number = 26, signalPeriod: number = 9) => {
    if (closes.length < slowPeriod) return { macd: 0, signal: 0, histogram: 0 };

    const emaFast = calculateEMA(closes, fastPeriod);
    const emaSlow = calculateEMA(closes, slowPeriod);
    
    const macdLine = emaFast.map((val, i) => val - emaSlow[i]);
    const signalLine = calculateEMA(macdLine, signalPeriod);
    
    const lastMacd = macdLine.length > 0 ? macdLine[macdLine.length - 1] : 0;
    const lastSignal = signalLine.length > 0 ? signalLine[signalLine.length - 1] : 0;


    return {
        macd: lastMacd,
        signal: lastSignal,
        histogram: lastMacd - lastSignal,
    };
};

const calculateCCI = (data: Candle[], period: number = 20): number => {
    if (data.length < period) return 0;
    
    const periodData = data.slice(-period);
    const typicalPrices = periodData.map(c => (c.high + c.low + c.close) / 3);
    const smaTp = typicalPrices.reduce((sum, val) => sum + val, 0) / period;
    const meanDeviation = typicalPrices.reduce((sum, val) => sum + Math.abs(val - smaTp), 0) / period;
    
    const lastTypicalPrice = (data[data.length - 1].high + data[data.length - 1].low + data[data.length - 1].close) / 3;

    if (meanDeviation === 0) return 0;

    const cci = (lastTypicalPrice - smaTp) / (0.015 * meanDeviation);
    return cci;
};

// Stochastic Oscillator (14, 3, 3)
const calculateStochastic = (data: Candle[], period: number = 14, kPeriod: number = 3, dPeriod: number = 3) => {
    if (data.length < period + kPeriod) return { k: 50, d: 50 };

    // Calculate %K
    const kValues: number[] = [];
    for (let i = period - 1; i < data.length; i++) {
        const slice = data.slice(i - period + 1, i + 1);
        const low = Math.min(...slice.map(d => d.low));
        const high = Math.max(...slice.map(d => d.high));
        const currentClose = data[i].close;

        let k = 50;
        if (high - low !== 0) {
            k = ((currentClose - low) / (high - low)) * 100;
        }
        kValues.push(k);
    }

    // SMA of %K
    const smoothK = calculateEMA(kValues, kPeriod); // Some use SMA, EMA is smoother
    // SMA of smoothed %K = %D
    const smoothD = calculateEMA(smoothK, dPeriod);

    return {
        k: smoothK.length > 0 ? smoothK[smoothK.length - 1] : 50,
        d: smoothD.length > 0 ? smoothD[smoothD.length - 1] : 50
    };
};

// Calculate Fibonacci Levels based on the visible range (approx last 100 candles)
const calculateFibonacci = (data: Candle[]): FibonacciLevels => {
    if (data.length < 50) return { level0: 0, level236: 0, level382: 0, level500: 0, level618: 0, level786: 0, level100: 0, trend: 'Up' };

    // Use a lookback to determine local High/Low for plotting
    const slice = data.slice(-100); 
    const high = Math.max(...slice.map(c => c.high));
    const low = Math.min(...slice.map(c => c.low));
    
    // Determine crude trend based on whether the High or Low is more recent
    const highIdx = slice.findIndex(c => c.high === high);
    const lowIdx = slice.findIndex(c => c.low === low);
    const trend = highIdx > lowIdx ? 'Up' : 'Down'; // If High is after Low, we are in an impulse Up

    const diff = high - low;

    // Standard Fib Calculations
    if (trend === 'Up') {
        // Retracement from High downwards
        return {
            level0: low,
            level236: high - (diff * 0.236),
            level382: high - (diff * 0.382),
            level500: high - (diff * 0.500),
            level618: high - (diff * 0.618),
            level786: high - (diff * 0.786),
            level100: high,
            trend
        };
    } else {
         // Retracement from Low upwards
         return {
            level0: high,
            level236: low + (diff * 0.236),
            level382: low + (diff * 0.382),
            level500: low + (diff * 0.500),
            level618: low + (diff * 0.618),
            level786: low + (diff * 0.786),
            level100: low,
            trend
        };
    }
}

export const calculateIndicators = (data: Candle[]): Indicators => {
  const closes = data.map(candle => candle.close);
  const lows = data.map(candle => candle.low);
  const highs = data.map(candle => candle.high);
  
  const rsiValues = calculateRSIValues(closes, 14);
  const rsi = rsiValues.length > 0 ? parseFloat(rsiValues[rsiValues.length - 1].toFixed(2)) : 50;
  
  const divergence = detectDivergence(closes, rsiValues, lows, highs, 15);
  
  const sma20 = calculateSMA(closes, 20);
  const bollingerBands = calculateBollingerBands(closes, 20, 2);
  const macd = calculateMACD(closes, 12, 26, 9);
  const cci = calculateCCI(data, 20);
  const stochastic = calculateStochastic(data, 14, 3, 3);
  const currentPrice = closes.length > 0 ? closes[closes.length - 1] : 0;
  const vol = calculateVolatility(data);
  const fib = calculateFibonacci(data);
  
  return {
    rsi,
    sma20: parseFloat(sma20.toFixed(4)),
    currentPrice: parseFloat(currentPrice.toFixed(4)),
    divergence,
    bollingerBands: {
        upper: parseFloat(bollingerBands.upper.toFixed(4)),
        middle: parseFloat(bollingerBands.middle.toFixed(4)),
        lower: parseFloat(bollingerBands.lower.toFixed(4)),
    },
    macd: {
        macd: parseFloat(macd.macd.toFixed(5)),
        signal: parseFloat(macd.signal.toFixed(5)),
        histogram: parseFloat(macd.histogram.toFixed(5)),
    },
    stochastic: {
        k: parseFloat(stochastic.k.toFixed(2)),
        d: parseFloat(stochastic.d.toFixed(2))
    },
    atr: parseFloat(vol.atr.toFixed(5)),
    cci: parseFloat(cci.toFixed(2)),
    fibonacci: fib
  };
};

export const calculateVolatility = (data: Candle[], period: number = 14): VolatilityInfo => {
    if (data.length < period) return { atr: 0, level: 'Low' };

    const trueRanges = [];
    for (let i = data.length - period; i < data.length; i++) {
        const high = data[i].high;
        const low = data[i].low;
        const prevClose = i > 0 ? data[i-1].close : data[i].open;
        const tr = Math.max(high - low, Math.abs(high - prevClose), Math.abs(low - prevClose));
        trueRanges.push(tr);
    }

    const atr = trueRanges.reduce((sum, val) => sum + val, 0) / period;
    const price = data[data.length - 1].close;
    const atrPercentage = (atr / price) * 100;

    let level: VolatilityInfo['level'] = 'Low';
    if (atrPercentage > 0.5) level = 'Moderate';
    if (atrPercentage > 1.0) level = 'High';
    if (atrPercentage > 2.0) level = 'Very High';
    
    // For non-forex pairs like BTC, adjust thresholds
    if (price > 1000) {
        if (atrPercentage > 1.5) level = 'Moderate';
        if (atrPercentage > 3.0) level = 'High';
        if (atrPercentage > 5.0) level = 'Very High';
    }

    return { atr, level };
};
