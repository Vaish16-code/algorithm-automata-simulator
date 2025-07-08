"use client";

import React, { useState, useEffect } from "react";
import { floydWarshall, FloydWarshallResult } from "../../../utils/dynamicProgramming";
import { EducationalInfo, ExamResult } from "../../../../components";

interface Node {
  id: number;
  x: number;
  y: number;
  label: string;
}

interface Edge {
  from: number;
  to: number;
  weight: number;
}

export default function FloydWarshallPage() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [graph, setGraph] = useState<number[][]>([]);
  const [result, setResult] = useState<FloydWarshallResult | null>(null);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [isDrawingMode, setIsDrawingMode] = useState<'node' | 'edge' | 'delete' | 'none'>('none');
  const [edgeStart, setEdgeStart] = useState<number | null>(null);
  const [edgeWeight, setEdgeWeight] = useState<string>('1');
  const [animationStep, setAnimationStep] = useState<number>(-1);
  const [numVertices, setNumVertices] = useState<number>(4);
  
  // New state for drag and drop
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<{x: number, y: number}>({x: 0, y: 0});
  const [dragStarted, setDragStarted] = useState<boolean>(false);
  
  // New state for undo functionality
  const [history, setHistory] = useState<{nodes: Node[], edges: Edge[]}[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  useEffect(() => {
    // Initialize with a sample graph
    const sampleNodes: Node[] = [
      { id: 0, x: 100, y: 100, label: 'A' },
      { id: 1, x: 250, y: 100, label: 'B' },
      { id: 2, x: 250, y: 200, label: 'C' },
      { id: 3, x: 100, y: 200, label: 'D' }
    ];
    
    const sampleEdges: Edge[] = [
      { from: 0, to: 1, weight: 5 },
      { from: 1, to: 2, weight: 3 },
      { from: 2, to: 3, weight: 1 },
      { from: 0, to: 3, weight: 10 }
    ];

    setNodes(sampleNodes);
    setEdges(sampleEdges);
    updateGraphFromVisual(sampleNodes, sampleEdges);
    saveToHistory(sampleNodes, sampleEdges);
  }, []);

  // Save state to history for undo functionality
  const saveToHistory = (newNodes: Node[], newEdges: Edge[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ nodes: [...newNodes], edges: [...newEdges] });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Undo function
  const undo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setNodes(prevState.nodes);
      setEdges(prevState.edges);
      updateGraphFromVisual(prevState.nodes, prevState.edges);
      setHistoryIndex(historyIndex - 1);
      setResult(null);
      setAnimationStep(-1);
    }
  };

  // Redo function
  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
      updateGraphFromVisual(nextState.nodes, nextState.edges);
      setHistoryIndex(historyIndex + 1);
      setResult(null);
      setAnimationStep(-1);
    }
  };

  const updateGraphFromVisual = (nodeList: Node[], edgeList: Edge[]) => {
    const n = nodeList.length;
    if (n === 0) {
      setGraph([]);
      return;
    }
    
    const newGraph = Array(n).fill(null).map(() => Array(n).fill(Infinity));
    
    // Initialize diagonal to 0
    for (let i = 0; i < n; i++) {
      newGraph[i][i] = 0;
    }

    // Add edges (directed graph)
    edgeList.forEach(edge => {
      newGraph[edge.from][edge.to] = edge.weight;
    });

    setGraph(newGraph);
  };

  // Mouse down handler for dragging
  const handleNodeMouseDown = (nodeId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    console.log('Node mouse down:', nodeId, 'Mode:', isDrawingMode);
    
    // Only allow dragging when not in edge mode
    if (isDrawingMode !== 'edge') {
      setIsDragging(true);
      setSelectedNode(nodeId);
      
      const node = nodes.find(n => n.id === nodeId);
      if (node) {
        const svg = event.currentTarget.closest('svg');
        if (svg) {
          const rect = svg.getBoundingClientRect();
          setDragOffset({
            x: event.clientX - rect.left - node.x,
            y: event.clientY - rect.top - node.y
          });
        }
      }
      setDragStarted(false);
      // Only prevent default for dragging, not for edge creation
      event.preventDefault();
    }
    // Don't prevent default in edge mode - let the click event fire
  };

  // SVG mouse move handler for dragging
  const handleSvgMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging || selectedNode === null) return;

    const svg = event.currentTarget;
    const rect = svg.getBoundingClientRect();
    const newX = Math.max(25, Math.min(475, event.clientX - rect.left - dragOffset.x));
    const newY = Math.max(25, Math.min(275, event.clientY - rect.top - dragOffset.y));

    if (!dragStarted) {
      setDragStarted(true);
    }

    const newNodes = nodes.map(node => 
      node.id === selectedNode 
        ? { ...node, x: newX, y: newY }
        : node
    );
    
    setNodes(newNodes);
    event.preventDefault();
  };

  // SVG mouse down handler
  const handleSvgMouseDown = (event: React.MouseEvent<SVGSVGElement>) => {
    // This will be handled by individual nodes
  };

  // SVG mouse up handler
  const handleSvgMouseUp = (event: React.MouseEvent<SVGSVGElement>) => {
    console.log('SVG mouse up - isDragging:', isDragging, 'dragStarted:', dragStarted, 'mode:', isDrawingMode);
    
    if (isDragging) {
      setIsDragging(false);
      if (dragStarted) {
        saveToHistory(nodes, edges);
        setDragStarted(false);
        setSelectedNode(null);
        return; // Don't process as click
      }
      setSelectedNode(null);
    }

    // If not dragging, handle as regular click for adding nodes/edges
    if (!dragStarted && !isDragging && isDrawingMode === 'node') {
      handleSvgClickInternal(event);
    }
  };

  // SVG mouse leave handler
  const handleSvgMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      if (dragStarted) {
        saveToHistory(nodes, edges);
        setDragStarted(false);
      }
      setSelectedNode(null);
    }
  };

  // Handle node clicks directly
  const handleNodeClick = (nodeId: number, event: React.MouseEvent) => {
    console.log('=== NODE CLICK EVENT ===');
    console.log('Node clicked:', nodeId, 'Mode:', isDrawingMode, 'EdgeStart:', edgeStart);
    console.log('isDragging:', isDragging, 'dragStarted:', dragStarted);
    
    // Don't handle click if we just finished dragging
    if (dragStarted) {
      console.log('⚠️ Ignoring click because drag just finished');
      return;
    }
    
    event.stopPropagation();
    
    if (isDrawingMode === 'edge') {
      console.log('🎯 In edge creation mode');
      if (edgeStart === null) {
        setEdgeStart(nodeId);
        console.log('✅ First node selected for edge:', nodeId);
      } else if (edgeStart !== nodeId) {
        // Create edge between edgeStart and nodeId
        const weight = parseInt(edgeWeight) || 1;
        
        // Check if edge already exists (directed graph)
        const existingEdge = edges.find(e => 
          e.from === edgeStart && e.to === nodeId
        );
        
        if (!existingEdge) {
          const newEdge: Edge = {
            from: edgeStart,
            to: nodeId,
            weight
          };
          const newEdges = [...edges, newEdge];
          setEdges(newEdges);
          updateGraphFromVisual(nodes, newEdges);
          saveToHistory(nodes, newEdges);
          console.log('✅ Edge created:', edgeStart, 'to', nodeId, 'weight:', weight);
          console.log('New edges array:', newEdges);
        } else {
          console.log('❌ Edge already exists from', edgeStart, 'to', nodeId);
        }
        setEdgeStart(null);
      } else {
        // Same node clicked twice, cancel
        console.log('🔄 Same node clicked twice, canceling edge creation');
        setEdgeStart(null);
      }
    } else if (isDrawingMode === 'delete') {
      // Delete node and all connected edges
      const newNodes = nodes.filter(n => n.id !== nodeId);
      const newEdges = edges.filter(e => e.from !== nodeId && e.to !== nodeId);
      
      // Renumber nodes to maintain sequential IDs
      const renumberedNodes = newNodes.map((node, index) => ({
        ...node,
        id: index,
        label: String.fromCharCode(65 + index)
      }));
      
      // Update edge references to match renumbered nodes
      const renumberedEdges = newEdges.map(edge => {
        const fromIndex = newNodes.findIndex(n => n.id === edge.from);
        const toIndex = newNodes.findIndex(n => n.id === edge.to);
        return {
          ...edge,
          from: fromIndex,
          to: toIndex
        };
      }).filter(edge => edge.from >= 0 && edge.to >= 0);
      
      setNodes(renumberedNodes);
      setEdges(renumberedEdges);
      updateGraphFromVisual(renumberedNodes, renumberedEdges);
      saveToHistory(renumberedNodes, renumberedEdges);
      if (selectedNode === nodeId) setSelectedNode(null);
      console.log('Node deleted:', nodeId);
    } else if (isDrawingMode === 'none') {
      // Select node
      setSelectedNode(nodeId);
      console.log('Node selected:', nodeId);
    }
  };

  // SVG click logic
  const handleSvgClickInternal = (event: React.MouseEvent<SVGSVGElement>) => {
    const svg = event.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (isDrawingMode === 'node') {
      // Add new node
      const newNode: Node = {
        id: nodes.length,
        x,
        y,
        label: String.fromCharCode(65 + nodes.length) // A, B, C, ...
      };
      const newNodes = [...nodes, newNode];
      setNodes(newNodes);
      updateGraphFromVisual(newNodes, edges);
      saveToHistory(newNodes, edges);
    } else if (isDrawingMode === 'edge') {
      // Reset edge start if clicking on empty space
      setEdgeStart(null);
    } else {
      // Select nothing if clicking on empty space
      setSelectedNode(null);
    }
  };

  const handleSolve = () => {
    if (graph.length === 0) return;
    const output = floydWarshall(graph);
    setResult(output);
    setAnimationStep(0);
  };

  const clearGraph = () => {
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    setNodes(newNodes);
    setEdges(newEdges);
    setGraph([]);
    setResult(null);
    setAnimationStep(-1);
    setSelectedNode(null);
    setEdgeStart(null);
    saveToHistory(newNodes, newEdges);
  };

  const loadSampleGraph = () => {
    const sampleNodes: Node[] = [
      { id: 0, x: 100, y: 100, label: 'A' },
      { id: 1, x: 250, y: 100, label: 'B' },
      { id: 2, x: 250, y: 200, label: 'C' },
      { id: 3, x: 100, y: 200, label: 'D' }
    ];
    
    const sampleEdges: Edge[] = [
      { from: 0, to: 1, weight: 5 },
      { from: 1, to: 2, weight: 3 },
      { from: 2, to: 3, weight: 1 },
      { from: 0, to: 3, weight: 10 }
    ];

    setNodes(sampleNodes);
    setEdges(sampleEdges);
    updateGraphFromVisual(sampleNodes, sampleEdges);
    setResult(null);
    setAnimationStep(-1);
    saveToHistory(sampleNodes, sampleEdges);
  };

  const nextStep = () => {
    if (result && animationStep < result.steps.length - 1) {
      setAnimationStep(animationStep + 1);
    }
  };

  const prevStep = () => {
    if (animationStep > 0) {
      setAnimationStep(animationStep - 1);
    }
  };

  const resetAnimation = () => {
    setAnimationStep(0);
  };

  const resizeGraph = (newSize: number) => {
    const newGraph = Array(newSize).fill(null).map((_, i) => 
      Array(newSize).fill(null).map((_, j) => 
        i === j ? 0 : 
        (i < graph.length && j < graph[0].length) ? graph[i][j] : Infinity
      )
    );
    setGraph(newGraph);
    setNumVertices(newSize);
    
    // Update visual nodes
    const newNodes = Array(newSize).fill(null).map((_, i) => ({
      id: i,
      x: 100 + (i % 3) * 100,
      y: 100 + Math.floor(i / 3) * 100,
      label: String.fromCharCode(65 + i)
    }));
    setNodes(newNodes);
    setEdges([]);
  };

  const generateRandomGraph = () => {
    const size = numVertices;
    const newGraph = Array(size).fill(null).map((_, i) => 
      Array(size).fill(null).map((_, j) => {
        if (i === j) return 0;
        if (Math.random() < 0.3) return Infinity; // 30% chance of no edge
        return Math.floor(Math.random() * 15) + 1; // 1-15 weight
      })
    );
    setGraph(newGraph);
    
    // Update visual representation
    const newEdges: Edge[] = [];
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (i !== j && newGraph[i][j] !== Infinity) {
          newEdges.push({ from: i, to: j, weight: newGraph[i][j] });
        }
      }
    }
    setEdges(newEdges);
  };

  const formatValue = (value: number) => {
    return value === Infinity ? '∞' : value.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Floyd-Warshall Algorithm <span className="text-indigo-600">(All-Pairs Shortest Path)</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find shortest paths between all pairs of vertices using dynamic programming
          </p>
        </div>

        <EducationalInfo
          topic="Floyd-Warshall Algorithm"
          description="Floyd-Warshall finds the shortest paths between all pairs of vertices in a weighted graph, handling both positive and negative edge weights (but no negative cycles)."
          theory={{
            definition: "A dynamic programming algorithm that computes shortest paths between all pairs of vertices by considering each vertex as an intermediate point.",
            keyPoints: [
              "Works with both positive and negative edge weights",
              "Detects negative cycles in the graph",
              "Time complexity O(V³) where V is number of vertices",
              "Space complexity O(V²) for distance matrix",
              "Uses dynamic programming approach with intermediate vertices"
            ],
            applications: [
              "Network routing and traffic engineering",
              "Game AI pathfinding in grid-based games",
              "Social network analysis for connectivity",
              "Transportation and logistics optimization"
            ]
          }}
          university={{
            syllabus: [
              "Floyd-Warshall algorithm implementation",
              "All-pairs shortest path problem",
              "Dynamic programming approach",
              "Negative cycle detection",
              "Time and space complexity analysis"
            ],
            marks: "10-12 marks",
            commonQuestions: [
              "Implement Floyd-Warshall algorithm",
              "Find shortest paths between all vertex pairs",
              "Show step-by-step matrix updates",
              "Detect negative cycles in graph"
            ],
            examTips: [
              "Draw the initial distance matrix clearly",
              "Show intermediate matrices for each k iteration",
              "Label vertices properly (0 to n-1 or A to N)",
              "Mark when distances get updated in each step"
            ]
          }}
          algorithm={{
            steps: [
              "Initialize distance matrix D⁰ with edge weights",
              "For k = 0 to n-1 (intermediate vertices)",
              "  For i = 0 to n-1 (source vertices)",
              "    For j = 0 to n-1 (destination vertices)",
              "      D^k[i][j] = min(D^(k-1)[i][j], D^(k-1)[i][k] + D^(k-1)[k][j])",
              "Final matrix D^n contains all shortest paths"
            ],
            complexity: {
              time: "O(V³) where V is the number of vertices",
              space: "O(V²) for the distance matrix"
            }
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Graph Drawing Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Draw Your Graph</h2>
            
            <div className="space-y-4 mb-4">
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setIsDrawingMode(isDrawingMode === 'node' ? 'none' : 'node')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    isDrawingMode === 'node' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Add Node
                </button>
                
                <button
                  onClick={() => setIsDrawingMode(isDrawingMode === 'edge' ? 'none' : 'edge')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    isDrawingMode === 'edge' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Add Edge
                </button>

                <button
                  onClick={() => setIsDrawingMode(isDrawingMode === 'delete' ? 'none' : 'delete')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    isDrawingMode === 'delete' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Delete
                </button>
                
                {isDrawingMode === 'edge' && (
                  <input
                    type="number"
                    value={edgeWeight}
                    onChange={(e) => setEdgeWeight(e.target.value)}
                    placeholder="Weight"
                    className="px-3 py-2 border border-gray-300 rounded-lg w-20 text-center"
                  />
                )}
              </div>

              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={clearGraph}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Clear Graph
                </button>
                
                <button
                  onClick={loadSampleGraph}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Load Sample
                </button>

                <button
                  onClick={undo}
                  disabled={historyIndex <= 0}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:bg-gray-400"
                >
                  ↶ Undo
                </button>

                <button
                  onClick={redo}
                  disabled={historyIndex >= history.length - 1}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:bg-gray-400"
                >
                  ↷ Redo
                </button>
              </div>

              <button
                onClick={handleSolve}
                disabled={nodes.length === 0}
                className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold disabled:bg-gray-400"
              >
                Run Floyd-Warshall Algorithm
              </button>
            </div>

            <div className="border border-gray-300 rounded-lg bg-gray-50">
              <svg
                width={500}
                height={300}
                className={`border rounded-lg bg-gray-50 ${
                  isDragging ? 'cursor-grabbing' : 'cursor-grab'
                }`}
                onMouseDown={handleSvgMouseDown}
                onMouseMove={handleSvgMouseMove}
                onMouseUp={handleSvgMouseUp}
                onMouseLeave={handleSvgMouseLeave}
                style={{ userSelect: 'none' }}
              >
                {/* Define arrowhead markers for directed graphs */}
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
                      fill="#6b7280"
                    />
                  </marker>
                  <marker
                    id="arrowhead-highlighted"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon
                      points="0 0, 10 3.5, 0 7"
                      fill="#059669"
                    />
                  </marker>
                </defs>

                {/* Draw edges */}
                {edges.map((edge, index) => {
                  const fromNode = nodes.find(n => n.id === edge.from);
                  const toNode = nodes.find(n => n.id === edge.to);
                  
                  if (!fromNode || !toNode) return null;
                  
                  // Highlight edge if it's in the current step path
                  let strokeColor = '#6b7280';
                  let strokeWidth = 2;
                  let isHighlighted = false;
                  
                  if (result && animationStep >= 0 && result.steps[animationStep]) {
                    const step = result.steps[animationStep];
                    // Check if this edge is being considered in current step
                    if (step.highlightedPaths && step.highlightedPaths.some((path: any) => 
                      path.includes(edge.from) && path.includes(edge.to)
                    )) {
                      strokeColor = '#059669';
                      strokeWidth = 3;
                      isHighlighted = true;
                    }
                  }

                  // Calculate arrow position for directed graphs
                  const dx = toNode.x - fromNode.x;
                  const dy = toNode.y - fromNode.y;
                  const length = Math.sqrt(dx * dx + dy * dy);
                  const unitX = dx / length;
                  const unitY = dy / length;
                  
                  // Adjust end point to stop at node border (radius 20)
                  const endX = toNode.x - unitX * 20;
                  const endY = toNode.y - unitY * 20;
                  
                  return (
                    <g key={`edge-${index}`}>
                      <line
                        x1={fromNode.x}
                        y1={fromNode.y}
                        x2={endX}
                        y2={endY}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        markerEnd={isHighlighted ? 'url(#arrowhead-highlighted)' : 'url(#arrowhead)'}
                        style={{ pointerEvents: 'none' }}
                      />
                      
                      {/* Draw weight */}
                      <text
                        x={(fromNode.x + toNode.x) / 2}
                        y={(fromNode.y + toNode.y) / 2 - 5}
                        textAnchor="middle"
                        fill="#1f2937"
                        fontSize="14"
                        fontWeight="bold"
                        style={{ pointerEvents: 'none' }}
                      >
                        {edge.weight}
                      </text>
                    </g>
                  );
                })}
                
                {/* Draw nodes */}
                {nodes.map(node => {
                  // Node colors based on algorithm state
                  let fillColor = '#e5e7eb';
                  
                  if (result && animationStep >= 0 && result.steps[animationStep]) {
                    const step = result.steps[animationStep];
                    if (step.currentK === node.id) {
                      fillColor = '#f59e0b'; // Current intermediate vertex - orange
                    } else if (step.highlightedNodes && step.highlightedNodes.includes(node.id)) {
                      fillColor = '#059669'; // Highlighted in current step - green
                    } else {
                      fillColor = '#e5e7eb'; // Default - gray
                    }
                  } else {
                    // Add special highlighting for edge creation mode
                    if (isDrawingMode === 'edge' && edgeStart === node.id) {
                      fillColor = '#fbbf24'; // Selected for edge creation - yellow
                    } else if (selectedNode === node.id) {
                      fillColor = '#3b82f6'; // Selected - blue
                    } else {
                      fillColor = '#e5e7eb'; // Default - gray
                    }
                  }
                  
                  return (
                    <g key={`node-${node.id}`}>
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={20}
                        fill={fillColor}
                        stroke="#374151"
                        strokeWidth={2}
                        style={{ cursor: 'grab' }}
                        onMouseDown={(e) => handleNodeMouseDown(node.id, e)}
                        onClick={(e) => {
                          console.log('🖱️ CIRCLE CLICKED:', node.id);
                          handleNodeClick(node.id, e);
                        }}
                      />
                      <text
                        x={node.x}
                        y={node.y + 5}
                        textAnchor="middle"
                        fill="#1f2937"
                        fontSize="16"
                        fontWeight="bold"
                        style={{ pointerEvents: 'none' }}
                      >
                        {node.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              <p><strong>Instructions:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Click &quot;Add Node&quot; then click on canvas to add vertices</li>
                <li><strong>Add Edge:</strong> Click &quot;Add Edge&quot;, set weight, then click two nodes to connect them</li>
                <li>Directed edges have arrows showing direction (from first node to second)</li>
                <li>The first node will turn yellow when selected, then click the second node</li>
                <li>Click &quot;Delete&quot; then click nodes to remove them (can be undone)</li>
                <li>Drag nodes to move them around (not available in edge mode)</li>
                <li>Use Undo/Redo to restore accidentally deleted items</li>
                <li>Floyd-Warshall works on directed graphs with all-pairs shortest paths</li>
              </ul>
              {isDrawingMode === 'edge' && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-yellow-800 font-medium">
                    🎯 Edge Creation Mode (Directed): {edgeStart !== null ? 
                      `First node selected (${nodes.find(n => n.id === edgeStart)?.label}). Now click a second node to create a directed edge.` : 
                      'Click a node to start creating an edge.'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Algorithm Results */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Algorithm Results</h2>
            
            {result ? (
              <div className="space-y-4">
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={prevStep}
                    disabled={animationStep <= 0}
                    className="px-3 py-1 bg-gray-500 text-white rounded disabled:bg-gray-300"
                  >
                    ← Prev
                  </button>
                  
                  <button
                    onClick={resetAnimation}
                    className="px-3 py-1 bg-indigo-500 text-white rounded"
                  >
                    Reset
                  </button>
                  
                  <button
                    onClick={nextStep}
                    disabled={!result || animationStep >= result.steps.length - 1}
                    className="px-3 py-1 bg-gray-500 text-white rounded disabled:bg-gray-300"
                  >
                    Next →
                  </button>
                  
                  <span className="px-3 py-1 bg-gray-100 rounded text-sm">
                    Step {animationStep + 1} / {result.steps.length}
                  </span>
                </div>

                {/* Current Step Info */}
                {animationStep >= 0 && result.steps[animationStep] && (
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-indigo-800 mb-2">
                      Step {result.steps[animationStep].stepNumber}: {result.steps[animationStep].description}
                    </h3>
                    <div className="text-sm text-indigo-700">
                      <p><strong>Current k (intermediate vertex):</strong> {result.steps[animationStep].currentK !== undefined && result.steps[animationStep].currentK >= 0 ? nodes.find(n => n.id === result.steps[animationStep].currentK)?.label : 'None'}</p>
                      <p><strong>Action:</strong> {result.steps[animationStep].action}</p>
                    </div>
                  </div>
                )}

                {/* Matrix Division Visualization */}
                {animationStep >= 0 && result.steps[animationStep] && result.steps[animationStep].matrixSections && (
                  <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-300">
                    <h3 className="font-bold text-gray-800 mb-3 text-lg">Matrix Division Visualization</h3>
                    <div className="text-sm text-gray-600 mb-3">
                      Matrix divided around vertex {nodes.find(n => n.id === result.steps[animationStep].currentK)?.label}:
                    </div>
                    <div className="grid grid-cols-3 gap-2 max-w-md">
                      {/* Top Left */}
                      <div className="border border-green-400 bg-green-50 p-2 rounded">
                        <div className="text-xs font-bold text-green-700 mb-1">Top-Left</div>
                        <div className="text-xs space-y-1">
                          {result.steps[animationStep].matrixSections!.topLeft.map((row, i) => (
                            <div key={i} className="flex space-x-1">
                              {row.map((cell, j) => (
                                <span key={j} className="w-6 text-center">{cell === Infinity ? '∞' : cell}</span>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Top K Column */}
                      <div className="border border-blue-400 bg-blue-50 p-2 rounded">
                        <div className="text-xs font-bold text-blue-700 mb-1">K-Column</div>
                        <div className="text-xs space-y-1">
                          {result.steps[animationStep].matrixSections!.topRight.map((row, i) => (
                            <div key={i} className="flex justify-center">
                              <span className="w-6 text-center">{result.steps[animationStep].matrixSections!.kCol[i] === Infinity ? '∞' : result.steps[animationStep].matrixSections!.kCol[i]}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Top Right */}
                      <div className="border border-green-400 bg-green-50 p-2 rounded">
                        <div className="text-xs font-bold text-green-700 mb-1">Top-Right</div>
                        <div className="text-xs space-y-1">
                          {result.steps[animationStep].matrixSections!.topRight.map((row, i) => (
                            <div key={i} className="flex space-x-1">
                              {row.map((cell, j) => (
                                <span key={j} className="w-6 text-center">{cell === Infinity ? '∞' : cell}</span>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* K Row */}
                      <div className="border border-blue-400 bg-blue-50 p-2 rounded col-span-3">
                        <div className="text-xs font-bold text-blue-700 mb-1">K-Row</div>
                        <div className="text-xs flex space-x-1 justify-center">
                          {result.steps[animationStep].matrixSections!.kRow.map((cell, j) => (
                            <span key={j} className="w-6 text-center">{cell === Infinity ? '∞' : cell}</span>
                          ))}
                        </div>
                      </div>
                      
                      {/* Bottom Left */}
                      <div className="border border-green-400 bg-green-50 p-2 rounded">
                        <div className="text-xs font-bold text-green-700 mb-1">Bottom-Left</div>
                        <div className="text-xs space-y-1">
                          {result.steps[animationStep].matrixSections!.bottomLeft.map((row, i) => (
                            <div key={i} className="flex space-x-1">
                              {row.map((cell, j) => (
                                <span key={j} className="w-6 text-center">{cell === Infinity ? '∞' : cell}</span>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Empty space for K vertex */}
                      <div className="border border-yellow-400 bg-yellow-50 p-2 rounded flex items-center justify-center">
                        <div className="text-xs font-bold text-yellow-700">
                          K = {nodes.find(n => n.id === result.steps[animationStep].currentK)?.label}
                        </div>
                      </div>
                      
                      {/* Bottom Right */}
                      <div className="border border-green-400 bg-green-50 p-2 rounded">
                        <div className="text-xs font-bold text-green-700 mb-1">Bottom-Right</div>
                        <div className="text-xs space-y-1">
                          {result.steps[animationStep].matrixSections!.bottomRight.map((row, i) => (
                            <div key={i} className="flex space-x-1">
                              {row.map((cell, j) => (
                                <span key={j} className="w-6 text-center">{cell === Infinity ? '∞' : cell}</span>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-gray-600">
                      <p><strong>Algorithm:</strong> For each cell in green sections, check if path through vertex {nodes.find(n => n.id === result.steps[animationStep].currentK)?.label} is shorter</p>
                      <p><strong>Formula:</strong> D[i][j] = min(D[i][j], D[i][k] + D[k][j])</p>
                    </div>
                  </div>
                )}

                {/* Distance Matrix */}
                <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-300">
                  <h3 className="font-bold text-gray-800 mb-3 text-lg">
                    Distance Matrix D^{animationStep >= 0 && result.steps[animationStep] ? result.steps[animationStep].stepNumber : 0}
                    {animationStep >= 0 && result.steps[animationStep] && result.steps[animationStep].currentK >= 0 && (
                      <span className="text-indigo-600"> (k = {nodes.find(n => n.id === result.steps[animationStep].currentK)?.label})</span>
                    )}
                  </h3>
                  <div className="overflow-x-auto bg-white rounded border">
                    {result.steps[animationStep] && result.steps[animationStep].matrix ? (
                      <table className="w-full border-collapse text-sm">
                        <thead>
                          <tr className="bg-indigo-600 text-white">
                            <th className="border border-gray-400 px-3 py-2 font-bold">From/To</th>
                            {nodes.map(node => (
                              <th key={node.id} className={`border border-gray-400 px-3 py-2 font-bold ${
                                result.steps[animationStep].currentK === node.id ? 'bg-yellow-500' : ''
                              }`}>
                                {node.label}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {result.steps[animationStep].matrix.map((row: number[], i: number) => (
                            <tr key={i} className="border-b border-gray-300">
                              <td className={`border border-gray-400 px-3 py-2 font-bold text-center text-indigo-700 ${
                                result.steps[animationStep].currentK === i ? 'bg-yellow-200' : 'bg-indigo-50'
                              }`}>
                                {nodes[i]?.label}
                              </td>
                              {row.map((cell: number, j: number) => {
                                let cellClass = "border border-gray-400 px-3 py-2 text-center font-bold";
                                
                                // Highlight current k row and column
                                if (result.steps[animationStep].currentK === i || result.steps[animationStep].currentK === j) {
                                  cellClass += " bg-yellow-100 border-yellow-400";
                                }
                                
                                // Highlight cells being updated
                                if (result.steps[animationStep].updatedCells && 
                                    result.steps[animationStep].updatedCells.some((update: any) => 
                                      update.i === i && update.j === j)) {
                                  cellClass += " bg-green-200 text-green-800 border-green-400";
                                } else if (cell === Infinity) {
                                  cellClass += " text-gray-400";
                                } else if (i === j) {
                                  cellClass += " bg-blue-100 text-blue-800";
                                } else {
                                  cellClass += " text-gray-700";
                                }
                                
                                return (
                                  <td key={j} className={cellClass}>
                                    {cell === Infinity ? '∞' : cell}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="text-gray-500 text-center py-4">No matrix data available for this step</p>
                    )}
                  </div>
                  
                  {/* Show updates made in this step */}
                  {animationStep >= 0 && result.steps[animationStep] && result.steps[animationStep].updatedCells && result.steps[animationStep].updatedCells.length > 0 && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                      <h4 className="font-semibold text-green-800 mb-2">Updates in this step:</h4>
                      <div className="text-sm space-y-1">
                        {result.steps[animationStep].updatedCells.map((update: any, idx: number) => (
                          <div key={idx} className="text-green-700">
                            D[{nodes[update.i]?.label}][{nodes[update.j]?.label}]: {update.oldValue === Infinity ? '∞' : update.oldValue} → {update.newValue} 
                            <span className="text-gray-600 ml-2">
                              (via {nodes[result.steps[animationStep].currentK]?.label}: {result.steps[animationStep].matrix[update.i][result.steps[animationStep].currentK]} + {result.steps[animationStep].matrix[result.steps[animationStep].currentK][update.j]} = {update.newValue})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Final Results */}
                {animationStep === result.steps.length - 1 && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-3">All-Pairs Shortest Paths</h3>
                    <div className="space-y-2 text-sm">
                      {nodes.map(fromNode => (
                        <div key={fromNode.id}>
                          <strong>From {fromNode.label}:</strong>
                          <div className="ml-4 space-y-1">
                            {nodes.map(toNode => {
                              if (fromNode.id === toNode.id) return null;
                              const finalMatrix = result.steps[result.steps.length - 1].matrix;
                              const distance = finalMatrix[fromNode.id][toNode.id];
                              return (
                                <div key={toNode.id} className="flex justify-between">
                                  <span>To {toNode.label}:</span>
                                  <span className="font-mono font-bold">
                                    {distance === Infinity ? 'No path (∞)' : `Distance: ${distance}`}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <div className="text-4xl mb-4">🔗</div>
                <p>Draw a graph and click &quot;Run Floyd-Warshall Algorithm&quot; to see all-pairs shortest paths</p>
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="space-y-8">
            {/* Distance Matrix Results */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">All-Pairs Shortest Distance Matrix</h2>
              
              {result.hasNegativeCycle && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  <strong>Warning:</strong> Negative cycle detected in the graph!
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border-2 border-gray-800">
                  <thead>
                    <tr className="bg-indigo-600 text-white">
                      <th className="border-2 border-gray-800 px-4 py-3 font-bold">From \ To</th>
                      {nodes.map((_, j) => (
                        <th key={j} className="border-2 border-gray-800 px-4 py-3 font-bold">
                          {nodes[j]?.label || String.fromCharCode(65 + j)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.distances.map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="border-2 border-gray-800 px-4 py-3 bg-indigo-100 font-bold text-indigo-800">
                          {nodes[i]?.label || String.fromCharCode(65 + i)}
                        </td>
                        {row.map((distance, j) => (
                          <td 
                            key={j} 
                            className={`border-2 border-gray-800 px-4 py-3 text-center font-semibold ${
                              i === j ? 'bg-green-100 text-green-800' : 
                              distance === Infinity ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-blue-800'
                            }`}
                          >
                            {distance === Infinity ? '∞' : distance}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Step-by-step execution */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Step-by-Step Execution</h2>
              <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                <div className="space-y-2">
                  {result.steps.map((step, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded border-2 shadow-sm transition-colors ${
                        animationStep === index 
                          ? 'bg-indigo-100 border-indigo-400' 
                          : 'bg-white border-gray-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className={`rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 ${
                          animationStep === index 
                            ? 'bg-indigo-600 text-white' 
                            : step.isInitial 
                              ? 'bg-green-600 text-white'
                              : step.isFinal
                                ? 'bg-red-600 text-white'
                                : 'bg-gray-600 text-white'
                        }`}>
                          {step.stepNumber}
                        </span>
                        <div className="flex-1">
                          <div className="text-gray-800 font-medium">{step.description}</div>
                          <div className="text-gray-600 text-sm mt-1">{step.action}</div>
                          {step.updatedCells && step.updatedCells.length > 0 && (
                            <div className="text-green-700 text-xs mt-1">
                              {step.updatedCells.length} cell(s) updated
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {result && (
          <ExamResult
            title="Floyd-Warshall Algorithm Analysis"
            input={`Graph with ${nodes.length} vertices`}
            result={!result.hasNegativeCycle}
            steps={result.steps.slice(0, 15).map((step, index) => ({
              stepNumber: index + 1,
              description: step.description,
              currentState: `Matrix update iteration ${index + 1}`,
              explanation: step.action
            }))}
            finalAnswer={result.hasNegativeCycle ? 
              "Negative cycle detected - no solution exists" :
              `All-pairs shortest distances computed successfully`}
            examFormat={{
              question: `Apply Floyd-Warshall algorithm to find all-pairs shortest paths.`,
              solution: [
                `Floyd-Warshall Algorithm Execution:`,
                `Graph: ${nodes.length} vertices`,
                `Initial adjacency matrix with edge weights`,
                ...result.steps.slice(0, 10).map(step => step.description),
                result.hasNegativeCycle ? 
                  `Result: Negative cycle detected` :
                  `Result: All-pairs shortest distances computed`
              ],
              conclusion: result.hasNegativeCycle ?
                `The graph contains a negative cycle, making shortest paths undefined.` :
                `Floyd-Warshall successfully computed shortest paths between all pairs of vertices.`,
              marks: 8
            }}
          />
        )}
      </div>
    </div>
  );
}
