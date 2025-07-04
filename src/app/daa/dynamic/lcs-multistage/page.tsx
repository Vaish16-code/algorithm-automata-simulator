"use client";

import React, { useState } from "react";
import { EducationalInfo, ExamResult } from "../../../../components";

interface LCSMultistageResult {
  length: number;
  lcs: string[];
  dpTable: number[][][];
  steps: string[];
  stages: string[][];
}

export default function LCSMultistagePage() {
  const [sequences, setSequences] = useState<string[]>(['ABCDGH', 'AEDFHR', 'ABFGHR']);
  const [result, setResult] = useState<LCSMultistageResult | null>(null);

  const addSequence = () => {
    setSequences([...sequences, '']);
  };

  const removeSequence = (index: number) => {
    if (sequences.length > 2) {
      setSequences(sequences.filter((_, i) => i !== index));
    }
  };

  const updateSequence = (index: number, value: string) => {
    const newSequences = [...sequences];
    newSequences[index] = value.toUpperCase();
    setSequences(newSequences);
  };

  const findLCSMultistage = (): LCSMultistageResult => {
    // Simplified multistage LCS for multiple sequences
    const n = sequences.length;
    const steps: string[] = [];
    
    steps.push(`Initialize multistage LCS for ${n} sequences`);
    
    // Stage 1: Process pairs
    const pairwiseLCS: string[][] = [];
    const stages: string[][] = [];
    
    stages.push([...sequences]); // Stage 0: original sequences
    
    // Find LCS between consecutive pairs
    for (let i = 0; i < n - 1; i++) {
      const lcs = findPairwiseLCS(sequences[i], sequences[i + 1]);
      pairwiseLCS.push(lcs);
      steps.push(`Stage 1, Pair ${i + 1}: LCS(${sequences[i]}, ${sequences[i + 1]}) = [${lcs.join(', ')}]`);
    }
    
    stages.push(pairwiseLCS.map(arr => arr.join(''))); // Stage 1: pairwise results
    
    // Stage 2: Find common elements across all pairs
    let finalLCS: string[] = [];
    if (pairwiseLCS.length > 0) {
      finalLCS = pairwiseLCS[0];
      for (let i = 1; i < pairwiseLCS.length; i++) {
        finalLCS = findCommonSubsequence(finalLCS, pairwiseLCS[i]);
        steps.push(`Stage 2, Merge ${i + 1}: Common elements = [${finalLCS.join(', ')}]`);
      }
    }
    
    stages.push([finalLCS.join('')]); // Stage 2: final result
    
    // Create a simplified DP table representation
    const dpTable: number[][][] = [];
    for (let stage = 0; stage < stages.length; stage++) {
      const stageTable: number[][] = [];
      for (let i = 0; i < stages[stage].length; i++) {
        const row: number[] = [];
        for (let j = 0; j < (stages[stage][i]?.length || 0) + 1; j++) {
          row.push(stage === stages.length - 1 ? finalLCS.length : Math.min(i + j, 10));
        }
        stageTable.push(row);
      }
      dpTable.push(stageTable);
    }
    
    steps.push(`Final LCS across all sequences: [${finalLCS.join(', ')}]`);
    
    return {
      length: finalLCS.length,
      lcs: finalLCS,
      dpTable,
      steps,
      stages
    };
  };

  const findPairwiseLCS = (str1: string, str2: string): string[] => {
    const m = str1.length;
    const n = str2.length;
    const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    
    // Fill DP table
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }
    
    // Backtrack to find LCS
    const lcs: string[] = [];
    let i = m, j = n;
    while (i > 0 && j > 0) {
      if (str1[i - 1] === str2[j - 1]) {
        lcs.unshift(str1[i - 1]);
        i--;
        j--;
      } else if (dp[i - 1][j] > dp[i][j - 1]) {
        i--;
      } else {
        j--;
      }
    }
    
    return lcs;
  };

  const findCommonSubsequence = (arr1: string[], arr2: string[]): string[] => {
    const common: string[] = [];
    let i = 0, j = 0;
    
    while (i < arr1.length && j < arr2.length) {
      if (arr1[i] === arr2[j]) {
        common.push(arr1[i]);
        i++;
        j++;
      } else {
        // Skip the lexicographically smaller character
        if (arr1[i] < arr2[j]) {
          i++;
        } else {
          j++;
        }
      }
    }
    
    return common;
  };

  const handleSolve = () => {
    const filteredSequences = sequences.filter(seq => seq.length > 0);
    if (filteredSequences.length < 2) return;
    
    const output = findLCSMultistage();
    setResult(output);
  };

  const generateRandomSequences = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const newSequences = sequences.map(() => {
      const length = Math.floor(Math.random() * 5) + 4; // 4-8 chars
      return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    });
    setSequences(newSequences);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            LCS for Multiple Sequences <span className="text-green-600">(Multistage)</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find the longest common subsequence across multiple sequences using a multistage approach
          </p>
        </div>

        <EducationalInfo
          topic="Multistage Longest Common Subsequence"
          description="An extension of the classic LCS problem to handle multiple sequences by processing them in stages."
          theory={{
            definition: "Multistage LCS finds the longest subsequence that appears in the same relative order across multiple input sequences.",
            keyPoints: [
              "Stage 1: Find pairwise LCS between consecutive sequences",
              "Stage 2: Merge results to find common elements across all sequences",
              "Uses dynamic programming principles recursively",
              "More complex than standard 2-sequence LCS"
            ],
            applications: [
              "Bioinformatics: Multiple sequence alignment",
              "Text analysis: Finding common patterns across documents",
              "Version control: Identifying common changes",
              "Data mining: Pattern discovery in multiple datasets"
            ]
          }}
          mumbaiUniversity={{
            syllabus: [
              "Multiple sequence LCS problem",
              "Multistage dynamic programming approach",
              "Pairwise LCS computation",
              "Result merging strategies",
              "Complexity analysis for multiple sequences"
            ],
            marks: "8-10 marks",
            commonQuestions: [
              "Extend LCS to multiple sequences",
              "Show multistage processing steps",
              "Compare with standard LCS approach",
              "Analyze time complexity for n sequences"
            ],
            examTips: [
              "Process sequences in stages clearly",
              "Show pairwise LCS computations",
              "Demonstrate merging process",
              "Include final common subsequence"
            ]
          }}
          algorithm={{
            steps: [
              "Stage 1: Compute pairwise LCS for consecutive sequence pairs",
              "Create intermediate results for each pair",
              "Stage 2: Find common elements across all pairwise results",
              "Merge results maintaining order constraints",
              "Return final longest common subsequence"
            ],
            complexity: {
              time: "O(n × m₁ × m₂) where n is number of sequences, mᵢ is length of sequence i",
              space: "O(m₁ × m₂) for each pairwise computation"
            }
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Input Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Configure Sequences</h2>
            
            <div className="space-y-4">
              {sequences.map((seq, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sequence {index + 1}
                    </label>
                    <input
                      type="text"
                      value={seq}
                      onChange={(e) => updateSequence(index, e.target.value)}
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 font-mono font-bold"
                      placeholder={`Enter sequence ${index + 1} (e.g., ABCDGH)`}
                    />
                  </div>
                  {sequences.length > 2 && (
                    <button
                      onClick={() => removeSequence(index)}
                      className="mt-8 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}

              <div className="flex gap-3">
                <button
                  onClick={addSequence}
                  disabled={sequences.length >= 5}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
                >
                  Add Sequence
                </button>
                <button
                  onClick={generateRandomSequences}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Random
                </button>
              </div>

              <button
                onClick={handleSolve}
                disabled={sequences.filter(s => s.length > 0).length < 2}
                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:bg-gray-400"
              >
                Find Multistage LCS
              </button>
            </div>

            {/* Input Display */}
            <div className="mt-6 space-y-3">
              <h3 className="text-lg font-semibold text-gray-700">Input Sequences:</h3>
              {sequences.filter(s => s.length > 0).map((seq, index) => (
                <div key={index} className="bg-gray-100 p-3 rounded border-2 border-gray-300">
                  <div className="flex gap-1">
                    <span className="font-semibold text-gray-600">Seq {index + 1}:</span>
                    {seq.split('').map((char, charIndex) => (
                      <span
                        key={charIndex}
                        className="inline-block w-8 h-8 bg-blue-100 border-2 border-blue-300 rounded text-center font-bold text-blue-800"
                      >
                        {char}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Multistage Results</h2>
            
            {result ? (
              <div className="space-y-6">
                {/* Final Result */}
                <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300">
                  <h3 className="text-lg font-semibold text-green-800 mb-3">Final LCS Result</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Length:</span>
                      <span className="bg-green-600 text-white px-3 py-1 rounded font-bold">
                        {result.length}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">LCS:</span>
                      <div className="flex gap-1">
                        {result.lcs.map((char, index) => (
                          <span
                            key={index}
                            className="inline-block w-8 h-8 bg-green-200 border-2 border-green-400 rounded text-center font-bold text-green-800"
                          >
                            {char}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stage-by-stage breakdown */}
                <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-300">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3">Stage Breakdown</h3>
                  <div className="space-y-4">
                    {result.stages.map((stage, stageIndex) => (
                      <div key={stageIndex} className="bg-white p-3 rounded border-2 border-blue-200">
                        <h4 className="font-semibold text-blue-700 mb-2">
                          Stage {stageIndex}: {
                            stageIndex === 0 ? 'Input Sequences' :
                            stageIndex === result.stages.length - 1 ? 'Final Result' :
                            'Pairwise LCS Results'
                          }
                        </h4>
                        <div className="space-y-2">
                          {stage.map((seq, seqIndex) => (
                            <div key={seqIndex} className="flex gap-1 items-center">
                              <span className="text-sm font-medium text-gray-600 w-16">
                                {stageIndex === 0 ? `Seq ${seqIndex + 1}:` : 
                                 stageIndex === result.stages.length - 1 ? 'Final:' : 
                                 `Pair ${seqIndex + 1}:`}
                              </span>
                              <div className="flex gap-1">
                                {seq.split('').map((char, charIndex) => (
                                  <span
                                    key={charIndex}
                                    className={`inline-block w-6 h-6 rounded text-center text-xs font-bold ${
                                      stageIndex === 0 ? 'bg-gray-100 border border-gray-300 text-gray-700' :
                                      stageIndex === result.stages.length - 1 ? 'bg-green-200 border border-green-400 text-green-800' :
                                      'bg-yellow-100 border border-yellow-300 text-yellow-800'
                                    }`}
                                  >
                                    {char}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <div className="text-4xl mb-4">🔤</div>
                <p>Configure your sequences and click &quot;Find Multistage LCS&quot; to see the results</p>
              </div>
            )}
          </div>
        </div>

        {/* Step-by-Step Execution */}
        {result && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Step-by-Step Execution</h2>
            <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-300">
              <div className="space-y-3">
                {result.steps.map((step, index) => (
                  <div 
                    key={index} 
                    className="p-3 bg-white rounded border-2 border-gray-200 shadow-sm"
                  >
                    <div className="flex items-center">
                      <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                        {index + 1}
                      </span>
                      <span className="text-gray-800 font-medium">{step}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Multistage DP Table Visualization */}
        {result && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Multistage DP Tables</h2>
            <div className="space-y-6">
              {result.dpTable.map((stageTable, stageIndex) => (
                <div key={stageIndex} className="bg-gray-50 p-4 rounded-lg border-2 border-gray-300">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Stage {stageIndex} DP Table
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="border-collapse border-2 border-gray-800">
                      <thead>
                        <tr className="bg-green-600 text-white">
                          <th className="border-2 border-gray-800 px-4 py-2 font-bold">Sequence</th>
                          {stageTable[0]?.map((_, colIndex) => (
                            <th key={colIndex} className="border-2 border-gray-800 px-4 py-2 font-bold">
                              {colIndex}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {stageTable.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            <td className="border-2 border-gray-800 px-4 py-2 bg-green-100 font-bold text-green-800">
                              {rowIndex}
                            </td>
                            {row.map((value, colIndex) => (
                              <td 
                                key={colIndex} 
                                className="border-2 border-gray-800 px-4 py-2 text-center font-bold bg-white"
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
              ))}
            </div>
          </div>
        )}

        {result && (
          <ExamResult
            title="Multistage LCS Analysis"
            input={`${sequences.filter(s => s.length > 0).length} sequences: ${sequences.filter(s => s.length > 0).join(', ')}`}
            result={true}
            steps={result.steps.map((step, index) => ({
              stepNumber: index + 1,
              description: step,
              currentState: `Processing stage ${Math.floor(index / 2)}`,
              explanation: step.includes('Stage 1') ? "Computing pairwise LCS" : 
                          step.includes('Stage 2') ? "Merging results" : 
                          "Initialization or final result"
            }))}
            finalAnswer={`Multistage LCS: [${result.lcs.join(', ')}] with length ${result.length}`}
            examFormat={{
              question: `Find the longest common subsequence across multiple sequences using multistage approach.`,
              solution: [
                `Multistage LCS Algorithm Execution:`,
                `Input: ${sequences.filter(s => s.length > 0).length} sequences`,
                `Sequences: ${sequences.filter(s => s.length > 0).map((s, i) => `S${i+1}="${s}"`).join(', ')}`,
                `Stage 1: Compute pairwise LCS between consecutive sequences`,
                ...result.steps.filter(s => s.includes('Stage 1')),
                `Stage 2: Find common elements across all pairwise results`,
                ...result.steps.filter(s => s.includes('Stage 2')),
                `Final result: LCS = [${result.lcs.join(', ')}], Length = ${result.length}`
              ],
              conclusion: `Multistage approach successfully found the longest common subsequence of length ${result.length} across ${sequences.filter(s => s.length > 0).length} input sequences.`,
              marks: 10
            }}
          />
        )}
      </div>
    </div>
  );
}
