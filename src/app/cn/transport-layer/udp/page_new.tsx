"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Globe, Network, Zap, Play, RotateCcw } from "lucide-react";

interface UDPPacket {
  sourcePort: number;
  destPort: number;
  length: number;
  checksum: string;
  data: string;
  timestamp: number;
}

interface ComparisonMetric {
  feature: string;
  tcp: string;
  udp: string;
  advantage: 'tcp' | 'udp' | 'neither';
}

export default function UDPPage() {
  const [packets, setPackets] = useState<UDPPacket[]>([]);
  const [sourcePort, setSourcePort] = useState(12345);
  const [destPort, setDestPort] = useState(53);
  const [data, setData] = useState("DNS Query");

  const comparisonData: ComparisonMetric[] = [
    { feature: "Connection Setup", tcp: "3-way handshake required", udp: "No connection setup", advantage: "udp" },
    { feature: "Reliability", tcp: "Guaranteed delivery", udp: "Best effort", advantage: "tcp" },
    { feature: "Speed", tcp: "Slower due to overhead", udp: "Faster transmission", advantage: "udp" },
    { feature: "Header Size", tcp: "20+ bytes", udp: "8 bytes", advantage: "udp" },
    { feature: "Flow Control", tcp: "Built-in flow control", udp: "No flow control", advantage: "tcp" },
    { feature: "Error Detection", tcp: "Error detection & correction", udp: "Basic checksum only", advantage: "tcp" },
    { feature: "Use Case", tcp: "File transfer, web browsing", udp: "Gaming, streaming, DNS", advantage: "neither" },
    { feature: "Overhead", tcp: "High overhead", udp: "Low overhead", advantage: "udp" }
  ];

  const generateChecksum = (data: string): string => {
    // Simplified checksum calculation for demonstration
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      sum += data.charCodeAt(i);
    }
    return "0x" + (sum % 65536).toString(16).toUpperCase().padStart(4, '0');
  };

  const sendUDPPacket = () => {
    const packet: UDPPacket = {
      sourcePort,
      destPort,
      length: 8 + data.length, // UDP header (8 bytes) + data length
      checksum: generateChecksum(data),
      data,
      timestamp: Date.now()
    };
    
    setPackets(prev => [packet, ...prev.slice(0, 9)]); // Keep last 10 packets
  };

  const simulatePacketLoss = () => {
    if (Math.random() < 0.3) { // 30% packet loss simulation
      alert("Packet lost! This demonstrates UDP's unreliable nature.");
      return;
    }
    sendUDPPacket();
  };

  const clearPackets = () => {
    setPackets([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/cn/transport-layer" className="inline-flex items-center text-purple-200 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Transport Layer
          </Link>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-white/20 p-3 rounded-xl">
              <Globe className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">UDP Protocol</h1>
              <p className="text-purple-100 text-lg">User Datagram Protocol - Connectionless transport layer protocol</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Protocol Type</h3>
              <p className="text-sm text-purple-100">Connectionless, unreliable transport</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Header Size</h3>
              <p className="text-sm text-purple-100">8 bytes - minimal overhead</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Use Cases</h3>
              <p className="text-sm text-purple-100">DNS, DHCP, gaming, streaming</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* UDP Simulator */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">UDP Packet Simulator</h2>
          
          {/* Input Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Source Port</label>
              <input
                type="number"
                value={sourcePort}
                onChange={(e) => setSourcePort(parseInt(e.target.value) || 12345)}
                min="1"
                max="65535"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Destination Port</label>
              <input
                type="number"
                value={destPort}
                onChange={(e) => setDestPort(parseInt(e.target.value) || 53)}
                min="1"
                max="65535"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Data</label>
            <input
              type="text"
              value={data}
              onChange={(e) => setData(e.target.value)}
              placeholder="Enter data to send..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex space-x-4 mb-6">
            <button 
              onClick={sendUDPPacket}
              className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center space-x-2"
            >
              <Play className="h-4 w-4" />
              <span>Send Packet</span>
            </button>
            <button 
              onClick={simulatePacketLoss}
              className="px-6 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 flex items-center space-x-2"
            >
              <Network className="h-4 w-4" />
              <span>Send (with Loss)</span>
            </button>
            <button 
              onClick={clearPackets}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 flex items-center space-x-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Clear All</span>
            </button>
          </div>

          {/* Packet History */}
          {packets.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Packet History</h3>
              <div className="bg-gray-900 rounded-lg p-4 max-h-60 overflow-y-auto">
                {packets.map((packet, index) => (
                  <div key={index} className="mb-4 last:mb-0 p-3 bg-gray-800 rounded border-l-4 border-purple-500">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-blue-400 font-medium">Source Port:</span> <span className="text-gray-200">{packet.sourcePort}</span>
                      </div>
                      <div>
                        <span className="text-green-400 font-medium">Dest Port:</span> <span className="text-gray-200">{packet.destPort}</span>
                      </div>
                      <div>
                        <span className="text-orange-400 font-medium">Length:</span> <span className="text-gray-200">{packet.length} bytes</span>
                      </div>
                      <div>
                        <span className="text-purple-400 font-medium">Checksum:</span> <span className="text-gray-200">{packet.checksum}</span>
                      </div>
                    </div>
                    <div className="mt-2 text-sm">
                      <span className="text-yellow-400 font-medium">Data:</span> <code className="text-gray-200">"{packet.data}"</code>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Sent at: {new Date(packet.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* UDP Header Structure */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">UDP Header Structure</h2>
          
          <div className="bg-gray-100 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div className="bg-blue-200 p-4 rounded border">
                <div className="font-bold text-blue-800">Source Port</div>
                <div className="text-sm text-gray-600">16 bits</div>
              </div>
              <div className="bg-green-200 p-4 rounded border">
                <div className="font-bold text-green-800">Destination Port</div>
                <div className="text-sm text-gray-600">16 bits</div>
              </div>
              <div className="bg-orange-200 p-4 rounded border">
                <div className="font-bold text-orange-800">Length</div>
                <div className="text-sm text-gray-600">16 bits</div>
              </div>
              <div className="bg-purple-200 p-4 rounded border">
                <div className="font-bold text-purple-800">Checksum</div>
                <div className="text-sm text-gray-600">16 bits</div>
              </div>
            </div>
            <div className="mt-4 bg-yellow-200 p-4 rounded border text-center">
              <div className="font-bold text-yellow-800">Data (Variable Length)</div>
              <div className="text-sm text-gray-600">Application data payload</div>
            </div>
          </div>
        </div>

        {/* TCP vs UDP Comparison */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">TCP vs UDP Comparison</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">Feature</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">TCP</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">UDP</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Better For</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                    <td className="border border-gray-300 px-4 py-2 font-medium">{item.feature}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.tcp}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.udp}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        item.advantage === 'tcp' ? 'bg-blue-100 text-blue-800' :
                        item.advantage === 'udp' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {item.advantage === 'tcp' ? 'TCP' : item.advantage === 'udp' ? 'UDP' : 'Depends'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* UDP Characteristics */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">UDP Characteristics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-3">Advantages</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Fast transmission (no connection setup)</li>
                <li>• Low overhead (8-byte header)</li>
                <li>• Simple protocol implementation</li>
                <li>• Suitable for real-time applications</li>
                <li>• Supports broadcast/multicast</li>
                <li>• No connection state maintenance</li>
              </ul>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-800 mb-3">Disadvantages</h3>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• No guarantee of delivery</li>
                <li>• No ordering of packets</li>
                <li>• No flow control mechanism</li>
                <li>• No congestion control</li>
                <li>• Limited error detection</li>
                <li>• Application must handle reliability</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Common UDP Use Cases</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">DNS (Domain Name System)</h3>
              <p className="text-sm text-blue-600">Quick name resolution queries where speed matters more than reliability</p>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-800 mb-2">Online Gaming</h3>
              <p className="text-sm text-purple-600">Real-time multiplayer games requiring low latency over reliability</p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">Video Streaming</h3>
              <p className="text-sm text-green-600">Live video/audio streams where occasional packet loss is acceptable</p>
            </div>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="font-semibold text-orange-800 mb-2">DHCP</h3>
              <p className="text-sm text-orange-600">Dynamic Host Configuration Protocol for IP address assignment</p>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">SNMP</h3>
              <p className="text-sm text-yellow-600">Simple Network Management Protocol for network monitoring</p>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-800 mb-2">NTP</h3>
              <p className="text-sm text-red-600">Network Time Protocol for clock synchronization across networks</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
