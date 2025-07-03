"use client";

import { useState } from "react";
import { floydWarshall, FloydWarshallResult } from "../../../utils/dynamicProgramming";
import { EducationalInfo, ExamResult } from "../../../../components";

export default function FloydWarshallPage() {
  const [numVertices, setNumVertices] = useState(4);
  const [graph, setGraph] = useState([
    [0, 5, Infinity, 10],
    [Infinity, 0, 3, Infinity],
    [Infinity, Infinity, 0, 1],
    [Infinity, Infinity, Infinity, 0]
  ]);
  const [result, setResult] = useState<FloydWarshallResult | null>(null);

  const handleSolve = () => {
    const output = floydWarshall(graph);
    setResult(output);
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Configure Graph</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Vertices
                </label>
                <select
                  value={numVertices}
                  onChange={(e) => resizeGraph(parseInt(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
                >
                  {[3, 4, 5, 6].map(size => (
                    <option key={size} value={size}>{size} vertices</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3">
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
                  Random Graph
                </button>
              </div>
            </div>

            {/* Graph Input Matrix */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Adjacency Matrix:</h3>
              <p className="text-sm text-gray-600 mb-3">
                Enter edge weights. Use &apos;inf&apos; or leave empty for no edge.
              </p>
              <div className="overflow-x-auto">
                <table className="border-collapse border border-gray-300">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 px-2 py-1 bg-gray-200 text-sm">From\\To</th>
                      {Array.from({ length: numVertices }, (_, i) => (
                        <th key={i} className="border border-gray-300 px-2 py-1 bg-indigo-100 text-sm">
                          {i}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {graph.map((row, i) => (
                      <tr key={i}>
                        <th className="border border-gray-300 px-2 py-1 bg-indigo-100 text-sm">{i}</th>
                        {row.map((value, j) => (
                          <td key={j} className="border border-gray-300 p-1">
                            {i === j ? (
                              <div className="w-12 h-8 bg-gray-200 flex items-center justify-center text-sm">0</div>
                            ) : (
                              <input
                                type="text"
                                value={value === Infinity ? '' : value}
                                onChange={(e) => updateGraphCell(i, j, e.target.value)}
                                className="w-12 h-8 text-center text-sm border-none outline-none text-gray-900 bg-white"
                                placeholder="∞"
                              />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Shortest Paths Result</h2>
            
            {result ? (
              <div className="space-y-4">
                {result.hasNegativeCycle ? (
                  <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                    <h3 className="text-lg font-semibold text-red-800 mb-2">⚠️ Negative Cycle Detected!</h3>
                    <p className="text-red-700">The graph contains a negative cycle. Shortest paths are undefined.</p>
                  </div>
                ) : (
                  <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">✅ All Shortest Paths Found</h3>
                    <p className="text-green-700">No negative cycles detected. All distances are optimal.</p>
                  </div>
                )}

                {/* Final Distance Matrix */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">All-Pairs Shortest Distances:</h3>
                  <div className="overflow-x-auto">
                    <table className="border-collapse border border-gray-300 text-sm">
                      <thead>
                        <tr>
                          <th className="border border-gray-300 px-3 py-2 bg-gray-200">From\\To</th>
                          {Array.from({ length: numVertices }, (_, i) => (
                            <th key={i} className="border border-gray-300 px-3 py-2 bg-indigo-100">
                              Vertex {i}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {result.distances.map((row, i) => (
                          <tr key={i}>
                            <th className="border border-gray-300 px-3 py-2 bg-indigo-100">Vertex {i}</th>
                            {row.map((distance, j) => (
                              <td
                                key={j}
                                className={`border border-gray-300 px-3 py-2 text-center font-mono ${
                                  i === j 
                                    ? 'bg-gray-200 text-gray-600' 
                                    : distance === Infinity
                                    ? 'bg-red-50 text-red-600'
                                    : distance < 0
                                    ? 'bg-red-100 text-red-700 font-bold'
                                    : 'bg-green-50 text-green-700'
                                }`}
                              >
                                {formatValue(distance)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Algorithm Execution Steps:</h3>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {result.steps.map((step, index) => (
                      <div key={index} className="text-sm text-blue-700">
                        {index + 1}. {step}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <div className="text-4xl mb-4">🔄</div>
                <p>Configure the graph and click &quot;Find All Shortest Paths&quot; to run Floyd-Warshall</p>
              </div>
            )}
          </div>
        </div>

        {/* Algorithm Visualization */}
        {result && !result.hasNegativeCycle && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Path Analysis</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Shortest Distances Summary</h3>
                <div className="space-y-2 text-sm">
                  {result.distances.map((row, i) => (
                    row.map((distance, j) => (
                      i !== j && distance !== Infinity && (
                        <div key={`${i}-${j}`} className="flex justify-between">
                          <span>Vertex {i} → Vertex {j}:</span>
                          <span className="font-mono font-semibold text-blue-600">{distance}</span>
                        </div>
                      )
                    ))
                  )).flat()}
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-3">Algorithm Properties</h3>
                <ul className="space-y-2 text-sm text-green-700">
                  <li>• Handles negative edge weights ✓</li>
                  <li>• Detects negative cycles ✓</li>
                  <li>• Computes all-pairs distances ✓</li>
                  <li>• Time: O(V³) = O({numVertices}³) = {Math.pow(numVertices, 3)} operations</li>
                  <li>• Space: O(V²) = O({numVertices}²) = {Math.pow(numVertices, 2)} entries</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {result && (
          <ExamResult
            title="Floyd-Warshall All-Pairs Shortest Path"
            input={`Graph with ${numVertices} vertices`}
            result={!result.hasNegativeCycle}
            steps={result.steps.slice(0, 15).map((step, index) => ({
              stepNumber: index + 1,
              description: step,
              currentState: step.includes('vertex') ? "Processing intermediate vertex..." : "Updating distances...",
              explanation: step.includes('Update') 
                ? "Found shorter path through intermediate vertex"
                : step.includes('vertex')
                ? "Considering all paths through this intermediate vertex"
                : step.includes('Negative')
                ? "Negative cycle detected - algorithm terminates"
                : "Matrix initialization or final result"
            }))}
            finalAnswer={result.hasNegativeCycle 
              ? "Negative cycle detected - no shortest paths exist" 
              : `All-pairs shortest paths computed successfully`
            }
            examFormat={{
              question: `Apply Floyd-Warshall algorithm to find all-pairs shortest paths in the given graph.`,
              solution: [
                `Floyd-Warshall Algorithm Analysis:`,
                `Number of vertices: ${numVertices}`,
                `Initial adjacency matrix provided`,
                `Algorithm iterations: ${numVertices} (one per intermediate vertex)`,
                `Negative cycle detected: ${result.hasNegativeCycle ? 'Yes' : 'No'}`,
                `Time complexity: O(V³) = O(${numVertices}³)`,
                `Space complexity: O(V²) = O(${numVertices}²)`,
                `Total distance updates: ${result.steps.filter(s => s.includes('Update')).length}`,
                result.hasNegativeCycle 
                  ? 'Result: Negative cycle makes shortest paths undefined'
                  : 'Result: All shortest distances computed successfully'
              ],
              conclusion: result.hasNegativeCycle 
                ? `The graph contains a negative cycle, making shortest path computation impossible.`
                : `Floyd-Warshall successfully computed all ${numVertices * (numVertices - 1)} shortest paths.`,
              marks: 8
            }}
          />
        )}
      </div>
    </div>
  );
}
