"use client";

import { useState } from "react";
import { longestCommonSubsequence, LCSResult } from "../../../utils/dynamicProgramming";
import { EducationalInfo, ExamResult } from "../../../../components";

export default function LCSPage() {
  const [string1, setString1] = useState("ABCDGH");
  const [string2, setString2] = useState("AEDFHR");
  const [result, setResult] = useState<LCSResult | null>(null);

  const handleSolve = () => {
    const output = longestCommonSubsequence(string1, string2);
    setResult(output);
  };

  const generateRandomStrings = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const len1 = Math.floor(Math.random() * 6) + 4; // 4-9 chars
    const len2 = Math.floor(Math.random() * 6) + 4; // 4-9 chars
    
    const str1 = Array.from({ length: len1 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const str2 = Array.from({ length: len2 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    
    setString1(str1);
    setString2(str2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Longest Common Subsequence <span className="text-blue-600">(Dynamic Programming)</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find the longest subsequence common to two sequences using dynamic programming
          </p>
        </div>

        <EducationalInfo
          topic="Longest Common Subsequence (LCS)"
          description="LCS finds the longest subsequence that appears in the same relative order in both sequences, but not necessarily contiguous."
          theory={{
            definition: "A subsequence is a sequence that can be derived from another sequence by deleting some or no elements without changing the order of remaining elements.",
            keyPoints: [
              "Optimal substructure: LCS(X[1..m], Y[1..n]) depends on LCS of smaller subproblems",
              "Overlapping subproblems: same subproblems appear multiple times",
              "Bottom-up approach builds solution table systematically",
              "Time complexity O(mn), space complexity O(mn)"
            ],
            applications: [
              "DNA sequence analysis in bioinformatics",
              "Version control systems (diff algorithms)",
              "Spell checkers and text similarity",
              "Data compression and file comparison"
            ]
          }}
          mumbaiUniversity={{
            syllabus: [
              "Longest Common Subsequence problem",
              "Dynamic programming formulation",
              "Recurrence relation development",
              "Table filling approach",
              "Backtracking to find actual LCS"
            ],
            marks: "6-8 marks",
            commonQuestions: [
              "Find LCS of two given strings",
              "Construct DP table step by step",
              "Trace back to find the actual subsequence",
              "Analyze time and space complexity"
            ],
            examTips: [
              "Draw the DP table clearly",
              "Show the recurrence relation",
              "Trace back from bottom-right corner",
              "Highlight matching characters"
            ]
          }}
          algorithm={{
            steps: [
              "Create DP table of size (m+1) × (n+1)",
              "Initialize first row and column with zeros",
              "For each character pair:",
              "If characters match: dp[i][j] = dp[i-1][j-1] + 1",
              "Else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])",
              "Backtrack from dp[m][n] to construct LCS"
            ],
            complexity: {
              time: "O(m × n) where m, n are string lengths",
              space: "O(m × n) for DP table"
            }
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Configure LCS Problem</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First String
                </label>
                <input
                  type="text"
                  value={string1}
                  onChange={(e) => setString1(e.target.value.toUpperCase())}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white font-mono"
                  placeholder="Enter first string (e.g., ABCDGH)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Second String
                </label>
                <input
                  type="text"
                  value={string2}
                  onChange={(e) => setString2(e.target.value.toUpperCase())}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white font-mono"
                  placeholder="Enter second string (e.g., AEDFHR)"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSolve}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Find LCS
                </button>
                <button
                  onClick={generateRandomStrings}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Random
                </button>
              </div>
            </div>

            {/* Input Display */}
            <div className="mt-6 space-y-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-700">String 1:</h3>
                <div className="flex gap-1">
                  {string1.split('').map((char, index) => (
                    <div key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-mono text-sm">
                      {char}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700">String 2:</h3>
                <div className="flex gap-1">
                  {string2.split('').map((char, index) => (
                    <div key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded font-mono text-sm">
                      {char}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">LCS Results</h2>
            
            {result ? (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Longest Common Subsequence:</h3>
                  <div className="space-y-2">
                    <div className="flex gap-1">
                      {result.lcs.split('').map((char, index) => (
                        <span key={index} className="bg-blue-200 text-blue-800 px-3 py-2 rounded-lg font-mono text-lg font-bold">
                          {char}
                        </span>
                      ))}
                    </div>
                    <div className="text-blue-700">
                      <span className="font-medium">Length:</span>
                      <span className="ml-2 text-2xl font-bold">{result.length}</span>
                    </div>
                  </div>
                </div>

                {/* DP Table Visualization */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Dynamic Programming Table:</h3>
                  <div className="overflow-x-auto">
                    <table className="text-sm border-collapse">
                      <thead>
                        <tr>
                          <th className="border border-gray-300 px-2 py-1 bg-gray-200"></th>
                          <th className="border border-gray-300 px-2 py-1 bg-gray-200">ε</th>
                          {string2.split('').map((char, index) => (
                            <th key={index} className="border border-gray-300 px-2 py-1 bg-green-100 font-mono">
                              {char}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th className="border border-gray-300 px-2 py-1 bg-gray-200">ε</th>
                          {result.dpTable[0].map((value, index) => (
                            <td key={index} className="border border-gray-300 px-2 py-1 text-center font-mono">
                              {value}
                            </td>
                          ))}
                        </tr>
                        {string1.split('').map((char, i) => (
                          <tr key={i}>
                            <th className="border border-gray-300 px-2 py-1 bg-blue-100 font-mono">{char}</th>
                            {result.dpTable[i + 1].map((value, j) => (
                              <td
                                key={j}
                                className={`border border-gray-300 px-2 py-1 text-center font-mono ${
                                  j > 0 && string1[i] === string2[j - 1]
                                    ? 'bg-yellow-100 font-bold'
                                    : ''
                                }`}
                              >
                                {value}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Algorithm Steps:</h3>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {result.steps.slice(0, 10).map((step, index) => (
                      <div key={index} className="text-sm text-green-700">
                        {index + 1}. {step}
                      </div>
                    ))}
                    {result.steps.length > 10 && (
                      <div className="text-sm text-green-600 italic">
                        ... and {result.steps.length - 10} more steps
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <div className="text-4xl mb-4">🔤</div>
                <p>Enter two strings and click &quot;Find LCS&quot; to see the dynamic programming solution</p>
              </div>
            )}
          </div>
        </div>

        {result && (
          <ExamResult
            title="Longest Common Subsequence Analysis"
            input={`String 1: "${string1}", String 2: "${string2}"`}
            result={result.length > 0}
            steps={result.steps.slice(0, 15).map((step, index) => ({
              stepNumber: index + 1,
              description: step,
              currentState: `Building DP table...`,
              explanation: step.includes('Match') 
                ? "Characters match, add 1 to diagonal value"
                : step.includes('max')
                ? "No match, take maximum from left or top"
                : "Table initialization"
            }))}
            finalAnswer={`LCS: "${result.lcs}" with length ${result.length}`}
            examFormat={{
              question: `Find the Longest Common Subsequence between "${string1}" and "${string2}".`,
              solution: [
                `LCS Problem Analysis:`,
                `String 1: "${string1}" (length: ${string1.length})`,
                `String 2: "${string2}" (length: ${string2.length})`,
                `LCS found: "${result.lcs}"`,
                `LCS length: ${result.length}`,
                `DP table size: ${string1.length + 1} × ${string2.length + 1}`,
                `Time complexity: O(${string1.length} × ${string2.length})`,
                `Space complexity: O(${string1.length} × ${string2.length})`,
                `Recurrence: if s1[i] == s2[j]: dp[i][j] = dp[i-1][j-1] + 1`,
                `else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])`
              ],
              conclusion: `The longest common subsequence "${result.lcs}" has length ${result.length} and represents the optimal solution.`,
              marks: 8
            }}
          />
        )}
      </div>
    </div>
  );
}
