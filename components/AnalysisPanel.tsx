
import React, { useRef, useEffect } from 'react';
import { LoadingSpinner } from './icons/LoadingSpinner';
import { ChatMessage } from '../types';

interface AnalysisPanelProps {
  initialMessage: string;
  chatHistory: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  isStreaming: boolean;
  error: string | null;
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({
  initialMessage, chatHistory, onSendMessage, isLoading, isStreaming, error
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isStreaming]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = inputRef.current?.value;
    if (message && !isLoading && !isStreaming) {
      onSendMessage(message);
      inputRef.current.value = '';
    }
  };

  const hasSignal = chatHistory.length > 0;

  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 flex flex-col h-[450px] sm:h-auto min-h-[400px]">
      <h2 className="text-xl font-bold text-white p-4 border-b border-gray-700">Conversational AI Analysis</h2>
      
      <div className="flex-grow p-4 overflow-y-auto">
        {error && (
         <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg mb-4">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
         </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center">
              <LoadingSpinner />
              <p className="mt-2 text-gray-400">Generating initial analysis...</p>
            </div>
          </div>
        ) : (
          <>
            {chatHistory.length === 0 && <p className="text-gray-400">{initialMessage}</p>}
            {chatHistory.map((msg, index) => (
              <div key={index} className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs md:max-w-md lg:max-w-sm rounded-lg px-4 py-2 ${
                    msg.role === 'user'
                      ? 'bg-cyan-600 text-white'
                      : 'bg-gray-700 text-gray-200'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {isStreaming && (
                <div className="flex justify-start">
                    <div className="bg-gray-700 rounded-lg px-4 py-2 inline-block">
                        <div className="flex items-center">
                            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse ml-1"></span>
                            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse ml-1"></span>
                        </div>
                    </div>
                </div>
            )}
          </>
        )}
         <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-700">
        <form onSubmit={handleFormSubmit}>
          <input
            ref={inputRef}
            type="text"
            placeholder={!hasSignal ? "Generate a signal first..." : "Ask a follow-up question..."}
            disabled={!hasSignal || isLoading || isStreaming}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:ring-cyan-500 focus:border-cyan-500 transition disabled:opacity-50"
          />
        </form>
      </div>
    </div>
  );
};

export default AnalysisPanel;
