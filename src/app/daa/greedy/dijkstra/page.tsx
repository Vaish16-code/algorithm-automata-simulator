"use client";

import React, { useState, useRef, useEffect } from "react";
import { dijkstraAlgorithm, DijkstraResult } from "@/app/utils/greedyAlgorithms";
import { EducationalInfo, ExamResult } from "@/components";

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

export default function DijkstraPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [sourceNode, setSourceNode] = useState<number>(0);
  const [isDrawingMode, setIsDrawingMode] = useState<'node' | 'edge' | 'delete' | 'none'>('none');
  const [edgeStart, setEdgeStart] = useState<number | null>(null);
  const [edgeWeight, setEdgeWeight] = useState<string>('1');
  const [result, setResult] = useState<DijkstraResult | null>(null);
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
      { from: 1, to: 3, weight: 1 },
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
    }
  };

  useEffect(() => {
    drawGraph();
  }, [nodes, edges, selectedNode, animationStep, result]);

  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw edges
    edges.forEach((edge, index) => {
      const fromNode = nodes.find(n => n.id === edge.from);
      const toNode = nodes.find(n => n.id === edge.to);
      
      if (fromNode && toNode) {
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        
        // Highlight edge if it's in the shortest path
        if (result && animationStep >= 0) {
          const step = result.steps[animationStep];
          if (step && step.edgesInPath && step.edgesInPath.some(e => 
            (e.from === edge.from && e.to === edge.to) || 
            (e.from === edge.to && e.to === edge.from)
          )) {
            ctx.strokeStyle = '#22c55e';
            ctx.lineWidth = 3;
          } else {
            ctx.strokeStyle = '#6b7280';
            ctx.lineWidth = 2;
          }
        } else {
          ctx.strokeStyle = '#6b7280';
          ctx.lineWidth = 2;
        }
        
        ctx.stroke();

        // Draw weight
        const midX = (fromNode.x + toNode.x) / 2;
        const midY = (fromNode.y + toNode.y) / 2;
        ctx.fillStyle = '#1f2937';
        ctx.font = '14px Arial';
        ctx.fillText(edge.weight.toString(), midX - 10, midY - 5);
      }
    });

    // Draw nodes
    nodes.forEach(node => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
      
      // Node colors based on algorithm state
      if (result && animationStep >= 0) {
        const step = result.steps[animationStep];
        if (step) {
          if (step.visited && step.visited.includes(node.id)) {
            ctx.fillStyle = '#22c55e'; // Visited - green
          } else if (step.currentNode === node.id) {
            ctx.fillStyle = '#f59e0b'; // Current - orange
          } else if (step.distances[node.id] !== Infinity) {
            ctx.fillStyle = '#3b82f6'; // In queue - blue
          } else {
            ctx.fillStyle = '#e5e7eb'; // Unvisited - gray
          }
        } else {
          ctx.fillStyle = node.id === sourceNode ? '#ef4444' : '#e5e7eb';
        }
      } else {
        ctx.fillStyle = node.id === sourceNode ? '#ef4444' : (selectedNode === node.id ? '#3b82f6' : '#e5e7eb');
      }
      
      ctx.fill();
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw label
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(node.label, node.x, node.y + 5);

      // Draw distance if algorithm is running
      if (result && animationStep >= 0) {
        const step = result.steps[animationStep];
        if (step && step.distances[node.id] !== Infinity) {
          ctx.fillStyle = '#dc2626';
          ctx.font = '12px Arial';
          ctx.fillText(step.distances[node.id].toString(), node.x, node.y - 30);
        }
      }
    });
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    // This is now just a fallback - most logic is in handleCanvasMouseUp
    if (!isDragging && !dragStarted) {
      handleCanvasClickInternal(event);
    }
  };

  // Mouse down handler for dragging
  const handleCanvasMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const clickedNode = nodes.find(node => 
      Math.sqrt(Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2)) < 25
    );

    if (clickedNode && isDrawingMode === 'none') {
      // Start dragging
      setIsDragging(true);
      setSelectedNode(clickedNode.id);
      setDragOffset({
        x: x - clickedNode.x,
        y: y - clickedNode.y
      });
      setDragStarted(false);
      event.preventDefault();
      event.stopPropagation();
    }
  };

  // Mouse move handler for dragging
  const handleCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || selectedNode === null) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (!dragStarted) {
      setDragStarted(true);
    }

    const newNodes = nodes.map(node => 
      node.id === selectedNode 
        ? { 
            ...node, 
            x: Math.max(20, Math.min(480, x - dragOffset.x)), 
            y: Math.max(20, Math.min(280, y - dragOffset.y)) 
          }
        : node
    );
    setNodes(newNodes);
    event.preventDefault();
  };

  // Mouse up handler for dragging
  const handleCanvasMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      setIsDragging(false);
      setSelectedNode(null);
      if (dragStarted) {
        saveToHistory(nodes, edges);
        setDragStarted(false);
        return; // Don't process as click
      }
    }

    // If not dragging, handle as regular click
    if (!dragStarted) {
      handleCanvasClickInternal(event);
    }
  };

  // Mouse leave handler - only end drag, don't process as click
  const handleCanvasMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      setSelectedNode(null);
      if (dragStarted) {
        saveToHistory(nodes, edges);
        setDragStarted(false);
      }
    }
  };

  // Separate the click logic
  const handleCanvasClickInternal = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
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
      // Find clicked node
      const clickedNode = nodes.find(node => 
        Math.sqrt(Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2)) < 25
      );

      if (clickedNode) {
        if (edgeStart === null) {
          setEdgeStart(clickedNode.id);
        } else if (edgeStart !== clickedNode.id) {
          // Create edge
          const weight = parseInt(edgeWeight) || 1;
          const newEdge: Edge = {
            from: edgeStart,
            to: clickedNode.id,
            weight
          };
          const newEdges = [...edges, newEdge];
          setEdges(newEdges);
          setEdgeStart(null);
          saveToHistory(nodes, newEdges);
        }
      }
    } else if (isDrawingMode === 'delete') {
      // Find clicked node or edge to delete
      const clickedNode = nodes.find(node => 
        Math.sqrt(Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2)) < 25
      );

      if (clickedNode) {
        // Delete node and all connected edges
        const newNodes = nodes.filter(n => n.id !== clickedNode.id);
        const newEdges = edges.filter(e => e.from !== clickedNode.id && e.to !== clickedNode.id);
        setNodes(newNodes);
        setEdges(newEdges);
        saveToHistory(newNodes, newEdges);
        if (selectedNode === clickedNode.id) setSelectedNode(null);
      } else {
        // Check if clicked on an edge
        const clickedEdge = edges.find(edge => {
          const fromNode = nodes.find(n => n.id === edge.from);
          const toNode = nodes.find(n => n.id === edge.to);
          if (!fromNode || !toNode) return false;
          
          // Calculate distance from point to line segment
          const A = x - fromNode.x;
          const B = y - fromNode.y;
          const C = toNode.x - fromNode.x;
          const D = toNode.y - fromNode.y;
          
          const dot = A * C + B * D;
          const lenSq = C * C + D * D;
          let param = -1;
          if (lenSq !== 0) param = dot / lenSq;
          
          let xx, yy;
          if (param < 0) {
            xx = fromNode.x;
            yy = fromNode.y;
          } else if (param > 1) {
            xx = toNode.x;
            yy = toNode.y;
          } else {
            xx = fromNode.x + param * C;
            yy = fromNode.y + param * D;
          }
          
          const dx = x - xx;
          const dy = y - yy;
          return Math.sqrt(dx * dx + dy * dy) < 10;
        });

        if (clickedEdge) {
          const newEdges = edges.filter(e => e !== clickedEdge);
          setEdges(newEdges);
          saveToHistory(nodes, newEdges);
        }
      }
    } else {
      // Select node (only if not in any special mode)
      const clickedNode = nodes.find(node => 
        Math.sqrt(Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2)) < 25
      );
      setSelectedNode(clickedNode ? clickedNode.id : null);
    }
  };

  const runDijkstra = () => {
    if (nodes.length === 0) return;

    // Convert to adjacency matrix
    const n = nodes.length;
    const graph = Array(n).fill(null).map(() => Array(n).fill(Infinity));
    
    // Initialize diagonal to 0
    for (let i = 0; i < n; i++) {
      graph[i][i] = 0;
    }

    // Add edges
    edges.forEach(edge => {
      graph[edge.from][edge.to] = edge.weight;
      graph[edge.to][edge.from] = edge.weight; // Undirected graph
    });

    const dijkstraResult = dijkstraAlgorithm(graph, sourceNode);
    setResult(dijkstraResult);
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
      { from: 1, to: 3, weight: 1 },
      { from: 2, to: 4, weight: 2 },
      { from: 3, to: 4, weight: 5 }
    ];

    setNodes(sampleNodes);
    setEdges(sampleEdges);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Dijkstra&apos;s Algorithm <span className="text-blue-600">(Greedy)</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find the shortest paths from a source vertex to all other vertices in a weighted graph
          </p>
        </div>

        <EducationalInfo
          topic="Dijkstra's Shortest Path Algorithm"
          description="Dijkstra's algorithm finds the shortest paths from a source vertex to all other vertices in a weighted graph with non-negative edge weights using a greedy approach."
          theory={{
            definition: "A greedy algorithm that finds the shortest paths from a source vertex to all other vertices in a weighted, directed graph with non-negative edge weights.",
            keyPoints: [
              "Uses greedy approach - always selects the unvisited vertex with minimum distance",
              "Maintains a distance array and visited set",
              "Works only with non-negative edge weights",
              "Guarantees optimal solution for shortest path problems"
            ],
            applications: [
              "GPS navigation and route planning",
              "Network routing protocols (OSPF)",
              "Social network analysis",
              "Game AI pathfinding"
            ]
          }}
          university={{
            syllabus: [
              "Dijkstra's algorithm implementation",
              "Shortest path problem formulation",
              "Greedy algorithm approach",
              "Time and space complexity analysis",
              "Comparison with other shortest path algorithms"
            ],
            marks: "8-10 marks",
            commonQuestions: [
              "Implement Dijkstra's algorithm",
              "Find shortest paths from given source",
              "Show step-by-step execution",
              "Create distance and predecessor tables"
            ],
            examTips: [
              "Always maintain distance and visited arrays",
              "Show table with each iteration clearly",
              "Mark visited nodes and update distances",
              "Include final shortest path tree"
            ]
          }}
          algorithm={{
            steps: [
              "Initialize distances: source = 0, others = ∞",
              "Mark all vertices as unvisited",
              "Select unvisited vertex with minimum distance",
              "Update distances to all adjacent unvisited vertices",
              "Mark current vertex as visited",
              "Repeat until all vertices are visited"
            ],
            complexity: {
              time: "O(V²) with simple array, O((V + E) log V) with priority queue",
              space: "O(V) for distance and visited arrays"
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
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Add Node
                </button>
                
                <button
                  onClick={() => setIsDrawingMode(isDrawingMode === 'edge' ? 'none' : 'edge')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    isDrawingMode === 'edge' 
                      ? 'bg-blue-600 text-white' 
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
                    min="1"
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
                onClick={runDijkstra}
                disabled={nodes.length === 0}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:bg-gray-400"
              >
                Run Dijkstra&apos;s Algorithm
              </button>
            </div>

            <div className="border border-gray-300 rounded-lg">
              <canvas
                ref={canvasRef}
                width={500}
                height={300}
                className={`border rounded-lg bg-gray-50 ${
                  isDragging ? 'cursor-grabbing' : 
                  isDrawingMode === 'none' ? 'cursor-grab' : 'cursor-pointer'
                }`}
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                onMouseLeave={handleCanvasMouseLeave}
                style={{ userSelect: 'none' }}
              />
            </div>

            <div className="mt-4 text-sm text-gray-600">
              <p><strong>Instructions:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Click &quot;Add Node&quot; then click on canvas to add vertices</li>
                <li>Click &quot;Add Edge&quot;, set weight, then click two nodes to connect</li>
                <li>Click &quot;Delete&quot; then click nodes or edges to remove them</li>
                <li>Drag nodes to move them around</li>
                <li>Use Undo/Redo to restore accidentally deleted items</li>
                <li>Select source node and run the algorithm</li>
              </ul>
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
                    className="px-3 py-1 bg-blue-500 text-white rounded"
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
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">
                      Step {animationStep + 1}: {result.steps[animationStep].description}
                    </h3>
                    <div className="text-sm text-blue-700">
                      <p><strong>Current Node:</strong> {nodes.find(n => n.id === result.steps[animationStep].currentNode)?.label}</p>
                      <p><strong>Action:</strong> {result.steps[animationStep].action}</p>
                    </div>
                  </div>
                )}

                {/* Distance Table */}
                <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-300">
                  <h3 className="font-bold text-gray-800 mb-3 text-lg">Distance Table</h3>
                  <div className="overflow-x-auto bg-white rounded border">
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="bg-blue-600 text-white">
                          <th className="border border-gray-400 px-3 py-2 font-bold">Node</th>
                          <th className="border border-gray-400 px-3 py-2 font-bold">Distance</th>
                          <th className="border border-gray-400 px-3 py-2 font-bold">Visited</th>
                          <th className="border border-gray-400 px-3 py-2 font-bold">Previous</th>
                        </tr>
                      </thead>
                      <tbody>
                        {nodes.map(node => {
                          const step = animationStep >= 0 ? result.steps[animationStep] : result.steps[result.steps.length - 1];
                          const distance = step.distances[node.id];
                          const isVisited = step.visited && step.visited.includes(node.id);
                          const previous = step.previous ? step.previous[node.id] : null;
                          
                          return (
                            <tr key={node.id} className={`${
                              step.currentNode === node.id ? 'bg-yellow-200 font-bold' : 
                              isVisited ? 'bg-green-100' : 'bg-white'
                            } border-b border-gray-300`}>
                              <td className="border border-gray-400 px-3 py-2 font-bold text-center text-blue-700">
                                {node.label}
                              </td>
                              <td className="border border-gray-400 px-3 py-2 text-center font-bold text-red-600">
                                {distance === Infinity ? '∞' : distance}
                              </td>
                              <td className="border border-gray-400 px-3 py-2 text-center font-bold">
                                <span className={isVisited ? 'text-green-600' : 'text-red-600'}>
                                  {isVisited ? '✓' : '✗'}
                                </span>
                              </td>
                              <td className="border border-gray-400 px-3 py-2 text-center font-bold text-purple-600">
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

                {/* Final Results */}
                {animationStep === result.steps.length - 1 && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-3">Shortest Paths from {nodes.find(n => n.id === sourceNode)?.label}</h3>
                    <div className="space-y-2 text-sm">
                      {nodes.map(node => {
                        if (node.id === sourceNode) return null;
                        const finalStep = result.steps[result.steps.length - 1];
                        const distance = finalStep.distances[node.id];
                        const path = result.shortestPaths ? result.shortestPaths[node.id] : [];
                        
                        return (
                          <div key={node.id} className="flex justify-between">
                            <span>To {node.label}:</span>
                            <span className="font-mono">
                              {distance === Infinity ? 'No path' : 
                                `Distance: ${distance}, Path: ${path.map(id => nodes.find(n => n.id === id)?.label).join(' → ')}`
                              }
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
                <div className="text-4xl mb-4">🗺️</div>
                <p>Draw a graph and click &quot;Run Dijkstra&apos;s Algorithm&quot; to see the shortest paths</p>
              </div>
            )}
          </div>
        </div>

        {/* Output Graph Section - Shortest Path Tree */}
        {result && animationStep === result.steps.length - 1 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-2 border-green-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              🌳 Shortest Path Tree - Output Graph
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Visual Output Graph */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Visual Shortest Path Tree</h3>
                <div className="border border-gray-300 rounded-lg p-4 bg-green-50">
                  <canvas
                    ref={(canvas) => {
                      if (canvas && result) {
                        const ctx = canvas.getContext('2d');
                        if (!ctx) return;
                        
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        
                        // Draw only shortest path edges in green
                        const finalStep = result.steps[result.steps.length - 1];
                        
                        // Get shortest path edges from the result
                        edges.forEach(edge => {
                          const fromNode = nodes.find(n => n.id === edge.from);
                          const toNode = nodes.find(n => n.id === edge.to);
                          
                          if (fromNode && toNode) {
                            // Check if this edge is part of any shortest path
                            let isInShortestPath = false;
                            
                            if (result.shortestPaths) {
                              result.shortestPaths.forEach(path => {
                                for (let i = 0; i < path.length - 1; i++) {
                                  if ((path[i] === edge.from && path[i + 1] === edge.to) ||
                                      (path[i] === edge.to && path[i + 1] === edge.from)) {
                                    isInShortestPath = true;
                                    break;
                                  }
                                }
                              });
                            }
                            
                            ctx.beginPath();
                            ctx.moveTo(fromNode.x * 0.8, fromNode.y * 0.8);
                            ctx.lineTo(toNode.x * 0.8, toNode.y * 0.8);
                            
                            if (isInShortestPath) {
                              ctx.strokeStyle = '#22c55e';
                              ctx.lineWidth = 4;
                            } else {
                              ctx.strokeStyle = '#d1d5db';
                              ctx.lineWidth = 1;
                            }
                            ctx.stroke();
                            
                            // Draw weight for shortest path edges
                            if (isInShortestPath) {
                              const midX = ((fromNode.x + toNode.x) / 2) * 0.8;
                              const midY = ((fromNode.y + toNode.y) / 2) * 0.8;
                              ctx.fillStyle = '#16a34a';
                              ctx.font = 'bold 12px Arial';
                              ctx.fillText(edge.weight.toString(), midX - 8, midY - 3);
                            }
                          }
                        });
                        
                        // Draw nodes
                        nodes.forEach(node => {
                          ctx.beginPath();
                          ctx.arc(node.x * 0.8, node.y * 0.8, 16, 0, 2 * Math.PI);
                          
                          if (node.id === sourceNode) {
                            ctx.fillStyle = '#ef4444'; // Source - red
                          } else if (finalStep.distances[node.id] !== Infinity) {
                            ctx.fillStyle = '#22c55e'; // Reachable - green
                          } else {
                            ctx.fillStyle = '#9ca3af'; // Unreachable - gray
                          }
                          
                          ctx.fill();
                          ctx.strokeStyle = '#374151';
                          ctx.lineWidth = 2;
                          ctx.stroke();
                          
                          // Draw label
                          ctx.fillStyle = '#ffffff';
                          ctx.font = 'bold 12px Arial';
                          ctx.textAlign = 'center';
                          ctx.fillText(node.label, node.x * 0.8, node.y * 0.8 + 4);
                          
                          // Draw distance
                          ctx.fillStyle = '#dc2626';
                          ctx.font = '10px Arial';
                          const distance = finalStep.distances[node.id];
                          ctx.fillText(
                            distance === Infinity ? '∞' : distance.toString(),
                            node.x * 0.8,
                            node.y * 0.8 - 20
                          );
                        });
                      }
                    }}
                    width={400}
                    height={240}
                    className="border rounded bg-white"
                  />
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span>Source</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-1 bg-green-500"></div>
                      <span>Shortest Path</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Reachable</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Textual Output */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Shortest Path Tree Details</h3>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-green-700">Source Vertex:</h4>
                      <p className="text-gray-700">{nodes.find(n => n.id === sourceNode)?.label}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-green-700">Shortest Distances:</h4>
                      <div className="space-y-1">
                        {nodes.map(node => {
                          const finalStep = result.steps[result.steps.length - 1];
                          const distance = finalStep.distances[node.id];
                          return (
                            <div key={node.id} className="flex justify-between">
                              <span>To {node.label}:</span>
                              <span className="font-mono font-bold">
                                {distance === Infinity ? '∞ (unreachable)' : `${distance}`}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-green-700">Shortest Paths:</h4>
                      <div className="space-y-1 text-sm">
                        {nodes.map(node => {
                          if (node.id === sourceNode) return null;
                          const path = result.shortestPaths ? result.shortestPaths[node.id] : [];
                          return (
                            <div key={node.id}>
                              <span className="text-gray-600">To {node.label}: </span>
                              <span className="font-mono">
                                {path.length > 0 
                                  ? path.map(id => nodes.find(n => n.id === id)?.label).join(' → ')
                                  : 'No path'
                                }
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step-by-Step Table */}
        {result && (
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Step-by-Step Execution Table</h2>
            <div className="overflow-x-auto bg-gray-50 rounded border-2 border-gray-300">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-blue-700 text-white">
                    <th className="border border-gray-400 px-3 py-3 font-bold">Step</th>
                    <th className="border border-gray-400 px-3 py-3 font-bold">Current Node</th>
                    <th className="border border-gray-400 px-3 py-3 font-bold">Action</th>
                    <th className="border border-gray-400 px-3 py-3 font-bold">Distances</th>
                    <th className="border border-gray-400 px-3 py-3 font-bold">Visited</th>
                  </tr>
                </thead>
                <tbody>
                  {result.steps.map((step, index) => (
                    <tr key={index} className={`${index === animationStep ? 'bg-yellow-200 font-bold' : index % 2 === 0 ? 'bg-gray-100' : 'bg-white'} border-b border-gray-300`}>
                      <td className="border border-gray-400 px-3 py-2 font-bold text-center text-blue-600">{index + 1}</td>
                      <td className="border border-gray-400 px-3 py-2 text-center font-bold text-green-600">
                        {step.currentNode !== null ? nodes.find(n => n.id === step.currentNode)?.label : '-'}
                      </td>
                      <td className="border border-gray-400 px-3 py-2 text-center font-medium">{step.action}</td>
                      <td className="border border-gray-400 px-3 py-2 font-mono text-xs text-center text-red-600 font-bold">
                        {nodes.map(node => 
                          `${node.label}:${step.distances[node.id] === Infinity ? '∞' : step.distances[node.id]}`
                        ).join(', ')}
                      </td>
                      <td className="border border-gray-400 px-3 py-2 text-center font-bold text-purple-600">
                        {step.visited ? step.visited.map(id => nodes.find(n => n.id === id)?.label).join(', ') : ''}
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
            title="Dijkstra's Algorithm Analysis"
            input={`Graph with ${nodes.length} vertices and ${edges.length} edges`}
            result={true}
            steps={result.steps.slice(0, 10).map((step, index) => ({
              stepNumber: index + 1,
              description: step.description,
              currentState: `Current: ${step.currentNode !== null ? nodes.find(n => n.id === step.currentNode)?.label : 'None'}, Distances: [${nodes.map(node => step.distances[node.id] === Infinity ? '∞' : step.distances[node.id]).join(', ')}]`,
              explanation: step.action
            }))}
            finalAnswer={`Shortest distances from ${nodes.find(n => n.id === sourceNode)?.label}: ${nodes.map(node => {
              const finalStep = result.steps[result.steps.length - 1];
              const distance = finalStep.distances[node.id];
              return `${node.label}: ${distance === Infinity ? '∞' : distance}`;
            }).join(', ')}`}
            examFormat={{
              question: `Find shortest paths from vertex ${nodes.find(n => n.id === sourceNode)?.label} using Dijkstra's algorithm.`,
              solution: [
                `Dijkstra's Algorithm Execution:`,
                `Source vertex: ${nodes.find(n => n.id === sourceNode)?.label}`,
                `Graph: ${nodes.length} vertices, ${edges.length} edges`,
                `Edge weights: ${edges.map(e => `(${nodes.find(n => n.id === e.from)?.label}, ${nodes.find(n => n.id === e.to)?.label}): ${e.weight}`).join(', ')}`,
                ...result.steps.map((step, i) => `Step ${i + 1}: ${step.description} - ${step.action}`),
                `Final shortest distances: ${nodes.map(node => {
                  const finalStep = result.steps[result.steps.length - 1];
                  const distance = finalStep.distances[node.id];
                  return `${node.label}: ${distance === Infinity ? '∞' : distance}`;
                }).join(', ')}`
              ],
              conclusion: `Dijkstra's algorithm successfully found shortest paths from source vertex ${nodes.find(n => n.id === sourceNode)?.label} to all reachable vertices.`,
              marks: 10
            }}
          />
        )}
      </div>
    </div>
  );
}
