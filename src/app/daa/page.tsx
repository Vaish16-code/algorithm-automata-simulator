"use client";

import Link from "next/link";
import { BookOpen, Cpu, Users, Play, Star, CheckCircle2, Award, Clock, Globe, MessageSquare } from "lucide-react";

// Ad Components
const AdBanner = ({ slot, format = "horizontal" }: { slot: string; format?: "horizontal" | "vertical" | "square" }) => {
  const adStyles = {
    horizontal: "w-full h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-300",
    vertical: "w-48 h-80 bg-gradient-to-b from-green-100 to-blue-100 rounded-lg flex items-center justify-center border-2 border-dashed border-green-300",
    square: "w-64 h-64 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg flex items-center justify-center border-2 border-dashed border-yellow-300"
  };

  return (
    <div className={adStyles[format]}>
      <div className="text-center">
        <div className="text-sm font-medium text-gray-600 mb-1">Advertisement</div>
        <div className="text-xs text-gray-500">AdSense - {slot}</div>
        <div className="text-xs text-gray-400 mt-1">
          {format === "horizontal" ? "728x90" : format === "vertical" ? "160x600" : "300x250"}
        </div>
      </div>
    </div>
  );
};

const SponsoredContent = () => {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border-l-4 border-purple-400">
      <div className="flex items-center mb-3">
        <div className="bg-purple-100 p-2 rounded-full mr-3">
          <Star className="h-5 w-5 text-purple-600" />
        </div>
        <div>
          <h3 className="font-semibold text-purple-900">Sponsored: Master Algorithm Design</h3>
          <p className="text-sm text-purple-600">Join thousands mastering DSA for top tech companies</p>
        </div>
      </div>
      <div className="text-sm text-purple-700 mb-3">
        Comprehensive algorithm course covering all paradigms with hands-on coding practice and interview preparation.
      </div>
      <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
        Start Free Trial →
      </button>
    </div>
  );
};

export default function DAAHomePage() {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-orange-100 text-orange-800";
      case "Expert": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getExamWeightColor = (weight: string) => {
    switch (weight) {
      case "Very High": return "bg-red-100 text-red-800";
      case "High": return "bg-orange-100 text-orange-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const topics = [
    {
      title: "Greedy Algorithms",
      description: "Local optimal choices leading to global optimality",
      icon: Cpu,
      color: "from-green-500 to-emerald-500",
      difficulty: "Beginner",
      examWeight: "High",
      categories: [
        {
          name: "Fractional Knapsack",
          href: "/daa/greedy",
          description: "Maximize profit with value-to-weight ratio strategy",
          examTips: "Focus on greedy choice property and proof of optimality"
        },
        {
          name: "Job Sequencing with Deadlines",
          href: "/daa/greedy/job-sequencing",
          description: "Schedule jobs to maximize profit within deadlines",
          examTips: "Master deadline sorting and slot allocation algorithm"
        },
        {
          name: "Huffman Coding",
          href: "/daa/greedy/huffman",
          description: "Optimal prefix-free encoding for data compression",
          examTips: "Understand frequency-based tree construction"
        },
        {
          name: "Minimum Spanning Tree - Prim's",
          href: "/daa/greedy/prim",
          description: "Find MST using edge weight priority",
          examTips: "Practice with adjacency matrix and priority queue"
        },
        {
          name: "Minimum Spanning Tree - Kruskal's",
          href: "/daa/greedy/kruskal",
          description: "Find MST using union-find data structure",
          examTips: "Master cycle detection using disjoint sets"
        }
      ],
      applications: [
        "Network Design and Optimization",
        "Data Compression Algorithms",
        "Task Scheduling Systems"
      ],
      examInfo: {
        marks: "15-20",
        topics: ["Greedy Choice", "Optimal Substructure", "MST Algorithms"],
        questions: "Solve Knapsack variations, Design MST, Prove optimality"
      }
    },
    {
      title: "Dynamic Programming",
      description: "Optimal solutions through overlapping subproblems",
      icon: BookOpen,
      color: "from-blue-500 to-indigo-500",
      difficulty: "Advanced",
      examWeight: "Very High",
      categories: [
        {
          name: "0/1 Knapsack Problem",
          href: "/daa/dynamic/knapsack",
          description: "Maximum value selection without item fractions",
          examTips: "Master the recurrence relation and table construction"
        },
        {
          name: "Longest Common Subsequence",
          href: "/daa/dynamic/lcs",
          description: "Find longest common subsequence between strings",
          examTips: "Practice with string matching and edit distance"
        },
        {
          name: "Matrix Chain Multiplication",
          href: "/daa/dynamic/matrix-chain",
          description: "Optimal parenthesization for matrix multiplication",
          examTips: "Understand cost calculation and optimal splitting"
        },
        {
          name: "Floyd-Warshall Algorithm",
          href: "/daa/dynamic/floyd-warshall",
          description: "All-pairs shortest paths in weighted graphs",
          examTips: "Master the triple nested loop and path reconstruction"
        },
        {
          name: "Optimal Binary Search Tree",
          href: "/daa/dynamic/obst",
          description: "Construct BST with minimum expected search cost",
          examTips: "Focus on probability-based cost calculations"
        }
      ],
      applications: [
        "Algorithmic Trading and Finance",
        "Bioinformatics and DNA Analysis",
        "Resource Optimization"
      ],
      examInfo: {
        marks: "20-25",
        topics: ["Recurrence Relations", "Memoization", "Tabulation"],
        questions: "Solve DP problems, Write recurrence, Analyze complexity"
      }
    },
    {
      title: "Divide & Conquer",
      description: "Break problems into smaller subproblems recursively",
      icon: Globe,
      color: "from-purple-500 to-violet-500",
      difficulty: "Intermediate",
      examWeight: "High",
      categories: [
        {
          name: "Merge Sort Algorithm",
          href: "/daa/divide-conquer/merge-sort",
          description: "Stable O(n log n) sorting with guaranteed performance",
          examTips: "Master the merge operation and recurrence analysis"
        },
        {
          name: "Quick Sort Algorithm",
          href: "/daa/divide-conquer/quick-sort",
          description: "In-place sorting with average O(n log n) complexity",
          examTips: "Understand partitioning and worst-case scenarios"
        },
        {
          name: "Binary Search",
          href: "/daa/divide-conquer/binary-search",
          description: "Efficient O(log n) search in sorted arrays",
          examTips: "Practice with variations and boundary conditions"
        },
        {
          name: "Maximum Subarray (Kadane's)",
          href: "/daa/divide-conquer/kadane",
          description: "Find contiguous subarray with maximum sum",
          examTips: "Compare divide-conquer vs dynamic programming approaches"
        },
        {
          name: "Strassen's Matrix Multiplication",
          href: "/daa/divide-conquer/strassen",
          description: "Faster matrix multiplication using clever recursion",
          examTips: "Understand the mathematical optimization behind it"
        }
      ],
      applications: [
        "Database Query Optimization",
        "Computer Graphics and Image Processing",
        "Parallel Computing Algorithms"
      ],
      examInfo: {
        marks: "15-18",
        topics: ["Recurrence Relations", "Master Theorem", "Complexity Analysis"],
        questions: "Solve recurrences, Implement algorithms, Analyze performance"
      }
    },
    {
      title: "Backtracking",
      description: "Systematic exploration with intelligent pruning",
      icon: Star,
      color: "from-red-500 to-pink-500",
      difficulty: "Advanced",
      examWeight: "Medium",
      categories: [
        {
          name: "N-Queens Problem",
          href: "/daa/backtracking/n-queens",
          description: "Place N queens on chessboard without conflicts",
          examTips: "Master constraint checking and solution counting"
        },
        {
          name: "Sum of Subsets",
          href: "/daa/backtracking/subset-sum",
          description: "Find all subsets that sum to a target value",
          examTips: "Understand pruning strategies for efficiency"
        },
        {
          name: "Graph Coloring",
          href: "/daa/backtracking/graph-coloring",
          description: "Color graph vertices with minimum colors",
          examTips: "Practice with different graph structures"
        },
        {
          name: "Hamiltonian Cycle",
          href: "/daa/backtracking/hamiltonian",
          description: "Find cycle visiting each vertex exactly once",
          examTips: "Compare with TSP and understand the differences"
        }
      ],
      applications: [
        "Puzzle Solving and Game AI",
        "Resource Allocation Problems",
        "Constraint Satisfaction"
      ],
      examInfo: {
        marks: "12-15",
        topics: ["State Space Tree", "Bounding Functions", "Pruning"],
        questions: "Design backtracking solutions, Analyze state space"
      }
    },
    {
      title: "Branch & Bound",
      description: "Optimal solutions with systematic bound checking",
      icon: Award,
      color: "from-orange-500 to-red-500",
      difficulty: "Expert",
      examWeight: "Medium",
      categories: [
        {
          name: "Travelling Salesman Problem",
          href: "/daa/branch-bound/tsp",
          description: "Find shortest route visiting all cities once",
          examTips: "Master lower bound calculation and pruning strategies"
        },
        {
          name: "0/1 Knapsack with B&B",
          href: "/daa/branch-bound/knapsack",
          description: "Optimal knapsack solution using branch and bound",
          examTips: "Compare with DP approach and understand trade-offs"
        },
        {
          name: "Job Assignment Problem",
          href: "/daa/branch-bound/assignment",
          description: "Assign jobs to workers for minimum cost",
          examTips: "Practice with cost matrix and Hungarian method comparison"
        },
        {
          name: "15-Puzzle Solver",
          href: "/daa/branch-bound/fifteen-puzzle",
          description: "Solve sliding puzzle with optimal moves",
          examTips: "Understand heuristic functions and A* algorithm"
        }
      ],
      applications: [
        "Operations Research and Optimization",
        "AI and Pathfinding Algorithms",
        "Resource Scheduling"
      ],
      examInfo: {
        marks: "10-12",
        topics: ["Lower Bounds", "Upper Bounds", "FIFO/LIFO Strategies"],
        questions: "Solve optimization problems, Calculate bounds"
      }
    },
    {
      title: "String Matching",
      description: "Efficient pattern searching in text",
      icon: Clock,
      color: "from-teal-500 to-cyan-500",
      difficulty: "Intermediate",
      examWeight: "Low",
      categories: [
        {
          name: "Naive String Matching",
          href: "/daa/string-matching/naive",
          description: "Simple brute force pattern matching",
          examTips: "Understand the O(nm) complexity analysis"
        },
        {
          name: "KMP Algorithm",
          href: "/daa/string-matching/kmp",
          description: "Efficient pattern matching using failure function",
          examTips: "Master the preprocessing phase and failure table"
        },
        {
          name: "Rabin-Karp Algorithm",
          href: "/daa/string-matching/rabin-karp",
          description: "Hash-based pattern matching technique",
          examTips: "Understand rolling hash and collision handling"
        }
      ],
      applications: [
        "Text Editors and Search Engines",
        "DNA Sequence Analysis",
        "Data Mining and Pattern Recognition"
      ],
      examInfo: {
        marks: "8-10",
        topics: ["Pattern Preprocessing", "Time Complexity", "Hash Functions"],
        questions: "Implement algorithms, Compare efficiencies"
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-cyan-300 text-sm font-medium mb-6">
              <BookOpen className="h-4 w-4 mr-2" />
              Design & Analysis of Algorithms
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Algorithm Design &
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                Analysis Master
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Master algorithmic thinking with interactive visualizations of greedy, dynamic programming, 
              divide & conquer, backtracking, and branch & bound techniques.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <span className="text-sm">Step-by-Step Analysis</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-sm">Complexity Calculations</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Users className="h-4 w-4 text-purple-400" />
                <span className="text-sm">University Exam Prep</span>
              </div>
            </div>
            <div className="flex justify-center gap-4">
              <Link
                href="/"
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/20 transition-all duration-200"
              >
                ← Back to Home
              </Link>
              <Link
                href="/about"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-600 transition-all duration-200"
              >
                Learn More →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top Banner Ad */}
        <div className="mb-8">
          <AdBanner slot="top-banner" format="horizontal" />
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {topics.map((topic, index) => (
            <div 
              key={index}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden border border-gray-100"
            >
              {/* Card Header */}
              <div className={`bg-gradient-to-r ${topic.color} p-6 text-white`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                    <topic.icon className="h-8 w-8" />
                  </div>
                  <div className="flex space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(topic.difficulty)}`}>
                      {topic.difficulty}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getExamWeightColor(topic.examWeight)}`}>
                      {topic.examWeight} Weight
                    </span>
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-2">{topic.title}</h2>
                <p className="text-white/90">{topic.description}</p>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Categories */}
                <div className="space-y-3 mb-6">
                  {topic.categories.map((category, catIndex) => (
                    <Link
                      key={catIndex}
                      href={category.href}
                      className="block p-4 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group/item"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 group-hover/item:text-blue-700">
                            {category.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {category.description}
                          </p>
                          <p className="text-xs text-blue-600 mt-1 font-medium">
                            💡 {category.examTips}
                          </p>
                        </div>
                        <Play className="h-5 w-5 text-blue-400 group-hover/item:text-blue-600 ml-4" />
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Exam Information */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <Award className="h-4 w-4 mr-2 text-purple-600" />
                    University Exam Info
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Expected Marks:</span>
                      <span className="text-purple-700 ml-1">{topic.examInfo.marks}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Key Topics:</span>
                      <div className="text-gray-600 text-xs mt-1">
                        {topic.examInfo.topics.join(", ")}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className="font-medium text-gray-700">Typical Questions:</span>
                    <p className="text-gray-600 text-xs mt-1">{topic.examInfo.questions}</p>
                  </div>
                </div>

                {/* Applications */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <Globe className="h-4 w-4 mr-2 text-blue-600" />
                    Real-World Applications
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {topic.applications.map((app, appIndex) => (
                      <span 
                        key={appIndex}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                      >
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mid-Content Sponsored Section */}
        <div className="mb-16">
          <SponsoredContent />
        </div>

        {/* Algorithm Comparison */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Algorithm Design Paradigms Comparison
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Understand when to use each algorithmic approach and their trade-offs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">6</h3>
              <p className="text-gray-600">Design Paradigms</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">25+</h3>
              <p className="text-gray-600">Classic Algorithms</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-100 rounded-xl">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">100%</h3>
              <p className="text-gray-600">University Coverage</p>
            </div>
          </div>
        </div>

        {/* Study Tips */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
          {/* Main Study Tips Content */}
          <div className="lg:col-span-3">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                📚 Algorithm Design Study Strategy
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-yellow-700">
                <div>
                  <h3 className="font-semibold mb-3">🎯 High Priority Topics</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Master Dynamic Programming principles and recurrence relations</li>
                    <li>• Practice Greedy algorithm proofs and optimality conditions</li>
                    <li>• Understand time complexity analysis using Master Theorem</li>
                    <li>• Learn backtracking state space tree construction</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">💡 Exam Strategies</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Focus on algorithm implementation and trace execution</li>
                    <li>• Practice complexity analysis with recurrence solving</li>
                    <li>• Master optimization proof techniques</li>
                    <li>• Compare different approaches for same problems</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar Ad */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <AdBanner slot="sidebar" format="vertical" />
            </div>
          </div>
        </div>

        {/* Complete Course Navigation */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            📖 Complete Algorithm Design Course
          </h2>
          <p className="text-lg text-gray-600 text-center mb-8 max-w-3xl mx-auto">
            Master every algorithmic paradigm with comprehensive coverage and practical implementation.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Greedy Algorithms */}
            <Link href="/daa/greedy" className="group block p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 hover:border-green-400 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center mb-3">
                <div className="bg-green-500 p-2 rounded-lg mr-3">
                  <Cpu className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-green-900">Greedy Algorithms</h3>
              </div>
              <p className="text-sm text-green-700 mb-3">Local optimal choices, MST, Huffman coding</p>
              <div className="text-xs text-green-600 font-medium">
                💡 Knapsack, Job sequencing, Prim's, Kruskal's
              </div>
            </Link>

            {/* Dynamic Programming */}
            <Link href="/daa/dynamic" className="group block p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center mb-3">
                <div className="bg-blue-500 p-2 rounded-lg mr-3">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-blue-900">Dynamic Programming</h3>
              </div>
              <p className="text-sm text-blue-700 mb-3">Optimal substructure, memoization</p>
              <div className="text-xs text-blue-600 font-medium">
                💡 0/1 Knapsack, LCS, Matrix chain, Floyd-Warshall
              </div>
            </Link>

            {/* Divide & Conquer */}
            <Link href="/daa/divide-conquer" className="group block p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border-2 border-purple-200 hover:border-purple-400 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center mb-3">
                <div className="bg-purple-500 p-2 rounded-lg mr-3">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-purple-900">Divide & Conquer</h3>
              </div>
              <p className="text-sm text-purple-700 mb-3">Recursive problem decomposition</p>
              <div className="text-xs text-purple-600 font-medium">
                💡 Merge sort, Quick sort, Binary search, Strassen's
              </div>
            </Link>

            {/* Backtracking */}
            <Link href="/daa/backtracking" className="group block p-6 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border-2 border-red-200 hover:border-red-400 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center mb-3">
                <div className="bg-red-500 p-2 rounded-lg mr-3">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-red-900">Backtracking</h3>
              </div>
              <p className="text-sm text-red-700 mb-3">Systematic search with pruning</p>
              <div className="text-xs text-red-600 font-medium">
                💡 N-Queens, Subset sum, Graph coloring
              </div>
            </Link>

            {/* Branch & Bound */}
            <Link href="/daa/branch-bound" className="group block p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border-2 border-orange-200 hover:border-orange-400 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center mb-3">
                <div className="bg-orange-500 p-2 rounded-lg mr-3">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-orange-900">Branch & Bound</h3>
              </div>
              <p className="text-sm text-orange-700 mb-3">Optimal solutions with bounding</p>
              <div className="text-xs text-orange-600 font-medium">
                💡 TSP, Assignment problem, 15-puzzle
              </div>
            </Link>

            {/* String Matching */}
            <Link href="/daa/string-matching" className="group block p-6 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border-2 border-teal-200 hover:border-teal-400 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center mb-3">
                <div className="bg-teal-500 p-2 rounded-lg mr-3">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-teal-900">String Matching</h3>
              </div>
              <p className="text-sm text-teal-700 mb-3">Efficient pattern searching</p>
              <div className="text-xs text-teal-600 font-medium">
                💡 KMP, Rabin-Karp, Boyer-Moore
              </div>
            </Link>
          </div>
          
          <div className="mt-8 text-center">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium">
              <BookOpen className="h-5 w-5 mr-2" />
              Complete course covers all major algorithmic paradigms
            </div>
          </div>
        </div>

        {/* Need Help Section */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 mb-16 border border-indigo-200">
          <div className="text-center">
            <div className="bg-indigo-100 p-3 rounded-full w-16 h-16 mx-auto mb-4">
              <MessageSquare className="h-10 w-10 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-indigo-900 mb-4">
              Need Help with Algorithm Design?
            </h2>
            <p className="text-indigo-700 mb-6 max-w-2xl mx-auto">
              Struggling with complex recurrence relations or optimization proofs? 
              Our team provides expert guidance for algorithm design and analysis.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-all duration-200"
              >
                Get Support →
              </Link>
              <Link
                href="/about"
                className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-medium border-2 border-indigo-200 hover:border-indigo-400 transition-all duration-200"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>

        {/* Important Links */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Important Information
            </h2>
            <p className="text-gray-600">
              Access essential information about our platform and policies
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/privacy"
              className="text-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
            >
              <div className="text-blue-600 font-medium">Privacy Policy</div>
              <div className="text-xs text-blue-500 mt-1">Data protection & cookies</div>
            </Link>
            <Link
              href="/terms"
              className="text-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200"
            >
              <div className="text-green-600 font-medium">Terms of Service</div>
              <div className="text-xs text-green-500 mt-1">Usage terms & conditions</div>
            </Link>
            <Link
              href="/about"
              className="text-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200"
            >
              <div className="text-purple-600 font-medium">About Us</div>
              <div className="text-xs text-purple-500 mt-1">Our mission & team</div>
            </Link>
            <Link
              href="/contact"
              className="text-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors duration-200"
            >
              <div className="text-orange-600 font-medium">Contact</div>
              <div className="text-xs text-orange-500 mt-1">Get support & feedback</div>
            </Link>
          </div>
        </div>

        {/* Bottom Ad Section */}
        <div className="mb-8">
          <AdBanner slot="bottom-banner" format="horizontal" />
        </div>
      </div>
    </div>
  );
}
