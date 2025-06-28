"use client";

import { useState } from "react";
import { NQueensChart } from "../../../components/NQueensChart";
import { nQueens, NQueensResult } from "../../../utils/backtracking";

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          N-Queens Problem (Backtracking)
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
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
                className="w-32 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
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

        {result && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Solution</h2>
            
            <div className={`border px-4 py-3 rounded mb-6 ${
              result.totalSolutions > 0 
                ? 'bg-green-100 border-green-400 text-green-700'
                : 'bg-red-100 border-red-400 text-red-700'
            }`}>
              <div className="flex items-center">
                <span className="text-2xl mr-2">
                  {result.totalSolutions > 0 ? '👑' : '❌'}
                </span>
                <div>
                  <p className="font-bold text-lg">
                    {result.totalSolutions > 0 
                      ? `Solution Found! (${result.totalSolutions} total solutions)`
                      : `No Solution Exists for ${boardSize}×${boardSize} board`
                    }
                  </p>
                  <p className="text-sm">
                    Steps explored: {result.steps.length}
                  </p>
                </div>
              </div>
            </div>

            <NQueensChart data={result} boardSize={boardSize} />
          </div>
        )}

        <div className="mt-8 bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2 text-purple-800">How N-Queens Backtracking works:</h3>
          <ul className="text-sm text-purple-700 space-y-1">
            <li>• <strong>Place:</strong> Try placing a queen in each column of the current row</li>
            <li>• <strong>Check:</strong> Verify the position is safe (no attacks from other queens)</li>
            <li>• <strong>Recurse:</strong> Move to the next row if placement is valid</li>
            <li>• <strong>Backtrack:</strong> If no valid placement exists, remove the last queen and try alternatives</li>
            <li>• <strong>Complete:</strong> Solution found when all N queens are placed safely</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
