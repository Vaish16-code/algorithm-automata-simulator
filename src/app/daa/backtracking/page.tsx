"use client";

import Link from "next/link";
import { Header, Footer } from "../../../components";

export default function BacktrackingAlgorithmsPage() {
  const backtrackingAlgorithms = [
    {
      title: "N-Queens Problem",
      description: "Place N queens on an N×N chessboard so that no two queens attack each other",
      path: "/daa/backtracking/n-queens",
      complexity: "O(N!)",
      examImportance: "Very High",
      topics: ["Constraint Satisfaction", "Backtracking", "Pruning", "State Space Tree"]
    },
  ];

  const educationalContent = {
    overview: "Backtracking is a systematic method for solving problems by exploring all possible solutions incrementally and abandoning (backtracking) partial solutions that cannot lead to a valid complete solution.",
    keyCharacteristics: [
      "Systematic enumeration of all possible solutions",
      "Incremental construction of solutions",
      "Early pruning of invalid partial solutions",
      "Recursive exploration with state rollback",
      "Depth-first search approach"
    ],
    applications: [
      "Constraint satisfaction problems",
      "Combinatorial optimization",
      "Puzzle solving (Sudoku, N-Queens)",
      "Path finding in mazes",
      "Game tree exploration"
    ],
    examTips: [
      "Understand the recursive structure",
      "Practice identifying base cases and recursive cases",
      "Learn pruning techniques for optimization",
      "Study state space tree representations",
      "Master complexity analysis for backtracking"
    ]
  };

  const examPrep = {
    questionTypes: [
      "Trace backtracking algorithm execution",
      "Design backtracking solution for given problem",
      "Analyze time and space complexity",
      "Optimize with pruning techniques",
      "Compare with other algorithmic paradigms"
    ],
    practiceProblems: [
      "N-Queens problem variants",
      "Graph coloring problem",
      "Subset sum with backtracking",
      "Hamiltonian path problem",
      "Knight's tour problem"
    ],
    examPattern: "Mumbai University typically asks 1-2 questions on backtracking (10-15 marks), focusing on N-Queens problem and algorithm design."
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Backtracking Algorithms
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master systematic exploration and constraint satisfaction with interactive backtracking simulators
          </p>
        </div>

        {/* Algorithms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {backtrackingAlgorithms.map((algorithm, index) => (
            <Link
              key={index}
              href={algorithm.path}
              className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
                    {algorithm.title}
                  </h3>
                  <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                    {algorithm.examImportance}
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">
                  {algorithm.description}
                </p>
                
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {algorithm.topics.map((topic, topicIndex) => (
                      <span 
                        key={topicIndex}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Complexity: <code className="bg-gray-100 px-2 py-1 rounded text-purple-600 font-mono">{algorithm.complexity}</code>
                  </span>
                  <svg className="w-5 h-5 text-purple-500 group-hover:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Educational Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Understanding Backtracking Algorithms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Overview</h3>
              <p className="text-gray-600 mb-6">{educationalContent.overview}</p>
              
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Key Characteristics</h3>
              <ul className="space-y-2 text-gray-600">
                {educationalContent.keyCharacteristics.map((char, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
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
                    <span className="text-pink-500 mt-1">•</span>
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
              
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Key Focus Areas</h3>
              <ul className="space-y-2 text-gray-600">
                {[
                  "N-Queens problem solution and optimization",
                  "State space tree construction and traversal",
                  "Pruning techniques and efficiency analysis",
                  "Recursive algorithm design and implementation"
                ].map((area, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    {area}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Algorithm Pattern */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Backtracking Algorithm Pattern</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">General Structure</h3>
              <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
                <div className="text-blue-600">function</div> backtrack(solution):
                <div className="ml-4">
                  <div className="text-green-600">if</div> isComplete(solution):
                  <div className="ml-4">return solution</div>
                  <div className="text-green-600">for</div> each choice in choices:
                  <div className="ml-4">
                    <div className="text-green-600">if</div> isValid(choice):
                    <div className="ml-4">
                      makeChoice(choice)
                      <div className="text-green-600">if</div> backtrack(solution):
                      <div className="ml-4">return true</div>
                      unmakeChoice(choice)
                    </div>
                  </div>
                  <div className="text-green-600">return</div> false
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Key Steps</h3>
              <ol className="space-y-3 text-gray-600">
                <li className="flex gap-3">
                  <span className="bg-purple-100 text-purple-700 w-6 h-6 rounded-full text-sm flex items-center justify-center font-medium">1</span>
                  <div>
                    <strong>Choose:</strong> Select next option to try
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="bg-purple-100 text-purple-700 w-6 h-6 rounded-full text-sm flex items-center justify-center font-medium">2</span>
                  <div>
                    <strong>Constraint Check:</strong> Verify if choice is valid
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="bg-purple-100 text-purple-700 w-6 h-6 rounded-full text-sm flex items-center justify-center font-medium">3</span>
                  <div>
                    <strong>Goal Check:</strong> Test if solution is complete
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="bg-purple-100 text-purple-700 w-6 h-6 rounded-full text-sm flex items-center justify-center font-medium">4</span>
                  <div>
                    <strong>Recurse:</strong> Continue with updated state
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="bg-purple-100 text-purple-700 w-6 h-6 rounded-full text-sm flex items-center justify-center font-medium">5</span>
                  <div>
                    <strong>Backtrack:</strong> Undo choice if no solution found
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Performance Analysis */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Performance Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-2">Time Complexity</div>
              <p className="text-gray-600">Generally exponential, varies by problem and pruning efficiency</p>
            </div>
            <div className="text-center p-6 bg-pink-50 rounded-lg">
              <div className="text-2xl font-bold text-pink-600 mb-2">Space Complexity</div>
              <p className="text-gray-600">O(depth) for recursion stack plus solution storage</p>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-2">Optimization</div>
              <p className="text-gray-600">Constraint propagation and intelligent pruning techniques</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
