
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
    <div className={`flex flex-col items-center justify-between p-4 rounded-2xl h-full shadow-lg border border-gray-700 bg-gray-800`}>
        <div className="text-sm text-gray-400">Current Signal</div>
        <div className="relative w-40 h-40 flex items-center justify-center my-2">
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
                 <div className={`w-8 h-8 ${textColor}`}>{icon}</div>
                 <div className={`text-2xl font-bold ${textColor}`}>{text}</div>
                 <div className="text-lg font-semibold text-white">{confidence}%</div>
                 <div className="text-xs text-gray-500">Confidence</div>
            </div>
        </div>
       {lastUpdated ? (
        <div className="text-xs text-gray-500">
          Updated: {lastUpdated.toLocaleTimeString()}
        </div>
      ) : (
         <div className="text-xs text-gray-500">Awaiting signal...</div>
      )}
    </div>
  );
};

export default SignalCard;
