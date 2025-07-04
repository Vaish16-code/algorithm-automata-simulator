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

  const educationalContent = {
    overview: "Kruskal&apos;s algorithm is a greedy algorithm for finding the Minimum Spanning Tree (MST) of a weighted undirected graph. It builds the MST by sorting all edges by weight and adding them one by one, ensuring no cycles are formed using Union-Find data structure.",
    keyCharacteristics: [
      "Edge-based approach to MST construction", 
      "Sorts all edges by weight initially",
      "Uses Union-Find to detect cycles",
      "Greedy choice: minimum weight edge that doesn&apos;t create cycle",
      "Works well with sparse graphs"
    ],
    applications: [
      "Network design and optimization",
      "Circuit board routing",
      "Clustering algorithms in machine learning",
      "Image segmentation",
      "Transportation network planning"
    ],
    examTips: [
      "Understand Union-Find data structure operations",
      "Practice tracing algorithm with different edge orderings",
      "Know time complexity: O(E log E) for sorting",
      "Compare with Prim's algorithm pros/cons",
      "Learn to implement efficient Union-Find"
    ]
  };

  const examPrep = {
    questionTypes: [
      "Trace Kruskal&apos;s algorithm execution step by step",
      "Implement Union-Find data structure",
      "Analyze time complexity with different optimizations",
      "Compare Kruskal&apos;s vs Prim&apos;s algorithm",
      "Prove correctness using cut property"
    ],
    practiceProblems: [
      "Find MST using Kruskal&apos;s on given graph",
      "Implement with Union-Find optimizations",
      "Modify for maximum spanning tree",
      "MST in dense vs sparse graphs",
      "Applications in clustering problems"
    ],
    examPattern: "Kruskal&apos;s algorithm is a major topic in Mumbai University exams (10-15 marks), often combined with Union-Find implementation and complexity analysis."
  };

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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Kruskal&apos;s Minimum Spanning Tree
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Build MST by sorting edges and using Union-Find to avoid cycles
          </p>
        </div>

        {/* Algorithm Simulator */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Algorithm Simulator</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Vertices:
                </label>
                <input
                  type="number"
                  value={vertices}
                  onChange={(e) => setVertices(parseInt(e.target.value) || 1)}
                  className="w-full border-4 border-gray-800 rounded-lg px-4 py-3 text-lg font-bold text-black bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-200"
                  min="1"
                  max="10"
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Graph Edges:</h3>
                <div className="space-y-3">
                  {edges.map((edge, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-600">From:</label>
                        <input
                          type="number"
                          value={edge.from}
                          onChange={(e) => updateEdge(index, 'from', parseInt(e.target.value) || 0)}
                          className="w-16 border-4 border-gray-800 rounded px-3 py-2 text-center text-lg font-bold text-black bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                          min="0"
                          max={vertices - 1}
                        />
                      </div>
                      
                      <span className="text-gray-400 font-mono">→</span>
                      
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-600">To:</label>
                        <input
                          type="number"
                          value={edge.to}
                          onChange={(e) => updateEdge(index, 'to', parseInt(e.target.value) || 0)}
                          className="w-16 border-4 border-gray-800 rounded px-3 py-2 text-center text-lg font-bold text-black bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                          min="0"
                          max={vertices - 1}
                        />
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-600">Weight:</label>
                        <input
                          type="number"
                          value={edge.weight}
                          onChange={(e) => updateEdge(index, 'weight', parseInt(e.target.value) || 0)}
                          className="w-20 border-4 border-gray-800 rounded px-3 py-2 text-center text-lg font-bold text-black bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                          min="1"
                        />
                      </div>
                      
                      <button
                        onClick={() => removeEdge(index)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                        disabled={edges.length <= 1}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={addEdge}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Add Edge
                  </button>
                  <button
                    onClick={handleSolve}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Find MST using Kruskal&apos;s
                  </button>
                </div>
              </div>
            </div>

            {/* Visualization Section */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">MST Visualization</h3>
              {result ? (
                <KruskalChart data={result} vertices={vertices} />
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500 bg-white rounded-lg border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p>Click &quot;Find MST&quot; to see visualization</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Algorithm Result</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-100 rounded-lg p-6 border-4 border-green-600">
                <h3 className="text-2xl font-bold text-white mb-6 bg-green-600 p-3 rounded-lg">MST Properties</h3>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border-4 border-gray-800 flex justify-between items-center">
                    <span className="text-xl font-bold text-black">Total Weight:</span>
                    <span className="font-bold text-green-600 text-2xl bg-green-100 px-4 py-2 rounded-lg border-2 border-green-600">{result.totalWeight}</span>
                  </div>
                  <div className="bg-white p-4 rounded-lg border-4 border-gray-800 flex justify-between items-center">
                    <span className="text-xl font-bold text-black">Edges in MST:</span>
                    <span className="font-bold text-green-600 text-2xl bg-green-100 px-4 py-2 rounded-lg border-2 border-green-600">{result.mstEdges.length}</span>
                  </div>
                  <div className="bg-white p-4 rounded-lg border-4 border-gray-800 flex justify-between items-center">
                    <span className="text-xl font-bold text-black">Algorithm:</span>
                    <span className="font-bold text-green-600 text-2xl bg-green-100 px-4 py-2 rounded-lg border-2 border-green-600">Kruskal&apos;s MST</span>
                  </div>
                </div>
              </div>
              <div className="bg-blue-100 rounded-lg p-6 border-4 border-blue-600">
                <h3 className="text-2xl font-bold text-white mb-6 bg-blue-600 p-3 rounded-lg">Complexity Analysis</h3>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border-4 border-gray-800 flex justify-between items-center">
                    <span className="text-xl font-bold text-black">Time Complexity:</span>
                    <span className="font-bold text-blue-600 text-2xl bg-blue-100 px-4 py-2 rounded-lg border-2 border-blue-600">O(E log E)</span>
                  </div>
                  <div className="bg-white p-4 rounded-lg border-4 border-gray-800 flex justify-between items-center">
                    <span className="text-xl font-bold text-black">Space Complexity:</span>
                    <span className="font-bold text-blue-600 text-2xl bg-blue-100 px-4 py-2 rounded-lg border-2 border-blue-600">O(V)</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-2xl font-bold text-black mb-6 bg-blue-100 p-4 rounded-lg border-4 border-blue-600">Algorithm Steps:</h3>
              <div className="space-y-4">
                {result.mstEdges.map((edge, index) => (
                  <div key={index} className="bg-blue-600 text-white rounded-lg p-6 border-4 border-blue-800 shadow-lg">
                    <span className="text-xl font-bold">
                      Step {index + 2}: Add edge ({edge.from}, {edge.to}) with weight {edge.weight} - no cycle formed
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 bg-blue-100 p-6 rounded-lg border-4 border-blue-600">
                <h4 className="text-2xl font-bold text-black mb-4">MST Details:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-600 text-white p-4 rounded-lg">
                    <span className="text-xl font-bold">Total Weight: {result.totalWeight}</span>
                  </div>
                  <div className="bg-blue-600 text-white p-4 rounded-lg">
                    <span className="text-xl font-bold">Number of Edges: {result.mstEdges.length}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <h5 className="text-xl font-bold text-black mb-3">Selected Edges:</h5>
                  <div className="flex flex-wrap gap-3">
                    {result.mstEdges.map((edge, index) => (
                      <div key={index} className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-4 py-2 rounded-lg border-2 border-red-700">
                        <span className="text-lg font-bold">({edge.from}, {edge.to}): {edge.weight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Educational Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Understanding Kruskal&apos;s Algorithm</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Key Characteristics</h3>
              <ul className="space-y-3 text-gray-900">
                {educationalContent.keyCharacteristics.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-green-600 mt-1 text-xl font-bold">•</span>
                    <span className="text-lg font-bold text-black">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Applications</h3>
              <ul className="space-y-3 text-gray-900">
                {educationalContent.applications.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-blue-600 mt-1 text-xl font-bold">•</span>
                    <span className="text-lg font-bold text-black">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Exam Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {educationalContent.examTips.map((tip, index) => (
                <div key={index} className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-400">
                  <p className="text-lg font-bold text-gray-900">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Exam Preparation */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Mumbai University Exam Preparation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Question Types</h3>
              <ul className="space-y-2 text-gray-600">
                {examPrep.questionTypes.map((type, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    {type}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Practice Problems</h3>
              <ul className="space-y-2 text-gray-600">
                {examPrep.practiceProblems.map((problem, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    {problem}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">Exam Pattern</h3>
            <p className="text-blue-700">{examPrep.examPattern}</p>
          </div>
        </div>

        {/* Algorithm Steps */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Algorithm Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Kruskal&apos;s Process</h3>
              <ol className="space-y-3 text-gray-900">
                <li className="flex gap-3">
                  <span className="bg-blue-600 text-white w-8 h-8 rounded-full text-lg flex items-center justify-center font-bold">1</span>
                  <span className="text-lg font-bold text-black">Sort all edges by weight in ascending order</span>
                </li>
                <li className="flex gap-3">
                  <span className="bg-blue-600 text-white w-8 h-8 rounded-full text-lg flex items-center justify-center font-bold">2</span>
                  <span className="text-lg font-bold text-black">Initialize Union-Find for all vertices</span>
                </li>
                <li className="flex gap-3">
                  <span className="bg-blue-600 text-white w-8 h-8 rounded-full text-lg flex items-center justify-center font-bold">3</span>
                  <span className="text-lg font-bold text-black">For each edge in sorted order:</span>
                </li>
                <li className="flex gap-3 ml-6">
                  <span className="bg-green-600 text-white w-8 h-8 rounded-full text-lg flex items-center justify-center font-bold">a</span>
                  <span className="text-lg font-bold text-black">Check if endpoints are in same component</span>
                </li>
                <li className="flex gap-3 ml-6">
                  <span className="bg-green-600 text-white w-8 h-8 rounded-full text-lg flex items-center justify-center font-bold">b</span>
                  <span className="text-lg font-bold text-black">If not, add edge to MST and union components</span>
                </li>
                <li className="flex gap-3">
                  <span className="bg-blue-600 text-white w-8 h-8 rounded-full text-lg flex items-center justify-center font-bold">4</span>
                  <span className="text-lg font-bold text-black">Stop when MST has V-1 edges</span>
                </li>
              </ol>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Key Properties</h3>
              <ul className="space-y-3 text-gray-900">
                <li className="text-lg font-bold text-black">• <strong>Greedy Choice:</strong> Always pick minimum weight edge</li>
                <li className="text-lg font-bold text-black">• <strong>Cycle Detection:</strong> Uses Union-Find efficiently</li>
                <li className="text-lg font-bold text-black">• <strong>Optimal Substructure:</strong> MST property preserved</li>
                <li className="text-lg font-bold text-black">• <strong>Cut Property:</strong> Minimum edge across any cut</li>
                <li className="text-lg font-bold text-black">• <strong>Time Complexity:</strong> Dominated by edge sorting</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
