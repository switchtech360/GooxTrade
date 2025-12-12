
import { CurrencyPair, EconomicEvent } from '../types';

const getNextEventTime = (hour: number, minute: number): string => {
    const now = new Date();
    const eventTime = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), hour, minute, 0));
    if (eventTime < now) {
        eventTime.setUTCDate(eventTime.getUTCDate() + 1);
    }
    return eventTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) + ' UTC';
};

const allEvents: Omit<EconomicEvent, 'time'>[] = [
  { currency: 'USD', impact: 'High', event: 'Non-Farm Payrolls' },
  { currency: 'USD', impact: 'High', event: 'CPI Report' },
  { currency: 'USD', impact: 'High', event: 'FOMC Rate Decision' },
  { currency: 'EUR', impact: 'High', event: 'ECB Rate Decision' },
  { currency: 'EUR', impact: 'Medium', event: 'German ZEW Economic Sentiment' },
  { currency: 'GBP', impact: 'High', event: 'BoE Rate Decision' },
  { currency: 'GBP', impact: 'Medium', event: 'Retail Sales' },
  { currency: 'JPY', impact: 'High', event: 'BoJ Outlook Report' },
  { currency: 'JPY', impact: 'Low', event: 'Tankan Manufacturing Index' },
  { currency: 'CAD', impact: 'High', event: 'Employment Change' },
  { currency: 'AUD', impact: 'High', event: 'RBA Rate Statement' },
  { currency: 'NZD', impact: 'Medium', event: 'RBNZ Rate Statement' },
  { currency: 'CHF', impact: 'High', event: 'SNB Rate Decision' },
  { currency: 'BTC', impact: 'High', event: 'SEC ETF News' },
];

export const getEconomicEvents = (pair: CurrencyPair): EconomicEvent[] => {
  const [base, quote] = pair.split('/');
  const relevantCurrencies = [base, quote];
  if (pair === 'BTC/USD') relevantCurrencies.push('BTC');

  return allEvents
    .filter(event => relevantCurrencies.includes(event.currency))
    .map((event, index) => ({
      ...event,
      // Assign somewhat realistic but varied times
      time: getNextEventTime(2 * index + 8, index % 2 === 0 ? 30 : 0),
    }))
    .slice(0, 5); // Limit to a few upcoming events
};
