import React from 'react';
import { TMResult } from '../utils/automataTheory';

interface TMChartProps {
  result: TMResult;
}

export function TMChart({ result }: TMChartProps) {
  if (!result || result.steps.length === 0) return null;

  const currentStep = result.steps[result.steps.length - 1];
  const tape = currentStep.tape;
  const headPosition = currentStep.headPosition;

  // Show a window of the tape around the head position
  const windowSize = 15;
  const startIndex = Math.max(0, headPosition - Math.floor(windowSize / 2));
  const endIndex = Math.min(tape.length, startIndex + windowSize);
  const visibleTape = tape.slice(startIndex, endIndex);
  const adjustedHeadPosition = headPosition - startIndex;

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-black mb-3">Current Tape State</h4>
        <div className="flex justify-center">
          <div className="grid grid-cols-15 gap-0 border-2 border-gray-300 bg-white">
            {visibleTape.map((symbol, index) => (
              <div
                key={startIndex + index}
                className={`
                  w-8 h-8 border border-gray-300 flex items-center justify-center text-sm font-mono font-bold text-black
                  ${index === adjustedHeadPosition 
                    ? 'bg-yellow-200 border-yellow-400 border-2' 
                    : 'bg-white'
                  }
                `}
              >
                {symbol}
              </div>
            ))}
          </div>
        </div>
        
        {/* Head indicator */}
        <div className="flex justify-center mt-2">
          <div className="grid grid-cols-15 gap-0">
            {visibleTape.map((_, index) => (
              <div
                key={index}
                className="w-8 h-4 flex items-center justify-center"
              >
                {index === adjustedHeadPosition && (
                  <div className="text-red-500 font-bold text-xs">▲</div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-center mt-2 text-sm text-black font-medium">
          Head Position: {headPosition} | Current State: {currentStep.state}
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-black mb-2">Execution Summary</h4>
        <div className="grid grid-cols-2 gap-4 text-sm text-black">
          <div>
            <span className="font-medium">Total Steps:</span> {result.steps.length - 1}
          </div>
          <div>
            <span className="font-medium">Final State:</span> {currentStep.state}
          </div>
          <div>
            <span className="font-medium">Result:</span> 
            <span className={result.accepted ? 'text-green-700 font-bold' : 'text-red-700 font-bold'}>
              {result.accepted ? ' ACCEPTED' : ' REJECTED'}
            </span>
          </div>
          <div>
            <span className="font-medium">Head Position:</span> {headPosition}
          </div>
        </div>
      </div>

      {result.steps.length > 1 && (
        <div className="bg-white border rounded-lg p-4">
          <h4 className="font-semibold mb-2 text-black">Last Transition</h4>
          {currentStep.transition && (
            <div className="font-mono text-sm bg-gray-100 p-2 rounded text-black font-semibold">
              δ({currentStep.transition.currentState}, {currentStep.transition.readSymbol}) = 
              ({currentStep.transition.writeSymbol}, {currentStep.transition.moveDirection}, {currentStep.transition.nextState})
            </div>
          )}
        </div>
      )}
    </div>
  );
}
