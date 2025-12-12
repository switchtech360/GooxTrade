
import React from 'react';
import { VolatilityInfo } from '../types';

interface VolatilityMeterProps {
  volatility: VolatilityInfo;
}

const VolatilityMeter: React.FC<VolatilityMeterProps> = ({ volatility }) => {
  const levelConfig = {
    'Low': { width: '25%', color: 'bg-green-500' },
    'Moderate': { width: '50%', color: 'bg-yellow-500' },
    'High': { width: '75%', color: 'bg-orange-500' },
    'Very High': { width: '100%', color: 'bg-red-500' },
  };

  const { width, color } = levelConfig[volatility.level];

  return (
    <div className="bg-gray-800 p-4 rounded-2xl shadow-lg border border-gray-700 h-full flex flex-col justify-center text-center">
      <h3 className="text-md font-bold text-white mb-2">Volatility</h3>
      <div className="w-full bg-gray-600 rounded-full h-4 mb-2">
        <div
          className={`h-4 rounded-full ${color} transition-all duration-500`}
          style={{ width: width }}
        ></div>
      </div>
      <p className={`text-lg font-semibold ${color.replace('bg-', 'text-')}`}>{volatility.level}</p>
      <p className="text-xs text-gray-400">ATR: {volatility.atr.toFixed(5)}</p>
    </div>
  );
};

export default VolatilityMeter;
