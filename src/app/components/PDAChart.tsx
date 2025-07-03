import React from 'react';
import { PDAResult, PDAStackSymbol } from '../utils/automataTheory';

interface PDAChartProps {
  states: string[];
  transitions: {
    fromState: string;
    inputSymbol: string;
    popSymbol: string;
    toState: string;
    pushSymbols: string[];
  }[];
  acceptStates: string[];
  startState: string;
  result?: PDAResult | null;
}

export function PDAChart({ states, transitions, acceptStates, startState, result }: PDAChartProps) {
  const getStatePosition = (index: number, total: number) => {
    const angle = (2 * Math.PI * index) / total;
    const radius = 80;
    const centerX = 150;
    const centerY = 150;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  };

  const statePositions = states.map((_, index) => 
    getStatePosition(index, states.length)
  );

  return (
    <div className="space-y-4">
      <svg width="300" height="300" className="border rounded bg-white">
        {/* Draw transitions */}
        {transitions.map((transition, index) => {
          const fromIndex = states.findIndex(s => s === transition.fromState);
          const toIndex = states.findIndex(s => s === transition.toState);
          
          if (fromIndex === -1 || toIndex === -1) return null;
          
          const fromPos = statePositions[fromIndex];
          const toPos = statePositions[toIndex];
          
          // Self-loop
          if (fromIndex === toIndex) {
            return (
              <g key={index}>
                <circle
                  cx={fromPos.x}
                  cy={fromPos.y - 30}
                  r="15"
                  fill="none"
                  stroke="gray"
                  strokeWidth="2"
                />
                <text
                  x={fromPos.x}
                  y={fromPos.y - 30}
                  textAnchor="middle"
                  fontSize="10"
                  className="font-semibold"
                >
                  {`${transition.inputSymbol},${transition.popSymbol}/${transition.pushSymbols.join('')}`}
                </text>
              </g>
            );
          }
          
          return (
            <g key={index}>
              <line
                x1={fromPos.x}
                y1={fromPos.y}
                x2={toPos.x}
                y2={toPos.y}
                stroke="gray"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
              />
              <text
                x={(fromPos.x + toPos.x) / 2}
                y={(fromPos.y + toPos.y) / 2 - 5}
                textAnchor="middle"
                fontSize="10"
                className="font-semibold"
              >
                {`${transition.inputSymbol},${transition.popSymbol}/${transition.pushSymbols.join('')}`}
              </text>
            </g>
          );
        })}
        
        {/* Arrow marker */}
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" 
            refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="gray" />
          </marker>
        </defs>
        
        {/* Draw states */}
        {states.map((state, index) => {
          const pos = statePositions[index];
          const isStartState = state === startState;
          const isAcceptState = acceptStates.includes(state);
          const isCurrentState = result?.steps && result.steps.length > 0 
            ? result.steps[result.steps.length - 1].state === state
            : false;
          
          return (
            <g key={index}>
              {/* Accept state (double circle) */}
              {isAcceptState && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="22"
                  fill="none"
                  stroke="navy"
                  strokeWidth="2"
                />
              )}
              
              {/* Main circle */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r="18"
                fill={isCurrentState ? "lightgreen" : "lightblue"}
                stroke="navy"
                strokeWidth="2"
              />
              
              {/* Start state arrow */}
              {isStartState && (
                <line
                  x1={pos.x - 40}
                  y1={pos.y}
                  x2={pos.x - 20}
                  y2={pos.y}
                  stroke="navy"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
              )}
              
              <text
                x={pos.x}
                y={pos.y + 5}
                textAnchor="middle"
                fontSize="12"
                fontWeight="bold"
              >
                {state}
              </text>
            </g>
          );
        })}
      </svg>
      
      <div className="text-sm text-gray-600">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-lightblue border border-navy"></div>
            <span>State</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-lightgreen border border-navy"></div>
            <span>Current State</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full border-2 border-navy"></div>
            <span>Accept State</span>
          </div>
        </div>
        
        <div className="mt-2 italic">Transition format: input,pop/push</div>
        <div className="text-xs">ε represents epsilon (empty string)</div>
      </div>
      
      {result && result.steps.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg border mt-4">
          <h3 className="font-semibold mb-2">Current Stack:</h3>
          <div className="flex items-center justify-center gap-1 p-2">
            {result.steps[result.steps.length - 1].stack.length === 0 ? (
              <span className="text-gray-400 italic">Empty stack</span>
            ) : (
              <Stack stack={result.steps[result.steps.length - 1].stack} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface StackProps {
  stack: PDAStackSymbol[];
}

function Stack({ stack }: StackProps) {
  return (
    <div className="flex flex-col-reverse">
      {stack.map((symbol, index) => (
        <div 
          key={symbol.index} 
          className="border-2 border-gray-600 px-4 py-1 text-center font-mono"
          style={{
            borderBottomWidth: index === 0 ? '2px' : '0',
            borderTopWidth: index === stack.length - 1 ? '2px' : '1px',
            minWidth: '3rem'
          }}
        >
          {symbol.value}
        </div>
      ))}
    </div>
  );
}
