
import React from 'react';
import { EconomicEvent } from '../types';

interface EconomicCalendarProps {
  events: EconomicEvent[];
}

const EconomicCalendar: React.FC<EconomicCalendarProps> = ({ events }) => {

  const getImpactColor = (impact: EconomicEvent['impact']) => {
    switch (impact) {
      case 'High': return 'bg-red-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-blue-500';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-bold text-white text-center mb-4">Upcoming Events</h2>
      {events.length > 0 ? (
        <ul className="space-y-3 overflow-y-auto max-h-96">
          {events.map((item, index) => (
            <li key={index} className="flex items-center p-2 bg-gray-700/50 rounded-lg">
              <div className="flex flex-col items-center justify-center mr-3">
                <div className={`w-3 h-3 rounded-full ${getImpactColor(item.impact)}`} title={`Impact: ${item.impact}`}></div>
                <div className="text-sm font-bold text-gray-200 mt-1">{item.currency}</div>
              </div>
              <div className="flex-grow">
                <p className="text-sm text-gray-300">{item.event}</p>
                <p className="text-xs text-gray-400">{item.time}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
         <div className="text-center text-gray-500 py-4">No major events for this pair.</div>
      )}
    </div>
  );
};

export default EconomicCalendar;
