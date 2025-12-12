
import React, { useState, useEffect } from 'react';

interface NetworkInformation {
    downlink: number; // Mbps
    effectiveType: string;
    rtt: number;
    saveData: boolean;
    onchange: EventListener;
}

interface NetworkState {
    latency: number | null;
    downlink: number | null;
    status: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Offline';
    color: string;
    message: string;
}

const NetworkStatus: React.FC = () => {
    const [networkState, setNetworkState] = useState<NetworkState>({
        latency: null,
        downlink: null,
        status: 'Offline',
        color: 'text-gray-500',
        message: 'Checking connection...'
    });

    const getNetworkStatus = (latency: number, downlink: number) => {
        // Latency in ms, Downlink in Mbps
        if (latency === -1) return { status: 'Offline', color: 'text-gray-500' };
        
        // Quality Logic
        // Excellent: < 100ms ping AND > 5 Mbps
        if (latency < 100 && downlink > 5) return { status: 'Excellent', color: 'text-green-400' };
        // Good: < 200ms ping AND > 2 Mbps
        if (latency < 200 && downlink > 2) return { status: 'Good', color: 'text-cyan-400' };
        // Fair: < 500ms ping OR > 0.5 Mbps
        if (latency < 500 && downlink > 0.5) return { status: 'Fair', color: 'text-yellow-400' };
        
        return { status: 'Poor', color: 'text-red-400' };
    };

    const checkNetwork = async () => {
        const start = Date.now();
        let latency = -1;

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);
            
            // Ping Binance for realistic trading latency
            await fetch('https://data-api.binance.vision/api/v3/ping', { 
                cache: 'no-store',
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            latency = Date.now() - start;
        } catch (error) {
            latency = -1;
        }

        // Get Speed from Navigator API
        // @ts-ignore
        const connection: NetworkInformation = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        // Default to 10 Mbps if API not supported to avoid showing 'Poor' due to lack of API support alone
        const downlink = connection ? connection.downlink : 10; 

        const { status, color } = getNetworkStatus(latency, downlink);
        
        let message = '';
        if (status === 'Excellent') message = 'Optimal Trading Conditions';
        else if (status === 'Good') message = 'Stable Connection';
        else if (status === 'Fair') message = 'Latency Spikes Detected';
        else if (status === 'Offline') message = 'Connection Lost';
        else message = 'High Latency / Low Bandwidth';

        setNetworkState({
            latency: latency === -1 ? null : latency,
            downlink,
            status: status as any,
            color,
            message
        });
    };

    useEffect(() => {
        checkNetwork();
        const interval = setInterval(checkNetwork, 5000); // Check every 5s
        return () => clearInterval(interval);
    }, []);

    const formatSpeed = (mbps: number | null) => {
        if (mbps === null) return '--';
        if (mbps < 1) return `${(mbps * 1000).toFixed(0)} Kbps`;
        return `${mbps.toFixed(1)} Mbps`;
    };

    const renderBars = () => {
        const levels = { 'Excellent': 4, 'Good': 3, 'Fair': 2, 'Poor': 1, 'Offline': 0 };
        const level = levels[networkState.status] || 0;
        
        return (
            <div className="flex items-end space-x-[2px] h-4">
                {[1, 2, 3, 4].map((bar) => {
                    const isActive = bar <= level;
                    const heightClass = bar === 1 ? 'h-1.5' : bar === 2 ? 'h-2.5' : bar === 3 ? 'h-3.5' : 'h-full';
                    const bgClass = isActive ? networkState.color.replace('text-', 'bg-') : 'bg-gray-700';
                    return (
                        <div key={bar} className={`w-1 rounded-sm ${heightClass} ${bgClass} transition-colors duration-300`} />
                    );
                })}
            </div>
        );
    };

    return (
        <div className="flex items-center gap-3 px-3 py-1.5 bg-gray-800 rounded-lg border border-gray-700 shadow-sm transition-colors hover:bg-gray-700 cursor-help group relative">
            {renderBars()}
            
            <div className="flex flex-col leading-none gap-0.5">
                <span className={`text-[10px] font-bold ${networkState.color}`}>
                    {networkState.latency !== null ? `${networkState.latency} ms` : 'Offline'}
                </span>
                <span className="text-[9px] text-gray-400 font-mono tracking-wide">
                    {formatSpeed(networkState.downlink)}
                </span>
            </div>

            {/* Tooltip */}
            <div className="absolute top-full mt-2 right-0 w-48 p-3 bg-gray-900 border border-gray-600 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none text-center backdrop-blur-sm bg-opacity-95">
                <p className={`font-bold ${networkState.color} text-sm mb-1`}>{networkState.status}</p>
                <p className="text-xs text-gray-300 mb-2">{networkState.message}</p>
                <div className="border-t border-gray-700 pt-2 flex justify-between text-[10px] text-gray-400 font-mono">
                    <span className="flex flex-col items-start">
                        <span>LATENCY</span>
                        <span className="text-gray-200">{networkState.latency || '-'}ms</span>
                    </span>
                    <span className="flex flex-col items-end">
                        <span>SPEED</span>
                        <span className="text-gray-200">{formatSpeed(networkState.downlink)}</span>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default NetworkStatus;
