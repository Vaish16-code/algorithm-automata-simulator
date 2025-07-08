import React, { useState } from 'react';
import { MergeSortResult } from '../utils/divideConquer';
import MergeSortTreeView from './MergeSortTreeView';

interface MergeSortChartProps {
  data: MergeSortResult;
}

export function MergeSortChart({ data }: MergeSortChartProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [viewMode, setViewMode] = useState<'steps' | 'tree'>('tree');

  if (!data || !data.steps.length) return null;

  const currentStepData = data.steps[currentStep];

  return (
    <div className="space-y-6">
      {/* View Mode Toggle */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setViewMode('tree')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'tree'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🌳 Tree View
          </button>
          <button
            onClick={() => setViewMode('steps')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'steps'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📋 Step-by-Step
          </button>
        </div>
      </div>

      {/* Tree Visualization */}
      {viewMode === 'tree' && (
        <MergeSortTreeView
          tree={data.tree}
          currentStep={currentStep}
          totalSteps={data.steps.length}
        />
      )}

      {/* Step-by-Step Visualization */}
      {viewMode === 'steps' && (
        <>
      {/* Step Navigator */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
          🔄 Step-by-Step Visualization
        </h3>
        
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md"
          >
            Previous
          </button>
          
          <div className="flex-1 text-center">
            <div className="text-lg font-semibold text-gray-800">
              Step {currentStep + 1} of {data.steps.length}
            </div>
            <div className="text-sm text-gray-600">
              {currentStepData.action}
            </div>
          </div>
          
          <button
            onClick={() => setCurrentStep(Math.min(data.steps.length - 1, currentStep + 1))}
            disabled={currentStep === data.steps.length - 1}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md"
          >
            Next
          </button>
        </div>

        <div className="mb-4">
          <input
            type="range"
            min="0"
            max={data.steps.length - 1}
            value={currentStep}
            onChange={(e) => setCurrentStep(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Current Step Visualization */}
        <div className="bg-white p-4 rounded-lg border border-blue-300">
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-700 mb-2">
              Range: [{currentStepData.range[0]}, {currentStepData.range[1]}]
            </div>
            
            {/* Main Array */}
            {currentStepData.array.length > 0 && (
              <div className="mb-4">
                <div className="text-xs font-medium text-gray-600 mb-1">Current Array:</div>
                <div className="flex flex-wrap gap-1">
                  {currentStepData.array.map((num, index) => (
                    <div
                      key={index}
                      className="w-10 h-10 bg-blue-100 border-2 border-blue-300 rounded flex items-center justify-center text-sm font-bold text-blue-800"
                    >
                      {num}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Left and Right arrays for merge operations */}
            {currentStepData.left && currentStepData.right && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-xs font-medium text-gray-600 mb-1">Left Array:</div>
                  <div className="flex flex-wrap gap-1">
                    {currentStepData.left.map((num, index) => (
                      <div
                        key={index}
                        className="w-10 h-10 bg-green-100 border-2 border-green-300 rounded flex items-center justify-center text-sm font-bold text-green-800"
                      >
                        {num}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <div className="text-xs font-medium text-gray-600 mb-1">Right Array:</div>
                  <div className="flex flex-wrap gap-1">
                    {currentStepData.right.map((num, index) => (
                      <div
                        key={index}
                        className="w-10 h-10 bg-red-100 border-2 border-red-300 rounded flex items-center justify-center text-sm font-bold text-red-800"
                      >
                        {num}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Merged result */}
            {currentStepData.merged && (
              <div className="mb-4">
                <div className="text-xs font-medium text-gray-600 mb-1">Merged Result:</div>
                <div className="flex flex-wrap gap-1">
                  {currentStepData.merged.map((num, index) => (
                    <div
                      key={index}
                      className="w-10 h-10 bg-purple-100 border-2 border-purple-300 rounded flex items-center justify-center text-sm font-bold text-purple-800"
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

      {/* Algorithm Steps List */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
          📋 All Steps Overview
        </h3>
        
        <div className="max-h-64 overflow-y-auto space-y-2">
          {data.steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                index === currentStep
                  ? 'bg-blue-100 border-blue-400'
                  : 'bg-white border-green-300 hover:bg-green-50'
              }`}
              onClick={() => setCurrentStep(index)}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                index === currentStep
                  ? 'bg-blue-500 text-white'
                  : 'bg-green-500 text-white'
              }`}>
                {index + 1}
              </div>
              <div className="text-sm text-gray-700">{step.action}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Complexity Analysis */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200 p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
          📊 Performance Analysis
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-yellow-300">
            <div className="text-2xl font-bold text-blue-600">{data.comparisons}</div>
            <div className="text-sm text-gray-600">Total Comparisons</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-yellow-300">
            <div className="text-2xl font-bold text-green-600">{data.steps.length}</div>
            <div className="text-sm text-gray-600">Total Steps</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-yellow-300">
            <div className="text-2xl font-bold text-purple-600">O(n log n)</div>
            <div className="text-sm text-gray-600">Time Complexity</div>
          </div>
        </div>
      </div>
        </>
      )}

      {/* Complexity Analysis */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200 p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
          📊 Performance Analysis
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-yellow-300">
            <div className="text-2xl font-bold text-blue-600">{data.comparisons}</div>
            <div className="text-sm text-gray-600">Total Comparisons</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-yellow-300">
            <div className="text-2xl font-bold text-green-600">{data.steps.length}</div>
            <div className="text-sm text-gray-600">Total Steps</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-yellow-300">
            <div className="text-2xl font-bold text-purple-600">O(n log n)</div>
            <div className="text-sm text-gray-600">Time Complexity</div>
          </div>
        </div>
      </div>
    </div>
  );
}
