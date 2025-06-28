"use client";

import { useState } from "react";
import { KruskalChart } from "../../../components/KruskalChart";
import { kruskalMST, KruskalResult, Graph } from "../../../utils/greedyAlgorithms";

export default function KruskalPage() {
  const [vertices, setVertices] = useState(4);
  const [edges, setEdges] = useState([
    { from: 0, to: 1, weight: 10 },
    { from: 0, to: 2, weight: 6 },
    { from: 0, to: 3, weight: 5 },
    { from: 1, to: 3, weight: 15 },
    { from: 2, to: 3, weight: 4 }
  ]);
  const [result, setResult] = useState<KruskalResult | null>(null);

  const handleSolve = () => {
    const graph: Graph = { vertices, edges };
    const output = kruskalMST(graph);
    setResult(output);
  };

  const addEdge = () => {
    setEdges([...edges, { from: 0, to: 1, weight: 1 }]);
  };

  const removeEdge = (index: number) => {
    setEdges(edges.filter((_, i) => i !== index));
  };

  const updateEdge = (index: number, field: 'from' | 'to' | 'weight', value: number) => {
    const newEdges = [...edges];
    newEdges[index] = { ...newEdges[index], [field]: value };
    setEdges(newEdges);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Kruskal's Algorithm</h1>
      <p className="text-gray-600 mb-6">
        Kruskal's algorithm finds the minimum spanning tree by sorting edges by weight and adding them if they don't create a cycle.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Number of Vertices:</label>
            <input
              type="number"
              value={vertices}
              onChange={(e) => setVertices(parseInt(e.target.value) || 1)}
              className="w-full p-2 border rounded"
              min="1"
              max="10"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Edges:</h3>
            {edges.map((edge, index) => (
              <div key={index} className="flex space-x-2 mb-2">
                <input
                  type="number"
                  value={edge.from}
                  onChange={(e) => updateEdge(index, 'from', parseInt(e.target.value) || 0)}
                  className="w-20 p-1 border rounded"
                  min="0"
                  max={vertices - 1}
                />
                <span className="self-center">→</span>
                <input
                  type="number"
                  value={edge.to}
                  onChange={(e) => updateEdge(index, 'to', parseInt(e.target.value) || 0)}
                  className="w-20 p-1 border rounded"
                  min="0"
                  max={vertices - 1}
                />
                <input
                  type="number"
                  value={edge.weight}
                  onChange={(e) => updateEdge(index, 'weight', parseInt(e.target.value) || 0)}
                  className="w-20 p-1 border rounded"
                  min="1"
                />
                <button
                  onClick={() => removeEdge(index)}
                  className="px-2 py-1 bg-red-500 text-white rounded text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={addEdge}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Add Edge
            </button>
          </div>

          <button
            onClick={handleSolve}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Find MST
          </button>

          {result && (
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <h3 className="font-semibold mb-2">Result:</h3>
              <p>Total Weight: {result.totalWeight}</p>
              <p>MST Edges: {result.mstEdges.length}</p>
              <div className="mt-2">
                <h4 className="font-medium">Selected Edges:</h4>
                {result.mstEdges.map((edge: any, index: number) => (
                  <div key={index} className="text-sm">
                    {edge.from} → {edge.to} (weight: {edge.weight})
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Visualization</h3>
          {result ? (
            <KruskalChart data={result} vertices={vertices} />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              Click "Find MST" to see visualization
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
