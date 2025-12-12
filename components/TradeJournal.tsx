import React, { useState } from 'react';
import { Trade, CurrencyPair, Timeframe, Signal, Strategy, AnalysisType } from '../types';
import { CURRENCY_PAIRS, TIME_FRAMES } from '../constants';

interface TradeJournalProps {
  trades: Trade[];
  setTrades: (trades: Trade[]) => void;
}

const TradeJournal: React.FC<TradeJournalProps> = ({ trades, setTrades }) => {
  const [showForm, setShowForm] = useState(false);
  // Fix: Explicitly type the form state to prevent type inference issues on the `pair` property.
  const [formState, setFormState] = useState<{
      pair: CurrencyPair;
      signal: Signal;
      outcome: Trade['outcome'];
      entryPrice: string;
      notes: string;
  }>({
      pair: CURRENCY_PAIRS[0],
      signal: 'BUY',
      outcome: 'Win',
      entryPrice: '',
      notes: ''
  });

  const handleAddTrade = (e: React.FormEvent) => {
    e.preventDefault();
    const newTrade: Trade = {
        id: new Date().toISOString(),
        timestamp: Date.now(),
        pair: formState.pair,
        signal: formState.signal,
        outcome: formState.outcome,
        entryPrice: parseFloat(formState.entryPrice),
        notes: formState.notes,
        // These are placeholders for manual entry
        timeframe: '5m' as Timeframe,
        strategy: 'Manual Entry' as Strategy,
        analysisType: 'Technical' as AnalysisType,
    };
    setTrades([newTrade, ...trades]);
    setShowForm(false);
    // Reset form
    setFormState({ pair: CURRENCY_PAIRS[0], signal: 'BUY', outcome: 'Win', entryPrice: '', notes: '' });
  };
  
  const getOutcomeColor = (outcome: Trade['outcome']) => {
      if(outcome === 'Win') return 'text-green-400';
      if(outcome === 'Loss') return 'text-red-400';
      return 'text-gray-400';
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white text-center">Trade Journal</h2>
        <button onClick={() => setShowForm(!showForm)} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-3 rounded-lg text-sm">
          {showForm ? 'Close' : 'Add Trade'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddTrade} className="space-y-3 p-3 bg-gray-700/50 rounded-lg mb-4">
            <div className="grid grid-cols-2 gap-2">
                <select value={formState.pair} onChange={e => setFormState({...formState, pair: e.target.value as CurrencyPair})} className="bg-gray-600 rounded p-2 text-sm w-full">
                    {CURRENCY_PAIRS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <input type="number" step="any" placeholder="Entry Price" value={formState.entryPrice} onChange={e => setFormState({...formState, entryPrice: e.target.value})} required className="bg-gray-600 rounded p-2 text-sm w-full"/>
                <select value={formState.signal} onChange={e => setFormState({...formState, signal: e.target.value as Signal})} className="bg-gray-600 rounded p-2 text-sm w-full">
                    <option>BUY</option><option>SELL</option>
                </select>
                <select value={formState.outcome} onChange={e => setFormState({...formState, outcome: e.target.value as Trade['outcome']})} className="bg-gray-600 rounded p-2 text-sm w-full">
                    <option>Win</option><option>Loss</option><option>Breakeven</option>
                </select>
            </div>
          <textarea placeholder="Notes..." value={formState.notes} onChange={e => setFormState({...formState, notes: e.target.value})} className="bg-gray-600 rounded p-2 text-sm w-full min-h-[60px]"></textarea>
          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded-lg text-sm">Save Trade</button>
        </form>
      )}

      <div className="flex-grow overflow-y-auto max-h-80 pr-2">
        {trades.length > 0 ? (
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-gray-800">
              <tr>
                <th className="p-2">Pair</th>
                <th className="p-2">Signal</th>
                <th className="p-2">Outcome</th>
              </tr>
            </thead>
            <tbody>
              {trades.map(trade => (
                <tr key={trade.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                  <td className="p-2">{trade.pair}</td>
                  <td className="p-2">{trade.signal}</td>
                  <td className={`p-2 font-semibold ${getOutcomeColor(trade.outcome)}`}>{trade.outcome}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center text-gray-500 py-4">No trades logged yet.</div>
        )}
      </div>
    </div>
  );
};

export default TradeJournal;