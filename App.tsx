
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { CURRENCY_PAIRS, TIME_FRAMES, STRATEGY_ANALYSIS_MAP, ANALYSIS_TYPES } from './constants';
import { Signal, Candle, Strategy, Timeframe, CurrencyPair, SignalResponse, Indicators, AnalysisType, FundamentalData, ChatMessage, Trade, EconomicEvent, VolatilityInfo } from './types';
import { fetchMarketData } from './services/marketDataService';
import { calculateIndicators, calculateVolatility } from './services/technicalAnalysisService';
import { getTradingSignal, getFollowUpAnalysis } from './services/geminiService';
import { getSessionStates, getActiveSessionImpactDescription } from './services/sessionService';
import { getMarketSentiment } from './services/sentimentService';
import { getFundamentalData } from './services/fundamentalAnalysisService';
import { getEconomicEvents } from './services/economicCalendarService';
import { useLocalStorage } from './hooks/useLocalStorage';
import { speak } from './services/voiceService';
import { downloadExtensionManifest } from './services/extensionGenerator';

// Components
import ControlPanel from './components/ControlPanel';
import SignalCard from './components/SignalCard';
import AnalysisPanel from './components/AnalysisPanel';
import IndicatorDisplay from './components/IndicatorDisplay';
import TradingSession from './components/TradingSession';
import PriceChart from './components/PriceChart';
import FundamentalDisplay from './components/FundamentalDisplay';
import EconomicCalendar from './components/EconomicCalendar';
import VolatilityMeter from './components/VolatilityMeter';
import MultiTimeframeContext from './components/MultiTimeframeContext';
import TradeJournal from './components/TradeJournal';
import ExtensionGuideModal from './components/ExtensionGuideModal';
import { BellIcon } from './components/icons/BellIcon';
import { CalendarIcon } from './components/icons/CalendarIcon';
import { JournalIcon } from './components/icons/JournalIcon';
import { SettingsIcon } from './components/icons/SettingsIcon';
import { ChromeIcon } from './components/icons/ChromeIcon';
import { DownloadIcon } from './components/icons/DownloadIcon';


const App: React.FC = () => {
  // Main State
  const [currencyPair, setCurrencyPair] = useState<CurrencyPair>(CURRENCY_PAIRS[0]);
  const [timeframe, setTimeframe] = useState<Timeframe>(TIME_FRAMES[1]);
  const [analysisType, setAnalysisType] = useState<AnalysisType>(ANALYSIS_TYPES[0]);
  const [availableStrategies, setAvailableStrategies] = useState(STRATEGY_ANALYSIS_MAP[analysisType]);
  const [strategy, setStrategy] = useState<Strategy>(availableStrategies[0]);

  // Loading & Data State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [marketData, setMarketData] = useState<Candle[]>([]);
  const [indicators, setIndicators] = useState<Indicators | null>(null);
  const [fundamentalData, setFundamentalData] = useState<FundamentalData | null>(null);
  const [volatility, setVolatility] = useState<VolatilityInfo>({ atr: 0, level: 'Low' });
  const [higherTfTrend, setHigherTfTrend] = useState('Neutral');
  const [economicEvents, setEconomicEvents] = useState<EconomicEvent[]>([]);
  
  // Signal & AI Chat State
  const [signalResponse, setSignalResponse] = useState<SignalResponse | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const initialWelcomeMessage = 'Welcome to the AI Trading Signal Assistant. Configure your parameters and click "Get Signal" to begin. You can ask follow-up questions after a signal is generated. This tool is for educational purposes only.';
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Feature State
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [autoCyclePairs, setAutoCyclePairs] = useState(false);
  const [activeTab, setActiveTab] = useState<'controls' | 'journal' | 'calendar'>('controls');
  const [trades, setTrades] = useLocalStorage<Trade[]>('tradeJournal', []);
  const [isExtensionModalOpen, setIsExtensionModalOpen] = useState(false);

  // PWA Install State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  // Notifications
  const [notificationsEnabled, setNotificationsEnabled] = useState(Notification.permission === 'granted');
  const [showNotificationBanner, setShowNotificationBanner] = useState(Notification.permission === 'default');

  const aiRef = useRef(new GoogleGenAI({ apiKey: process.env.API_KEY as string }));

  // Dynamic Strategy Filtering Effect
  useEffect(() => {
    const newStrategies = STRATEGY_ANALYSIS_MAP[analysisType];
    setAvailableStrategies(newStrategies);
    if (!newStrategies.includes(strategy)) {
      setStrategy(newStrategies[0]);
    }
  }, [analysisType, strategy]);
  
  // Initial Data Load
  useEffect(() => {
    setEconomicEvents(getEconomicEvents(currencyPair));
  },[currencyPair])

  // PWA Install Prompt Listener
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Auto-Refresh Effect
  useEffect(() => {
    let interval: number;
    if (autoRefresh && marketData.length > 0) {
      interval = window.setInterval(() => {
        handleGetSignal();
      }, 30000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh, marketData]);

  const handleGetSignal = useCallback(async (isInitial = true) => {
    setIsLoading(true);
    if (isInitial) {
        setChatHistory([]);
        setSignalResponse(null);
    }
    setError(null);
    
    try {
      const data = fetchMarketData(currencyPair, timeframe, 100);
      const higherTfData = fetchMarketData(currencyPair, '4h', 50);
      setMarketData(data);

      const calculatedIndicators = calculateIndicators(data);
      const calculatedVolatility = calculateVolatility(data);
      const sma20_htf = calculateIndicators(higherTfData).sma20;
      const currentPrice_htf = higherTfData[higherTfData.length - 1].close;
      
      setIndicators(calculatedIndicators);
      setVolatility(calculatedVolatility);
      setHigherTfTrend(currentPrice_htf > sma20_htf ? 'Uptrend' : 'Downtrend');
      
      const fundamentalInfo = getFundamentalData(currencyPair);
      setFundamentalData(fundamentalInfo);
      
      const sessionImpact = getActiveSessionImpactDescription(currencyPair);
      const marketSentiment = getMarketSentiment(currencyPair);
      
      const response = await getTradingSignal(
        aiRef.current, currencyPair, timeframe, strategy, analysisType, data, calculatedIndicators,
        sessionImpact, marketSentiment, fundamentalInfo, calculatedVolatility,
        higherTfTrend
      );

      setSignalResponse(response);
      setChatHistory([{ role: 'assistant', content: response.reasoning }]);
      setLastUpdated(new Date());

      speak(response.signal, currencyPair);

      if (notificationsEnabled && isInitial) {
        new Notification('New AI Trading Signal', {
          body: `${currencyPair}: ${response.signal} (Confidence: ${response.confidence}%)`,
        });
      }

      if (autoCyclePairs) {
        const activePairs = CURRENCY_PAIRS.filter(pair => getSessionStates(pair).some(session => session.isActive));
        if (activePairs.length > 0) {
            const currentIndexInActiveList = activePairs.indexOf(currencyPair);
            const nextIndex = (currentIndexInActiveList === -1) ? 0 : (currentIndexInActiveList + 1) % activePairs.length;
            const nextPair = activePairs[nextIndex];
            setTimeout(() => {
                setCurrencyPair(nextPair);
            }, 2000);
        }
      }

    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(`Failed to get signal. ${errorMessage}`);
      setChatHistory([{ role: 'assistant', content: `Error: Could not retrieve analysis.` }]);
    } finally {
      setIsLoading(false);
    }
  }, [currencyPair, timeframe, strategy, analysisType, notificationsEnabled, autoCyclePairs]);

  const handleSendMessage = useCallback(async (message: string) => {
    const newHistory: ChatMessage[] = [...chatHistory, { role: 'user', content: message }];
    setChatHistory(newHistory);
    setIsStreaming(true);

    try {
      const response = await getFollowUpAnalysis(aiRef.current, signalResponse, newHistory);
      setChatHistory(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (err) {
      console.error(err);
      setChatHistory(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsStreaming(false);
    }
  }, [chatHistory, signalResponse]);
  
  const handleRequestNotificationPermission = async () => {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === 'granted');
      setShowNotificationBanner(false);
  };
  
  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallButton(false);
    }
    setDeferredPrompt(null);
  };

  const TabButton: React.FC<{ tabName: typeof activeTab, label: string, icon: React.ReactNode }> = ({ tabName, label, icon }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`flex items-center justify-center sm:justify-start w-full sm:w-auto sm:flex-grow text-sm sm:text-base px-3 py-3 font-medium rounded-t-lg transition-colors ${
        activeTab === tabName
          ? 'bg-gray-800 text-cyan-400 border-b-2 border-cyan-400'
          : 'bg-transparent text-gray-400 hover:bg-gray-700/50'
      }`}
    >
      {icon}
      <span className="hidden sm:inline ml-2">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-2 sm:p-4 lg:p-6 pb-20 sm:pb-4">
      <div className="w-full max-w-screen-2xl mx-auto">
        <header className="flex justify-between items-center mb-4 sm:mb-6">
          <div className="text-center sm:text-left">
            <h1 className="text-xl sm:text-4xl font-bold text-cyan-400 leading-tight">AI Trading Bot</h1>
            <p className="text-gray-400 mt-1 text-[10px] sm:text-base">Gemini-Powered Signals</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
             {showInstallButton && (
                <button
                    onClick={handleInstallClick}
                    className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-3 py-2 rounded-lg text-sm font-bold shadow-lg animate-pulse"
                >
                    <DownloadIcon />
                    <span className="hidden sm:inline">Install App</span>
                </button>
             )}

             <button
                onClick={() => setIsExtensionModalOpen(true)}
                className="hidden sm:flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-cyan-400 border border-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                title="Chrome Extension Guide"
            >
                <ChromeIcon />
                <span>Ext. Guide</span>
            </button>
            <button
                onClick={() => setIsExtensionModalOpen(true)}
                className="sm:hidden p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-cyan-400 border border-gray-700 transition-colors"
                title="Chrome Extension Guide"
            >
                <ChromeIcon />
            </button>
            
            <button
                onClick={handleRequestNotificationPermission}
                className={`p-2 rounded-full transition-colors ${notificationsEnabled ? 'bg-cyan-600/30 text-cyan-400' : 'bg-gray-700 hover:bg-gray-600'}`}
                aria-label="Enable Notifications"
            >
                <BellIcon />
            </button>
          </div>
        </header>

        {showNotificationBanner && (
            <div className="bg-cyan-900/50 border border-cyan-700 text-cyan-200 px-4 py-3 rounded-lg relative mb-4 flex justify-between items-center text-sm">
                <span>Enable notifications for signals.</span>
                <div>
                    <button onClick={handleRequestNotificationPermission} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-1 px-3 rounded-md mr-2">OK</button>
                    <button onClick={() => setShowNotificationBanner(false)} className="font-bold text-lg">&times;</button>
                </div>
            </div>
        )}

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3 flex flex-col gap-6 order-2 lg:order-1">
             <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl flex flex-col">
              <div className="flex justify-around border-b border-gray-700 px-2 pt-2">
                <TabButton tabName="controls" label="Config" icon={<SettingsIcon />} />
                <TabButton tabName="journal" label="Journal" icon={<JournalIcon />} />
                <TabButton tabName="calendar" label="News" icon={<CalendarIcon />} />
              </div>
              <div className="p-4 sm:p-6">
                {activeTab === 'controls' && (
                    <ControlPanel
                        currencyPair={currencyPair} setCurrencyPair={setCurrencyPair}
                        timeframe={timeframe} setTimeframe={setTimeframe}
                        strategy={strategy} setStrategy={setStrategy}
                        analysisType={analysisType} setAnalysisType={setAnalysisType}
                        availableStrategies={availableStrategies}
                        onGetSignal={() => handleGetSignal(true)} isLoading={isLoading || isStreaming}
                        autoRefresh={autoRefresh} setAutoRefresh={setAutoRefresh}
                        autoCyclePairs={autoCyclePairs} setAutoCyclePairs={setAutoCyclePairs}
                    />
                )}
                {activeTab === 'journal' && <TradeJournal trades={trades} setTrades={setTrades} />}
                {activeTab === 'calendar' && <EconomicCalendar events={economicEvents} />}
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col gap-6 order-1 lg:order-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SignalCard signalResponse={signalResponse} lastUpdated={lastUpdated} />
              <div className="md:col-span-2 hidden md:block">
                 <IndicatorDisplay indicators={indicators} />
              </div>
            </div>
            {/* Mobile Indicator View (Simplified) */}
            <div className="md:hidden">
                <IndicatorDisplay indicators={indicators} />
            </div>
            <PriceChart data={marketData} currencyPair={currencyPair} signalResponse={signalResponse} />
          </div>
          
          <div className="lg:col-span-3 flex flex-col gap-6 order-3">
             <AnalysisPanel
                initialMessage={initialWelcomeMessage}
                chatHistory={chatHistory}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                isStreaming={isStreaming}
                error={error}
            />
            <div className="grid grid-cols-2 gap-6">
                <MultiTimeframeContext trend={higherTfTrend} />
                <VolatilityMeter volatility={volatility} />
            </div>
            <FundamentalDisplay fundamentalData={fundamentalData} />
            <TradingSession currencyPair={currencyPair} />
          </div>
        </main>
        
        <footer className="text-center mt-8 text-gray-500 text-xs sm:text-sm pb-6">
          <p><strong>Disclaimer:</strong> Educational purposes only. Not financial advice.</p>
        </footer>
      </div>
      <ExtensionGuideModal isOpen={isExtensionModalOpen} onClose={() => setIsExtensionModalOpen(false)} />
    </div>
  );
};

export default App;
