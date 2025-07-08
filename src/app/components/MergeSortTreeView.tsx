import React, { useState } from 'react';
import { MergeSortTreeNode } from '../utils/divideConquer';

interface MergeSortTreeViewProps {
  tree: MergeSortTreeNode;
  currentStep: number;
  totalSteps: number;
}

interface TreeNodeProps {
  node: MergeSortTreeNode;
  x: number;
  y: number;
  isAnimated: boolean;
}

function TreeNode({ node, x, y, isAnimated }: TreeNodeProps) {
  const nodeWidth = Math.max(60, node.array.length * 30);
  const nodeHeight = 40;
  
  // Show the appropriate array based on the node's current state
  const displayArray = node.array; // Now `array` property holds the correct state
  
  // Determine colors based on state
  let bgColor, borderColor, textColor;
  if (node.isLeaf) {
    bgColor = "#e3f2fd"; // Light blue for base cases
    borderColor = "#1976d2";
    textColor = "#1976d2";
  } else if (node.isDividing) {
    bgColor = "#fff3e0"; // Orange for dividing (shows original unsorted)
    borderColor = "#f57c00";
    textColor = "#f57c00";
  } else if (node.isMerged) {
    bgColor = "#e8f5e8"; // Green for merged (shows sorted result)
    borderColor = "#4caf50";
    textColor = "#4caf50";
  } else {
    bgColor = "#f5f5f5"; // Gray for processing
    borderColor = "#9e9e9e";
    textColor = "#9e9e9e";
  }
  
  return (
    <g>
      {/* Node rectangle */}
      <rect
        x={x - nodeWidth / 2}
        y={y - nodeHeight / 2}
        width={nodeWidth}
        height={nodeHeight}
        fill={bgColor}
        stroke={borderColor}
        strokeWidth="2"
        rx="8"
        className={isAnimated ? "transition-all duration-500" : ""}
      />
      
      {/* Array elements */}
      <g>
        {displayArray.map((num, index) => {
          const elementX = x - nodeWidth / 2 + 15 + index * 30;
          const elementY = y;
          
          return (
            <g key={index}>
              <circle
                cx={elementX}
                cy={elementY}
                r="12"
                fill={textColor}
                className={isAnimated ? "transition-all duration-300" : ""}
              />
              <text
                x={elementX}
                y={elementY + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize="10"
                fontWeight="bold"
              >
                {num}
              </text>
            </g>
          );
        })}
      </g>
      
      {/* Node label */}
      <text
        x={x}
        y={y + nodeHeight / 2 + 15}
        textAnchor="middle"
        fontSize="10"
        fill="#666"
        fontWeight="500"
      >
        [{node.range[0]}, {node.range[1]}]
      </text>
    </g>
  );
}

function calculateTreeLayout(node: MergeSortTreeNode): Map<string, { x: number; y: number }> {
  const positions = new Map<string, { x: number; y: number }>();
  const levelWidth = new Map<number, number>();
  
  // Calculate width needed for each level
  function calculateLevelWidths(node: MergeSortTreeNode) {
    const width = Math.max(100, node.array.length * 40);
    levelWidth.set(node.level, (levelWidth.get(node.level) || 0) + width + 50);
    
    if (node.left) calculateLevelWidths(node.left);
    if (node.right) calculateLevelWidths(node.right);
  }
  
  calculateLevelWidths(node);
  
  // Position nodes
  function positionNode(node: MergeSortTreeNode, x: number, y: number) {
    positions.set(node.id, { x, y });
    
    if (node.left && node.right) {
      const spacing = Math.max(120, node.array.length * 20);
      positionNode(node.left, x - spacing, y + 100);
      positionNode(node.right, x + spacing, y + 100);
    }
  }
  
  positionNode(node, 400, 60);
  return positions;
}

export function MergeSortTreeView({ tree, currentStep, totalSteps }: MergeSortTreeViewProps) {
  const [showAnimations, setShowAnimations] = useState(true);
  const positions = calculateTreeLayout(tree);
  
  function renderTree(node: MergeSortTreeNode): React.ReactNode {
    const pos = positions.get(node.id);
    if (!pos) return null;
    
    return (
      <g key={node.id}>
        {/* Render edges to children */}
        {node.left && (
          <line
            x1={pos.x}
            y1={pos.y + 20}
            x2={positions.get(node.left.id)?.x || 0}
            y2={(positions.get(node.left.id)?.y || 0) - 20}
            stroke="#666"
            strokeWidth="2"
            markerEnd="url(#arrowhead)"
          />
        )}
        {node.right && (
          <line
            x1={pos.x}
            y1={pos.y + 20}
            x2={positions.get(node.right.id)?.x || 0}
            y2={(positions.get(node.right.id)?.y || 0) - 20}
            stroke="#666"
            strokeWidth="2"
            markerEnd="url(#arrowhead)"
          />
        )}
        
        {/* Render current node */}
        <TreeNode
          node={node}
          x={pos.x}
          y={pos.y}
          isAnimated={showAnimations}
        />
        
        {/* Recursively render children */}
        {node.left && renderTree(node.left)}
        {node.right && renderTree(node.right)}
      </g>
    );
  }
  
  // Calculate SVG dimensions
  const maxX = Math.max(...Array.from(positions.values()).map(p => p.x)) + 150;
  const maxY = Math.max(...Array.from(positions.values()).map(p => p.y)) + 100;
  
  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          🌳 Merge Sort Tree Visualization
        </h3>
        
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showAnimations}
              onChange={(e) => setShowAnimations(e.target.checked)}
              className="rounded"
            />
            Animations
          </label>
        </div>
      </div>
      
      {/* Legend */}
      <div className="mb-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-100 border-2 border-blue-600 rounded"></div>
          <span>Base Case (Single Element)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-100 border-2 border-orange-600 rounded"></div>
          <span>Dividing (Original Array)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 border-2 border-green-600 rounded"></div>
          <span>Merged (Sorted Result)</span>
        </div>
      </div>
      
      {/* Tree visualization */}
      <div className="bg-white rounded-lg border border-purple-300 p-4 overflow-auto">
        <svg
          width={Math.max(800, maxX)}
          height={Math.max(400, maxY)}
          viewBox={`0 0 ${Math.max(800, maxX)} ${Math.max(400, maxY)}`}
          className="w-full h-auto"
        >
          {/* Arrow marker definition */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="#666"
              />
            </marker>
          </defs>
          
          {renderTree(tree)}
        </svg>
      </div>
      
      {/* Progress indicator */}
      <div className="mt-4 text-center text-sm text-gray-600">
        <div className="bg-purple-100 rounded-full h-2 mb-2">
          <div
            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          ></div>
        </div>
        <span>Progress: {currentStep + 1} / {totalSteps} steps</span>
      </div>
    </div>
  );
}

export default MergeSortTreeView;