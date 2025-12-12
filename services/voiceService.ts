
import { Signal, CurrencyPair } from '../types';

const playAlertTone = () => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        // Distinct "Ping" sound for alert
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime); // High pitch start
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.3); // Drop pitch

        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

        osc.start();
        osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
        console.error("Audio alert error", e);
    }
};

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

export const announceDivergence = (type: string, currencyPair: CurrencyPair): void => {
    // Play alert tone first
    playAlertTone();

    if ('speechSynthesis' in window) {
        // Short delay to let the tone finish starting
        setTimeout(() => {
            const formattedPair = currencyPair.replace('/', ' ');
            const text = `Alert! ${type} divergence on ${formattedPair}.`;
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = 1.0;
            utterance.pitch = 1.1; // Slightly higher pitch for alert
            
            window.speechSynthesis.speak(utterance);
        }, 300);
    }
};
