"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
}

interface ConnectionState {
  state: string;
  clientSeq: number;
  serverSeq: number;
  clientAck: number;
  serverAck: number;
  windowSize: number;
}

export default function TCPFlowControlPage() {
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
      {
        sourcePort: 12345,
        destPort: 80,
        sequenceNumber: connectionState.clientSeq,
        acknowledgmentNumber: 0,
        windowSize: windowSize,
        flags: { SYN: true, ACK: false, FIN: false, RST: false, PSH: false, URG: false },
        data: ""
      },
      {
        sourcePort: 80,
        destPort: 12345,
        sequenceNumber: connectionState.serverSeq,
        acknowledgmentNumber: connectionState.clientSeq + 1,
        windowSize: windowSize,
        flags: { SYN: true, ACK: true, FIN: false, RST: false, PSH: false, URG: false },
        data: ""
      },
      {
        sourcePort: 12345,
        destPort: 80,
        sequenceNumber: connectionState.clientSeq + 1,
        acknowledgmentNumber: connectionState.serverSeq + 1,
        windowSize: windowSize,
        flags: { SYN: false, ACK: true, FIN: false, RST: false, PSH: false, URG: false },
        data: ""
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
      data: dataToSend
    });

    // ACK from server
    dataPackets.push({
      sourcePort: 80,
      destPort: 12345,
      sequenceNumber: connectionState.serverSeq,
      acknowledgmentNumber: connectionState.clientSeq + dataToSend.length,
      windowSize: windowSize,
      flags: { SYN: false, ACK: true, FIN: false, RST: false, PSH: false, URG: false },
      data: ""
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
      data: ""
    });

    // ACK from server
    closingPackets.push({
      sourcePort: 80,
      destPort: 12345,
      sequenceNumber: connectionState.serverSeq,
      acknowledgmentNumber: connectionState.clientSeq + 1,
      windowSize: windowSize,
      flags: { SYN: false, ACK: true, FIN: false, RST: false, PSH: false, URG: false },
      data: ""
    });

    // FIN from server
    closingPackets.push({
      sourcePort: 80,
      destPort: 12345,
      sequenceNumber: connectionState.serverSeq,
      acknowledgmentNumber: connectionState.clientSeq + 1,
      windowSize: windowSize,
      flags: { SYN: false, ACK: true, FIN: true, RST: false, PSH: false, URG: false },
      data: ""
    });

    // Final ACK from client
    closingPackets.push({
      sourcePort: 12345,
      destPort: 80,
      sequenceNumber: connectionState.clientSeq + 1,
      acknowledgmentNumber: connectionState.serverSeq + 1,
      windowSize: windowSize,
      flags: { SYN: false, ACK: true, FIN: false, RST: false, PSH: false, URG: false },
      data: ""
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            TCP Flow Control & Connection Management
          </h1>
          <p className="text-lg text-gray-200 max-w-3xl mx-auto">
            Understand TCP&apos;s three-way handshake, data transfer with flow control, 
            and connection termination. Explore sequence numbers, acknowledgments, and window management.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls */}
          <Card>
            <CardHeader>
              <CardTitle>TCP Connection Control</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-700 border border-gray-600 p-3 rounded-lg">
                <div className="text-sm font-medium text-gray-200">Connection State</div>
                <div className={`text-lg font-bold ${
                  connectionState.state === 'ESTABLISHED' ? 'text-green-400' : 
                  connectionState.state === 'CLOSED' ? 'text-red-400' : 'text-yellow-400'
                }`}>
                  {connectionState.state}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Data to Send</label>
                <Input
                  type="text"
                  value={dataToSend}
                  onChange={(e) => setDataToSend(e.target.value)}
                  placeholder="Enter data..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Window Size</label>
                <Input
                  type="number"
                  value={windowSize}
                  onChange={(e) => setWindowSize(parseInt(e.target.value) || 1024)}
                  min="1"
                  max="65535"
                />
              </div>

              <div className="space-y-2">
                <Button 
                  onClick={simulateHandshake}
                  disabled={connectionState.state !== 'CLOSED'}
                  className="w-full"
                >
                  1. Three-Way Handshake
                </Button>
                <Button 
                  onClick={simulateDataTransfer}
                  disabled={connectionState.state !== 'ESTABLISHED'}
                  className="w-full"
                >
                  2. Send Data
                </Button>
                <Button 
                  onClick={simulateClosing}
                  disabled={connectionState.state !== 'ESTABLISHED'}
                  className="w-full"
                >
                  3. Close Connection
                </Button>
                <Button 
                  onClick={resetConnection}
                  variant="outline"
                  className="w-full"
                >
                  Reset
                </Button>
              </div>

              {/* Connection State Details */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Current State:</h3>
                <div className="bg-blue-50 p-3 rounded-lg text-xs space-y-1">
                  <div>Client SEQ: {connectionState.clientSeq}</div>
                  <div>Server SEQ: {connectionState.serverSeq}</div>
                  <div>Client ACK: {connectionState.clientAck}</div>
                  <div>Server ACK: {connectionState.serverAck}</div>
                  <div>Window Size: {connectionState.windowSize}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Packet Visualization */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>TCP Packet Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {packets.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    No packets sent yet. Start with the Three-Way Handshake.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {packets.map((packet, index) => {
                      const isClientToServer = packet.sourcePort === 12345;
                      
                      return (
                        <div key={index} className={`flex items-center space-x-4 p-4 rounded-lg border-2 ${
                          index === currentStep ? 'border-blue-500 bg-blue-800' : 'border-gray-600 bg-gray-700'
                        }`}>
                          {/* Direction Arrow */}
                          <div className="flex items-center space-x-2 w-32">
                            <div className={`w-3 h-3 rounded-full ${isClientToServer ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                            <div className="flex-1 h-0.5 bg-gray-500"></div>
                            <div className={`w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent ${
                              isClientToServer ? 'border-b-blue-500' : 'border-b-green-500'
                            }`}></div>
                          </div>

                          {/* Packet Details */}
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-200">
                              {isClientToServer ? 'Client → Server' : 'Server → Client'}
                            </div>
                            <div className="text-xs text-gray-300">
                              SEQ: {packet.sequenceNumber}, ACK: {packet.acknowledgmentNumber}, WIN: {packet.windowSize}
                            </div>
                            <div className="text-xs text-gray-300">
                              <span className="font-medium">Flags:</span> {getFlagString(packet.flags)}
                            </div>
                            {packet.data && (
                              <div className="text-xs text-blue-400">
                                <span className="font-medium">Data:</span> &quot;{packet.data}&quot;
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

                {/* Step Navigation */}
                {packets.length > 0 && (
                  <div className="flex items-center justify-between mt-6">
                    <Button
                      onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                      disabled={currentStep === 0}
                      variant="outline"
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-gray-600">
                      Step {currentStep + 1} of {packets.length}
                    </span>
                    <Button
                      onClick={() => setCurrentStep(Math.min(packets.length - 1, currentStep + 1))}
                      disabled={currentStep === packets.length - 1}
                      variant="outline"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* TCP Header Structure */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>TCP Header Structure</CardTitle>
            </CardHeader>
            <CardContent>
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
                      <td className="border border-gray-300 px-2 py-1 bg-red-100">Header Len | Reserved | Flags</td>
                      <td className="border border-gray-300 px-2 py-1 bg-orange-100">Window Size</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-2 py-1 font-medium">128-159</td>
                      <td className="border border-gray-300 px-2 py-1 bg-pink-100">Checksum</td>
                      <td className="border border-gray-300 px-2 py-1 bg-indigo-100">Urgent Pointer</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h3 className="font-semibold mb-2">TCP Flags</h3>
                  <ul className="space-y-1">
                    <li><strong>SYN:</strong> Synchronize sequence numbers (connection setup)</li>
                    <li><strong>ACK:</strong> Acknowledgment field is valid</li>
                    <li><strong>FIN:</strong> No more data (connection termination)</li>
                    <li><strong>RST:</strong> Reset the connection</li>
                    <li><strong>PSH:</strong> Push data to application</li>
                    <li><strong>URG:</strong> Urgent pointer field is valid</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Flow Control Mechanism</h3>
                  <ul className="space-y-1">
                    <li><strong>Window Size:</strong> Amount of data receiver can accept</li>
                    <li><strong>Sliding Window:</strong> Allows multiple packets in flight</li>
                    <li><strong>Back Pressure:</strong> Receiver controls sender's rate</li>
                    <li><strong>Zero Window:</strong> Receiver buffer is full</li>
                    <li><strong>Window Update:</strong> Receiver signals buffer space</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exam Notes */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Exam Important Points</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div>
                  <h3 className="font-semibold mb-3">Three-Way Handshake</h3>
                  <ol className="space-y-1">
                    <li><strong>1. SYN:</strong> Client sends SYN with initial sequence number</li>
                    <li><strong>2. SYN-ACK:</strong> Server responds with SYN+ACK</li>
                    <li><strong>3. ACK:</strong> Client acknowledges server's SYN</li>
                  </ol>
                  <p className="mt-2 text-gray-600">
                    <strong>Purpose:</strong> Synchronize sequence numbers and establish connection
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Connection Termination</h3>
                  <ol className="space-y-1">
                    <li><strong>1. FIN:</strong> Client sends FIN (active close)</li>
                    <li><strong>2. ACK:</strong> Server acknowledges FIN</li>
                    <li><strong>3. FIN:</strong> Server sends its FIN</li>
                    <li><strong>4. ACK:</strong> Client acknowledges server's FIN</li>
                  </ol>
                  <p className="mt-2 text-gray-600">
                    <strong>Note:</strong> Full-duplex closure requires both directions
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Common Exam Questions</h3>
                  <ul className="space-y-1">
                    <li>• Calculate next sequence/ACK numbers</li>
                    <li>• Identify connection states</li>
                    <li>• Draw timing diagrams</li>
                    <li>• Explain flow control mechanisms</li>
                    <li>• Compare TCP vs UDP</li>
                    <li>• Calculate effective window size</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
