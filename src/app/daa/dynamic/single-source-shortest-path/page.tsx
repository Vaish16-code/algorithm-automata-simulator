"use client";

import React, { useState, useRef, useEffect } from "react";
import { bellmanFordAlgorithm, BellmanFordResult } from "../../../utils/dynamicProgramming";
import { dijkstraAlgorithm, DijkstraResult } from "../../../utils/greedyAlgorithms";
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

export default function SingleSourceShortestPathPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [sourceNode, setSourceNode] = useState<number>(0);
  const [isDrawingMode, setIsDrawingMode] = useState<'node' | 'edge' | 'none'>('none');
  const [edgeStart, setEdgeStart] = useState<number | null>(null);
  const [edgeWeight, setEdgeWeight] = useState<string>('1');
  const [algorithm, setAlgorithm] = useState<'bellman-ford' | 'dijkstra'>('bellman-ford');
  const [bellmanResult, setBellmanResult] = useState<BellmanFordResult | null>(null);
  const [dijkstraResult, setDijkstraResult] = useState<DijkstraResult | null>(null);
  const [animationStep, setAnimationStep] = useState<number>(-1);

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
  }, []);

  useEffect(() => {
    drawGraph();
  }, [nodes, edges, selectedNode, animationStep, bellmanResult, dijkstraResult]);

  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw edges
    edges.forEach((edge) => {
      const fromNode = nodes.find(n => n.id === edge.from);
      const toNode = nodes.find(n => n.id === edge.to);
      
      if (fromNode && toNode) {
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        
        // Highlight edge if it's in the shortest path
        const edgeResult = algorithm === 'bellman-ford' ? bellmanResult : dijkstraResult;
        if (edgeResult && animationStep >= 0) {
          const step = edgeResult.steps[animationStep];
          if (step && (step as any).edgesInPath && (step as any).edgesInPath.some((e: any) => 
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
          ctx.strokeStyle = edge.weight < 0 ? '#ef4444' : '#6b7280';
          ctx.lineWidth = 2;
        }
        
        ctx.stroke();

        // Draw arrowhead for directed edge
        const angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x);
        const arrowLength = 15;
        const arrowAngle = Math.PI / 6;
        
        const endX = toNode.x - 20 * Math.cos(angle);
        const endY = toNode.y - 20 * Math.sin(angle);
        
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(
          endX - arrowLength * Math.cos(angle - arrowAngle),
          endY - arrowLength * Math.sin(angle - arrowAngle)
        );
        ctx.moveTo(endX, endY);
        ctx.lineTo(
          endX - arrowLength * Math.cos(angle + arrowAngle),
          endY - arrowLength * Math.sin(angle + arrowAngle)
        );
        ctx.stroke();

        // Draw weight
        const midX = (fromNode.x + toNode.x) / 2;
        const midY = (fromNode.y + toNode.y) / 2;
        ctx.fillStyle = edge.weight < 0 ? '#ef4444' : '#1f2937';
        ctx.font = 'bold 14px Arial';
        ctx.fillText(edge.weight.toString(), midX - 10, midY - 5);
      }
    });

    // Draw nodes
    nodes.forEach(node => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
      
      // Node colors based on algorithm state
      const nodeResult = algorithm === 'bellman-ford' ? bellmanResult : dijkstraResult;
      if (nodeResult && animationStep >= 0) {
        const step = nodeResult.steps[animationStep];
        if (step) {
          if ((step as any).visited && (step as any).visited.includes(node.id)) {
            ctx.fillStyle = '#22c55e'; // Visited - green
          } else if ((step as any).currentNode === node.id) {
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
      const distanceResult = algorithm === 'bellman-ford' ? bellmanResult : dijkstraResult;
      if (distanceResult && animationStep >= 0) {
        const step = distanceResult.steps[animationStep];
        if (step && step.distances[node.id] !== Infinity) {
          ctx.fillStyle = '#dc2626';
          ctx.font = '12px Arial';
          ctx.fillText(step.distances[node.id].toString(), node.x, node.y - 30);
        }
      }
    });
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
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
      setNodes([...nodes, newNode]);
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
          setEdges([...edges, newEdge]);
          setEdgeStart(null);
        }
      }
    } else {
      // Select node
      const clickedNode = nodes.find(node => 
        Math.sqrt(Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2)) < 25
      );
      setSelectedNode(clickedNode ? clickedNode.id : null);
    }
  };

  const runAlgorithm = () => {
    if (nodes.length === 0) return;

    if (algorithm === 'bellman-ford') {
      const edgeList = edges.map(e => ({ from: e.from, to: e.to, weight: e.weight }));
      const bellmanFordResult = bellmanFordAlgorithm(edgeList, nodes.length, sourceNode);
      setBellmanResult(bellmanFordResult);
      setDijkstraResult(null);
    } else {
      // Convert to adjacency matrix for Dijkstra
      const n = nodes.length;
      const graph = Array(n).fill(null).map(() => Array(n).fill(Infinity));
      
      // Initialize diagonal to 0
      for (let i = 0; i < n; i++) {
        graph[i][i] = 0;
      }

      // Add edges (undirected for Dijkstra)
      edges.forEach(edge => {
        graph[edge.from][edge.to] = edge.weight;
        graph[edge.to][edge.from] = edge.weight;
      });

      const result = dijkstraAlgorithm(graph, sourceNode);
      setDijkstraResult(result);
      setBellmanResult(null);
    }
    setAnimationStep(0);
  };

  const clearGraph = () => {
    setNodes([]);
    setEdges([]);
    setBellmanResult(null);
    setDijkstraResult(null);
    setAnimationStep(-1);
    setSelectedNode(null);
    setEdgeStart(null);
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
    setBellmanResult(null);
    setDijkstraResult(null);
    setAnimationStep(-1);
  };

  const loadNegativeWeightGraph = () => {
    const sampleNodes: Node[] = [
      { id: 0, x: 100, y: 150, label: 'A' },
      { id: 1, x: 200, y: 100, label: 'B' },
      { id: 2, x: 300, y: 150, label: 'C' },
      { id: 3, x: 200, y: 200, label: 'D' }
    ];
    
    const sampleEdges: Edge[] = [
      { from: 0, to: 1, weight: 4 },
      { from: 0, to: 2, weight: 5 },
      { from: 1, to: 2, weight: -10 },
      { from: 1, to: 3, weight: 3 },
      { from: 2, to: 3, weight: 3 }
    ];

    setNodes(sampleNodes);
    setEdges(sampleEdges);
    setBellmanResult(null);
    setDijkstraResult(null);
    setAnimationStep(-1);
  };

  const nextStep = () => {
    const result = algorithm === 'bellman-ford' ? bellmanResult : dijkstraResult;
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
            Single Source Shortest Path <span className="text-purple-600">Algorithms</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Compare Bellman-Ford (handles negative weights) and Dijkstra (faster for positive weights)
          </p>
        </div>

        <EducationalInfo
          topic="Single Source Shortest Path Algorithms"
          description="Algorithms to find shortest paths from a single source vertex to all other vertices in a weighted graph."
          theory={{
            definition: "Single source shortest path algorithms find the shortest paths from one source vertex to all other vertices in a weighted graph.",
            keyPoints: [
              "Bellman-Ford: Handles negative edge weights, detects negative cycles, O(VE) complexity",
              "Dijkstra: Only positive weights, greedy approach, O(V²) or O((V+E)logV) complexity",
              "Both use relaxation technique to improve distance estimates",
              "Choice depends on graph properties (negative weights vs. performance)"
            ],
            applications: [
              "GPS navigation and route planning",
              "Network routing protocols",
              "Currency arbitrage detection (Bellman-Ford)",
              "Social network analysis"
            ]
          }}
          mumbaiUniversity={{
            syllabus: [
              "Single source shortest path problem",
              "Bellman-Ford algorithm implementation",
              "Dijkstra's algorithm (greedy approach)",
              "Negative cycle detection",
              "Comparison of different approaches"
            ],
            marks: "10-12 marks",
            commonQuestions: [
              "Implement Bellman-Ford algorithm",
              "Compare Bellman-Ford vs Dijkstra",
              "Handle graphs with negative weights",
              "Detect negative cycles"
            ],
            examTips: [
              "Show relaxation steps clearly",
              "Maintain distance and predecessor arrays",
              "For Bellman-Ford: perform V-1 iterations",
              "Check for negative cycles in final iteration"
            ]
          }}
          algorithm={{
            steps: [
              "Initialize distances: source = 0, others = ∞",
              "Bellman-Ford: Relax all edges V-1 times",
              "Dijkstra: Use priority queue, relax neighbors of minimum vertex",
              "Update distances when shorter path found",
              "Bellman-Ford: Check for negative cycles",
              "Return final distances and paths"
            ],
            complexity: {
              time: "Bellman-Ford: O(VE), Dijkstra: O(V²) or O((V+E)logV)",
              space: "O(V) for distance and predecessor arrays"
            }
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Graph Drawing Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Draw Your Graph</h2>
            
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose Algorithm
                </label>
                <select
                  value={algorithm}
                  onChange={(e) => setAlgorithm(e.target.value as 'bellman-ford' | 'dijkstra')}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="bellman-ford">Bellman-Ford (Handles negative weights)</option>
                  <option value="dijkstra">Dijkstra (Positive weights only)</option>
                </select>
              </div>

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
                  Positive Weights
                </button>

                <button
                  onClick={loadNegativeWeightGraph}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  Negative Weights
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
                onClick={runAlgorithm}
                disabled={nodes.length === 0}
                className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold disabled:bg-gray-400"
              >
                Run {algorithm === 'bellman-ford' ? 'Bellman-Ford' : 'Dijkstra'} Algorithm
              </button>
            </div>

            <div className="border border-gray-300 rounded-lg">
              <canvas
                ref={canvasRef}
                width={500}
                height={300}
                className="border rounded-lg cursor-pointer bg-gray-50"
                onClick={handleCanvasClick}
              />
            </div>

            <div className="mt-4 text-sm text-gray-600">
              <p><strong>Instructions:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Click &quot;Add Node&quot; then click on canvas to add vertices</li>
                <li>Click &quot;Add Edge&quot;, set weight (can be negative), then click two nodes</li>
                <li>Red edges indicate negative weights</li>
                <li>Select algorithm and source node, then run</li>
              </ul>
            </div>
          </div>

          {/* Algorithm Results */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Algorithm Results</h2>
            
            {(bellmanResult || dijkstraResult) ? (
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
                    className="px-3 py-1 bg-purple-500 text-white rounded"
                  >
                    Reset
                  </button>
                  
                  <button
                    onClick={nextStep}
                    disabled={animationStep >= ((bellmanResult || dijkstraResult)?.steps.length || 0) - 1}
                    className="px-3 py-1 bg-gray-500 text-white rounded disabled:bg-gray-300"
                  >
                    Next →
                  </button>
                  
                  <span className="px-3 py-1 bg-gray-100 rounded text-sm">
                    Step {animationStep + 1} / {(bellmanResult || dijkstraResult)?.steps.length || 0}
                  </span>
                </div>

                {/* Negative Cycle Warning */}
                {bellmanResult?.hasNegativeCycle && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <strong>Warning:</strong> Negative cycle detected! Shortest paths are undefined.
                  </div>
                )}

                {/* Current Step Info */}
                {animationStep >= 0 && (
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-purple-800 mb-2">
                      Step {animationStep + 1}: {(bellmanResult || dijkstraResult)?.steps[animationStep]?.description}
                    </h3>
                    <div className="text-sm text-purple-700">
                      <p><strong>Algorithm:</strong> {algorithm === 'bellman-ford' ? 'Bellman-Ford' : 'Dijkstra'}</p>
                      <p><strong>Action:</strong> {(bellmanResult || dijkstraResult)?.steps[animationStep]?.action}</p>
                    </div>
                  </div>
                )}

                {/* Distance Table */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">Distance Table</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border-2 border-gray-800 text-sm">
                      <thead>
                        <tr className="bg-purple-600 text-white">
                          <th className="border-2 border-gray-800 px-4 py-2 font-bold">Node</th>
                          <th className="border-2 border-gray-800 px-4 py-2 font-bold">Distance</th>
                          <th className="border-2 border-gray-800 px-4 py-2 font-bold">Previous</th>
                        </tr>
                      </thead>
                      <tbody>
                        {nodes.map(node => {
                          const result = bellmanResult || dijkstraResult;
                          const step = animationStep >= 0 ? result?.steps[animationStep] : result?.steps[result.steps.length - 1];
                          const distance = step?.distances[node.id] || Infinity;
                          const previous = step?.previous ? step.previous[node.id] : null;
                          
                          return (
                            <tr key={node.id} className={`${
                              step && (step as any).currentNode === node.id ? 'bg-yellow-100' : 'bg-white'
                            }`}>
                              <td className="border-2 border-gray-800 px-4 py-2 font-bold text-purple-800">
                                {node.label}
                              </td>
                              <td className="border-2 border-gray-800 px-4 py-2 text-center font-semibold">
                                {distance === Infinity ? '∞' : distance}
                              </td>
                              <td className="border-2 border-gray-800 px-4 py-2 text-center">
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
                {animationStep === ((bellmanResult || dijkstraResult)?.steps.length || 0) - 1 && !bellmanResult?.hasNegativeCycle && (
                  <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300">
                    <h3 className="font-semibold text-green-800 mb-3">Shortest Paths from {nodes.find(n => n.id === sourceNode)?.label}</h3>
                    <div className="space-y-2 text-sm">
                      {nodes.map(node => {
                        if (node.id === sourceNode) return null;
                        const result = bellmanResult || dijkstraResult;
                        const finalStep = result?.steps[result.steps.length - 1];
                        const distance = finalStep?.distances[node.id] || Infinity;
                        const path = result?.shortestPaths ? result.shortestPaths[node.id] : [];
                        
                        return (
                          <div key={node.id} className="flex justify-between">
                            <span>To {node.label}:</span>
                            <span className="font-mono">
                              {distance === Infinity ? 'No path' : 
                                `Distance: ${distance}, Path: ${path.map((id: number) => nodes.find(n => n.id === id)?.label).join(' → ')}`
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
                <p>Draw a graph and run an algorithm to see the shortest paths</p>
              </div>
            )}
          </div>
        </div>

        {/* Step-by-Step Table */}
        {(bellmanResult || dijkstraResult) && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Step-by-Step Execution Table</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border-2 border-gray-800 text-sm">
                <thead>
                  <tr className="bg-purple-600 text-white">
                    <th className="border-2 border-gray-800 px-4 py-2 font-bold">Step</th>
                    <th className="border-2 border-gray-800 px-4 py-2 font-bold">Description</th>
                    <th className="border-2 border-gray-800 px-4 py-2 font-bold">Action</th>
                    <th className="border-2 border-gray-800 px-4 py-2 font-bold">Distances</th>
                  </tr>
                </thead>
                <tbody>
                  {(bellmanResult || dijkstraResult)?.steps.map((step, index) => (
                    <tr key={index} className={index === animationStep ? 'bg-yellow-100' : 'bg-white'}>
                      <td className="border-2 border-gray-800 px-4 py-2 font-bold text-center">{index + 1}</td>
                      <td className="border-2 border-gray-800 px-4 py-2">{step.description}</td>
                      <td className="border-2 border-gray-800 px-4 py-2">{step.action}</td>
                      <td className="border-2 border-gray-800 px-4 py-2 font-mono text-xs">
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

        {/* Algorithm Comparison */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Algorithm Comparison</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-300">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Bellman-Ford Algorithm</h3>
              <ul className="space-y-2 text-sm text-blue-700">
                <li>✅ Handles negative edge weights</li>
                <li>✅ Detects negative cycles</li>
                <li>✅ Works with directed graphs</li>
                <li>⏱️ Time: O(VE) - slower</li>
                <li>📦 Space: O(V)</li>
                <li>🎯 Use when: Graph has negative weights</li>
              </ul>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300">
              <h3 className="text-lg font-semibold text-green-800 mb-3">Dijkstra&apos;s Algorithm</h3>
              <ul className="space-y-2 text-sm text-green-700">
                <li>❌ Requires non-negative weights</li>
                <li>❌ Cannot detect negative cycles</li>
                <li>✅ Works with directed/undirected graphs</li>
                <li>⚡ Time: O(V²) or O((V+E)logV) - faster</li>
                <li>📦 Space: O(V)</li>
                <li>🎯 Use when: All weights are positive</li>
              </ul>
            </div>
          </div>
        </div>

        {(bellmanResult || dijkstraResult) && (
          <ExamResult
            title={`${algorithm === 'bellman-ford' ? 'Bellman-Ford' : 'Dijkstra'} Single Source Shortest Path`}
            input={`Graph with ${nodes.length} vertices and ${edges.length} edges`}
            result={bellmanResult ? !bellmanResult.hasNegativeCycle : true}
            steps={(bellmanResult || dijkstraResult)?.steps.slice(0, 10).map((step, index) => ({
              stepNumber: index + 1,
              description: step.description,
              currentState: `Distances: [${nodes.map(node => step.distances[node.id] === Infinity ? '∞' : step.distances[node.id]).join(', ')}]`,
              explanation: step.action
            })) || []}
            finalAnswer={
              bellmanResult?.hasNegativeCycle ? 
                "Negative cycle detected - shortest paths undefined" :
                `Shortest distances from ${nodes.find(n => n.id === sourceNode)?.label}: ${nodes.map(node => {
                  const result = bellmanResult || dijkstraResult;
                  const finalStep = result?.steps[result.steps.length - 1];
                  const distance = finalStep?.distances[node.id] || Infinity;
                  return `${node.label}: ${distance === Infinity ? '∞' : distance}`;
                }).join(', ')}`
            }
            examFormat={{
              question: `Find shortest paths from vertex ${nodes.find(n => n.id === sourceNode)?.label} using ${algorithm === 'bellman-ford' ? 'Bellman-Ford' : 'Dijkstra'} algorithm.`,
              solution: [
                `${algorithm === 'bellman-ford' ? 'Bellman-Ford' : 'Dijkstra'} Algorithm Execution:`,
                `Source vertex: ${nodes.find(n => n.id === sourceNode)?.label}`,
                `Graph: ${nodes.length} vertices, ${edges.length} edges`,
                `Algorithm: ${algorithm === 'bellman-ford' ? 'Bellman-Ford (handles negative weights)' : 'Dijkstra (positive weights only)'}`,
                `Edge weights: ${edges.map(e => `(${nodes.find(n => n.id === e.from)?.label}, ${nodes.find(n => n.id === e.to)?.label}): ${e.weight}`).join(', ')}`,
                ...(bellmanResult || dijkstraResult)?.steps.slice(0, 8).map((step, i) => `Step ${i + 1}: ${step.description} - ${step.action}`) || [],
                bellmanResult?.hasNegativeCycle ? 
                  `Result: Negative cycle detected` :
                  `Final shortest distances: ${nodes.map(node => {
                    const result = bellmanResult || dijkstraResult;
                    const finalStep = result?.steps[result.steps.length - 1];
                    const distance = finalStep?.distances[node.id] || Infinity;
                    return `${node.label}: ${distance === Infinity ? '∞' : distance}`;
                  }).join(', ')}`
              ],
              conclusion: bellmanResult?.hasNegativeCycle ?
                `Negative cycle makes shortest paths undefined.` :
                `${algorithm === 'bellman-ford' ? 'Bellman-Ford' : 'Dijkstra'} successfully found shortest paths from source vertex ${nodes.find(n => n.id === sourceNode)?.label}.`,
              marks: 10
            }}
          />
        )}
      </div>
    </div>
  );
}
