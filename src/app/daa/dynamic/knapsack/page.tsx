"use client";

import { useState } from "react";
import { KnapsackDPChart } from "../../../components/KnapsackDPChart";
import { knapsackDP, KnapsackDPResult } from "../../../utils/dynamicProgramming";
import { EducationalInfo, ExamResult } from "../../../../components";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            0/1 Knapsack <span className="text-purple-600">(Dynamic Programming)</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Solve the classic optimization problem using dynamic programming with interactive visualization
          </p>
        </div>

        <EducationalInfo
          topic="0/1 Knapsack Problem (Dynamic Programming)"
          description="The 0/1 Knapsack problem is a classic optimization problem where items cannot be fractioned. It demonstrates the power of dynamic programming for solving overlapping subproblems."
          theory={{
            definition: "Given a set of items with weights and values, and a knapsack with capacity W, select items to maximize value without exceeding weight capacity. Each item can be taken at most once.",
            keyPoints: [
              "Optimal substructure: solution contains optimal solutions to subproblems",
              "Overlapping subproblems: same subproblems solved multiple times",
              "Bottom-up approach using memoization table",
              "Time complexity: O(nW), Space complexity: O(nW)"
            ],
            applications: [
              "Resource allocation in project management",
              "Budget optimization and investment decisions",
              "Memory management in operating systems",
              "Cargo loading and logistics optimization"
            ]
          }}
          mumbaiUniversity={{
            syllabus: [
              "Dynamic Programming fundamentals",
              "0/1 Knapsack problem formulation",
              "DP table construction and filling",
              "Backtracking to find optimal solution",
              "Space optimization techniques"
            ],
            marks: "12-15 marks",
            commonQuestions: [
              "Solve 0/1 knapsack using DP table",
              "Trace the algorithm execution step by step",
              "Find which items are included in optimal solution",
              "Compare with greedy fractional knapsack"
            ],
            examTips: [
              "Draw the DP table clearly with proper indexing",
              "Show the recurrence relation: dp[i][w] = max(dp[i-1][w], dp[i-1][w-wi] + vi)",
              "Always trace back to find the actual items selected",
              "Mention time and space complexity"
            ]
          }}
          algorithm={{
            steps: [
              "Create DP table dp[n+1][W+1] initialized to 0",
              "For each item i and weight w, apply recurrence relation",
              "If wi <= w: dp[i][w] = max(dp[i-1][w], dp[i-1][w-wi] + vi)",
              "Else: dp[i][w] = dp[i-1][w]",
              "Traceback from dp[n][W] to find selected items",
              "Return maximum value and selected items"
            ],
            complexity: {
              time: "O(n × W) where n = items, W = capacity",
              space: "O(n × W) for DP table, can be optimized to O(W)"
            }
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Input Parameters</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Knapsack Capacity:
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full border-4 border-gray-800 rounded-md px-3 py-2 bg-white text-gray-900 font-bold text-lg focus:outline-none focus:ring-4 focus:ring-purple-500 focus:border-purple-500 shadow-md"
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
                        className="w-20 border-4 border-gray-800 rounded px-2 py-1 bg-white text-gray-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        value={item.weight}
                        onChange={(e) => updateItem(index, 'weight', parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium">Value:</label>
                      <input
                        type="number"
                        min="1"
                        className="w-20 border-4 border-gray-800 rounded px-2 py-1 bg-white text-gray-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                  className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2 rounded-md"
                >
                  Solve 0/1 Knapsack
                </button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {result && (
              <>
                <ExamResult
                  title="0/1 Knapsack Solution"
                  input={`Capacity: ${capacity}, Items: ${items.length}`}
                  result={result.maxValue > 0}
                  steps={result.selectedItems.map((item, index) => ({
                    stepNumber: index + 1,
                    description: `Selected Item ${item.index + 1}`,
                    currentState: `Weight: ${item.weight}, Value: ${item.value}`,
                    explanation: `Added item with value-to-weight ratio ${(item.value / item.weight).toFixed(2)}`
                  }))}
                  finalAnswer={`Maximum value achievable: ${result.maxValue}`}
                  examFormat={{
                    question: `Solve the 0/1 Knapsack problem with capacity ${capacity} and given items using Dynamic Programming.`,
                    solution: [
                      `Items: ${items.map((item, i) => `Item ${i+1}: w=${item.weight}, v=${item.value}`).join(', ')}`,
                      `Capacity: ${capacity}`,
                      `DP Recurrence: dp[i][w] = max(dp[i-1][w], dp[i-1][w-wi] + vi)`,
                      `Selected items: ${result.selectedItems.map(item => `Item ${item.index + 1}`).join(', ')}`,
                      `Total weight used: ${result.selectedItems.reduce((sum, item) => sum + item.weight, 0)}`,
                      `Maximum value: ${result.maxValue}`
                    ],
                    conclusion: `The optimal solution selects ${result.selectedItems.length} items with total value ${result.maxValue}.`,
                    marks: 15
                  }}
                />

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">DP Table Visualization</h3>
                  <KnapsackDPChart data={result} capacity={capacity} />
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Solution Analysis</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Selected Items:</h4>
                      <div className="space-y-2">
                        {result.selectedItems.map((item, index) => (
                          <div key={index} className="bg-green-50 p-3 rounded border border-green-200">
                            <div className="font-semibold text-green-800">Item {item.index + 1}</div>
                            <div className="text-sm text-green-600">
                              Weight: {item.weight}, Value: {item.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Summary:</h4>
                      <div className="space-y-2 text-sm">
                        <div>Total Items: {items.length}</div>
                        <div>Selected Items: {result.selectedItems.length}</div>
                        <div>Total Weight: {result.selectedItems.reduce((sum, item) => sum + item.weight, 0)}</div>
                        <div>Capacity Used: {((result.selectedItems.reduce((sum, item) => sum + item.weight, 0) / capacity) * 100).toFixed(1)}%</div>
                        <div className="font-bold text-lg text-purple-600">Maximum Value: {result.maxValue}</div>
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
                  <h4 className="font-medium text-gray-800 mb-1">Dynamic Programming Approach:</h4>
                  <ul className="space-y-1 text-xs list-disc ml-4">
                    <li>Create 2D table dp[i][w] for items and weight capacities</li>
                    <li>For each item, decide: include or exclude to maximize value</li>
                    <li>Recurrence: dp[i][w] = max(dp[i-1][w], dp[i-1][w-wi] + vi)</li>
                    <li>Backtrack from dp[n][W] to find selected items</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">Key Properties:</h4>
                  <ul className="space-y-1 text-xs list-disc ml-4">
                    <li>Optimal substructure: optimal solution contains optimal sub-solutions</li>
                    <li>Overlapping subproblems: same subproblems solved multiple times</li>
                    <li>Bottom-up construction avoids redundant calculations</li>
                    <li>Time: O(nW), Space: O(nW) - can be optimized to O(W)</li>
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
