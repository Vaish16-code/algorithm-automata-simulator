"use client";

import Link from "next/link";

export default function DivideConquerPage() {
  const divideConquerAlgorithms = [
    {
      title: "Merge Sort",
      description: "Efficient sorting algorithm using divide and conquer strategy",
      path: "/daa/divide-conquer/merge-sort",
      complexity: "O(n log n)",
      examImportance: "Very High",
      topics: ["Divide", "Conquer", "Merge", "Recursion", "Stability"]
    },
    {
      title: "Quick Sort",
      description: "Fast sorting algorithm with partitioning and recursion",
      path: "/daa/divide-conquer/quick-sort",
      complexity: "O(n log n) avg, O(n²) worst",
      examImportance: "Very High",
      topics: ["Partition", "Pivot", "In-place", "Randomization"]
    },
    {
      title: "Binary Search",
      description: "Efficient searching algorithm for sorted arrays",
      path: "/daa/divide-conquer/binary-search",
      complexity: "O(log n)",
      examImportance: "Very High",
      topics: ["Search", "Sorted Array", "Logarithmic", "Recursive"]
    },
    {
      title: "Finding Min-Max",
      description: "Find minimum and maximum elements using divide and conquer",
      path: "/daa/divide-conquer/min-max",
      complexity: "O(n)",
      examImportance: "High",
      topics: ["Linear Scan", "Comparison", "Optimization", "Pairs"]
    },
    {
      title: "Maximum Subarray (Kadane's)",
      description: "Find contiguous subarray with maximum sum efficiently",
      path: "/daa/divide-conquer/kadane",
      complexity: "O(n)",
      examImportance: "Very High",
      topics: ["Dynamic Programming", "Subarray", "Optimization", "Linear Time"]
    },
    {
      title: "Strassen's Matrix Multiplication",
      description: "Faster matrix multiplication using divide and conquer",
      path: "/daa/divide-conquer/strassen",
      complexity: "O(n^2.807)",
      examImportance: "High",
      topics: ["Matrix", "Multiplication", "Optimization", "Subproblems"]
    },
    {
      title: "Closest Pair of Points",
      description: "Find closest pair of points in 2D plane efficiently",
      path: "/daa/divide-conquer/closest-pair",
      complexity: "O(n log n)",
      examImportance: "High",
      topics: ["Geometry", "Distance", "Sorting", "Merging"]
    },
  ];

  const educationalContent = {
    overview: "Divide and Conquer is an algorithmic paradigm that breaks down problems into smaller subproblems, solves them recursively, and combines the solutions. This approach is fundamental to many efficient algorithms.",
    keyCharacteristics: [
      "Divide: Break problem into smaller subproblems",
      "Conquer: Solve subproblems recursively",
      "Combine: Merge solutions of subproblems",
      "Base case: Handle trivial cases directly",
      "Recursive structure with optimal subproblems"
    ],
    applications: [
      "Sorting algorithms (Merge Sort, Quick Sort)",
      "Searching algorithms (Binary Search)",
      "Matrix multiplication (Strassen&apos;s algorithm)",
      "Fast Fourier Transform (FFT)",
      "Closest pair of points problem"
    ],
    examTips: [
      "Master the three-step process: divide, conquer, combine",
      "Practice recursive relation formulation",
      "Understand time complexity analysis using recurrence relations",
      "Learn to identify when divide and conquer is optimal",
      "Study the master theorem for complexity analysis"
    ]
  };

  const examPrep = {
    questionTypes: [
      "Trace algorithm execution step by step",
      "Analyze time complexity using recurrence relations",
      "Design divide and conquer algorithms for given problems",
      "Compare with other algorithmic paradigms",
      "Prove correctness of divide and conquer algorithms"
    ],
    practiceProblems: [
      "Merge Sort implementation and analysis",
      "Binary Search and its variants",
      "Maximum subarray problem",
      "Multiplication of large integers",
      "Finding majority element"
    ],
    examPattern: "Mumbai University frequently asks divide and conquer questions (10-15 marks), focusing on Merge Sort, binary search, and complexity analysis."
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Divide & Conquer Algorithms
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master the divide and conquer paradigm with interactive algorithm simulators
          </p>
        </div>

        {/* Algorithms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {divideConquerAlgorithms.map((algorithm, index) => (
            <Link
              key={index}
              href={algorithm.path}
              className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {algorithm.title}
                  </h3>
                  <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
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
                    Complexity: <code className="bg-gray-100 px-2 py-1 rounded text-blue-600 font-mono">{algorithm.complexity}</code>
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
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Understanding Divide & Conquer</h2>
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
                    <span className="text-indigo-500 mt-1">•</span>
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
                  "Focus on recurrence relation formulation",
                  "Practice step-by-step algorithm tracing",
                  "Master the Master Theorem for complexity analysis",
                  "Understand when to use divide and conquer vs other paradigms"
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

        {/* Algorithm Steps */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Divide & Conquer Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-3">1. DIVIDE</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Break Down</h3>
              <p className="text-gray-600">Split the problem into smaller subproblems of the same type</p>
            </div>
            <div className="text-center p-6 bg-indigo-50 rounded-lg">
              <div className="text-3xl font-bold text-indigo-600 mb-3">2. CONQUER</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Solve Recursively</h3>
              <p className="text-gray-600">Solve subproblems recursively until base case is reached</p>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 mb-3">3. COMBINE</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Merge Solutions</h3>
              <p className="text-gray-600">Combine solutions of subproblems to solve original problem</p>
            </div>
          </div>
        </div>

        {/* Complexity Analysis */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Complexity Analysis with Master Theorem</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Master Theorem</h3>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="font-mono text-sm">T(n) = aT(n/b) + f(n)</p>
                <p className="text-sm text-gray-600 mt-2">
                  Where: a ≥ 1, b &gt; 1, and f(n) is asymptotically positive
                </p>
              </div>
              <div className="space-y-2 text-sm">
                <p><strong>Case 1:</strong> If f(n) = O(n^(log_b(a) - ε)), then T(n) = Θ(n^log_b(a))</p>
                <p><strong>Case 2:</strong> If f(n) = Θ(n^log_b(a)), then T(n) = Θ(n^log_b(a) × log n)</p>
                <p><strong>Case 3:</strong> If f(n) = Ω(n^(log_b(a) + ε)), then T(n) = Θ(f(n))</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Common Examples</h3>
              <div className="space-y-3">
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="font-semibold">Merge Sort:</p>
                  <p className="text-sm">T(n) = 2T(n/2) + O(n) = O(n log n)</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="font-semibold">Binary Search:</p>
                  <p className="text-sm">T(n) = T(n/2) + O(1) = O(log n)</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <p className="font-semibold">Strassen&apos;s Matrix:</p>
                  <p className="text-sm">T(n) = 7T(n/2) + O(n²) = O(n^2.81)</p>
                </div>
              </div>
            </div>
          </div>
        </div>      </main>
    </div>
  );
}
