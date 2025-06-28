"use client";

import Link from "next/link";

export default function OperatingSystemsPage() {
  const topics = [
    {
      title: "Process Management",
      description: "CPU Scheduling algorithms and process synchronization",
      categories: [
        {
          name: "CPU Scheduling",
          href: "/os/cpu-scheduling",
          description: "FCFS, SJF, SRTF, Priority, Round Robin scheduling"
        },
        {
          name: "Process Synchronization", 
          href: "/os/synchronization",
          description: "Producer-Consumer, Readers-Writers, Dining Philosophers"
        },
        {
          name: "Deadlock Handling",
          href: "/os/deadlock",
          description: "Deadlock detection, prevention, and recovery algorithms"
        }
      ]
    },
    {
      title: "Memory Management",
      description: "Virtual memory and page replacement strategies",
      categories: [
        {
          name: "Page Replacement",
          href: "/os/page-replacement",
          description: "FIFO, LRU, LFU, Optimal page replacement algorithms"
        },
        {
          name: "Memory Allocation",
          href: "/os/memory-allocation",
          description: "First Fit, Best Fit, Worst Fit allocation strategies"
        },
        {
          name: "Virtual Memory",
          href: "/os/virtual-memory",
          description: "Paging, segmentation, and address translation"
        }
      ]
    },
    {
      title: "Storage Management",
      description: "Disk scheduling and file system algorithms",
      categories: [
        {
          name: "Disk Scheduling",
          href: "/os/disk-scheduling",
          description: "FCFS, SSTF, SCAN, C-SCAN, LOOK, C-LOOK algorithms"
        },
        {
          name: "File Allocation",
          href: "/os/file-allocation",
          description: "Contiguous, linked, and indexed allocation methods"
        },
        {
          name: "Directory Management",
          href: "/os/directory",
          description: "Single-level, two-level, tree-structured directories"
        }
      ]
    },
    {
      title: "I/O Management",
      description: "Input/Output scheduling and device management",
      categories: [
        {
          name: "I/O Scheduling",
          href: "/os/io-scheduling",
          description: "FCFS, SSTF, SCAN I/O request scheduling"
        },
        {
          name: "Buffer Management",
          href: "/os/buffer-management",
          description: "Single, double, and circular buffering strategies"
        }
      ]
    },
    {
      title: "Security & Protection",
      description: "Access control and security mechanisms",
      categories: [
        {
          name: "Access Control",
          href: "/os/access-control",
          description: "Access control matrix, capability lists, ACLs"
        },
        {
          name: "Authentication",
          href: "/os/authentication",
          description: "Password systems, biometric authentication"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Operating Systems Simulator
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Interactive simulators for OS algorithms including process scheduling, memory management, 
            disk scheduling, and system synchronization. Learn through step-by-step execution and visualization.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {topics.map((topic, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4">
                <h2 className="text-2xl font-bold text-white">{topic.title}</h2>
                <p className="text-blue-100 text-sm mt-1">{topic.description}</p>
              </div>
              
              <div className="p-6">
                <div className="space-y-3">
                  {topic.categories.map((category, catIndex) => (
                    <Link
                      key={catIndex}
                      href={category.href}
                      className="block p-4 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-800 group-hover:text-blue-700">
                            {category.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {category.description}
                          </p>
                        </div>
                        <div className="text-blue-400 group-hover:text-blue-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">About Operating Systems</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Core Components:</h3>
              <ul className="space-y-1 text-sm">
                <li>• Process and Thread Management</li>
                <li>• Memory Management and Virtual Memory</li>
                <li>• File System and Storage Management</li>
                <li>• I/O and Device Management</li>
                <li>• Security and Protection Mechanisms</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Applications:</h3>
              <ul className="space-y-1 text-sm">
                <li>• System Performance Optimization</li>
                <li>• Resource Allocation and Scheduling</li>
                <li>• Concurrent Programming</li>
                <li>• System Security and Access Control</li>
                <li>• Embedded Systems Design</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
      "Process synchronization and scheduling",
      "Hardware abstraction and control",
      "Performance metrics optimization"
    ],
    applications: [
      "Virtual memory management systems",
      "Database buffer management",
      "Web server caching strategies",
      "Storage system optimization",
      "Cloud resource management"
    ],
    examTips: [
      "Understand trade-offs between different algorithms",
      "Practice calculating performance metrics",
      "Learn hardware implications of each algorithm",
      "Study real-world implementation details",
      "Master algorithm selection criteria"
    ]
  };

  const examPrep = {
    questionTypes: [
      "Simulate algorithm execution with given input",
      "Calculate hit ratios and performance metrics",
      "Compare algorithm efficiency and trade-offs",
      "Design optimal strategies for specific scenarios",
      "Analyze worst-case and average-case performance"
    ],
    practiceProblems: [
      "Page replacement with different reference strings",
      "Disk scheduling with various request patterns",
      "Memory allocation and deallocation scenarios",
      "Performance comparison of different algorithms",
      "Real-world optimization problems"
    ],
    examPattern: "Mumbai University OS exams typically include 2-3 questions (15-20 marks total) on memory management and disk scheduling algorithms."
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Operating Systems Algorithms
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master OS algorithms for memory management and disk optimization with interactive simulators
          </p>
        </div>

        {/* Algorithms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {osAlgorithms.map((algorithm, index) => (
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
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Understanding Operating Systems Algorithms</h2>
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
                    <span className="text-blue-500 mt-1">•</span>
                    {app}
                  </li>
                ))}
              </ul>
              
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Exam Tips</h3>
              <ul className="space-y-2 text-gray-600">
                {educationalContent.examTips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
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
                  "Focus on algorithm simulation and step-by-step execution",
                  "Practice calculating hit ratios and performance metrics",
                  "Understand hardware implications of each algorithm",
                  "Learn to choose optimal algorithms for different scenarios"
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
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Algorithm Comparison</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Page Replacement</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">FIFO</span>
                  <span className="text-sm text-gray-600">Simple, but Belady&apos;s anomaly</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">LRU</span>
                  <span className="text-sm text-gray-600">Good performance, complex</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Optimal</span>
                  <span className="text-sm text-gray-600">Best possible, impractical</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Disk Scheduling</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">FCFS</span>
                  <span className="text-sm text-gray-600">Fair, but high seek time</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">SCAN</span>
                  <span className="text-sm text-gray-600">Elevator algorithm, predictable</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">C-SCAN</span>
                  <span className="text-sm text-gray-600">Circular, more uniform</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Key Performance Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-2">Hit Ratio</div>
              <p className="text-gray-600">Percentage of successful memory accesses</p>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-2">Seek Time</div>
              <p className="text-gray-600">Time to position disk head on track</p>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-2">Throughput</div>
              <p className="text-gray-600">Number of processes completed per unit time</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
