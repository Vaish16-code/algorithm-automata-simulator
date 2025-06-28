"use client";

import { useState } from "react";
import { KnapsackChart } from "../../components/KnapsackChart";
import { fractionalKnapsack, KnapsackResult } from "../../utils/greedyAlgorithms";

export default function KnapsackPage() {
  const [weights, setWeights] = useState<number[]>([3, 3, 2, 5, 1]);
  const [profits, setProfits] = useState<number[]>([10, 15, 10, 20, 8]);
  const [capacity, setCapacity] = useState<number>(5);
  const [result, setResult] = useState<KnapsackResult | null>(null);

  const handleSolve = () => {
    const output = fractionalKnapsack(capacity, weights, profits);
    setResult(output);
  };

  const handleWeightsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWeights = e.target.value
      .split(',')
      .map(w => parseInt(w.trim()))
      .filter(w => !isNaN(w));
    setWeights(newWeights);
  };

  const handleProfitsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProfits = e.target.value
      .split(',')
      .map(p => parseInt(p.trim()))
      .filter(p => !isNaN(p));
    setProfits(newProfits);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Fractional Knapsack (Greedy Algorithm)
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Input Parameters</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Knapsack Capacity:
              </label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={capacity}
                onChange={(e) => setCapacity(parseInt(e.target.value) || 0)}
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weights (comma-separated):
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={weights.join(', ')}
                onChange={handleWeightsChange}
                placeholder="e.g., 3, 3, 2, 5, 1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profits (comma-separated):
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={profits.join(', ')}
                onChange={handleProfitsChange}
                placeholder="e.g., 10, 15, 10, 20, 8"
              />
            </div>
          </div>

          {weights.length !== profits.length && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              ⚠️ Weights and profits arrays must have the same length!
            </div>
          )}

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={handleSolve}
            disabled={weights.length !== profits.length || weights.length === 0}
          >
            Solve Knapsack Problem
          </button>
        </div>

        {result && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Solution</h2>
            
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              <div className="flex items-center">
                <span className="text-2xl mr-2">💰</span>
                <div>
                  <p className="font-bold text-lg">
                    Maximum Profit: ${result.totalProfit.toFixed(2)}
                  </p>
                  <p className="text-sm">
                    Achieved using greedy fractional knapsack algorithm
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-700">Selected Items:</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left">Item</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Fraction Taken</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Profit Earned</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.selectedItems.map((item, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                        <td className="border border-gray-300 px-4 py-2 font-medium">
                          Item {item.index}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {item.fraction === 1 ? "100%" : `${(item.fraction * 100).toFixed(1)}%`}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 font-medium text-green-600">
                          ${item.profit.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <KnapsackChart data={result.selectedItems} />
          </div>
        )}

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2 text-blue-800">How it works:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Calculate profit-to-weight ratio for each item</li>
            <li>• Sort items by ratio in descending order</li>
            <li>• Greedily select items with highest ratios first</li>
            <li>• Take fractions of items when full item doesn't fit</li>
          </ul>
        </div>
      </div>
    </div>
  );
}