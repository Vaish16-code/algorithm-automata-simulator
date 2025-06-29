"use client";

import { useState } from "react";
import { KnapsackChart } from "../../../components/KnapsackChart";
import { fractionalKnapsack, KnapsackResult } from "../../../utils/greedyAlgorithms";
import { EducationalInfo, ExamResult } from "../../../../components";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Fractional Knapsack <span className="text-yellow-600">(Greedy Algorithm)</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Maximize profit by taking fractions of items using greedy approach based on value-to-weight ratio
          </p>
        </div>

        <EducationalInfo
          topic="Fractional Knapsack Problem (Greedy Algorithm)"
          description="The Fractional Knapsack problem allows taking fractions of items to maximize profit. The greedy approach sorts items by value-to-weight ratio and takes items greedily."
          theory={{
            definition: "Given items with weights and values, and a knapsack with capacity W, select items (or fractions) to maximize total value while staying within weight capacity.",
            keyPoints: [
              "Greedy choice: select item with highest value-to-weight ratio first",
              "Items can be taken in fractions unlike 0/1 knapsack",
              "Always produces optimal solution for fractional variant",
              "Time complexity: O(n log n) due to sorting"
            ],
            applications: [
              "Resource allocation with divisible resources",
              "Investment portfolio optimization",
              "Network bandwidth allocation",
              "Continuous optimization problems"
            ]
          }}
          mumbaiUniversity={{
            syllabus: [
              "Greedy Algorithm Strategy",
              "Fractional Knapsack Problem",
              "Value-to-Weight Ratio Analysis",
              "Greedy Choice Property",
              "Optimal Substructure Property"
            ],
            marks: "8-12 marks",
            commonQuestions: [
              "Solve fractional knapsack using greedy approach",
              "Compare with 0/1 knapsack solution",
              "Prove why greedy works for fractional variant",
              "Trace algorithm execution step by step"
            ],
            examTips: [
              "Always sort items by value/weight ratio in descending order",
              "Show the calculation of ratios clearly",
              "Take items completely until capacity allows, then take fraction",
              "Calculate total profit step by step"
            ]
          }}
          algorithm={{
            steps: [
              "Calculate value-to-weight ratio for each item",
              "Sort items in descending order of ratio",
              "Initialize total value = 0, remaining capacity = W",
              "For each item, take maximum possible (whole or fraction)",
              "Update total value and remaining capacity",
              "Continue until capacity is exhausted"
            ],
            complexity: {
              time: "O(n log n) for sorting + O(n) for selection",
              space: "O(1) auxiliary space"
            }
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Problem Input</h2>
              
              <div className="mb-6">
                <label className="block text-lg font-bold text-gray-900 mb-3">
                  Knapsack Capacity:
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full border-4 border-gray-800 rounded-md px-4 py-3 text-lg font-bold text-black bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-200"
                  value={capacity}
                  onChange={(e) => setCapacity(parseInt(e.target.value) || 1)}
                />
              </div>

              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-700">Items:</h3>
                {weights.map((weight, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="font-semibold text-gray-700">Item {index + 1}:</div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium">Weight:</label>
                      <input
                        type="number"
                        min="1"
                        className="w-20 border-4 border-gray-800 rounded px-3 py-2 text-black text-lg font-bold bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                        value={weight}
                        onChange={(e) => updateWeight(index, parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium">Profit:</label>
                      <input
                        type="number"
                        min="1"
                        className="w-20 border-4 border-gray-800 rounded px-3 py-2 text-black text-lg font-bold bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                        value={profits[index]}
                        onChange={(e) => updateProfit(index, parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div className="text-sm text-gray-600">
                      Ratio: {(profits[index] / weight).toFixed(2)}
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
                  className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium px-6 py-2 rounded-md"
                >
                  Solve Fractional Knapsack
                </button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {result && (
              <>
                <ExamResult
                  title="Fractional Knapsack Solution"
                  input={`Capacity: ${capacity}, Items: ${weights.length}`}
                  result={result.totalProfit > 0}
                  steps={result.selectedItems.map((item, index) => ({
                    stepNumber: index + 1,
                    description: `Item ${item.index}: ${item.fraction === 1 ? 'Complete' : `${(item.fraction * 100).toFixed(1)}% fraction`}`,
                    currentState: `Index: ${item.index}, Fraction: ${item.fraction}, Profit: ${item.profit.toFixed(2)}`,
                    explanation: `Added ${(item.fraction * 100).toFixed(1)}% of item ${item.index} for profit ${item.profit.toFixed(2)}`
                  }))}
                  finalAnswer={`Maximum profit achievable: ${result.totalProfit.toFixed(2)}`}
                  examFormat={{
                    question: `Solve the Fractional Knapsack problem with capacity ${capacity} and given items using Greedy Algorithm.`,
                    solution: [
                      `Items with ratios: ${weights.map((w, i) => `Item ${i+1}: w=${w}, p=${profits[i]}, ratio=${(profits[i]/w).toFixed(2)}`).join(', ')}`,
                      `Capacity: ${capacity}`,
                      `Greedy Strategy: Sort by value/weight ratio in descending order`,
                      `Solution steps:`,
                      ...result.selectedItems.map((item, i) => 
                        `  Step ${i+1}: Take ${(item.fraction * 100).toFixed(1)}% of Item ${item.index} for profit ${item.profit.toFixed(2)}`
                      ),
                      `Total weight used: ${weights.filter((_, i) => result.selectedItems.some(item => item.index === i+1)).reduce((sum, w, i) => {
                        const selectedItem = result.selectedItems.find(item => item.index === i+1);
                        return sum + (selectedItem ? w * selectedItem.fraction : 0);
                      }, 0).toFixed(1)}`,
                      `Maximum profit: ${result.totalProfit.toFixed(2)}`
                    ],
                    conclusion: `The greedy algorithm achieves optimal profit of ${result.totalProfit.toFixed(2)} by selecting items in order of their value-to-weight ratio.`,
                    marks: 12
                  }}
                />

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Solution Visualization</h3>
                  <KnapsackChart data={result.selectedItems} />
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Solution Analysis</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Selected Items:</h4>
                      <div className="space-y-2">
                        {result.selectedItems.map((item, index) => (
                          <div key={index} className="bg-yellow-50 p-3 rounded border border-yellow-200">
                            <div className="font-semibold text-yellow-800">
                              Item {item.index} ({(item.fraction * 100).toFixed(1)}%)
                            </div>
                            <div className="text-sm text-yellow-600">
                              Profit: {item.profit.toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Summary:</h4>
                      <div className="space-y-2 text-sm">
                        <div>Total Items: {weights.length}</div>
                        <div>Items Used: {result.selectedItems.length}</div>
                        <div>Total Weight: {weights.filter((_, i) => result.selectedItems.some(item => item.index === i+1)).reduce((sum, w, i) => {
                          const selectedItem = result.selectedItems.find(item => item.index === i+1);
                          return sum + (selectedItem ? w * selectedItem.fraction : 0);
                        }, 0).toFixed(1)}</div>
                        <div>Capacity Used: {((weights.filter((_, i) => result.selectedItems.some(item => item.index === i+1)).reduce((sum, w, i) => {
                          const selectedItem = result.selectedItems.find(item => item.index === i+1);
                          return sum + (selectedItem ? w * selectedItem.fraction : 0);
                        }, 0) / capacity) * 100).toFixed(1)}%</div>
                        <div className="font-bold text-lg text-yellow-600">Maximum Profit: {result.totalProfit.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Algorithm Overview</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">Greedy Strategy:</h4>
                  <ul className="space-y-1 text-xs list-disc ml-4">
                    <li>Calculate value-to-weight ratio for each item</li>
                    <li>Sort items by ratio in descending order</li>
                    <li>Greedily select items with highest ratios first</li>
                    <li>Take fractions of items when capacity is partially available</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">Why Greedy Works:</h4>
                  <ul className="space-y-1 text-xs list-disc ml-4">
                    <li>Greedy choice property: local optimal choice leads to global optimum</li>
                    <li>Optimal substructure: optimal solution contains optimal sub-solutions</li>
                    <li>Exchange argument proves optimality for fractional variant</li>
                    <li>Time: O(n log n), Space: O(1) - very efficient</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
