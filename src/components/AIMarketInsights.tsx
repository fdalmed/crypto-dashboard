"use client";

import type { CryptoCoin } from "../types/crypto";
import { useMemo } from "react";

type Props = {
  coins: CryptoCoin[];
};

type MarketInsight = {
  type: 'positive' | 'warning' | 'neutral' | 'opportunity';
  title: string;
  description: string;
  icon: string;
  coins?: string[];
  metric?: number;
};

export default function AIMarketInsights({ coins }: Props) {
  // Analyze market data and generate insights
  const insights: MarketInsight[] = useMemo(() => {
    if (coins.length === 0) return [];
    
    const insights: MarketInsight[] = [];
    
    // Calculate overall market metrics
    const totalMarketCap = coins.reduce((sum, c) => sum + (c.market_cap || 0), 0);
    const avg24hChange = coins.length > 0 
      ? coins.reduce((sum, c) => sum + (c.price_change_percentage_24h || 0), 0) / coins.length
      : 0;
    
    const gainers = coins.filter(c => (c.price_change_percentage_24h || 0) > 0).length;
    const losers = coins.filter(c => (c.price_change_percentage_24h || 0) < 0).length;
    
    const topGainer = [...coins].sort((a, b) => 
      (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0)
    )[0];
    
    const topLoser = [...coins].sort((a, b) => 
      (a.price_change_percentage_24h || 0) - (b.price_change_percentage_24h || 0)
    )[0];
    
    // Find emerging coins (not in top 10, but growing fast)
    const emergingCoins = coins
      .filter(coin => 
        (coin.market_cap_rank || 100) > 10 && 
        (coin.market_cap_rank || 100) <= 30 &&
        (coin.price_change_percentage_24h || 0) > 5
      )
      .slice(0, 3);
    
    // Calculate market sentiment
    const sentimentScore = (() => {
      let score = 50;
      if (avg24hChange > 2) score += 20;
      else if (avg24hChange > 0) score += 10;
      else if (avg24hChange < -2) score -= 20;
      else if (avg24hChange < 0) score -= 10;
      
      const gainerRatio = gainers / (gainers + losers);
      if (gainerRatio > 0.7) score += 15;
      else if (gainerRatio > 0.5) score += 5;
      else if (gainerRatio < 0.3) score -= 15;
      
      return Math.max(0, Math.min(100, score));
    })();
    
    // Insight 1: Market Sentiment
    if (sentimentScore >= 70) {
      insights.push({
        type: 'positive',
        title: 'Strong Bullish Sentiment',
        description: `The market shows strong positive momentum with ${gainers} gainers vs ${losers} losers. Average 24h change is ${avg24hChange.toFixed(2)}%.`,
        icon: '📈',
        metric: sentimentScore
      });
    } else if (sentimentScore >= 55) {
      insights.push({
        type: 'positive',
        title: 'Positive Market Mood',
        description: `Market sentiment is positive with more gainers (${gainers}) than losers (${losers}). Consider monitoring for entry points.`,
        icon: '😊',
        metric: sentimentScore
      });
    } else if (sentimentScore <= 30) {
      insights.push({
        type: 'warning',
        title: 'Bearish Market Conditions',
        description: `Market shows weakness with ${losers} declining assets. Average change of ${avg24hChange.toFixed(2)}% suggests caution.`,
        icon: '⚠️',
        metric: sentimentScore
      });
    } else {
      insights.push({
        type: 'neutral',
        title: 'Neutral Market Sentiment',
        description: `Market is in consolidation with balanced activity (${gainers}↑ ${losers}↓). Average 24h change: ${avg24hChange.toFixed(2)}%.`,
        icon: '⚖️',
        metric: sentimentScore
      });
    }
    
    // Insight 2: Top Performer Analysis
    if (topGainer && (topGainer.price_change_percentage_24h || 0) > 10) {
      insights.push({
        type: 'positive',
        title: 'Exceptional Gain Detected',
        description: `${topGainer.symbol.toUpperCase()} surged ${topGainer.price_change_percentage_24h?.toFixed(2)}% in 24h. Check for sustained momentum.`,
        icon: '🚀',
        coins: [topGainer.symbol.toUpperCase()]
      });
    }
    
    // Insight 3: Market Correction Warning
    if (topLoser && Math.abs(topLoser.price_change_percentage_24h || 0) > 8) {
      insights.push({
        type: 'warning',
        title: 'Significant Correction',
        description: `${topLoser.symbol.toUpperCase()} dropped ${Math.abs(topLoser.price_change_percentage_24h || 0).toFixed(2)}%. Monitor for broader market impact.`,
        icon: '📉',
        coins: [topLoser.symbol.toUpperCase()]
      });
    }
    
    // Insight 4: Emerging Opportunities
    if (emergingCoins.length > 0) {
      insights.push({
        type: 'opportunity',
        title: 'Emerging Opportunities',
        description: `${emergingCoins.length} mid-cap coins showing strong growth (>5% gain). These could be breakout candidates.`,
        icon: '💎',
        coins: emergingCoins.map(c => c.symbol.toUpperCase())
      });
    }
    
    // Insight 5: Volume Analysis
    const highVolumeCoins = coins
      .filter(coin => coin.total_volume && coin.market_cap)
      .filter(coin => (coin.total_volume! / coin.market_cap!) > 0.1)
      .slice(0, 3);
    
    if (highVolumeCoins.length > 0) {
      insights.push({
        type: 'positive',
        title: 'High Trading Activity',
        description: `${highVolumeCoins.length} coins show unusually high trading volume relative to market cap, indicating strong interest.`,
        icon: '💹',
        coins: highVolumeCoins.map(c => c.symbol.toUpperCase())
      });
    }
    
    // Insight 6: Market Concentration
    const top5MarketCap = coins.slice(0, 5).reduce((sum, c) => sum + (c.market_cap || 0), 0);
    const top5Dominance = (top5MarketCap / totalMarketCap) * 100;
    
    if (top5Dominance > 70) {
      insights.push({
        type: 'warning',
        title: 'High Market Concentration',
        description: `Top 5 coins control ${top5Dominance.toFixed(1)}% of total market cap. High concentration increases systemic risk.`,
        icon: '🎯',
        metric: top5Dominance
      });
    }
    
    return insights.slice(0, 6); // Limit to 6 insights
  }, [coins]);

  if (insights.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg p-5 border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            AI Market Insights
          </div>
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
          Intelligent analysis and observations based on current market data.
        </p>
        <div className="h-48 flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">Analyzing market data...</p>
        </div>
      </div>
    );
  }

  const getTypeColor = (type: MarketInsight['type']) => {
    switch (type) {
      case 'positive': return 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800/30';
      case 'warning': return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-100 dark:border-yellow-800/30';
      case 'opportunity': return 'bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800/30';
      case 'neutral': return 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/30';
      default: return 'bg-gray-50 dark:bg-gray-900/20 border-gray-100 dark:border-gray-800/30';
    }
  };

  const getTypeTextColor = (type: MarketInsight['type']) => {
    switch (type) {
      case 'positive': return 'text-green-600 dark:text-green-400';
      case 'warning': return 'text-yellow-600 dark:text-yellow-400';
      case 'opportunity': return 'text-purple-600 dark:text-purple-400';
      case 'neutral': return 'text-blue-600 dark:text-blue-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg p-5 border border-gray-200 dark:border-gray-700">
      <h3 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          AI Market Insights
        </div>
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
        Intelligent analysis and observations based on current market data.
      </p>
      
      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {insights.map((insight, index) => (
          <div 
            key={index} 
            className={`p-4 rounded-lg border ${getTypeColor(insight.type)} hover:shadow-md transition-shadow`}
          >
            <div className="flex items-start gap-3">
              <div className={`text-2xl ${getTypeTextColor(insight.type)}`}>
                {insight.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`font-semibold text-sm ${getTypeTextColor(insight.type)}`}>
                    {insight.title}
                  </h4>
                  {insight.metric && (
                    <span className="text-xs font-bold bg-white dark:bg-gray-800 px-2 py-0.5 rounded">
                      {insight.metric}/100
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  {insight.description}
                </p>
                {insight.coins && insight.coins.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {insight.coins.map((coin, coinIndex) => (
                      <span 
                        key={coinIndex} 
                        className="text-xs px-2 py-0.5 bg-white/70 dark:bg-gray-800/70 rounded border border-gray-200 dark:border-gray-700"
                      >
                        {coin}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Methodology Explanation */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Analysis Methodology:</span>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded"></div>
              <span>Positive</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded"></div>
              <span>Warning</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-purple-100 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-700 rounded"></div>
              <span>Opportunity</span>
            </div>
          </div>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Insights generated by analyzing price changes, trading volume, market dominance, and market breadth. 
          Updated in real-time as new data arrives.
        </div>
      </div>
    </div>
  );
}