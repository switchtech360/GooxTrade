
import React, { useState, useEffect } from 'react';
import { CloseIcon } from './icons/CloseIcon';

interface RiskCalculatorProps {
    isOpen: boolean;
    onClose: () => void;
    currentPrice: number;
    pair: string;
}

const RiskCalculator: React.FC<RiskCalculatorProps> = ({ isOpen, onClose, currentPrice, pair }) => {
    const [balance, setBalance] = useState<string>('1000');
    const [riskPerc, setRiskPerc] = useState<string>('2');
    const [stopLossPips, setStopLossPips] = useState<string>('20');
    const [results, setResults] = useState<{ amount: number, units: number, leverage: number } | null>(null);

    // Auto-calculate on change
    useEffect(() => {
        const bal = parseFloat(balance);
        const risk = parseFloat(riskPerc);
        const sl = parseFloat(stopLossPips);

        if (!isNaN(bal) && !isNaN(risk) && !isNaN(sl) && sl > 0) {
            const riskAmount = bal * (risk / 100);
            
            // Standard Forex Lot Calculation approximation
            // Standard Lot = 100,000 units. 1 pip ~ $10 on standard lot (usually).
            // Value per pip = Risk Amount / Stop Loss Pips
            const valuePerPip = riskAmount / sl;
            
            // Approx units (assuming USD quote)
            // If pair is XXX/USD, 1 pip = 0.0001
            let pipValueFactor = 0.0001;
            if (pair.includes('JPY')) pipValueFactor = 0.01;
            
            // Position Size (Units) = Risk Amount / (StopLossPips * PipSize)
            const units = riskAmount / (sl * pipValueFactor);
            
            setResults({
                amount: riskAmount,
                units: units,
                leverage: (units * currentPrice) / bal // Effective leverage
            });
        }
    }, [balance, riskPerc, stopLossPips, currentPrice, pair]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-gray-800 border border-gray-600 rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-fade-in"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="text-cyan-400">🛡️</span> Risk Manager
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><CloseIcon /></button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Account Balance ($)</label>
                        <input 
                            type="number" 
                            value={balance} 
                            onChange={e => setBalance(e.target.value)} 
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none" 
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Risk (%)</label>
                            <input 
                                type="number" 
                                value={riskPerc} 
                                onChange={e => setRiskPerc(e.target.value)} 
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none" 
                            />
                        </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">SL Distance (Pips)</label>
                            <input 
                                type="number" 
                                value={stopLossPips} 
                                onChange={e => setStopLossPips(e.target.value)} 
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none" 
                            />
                        </div>
                    </div>

                    <div className="bg-cyan-900/20 border border-cyan-800 rounded-xl p-4 mt-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-300">Risk Amount:</span>
                            <span className="text-xl font-bold text-red-400">-${results?.amount.toFixed(2)}</span>
                        </div>
                         <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-300">Position Size:</span>
                            <span className="text-xl font-bold text-cyan-400">{(results?.units || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className="text-xs">units</span></span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-xs">Effective Leverage:</span>
                            <span className="text-gray-400 text-xs font-mono">1:{(results?.leverage || 1).toFixed(1)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RiskCalculator;
