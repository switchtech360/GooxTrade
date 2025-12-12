
import React, { useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi, UTCTimestamp, PriceLineOptions, IPriceLine, SeriesMarker } from 'lightweight-charts';
import { Candle, CurrencyPair, SignalResponse, Indicators } from '../types';

interface PriceChartProps {
  data: Candle[];
  currencyPair: CurrencyPair;
  signalResponse: SignalResponse | null;
  indicators: Indicators | null;
  error?: string | null;
}

const PriceChart: React.FC<PriceChartProps> = ({ data, currencyPair, signalResponse, indicators, error }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const takeProfitLine = useRef<IPriceLine | null>(null);
  const stopLossLine = useRef<IPriceLine | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    chartRef.current = createChart(chartContainerRef.current, {
      layout: { background: { color: '#1f2937' }, textColor: '#d1d5db' },
      grid: { vertLines: { color: '#374151' }, horzLines: { color: '#374151' } },
      timeScale: { timeVisible: true, secondsVisible: false },
      rightPriceScale: { borderVisible: false },
      crosshair: { mode: 1 },
    });

    candlestickSeriesRef.current = chartRef.current.addCandlestickSeries({
      upColor: '#22c55e', downColor: '#ef4444', borderDownColor: '#ef4444',
      borderUpColor: '#22c55e', wickDownColor: '#ef4444', wickUpColor: '#22c55e',
    });

    const handleResize = () => chartRef.current?.applyOptions({ width: chartContainerRef.current!.clientWidth });
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chartRef.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (candlestickSeriesRef.current) {
        if (data && data.length > 0) {
            const formattedData = data.map(candle => ({
              time: (candle.timestamp / 1000) as UTCTimestamp,
              open: candle.open, high: candle.high, low: candle.low, close: candle.close,
            }));
            candlestickSeriesRef.current.setData(formattedData);
            
            // Add Divergence Markers
            if (indicators && indicators.divergence !== 'None') {
                const lastTime = formattedData[formattedData.length - 1].time;
                const marker: SeriesMarker<UTCTimestamp> = {
                    time: lastTime,
                    position: indicators.divergence === 'Bullish' ? 'belowBar' : 'aboveBar',
                    color: indicators.divergence === 'Bullish' ? '#22c55e' : '#ef4444',
                    shape: indicators.divergence === 'Bullish' ? 'arrowUp' : 'arrowDown',
                    text: `${indicators.divergence} Div`,
                    size: 2
                };
                candlestickSeriesRef.current.setMarkers([marker]);
            } else {
                candlestickSeriesRef.current.setMarkers([]);
            }

            chartRef.current?.timeScale().fitContent();
        } else {
            candlestickSeriesRef.current.setData([]);
            candlestickSeriesRef.current.setMarkers([]);
        }
    }
  }, [data, indicators]);

  useEffect(() => {
      const series = candlestickSeriesRef.current;
      if (!series) return;
      
      // Clear existing lines
      if (takeProfitLine.current) series.removePriceLine(takeProfitLine.current);
      if (stopLossLine.current) series.removePriceLine(stopLossLine.current);
      takeProfitLine.current = null;
      stopLossLine.current = null;
      
      if (signalResponse && signalResponse.signal !== 'HOLD') {
          const tpOptions: PriceLineOptions = {
              price: signalResponse.takeProfit,
              color: '#22c55e',
              lineWidth: 2,
              lineStyle: 2, // Dashed
              axisLabelVisible: true,
              title: 'TP',
          };
          const slOptions: PriceLineOptions = {
              price: signalResponse.stopLoss,
              color: '#ef4444',
              lineWidth: 2,
              lineStyle: 2, // Dashed
              axisLabelVisible: true,
              title: 'SL',
          };
          takeProfitLine.current = series.createPriceLine(tpOptions);
          stopLossLine.current = series.createPriceLine(slOptions);
      }
  }, [signalResponse]);

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Price Chart: {currencyPair}</h2>
      </div>
      <div ref={chartContainerRef} className="w-full h-[350px] relative">
        {data.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 bg-gray-800/80 z-10">
             {error ? (
                <div className="text-center p-4">
                    <p className="text-red-400 font-bold mb-1">No Live Data Available</p>
                    <p className="text-xs text-gray-400">{error}</p>
                </div>
             ) : (
                <p>Market data chart will appear here.</p>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceChart;
