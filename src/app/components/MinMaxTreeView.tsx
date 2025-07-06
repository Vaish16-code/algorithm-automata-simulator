import React from 'react';
import { MinMaxTreeNode } from '../utils/divideConquer';

interface MinMaxTreeViewProps {
  root: MinMaxTreeNode | null;
  className?: string;
}

interface TreeNodeProps {
  node: MinMaxTreeNode;
  x: number;
  y: number;
  level: number;
  onNodeClick?: (node: MinMaxTreeNode) => void;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, x, y, level, onNodeClick }) => {
  const nodeWidth = 60;
  const nodeHeight = 80;
  
  // Determine node colors based on state
  let fillColor = '#ddd6fe'; // Default light purple
  let strokeColor = '#8b5cf6'; // Default purple
  let textColor = '#4c1d95'; // Default dark purple
  
  if (node.isBaseCase) {
    fillColor = '#dcfce7'; // Light green
    strokeColor = '#16a34a'; // Green
    textColor = '#14532d'; // Dark green
  } else if (node.isCombining) {
    fillColor = '#fef3c7'; // Light yellow
    strokeColor = '#f59e0b'; // Yellow/orange
    textColor = '#92400e'; // Dark yellow
  }

  return (
    <g>
      {/* Lines to children */}
      {node.leftChild && (
        <line
          x1={x}
          y1={y + nodeHeight / 2}
          x2={x - Math.pow(2, Math.max(0, 4 - level)) * 20}
          y2={y + 95}
          stroke="#6b7280"
          strokeWidth="2"
        />
      )}
      {node.rightChild && (
        <line
          x1={x}
          y1={y + nodeHeight / 2}
          x2={x + Math.pow(2, Math.max(0, 4 - level)) * 20}
          y2={y + 95}
          stroke="#6b7280"
          strokeWidth="2"
        />
      )}
      
      {/* Node rectangle */}
      <rect
        x={x - nodeWidth / 2}
        y={y - nodeHeight / 2}
        width={nodeWidth}
        height={nodeHeight}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="2"
        rx="8"
        className="cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => onNodeClick?.(node)}
      />
      
      {/* Array display */}
      <text
        x={x}
        y={y - 20}
        textAnchor="middle"
        fill={textColor}
        fontSize="8"
        fontFamily="monospace"
        fontWeight="bold"
      >
        [{node.array.join(', ')}]
      </text>
      
      {/* Min/Max display */}
      <text
        x={x}
        y={y - 5}
        textAnchor="middle"
        fill={textColor}
        fontSize="9"
        fontWeight="bold"
      >
        Min: {node.min >= 0 ? node.min : '?'}
      </text>
      <text
        x={x}
        y={y + 8}
        textAnchor="middle"
        fill={textColor}
        fontSize="9"
        fontWeight="bold"
      >
        Max: {node.max >= 0 ? node.max : '?'}
      </text>

      {/* Final computed results for combining nodes */}
      {node.isCombining && node.leftResult && node.rightResult && (
        <>
          <text
            x={x}
            y={y + 20}
            textAnchor="middle"
            fill={textColor}
            fontSize="7"
            fontWeight="normal"
            style={{ fontStyle: 'italic' }}
          >
            L:[{node.leftResult.min},{node.leftResult.max}] R:[{node.rightResult.min},{node.rightResult.max}]
          </text>
          <text
            x={x}
            y={y + 29}
            textAnchor="middle"
            fill={textColor}
            fontSize="7"
            fontWeight="bold"
            style={{ fontStyle: 'italic' }}
          >
            → Final: [{node.min},{node.max}]
          </text>
        </>
      )}

      {/* Recursive children */}
      {node.leftChild && (
        <TreeNode
          node={node.leftChild}
          x={x - Math.pow(2, Math.max(0, 4 - level)) * 20}
          y={y + 95}
          level={level + 1}
          onNodeClick={onNodeClick}
        />
      )}
      {node.rightChild && (
        <TreeNode
          node={node.rightChild}
          x={x + Math.pow(2, Math.max(0, 4 - level)) * 20}
          y={y + 95}
          level={level + 1}
          onNodeClick={onNodeClick}
        />
      )}
    </g>
  );
};

const MinMaxTreeView: React.FC<MinMaxTreeViewProps> = ({ root, className = '' }) => {
  if (!root) {
    return (
      <div className={`p-8 text-center text-gray-500 ${className}`}>
        <p>No tree to display. Click &quot;Find Min-Max&quot; to generate the tree visualization.</p>
      </div>
    );
  }

  // Calculate tree dimensions based on tree depth
  const getTreeDepth = (node: MinMaxTreeNode): number => {
    if (!node.leftChild && !node.rightChild) return 1;
    const leftDepth = node.leftChild ? getTreeDepth(node.leftChild) : 0;
    const rightDepth = node.rightChild ? getTreeDepth(node.rightChild) : 0;
    return Math.max(leftDepth, rightDepth) + 1;
  };

  const depth = getTreeDepth(root);
  const svgWidth = Math.max(350, Math.pow(2, depth - 1) * 60);
  const svgHeight = depth * 95 + 80;

  const handleNodeClick = (node: MinMaxTreeNode) => {
    console.log('Node clicked:', node);
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Legend */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Tree Legend:</h3>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-200 border border-purple-500 rounded"></div>
            <span>Dividing Phase</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-200 border border-green-500 rounded"></div>
            <span>Base Case</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-200 border border-yellow-500 rounded"></div>
            <span>Combining Results</span>
          </div>
        </div>
      </div>

      {/* Tree visualization */}
      <div className="overflow-auto border rounded-lg bg-white">
        <svg
          width={svgWidth}
          height={svgHeight}
          className="min-w-full"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        >
          <TreeNode
            node={root}
            x={svgWidth / 2}
            y={40}
            level={0}
            onNodeClick={handleNodeClick}
          />
        </svg>
      </div>

      {/* Tree Statistics */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Tree Statistics:</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-semibold">Tree Depth:</span>
            <div className="text-blue-600">{depth}</div>
          </div>
          <div>
            <span className="font-semibold">Minimum Value:</span>
            <div className="text-red-600 font-mono">{root.min}</div>
          </div>
          <div>
            <span className="font-semibold">Maximum Value:</span>
            <div className="text-green-600 font-mono">{root.max}</div>
          </div>
          <div>
            <span className="font-semibold">Array Size:</span>
            <div className="text-gray-600">{root.array.length}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinMaxTreeView;
