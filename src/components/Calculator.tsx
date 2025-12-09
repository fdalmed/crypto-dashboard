"use client";

import { useState } from "react";
import type { CryptoCoin } from "../types/crypto";
import { 
  PlusCircleIcon, 
  TrashIcon, 
  InformationCircleIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  CurrencyDollarIcon
} from "@heroicons/react/24/outline";

type Props = {
  coins: CryptoCoin[];
};

type InvestmentInput = {
  id: number;
  coin: string;
  amount: number;
  symbol: string;
};

type Recommendation = {
  coin: string;
  symbol: string;
  suggestedAmount: number;
  difference: number;
  percentageChange: number;
  explanation: string;
  confidence: "high" | "medium" | "low";
  action: "keep" | "increase" | "decrease" | "add";
  keepAmount?: number;
  moveAmount?: number;
  toCoin?: string;
  toSymbol?: string;
};

type TopCoin = {
  symbol: string;
  name: string;
  change24h: number;
  price: number;
  rank: number;
};

export default function Calculator({ coins }: Props) {
  const [inputs, setInputs] = useState<InvestmentInput[]>([
    { id: 1, coin: "Bitcoin", amount: 0, symbol: "BTC" },
    { id: 2, coin: "Ethereum", amount: 0, symbol: "ETH" },
  ]);
  
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [additionalBudget, setAdditionalBudget] = useState<number>(0);
  const [reallocationRate, setReallocationRate] = useState<number>(30); // Default 30% reallocation
  const [topCoins, setTopCoins] = useState<TopCoin[]>([]);

  // Prepare coin data for dropdown
  const coinOptions = coins.map(coin => ({
    symbol: coin.symbol.toUpperCase(),
    name: coin.name,
    price: coin.current_price,
    change24h: coin.price_change_percentage_24h || 0,
    marketCap: coin.market_cap || 0
  }));

  // Helper function to find coin data
  const getCoinData = (symbol: string) => {
    return coinOptions.find(c => c.symbol === symbol.toUpperCase());
  };

  // Find top 5 performing coins (excluding user's current coins)
  const findTopPerformingCoins = (currentSymbols: string[]) => {
    return coinOptions
      .filter(coin => !currentSymbols.includes(coin.symbol))
      .sort((a, b) => b.change24h - a.change24h)
      .slice(0, 5)
      .map((coin, index) => ({
        symbol: coin.symbol,
        name: coin.name,
        change24h: coin.change24h,
        price: coin.price,
        rank: index + 1
      }));
  };

  const addInput = () => {
    setInputs(prev => {
      const nextId = prev.length > 0 ? Math.max(...prev.map(i => i.id)) + 1 : 1;
      const defaultCoin = coins[prev.length % coins.length];
      return [
        ...prev,
        { 
          id: nextId, 
          coin: defaultCoin?.name || "Bitcoin", 
          amount: 0, 
          symbol: defaultCoin?.symbol.toUpperCase() || "BTC" 
        }
      ];
    });
  };

  const removeInput = (id: number) => {
    if (inputs.length > 1) {
      setInputs(prev => prev.filter(input => input.id !== id));
    }
  };

  const updateInput = (id: number, field: keyof InvestmentInput, value: string | number) => {
    setInputs(prev => 
      prev.map(input => 
        input.id === id ? { ...input, [field]: value } : input
      )
    );
  };

  const updateCoinSelection = (id: number, selectedValue: string) => {
    const newSymbol = selectedValue.split(" ")[0].toUpperCase();
    
    setInputs(prev => 
      prev.map(input => {
        if (input.id === id) {
          const selectedCoin = coinOptions.find(c => c.symbol === newSymbol);
          if (selectedCoin) {
            return {
              ...input,
              symbol: selectedCoin.symbol,
              coin: selectedCoin.name
            };
          }
          return input;
        }
        return input;
      })
    );
  };

  const calculateRecommendations = () => {
    const total = inputs.reduce((sum, input) => sum + input.amount, 0);
    const totalBudget = total + additionalBudget;
    setTotalInvestment(total);
    
    // Find top performing coins
    const currentSymbols = inputs.map(input => input.symbol);
    const topPerformers = findTopPerformingCoins(currentSymbols);
    setTopCoins(topPerformers);

    // Calculate total positive momentum for user's coins
    let totalPositiveMomentum = 0;
    inputs.forEach(input => {
      const coinData = getCoinData(input.symbol);
      if (coinData && coinData.change24h > 0) {
        totalPositiveMomentum += coinData.change24h;
      }
    });

    // Analyze user's current portfolio
    const portfolioAnalysis = inputs.map(input => {
      const coinData = getCoinData(input.symbol);
      const change = coinData?.change24h || 0;
      const performanceScore = change > 5 ? "excellent" : 
                               change > 2 ? "good" : 
                               change < -5 ? "poor" : 
                               change < -2 ? "below" : "neutral";
      
      return {
        ...input,
        change,
        performanceScore,
        data: coinData
      };
    });

    // Sort by performance (worst to best)
    const sortedAnalysis = [...portfolioAnalysis].sort((a, b) => a.change - b.change);

    // Calculate total funds available (including additional budget)
    //const totalAvailable = totalBudget;
    
    // Smart reallocation strategy
    const recs: Recommendation[] = [];
    //let fundsToReallocate = 0;
    let fundsFromPoorPerformers = 0;

    // Identify funds that should be reallocated from poor performers
    sortedAnalysis.forEach(item => {
      const reallocationPercentage = item.change < -5 ? reallocationRate + 20 : // Extra from very poor
                                    item.change < -2 ? reallocationRate + 10 : // More from poor
                                    item.change > 5 ? 0 : // Keep all from excellent
                                    item.change > 2 ? Math.max(0, reallocationRate - 10) : // Less from good
                                    reallocationRate; // Default for neutral

      const reallocationAmount = item.amount * (reallocationPercentage / 100);
      fundsFromPoorPerformers += reallocationAmount;
    });

    // Add additional budget to reallocation pool
    const totalReallocationPool = fundsFromPoorPerformers + additionalBudget;
    
    // Calculate allocation to top performers
    const topPerformerAllocation = totalReallocationPool * 0.6; // 60% to top performers
    //const userChoiceAllocation = totalReallocationPool * 0.4; // 40% back to user's good performers

    // Generate recommendations for user's current coins
    portfolioAnalysis.forEach(item => {
      const coinData = item.data;
      if (!coinData) {
        recs.push({
          coin: item.coin,
          symbol: item.symbol,
          suggestedAmount: item.amount,
          difference: 0,
          percentageChange: 0,
          explanation: "No data available for this coin.",
          confidence: "low",
          action: "keep"
        });
        return;
      }

      const change = coinData.change24h;
      let suggestedAmount = item.amount;
      let explanation = "";
      let confidence: "high" | "medium" | "low" = "medium";
      let percentageChange = 0;
      let action: "keep" | "increase" | "decrease" | "add" = "keep";
      let keepAmount = item.amount;
      let moveAmount = 0;
      let toCoin = "";
      let toSymbol = "";

      if (total === 0 && additionalBudget === 0) {
        // Starting suggestions with no budget
        const basePortfolio = 1000;
        const weight = change > 0 ? (change + 5) / 100 : 0.05;
        suggestedAmount = Math.round(basePortfolio * weight * 100) / 100;
        percentageChange = 100;
        
        if (change > 5) {
          explanation = `Excellent performer (+${change.toFixed(2)}%). Consider this as a primary investment.`;
          confidence = "high";
          action = "add";
        } else if (change > 2) {
          explanation = `Good momentum (+${change.toFixed(2)}%). Solid choice for portfolio.`;
          confidence = "medium";
          action = "add";
        } else if (change < -5) {
          explanation = `High risk (${change.toFixed(2)}%). Consider avoiding or minimal allocation.`;
          confidence = "high";
          suggestedAmount *= 0.3;
          action = "decrease";
        } else if (change < -2) {
          explanation = `Underperforming (${change.toFixed(2)}%). Limited allocation recommended.`;
          confidence = "medium";
          suggestedAmount *= 0.5;
          action = "decrease";
        } else {
          explanation = `Stable (${change.toFixed(2)}%). Neutral position for diversification.`;
          confidence = "low";
          action = "keep";
        }
        
      } else {
        // Smart reallocation logic with existing portfolio
        if (change < -5) {
          // Very poor performer - reallocate more
          const reallocatePercent = reallocationRate + 20;
          moveAmount = item.amount * (reallocatePercent / 100);
          keepAmount = item.amount - moveAmount;
          suggestedAmount = keepAmount;
          percentageChange = -reallocatePercent;
          action = "decrease";
          
          if (topPerformers.length > 0) {
            toCoin = topPerformers[0].name;
            toSymbol = topPerformers[0].symbol;
            explanation = `High risk (${change.toFixed(2)}%). Move ${reallocatePercent}% ($${moveAmount.toFixed(2)}) to ${toCoin}.`;
          } else {
            explanation = `High risk (${change.toFixed(2)}%). Reduce by ${reallocatePercent}%.`;
          }
          confidence = "high";
          
        } else if (change < -2) {
          // Poor performer - reallocate some
          const reallocatePercent = reallocationRate + 10;
          moveAmount = item.amount * (reallocatePercent / 100);
          keepAmount = item.amount - moveAmount;
          suggestedAmount = keepAmount;
          percentageChange = -reallocatePercent;
          action = "decrease";
          
          if (topPerformers.length > 0) {
            toCoin = topPerformers[0].name;
            toSymbol = topPerformers[0].symbol;
            explanation = `Underperforming (${change.toFixed(2)}%). Move ${reallocatePercent}% ($${moveAmount.toFixed(2)}) to ${toCoin}.`;
          } else {
            explanation = `Underperforming (${change.toFixed(2)}%). Reduce by ${reallocatePercent}%.`;
          }
          confidence = "medium";
          
        } else if (change > 5) {
          // Excellent performer - keep or add more
          const addPercent = Math.min(20, reallocationRate);
          const addAmount = (totalReallocationPool * 0.2) * (addPercent / 100);
          suggestedAmount = item.amount + addAmount;
          keepAmount = item.amount;
          moveAmount = 0;
          percentageChange = (addAmount / item.amount) * 100;
          action = "increase";
          explanation = `Top performer (+${change.toFixed(2)}%). Consider adding $${addAmount.toFixed(2)} from reallocation pool.`;
          confidence = "high";
          
        } else if (change > 2) {
          // Good performer - keep as is
          suggestedAmount = item.amount;
          keepAmount = item.amount;
          moveAmount = 0;
          percentageChange = 0;
          action = "keep";
          explanation = `Good performance (+${change.toFixed(2)}%). Maintain current position.`;
          confidence = "medium";
          
        } else {
          // Neutral - keep most
          const reallocatePercent = Math.max(0, reallocationRate - 15);
          moveAmount = item.amount * (reallocatePercent / 100);
          keepAmount = item.amount - moveAmount;
          suggestedAmount = keepAmount;
          percentageChange = -reallocatePercent;
          action = "decrease";
          
          if (reallocatePercent > 0 && topPerformers.length > 0) {
            toCoin = topPerformers[0].name;
            toSymbol = topPerformers[0].symbol;
            explanation = `Neutral (${change.toFixed(2)}%). Move ${reallocatePercent}% ($${moveAmount.toFixed(2)}) to better performers.`;
          } else {
            explanation = `Neutral performance (${change.toFixed(2)}%). Maintain position.`;
            action = "keep";
          }
          confidence = "low";
        }
      }

      recs.push({
        coin: item.coin,
        symbol: item.symbol,
        suggestedAmount: parseFloat(suggestedAmount.toFixed(2)),
        difference: parseFloat((suggestedAmount - item.amount).toFixed(2)),
        percentageChange: parseFloat(percentageChange.toFixed(1)),
        explanation,
        confidence,
        action,
        keepAmount: parseFloat((keepAmount || item.amount).toFixed(2)),
        moveAmount: parseFloat((moveAmount || 0).toFixed(2)),
        toCoin,
        toSymbol
      });
    });

    // Add top performers as new recommendations if they're not already in portfolio
    if (totalBudget > 0 && topPerformers.length > 0) {
      const allocationPerTopCoin = topPerformerAllocation / Math.min(2, topPerformers.length);
      
      topPerformers.slice(0, 2).forEach((topCoin, index) => {
        const isAlreadyInPortfolio = inputs.some(input => input.symbol === topCoin.symbol);
        
        if (!isAlreadyInPortfolio) {
          const suggestedAmount = parseFloat((allocationPerTopCoin * (0.8 + index * 0.2)).toFixed(2));
          
          recs.push({
            coin: topCoin.name,
            symbol: topCoin.symbol,
            suggestedAmount,
            difference: suggestedAmount,
            percentageChange: 100,
            explanation: `Top performer (+${topCoin.change24h.toFixed(2)}% in 24h). Consider adding to portfolio.`,
            confidence: topCoin.change24h > 5 ? "high" : topCoin.change24h > 2 ? "medium" : "low",
            action: "add"
          });
        }
      });
    }

    setRecommendations(recs);
  };

  const clearAll = () => {
    setInputs(prev => prev.map(input => ({ ...input, amount: 0 })));
    setRecommendations([]);
    setTotalInvestment(0);
    setAdditionalBudget(0);
  };

  const getConfidenceColor = (confidence: "high" | "medium" | "low") => {
    switch (confidence) {
      case "high": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "low": return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const getActionIcon = (action: "keep" | "increase" | "decrease" | "add") => {
    switch (action) {
      case "increase":
      case "add":
        return <ChevronUpIcon className="w-4 h-4 text-green-500" />;
      case "decrease":
        return <ChevronDownIcon className="w-4 h-4 text-red-500" />;
      case "keep":
        return <div className="w-4 h-4 rounded-full border-2 border-gray-400" />;
    }
  };

  const applySuggestion = (rec: Recommendation) => {
    // Find if coin already exists
    const existingInput = inputs.find(input => input.symbol === rec.symbol);
    
    if (existingInput) {
      // Update existing coin
      updateInput(existingInput.id, "amount", rec.suggestedAmount);
    } else {
      // Add new coin
      addInput();
      // Update the newly added coin
      setTimeout(() => {
        const newInput = inputs[inputs.length - 1];
        if (newInput) {
          setInputs(prev => 
            prev.map(input => 
              input.id === newInput.id 
                ? { ...input, symbol: rec.symbol, coin: rec.coin, amount: rec.suggestedAmount }
                : input
            )
          );
        }
      }, 0);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">💰 Smart Investment Calculator</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Get smart reallocation suggestions based on market performance
          </p>
        </div>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          aria-label="How it works"
        >
          <InformationCircleIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Info Panel */}
      {showInfo && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="font-bold text-lg mb-2 text-blue-800 dark:text-blue-300">How the Smart Calculator Works</h3>
          <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-400">
            <li className="flex items-start gap-2">
              <span className="font-bold">🎯</span>
              <span><strong>Smart Reallocation:</strong> Keeps 70-80% of your original investments, suggests moving 20-30% to better performers</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">⭐</span>
              <span><strong>Top Performers:</strong> Automatically suggests adding Bitcoin, Ethereum, or other top-performing coins</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">⚖️</span>
              <span><strong>Balanced Approach:</strong> Respects your choices while optimizing for better returns</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">💰</span>
              <span><strong>Additional Budget:</strong> Option to add more funds for investment suggestions</span>
            </li>
          </ul>
        </div>
      )}

      {/* Investment Inputs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Your Current Portfolio</h3>
          <div className="flex gap-2">
            <button
              onClick={addInput}
              className="flex items-center gap-2 px-3 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-800/50"
            >
              <PlusCircleIcon className="w-4 h-4" />
              Add Coin
            </button>
            <button
              onClick={clearAll}
              className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Clear All
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {inputs.map((input) => {
            const coinData = getCoinData(input.symbol);
            const change = coinData?.change24h || 0;
            const changeSymbol = change >= 0 ? "↑" : "↓";
            
            return (
              <div key={input.id} className="flex flex-col sm:flex-row gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                {/* Coin Selection */}
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                    Cryptocurrency
                  </label>
                  <select
                    value={input.symbol}
                    onChange={(e) => updateCoinSelection(input.id, e.target.value)}
                    className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                  >
                    {coinOptions.map((coin) => {
                      const coinChange = coin.change24h;
                      const coinChangeSymbol = coinChange >= 0 ? "↑" : "↓";
                      const isTopPerformer = coinChange > 5;
                      
                      return (
                        <option 
                          key={coin.symbol} 
                          value={coin.symbol}
                          className={isTopPerformer ? "font-semibold text-green-600 dark:text-green-400" : ""}
                        >
                          {coin.symbol} - {coin.name} ({coinChangeSymbol} {Math.abs(coinChange).toFixed(2)}%)
                          {isTopPerformer && " ⭐"}
                        </option>
                      );
                    })}
                  </select>
                  {coinData && (
                    <p className={`text-xs mt-1 ${
                      change > 5 ? "text-green-600 dark:text-green-400 font-medium" :
                      change > 2 ? "text-green-500 dark:text-green-500" :
                      change < -5 ? "text-red-600 dark:text-red-400 font-medium" :
                      change < -2 ? "text-red-500 dark:text-red-500" :
                      "text-gray-500 dark:text-gray-400"
                    }`}>
                      Current: {input.coin} ({changeSymbol} {Math.abs(change).toFixed(2)}% 24h)
                    </p>
                  )}
                </div>

                {/* Amount Input */}
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                    Amount (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={input.amount || ""}
                      onChange={(e) => updateInput(input.id, "amount", parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                    />
                  </div>
                </div>

                {/* Remove Button */}
                {inputs.length > 1 && (
                  <div className="flex items-end">
                    <button
                      onClick={() => removeInput(input.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      aria-label="Remove"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Additional Budget & Reallocation Settings */}
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Additional Budget */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <CurrencyDollarIcon className="w-4 h-4" />
                Additional Budget to Invest
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={additionalBudget || ""}
                  onChange={(e) => setAdditionalBudget(parseFloat(e.target.value) || 0)}
                  placeholder="Add more funds..."
                  min="0"
                  step="100"
                  className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Add more funds to get investment suggestions
              </p>
            </div>

            {/* Reallocation Rate */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Reallocation Aggressiveness
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="10"
                  value={reallocationRate}
                  onChange={(e) => setReallocationRate(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                  <span>Conservative ({reallocationRate === 10 ? "✓" : ""})</span>
                  <span>Balanced ({reallocationRate === 30 ? "✓" : ""})</span>
                  <span>Aggressive ({reallocationRate === 50 ? "✓" : ""})</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Moving {reallocationRate}% from underperformers to top coins
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Total Investment & Calculate Button */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-left">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Portfolio Value</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                ${(inputs.reduce((sum, input) => sum + input.amount, 0) + additionalBudget).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {inputs.filter(i => i.amount > 0).length} coins • ${additionalBudget > 0 ? additionalBudget.toFixed(2) : "0"} additional budget
              </p>
            </div>
            <div className="flex flex-col items-center sm:items-end gap-2">
              <button
                onClick={calculateRecommendations}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold transition shadow-md hover:shadow-lg"
              >
                Get Smart Recommendations
              </button>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Smart reallocation + Top performer suggestions
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Current Top Performers */}
      {topCoins.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            ⭐ Current Top Performers (24h)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {topCoins.slice(0, 3).map((coin, index) => (
              <div key={coin.symbol} className={`p-3 rounded-lg border ${
                index === 0 ? "border-yellow-300 dark:border-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/10" :
                index === 1 ? "border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/50" :
                "border-gray-200 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-800/30"
              }`}>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${index === 0 ? "text-lg" : "text-base"}`}>
                        {coin.symbol}
                      </span>
                      {index === 0 && (
                        <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300 px-2 py-1 rounded-full">
                          #1
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{coin.name}</p>
                  </div>
                  <div className={`text-right font-bold ${
                    coin.change24h > 5 ? "text-green-600 dark:text-green-400" :
                    coin.change24h > 2 ? "text-green-500 dark:text-green-500" :
                    "text-gray-600 dark:text-gray-400"
                  }`}>
                    {coin.change24h > 0 ? "+" : ""}{coin.change24h.toFixed(2)}%
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  ${coin.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Smart Reallocation Suggestions</h3>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Balanced approach respecting your choices
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {recommendations.map((rec, index) => (
              <div 
                key={index} 
                className={`p-5 rounded-xl border ${
                  rec.action === "add" ? "border-blue-200 dark:border-blue-800/50 bg-blue-50/50 dark:bg-blue-900/10" :
                  rec.action === "increase" ? "border-green-200 dark:border-green-800/50 bg-green-50/50 dark:bg-green-900/10" :
                  rec.action === "decrease" ? "border-red-200 dark:border-red-800/50 bg-red-50/50 dark:bg-red-900/10" :
                  "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      {getActionIcon(rec.action)}
                      <h4 className="font-bold text-lg">{rec.coin}</h4>
                      {rec.action === "add" && (
                        <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{rec.symbol}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getConfidenceColor(rec.confidence)}`}>
                        {rec.confidence.charAt(0).toUpperCase() + rec.confidence.slice(1)} Confidence
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      rec.action === "add" || rec.action === "increase" ? "text-green-600 dark:text-green-400" :
                      rec.action === "decrease" ? "text-red-600 dark:text-red-400" :
                      "text-gray-600 dark:text-gray-400"
                    }`}>
                      ${rec.suggestedAmount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </div>
                    {rec.difference !== 0 && (
                      <div className={`text-sm ${
                        rec.difference > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                      }`}>
                        {rec.difference > 0 ? "+" : ""}${Math.abs(rec.difference).toFixed(2)} 
                        ({rec.percentageChange > 0 ? "+" : ""}{rec.percentageChange}%)
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Smart Explanation */}
                <div className="text-gray-700 dark:text-gray-300 text-sm space-y-2">
                  <p>{rec.explanation}</p>
                  
                  {rec.keepAmount !== undefined && rec.keepAmount > 0 && rec.action !== "add" && (
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-green-600 dark:text-green-400">
                        Keep: <strong>${rec.keepAmount.toFixed(2)}</strong>
                      </span>
                    </div>
                  )}
                  
                  {rec.moveAmount !== undefined && rec.moveAmount > 0 && rec.toCoin && (
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span className="text-blue-600 dark:text-blue-400">
                        Move: <strong>${rec.moveAmount.toFixed(2)}</strong> to {rec.toCoin} ({rec.toSymbol})
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => applySuggestion(rec)}
                    className={`flex-1 py-2 px-3 text-sm rounded-lg transition ${
                      rec.action === "add" ? "bg-blue-600 hover:bg-blue-700 text-white" :
                      rec.action === "increase" ? "bg-green-600 hover:bg-green-700 text-white" :
                      rec.action === "decrease" ? "bg-red-600 hover:bg-red-700 text-white" :
                      "bg-gray-600 hover:bg-gray-700 text-white"
                    }`}
                  >
                    {rec.action === "add" ? "Add to Portfolio" : 
                     rec.action === "increase" ? "Increase Position" :
                     rec.action === "decrease" ? "Reduce Position" : 
                     "Keep Position"}
                  </button>
                  {rec.action !== "add" && (
                    <button
                      onClick={() => {
                        const input = inputs.find(i => i.symbol === rec.symbol);
                        if (input) {
                          updateInput(input.id, "amount", 0);
                          calculateRecommendations();
                        }
                      }}
                      className="py-2 px-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg transition"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-6 p-5 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
            <h4 className="font-bold text-lg mb-3">Portfolio Reallocation Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Current Total</p>
                <p className="text-xl font-bold">${totalInvestment.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}</p>
              </div>
              <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Suggested Total</p>
                <p className="text-xl font-bold">${recommendations.reduce((sum, rec) => sum + rec.suggestedAmount, 0).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}</p>
              </div>
              <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Overall Change</p>
                <p className={`text-xl font-bold ${
                  recommendations.reduce((sum, rec) => sum + rec.difference, 0) > 0 
                    ? "text-green-600 dark:text-green-400" 
                    : "text-red-600 dark:text-red-400"
                }`}>
                  ${recommendations.reduce((sum, rec) => sum + rec.difference, 0).toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Reallocation Rate</p>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{reallocationRate}%</p>
              </div>
            </div>
            
            {/* Strategy Breakdown */}
            <div className="mt-4 p-3 bg-white/70 dark:bg-gray-800/70 rounded-lg">
              <h5 className="font-medium mb-2">Strategy Breakdown:</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Keep: <strong>${recommendations.filter(r => r.action === "keep" || r.action === "increase").reduce((sum, r) => sum + (r.keepAmount || 0), 0).toFixed(2)}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span>Move to Top Coins: <strong>${recommendations.filter(r => r.moveAmount).reduce((sum, r) => sum + (r.moveAmount || 0), 0).toFixed(2)}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span>Add New: <strong>${recommendations.filter(r => r.action === "add").reduce((sum, r) => sum + r.suggestedAmount, 0).toFixed(2)}</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Allocation Strategy */}
      {recommendations.length > 0 && (
        <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <h4 className="font-bold mb-3 flex items-center gap-2">💰 Smart Allocation Strategy</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Based on 24h performance with {reallocationRate}% reallocation from underperformers to top coins
          </p>
          <div className="space-y-3">
            {recommendations
              .sort((a, b) => b.suggestedAmount - a.suggestedAmount)
              .map((rec, index) => {
                const total = recommendations.reduce((sum, r) => sum + r.suggestedAmount, 0);
                const percentage = total > 0 ? (rec.suggestedAmount / total * 100).toFixed(1) : "0";
                
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{rec.symbol}</span>
                        {rec.action === "add" && (
                          <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded">
                            NEW
                          </span>
                        )}
                        <span className="text-xs text-gray-500">{rec.action}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-48 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              rec.action === "add" ? 'bg-blue-500' :
                              rec.action === "increase" ? 'bg-green-500' : 
                              rec.action === "decrease" ? 'bg-red-500' : 'bg-gray-400'
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-12 text-right">
                          {percentage}%
                        </span>
                      </div>
                    </div>
                    {rec.keepAmount !== undefined && rec.moveAmount !== undefined && rec.moveAmount > 0 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 ml-4">
                        From ${(rec.keepAmount + rec.moveAmount).toFixed(2)} → Keep ${rec.keepAmount.toFixed(2)} + Move ${rec.moveAmount.toFixed(2)}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}