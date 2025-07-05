"use client";

import { useState } from "react";
import { PrimChart } from "../../../components/PrimChart";
import { primMST, PrimResult, Graph } from "../../../utils/greedyAlgorithms";

export default function PrimPage() {
  const [vertices, setVertices] = useState(5);
  const [edges, setEdges] = useState([
    { from: 0, to: 1, weight: 2 },
    { from: 0, to: 3, weight: 6 },
    { from: 1, to: 2, weight: 3 },
    { from: 1, to: 3, weight: 8 },
    { from: 1, to: 4, weight: 5 },
    { from: 2, to: 4, weight: 7 },
    { from: 3, to: 4, weight: 9 }
  ]);
  const [result, setResult] = useState<PrimResult | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [animationSteps, setAnimationSteps] = useState<any[]>([]);

  const handleSolve = () => {
    const graph: Graph = { vertices, edges };
    const output = primMST(graph);
    setResult(output);
  };

  const handleAnimate = () => {
    const graph: Graph = { vertices, edges };
    const output = primMST(graph);
    setResult(output);
    
    // Generate animation steps
    const steps = generatePrimAnimationSteps(graph);
    setAnimationSteps(steps);
    setAnimationStep(0);
    setIsAnimating(true);
  };

  const generatePrimAnimationSteps = (graph: Graph) => {
    const steps = [];
    const visited = new Set<number>();
    const mstEdges: any[] = [];
    
    // Step 1: Start with vertex 0
    visited.add(0);
    steps.push({
      type: 'start',
      visited: new Set([0]),
      mstEdges: [],
      message: 'Starting with vertex 0'
    });

    while (visited.size < graph.vertices) {
      let minEdge = null;
      let minWeight = Infinity;

      // Find minimum weight edge connecting visited to unvisited vertex
      for (const edge of graph.edges) {
        const { from, to, weight } = edge;
        if ((visited.has(from) && !visited.has(to)) || 
            (visited.has(to) && !visited.has(from))) {
          if (weight < minWeight) {
            minWeight = weight;
            minEdge = edge;
          }
        }
      }

      if (minEdge) {
        const newVertex = visited.has(minEdge.from) ? minEdge.to : minEdge.from;
        visited.add(newVertex);
        mstEdges.push(minEdge);
        
        steps.push({
          type: 'add_edge',
          visited: new Set(visited),
          mstEdges: [...mstEdges],
          currentEdge: minEdge,
          message: `Adding edge (${minEdge.from}, ${minEdge.to}) with weight ${minEdge.weight}`
        });
      }
    }

    steps.push({
      type: 'complete',
      visited: new Set(visited),
      mstEdges: [...mstEdges],
      message: 'MST construction complete!'
    });

    return steps;
  };

  const nextAnimationStep = () => {
    if (animationStep < animationSteps.length - 1) {
      setAnimationStep(animationStep + 1);
    }
  };

  const prevAnimationStep = () => {
    if (animationStep > 0) {
      setAnimationStep(animationStep - 1);
    }
  };

  const resetAnimation = () => {
    setIsAnimating(false);
    setAnimationStep(0);
    setAnimationSteps([]);
  };

  const addEdge = () => {
    setEdges([...edges, { from: 0, to: 1, weight: 1 }]);
  };

  const removeEdge = (index: number) => {
    setEdges(edges.filter((_, i) => i !== index));
  };

  const updateEdge = (index: number, field: string, value: number) => {
    setEdges(edges.map((edge, i) => 
      i === index ? { ...edge, [field]: Math.max(0, Math.min(vertices - 1, value)) } : edge
    ));
  };

  const updateWeight = (index: number, weight: number) => {
    setEdges(edges.map((edge, i) => 
      i === index ? { ...edge, weight: Math.max(1, weight) } : edge
    ));
  };

  const educationalContent = {
    overview: "Prim&apos;s algorithm is a greedy algorithm for finding the Minimum Spanning Tree (MST) of a weighted undirected graph. It builds the MST by adding vertices one at a time, always choosing the minimum weight edge that connects a vertex in the MST to a vertex outside the MST.",
    keyCharacteristics: [
      "Vertex-based approach to MST construction",
      "Greedy choice: minimum weight edge crossing cut",
      "Maintains a single tree throughout execution",
      "Works with both dense and sparse graphs",
      "Can start from any vertex"
    ],
    applications: [
      "Network design and routing",
      "Circuit design optimization",
      "Cluster analysis in data mining",
      "Transportation network planning",
      "Approximation algorithms for TSP"
    ],
    examTips: [
      "Understand the cut property of MSTs",
      "Practice tracing algorithm execution step by step",
      "Know time complexity with different data structures",
      "Compare with Kruskal&apos;s algorithm",
      "Learn to prove correctness using cut property"
    ]
  };

  const examPrep = {
    questionTypes: [
      "Trace Prim&apos;s algorithm execution on given graph",
      "Prove correctness using cut property",
      "Analyze time complexity with different implementations",
      "Compare Prim&apos;s vs Kruskal&apos;s algorithm",
      "Design MST algorithms for specific constraints"
    ],
    practiceProblems: [
      "Find MST of weighted graph using Prim&apos;s",
      "Implement Prim&apos;s with priority queue",
      "Modify algorithm for maximum spanning tree",
      "MST in graphs with negative weights",
      "Applications in network design problems"
    ],
    examPattern: "Prim&apos;s algorithm is frequently asked in Mumbai University exams (10-15 marks), focusing on algorithm tracing, complexity analysis, and comparison with Kruskal&apos;s."
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Prim&apos;s Minimum Spanning Tree
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Build MST by growing a single tree from any starting vertex using greedy edge selection
          </p>
        </div>

        {/* Algorithm Simulator */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Algorithm Simulator</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Vertices:
            </label>
            <input
              type="number"
              min="3"
              max="10"
              className="w-32 border-4 border-gray-800 rounded-md px-4 py-3 text-lg font-bold text-black bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
              value={vertices}
              onChange={(e) => setVertices(parseInt(e.target.value) || 3)}
            />
          </div>

          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-700">Edges:</h3>
            {edges.map((edge, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">From:</label>
                  <input
                    type="number"
                    min="0"
                    max={vertices - 1}
                    className="w-16 border-4 border-gray-800 rounded px-3 py-2 text-lg font-bold text-black bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                    value={edge.from}
                    onChange={(e) => updateEdge(index, 'from', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">To:</label>
                  <input
                    type="number"
                    min="0"
                    max={vertices - 1}
                    className="w-16 border-4 border-gray-800 rounded px-3 py-2 text-lg font-bold text-black bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                    value={edge.to}
                    onChange={(e) => updateEdge(index, 'to', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Weight:</label>
                  <input
                    type="number"
                    min="1"
                    className="w-20 border-4 border-gray-800 rounded px-3 py-2 text-lg font-bold text-black bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                    value={edge.weight}
                    onChange={(e) => updateWeight(index, parseInt(e.target.value) || 1)}
                  />
                </div>
                <button
                  onClick={() => removeEdge(index)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  disabled={edges.length <= 1}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <button
                onClick={addEdge}
                className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-md"
              >
                Add Edge
              </button>
              <button
                onClick={handleSolve}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md"
              >
                Find MST using Prim&apos;s
              </button>
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleAnimate}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-3 rounded-lg flex items-center gap-2 text-lg shadow-lg"
              >
                <span>🎬</span>
                Animate Algorithm Step-by-Step
              </button>
            </div>
          </div>
        </div>

        {/* Animation Controls */}
        {isAnimating && animationSteps.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border-2 border-purple-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span>🎬</span>
              Algorithm Animation
            </h2>
            
            {/* Current Step Info */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-purple-800">
                  Step {animationStep + 1} of {animationSteps.length}
                </h3>
                <div className="text-sm text-purple-600">
                  {animationSteps[animationStep]?.type === 'start' && '🟢 Starting'}
                  {animationSteps[animationStep]?.type === 'add_edge' && '➕ Adding Edge'}
                  {animationSteps[animationStep]?.type === 'complete' && '✅ Complete'}
                </div>
              </div>
              <p className="text-purple-700 font-medium">
                {animationSteps[animationStep]?.message}
              </p>
            </div>

            {/* Animation Controls */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <button
                onClick={prevAnimationStep}
                disabled={animationStep === 0}
                className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-md flex items-center gap-2"
              >
                ⏮️ Previous
              </button>
              
              <div className="bg-gray-100 px-4 py-2 rounded-lg">
                <span className="text-sm font-medium text-gray-600">
                  {animationStep + 1} / {animationSteps.length}
                </span>
              </div>
              
              <button
                onClick={nextAnimationStep}
                disabled={animationStep >= animationSteps.length - 1}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2 rounded-md flex items-center gap-2"
              >
                Next ⏭️
              </button>
              
              <button
                onClick={resetAnimation}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
              >
                🔄 Reset
              </button>
            </div>

            {/* Current State Visualization */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">Visited Vertices</h4>
                <div className="flex flex-wrap gap-2">
                  {Array.from(animationSteps[animationStep]?.visited || []).map((vertex, index) => (
                    <span key={index} className="bg-green-200 text-green-800 px-2 py-1 rounded text-sm font-medium">
                      {vertex as number}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">MST Edges</h4>
                <div className="space-y-1">
                  {(animationSteps[animationStep]?.mstEdges || []).map((edge: any, idx: number) => (
                    <div key={idx} className="text-sm text-blue-700">
                      ({edge.from}, {edge.to}) - Weight: {edge.weight}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {result && !isAnimating && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Algorithm Result</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-4">MST Properties</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Total Weight:</span>
                    <span className="font-bold text-green-600">{result.totalWeight}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Edges in MST:</span>
                    <span className="font-bold text-green-600">{result.mstEdges.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Algorithm:</span>
                    <span className="font-bold text-green-600">Prim&apos;s MST</span>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">Complexity Analysis</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Time Complexity:</span>
                    <span className="font-bold text-blue-600">O(V²) or O(E log V)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Space Complexity:</span>
                    <span className="font-bold text-blue-600">O(V)</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Algorithm Steps</h3>
              <div className="space-y-2">
                {result.mstEdges.map((edge, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3">
                    <span className="text-gray-700">
                      Step {index + 1}: Add edge ({edge.from}, {edge.to}) with weight {edge.weight}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {result && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">MST Visualization</h2>
            <PrimChart data={result} vertices={vertices} />
          </div>
        )}

        {/* Educational Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Understanding Prim&apos;s Algorithm</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Key Characteristics</h3>
              <ul className="space-y-2 text-gray-600">
                {educationalContent.keyCharacteristics.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Applications</h3>
              <ul className="space-y-2 text-gray-600">
                {educationalContent.applications.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Exam Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {educationalContent.examTips.map((tip, index) => (
                <div key={index} className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-400">
                  <p className="text-gray-700">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Exam Preparation */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Mumbai University Exam Preparation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Question Types</h3>
              <ul className="space-y-2 text-gray-600">
                {examPrep.questionTypes.map((type, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    {type}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Practice Problems</h3>
              <ul className="space-y-2 text-gray-600">
                {examPrep.practiceProblems.map((problem, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    {problem}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">Exam Pattern</h3>
            <p className="text-blue-700">{examPrep.examPattern}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
