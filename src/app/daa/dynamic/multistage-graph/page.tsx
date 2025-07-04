"use client";

import React, { useState, useRef, useEffect } from "react";
import { multistageGraphAlgorithm, MultistageGraphResult } from "@/app/utils/dynamicProgramming";
import { EducationalInfo, ExamResult } from "@/components";

interface Node {
  id: number;
  stage: number;
  x: number;
  y: number;
  label: string;
}

interface Edge {
  from: number;
  to: number;
  weight: number;
}

export default function MultistageGraphPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [numStages, setNumStages] = useState<number>(4);
  const [nodesPerStage, setNodesPerStage] = useState<number[]>([1, 2, 2, 1]);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [isDrawingMode, setIsDrawingMode] = useState<'edge' | 'none'>('none');
  const [edgeStart, setEdgeStart] = useState<number | null>(null);
  const [edgeWeight, setEdgeWeight] = useState<string>('1');
  const [result, setResult] = useState<MultistageGraphResult | null>(null);
  const [animationStep, setAnimationStep] = useState<number>(-1);

  useEffect(() => {
    generateGraph();
  }, [numStages, nodesPerStage]);

  useEffect(() => {
    drawGraph();
  }, [nodes, edges, selectedNode, animationStep, result]);

  const generateGraph = () => {
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    let nodeId = 0;
    
    // Generate nodes for each stage
    for (let stage = 0; stage < numStages; stage++) {
      const stageNodes = nodesPerStage[stage] || 1;
      const stageX = 100 + stage * 120;
      
      for (let i = 0; i < stageNodes; i++) {
        const y = 100 + (i * 200 / Math.max(stageNodes - 1, 1));
        newNodes.push({
          id: nodeId,
          stage,
          x: stageX,
          y: y,
          label: stage === 0 ? 'S' : stage === numStages - 1 ? 'T' : `${stage}-${i + 1}`
        });
        nodeId++;
      }
    }
    
    // Generate sample edges between consecutive stages
    for (let stage = 0; stage < numStages - 1; stage++) {
      const currentStageNodes = newNodes.filter(n => n.stage === stage);
      const nextStageNodes = newNodes.filter(n => n.stage === stage + 1);
      
      currentStageNodes.forEach(fromNode => {
        nextStageNodes.forEach(toNode => {
          // Add some random edges
          if (Math.random() > 0.3) {
            newEdges.push({
              from: fromNode.id,
              to: toNode.id,
              weight: Math.floor(Math.random() * 10) + 1
            });
          }
        });
      });
    }
    
    setNodes(newNodes);
    setEdges(newEdges);
    setResult(null);
    setAnimationStep(-1);
  };

  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw stage lines
    for (let stage = 0; stage < numStages; stage++) {
      const x = 100 + stage * 120;
      ctx.beginPath();
      ctx.moveTo(x, 50);
      ctx.lineTo(x, 250);
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Stage label
      ctx.fillStyle = '#6b7280';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`Stage ${stage}`, x, 40);
    }

    // Draw edges
    edges.forEach((edge) => {
      const fromNode = nodes.find(n => n.id === edge.from);
      const toNode = nodes.find(n => n.id === edge.to);
      
      if (fromNode && toNode) {
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        
        // Highlight edge if it's in optimal path
        if (result && result.optimalPath && animationStep >= 0) {
          const isInPath = result.optimalPath.some((pathNodeId, index) => 
            index < result.optimalPath.length - 1 && 
            pathNodeId === edge.from && 
            result.optimalPath[index + 1] === edge.to
          );
          
          if (isInPath) {
            ctx.strokeStyle = '#22c55e';
            ctx.lineWidth = 4;
          } else {
            ctx.strokeStyle = '#6b7280';
            ctx.lineWidth = 2;
          }
        } else {
          ctx.strokeStyle = '#6b7280';
          ctx.lineWidth = 2;
        }
        
        ctx.stroke();

        // Draw arrow
        const angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x);
        const arrowLength = 10;
        const arrowAngle = Math.PI / 6;
        
        ctx.beginPath();
        ctx.moveTo(toNode.x - 20 * Math.cos(angle), toNode.y - 20 * Math.sin(angle));
        ctx.lineTo(
          toNode.x - 20 * Math.cos(angle) - arrowLength * Math.cos(angle - arrowAngle),
          toNode.y - 20 * Math.sin(angle) - arrowLength * Math.sin(angle - arrowAngle)
        );
        ctx.moveTo(toNode.x - 20 * Math.cos(angle), toNode.y - 20 * Math.sin(angle));
        ctx.lineTo(
          toNode.x - 20 * Math.cos(angle) - arrowLength * Math.cos(angle + arrowAngle),
          toNode.y - 20 * Math.sin(angle) - arrowLength * Math.sin(angle + arrowAngle)
        );
        ctx.stroke();

        // Draw weight
        const midX = (fromNode.x + toNode.x) / 2;
        const midY = (fromNode.y + toNode.y) / 2;
        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(edge.weight.toString(), midX, midY - 5);
      }
    });

    // Draw nodes
    nodes.forEach(node => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 18, 0, 2 * Math.PI);
      
      // Node colors
      if (node.stage === 0) {
        ctx.fillStyle = '#ef4444'; // Source - red
      } else if (node.stage === numStages - 1) {
        ctx.fillStyle = '#22c55e'; // Target - green
      } else if (selectedNode === node.id) {
        ctx.fillStyle = '#3b82f6'; // Selected - blue
      } else if (result && result.optimalPath && result.optimalPath.includes(node.id)) {
        ctx.fillStyle = '#f59e0b'; // In optimal path - orange
      } else {
        ctx.fillStyle = '#e5e7eb'; // Default - gray
      }
      
      ctx.fill();
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw label
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(node.label, node.x, node.y + 4);

      // Draw cost if algorithm is running
      if (result && animationStep >= 0) {
        const step = result.steps[animationStep];
        if (step && step.costs && step.costs[node.id] !== undefined && step.costs[node.id] !== Infinity) {
          ctx.fillStyle = '#dc2626';
          ctx.font = 'bold 10px Arial';
          ctx.fillText(step.costs[node.id].toString(), node.x, node.y - 25);
        }
      }
    });
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (isDrawingMode === 'edge') {
      const clickedNode = nodes.find(node => 
        Math.sqrt(Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2)) < 25
      );

      if (clickedNode) {
        if (edgeStart === null) {
          setEdgeStart(clickedNode.id);
        } else if (edgeStart !== clickedNode.id) {
          const fromNode = nodes.find(n => n.id === edgeStart);
          const toNode = clickedNode;
          
          // Only allow edges to next stage
          if (fromNode && toNode && toNode.stage === fromNode.stage + 1) {
            const weight = parseInt(edgeWeight) || 1;
            const newEdge: Edge = {
              from: edgeStart,
              to: clickedNode.id,
              weight
            };
            setEdges([...edges, newEdge]);
          }
          setEdgeStart(null);
        }
      }
    } else {
      const clickedNode = nodes.find(node => 
        Math.sqrt(Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2)) < 25
      );
      setSelectedNode(clickedNode ? clickedNode.id : null);
    }
  };

  const runMultistageGraph = () => {
    if (nodes.length === 0) return;

    const sourceNode = nodes.find(n => n.stage === 0)?.id || 0;
    const targetNode = nodes.find(n => n.stage === numStages - 1)?.id || nodes.length - 1;
    
    const multistageResult = multistageGraphAlgorithm(edges, nodes, sourceNode, targetNode, numStages);
    setResult(multistageResult);
    setAnimationStep(0);
  };

  const updateStageConfig = (stage: number, count: number) => {
    const newNodesPerStage = [...nodesPerStage];
    newNodesPerStage[stage] = Math.max(1, count);
    setNodesPerStage(newNodesPerStage);
  };

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Multistage Graph <span className="text-indigo-600">(Dynamic Programming)</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find the shortest path from source to destination in a multistage graph using dynamic programming
          </p>
        </div>

        <EducationalInfo
          topic="Multistage Graph Shortest Path Problem"
          description="A multistage graph is a directed acyclic graph organized into stages. The goal is to find the shortest path from the source (first stage) to the destination (last stage) using dynamic programming."
          theory={{
            definition: "A directed acyclic graph where vertices are organized into disjoint sets called stages, and edges only exist between consecutive stages. The objective is to find the minimum cost path from source to destination.",
            keyPoints: [
              "Graph is organized into k stages with directed edges between consecutive stages only",
              "Uses backward dynamic programming approach",
              "Optimal substructure: optimal path contains optimal subpaths",
              "More efficient than checking all possible paths"
            ],
            applications: [
              "Resource allocation in production planning",
              "Project scheduling and management",
              "Investment decision making",
              "Network routing optimization"
            ]
          }}
          mumbaiUniversity={{
            syllabus: [
              "Multistage graph problem formulation",
              "Dynamic programming solution approach",
              "Backward and forward approaches",
              "Time and space complexity analysis",
              "Applications in resource allocation"
            ],
            marks: "8-10 marks",
            commonQuestions: [
              "Solve multistage graph using dynamic programming",
              "Find shortest path from source to destination",
              "Show cost and decision tables",
              "Trace back optimal path"
            ],
            examTips: [
              "Work backwards from destination to source",
              "Maintain cost[i][j] = minimum cost from stage i node j to destination",
              "Record decisions for path reconstruction",
              "Show all stages of computation clearly"
            ]
          }}
          algorithm={{
            steps: [
              "Organize graph into k stages with nodes at each stage",
              "Start from last stage: cost[k-1][j] = 0 for destination nodes",
              "Work backwards: for each stage i from k-2 to 0",
              "For each node j in stage i: cost[i][j] = min(weight[j][l] + cost[i+1][l])",
              "Record decision[i][j] = l that gives minimum cost",
              "Trace forward using decisions to get optimal path"
            ],
            complexity: {
              time: "O(V + E) where V is vertices and E is edges",
              space: "O(V) for cost and decision arrays"
            }
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Graph Configuration Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-indigo-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Configure Multistage Graph</h2>
            
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Stages
                </label>
                <select
                  value={numStages}
                  onChange={(e) => {
                    const stages = parseInt(e.target.value);
                    setNumStages(stages);
                    setNodesPerStage(Array(stages).fill(1));
                  }}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value={3}>3 Stages</option>
                  <option value={4}>4 Stages</option>
                  <option value={5}>5 Stages</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nodes per Stage
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Array.from({ length: numStages }, (_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-sm">Stage {i}:</span>
                      <select
                        value={nodesPerStage[i] || 1}
                        onChange={(e) => updateStageConfig(i, parseInt(e.target.value))}
                        className="flex-1 p-1 border border-gray-300 rounded text-sm"
                        disabled={i === 0 || i === numStages - 1} // Source and target are single nodes
                      >
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setIsDrawingMode(isDrawingMode === 'edge' ? 'none' : 'edge')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    isDrawingMode === 'edge' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Edit Edges
                </button>
                
                {isDrawingMode === 'edge' && (
                  <input
                    type="number"
                    value={edgeWeight}
                    onChange={(e) => setEdgeWeight(e.target.value)}
                    placeholder="Weight"
                    min="1"
                    className="px-3 py-2 border border-gray-300 rounded-lg w-20 text-center"
                  />
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={generateGraph}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Regenerate Graph
                </button>
                
                <button
                  onClick={runMultistageGraph}
                  disabled={nodes.length === 0}
                  className="flex-1 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-semibold disabled:bg-gray-400"
                >
                  Find Shortest Path
                </button>
              </div>
            </div>

            <div className="border border-gray-300 rounded-lg">
              <canvas
                ref={canvasRef}
                width={600}
                height={300}
                className="border rounded-lg cursor-pointer bg-gray-50"
                onClick={handleCanvasClick}
              />
            </div>

            <div className="mt-4 text-sm text-gray-600">
              <p><strong>Instructions:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Configure stages and nodes per stage</li>
                <li>Click &quot;Edit Edges&quot; to modify edge weights</li>
                <li>Click two consecutive stage nodes to add/modify edges</li>
                <li>Red node = Source, Green node = Target</li>
              </ul>
            </div>
          </div>

          {/* Algorithm Results */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-indigo-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Algorithm Results</h2>
            
            {result ? (
              <div className="space-y-4">
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={prevStep}
                    disabled={animationStep <= 0}
                    className="px-3 py-1 bg-indigo-500 text-white rounded disabled:bg-gray-300"
                  >
                    ← Prev
                  </button>
                  
                  <button
                    onClick={resetAnimation}
                    className="px-3 py-1 bg-indigo-600 text-white rounded"
                  >
                    Reset
                  </button>
                  
                  <button
                    onClick={nextStep}
                    disabled={!result || animationStep >= result.steps.length - 1}
                    className="px-3 py-1 bg-indigo-500 text-white rounded disabled:bg-gray-300"
                  >
                    Next →
                  </button>
                  
                  <span className="px-3 py-1 bg-gray-100 rounded text-sm">
                    Step {animationStep + 1} / {result.steps.length}
                  </span>
                </div>

                {/* Current Step Info */}
                {animationStep >= 0 && result.steps[animationStep] && (
                  <div className="bg-indigo-50 p-4 rounded-lg border-2 border-indigo-300">
                    <h3 className="font-bold text-indigo-800 mb-2 text-lg">
                      Stage {result.steps[animationStep].stage}: {result.steps[animationStep].description}
                    </h3>
                    <div className="text-sm text-indigo-700 font-medium">
                      <p><strong>Action:</strong> {result.steps[animationStep].action}</p>
                    </div>
                  </div>
                )}

                {/* Cost Table */}
                <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-300">
                  <h3 className="font-bold text-gray-800 mb-3 text-lg">Cost Table</h3>
                  <div className="overflow-x-auto bg-white rounded border">
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="bg-indigo-600 text-white">
                          <th className="border border-gray-400 px-3 py-2 font-bold">Node</th>
                          <th className="border border-gray-400 px-3 py-2 font-bold">Stage</th>
                          <th className="border border-gray-400 px-3 py-2 font-bold">Cost to Target</th>
                          <th className="border border-gray-400 px-3 py-2 font-bold">Next Node</th>
                        </tr>
                      </thead>
                      <tbody>
                        {nodes.map(node => {
                          const step = animationStep >= 0 ? result.steps[animationStep] : result.steps[result.steps.length - 1];
                          const cost = step.costs ? step.costs[node.id] : Infinity;
                          const decision = step.decisions ? step.decisions[node.id] : null;
                          
                          return (
                            <tr key={node.id} className={`${
                              result.optimalPath && result.optimalPath.includes(node.id) ? 'bg-yellow-100 font-bold' : 'bg-white'
                            } border-b border-gray-300`}>
                              <td className="border border-gray-400 px-3 py-2 font-bold text-center text-indigo-700">
                                {node.label}
                              </td>
                              <td className="border border-gray-400 px-3 py-2 text-center font-bold text-blue-600">
                                {node.stage}
                              </td>
                              <td className="border border-gray-400 px-3 py-2 text-center font-bold text-red-600">
                                {cost === Infinity ? '∞' : cost}
                              </td>
                              <td className="border border-gray-400 px-3 py-2 text-center font-bold text-green-600">
                                {decision !== null && decision !== undefined ? 
                                  nodes.find(n => n.id === decision)?.label || '-' : '-'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Final Results */}
                {animationStep === result.steps.length - 1 && (
                  <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300">
                    <h3 className="font-bold text-green-800 mb-3 text-lg">Optimal Solution</h3>
                    <div className="space-y-2 text-sm font-medium">
                      <div className="flex justify-between">
                        <span>Minimum Cost:</span>
                        <span className="font-mono text-green-700 text-lg font-bold">{result.minCost}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Optimal Path:</span>
                        <span className="font-mono text-green-700">
                          {result.optimalPath ? result.optimalPath.map(id => nodes.find(n => n.id === id)?.label).join(' → ') : 'None'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <div className="text-4xl mb-4">📊</div>
                <p>Configure the multistage graph and click &quot;Find Shortest Path&quot; to see the solution</p>
              </div>
            )}
          </div>
        </div>

        {/* Step-by-Step Table */}
        {result && (
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-indigo-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Step-by-Step Execution Table</h2>
            <div className="overflow-x-auto bg-gray-50 rounded border-2 border-gray-300">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-indigo-700 text-white">
                    <th className="border border-gray-400 px-3 py-3 font-bold">Step</th>
                    <th className="border border-gray-400 px-3 py-3 font-bold">Stage</th>
                    <th className="border border-gray-400 px-3 py-3 font-bold">Description</th>
                    <th className="border border-gray-400 px-3 py-3 font-bold">Action</th>
                    <th className="border border-gray-400 px-3 py-3 font-bold">Costs Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {result.steps.map((step, index) => (
                    <tr key={index} className={`${
                      index === animationStep ? 'bg-yellow-200 font-bold' : 
                      index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
                    } border-b border-gray-300`}>
                      <td className="border border-gray-400 px-3 py-2 font-bold text-center text-indigo-600">{index + 1}</td>
                      <td className="border border-gray-400 px-3 py-2 text-center font-bold text-blue-600">{step.stage}</td>
                      <td className="border border-gray-400 px-3 py-2 text-center font-medium">{step.description}</td>
                      <td className="border border-gray-400 px-3 py-2 text-center font-medium">{step.action}</td>
                      <td className="border border-gray-400 px-3 py-2 font-mono text-xs text-center text-red-600 font-bold">
                        {step.costs ? Object.entries(step.costs)
                          .filter(([_, cost]) => cost !== Infinity)
                          .map(([nodeId, cost]) => `${nodes.find(n => n.id === parseInt(nodeId))?.label}:${cost}`)
                          .join(', ') : 'None'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {result && (
          <ExamResult
            title="Multistage Graph Algorithm Analysis"
            input={`Multistage graph with ${numStages} stages and ${nodes.length} vertices`}
            result={result.minCost < Infinity}
            steps={result.steps.slice(0, 10).map((step, index) => ({
              stepNumber: index + 1,
              description: step.description,
              currentState: `Stage ${step.stage}: Processing nodes and updating costs`,
              explanation: step.action
            }))}
            finalAnswer={`Minimum cost path: ${result.optimalPath ? result.optimalPath.map(id => nodes.find(n => n.id === id)?.label).join(' → ') : 'None'} with cost ${result.minCost}`}
            examFormat={{
              question: `Find the shortest path in a multistage graph with ${numStages} stages using dynamic programming.`,
              solution: [
                `Multistage Graph Dynamic Programming Solution:`,
                `Number of stages: ${numStages}`,
                `Total vertices: ${nodes.length}`,
                `Source: ${nodes.find(n => n.stage === 0)?.label}`,
                `Target: ${nodes.find(n => n.stage === numStages - 1)?.label}`,
                ...result.steps.map((step, i) => `Step ${i + 1}: Stage ${step.stage} - ${step.action}`),
                `Optimal path: ${result.optimalPath ? result.optimalPath.map(id => nodes.find(n => n.id === id)?.label).join(' → ') : 'None'}`,
                `Minimum cost: ${result.minCost}`
              ],
              conclusion: `The dynamic programming approach successfully found the optimal path with minimum cost ${result.minCost}.`,
              marks: 10
            }}
          />
        )}
      </div>
    </div>
  );
}
