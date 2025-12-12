
import { CurrencyPair, FundamentalData } from '../types';

// In a real application, this would fetch data from economic calendars and news APIs.
// For this demo, we simulate realistic-looking fundamental data snapshots.

const fundamentalDb: Record<CurrencyPair, FundamentalData> = {
    'EUR/USD': {
        interestRateDifferential: 'Favoring USD',
        gdpOutlook: 'US Moderate, EU Slowing',
        inflationaryPressure: 'Higher in US',
        keyReports: 'US CPI, ECB Rate Decision',
    },
    'GBP/JPY': {
        interestRateDifferential: 'Favoring GBP',
        gdpOutlook: 'UK Stagnant, JP Modest',
        inflationaryPressure: 'High in UK',
        keyReports: 'BoE Minutes, Japan Tankan',
    },
    'AUD/USD': {
        interestRateDifferential: 'Neutral',
        gdpOutlook: 'China data is key',
        inflationaryPressure: 'Both high',
        keyReports: 'RBA Statement, US NFP',
    },
    'USD/CAD': {
        interestRateDifferential: 'Slightly Favoring USD',
        gdpOutlook: 'Oil prices influencing CAD',
        inflationaryPressure: 'Both Persistent',
        keyReports: 'US Retail Sales, CA Jobs',
    },
    'USD/JPY': {
        interestRateDifferential: 'Strongly Favoring USD',
        gdpOutlook: 'Policy Divergence',
        inflationaryPressure: 'Low in Japan',
        keyReports: 'BoJ Outlook, US PPI',
    },
    'USD/CHF': {
        interestRateDifferential: 'Favoring USD',
        gdpOutlook: 'SNB intervention risk',
        inflationaryPressure: 'Controlled in CH',
        keyReports: 'SNB Rate Decision, US PCE',
    },
    'NZD/USD': {
        interestRateDifferential: 'Neutral',
        gdpOutlook: 'Global risk sentiment',
        inflationaryPressure: 'Both high',
        keyReports: 'RBNZ Statement, US GDP',
    },
    'BTC/USD': {
        interestRateDifferential: 'N/A',
        gdpOutlook: 'Macro correlation',
        inflationaryPressure: 'Hedge asset debate',
        keyReports: 'SEC News, ETF Flows',
    }
};

export const getFundamentalData = (pair: CurrencyPair): FundamentalData => {
  return fundamentalDb[pair] || {
    interestRateDifferential: 'N/A',
    gdpOutlook: 'N/A',
    inflationaryPressure: 'N/A',
    keyReports: 'N/A',
  };
};
