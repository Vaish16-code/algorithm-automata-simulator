"use client";

import React, { useState, useEffect } from "react";
import { bellmanFordAlgorithm, BellmanFordResult } from "../../../utils/dynamicProgramming";
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

export default function BellmanFordPage() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [sourceNode, setSourceNode] = useState<number>(0);
  const [isDrawingMode, setIsDrawingMode] = useState<'node' | 'edge' | 'delete' | 'none'>('none');
  const [edgeStart, setEdgeStart] = useState<number | null>(null);
  const [edgeWeight, setEdgeWeight] = useState<string>('1');
  const [result, setResult] = useState<BellmanFordResult | null>(null);
  const [animationStep, setAnimationStep] = useState<number>(-1);
  
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
      { id: 0, x: 100, y: 150, label: 'A' },
      { id: 1, x: 200, y: 100, label: 'B' },
      { id: 2, x: 300, y: 150, label: 'C' },
      { id: 3, x: 200, y: 200, label: 'D' },
      { id: 4, x: 400, y: 100, label: 'E' }
    ];
    
    const sampleEdges: Edge[] = [
      { from: 0, to: 1, weight: 4 },
      { from: 0, to: 3, weight: 2 },
      { from: 1, to: 2, weight: 3 },
      { from: 1, to: 3, weight: -2 },
      { from: 2, to: 4, weight: 2 },
      { from: 3, to: 4, weight: 5 }
    ];

    setNodes(sampleNodes);
    setEdges(sampleEdges);
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
      setHistoryIndex(historyIndex - 1);
      setResult(null);
      setAnimationStep(-1);
      // Update source node if it no longer exists
      if (!prevState.nodes.find(n => n.id === sourceNode)) {
        setSourceNode(prevState.nodes.length > 0 ? prevState.nodes[0].id : 0);
      }
    }
  };

  // Redo function
  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
      setHistoryIndex(historyIndex + 1);
      setResult(null);
      setAnimationStep(-1);
      // Update source node if it no longer exists
      if (!nextState.nodes.find(n => n.id === sourceNode)) {
        setSourceNode(nextState.nodes.length > 0 ? nextState.nodes[0].id : 0);
      }
    }
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
      event.preventDefault();
    }
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

  // SVG mouse up handler
  const handleSvgMouseUp = (event: React.MouseEvent<SVGSVGElement>) => {
    console.log('SVG mouse up - isDragging:', isDragging, 'dragStarted:', dragStarted, 'mode:', isDrawingMode);
    
    if (isDragging) {
      setIsDragging(false);
      if (dragStarted) {
        saveToHistory(nodes, edges);
        setDragStarted(false);
        setSelectedNode(null);
        return;
      }
      setSelectedNode(null);
    }

    // If not dragging, handle as regular click for adding nodes
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
          saveToHistory(nodes, newEdges);
          console.log('✅ Edge created:', edgeStart, 'to', nodeId, 'weight:', weight);
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
      saveToHistory(renumberedNodes, renumberedEdges);
      
      // Update source node if deleted
      if (sourceNode === nodeId) {
        setSourceNode(renumberedNodes.length > 0 ? renumberedNodes[0].id : 0);
      } else if (sourceNode > nodeId) {
        setSourceNode(sourceNode - 1);
      }
      
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
      saveToHistory(newNodes, edges);
    } else if (isDrawingMode === 'edge') {
      // Reset edge start if clicking on empty space
      setEdgeStart(null);
    } else {
      // Select nothing if clicking on empty space
      setSelectedNode(null);
    }
  };

  const runBellmanFord = () => {
    if (nodes.length === 0) return;

    const bellmanFordResult = bellmanFordAlgorithm(edges, nodes.length, sourceNode);
    setResult(bellmanFordResult);
    setAnimationStep(0);
  };

  const clearGraph = () => {
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    setNodes(newNodes);
    setEdges(newEdges);
    setResult(null);
    setAnimationStep(-1);
    setSelectedNode(null);
    setEdgeStart(null);
    setSourceNode(0);
    saveToHistory(newNodes, newEdges);
  };

  const loadSampleGraph = () => {
    const sampleNodes: Node[] = [
      { id: 0, x: 100, y: 150, label: 'A' },
      { id: 1, x: 200, y: 100, label: 'B' },
      { id: 2, x: 300, y: 150, label: 'C' },
      { id: 3, x: 200, y: 200, label: 'D' },
      { id: 4, x: 400, y: 100, label: 'E' }
    ];
    
    const sampleEdges: Edge[] = [
      { from: 0, to: 1, weight: 4 },
      { from: 0, to: 3, weight: 2 },
      { from: 1, to: 2, weight: 3 },
      { from: 1, to: 3, weight: -2 },
      { from: 2, to: 4, weight: 2 },
      { from: 3, to: 4, weight: 5 }
    ];

    setNodes(sampleNodes);
    setEdges(sampleEdges);
    setResult(null);
    setAnimationStep(-1);
    setSourceNode(0);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Bellman-Ford Algorithm <span className="text-purple-600">(Dynamic Programming)</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find shortest paths from a source vertex with negative edge weights and detect negative cycles
          </p>
        </div>

        <EducationalInfo
          topic="Bellman-Ford Single Source Shortest Path Algorithm"
          description="The Bellman-Ford algorithm finds shortest paths from a source vertex to all other vertices in a weighted directed graph. It can handle negative edge weights and detect negative cycles."
          theory={{
            definition: "A dynamic programming algorithm that computes shortest paths from a single source vertex to all other vertices in a weighted directed graph, even with negative edge weights.",
            keyPoints: [
              "Can handle negative edge weights (unlike Dijkstra)",
              "Detects negative weight cycles",
              "Uses dynamic programming approach with relaxation",
              "Runs in O(VE) time complexity"
            ],
            applications: [
              "Network routing with cost considerations",
              "Currency arbitrage detection",
              "Game theory and economics",
              "Distance vector routing protocols"
            ]
          }}
          university={{
            syllabus: [
              "Bellman-Ford algorithm implementation",
              "Negative cycle detection",
              "Single source shortest path problem",
              "Dynamic programming approach",
              "Comparison with Dijkstra's algorithm"
            ],
            marks: "8-10 marks",
            commonQuestions: [
              "Implement Bellman-Ford algorithm",
              "Detect negative cycles in graph",
              "Find shortest paths with negative edges",
              "Compare with Dijkstra's algorithm"
            ],
            examTips: [
              "Show V-1 iterations of edge relaxation",
              "Check for negative cycles in Vth iteration",
              "Maintain distance and predecessor arrays",
              "Show step-by-step relaxation process"
            ]
          }}
          algorithm={{
            steps: [
              "Initialize distances: source = 0, others = ∞",
              "Repeat V-1 times: relax all edges",
              "For each edge (u,v): if dist[u] + weight < dist[v], update dist[v]",
              "Check for negative cycles: run one more iteration",
              "If any distance can be reduced, negative cycle exists",
              "Return shortest distances and cycle detection result"
            ],
            complexity: {
              time: "O(VE) where V is vertices and E is edges",
              space: "O(V) for distance and predecessor arrays"
            }
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Graph Drawing Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Draw Your Graph</h2>
            
            <div className="space-y-4 mb-4">
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setIsDrawingMode(isDrawingMode === 'node' ? 'none' : 'node')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    isDrawingMode === 'node' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Add Node
                </button>
                
                <button
                  onClick={() => setIsDrawingMode(isDrawingMode === 'edge' ? 'none' : 'edge')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    isDrawingMode === 'edge' 
                      ? 'bg-purple-600 text-white' 
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source Node
                </label>
                <select
                  value={sourceNode}
                  onChange={(e) => setSourceNode(parseInt(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  {nodes.map(node => (
                    <option key={node.id} value={node.id}>
                      {node.label} (Node {node.id})
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={runBellmanFord}
                disabled={nodes.length === 0}
                className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold disabled:bg-gray-400"
              >
                Run Bellman-Ford Algorithm
              </button>
            </div>

            <div className="border border-gray-300 rounded-lg bg-gray-50">
              <svg
                width={500}
                height={300}
                className={`border rounded-lg bg-gray-50 ${
                  isDragging ? 'cursor-grabbing' : 'cursor-grab'
                }`}
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
                    id="arrowhead-negative"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon
                      points="0 0, 10 3.5, 0 7"
                      fill="#dc2626"
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
                      fill="#ef4444"
                    />
                  </marker>
                </defs>

                {/* Draw edges */}
                {edges.map((edge, index) => {
                  const fromNode = nodes.find(n => n.id === edge.from);
                  const toNode = nodes.find(n => n.id === edge.to);
                  
                  if (!fromNode || !toNode) return null;
                  
                  // Highlight edge if it's being relaxed
                  let strokeColor = edge.weight < 0 ? '#dc2626' : '#6b7280';
                  let strokeWidth = 2;
                  let markerEnd = edge.weight < 0 ? 'url(#arrowhead-negative)' : 'url(#arrowhead)';
                  
                  if (result && animationStep >= 0 && result.steps[animationStep]) {
                    const step = result.steps[animationStep];
                    if (step.edgeBeingRelaxed && 
                        step.edgeBeingRelaxed.from === edge.from && 
                        step.edgeBeingRelaxed.to === edge.to) {
                      strokeColor = '#ef4444';
                      strokeWidth = 4;
                      markerEnd = 'url(#arrowhead-highlighted)';
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
                        markerEnd={markerEnd}
                        style={{ pointerEvents: 'none' }}
                      />
                      
                      {/* Draw weight */}
                      <text
                        x={(fromNode.x + toNode.x) / 2}
                        y={(fromNode.y + toNode.y) / 2 - 5}
                        textAnchor="middle"
                        fill={edge.weight < 0 ? '#dc2626' : '#1f2937'}
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
                  // Node colors based on algorithm state and selection
                  let fillColor = '#e5e7eb'; // Default - gray
                  
                  if (node.id === sourceNode) {
                    fillColor = '#ef4444'; // Source - red
                  } else if (isDrawingMode === 'edge' && edgeStart === node.id) {
                    fillColor = '#fbbf24'; // Selected for edge creation - yellow
                  } else if (selectedNode === node.id) {
                    fillColor = '#3b82f6'; // Selected - blue
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
                      
                      {/* Draw distance if algorithm is running */}
                      {result && animationStep >= 0 && result.steps[animationStep] && (
                        <text
                          x={node.x}
                          y={node.y - 30}
                          textAnchor="middle"
                          fill={result.steps[animationStep].distances[node.id] !== Infinity ? '#dc2626' : '#6b7280'}
                          fontSize="12"
                          fontWeight="bold"
                          style={{ pointerEvents: 'none' }}
                        >
                          {result.steps[animationStep].distances[node.id] === Infinity ? '∞' : result.steps[animationStep].distances[node.id]}
                        </text>
                      )}
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
                <li>Negative weights are allowed and shown in red</li>
                <li>Drag nodes to move them around (not available in edge mode)</li>
                <li>Click &quot;Delete&quot; then click nodes to remove them (can be undone)</li>
                <li>Use Undo/Redo to restore accidentally deleted items</li>
                <li>Select source node and run the algorithm to find shortest paths</li>
                <li>Red source node shows where shortest path calculation starts</li>
              </ul>
              {isDrawingMode === 'edge' && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-yellow-800 font-medium">
                    🎯 Edge Creation Mode: {edgeStart !== null ? 
                      `First node selected (${nodes.find(n => n.id === edgeStart)?.label}). Now click a second node to create a directed edge.` : 
                      'Click a node to start creating an edge.'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Algorithm Results */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Algorithm Results</h2>
            
            {result ? (
              <div className="space-y-4">
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={prevStep}
                    disabled={animationStep <= 0}
                    className="px-3 py-1 bg-purple-500 text-white rounded disabled:bg-gray-300"
                  >
                    ← Prev
                  </button>
                  
                  <button
                    onClick={resetAnimation}
                    className="px-3 py-1 bg-purple-600 text-white rounded"
                  >
                    Reset
                  </button>
                  
                  <button
                    onClick={nextStep}
                    disabled={!result || animationStep >= result.steps.length - 1}
                    className="px-3 py-1 bg-purple-500 text-white rounded disabled:bg-gray-300"
                  >
                    Next →
                  </button>
                  
                  <span className="px-3 py-1 bg-gray-100 rounded text-sm">
                    Step {animationStep + 1} / {result.steps.length}
                  </span>
                </div>

                {/* Current Step Info */}
                {animationStep >= 0 && result.steps[animationStep] && (
                  <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-300">
                    <h3 className="font-bold text-purple-800 mb-2 text-lg">
                      Iteration {result.steps[animationStep].iteration}: {result.steps[animationStep].description}
                    </h3>
                    <div className="text-sm text-purple-700 font-medium">
                      <p><strong>Action:</strong> {result.steps[animationStep].action}</p>
                      {result.steps[animationStep].edgeBeingRelaxed && (
                        <p><strong>Edge:</strong> {nodes.find(n => n.id === result.steps[animationStep].edgeBeingRelaxed?.from)?.label} → {nodes.find(n => n.id === result.steps[animationStep].edgeBeingRelaxed?.to)?.label} (weight: {result.steps[animationStep].edgeBeingRelaxed?.weight})</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Distance Table */}
                <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-300">
                  <h3 className="font-bold text-gray-800 mb-3 text-lg">Distance Table</h3>
                  <div className="overflow-x-auto bg-white rounded border">
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="bg-purple-600 text-white">
                          <th className="border border-gray-400 px-3 py-2 font-bold">Node</th>
                          <th className="border border-gray-400 px-3 py-2 font-bold">Distance</th>
                          <th className="border border-gray-400 px-3 py-2 font-bold">Previous</th>
                        </tr>
                      </thead>
                      <tbody>
                        {nodes.map(node => {
                          const step = animationStep >= 0 ? result.steps[animationStep] : result.steps[result.steps.length - 1];
                          const distance = step.distances[node.id];
                          const previous = step.previous ? step.previous[node.id] : null;
                          
                          return (
                            <tr key={node.id} className={`${
                              node.id === sourceNode ? 'bg-red-100 font-bold' : 'bg-white'
                            } border-b border-gray-300`}>
                              <td className="border border-gray-400 px-3 py-2 font-bold text-center text-purple-700">
                                {node.label}
                              </td>
                              <td className="border border-gray-400 px-3 py-2 text-center font-bold text-red-600">
                                {distance === Infinity ? '∞' : distance}
                              </td>
                              <td className="border border-gray-400 px-3 py-2 text-center font-bold text-blue-600">
                                {previous !== null && previous !== undefined ? 
                                  nodes.find(n => n.id === previous)?.label || '-' : '-'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Negative Cycle Detection */}
                {result.hasNegativeCycle && (
                  <div className="bg-red-50 p-4 rounded-lg border-2 border-red-300">
                    <h3 className="font-bold text-red-800 mb-2 text-lg">⚠️ Negative Cycle Detected!</h3>
                    <p className="text-red-700 font-medium">
                      The graph contains a negative weight cycle. Shortest paths are not well-defined.
                    </p>
                    {result.negativeCycle && (
                      <p className="text-red-700 font-medium mt-2">
                        <strong>Cycle involves vertices:</strong> {result.negativeCycle.map(id => nodes.find(n => n.id === id)?.label).join(' → ')}
                      </p>
                    )}
                  </div>
                )}

                {/* Final Results */}
                {animationStep === result.steps.length - 1 && !result.hasNegativeCycle && (
                  <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300">
                    <h3 className="font-bold text-green-800 mb-3 text-lg">Shortest Paths from {nodes.find(n => n.id === sourceNode)?.label}</h3>
                    <div className="space-y-2 text-sm">
                      {nodes.map(node => {
                        if (node.id === sourceNode) return null;
                        const finalStep = result.steps[result.steps.length - 1];
                        const distance = finalStep.distances[node.id];
                        
                        return (
                          <div key={node.id} className="flex justify-between font-medium">
                            <span>To {node.label}:</span>
                            <span className="font-mono text-green-700">
                              {distance === Infinity ? 'No path' : `Distance: ${distance}`}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <div className="text-4xl mb-4">🔄</div>
                <p>Draw a graph and click &quot;Run Bellman-Ford Algorithm&quot; to find shortest paths</p>
              </div>
            )}
          </div>
        </div>

        {/* Step-by-Step Table */}
        {result && (
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Step-by-Step Execution Table</h2>
            <div className="overflow-x-auto bg-gray-50 rounded border-2 border-gray-300">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-purple-700 text-white">
                    <th className="border border-gray-400 px-3 py-3 font-bold">Step</th>
                    <th className="border border-gray-400 px-3 py-3 font-bold">Iteration</th>
                    <th className="border border-gray-400 px-3 py-3 font-bold">Edge</th>
                    <th className="border border-gray-400 px-3 py-3 font-bold">Action</th>
                    <th className="border border-gray-400 px-3 py-3 font-bold">Distances</th>
                  </tr>
                </thead>
                <tbody>
                  {result.steps.map((step, index) => (
                    <tr key={index} className={`${
                      index === animationStep ? 'bg-yellow-200 font-bold' : 
                      index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
                    } border-b border-gray-300`}>
                      <td className="border border-gray-400 px-3 py-2 font-bold text-center text-purple-600">{index + 1}</td>
                      <td className="border border-gray-400 px-3 py-2 text-center font-bold text-blue-600">{step.iteration}</td>
                      <td className="border border-gray-400 px-3 py-2 text-center font-medium">
                        {step.edgeBeingRelaxed ? 
                          `${nodes.find(n => n.id === step.edgeBeingRelaxed?.from)?.label} → ${nodes.find(n => n.id === step.edgeBeingRelaxed?.to)?.label} (${step.edgeBeingRelaxed?.weight})` : 
                          'Initialization'
                        }
                      </td>
                      <td className="border border-gray-400 px-3 py-2 text-center font-medium">{step.action}</td>
                      <td className="border border-gray-400 px-3 py-2 font-mono text-xs text-center text-red-600 font-bold">
                        {nodes.map(node => 
                          `${node.label}:${step.distances[node.id] === Infinity ? '∞' : step.distances[node.id]}`
                        ).join(', ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {result && (
          <ExamResult
            title="Bellman-Ford Algorithm Analysis"
            input={`Graph with ${nodes.length} vertices and ${edges.length} edges (includes negative weights)`}
            result={!result.hasNegativeCycle}
            steps={result.steps.slice(0, 12).map((step, index) => ({
              stepNumber: index + 1,
              description: step.description,
              currentState: `Iteration ${step.iteration}: Distances = [${nodes.map(node => step.distances[node.id] === Infinity ? '∞' : step.distances[node.id]).join(', ')}]`,
              explanation: step.action
            }))}
            finalAnswer={result.hasNegativeCycle ? 
              "Negative cycle detected - shortest paths undefined" :
              `Shortest distances from ${nodes.find(n => n.id === sourceNode)?.label}: ${nodes.map(node => {
                const finalStep = result.steps[result.steps.length - 1];
                const distance = finalStep.distances[node.id];
                return `${node.label}: ${distance === Infinity ? '∞' : distance}`;
              }).join(', ')}`
            }
            examFormat={{
              question: `Find shortest paths from vertex ${nodes.find(n => n.id === sourceNode)?.label} using Bellman-Ford algorithm.`,
              solution: [
                `Bellman-Ford Algorithm Execution:`,
                `Source vertex: ${nodes.find(n => n.id === sourceNode)?.label}`,
                `Graph: ${nodes.length} vertices, ${edges.length} edges`,
                `Edges: ${edges.map(e => `(${nodes.find(n => n.id === e.from)?.label}, ${nodes.find(n => n.id === e.to)?.label}): ${e.weight}`).join(', ')}`,
                `Negative cycle: ${result.hasNegativeCycle ? 'Yes' : 'No'}`,
                ...result.steps.slice(0, 8).map((step, i) => `Step ${i + 1}: ${step.description} - ${step.action}`),
                result.hasNegativeCycle ? 
                  `Result: Negative cycle detected` :
                  `Final distances: ${nodes.map(node => {
                    const finalStep = result.steps[result.steps.length - 1];
                    const distance = finalStep.distances[node.id];
                    return `${node.label}: ${distance === Infinity ? '∞' : distance}`;
                  }).join(', ')}`
              ],
              conclusion: result.hasNegativeCycle ? 
                "Graph contains negative cycle - shortest paths are undefined" :
                `Bellman-Ford algorithm successfully found shortest paths from source vertex ${nodes.find(n => n.id === sourceNode)?.label}.`,
              marks: 10
            }}
          />
        )}
      </div>
    </div>
  );
}
