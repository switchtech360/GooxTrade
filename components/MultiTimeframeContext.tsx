
import React from 'react';
import { ArrowUpIcon } from './icons/ArrowUpIcon';
import { ArrowDownIcon } from './icons/ArrowDownIcon';
import { MinusIcon } from './icons/MinusIcon';

interface MultiTimeframeContextProps {
  trend: string;
}

const MultiTimeframeContext: React.FC<MultiTimeframeContextProps> = ({ trend }) => {
  const trendConfig = {
    'Uptrend': { color: 'text-green-400', icon: <ArrowUpIcon /> },
    'Downtrend': { color: 'text-red-400', icon: <ArrowDownIcon /> },
    'Neutral': { color: 'text-gray-400', icon: <MinusIcon /> },
  };

  const { color, icon } = trendConfig[trend as keyof typeof trendConfig] || trendConfig['Neutral'];

  return (
    <div className="bg-gray-800 p-4 rounded-2xl shadow-lg border border-gray-700 h-full flex flex-col justify-center text-center">
      <h3 className="text-md font-bold text-white mb-2">4h Trend Context</h3>
      <div className={`flex items-center justify-center space-x-2 ${color}`}>
        <div className="w-6 h-6">{icon}</div>
        <p className="text-lg font-semibold">{trend}</p>
      </div>
       <p className="text-xs text-gray-400 mt-2">vs. 4h SMA(20)</p>
    </div>
  );
};

export default MultiTimeframeContext;
