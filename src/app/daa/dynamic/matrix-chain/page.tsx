"use client";

import { useState } from "react";
import { matrixChainMultiplication, MatrixChainResult } from "../../../utils/dynamicProgramming";
import { EducationalInfo, ExamResult } from "../../../../components";

export default function MatrixChainPage() {
  const [dimensions, setDimensions] = useState([1, 2, 3, 4, 5]);
  const [result, setResult] = useState<MatrixChainResult | null>(null);

  const handleSolve = () => {
    if (dimensions.length < 3) {
      alert("Please enter at least 2 matrices (3 dimensions)");
      return;
    }
    const output = matrixChainMultiplication(dimensions);
    setResult(output);
  };

  const handleDimensionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newDimensions = value
      .split(',')
      .map(n => parseInt(n.trim()))
      .filter(n => !isNaN(n) && n > 0);
    setDimensions(newDimensions);
  };

  const generateRandomDimensions = () => {
    const numMatrices = Math.floor(Math.random() * 4) + 3; // 3-6 matrices
    const newDimensions = Array.from({ length: numMatrices + 1 }, () => Math.floor(Math.random() * 9) + 1);
    setDimensions(newDimensions);
  };

  const getMatrices = () => {
    const matrices = [];
    for (let i = 0; i < dimensions.length - 1; i++) {
      matrices.push({
        name: `M${i + 1}`,
        rows: dimensions[i],
        cols: dimensions[i + 1]
      });
    }
    return matrices;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Matrix Chain Multiplication <span className="text-purple-600">(Dynamic Programming)</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find the optimal way to parenthesize matrix chain multiplication to minimize scalar multiplications
          </p>
        </div>

        <EducationalInfo
          topic="Matrix Chain Multiplication Problem"
          description="Determine the optimal order of matrix multiplication to minimize the total number of scalar multiplications required."
          theory={{
            definition: "Given a chain of matrices, find the optimal parenthesization that minimizes the number of scalar multiplications needed to compute the product.",
            keyPoints: [
              "Matrix multiplication is associative but different parenthesizations have different costs",
              "Cost of multiplying A(p×q) and B(q×r) is p×q×r scalar multiplications",
              "Optimal substructure: optimal split for A₁...Aₙ contains optimal splits for subchains",
              "Overlapping subproblems: same subchains appear in multiple parenthesizations"
            ],
            applications: [
              "Computer graphics transformation chains",
              "Scientific computing optimization",
              "Database query optimization",
              "Compiler optimization for expression evaluation"
            ]
          }}
          mumbaiUniversity={{
            syllabus: [
              "Matrix chain multiplication problem formulation",
              "Dynamic programming approach",
              "Recurrence relation development",
              "Optimal parenthesization construction",
              "Time and space complexity analysis"
            ],
            marks: "8-10 marks",
            commonQuestions: [
              "Find minimum multiplications for given matrix chain",
              "Construct DP table step by step",
              "Show optimal parenthesization",
              "Trace algorithm execution with example"
            ],
            examTips: [
              "Remember recurrence: dp[i][j] = min(dp[i][k] + dp[k+1][j] + p[i]×p[k+1]×p[j+1])",
              "Fill table diagonally by chain length",
              "Show all intermediate calculations",
              "Construct parentheses using backtracking"
            ]
          }}
          algorithm={{
            steps: [
              "Create DP table dp[1..n][1..n] initialized to 0",
              "For chain length l = 2 to n:",
              "  For i = 1 to n-l+1:",
              "    j = i + l - 1",
              "    For k = i to j-1:",
              "      cost = dp[i][k] + dp[k+1][j] + p[i-1]×p[k]×p[j]",
              "      dp[i][j] = min(dp[i][j], cost)",
              "Construct optimal parentheses using recorded splits"
            ],
            complexity: {
              time: "O(n³) where n is number of matrices",
              space: "O(n²) for DP table"
            }
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Configure Matrix Chain</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Matrix Dimensions (comma-separated)
                </label>
                <input
                  type="text"
                  value={dimensions.join(', ')}
                  onChange={handleDimensionsChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 bg-white"
                  placeholder="e.g., 1, 2, 3, 4, 5 (creates matrices 1×2, 2×3, 3×4, 4×5)"
                />
                <p className="text-sm text-gray-600 mt-1">
                  For n matrices, enter n+1 dimensions. Each adjacent pair defines a matrix.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSolve}
                  disabled={dimensions.length < 3}
                  className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold disabled:bg-gray-400"
                >
                  Find Optimal Order
                </button>
                <button
                  onClick={generateRandomDimensions}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Random
                </button>
              </div>
            </div>

            {/* Matrix Display */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Matrix Chain:</h3>
              <div className="space-y-2">
                {getMatrices().map((matrix, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="bg-purple-100 text-purple-800 px-3 py-2 rounded-lg font-mono font-semibold">
                      {matrix.name}
                    </div>
                    <span className="text-gray-600">→</span>
                    <div className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg">
                      {matrix.rows} × {matrix.cols}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-sm text-gray-600">
                Total matrices: {getMatrices().length}
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Optimization Results</h2>
            
            {result ? (
              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">Optimal Solution:</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Minimum Multiplications:</span>
                      <span className="ml-2 text-2xl font-bold text-purple-600">{result.minMultiplications}</span>
                    </div>
                    <div>
                      <span className="font-medium">Optimal Parentheses:</span>
                      <div className="mt-1 bg-white p-2 rounded border-l-4 border-purple-400 font-mono text-purple-700">
                        {result.optimalParentheses}
                      </div>
                    </div>
                  </div>
                </div>

                {/* DP Table Visualization */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">DP Table (Minimum Costs):</h3>
                  <div className="overflow-x-auto">
                    <table className="text-sm border-collapse">
                      <thead>
                        <tr>
                          <th className="border border-gray-300 px-2 py-1 bg-gray-200">i\\j</th>
                          {result.dpTable.map((_, index) => (
                            <th key={index} className="border border-gray-300 px-2 py-1 bg-purple-100">
                              {index + 1}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {result.dpTable.map((row, i) => (
                          <tr key={i}>
                            <th className="border border-gray-300 px-2 py-1 bg-purple-100">{i + 1}</th>
                            {row.map((value, j) => (
                              <td
                                key={j}
                                className={`border border-gray-300 px-2 py-1 text-center font-mono ${
                                  i === j 
                                    ? 'bg-gray-200 text-gray-500' 
                                    : value === 0 
                                    ? 'bg-gray-100 text-gray-400'
                                    : j > i
                                    ? 'bg-green-50 text-green-700 font-semibold'
                                    : 'bg-gray-100'
                                }`}
                              >
                                {i === j ? '-' : value || ''}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    Diagonal elements are 0 (single matrix). Upper triangle shows minimum costs.
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Algorithm Steps:</h3>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
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
                <div className="text-4xl mb-4">⛓️</div>
                <p>Configure matrix dimensions and click &quot;Find Optimal Order&quot; to see the solution</p>
              </div>
            )}
          </div>
        </div>

        {/* Cost Comparison */}
        {result && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Why Parenthesization Matters</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-3">Optimal Order</h3>
                <div className="space-y-2 text-sm">
                  <div className="font-mono text-green-700">{result.optimalParentheses}</div>
                  <div><strong>Cost:</strong> {result.minMultiplications} scalar multiplications</div>
                  <div className="text-green-600">This is the minimum possible cost!</div>
                </div>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-red-800 mb-3">Example: Left-to-Right</h3>
                <div className="space-y-2 text-sm">
                  <div className="font-mono text-red-700">((M1 × M2) × M3) × ...</div>
                  <div><strong>Typically higher cost</strong></div>
                  <div className="text-red-600">Could be much worse than optimal!</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {result && (
          <ExamResult
            title="Matrix Chain Multiplication Analysis"
            input={`Dimensions: [${dimensions.join(', ')}]`}
            result={true}
            steps={result.steps.slice(0, 12).map((step, index) => ({
              stepNumber: index + 1,
              description: step,
              currentState: "Computing optimal splits...",
              explanation: step.includes('Split') 
                ? "Found better split point for this subchain"
                : "Processing matrix chain segment"
            }))}
            finalAnswer={`Minimum multiplications: ${result.minMultiplications}, Optimal order: ${result.optimalParentheses}`}
            examFormat={{
              question: `Find the minimum number of scalar multiplications needed to compute the matrix chain with dimensions [${dimensions.join(', ')}].`,
              solution: [
                `Matrix Chain Multiplication Analysis:`,
                `Input dimensions: [${dimensions.join(', ')}]`,
                `Number of matrices: ${dimensions.length - 1}`,
                `Matrix chain: ${getMatrices().map(m => `${m.name}(${m.rows}×${m.cols})`).join(' × ')}`,
                `Minimum scalar multiplications: ${result.minMultiplications}`,
                `Optimal parenthesization: ${result.optimalParentheses}`,
                `DP table size: ${dimensions.length - 1} × ${dimensions.length - 1}`,
                `Time complexity: O(n³) where n = ${dimensions.length - 1}`,
                `Space complexity: O(n²)`,
                `Recurrence: dp[i][j] = min(dp[i][k] + dp[k+1][j] + p[i]×p[k+1]×p[j+1])`
              ],
              conclusion: `The optimal parenthesization requires ${result.minMultiplications} scalar multiplications, achieved by the order ${result.optimalParentheses}.`,
              marks: 10
            }}
          />
        )}
      </div>
    </div>
  );
}
