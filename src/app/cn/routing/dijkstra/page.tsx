"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Dijkstra&apos;s Shortest Path Algorithm
          </h1>
          <p className="text-lg text-gray-200 max-w-3xl mx-auto">
            Find the shortest path from a source vertex to all other vertices using Dijkstra&apos;s greedy algorithm.
            Time Complexity: O(V²) with adjacency matrix, O(V log V) with priority queue.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Graph Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Number of Vertices</label>
                <Input
                  type="number"
                  min="3"
                  max="8"
                  value={numVertices}
                  onChange={(e) => setNumVertices(parseInt(e.target.value) || 3)}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Source Vertex</label>
                <Input
                  type="number"
                  min="0"
                  max={numVertices - 1}
                  value={sourceVertex}
                  onChange={(e) => setSourceVertex(parseInt(e.target.value) || 0)}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Add Edge</label>
                <div className="grid grid-cols-3 gap-2">
                  <Input placeholder="From" id="edge-from" type="number" min="0" max={numVertices-1} />
                  <Input placeholder="To" id="edge-to" type="number" min="0" max={numVertices-1} />
                  <Input placeholder="Weight" id="edge-weight" type="number" min="1" />
                </div>
                <Button
                  onClick={() => {
                    const from = parseInt((document.getElementById('edge-from') as HTMLInputElement).value);
                    const to = parseInt((document.getElementById('edge-to') as HTMLInputElement).value);
                    const weight = parseInt((document.getElementById('edge-weight') as HTMLInputElement).value);
                    addEdge(from, to, weight);
                    (document.getElementById('edge-from') as HTMLInputElement).value = '';
                    (document.getElementById('edge-to') as HTMLInputElement).value = '';
                    (document.getElementById('edge-weight') as HTMLInputElement).value = '';
                  }}
                  className="w-full"
                >
                  Add Edge
                </Button>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Current Edges</label>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {edges.map((edge, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-700 border border-gray-600 p-2 rounded">
                      <span className="text-sm text-gray-200">{edge.from} → {edge.to} (w: {edge.weight})</span>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeEdge(index)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Button onClick={runDijkstra} className="w-full">
                  Run Algorithm
                </Button>
                <Button 
                  onClick={playAnimation} 
                  disabled={isPlaying || steps.length === 0}
                  className="w-full"
                >
                  {isPlaying ? "Playing..." : "Play Animation"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Visualization */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Graph Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative bg-gray-800 rounded-lg border-2 border-gray-600 h-96 overflow-hidden">
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
                          stroke="#9CA3AF"
                          strokeWidth="2"
                          markerEnd="url(#arrowhead)"
                        />
                        <text
                          x={(fromX + toX) / 2}
                          y={(fromY + toY) / 2 - 5}
                          textAnchor="middle"
                          className="text-sm font-medium fill-blue-400"
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
                        fill="#9CA3AF"
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
                          className="text-xs font-medium fill-gray-200"
                        >
                          {distance === Infinity ? "∞" : distance}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Legend */}
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-200">
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
            </CardContent>
          </Card>

          {/* Algorithm Steps */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Algorithm Steps</CardTitle>
            </CardHeader>
            <CardContent>
              {currentData && (
                <div className="space-y-4">
                  <div className="bg-blue-800 border border-blue-600 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-200 mb-2">
                      Step {currentData.step}: {currentData.description}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Distance Table */}
                    <div>
                      <h4 className="font-semibold mb-2 text-gray-200">Distance Table</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full border border-gray-600">
                          <thead>
                            <tr className="bg-gray-700">
                              <th className="border border-gray-600 px-2 py-1 text-gray-200">Vertex</th>
                              <th className="border border-gray-600 px-2 py-1 text-gray-200">Distance</th>
                              <th className="border border-gray-600 px-2 py-1 text-gray-200">Visited</th>
                              <th className="border border-gray-600 px-2 py-1 text-gray-200">Previous</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentData.distances.map((distance, index) => (
                              <tr key={index} className={currentData.current === index ? "bg-red-800" : "bg-gray-800"}>
                                <td className="border border-gray-600 px-2 py-1 text-center font-medium text-gray-200">
                                  {index}
                                </td>
                                <td className="border border-gray-600 px-2 py-1 text-center text-gray-200">
                                  {distance === Infinity ? "∞" : distance}
                                </td>
                                <td className="border border-gray-600 px-2 py-1 text-center text-gray-200">
                                  {currentData.visited[index] ? "✓" : "✗"}
                                </td>
                                <td className="border border-gray-600 px-2 py-1 text-center text-gray-200">
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
                      <h4 className="font-semibold mb-2 text-gray-200">Shortest Paths from Source {sourceVertex}</h4>
                      <div className="space-y-2">
                        {Array.from({ length: numVertices }).map((_, vertex) => {
                          if (vertex === sourceVertex) return null;
                          const path = getShortestPath(vertex);
                          const distance = currentData.distances[vertex];
                          
                          return (
                            <div key={vertex} className="bg-gray-700 border border-gray-600 p-2 rounded">
                              <div className="font-medium text-gray-200">To vertex {vertex}:</div>
                              <div className="text-sm text-gray-300">
                                Distance: {distance === Infinity ? "∞" : distance}
                              </div>
                              <div className="text-sm text-gray-300">
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
                    <Button
                      onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                      disabled={currentStep === 0}
                    >
                      Previous Step
                    </Button>
                    <span className="text-sm text-gray-600">
                      Step {currentStep + 1} of {steps.length}
                    </span>
                    <Button
                      onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                      disabled={currentStep === steps.length - 1}
                    >
                      Next Step
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Algorithm Explanation */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Algorithm Explanation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">How Dijkstra's Algorithm Works:</h3>
                <ol className="space-y-2 text-sm">
                  <li><strong>1. Initialize:</strong> Set distance to source as 0, all others as infinity</li>
                  <li><strong>2. Select:</strong> Choose unvisited vertex with minimum distance</li>
                  <li><strong>3. Update:</strong> Update distances to all adjacent unvisited vertices</li>
                  <li><strong>4. Mark:</strong> Mark current vertex as visited</li>
                  <li><strong>5. Repeat:</strong> Continue until all vertices are visited</li>
                </ol>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Key Properties:</h3>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Greedy Choice:</strong> Always selects minimum distance vertex</li>
                  <li>• <strong>Optimal Substructure:</strong> Shortest path has shortest subpaths</li>
                  <li>• <strong>No Negative Weights:</strong> Algorithm assumes all weights ≥ 0</li>
                  <li>• <strong>Single Source:</strong> Finds shortest paths from one source to all vertices</li>
                  <li>• <strong>Time Complexity:</strong> O(V²) with array, O(V log V) with heap</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
