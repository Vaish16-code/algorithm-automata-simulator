"use client";

import Link from "next/link";
import { Globe, Network, Shield, Clock, Cpu, Users, Play, Star, CheckCircle2, Award, BookOpen, MessageSquare } from "lucide-react";

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
        {/* Replace with actual AdSense code */}
        <div className="text-xs text-gray-400 mt-1">
          {format === "horizontal" ? "728x90" : format === "vertical" ? "160x600" : "300x250"}
        </div>
      </div>
    </div>
  );
};

const SponsoredContent = () => {
  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border-l-4 border-purple-400">
      <div className="flex items-center mb-3">
        <div className="bg-purple-100 p-2 rounded-full mr-3">
          <Star className="h-5 w-5 text-purple-600" />
        </div>
        <div>
          <h3 className="font-semibold text-purple-900">Sponsored: Ace Your CS Interviews</h3>
          <p className="text-sm text-purple-600">Learn algorithms that top tech companies ask</p>
        </div>
      </div>
      <div className="text-sm text-purple-700 mb-3">
        Master data structures and algorithms with our comprehensive course designed for FAANG interviews.
      </div>
      <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
        Learn More →
      </button>
    </div>
  );
};

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
          href: "/cn/introduction",
          description: "Network types, topology, and applications overview",
          examTips: "Understand different network types: LAN, WAN, MAN and their characteristics"
        },
        {
          name: "OSI & TCP/IP Models",
          href: "/cn/introduction",
          description: "Protocol stack comparison and layer functions",
          examTips: "Memorize all 7 OSI layers and TCP/IP 4-layer model functions"
        },
        {
          name: "Performance Metrics",
          href: "/cn/introduction",
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
          href: "/cn/network-layer",
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
          href: "/cn/transport-layer",
          description: "Connection establishment, flow control, congestion control",
          examTips: "Understand 3-way handshake and sliding window protocol"
        },
        {
          name: "UDP vs TCP Comparison",
          href: "/cn/transport-layer",
          description: "Protocol comparison with performance analysis",
          examTips: "Know when to use TCP vs UDP and their trade-offs"
        },
        {
          name: "Socket Programming",
          href: "/cn/transport-layer",
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
              with interactive simulations designed for Mumbai University examinations.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <span className="text-sm">Exam-Focused Content</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-sm">Mumbai University Syllabus</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Users className="h-4 w-4 text-purple-400" />
                <span className="text-sm">Step-by-Step Solutions</span>
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

        {/* Mid-Content Sponsored Section */}
        <div className="mb-16">
          <SponsoredContent />
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
          {/* Main Study Tips Content */}
          <div className="lg:col-span-3">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                📚 Study Tips for Mumbai University CN Exam
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
            📖 Complete Computer Networks Course
          </h2>
          <p className="text-lg text-gray-600 text-center mb-8 max-w-3xl mx-auto">
            Master every aspect of computer networks with our comprehensive, Mumbai University aligned curriculum.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Physical Layer */}
            <Link href="/cn/physical-layer" className="group block p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border-2 border-orange-200 hover:border-orange-400 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center mb-3">
                <div className="bg-orange-500 p-2 rounded-lg mr-3">
                  <Network className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-orange-900">Physical Layer</h3>
              </div>
              <p className="text-sm text-orange-700 mb-3">Transmission media, encoding, multiplexing</p>
              <div className="text-xs text-orange-600 font-medium">
                💡 Media types, signal encoding, bandwidth calculations
              </div>
            </Link>

            {/* Data Link Layer */}
            <Link href="/cn/data-link-layer" className="group block p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center mb-3">
                <div className="bg-blue-500 p-2 rounded-lg mr-3">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-blue-900">Data Link Layer</h3>
              </div>
              <p className="text-sm text-blue-700 mb-3">Error detection, flow control, MAC protocols</p>
              <div className="text-xs text-blue-600 font-medium">
                💡 CRC, HDLC, Ethernet, CSMA/CD
              </div>
            </Link>

            {/* Medium Access Control */}
            <Link href="/cn/medium-access-control" className="group block p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-400 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center mb-3">
                <div className="bg-purple-500 p-2 rounded-lg mr-3">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-purple-900">MAC Protocols</h3>
              </div>
              <p className="text-sm text-purple-700 mb-3">ALOHA, CSMA, Token Ring protocols</p>
              <div className="text-xs text-purple-600 font-medium">
                💡 Collision detection, efficiency analysis
              </div>
            </Link>

            {/* Network Layer */}
            <Link href="/cn/network-layer" className="group block p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 hover:border-green-400 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center mb-3">
                <div className="bg-green-500 p-2 rounded-lg mr-3">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-green-900">Network Layer</h3>
              </div>
              <p className="text-sm text-green-700 mb-3">IP addressing, routing, ICMP</p>
              <div className="text-xs text-green-600 font-medium">
                💡 Subnetting, NAT, routing algorithms
              </div>
            </Link>

            {/* Transport Layer */}
            <Link href="/cn/transport-layer" className="group block p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200 hover:border-yellow-400 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center mb-3">
                <div className="bg-yellow-500 p-2 rounded-lg mr-3">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-yellow-900">Transport Layer</h3>
              </div>
              <p className="text-sm text-yellow-700 mb-3">TCP, UDP, flow control, congestion control</p>
              <div className="text-xs text-yellow-600 font-medium">
                💡 3-way handshake, sliding window
              </div>
            </Link>

            {/* Network Security */}
            <Link href="/cn/security" className="group block p-6 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border-2 border-red-200 hover:border-red-400 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center mb-3">
                <div className="bg-red-500 p-2 rounded-lg mr-3">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-red-900">Network Security</h3>
              </div>
              <p className="text-sm text-red-700 mb-3">Cryptography, authentication, SSL/TLS</p>
              <div className="text-xs text-red-600 font-medium">
                💡 RSA, DES, digital signatures, PKI
              </div>
            </Link>

            {/* Data Compression */}
            <Link href="/cn/compression" className="group block p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border-2 border-indigo-200 hover:border-indigo-400 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center mb-3">
                <div className="bg-indigo-500 p-2 rounded-lg mr-3">
                  <Cpu className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-indigo-900">Data Compression</h3>
              </div>
              <p className="text-sm text-indigo-700 mb-3">Huffman coding, RLE, LZW algorithms</p>
              <div className="text-xs text-indigo-600 font-medium">
                💡 Compression ratios, tree construction
              </div>
            </Link>

            {/* IP Addressing */}
            <Link href="/cn/ip-addressing" className="group block p-6 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border-2 border-teal-200 hover:border-teal-400 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center mb-3">
                <div className="bg-teal-500 p-2 rounded-lg mr-3">
                  <Network className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-teal-900">IP Addressing</h3>
              </div>
              <p className="text-sm text-teal-700 mb-3">Subnetting, CIDR, VLSM calculations</p>
              <div className="text-xs text-teal-600 font-medium">
                💡 Binary conversion, subnet masks
              </div>
            </Link>

            {/* Routing Algorithms */}
            <Link href="/cn/routing" className="group block p-6 bg-gradient-to-br from-rose-50 to-red-50 rounded-xl border-2 border-rose-200 hover:border-rose-400 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center mb-3">
                <div className="bg-rose-500 p-2 rounded-lg mr-3">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-rose-900">Routing Algorithms</h3>
              </div>
              <p className="text-sm text-rose-700 mb-3">Dijkstra, Bellman-Ford, distance vector</p>
              <div className="text-xs text-rose-600 font-medium">
                💡 Shortest path, convergence analysis
              </div>
            </Link>
          </div>
          
          <div className="mt-8 text-center">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium">
              <BookOpen className="h-5 w-5 mr-2" />
              Complete course covers 100% Mumbai University syllabus
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
              Need Help with Computer Networks?
            </h2>
            <p className="text-indigo-700 mb-6 max-w-2xl mx-auto">
              Stuck on a specific algorithm or need clarification on network concepts? 
              Our team is here to help you succeed in your Mumbai University exams.
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

        {/* Bottom Ad Section */}
        <div className="mb-8">
          <AdBanner slot="bottom-banner" format="horizontal" />
        </div>

        {/* Advertisement Banners */}
        <div className="mt-16">
          <AdBanner slot="top-banner" format="horizontal" />
        </div>

        {/* Sponsored Content */}
        <div className="mt-8">
          <SponsoredContent />
        </div>

        <div className="mt-8">
          <AdBanner slot="sidebar-banner" format="vertical" />
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
    </div>
  );
}
