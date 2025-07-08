"use client";

import { useState } from "react";
import { MergeSortChart } from "../../../components/MergeSortChart";
import { mergeSort, MergeSortResult } from "../../../utils/divideConquer";
import { EducationalInfo, ExamResult } from "../../../../components";

export default function MergeSortPage() {
  const [inputArray, setInputArray] = useState([64, 34, 25, 12, 22, 11, 90]);
  const [inputText, setInputText] = useState("64, 34, 25, 12, 22, 11, 90");
  const [result, setResult] = useState<MergeSortResult | null>(null);
  const [inputError, setInputError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSolve = () => {
    if (inputArray.length === 0) {
      setInputError("Please enter a valid array with at least one element.");
      return;
    }
    if (inputArray.length > 20) {
      setInputError("Please enter an array with maximum 20 elements for better visualization.");
      return;
    }
    
    console.log("Sorting array:", inputArray);
    setInputError("");
    setIsProcessing(true);
    setResult(null); // Clear previous result
    
    try {
      const output = mergeSort([...inputArray]); // Create a copy to avoid mutation
      console.log("Sort result:", output);
      setResult(output);
    } catch (error) {
      console.error("Error during sorting:", error);
      setInputError("An error occurred during sorting. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputText(value);
    setInputError("");
    setResult(null); // Clear previous result when input changes
    
    try {
      const newArray = value
        .split(',')
        .map(n => {
          const trimmed = n.trim();
          if (trimmed === '') return null;
          const num = parseInt(trimmed);
          if (isNaN(num)) {
            throw new Error(`Invalid number: ${trimmed}`);
          }
          return num;
        })
        .filter(n => n !== null) as number[];
      
      if (newArray.length > 0) {
        setInputArray(newArray);
      } else if (value.trim() === '') {
        setInputArray([]);
      }
    } catch (error) {
      setInputError("Please enter valid numbers separated by commas (e.g., 1, 2, 3)");
    }
  };

  const generateRandomArray = () => {
    const size = Math.floor(Math.random() * 8) + 5; // 5-12 elements
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
    setInputArray(newArray);
    setInputText(newArray.join(', '));
    setInputError("");
    setResult(null); // Clear previous result
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-6 lg:py-8">
        <div className="text-center mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-900 mb-3 lg:mb-4">
            Merge Sort <span className="text-blue-600">(Divide & Conquer)</span>
          </h1>
          <p className="text-base lg:text-xl text-gray-600 max-w-3xl mx-auto">
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
          university={{
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
          {/* Input Section */}
          <div className="space-y-4 lg:space-y-6">
            <div className="bg-white rounded-lg shadow-md p-4 lg:p-6">
              <h2 className="text-lg lg:text-xl font-semibold mb-3 lg:mb-4 text-gray-700">Input Array</h2>
              
              <div className="space-y-3 lg:space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Array Elements (comma-separated):
                  </label>
                  <input
                    type="text"
                    className={`w-full border-2 lg:border-4 rounded-md px-3 lg:px-4 py-2 lg:py-3 text-base lg:text-lg font-bold text-black bg-white focus:ring-2 lg:focus:ring-4 ${
                      inputError ? 'border-red-500 focus:border-red-600 focus:ring-red-200' : 'border-gray-800 focus:border-blue-600 focus:ring-blue-200'
                    }`}
                    value={inputText}
                    onChange={handleArrayChange}
                    placeholder="e.g., 64, 34, 25, 12, 22, 11, 90"
                  />
                  {inputError && (
                    <div className="text-red-600 text-sm mt-1 font-medium">
                      {inputError}
                    </div>
                  )}
                  <div className="text-xs text-gray-500 mt-1">
                    💡 Enter numbers separated by commas. Example: 5, 2, 8, 1, 9
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
                  <button
                    onClick={generateRandomArray}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium px-3 lg:px-4 py-2 rounded-md text-sm lg:text-base"
                  >
                    Generate Random Array
                  </button>
                  <button
                    onClick={handleSolve}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium px-4 lg:px-6 py-2 rounded-md text-sm lg:text-base"
                    disabled={inputArray.length === 0 || isProcessing}
                  >
                    {isProcessing ? "Sorting..." : "Sort Array"}
                  </button>
                </div>

                {inputArray.length > 0 && !inputError && (
                  <div className="p-3 lg:p-4 bg-gray-50 rounded-lg border-l-4 border-green-500">
                    <div className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <span className="text-green-600 mr-2">✓</span>
                      Current Array ({inputArray.length} elements):
                    </div>
                    <div className="flex flex-wrap gap-1 lg:gap-2">
                      {inputArray.map((num: number, index: number) => (
                        <div
                          key={index}
                          className="w-8 h-8 lg:w-12 lg:h-12 bg-blue-100 border-2 border-blue-300 rounded-lg flex items-center justify-center font-bold text-blue-800 text-xs lg:text-base"
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
          <div className="space-y-4 lg:space-y-6">
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
              <div className="bg-white rounded-lg shadow-md p-4 lg:p-6">
                <h3 className="text-base lg:text-lg font-semibold mb-3 lg:mb-4 text-gray-800">Sorting Visualization</h3>
                <MergeSortChart data={result} />
                
                <div className="mt-3 lg:mt-4 bg-green-50 rounded-lg p-3 lg:p-4">
                  <h4 className="font-medium text-green-800 mb-2">Algorithm Performance:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 lg:gap-4 text-sm text-green-700">
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
