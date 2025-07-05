"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Network, Play, RotateCcw } from "lucide-react";

interface Node {
  id: string;
  x: number;
  y: number;
}

interface Edge {
  from: string;
  to: string;
  weight: number;
}

interface RouteEntry {
  distance: number;
  nextHop: string | null;
}

interface RoutingTable {
  [destination: string]: RouteEntry;
}

interface RoutingTables {
  [nodeId: string]: RoutingTable;
}

export default function DistanceVectorPage() {
  const [nodes, setNodes] = useState<Node[]>([
    { id: 'A', x: 100, y: 100 },
    { id: 'B', x: 300, y: 100 },
    { id: 'C', x: 200, y: 250 },
    { id: 'D', x: 400, y: 250 }
  ]);
  
  const [edges, setEdges] = useState<Edge[]>([
    { from: 'A', to: 'B', weight: 2 },
    { from: 'A', to: 'C', weight: 5 },
    { from: 'B', to: 'C', weight: 1 },
    { from: 'B', to: 'D', weight: 3 },
    { from: 'C', to: 'D', weight: 2 }
  ]);

  const [routingTables, setRoutingTables] = useState<RoutingTables>({});
  const [iteration, setIteration] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [history, setHistory] = useState<RoutingTables[]>([]);

  useEffect(() => {
    initializeRoutingTables();
  }, [nodes, edges]);

  const initializeRoutingTables = () => {
    const tables: RoutingTables = {};
    nodes.forEach(node => {
      tables[node.id] = {};
      nodes.forEach(dest => {
        if (node.id === dest.id) {
          tables[node.id][dest.id] = { distance: 0, nextHop: node.id };
        } else {
          const directEdge = edges.find(e => 
            (e.from === node.id && e.to === dest.id) || 
            (e.from === dest.id && e.to === node.id)
          );
          if (directEdge) {
            tables[node.id][dest.id] = { distance: directEdge.weight, nextHop: dest.id };
          } else {
            tables[node.id][dest.id] = { distance: Infinity, nextHop: null };
          }
        }
      });
    });
    setRoutingTables(tables);
    setHistory([JSON.parse(JSON.stringify(tables)) as RoutingTables]);
  };

  const getNeighbors = (nodeId: string): string[] => {
    return edges.filter(edge => 
      edge.from === nodeId || edge.to === nodeId
    ).map(edge => 
      edge.from === nodeId ? edge.to : edge.from
    );
  };

  const runDistanceVectorIteration = () => {
    const newTables: RoutingTables = JSON.parse(JSON.stringify(routingTables));
    let updated = false;

    nodes.forEach(node => {
      const neighbors = getNeighbors(node.id);
      
      nodes.forEach(dest => {
        if (node.id !== dest.id) {
          let minDistance = newTables[node.id][dest.id].distance;
          let nextHop = newTables[node.id][dest.id].nextHop;

          neighbors.forEach(neighbor => {
            const edgeToNeighbor = edges.find(e => 
              (e.from === node.id && e.to === neighbor) || 
              (e.from === neighbor && e.to === node.id)
            );
            
            if (edgeToNeighbor && routingTables[neighbor] && routingTables[neighbor][dest.id]) {
              const newDistance = edgeToNeighbor.weight + routingTables[neighbor][dest.id].distance;
              if (newDistance < minDistance) {
                minDistance = newDistance;
                nextHop = neighbor;
                updated = true;
              }
            }
          });

          newTables[node.id][dest.id] = { distance: minDistance, nextHop };
        }
      });
    });

    if (updated) {
      setRoutingTables(newTables);
      setHistory(prev => [...prev, JSON.parse(JSON.stringify(newTables)) as RoutingTables]);
      setIteration(prev => prev + 1);
    }

    return updated;
  };

  const runFullAlgorithm = async () => {
    setIsRunning(true);
    let hasUpdates = true;
    let currentIteration = 0;

    while (hasUpdates && currentIteration < 10) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      hasUpdates = runDistanceVectorIteration();
      currentIteration++;
    }

    setIsRunning(false);
  };

  const reset = () => {
    setIteration(0);
    setHistory([]);
    setIsRunning(false);
    initializeRoutingTables();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/cn/network-layer" className="inline-flex items-center text-blue-200 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Network Layer
          </Link>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-white/20 p-3 rounded-xl">
              <Network className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Distance Vector Routing</h1>
              <p className="text-blue-100 text-lg">Distributed routing algorithm using Bellman-Ford principle</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Algorithm Type</h3>
              <p className="text-sm text-blue-100">Distributed, iterative, asynchronous</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Convergence</h3>
              <p className="text-sm text-blue-100">Eventually converges to shortest paths</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Used By</h3>
              <p className="text-sm text-blue-100">RIP (Routing Information Protocol)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Distance Vector Simulation</h2>
            <div className="flex space-x-4">
              <button
                onClick={runDistanceVectorIteration}
                disabled={isRunning}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
              >
                <Play className="h-4 w-4" />
                <span>Step</span>
              </button>
              <button
                onClick={runFullAlgorithm}
                disabled={isRunning}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
              >
                <Play className="h-4 w-4" />
                <span>Run All</span>
              </button>
              <button
                onClick={reset}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 flex items-center space-x-2"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          <div className="mb-4">
            <span className="text-sm text-gray-600">Iteration: {iteration}</span>
            {isRunning && <span className="ml-4 text-sm text-blue-600">Running...</span>}
          </div>

          {/* Network Visualization */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6" style={{ height: "300px" }}>
            <svg width="100%" height="100%" viewBox="0 0 500 300">
              {/* Edges */}
              {edges.map((edge, index) => {
                const fromNode = nodes.find(n => n.id === edge.from);
                const toNode = nodes.find(n => n.id === edge.to);
                if (!fromNode || !toNode) return null;
                return (
                  <g key={index}>
                    <line
                      x1={fromNode.x}
                      y1={fromNode.y}
                      x2={toNode.x}
                      y2={toNode.y}
                      stroke="#374151"
                      strokeWidth="2"
                    />
                    <text
                      x={(fromNode.x + toNode.x) / 2}
                      y={(fromNode.y + toNode.y) / 2}
                      textAnchor="middle"
                      className="text-sm font-medium fill-red-600"
                      dy="-5"
                    >
                      {edge.weight}
                    </text>
                  </g>
                );
              })}
              
              {/* Nodes */}
              {nodes.map(node => (
                <g key={node.id}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="20"
                    fill="#3B82F6"
                    stroke="#1E40AF"
                    strokeWidth="2"
                  />
                  <text
                    x={node.x}
                    y={node.y}
                    textAnchor="middle"
                    className="text-white font-bold"
                    dy="5"
                  >
                    {node.id}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Routing Tables */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Routing Tables</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {nodes.map(node => (
              <div key={node.id} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-center mb-3 bg-blue-500 text-white py-2 rounded">
                  Node {node.id}
                </h4>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-2 py-1 text-left">Dest</th>
                      <th className="px-2 py-1 text-left">Dist</th>
                      <th className="px-2 py-1 text-left">Next</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nodes.map(dest => {
                      const entry = routingTables[node.id]?.[dest.id];
                      return (
                        <tr key={dest.id} className={dest.id === node.id ? "bg-green-50" : ""}>
                          <td className="px-2 py-1 font-medium">{dest.id}</td>
                          <td className="px-2 py-1">
                            {entry?.distance === Infinity ? "∞" : entry?.distance || 0}
                          </td>
                          <td className="px-2 py-1">{entry?.nextHop || "-"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>

        {/* Algorithm Explanation */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Algorithm Explanation</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Bellman-Ford Equation</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="font-mono text-lg text-center">
                  d<sub>x</sub>(y) = min<sub>v</sub> {`{`} c(x,v) + d<sub>v</sub>(y) {`}`}
                </div>
                <p className="text-sm text-blue-700 mt-2 text-center">
                  Distance from x to y = minimum over all neighbors v of (cost to v + distance from v to y)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-3">Advantages</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Simple to implement and understand</li>
                  <li>• Distributed algorithm - no central authority</li>
                  <li>• Self-correcting and adaptive</li>
                  <li>• Handles network changes automatically</li>
                  <li>• Low computational overhead per node</li>
                </ul>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-3">Disadvantages</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Count-to-infinity problem</li>
                  <li>• Slow convergence in large networks</li>
                  <li>• Routing loops during convergence</li>
                  <li>• Poor performance with link failures</li>
                  <li>• Limited scalability (hop count limit)</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Algorithm Steps</h3>
              <div className="space-y-2 text-gray-600">
                <p>1. <strong>Initialize:</strong> Each node knows distance to direct neighbors</p>
                <p>2. <strong>Exchange:</strong> Nodes periodically send their distance vectors to neighbors</p>
                <p>3. <strong>Update:</strong> Upon receiving a distance vector, update own table using Bellman-Ford equation</p>
                <p>4. <strong>Repeat:</strong> Continue until no more updates occur (convergence)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Exam Tips */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">📝 Exam Preparation Tips</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-3">Key Points to Remember</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Based on Bellman-Ford algorithm</li>
                <li>• Each node maintains distance vector to all destinations</li>
                <li>• Routing updates sent to immediate neighbors only</li>
                <li>• Uses hop count as metric (RIP limitation: 15 hops)</li>
                <li>• Count-to-infinity solved by split horizon, poison reverse</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-3">Common Exam Questions</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• "Trace distance vector algorithm execution" (10 marks)</li>
                <li>• "Compare distance vector vs link state" (8 marks)</li>
                <li>• "Explain count-to-infinity problem" (6 marks)</li>
                <li>• "Calculate routing table after topology change" (8 marks)</li>
                <li>• "Advantages and disadvantages of DV routing" (6 marks)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
