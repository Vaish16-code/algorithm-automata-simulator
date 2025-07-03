"use client";

import React, { useState } from "react";
import { travelingSalesman, TSPResult } from "../../../utils/branchAndBound";
import { EducationalInfo, ExamResult } from "../../../../components";

export default function TSPPage() {
  const [numCities, setNumCities] = useState(4);
  const [costMatrix, setCostMatrix] = useState([
    [0, 10, 15, 20],
    [10, 0, 35, 25],
    [15, 35, 0, 30],
    [20, 25, 30, 0]
  ]);
  const [result, setResult] = useState<TSPResult | null>(null);

  const handleSolve = () => {
    const output = travelingSalesman(costMatrix);
    setResult(output);
  };

  const updateCostCell = (i: number, j: number, value: string) => {
    const newMatrix = costMatrix.map(row => [...row]);
    const numValue = value === '' ? 0 : parseInt(value);
    if (!isNaN(numValue) && numValue >= 0) {
      newMatrix[i][j] = numValue;
      if (i !== j) {
        newMatrix[j][i] = numValue; // Keep symmetric
      }
      setCostMatrix(newMatrix);
    }
  };

  const resizeMatrix = (newSize: number) => {
    const newMatrix = Array(newSize).fill(null).map((_, i) => 
      Array(newSize).fill(null).map((_, j) => 
        i === j ? 0 : 
        (i < costMatrix.length && j < costMatrix[0].length) ? costMatrix[i][j] : 10
      )
    );
    setCostMatrix(newMatrix);
    setNumCities(newSize);
  };

  const generateRandomMatrix = () => {
    const newMatrix: number[][] = Array(numCities).fill(null).map((_, i) => 
      Array(numCities).fill(null).map((_, j): number => {
        if (i === j) return 0;
        return Math.floor(Math.random() * 40) + 5; // 5-44 cost
      })
    );
    // Make symmetric
    for (let i = 0; i < numCities; i++) {
      for (let j = i + 1; j < numCities; j++) {
        newMatrix[j][i] = newMatrix[i][j];
      }
    }
    setCostMatrix(newMatrix);
  };

  const getCityName = (index: number) => String.fromCharCode(65 + index); // A, B, C, D...

  // Helper function for factorial calculation
  const factorial = (n: number): number => {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Travelling Salesman Problem <span className="text-orange-600">(Branch & Bound)</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find the shortest possible route that visits each city exactly once and returns to the starting city
          </p>
        </div>

        <EducationalInfo
          topic="Travelling Salesman Problem (TSP)"
          description="TSP seeks the shortest possible route that visits each city exactly once and returns to the origin city. Branch and Bound provides optimal solutions by systematically exploring and pruning the search space."
          theory={{
            definition: "Given a list of cities and distances between each pair, find the shortest possible route that visits each city exactly once and returns to the starting city.",
            keyPoints: [
              "NP-Hard problem - exponential time complexity",
              "Branch and bound uses lower bounds to prune suboptimal paths",
              "Optimal solution guaranteed (unlike heuristic approaches)",
              "Real-world applications in logistics and optimization"
            ],
            applications: [
              "Vehicle routing and delivery optimization",
              "Manufacturing: drilling circuit boards",
              "DNA sequencing and bioinformatics",
              "Tourist itinerary planning"
            ]
          }}
          mumbaiUniversity={{
            syllabus: [
              "Travelling Salesman Problem formulation",
              "Branch and bound technique",
              "Lower bound calculation methods",
              "Pruning strategies and optimization",
              "Complexity analysis and comparison"
            ],
            marks: "8-10 marks",
            commonQuestions: [
              "Solve TSP using branch and bound",
              "Calculate lower bounds for TSP nodes",
              "Show pruning process step by step",
              "Compare with brute force approach"
            ],
            examTips: [
              "Calculate lower bound = path cost + minimum edges",
              "Show pruning when bound ≥ current best",
              "Draw search tree with bounds clearly marked",
              "Mention O(n!) brute force vs optimized branch and bound"
            ]
          }}
          algorithm={{
            steps: [
              "Start from city 0 with empty path",
              "For each unvisited city, calculate lower bound",
              "If bound < current best, explore this branch",
              "If bound ≥ current best, prune this branch",
              "When complete tour found, update best solution",
              "Continue until all promising branches explored"
            ],
            complexity: {
              time: "O(n!) worst case, significantly better with pruning",
              space: "O(n) for recursion stack and current path"
            }
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Configure TSP</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Cities
                </label>
                <select
                  value={numCities}
                  onChange={(e) => resizeMatrix(parseInt(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-white"
                >
                  {[3, 4, 5, 6].map(size => (
                    <option key={size} value={size}>{size} cities</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSolve}
                  className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold"
                >
                  Solve TSP
                </button>
                <button
                  onClick={generateRandomMatrix}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Random Costs
                </button>
              </div>
            </div>

            {/* Cost Matrix Input */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Distance Matrix:</h3>
              <p className="text-sm text-gray-600 mb-3">
                Enter distances between cities (symmetric matrix)
              </p>
              <div className="overflow-x-auto">
                <table className="border-collapse border border-gray-300">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 px-2 py-1 bg-gray-200 text-sm">From\\To</th>
                      {Array.from({ length: numCities }, (_, i) => (
                        <th key={i} className="border border-gray-300 px-2 py-1 bg-orange-100 text-sm">
                          {getCityName(i)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {costMatrix.map((row, i) => (
                      <tr key={i}>
                        <th className="border border-gray-300 px-2 py-1 bg-orange-100 text-sm">{getCityName(i)}</th>
                        {row.map((cost, j) => (
                          <td key={j} className="border border-gray-300 p-1">
                            {i === j ? (
                              <div className="w-16 h-8 bg-gray-200 flex items-center justify-center text-sm">-</div>
                            ) : (
                              <input
                                type="number"
                                value={cost}
                                onChange={(e) => updateCostCell(i, j, e.target.value)}
                                min="0"
                                className="w-16 h-8 text-center text-sm border-none outline-none text-gray-900 bg-white"
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

            {/* Cities Display */}
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Cities:</h3>
              <div className="flex gap-2">
                {Array.from({ length: numCities }, (_, i) => (
                  <div key={i} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-lg font-semibold">
                    {getCityName(i)}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">TSP Solution</h2>
            
            {result ? (
              <div className="space-y-4">
                <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400">
                  <h3 className="text-lg font-semibold text-orange-800 mb-2">🎯 Optimal Tour Found!</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Minimum Cost:</span>
                      <span className="ml-2 text-3xl font-bold text-orange-600">{result.minCost}</span>
                    </div>
                    <div>
                      <span className="font-medium">Optimal Path:</span>
                      <div className="mt-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {result.optimalPath.map((city, index) => (
                            <React.Fragment key={index}>
                              <div className="bg-orange-200 text-orange-800 px-3 py-2 rounded-lg font-bold">
                                {getCityName(city)}
                              </div>
                              {index < result.optimalPath.length - 1 && (
                                <span className="text-orange-600 font-bold">→</span>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Algorithm Performance:</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Total Nodes:</span>
                      <span className="ml-2 text-blue-600">{result.totalNodes}</span>
                    </div>
                    <div>
                      <span className="font-medium">Pruned Nodes:</span>
                      <span className="ml-2 text-blue-600">{result.prunedNodes}</span>
                    </div>
                    <div>
                      <span className="font-medium">Pruning Efficiency:</span>
                      <span className="ml-2 text-blue-600">
                        {((result.prunedNodes / result.totalNodes) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Steps Traced:</span>
                      <span className="ml-2 text-blue-600">{result.steps.length}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Search Tree Steps:</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {result.steps.slice(0, 15).map((step, index) => (
                      <div key={index} className={`text-sm p-2 rounded ${
                        step.pruned ? 'bg-red-100 border-l-4 border-red-400' :
                        step.description.includes('best') ? 'bg-green-100 border-l-4 border-green-400' :
                        'bg-gray-100 border-l-4 border-gray-400'
                      }`}>
                        <div className="font-medium">Step {step.step + 1}:</div>
                        <div className={step.pruned ? 'text-red-700' : 'text-gray-700'}>
                          {step.description}
                        </div>
                        <div className="text-xs mt-1 grid grid-cols-2 gap-2">
                          <div>
                            <span className="font-medium">Path:</span>
                            <span className="ml-1 font-mono">
                              {step.currentPath.map(c => getCityName(c)).join('→')}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">Cost/Bound:</span>
                            <span className="ml-1 font-mono">
                              {step.currentCost}/{step.bound}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {result.steps.length > 15 && (
                      <div className="text-sm text-gray-600 italic">
                        ... and {result.steps.length - 15} more steps
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <div className="text-4xl mb-4">🌐</div>
                <p>Configure the distance matrix and click &quot;Solve TSP&quot; to find the optimal tour</p>
              </div>
            )}
          </div>
        </div>

        {/* Complexity Analysis */}
        {result && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Algorithm Efficiency Analysis</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-red-800 mb-3">Brute Force</h3>
                <div className="space-y-2 text-sm text-red-700">
                  <div><strong>Approach:</strong> Try all permutations</div>
                  <div><strong>Time:</strong> O(n!) = O({numCities}!)</div>
                  <div><strong>Total paths:</strong> {factorial(numCities - 1).toLocaleString()}</div>
                  <div><strong>Efficiency:</strong> Very poor for large n</div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Branch & Bound</h3>
                <div className="space-y-2 text-sm text-blue-700">
                  <div><strong>Approach:</strong> Prune suboptimal branches</div>
                  <div><strong>Nodes explored:</strong> {result.totalNodes}</div>
                  <div><strong>Nodes pruned:</strong> {result.prunedNodes}</div>
                  <div><strong>Efficiency:</strong> {((1 - result.totalNodes / factorial(numCities - 1)) * 100).toFixed(1)}% better</div>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-3">Solution Quality</h3>
                <div className="space-y-2 text-sm text-green-700">
                  <div><strong>Optimality:</strong> Guaranteed optimal</div>
                  <div><strong>Tour cost:</strong> {result.minCost}</div>
                  <div><strong>Tour length:</strong> {result.optimalPath.length} cities</div>
                  <div><strong>Returns to start:</strong> Yes</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {result && (
          <ExamResult
            title="Travelling Salesman Problem Analysis"
            input={`${numCities} cities with distance matrix`}
            result={result.minCost < Infinity}
            steps={result.steps.slice(0, 12).map((step, index) => ({
              stepNumber: index + 1,
              description: step.description,
              currentState: `Path: ${step.currentPath.map(c => getCityName(c)).join('→')}, Cost: ${step.currentCost}`,
              explanation: step.pruned 
                ? "Branch pruned due to bound exceeding current best"
                : step.description.includes('best')
                ? "New optimal solution found"
                : "Exploring promising branch"
            }))}
            finalAnswer={`Optimal tour: ${result.optimalPath.map(c => getCityName(c)).join('→')} with cost ${result.minCost}`}
            examFormat={{
              question: `Solve the TSP for ${numCities} cities using Branch and Bound technique.`,
              solution: [
                `Travelling Salesman Problem Analysis:`,
                `Number of cities: ${numCities} (${Array.from({length: numCities}, (_, i) => getCityName(i)).join(', ')})`,
                `Distance matrix: ${numCities}×${numCities} symmetric matrix`,
                `Optimal tour cost: ${result.minCost}`,
                `Optimal path: ${result.optimalPath.map(c => getCityName(c)).join(' → ')}`,
                `Algorithm: Branch and Bound with lower bound pruning`,
                `Total nodes in search tree: ${result.totalNodes}`,
                `Nodes pruned: ${result.prunedNodes}`,
                `Pruning efficiency: ${((result.prunedNodes / result.totalNodes) * 100).toFixed(1)}%`,
                `Brute force would require: ${factorial(numCities - 1)} path evaluations`,
                `Branch and bound explored: ${result.totalNodes} nodes`,
                `Improvement factor: ${(factorial(numCities - 1) / result.totalNodes).toFixed(1)}x faster`
              ],
              conclusion: `The optimal TSP tour visits all cities with minimum cost ${result.minCost}, achieved through efficient branch and bound pruning.`,
              marks: 10
            }}
          />
        )}
      </div>
    </div>
  );
}
