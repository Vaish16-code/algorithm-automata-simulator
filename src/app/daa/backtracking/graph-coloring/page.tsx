"use client";

import { useState } from "react";
import { graphColoring, GraphColoringResult } from "@/app/utils/backtracking";
import EducationalInfo from "@/components/EducationalInfo";

export default function GraphColoringPage() {
  const [numVertices, setNumVertices] = useState(4);
  const [numColors, setNumColors] = useState(3);
  const [graph, setGraph] = useState([
    [0, 1, 1, 1],
    [1, 0, 1, 0],
    [1, 1, 0, 1],
    [1, 0, 1, 0]
  ]);
  const [result, setResult] = useState<GraphColoringResult | null>(null);

  const colors = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Pink', 'Cyan'];
  const colorClasses = ['bg-red-200 text-red-800', 'bg-blue-200 text-blue-800', 'bg-green-200 text-green-800', 
                       'bg-yellow-200 text-yellow-800', 'bg-purple-200 text-purple-800', 'bg-orange-200 text-orange-800',
                       'bg-pink-200 text-pink-800', 'bg-cyan-200 text-cyan-800'];

  const handleSolve = () => {
    const output = graphColoring(graph, numColors);
    setResult(output);
  };

  const toggleEdge = (i: number, j: number) => {
    if (i === j) return; // No self loops
    const newGraph = graph.map(row => [...row]);
    newGraph[i][j] = newGraph[i][j] === 1 ? 0 : 1;
    newGraph[j][i] = newGraph[i][j]; // Keep symmetric
    setGraph(newGraph);
  };

  const resizeGraph = (newSize: number) => {
    const newGraph = Array(newSize).fill(null).map((_, i) => 
      Array(newSize).fill(null).map((_, j) => 
        i === j ? 0 : 
        (i < graph.length && j < graph[0].length) ? graph[i][j] : 0
      )
    );
    setGraph(newGraph);
    setNumVertices(newSize);
  };

  const generateRandomGraph = () => {
    const newGraph: number[][] = Array(numVertices).fill(null).map(() => 
      Array(numVertices).fill(0)
    );
    
    // Generate random edges
    for (let i = 0; i < numVertices; i++) {
      for (let j = i + 1; j < numVertices; j++) {
        if (Math.random() < 0.4) { // 40% chance of edge
          newGraph[i][j] = 1;
          newGraph[j][i] = 1; // Keep symmetric
        }
      }
    }
    setGraph(newGraph);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Graph Coloring <span className="text-green-600">(Backtracking)</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Color graph vertices such that no two adjacent vertices have the same color
          </p>
        </div>

        <EducationalInfo
          topic="Graph Coloring Problem"
          description="Graph coloring assigns colors to vertices of a graph such that no two adjacent vertices share the same color, using the minimum number of colors possible."
          theory={{
            definition: "Given a graph G and a set of colors, assign colors to vertices such that no two adjacent vertices have the same color.",
            keyPoints: [
              "NP-Complete problem - no known polynomial solution",
              "Backtracking explores all possible colorings systematically",
              "Chromatic number: minimum colors needed to color the graph",
              "Applications in scheduling, register allocation, frequency assignment"
            ],
            applications: [
              "CPU register allocation in compilers",
              "Frequency assignment in wireless networks",
              "Exam scheduling and timetabling",
              "Map coloring (Four Color Theorem)"
            ]
          }}
          mumbaiUniversity={{
            syllabus: [
              "Graph coloring problem definition",
              "Backtracking approach to graph coloring",
              "Chromatic number determination",
              "Algorithm implementation and analysis",
              "Applications and complexity"
            ],
            marks: "6-8 marks",
            commonQuestions: [
              "Color given graph with minimum colors",
              "Implement backtracking solution",
              "Find chromatic number of graph",
              "Trace algorithm execution step by step"
            ],
            examTips: [
              "Start with vertex 0 and try colors systematically",
              "Check adjacent vertices for color conflicts",
              "Show backtracking when no valid color found",
              "Count minimum colors needed for final answer"
            ]
          }}
          algorithm={{
            steps: [
              "Start with first vertex (vertex 0)",
              "Try assigning colors 0, 1, 2, ... in order",
              "For each color, check if it conflicts with adjacent vertices",
              "If safe, assign color and move to next vertex",
              "If no safe color found, backtrack to previous vertex",
              "Continue until all vertices are colored or no solution exists"
            ],
            complexity: {
              time: "O(k^n) where k=colors, n=vertices (worst case)",
              space: "O(n) for recursion stack and coloring array"
            }
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Configure Graph</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Vertices
                  </label>
                  <select
                    value={numVertices}
                    onChange={(e) => resizeGraph(parseInt(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
                  >
                    {[3, 4, 5, 6].map(size => (
                      <option key={size} value={size}>{size} vertices</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Colors
                  </label>
                  <select
                    value={numColors}
                    onChange={(e) => setNumColors(parseInt(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
                  >
                    {[2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>{num} colors</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSolve}
                  className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                  Color Graph
                </button>
                <button
                  onClick={generateRandomGraph}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Random Graph
                </button>
              </div>
            </div>

            {/* Graph Adjacency Matrix */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Adjacency Matrix:</h3>
              <p className="text-sm text-gray-600 mb-3">Click to toggle edges (1 = edge, 0 = no edge)</p>
              <div className="overflow-x-auto">
                <table className="border-collapse border border-gray-300">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 px-2 py-1 bg-gray-200 text-sm">V</th>
                      {Array.from({ length: numVertices }, (_, i) => (
                        <th key={i} className="border border-gray-300 px-2 py-1 bg-green-100 text-sm">
                          {i}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {graph.map((row, i) => (
                      <tr key={i}>
                        <th className="border border-gray-300 px-2 py-1 bg-green-100 text-sm">{i}</th>
                        {row.map((value, j) => (
                          <td key={j} className="border border-gray-300 p-1">
                            <button
                              onClick={() => toggleEdge(i, j)}
                              disabled={i === j}
                              className={`w-8 h-8 text-sm font-semibold rounded ${
                                i === j 
                                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                  : value === 1
                                  ? 'bg-green-500 text-white hover:bg-green-600'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {value}
                            </button>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Available Colors Display */}
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Available Colors:</h3>
              <div className="flex gap-2">
                {colors.slice(0, numColors).map((color, index) => (
                  <div key={index} className={`px-3 py-1 rounded-lg text-sm font-medium ${colorClasses[index]}`}>
                    {color}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Coloring Results</h2>
            
            {result ? (
              <div className="space-y-4">
                {result.isColorable ? (
                  <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">✅ Graph Successfully Colored!</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">Chromatic Number:</span>
                        <span className="ml-2 text-2xl font-bold text-green-600">{result.chromaticNumber}</span>
                      </div>
                      <div>
                        <span className="font-medium">Colors Used:</span>
                        <span className="ml-2 text-green-700">{colors.slice(0, result.chromaticNumber).join(', ')}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                    <h3 className="text-lg font-semibold text-red-800 mb-2">❌ Cannot Color with {numColors} Colors</h3>
                    <p className="text-red-700">Try increasing the number of available colors.</p>
                  </div>
                )}

                {result.isColorable && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Vertex Coloring:</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {result.coloring.map((color, vertex) => (
                        <div key={vertex} className="flex items-center gap-2">
                          <div className="bg-gray-200 text-gray-700 px-2 py-1 rounded font-semibold text-sm">
                            V{vertex}
                          </div>
                          <span className="text-gray-600">→</span>
                          <div className={`px-3 py-1 rounded-lg text-sm font-medium ${colorClasses[color]}`}>
                            {colors[color]}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Algorithm Steps:</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {result.steps.slice(0, 20).map((step, index) => (
                      <div key={index} className={`text-sm p-2 rounded ${
                        step.backtrack ? 'bg-red-100 border-l-4 border-red-400' :
                        step.isValid && step.color >= 0 ? 'bg-green-100 border-l-4 border-green-400' :
                        'bg-gray-100 border-l-4 border-gray-400'
                      }`}>
                        <div className="font-medium">Step {step.step + 1}:</div>
                        <div className={step.backtrack ? 'text-red-700' : step.isValid ? 'text-green-700' : 'text-gray-700'}>
                          {step.action}
                        </div>
                        {step.vertex >= 0 && step.color >= 0 && (
                          <div className="text-xs mt-1">
                            Vertex {step.vertex} → {colors[step.color] || `Color ${step.color}`}
                          </div>
                        )}
                      </div>
                    ))}
                    {result.steps.length > 20 && (
                      <div className="text-sm text-gray-600 italic">
                        ... and {result.steps.length - 20} more steps
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <div className="text-4xl mb-4">🎨</div>
                <p>Configure the graph and click &quot;Color Graph&quot; to see the backtracking solution</p>
              </div>
            )}
          </div>
        </div>

        {/* Algorithm Complexity */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Algorithm Analysis</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-800 mb-3">Complexity Analysis</h3>
              <div className="space-y-2 text-sm text-yellow-700">
                <div><strong>Time Complexity:</strong> O(k^n)</div>
                <div>where k = number of colors, n = number of vertices</div>
                <div><strong>Space Complexity:</strong> O(n)</div>
                <div>for recursion stack and coloring array</div>
                <div className="pt-2 border-t border-yellow-200">
                  <div><strong>Current Problem:</strong></div>
                  <div>Vertices: {numVertices}, Colors: {numColors}</div>
                  <div>Max operations: {Math.pow(numColors, numVertices).toLocaleString()}</div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Graph Properties</h3>
              <div className="space-y-2 text-sm text-blue-700">
                <div><strong>Vertices:</strong> {numVertices}</div>
                <div><strong>Edges:</strong> {graph.reduce((sum, row) => sum + row.reduce((s, val) => s + val, 0), 0) / 2}</div>
                <div><strong>Density:</strong> {((graph.reduce((sum, row) => sum + row.reduce((s, val) => s + val, 0), 0) / 2) / (numVertices * (numVertices - 1) / 2) * 100).toFixed(1)}%</div>
                {result && result.isColorable && (
                  <>
                    <div><strong>Chromatic Number:</strong> {result.chromaticNumber}</div>
                    <div><strong>Backtrack Steps:</strong> {result.steps.filter(s => s.backtrack).length}</div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {result && (
          <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Graph Coloring Results</h2>
            <div className="space-y-4">
              <div className="p-6 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Result Summary:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Status:</strong> {result.isColorable ? 'Successfully Colored' : 'Cannot be colored with given colors'}</li>
                  {result.isColorable && (
                    <>
                      <li><strong>Chromatic Number:</strong> {result.chromaticNumber} colors used</li>
                      <li><strong>Coloring:</strong> {result.coloring.map((c, v) => `V${v}→${colors[c]}`).join(', ')}</li>
                    </>
                  )}
                  <li><strong>Total Steps:</strong> {result.steps.length}</li>
                  <li><strong>Backtracking Steps:</strong> {result.steps.filter(s => s.backtrack).length}</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
