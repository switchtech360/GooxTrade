
import React from 'react';
import { Indicators } from '../types';

interface IndicatorDisplayProps {
  indicators: Indicators | null;
}

const PanelHeader: React.FC<{ title: string; icon?: React.ReactNode }> = ({ title, icon }) => (
    <div className="flex items-center gap-2 mb-2 pb-1 border-b border-gray-700">
        {icon}
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</h3>
    </div>
);

const IndicatorRow: React.FC<{ label: string; value: string | number; color?: string; subText?: string }> = ({ label, value, color = "text-white", subText }) => (
    <div className="flex justify-between items-center py-1">
        <span className="text-gray-400 text-sm">{label}</span>
        <div className="text-right">
            <div className={`font-mono font-bold ${color}`}>{value}</div>
            {subText && <div className="text-[10px] text-gray-500">{subText}</div>}
        </div>
    </div>
);

const IndicatorDisplay: React.FC<IndicatorDisplayProps> = ({ indicators }) => {
  if (!indicators) {
      return (
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700 h-full flex items-center justify-center text-gray-500">
          <p>Waiting for market data...</p>
        </div>
      );
  }

  // --- Helper Functions for Color Logic ---
  const getRsiColor = (rsi: number) => {
    if (rsi > 70) return 'text-red-400';
    if (rsi < 30) return 'text-green-400';
    return 'text-cyan-400';
  };

  const getStochColor = (k: number) => {
      if (k > 80) return 'text-red-400';
      if (k < 20) return 'text-green-400';
      return 'text-cyan-400';
  };

  const getCciColor = (cci: number) => {
    if (cci > 100) return 'text-red-400'; 
    if (cci < -100) return 'text-green-400';
    return 'text-cyan-400';
  };

  const getMacdColor = (hist: number) => hist > 0 ? 'text-green-400' : 'text-red-400';
  
  const getDivergenceColor = (div: string) => {
      if (div === 'Bullish') return 'text-green-400 animate-pulse font-bold';
      if (div === 'Bearish') return 'text-red-400 animate-pulse font-bold';
      return 'text-gray-500';
  };

  return (
    <div className="bg-gray-800 p-4 rounded-2xl shadow-lg border border-gray-700 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Technical Analysis</h2>
        <div className="text-[10px] text-gray-500 bg-gray-900 px-2 py-1 rounded">LIVE METRICS</div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow">
        
        {/* Panel 1: Oscillators */}
        <div className="bg-gray-700/30 rounded-xl p-3 border border-gray-700 flex flex-col">
            <PanelHeader title="Momentum & Oscillators" />
            <div className="space-y-1 mt-1">
                <IndicatorRow 
                    label="RSI (14)" 
                    value={indicators.rsi} 
                    color={getRsiColor(indicators.rsi)} 
                    subText={indicators.rsi > 70 ? 'Overbought' : indicators.rsi < 30 ? 'Oversold' : 'Neutral'}
                />
                <IndicatorRow 
                    label="Stochastic" 
                    value={indicators.stochastic.k} 
                    color={getStochColor(indicators.stochastic.k)}
                    subText={`%K: ${indicators.stochastic.k} | %D: ${indicators.stochastic.d}`}
                />
                <IndicatorRow 
                    label="CCI (20)" 
                    value={indicators.cci} 
                    color={getCciColor(indicators.cci)} 
                />
            </div>
        </div>

        {/* Panel 2: Trend & Volatility */}
        <div className="bg-gray-700/30 rounded-xl p-3 border border-gray-700 flex flex-col">
             <PanelHeader title="Trend & Volatility" />
             <div className="space-y-1 mt-1">
                <IndicatorRow 
                    label="MACD" 
                    value={indicators.macd.histogram.toFixed(4)} 
                    color={getMacdColor(indicators.macd.histogram)}
                    subText="Histogram"
                />
                <IndicatorRow 
                    label="ATR (14)" 
                    value={indicators.atr.toFixed(5)} 
                    color="text-yellow-400"
                    subText="Volatility"
                />
                 <IndicatorRow 
                    label="Bollinger Bands" 
                    value="Width" 
                    color="text-white"
                    subText={`${indicators.bollingerBands.upper.toFixed(4)} / ${indicators.bollingerBands.lower.toFixed(4)}`}
                />
             </div>
        </div>

        {/* Panel 3: Signals & Key Levels */}
        <div className="bg-gray-700/30 rounded-xl p-3 border border-gray-700 flex flex-col">
             <PanelHeader title="Key Levels & Signals" />
             <div className="space-y-1 mt-1">
                <IndicatorRow 
                    label="Price" 
                    value={indicators.currentPrice} 
                    color="text-white font-bold"
                />
                 <div className="pt-1 pb-1 border-t border-gray-600/50">
                    <IndicatorRow 
                        label="Fib 61.8%" 
                        value={indicators.fibonacci.level618.toFixed(4)} 
                        color="text-yellow-400"
                        subText={`Retracement (${indicators.fibonacci.trend})`}
                    />
                     <IndicatorRow 
                        label="Fib 50.0%" 
                        value={indicators.fibonacci.level500.toFixed(4)} 
                        color="text-gray-300"
                    />
                </div>
                <div className="mt-1 pt-1 border-t border-gray-600/50">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Divergence</span>
                        <span className={`text-sm ${getDivergenceColor(indicators.divergence)}`}>
                            {indicators.divergence === 'None' ? 'No Signal' : indicators.divergence}
                        </span>
                    </div>
                </div>
             </div>
        </div>

      </div>
    </div>
  );
};

export default IndicatorDisplay;
