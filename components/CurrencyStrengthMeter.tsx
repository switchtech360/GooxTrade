
import React from 'react';
import { Indicators } from '../types';

interface CurrencyStrengthMeterProps {
    pair: string;
    indicators: Indicators | null;
}

const CurrencyStrengthMeter: React.FC<CurrencyStrengthMeterProps> = ({ pair, indicators }) => {
    if (!indicators) return null;

    const [base, quote] = pair.split('/');

    // Logic to determine relative strength based on current pair momentum
    // If RSI > 50 and Trend is UP, Base is Stronger.
    // Normalized to 0-100 scale where 50 is equilibrium.
    
    let baseStrength = 50;
    
    // RSI Contribution (0-100 mapped to -20 to +20 impact)
    const rsiImpact = (indicators.rsi - 50) * 0.8; 
    
    // MACD Contribution
    const macdImpact = indicators.macd.histogram > 0 ? 15 : -15;
    
    // SMA Trend Contribution
    const smaImpact = indicators.currentPrice > indicators.sma20 ? 10 : -10;

    baseStrength = 50 + rsiImpact + macdImpact + smaImpact;
    
    // Clamp
    baseStrength = Math.max(10, Math.min(90, baseStrength));
    const quoteStrength = 100 - baseStrength;

    return (
        <div className="bg-gray-800 p-4 rounded-2xl shadow-lg border border-gray-700 h-full flex flex-col justify-center">
            <h3 className="text-md font-bold text-white mb-3 text-center">Relative Currency Strength</h3>
            
            <div className="space-y-4">
                {/* Base Currency */}
                <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-white">{base}</span>
                        <span className="text-cyan-400">{baseStrength.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div className="bg-cyan-500 h-2.5 rounded-full transition-all duration-700" style={{ width: `${baseStrength}%` }}></div>
                    </div>
                </div>

                {/* Quote Currency */}
                <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-white">{quote}</span>
                        <span className="text-orange-400">{quoteStrength.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div className="bg-orange-500 h-2.5 rounded-full transition-all duration-700" style={{ width: `${quoteStrength}%` }}></div>
                    </div>
                </div>
            </div>
            
            <div className="mt-4 text-center text-xs text-gray-500">
                {baseStrength > quoteStrength ? (
                    <span><strong className="text-cyan-400">{base}</strong> dominates {quote}</span>
                ) : (
                    <span><strong className="text-orange-400">{quote}</strong> dominates {base}</span>
                )}
            </div>
        </div>
    );
};

export default CurrencyStrengthMeter;
