"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Route, Play, RotateCcw, Zap } from "lucide-react";

interface Node {
  id: string;
  x: number;
  y: number;
  distance: number;
  previous: string | null;
  visited: boolean;
}

interface Edge {
  from: string;
  to: string;
  weight: number;
}

interface DijkstraStep {
  step: number;
  currentNode: string;
  distances: { [key: string]: number };
  visited: string[];
  description: string;
}

export default function DijkstraPage() {
  const [nodes, setNodes] = useState<{ [key: string]: Node }>({
    A: { id: "A", x: 100, y: 150, distance: Infinity, previous: null, visited: false },
    B: { id: "B", x: 250, y: 100, distance: Infinity, previous: null, visited: false },
    C: { id: "C", x: 400, y: 150, distance: Infinity, previous: null, visited: false },
    D: { id: "D", x: 250, y: 250, distance: Infinity, previous: null, visited: false },
    E: { id: "E", x: 350, y: 300, distance: Infinity, previous: null, visited: false }
  });

  const [edges] = useState<Edge[]>([
    { from: "A", to: "B", weight: 4 },
    { from: "A", to: "D", weight: 2 },
    { from: "B", to: "C", weight: 3 },
    { from: "B", to: "D", weight: 1 },
    { from: "C", to: "E", weight: 2 },
    { from: "D", to: "E", weight: 5 }
  ]);

  const [startNode, setStartNode] = useState("A");
  const [targetNode, setTargetNode] = useState("E");
  const [steps, setSteps] = useState<DijkstraStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [shortestPath, setShortestPath] = useState<string[]>([]);

  const getNeighbors = (nodeId: string): { node: string; weight: number }[] => {
    return edges
      .filter(edge => edge.from === nodeId || edge.to === nodeId)
      .map(edge => ({
        node: edge.from === nodeId ? edge.to : edge.from,
        weight: edge.weight
      }));
  };

  const runDijkstra = () => {
    const nodesCopy = { ...nodes };
    const dijkstraSteps: DijkstraStep[] = [];
    const visited: string[] = [];
    
    // Initialize starting node
    nodesCopy[startNode].distance = 0;
    
    dijkstraSteps.push({
      step: 0,
      currentNode: startNode,
      distances: Object.fromEntries(Object.entries(nodesCopy).map(([id, node]) => [id, node.distance])),
      visited: [...visited],
      description: `Initialize: Set distance to ${startNode} = 0, all others = ∞`
    });

    while (visited.length < Object.keys(nodesCopy).length) {
      // Find unvisited node with minimum distance
      const unvisited = Object.values(nodesCopy).filter(node => !visited.includes(node.id));
      const current = unvisited.reduce((min, node) => 
        node.distance < min.distance ? node : min
      );

      if (current.distance === Infinity) break;

      visited.push(current.id);
      nodesCopy[current.id].visited = true;

      // Update distances to neighbors
      const neighbors = getNeighbors(current.id);
      let updated = false;

      neighbors.forEach(({ node: neighborId, weight }) => {
        if (!visited.includes(neighborId)) {
          const newDistance = current.distance + weight;
          if (newDistance < nodesCopy[neighborId].distance) {
            nodesCopy[neighborId].distance = newDistance;
            nodesCopy[neighborId].previous = current.id;
            updated = true;
          }
        }
      });

      dijkstraSteps.push({
        step: dijkstraSteps.length,
        currentNode: current.id,
        distances: Object.fromEntries(Object.entries(nodesCopy).map(([id, node]) => [id, node.distance])),
        visited: [...visited],
        description: `Visit ${current.id}: ${updated ? 'Updated neighbor distances' : 'No updates needed'}`
      });
    }

    // Build shortest path
    const path: string[] = [];
    let currentPathNode: string | null = targetNode;
    while (currentPathNode !== null) {
      path.unshift(currentPathNode);
      currentPathNode = nodesCopy[currentPathNode].previous;
    }

    setSteps(dijkstraSteps);
    setShortestPath(path);
    setCurrentStep(0);
    setIsRunning(false);
  };

  const resetAlgorithm = () => {
    const resetNodes = { ...nodes };
    Object.values(resetNodes).forEach(node => {
      node.distance = Infinity;
      node.previous = null;
      node.visited = false;
    });
    setNodes(resetNodes);
    setSteps([]);
    setCurrentStep(0);
    setShortestPath([]);
    setIsRunning(false);
  };

  const stepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const stepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getCurrentStepData = () => {
    if (steps.length === 0 || currentStep >= steps.length) return null;
    return steps[currentStep];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/cn/network-layer" className="inline-flex items-center text-green-200 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Network Layer
          </Link>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-white/20 p-3 rounded-xl">
              <Route className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Dijkstra's Algorithm</h1>
              <p className="text-green-100 text-lg">Shortest path algorithm for weighted graphs</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Algorithm Type</h3>
              <p className="text-sm text-green-100">Greedy shortest path</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Time Complexity</h3>
              <p className="text-sm text-green-100">O((V + E) log V)</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Use Case</h3>
              <p className="text-sm text-green-100">Routing protocols (OSPF)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Algorithm Controls</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Node</label>
                <select
                  value={startNode}
                  onChange={(e) => setStartNode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {Object.keys(nodes).map(nodeId => (
                    <option key={nodeId} value={nodeId}>{nodeId}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Node</label>
                <select
                  value={targetNode}
                  onChange={(e) => setTargetNode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {Object.keys(nodes).map(nodeId => (
                    <option key={nodeId} value={nodeId}>{nodeId}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <button
                  onClick={runDijkstra}
                  disabled={isRunning}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  <Play className="h-4 w-4" />
                  <span>Run Algorithm</span>
                </button>
                <button
                  onClick={resetAlgorithm}
                  className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 flex items-center justify-center space-x-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Reset</span>
                </button>
              </div>

              {steps.length > 0 && (
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Step {currentStep + 1} of {steps.length}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={stepBackward}
                      disabled={currentStep === 0}
                      className="flex-1 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={stepForward}
                      disabled={currentStep === steps.length - 1}
                      className="flex-1 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Graph Visualization */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Graph Visualization</h2>
            
            <div className="relative">
              <svg width="500" height="350" className="border border-gray-200 rounded">
                {/* Edges */}
                {edges.map((edge, index) => {
                  const fromNode = nodes[edge.from];
                  const toNode = nodes[edge.to];
                  const isInPath = shortestPath.includes(edge.from) && shortestPath.includes(edge.to) &&
                    Math.abs(shortestPath.indexOf(edge.from) - shortestPath.indexOf(edge.to)) === 1;
                  
                  return (
                    <g key={index}>
                      <line
                        x1={fromNode.x}
                        y1={fromNode.y}
                        x2={toNode.x}
                        y2={toNode.y}
                        stroke={isInPath ? "#ef4444" : "#9ca3af"}
                        strokeWidth={isInPath ? "3" : "2"}
                        className="transition-all duration-300"
                      />
                      <text
                        x={(fromNode.x + toNode.x) / 2}
                        y={(fromNode.y + toNode.y) / 2 - 10}
                        textAnchor="middle"
                        className="text-sm font-medium fill-gray-700"
                      >
                        {edge.weight}
                      </text>
                    </g>
                  );
                })}

                {/* Nodes */}
                {Object.values(nodes).map(node => {
                  const currentData = getCurrentStepData();
                  const isCurrentNode = currentData?.currentNode === node.id;
                  const isVisited = currentData?.visited.includes(node.id) || false;
                  const currentDistance = currentData?.distances[node.id] ?? Infinity;
                  
                  return (
                    <g key={node.id}>
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="25"
                        fill={
                          isCurrentNode ? "#fbbf24" :
                          isVisited ? "#10b981" :
                          node.id === startNode ? "#3b82f6" :
                          node.id === targetNode ? "#ef4444" :
                          "#e5e7eb"
                        }
                        stroke="#374151"
                        strokeWidth="2"
                        className="transition-all duration-300"
                      />
                      <text
                        x={node.x}
                        y={node.y + 5}
                        textAnchor="middle"
                        className="text-lg font-bold fill-white"
                      >
                        {node.id}
                      </text>
                      <text
                        x={node.x}
                        y={node.y - 35}
                        textAnchor="middle"
                        className="text-sm font-medium fill-gray-700"
                      >
                        {currentDistance === Infinity ? "∞" : currentDistance}
                      </text>
                    </g>
                  );
                })}
              </svg>

              <div className="mt-4 text-sm text-gray-600">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span>Start Node</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span>Target Node</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <span>Current Node</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span>Visited</span>
                  </div>
                </div>
              </div>
            </div>

            {getCurrentStepData() && (
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Current Step</h3>
                <p className="text-sm text-blue-700">{getCurrentStepData()?.description}</p>
              </div>
            )}

            {shortestPath.length > 0 && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">Shortest Path</h3>
                <p className="text-sm text-green-700">
                  <span className="font-mono">{shortestPath.join(" → ")}</span>
                  <span className="ml-2">
                    (Distance: {getCurrentStepData()?.distances[targetNode] ?? "∞"})
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Algorithm Steps */}
        {steps.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Algorithm Steps</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Step</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Current Node</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Distances</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Visited</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {steps.map((step, index) => (
                    <tr 
                      key={index} 
                      className={`${index === currentStep ? "bg-yellow-100" : index % 2 === 0 ? "bg-gray-50" : ""}`}
                    >
                      <td className="border border-gray-300 px-4 py-2 font-medium">{step.step}</td>
                      <td className="border border-gray-300 px-4 py-2 font-mono text-center">
                        {step.currentNode}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 font-mono text-xs">
                        {Object.entries(step.distances)
                          .map(([node, dist]) => `${node}:${dist === Infinity ? "∞" : dist}`)
                          .join(" ")}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 font-mono">
                        {step.visited.join(", ")}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">{step.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Algorithm Explanation */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Dijkstra's Algorithm Explanation</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">How It Works</h3>
              <ol className="space-y-2 text-gray-600">
                <li><strong>1. Initialize:</strong> Set distance to start node = 0, all others = ∞</li>
                <li><strong>2. Select:</strong> Choose unvisited node with minimum distance</li>
                <li><strong>3. Update:</strong> Calculate distances to all neighbors</li>
                <li><strong>4. Mark:</strong> Mark current node as visited</li>
                <li><strong>5. Repeat:</strong> Continue until all nodes visited or target reached</li>
              </ol>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-3">Applications</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Network routing protocols (OSPF)</li>
                  <li>• GPS navigation systems</li>
                  <li>• Social network analysis</li>
                  <li>• Flight connection systems</li>
                  <li>• Game pathfinding</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-3">Key Properties</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Greedy algorithm approach</li>
                  <li>• Works with non-negative weights</li>
                  <li>• Guarantees shortest path</li>
                  <li>• Single-source shortest path</li>
                  <li>• Optimal substructure property</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
