"use client";

import { useState } from "react";
import { KnapsackChart } from "../../../components/KnapsackChart";
import { fractionalKnapsack, KnapsackResult } from "../../../utils/greedyAlgorithms";

export default function FractionalKnapsackPage() {
  const [capacity, setCapacity] = useState(50);
  const [weights, setWeights] = useState([10, 20, 30]);
  const [profits, setProfits] = useState([60, 100, 120]);
  const [result, setResult] = useState<KnapsackResult | null>(null);

  const handleSolve = () => {
    const output = fractionalKnapsack(capacity, weights, profits);
    setResult(output);
  };

  const addItem = () => {
    setWeights([...weights, 1]);
    setProfits([...profits, 1]);
  };

  const removeItem = (index: number) => {
    if (weights.length > 1) {
      setWeights(weights.filter((_, i) => i !== index));
      setProfits(profits.filter((_, i) => i !== index));
    }
  };

  const updateWeight = (index: number, value: number) => {
    const newWeights = [...weights];
    newWeights[index] = Math.max(1, value);
    setWeights(newWeights);
  };

  const updateProfit = (index: number, value: number) => {
    const newProfits = [...profits];
    newProfits[index] = Math.max(1, value);
    setProfits(newProfits);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Fractional Knapsack Algorithm
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Problem Input</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Knapsack Capacity:
            </label>
            <input
              type="number"
              min="1"
              className="w-32 border border-gray-300 rounded-md px-3 py-2"
              value={capacity}
              onChange={(e) => setCapacity(parseInt(e.target.value) || 1)}
            />
          </div>

          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-700">Items:</h3>
            {weights.map((weight, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Item {index + 1} Weight:</label>
                  <input
                    type="number"
                    min="1"
                    className="w-20 border border-gray-300 rounded px-2 py-1"
                    value={weight}
                    onChange={(e) => updateWeight(index, parseInt(e.target.value) || 1)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Profit:</label>
                  <input
                    type="number"
                    min="1"
                    className="w-20 border border-gray-300 rounded px-2 py-1"
                    value={profits[index]}
                    onChange={(e) => updateProfit(index, parseInt(e.target.value) || 1)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Ratio:</label>
                  <span className="text-sm text-gray-600 font-mono">
                    {(profits[index] / weight).toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={() => removeItem(index)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  disabled={weights.length <= 1}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={addItem}
              className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-md"
            >
              Add Item
            </button>
            <button
              onClick={handleSolve}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md"
            >
              Solve Knapsack
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Solution</h2>
            
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              <div className="flex items-center">
                <span className="text-2xl mr-2">💰</span>
                <div>
                  <p className="font-bold text-lg">
                    Maximum Profit: {result.totalProfit.toFixed(2)}
                  </p>
                  <p className="text-sm">
                    Items Selected: {result.selectedItems.length}
                  </p>
                </div>
              </div>
            </div>

            <KnapsackChart 
              data={result.selectedItems} 
            />
          </div>
        )}

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2 text-blue-800">How Fractional Knapsack works:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Calculate profit-to-weight ratio for each item</li>
            <li>• Sort items by ratio in descending order</li>
            <li>• Greedily select items starting with highest ratio</li>
            <li>• If an item doesn't fit completely, take a fraction of it</li>
            <li>• Continue until knapsack is full</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
