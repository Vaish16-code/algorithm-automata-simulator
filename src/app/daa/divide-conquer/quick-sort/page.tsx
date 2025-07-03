"use client";

import { useState } from "react";
import { quickSort, QuickSortResult } from "../../../utils/divideConquer";
import { EducationalInfo, ExamResult } from "../../../../components";

export default function QuickSortPage() {
  const [inputArray, setInputArray] = useState([64, 34, 25, 12, 22, 11, 90]);
  const [result, setResult] = useState<QuickSortResult | null>(null);
  const [pivotStrategy, setPivotStrategy] = useState<'first' | 'last' | 'middle' | 'random'>('last');

  const handleSolve = () => {
    const output = quickSort([...inputArray], pivotStrategy);
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
    const size = Math.floor(Math.random() * 8) + 5;
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
    setInputArray(newArray);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Quick Sort <span className="text-purple-600">(Divide & Conquer)</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Visualize the partition-based divide and conquer approach of quick sort
          </p>
        </div>

        <EducationalInfo
          topic="Quick Sort (Divide & Conquer)"
          description="Quick Sort is a highly efficient divide-and-conquer algorithm that works by selecting a 'pivot' element and partitioning the array around it."
          theory={{
            definition: "Quick Sort picks a pivot element and partitions the array so all elements smaller than pivot come before it and larger elements come after it. Then it recursively sorts the subarrays.",
            keyPoints: [
              "In-place sorting algorithm with O(log n) space complexity",
              "Average case O(n log n), worst case O(n²) time complexity",
              "Not stable - doesn't preserve relative order of equal elements",
              "Pivot selection strategy affects performance significantly"
            ],
            applications: [
              "General purpose sorting in programming languages",
              "Quick selection algorithm for finding kth element",
              "Cache-friendly due to in-place nature",
              "Basis for hybrid sorting algorithms"
            ]
          }}
          mumbaiUniversity={{
            syllabus: [
              "Quick sort algorithm implementation",
              "Partitioning technique",
              "Best, average and worst case analysis",
              "Randomized quick sort",
              "Comparison with merge sort"
            ],
            marks: "6-8 marks",
            commonQuestions: [
              "Implement quick sort with different pivot strategies",
              "Analyze time complexity in all cases",
              "Trace quick sort execution",
              "Compare quick sort vs merge sort performance"
            ],
            examTips: [
              "Show partitioning step clearly",
              "Mention pivot selection strategies",
              "Explain why worst case is O(n²)",
              "Highlight in-place sorting advantage"
            ]
          }}
          algorithm={{
            steps: [
              "Choose a pivot element from array",
              "Partition array: elements < pivot on left, > pivot on right",
              "Recursively apply quick sort to left subarray",
              "Recursively apply quick sort to right subarray",
              "Base case: array size ≤ 1"
            ],
            complexity: {
              time: "Average: O(n log n), Worst: O(n²)",
              space: "O(log n) recursion stack"
            }
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Configure Quick Sort</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Array Elements (comma-separated)
                </label>
                <input
                  type="text"
                  value={inputArray.join(', ')}
                  onChange={handleArrayChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 bg-white"
                  placeholder="Enter numbers separated by commas"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pivot Selection Strategy
                </label>
                <select
                  value={pivotStrategy}
                  onChange={(e) => setPivotStrategy(e.target.value as 'first' | 'last' | 'middle' | 'random')}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 bg-white"
                >
                  <option value="first">First Element</option>
                  <option value="last">Last Element</option>
                  <option value="middle">Middle Element</option>
                  <option value="random">Random Element</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSolve}
                  className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                >
                  Sort Array
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
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Current Array:</h3>
              <div className="flex flex-wrap gap-2">
                {inputArray.map((num, index) => (
                  <div
                    key={index}
                    className="bg-purple-100 text-purple-800 px-3 py-2 rounded-lg font-mono"
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Sort Results</h2>
            
            {result ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Sorted Array:</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.sortedArray.map((num, index) => (
                      <div
                        key={index}
                        className="bg-green-100 text-green-800 px-3 py-2 rounded-lg font-mono"
                      >
                        {num}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">Performance Metrics:</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Comparisons:</span>
                      <span className="ml-2 text-purple-600">{result.comparisons}</span>
                    </div>
                    <div>
                      <span className="font-medium">Swaps:</span>
                      <span className="ml-2 text-purple-600">{result.swaps}</span>
                    </div>
                    <div>
                      <span className="font-medium">Recursion Depth:</span>
                      <span className="ml-2 text-purple-600">{result.recursionDepth}</span>
                    </div>
                    <div>
                      <span className="font-medium">Pivot Strategy:</span>
                      <span className="ml-2 text-purple-600 capitalize">{pivotStrategy}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Partitioning Steps:</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {result.steps.map((step, index) => (
                      <div key={index} className="text-sm bg-white p-2 rounded border-l-4 border-blue-400">
                        <div className="font-medium text-gray-800">Step {index + 1}:</div>
                        <div className="text-gray-600">{step.description}</div>
                        <div className="flex gap-1 mt-1">
                          {step.array.map((num, i) => (
                            <span
                              key={i}
                              className={`px-2 py-1 rounded text-xs font-mono ${
                                i === step.pivotIndex
                                  ? 'bg-red-200 text-red-800'
                                  : step.compareIndices?.includes(i)
                                  ? 'bg-yellow-200 text-yellow-800'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {num}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <div className="text-4xl mb-4">⚡</div>
                <p>Click &quot;Sort Array&quot; to see the quick sort visualization</p>
              </div>
            )}
          </div>
        </div>

        {/* Complexity Analysis */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Complexity Analysis</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Best Case</h3>
              <p className="text-green-700 mb-2">O(n log n)</p>
              <p className="text-sm text-green-600">
                When pivot always divides array into two equal halves
              </p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Average Case</h3>
              <p className="text-yellow-700 mb-2">O(n log n)</p>
              <p className="text-sm text-yellow-600">
                With random pivot selection or good pivot choices
              </p>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Worst Case</h3>
              <p className="text-red-700 mb-2">O(n²)</p>
              <p className="text-sm text-red-600">
                When pivot is always the smallest or largest element
              </p>
            </div>
          </div>
        </div>

        {result && (
          <ExamResult
            title="Quick Sort Analysis"
            input={`Array: [${inputArray.join(', ')}], Pivot Strategy: ${pivotStrategy}`}
            result={true}
            steps={result.steps.slice(0, 15).map((step, index) => ({
              stepNumber: index + 1,
              description: step.description,
              currentState: `Array: [${step.array.join(', ')}], Pivot Index: ${step.pivotIndex}`,
              explanation: `Range: [${step.range[0]}, ${step.range[1]}]`
            }))}
            finalAnswer={`Sorted Array: [${result.sortedArray.join(', ')}]`}
            examFormat={{
              question: `Sort the array [${inputArray.join(', ')}] using Quick Sort with ${pivotStrategy} pivot strategy.`,
              solution: [
                "Quick Sort Algorithm Analysis:",
                `Input Array: [${inputArray.join(', ')}]`,
                `Pivot Strategy: ${pivotStrategy}`,
                `Time Complexity: Best/Avg: O(n log n), Worst: O(n²)`,
                `Space Complexity: O(log n)`,
                `Final Sorted Array: [${result.sortedArray.join(', ')}]`
              ],
              conclusion: "Quick Sort is an efficient divide-and-conquer algorithm with good average performance.",
              marks: 10
            }}
          />
        )}
      </div>
    </div>
  );
}
