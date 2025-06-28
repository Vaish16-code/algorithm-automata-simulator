"use client";

import { useState } from "react";
import { PrimChart } from "../../../components/PrimChart";
import { primMST, PrimResult, Graph } from "../../../utils/greedyAlgorithms";

export default function PrimPage() {
  const [vertices, setVertices] = useState(5);
  const [edges, setEdges] = useState([
    { from: 0, to: 1, weight: 2 },
    { from: 0, to: 3, weight: 6 },
    { from: 1, to: 2, weight: 3 },
    { from: 1, to: 3, weight: 8 },
    { from: 1, to: 4, weight: 5 },
    { from: 2, to: 4, weight: 7 },
    { from: 3, to: 4, weight: 9 }
  ]);
  const [result, setResult] = useState<PrimResult | null>(null);

  const handleSolve = () => {
    const graph: Graph = { vertices, edges };
    const output = primMST(graph);
    setResult(output);
  };

  const addEdge = () => {
    setEdges([...edges, { from: 0, to: 1, weight: 1 }]);
  };

  const removeEdge = (index: number) => {
    setEdges(edges.filter((_, i) => i !== index));
  };

  const updateEdge = (index: number, field: string, value: number) => {
    setEdges(edges.map((edge, i) => 
      i === index ? { ...edge, [field]: Math.max(0, Math.min(vertices - 1, value)) } : edge
    ));
  };

  const updateWeight = (index: number, weight: number) => {
    setEdges(edges.map((edge, i) => 
      i === index ? { ...edge, weight: Math.max(1, weight) } : edge
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Prim's Minimum Spanning Tree
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Graph Input</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Vertices:
            </label>
            <input
              type="number"
              min="3"
              max="10"
              className="w-32 border border-gray-300 rounded-md px-3 py-2"
              value={vertices}
              onChange={(e) => setVertices(parseInt(e.target.value) || 3)}
            />
          </div>

          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-700">Edges:</h3>
            {edges.map((edge, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">From:</label>
                  <input
                    type="number"
                    min="0"
                    max={vertices - 1}
                    className="w-16 border border-gray-300 rounded px-2 py-1"
                    value={edge.from}
                    onChange={(e) => updateEdge(index, 'from', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">To:</label>
                  <input
                    type="number"
                    min="0"
                    max={vertices - 1}
                    className="w-16 border border-gray-300 rounded px-2 py-1"
                    value={edge.to}
                    onChange={(e) => updateEdge(index, 'to', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Weight:</label>
                  <input
                    type="number"
                    min="1"
                    className="w-20 border border-gray-300 rounded px-2 py-1"
                    value={edge.weight}
                    onChange={(e) => updateWeight(index, parseInt(e.target.value) || 1)}
                  />
                </div>
                <button
                  onClick={() => removeEdge(index)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  disabled={edges.length <= 1}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={addEdge}
              className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-md"
            >
              Add Edge
            </button>
            <button
              onClick={handleSolve}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md"
            >
              Find MST using Prim's
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Minimum Spanning Tree</h2>
            
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              <div className="flex items-center">
                <span className="text-2xl mr-2">🌳</span>
                <div>
                  <p className="font-bold text-lg">
                    Minimum Cost: {result.totalWeight}
                  </p>
                  <p className="text-sm">
                    Edges in MST: {result.mstEdges.length}
                  </p>
                </div>
              </div>
            </div>

            <PrimChart data={result} vertices={vertices} />
          </div>
        )}

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2 text-blue-800">How Prim's Algorithm works:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Start with any vertex (usually vertex 0)</li>
            <li>• Add the minimum weight edge that connects the MST to a new vertex</li>
            <li>• Repeat until all vertices are included in the MST</li>
            <li>• Greedy choice: always pick the minimum weight edge crossing the cut</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
