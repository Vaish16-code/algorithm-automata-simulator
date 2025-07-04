"use client";

import React, { useState, useRef, useEffect } from "react";
import { tspDynamicProgramming, TSPDPResult, TSPDPStep } from "@/app/utils/dynamicProgramming";
import { EducationalInfo, ExamResult } from "@/components";

interface Node {
  id: number;
  x: number;
  y: number;
  label: string;
}

export default function TSPDynamicPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [numCities, setNumCities] = useState(4);
  const [costMatrix, setCostMatrix] = useState([
    [0, 10, 15, 20],
    [10, 0, 35, 25],
    [15, 35, 0, 30],
    [20, 25, 30, 0]
  ]);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [result, setResult] = useState<TSPDPResult | null>(null);
  const [animationStep, setAnimationStep] = useState<number>(-1);

  useEffect(() => {
    generateNodes();
  }, [numCities]);

  useEffect(() => {
    drawGraph();
  }, [nodes, result, animationStep]);

  const generateNodes = () => {
    const newNodes: Node[] = [];
    const centerX = 250;
    const centerY = 150;
    const radius = 100;
    
    for (let i = 0; i < numCities; i++) {
      const angle = (2 * Math.PI * i) / numCities;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      newNodes.push({
        id: i,
        x,
        y,
        label: String.fromCharCode(65 + i) // A, B, C, D...
      });
    }
    
    setNodes(newNodes);
  };

  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all edges with weights
    for (let i = 0; i < numCities; i++) {
      for (let j = i + 1; j < numCities; j++) {
        if (i !== j) {
          const fromNode = nodes[i];
          const toNode = nodes[j];
          
          if (fromNode && toNode) {
            ctx.beginPath();
            ctx.moveTo(fromNode.x, fromNode.y);
            ctx.lineTo(toNode.x, toNode.y);
            
            // Highlight edge if it's in optimal path
            if (result && result.optimalPath && animationStep >= 0) {              const isInPath = result.optimalPath.some((cityId: number, index: number) =>
                (index < result.optimalPath.length - 1 && 
                 ((cityId === i && result.optimalPath[index + 1] === j) ||
                  (cityId === j && result.optimalPath[index + 1] === i))) ||
                (index === result.optimalPath.length - 1 && 
                 ((cityId === i && result.optimalPath[0] === j) ||
                  (cityId === j && result.optimalPath[0] === i)))
              );
              
              if (isInPath) {
                ctx.strokeStyle = '#22c55e';
                ctx.lineWidth = 4;
              } else {
                ctx.strokeStyle = '#e5e7eb';
                ctx.lineWidth = 1;
              }
            } else {
              ctx.strokeStyle = '#6b7280';
              ctx.lineWidth = 2;
            }
            
            ctx.stroke();

            // Draw weight
            const midX = (fromNode.x + toNode.x) / 2;
            const midY = (fromNode.y + toNode.y) / 2;
            ctx.fillStyle = '#1f2937';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            
            // Add background for better visibility
            const text = costMatrix[i][j].toString();
            const textWidth = ctx.measureText(text).width;
            ctx.fillStyle = 'white';
            ctx.fillRect(midX - textWidth/2 - 2, midY - 8, textWidth + 4, 16);
            ctx.fillStyle = '#1f2937';
            ctx.fillText(text, midX, midY + 4);
          }
        }
      }
    }

    // Draw nodes
    nodes.forEach((node, index) => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
      
      // Node colors
      if (index === 0) {
        ctx.fillStyle = '#ef4444'; // Starting city - red
      } else if (result && result.optimalPath && result.optimalPath.includes(index)) {
        ctx.fillStyle = '#22c55e'; // In optimal path - green
      } else {
        ctx.fillStyle = '#e5e7eb'; // Default - gray
      }
      
      ctx.fill();
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw label
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(node.label, node.x, node.y + 5);
    });

    // Draw optimal path if available
    if (result && result.optimalPath && animationStep >= 0) {
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 4;
      ctx.beginPath();
      
      for (let i = 0; i < result.optimalPath.length; i++) {
        const currentCity = result.optimalPath[i];
        const nextCity = result.optimalPath[(i + 1) % result.optimalPath.length];
        
        const fromNode = nodes[currentCity];
        const toNode = nodes[nextCity];
        
        if (fromNode && toNode) {
          if (i === 0) {
            ctx.moveTo(fromNode.x, fromNode.y);
          }
          ctx.lineTo(toNode.x, toNode.y);
        }
      }
      
      ctx.stroke();
    }
  };

  const handleSolve = () => {
    const tspResult = tspDynamicProgramming(costMatrix);
    setResult(tspResult);
    setAnimationStep(0);
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
        return Math.floor(Math.random() * 30) + 5; // 5-34 cost
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

  const getCityName = (index: number) => String.fromCharCode(65 + index);

  const nextStep = () => {
    if (result && animationStep < result.steps.length - 1) {
      setAnimationStep(animationStep + 1);
    }
  };

  const prevStep = () => {
    if (animationStep > 0) {
      setAnimationStep(animationStep - 1);
    }
  };

  const resetAnimation = () => {
    setAnimationStep(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            TSP <span className="text-orange-600">(Dynamic Programming)</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Solve Travelling Salesman Problem using Held-Karp dynamic programming algorithm
          </p>
        </div>

        <EducationalInfo
          topic="Travelling Salesman Problem - Dynamic Programming Approach"
          description="The Held-Karp algorithm uses dynamic programming to solve TSP in O(n²2ⁿ) time, which is exponentially better than brute force O(n!) but still exponential."
          theory={{
            definition: "Find the shortest possible route that visits each city exactly once and returns to the starting city using dynamic programming with bitmasks to represent visited sets.",
            keyPoints: [
              "Uses bitmasks to represent subsets of visited cities",
              "Optimal substructure: optimal tour contains optimal sub-tours",
              "Memoization prevents recalculating same subproblems",
              "Still exponential but much better than brute force"
            ],
            applications: [
              "Vehicle routing and logistics",
              "Circuit board drilling optimization",
              "DNA sequencing assembly",
              "Warehouse order picking optimization"
            ]
          }}
          mumbaiUniversity={{
            syllabus: [
              "Travelling Salesman Problem formulation",
              "Dynamic programming with bitmasks",
              "Held-Karp algorithm implementation",
              "State space representation",
              "Time and space complexity analysis"
            ],
            marks: "10-15 marks",
            commonQuestions: [
              "Solve TSP using dynamic programming",
              "Explain state representation with bitmasks",
              "Show DP table construction step by step",
              "Trace back optimal tour from DP table"
            ],
            examTips: [
              "DP[mask][i] = minimum cost to visit cities in mask ending at city i",
              "Base case: DP[1][0] = 0 (start at city 0)",
              "Recurrence: DP[mask][i] = min(DP[mask^(1<<i)][j] + dist[j][i])",
              "Show bitmask representation clearly in solution"
            ]
          }}
          algorithm={{
            steps: [
              "Initialize DP table: DP[mask][i] = min cost to visit cities in mask, ending at i",
              "Base case: DP[1][0] = 0 (start at city 0 with only city 0 visited)",
              "For each subset mask and city i: compute DP[mask][i]",
              "For each previous city j: DP[mask][i] = min(DP[mask^(1<<i)][j] + cost[j][i])",
              "Final answer: min over all cities i of (DP[fullMask][i] + cost[i][0])",
              "Trace back path using parent pointers"
            ],
            complexity: {
              time: "O(n²2ⁿ) where n is number of cities",
              space: "O(n2ⁿ) for DP table"
            }
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Input Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-orange-200">
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
                  Solve TSP (DP)
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
              <div className="overflow-x-auto bg-white rounded border-2 border-gray-300">
                <table className="border-collapse">
                  <thead>
                    <tr>
                      <th className="border border-gray-400 px-3 py-2 bg-orange-200 text-sm font-bold">From\\To</th>
                      {Array.from({ length: numCities }, (_, i) => (
                        <th key={i} className="border border-gray-400 px-3 py-2 bg-orange-100 text-sm font-bold">
                          {getCityName(i)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {costMatrix.map((row, i) => (
                      <tr key={i}>
                        <th className="border border-gray-400 px-3 py-2 bg-orange-100 text-sm font-bold">{getCityName(i)}</th>
                        {row.map((cost, j) => (
                          <td key={j} className="border border-gray-400 p-1">
                            {i === j ? (
                              <div className="w-16 h-8 bg-gray-200 flex items-center justify-center text-sm font-bold">-</div>
                            ) : (
                              <input
                                type="number"
                                value={cost}
                                onChange={(e) => updateCostCell(i, j, e.target.value)}
                                min="0"
                                className="w-16 h-8 text-center text-sm border-none outline-none text-gray-900 bg-white font-bold"
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

            {/* Graph Visualization */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Graph Visualization:</h3>
              <div className="border border-gray-300 rounded-lg">
                <canvas
                  ref={canvasRef}
                  width={500}
                  height={300}
                  className="border rounded-lg bg-gray-50"
                />
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-orange-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Algorithm Results</h2>
            
            {result ? (
              <div className="space-y-4">
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={prevStep}
                    disabled={animationStep <= 0}
                    className="px-3 py-1 bg-orange-500 text-white rounded disabled:bg-gray-300"
                  >
                    ← Prev
                  </button>
                  
                  <button
                    onClick={resetAnimation}
                    className="px-3 py-1 bg-orange-600 text-white rounded"
                  >
                    Reset
                  </button>
                  
                  <button
                    onClick={nextStep}
                    disabled={!result || animationStep >= result.steps.length - 1}
                    className="px-3 py-1 bg-orange-500 text-white rounded disabled:bg-gray-300"
                  >
                    Next →
                  </button>
                  
                  <span className="px-3 py-1 bg-gray-100 rounded text-sm">
                    Step {animationStep + 1} / {result.steps.length}
                  </span>
                </div>

                {/* Current Step Info */}
                {animationStep >= 0 && result.steps[animationStep] && (
                  <div className="bg-orange-50 p-4 rounded-lg border-2 border-orange-300">
                    <h3 className="font-bold text-orange-800 mb-2 text-lg">
                      {result.steps[animationStep].description}
                    </h3>
                    <div className="text-sm text-orange-700 font-medium">
                      <p><strong>Mask:</strong> {result.steps[animationStep].mask}</p>
                      <p><strong>Current City:</strong> {result.steps[animationStep].currentCity !== undefined ? getCityName(result.steps[animationStep].currentCity) : 'N/A'}</p>
                      <p><strong>Action:</strong> {result.steps[animationStep].action}</p>
                    </div>
                  </div>
                )}

                {/* Final Results */}
                {animationStep === result.steps.length - 1 && (
                  <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300">
                    <h3 className="font-bold text-green-800 mb-3 text-lg">🎯 Optimal Solution Found!</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">Minimum Cost:</span>
                        <span className="ml-2 text-3xl font-bold text-green-600">{result.minCost}</span>
                      </div>
                      <div>
                        <span className="font-medium">Optimal Tour:</span>
                        <div className="mt-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            {result.optimalPath.map((city: number, index: number) => (
                              <React.Fragment key={index}>
                                <div className="bg-green-200 text-green-800 px-3 py-2 rounded-lg font-bold">
                                  {getCityName(city)}
                                </div>
                                {index < result.optimalPath.length - 1 && (
                                  <span className="text-green-600 font-bold">→</span>
                                )}
                              </React.Fragment>
                            ))}
                            <span className="text-green-600 font-bold">→</span>
                            <div className="bg-green-200 text-green-800 px-3 py-2 rounded-lg font-bold">
                              {getCityName(result.optimalPath[0])}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Algorithm Performance */}
                <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-300">
                  <h3 className="font-bold text-blue-800 mb-2 text-lg">Algorithm Performance:</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm font-medium">
                    <div>
                      <span className="font-medium">States Computed:</span>
                      <span className="ml-2 text-blue-600">{result.statesComputed}</span>
                    </div>
                    <div>
                      <span className="font-medium">Total States:</span>
                      <span className="ml-2 text-blue-600">{Math.pow(2, numCities) * numCities}</span>
                    </div>
                    <div>
                      <span className="font-medium">Time Complexity:</span>
                      <span className="ml-2 text-blue-600">O(n²2ⁿ)</span>
                    </div>
                    <div>
                      <span className="font-medium">Space Complexity:</span>
                      <span className="ml-2 text-blue-600">O(n2ⁿ)</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <div className="text-4xl mb-4">🌐</div>
                <p>Configure the distance matrix and click &quot;Solve TSP (DP)&quot; to find the optimal tour</p>
              </div>
            )}
          </div>
        </div>

        {/* DP Table Visualization */}
        {result && (
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-orange-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Dynamic Programming Table</h2>
            <div className="overflow-x-auto bg-gray-50 rounded border-2 border-gray-300">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-orange-600 text-white">
                    <th className="border border-gray-400 px-3 py-3 font-bold">Mask (Binary)</th>
                    <th className="border border-gray-400 px-3 py-3 font-bold">Cities Visited</th>
                    <th className="border border-gray-400 px-3 py-3 font-bold">Last City</th>
                    <th className="border border-gray-400 px-3 py-3 font-bold">Min Cost</th>
                    <th className="border border-gray-400 px-3 py-3 font-bold">Previous City</th>
                  </tr>
                </thead>
                <tbody>
                  {result.dpTable && Object.entries(result.dpTable).map(([key, value], index) => {
                    const dpValue = value as { cost: number; parent?: number };
                    const [mask, lastCity] = key.split('-').map(Number);
                    const binaryMask = mask.toString(2).padStart(numCities, '0');
                    const visitedCities = [];
                    for (let i = 0; i < numCities; i++) {
                      if (mask & (1 << i)) {
                        visitedCities.push(getCityName(i));
                      }
                    }
                    
                    return (
                      <tr key={index} className={`${
                        index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
                      } border-b border-gray-300`}>
                        <td className="border border-gray-400 px-3 py-2 font-mono text-center font-bold text-purple-600">{binaryMask}</td>
                        <td className="border border-gray-400 px-3 py-2 text-center font-bold text-blue-600">{visitedCities.join(', ')}</td>
                        <td className="border border-gray-400 px-3 py-2 text-center font-bold text-green-600">{getCityName(lastCity)}</td>
                        <td className="border border-gray-400 px-3 py-2 text-center font-bold text-red-600">{dpValue.cost === Infinity ? '∞' : dpValue.cost}</td>
                        <td className="border border-gray-400 px-3 py-2 text-center font-bold text-orange-600">{dpValue.parent !== undefined ? getCityName(dpValue.parent) : '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Step-by-Step Execution */}
        {result && (
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-orange-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Step-by-Step Execution</h2>
            <div className="overflow-x-auto bg-gray-50 rounded border-2 border-gray-300">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-orange-700 text-white">
                    <th className="border border-gray-400 px-3 py-3 font-bold">Step</th>
                    <th className="border border-gray-400 px-3 py-3 font-bold">Description</th>
                    <th className="border border-gray-400 px-3 py-3 font-bold">Mask</th>
                    <th className="border border-gray-400 px-3 py-3 font-bold">City</th>
                    <th className="border border-gray-400 px-3 py-3 font-bold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {result.steps.map((step: TSPDPStep, index: number) => (
                    <tr key={index} className={`${
                      index === animationStep ? 'bg-yellow-200 font-bold' : 
                      index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
                    } border-b border-gray-300`}>
                      <td className="border border-gray-400 px-3 py-2 font-bold text-center text-orange-600">{index + 1}</td>
                      <td className="border border-gray-400 px-3 py-2 text-center font-medium">{step.description}</td>
                      <td className="border border-gray-400 px-3 py-2 font-mono text-center text-purple-600 font-bold">{step.mask}</td>
                      <td className="border border-gray-400 px-3 py-2 text-center font-bold text-blue-600">
                        {step.currentCity !== undefined ? getCityName(step.currentCity) : '-'}
                      </td>
                      <td className="border border-gray-400 px-3 py-2 text-center font-medium">{step.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {result && (
          <ExamResult
            title="TSP Dynamic Programming Analysis"
            input={`${numCities} cities with distance matrix`}
            result={result.minCost < Infinity}
            steps={result.steps.slice(0, 10).map((step: TSPDPStep, index: number) => ({
              stepNumber: index + 1,
              description: step.description,
              currentState: `Mask: ${step.mask}, City: ${step.currentCity !== undefined ? getCityName(step.currentCity) : 'N/A'}`,
              explanation: step.action
            }))}
            finalAnswer={`Optimal tour: ${result.optimalPath.map((c: number) => getCityName(c)).join('→')}→${getCityName(result.optimalPath[0])} with cost ${result.minCost}`}
            examFormat={{
              question: `Solve TSP for ${numCities} cities using dynamic programming (Held-Karp algorithm).`,
              solution: [
                `TSP Dynamic Programming Solution:`,
                `Number of cities: ${numCities} (${Array.from({length: numCities}, (_, i) => getCityName(i)).join(', ')})`,
                `Algorithm: Held-Karp with bitmask DP`,
                `State representation: DP[mask][i] = min cost to visit cities in mask, ending at city i`,
                `Time complexity: O(n²2ⁿ) = O(${numCities}²2^${numCities})`,
                `Space complexity: O(n2ⁿ) = O(${numCities}2^${numCities})`,
                `States computed: ${result.statesComputed}`,
                `Optimal tour cost: ${result.minCost}`,
                `Optimal path: ${result.optimalPath.map((c: number) => getCityName(c)).join(' → ')} → ${getCityName(result.optimalPath[0])}`
              ],
              conclusion: `Dynamic programming solved TSP optimally with cost ${result.minCost}, using ${result.statesComputed} state computations.`,
              marks: 15
            }}
          />
        )}
      </div>
    </div>
  );
}
