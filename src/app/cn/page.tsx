"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Globe, Network, Shield, Clock, Cpu, Users, Play, Star, CheckCircle2, Award, BookOpen } from "lucide-react";

export default function ComputerNetworksPage() {
  const getTopicIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      Globe,
      Network,
      Shield,
      Clock,
      Cpu
    };
    return iconMap[iconName];
  };

  const topics = [
    {
      title: "Routing Algorithms",
      description: "Shortest path algorithms for network routing",
      icon: "Network",
      color: "from-blue-500 to-cyan-500",
      difficulty: "Intermediate",
      examWeight: "High",
      categories: [
        {
          name: "Dijkstra's Algorithm",
          href: "/cn/routing/dijkstra",
          description: "Find shortest path using greedy approach with priority queue",
          examTips: "Focus on step-by-step execution and time complexity O(V²) or O(V log V)"
        },
        {
          name: "Bellman-Ford Algorithm", 
          href: "/cn/routing/bellman-ford",
          description: "Handle negative weights and detect negative cycles",
          examTips: "Understand relaxation process and negative cycle detection"
        },
        {
          name: "Distance Vector Routing",
          href: "/cn/routing/distance-vector",
          description: "Distributed routing using Bellman-Ford principle",
          examTips: "Know count-to-infinity problem and split horizon solution"
        }
      ],
      applications: [
        "Internet Routing Protocols (OSPF, RIP)",
        "Network Path Selection",
        "Traffic Engineering"
      ],
      examInfo: {
        marks: "15-20",
        topics: ["Shortest Path", "Routing Tables", "Network Topology"],
        questions: "Apply Dijkstra on given graph, Compare routing algorithms"
      }
    },
    {
      title: "IP Addressing & Subnetting",
      description: "IPv4/IPv6 addressing and subnet calculations",
      icon: "Globe",
      color: "from-green-500 to-emerald-500",
      difficulty: "Beginner",
      examWeight: "Very High",
      categories: [
        {
          name: "IP Address Calculator",
          href: "/cn/ip-addressing/calculator",
          description: "Calculate network, broadcast, and host addresses",
          examTips: "Master binary conversion and CIDR notation"
        },
        {
          name: "Subnetting Solver",
          href: "/cn/ip-addressing/subnetting",
          description: "Divide networks into smaller subnets efficiently",
          examTips: "Practice VLSM and subnet mask calculations"
        },
        {
          name: "IPv6 Addressing",
          href: "/cn/ip-addressing/ipv6",
          description: "IPv6 format, types and address configuration",
          examTips: "Understand IPv6 notation and address types"
        }
      ],
      applications: [
        "Network Design and Planning",
        "DHCP Configuration",
        "Network Security Implementation"
      ],
      examInfo: {
        marks: "10-15",
        topics: ["CIDR", "VLSM", "Address Classes"],
        questions: "Calculate subnet addresses, Find number of hosts"
      }
    },
    {
      title: "Data Compression",
      description: "Huffman encoding and compression techniques",
      icon: "Cpu",
      color: "from-purple-500 to-pink-500",
      difficulty: "Intermediate",
      examWeight: "Medium",
      categories: [
        {
          name: "Huffman Encoding",
          href: "/cn/compression/huffman",
          description: "Optimal prefix-free encoding for data compression",
          examTips: "Build Huffman tree and calculate compression ratio"
        },
        {
          name: "LZW Compression",
          href: "/cn/compression/lzw",
          description: "Dictionary-based compression algorithm",
          examTips: "Understand dictionary building and encoding process"
        },
        {
          name: "Run Length Encoding",
          href: "/cn/compression/rle",
          description: "Simple compression for repetitive data",
          examTips: "Calculate compression efficiency for different data types"
        }
      ],
      applications: [
        "File Compression (ZIP, RAR)",
        "Image Compression (JPEG)",
        "Network Data Optimization"
      ],
      examInfo: {
        marks: "10-12",
        topics: ["Huffman Tree", "Compression Ratio", "Entropy"],
        questions: "Build Huffman tree, Calculate average code length"
      }
    },
    {
      title: "Network Protocols",
      description: "TCP/IP, HTTP, and protocol analysis",
      icon: "Shield",
      color: "from-red-500 to-orange-500",
      difficulty: "Intermediate",
      examWeight: "High",
      categories: [
        {
          name: "TCP Flow Control",
          href: "/cn/protocols/tcp-flow",
          description: "Sliding window and congestion control mechanisms",
          examTips: "Understand window size calculations and timeout handling"
        },
        {
          name: "HTTP Protocol Analyzer",
          href: "/cn/protocols/http",
          description: "Request/response analysis and status codes",
          examTips: "Know HTTP methods, headers, and response codes"
        },
        {
          name: "DNS Resolution",
          href: "/cn/protocols/dns",
          description: "Domain name system hierarchy and resolution process",
          examTips: "Understand iterative vs recursive queries"
        }
      ],
      applications: [
        "Web Development",
        "Network Troubleshooting",
        "Performance Optimization"
      ],
      examInfo: {
        marks: "12-15",
        topics: ["Protocol Stack", "Header Analysis", "Flow Control"],
        questions: "Analyze protocol headers, Explain TCP handshake"
      }
    },
    {
      title: "Network Security",
      description: "Cryptography and network security algorithms",
      icon: "Shield",
      color: "from-indigo-500 to-purple-500",
      difficulty: "Advanced",
      examWeight: "Medium",
      categories: [
        {
          name: "RSA Encryption",
          href: "/cn/security/rsa",
          description: "Public key cryptography implementation",
          examTips: "Practice key generation and encryption/decryption steps"
        },
        {
          name: "DES Algorithm",
          href: "/cn/security/des",
          description: "Symmetric encryption with substitution and permutation",
          examTips: "Understand round function and key scheduling"
        },
        {
          name: "Digital Signatures",
          href: "/cn/security/digital-signature",
          description: "Authentication and non-repudiation mechanisms",
          examTips: "Know hash functions and signature verification process"
        }
      ],
      applications: [
        "Secure Communication",
        "Digital Certificates",
        "VPN Implementation"
      ],
      examInfo: {
        marks: "8-12",
        topics: ["Encryption", "Authentication", "Key Management"],
        questions: "Apply RSA algorithm, Explain security protocols"
      }
    }
  ];

  const learningPath = [
    { step: 1, title: "Start with IP Addressing", description: "Master basic networking concepts", duration: "2-3 hours" },
    { step: 2, title: "Learn Routing Algorithms", description: "Understand path finding in networks", duration: "3-4 hours" },
    { step: 3, title: "Study Network Protocols", description: "Explore TCP/IP and HTTP protocols", duration: "2-3 hours" },
    { step: 4, title: "Practice Data Compression", description: "Learn Huffman and other algorithms", duration: "2-3 hours" },
    { step: 5, title: "Explore Network Security", description: "Understand cryptographic algorithms", duration: "3-4 hours" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 text-blue-300 text-sm font-medium mb-6">
            <Globe className="h-4 w-4 mr-2" />
            Computer Networks
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Master Computer
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Networks
            </span>
          </h1>
          <p className="text-xl text-gray-200 max-w-4xl mx-auto mb-8">
            Comprehensive interactive tools for routing algorithms, IP addressing, network protocols, 
            and security concepts with step-by-step visualizations designed for engineering students.
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto mb-12">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">15+</div>
              <div className="text-sm text-gray-300">Interactive Tools</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">5</div>
              <div className="text-sm text-gray-300">Core Topics</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">100+</div>
              <div className="text-sm text-gray-300">Practice Problems</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">50+</div>
              <div className="text-sm text-gray-300">Exam Questions</div>
            </div>
          </div>
        </div>

        {/* Learning Path */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Recommended Learning Path</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Follow this structured approach to master computer networks concepts step by step.
            </p>
          </div>
          
          <div className="relative">
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
              {learningPath.map((item, index) => (
                <div key={index} className="relative">
                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 w-48 text-center hover:bg-gray-700 transition-colors">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm mx-auto mb-3">
                      {item.step}
                    </div>
                    <h3 className="font-semibold text-gray-200 text-sm mb-1">{item.title}</h3>
                    <p className="text-xs text-gray-300 mb-2">{item.description}</p>
                    <div className="text-xs text-blue-400 font-medium">{item.duration}</div>
                  </div>
                  {index < learningPath.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {topics.map((topic, index) => {
            const IconComponent = getTopicIcon(topic.icon);
            return (
              <div
                key={index}
                className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                {/* Topic Header */}
                <div className={`bg-gradient-to-r ${topic.color} p-6 text-white`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                      <IconComponent className="h-8 w-8" />
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-1">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm font-medium">{topic.examWeight}</span>
                      </div>
                      <div className="text-sm opacity-90">{topic.difficulty}</div>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{topic.title}</h3>
                  <p className="text-white/90 text-sm leading-relaxed mb-4">{topic.description}</p>
                  
                  {/* Exam Info */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                    <div className="text-xs font-medium mb-1">📝 Exam Pattern:</div>
                    <div className="text-xs opacity-90">{topic.examInfo.marks} marks • {topic.examInfo.questions}</div>
                  </div>
                </div>

                {/* Categories */}
                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    {topic.categories.map((category, catIndex) => (
                      <div key={catIndex} className="bg-gray-700 border border-gray-600 rounded-lg p-4 hover:bg-gray-600 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-200">{category.name}</h4>
                          {category.href && (
                            <Link href={category.href}>
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                <Play className="h-3 w-3 mr-1" />
                                Try
                              </Button>
                            </Link>
                          )}
                        </div>
                        <p className="text-gray-300 text-sm mb-3">{category.description}</p>
                        <div className="bg-yellow-800/20 border border-yellow-700/30 rounded p-2">
                          <div className="text-xs text-yellow-300 font-medium">💡 Exam Tip:</div>
                          <div className="text-xs text-yellow-200">{category.examTips}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Applications */}
                  <div className="border-t border-gray-700 pt-4">
                    <h4 className="font-semibold text-gray-200 text-sm mb-2">🔧 Real-world Applications</h4>
                    <ul className="text-gray-300 text-xs space-y-1">
                      {topic.applications.map((app, appIndex) => (
                        <li key={appIndex}>• {app}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Exam Preparation Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Exam Preparation Guide</h2>
            <p className="text-blue-100 max-w-2xl mx-auto">
              Master Computer Networks concepts with our comprehensive exam-focused approach covering all Mumbai University syllabus topics.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <BookOpen className="h-8 w-8 mb-4" />
              <h3 className="text-xl font-bold mb-3">Theory Concepts</h3>
              <ul className="space-y-2 text-sm text-blue-100">
                <li>• OSI and TCP/IP Models</li>
                <li>• Network Topologies</li>
                <li>• Error Detection & Correction</li>
                <li>• Flow Control Mechanisms</li>
              </ul>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <Cpu className="h-8 w-8 mb-4" />
              <h3 className="text-xl font-bold mb-3">Practical Skills</h3>
              <ul className="space-y-2 text-sm text-blue-100">
                <li>• IP Address Calculations</li>
                <li>• Routing Algorithm Implementation</li>
                <li>• Protocol Analysis</li>
                <li>• Network Security Applications</li>
              </ul>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <Award className="h-8 w-8 mb-4" />
              <h3 className="text-xl font-bold mb-3">Exam Strategy</h3>
              <ul className="space-y-2 text-sm text-blue-100">
                <li>• Practice numerical problems daily</li>
                <li>• Draw network diagrams clearly</li>
                <li>• Memorize protocol formats</li>
                <li>• Understand algorithm complexities</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Ready to Master Computer Networks?
            </h3>
            <p className="text-gray-600 mb-6">
              Start with IP addressing fundamentals and progress through advanced routing algorithms 
              with our step-by-step interactive simulators.
            </p>
            <Link
              href="/cn/ip-addressing/calculator"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all duration-200 group"
            >
              Start with IP Addressing
              <Play className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
