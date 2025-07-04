"use client";

import React, { useState, useRef, useEffect } from "react";
import { bellmanFordAlgorithm, BellmanFordResult } from "@/app/utils/dynamicProgramming";
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

export default function BellmanFordPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [sourceNode, setSourceNode] = useState<number>(0);
  const [isDrawingMode, setIsDrawingMode] = useState<'node' | 'edge' | 'none'>('none');
  const [edgeStart, setEdgeStart] = useState<number | null>(null);
  const [edgeWeight, setEdgeWeight] = useState<string>('1');
  const [result, setResult] = useState<BellmanFordResult | null>(null);
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
      { from: 1, to: 3, weight: -2 },
      { from: 2, to: 4, weight: 2 },
      { from: 3, to: 4, weight: 5 }
    ];

    setNodes(sampleNodes);
    setEdges(sampleEdges);
  }, []);

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
    edges.forEach((edge) => {
      const fromNode = nodes.find(n => n.id === edge.from);
      const toNode = nodes.find(n => n.id === edge.to);
      
      if (fromNode && toNode) {
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        
        // Highlight edge if it's being relaxed
        if (result && animationStep >= 0) {
          const step = result.steps[animationStep];
          if (step && step.edgeBeingRelaxed && 
              step.edgeBeingRelaxed.from === edge.from && 
              step.edgeBeingRelaxed.to === edge.to) {
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 4;
          } else {
            ctx.strokeStyle = edge.weight < 0 ? '#dc2626' : '#6b7280';
            ctx.lineWidth = 2;
          }
        } else {
          ctx.strokeStyle = edge.weight < 0 ? '#dc2626' : '#6b7280';
          ctx.lineWidth = 2;
        }
        
        ctx.stroke();

        // Draw arrow for directed edge
        const angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x);
        const arrowLength = 15;
        const arrowAngle = Math.PI / 6;
        
        ctx.beginPath();
        ctx.moveTo(toNode.x - 20 * Math.cos(angle), toNode.y - 20 * Math.sin(angle));
        ctx.lineTo(
          toNode.x - 20 * Math.cos(angle) - arrowLength * Math.cos(angle - arrowAngle),
          toNode.y - 20 * Math.sin(angle) - arrowLength * Math.sin(angle - arrowAngle)
        );
        ctx.moveTo(toNode.x - 20 * Math.cos(angle), toNode.y - 20 * Math.sin(angle));
        ctx.lineTo(
          toNode.x - 20 * Math.cos(angle) - arrowLength * Math.cos(angle + arrowAngle),
          toNode.y - 20 * Math.sin(angle) - arrowLength * Math.sin(angle + arrowAngle)
        );
        ctx.stroke();

        // Draw weight
        const midX = (fromNode.x + toNode.x) / 2;
        const midY = (fromNode.y + toNode.y) / 2;
        ctx.fillStyle = edge.weight < 0 ? '#dc2626' : '#1f2937';
        ctx.font = 'bold 14px Arial';
        ctx.fillText(edge.weight.toString(), midX - 10, midY - 5);
      }
    });

    // Draw nodes
    nodes.forEach(node => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
      
      if (node.id === sourceNode) {
        ctx.fillStyle = '#ef4444'; // Source - red
      } else if (selectedNode === node.id) {
        ctx.fillStyle = '#3b82f6'; // Selected - blue
      } else {
        ctx.fillStyle = '#e5e7eb'; // Default - gray
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
          ctx.font = 'bold 12px Arial';
          ctx.fillText(step.distances[node.id].toString(), node.x, node.y - 30);
        } else if (step && step.distances[node.id] === Infinity) {
          ctx.fillStyle = '#6b7280';
          ctx.font = '12px Arial';
          ctx.fillText('∞', node.x, node.y - 30);
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
      const newNode: Node = {
        id: nodes.length,
        x,
        y,
        label: String.fromCharCode(65 + nodes.length)
      };
      setNodes([...nodes, newNode]);
    } else if (isDrawingMode === 'edge') {
      const clickedNode = nodes.find(node => 
        Math.sqrt(Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2)) < 25
      );

      if (clickedNode) {
        if (edgeStart === null) {
          setEdgeStart(clickedNode.id);
        } else if (edgeStart !== clickedNode.id) {
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
      const clickedNode = nodes.find(node => 
        Math.sqrt(Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2)) < 25
      );
      setSelectedNode(clickedNode ? clickedNode.id : null);
    }
  };

  const runBellmanFord = () => {
    if (nodes.length === 0) return;

    const bellmanFordResult = bellmanFordAlgorithm(edges, nodes.length, sourceNode);
    setResult(bellmanFordResult);
    setAnimationStep(0);
  };

  const clearGraph = () => {
    setNodes([]);
    setEdges([]);
    setResult(null);
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
      { from: 1, to: 3, weight: -2 },
      { from: 2, to: 4, weight: 2 },
      { from: 3, to: 4, weight: 5 }
    ];

    setNodes(sampleNodes);
    setEdges(sampleEdges);
    setResult(null);
    setAnimationStep(-1);
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
          mumbaiUniversity={{
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
                <li>Click &quot;Add Edge&quot;, set weight, then click two nodes to connect</li>
                <li>Negative weights are allowed (shown in red)</li>
                <li>Select source node and run the algorithm</li>
              </ul>
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
