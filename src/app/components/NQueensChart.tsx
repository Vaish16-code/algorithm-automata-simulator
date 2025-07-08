import React, { useState } from 'react';
import { NQueensResult } from '../utils/backtracking';

interface NQueensChartProps {
  data: NQueensResult;
  boardSize: number;
}

export function NQueensChart({ data, boardSize }: NQueensChartProps) {
  const [currentStep, setCurrentStep] = useState(data.steps.length - 1);
  const [selectedSolution, setSelectedSolution] = useState(0);

  if (!data) return null;

  const currentStepData = data.steps[currentStep];

  const renderBoard = (board: number[][], highlightRow = -1, highlightCol = -1) => {
    return (
      <div className="inline-block border-2 border-gray-800">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((cell, colIndex) => {
              const isHighlighted = rowIndex === highlightRow && colIndex === highlightCol;
              const isQueen = cell === 1;
              const isEvenSquare = (rowIndex + colIndex) % 2 === 0;
              
              let bgColor = isEvenSquare ? 'bg-amber-100' : 'bg-amber-200';
              
              if (isHighlighted) {
                bgColor = currentStepData.isValid ? 'bg-green-300' : 'bg-red-300';
              } else if (isQueen) {
                bgColor = 'bg-purple-300';
              }

              return (
                <div
                  key={colIndex}
                  className={`w-6 h-6 sm:w-8 sm:h-8 border border-gray-400 flex items-center justify-center text-sm sm:text-lg font-bold ${bgColor}`}
                >
                  {isQueen ? '♛' : ''}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (      <div className="space-y-4 lg:space-y-6">
      {/* Solutions Display */}
      {data.solutions.length > 0 && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 p-4 lg:p-6">
          <h3 className="text-lg lg:text-xl font-bold mb-3 lg:mb-4 text-gray-800 flex items-center">
            🏆 Solutions Found ({data.solutions.length})
          </h3>
          
          {data.solutions.length > 1 && (
            <div className="mb-3 lg:mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Solution:
              </label>
              <select
                value={selectedSolution}
                onChange={(e) => setSelectedSolution(parseInt(e.target.value))}
                className="border border-gray-300 rounded-md px-2 lg:px-3 py-1 lg:py-2 text-sm lg:text-base"
              >
                {data.solutions.map((_, index) => (
                  <option key={index} value={index}>
                    Solution {index + 1}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          <div className="flex justify-center">
            {renderBoard(data.solutions[selectedSolution])}
          </div>
        </div>
      )}

      {/* Step-by-Step Visualization */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 p-4 lg:p-6">
        <h3 className="text-lg lg:text-xl font-bold mb-3 lg:mb-4 text-gray-800 flex items-center">
          🔄 Step-by-Step Backtracking Process
        </h3>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 lg:gap-4 mb-3 lg:mb-4">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 lg:px-4 py-2 rounded-md text-sm lg:text-base"
          >
            Previous
          </button>
          
          <div className="flex-1 text-center">
            <div className="text-base lg:text-lg font-semibold text-gray-800">
              Step {currentStep + 1} of {data.steps.length}
            </div>
            <div className="text-sm text-gray-600">
              {currentStepData.action}
            </div>
          </div>
          
          <button
            onClick={() => setCurrentStep(Math.min(data.steps.length - 1, currentStep + 1))}
            disabled={currentStep === data.steps.length - 1}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 lg:px-4 py-2 rounded-md text-sm lg:text-base"
          >
            Next
          </button>
        </div>

        <div className="mb-3 lg:mb-4">
          <input
            type="range"
            min="0"
            max={data.steps.length - 1}
            value={currentStep}
            onChange={(e) => setCurrentStep(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Current Step Board */}
        <div className="bg-white p-4 rounded-lg border border-blue-300">
          <div className="flex flex-col items-center gap-4">
            <div className="text-center">
              <div className="text-sm font-medium text-gray-700 mb-2">
                {currentStepData.backtrack ? '🔙 Backtracking' : '🎯 Trying Position'} 
                {currentStepData.currentRow >= 0 && currentStepData.currentCol >= 0 && 
                  ` (${currentStepData.currentRow}, ${currentStepData.currentCol})`
                }
              </div>
              
              {renderBoard(
                currentStepData.board, 
                currentStepData.currentRow, 
                currentStepData.currentCol
              )}
              
              <div className="text-xs text-gray-600 mt-2">
                Queens placed: {currentStepData.placedQueens.length}
              </div>
            </div>
            
            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-amber-100 border border-gray-400"></div>
                <span>Empty</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-purple-300 border border-gray-400 flex items-center justify-center text-xs">♛</div>
                <span>Queen</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-green-300 border border-gray-400"></div>
                <span>Valid Move</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-red-300 border border-gray-400"></div>
                <span>Invalid Move</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Algorithm Steps List */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200 p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
          📋 Algorithm Steps Log
        </h3>
        
        <div className="max-h-64 overflow-y-auto space-y-1">
          {data.steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 p-2 rounded-lg border cursor-pointer transition-colors text-sm ${
                index === currentStep
                  ? 'bg-blue-100 border-blue-400'
                  : step.backtrack
                    ? 'bg-red-50 border-red-200 hover:bg-red-100'
                    : step.isValid
                      ? 'bg-green-50 border-green-200 hover:bg-green-100'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
              onClick={() => setCurrentStep(index)}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                index === currentStep
                  ? 'bg-blue-500 text-white'
                  : step.backtrack
                    ? 'bg-red-500 text-white'
                    : step.isValid
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-500 text-white'
              }`}>
                {index + 1}
              </div>
              <div className="text-gray-700">
                {step.backtrack && '🔙 '}
                {step.isValid && !step.backtrack && '✅ '}
                {!step.isValid && !step.backtrack && '❌ '}
                {step.action}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
          📊 Algorithm Statistics
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-purple-300">
            <div className="text-2xl font-bold text-green-600">{data.totalSolutions}</div>
            <div className="text-sm text-gray-600">Total Solutions</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-purple-300">
            <div className="text-2xl font-bold text-blue-600">{data.steps.length}</div>
            <div className="text-sm text-gray-600">Total Steps</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-purple-300">
            <div className="text-2xl font-bold text-red-600">
              {data.steps.filter(step => step.backtrack).length}
            </div>
            <div className="text-sm text-gray-600">Backtracks</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-purple-300">
            <div className="text-2xl font-bold text-purple-600">{boardSize}²</div>
            <div className="text-sm text-gray-600">Board Size</div>
          </div>
        </div>
      </div>
    </div>
  );
}
