
import React from 'react';
import { SignalResponse } from '../types';
import { ArrowUpIcon } from './icons/ArrowUpIcon';
import { ArrowDownIcon } from './icons/ArrowDownIcon';
import { MinusIcon } from './icons/MinusIcon';

interface SignalCardProps {
  signalResponse: SignalResponse | null;
  lastUpdated: Date | null;
}

const SignalCard: React.FC<SignalCardProps> = ({ signalResponse, lastUpdated }) => {
  const signal = signalResponse?.signal || 'HOLD';
  const confidence = signalResponse?.confidence || 0;

  const signalConfig = {
    BUY: {
      baseColor: '#22c55e', // green-500
      textColor: 'text-green-400',
      icon: <ArrowUpIcon />,
      text: 'BUY'
    },
    SELL: {
      baseColor: '#ef4444', // red-500
      textColor: 'text-red-400',
      icon: <ArrowDownIcon />,
      text: 'SELL'
    },
    HOLD: {
      baseColor: '#6b7280', // gray-500
      textColor: 'text-gray-400',
      icon: <MinusIcon />,
      text: 'HOLD'
    },
  };

  const { baseColor, textColor, icon, text } = signalConfig[signal];
  const circumference = 2 * Math.PI * 45; // 2 * pi * radius
  const strokeDashoffset = circumference - (confidence / 100) * circumference;

  return (
    <div className={`flex flex-col items-center p-4 rounded-2xl h-full shadow-lg border border-gray-700 bg-gray-800`}>
        <div className="text-sm text-gray-400 mb-2 font-medium tracking-wide">Signal Status</div>
        
        <div className="relative w-40 h-40 flex items-center justify-center mb-4">
            <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                    className="text-gray-700"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="45"
                    cx="50"
                    cy="50"
                />
                {/* Progress circle */}
                <circle
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                    stroke={baseColor}
                    fill="transparent"
                    r="45"
                    cx="50"
                    cy="50"
                    style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                />
            </svg>
            <div className="absolute flex flex-col items-center">
                 <div className={`w-8 h-8 ${textColor} mb-1`}>{icon}</div>
                 <div className={`text-2xl font-bold ${textColor}`}>{text}</div>
                 <div className="text-lg font-semibold text-white">{confidence}%</div>
                 <div className="text-[10px] text-gray-500 uppercase">Confidence</div>
            </div>
        </div>

        {signalResponse && signal !== 'HOLD' ? (
             <div className="w-full mb-4 animate-fade-in">
                 <div className="text-[10px] text-gray-500 text-center uppercase font-bold tracking-widest mb-2 border-b border-gray-700 pb-1">MT4/MT5 Targets</div>
                 <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-700/30 border border-red-500/20 rounded-lg p-2.5 flex flex-col items-center hover:bg-gray-700/50 transition-colors">
                        <span className="text-[10px] text-red-400 uppercase font-bold tracking-wider mb-0.5">Stop Loss</span>
                        <span className="text-lg font-mono text-white font-bold select-all cursor-text" title="Click to select for MT4/5">{signalResponse.stopLoss}</span>
                    </div>
                     <div className="bg-gray-700/30 border border-green-500/20 rounded-lg p-2.5 flex flex-col items-center hover:bg-gray-700/50 transition-colors">
                        <span className="text-[10px] text-green-400 uppercase font-bold tracking-wider mb-0.5">Take Profit</span>
                        <span className="text-lg font-mono text-white font-bold select-all cursor-text" title="Click to select for MT4/5">{signalResponse.takeProfit}</span>
                    </div>
                 </div>
             </div>
        ) : (
             <div className="w-full bg-gray-700/20 rounded-lg p-3 mb-4 flex items-center justify-center border border-dashed border-gray-700">
                 <span className="text-gray-500 text-sm">Target levels await signal...</span>
             </div>
        )}

       <div className="mt-auto pt-2 border-t border-gray-700 w-full text-center">
           {lastUpdated ? (
            <div className="text-xs text-gray-500">
              Updated: <span className="text-gray-400">{lastUpdated.toLocaleTimeString()}</span>
            </div>
          ) : (
             <div className="text-xs text-gray-500">System Ready</div>
          )}
       </div>
    </div>
  );
};

export default SignalCard;
