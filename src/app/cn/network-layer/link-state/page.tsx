"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Network, Globe, Info } from "lucide-react";

export default function LinkStatePage() {
  const [selectedTopic, setSelectedTopic] = useState("algorithm");

  const topics = [
    {
      id: "algorithm",
      title: "Link State Algorithm",
      icon: Network,
      description: "How OSPF and IS-IS work using Dijkstra's algorithm",
      content: {
        steps: [
          {
            step: 1,
            title: "Network Discovery",
            description: "Each router discovers its neighbors and link costs",
            details: "Routers send HELLO packets to identify neighbors and measure link costs"
          },
          {
            step: 2,
            title: "LSA Generation",
            description: "Create Link State Advertisements (LSAs)",
            details: "Each router creates LSA containing its neighbors and link costs"
          },
          {
            step: 3,
            title: "LSA Flooding",
            description: "Flood LSAs throughout the network",
            details: "LSAs are reliably flooded to all routers using sequence numbers"
          },
          {
            step: 4,
            title: "Topology Database",
            description: "Build complete network topology",
            details: "Each router builds identical link-state database of entire network"
          },
          {
            step: 5,
            title: "SPT Calculation",
            description: "Run Dijkstra's algorithm",
            details: "Calculate shortest path tree (SPT) from this router to all destinations"
          },
          {
            step: 6,
            title: "Routing Table",
            description: "Install routes in forwarding table",
            details: "Extract next-hop information from SPT for routing table"
          }
        ],
        comparison: [
          {
            aspect: "Information Shared",
            linkState: "Complete topology (LSAs)",
            distanceVector: "Distance vectors only"
          },
          {
            aspect: "Convergence Speed",
            linkState: "Fast (immediate flooding)",
            distanceVector: "Slow (iterative updates)"
          },
          {
            aspect: "Routing Loops",
            linkState: "No loops (complete topology)",
            distanceVector: "Possible during convergence"
          },
          {
            aspect: "Memory Usage",
            linkState: "High (topology database)",
            distanceVector: "Low (distance vectors)"
          },
          {
            aspect: "CPU Usage",
            linkState: "High (Dijkstra calculation)",
            distanceVector: "Low (simple computation)"
          },
          {
            aspect: "Scalability",
            linkState: "Good (hierarchical areas)",
            distanceVector: "Limited (hop count)"
          }
        ]
      }
    },
    {
      id: "protocols",
      title: "Link State Protocols",
      icon: Globe,
      description: "OSPF, IS-IS, and other implementations",
      content: {
        protocols: [
          {
            name: "OSPF (Open Shortest Path First)",
            version: "v2 (IPv4), v3 (IPv6)",
            features: [
              "Hierarchical areas (Area 0 backbone)",
              "Multiple metrics support",
              "Authentication",
              "Load balancing",
              "VLSM and CIDR support"
            ],
            advantages: [
              "Fast convergence",
              "No routing loops",
              "Scalable with areas",
              "Vendor independent"
            ],
            disadvantages: [
              "Complex configuration",
              "High memory usage",
              "CPU intensive"
            ]
          },
          {
            name: "IS-IS (Intermediate System to Intermediate System)",
            version: "ISO standard",
            features: [
              "Dual stack (IPv4 and IPv6)",
              "Two-level hierarchy",
              "Flexible metrics",
              "Fast convergence",
              "Minimal overhead"
            ],
            advantages: [
              "Very stable",
              "Good for service providers",
              "Efficient flooding",
              "Easy IPv6 support"
            ],
            disadvantages: [
              "Less common",
              "Complex concepts",
              "Vendor-specific extensions"
            ]
          }
        ]
      }
    },
    {
      id: "lsa-types",
      title: "LSA Types",
      icon: Info,
      description: "Different types of Link State Advertisements",
      content: {
        lsaTypes: [
          {
            type: "Type 1 (Router LSA)",
            scope: "Area",
            description: "Describes router's links within an area",
            generatedBy: "Every router",
            contains: "Router ID, links, costs, interface types"
          },
          {
            type: "Type 2 (Network LSA)",
            scope: "Area", 
            description: "Describes multi-access network",
            generatedBy: "Designated Router (DR)",
            contains: "Network mask, attached routers"
          },
          {
            type: "Type 3 (Summary LSA)",
            scope: "Area",
            description: "Describes networks in other areas",
            generatedBy: "Area Border Router (ABR)",
            contains: "Network address, mask, cost"
          },
          {
            type: "Type 4 (ASBR Summary)",
            scope: "Area",
            description: "Describes path to ASBR",
            generatedBy: "Area Border Router (ABR)",
            contains: "ASBR router ID, cost to reach"
          },
          {
            type: "Type 5 (External LSA)",
            scope: "Autonomous System",
            description: "Describes external routes",
            generatedBy: "Autonomous System Boundary Router (ASBR)",
            contains: "External network, mask, cost, metric type"
          }
        ]
      }
    }
  ];

  const selectedTopicData = topics.find(t => t.id === selectedTopic);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/cn/network-layer" className="inline-flex items-center text-indigo-200 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Network Layer
          </Link>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-white/20 p-3 rounded-xl">
              <Network className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Link State Routing</h1>
              <p className="text-indigo-100 text-lg">Complete topology awareness using Dijkstra's shortest path algorithm</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Key Protocols</h3>
              <p className="text-sm text-indigo-100">OSPF, IS-IS, and other implementations</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Convergence</h3>
              <p className="text-sm text-indigo-100">Fast convergence with complete topology knowledge</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Scalability</h3>
              <p className="text-sm text-indigo-100">Hierarchical areas for large networks</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Topic Navigation */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Link State Topics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {topics.map((topic) => {
              const IconComponent = topic.icon;
              return (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedTopic === topic.id 
                      ? 'border-indigo-500 bg-indigo-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="h-8 w-8 text-indigo-600 mb-3" />
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
              
              {selectedTopic === "algorithm" && (
                <div className="space-y-8">
                  {/* Algorithm Steps */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Link State Algorithm Steps</h4>
                    <div className="space-y-4">
                      {selectedTopicData.content.steps?.map((step, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start space-x-4">
                            <div className="bg-indigo-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                              {step.step}
                            </div>
                            <div className="flex-1">
                              <h5 className="font-semibold text-indigo-700 mb-2">{step.title}</h5>
                              <p className="text-gray-600 mb-2">{step.description}</p>
                              <p className="text-sm text-gray-500">{step.details}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Comparison Table */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Link State vs Distance Vector</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2 text-left">Aspect</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Link State</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Distance Vector</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedTopicData.content.comparison?.map((item, index) => (
                            <tr key={index}>
                              <td className="border border-gray-300 px-4 py-2 font-medium">{item.aspect}</td>
                              <td className="border border-gray-300 px-4 py-2 text-green-700">{item.linkState}</td>
                              <td className="border border-gray-300 px-4 py-2 text-blue-700">{item.distanceVector}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {selectedTopic === "protocols" && (
                <div className="space-y-8">
                  {selectedTopicData.content.protocols?.map((protocol, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-indigo-700 mb-3">{protocol.name}</h4>
                      <p className="text-sm text-gray-600 mb-4">Version: {protocol.version}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <h5 className="font-medium text-gray-800 mb-2">Key Features</h5>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {protocol.features.map((feature, idx) => (
                              <li key={idx}>• {feature}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-green-800 mb-2">Advantages</h5>
                          <ul className="text-sm text-green-700 space-y-1">
                            {protocol.advantages.map((advantage, idx) => (
                              <li key={idx}>• {advantage}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-red-800 mb-2">Disadvantages</h5>
                          <ul className="text-sm text-red-700 space-y-1">
                            {protocol.disadvantages.map((disadvantage, idx) => (
                              <li key={idx}>• {disadvantage}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedTopic === "lsa-types" && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">OSPF LSA Types</h4>
                  {selectedTopicData.content.lsaTypes?.map((lsa, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h5 className="font-semibold text-purple-700">{lsa.type}</h5>
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">{lsa.scope}</span>
                      </div>
                      <p className="text-gray-600 mb-3">{lsa.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Generated by:</span> {lsa.generatedBy}
                        </div>
                        <div>
                          <span className="font-medium">Contains:</span> {lsa.contains}
                        </div>
                      </div>
                    </div>
                  ))}
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
                <li>• Link state algorithm uses Dijkstra's SPF</li>
                <li>• LSAs flooded throughout area/domain</li>
                <li>• All routers have identical topology database</li>
                <li>• OSPF uses areas for scalability</li>
                <li>• Different LSA types for different information</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-3">Common Exam Questions</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• "Explain link state algorithm steps" (8 marks)</li>
                <li>• "Compare OSPF vs RIP" (10 marks)</li>
                <li>• "Describe OSPF area concept" (6 marks)</li>
                <li>• "Types of LSAs and their purposes" (8 marks)</li>
                <li>• "Link state vs distance vector routing" (10 marks)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
