"use client";

import React, { useState, useRef, useEffect } from "react";
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [numVertices, setNumVertices] = useState(4);
  const [graph, setGraph] = useState([
    [0, 5, Infinity, 10],
    [Infinity, 0, 3, Infinity],
    [Infinity, Infinity, 0, 1],
    [Infinity, Infinity, Infinity, 0]
  ]);
  const [result, setResult] = useState<FloydWarshallResult | null>(null);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [isDrawingMode, setIsDrawingMode] = useState<'node' | 'edge' | 'none'>('none');
  const [edgeStart, setEdgeStart] = useState<number | null>(null);
  const [edgeWeight, setEdgeWeight] = useState<string>('1');
  const [animationStep, setAnimationStep] = useState<number>(-1);

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
  }, []);

  useEffect(() => {
    drawGraph();
  }, [nodes, edges, selectedNode]);

  const updateGraphFromVisual = (nodeList: Node[], edgeList: Edge[]) => {
    const n = nodeList.length;
    if (n === 0) return;
    
    const newGraph = Array(n).fill(null).map(() => Array(n).fill(Infinity));
    
    // Initialize diagonal to 0
    for (let i = 0; i < n; i++) {
      newGraph[i][i] = 0;
    }

    // Add edges
    edgeList.forEach(edge => {
      newGraph[edge.from][edge.to] = edge.weight;
    });

    setGraph(newGraph);
    setNumVertices(n);
  };

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
        ctx.strokeStyle = '#6b7280';
        ctx.lineWidth = 2;
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
        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 14px Arial';
        ctx.fillText(edge.weight.toString(), midX - 10, midY - 5);
      }
    });

    // Draw nodes
    nodes.forEach(node => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
      ctx.fillStyle = selectedNode === node.id ? '#3b82f6' : '#e5e7eb';
      ctx.fill();
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw label
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(node.label, node.x, node.y + 5);
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
      const newNodes = [...nodes, newNode];
      setNodes(newNodes);
      updateGraphFromVisual(newNodes, edges);
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
          updateGraphFromVisual(nodes, newEdges);
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

  const handleSolve = () => {
    const output = floydWarshall(graph);
    setResult(output);
    setAnimationStep(0);
  };

  const clearGraph = () => {
    setNodes([]);
    setEdges([]);
    setGraph([]);
    setResult(null);
    setAnimationStep(-1);
    setSelectedNode(null);
    setEdgeStart(null);
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
  };

  const updateGraphCell = (i: number, j: number, value: string) => {
    const newGraph = graph.map(row => [...row]);
    const numValue = value === '' || value === 'inf' ? Infinity : parseInt(value);
    if (!isNaN(numValue) || value === 'inf' || value === '') {
      newGraph[i][j] = numValue;
      setGraph(newGraph);
    }
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
              "Space complexity O(V²) for distance matrix"
            ],
            applications: [
              "Network routing protocols",
              "Social network analysis (finding influencers)",
              "Game pathfinding with multiple objectives",
              "Supply chain optimization"
            ]
          }}
          mumbaiUniversity={{
            syllabus: [
              "All-pairs shortest path problem",
              "Floyd-Warshall algorithm implementation",
              "Dynamic programming formulation",
              "Negative cycle detection",
              "Time and space complexity analysis"
            ],
            marks: "6-8 marks",
            commonQuestions: [
              "Apply Floyd-Warshall to given graph",
              "Show step-by-step matrix updates",
              "Detect negative cycles",
              "Compare with Dijkstra's algorithm"
            ],
            examTips: [
              "Update distance matrix for each intermediate vertex k",
              "Check if dist[i][k] + dist[k][j] < dist[i][j]",
              "Show all intermediate matrices",
              "Check diagonal for negative cycles"
            ]
          }}
          algorithm={{
            steps: [
              "Initialize distance matrix with graph weights",
              "Set dist[i][i] = 0 for all vertices i",
              "For each vertex k as intermediate:",
              "  For each pair of vertices (i,j):",
              "    if dist[i][k] + dist[k][j] < dist[i][j]:",
              "      dist[i][j] = dist[i][k] + dist[k][j]",
              "Check for negative cycles on diagonal"
            ],
            complexity: {
              time: "O(V³) - three nested loops over vertices",
              space: "O(V²) - distance matrix storage"
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
              </div>

              <button
                onClick={handleSolve}
                disabled={nodes.length === 0}
                className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold disabled:bg-gray-400"
              >
                Run Floyd-Warshall Algorithm
              </button>
            </div>

            <div className="border border-gray-300 rounded-lg">
              <canvas
                ref={canvasRef}
                width={400}
                height={300}
                className="border rounded-lg cursor-pointer bg-gray-50"
                onClick={handleCanvasClick}
              />
            </div>

            <div className="mt-4 text-sm text-gray-600">
              <p><strong>Instructions:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Click &quot;Add Node&quot; then click on canvas to add vertices</li>
                <li>Click &quot;Add Edge&quot;, set weight, then click two nodes to connect (directed)</li>
                <li>Run the algorithm to find all shortest paths</li>
              </ul>
            </div>
          </div>

          {/* Manual Matrix Input */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Manual Matrix Input</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Vertices
                </label>
                <select
                  value={numVertices}
                  onChange={(e) => resizeGraph(parseInt(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  {[3, 4, 5, 6].map(size => (
                    <option key={size} value={size}>{size} vertices</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Adjacency Matrix (use 'inf' for ∞)
                </label>
                <div className="overflow-x-auto">
                  <table className="border-collapse border border-gray-400">
                    <thead>
                      <tr>
                        <th className="border border-gray-400 p-2 bg-gray-100"></th>
                        {Array.from({ length: numVertices }, (_, i) => (
                          <th key={i} className="border border-gray-400 p-2 bg-gray-100 font-bold text-gray-800">
                            {String.fromCharCode(65 + i)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: numVertices }, (_, i) => (
                        <tr key={i}>
                          <td className="border border-gray-400 p-2 bg-gray-100 font-bold text-gray-800">
                            {String.fromCharCode(65 + i)}
                          </td>
                          {Array.from({ length: numVertices }, (_, j) => (
                            <td key={j} className="border border-gray-400 p-1">
                              <input
                                type="text"
                                value={graph[i] && graph[i][j] !== undefined ? 
                                  (graph[i][j] === Infinity ? 'inf' : graph[i][j].toString()) : '0'}
                                onChange={(e) => updateGraphCell(i, j, e.target.value)}
                                className="w-16 p-1 text-center text-sm border-0 focus:ring-2 focus:ring-indigo-500"
                                disabled={i === j}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleSolve}
                  className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
                >
                  Find All Shortest Paths
                </button>
                <button
                  onClick={generateRandomGraph}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Random
                </button>
              </div>
            </div>
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
                      className="p-3 bg-white rounded border-2 border-gray-300 shadow-sm"
                    >
                      <div className="flex items-center">
                        <span className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                          {index + 1}
                        </span>
                        <span className="text-gray-800 font-medium">{step}</span>
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
              description: step,
              currentState: `Matrix update iteration ${index + 1}`,
              explanation: step
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
                ...result.steps.slice(0, 10),
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
