"use client";

import Link from "next/link";
import { Cpu, HardDrive, Shield, Clock, MemoryStick, Users, Play, Star, CheckCircle2, Award, BookOpen } from "lucide-react";

export default function OperatingSystemsPage() {
  const getTopicIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      Cpu,
      Memory: MemoryStick,
      HardDrive,
      Clock,
      Shield
    };
    return iconMap[iconName];
  };

  const topics = [
    {
      title: "Process Management",
      description: "CPU Scheduling algorithms and process synchronization",
      icon: "Cpu",
      color: "from-blue-500 to-cyan-500",
      difficulty: "Beginner",
      examWeight: "High",
      categories: [
        {
          name: "CPU Scheduling",
          href: "/os/cpu-scheduling",
          description: "FCFS, SJF, SRTF, Priority, Round Robin scheduling",
          examTips: "Focus on Gantt charts and calculating average waiting/turnaround time"
        },
        {
          name: "Process Synchronization", 
          href: "/os/synchronization",
          description: "Producer-Consumer, Readers-Writers, Dining Philosophers",
          examTips: "Understand semaphores, mutexes, and critical section problems"
        },
        {
          name: "Deadlock Handling",
          href: "/os/deadlock",
          description: "Deadlock detection, prevention, and recovery algorithms",
          examTips: "Master Banker's algorithm and resource allocation graphs"
        }
      ],
      applications: [
        "Multi-tasking Operating Systems",
        "Real-time Systems",
        "Server Load Balancing"
      ],
      examInfo: {
        marks: "20-25",
        topics: ["Scheduling Algorithms", "Process States", "Inter-process Communication"],
        questions: "Calculate turnaround time, Solve deadlock scenarios, Design synchronization solutions"
      }
    },
    {
      title: "Memory Management",
      description: "Virtual memory and page replacement strategies",
      icon: "Memory",
      color: "from-purple-500 to-pink-500",
      difficulty: "Intermediate",
      examWeight: "High",
      categories: [
        {
          name: "Page Replacement",
          href: "/os/page-replacement",
          description: "FIFO, LRU, LFU, Optimal page replacement algorithms",
          examTips: "Practice page fault calculations and hit ratio analysis"
        },
        {
          name: "Memory Allocation",
          href: "/os/memory-allocation",
          description: "First Fit, Best Fit, Worst Fit allocation strategies",
          examTips: "Understand fragmentation concepts and memory utilization"
        },
        {
          name: "Virtual Memory",
          href: "/os/virtual-memory",
          description: "Paging, segmentation, and address translation",
          examTips: "Focus on page table structures and address mapping"
        }
      ],
      applications: [
        "Virtual Memory Systems",
        "Garbage Collection",
        "Memory-mapped Files"
      ],
      examInfo: {
        marks: "15-20",
        topics: ["Paging", "Segmentation", "Memory Allocation", "Page Replacement"],
        questions: "Solve page replacement problems, Calculate memory utilization, Design page tables"
      }
    },
    {
      title: "Storage Management",
      description: "Disk scheduling and file system algorithms",
      icon: "HardDrive",
      color: "from-green-500 to-emerald-500",
      difficulty: "Intermediate",
      examWeight: "Medium",
      categories: [
        {
          name: "Disk Scheduling",
          href: "/os/disk",
          description: "FCFS, SSTF, SCAN, C-SCAN, LOOK, C-LOOK algorithms",
          examTips: "Master seek time calculations and draw disk head movement diagrams"
        },
        {
          name: "File Allocation",
          href: "/os/file-allocation",
          description: "Contiguous, linked, and indexed allocation methods",
          examTips: "Compare allocation methods and understand directory structures"
        },
        {
          name: "Directory Management",
          href: "/os/directory",
          description: "Single-level, two-level, tree-structured directories",
          examTips: "Design directory structures and understand path resolution"
        }
      ],
      applications: [
        "Database Storage",
        "File System Design",
        "Disk Performance Optimization"
      ],
      examInfo: {
        marks: "10-15",
        topics: ["Disk Scheduling", "File Systems", "Directory Structures"],
        questions: "Calculate seek time, Design file allocation tables, Compare scheduling algorithms"
      }
    },
    {
      title: "I/O Management",
      description: "Input/Output scheduling and device management",
      icon: "Clock",
      color: "from-orange-500 to-red-500",
      difficulty: "Advanced",
      examWeight: "Medium",
      categories: [
        {
          name: "I/O Scheduling",
          href: "/os/io-scheduling",
          description: "FCFS, SSTF, SCAN I/O request scheduling",
          examTips: "Understand device drivers and interrupt handling"
        },
        {
          name: "Buffer Management",
          href: "/os/buffer-management",
          description: "Single, double, and circular buffering strategies",
          examTips: "Master buffering concepts and data transfer mechanisms"
        },
        {
          name: "Device Management",
          href: "/os/device-management",
          description: "Device drivers, interrupt handling, DMA",
          examTips: "Focus on hardware-software interface and I/O optimization"
        }
      ],
      applications: [
        "Device Driver Development",
        "Real-time I/O Systems",
        "Network Interface Management"
      ],
      examInfo: {
        marks: "8-12",
        topics: ["I/O Systems", "Device Management", "Interrupt Handling"],
        questions: "Design I/O systems, Explain device management, Compare I/O methods"
      }
    },
    {
      title: "Security & Protection",
      description: "Access control and security mechanisms",
      icon: "Shield",
      color: "from-red-500 to-pink-500",
      difficulty: "Advanced",
      examWeight: "Low",
      categories: [
        {
          name: "Access Control",
          href: "/os/access-control",
          description: "Access control matrix, capability lists, ACLs",
          examTips: "Understand protection domains and access rights"
        },
        {
          name: "Authentication",
          href: "/os/authentication",
          description: "Password systems, biometric authentication",
          examTips: "Focus on authentication methods and security policies"
        },
        {
          name: "Cryptography",
          href: "/os/cryptography",
          description: "Encryption, digital signatures, key management",
          examTips: "Understand basic cryptographic concepts and their OS applications"
        }
      ],
      applications: [
        "System Security",
        "Network Security",
        "Access Control Systems"
      ],
      examInfo: {
        marks: "5-10",
        topics: ["Security Models", "Access Control", "Authentication"],
        questions: "Design security systems, Explain authentication methods, Analyze security threats"
      }
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-orange-100 text-orange-800";
      case "Expert": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getExamWeightColor = (weight: string) => {
    switch(weight) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-cyan-300 text-sm font-medium mb-6">
              <Cpu className="h-4 w-4 mr-2" />
              Systems Programming
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Operating Systems
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                Simulator
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Master OS concepts with interactive simulations covering process management, memory management, 
              storage systems, and more - designed for Mumbai University examinations.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <span className="text-sm">Step-by-Step Solutions</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-sm">Mumbai University Aligned</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Users className="h-4 w-4 text-purple-400" />
                <span className="text-sm">Interactive Visualizations</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
                    {(() => {
                      const IconComponent = getTopicIcon(topic.icon);
                      return IconComponent ? <IconComponent className="h-8 w-8" /> : null;
                    })()}
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
                    Mumbai University Exam Info
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
                  <div className="mt-2">
                    <span className="font-medium text-gray-700 text-sm">Common Questions:</span>
                    <p className="text-gray-600 text-xs mt-1">{topic.examInfo.questions}</p>
                  </div>
                </div>

                {/* Applications */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm">Real-World Applications:</h4>
                  <div className="flex flex-wrap gap-2">
                    {topic.applications.map((app, appIndex) => (
                      <span key={appIndex} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                        {app}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Explore Button */}
                <Link
                  href={topic.categories[0].href}
                  className={`w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r ${topic.color} hover:opacity-90 text-white font-semibold rounded-xl transition-all duration-200 group`}
                >
                  <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                  Start Learning
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Mumbai University Focus Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white mb-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Mumbai University Focused</h2>
            <p className="text-purple-100 mb-6 max-w-3xl mx-auto">
              All OS simulations include detailed step-by-step solutions formatted for Mumbai University 
              examination answers, with proper algorithmic steps and performance calculations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-white/20 p-3 rounded-xl w-fit mx-auto mb-3">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">Exam Format</h3>
                <p className="text-sm text-purple-100">Solutions formatted for university answer sheets</p>
              </div>
              <div className="text-center">
                <div className="bg-white/20 p-3 rounded-xl w-fit mx-auto mb-3">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">Algorithm Analysis</h3>
                <p className="text-sm text-purple-100">Time complexity and performance calculations</p>
              </div>
              <div className="text-center">
                <div className="bg-white/20 p-3 rounded-xl w-fit mx-auto mb-3">
                  <Star className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">Syllabus Aligned</h3>
                <p className="text-sm text-purple-100">Covers complete MU OS curriculum</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Reference */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Operating Systems Quick Reference</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-xl mb-3">
                <h3 className="font-semibold text-blue-800">Process Management</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• CPU Scheduling</li>
                <li>• Process Synchronization</li>
                <li>• Deadlock Management</li>
              </ul>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-xl mb-3">
                <h3 className="font-semibold text-purple-800">Memory Management</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Virtual Memory</li>
                <li>• Page Replacement</li>
                <li>• Memory Allocation</li>
              </ul>
            </div>
            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-xl mb-3">
                <h3 className="font-semibold text-green-800">Storage Systems</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Disk Scheduling</li>
                <li>• File Systems</li>
                <li>• Directory Structures</li>
              </ul>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 p-4 rounded-xl mb-3">
                <h3 className="font-semibold text-orange-800">System Security</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Access Control</li>
                <li>• Authentication</li>
                <li>• Security Models</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
