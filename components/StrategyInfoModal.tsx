
import React from 'react';
import { TRADING_STRATEGIES, STRATEGY_DESCRIPTIONS } from '../constants';
import { CloseIcon } from './icons/CloseIcon';

interface StrategyInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const StrategyInfoModal: React.FC<StrategyInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl w-full max-w-lg p-6 relative animate-fade-in"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
      >
        <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-3">
            <h2 className="text-xl font-bold text-white">Trading Strategy Explanations</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close modal">
                <CloseIcon />
            </button>
        </div>
        
        <ul className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {TRADING_STRATEGIES.map(strategy => (
                <li key={strategy}>
                    <h3 className="font-semibold text-cyan-400">{strategy}</h3>
                    <p className="text-gray-300 text-sm mt-1">{STRATEGY_DESCRIPTIONS[strategy]}</p>
                </li>
            ))}
        </ul>

      </div>
    </div>
  );
};

export default StrategyInfoModal;
