"use client";

import Link from "next/link";
import { Globe, Network, Shield, Clock, Cpu, Users, Play, Star, CheckCircle2, Award, BookOpen } from "lucide-react";

export default function ComputerNetworksPage() {
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
      title: "Network Fundamentals",
      description: "Network architecture, protocols, and performance analysis",
      icon: Globe,
      color: "from-blue-500 to-cyan-500",
      difficulty: "Beginner",
      examWeight: "High",
      categories: [
        {
          name: "Network Architecture & Types",
          href: "/cn/protocols",
          description: "Network types, topology, and applications overview",
          examTips: "Understand different network types: LAN, WAN, MAN and their characteristics"
        },
        {
          name: "OSI & TCP/IP Models",
          href: "/cn/protocols",
          description: "Protocol stack comparison and layer functions",
          examTips: "Memorize all 7 OSI layers and TCP/IP 4-layer model functions"
        },
        {
          name: "Performance Metrics",
          href: "/cn/protocols",
          description: "Bandwidth, latency, throughput calculations",
          examTips: "Practice bandwidth-delay product and utilization calculations"
        }
      ],
      applications: [
        "Network Design and Planning",
        "Internet Applications",
        "Performance Optimization"
      ],
      examInfo: {
        marks: "10-15",
        topics: ["OSI Model", "TCP/IP", "Network Types"],
        questions: "Explain OSI layers, Compare network topologies"
      }
    },
    {
      title: "IP Addressing & Routing",
      description: "Internet protocols and routing algorithms",
      icon: Network,
      color: "from-purple-500 to-violet-500",
      difficulty: "Advanced",
      examWeight: "Very High",
      categories: [
        {
          name: "IP Addressing & Subnetting",
          href: "/cn/ip-addressing",
          description: "CIDR, VLSM, subnet calculations with interactive calculator",
          examTips: "Master binary conversion and subnet mask calculations"
        },
        {
          name: "Routing Algorithms",
          href: "/cn/routing",
          description: "Dijkstra, Bellman-Ford, distance vector protocols",
          examTips: "Practice shortest path calculations and convergence analysis"
        },
        {
          name: "Network Address Translation",
          href: "/cn/protocols",
          description: "NAT, CIDR, address aggregation techniques",
          examTips: "Understand private vs public IP ranges and NAT operations"
        }
      ],
      applications: [
        "Internet Routing",
        "Corporate Networks",
        "ISP Infrastructure"
      ],
      examInfo: {
        marks: "15-20",
        topics: ["Dijkstra", "IP Addressing", "Subnetting"],
        questions: "Find shortest path, Calculate subnet masks"
      }
    },
    {
      title: "Transport Layer",
      description: "TCP/UDP protocols and connection management",
      icon: Clock,
      color: "from-orange-500 to-red-500",
      difficulty: "Intermediate",
      examWeight: "High",
      categories: [
        {
          name: "TCP Protocol Analysis",
          href: "/cn/protocols",
          description: "Connection establishment, flow control, congestion control",
          examTips: "Understand 3-way handshake and sliding window protocol"
        },
        {
          name: "UDP vs TCP Comparison",
          href: "/cn/protocols",
          description: "Protocol comparison with performance analysis",
          examTips: "Know when to use TCP vs UDP and their trade-offs"
        },
        {
          name: "Socket Programming",
          href: "/cn/protocols",
          description: "Client-server communication patterns",
          examTips: "Understand port numbers and socket API fundamentals"
        }
      ],
      applications: [
        "Web Applications",
        "Real-time Communication",
        "File Transfer Protocols"
      ],
      examInfo: {
        marks: "10-15",
        topics: ["TCP", "UDP", "Flow Control"],
        questions: "Explain TCP handshake, Compare TCP/UDP"
      }
    },
    {
      title: "Network Security",
      description: "Cryptography, authentication, and security protocols",
      icon: Shield,
      color: "from-red-500 to-pink-500",
      difficulty: "Advanced",
      examWeight: "Medium",
      categories: [
        {
          name: "Symmetric & Asymmetric Cryptography",
          href: "/cn/security",
          description: "DES, AES, RSA algorithms with interactive demonstrations",
          examTips: "Practice RSA key generation and encryption/decryption"
        },
        {
          name: "Digital Signatures & Certificates",
          href: "/cn/security",
          description: "PKI, certificate authorities, signature verification",
          examTips: "Understand hash functions and digital signature process"
        },
        {
          name: "Network Security Protocols",
          href: "/cn/security",
          description: "IPSec, SSL/TLS, VPN technologies",
          examTips: "Know protocol layers and security mechanisms"
        }
      ],
      applications: [
        "Secure Communication",
        "E-commerce Security",
        "VPN Technologies"
      ],
      examInfo: {
        marks: "10-12",
        topics: ["RSA", "Digital Signatures", "SSL/TLS"],
        questions: "Implement RSA, Explain PKI, Design secure protocols"
      }
    },
    {
      title: "Data Compression",
      description: "Compression algorithms and encoding techniques",
      icon: Cpu,
      color: "from-green-500 to-emerald-500",
      difficulty: "Intermediate",
      examWeight: "Medium",
      categories: [
        {
          name: "Huffman Coding",
          href: "/cn/compression",
          description: "Optimal prefix-free encoding algorithm",
          examTips: "Practice building Huffman trees and calculating compression ratios"
        },
        {
          name: "Run Length Encoding",
          href: "/cn/compression",
          description: "Simple lossless compression technique",
          examTips: "Understand when RLE is effective and its limitations"
        },
        {
          name: "LZW Compression",
          href: "/cn/compression",
          description: "Dictionary-based compression algorithm",
          examTips: "Master the dictionary building process in LZW"
        }
      ],
      applications: [
        "File Compression",
        "Image Processing",
        "Network Optimization"
      ],
      examInfo: {
        marks: "8-10",
        topics: ["Huffman", "RLE", "LZW"],
        questions: "Build Huffman tree, Calculate compression ratio"
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
              <Network className="h-4 w-4 mr-2" />
              Computer Networks
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Computer Networks
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                Simulator
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Master network protocols, routing algorithms, IP addressing, and security concepts 
              with interactive simulations designed for university examinations.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <span className="text-sm">Exam-Focused Content</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-sm">University Syllabus</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Users className="h-4 w-4 text-purple-400" />
                <span className="text-sm">Step-by-Step Solutions</span>
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
                    <BookOpen className="h-4 w-4 mr-2 text-blue-600" />
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

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Complete CN Algorithm Coverage
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From basic network protocols to advanced security algorithms, 
              master every concept with interactive tools and comprehensive explanations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">15+</h3>
              <p className="text-gray-600">Interactive Algorithms</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">5</h3>
              <p className="text-gray-600">Core Topics</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-100 rounded-xl">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">100%</h3>
              <p className="text-gray-600">Exam Coverage</p>
            </div>
          </div>
        </div>

        {/* Study Tips */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            📚 Study Tips for University CN Exam
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-yellow-700">
            <div>
              <h3 className="font-semibold mb-3">🎯 High Priority Topics</h3>
              <ul className="space-y-2 text-sm">
                <li>• Master IP addressing and subnetting calculations</li>
                <li>• Practice Dijkstra and Bellman-Ford algorithms</li>
                <li>• Understand TCP/UDP protocol differences</li>
                <li>• Learn RSA encryption/decryption steps</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">💡 Exam Strategies</h3>
              <ul className="space-y-2 text-sm">
                <li>• Focus on numerical problems and calculations</li>
                <li>• Practice drawing network diagrams and topologies</li>
                <li>• Memorize protocol stack layers and functions</li>
                <li>• Understand real-world applications of concepts</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
