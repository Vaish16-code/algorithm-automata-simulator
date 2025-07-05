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
      title: "Introduction to Networking",
      description: "Network fundamentals, applications, and architecture",
      icon: "Globe",
      color: "from-green-500 to-emerald-500",
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
        topics: ["Network Types", "OSI Model", "TCP/IP Model"],
        questions: "Compare OSI vs TCP/IP, Calculate network performance metrics"
      }
    },
    {
      title: "Physical Layer",
      description: "Transmission media and communication fundamentals",
      icon: "Cpu",
      color: "from-orange-500 to-red-500",
      difficulty: "Intermediate",
      examWeight: "Medium",
      categories: [
        {
          name: "Transmission Media",
          href: "/cn/physical-layer",
          description: "Guided and unguided transmission media characteristics",
          examTips: "Know properties of copper, fiber optic, and wireless media"
        },
        {
          name: "Signal Encoding",
          href: "/cn/physical-layer",
          description: "Digital and analog signal encoding techniques",
          examTips: "Understand NRZ, Manchester, and differential encoding"
        },
        {
          name: "Multiplexing Techniques",
          href: "/cn/physical-layer",
          description: "FDM, TDM, and WDM techniques",
          examTips: "Calculate channel capacity and multiplexing efficiency"
        }
      ],
      applications: [
        "Cable and Wireless Networks",
        "Telecommunication Systems",
        "Data Center Connectivity"
      ],
      examInfo: {
        marks: "8-12",
        topics: ["Transmission Media", "Signal Encoding", "Multiplexing"],
        questions: "Compare transmission media, Analyze encoding schemes"
      }
    },
    {
      title: "Data Link Layer",
      description: "Error detection, correction, and framing techniques",
      icon: "Shield",
      color: "from-blue-500 to-cyan-500",
      difficulty: "Intermediate",
      examWeight: "High",
      categories: [
        {
          name: "Error Detection & CRC",
          href: "/cn/data-link-layer",
          description: "Parity, CRC, and checksum algorithms with interactive tools",
          examTips: "Practice CRC division and polynomial calculations"
        },
        {
          name: "Error Correction & Hamming",
          href: "/cn/data-link-layer",
          description: "Hamming code and forward error correction with simulator",
          examTips: "Master Hamming code encoding and single-bit error correction"
        },
        {
          name: "Flow Control Protocols",
          href: "/cn/data-link-layer",
          description: "Stop-and-wait, sliding window protocols",
          examTips: "Understand window size and sequence number calculations"
        }
      ],
      applications: [
        "Ethernet and Wi-Fi Networks",
        "Error-Prone Communication",
        "Reliable Data Transfer"
      ],
      examInfo: {
        marks: "12-18",
        topics: ["CRC", "Hamming Code", "Sliding Window"],
        questions: "Calculate CRC remainder, Design Hamming code"
      }
    },
    {
      title: "Medium Access Control",
      description: "Channel access methods and collision protocols",
      icon: "Network",
      color: "from-purple-500 to-pink-500",
      difficulty: "Intermediate",
      examWeight: "Medium",
      categories: [
        {
          name: "ALOHA Protocols",
          href: "/cn/medium-access-control",
          description: "Pure and Slotted ALOHA performance analysis with simulator",
          examTips: "Calculate throughput and efficiency for ALOHA variants"
        },
        {
          name: "CSMA/CD Protocols",
          href: "/cn/medium-access-control",
          description: "Carrier sense multiple access with collision detection",
          examTips: "Understand CSMA/CD operation and binary exponential backoff"
        },
        {
          name: "Token Ring Protocol",
          href: "/cn/medium-access-control",
          description: "Token passing protocol and ring topology",
          examTips: "Know token passing mechanism and ring maintenance"
        }
      ],
      applications: [
        "Ethernet Networks",
        "Wireless LANs",
        "Token Ring Networks"
      ],
      examInfo: {
        marks: "8-12",
        topics: ["ALOHA", "CSMA/CD", "Token Passing"],
        questions: "Calculate ALOHA throughput, Explain CSMA operation"
      }
    },
    {
      title: "Network Layer",
      description: "Routing algorithms and IP addressing",
      icon: "Network",
      color: "from-blue-500 to-cyan-500",
      difficulty: "Intermediate",
      examWeight: "Very High",
      categories: [
        {
          name: "Routing Algorithms",
          href: "/cn/network-layer",
          description: "Dijkstra's shortest path and distance vector routing",
          examTips: "Focus on step-by-step execution and time complexity O(V²) or O(V log V)"
        },
        {
          name: "IP Addressing & Subnetting",
          href: "/cn/network-layer/ip-addressing",
          description: "IPv4/IPv6 addressing and subnet calculations with calculator",
          examTips: "Master binary conversion and CIDR notation"
        },
        {
          name: "Network Forwarding",
          href: "/cn/network-layer",
          description: "Packet forwarding and routing table operations",
          examTips: "Know count-to-infinity problem and split horizon solution"
        }
      ],
      applications: [
        "Internet Routing Protocols (OSPF, RIP)",
        "Network Path Selection",
        "IP Address Management"
      ],
      examInfo: {
        marks: "15-20",
        topics: ["Shortest Path", "Routing Tables", "IP Addressing"],
        questions: "Apply Dijkstra on given graph, Calculate subnet addresses"
      }
    },
    {
      title: "Transport Layer",
      description: "TCP/UDP protocols and connection management",
      icon: "Globe",
      color: "from-indigo-500 to-purple-500",
      difficulty: "Advanced",
      examWeight: "High",
      categories: [
        {
          name: "TCP Protocol & Flow Control",
          href: "/cn/transport-layer/tcp",
          description: "TCP connection management and flow control with simulator",
          examTips: "Understand 3-way handshake and window size calculations"
        },
        {
          name: "UDP Protocol",
          href: "/cn/transport-layer/udp",
          description: "Connectionless transport protocol with packet simulator",
          examTips: "Know UDP header structure and compare with TCP"
        },
        {
          name: "Reliability & Congestion",
          href: "/cn/transport-layer",
          description: "Congestion control and reliability mechanisms",
          examTips: "Understand congestion window dynamics and algorithms"
        }
      ],
      applications: [
        "Web Applications (HTTP)",
        "File Transfer (FTP)",
        "Real-time Communication"
      ],
      examInfo: {
        marks: "12-15",
        topics: ["TCP Protocol", "Flow Control", "Congestion Control"],
        questions: "Analyze TCP handshake, Calculate window sizes"
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
      title: "Network Security",
      description: "Cryptography and network security algorithms",
      icon: "Shield",
      color: "from-red-500 to-orange-500",
      difficulty: "Advanced",
      examWeight: "Medium",
      categories: [
        {
          name: "Cryptography Fundamentals",
          href: "/cn/security",
          description: "Symmetric/asymmetric encryption, RSA, hash functions",
          examTips: "Practice RSA key generation and encryption/decryption steps"
        },
        {
          name: "Network Security Protocols",
          href: "/cn/security",
          description: "SSL/TLS, VPNs, firewalls, and authentication",
          examTips: "Understand SSL handshake and firewall operations"
        },
        {
          name: "Security Threats & Defense",
          href: "/cn/security",
          description: "Common attacks, vulnerabilities, and countermeasures",
          examTips: "Know DoS, MITM attacks and defense strategies"
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
    { step: 1, title: "Introduction to Networking", description: "Learn network fundamentals, models, and performance", duration: "2-3 hours" },
    { step: 2, title: "Physical Layer", description: "Understand transmission media and signal encoding", duration: "2-3 hours" },
    { step: 3, title: "Data Link Layer", description: "Master error detection, CRC, and Hamming codes", duration: "3-4 hours" },
    { step: 4, title: "Medium Access Control", description: "Study ALOHA, CSMA/CD, and token protocols", duration: "2-3 hours" },
    { step: 5, title: "Network Layer", description: "Learn routing algorithms and IP addressing", duration: "3-4 hours" },
    { step: 6, title: "Transport Layer", description: "Explore TCP/UDP and connection management", duration: "3-4 hours" },
    { step: 7, title: "Network Security", description: "Understand cryptography and security protocols", duration: "2-3 hours" }
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
              <div className="text-2xl font-bold text-blue-400">25+</div>
              <div className="text-sm text-gray-300">Interactive Tools</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">15</div>
              <div className="text-sm text-gray-300">Core Topics</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">6</div>
              <div className="text-sm text-gray-300">Syllabus Modules</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">120+</div>
              <div className="text-sm text-gray-300">Exam Questions</div>
            </div>
          </div>          </div>

        {/* Quick Module Navigation */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Quick Module Access</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Jump directly to any module for focused learning
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Link href="/cn/introduction">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white p-4 h-auto flex flex-col items-center space-y-2">
                <Globe className="h-6 w-6" />
                <span className="text-xs font-medium">Introduction</span>
              </Button>
            </Link>
            <Link href="/cn/physical-layer">
              <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white p-4 h-auto flex flex-col items-center space-y-2">
                <Cpu className="h-6 w-6" />
                <span className="text-xs font-medium">Physical Layer</span>
              </Button>
            </Link>
            <Link href="/cn/data-link-layer">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 h-auto flex flex-col items-center space-y-2">
                <Shield className="h-6 w-6" />
                <span className="text-xs font-medium">Data Link</span>
              </Button>
            </Link>
            <Link href="/cn/medium-access-control">
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white p-4 h-auto flex flex-col items-center space-y-2">
                <Network className="h-6 w-6" />
                <span className="text-xs font-medium">MAC Layer</span>
              </Button>
            </Link>
            <Link href="/cn/network-layer">
              <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white p-4 h-auto flex flex-col items-center space-y-2">
                <Network className="h-6 w-6" />
                <span className="text-xs font-medium">Network Layer</span>
              </Button>
            </Link>
            <Link href="/cn/transport-layer">
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-4 h-auto flex flex-col items-center space-y-2">
                <Globe className="h-6 w-6" />
                <span className="text-xs font-medium">Transport</span>
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 max-w-md mx-auto">
            <Link href="/cn/security">
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white p-4 h-auto flex flex-col items-center space-y-2">
                <Shield className="h-6 w-6" />
                <span className="text-xs font-medium">Security</span>
              </Button>
            </Link>
            <Link href="/cn/compression">
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white p-4 h-auto flex flex-col items-center space-y-2">
                <Cpu className="h-6 w-6" />
                <span className="text-xs font-medium">Compression</span>
              </Button>
            </Link>
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
                <li>• OSI and TCP/IP Models (7 layers)</li>
                <li>• Network Topologies & Types</li>
                <li>• Error Detection & Correction (CRC, Hamming)</li>
                <li>• Flow Control & MAC Protocols</li>
                <li>• Routing Algorithms (Dijkstra)</li>
                <li>• TCP/UDP Protocol Operations</li>
                <li>• Security & Cryptography</li>
              </ul>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <Cpu className="h-8 w-8 mb-4" />
              <h3 className="text-xl font-bold mb-3">Interactive Tools</h3>
              <ul className="space-y-2 text-sm text-blue-100">
                <li>• IP Address & Subnet Calculator</li>
                <li>• CRC & Hamming Code Generators</li>
                <li>• TCP Flow Control Simulator</li>
                <li>• ALOHA Throughput Calculator</li>
                <li>• Dijkstra Algorithm Visualizer</li>
                <li>• RSA Encryption Tool</li>
                <li>• Network Performance Calculator</li>
              </ul>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <Award className="h-8 w-8 mb-4" />
              <h3 className="text-xl font-bold mb-3">Exam Strategy</h3>
              <ul className="space-y-2 text-sm text-blue-100">
                <li>• Practice numerical problems daily</li>
                <li>• Master CRC & Hamming calculations</li>
                <li>• Memorize all protocol headers</li>
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
