"use client";

import { useState } from "react";
import { subsetSum, SubsetSumResult } from "../../../utils/backtracking";
import { EducationalInfo, ExamResult } from "../../../../components";

export default function SubsetSumPage() {
  const [inputArray, setInputArray] = useState([3, 34, 4, 12, 5, 2]);
  const [targetSum, setTargetSum] = useState(9);
  const [result, setResult] = useState<SubsetSumResult | null>(null);

  const handleSolve = () => {
    const output = subsetSum(inputArray, targetSum);
    setResult(output);
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newArray = value
      .split(',')
      .map(n => parseInt(n.trim()))
      .filter(n => !isNaN(n) && n > 0);
    setInputArray(newArray);
  };

  const generateRandomArray = () => {
    const size = Math.floor(Math.random() * 6) + 4; // 4-9 elements
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 20) + 1);
    setInputArray(newArray);
    // Set target to be achievable but not trivial
    const maxSum = newArray.reduce((a, b) => a + b, 0);
    setTargetSum(Math.floor(Math.random() * (maxSum / 2)) + 5);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Subset Sum Problem <span className="text-yellow-600">(Backtracking)</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find if there exists a subset of given array that sums to a target value
          </p>
        </div>

        <EducationalInfo
          topic="Subset Sum Problem"
          description="The Subset Sum problem asks whether there exists a subset of a given set of integers that sums to a specific target value."
          theory={{
            definition: "Given a set of positive integers and a target sum, determine if there exists a subset whose elements sum exactly to the target.",
            keyPoints: [
              "NP-Complete problem - no known polynomial solution",
              "Backtracking explores all possible subset combinations",
              "Pruning optimization: stop if current sum exceeds target",
              "Can be solved using dynamic programming for optimization"
            ],
            applications: [
              "Partition problems in computer science",
              "Resource allocation and budget planning",
              "Cryptography and number theory",
              "Combinatorial optimization problems"
            ]
          }}
          mumbaiUniversity={{
            syllabus: [
              "Subset sum problem formulation",
              "Backtracking approach implementation",
              "Include/exclude decision tree",
              "Pruning strategies and optimization",
              "Complexity analysis"
            ],
            marks: "6-8 marks",
            commonQuestions: [
              "Find subset with given sum using backtracking",
              "Trace algorithm execution with decision tree",
              "Implement subset sum with pruning",
              "Compare with dynamic programming approach"
            ],
            examTips: [
              "Show include/exclude decisions clearly",
              "Demonstrate pruning when sum exceeds target",
              "Draw decision tree for small examples",
              "Mention exponential time complexity O(2^n)"
            ]
          }}
          algorithm={{
            steps: [
              "Start with empty subset, index 0, sum 0",
              "For each element, make two recursive calls:",
              "  1. Include current element (add to subset and sum)",
              "  2. Exclude current element (move to next index)",
              "Base cases: sum equals target (found) or index >= array length",
              "Pruning: if current sum > target, stop exploration",
              "Return true if any path finds the target sum"
            ],
            complexity: {
              time: "O(2^n) - explores all possible subsets",
              space: "O(n) for recursion stack depth"
            }
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Configure Subset Sum</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Array Elements (positive integers, comma-separated)
                </label>
                <input
                  type="text"
                  value={inputArray.join(', ')}
                  onChange={handleArrayChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 bg-white"
                  placeholder="e.g., 3, 34, 4, 12, 5, 2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Sum
                </label>
                <input
                  type="number"
                  value={targetSum}
                  onChange={(e) => setTargetSum(parseInt(e.target.value) || 0)}
                  min="1"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 bg-white"
                  placeholder="Enter target sum"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSolve}
                  className="flex-1 bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors font-semibold"
                >
                  Find Subset
                </button>
                <button
                  onClick={generateRandomArray}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Random
                </button>
              </div>
            </div>

            {/* Input Display */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Current Problem:</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-700">Array:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {inputArray.map((num, index) => (
                      <div
                        key={index}
                        className={`px-3 py-2 rounded-lg font-mono ${
                          result && result.subset.includes(num) && result.hasSubset
                            ? 'bg-yellow-200 text-yellow-800 ring-2 ring-yellow-400'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {num}
                        <span className="text-xs text-gray-500 ml-1">[{index}]</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Target Sum:</span>
                  <span className="ml-2 text-2xl font-bold text-yellow-600">{targetSum}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Array Sum:</span>
                  <span className="ml-2 text-lg text-gray-600">{inputArray.reduce((a, b) => a + b, 0)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Search Results</h2>
            
            {result ? (
              <div className="space-y-4">
                {result.hasSubset ? (
                  <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">✅ Subset Found!</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">Subset:</span>
                        <div className="flex gap-1 mt-1">
                          {result.subset.map((num, index) => (
                            <span key={index} className="bg-green-200 text-green-800 px-3 py-2 rounded-lg font-mono font-bold">
                              {num}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Sum:</span>
                        <span className="ml-2 text-2xl font-bold text-green-600">{result.subset.reduce((a, b) => a + b, 0)}</span>
                        <span className="ml-2 text-green-700">= {targetSum}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                    <h3 className="text-lg font-semibold text-red-800 mb-2">❌ No Subset Found</h3>
                    <p className="text-red-700">No subset of the given array sums to {targetSum}.</p>
                  </div>
                )}

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Algorithm Execution:</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <span className="font-medium">Total Steps:</span>
                      <span className="ml-2 text-blue-600">{result.steps.length}</span>
                    </div>
                    <div>
                      <span className="font-medium">Decision Tree Depth:</span>
                      <span className="ml-2 text-blue-600">{Math.max(...result.steps.map(s => s.index)) + 1}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {result.steps.slice(0, 20).map((step, index) => (
                      <div key={index} className={`text-sm p-2 rounded ${
                        step.isValid && step.currentSum === targetSum ? 'bg-green-100 border-l-4 border-green-400' :
                        step.currentSum > targetSum ? 'bg-red-100 border-l-4 border-red-400' :
                        step.action.includes('Include') ? 'bg-yellow-100 border-l-4 border-yellow-400' :
                        'bg-gray-100 border-l-4 border-gray-400'
                      }`}>
                        <div className="font-medium">Step {step.step + 1}:</div>
                        <div className={`${
                          step.isValid && step.currentSum === targetSum ? 'text-green-700' :
                          step.currentSum > targetSum ? 'text-red-700' :
                          step.action.includes('Include') ? 'text-yellow-700' :
                          'text-gray-700'
                        }`}>
                          {step.action}
                        </div>
                        <div className="text-xs mt-1 grid grid-cols-2 gap-2">
                          <div>
                            <span className="font-medium">Current Sum:</span>
                            <span className={`ml-1 px-1 rounded ${
                              step.currentSum === targetSum ? 'bg-green-100 text-green-700' :
                              step.currentSum > targetSum ? 'bg-red-100 text-red-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {step.currentSum}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">Subset:</span>
                            <span className="ml-1 text-gray-600 font-mono">
                              [{step.currentSubset.join(', ')}]
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {result.steps.length > 20 && (
                      <div className="text-sm text-gray-600 italic">
                        ... and {result.steps.length - 20} more steps
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <div className="text-4xl mb-4">🎯</div>
                <p>Configure the array and target sum, then click &quot;Find Subset&quot; to start the search</p>
              </div>
            )}
          </div>
        </div>

        {/* Decision Tree Visualization */}
        {result && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Decision Tree Analysis</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-3">Algorithm Strategy</h3>
                <div className="space-y-2 text-sm text-purple-700">
                  <div><strong>Approach:</strong> Include/Exclude decision tree</div>
                  <div><strong>Branching Factor:</strong> 2 (include or exclude each element)</div>
                  <div><strong>Max Depth:</strong> {inputArray.length} (number of elements)</div>
                  <div><strong>Total Nodes:</strong> Up to 2^{inputArray.length} = {Math.pow(2, inputArray.length).toLocaleString()}</div>
                  <div><strong>Actual Steps:</strong> {result.steps.length} (with pruning)</div>
                </div>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-orange-800 mb-3">Pruning Effectiveness</h3>
                <div className="space-y-2 text-sm text-orange-700">
                  <div><strong>Pruned Cases:</strong> {result.steps.filter(s => s.currentSum > targetSum).length}</div>
                  <div><strong>Pruning Ratio:</strong> {((1 - result.steps.length / Math.pow(2, inputArray.length)) * 100).toFixed(1)}%</div>
                  <div><strong>Early Termination:</strong> {result.hasSubset ? 'Yes (solution found)' : 'No (exhaustive search)'}</div>
                  <div><strong>Efficiency Gain:</strong> {Math.pow(2, inputArray.length) - result.steps.length} nodes avoided</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {result && (
          <ExamResult
            title="Subset Sum Problem Analysis"
            input={`Array: [${inputArray.join(', ')}], Target: ${targetSum}`}
            result={result.hasSubset}
            steps={result.steps.slice(0, 15).map((step, index) => ({
              stepNumber: index + 1,
              description: step.action,
              currentState: `Sum: ${step.currentSum}, Subset: [${step.currentSubset.join(', ')}]`,
              explanation: step.isValid && step.currentSum === targetSum
                ? "Target sum achieved!"
                : step.currentSum > targetSum
                ? "Sum exceeded target - backtrack"
                : step.action.includes('Include')
                ? "Including current element in subset"
                : "Excluding current element from subset"
            }))}
            finalAnswer={result.hasSubset 
              ? `Subset found: [${result.subset.join(', ')}] with sum ${result.subset.reduce((a, b) => a + b, 0)}`
              : `No subset exists that sums to ${targetSum}`
            }
            examFormat={{
              question: `Find if there exists a subset of [${inputArray.join(', ')}] that sums to ${targetSum}.`,
              solution: [
                `Subset Sum Problem Analysis:`,
                `Input array: [${inputArray.join(', ')}]`,
                `Target sum: ${targetSum}`,
                `Array size: ${inputArray.length}`,
                `Total array sum: ${inputArray.reduce((a, b) => a + b, 0)}`,
                `Result: ${result.hasSubset ? 'Subset exists' : 'No subset exists'}`,
                result.hasSubset ? `Solution subset: [${result.subset.join(', ')}]` : '',
                result.hasSubset ? `Solution sum: ${result.subset.reduce((a, b) => a + b, 0)}` : '',
                `Algorithm: Backtracking with include/exclude decisions`,
                `Time complexity: O(2^n) where n = ${inputArray.length}`,
                `Space complexity: O(n) for recursion stack`,
                `Total steps executed: ${result.steps.length}`,
                `Maximum possible steps: ${Math.pow(2, inputArray.length)}`
              ].filter(line => line !== ''),
              conclusion: result.hasSubset 
                ? `A subset [${result.subset.join(', ')}] exists that sums to ${targetSum}.`
                : `No subset of the given array can sum to ${targetSum}.`,
              marks: 8
            }}
          />
        )}
      </div>
    </div>
  );
}
