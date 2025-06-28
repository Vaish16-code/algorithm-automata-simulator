"use client";

import { useState } from "react";
import { KnapsackDPChart } from "../../../components/KnapsackDPChart";
import { knapsackDP, KnapsackDPResult } from "../../../utils/dynamicProgramming";

export default function KnapsackDPPage() {
  const [capacity, setCapacity] = useState(7);
  const [items, setItems] = useState([
    { weight: 1, value: 1 },
    { weight: 3, value: 4 },
    { weight: 4, value: 5 },
    { weight: 5, value: 7 }
  ]);
  const [result, setResult] = useState<KnapsackDPResult | null>(null);

  const handleSolve = () => {
    const weights = items.map(item => item.weight);
    const values = items.map(item => item.value);
    const output = knapsackDP(capacity, weights, values);
    setResult(output);
  };

  const addItem = () => {
    setItems([...items, { weight: 1, value: 1 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: number) => {
    setItems(items.map((item, i) => 
      i === index ? { ...item, [field]: Math.max(1, value) } : item
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          0/1 Knapsack (Dynamic Programming)
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Input Parameters</h2>
          
          <div className="mb-4">
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
            {items.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="font-semibold text-gray-700">Item {index + 1}:</div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Weight:</label>
                  <input
                    type="number"
                    min="1"
                    className="w-20 border border-gray-300 rounded px-2 py-1"
                    value={item.weight}
                    onChange={(e) => updateItem(index, 'weight', parseInt(e.target.value) || 1)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Value:</label>
                  <input
                    type="number"
                    min="1"
                    className="w-20 border border-gray-300 rounded px-2 py-1"
                    value={item.value}
                    onChange={(e) => updateItem(index, 'value', parseInt(e.target.value) || 1)}
                  />
                </div>
                <button
                  onClick={() => removeItem(index)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  disabled={items.length <= 1}
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
              Solve 0/1 Knapsack
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Solution</h2>
            
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-6">
              <div className="flex items-center">
                <span className="text-2xl mr-2">🎒</span>
                <div>
                  <p className="font-bold text-lg">
                    Maximum Value: {result.maxValue}
                  </p>
                  <p className="text-sm">
                    Items selected: {result.selectedItems.length}
                  </p>
                </div>
              </div>
            </div>

            <KnapsackDPChart data={result} capacity={capacity} />
          </div>
        )}

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2 text-blue-800">How 0/1 Knapsack DP works:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Create a 2D table dp[i][w] where i is item index and w is weight capacity</li>
            <li>• For each item, decide whether to include it or not</li>
            <li>• dp[i][w] = max(value[i] + dp[i-1][w-weight[i]], dp[i-1][w])</li>
            <li>• Backtrack to find which items were selected</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
