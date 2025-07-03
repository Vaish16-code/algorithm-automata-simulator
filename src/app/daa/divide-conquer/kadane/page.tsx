"use client";

import { useState } from "react";
import { maxSubarray, MaxSubarrayResult } from "../../../utils/divideConquer";
import { EducationalInfo, ExamResult } from "../../../../components";

export default function KadanePage() {
  const [inputArray, setInputArray] = useState([-2, -3, 4, -1, -2, 1, 5, -3]);
  const [result, setResult] = useState<MaxSubarrayResult | null>(null);

  const handleSolve = () => {
    const output = maxSubarray(inputArray);
    setResult(output);
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newArray = value
      .split(',')
      .map(n => parseInt(n.trim()))
      .filter(n => !isNaN(n));
    setInputArray(newArray);
  };

  const generateRandomArray = () => {
    const size = Math.floor(Math.random() * 8) + 6; // 6-13 elements
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 21) - 10); // -10 to 10
    setInputArray(newArray);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Maximum Subarray <span className="text-orange-600">(Kadane&apos;s Algorithm)</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find the contiguous subarray with the largest sum using dynamic programming approach
          </p>
        </div>

        <EducationalInfo
          topic="Maximum Subarray Problem (Kadane&apos;s Algorithm)"
          description="Kadane&apos;s Algorithm efficiently finds the maximum sum of any contiguous subarray in O(n) time using dynamic programming principles."
          theory={{
            definition: "Given an array of integers, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
            keyPoints: [
              "Dynamic programming approach with O(n) time complexity",
              "Handles arrays with negative numbers efficiently",
              "Optimal substructure: max ending here = max(current element, max ending here + current)",
              "Can be extended to track the actual subarray indices"
            ],
            applications: [
              "Stock market profit maximization",
              "Signal processing for maximum signal strength",
              "Image processing for finding brightest regions",
              "Financial analysis for best investment periods"
            ]
          }}
          mumbaiUniversity={{
            syllabus: [
              "Maximum subarray problem",
              "Kadane&apos;s algorithm implementation",
              "Dynamic programming approach",
              "Time and space complexity analysis",
              "Divide and conquer alternative solution"
            ],
            marks: "4-6 marks",
            commonQuestions: [
              "Implement Kadane&apos;s algorithm",
              "Find maximum subarray sum and indices",
              "Trace algorithm execution step by step",
              "Compare with brute force approach"
            ],
            examTips: [
              "Remember to handle all negative numbers case",
              "Show step-by-step current_sum and max_sum updates",
              "Explain when to reset current_sum to 0",
              "Mention O(n) time and O(1) space complexity"
            ]
          }}
          algorithm={{
            steps: [
              "Initialize max_sum = first element, current_sum = first element",
              "For each element from index 1 to n-1:",
              "If current_sum < 0, reset current_sum = current element",
              "Else, add current element to current_sum",
              "Update max_sum if current_sum > max_sum",
              "Return max_sum and track indices if needed"
            ],
            complexity: {
              time: "O(n) - single pass through array",
              space: "O(1) - constant extra space"
            }
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Configure Maximum Subarray</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Array Elements (include negative numbers for better demo)
                </label>
                <input
                  type="text"
                  value={inputArray.join(', ')}
                  onChange={handleArrayChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-white"
                  placeholder="Enter numbers separated by commas (e.g., -2, -3, 4, -1, -2, 1, 5, -3)"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSolve}
                  className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold"
                >
                  Find Maximum Subarray
                </button>
                <button
                  onClick={generateRandomArray}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Random
                </button>
              </div>
            </div>

            {/* Current Array Display */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Input Array:</h3>
              <div className="flex flex-wrap gap-2">
                {inputArray.map((num, index) => (
                  <div
                    key={index}
                    className={`px-3 py-2 rounded-lg font-mono ${
                      result && index >= result.startIndex && index <= result.endIndex
                        ? 'bg-orange-200 text-orange-800 ring-2 ring-orange-400'
                        : num >= 0 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {num}
                    <span className="text-xs text-gray-600 ml-1">[{index}]</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Algorithm Results</h2>
            
            {result ? (
              <div className="space-y-4">
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-orange-800 mb-2">Maximum Subarray Found:</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Subarray:</span>
                      <div className="flex gap-1 mt-1">
                        {result.subarray.map((num, index) => (
                          <span key={index} className="bg-orange-200 text-orange-800 px-2 py-1 rounded font-mono">
                            {num}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Maximum Sum:</span>
                      <span className="ml-2 text-2xl font-bold text-orange-600">{result.maxSum}</span>
                    </div>
                    <div>
                      <span className="font-medium">Indices:</span>
                      <span className="ml-2 text-orange-600">
                        From index {result.startIndex} to {result.endIndex}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Algorithm Steps:</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {result.steps.map((step, index) => (
                      <div key={index} className="text-sm bg-white p-3 rounded border-l-4 border-blue-400">
                        <div className="font-medium text-gray-800">Step {step.step + 1}:</div>
                        <div className="text-gray-600 mb-1">{step.description}</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="font-medium">Current Sum:</span>
                            <span className={`ml-1 px-1 rounded ${
                              step.currentSum >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {step.currentSum}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">Max Sum:</span>
                            <span className="ml-1 px-1 rounded bg-orange-100 text-orange-700">
                              {step.maxSum}
                            </span>
                          </div>
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          Max range: [{step.maxStart}, {step.maxEnd}]
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <div className="text-4xl mb-4">📊</div>
                <p>Click &quot;Find Maximum Subarray&quot; to see Kadane&apos;s algorithm in action</p>
              </div>
            )}
          </div>
        </div>

        {/* Algorithm Explanation */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">How Kadane&apos;s Algorithm Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Key Insight</h3>
              <p className="text-blue-700 text-sm leading-relaxed">
                At each position, we decide whether to extend the existing subarray or start a new one. 
                If the current sum becomes negative, it&apos;s better to start fresh from the current element.
              </p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-3">Algorithm Logic</h3>
              <ul className="text-green-700 text-sm space-y-1">
                <li>• If current_sum &lt; 0: reset to current element</li>
                <li>• Otherwise: add current element to sum</li>
                <li>• Always track the maximum sum seen so far</li>
                <li>• Update indices when new maximum is found</li>
              </ul>
            </div>
          </div>
        </div>

        {result && (
          <ExamResult
            title="Maximum Subarray Analysis"
            input={`Array: [${inputArray.join(', ')}]`}
            result={result.maxSum > 0 || inputArray.every(n => n < 0)}
            steps={result.steps.map((step, index) => ({
              stepNumber: index + 1,
              description: step.description,
              currentState: `Current Sum: ${step.currentSum}, Max Sum: ${step.maxSum}`,
              explanation: step.currentSum < 0 && index < result.steps.length - 1
                ? "Negative sum detected, will reset on next iteration"
                : step.maxSum === step.currentSum
                ? "New maximum found!"
                : "Continuing with current subarray"
            }))}
            finalAnswer={`Maximum subarray sum: ${result.maxSum}, Subarray: [${result.subarray.join(', ')}]`}
            examFormat={{
              question: `Find the maximum sum of contiguous subarray in [${inputArray.join(', ')}] using Kadane&apos;s algorithm.`,
              solution: [
                `Kadane&apos;s Algorithm Analysis:`,
                `Input: [${inputArray.join(', ')}]`,
                `Array size: ${inputArray.length}`,
                `Maximum subarray sum: ${result.maxSum}`,
                `Maximum subarray: [${result.subarray.join(', ')}]`,
                `Start index: ${result.startIndex}`,
                `End index: ${result.endIndex}`,
                `Time Complexity: O(n)`,
                `Space Complexity: O(1)`,
                `Algorithm steps: ${result.steps.length}`
              ],
              conclusion: `The maximum sum contiguous subarray is [${result.subarray.join(', ')}] with sum ${result.maxSum}.`,
              marks: 6
            }}
          />
        )}
      </div>
    </div>
  );
}
