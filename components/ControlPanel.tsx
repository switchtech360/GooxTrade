
import React, { useState } from 'react';
import { CURRENCY_PAIRS, TIME_FRAMES, ANALYSIS_TYPES, PAIR_RECOMMENDATIONS } from '../constants';
import { CurrencyPair, Timeframe, Strategy, AnalysisType } from '../types';
import { LoadingSpinner } from './icons/LoadingSpinner';
import { HelpIcon } from './icons/HelpIcon';
import { ChromeIcon } from './icons/ChromeIcon';
import { LightBulbIcon } from './icons/LightBulbIcon';
import StrategyInfoModal from './StrategyInfoModal';
import AnalysisInfoModal from './AnalysisInfoModal';
import { downloadExtensionManifest } from '../services/extensionGenerator';

interface ControlPanelProps {
  currencyPair: CurrencyPair;
  setCurrencyPair: (pair: CurrencyPair) => void;
  timeframe: Timeframe;
  setTimeframe: (tf: Timeframe) => void;
  strategy: Strategy;
  setStrategy: (s: Strategy) => void;
  analysisType: AnalysisType;
  setAnalysisType: (at: AnalysisType) => void;
  availableStrategies: readonly Strategy[];
  onGetSignal: () => void;
  isLoading: boolean;
  autoRefresh: boolean;
  setAutoRefresh: (ar: boolean) => void;
  autoCyclePairs: boolean;
  setAutoCyclePairs: (ac: boolean) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = (props) => {
  const {
    currencyPair, setCurrencyPair, timeframe, setTimeframe, strategy, setStrategy,
    analysisType, setAnalysisType, availableStrategies, onGetSignal, isLoading,
    autoRefresh, setAutoRefresh, autoCyclePairs, setAutoCyclePairs
  } = props;

  const [isStrategyModalOpen, setIsStrategyModalOpen] = useState(false);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);

  const commonSelectClass = "w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 disabled:opacity-50";
  const commonLabelClass = "block text-sm font-medium text-gray-300";
  
  const recommendation = PAIR_RECOMMENDATIONS[currencyPair];

  const applyRecommendation = () => {
      if (recommendation) {
          setAnalysisType(recommendation.analysis);
          // We set strategy in a timeout to allow the parent App component to update availableStrategies first based on analysisType
          setTimeout(() => {
            setStrategy(recommendation.strategy);
          }, 50);
      }
  };

  return (
    <>
      <div className="flex flex-col space-y-4 h-full">
        {/* Parameters Section */}
        <div className="space-y-4">
            <div>
              <label htmlFor="currency-pair" className={`${commonLabelClass} mb-2`}>Currency Pair</label>
              <select id="currency-pair" value={currencyPair} onChange={(e) => setCurrencyPair(e.target.value as CurrencyPair)} className={commonSelectClass} disabled={isLoading}>
                {CURRENCY_PAIRS.map((pair) => <option key={pair} value={pair}>{pair}</option>)}
              </select>
            </div>
            
            {/* Recommendation Box */}
            {recommendation && (
              <div className="bg-cyan-900/20 border border-cyan-800 rounded-lg p-3 animate-fade-in">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-cyan-400"><LightBulbIcon /></span>
                    <h3 className="text-sm font-bold text-cyan-300">Best Config for {currencyPair}</h3>
                </div>
                <div className="text-xs space-y-1 text-gray-300">
                    <p><span className="text-gray-400">Strategy:</span> <span className="font-semibold text-white">{recommendation.strategy}</span></p>
                    <p><span className="text-gray-400">Analysis:</span> <span className="font-semibold text-white">{recommendation.analysis}</span></p>
                    <p><span className="text-gray-400">Key Ind:</span> {recommendation.indicators}</p>
                    <p className="italic text-cyan-200/70 mt-1 leading-tight">"{recommendation.reason}"</p>
                </div>
                {(strategy !== recommendation.strategy || analysisType !== recommendation.analysis) && (
                    <button 
                        onClick={applyRecommendation}
                        disabled={isLoading}
                        className="w-full mt-2 bg-cyan-800/50 hover:bg-cyan-700/50 text-cyan-400 text-xs py-1.5 rounded border border-cyan-700/50 transition-colors uppercase font-bold tracking-wide"
                    >
                        Apply Settings
                    </button>
                )}
              </div>
            )}
            
            <div>
              <label htmlFor="timeframe" className={`${commonLabelClass} mb-2`}>Timeframe</label>
              <select id="timeframe" value={timeframe} onChange={(e) => setTimeframe(e.target.value as Timeframe)} className={commonSelectClass} disabled={isLoading}>
                {TIME_FRAMES.map((tf) => <option key={tf} value={tf}>{tf}</option>)}
              </select>
            </div>
    
            <div>
               <div className="flex items-center justify-between mb-2">
                <label htmlFor="analysis-type" className={commonLabelClass}>Analysis Type</label>
                <button onClick={() => setIsAnalysisModalOpen(true)} className="text-gray-400 hover:text-cyan-400 transition-colors" aria-label="Analysis Type Information"><HelpIcon /></button>
              </div>
              <select id="analysis-type" value={analysisType} onChange={(e) => setAnalysisType(e.target.value as AnalysisType)} className={commonSelectClass} disabled={isLoading}>
                {ANALYSIS_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
    
            <div>
               <div className="flex items-center justify-between mb-2">
                <label htmlFor="strategy" className={commonLabelClass}>Trading Strategy</label>
                <button onClick={() => setIsStrategyModalOpen(true)} className="text-gray-400 hover:text-cyan-400 transition-colors" aria-label="Strategy Information"><HelpIcon /></button>
              </div>
              <select id="strategy" value={strategy} onChange={(e) => setStrategy(e.target.value as Strategy)} className={commonSelectClass} disabled={isLoading}>
                {availableStrategies.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
        </div>

        {/* Action Section */}
        <hr className="border-gray-600" />
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label htmlFor="auto-refresh" className={commonLabelClass}>Auto-Refresh Signal (30s)</label>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="auto-refresh" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} className="sr-only peer" disabled={isLoading} />
                    <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-cyan-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                </label>
            </div>
             <div className="flex items-center justify-between">
                <label htmlFor="auto-cycle" className={commonLabelClass}>Auto-Cycle Pairs</label>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="auto-cycle" checked={autoCyclePairs} onChange={(e) => setAutoCyclePairs(e.target.checked)} className="sr-only peer" disabled={isLoading} />
                    <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-cyan-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                </label>
            </div>
            
          <button
            onClick={onGetSignal}
            disabled={isLoading}
            className="w-full flex justify-center items-center bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-800 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg shadow-cyan-500/20 mt-3"
          >
            {isLoading ? <LoadingSpinner /> : 'Get Signal'}
          </button>

          <button
            onClick={downloadExtensionManifest}
            className="w-full flex justify-center items-center bg-cyan-900/30 hover:bg-cyan-900/50 text-cyan-400 font-medium py-2 px-4 rounded-lg transition duration-200 border border-cyan-700 text-sm mt-2"
            title="Download manifest to run as Chrome Side Panel"
          >
            <span className="mr-2"><ChromeIcon /></span>
            Export Extension
          </button>
        </div>
      </div>
      <StrategyInfoModal isOpen={isStrategyModalOpen} onClose={() => setIsStrategyModalOpen(false)} />
      <AnalysisInfoModal isOpen={isAnalysisModalOpen} onClose={() => setIsAnalysisModalOpen(false)} />
    </>
  );
};

export default ControlPanel;
