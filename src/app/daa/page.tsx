"use client";

import Link from "next/link";

export default function DAAHomePage() {
  const algorithmCategories = [
    {
      title: "Greedy Algorithms",
      description: "Algorithms that make locally optimal choices at each step",
      color: "from-green-500 to-emerald-600",
      icon: "🎯",
      categoryPath: "/daa/greedy",
      algorithms: [
        {
          name: "Fractional Knapsack",
          path: "/daa/greedy",
          description: "Maximize profit by taking fractions of items"
        },
        {
          name: "Job Sequencing",
          path: "/daa/greedy/job-sequencing",
          description: "Schedule jobs to maximize profit within deadlines"
        },
        {
          name: "Prim's MST",
          path: "/daa/greedy/prim",
          description: "Find minimum spanning tree using Prim's algorithm"
        }
      ]
    },
    {
      title: "Dynamic Programming",
      description: "Solve complex problems by breaking them into subproblems",
      color: "from-blue-500 to-indigo-600",
      icon: "📊",
      categoryPath: "/daa/dynamic",
      algorithms: [
        {
          name: "0/1 Knapsack",
          path: "/daa/dynamic/knapsack",
          description: "Optimal selection without item fractions"
        },
        {
          name: "Longest Common Subsequence",
          path: "/daa/dynamic/lcs",
          description: "Find the longest common subsequence between strings"
        },
        {
          name: "Matrix Chain Multiplication",
          path: "/daa/dynamic/matrix-chain",
          description: "Optimize matrix multiplication order"
        },
        {
          name: "Floyd-Warshall",
          path: "/daa/dynamic/floyd-warshall",
          description: "All-pairs shortest path algorithm"
        }
      ]
    },
    {
      title: "Divide & Conquer",
      description: "Break problems into smaller parts and combine solutions",
      color: "from-purple-500 to-violet-600",
      icon: "⚔️",
      categoryPath: "/daa/divide-conquer",
      algorithms: [
        {
          name: "Merge Sort",
          path: "/daa/divide-conquer/merge-sort",
          description: "Efficient O(n log n) sorting algorithm"
        },
        {
          name: "Quick Sort",
          path: "/daa/divide-conquer/quick-sort",
          description: "Fast average-case O(n log n) sorting"
        },
        {
          name: "Binary Search",
          path: "/daa/divide-conquer/binary-search",
          description: "Search in sorted arrays in O(log n) time"
        },
        {
          name: "Maximum Subarray",
          path: "/daa/divide-conquer/kadane",
          description: "Find maximum sum contiguous subarray"
        }
      ]
    },
    {
      title: "Backtracking",
      description: "Systematically search solution space with pruning",
      color: "from-red-500 to-pink-600",
      icon: "🔙",
      categoryPath: "/daa/backtracking",
      algorithms: [
        {
          name: "N-Queens Problem",
          path: "/daa/backtracking/n-queens",
          description: "Place N queens on chessboard without conflicts"
        },
        {
          name: "Sum of Subsets",
          path: "/daa/backtracking/subset-sum",
          description: "Find subset with given target sum"
        }
      ]
    },
    {
      title: "Branch & Bound",
      description: "Optimal solutions using systematic enumeration",
      color: "from-orange-500 to-red-600",
      icon: "🌳",
      categoryPath: "/daa/branch-bound",
      algorithms: [
        {
          name: "Travelling Salesman",
          path: "/daa/branch-bound/tsp",
          description: "Find shortest route visiting all cities"
        },
        {
          name: "15-Puzzle",
          path: "/daa/branch-bound/fifteen-puzzle",
          description: "Solve sliding puzzle optimally"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Design & Analysis of <span className="text-blue-200">Algorithms</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              Master algorithmic thinking through interactive visualizations and step-by-step analysis
            </p>
            <p className="text-lg text-blue-200 mt-4 max-w-3xl mx-auto">
              Explore fundamental algorithm design paradigms with real-time simulations, complexity analysis, and Mumbai University exam preparation
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
              <span className="text-blue-100">✅ Interactive Visualizations</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
              <span className="text-blue-100">✅ Complexity Analysis</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
              <span className="text-blue-100">✅ Exam Preparation</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
              <span className="text-blue-100">✅ Step-by-Step Solutions</span>
            </div>
          </div>
          
          <a
            href="#algorithms"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
          >
            Start Learning
            <span className="ml-2">→</span>
          </a>
        </div>
      </div>

      {/* Algorithm Categories Section */}
      <div id="algorithms" className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Algorithm Categories</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master each algorithmic paradigm with interactive tools and comprehensive analysis
          </p>
        </div>

        {/* Algorithm Categories */}
        <div className="space-y-12">
          {algorithmCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center text-3xl`}>
                    {category.icon}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800">{category.title}</h2>
                    <p className="text-gray-600">{category.description}</p>
                  </div>
                </div>
                <Link
                  href={category.categoryPath}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors font-semibold"
                >
                  View All →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.algorithms.map((algorithm, algorithmIndex) => (
                  <Link
                    key={algorithmIndex}
                    href={algorithm.path}
                    className="group block p-6 bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                        {algorithm.name}
                      </h3>
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm group-hover:scale-110 transition-transform">
                        →
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {algorithm.description}
                    </p>
                    <div className="mt-4 text-xs text-blue-600 font-semibold group-hover:text-blue-700">
                      Try Interactive Demo →
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="mt-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold text-center mb-8">Why Use Our Algorithm Simulator?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center text-3xl mx-auto mb-4">
                👁️
              </div>
              <h3 className="text-xl font-bold mb-2">Visual Learning</h3>
              <p className="text-indigo-100">
                Watch algorithms execute step-by-step with interactive visualizations
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center text-3xl mx-auto mb-4">
                ⚡
              </div>
              <h3 className="text-xl font-bold mb-2">Real-Time Interaction</h3>
              <p className="text-indigo-100">
                Modify inputs and see immediate results with performance metrics
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center text-3xl mx-auto mb-4">
                📚
              </div>
              <h3 className="text-xl font-bold mb-2">Complete Analysis</h3>
              <p className="text-indigo-100">
                Understand time complexity, space complexity, and algorithm behavior
              </p>
            </div>
          </div>
        </div>

        {/* Quick Start Guide */}
        <div className="mt-12 bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-yellow-800 mb-4 flex items-center gap-2">
            🚀 Quick Start Guide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-yellow-700">
            <div>
              <h3 className="font-bold mb-2">For Beginners:</h3>
              <ul className="space-y-1 text-sm">
                <li>• Start with <strong>Greedy Algorithms</strong> (easier to understand)</li>
                <li>• Try <strong>Fractional Knapsack</strong> or <strong>Job Sequencing</strong></li>
                <li>• Watch the step-by-step visualizations</li>
                <li>• Experiment with different inputs</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-2">For Advanced Users:</h3>
              <ul className="space-y-1 text-sm">
                <li>• Explore <strong>Dynamic Programming</strong> complexities</li>
                <li>• Compare <strong>Divide & Conquer</strong> vs other approaches</li>
                <li>• Challenge yourself with <strong>Backtracking</strong> problems</li>
                <li>• Analyze performance metrics and complexity</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
