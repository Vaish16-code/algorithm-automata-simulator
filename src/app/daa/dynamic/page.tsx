"use client";

import Link from "next/link";

export default function DynamicProgrammingPage() {
  const dynamicProgrammingAlgorithms = [
    {
      title: "Longest Common Subsequence (LCS)",
      description: "Find the longest subsequence common to two sequences",
      path: "/daa/dynamic/lcs",
      complexity: "O(m×n)",
      examImportance: "Very High",
    },
    {
      title: "LCS Multistage",
      description: "Extended LCS for multiple sequences with stage analysis",
      path: "/daa/dynamic/lcs-multistage",
      complexity: "O(n^k)",
      examImportance: "High",
    },
    {
      title: "0/1 Knapsack Problem",
      description: "Optimal selection of items with weight and value constraints",
      path: "/daa/dynamic/knapsack",
      complexity: "O(nW)",
      examImportance: "Very High",
    },
    {
      title: "Matrix Chain Multiplication",
      description: "Find optimal parenthesization for matrix multiplication",
      path: "/daa/dynamic/matrix-chain",
      complexity: "O(n³)",
      examImportance: "High",
    },
    {
      title: "Floyd-Warshall Algorithm",
      description: "All-pairs shortest path using dynamic programming",
      path: "/daa/dynamic/floyd-warshall",
      complexity: "O(V³)",
      examImportance: "Very High",
    },
    {
      title: "Bellman-Ford Algorithm",
      description: "Single-source shortest path with negative edge detection",
      path: "/daa/dynamic/bellman-ford",
      complexity: "O(VE)",
      examImportance: "High",
    },
    {
      title: "Multistage Graph",
      description: "Find shortest path in a multistage graph using DP",
      path: "/daa/dynamic/multistage-graph",
      complexity: "O(VE)",
      examImportance: "High",
    },
    {
      title: "TSP (Dynamic Programming)",
      description: "Travelling Salesman Problem using Held-Karp algorithm",
      path: "/daa/dynamic/tsp",
      complexity: "O(n²2ⁿ)",
      examImportance: "High",
    },
    {
      title: "Single Source Shortest Path",
      description: "Compare Bellman-Ford and Dijkstra algorithms",
      path: "/daa/dynamic/single-source-shortest-path",
      complexity: "O(VE) / O(V²)",
      examImportance: "Very High",
    },
  ];

  const educationalContent = {
    overview: "Dynamic Programming solves complex problems by breaking them down into simpler subproblems. It stores the results of subproblems to avoid redundant calculations, making it highly efficient for optimization problems.",
    keyCharacteristics: [
      "Optimal substructure property",
      "Overlapping subproblems",
      "Memoization to store results",
      "Bottom-up or top-down approach",
      "Eliminates redundant calculations"
    ],
    applications: [
      "Sequence alignment in bioinformatics",
      "Resource allocation problems",
      "Network routing optimization",
      "Financial portfolio optimization",
      "Game theory and decision making"
    ],
    examTips: [
      "Identify optimal substructure clearly",
      "Define state and transitions properly",
      "Practice tabulation vs memoization",
      "Understand space-time tradeoffs",
      "Learn to trace back optimal solutions"
    ]
  };

  const examPrep = {
    questionTypes: [
      "Prove optimal substructure property",
      "Design DP recurrence relations",
      "Implement tabulation method",
      "Analyze time and space complexity",
      "Trace optimal solution path"
    ],
    practiceProblems: [
      "0/1 Knapsack vs Fractional Knapsack",
      "LCS with actual sequence reconstruction",
      "Matrix chain with optimal parenthesization",
      "All-pairs shortest path problems",
      "Multistage graph optimization"
    ],
    examPattern: "Mumbai University typically asks 2-3 questions on dynamic programming worth 15-20 marks total, focusing on algorithm design, recurrence relations, and complexity analysis."
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Dynamic Programming
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master dynamic programming techniques with interactive simulators designed for Mumbai University curriculum
          </p>
        </div>

        {/* Algorithms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {dynamicProgrammingAlgorithms.map((algorithm, index) => (
            <Link
              key={index}
              href={algorithm.path}
              className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {algorithm.title}
                  </h3>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    algorithm.examImportance === 'Very High' 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {algorithm.examImportance}
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 text-sm">
                  {algorithm.description}
                </p>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Complexity: <code className="bg-gray-100 px-2 py-1 rounded text-blue-600 font-mono text-xs">{algorithm.complexity}</code>
                  </span>
                  <svg className="w-5 h-5 text-blue-500 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Educational Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Understanding Dynamic Programming</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Overview</h3>
              <p className="text-gray-600 mb-6">{educationalContent.overview}</p>
              
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Key Characteristics</h3>
              <ul className="space-y-2 text-gray-600">
                {educationalContent.keyCharacteristics.map((char, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
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
                    <span className="text-purple-500 mt-1">•</span>
                    {app}
                  </li>
                ))}
              </ul>
              
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Exam Tips</h3>
              <ul className="space-y-2 text-gray-600">
                {educationalContent.examTips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-indigo-500 mt-1">•</span>
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
                    <span className="text-blue-500 mt-1">•</span>
                    {type}
                  </li>
                ))}
              </ul>
              
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Practice Problems</h3>
              <ul className="space-y-2 text-gray-600">
                {examPrep.practiceProblems.map((problem, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
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
                  "Master recurrence relation formulation",
                  "Practice both tabulation and memoization",
                  "Understand space optimization techniques",
                  "Learn to trace back optimal solutions"
                ].map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-indigo-500 mt-1">•</span>
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
              <h3 className="text-lg font-semibold text-gray-700 mb-3">DP Requirements</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Optimal substructure property</li>
                <li>• Overlapping subproblems</li>
                <li>• Well-defined state space</li>
                <li>• Clear recurrence relation</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Common Patterns</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Define DP state and dimensions</li>
                <li>• Establish base cases</li>
                <li>• Formulate recurrence relation</li>
                <li>• Choose tabulation vs memoization</li>
              </ul>
            </div>
          </div>
        </div>      </main>
    </div>
  );
}
