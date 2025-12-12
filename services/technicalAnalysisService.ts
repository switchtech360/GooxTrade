
import { Candle, Indicators, VolatilityInfo } from '../types';

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

const calculateRSI = (closes: number[], period: number = 14): number => {
  if (closes.length < period + 1) return 50; // Return neutral if not enough data

  let gains = 0;
  let losses = 0;

  for (let i = closes.length - period; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff > 0) {
      gains += diff;
    } else {
      losses -= diff; // losses are positive
    }
  }

  const avgGain = gains / period;
  const avgLoss = losses / period;

  if (avgLoss === 0) return 100;

  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
};

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


export const calculateIndicators = (data: Candle[]): Indicators => {
  const closes = data.map(candle => candle.close);
  const rsi = calculateRSI(closes, 14);
  const sma20 = calculateSMA(closes, 20);
  const bollingerBands = calculateBollingerBands(closes, 20, 2);
  const macd = calculateMACD(closes, 12, 26, 9);
  const cci = calculateCCI(data, 20);
  const currentPrice = closes.length > 0 ? closes[closes.length - 1] : 0;
  
  return {
    rsi: parseFloat(rsi.toFixed(2)),
    sma20: parseFloat(sma20.toFixed(4)),
    currentPrice: parseFloat(currentPrice.toFixed(4)),
    bollingerBands: {
        upper: parseFloat(bollingerBands.upper.toFixed(4)),
        middle: parseFloat(bollingerBands.middle.toFixed(4)),
        lower: parseFloat(bollingerBands.lower.toFixed(4)),
    },
    macd: {
        macd: parseFloat(macd.macd.toFixed(4)),
        signal: parseFloat(macd.signal.toFixed(4)),
        histogram: parseFloat(macd.histogram.toFixed(4)),
    },
    cci: parseFloat(cci.toFixed(2)),
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
