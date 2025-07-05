"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Network, Route, Globe, Play } from "lucide-react";

export default function NetworkLayerPage() {
  const [selectedTopic, setSelectedTopic] = useState("routing");

  const topics = [
    {
      id: "routing",
      title: "Routing Algorithms",
      icon: Route,
      description: "Shortest path and routing table algorithms",
      subtopics: [
        {
          name: "Dijkstra's Algorithm",
          href: "/cn/network-layer/dijkstra",
          description: "Find shortest path using greedy approach",
          complexity: "O(V²) or O(V log V)",
          interactive: true
        },
        {
          name: "Distance Vector Routing",
          href: "/cn/network-layer/distance-vector",
          description: "Distributed routing using Bellman-Ford",
          complexity: "O(VE)",
          interactive: false
        },
        {
          name: "Link State Routing",
          href: "/cn/network-layer/link-state",
          description: "OSPF protocol implementation",
          complexity: "O(V log V)",
          interactive: false
        }
      ]
    },
    {
      id: "addressing",
      title: "IP Addressing",
      icon: Globe,
      description: "IPv4/IPv6 addressing and subnetting",
      subtopics: [
        {
          name: "IP Address Calculator",
          href: "/cn/ip-addressing/calculator",
          description: "Calculate network and broadcast addresses",
          complexity: "O(1)",
          interactive: true
        },
        {
          name: "Subnetting",
          href: "/cn/network-layer/subnetting",
          description: "VLSM and subnet design",
          complexity: "O(1)",
          interactive: false
        },
        {
          name: "IPv6 Addressing",
          href: "/cn/network-layer/ipv6",
          description: "IPv6 format and address types",
          complexity: "O(1)",
          interactive: false
        }
      ]
    },
    {
      id: "forwarding",
      title: "Packet Forwarding",
      icon: Network,
      description: "Routing tables and forwarding decisions",
      subtopics: [
        {
          name: "Forwarding Table",
          href: "/cn/network-layer/forwarding",
          description: "Longest prefix matching",
          complexity: "O(log n)",
          interactive: false
        },
        {
          name: "NAT (Network Address Translation)",
          href: "/cn/network-layer/nat",
          description: "Private to public address mapping",
          complexity: "O(1)",
          interactive: false
        },
        {
          name: "DHCP Protocol",
          href: "/cn/network-layer/dhcp",
          description: "Dynamic IP address assignment",
          complexity: "O(1)",
          interactive: false
        }
      ]
    }
  ];

  const routingConcepts = [
    {
      concept: "Distance Vector Algorithm",
      description: "Each router maintains a table of distances to all destinations",
      formula: "D_x(y) = min_v{c(x,v) + D_v(y)}",
      properties: [
        "Distributed and iterative",
        "Uses Bellman-Ford equation",
        "Count-to-infinity problem",
        "Poisoned reverse solution"
      ],
      protocols: ["RIP (Routing Information Protocol)"]
    },
    {
      concept: "Link State Algorithm",
      description: "Each router has complete network topology information",
      formula: "Dijkstra's algorithm with network topology",
      properties: [
        "Global information required",
        "Faster convergence",
        "No count-to-infinity problem",
        "Higher memory requirements"
      ],
      protocols: ["OSPF (Open Shortest Path First)", "IS-IS"]
    },
    {
      concept: "Path Vector Algorithm",
      description: "Each router maintains the actual path to destinations",
      formula: "Path advertisement with loop detection",
      properties: [
        "Loop prevention by path inspection",
        "Policy-based routing support",
        "Slower convergence",
        "Used in inter-domain routing"
      ],
      protocols: ["BGP (Border Gateway Protocol)"]
    }
  ];

  const addressingConcepts = [
    {
      concept: "Classful Addressing",
      classes: [
        { class: "A", range: "0.0.0.0 - 127.255.255.255", mask: "/8", hosts: "16,777,214" },
        { class: "B", range: "128.0.0.0 - 191.255.255.255", mask: "/16", hosts: "65,534" },
        { class: "C", range: "192.0.0.0 - 223.255.255.255", mask: "/24", hosts: "254" },
        { class: "D", range: "224.0.0.0 - 239.255.255.255", mask: "Multicast", hosts: "N/A" },
        { class: "E", range: "240.0.0.0 - 255.255.255.255", mask: "Reserved", hosts: "N/A" }
      ]
    },
    {
      concept: "CIDR (Classless Inter-Domain Routing)",
      benefits: [
        "Reduces routing table size",
        "Eliminates class boundaries",
        "Allows route aggregation",
        "More efficient address allocation"
      ],
      notation: "Network address/prefix length (e.g., 192.168.1.0/24)"
    }
  ];

  const selectedTopicData = topics.find(t => t.id === selectedTopic);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-16">
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
              <h1 className="text-4xl font-bold">Network Layer</h1>
              <p className="text-blue-100 text-lg">Routing algorithms, IP addressing, and packet forwarding</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Key Concepts</h3>
              <p className="text-sm text-blue-100">Shortest path algorithms, IP subnetting, routing protocols</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Applications</h3>
              <p className="text-sm text-blue-100">Internet routing, network design, address management</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Exam Focus</h3>
              <p className="text-sm text-blue-100">Dijkstra algorithm, IP calculations, routing table analysis</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Topic Navigation */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Network Layer Topics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {topics.map((topic) => {
              const IconComponent = topic.icon;
              return (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedTopic === topic.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="h-8 w-8 text-blue-600 mb-3" />
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
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {selectedTopicData.subtopics.map((subtopic, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-blue-700">{subtopic.name}</h4>
                      <div className="flex items-center space-x-2">
                        {subtopic.interactive && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Interactive</span>
                        )}
                        {subtopic.href && (
                          <Link href={subtopic.href}>
                            <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 flex items-center">
                              <Play className="h-3 w-3 mr-1" />
                              Try
                            </button>
                          </Link>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{subtopic.description}</p>
                    <div className="text-xs text-gray-500">
                      <span className="font-medium">Complexity:</span> {subtopic.complexity}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Routing Algorithms Comparison */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Routing Algorithm Concepts</h2>
          
          <div className="space-y-6">
            {routingConcepts.map((concept, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-purple-700 mb-3">{concept.concept}</h3>
                <p className="text-sm text-gray-600 mb-4">{concept.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3">
                      <h4 className="font-medium text-blue-800 mb-1">Algorithm Formula:</h4>
                      <code className="text-sm text-blue-700">{concept.formula}</code>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Properties:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {concept.properties.map((prop, propIndex) => (
                          <li key={propIndex}>• {prop}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Protocols:</h4>
                    <div className="space-y-1">
                      {concept.protocols.map((protocol, protIndex) => (
                        <div key={protIndex} className="bg-green-50 border border-green-200 rounded p-2">
                          <span className="text-sm font-medium text-green-700">{protocol}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* IP Addressing */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">IP Addressing Concepts</h2>
          
          {/* Classful Addressing */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-green-700 mb-4">Classful Addressing</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Class</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">IP Range</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Default Mask</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Max Hosts</th>
                  </tr>
                </thead>
                <tbody>
                  {addressingConcepts[0]?.classes?.map((cls, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-4 py-2 font-medium">{cls.class}</td>
                      <td className="border border-gray-300 px-4 py-2">{cls.range}</td>
                      <td className="border border-gray-300 px-4 py-2">{cls.mask}</td>
                      <td className="border border-gray-300 px-4 py-2">{cls.hosts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CIDR */}
          <div>
            <h3 className="text-lg font-semibold text-orange-700 mb-4">CIDR (Classless Inter-Domain Routing)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-3">{addressingConcepts[1].notation}</p>
                <h4 className="font-medium text-gray-700 mb-2">Benefits:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {addressingConcepts[1]?.benefits?.map((benefit, index) => (
                    <li key={index}>• {benefit}</li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-orange-50 border border-orange-200 rounded p-3">
                <h4 className="font-medium text-orange-800 mb-2">CIDR Examples:</h4>
                <div className="text-sm text-orange-700 space-y-1">
                  <div><strong>192.168.1.0/24:</strong> 254 hosts</div>
                  <div><strong>10.0.0.0/8:</strong> 16,777,214 hosts</div>
                  <div><strong>172.16.0.0/12:</strong> 1,048,574 hosts</div>
                  <div><strong>192.168.1.128/25:</strong> 126 hosts</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sample Problems */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Sample Problems & Solutions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-3">Dijkstra Algorithm Problem</h3>
              <div className="text-sm text-yellow-700 space-y-2">
                <p><strong>Problem:</strong> Find shortest path from vertex 0 to all vertices in given graph.</p>
                <p><strong>Given:</strong> Graph with 5 vertices, edge weights: (0→1:4), (0→2:2), (1→2:1), (1→3:5), (2→3:8), (2→4:10), (3→4:2)</p>
                <p><strong>Solution:</strong> Apply Dijkstra's algorithm step by step</p>
                <div className="bg-white rounded p-2 mt-2">
                  <div className="text-xs">
                    <div>Step 1: Initialize distances: [0, ∞, ∞, ∞, ∞]</div>
                    <div>Step 2: Visit 0, update neighbors: [0, 4, 2, ∞, ∞]</div>
                    <div>Step 3: Visit 2, update neighbors: [0, 3, 2, 10, 12]</div>
                    <div>Step 4: Visit 1, update neighbors: [0, 3, 2, 8, 12]</div>
                    <div>Step 5: Visit 3, update neighbors: [0, 3, 2, 8, 10]</div>
                    <div>Final distances: [0, 3, 2, 8, 10]</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-3">IP Subnetting Problem</h3>
              <div className="text-sm text-blue-700 space-y-2">
                <p><strong>Problem:</strong> Subnet 192.168.1.0/24 into 4 equal subnets.</p>
                <p><strong>Solution:</strong></p>
                <div className="bg-white rounded p-2 mt-2">
                  <div className="text-xs space-y-1">
                    <div><strong>Original:</strong> 192.168.1.0/24 (256 addresses)</div>
                    <div><strong>Required:</strong> 4 subnets = 2² subnets</div>
                    <div><strong>New mask:</strong> /24 + 2 = /26</div>
                    <div><strong>Subnet 1:</strong> 192.168.1.0/26 (0-63)</div>
                    <div><strong>Subnet 2:</strong> 192.168.1.64/26 (64-127)</div>
                    <div><strong>Subnet 3:</strong> 192.168.1.128/26 (128-191)</div>
                    <div><strong>Subnet 4:</strong> 192.168.1.192/26 (192-255)</div>
                    <div><strong>Each subnet:</strong> 62 usable host addresses</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
