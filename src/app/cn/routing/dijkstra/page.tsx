"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Route, MapPin, Play, RotateCcw, Plus, Minus } from "lucide-react";

interface Edge {
  from: number;
  to: number;
  weight: number;
}

interface DijkstraStep {
  step: number;
  current: number;
  distances: number[];
  visited: boolean[];
  previous: (number | null)[];
  description: string;
}

export default function DijkstraPage() {
  const [numVertices, setNumVertices] = useState(5);
  const [edges, setEdges] = useState<Edge[]>([
    { from: 0, to: 1, weight: 4 },
    { from: 0, to: 2, weight: 2 },
    { from: 1, to: 2, weight: 1 },
    { from: 1, to: 3, weight: 5 },
    { from: 2, to: 3, weight: 8 },
    { from: 2, to: 4, weight: 10 },
    { from: 3, to: 4, weight: 2 }
  ]);
  const [sourceVertex, setSourceVertex] = useState(0);
  const [steps, setSteps] = useState<DijkstraStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const runDijkstra = () => {
    const distances = new Array(numVertices).fill(Infinity);
    const visited = new Array(numVertices).fill(false);
    const previous = new Array(numVertices).fill(null);
    const stepsArray: DijkstraStep[] = [];

    distances[sourceVertex] = 0;

    // Initial step
    stepsArray.push({
      step: 0,
      current: -1,
      distances: [...distances],
      visited: [...visited],
      previous: [...previous],
      description: `Initialize: Set distance to source vertex ${sourceVertex} as 0, all others as ∞`
    });

    for (let count = 0; count < numVertices; count++) {
      // Find minimum distance vertex not yet visited
      let minDistance = Infinity;
      let minVertex = -1;
      
      for (let v = 0; v < numVertices; v++) {
        if (!visited[v] && distances[v] <= minDistance) {
          minDistance = distances[v];
          minVertex = v;
        }
      }

      if (minVertex === -1) break; // No more reachable vertices

      visited[minVertex] = true;

      stepsArray.push({
        step: stepsArray.length,
        current: minVertex,
        distances: [...distances],
        visited: [...visited],
        previous: [...previous],
        description: `Select vertex ${minVertex} with minimum distance ${distances[minVertex]}`
      });

      // Update distances of adjacent vertices
      const adjacentEdges = edges.filter(edge => edge.from === minVertex);
      
      for (const edge of adjacentEdges) {
        const neighbor = edge.to;
        const newDistance = distances[minVertex] + edge.weight;
        
        if (!visited[neighbor] && newDistance < distances[neighbor]) {
          distances[neighbor] = newDistance;
          previous[neighbor] = minVertex;
          
          stepsArray.push({
            step: stepsArray.length,
            current: minVertex,
            distances: [...distances],
            visited: [...visited],
            previous: [...previous],
            description: `Update distance to vertex ${neighbor}: ${distances[neighbor]} (via vertex ${minVertex})`
          });
        }
      }
    }

    setSteps(stepsArray);
    setCurrentStep(0);
  };

  const getShortestPath = (target: number): number[] => {
    if (currentStep === 0 || target >= steps[currentStep].previous.length) return [];
    
    const path: number[] = [];
    let current: number | null = target;
    const previous = steps[currentStep].previous;
    
    while (current !== null) {
      path.unshift(current);
      current = previous[current];
    }
    
    return path.length > 1 ? path : [];
  };

  const playAnimation = () => {
    setIsPlaying(true);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setCurrentStep(step);
      if (step >= steps.length - 1) {
        setIsPlaying(false);
        clearInterval(interval);
      }
    }, 1500);
  };

  const addEdge = (from: number, to: number, weight: number) => {
    if (from >= 0 && from < numVertices && to >= 0 && to < numVertices && weight > 0) {
      setEdges([...edges, { from, to, weight }]);
    }
  };

  const removeEdge = (index: number) => {
    setEdges(edges.filter((_, i) => i !== index));
  };

  useEffect(() => {
    runDijkstra();
  }, [numVertices, edges, sourceVertex]);

  const currentData = currentStep < steps.length ? steps[currentStep] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/cn/routing" className="inline-flex items-center text-green-200 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Routing
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
              <p className="text-sm text-green-100">Network routing protocols</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Controls */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Graph Configuration</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Vertices</label>
                <input
                  type="number"
                  min="3"
                  max="8"
                  value={numVertices}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNumVertices(parseInt(e.target.value) || 3)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Source Vertex</label>
                <input
                  type="number"
                  min="0"
                  max={numVertices - 1}
                  value={sourceVertex}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSourceVertex(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Add Edge</label>
                <div className="grid grid-cols-3 gap-2">
                  <input placeholder="From" id="edge-from" type="number" min="0" max={numVertices-1} className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                  <input placeholder="To" id="edge-to" type="number" min="0" max={numVertices-1} className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                  <input placeholder="Weight" id="edge-weight" type="number" min="1" className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <button
                  onClick={() => {
                    const from = parseInt((document.getElementById('edge-from') as HTMLInputElement).value);
                    const to = parseInt((document.getElementById('edge-to') as HTMLInputElement).value);
                    const weight = parseInt((document.getElementById('edge-weight') as HTMLInputElement).value);
                    addEdge(from, to, weight);
                    (document.getElementById('edge-from') as HTMLInputElement).value = '';
                    (document.getElementById('edge-to') as HTMLInputElement).value = '';
                    (document.getElementById('edge-weight') as HTMLInputElement).value = '';
                  }}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Edge</span>
                </button>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Current Edges</label>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {edges.map((edge, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-100 border border-gray-300 p-2 rounded">
                      <span className="text-sm text-gray-700">{edge.from} → {edge.to} (w: {edge.weight})</span>
                      <button
                        onClick={() => removeEdge(index)}
                        className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <button 
                  onClick={runDijkstra} 
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center space-x-2"
                >
                  <Play className="h-4 w-4" />
                  <span>Run Algorithm</span>
                </button>
                <button 
                  onClick={playAnimation} 
                  disabled={isPlaying || steps.length === 0}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isPlaying ? (
                    <>
                      <RotateCcw className="h-4 w-4 animate-spin" />
                      <span>Playing...</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      <span>Play Animation</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Visualization */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Graph Visualization</h2>
            
            <div className="relative bg-gray-100 rounded-lg border-2 border-gray-300 h-96 overflow-hidden">
              <svg width="100%" height="100%" viewBox="0 0 400 300">
                {/* Draw edges */}
                {edges.map((edge, index) => {
                  const fromX = 60 + (edge.from % 3) * 120;
                  const fromY = 60 + Math.floor(edge.from / 3) * 80;
                  const toX = 60 + (edge.to % 3) * 120;
                  const toY = 60 + Math.floor(edge.to / 3) * 80;
                  
                  return (
                    <g key={index}>
                      <line
                        x1={fromX}
                        y1={fromY}
                        x2={toX}
                        y2={toY}
                        stroke="#6B7280"
                        strokeWidth="2"
                        markerEnd="url(#arrowhead)"
                      />
                      <text
                        x={(fromX + toX) / 2}
                        y={(fromY + toY) / 2 - 5}
                        textAnchor="middle"
                        className="text-sm font-medium fill-blue-600"
                      >
                        {edge.weight}
                      </text>
                    </g>
                  );
                })}

                {/* Arrow marker definition */}
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="10"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon
                      points="0 0, 10 3.5, 0 7"
                      fill="#6B7280"
                    />
                  </marker>
                </defs>

                {/* Draw vertices */}
                {Array.from({ length: numVertices }).map((_, vertex) => {
                  const x = 60 + (vertex % 3) * 120;
                  const y = 60 + Math.floor(vertex / 3) * 80;
                  const isVisited = currentData?.visited[vertex] || false;
                  const isCurrent = currentData?.current === vertex;
                  const distance = currentData?.distances[vertex] ?? Infinity;
                  
                  return (
                    <g key={vertex}>
                      <circle
                        cx={x}
                        cy={y}
                        r="20"
                        fill={
                          isCurrent ? "#EF4444" :
                          isVisited ? "#10B981" :
                          vertex === sourceVertex ? "#3B82F6" :
                          "#E5E7EB"
                        }
                        stroke="#374151"
                        strokeWidth="2"
                      />
                      <text
                        x={x}
                        y={y + 5}
                        textAnchor="middle"
                        className="text-sm font-bold fill-white"
                      >
                        {vertex}
                      </text>
                      <text
                        x={x}
                        y={y + 35}
                        textAnchor="middle"
                        className="text-xs font-medium fill-gray-700"
                      >
                        {distance === Infinity ? "∞" : distance}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-700">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                <span>Source</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                <span>Current</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                <span>Visited</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-300 rounded-full mr-2"></div>
                <span>Unvisited</span>
              </div>
            </div>
          </div>

          {/* Algorithm Steps */}
          <div className="lg:col-span-3 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Algorithm Steps</h2>
            
            {currentData && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">
                    Step {currentData.step}: {currentData.description}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Distance Table */}
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-800">Distance Table</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full border border-gray-300">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-2 py-1 text-gray-700">Vertex</th>
                            <th className="border border-gray-300 px-2 py-1 text-gray-700">Distance</th>
                            <th className="border border-gray-300 px-2 py-1 text-gray-700">Visited</th>
                            <th className="border border-gray-300 px-2 py-1 text-gray-700">Previous</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentData.distances.map((distance, index) => (
                            <tr key={index} className={currentData.current === index ? "bg-red-100" : "bg-white"}>
                              <td className="border border-gray-300 px-2 py-1 text-center font-medium text-gray-700">
                                {index}
                              </td>
                              <td className="border border-gray-300 px-2 py-1 text-center text-gray-700">
                                {distance === Infinity ? "∞" : distance}
                              </td>
                              <td className="border border-gray-300 px-2 py-1 text-center text-gray-700">
                                {currentData.visited[index] ? "✓" : "✗"}
                              </td>
                              <td className="border border-gray-300 px-2 py-1 text-center text-gray-700">
                                {currentData.previous[index] !== null ? currentData.previous[index] : "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Shortest Paths */}
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-800">Shortest Paths from Source {sourceVertex}</h4>
                    <div className="space-y-2">
                      {Array.from({ length: numVertices }).map((_, vertex) => {
                        if (vertex === sourceVertex) return null;
                        const path = getShortestPath(vertex);
                        const distance = currentData.distances[vertex];
                        
                        return (
                          <div key={vertex} className="bg-gray-50 border border-gray-200 p-2 rounded">
                            <div className="font-medium text-gray-800">To vertex {vertex}:</div>
                            <div className="text-sm text-gray-600">
                              Distance: {distance === Infinity ? "∞" : distance}
                            </div>
                            <div className="text-sm text-gray-600">
                              Path: {path.length > 0 ? path.join(" → ") : "No path"}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Step Navigation */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous Step
                  </button>
                  <span className="text-sm text-gray-600">
                    Step {currentStep + 1} of {steps.length}
                  </span>
                  <button
                    onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                    disabled={currentStep === steps.length - 1}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Algorithm Explanation */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Algorithm Explanation</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3 text-gray-800">How Dijkstra's Algorithm Works:</h3>
              <ol className="space-y-2 text-sm text-gray-600">
                <li><strong>1. Initialize:</strong> Set distance to source as 0, all others as infinity</li>
                <li><strong>2. Select:</strong> Choose unvisited vertex with minimum distance</li>
                <li><strong>3. Update:</strong> Update distances to all adjacent unvisited vertices</li>
                <li><strong>4. Mark:</strong> Mark current vertex as visited</li>
                <li><strong>5. Repeat:</strong> Continue until all vertices are visited</li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-gray-800">Key Properties:</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• <strong>Greedy Choice:</strong> Always selects minimum distance vertex</li>
                <li>• <strong>Optimal Substructure:</strong> Shortest path has shortest subpaths</li>
                <li>• <strong>No Negative Weights:</strong> Algorithm assumes all weights ≥ 0</li>
                <li>• <strong>Single Source:</strong> Finds shortest paths from one source to all vertices</li>
                <li>• <strong>Time Complexity:</strong> O(V²) with array, O(V log V) with heap</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
