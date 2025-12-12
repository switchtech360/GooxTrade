
import React, { useState } from 'react';
import { BacktestResult, Strategy } from '../types';
import { LoadingSpinner } from './icons/LoadingSpinner';

interface BacktestPanelProps {
    results: BacktestResult | null;
    isRunning: boolean;
    onRunBacktest: () => void;
    strategy: Strategy;
}

const BacktestPanel: React.FC<BacktestPanelProps> = ({ results, isRunning, onRunBacktest, strategy }) => {
    
    return (
        <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-900/50">
                <div>
                    <h2 className="text-lg font-bold text-white">Strategy Backtester</h2>
                    <p className="text-xs text-gray-400">Testing: <span className="text-cyan-400">{strategy}</span></p>
                </div>
                <button
                    onClick={onRunBacktest}
                    disabled={isRunning}
                    className="bg-cyan-700 hover:bg-cyan-600 disabled:bg-gray-700 text-white text-xs font-bold py-2 px-4 rounded transition-colors flex items-center gap-2"
                >
                    {isRunning ? <LoadingSpinner /> : 'RUN TEST'}
                </button>
            </div>

            <div className="p-4 flex-grow overflow-y-auto">
                {!results && !isRunning && (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500 text-sm">
                        <p>Click Run Test to simulate trades on current historical data.</p>
                        <p className="text-xs mt-2 opacity-60">Uses last ~100-300 candles.</p>
                    </div>
                )}

                {isRunning && (
                    <div className="h-full flex items-center justify-center text-cyan-400">
                        <span className="animate-pulse">Simulating Trades...</span>
                    </div>
                )}

                {results && !isRunning && (
                    <div className="space-y-4 animate-fade-in">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-700/30 p-3 rounded-lg text-center border border-gray-700">
                                <p className="text-xs text-gray-400 uppercase">Win Rate</p>
                                <p className={`text-2xl font-bold ${results.winRate > 50 ? 'text-green-400' : 'text-red-400'}`}>
                                    {results.winRate}%
                                </p>
                            </div>
                            <div className="bg-gray-700/30 p-3 rounded-lg text-center border border-gray-700">
                                <p className="text-xs text-gray-400 uppercase">Net Profit</p>
                                <p className={`text-2xl font-bold ${results.netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {results.netProfit > 0 ? '+' : ''}{results.netProfit}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center text-sm">
                            <div className="bg-gray-700/30 p-2 rounded">
                                <p className="text-gray-400 text-[10px] uppercase">Trades</p>
                                <p className="font-semibold">{results.totalTrades}</p>
                            </div>
                            <div className="bg-gray-700/30 p-2 rounded">
                                <p className="text-gray-400 text-[10px] uppercase">Profit Factor</p>
                                <p className="font-semibold">{results.profitFactor}</p>
                            </div>
                             <div className="bg-gray-700/30 p-2 rounded">
                                <p className="text-gray-400 text-[10px] uppercase">Drawdown</p>
                                <p className="font-semibold text-red-400">{results.maxDrawdown}%</p>
                            </div>
                        </div>

                        <div className="mt-4">
                            <p className="text-xs font-bold text-gray-400 uppercase mb-2">Recent Trades (Simulated)</p>
                            <div className="max-h-32 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                                {results.trades.slice().reverse().map((trade, i) => (
                                    <div key={i} className="flex justify-between items-center text-xs p-2 bg-gray-700/20 rounded hover:bg-gray-700/40">
                                        <span className={trade.type === 'BUY' ? 'text-green-400' : 'text-red-400'}>{trade.type}</span>
                                        <span className="font-mono text-gray-300">{trade.entryPrice.toFixed(4)}</span>
                                        <span className={trade.profit > 0 ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
                                            {trade.profit > 0 ? '+' : ''}{trade.profit.toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BacktestPanel;
