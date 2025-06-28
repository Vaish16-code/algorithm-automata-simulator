"use client";

import { useState } from "react";
import { MergeSortChart } from "../../../components/MergeSortChart";
import { mergeSort, MergeSortResult } from "../../../utils/divideConquer";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Merge Sort (Divide & Conquer)
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
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

        {result && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Sorting Result</h2>
            
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              <div className="flex items-center">
                <span className="text-2xl mr-2">✅</span>
                <div>
                  <p className="font-bold text-lg">Array Successfully Sorted!</p>
                  <p className="text-sm">
                    Comparisons made: {result.comparisons} | Steps: {result.steps.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6 p-4 bg-green-50 rounded-lg">
              <div className="text-sm font-medium text-gray-700 mb-2">Sorted Array:</div>
              <div className="flex flex-wrap gap-2">
                {result.sortedArray.map((num: number, index: number) => (
                  <div
                    key={index}
                    className="w-12 h-12 bg-green-100 border-2 border-green-400 rounded-lg flex items-center justify-center font-bold text-green-800"
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>

            <MergeSortChart data={result} />
          </div>
        )}

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2 text-blue-800">How Merge Sort works:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• <strong>Divide:</strong> Split the array into two halves recursively until single elements</li>
            <li>• <strong>Conquer:</strong> Merge the divided arrays back together in sorted order</li>
            <li>• <strong>Time Complexity:</strong> O(n log n) in all cases</li>
            <li>• <strong>Space Complexity:</strong> O(n) for temporary arrays during merging</li>
            <li>• <strong>Stable:</strong> Maintains relative order of equal elements</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
