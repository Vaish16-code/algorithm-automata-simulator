"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Globe, Network, Users, Building, Wifi, Monitor } from "lucide-react";

export default function IntroductionPage() {
  const [selectedTopic, setSelectedTopic] = useState("architecture");

  const topics = [
    {
      id: "architecture",
      title: "Network Architecture",
      icon: Building,
      description: "Network types, topology, and basic concepts",
      content: {
        networkTypes: [
          {
            type: "LAN (Local Area Network)",
            range: "Up to 1 km",
            examples: "Office, Home networks",
            characteristics: "High speed, low cost, private ownership"
          },
          {
            type: "MAN (Metropolitan Area Network)",
            range: "Up to 100 km",
            examples: "City-wide networks, Cable TV",
            characteristics: "Medium speed, moderate cost, may be public/private"
          },
          {
            type: "WAN (Wide Area Network)",
            range: "Country/Continent",
            examples: "Internet, Corporate networks",
            characteristics: "Lower speed, high cost, often public"
          }
        ],
        topologies: [
          {
            name: "Bus Topology",
            description: "All nodes connected to a single cable",
            advantages: "Simple, cost-effective",
            disadvantages: "Single point of failure, collision domain"
          },
          {
            name: "Star Topology",
            description: "All nodes connected to central hub/switch",
            advantages: "Easy troubleshooting, no collision",
            disadvantages: "Central point failure, more cable required"
          },
          {
            name: "Ring Topology",
            description: "Nodes connected in circular fashion",
            advantages: "No collision, equal access",
            disadvantages: "Difficult troubleshooting, node failure affects network"
          },
          {
            name: "Mesh Topology",
            description: "Every node connected to every other node",
            advantages: "Highly fault tolerant, multiple paths",
            disadvantages: "Expensive, complex wiring"
          }
        ]
      }
    },
    {
      id: "models",
      title: "Network Models",
      icon: Network,
      description: "OSI and TCP/IP protocol stack comparison",
      content: {
        osiModel: [
          {
            layer: 7,
            name: "Application Layer",
            function: "Network services to applications",
            protocols: "HTTP, FTP, SMTP, DNS",
            examples: "Web browsers, email clients"
          },
          {
            layer: 6,
            name: "Presentation Layer",
            function: "Data translation, encryption, compression",
            protocols: "SSL/TLS, JPEG, MPEG",
            examples: "Data encryption, file compression"
          },
          {
            layer: 5,
            name: "Session Layer",
            function: "Establishes, manages sessions",
            protocols: "NetBIOS, RPC, SQL",
            examples: "Database sessions, remote procedure calls"
          },
          {
            layer: 4,
            name: "Transport Layer",
            function: "Reliable data transfer, flow control",
            protocols: "TCP, UDP",
            examples: "Segmentation, error recovery"
          },
          {
            layer: 3,
            name: "Network Layer",
            function: "Routing, logical addressing",
            protocols: "IP, ICMP, OSPF, BGP",
            examples: "Router operations, path determination"
          },
          {
            layer: 2,
            name: "Data Link Layer",
            function: "Frame formatting, error detection",
            protocols: "Ethernet, Wi-Fi, PPP",
            examples: "Switch operations, MAC addressing"
          },
          {
            layer: 1,
            name: "Physical Layer",
            function: "Transmission of raw bits",
            protocols: "Ethernet, USB, Bluetooth",
            examples: "Cables, hubs, repeaters"
          }
        ],
        tcpipModel: [
          {
            layer: 4,
            name: "Application Layer",
            function: "Combines OSI layers 5-7",
            protocols: "HTTP, FTP, SMTP, DNS, DHCP"
          },
          {
            layer: 3,
            name: "Transport Layer",
            function: "End-to-end communication",
            protocols: "TCP, UDP"
          },
          {
            layer: 2,
            name: "Internet Layer",
            function: "Routing and logical addressing",
            protocols: "IP, ICMP, ARP"
          },
          {
            layer: 1,
            name: "Network Access Layer",
            function: "Combines OSI layers 1-2",
            protocols: "Ethernet, Wi-Fi, PPP"
          }
        ]
      }
    },
    {
      id: "performance",
      title: "Network Performance",
      icon: Monitor,
      description: "Bandwidth, latency, and throughput calculations",
      content: {
        metrics: [
          {
            term: "Bandwidth",
            definition: "Maximum data transfer rate of a network path",
            unit: "bits per second (bps)",
            example: "100 Mbps Ethernet connection"
          },
          {
            term: "Latency",
            definition: "Time delay for data to travel from source to destination",
            unit: "milliseconds (ms)",
            example: "Round-trip time (RTT) of 50ms"
          },
          {
            term: "Throughput",
            definition: "Actual data transfer rate achieved",
            unit: "bits per second (bps)",
            example: "80 Mbps actual speed on 100 Mbps link"
          },
          {
            term: "Bandwidth-Delay Product",
            definition: "Amount of data in transit on network",
            unit: "bits",
            example: "BDP = Bandwidth × Round-trip time"
          }
        ],
        calculations: [
          {
            problem: "Calculate transmission time for 1MB file over 10 Mbps link",
            solution: "Time = File size / Bandwidth = 8 Mbits / 10 Mbps = 0.8 seconds",
            steps: [
              "Convert file size: 1 MB = 8 Mbits",
              "Apply formula: Time = Data / Rate",
              "Calculate: 8 / 10 = 0.8 seconds"
            ]
          },
          {
            problem: "Find utilization if 60 Mbps achieved on 100 Mbps link",
            solution: "Utilization = Throughput / Bandwidth = 60/100 = 60%",
            steps: [
              "Identify actual throughput: 60 Mbps",
              "Identify available bandwidth: 100 Mbps",
              "Calculate: (60/100) × 100% = 60%"
            ]
          }
        ]
      }
    }
  ];

  const selectedTopicData = topics.find(t => t.id === selectedTopic);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/cn" className="inline-flex items-center text-green-200 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Computer Networks
          </Link>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-white/20 p-3 rounded-xl">
              <Globe className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Introduction to Networking</h1>
              <p className="text-green-100 text-lg">Network fundamentals, architecture, and performance metrics</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Key Concepts</h3>
              <p className="text-sm text-green-100">Network types, topologies, protocol models, performance metrics</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Applications</h3>
              <p className="text-sm text-green-100">Network design, protocol analysis, performance evaluation</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Exam Focus</h3>
              <p className="text-sm text-green-100">OSI vs TCP/IP, network calculations, topology comparison</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Topic Navigation */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Topics Overview</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {topics.map((topic) => {
              const IconComponent = topic.icon;
              return (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedTopic === topic.id 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="h-8 w-8 text-green-600 mb-3" />
                  <h3 className="font-semibold text-gray-800 mb-2">{topic.title}</h3>
                  <p className="text-sm text-gray-600">{topic.description}</p>
                </button>
              );
            })}
          </div>

          {/* Selected Topic Content */}
          {selectedTopicData && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                {selectedTopicData.title} Details
              </h3>
              
              {selectedTopic === "architecture" && (
                <div className="space-y-8">
                  {/* Network Types */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Network Types</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2 text-left">Network Type</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Range</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Examples</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Characteristics</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedTopicData.content.networkTypes?.map((network, index) => (
                            <tr key={index}>
                              <td className="border border-gray-300 px-4 py-2 font-medium">{network.type}</td>
                              <td className="border border-gray-300 px-4 py-2">{network.range}</td>
                              <td className="border border-gray-300 px-4 py-2">{network.examples}</td>
                              <td className="border border-gray-300 px-4 py-2">{network.characteristics}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Network Topologies */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Network Topologies</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedTopicData.content.topologies?.map((topology, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                          <h5 className="font-semibold text-green-700 mb-2">{topology.name}</h5>
                          <p className="text-sm text-gray-600 mb-3">{topology.description}</p>
                          <div className="space-y-2">
                            <div className="text-xs">
                              <span className="font-medium text-green-600">Advantages:</span> {topology.advantages}
                            </div>
                            <div className="text-xs">
                              <span className="font-medium text-red-600">Disadvantages:</span> {topology.disadvantages}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {selectedTopic === "models" && (
                <div className="space-y-8">
                  {/* OSI Model */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">OSI 7-Layer Model</h4>
                    <div className="space-y-2">
                      {selectedTopicData.content.osiModel?.map((layer, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-semibold text-blue-700">
                              Layer {layer.layer}: {layer.name}
                            </h5>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{layer.function}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div>
                              <span className="font-medium">Protocols:</span> {layer.protocols}
                            </div>
                            <div>
                              <span className="font-medium">Examples:</span> {layer.examples}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* TCP/IP Model */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">TCP/IP 4-Layer Model</h4>
                    <div className="space-y-2">
                      {selectedTopicData.content.tcpipModel?.map((layer, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                          <h5 className="font-semibold text-green-700 mb-2">
                            Layer {layer.layer}: {layer.name}
                          </h5>
                          <p className="text-sm text-gray-600 mb-2">{layer.function}</p>
                          <div className="text-xs">
                            <span className="font-medium">Protocols:</span> {layer.protocols}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {selectedTopic === "performance" && (
                <div className="space-y-8">
                  {/* Performance Metrics */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Performance Metrics</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedTopicData.content.metrics?.map((metric, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                          <h5 className="font-semibold text-purple-700 mb-2">{metric.term}</h5>
                          <p className="text-sm text-gray-600 mb-2">{metric.definition}</p>
                          <div className="space-y-1 text-xs">
                            <div><span className="font-medium">Unit:</span> {metric.unit}</div>
                            <div><span className="font-medium">Example:</span> {metric.example}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sample Calculations */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Sample Calculations</h4>
                    <div className="space-y-4">
                      {selectedTopicData.content.calculations?.map((calc, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                          <h5 className="font-semibold text-blue-700 mb-2">Problem {index + 1}</h5>
                          <p className="text-sm text-gray-800 mb-3">{calc.problem}</p>
                          <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3">
                            <div className="text-sm font-medium text-blue-800">Solution:</div>
                            <div className="text-sm text-blue-700">{calc.solution}</div>
                          </div>
                          <div>
                            <div className="text-xs font-medium text-gray-700 mb-1">Steps:</div>
                            <ol className="text-xs text-gray-600 space-y-1">
                              {calc.steps.map((step, stepIndex) => (
                                <li key={stepIndex}>{stepIndex + 1}. {step}</li>
                              ))}
                            </ol>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Exam Tips */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">📝 Exam Preparation Tips</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-3">Key Topics to Remember</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Memorize all 7 OSI layers and their functions</li>
                <li>• Compare OSI vs TCP/IP models</li>
                <li>• Understand network topology advantages/disadvantages</li>
                <li>• Practice bandwidth and latency calculations</li>
                <li>• Know network types and their characteristics</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-3">Common Exam Questions</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• "Compare OSI and TCP/IP models" (5 marks)</li>
                <li>• "Calculate transmission time for given data" (3 marks)</li>
                <li>• "Draw and explain star topology" (4 marks)</li>
                <li>• "Differentiate between LAN, MAN, and WAN" (6 marks)</li>
                <li>• "Explain functions of each OSI layer" (7 marks)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
