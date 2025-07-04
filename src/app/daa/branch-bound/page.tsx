"use client";

import Link from "next/link";

export default function BranchBoundPage() {
  const branchBoundAlgorithms = [
    {
      title: "Travelling Salesman Problem",
      description: "Find shortest Hamiltonian cycle using branch and bound",
      path: "/daa/branch-bound/tsp",
      complexity: "O(n!)",
      examImportance: "Very High",
      topics: ["Graph Theory", "Optimization", "Bounds", "Hamiltonian Cycle"]
    },
    {
      title: "15-Puzzle Problem",
      description: "Solve sliding puzzle using branch and bound with heuristics",
      path: "/daa/branch-bound/fifteen-puzzle",
      complexity: "O(b^d)",
      examImportance: "High",
      topics: ["State Space Search", "Heuristics", "Manhattan Distance", "A* Algorithm"]
    },
  ];

  const educationalContent = {
    overview: "Branch and Bound is an algorithmic paradigm for solving optimization problems by systematically exploring the solution space while using bounds to prune branches that cannot lead to optimal solutions.",
    keyCharacteristics: [
      "Systematic exploration of solution space",
      "Uses upper and lower bounds for pruning",
      "Maintains best solution found so far",
      "Prunes branches that cannot improve",
      "Often uses priority queue for node selection"
    ],
    applications: [
      "Combinatorial optimization problems",
      "Integer linear programming",
      "Scheduling and resource allocation",
      "Network design and routing",
      "Game playing and decision making"
    ],
    examTips: [
      "Understand bounding function design",
      "Learn different node selection strategies",
      "Practice pruning condition analysis",
      "Master complexity analysis",
      "Understand best-first vs depth-first search"
    ]
  };

  const examPrep = {
    questionTypes: [
      "Design branch and bound algorithm",
      "Analyze pruning effectiveness",
      "Compare with backtracking approach",
      "Calculate bounds for given problems",
      "Trace algorithm execution with examples"
    ],
    practiceProblems: [
      "TSP with different bound functions",
      "Knapsack with fractional bounds",
      "Job assignment with cost matrix",
      "Graph coloring with chromatic bounds",
      "Puzzle solving with heuristic bounds"
    ],
    examPattern: "Mumbai University typically asks 1-2 questions on branch and bound worth 10-15 marks total, focusing on algorithm design, bounding functions, and optimization."
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50">      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Branch & Bound
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master branch and bound optimization techniques with interactive simulators designed for Mumbai University curriculum
          </p>
        </div>

        {/* Algorithms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {branchBoundAlgorithms.map((algorithm, index) => (
            <Link
              key={index}
              href={algorithm.path}
              className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-teal-600 transition-colors">
                    {algorithm.title}
                  </h3>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    algorithm.examImportance === 'Very High' 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-teal-100 text-teal-700'
                  }`}>
                    {algorithm.examImportance}
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">
                  {algorithm.description}
                </p>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Complexity: <code className="bg-gray-100 px-2 py-1 rounded text-teal-600 font-mono">{algorithm.complexity}</code>
                  </span>
                  <svg className="w-5 h-5 text-teal-500 group-hover:text-teal-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Educational Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Understanding Branch & Bound</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Overview</h3>
              <p className="text-gray-600 mb-6">{educationalContent.overview}</p>
              
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Key Characteristics</h3>
              <ul className="space-y-2 text-gray-600">
                {educationalContent.keyCharacteristics.map((char, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-teal-500 mt-1">•</span>
                    {char}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Applications</h3>
              <ul className="space-y-2 text-gray-600 mb-6">
                {educationalContent.applications.map((app, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-cyan-500 mt-1">•</span>
                    {app}
                  </li>
                ))}
              </ul>
              
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Exam Tips</h3>
              <ul className="space-y-2 text-gray-600">
                {educationalContent.examTips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Exam Preparation */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Mumbai University Exam Preparation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Question Types</h3>
              <ul className="space-y-2 text-gray-600 mb-6">
                {examPrep.questionTypes.map((type, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-teal-500 mt-1">•</span>
                    {type}
                  </li>
                ))}
              </ul>
              
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Practice Problems</h3>
              <ul className="space-y-2 text-gray-600">
                {examPrep.practiceProblems.map((problem, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-cyan-500 mt-1">•</span>
                    {problem}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Exam Pattern</h3>
              <p className="text-gray-600 mb-6">{examPrep.examPattern}</p>
              
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Key Tips</h3>
              <ul className="space-y-2 text-gray-600">
                {[
                  "Design effective bounding functions",
                  "Understand pruning strategies",
                  "Practice tree construction and traversal",
                  "Learn to analyze optimization effectiveness"
                ].map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Reference */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Algorithm Reference</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Algorithm Components</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• <strong>Branching:</strong> Generate child nodes</li>
                <li>• <strong>Bounding:</strong> Calculate upper/lower bounds</li>
                <li>• <strong>Pruning:</strong> Eliminate infeasible nodes</li>
                <li>• <strong>Selection:</strong> Choose next node to explore</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Search Strategies</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Best-first search (priority queue)</li>
                <li>• Depth-first search (stack)</li>
                <li>• Breadth-first search (queue)</li>
                <li>• Least-cost search (cost-based)</li>
              </ul>
            </div>
          </div>
        </div>      </main>
    </div>
  );
}
