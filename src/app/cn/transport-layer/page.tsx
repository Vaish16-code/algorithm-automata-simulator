"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Server
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
      description: "Algorithms to prevent network congestion",
      icon: Router,
      difficulty: "Hard",
      subtopics: [
        "Slow Start Algorithm",
        "Congestion Avoidance",
        "Fast Retransmit",
        "Fast Recovery",
        "TCP Tahoe vs Reno"
      ],
      practicalUse: "Internet traffic management, QoS",
      tools: ["Congestion Control Simulator", "Algorithm Visualizer"]
    },
    {
      id: "flow-control",
      title: "Flow Control",
      description: "Managing data flow between sender and receiver",
      icon: Network,
      difficulty: "Medium",
      subtopics: [
        "Sliding Window Protocol",
        "Stop-and-Wait",
        "Go-Back-N",
        "Selective Repeat",
        "Window Size Management"
      ],
      practicalUse: "Preventing buffer overflow, data integrity",
      tools: ["Flow Control Simulator", "Window Size Calculator"]
    },
    {
      id: "reliability",
      title: "Reliability Mechanisms",
      description: "Ensuring data delivery and integrity",
      icon: Shield,
      difficulty: "Medium",
      subtopics: [
        "Acknowledgments",
        "Timeouts and Retransmission",
        "Sequence Numbers",
        "Duplicate Detection",
        "Error Detection"
      ],
      practicalUse: "File transfer, critical data transmission",
      tools: ["Reliability Tester", "ACK Simulator"]
    },
    {
      id: "socket-programming",
      title: "Socket Programming",
      description: "Programming interface for network communication",
      icon: Server,
      difficulty: "Hard",
      subtopics: [
        "TCP Sockets",
        "UDP Sockets",
        "Client-Server Model",
        "Socket API",
        "Network Programming"
      ],
      practicalUse: "Network applications, distributed systems",
      tools: ["Socket Simulator", "Code Examples"]
    }
  ];

  const learningPath = [
    { step: 1, title: "Transport Layer Basics", topics: ["TCP", "UDP"] },
    { step: 2, title: "Connection Management", topics: ["TCP Handshake", "Connection States"] },
    { step: 3, title: "Flow Control", topics: ["Sliding Window", "Window Management"] },
    { step: 4, title: "Congestion Control", topics: ["Slow Start", "Congestion Avoidance"] },
    { step: 5, title: "Advanced Topics", topics: ["Socket Programming", "Performance"] }
  ];

  const quickStats = {
    protocols: 2,
    algorithms: 8,
    interactiveTools: 12,
    examTopics: 15
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Transport Layer
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Layer 4 of the OSI model - Provides reliable data transfer, flow control, 
            and error recovery between end systems
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{quickStats.protocols}</div>
              <div className="text-sm text-gray-600">Main Protocols</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{quickStats.algorithms}</div>
              <div className="text-sm text-gray-600">Key Algorithms</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">{quickStats.interactiveTools}</div>
              <div className="text-sm text-gray-600">Interactive Tools</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">{quickStats.examTopics}</div>
              <div className="text-sm text-gray-600">Exam Topics</div>
            </CardContent>
          </Card>
        </div>

        {/* Topics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {topics.map((topic) => {
            const IconComponent = topic.icon;
            return (
              <Card key={topic.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <IconComponent className="h-8 w-8 text-blue-600" />
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      topic.difficulty === "Easy" ? "bg-green-100 text-green-800" : 
                      topic.difficulty === "Medium" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"
                    }`}>
                      {topic.difficulty}
                    </span>
                  </div>
                  <CardTitle className="text-lg">{topic.title}</CardTitle>
                  <p className="text-sm text-gray-600">{topic.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Key Concepts:</h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {topic.subtopics.slice(0, 3).map((subtopic, index) => (
                          <li key={index}>• {subtopic}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Real-world Use:</h4>
                      <p className="text-xs text-gray-600">{topic.practicalUse}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Link href={`/cn/transport-layer/${topic.id}`}>
                        <Button size="sm" className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          Learn
                        </Button>
                      </Link>
                      <Link href={`/cn/transport-layer/${topic.id}/simulator`}>
                        <Button size="sm" variant="outline" className="flex items-center gap-1">
                          <Play className="h-3 w-3" />
                          Try
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Learning Path */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5" />
              Recommended Learning Path
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {learningPath.map((step, index) => (
                <div key={step.step} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.topics.join(", ")}</p>
                  </div>
                  {index < learningPath.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Exam Tips */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>🎯 Exam Preparation Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Key Concepts to Master:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• TCP vs UDP comparison and use cases</li>
                  <li>• Three-way handshake process</li>
                  <li>• Flow control mechanisms</li>
                  <li>• Congestion control algorithms</li>
                  <li>• Socket programming concepts</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Practice Problems:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Calculate TCP window sizes</li>
                  <li>• Trace handshake sequences</li>
                  <li>• Analyze congestion control scenarios</li>
                  <li>• Compare protocol performance</li>
                  <li>• Design client-server applications</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Link href="/cn/network-layer">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowRight className="h-4 w-4 rotate-180" />
              Previous: Network Layer
            </Button>
          </Link>
          <Link href="/cn">
            <Button variant="outline">
              Back to Computer Networks
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
