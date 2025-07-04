"use client";

import React, { useState, useRef, useEffect } from "react";
import { EducationalInfo, ExamResult } from "@/components";

interface MinMaxStep {
  array: number[];
  left: number;
  right: number;
  min: number;
  max: number;
  action: string;
  description: string;
  comparisons: number;
  level: number;
}

interface MinMaxResult {
  min: number;
  max: number;
}

export default function MinMaxPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [array, setArray] = useState<number[]>([64, 34, 25, 12, 22, 11, 90, 88, 76, 50]);
  const [arraySize, setArraySize] = useState(10);
  const [steps, setSteps] = useState<MinMaxStep[]>([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [totalComparisons, setTotalComparisons] = useState(0);
  const [algorithm, setAlgorithm] = useState<'naive' | 'divide-conquer'>('divide-conquer');

  useEffect(() => {
    drawArray();
  }, [array, currentStep]);

  const generateRandomArray = () => {
    const newArray = Array.from({ length: arraySize }, () => 
      Math.floor(Math.random() * 100) + 1
    );
    setArray(newArray);
    setSteps([]);
    setCurrentStep(-1);
    setTotalComparisons(0);
  };

  const naiveMinMax = () => {
    const minMaxSteps: MinMaxStep[] = [];
    let comparisons = 0;
    let min = array[0];
    let max = array[0];

    minMaxSteps.push({
      array: [...array],
      left: 0,
      right: 0,
      min,
      max,
      action: `Initialize min and max with first element`,
      description: `min = ${min}, max = ${max}`,
      comparisons,
      level: 0
    });

    for (let i = 1; i < array.length; i++) {
      if (array[i] < min) {
        min = array[i];
        comparisons++;
        minMaxSteps.push({
          array: [...array],
          left: i,
          right: i,
          min,
          max,
          action: `New minimum found: ${array[i]}`,
          description: `${array[i]} < ${min}, update min`,
          comparisons,
          level: 0
        });
      } else {
        comparisons++;
      }

      if (array[i] > max) {
        max = array[i];
        comparisons++;
        minMaxSteps.push({
          array: [...array],
          left: i,
          right: i,
          min,
          max,
          action: `New maximum found: ${array[i]}`,
          description: `${array[i]} > ${max}, update max`,
          comparisons,
          level: 0
        });
      } else {
        comparisons++;
      }

      minMaxSteps.push({
        array: [...array],
        left: i,
        right: i,
        min,
        max,
        action: `Check element ${array[i]}`,
        description: `Compare with current min(${min}) and max(${max})`,
        comparisons,
        level: 0
      });
    }

    minMaxSteps.push({
      array: [...array],
      left: 0,
      right: array.length - 1,
      min,
      max,
      action: `Complete! Min: ${min}, Max: ${max}`,
      description: `Found minimum and maximum with ${comparisons} comparisons`,
      comparisons,
      level: 0
    });

    setSteps(minMaxSteps);
    setCurrentStep(0);
    setTotalComparisons(comparisons);
  };

  const divideConquerMinMax = () => {
    const minMaxSteps: MinMaxStep[] = [];
    let comparisons = 0;

    const findMinMax = (arr: number[], left: number, right: number, level: number): MinMaxResult => {
      if (left === right) {
        // Base case: single element
        minMaxSteps.push({
          array: [...arr],
          left,
          right,
          min: arr[left],
          max: arr[left],
          action: `Base case: single element ${arr[left]}`,
          description: `min = max = ${arr[left]}`,
          comparisons,
          level
        });
        return { min: arr[left], max: arr[left] };
      }

      if (right === left + 1) {
        // Base case: two elements
        comparisons++;
        const min = Math.min(arr[left], arr[right]);
        const max = Math.max(arr[left], arr[right]);
        
        minMaxSteps.push({
          array: [...arr],
          left,
          right,
          min,
          max,
          action: `Base case: two elements ${arr[left]}, ${arr[right]}`,
          description: `Compare and set min = ${min}, max = ${max}`,
          comparisons,
          level
        });
        return { min, max };
      }

      // Divide
      const mid = Math.floor((left + right) / 2);
      
      minMaxSteps.push({
        array: [...arr],
        left,
        right,
        min: -1,
        max: -1,
        action: `Divide at mid = ${mid}`,
        description: `Split [${left}...${right}] into [${left}...${mid}] and [${mid + 1}...${right}]`,
        comparisons,
        level
      });

      // Conquer
      const leftResult = findMinMax(arr, left, mid, level + 1);
      const rightResult = findMinMax(arr, mid + 1, right, level + 1);

      // Combine
      comparisons += 2; // Two comparisons to find overall min and max
      const finalMin = Math.min(leftResult.min, rightResult.min);
      const finalMax = Math.max(leftResult.max, rightResult.max);

      minMaxSteps.push({
        array: [...arr],
        left,
        right,
        min: finalMin,
        max: finalMax,
        action: `Combine results`,
        description: `Left: [${leftResult.min}, ${leftResult.max}], Right: [${rightResult.min}, ${rightResult.max}] → [${finalMin}, ${finalMax}]`,
        comparisons,
        level
      });

      return { min: finalMin, max: finalMax };
    };

    const result = findMinMax(array, 0, array.length - 1, 0);
    
    minMaxSteps.push({
      array: [...array],
      left: 0,
      right: array.length - 1,
      min: result.min,
      max: result.max,
      action: `Final Result: Min = ${result.min}, Max = ${result.max}`,
      description: `Divide and conquer completed with ${comparisons} comparisons`,
      comparisons,
      level: 0
    });

    setSteps(minMaxSteps);
    setCurrentStep(0);
    setTotalComparisons(comparisons);
  };

  const findMinMax = () => {
    if (algorithm === 'naive') {
      naiveMinMax();
    } else {
      divideConquerMinMax();
    }
  };

  const drawArray = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = canvas.width / array.length;
    const maxValue = Math.max(...array);

    array.forEach((value, index) => {
      const barHeight = (value / maxValue) * (canvas.height - 40);
      const x = index * barWidth;
      const y = canvas.height - barHeight;

      // Determine bar color based on current step
      let color = '#3b82f6'; // Default blue
      
      if (currentStep >= 0 && steps[currentStep]) {
        const step = steps[currentStep];
        
        if (value === step.min && value === step.max) {
          color = '#8b5cf6'; // Purple for min=max
        } else if (value === step.min) {
          color = '#ef4444'; // Red for minimum
        } else if (value === step.max) {
          color = '#10b981'; // Green for maximum
        } else if (index >= step.left && index <= step.right) {
          color = '#fbbf24'; // Yellow for current range
        }
      }

      // Draw bar
      ctx.fillStyle = color;
      ctx.fillRect(x, y, barWidth - 2, barHeight);

      // Draw value
      ctx.fillStyle = '#1f2937';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(value.toString(), x + barWidth / 2, canvas.height - 5);
    });
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetAnimation = () => {
    setCurrentStep(0);
  };

  const autoAnimate = () => {
    if (steps.length === 0) {
      findMinMax();
      return;
    }

    setIsAnimating(true);
    setCurrentStep(0);
    
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(interval);
          setIsAnimating(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Finding Min-Max <span className="text-purple-600">(Divide & Conquer)</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Compare naive approach vs divide and conquer for finding minimum and maximum elements
          </p>
        </div>

        <EducationalInfo
          topic="Finding Minimum and Maximum - Algorithm Analysis"
          description="Compare different approaches to find the minimum and maximum elements in an array, analyzing their efficiency and trade-offs."
          theory={{
            definition: "Finding minimum and maximum elements in an array can be done using different strategies, each with different time complexity characteristics.",
            keyPoints: [
              "Naive approach: Linear scan with 2(n-1) comparisons",
              "Divide and conquer: Reduces comparisons to 3n/2 - 2",
              "Tournament method: Uses binary tree approach",
              "Simultaneous min-max finding is more efficient",
              "Trade-off between simplicity and optimality"
            ],
            applications: [
              "Statistical analysis and data processing",
              "Range queries in databases",
              "Computer graphics and image processing",
              "Optimization algorithms",
              "Data validation and bounds checking"
            ]
          }}
          mumbaiUniversity={{
            syllabus: [
              "Linear search for min-max",
              "Divide and conquer approach",
              "Comparison count analysis",
              "Tournament method",
              "Optimal comparison strategies"
            ],
            marks: "8-10 marks",
            commonQuestions: [
              "Compare naive vs divide-conquer approaches",
              "Analyze number of comparisons",
              "Implement both algorithms",
              "Trace algorithm execution"
            ],
            examTips: [
              "Master comparison counting",
              "Understand recurrence relations",
              "Practice both approaches",
              "Know optimal comparison bounds"
            ]
          }}
          algorithm={{
            steps: [
              "Naive: Initialize min and max with first element",
              "Naive: Compare each remaining element with both min and max",
              "D&C: Divide array into two halves",
              "D&C: Recursively find min-max in each half",
              "D&C: Combine results by comparing mins and maxs"
            ],
            complexity: {
              time: "Naive: O(n) with 2(n-1) comparisons, D&C: O(n) with 3n/2-2 comparisons",
              space: "Naive: O(1), D&C: O(log n) for recursion"
            }
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Controls */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Algorithm Controls</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Algorithm Type:
                </label>
                <select
                  value={algorithm}
                  onChange={(e) => setAlgorithm(e.target.value as 'naive' | 'divide-conquer')}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="naive">Naive Approach (Linear Scan)</option>
                  <option value="divide-conquer">Divide and Conquer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Array Size: {arraySize}
                </label>
                <input
                  type="range"
                  min="5"
                  max="20"
                  value={arraySize}
                  onChange={(e) => setArraySize(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={generateRandomArray}
                  className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Generate Array
                </button>
                <button
                  onClick={findMinMax}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Find Min-Max
                </button>
              </div>

              <button
                onClick={autoAnimate}
                disabled={isAnimating}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                {isAnimating ? 'Animating...' : 'Auto Animate'}
              </button>
            </div>

            {/* Array Input */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Edit Array (comma-separated):
              </label>
              <input
                type="text"
                value={array.join(', ')}
                onChange={(e) => {
                  const values = e.target.value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
                  if (values.length > 0) {
                    setArray(values);
                    setArraySize(values.length);
                  }
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="64, 34, 25, 12, 22, 11, 90"
              />
            </div>
          </div>

          {/* Visualization */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Array Visualization</h2>
            
            <canvas
              ref={canvasRef}
              width={500}
              height={300}
              className="border border-gray-300 rounded-lg w-full"
            />

            <div className="mt-4 flex justify-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-sm">Normal</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                <span className="text-sm">Current Range</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-sm">Minimum</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm">Maximum</span>
              </div>
            </div>
          </div>
        </div>

        {/* Animation Controls */}
        {steps.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-200 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Step-by-Step Execution</h2>
            
            <div className="flex gap-2 mb-4">
              <button
                onClick={prevStep}
                disabled={currentStep <= 0}
                className="px-4 py-2 bg-purple-500 text-white rounded disabled:bg-gray-300"
              >
                ← Previous
              </button>
              
              <button
                onClick={resetAnimation}
                className="px-4 py-2 bg-purple-600 text-white rounded"
              >
                Reset
              </button>
              
              <button
                onClick={nextStep}
                disabled={currentStep >= steps.length - 1}
                className="px-4 py-2 bg-purple-500 text-white rounded disabled:bg-gray-300"
              >
                Next →
              </button>
              
              <span className="px-4 py-2 bg-gray-100 rounded text-sm flex items-center">
                Step {Math.max(0, currentStep + 1)} / {steps.length}
              </span>
            </div>

            {currentStep >= 0 && steps[currentStep] && (
              <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-300">
                <h3 className="font-bold text-purple-800 mb-2 text-lg">
                  {steps[currentStep].action}
                </h3>
                <p className="text-purple-700 mb-3">{steps[currentStep].description}</p>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Level:</span> {steps[currentStep].level}
                  </div>
                  <div>
                    <span className="font-medium">Range:</span> [{steps[currentStep].left}...{steps[currentStep].right}]
                  </div>
                  <div>
                    <span className="font-medium">Comparisons:</span> {steps[currentStep].comparisons}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Analysis */}
        {steps.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-200 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Algorithm Analysis</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{totalComparisons}</div>
                <div className="text-gray-600">Total Comparisons</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{steps.length}</div>
                <div className="text-gray-600">Total Steps</div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-2">Comparison Analysis:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-purple-700">Naive Approach:</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Comparisons: 2(n-1) = {2 * (array.length - 1)}</li>
                    <li>• Time: O(n)</li>
                    <li>• Space: O(1)</li>
                    <li>• Simple implementation</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-700">Divide & Conquer:</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Comparisons: 3n/2-2 ≈ {Math.floor(3 * array.length / 2 - 2)}</li>
                    <li>• Time: O(n)</li>
                    <li>• Space: O(log n)</li>
                    <li>• Fewer comparisons</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {steps.length > 0 && (
          <ExamResult
            title="Min-Max Finding Analysis"
            input={`Array: [${array.join(', ')}], Algorithm: ${algorithm}`}
            result={true}
            steps={steps.slice(0, 8).map((step, index) => ({
              stepNumber: index + 1,
              description: step.action,
              currentState: `Range: [${step.left}...${step.right}], Min: ${step.min}, Max: ${step.max}`,
              explanation: step.description
            }))}
            finalAnswer={`Minimum: ${steps[steps.length - 1]?.min}, Maximum: ${steps[steps.length - 1]?.max} with ${totalComparisons} comparisons`}
            examFormat={{
              question: `Find minimum and maximum elements in array [${array.join(', ')}] using ${algorithm} approach.`,
              solution: [
                `Min-Max Finding Implementation:`,
                `Input: [${array.join(', ')}]`,
                `Algorithm: ${algorithm === 'naive' ? 'Linear Scan' : 'Divide and Conquer'}`,
                `Total Comparisons: ${totalComparisons}`,
                `Expected Comparisons: ${algorithm === 'naive' ? `2(n-1) = ${2 * (array.length - 1)}` : `3n/2-2 ≈ ${Math.floor(3 * array.length / 2 - 2)}`}`,
                `Time Complexity: O(n)`,
                `Space Complexity: ${algorithm === 'naive' ? 'O(1)' : 'O(log n)'}`,
                `Result: Min = ${steps[steps.length - 1]?.min}, Max = ${steps[steps.length - 1]?.max}`
              ],
              conclusion: `${algorithm === 'naive' ? 'Naive approach' : 'Divide and conquer'} found min-max using ${totalComparisons} comparisons.`,
              marks: 10
            }}
          />
        )}
      </div>
    </div>
  );
}
