"use client";

import Link from "next/link";
import { 
  Network, 
  Shield, 
  ArrowRight, 
  Play, 
  BookOpen, 
  Zap,
  Globe,
  Router,
  Server,
  ArrowLeft
} from "lucide-react";

export default function TransportLayerPage() {
  const topics = [
    {
      id: "tcp",
      title: "TCP (Transmission Control Protocol)",
      description: "Reliable, connection-oriented transport protocol",
      icon: Shield,
      difficulty: "Medium",
      subtopics: [
        "TCP Header Structure",
        "Connection Management (3-way handshake)",
        "Flow Control",
        "Congestion Control",
        "Error Recovery"
      ],
      practicalUse: "Web browsing, email, file transfer",
      tools: ["TCP Flow Simulator", "Handshake Visualizer"]
    },
    {
      id: "udp",
      title: "UDP (User Datagram Protocol)",
      description: "Simple, connectionless transport protocol",
      icon: Zap,
      difficulty: "Easy",
      subtopics: [
        "UDP Header Structure",
        "Connectionless Communication",
        "UDP vs TCP Comparison",
        "Use Cases and Applications"
      ],
      practicalUse: "DNS, DHCP, video streaming, gaming",
      tools: ["UDP Packet Analyzer", "Performance Comparator"]
    },
    {
      id: "congestion-control",
      title: "Congestion Control",
      description: "Managing network congestion and traffic flow",
      icon: Router,
      difficulty: "Hard",
      subtopics: [
        "TCP Congestion Control Algorithms",
        "Slow Start and Congestion Avoidance",
        "Fast Retransmit and Fast Recovery",
        "AIMD (Additive Increase Multiplicative Decrease)",
        "Modern Algorithms (BBR, CUBIC)"
      ],
      practicalUse: "Internet traffic management, QoS",
      tools: ["Congestion Simulator", "Algorithm Comparator"]
    },
    {
      id: "flow-control",
      title: "Flow Control",
      description: "Managing data flow between sender and receiver",
      icon: Network,
      difficulty: "Medium",
      subtopics: [
        "Sliding Window Protocol",
        "Stop-and-Wait ARQ",
        "Go-Back-N ARQ",
        "Selective Repeat ARQ",
        "Window Size Management"
      ],
      practicalUse: "Reliable data transmission",
      tools: ["Flow Control Simulator", "Protocol Visualizer"]
    },
    {
      id: "reliability",
      title: "Reliability Mechanisms",
      description: "Ensuring reliable data delivery over unreliable networks",
      icon: Server,
      difficulty: "Medium",
      subtopics: [
        "Error Detection and Correction",
        "Acknowledgments and Timeouts",
        "Retransmission Strategies",
        "Duplicate Detection",
        "Checksum Calculations"
      ],
      practicalUse: "Data integrity assurance",
      tools: ["Reliability Tester", "Error Simulator"]
    },
    {
      id: "socket-programming",
      title: "Socket Programming",
      description: "Programming interfaces for network communication",
      icon: Globe,
      difficulty: "Hard",
      subtopics: [
        "TCP Sockets",
        "UDP Sockets",
        "Client-Server Architecture",
        "Blocking vs Non-blocking I/O",
        "Multiplexing (select, poll, epoll)"
      ],
      practicalUse: "Network application development",
      tools: ["Socket Code Generator", "Connection Tester"]
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Hard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/cn" className="inline-flex items-center text-blue-200 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Computer Networks
          </Link>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-white/20 p-3 rounded-xl">
              <Network className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Transport Layer</h1>
              <p className="text-blue-100 text-lg">Layer 4 - End-to-end communication and reliability</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold">6</div>
              <div className="text-sm text-blue-100">Topics Covered</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold">TCP/UDP</div>
              <div className="text-sm text-blue-100">Core Protocols</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold">Reliable</div>
              <div className="text-sm text-blue-100">Data Delivery</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold">Layer 4</div>
              <div className="text-sm text-blue-100">OSI Model</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {topics.map((topic) => {
            const IconComponent = topic.icon;
            return (
              <div key={topic.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(topic.difficulty)}`}>
                      {topic.difficulty}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{topic.title}</h3>
                  <p className="text-gray-600 mb-4">{topic.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Key Topics:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {topic.subtopics.slice(0, 3).map((subtopic, index) => (
                        <li key={index}>• {subtopic}</li>
                      ))}
                      {topic.subtopics.length > 3 && (
                        <li className="text-blue-600">• +{topic.subtopics.length - 3} more topics</li>
                      )}
                    </ul>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Used in:</span> {topic.practicalUse}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Link 
                      href={`/cn/transport-layer/${topic.id}`}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <BookOpen className="h-4 w-4" />
                      <span>Learn</span>
                    </Link>
                    <button className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1">
                      <Play className="h-4 w-4" />
                      <span>Demo</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Overview Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Transport Layer Overview</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Key Functions</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <div className="bg-blue-100 p-1 rounded-full mr-3 mt-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <div>
                    <span className="font-medium">End-to-End Communication:</span> Provides communication between application processes
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-100 p-1 rounded-full mr-3 mt-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <div>
                    <span className="font-medium">Reliability:</span> Ensures data is delivered accurately and in order
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-100 p-1 rounded-full mr-3 mt-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <div>
                    <span className="font-medium">Flow Control:</span> Manages the rate of data transmission
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-100 p-1 rounded-full mr-3 mt-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <div>
                    <span className="font-medium">Multiplexing:</span> Allows multiple applications to use the network simultaneously
                  </div>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Protocol Comparison</h3>
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-3 py-2 text-left">Feature</th>
                      <th className="border border-gray-300 px-3 py-2 text-left">TCP</th>
                      <th className="border border-gray-300 px-3 py-2 text-left">UDP</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 font-medium">Connection</td>
                      <td className="border border-gray-300 px-3 py-2">Connection-oriented</td>
                      <td className="border border-gray-300 px-3 py-2">Connectionless</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-3 py-2 font-medium">Reliability</td>
                      <td className="border border-gray-300 px-3 py-2">Reliable</td>
                      <td className="border border-gray-300 px-3 py-2">Unreliable</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 font-medium">Speed</td>
                      <td className="border border-gray-300 px-3 py-2">Slower</td>
                      <td className="border border-gray-300 px-3 py-2">Faster</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-3 py-2 font-medium">Header Size</td>
                      <td className="border border-gray-300 px-3 py-2">20+ bytes</td>
                      <td className="border border-gray-300 px-3 py-2">8 bytes</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/cn/network-layer" className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <ArrowLeft className="h-5 w-5 text-gray-600 mr-3" />
              <div>
                <div className="font-medium text-gray-800">Network Layer</div>
                <div className="text-sm text-gray-600">Previous layer</div>
              </div>
            </Link>
            <Link href="/cn/application-layer" className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <ArrowRight className="h-5 w-5 text-gray-600 mr-3" />
              <div>
                <div className="font-medium text-gray-800">Application Layer</div>
                <div className="text-sm text-gray-600">Next layer</div>
              </div>
            </Link>
            <Link href="/cn" className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <Network className="h-5 w-5 text-blue-600 mr-3" />
              <div>
                <div className="font-medium text-blue-800">All Topics</div>
                <div className="text-sm text-blue-600">Back to overview</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
