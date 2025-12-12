
import React, { useState, useEffect } from 'react';
import { getSessionStates } from '../services/sessionService';
import { CurrencyPair, TradingSessionInfo } from '../types';

interface TradingSessionProps {
  currencyPair: CurrencyPair;
}

const TradingSession: React.FC<TradingSessionProps> = ({ currencyPair }) => {
  const [sessions, setSessions] = useState<TradingSessionInfo[]>([]);

  useEffect(() => {
    const updateSessions = () => {
      setSessions(getSessionStates(currencyPair));
    };

    updateSessions(); // Initial call
    const intervalId = setInterval(updateSessions, 60000); // Update every minute

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [currencyPair]);

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
      <h2 className="text-xl font-bold text-white text-center mb-4">Trading Sessions</h2>
      <ul className="space-y-3">
        {sessions.map(({ name, isActive, isPeak, hoursUTC }) => (
          <li key={name} className="relative group flex items-center justify-between">
            <div className="flex items-center">
              <span className={`h-3 w-3 rounded-full mr-3 transition-colors ${isActive ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`}></span>
              <span className={`${isActive ? 'text-green-300 font-semibold' : 'text-gray-300'}`}>{name}</span>
            </div>
            {isPeak && (
              <span className="text-xs font-semibold bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-md">
                PEAK
              </span>
            )}
            {/* Tooltip */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                {hoursUTC}
                <div className="tooltip-arrow" data-popper-arrow></div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TradingSession;
