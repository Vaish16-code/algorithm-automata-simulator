"use client";

import Link from "next/link";
import { Header, Footer } from "../../../components";

export default function GreedyAlgorithmsPage() {
  const greedyAlgorithms = [
    {
      title: "Fractional Knapsack",
      description: "Solve the fractional knapsack problem using greedy approach",
      path: "/daa/greedy/fractional-knapsack",
      complexity: "O(n log n)",
      examImportance: "High",
    },
    {
      title: "Job Sequencing with Deadlines",
      description: "Maximize profit by scheduling jobs within deadlines",
      path: "/daa/greedy/job-sequencing", 
      complexity: "O(n²)",
      examImportance: "High",
    },
    {
      title: "Kruskal's MST Algorithm",
      description: "Find minimum spanning tree using edge-based greedy approach",
      path: "/daa/greedy/kruskal",
      complexity: "O(E log E)",
      examImportance: "Very High",
    },
    {
      title: "Prim's MST Algorithm", 
      description: "Find minimum spanning tree using vertex-based greedy approach",
      path: "/daa/greedy/prim",
      complexity: "O(V²) or O(E log V)",
      examImportance: "Very High",
    },
  ];

  const educationalContent = {
    overview: "Greedy algorithms make locally optimal choices at each step, hoping to find a global optimum. They are efficient for problems where local optimization leads to global optimization.",
    keyCharacteristics: [
      "Make the best choice at each step",
      "Never reconsider previous choices",
      "Often used for optimization problems", 
      "Greedy choice property must hold",
      "Optimal substructure required"
    ],
    applications: [
      "Network routing algorithms",
      "Activity selection problems",
      "Huffman coding for data compression",
      "Currency change problems",
      "Task scheduling systems"
    ],
    examTips: [
      "Understand when greedy approach gives optimal solution",
      "Know the difference between greedy and dynamic programming",
      "Practice proving greedy choice property",
      "Learn time complexity analysis",
      "Study counter-examples where greedy fails"
    ]
  };

  const examPrep = {
    questionTypes: [
      "Prove that greedy choice leads to optimal solution",
      "Analyze time and space complexity", 
      "Compare greedy vs dynamic programming approaches",
      "Design greedy algorithms for given problems",
      "Find counter-examples where greedy fails"
    ],
    practiceProblems: [
      "Activity Selection Problem",
      "Fractional vs 0/1 Knapsack comparison",
      "Minimum number of coins problem",
      "Job scheduling with profits and deadlines",
      "Graph algorithms (MST, shortest path)"
    ],
    examPattern: "Mumbai University typically asks 1-2 questions on greedy algorithms worth 10-15 marks total, focusing on algorithm design and complexity analysis."
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Greedy Algorithms
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master greedy algorithmic techniques with interactive simulators designed for Mumbai University curriculum
          </p>
        </div>

        {/* Algorithms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {greedyAlgorithms.map((algorithm, index) => (
            <Link
              key={index}
              href={algorithm.path}
              className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-green-600 transition-colors">
                    {algorithm.title}
                  </h3>
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    {algorithm.examImportance}
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">
                  {algorithm.description}
                </p>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Complexity: <code className="bg-gray-100 px-2 py-1 rounded text-green-600 font-mono">{algorithm.complexity}</code>
                  </span>
                  <svg className="w-5 h-5 text-green-500 group-hover:text-green-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Educational Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Understanding Greedy Algorithms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Overview</h3>
              <p className="text-gray-600 mb-6">{educationalContent.overview}</p>
              
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Key Characteristics</h3>
              <ul className="space-y-2 text-gray-600">
                {educationalContent.keyCharacteristics.map((char, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
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
                    <span className="text-blue-500 mt-1">•</span>
                    {app}
                  </li>
                ))}
              </ul>
              
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Exam Tips</h3>
              <ul className="space-y-2 text-gray-600">
                {educationalContent.examTips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
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
                    <span className="text-green-500 mt-1">•</span>
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
                  "Focus on understanding the greedy choice property",
                  "Practice algorithm design and complexity analysis", 
                  "Study graph algorithms (MST) thoroughly",
                  "Learn to identify when greedy approach works"
                ].map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
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
              <h3 className="text-lg font-semibold text-gray-700 mb-3">When Greedy Works</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Greedy choice property holds</li>
                <li>• Optimal substructure exists</li>
                <li>• Local optimum = Global optimum</li>
                <li>• No need to reconsider choices</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Common Patterns</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Sort by some criteria first</li>
                <li>• Make greedy choice at each step</li>
                <li>• Prove choice leads to optimal solution</li>
                <li>• Analyze time complexity</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
