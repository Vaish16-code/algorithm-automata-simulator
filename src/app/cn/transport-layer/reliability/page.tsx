"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Shield, CheckCircle, XCircle, Clock, RefreshCw, ArrowRight } from "lucide-react";

interface Packet {
  id: number;
  data: string;
  sequenceNum: number;
  ackNum?: number;
  status: "sent" | "received" | "lost" | "ack" | "timeout";
  timestamp: number;
}

export default function ReliabilityPage() {
  const [packets, setPackets] = useState<Packet[]>([]);
  const [windowSize, setWindowSize] = useState(4);
  const [timeoutDuration, setTimeoutDuration] = useState(2000);
  const [errorRate, setErrorRate] = useState(10);
  const [protocol, setProtocol] = useState("stop-and-wait");
  const [isRunning, setIsRunning] = useState(false);
  const [sequenceNum, setSequenceNum] = useState(0);
  const [nextExpectedSeq, setNextExpectedSeq] = useState(0);
  const [senderWindow, setSenderWindow] = useState<number[]>([]);
  const [receiverBuffer, setReceiverBuffer] = useState<Packet[]>([]);

  const protocols = [
    {
      id: "stop-and-wait",
      name: "Stop-and-Wait ARQ",
      description: "Send one packet, wait for ACK before sending next",
      efficiency: "Low",
      complexity: "Simple",
      windowSize: 1,
      features: ["Simple implementation", "Low efficiency", "No buffering needed"]
    },
    {
      id: "go-back-n",
      name: "Go-Back-N ARQ",
      description: "Send multiple packets, retransmit from first lost packet",
      efficiency: "Medium",
      complexity: "Medium",
      windowSize: "Variable",
      features: ["Cumulative ACK", "Sender buffering", "Pipeline transmission"]
    },
    {
      id: "selective-repeat",
      name: "Selective Repeat ARQ",
      description: "Retransmit only lost packets",
      efficiency: "High",
      complexity: "Complex",
      windowSize: "Variable",
      features: ["Individual ACK", "Both sender/receiver buffering", "Optimal efficiency"]
    }
  ];

  const errorDetectionMethods = [
    {
      name: "Checksum",
      description: "Simple arithmetic sum for error detection",
      strength: "Weak",
      overhead: "Low",
      use: "UDP, IP header",
      detects: ["Single bit errors", "Some burst errors"],
      limitations: ["Cannot detect all errors", "No error correction"]
    },
    {
      name: "Cyclic Redundancy Check (CRC)",
      description: "Polynomial-based error detection",
      strength: "Strong",
      overhead: "Medium",
      use: "Ethernet, WiFi, storage",
      detects: ["Single bit errors", "Burst errors", "Multiple bit errors"],
      limitations: ["Detection only", "No correction capability"]
    },
    {
      name: "Hamming Code",
      description: "Error detection and correction code",
      strength: "Medium",
      overhead: "High",
      use: "Memory systems, storage",
      detects: ["Single bit errors", "Some double bit errors"],
      limitations: ["Limited correction", "High overhead"]
    },
    {
      name: "Reed-Solomon",
      description: "Block-based error correction code",
      strength: "Very Strong",
      overhead: "Very High",
      use: "CDs, DVDs, satellite communication",
      detects: ["Multiple symbol errors", "Burst errors"],
      limitations: ["High computational cost", "Complex implementation"]
    }
  ];

  const simulatePacketTransmission = () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setPackets([]);
    setSequenceNum(0);
    setNextExpectedSeq(0);
    setSenderWindow([]);
    setReceiverBuffer([]);

    const newPackets: Packet[] = [];
    const totalPackets = 10;

    for (let i = 0; i < totalPackets; i++) {
      setTimeout(() => {
        const packet: Packet = {
          id: Date.now() + i,
          data: `Data${i + 1}`,
          sequenceNum: i,
          status: "sent",
          timestamp: Date.now()
        };

        // Simulate packet loss
        const isLost = Math.random() * 100 < errorRate;
        
        if (isLost) {
          packet.status = "lost";
        } else {
          // Simulate network delay
          setTimeout(() => {
            packet.status = "received";
            setPackets(prev => prev.map(p => p.id === packet.id ? packet : p));
            
            // Send ACK
            setTimeout(() => {
              const ackPacket: Packet = {
                id: Date.now() + 1000 + i,
                data: `ACK${i + 1}`,
                sequenceNum: -1,
                ackNum: i,
                status: "ack",
                timestamp: Date.now()
              };
              setPackets(prev => [...prev, ackPacket]);
            }, 100);
          }, 500 + Math.random() * 1000);
        }

        setPackets(prev => [...prev, packet]);

        if (i === totalPackets - 1) {
          setTimeout(() => setIsRunning(false), 3000);
        }
      }, i * (protocol === "stop-and-wait" ? 1000 : 200));
    }
  };

  const calculateChecksum = (data: string): string => {
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      sum += data.charCodeAt(i);
    }
    return (sum % 256).toString(16).padStart(2, '0');
  };

  const calculateCRC = (data: string): string => {
    // Simplified CRC-8 calculation
    let crc = 0;
    for (let i = 0; i < data.length; i++) {
      crc ^= data.charCodeAt(i);
      for (let j = 0; j < 8; j++) {
        if (crc & 0x80) {
          crc = (crc << 1) ^ 0x07;
        } else {
          crc = crc << 1;
        }
      }
    }
    return (crc & 0xFF).toString(16).padStart(2, '0');
  };

  const getProtocolInfo = () => {
    return protocols.find(p => p.id === protocol);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent": return <ArrowRight className="text-blue-600" size={16} />;
      case "received": return <CheckCircle className="text-green-600" size={16} />;
      case "lost": return <XCircle className="text-red-600" size={16} />;
      case "ack": return <CheckCircle className="text-green-600" size={16} />;
      case "timeout": return <Clock className="text-yellow-600" size={16} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/cn/transport-layer" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="mr-2" size={20} />
            Back to Transport Layer
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Reliability Mechanisms
          </h1>
          <p className="text-xl text-gray-600">
            Learn about error detection, correction, and reliable data delivery protocols.
          </p>
        </div>

        {/* Protocol Comparison */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Automatic Repeat Request (ARQ) Protocols</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {protocols.map((p) => (
              <button
                key={p.id}
                onClick={() => setProtocol(p.id)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  protocol === p.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h3 className="font-semibold text-gray-800 mb-2">{p.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{p.description}</p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Efficiency:</span>
                    <span className={`font-medium ${
                      p.efficiency === 'High' ? 'text-green-600' :
                      p.efficiency === 'Medium' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>{p.efficiency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Complexity:</span>
                    <span className="font-medium">{p.complexity}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {protocol && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">{getProtocolInfo()?.name}</h3>
              <div>
                <h4 className="font-medium text-blue-600 mb-2">Key Features:</h4>
                <ul className="text-sm text-gray-600">
                  {getProtocolInfo()?.features.map((feature, i) => (
                    <li key={i} className="mb-1">• {feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Simulation Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Reliability Simulation</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Protocol Type:
                </label>
                <select
                  value={protocol}
                  onChange={(e) => setProtocol(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {protocols.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Error Rate (%): {errorRate}
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={errorRate}
                  onChange={(e) => setErrorRate(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              {protocol !== "stop-and-wait" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Window Size: {windowSize}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    value={windowSize}
                    onChange={(e) => setWindowSize(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timeout (ms): {timeoutDuration}
                </label>
                <input
                  type="range"
                  min="1000"
                  max="5000"
                  step="500"
                  value={timeoutDuration}
                  onChange={(e) => setTimeoutDuration(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <button
                onClick={simulatePacketTransmission}
                disabled={isRunning}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="animate-spin" size={16} />
                    <span>Running Simulation...</span>
                  </>
                ) : (
                  <>
                    <Shield size={16} />
                    <span>Start Reliability Test</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Packet Transmission Log */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Transmission Log</h2>
            <div className="max-h-96 overflow-y-auto">
              {packets.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No packets transmitted yet</p>
              ) : (
                <div className="space-y-2">
                  {packets.map((packet) => (
                    <div key={packet.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(packet.status)}
                        <div>
                          <span className="font-medium text-gray-800">{packet.data}</span>
                          {packet.ackNum !== undefined && (
                            <span className="text-sm text-gray-600 ml-2">(ACK {packet.ackNum})</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${
                          packet.status === 'received' || packet.status === 'ack' ? 'text-green-600' :
                          packet.status === 'lost' ? 'text-red-600' :
                          packet.status === 'timeout' ? 'text-yellow-600' :
                          'text-blue-600'
                        }`}>
                          {packet.status.toUpperCase()}
                        </div>
                        <div className="text-xs text-gray-500">
                          Seq: {packet.sequenceNum >= 0 ? packet.sequenceNum : 'N/A'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Error Detection Methods */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Error Detection Methods</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {errorDetectionMethods.map((method, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800">{method.name}</h3>
                  <div className="flex space-x-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      method.strength === 'Very Strong' ? 'bg-green-100 text-green-800' :
                      method.strength === 'Strong' ? 'bg-blue-100 text-blue-800' :
                      method.strength === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {method.strength}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      method.overhead === 'Low' ? 'bg-green-100 text-green-800' :
                      method.overhead === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      method.overhead === 'High' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {method.overhead} Overhead
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 mb-3">{method.description}</p>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <h4 className="font-medium text-blue-600 mb-1">Common Uses:</h4>
                    <p className="text-sm text-gray-600">{method.use}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-green-600 mb-1">Detects:</h4>
                    <ul className="text-sm text-gray-600">
                      {method.detects.map((detect, i) => (
                        <li key={i} className="mb-1">• {detect}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-red-600 mb-1">Limitations:</h4>
                    <ul className="text-sm text-gray-600">
                      {method.limitations.map((limitation, i) => (
                        <li key={i} className="mb-1">• {limitation}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Error Detection Demo */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Error Detection Demo</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Checksum Calculator</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Enter data to calculate checksum"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => {
                    const data = e.target.value;
                    if (data) {
                      const checksum = calculateChecksum(data);
                      const checksumDisplay = document.getElementById('checksum-result');
                      if (checksumDisplay) {
                        checksumDisplay.textContent = `Checksum: 0x${checksum}`;
                      }
                    }
                  }}
                />
                <div id="checksum-result" className="text-sm font-mono text-gray-600">
                  Checksum: -
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">CRC Calculator</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Enter data to calculate CRC"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => {
                    const data = e.target.value;
                    if (data) {
                      const crc = calculateCRC(data);
                      const crcDisplay = document.getElementById('crc-result');
                      if (crcDisplay) {
                        crcDisplay.textContent = `CRC-8: 0x${crc}`;
                      }
                    }
                  }}
                />
                <div id="crc-result" className="text-sm font-mono text-gray-600">
                  CRC-8: -
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
