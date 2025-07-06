import React from 'react';
import { PrimResult } from '../utils/greedyAlgorithms';

interface PrimChartProps {
  data: PrimResult;
  vertices: number;
  currentStep?: number;
  totalSteps?: number;
  onNext?: () => void;
  onPrev?: () => void;
  onReset?: () => void;
}

export function PrimChart({ 
  data, 
  vertices, 
  currentStep = -1, 
  totalSteps = 0, 
  onNext, 
  onPrev, 
  onReset 
}: PrimChartProps) {
  if (!data || !data.mstEdges.length) return null;

  // Create adjacency representation for visualization
  const getVertexPosition = (vertex: number, total: number) => {
    const angle = (2 * Math.PI * vertex) / total;
    const radius = 100;
    const centerX = 150;
    const centerY = 150;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  };

  // Get edges to display up to current step
  const currentStepEdges = currentStep >= 0 ? data.mstEdges.slice(0, currentStep + 1) : data.mstEdges;
  const currentProcessingEdge = currentStep >= 0 && currentStep < data.mstEdges.length ? data.mstEdges[currentStep] : null;

  return (
    <div className="space-y-6">
      {/* Step Navigation Controls */}
      {totalSteps > 0 && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
            🔄 Algorithm Steps
          </h3>
          
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={onPrev}
              disabled={currentStep <= 0}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md font-semibold"
            >
              ← Prev
            </button>
            
            <button
              onClick={onReset}
              className="bg-purple-500 text-white px-4 py-2 rounded-md font-semibold"
            >
              Reset
            </button>
            
            <button
              onClick={onNext}
              disabled={currentStep >= totalSteps - 1}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md font-semibold"
            >
              Next →
            </button>
            
            <span className="px-3 py-1 bg-gray-100 rounded text-sm font-medium">
              Step {currentStep + 1} / {totalSteps}
            </span>
          </div>

          {/* Current Step Information */}
          {currentStep >= 0 && currentStep < data.steps.length && (
            <div className="bg-white p-4 rounded-lg border border-purple-300">
              <h4 className="font-semibold text-purple-800 mb-2">
                Step {currentStep + 1}: {currentProcessingEdge ? 'Adding Edge' : 'Initialization'}
              </h4>
              <div className="text-sm text-purple-700">
                <p><strong>Action:</strong> {data.steps[currentStep]}</p>
                {currentProcessingEdge && (
                  <p><strong>Edge:</strong> ({currentProcessingEdge.from}, {currentProcessingEdge.to}) → Weight: {currentProcessingEdge.weight}</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Graph Visualization */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
          🌳 Minimum Spanning Tree Visualization
        </h3>
        
        <div className="flex justify-center">
          <svg width="300" height="300" className="border border-gray-300 rounded-lg bg-white">
            {/* Draw MST edges */}
            {currentStepEdges.map((edge, index) => {
              const fromPos = getVertexPosition(edge.from, vertices);
              const toPos = getVertexPosition(edge.to, vertices);
              
              // Determine edge color based on step
              let strokeColor = "#10B981"; // Default green for completed edges
              let strokeWidth = "3";
              
              if (currentProcessingEdge && 
                  edge.from === currentProcessingEdge.from && 
                  edge.to === currentProcessingEdge.to) {
                strokeColor = "#EF4444"; // Red for currently processing edge
                strokeWidth = "4";
              }
              
              return (
                <g key={index}>
                  <line
                    x1={fromPos.x}
                    y1={fromPos.y}
                    x2={toPos.x}
                    y2={toPos.y}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    className="drop-shadow-sm"
                  />
                  <text
                    x={(fromPos.x + toPos.x) / 2}
                    y={(fromPos.y + toPos.y) / 2}
                    textAnchor="middle"
                    className="text-xs font-bold fill-blue-600 bg-white"
                    dy="4"
                  >
                    {edge.weight}
                  </text>
                </g>
              );
            })}
            
            {/* Draw vertices */}
            {Array.from({ length: vertices }, (_, i) => {
              const pos = getVertexPosition(i, vertices);
              return (
                <g key={i}>
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="20"
                    fill="#3B82F6"
                    stroke="#1D4ED8"
                    strokeWidth="2"
                    className="drop-shadow-md"
                  />
                  <text
                    x={pos.x}
                    y={pos.y}
                    textAnchor="middle"
                    className="text-sm font-bold fill-white"
                    dy="4"
                  >
                    {i}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* MST Edges Table */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
          📋 MST Edges in Order
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-green-500 to-blue-600 text-white">
                <th className="border-2 border-gray-400 px-4 py-3 text-left font-bold">Step</th>
                <th className="border-2 border-gray-400 px-4 py-3 text-left font-bold">Edge</th>
                <th className="border-2 border-gray-400 px-4 py-3 text-left font-bold">Weight</th>
                <th className="border-2 border-gray-400 px-4 py-3 text-left font-bold">Cumulative Weight</th>
              </tr>
            </thead>
            <tbody>
              {data.mstEdges.map((edge, idx) => {
                const cumulativeWeight = data.mstEdges
                  .slice(0, idx + 1)
                  .reduce((sum, e) => sum + e.weight, 0);
                
                return (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-green-50"}>
                    <td className="border-2 border-gray-400 px-4 py-3 font-semibold text-gray-800">
                      {idx + 1}
                    </td>
                    <td className="border-2 border-gray-400 px-4 py-3 text-blue-600 font-semibold">
                      ({edge.from}, {edge.to})
                    </td>
                    <td className="border-2 border-gray-400 px-4 py-3 text-green-600 font-bold">
                      {edge.weight}
                    </td>
                    <td className="border-2 border-gray-400 px-4 py-3 text-purple-600 font-semibold">
                      {cumulativeWeight}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Algorithm Steps */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200 p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
          📝 Algorithm Steps
        </h3>
        
        <div className="space-y-2">
          {data.steps.map((step, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-yellow-300">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>
              <div className="text-gray-700">{step}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
          📊 MST Summary
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-purple-300">
            <div className="text-2xl font-bold text-green-600">{data.totalWeight}</div>
            <div className="text-sm text-gray-600">Total Weight</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-purple-300">
            <div className="text-2xl font-bold text-blue-600">{data.mstEdges.length}</div>
            <div className="text-sm text-gray-600">Edges in MST</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-purple-300">
            <div className="text-2xl font-bold text-purple-600">{vertices}</div>
            <div className="text-sm text-gray-600">Vertices Connected</div>
          </div>
        </div>
      </div>
    </div>
  );
}
