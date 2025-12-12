
import { GoogleGenAI, Type } from "@google/genai";
import { Candle, CurrencyPair, Indicators, MarketSentiment, SignalResponse, Strategy, Timeframe, AnalysisType, FundamentalData, VolatilityInfo, ChatMessage } from "../types";

const generateBasePrompt = (
  pair: CurrencyPair,
  timeframe: Timeframe,
  strategy: Strategy,
  analysisType: AnalysisType,
  indicators: Indicators,
  sessionImpact: string,
  marketSentiment: MarketSentiment,
  fundamentalData: FundamentalData,
  volatility: VolatilityInfo,
  higherTfTrend: string
): string => `
You are a world-class quantitative and market analyst for a high-frequency trading firm. Your task is to provide a clear, actionable trading signal (BUY, SELL, or HOLD) for binary options, including a confidence score and risk management levels. Your analysis MUST prioritize the user's selected "Primary Analysis Type".

**1. User's Primary Analysis Type: ${analysisType}**
This is the most important instruction. Your final reasoning must be dominated by this type of analysis.

**2. Market Context:**
- Currency Pair: ${pair}
- Timeframe: ${timeframe}
- Higher Timeframe (4h) Trend: **${higherTfTrend}**
- Active Trading Session Note: **${sessionImpact}**
- Current Market Volatility: **${volatility.level}** (ATR: ${volatility.atr.toFixed(5)})

**3. Data Streams:**

   **a) Fundamental Data:**
   - Interest Rate Differential: ${fundamentalData.interestRateDifferential}
   - GDP Outlook: ${fundamentalData.gdpOutlook}
   - Inflationary Pressure: ${fundamentalData.inflationaryPressure}
   - Upcoming Key Reports: ${fundamentalData.keyReports}

   **b) Sentiment Data:**
   - Overall Sentiment: **${marketSentiment.sentiment}**
   - Key Market Drivers/Keywords: ${marketSentiment.keywords.join(', ')}

   **c) Technical Indicator Data:**
   - Current Price: ${indicators.currentPrice}
   - RSI (14): ${indicators.rsi} (Status: ${indicators.rsi > 70 ? 'Overbought' : indicators.rsi < 30 ? 'Oversold' : 'Neutral'})
   - CCI (20): ${indicators.cci} (Status: ${indicators.cci > 100 ? 'Overbought' : indicators.cci < -100 ? 'Oversold' : 'Neutral'})
   - Bollinger Bands (20, 2): Upper=${indicators.bollingerBands.upper}, Middle=${indicators.bollingerBands.middle}, Lower=${indicators.bollingerBands.lower}
   - MACD (12, 26, 9): Histogram=${indicators.macd.histogram} (Status: ${indicators.macd.histogram > 0 ? 'Bullish Momentum' : 'Bearish Momentum'})

**4. Comprehensive Analysis Task & Rules:**

Based on your assigned **Primary Analysis Type (${analysisType})**, perform a holistic analysis. Use the selected strategy (${strategy}) as an execution framework. The higher timeframe trend should act as a major filter (e.g., avoid SELLs in a strong 4h Uptrend). Consider the active session's typical impact.

- **If Primary Analysis is 'Technical':** Your decision must be based almost entirely on the technical indicators, filtered by the higher timeframe trend. Mention specific indicator values in your reasoning.
- **If Primary Analysis is 'Fundamental':** Your decision must be based on the economic outlook. Use technicals mainly to find a good entry point that aligns with your fundamental bias and the higher timeframe trend.
- **If Primary Analysis is 'Sentiment':** Your decision must be driven by the market mood ('${marketSentiment.sentiment}'). Use technicals to confirm the sentiment.

**5. Output Requirement:**
Provide a "BUY", "SELL", or "HOLD" signal, a concise reasoning, a confidence score (0-100), and suggested Stop Loss (SL) and Take Profit (TP) levels.
- The confidence score should reflect the confluence of all data points. High confidence (>75) requires strong alignment across multiple data streams.
- SL/TP should be realistic for the timeframe, based on recent price structure or volatility (e.g., using ATR). For a BUY, SL is below price, TP is above. For a SELL, SL is above, TP is below. For HOLD, SL/TP should be 0.
`;

export const getTradingSignal = async (
  ai: GoogleGenAI,
  pair: CurrencyPair,
  timeframe: Timeframe,
  strategy: Strategy,
  analysisType: AnalysisType,
  marketData: Candle[],
  indicators: Indicators,
  sessionImpact: string,
  marketSentiment: MarketSentiment,
  fundamentalData: FundamentalData,
  volatility: VolatilityInfo,
  higherTfTrend: string
): Promise<SignalResponse> => {
    
  const prompt = `
${generateBasePrompt(pair, timeframe, strategy, analysisType, indicators, sessionImpact, marketSentiment, fundamentalData, volatility, higherTfTrend)}

Respond with a single, valid JSON object. Do not include any text, notes, or markdown formatting before or after the JSON block.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          signal: { type: Type.STRING, description: "The trading signal: BUY, SELL, or HOLD." },
          reasoning: { type: Type.STRING, description: "A concise explanation for the signal." },
          confidence: { type: Type.INTEGER, description: "A confidence score from 0 to 100." },
          stopLoss: { type: Type.NUMBER, description: "Suggested Stop Loss price level." },
          takeProfit: { type: Type.NUMBER, description: "Suggested Take Profit price level." }
        },
        required: ["signal", "reasoning", "confidence", "stopLoss", "takeProfit"],
      },
    }
  });
  
  const jsonText = response.text.trim();
  const parsedResponse = JSON.parse(jsonText);

  if (['BUY', 'SELL', 'HOLD'].includes(parsedResponse.signal)) {
    return parsedResponse as SignalResponse;
  } else {
    throw new Error('Invalid response format from AI.');
  }
};

export const getFollowUpAnalysis = async (
  ai: GoogleGenAI,
  initialResponse: SignalResponse | null,
  chatHistory: ChatMessage[]
): Promise<string> => {
  if (!initialResponse) return "Please generate a signal first.";

  const historyContext = chatHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n');

  const prompt = `
You are the same world-class analyst from before. You just provided the following analysis:
- Signal: ${initialResponse.signal}
- Confidence: ${initialResponse.confidence}%
- Reasoning: ${initialResponse.reasoning}

Now, a user is asking a follow-up question. Continue the conversation in a helpful and concise manner. Here is the conversation so far:
${historyContext}

Your task is to answer the last user question based on the original data you had. Do not generate a new signal. Keep your answer brief and to the point.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return response.text.trim();
};
