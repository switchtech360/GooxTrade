
import React from 'react';
import { ANALYSIS_TYPES, ANALYSIS_DESCRIPTIONS } from '../constants';
import { CloseIcon } from './icons/CloseIcon';

interface AnalysisInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AnalysisInfoModal: React.FC<AnalysisInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl w-full max-w-lg p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-3">
            <h2 className="text-xl font-bold text-white">Analysis Type Explanations</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close modal">
                <CloseIcon />
            </button>
        </div>
        
        <ul className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {ANALYSIS_TYPES.map(analysisType => (
                <li key={analysisType}>
                    <h3 className="font-semibold text-cyan-400">{analysisType}</h3>
                    <p className="text-gray-300 text-sm mt-1">{ANALYSIS_DESCRIPTIONS[analysisType]}</p>
                </li>
            ))}
        </ul>

      </div>
    </div>
  );
};

export default AnalysisInfoModal;
