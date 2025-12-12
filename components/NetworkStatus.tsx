
import React, { useState, useEffect } from 'react';
import { WifiIcon } from './icons/WifiIcon';

interface NetworkState {
    latency: number | null;
    status: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Offline';
    color: string;
    message: string;
}

const NetworkStatus: React.FC = () => {
    const [networkState, setNetworkState] = useState<NetworkState>({
        latency: null,
        status: 'Offline',
        color: 'text-gray-500',
        message: 'Checking connection...'
    });

    const checkLatency = async () => {
        const start = Date.now();
        try {
            // Using Binance Vision public data API ping for realistic trading latency check
            // cache: 'no-store' ensures we don't get a cached response
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            
            await fetch('https://data-api.binance.vision/api/v3/ping', { 
                cache: 'no-store',
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            const end = Date.now();
            const latency = end - start;

            let status: NetworkState['status'] = 'Good';
            let color = 'text-green-400';
            let message = 'Safe to Trade';

            if (latency < 150) {
                status = 'Excellent';
                color = 'text-green-400';
                message = 'Perfect for Trading';
            } else if (latency < 300) {
                status = 'Good';
                color = 'text-cyan-400';
                message = 'Good Condition';
            } else if (latency < 600) {
                status = 'Fair';
                color = 'text-yellow-400';
                message = 'Risk of Slippage';
            } else {
                status = 'Poor';
                color = 'text-red-400';
                message = 'Do Not Trade';
            }

            setNetworkState({ latency, status, color, message });

        } catch (error) {
            setNetworkState({
                latency: null,
                status: 'Offline',
                color: 'text-red-500',
                message: 'Connection Lost'
            });
        }
    };

    useEffect(() => {
        checkLatency();
        // Check every 15 seconds
        const interval = setInterval(checkLatency, 15000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-full border border-gray-700 shadow-sm transition-colors hover:bg-gray-700 cursor-help group relative">
            <WifiIcon className={`h-4 w-4 ${networkState.color} ${networkState.status === 'Offline' ? 'animate-pulse' : ''}`} />
            <div className="flex flex-col leading-none">
                <span className={`text-xs font-bold ${networkState.color}`}>
                    {networkState.latency !== null ? `${networkState.latency}ms` : 'Offline'}
                </span>
            </div>

            {/* Tooltip */}
            <div className="absolute top-full mt-2 right-0 w-48 p-3 bg-gray-800 border border-gray-600 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none text-center">
                <p className={`font-bold ${networkState.color} text-sm mb-1`}>{networkState.status}</p>
                <p className="text-xs text-gray-300">{networkState.message}</p>
            </div>
        </div>
    );
};

export default NetworkStatus;
