"use client";

import { useState } from "react";
import { binarySearch, BinarySearchResult } from "../../../utils/divideConquer";
import { EducationalInfo, ExamResult } from "../../../../components";

export default function BinarySearchPage() {
  const [inputArray, setInputArray] = useState([1, 3, 5, 7, 9, 11, 13, 15, 17, 19]);
  const [target, setTarget] = useState(7);
  const [result, setResult] = useState<BinarySearchResult | null>(null);

  const handleSearch = () => {
    // Ensure array is sorted for binary search
    const sortedArray = [...inputArray].sort((a, b) => a - b);
    const output = binarySearch(sortedArray, target);
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
    const size = Math.floor(Math.random() * 8) + 8; // 8-15 elements
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1)
      .sort((a, b) => a - b); // Keep sorted for binary search
    setInputArray(newArray);
    setTarget(newArray[Math.floor(Math.random() * newArray.length)]);
  };

  const sortedArray = [...inputArray].sort((a, b) => a - b);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Binary Search <span className="text-teal-600">(Divide & Conquer)</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Efficiently search in sorted arrays using the divide and conquer paradigm
          </p>
        </div>

        <EducationalInfo
          topic="Binary Search (Divide & Conquer)"
          description="Binary Search is a highly efficient search algorithm that repeatedly divides the search interval in half, comparing the target with the middle element."
          theory={{
            definition: "Binary Search works on sorted arrays by comparing the target value with the middle element and eliminating half of the search space in each iteration.",
            keyPoints: [
              "Requires sorted array as prerequisite",
              "O(log n) time complexity - very efficient",
              "Uses divide and conquer paradigm",
              "Eliminates half of search space in each step"
            ],
            applications: [
              "Searching in databases with indexed data",
              "Finding elements in sorted collections",
              "Root finding in numerical methods",
              "Searching in game trees and decision trees"
            ]
          }}
          mumbaiUniversity={{
            syllabus: [
              "Binary search algorithm implementation",
              "Divide and conquer approach",
              "Recurrence relation: T(n) = T(n/2) + O(1)",
              "Iterative vs recursive implementation",
              "Best, average and worst case analysis"
            ],
            marks: "4-6 marks",
            commonQuestions: [
              "Implement binary search algorithm",
              "Trace binary search execution",
              "Analyze time complexity using recurrence",
              "Compare with linear search"
            ],
            examTips: [
              "Always mention sorted array prerequisite",
              "Show step-by-step search process",
              "Calculate mid using (left + right) / 2",
              "Handle base cases properly"
            ]
          }}
          algorithm={{
            steps: [
              "Initialize left = 0, right = array.length - 1",
              "Calculate mid = (left + right) / 2",
              "Compare target with array[mid]",
              "If equal, return mid; if target < array[mid], search left half",
              "If target > array[mid], search right half",
              "Repeat until found or left > right"
            ],
            complexity: {
              time: "O(log n) - all cases",
              space: "O(1) iterative, O(log n) recursive"
            }
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Configure Binary Search</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Array Elements (will be sorted automatically)
                </label>
                <input
                  type="text"
                  value={inputArray.join(', ')}
                  onChange={handleArrayChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-900 bg-white"
                  placeholder="Enter numbers separated by commas"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Value
                </label>
                <input
                  type="number"
                  value={target}
                  onChange={(e) => setTarget(parseInt(e.target.value) || 0)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-900 bg-white"
                  placeholder="Enter target value to search"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSearch}
                  className="flex-1 bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors font-semibold"
                >
                  Search
                </button>
                <button
                  onClick={generateRandomArray}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Random
                </button>
              </div>
            </div>

            {/* Sorted Array Display */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Sorted Array:</h3>
              <div className="flex flex-wrap gap-2">
                {sortedArray.map((num, index) => (
                  <div
                    key={index}
                    className={`px-3 py-2 rounded-lg font-mono ${
                      num === target 
                        ? 'bg-teal-200 text-teal-800 ring-2 ring-teal-400' 
                        : 'bg-teal-100 text-teal-800'
                    }`}
                  >
                    {num}
                    <span className="text-xs text-teal-600 ml-1">[{index}]</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Target: <span className="font-mono font-bold text-teal-600">{target}</span>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Search Results</h2>
            
            {result ? (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${result.found ? 'bg-green-50' : 'bg-red-50'}`}>
                  <h3 className={`text-lg font-semibold mb-2 ${result.found ? 'text-green-800' : 'text-red-800'}`}>
                    {result.found ? '✅ Found!' : '❌ Not Found'}
                  </h3>
                  {result.found && (
                    <p className="text-green-700">
                      Target <strong>{target}</strong> found at index <strong>{result.index}</strong>
                    </p>
                  )}
                </div>

                <div className="bg-teal-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-teal-800 mb-2">Performance:</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Comparisons:</span>
                      <span className="ml-2 text-teal-600">{result.comparisons}</span>
                    </div>
                    <div>
                      <span className="font-medium">Steps:</span>
                      <span className="ml-2 text-teal-600">{result.steps.length}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Search Steps:</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {result.steps.map((step, index) => (
                      <div key={index} className="text-sm bg-white p-3 rounded border-l-4 border-blue-400">
                        <div className="font-medium text-gray-800">Step {step.step + 1}:</div>
                        <div className="text-gray-600 mb-2">{step.description}</div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-500">Range:</span>
                          {step.left !== undefined && step.right !== undefined && (
                            <>
                              <span className="text-xs bg-blue-100 px-1 rounded">L:{step.left}</span>
                              {step.mid >= 0 && (
                                <span className="text-xs bg-yellow-100 px-1 rounded">M:{step.mid}</span>
                              )}
                              <span className="text-xs bg-blue-100 px-1 rounded">R:{step.right}</span>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <div className="text-4xl mb-4">🔍</div>
                <p>Click &quot;Search&quot; to start the binary search visualization</p>
              </div>
            )}
          </div>
        </div>

        {/* Complexity Analysis */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Why Binary Search is O(log n)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Search Space Reduction</h3>
              <div className="space-y-2 text-sm">
                <div>Initial size: n elements</div>
                <div>After 1 comparison: n/2 elements</div>
                <div>After 2 comparisons: n/4 elements</div>
                <div>After 3 comparisons: n/8 elements</div>
                <div>After k comparisons: n/2^k elements</div>
                <div className="font-bold text-blue-700">Maximum k = log₂(n)</div>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-3">Comparison with Linear Search</h3>
              <div className="space-y-2 text-sm">
                <div><strong>Linear Search:</strong> O(n) - checks each element</div>
                <div><strong>Binary Search:</strong> O(log n) - eliminates half each time</div>
                <div className="pt-2 border-t border-green-200">
                  <div>For 1000 elements:</div>
                  <div>• Linear: up to 1000 comparisons</div>
                  <div>• Binary: up to 10 comparisons</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {result && (
          <ExamResult
            title="Binary Search Analysis"
            input={`Array: [${sortedArray.join(', ')}], Target: ${target}`}
            result={result.found}
            steps={result.steps.map((step, index) => ({
              stepNumber: index + 1,
              description: step.description,
              currentState: step.left !== undefined && step.right !== undefined 
                ? `Range: [${step.left}, ${step.right}], Mid: ${step.mid >= 0 ? step.mid : 'N/A'}`
                : "Search complete",
              explanation: step.found 
                ? "Target found!"
                : step.left > step.right 
                ? "Search space exhausted"
                : "Continuing search..."
            }))}
            finalAnswer={result.found 
              ? `Target ${target} found at index ${result.index}` 
              : `Target ${target} not found in array`
            }
            examFormat={{
              question: `Search for ${target} in the sorted array [${sortedArray.join(', ')}] using Binary Search.`,
              solution: [
                `Binary Search Analysis:`,
                `Input Array: [${sortedArray.join(', ')}]`,
                `Target: ${target}`,
                `Array size: ${sortedArray.length}`,
                `Comparisons made: ${result.comparisons}`,
                `Search result: ${result.found ? 'Found' : 'Not Found'}`,
                result.found ? `Found at index: ${result.index}` : 'Element not present',
                `Time Complexity: O(log n) = O(log ${sortedArray.length})`,
                `Space Complexity: O(1) iterative`,
                `Maximum possible steps: ${Math.ceil(Math.log2(sortedArray.length))}`
              ],
              conclusion: result.found 
                ? `Target ${target} was successfully found at index ${result.index} using ${result.comparisons} comparisons.`
                : `Target ${target} is not present in the array, determined after ${result.comparisons} comparisons.`,
              marks: 6
            }}
          />
        )}
      </div>
    </div>
  );
}
