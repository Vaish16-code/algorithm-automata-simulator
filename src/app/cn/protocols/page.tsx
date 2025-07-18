"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Globe, Network, Shield, Zap, Server, Users } from "lucide-react";

export default function ProtocolsPage() {
  const [selectedTopic, setSelectedTopic] = useState("overview");

  const topics = [
    {
      id: "overview",
      title: "Network Protocols Overview",
      icon: Globe,
      description: "Introduction to network protocols and their importance",
      content: {
        fundamentals: [
          {
            concept: "Network Protocol",
            definition: "Set of rules that govern communication between network devices",
            example: "HTTP, TCP, IP, FTP protocols"
          },
          {
            concept: "Protocol Stack",
            definition: "Layered architecture of protocols working together",
            example: "TCP/IP stack, OSI model"
          },
          {
            concept: "Protocol Standards",
            definition: "Specifications defined by organizations like IEEE, IETF",
            example: "IEEE 802.11 (Wi-Fi), RFC documents"
          }
        ],
        applications: [
          "Web browsing (HTTP/HTTPS)",
          "Email communication (SMTP, POP3, IMAP)",
          "File transfer (FTP, TFTP)",
          "Remote access (SSH, Telnet)",
          "Network management (SNMP)"
        ]
      }
    },
    {
      id: "tcp-ip",
      title: "TCP/IP Protocol Suite",
      icon: Network,
      description: "Core protocols of the internet",
      content: {
        fundamentals: [
          {
            concept: "Internet Protocol (IP)",
            definition: "Network layer protocol for packet routing",
            example: "IPv4, IPv6 addressing and routing"
          },
          {
            concept: "Transmission Control Protocol (TCP)",
            definition: "Reliable, connection-oriented transport protocol",
            example: "HTTP, FTP, SMTP use TCP"
          },
          {
            concept: "User Datagram Protocol (UDP)",
            definition: "Unreliable, connectionless transport protocol",
            example: "DNS, DHCP, streaming media use UDP"
          }
        ],
        applications: [
          "Web services and applications",
          "Email and messaging systems",
          "File sharing and transfer",
          "Real-time communication",
          "Network diagnostics"
        ]
      }
    },
    {
      id: "application",
      title: "Application Layer Protocols",
      icon: Server,
      description: "Protocols for end-user applications",
      content: {
        fundamentals: [
          {
            concept: "HTTP/HTTPS",
            definition: "Hypertext Transfer Protocol for web communication",
            example: "GET, POST, PUT, DELETE methods"
          },
          {
            concept: "FTP/SFTP",
            definition: "File Transfer Protocol for file sharing",
            example: "Upload, download, directory listing"
          },
          {
            concept: "SMTP/POP3/IMAP",
            definition: "Email protocols for sending and receiving mail",
            example: "Email clients, mail servers"
          }
        ],
        applications: [
          "Web browsing and development",
          "File sharing and backup",
          "Email communication",
          "Remote server management",
          "Database connectivity"
        ]
      }
    },
    {
      id: "security",
      title: "Security Protocols",
      icon: Shield,
      description: "Protocols for secure communication",
      content: {
        fundamentals: [
          {
            concept: "SSL/TLS",
            definition: "Secure Sockets Layer for encrypted communication",
            example: "HTTPS websites, secure email"
          },
          {
            concept: "IPSec",
            definition: "Internet Protocol Security for VPN connections",
            example: "Site-to-site VPNs, secure tunnels"
          },
          {
            concept: "SSH",
            definition: "Secure Shell for remote access and file transfer",
            example: "Remote server administration, SFTP"
          }
        ],
        applications: [
          "Secure web transactions",
          "VPN connections",
          "Secure remote access",
          "Encrypted file transfer",
          "Network security monitoring"
        ]
      }
    },
    {
      id: "routing",
      title: "Routing Protocols",
      icon: Zap,
      description: "Protocols for network routing decisions",
      content: {
        fundamentals: [
          {
            concept: "RIP (Routing Information Protocol)",
            definition: "Distance-vector routing protocol",
            example: "Hop count metric, small networks"
          },
          {
            concept: "OSPF (Open Shortest Path First)",
            definition: "Link-state routing protocol",
            example: "Dijkstra algorithm, enterprise networks"
          },
          {
            concept: "BGP (Border Gateway Protocol)",
            definition: "Exterior gateway protocol for internet routing",
            example: "Internet service providers, AS routing"
          }
        ],
        applications: [
          "Internet backbone routing",
          "Enterprise network design",
          "Traffic engineering",
          "Network redundancy",
          "Load balancing"
        ]
      }
    },
    {
      id: "management",
      title: "Network Management Protocols",
      icon: Users,
      description: "Protocols for network monitoring and management",
      content: {
        fundamentals: [
          {
            concept: "SNMP",
            definition: "Simple Network Management Protocol",
            example: "Network device monitoring, performance metrics"
          },
          {
            concept: "DHCP",
            definition: "Dynamic Host Configuration Protocol",
            example: "Automatic IP address assignment"
          },
          {
            concept: "DNS",
            definition: "Domain Name System for name resolution",
            example: "Converting domain names to IP addresses"
          }
        ],
        applications: [
          "Network monitoring and alerting",
          "Automated network configuration",
          "Performance optimization",
          "Troubleshooting and diagnostics",
          "Capacity planning"
        ]
      }
    }
  ];

  const currentTopic = topics.find(topic => topic.id === selectedTopic);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/cn"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Computer Networks
          </Link>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-blue-500 p-3 rounded-xl">
              <Globe className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Network Protocols</h1>
              <p className="text-blue-600 text-lg">Communication standards and specifications</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Protocol Categories</h2>
              <div className="space-y-2">
                {topics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center space-x-3 ${
                      selectedTopic === topic.id
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <topic.icon className="h-5 w-5" />
                    <span className="font-medium">{topic.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-8">
              {currentTopic && (
                <>
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="bg-blue-100 p-3 rounded-xl">
                      <currentTopic.icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">{currentTopic.title}</h2>
                      <p className="text-gray-600 text-lg">{currentTopic.description}</p>
                    </div>
                  </div>

                  {/* Fundamentals */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">Key Concepts</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentTopic.content.fundamentals.map((item, index) => (
                        <div key={index} className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-500">
                          <h4 className="font-bold text-lg mb-2 text-gray-900">{item.concept}</h4>
                          <p className="text-gray-700 mb-3">{item.definition}</p>
                          <p className="text-sm text-blue-600 font-medium">Example: {item.example}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Applications */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">Real-World Applications</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentTopic.content.applications.map((application, index) => (
                        <div key={index} className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-gray-800 font-medium">{application}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Protocol-specific content */}
                  {selectedTopic === "tcp-ip" && (
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold mb-4 text-gray-900">TCP Flow Control</h3>
                      <div className="bg-blue-50 p-6 rounded-lg">
                        <Link 
                          href="/cn/transport-layer/tcp"
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                        >
                          <Network className="h-5 w-5 mr-2" />
                          Learn TCP Protocol Details →
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-bold mb-4 text-gray-900">Explore Related Topics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Link 
                        href="/cn/transport-layer"
                        className="p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <Network className="h-6 w-6 text-blue-600" />
                          <div>
                            <h4 className="font-medium text-gray-900">Transport Layer</h4>
                            <p className="text-sm text-gray-600">TCP/UDP protocols</p>
                          </div>
                        </div>
                      </Link>
                      <Link 
                        href="/cn/security"
                        className="p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <Shield className="h-6 w-6 text-blue-600" />
                          <div>
                            <h4 className="font-medium text-gray-900">Network Security</h4>
                            <p className="text-sm text-gray-600">Security protocols</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
