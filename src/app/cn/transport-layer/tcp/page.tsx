"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Network, Play, RotateCcw, Zap } from "lucide-react";

interface TCPPacket {
  sourcePort: number;
  destPort: number;
  sequenceNumber: number;
  acknowledgmentNumber: number;
  windowSize: number;
  flags: {
    SYN: boolean;
    ACK: boolean;
    FIN: boolean;
    RST: boolean;
    PSH: boolean;
    URG: boolean;
  };
  data: string;
  timestamp: number;
}

interface ConnectionState {
  state: string;
  clientSeq: number;
  serverSeq: number;
  clientAck: number;
  serverAck: number;
  windowSize: number;
}

export default function TCPPage() {
  const [connectionState, setConnectionState] = useState<ConnectionState>({
    state: "CLOSED",
    clientSeq: 1000,
    serverSeq: 2000,
    clientAck: 0,
    serverAck: 0,
    windowSize: 1024
  });

  const [packets, setPackets] = useState<TCPPacket[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [dataToSend, setDataToSend] = useState("Hello World");
  const [windowSize, setWindowSize] = useState(1024);

  const simulateHandshake = () => {
    const handshakePackets: TCPPacket[] = [
      // SYN packet from client
      {
        sourcePort: 12345,
        destPort: 80,
        sequenceNumber: connectionState.clientSeq,
        acknowledgmentNumber: 0,
        windowSize: windowSize,
        flags: { SYN: true, ACK: false, FIN: false, RST: false, PSH: false, URG: false },
        data: "",
        timestamp: Date.now()
      },
      // SYN-ACK packet from server
      {
        sourcePort: 80,
        destPort: 12345,
        sequenceNumber: connectionState.serverSeq,
        acknowledgmentNumber: connectionState.clientSeq + 1,
        windowSize: windowSize,
        flags: { SYN: true, ACK: true, FIN: false, RST: false, PSH: false, URG: false },
        data: "",
        timestamp: Date.now() + 100
      },
      // ACK packet from client
      {
        sourcePort: 12345,
        destPort: 80,
        sequenceNumber: connectionState.clientSeq + 1,
        acknowledgmentNumber: connectionState.serverSeq + 1,
        windowSize: windowSize,
        flags: { SYN: false, ACK: true, FIN: false, RST: false, PSH: false, URG: false },
        data: "",
        timestamp: Date.now() + 200
      }
    ];

    setPackets(handshakePackets);
    setConnectionState({
      ...connectionState,
      state: "ESTABLISHED",
      clientSeq: connectionState.clientSeq + 1,
      serverSeq: connectionState.serverSeq + 1,
      clientAck: connectionState.serverSeq + 1,
      serverAck: connectionState.clientSeq + 1
    });
    setCurrentStep(0);
  };

  const simulateDataTransfer = () => {
    if (connectionState.state !== "ESTABLISHED") {
      alert("Connection must be established first!");
      return;
    }

    const dataPackets: TCPPacket[] = [...packets];
    
    // Data packet from client
    dataPackets.push({
      sourcePort: 12345,
      destPort: 80,
      sequenceNumber: connectionState.clientSeq,
      acknowledgmentNumber: connectionState.serverAck,
      windowSize: windowSize,
      flags: { SYN: false, ACK: true, FIN: false, RST: false, PSH: true, URG: false },
      data: dataToSend,
      timestamp: Date.now()
    });

    // ACK from server
    dataPackets.push({
      sourcePort: 80,
      destPort: 12345,
      sequenceNumber: connectionState.serverSeq,
      acknowledgmentNumber: connectionState.clientSeq + dataToSend.length,
      windowSize: windowSize,
      flags: { SYN: false, ACK: true, FIN: false, RST: false, PSH: false, URG: false },
      data: "",
      timestamp: Date.now() + 100
    });

    setPackets(dataPackets);
    setConnectionState({
      ...connectionState,
      clientSeq: connectionState.clientSeq + dataToSend.length,
      serverAck: connectionState.clientSeq + dataToSend.length
    });
  };

  const simulateClosing = () => {
    if (connectionState.state !== "ESTABLISHED") {
      alert("Connection must be established first!");
      return;
    }

    const closingPackets: TCPPacket[] = [...packets];
    
    // FIN from client
    closingPackets.push({
      sourcePort: 12345,
      destPort: 80,
      sequenceNumber: connectionState.clientSeq,
      acknowledgmentNumber: connectionState.serverAck,
      windowSize: windowSize,
      flags: { SYN: false, ACK: true, FIN: true, RST: false, PSH: false, URG: false },
      data: "",
      timestamp: Date.now()
    });

    // ACK from server
    closingPackets.push({
      sourcePort: 80,
      destPort: 12345,
      sequenceNumber: connectionState.serverSeq,
      acknowledgmentNumber: connectionState.clientSeq + 1,
      windowSize: windowSize,
      flags: { SYN: false, ACK: true, FIN: false, RST: false, PSH: false, URG: false },
      data: "",
      timestamp: Date.now() + 100
    });

    // FIN from server
    closingPackets.push({
      sourcePort: 80,
      destPort: 12345,
      sequenceNumber: connectionState.serverSeq,
      acknowledgmentNumber: connectionState.clientSeq + 1,
      windowSize: windowSize,
      flags: { SYN: false, ACK: true, FIN: true, RST: false, PSH: false, URG: false },
      data: "",
      timestamp: Date.now() + 200
    });

    // Final ACK from client
    closingPackets.push({
      sourcePort: 12345,
      destPort: 80,
      sequenceNumber: connectionState.clientSeq + 1,
      acknowledgmentNumber: connectionState.serverSeq + 1,
      windowSize: windowSize,
      flags: { SYN: false, ACK: true, FIN: false, RST: false, PSH: false, URG: false },
      data: "",
      timestamp: Date.now() + 300
    });

    setPackets(closingPackets);
    setConnectionState({
      ...connectionState,
      state: "CLOSED"
    });
  };

  const resetConnection = () => {
    setPackets([]);
    setConnectionState({
      state: "CLOSED",
      clientSeq: 1000,
      serverSeq: 2000,
      clientAck: 0,
      serverAck: 0,
      windowSize: windowSize
    });
    setCurrentStep(0);
  };

  const getFlagString = (flags: TCPPacket['flags']): string => {
    const activeFlags = Object.entries(flags)
      .filter(([_, active]) => active)
      .map(([flag, _]) => flag);
    return activeFlags.length > 0 ? activeFlags.join(', ') : 'None';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/cn/transport-layer" className="inline-flex items-center text-blue-200 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Transport Layer
          </Link>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-white/20 p-3 rounded-xl">
              <Network className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">TCP Flow Control</h1>
              <p className="text-blue-100 text-lg">Connection management, handshake, and reliable data transfer</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Connection Type</h3>
              <p className="text-sm text-blue-100">Connection-oriented, reliable</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Flow Control</h3>
              <p className="text-sm text-blue-100">Sliding window protocol</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Reliability</h3>
              <p className="text-sm text-blue-100">Guaranteed delivery & ordering</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">TCP Connection Control</h2>
            
            <div className="space-y-4">
              <div className="bg-gray-100 border border-gray-300 p-3 rounded-lg">
                <div className="text-sm font-medium text-gray-700">Connection State</div>
                <div className={`text-lg font-bold ${
                  connectionState.state === 'ESTABLISHED' ? 'text-green-600' : 
                  connectionState.state === 'CLOSED' ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  {connectionState.state}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data to Send</label>
                <input
                  type="text"
                  value={dataToSend}
                  onChange={(e) => setDataToSend(e.target.value)}
                  placeholder="Enter data..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Window Size</label>
                <input
                  type="number"
                  value={windowSize}
                  onChange={(e) => setWindowSize(parseInt(e.target.value) || 1024)}
                  min="1"
                  max="65535"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <button 
                  onClick={simulateHandshake}
                  disabled={connectionState.state !== 'CLOSED'}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Play className="h-4 w-4" />
                  <span>1. Three-Way Handshake</span>
                </button>
                <button 
                  onClick={simulateDataTransfer}
                  disabled={connectionState.state !== 'ESTABLISHED'}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Network className="h-4 w-4" />
                  <span>2. Send Data</span>
                </button>
                <button 
                  onClick={simulateClosing}
                  disabled={connectionState.state !== 'ESTABLISHED'}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Zap className="h-4 w-4" />
                  <span>3. Close Connection</span>
                </button>
                <button 
                  onClick={resetConnection}
                  className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 flex items-center justify-center space-x-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Connection State Details */}
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Client SEQ:</span> {connectionState.clientSeq}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Server SEQ:</span> {connectionState.serverSeq}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Client ACK:</span> {connectionState.clientAck}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Server ACK:</span> {connectionState.serverAck}
                </div>
              </div>
            </div>
          </div>

          {/* Packet Visualization */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">TCP Packet Flow</h2>
            
            <div className="space-y-4">
              {packets.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No packets sent yet. Start with the Three-Way Handshake.
                </div>
              ) : (
                <div className="space-y-3">
                  {packets.map((packet, index) => {
                    const isClientToServer = packet.sourcePort === 12345;
                    
                    return (
                      <div key={index} className={`flex items-center space-x-4 p-4 rounded-lg border-2 ${
                        index === currentStep ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
                      }`}>
                        {/* Direction Arrow */}
                        <div className="flex items-center space-x-2 w-32">
                          <div className={`w-3 h-3 rounded-full ${isClientToServer ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                          <div className="flex-1 h-0.5 bg-gray-400"></div>
                          <div className={`w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent ${
                            isClientToServer ? 'border-b-blue-500' : 'border-b-green-500'
                          }`}></div>
                        </div>

                        {/* Packet Details */}
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-800">
                            {isClientToServer ? 'Client → Server' : 'Server → Client'}
                          </div>
                          <div className="text-xs text-gray-600">
                            SEQ: {packet.sequenceNumber}, ACK: {packet.acknowledgmentNumber}, WIN: {packet.windowSize}
                          </div>
                          <div className="text-xs text-gray-600">
                            <span className="font-medium">Flags:</span> {getFlagString(packet.flags)}
                          </div>
                          {packet.data && (
                            <div className="text-xs text-blue-600">
                              <span className="font-medium">Data:</span> "{packet.data}"
                            </div>
                          )}
                        </div>

                        {/* Step Number */}
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {packets.length > 0 && (
                <div className="flex justify-center items-center space-x-4 mt-6">
                  <button
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Step {currentStep + 1} of {packets.length}
                  </span>
                  <button
                    onClick={() => setCurrentStep(Math.min(packets.length - 1, currentStep + 1))}
                    disabled={currentStep === packets.length - 1}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* TCP Header Structure */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">TCP Header Structure</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-2 py-1 w-16">Bits</th>
                  <th className="border border-gray-300 px-2 py-1">0-15</th>
                  <th className="border border-gray-300 px-2 py-1">16-31</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-2 py-1 font-medium">0-31</td>
                  <td className="border border-gray-300 px-2 py-1 bg-blue-100">Source Port</td>
                  <td className="border border-gray-300 px-2 py-1 bg-green-100">Destination Port</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-2 py-1 font-medium">32-63</td>
                  <td className="border border-gray-300 px-2 py-1 bg-yellow-100" colSpan={2}>Sequence Number</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-2 py-1 font-medium">64-95</td>
                  <td className="border border-gray-300 px-2 py-1 bg-purple-100" colSpan={2}>Acknowledgment Number</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-2 py-1 font-medium">96-127</td>
                  <td className="border border-gray-300 px-2 py-1 bg-red-100">Header Length + Flags</td>
                  <td className="border border-gray-300 px-2 py-1 bg-orange-100">Window Size</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-2 py-1 font-medium">128-159</td>
                  <td className="border border-gray-300 px-2 py-1 bg-pink-100">Checksum</td>
                  <td className="border border-gray-300 px-2 py-1 bg-cyan-100">Urgent Pointer</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-2 py-1 font-medium">160+</td>
                  <td className="border border-gray-300 px-2 py-1 bg-gray-100" colSpan={2}>Options & Data</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* TCP Characteristics */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">TCP Characteristics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-3">Advantages</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Guaranteed reliable delivery</li>
                <li>• Ordered data transmission</li>
                <li>• Flow control mechanism</li>
                <li>• Congestion control</li>
                <li>• Error detection and correction</li>
                <li>• Full-duplex communication</li>
              </ul>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-800 mb-3">Disadvantages</h3>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Higher overhead (20+ byte header)</li>
                <li>• Connection setup latency</li>
                <li>• More complex implementation</li>
                <li>• Slower than UDP</li>
                <li>• Not suitable for real-time apps</li>
                <li>• Connection state maintenance</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Common TCP Use Cases</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Web Browsing (HTTP/HTTPS)</h3>
              <p className="text-sm text-blue-600">Reliable delivery of web pages and resources</p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">File Transfer (FTP/SFTP)</h3>
              <p className="text-sm text-green-600">Ensures complete and accurate file transfers</p>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-800 mb-2">Email (SMTP/POP3/IMAP)</h3>
              <p className="text-sm text-purple-600">Reliable email transmission and retrieval</p>
            </div>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="font-semibold text-orange-800 mb-2">Remote Access (SSH/Telnet)</h3>
              <p className="text-sm text-orange-600">Secure and reliable remote terminal access</p>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">Database Connections</h3>
              <p className="text-sm text-yellow-600">Reliable data transactions and queries</p>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-800 mb-2">API Communications</h3>
              <p className="text-sm text-red-600">Reliable REST and web service communications</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
