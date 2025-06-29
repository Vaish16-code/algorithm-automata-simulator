"use client";

import { useState } from "react";
import { NQueensChart } from "../../../components/NQueensChart";
import { nQueens, NQueensResult } from "../../../utils/backtracking";
import { EducationalInfo, ExamResult } from "../../../../components";

export default function NQueensPage() {
  const [boardSize, setBoardSize] = useState(4);
  const [result, setResult] = useState<NQueensResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSolve = async () => {
    setIsLoading(true);
    try {
      // Use setTimeout to allow UI to update
      setTimeout(() => {
        const output = nQueens(boardSize);
        setResult(output);
        setIsLoading(false);
      }, 100);
    } catch (error) {
      console.error("Error solving N-Queens:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            N-Queens Problem <span className="text-purple-600">(Backtracking)</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Solve the classic N-Queens puzzle using backtracking algorithm with interactive visualization
          </p>
        </div>

        <EducationalInfo
          topic="N-Queens Problem (Backtracking)"
          description="The N-Queens problem is a classic example of backtracking algorithm. Place N queens on an N×N chessboard such that no two queens attack each other."
          theory={{
            definition: "Backtracking is an algorithmic approach that considers searching every possible combination in order to solve computational problems. It builds solutions incrementally and abandons candidates that cannot lead to a valid solution.",
            keyPoints: [
              "Systematic exploration of solution space",
              "Prune branches that cannot lead to valid solutions",
              "Recursive approach with state space tree",
              "Time complexity: O(N!) in worst case, optimized with pruning"
            ],
            applications: [
              "Constraint satisfaction problems",
              "Puzzle solving (Sudoku, N-Queens, Maze)",
              "Graph coloring and scheduling problems",
              "Combinatorial optimization"
            ]
          }}
          mumbaiUniversity={{
            syllabus: [
              "Backtracking algorithm design",
              "State space tree representation",
              "Pruning strategies and optimization",
              "N-Queens problem solution",
              "Time and space complexity analysis"
            ],
            marks: "8-10 marks",
            commonQuestions: [
              "Solve N-Queens for given board size",
              "Explain backtracking with state space tree",
              "Compare backtracking with other approaches",
              "Analyze time complexity of backtracking algorithms"
            ],
            examTips: [
              "Draw state space tree for small examples",
              "Show pruning conditions clearly",
              "Explain recursive calls and backtrack steps",
              "Calculate time complexity with pruning"
            ]
          }}
          algorithm={{
            steps: [
              "Start with empty board and first row",
              "Place queen in safe position in current row",
              "Check if placement conflicts with previous queens",
              "If safe, recursively solve for next row",
              "If no safe position, backtrack to previous row",
              "Continue until all queens are placed or no solution exists"
            ],
            complexity: {
              time: "O(N!) worst case, optimized with pruning",
              space: "O(N) for recursion stack"
            }
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Problem Setup</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Board Size (N x N):
                  </label>
                  <input
                    type="number"
                    min="4"
                    max="8"
                    className="w-32 border-4 border-gray-800 rounded-md px-4 py-3 text-lg font-bold text-black bg-white focus:border-purple-600 focus:ring-4 focus:ring-purple-200"
                    value={boardSize}
                    onChange={(e) => setBoardSize(parseInt(e.target.value) || 4)}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Recommended: 4-8 (larger boards may take longer)
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleSolve}
                    disabled={isLoading || boardSize < 4}
                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium px-6 py-2 rounded-md flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Solving...
                      </>
                    ) : (
                      `Solve ${boardSize}-Queens`
                    )}
                  </button>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-2">Problem Description:</h3>
                  <p className="text-sm text-purple-700">
                    Place {boardSize} queens on a {boardSize}×{boardSize} chessboard such that no two queens attack each other.
                    Queens can attack horizontally, vertically, and diagonally.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {result && (
              <ExamResult
                title="N-Queens Backtracking Solution"
                input={`${boardSize}×${boardSize} board`}
                result={result.totalSolutions > 0}
                steps={result.steps.map((step: { action?: string; position?: string; board?: number[][] }, index: number) => ({
                  stepNumber: index + 1,
                  description: step.action || `Trying position ${step.position || 'unknown'}`,
                  currentState: step.board ? `Board state at step ${index + 1}` : "Exploring solution space",
                  explanation: step.action === 'place' 
                    ? "Placing queen in safe position and recursing to next row"
                    : step.action === 'backtrack'
                    ? "No safe position found, backtracking to previous row"
                    : "Exploring possible queen placements"
                }))}
                finalAnswer={result.totalSolutions > 0 
                  ? `Found ${result.totalSolutions} solution(s) for ${boardSize}-Queens problem`
                  : `No solution exists for ${boardSize}-Queens problem`
                }
                examFormat={{
                  question: `Solve the ${boardSize}-Queens problem using backtracking algorithm.`,
                  solution: [
                    `N-Queens Problem for N = ${boardSize}:`,
                    `• Total recursive calls: ${result.steps.length}`,
                    `• Solutions found: ${result.totalSolutions}`,
                    `• Backtracking used: ${result.steps.filter((s: { action?: string }) => s.action === 'backtrack').length} times`,
                    `Algorithm approach:`,
                    `1. Place queens row by row`,
                    `2. Check conflicts with previously placed queens`,
                    `3. If conflict, try next column in current row`,
                    `4. If no safe column, backtrack to previous row`,
                    `5. Repeat until solution found or all possibilities exhausted`
                  ],
                  conclusion: result.totalSolutions > 0
                    ? `The ${boardSize}-Queens problem has ${result.totalSolutions} distinct solution(s).`
                    : `No solution exists for the ${boardSize}-Queens problem.`,
                  marks: 10
                }}
              />
            )}

            {result && result.totalSolutions > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Solution Visualization</h3>
                <NQueensChart data={result} boardSize={boardSize} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
