
import { Signal, CurrencyPair } from '../types';

export const speak = (signal: Signal, currencyPair: CurrencyPair): void => {
  if ('speechSynthesis' in window) {
    // Cancel any previous speech to prevent overlapping messages
    window.speechSynthesis.cancel();
    
    const formattedPair = currencyPair.replace('/', ' ');
    let text = '';

    switch (signal) {
      case 'BUY':
        text = `Take action: BUY ${formattedPair} now.`;
        break;
      case 'SELL':
        text = `Take action: SELL ${formattedPair} now.`;
        break;
      case 'HOLD':
        text = `Wait. Upcoming signal for ${formattedPair}.`;
        break;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1;
    
    window.speechSynthesis.speak(utterance);
  } else {
    console.warn('Text-to-speech not supported in this browser.');
  }
};
