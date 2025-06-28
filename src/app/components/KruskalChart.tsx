import React from 'react';
import { KruskalResult, MSTEdge } from '../utils/greedyAlgorithms';

interface KruskalChartProps {
  data: KruskalResult;
  vertices: number;
}

export function KruskalChart({ data, vertices }: KruskalChartProps) {
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

  const vertexPositions = Array.from({ length: vertices }, (_, i) => 
    getVertexPosition(i, vertices)
  );

  return (
    <div className="space-y-4">
      <div className="bg-white border rounded-lg p-4">
        <h4 className="font-semibold mb-2">Minimum Spanning Tree</h4>
        <svg width="300" height="300" className="border">
          {/* Draw MST edges */}
          {data.mstEdges.map((edge: MSTEdge, index: number) => {
            const fromPos = vertexPositions[edge.from];
            const toPos = vertexPositions[edge.to];
            const color = `hsl(${(edge.step * 60) % 360}, 70%, 50%)`;
            
            return (
              <g key={index}>
                <line
                  x1={fromPos.x}
                  y1={fromPos.y}
                  x2={toPos.x}
                  y2={toPos.y}
                  stroke={color}
                  strokeWidth="3"
                />
                {/* Edge weight label */}
                <text
                  x={(fromPos.x + toPos.x) / 2}
                  y={(fromPos.y + toPos.y) / 2}
                  fill="black"
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
          {vertexPositions.map((pos, index) => (
            <g key={index}>
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
                {index}
              </text>
            </g>
          ))}
        </svg>
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
