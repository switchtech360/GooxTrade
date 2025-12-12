
import React from 'react';
import { Indicators } from '../types';

interface IndicatorDisplayProps {
  indicators: Indicators | null;
}

const IndicatorItem: React.FC<{ label: string; value: string | number; color?: string; subLabel?: string }> = ({ label, value, color = 'text-cyan-400', subLabel }) => (
    <div className="flex flex-col items-center justify-center p-3 bg-gray-700/50 rounded-lg text-center">
        <div className="text-xs sm:text-sm text-gray-400">{label}</div>
        <div className={`text-xl sm:text-2xl font-bold ${color}`}>{value}</div>
        {subLabel && <div className="text-[10px] text-gray-500 mt-1">{subLabel}</div>}
    </div>
);


const IndicatorDisplay: React.FC<IndicatorDisplayProps> = ({ indicators }) => {
  const getRsiColor = (rsi: number) => {
    if (rsi > 70) return 'text-red-400'; // Overbought
    if (rsi < 30) return 'text-green-400'; // Oversold
    return 'text-cyan-400'; // Neutral
  };

  const getCciColor = (cci: number) => {
    if (cci > 100) return 'text-red-400'; // Overbought
    if (cci < -100) return 'text-green-400'; // Oversold
    return 'text-cyan-400'; // Neutral
  };

  const getMacdHistColor = (hist: number) => {
    return hist > 0 ? 'text-green-400' : 'text-red-400';
  }
  
  const getDivergenceColor = (div: string) => {
      if (div === 'Bullish') return 'text-green-400 animate-pulse';
      if (div === 'Bearish') return 'text-red-400 animate-pulse';
      return 'text-gray-500';
  }

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-700 h-full">
      <h2 className="text-xl font-bold text-white mb-4 text-center">Key Indicators</h2>
      {indicators ? (
        <div className="grid grid-cols-3 grid-rows-2 gap-2 sm:gap-4">
            <IndicatorItem label="Price" value={indicators.currentPrice.toLocaleString()} />
            <IndicatorItem label="RSI (14)" value={indicators.rsi} color={getRsiColor(indicators.rsi)} />
            <IndicatorItem 
                label="Divergence" 
                value={indicators.divergence === 'None' ? '-' : indicators.divergence} 
                color={getDivergenceColor(indicators.divergence)} 
                subLabel="RSI vs Price"
            />
            <IndicatorItem label="BB Upper" value={indicators.bollingerBands.upper.toLocaleString()} color="text-yellow-400" />
            <IndicatorItem label="MACD Hist." value={indicators.macd.histogram.toFixed(4)} color={getMacdHistColor(indicators.macd.histogram)} />
            <IndicatorItem label="BB Lower" value={indicators.bollingerBands.lower.toLocaleString()} color="text-yellow-400" />
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          <p>Indicators will appear here...</p>
        </div>
      )}
    </div>
  );
};

export default IndicatorDisplay;
