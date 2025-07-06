"use client";

import { useState } from "react";
import { KnapsackChart } from "../../../components/KnapsackChart";
import { fractionalKnapsack, KnapsackResult } from "../../../utils/greedyAlgorithms";
import { EducationalInfo, ExamResult } from "../../../../components";

export default function FractionalKnapsackPage() {
  const [capacity, setCapacity] = useState("");
  const [weights, setWeights] = useState([""]);
  const [profits, setProfits] = useState([""]);
  const [result, setResult] = useState<KnapsackResult | null>(null);

  const handleSolve = () => {
    const capacityNum = parseInt(capacity) || 0;
    const weightsNum = weights.map(w => parseInt(w) || 0).filter(w => w > 0);
    const profitsNum = profits.map(p => parseInt(p) || 0).filter(p => p > 0);
    
    if (capacityNum > 0 && weightsNum.length > 0 && profitsNum.length > 0 && weightsNum.length === profitsNum.length) {
      const output = fractionalKnapsack(capacityNum, weightsNum, profitsNum);
      setResult(output);
    }
  };

  const addItem = () => {
    setWeights([...weights, ""]);
    setProfits([...profits, ""]);
  };

  const removeItem = (index: number) => {
    if (weights.length > 1) {
      setWeights(weights.filter((_, i) => i !== index));
      setProfits(profits.filter((_, i) => i !== index));
    }
  };

  const updateWeight = (index: number, value: string) => {
    const newWeights = [...weights];
    newWeights[index] = value;
    setWeights(newWeights);
  };

  const updateProfit = (index: number, value: string) => {
    const newProfits = [...profits];
    newProfits[index] = value;
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
          university={{
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
                  type="text"
                  className="w-full border-4 border-gray-800 rounded-md px-4 py-3 text-lg font-bold text-black bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-200 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                  value={capacity}
                  placeholder="Enter knapsack capacity (e.g., 50)"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                  onChange={(e) => setCapacity(e.target.value)}
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
                        type="text"
                        className="w-20 border-4 border-gray-800 rounded px-3 py-2 text-black text-lg font-bold bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-200 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                        value={weight}
                        placeholder="W"
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck="false"
                        key={`weight-${index}`}
                        onChange={(e) => updateWeight(index, e.target.value)}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium">Profit:</label>
                      <input
                        type="text"
                        className="w-20 border-4 border-gray-800 rounded px-3 py-2 text-black text-lg font-bold bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-200 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                        value={profits[index]}
                        placeholder="P"
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck="false"
                        key={`profit-${index}`}
                        onChange={(e) => updateProfit(index, e.target.value)}
                      />
                    </div>
                    <div className="text-sm text-gray-600">
                      Ratio: {weight && profits[index] && !isNaN(parseInt(weight)) && !isNaN(parseInt(profits[index])) 
                        ? (parseInt(profits[index]) / parseInt(weight)).toFixed(2) 
                        : '--'}
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
                {/* Solution Table - Following the handwritten method */}
                <div className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-800">
                  <h3 className="text-xl font-bold mb-6 text-gray-900">Fractional Knapsack Solution (Maximum P/W Ratio Method)</h3>
                  
                  {/* Initial Setup */}
                  <div className="mb-6 bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4">
                    <h4 className="text-lg font-bold text-yellow-800 mb-2">Given:</h4>
                    <p className="text-yellow-700"><strong>Knapsack Capacity (W) = {parseInt(capacity) || 0}</strong></p>
                    <p className="text-yellow-700"><strong>Number of Items (n) = {weights.filter(w => parseInt(w) > 0).length}</strong></p>
                  </div>

                  {/* Step 1: Calculate P/W ratios and sort */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-3 text-gray-800">Step 1: Calculate P/W Ratios and Sort (Highest First)</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full border-2 border-gray-800 text-sm">
                        <thead className="bg-gray-800 text-white">
                          <tr>
                            <th className="border border-gray-600 px-4 py-3 text-center font-bold">Object</th>
                            <th className="border border-gray-600 px-4 py-3 text-center font-bold">Profit (P)</th>
                            <th className="border border-gray-600 px-4 py-3 text-center font-bold">Weight (W)</th>
                            <th className="border border-gray-600 px-4 py-3 text-center font-bold">P/W Ratio</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white">
                          {weights
                            .map((weight, index) => ({
                              originalIndex: index + 1,
                              weight: parseInt(weight) || 0,
                              profit: parseInt(profits[index]) || 0,
                              ratio: (parseInt(profits[index]) || 0) / (parseInt(weight) || 1)
                            }))
                            .filter(item => item.weight > 0 && item.profit > 0)
                            .sort((a, b) => b.ratio - a.ratio)
                            .map((item, sortedIndex) => (
                              <tr key={sortedIndex} className="border-b border-gray-300">
                                <td className="border border-gray-300 px-4 py-3 text-center font-bold">{item.originalIndex}</td>
                                <td className="border border-gray-300 px-4 py-3 text-center">{item.profit}</td>
                                <td className="border border-gray-300 px-4 py-3 text-center">{item.weight}</td>
                                <td className="border border-gray-300 px-4 py-3 text-center font-bold text-blue-600">{item.ratio.toFixed(2)}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Step 2: Solution Process - Exactly like handwritten method */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-3 text-gray-800">Step 2: Greedy Selection Process</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full border-2 border-gray-800 text-sm">
                        <thead className="bg-gray-800 text-white">
                          <tr>
                            <th className="border border-gray-600 px-3 py-3 text-center font-bold">Object</th>
                            <th className="border border-gray-600 px-3 py-3 text-center font-bold">Profit (P)</th>
                            <th className="border border-gray-600 px-3 py-3 text-center font-bold">Weight (W)</th>
                            <th className="border border-gray-600 px-3 py-3 text-center font-bold">Remaining Weight</th>
                            <th className="border border-gray-600 px-3 py-3 text-center font-bold">Fraction</th>
                            <th className="border border-gray-600 px-3 py-3 text-center font-bold">Profit Gained</th>
                            <th className="border border-gray-600 px-3 py-3 text-center font-bold">Total Profit</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white">
                          {(() => {
                            let remainingCapacity = parseInt(capacity) || 0;
                            let totalProfit = 0;
                            const sortedItems = weights
                              .map((weight, index) => ({
                                originalIndex: index + 1,
                                weight: parseInt(weight) || 0,
                                profit: parseInt(profits[index]) || 0,
                                ratio: (parseInt(profits[index]) || 0) / (parseInt(weight) || 1)
                              }))
                              .filter(item => item.weight > 0 && item.profit > 0)
                              .sort((a, b) => b.ratio - a.ratio);
                            
                            return sortedItems.map((item, step) => {
                              if (remainingCapacity <= 0) return null;
                              
                              const canTakeFull = item.weight <= remainingCapacity;
                              const fraction = canTakeFull ? 1 : remainingCapacity / item.weight;
                              const weightTaken = canTakeFull ? item.weight : remainingCapacity;
                              const profitGained = item.profit * fraction;
                              
                              const beforeRemaining = remainingCapacity;
                              remainingCapacity -= weightTaken;
                              totalProfit += profitGained;
                              
                              return (
                                <tr key={step} className="border-b border-gray-300">
                                  <td className="border border-gray-300 px-3 py-3 text-center font-bold text-lg">{item.originalIndex}</td>
                                  <td className="border border-gray-300 px-3 py-3 text-center">{item.profit}</td>
                                  <td className="border border-gray-300 px-3 py-3 text-center">{item.weight}</td>
                                  <td className="border border-gray-300 px-3 py-3 text-center font-bold text-red-600">
                                    {beforeRemaining} → {Math.max(0, remainingCapacity).toFixed(1)}
                                  </td>
                                  <td className="border border-gray-300 px-3 py-3 text-center font-bold text-green-600">
                                    {fraction === 1 ? '1' : `${weightTaken}/${item.weight} = ${fraction.toFixed(3)}`}
                                  </td>
                                  <td className="border border-gray-300 px-3 py-3 text-center font-bold text-blue-600">
                                    {fraction === 1 ? profitGained.toFixed(0) : `${fraction.toFixed(3)} × ${item.profit} = ${profitGained.toFixed(2)}`}
                                  </td>
                                  <td className="border border-gray-300 px-3 py-3 text-center font-bold text-purple-600 text-lg">
                                    {totalProfit.toFixed(2)}
                                  </td>
                                </tr>
                              );
                            }).filter(row => row !== null);
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Final Answer */}
                  <div className="bg-green-100 border-2 border-green-500 rounded-lg p-6">
                    <h4 className="text-xl font-bold text-green-800 mb-3">Final Answer:</h4>
                    <div className="text-green-700 space-y-2">
                      <p className="text-2xl font-bold">Maximum Profit = {result.totalProfit.toFixed(2)}</p>
                      <p className="text-lg">
                        <strong>Solution Strategy:</strong> Take items in order of highest P/W ratio until knapsack is full
                      </p>
                      <p className="text-lg">
                        <strong>Items Selected:</strong> {result.selectedItems.map((item, index) => 
                          `Item ${item.index}${item.fraction < 1 ? ` (${(item.fraction * 100).toFixed(1)}%)` : ''}`
                        ).join(', ')}
                      </p>
                    </div>
                  </div>
                </div>

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
                      `Items with ratios: ${weights.map((w, i) => {
                        const weight = parseInt(w) || 0;
                        const profit = parseInt(profits[i]) || 0;
                        return weight > 0 && profit > 0 ? `Item ${i+1}: w=${weight}, p=${profit}, ratio=${(profit/weight).toFixed(2)}` : '';
                      }).filter(s => s).join(', ')}`,
                      `Capacity: ${capacity}`,
                      `Greedy Strategy: Sort by value/weight ratio in descending order`,
                      `Solution steps:`,
                      ...result.selectedItems.map((item, i) => 
                        `  Step ${i+1}: Take ${(item.fraction * 100).toFixed(1)}% of Item ${item.index} for profit ${item.profit.toFixed(2)}`
                      ),
                      `Total weight used: ${weights.filter((_, i) => result.selectedItems.some(item => item.index === i+1)).reduce((sum, w, i) => {
                        const selectedItem = result.selectedItems.find(item => item.index === i+1);
                        const weight = parseInt(w) || 0;
                        return sum + (selectedItem ? weight * selectedItem.fraction : 0);
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
                          const weight = parseInt(w) || 0;
                          return sum + (selectedItem ? weight * selectedItem.fraction : 0);
                        }, 0).toFixed(1)}</div>
                        <div>Capacity Used: {((weights.filter((_, i) => result.selectedItems.some(item => item.index === i+1)).reduce((sum, w, i) => {
                          const selectedItem = result.selectedItems.find(item => item.index === i+1);
                          const weight = parseInt(w) || 0;
                          return sum + (selectedItem ? weight * selectedItem.fraction : 0);
                        }, 0) / (parseInt(capacity) || 1)) * 100).toFixed(1)}%</div>
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
