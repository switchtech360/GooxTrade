
import React, { useEffect, useState } from 'react';

interface DivergenceAlertProps {
    type: 'Bullish' | 'Bearish';
    pair: string;
    onClose: () => void;
}

const DivergenceAlert: React.FC<DivergenceAlertProps> = ({ type, pair, onClose }) => {
    const [progress, setProgress] = useState(100);
    const DURATION = 5000;

    useEffect(() => {
        const startTime = Date.now();
        const timer = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, 100 - (elapsed / DURATION) * 100);
            setProgress(remaining);
            
            if (remaining === 0) {
                clearInterval(timer);
                onClose();
            }
        }, 50);

        return () => clearInterval(timer);
    }, [onClose]);

    const isBullish = type === 'Bullish';
    // Green for Bullish, Red for Bearish
    const bgColor = isBullish ? 'bg-green-900/90' : 'bg-red-900/90';
    const borderColor = isBullish ? 'border-green-500' : 'border-red-500';
    const iconColor = isBullish ? 'text-green-400' : 'text-red-400';
    const progressColor = isBullish ? 'bg-green-400' : 'bg-red-400';

    return (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[100] animate-bounce-in w-full max-w-sm px-4">
            <div className={`${bgColor} backdrop-blur-md ${borderColor} border-2 text-white rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.6)] overflow-hidden relative`}>
                <div className="flex items-center gap-4 p-4">
                    {/* Icon Circle */}
                    <div className="p-3 bg-gray-900 rounded-full flex-shrink-0 z-10 shadow-inner border border-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            {isBullish ? (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" transform="rotate(-90 12 12)" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" transform="rotate(90 12 12)" />
                            )}
                        </svg>
                    </div>
                    
                    {/* Text Content */}
                    <div className="z-10 flex-grow">
                        <h3 className="font-black text-lg uppercase tracking-wider leading-none mb-1 text-white shadow-black drop-shadow-md">{type} Divergence</h3>
                        <p className="text-sm font-medium text-gray-200">{pair} - Reversal Likely</p>
                    </div>
                    
                    {/* Close Button */}
                    <button 
                        onClick={onClose} 
                        className="z-10 text-white/60 hover:text-white transition-colors p-1"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="h-1 w-full bg-gray-800/50">
                    <div 
                        className={`h-full ${progressColor} transition-all duration-75 ease-linear`} 
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default DivergenceAlert;
