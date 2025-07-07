import React from 'react';
import { KruskalResult, MSTEdge } from '../utils/greedyAlgorithms';

interface KruskalChartProps {
  data: KruskalResult;
  vertices: number;
  currentStep?: number;
  totalSteps?: number;
  onNext?: () => void;
  onPrev?: () => void;
  onReset?: () => void;
}

export function KruskalChart({ 
  data, 
  vertices, 
  currentStep = -1, 
  totalSteps = 0, 
  onNext, 
  onPrev, 
  onReset 
}: KruskalChartProps) {
  if (!data || !data.mstEdges.length) return null;

  // Get all unique vertices from MST and original edges
  const allEdgesVertices = data.allEdges ? 
    Array.from(new Set([...data.allEdges.flatMap(edge => [edge.from, edge.to])])) :
    Array.from(new Set([...data.mstEdges.flatMap(edge => [edge.from, edge.to])]));
  
  const uniqueVertices = allEdgesVertices;

  // Create adjacency representation for visualization
  const getVertexPosition = (index: number, total: number) => {
    const angle = (2 * Math.PI * index) / total;
    const radius = 100;
    const centerX = 150;
    const centerY = 150;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  };

  // Create position mapping for string vertices
  const vertexPositions: { [key: string]: { x: number; y: number } } = {};
  uniqueVertices.forEach((vertex, index) => {
    vertexPositions[vertex] = getVertexPosition(index, uniqueVertices.length);
  });

  // Get edges to display up to current step
  const currentStepEdges = currentStep >= 0 ? data.mstEdges.slice(0, currentStep + 1) : data.mstEdges;
  const currentProcessingEdge = currentStep >= 0 && currentStep < data.mstEdges.length ? data.mstEdges[currentStep] : null;

  return (
    <div className="space-y-4">
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
                Step {currentStep + 1}: {currentProcessingEdge ? 'Processing Edge' : 'Initialization'}
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

      <div className="bg-white border rounded-lg p-4">
        <h4 className="font-semibold mb-2">Graph Visualization - Step by Step MST Construction</h4>
        <svg width="300" height="300" className="border">
          {/* Draw all original graph edges in light gray */}
          {data.allEdges && data.allEdges.map((edge, index) => {
            const fromPos = vertexPositions[edge.from];
            const toPos = vertexPositions[edge.to];
            
            if (!fromPos || !toPos) return null;
            
            // Check if this edge is in the MST
            const isInMST = currentStepEdges.some(mstEdge => 
              (mstEdge.from === edge.from && mstEdge.to === edge.to) ||
              (mstEdge.from === edge.to && mstEdge.to === edge.from)
            );
            
            // Check if this is the currently processing edge
            const isProcessing = currentProcessingEdge && 
              ((currentProcessingEdge.from === edge.from && currentProcessingEdge.to === edge.to) ||
               (currentProcessingEdge.from === edge.to && currentProcessingEdge.to === edge.from));
            
            let strokeColor = "#E5E7EB"; // Light gray for unselected edges
            let strokeWidth = "2";
            let strokeDasharray = "none";
            
            if (isProcessing) {
              strokeColor = "#EF4444"; // Red for currently processing
              strokeWidth = "4";
              strokeDasharray = "5,5";
            } else if (isInMST) {
              strokeColor = "#10B981"; // Green for selected MST edges
              strokeWidth = "3";
            }
            
            return (
              <g key={`all-edge-${index}`}>
                <line
                  x1={fromPos.x}
                  y1={fromPos.y}
                  x2={toPos.x}
                  y2={toPos.y}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                />
                {/* Edge weight label */}
                <text
                  x={(fromPos.x + toPos.x) / 2}
                  y={(fromPos.y + toPos.y) / 2}
                  fill={isInMST || isProcessing ? "black" : "#6B7280"}
                  fontSize="12"
                  textAnchor="middle"
                  className="font-semibold"
                >
                  {edge.weight}
                </text>
              </g>
            );
          })}
          
          {/* Draw vertices */}
          {uniqueVertices.map((vertex: string, index: number) => {
            const pos = vertexPositions[vertex];
            if (!pos) return null;
            
            return (
              <g key={vertex}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="20"
                  fill="lightblue"
                  stroke="navy"
                  strokeWidth="2"
                />
                <text
                  x={pos.x}
                  y={pos.y + 5}
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="bold"
                >
                  {vertex}
                </text>
              </g>
            );
          })}
        </svg>
        
        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-gray-300"></div>
            <span>Original edges</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-green-500"></div>
            <span>MST edges</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-red-500" style={{borderStyle: 'dashed'}}></div>
            <span>Processing edge</span>
          </div>
        </div>
      </div>

      {/* Algorithm steps */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">Algorithm Steps:</h4>
        <div className="max-h-40 overflow-y-auto">
          {data.steps.map((step: string, index: number) => (
            <div key={index} className="text-sm mb-1 p-2 bg-white rounded">
              <span className="font-medium text-blue-600">Step {index + 1}:</span> {step}
            </div>
          ))}
        </div>
      </div>

      {/* MST Details */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">MST Details:</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="font-medium">Total Weight:</span> {data.totalWeight}
          </div>
          <div>
            <span className="font-medium">Number of Edges:</span> {data.mstEdges.length}
          </div>
        </div>
        <div className="mt-2">
          <span className="font-medium">Selected Edges:</span>
          <div className="mt-1 flex flex-wrap gap-2">
            {data.mstEdges.map((edge: MSTEdge, index: number) => {
              const color = `hsl(${(edge.step * 60) % 360}, 70%, 90%)`;
              return (
                <span 
                  key={index} 
                  className="px-2 py-1 rounded text-sm"
                  style={{ backgroundColor: color }}
                >
                  ({edge.from}, {edge.to}): {edge.weight}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
