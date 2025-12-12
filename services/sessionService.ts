
import { CurrencyPair, SessionName } from '../types';

interface SessionDetails {
  name: SessionName;
  startUTC: number; // Hour in UTC
  endUTC: number;   // Hour in UTC
  hoursUTC: string;
}

const SESSIONS: SessionDetails[] = [
  { name: 'Tokyo', startUTC: 0, endUTC: 9, hoursUTC: '00:00 - 09:00 UTC' },
  { name: 'London', startUTC: 8, endUTC: 17, hoursUTC: '08:00 - 17:00 UTC' },
  { name: 'New York', startUTC: 13, endUTC: 22, hoursUTC: '13:00 - 22:00 UTC' },
];

export const getSessionStates = (pair: CurrencyPair) => {
  const now = new Date();
  const currentUTCHour = now.getUTCHours();
  
  const peakSession = getPeakSessionForPair(pair);

  return SESSIONS.map(session => {
    // Check for session wrap-around is not needed for these times
    const isActive = currentUTCHour >= session.startUTC && currentUTCHour < session.endUTC;
    return {
      name: session.name,
      isActive,
      isPeak: session.name === peakSession,
      hoursUTC: session.hoursUTC,
    };
  });
};

const getPeakSessionForPair = (pair: CurrencyPair): SessionName => {
  const pairUpper = pair.toUpperCase();
  if (pairUpper.includes('JPY')) return 'Tokyo';
  if (pairUpper.includes('EUR') || pairUpper.includes('GBP') || pairUpper.includes('CHF')) return 'London';
  if (pairUpper.includes('USD') || pairUpper.includes('CAD') || pairUpper.includes('BTC')) return 'New York';
  // Default for pairs like AUD/USD which are active across multiple sessions, but London often has high volume.
  return 'London';
};

export const getActiveSessionImpactDescription = (pair: CurrencyPair): string => {
    const activeSessions = getSessionStates(pair).filter(s => s.isActive);
    if (activeSessions.length === 0) {
        return "The market is in a quiet phase between major sessions. Expect lower liquidity.";
    }
    
    const isOverlap = activeSessions.length > 1;
    const sessionNames = activeSessions.map(s => s.name).join(' and ');

    if (isOverlap) {
        return `High liquidity and volatility expected as the ${sessionNames} sessions are overlapping.`;
    }

    const peakSession = getPeakSessionForPair(pair);
    const isPeakTime = activeSessions.some(s => s.name === peakSession);

    if (isPeakTime) {
        return `The ${sessionNames} session is active, which is the peak time for ${pair}, expect high volume.`;
    }

    return `Moderate activity expected during the ${sessionNames} session for this pair.`;
}
