import React, { useState } from 'react';
import { SelectedItem, KnapsackResult } from '../utils/greedyAlgorithms';

interface KnapsackChartProps {
  data: SelectedItem[];
}

// KnapsackChart Component
export function KnapsackChart({ data }: KnapsackChartProps) {
  if (!data || data.length === 0) return null;
  
  return (
    <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
      <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
        📊 Item Selection Visualization
      </h3>
      <div className="space-y-4">
        {data.map((item: SelectedItem, idx: number) => (
          <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-bold text-gray-800">Item {item.index}</span>
              <span className="text-lg font-bold text-green-600">₹{item.profit.toFixed(2)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-10 relative overflow-hidden border-2 border-gray-300">
              <div
                className="bg-gradient-to-r from-green-400 to-blue-500 h-full rounded-full flex items-center justify-center text-white text-lg font-bold transition-all duration-500 ease-out shadow-inner"
                style={{ width: `${Math.max(item.fraction * 100, 8)}%` }}
              >
                {item.fraction === 1 ? "100%" : `${(item.fraction * 100).toFixed(1)}%`}
              </div>
            </div>
            <div className="text-sm text-gray-600 mt-1 text-center">
              {item.fraction === 1 ? "Complete item taken" : "Partial item taken"}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-yellow-100 rounded-lg border-2 border-yellow-300">
        <p className="text-sm font-semibold text-yellow-800 flex items-center">
          💡 The bar width shows how much of each item we put in the knapsack!
        </p>
      </div>
    </div>
  );
}

// Main Component
export default function StudentFriendlyKnapsack() {
  const [weights, setWeights] = useState<number[]>([3, 3, 2, 5, 1]);
  const [profits, setProfits] = useState<number[]>([10, 15, 10, 20, 8]);
  const [capacity, setCapacity] = useState<number>(5);
  const [result, setResult] = useState<KnapsackResult | null>(null);

  // Fractional Knapsack Algorithm
  const fractionalKnapsack = (capacity: number, weights: number[], profits: number[]): KnapsackResult => {
    interface Item {
      index: number;
      weight: number;
      profit: number;
      ratio: number;
    }
    
    const items: Item[] = weights.map((weight: number, index: number) => ({
      index: index + 1,
      weight: weight,
      profit: profits[index],
      ratio: profits[index] / weight
    }));

    items.sort((a: Item, b: Item) => b.ratio - a.ratio);

    let totalProfit = 0;
    let remainingCapacity = capacity;
    const selectedItems = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (remainingCapacity === 0) break;

      if (item.weight <= remainingCapacity) {
        selectedItems.push({
          index: item.index,
          fraction: 1,
          profit: item.profit
        });
        totalProfit += item.profit;
        remainingCapacity -= item.weight;
      } else {
        const fraction = remainingCapacity / item.weight;
        const fractionalProfit = item.profit * fraction;
        
        selectedItems.push({
          index: item.index,
          fraction: fraction,
          profit: fractionalProfit
        });
        totalProfit += fractionalProfit;
        remainingCapacity = 0;
      }
    }

    return {
      totalProfit: totalProfit,
      selectedItems: selectedItems
    };
  };

  const handleSolve = () => {
    const output = fractionalKnapsack(capacity, weights, profits);
    setResult(output);
  };

  const handleWeightsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newWeights = value
      .split(',')
      .map((w: string) => {
        const trimmed = w.trim();
        const parsed = parseInt(trimmed);
        return isNaN(parsed) ? null : parsed;
      })
      .filter((w: number | null) => w !== null) as number[];
    setWeights(newWeights);
  };

  const handleProfitsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newProfits = value
      .split(',')
      .map((p: string) => {
        const trimmed = p.trim();
        const parsed = parseInt(trimmed);
        return isNaN(parsed) ? null : parsed;
      })
      .filter((p: number | null) => p !== null) as number[];
    setProfits(newProfits);
  };

  const handleCapacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const parsed = parseInt(value);
    setCapacity(isNaN(parsed) ? 0 : parsed);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-green-100 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
            🎒 Fractional Knapsack Algorithm
          </h1>
          <p className="text-xl text-gray-600 font-medium">
            Learn how the greedy algorithm finds the best solution!
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-4 border-blue-200">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
            ⚙️ Input Your Data
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl border-2 border-yellow-300">
              <label className="block text-lg font-bold text-gray-800 mb-3">
                🎒 Knapsack Capacity:
              </label>
              <input
                type="number"
                className="w-full text-2xl font-bold border-4 border-yellow-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 bg-white text-gray-800"
                value={capacity}
                onChange={handleCapacityChange}
                min="1"
              />
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-300">
              <label className="block text-lg font-bold text-gray-800 mb-3">
                ⚖️ Weights (comma-separated):
              </label>
              <input
                type="text"
                className="w-full text-xl font-semibold border-4 border-blue-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white text-gray-800"
                value={weights.join(', ')}
                onChange={handleWeightsChange}
                placeholder="e.g., 3, 3, 2, 5, 1"
              />
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border-2 border-green-300">
              <label className="block text-lg font-bold text-gray-800 mb-3">
                💰 Profits (comma-separated):
              </label>
              <input
                type="text"
                className="w-full text-xl font-semibold border-4 border-green-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-500 bg-white text-gray-800"
                value={profits.join(', ')}
                onChange={handleProfitsChange}
                placeholder="e.g., 10, 15, 10, 20, 8"
              />
            </div>
          </div>

          {/* Error Message */}
          {weights.length !== profits.length && (
            <div className="bg-red-200 border-4 border-red-400 text-red-800 px-6 py-4 rounded-xl mt-6 text-lg font-semibold">
              ⚠️ The number of weights and profits must be the same!
            </div>
          )}

          {/* Solve Button */}
          <div className="flex justify-center mt-8">
            <button
              className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white text-xl font-bold px-10 py-4 rounded-xl transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg transform hover:scale-105 border-4 border-purple-300"
              onClick={handleSolve}
              disabled={weights.length !== profits.length || weights.length === 0}
            >
              🚀 Solve Knapsack Problem
            </button>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border-4 border-green-200">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
              🎉 Solution Found!
            </h2>
            
            {/* Total Profit Display */}
            <div className="bg-gradient-to-r from-green-200 to-emerald-200 border-4 border-green-400 text-green-800 px-8 py-6 rounded-xl mb-8">
              <div className="flex items-center justify-center gap-4">
                <span className="text-4xl">💰</span>
                <div className="text-center">
                  <p className="text-3xl font-bold">
                    Maximum Profit: ₹{result.totalProfit.toFixed(2)}
                  </p>
                  <p className="text-lg font-semibold mt-2">
                    Found using the Greedy Fractional Knapsack Algorithm!
                  </p>
                </div>
              </div>
            </div>

            {/* Selected Items Table */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                📝 Selected Items Details:
              </h3>
              <div className="overflow-x-auto bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border-2 border-gray-300">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                      <th className="border-2 border-gray-400 px-6 py-4 text-xl font-bold">Item Number</th>
                      <th className="border-2 border-gray-400 px-6 py-4 text-xl font-bold">Fraction Taken</th>
                      <th className="border-2 border-gray-400 px-6 py-4 text-xl font-bold">Profit Earned</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.selectedItems.map((item: SelectedItem, idx: number) => (
                      <tr key={idx} className={idx % 2 === 0 ? "bg-blue-50" : "bg-white"}>
                        <td className="border-2 border-gray-400 px-6 py-4 text-xl font-bold text-center text-gray-800">
                          Item {item.index}
                        </td>
                        <td className="border-2 border-gray-400 px-6 py-4 text-xl font-bold text-center text-blue-600">
                          {item.fraction === 1 ? "100%" : `${(item.fraction * 100).toFixed(1)}%`}
                        </td>
                        <td className="border-2 border-gray-400 px-6 py-4 text-xl font-bold text-center text-green-600">
                          ₹{item.profit.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Visualization */}
            <KnapsackChart data={result.selectedItems} />
          </div>
        )}

        {/* How it Works Section */}
        <div className="mt-8 bg-gradient-to-br from-indigo-100 to-purple-100 border-4 border-indigo-300 rounded-2xl p-8">
          <h3 className="text-2xl font-bold mb-4 text-indigo-800 flex items-center gap-2">
            🧠 How the Algorithm Works:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border-2 border-indigo-200 shadow-md">
              <div className="text-lg font-bold text-gray-800 mb-2">Step 1: Calculate Ratios</div>
              <div className="text-gray-700">Find profit-to-weight ratio for each item</div>
            </div>
            <div className="bg-white p-4 rounded-xl border-2 border-indigo-200 shadow-md">
              <div className="text-lg font-bold text-gray-800 mb-2">Step 2: Sort Items</div>
              <div className="text-gray-700">Sort items by ratio (highest first)</div>
            </div>
            <div className="bg-white p-4 rounded-xl border-2 border-indigo-200 shadow-md">
              <div className="text-lg font-bold text-gray-800 mb-2">Step 3: Greedy Selection</div>
              <div className="text-gray-700">Pick items with best ratios first</div>
            </div>
            <div className="bg-white p-4 rounded-xl border-2 border-indigo-200 shadow-md">
              <div className="text-lg font-bold text-gray-800 mb-2">Step 4: Take Fractions</div>
              <div className="text-gray-700">Take partial items when full items don&apos;t fit</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}