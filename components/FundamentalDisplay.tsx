
import React from 'react';
import { FundamentalData } from '../types';

interface FundamentalDisplayProps {
  fundamentalData: FundamentalData | null;
}

const FundamentalDisplay: React.FC<FundamentalDisplayProps> = ({ fundamentalData }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
      <h2 className="text-xl font-bold text-white text-center mb-4">Fundamental Snapshot</h2>
      {fundamentalData ? (
        <ul className="space-y-3 text-sm">
          <li className="flex justify-between items-center">
            <span className="text-gray-400">Interest Rate Outlook:</span>
            <span className="text-gray-200 font-medium">{fundamentalData.interestRateDifferential}</span>
          </li>
          <li className="flex justify-between items-center">
            <span className="text-gray-400">GDP Outlook:</span>
            <span className="text-gray-200 font-medium">{fundamentalData.gdpOutlook}</span>
          </li>
          <li className="flex justify-between items-center">
            <span className="text-gray-400">Inflation Pressure:</span>
            <span className="text-gray-200 font-medium">{fundamentalData.inflationaryPressure}</span>
          </li>
          <li className="flex justify-between items-center">
            <span className="text-gray-400">Key Reports:</span>
            <span className="text-gray-200 font-medium">{fundamentalData.keyReports}</span>
          </li>
        </ul>
      ) : (
        <div className="text-center text-gray-500 text-sm py-4">
          <p>Fundamental data will appear here...</p>
        </div>
      )}
    </div>
  );
};

export default FundamentalDisplay;
