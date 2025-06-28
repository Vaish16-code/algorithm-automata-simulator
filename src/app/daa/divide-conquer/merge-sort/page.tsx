"use client";

import { useState } from "react";
import { MergeSortChart } from "../../../components/MergeSortChart";
import { mergeSort, MergeSortResult } from "../../../utils/divideConquer";
import { EducationalInfo, ExamResult } from "../../../../components";

export default function MergeSortPage() {
  const [inputArray, setInputArray] = useState([64, 34, 25, 12, 22, 11, 90]);
  const [result, setResult] = useState<MergeSortResult | null>(null);

  const handleSolve = () => {
    const output = mergeSort(inputArray);
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
    const size = Math.floor(Math.random() * 8) + 5; // 5-12 elements
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
    setInputArray(newArray);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Merge Sort <span className="text-blue-600">(Divide & Conquer)</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Visualize the divide and conquer approach of merge sort with step-by-step breakdown
          </p>
        </div>

        <EducationalInfo
          topic="Merge Sort (Divide & Conquer)"
          description="Merge Sort is a divide-and-conquer algorithm that divides the array into halves, sorts them separately, and then merges them back together in sorted order."
          theory={{
            definition: "Merge Sort follows the divide-and-conquer paradigm: divide the problem into smaller subproblems, solve them independently, and combine the solutions to solve the original problem.",
            keyPoints: [
              "Stable sorting algorithm - maintains relative order of equal elements",
              "Guaranteed O(n log n) time complexity in all cases",
              "Requires O(n) extra space for merging",
              "Recursive approach with clear divide and conquer steps"
            ],
            applications: [
              "External sorting for large datasets",
              "Merge operations in database systems",
              "Parallel processing and distributed computing",
              "Foundation for other divide-and-conquer algorithms"
            ]
          }}
          mumbaiUniversity={{
            syllabus: [
              "Divide and conquer paradigm",
              "Merge sort algorithm implementation",
              "Recurrence relation analysis",
              "Time and space complexity",
              "Comparison with other sorting algorithms"
            ],
            marks: "6-8 marks",
            commonQuestions: [
              "Implement merge sort algorithm",
              "Analyze time complexity using recurrence",
              "Compare merge sort with quick sort",
              "Trace execution for given array"
            ],
            examTips: [
              "Draw recursion tree for complexity analysis",
              "Show merge process step by step",
              "Remember T(n) = 2T(n/2) + O(n) recurrence",
              "Highlight stable sorting property"
            ]
          }}
          algorithm={{
            steps: [
              "Divide array into two halves",
              "Recursively sort left half",
              "Recursively sort right half",
              "Merge the two sorted halves",
              "Return the merged sorted array"
            ],
            complexity: {
              time: "O(n log n) - all cases",
              space: "O(n) for temporary arrays"
            }
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Input Array</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Array Elements (comma-separated):
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={inputArray.join(', ')}
                    onChange={handleArrayChange}
                    placeholder="e.g., 64, 34, 25, 12, 22, 11, 90"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={generateRandomArray}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-md"
                  >
                    Generate Random Array
                  </button>
                  <button
                    onClick={handleSolve}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md"
                    disabled={inputArray.length === 0}
                  >
                    Sort Array
                  </button>
                </div>

                {inputArray.length > 0 && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-700 mb-2">Current Array:</div>
                    <div className="flex flex-wrap gap-2">
                      {inputArray.map((num: number, index: number) => (
                        <div
                          key={index}
                          className="w-12 h-12 bg-blue-100 border-2 border-blue-300 rounded-lg flex items-center justify-center font-bold text-blue-800"
                        >
                          {num}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {result && (
              <ExamResult
                title="Merge Sort Analysis"
                input={`Array: [${inputArray.join(', ')}]`}
                result={true}
                steps={result.steps.map((step: { operation?: string; array?: number[] }, index: number) => ({
                  stepNumber: index + 1,
                  description: step.operation || `Step ${index + 1}`,
                  currentState: step.array ? `[${step.array.join(', ')}]` : "Processing",
                  explanation: step.operation === 'divide' 
                    ? "Dividing array into smaller subarrays"
                    : step.operation === 'merge'
                    ? "Merging sorted subarrays back together"
                    : "Sorting process in progress"
                }))}
                finalAnswer={`Sorted Array: [${result.sortedArray.join(', ')}]`}
                examFormat={{
                  question: `Sort the array [${inputArray.join(', ')}] using Merge Sort algorithm.`,
                  solution: [
                    `Merge Sort Analysis:`,
                    `Input: [${inputArray.join(', ')}]`,
                    `Number of elements: ${inputArray.length}`,
                    `Comparisons made: ${result.comparisons}`,
                    `Recursion depth: ${Math.ceil(Math.log2(inputArray.length))}`,
                    `Steps taken: ${result.steps.length}`,
                    `Time Complexity: O(n log n) = O(${inputArray.length} × ${Math.ceil(Math.log2(inputArray.length))})`,
                    `Space Complexity: O(n) = O(${inputArray.length})`,
                    `Final Result: [${result.sortedArray.join(', ')}]`
                  ],
                  conclusion: `The array has been successfully sorted using merge sort with ${result.comparisons} comparisons.`,
                  marks: 8
                }}
              />
            )}

            {result && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Sorting Visualization</h3>
                <MergeSortChart data={result} />
                
                <div className="mt-4 bg-green-50 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-2">Algorithm Performance:</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm text-green-700">
                    <div>
                      <span className="font-medium">Comparisons:</span> {result.comparisons}
                    </div>
                    <div>
                      <span className="font-medium">Steps:</span> {result.steps.length}
                    </div>
                    <div>
                      <span className="font-medium">Time Complexity:</span> O(n log n)
                    </div>
                    <div>
                      <span className="font-medium">Space Complexity:</span> O(n)
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
