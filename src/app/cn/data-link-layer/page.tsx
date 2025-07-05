"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Shield, CheckCircle, AlertTriangle, RefreshCw } from "lucide-react";

export default function DataLinkLayerPage() {
  const [selectedTopic, setSelectedTopic] = useState("error-detection");
  const [crcInput, setCrcInput] = useState("1011011");
  const [crcPolynomial, setCrcPolynomial] = useState("1101");
  const [hammingData, setHammingData] = useState("1011");

  const topics = [
    {
      id: "error-detection",
      title: "Error Detection",
      icon: CheckCircle,
      description: "Parity, CRC, and checksum algorithms",
      interactive: true
    },
    {
      id: "error-correction",
      title: "Error Correction",
      icon: RefreshCw,
      description: "Hamming code and forward error correction",
      interactive: true
    },
    {
      id: "flow-control",
      title: "Flow Control",
      icon: Shield,
      description: "Stop-and-wait, sliding window protocols",
      interactive: false
    }
  ];

  const performCRC = (data: string, polynomial: string) => {
    // Convert strings to arrays for easier manipulation
    let dataArray = data.split('').map(Number);
    let polyArray = polynomial.split('').map(Number);
    
    // Append zeros equal to degree of polynomial - 1
    const degree = polyArray.length - 1;
    for (let i = 0; i < degree; i++) {
      dataArray.push(0);
    }
    
    let steps = [];
    steps.push(`Initial data with ${degree} zeros appended: ${dataArray.join('')}`);
    
    // Perform division
    for (let i = 0; i <= dataArray.length - polyArray.length; i++) {
      if (dataArray[i] === 1) {
        steps.push(`Step ${steps.length}: Dividing at position ${i}`);
        for (let j = 0; j < polyArray.length; j++) {
          dataArray[i + j] = dataArray[i + j] ^ polyArray[j];
        }
        steps.push(`After XOR: ${dataArray.join('')}`);
      }
    }
    
    // Extract remainder
    const remainder = dataArray.slice(-degree).join('');
    steps.push(`Final remainder: ${remainder}`);
    
    return { remainder, steps };
  };

  const generateHammingCode = (data: string) => {
    const dataBits = data.split('').map(Number);
    const m = dataBits.length;
    
    // Calculate number of parity bits needed
    let r = 0;
    while (Math.pow(2, r) < m + r + 1) {
      r++;
    }
    
    // Create array for encoded data
    const encoded = new Array(m + r);
    let dataIndex = 0;
    
    // Place data bits (skip parity positions)
    for (let i = 0; i < encoded.length; i++) {
      if (Math.log2(i + 1) % 1 !== 0) { // Not a power of 2
        encoded[i] = dataBits[dataIndex++];
      }
    }
    
    // Calculate parity bits
    const steps = [];
    for (let i = 0; i < r; i++) {
      const parityPosition = Math.pow(2, i) - 1;
      let parity = 0;
      
      let positions = [];
      for (let j = parityPosition; j < encoded.length; j += Math.pow(2, i + 1)) {
        for (let k = 0; k < Math.pow(2, i) && j + k < encoded.length; k++) {
          if (j + k !== parityPosition && encoded[j + k] !== undefined) {
            parity ^= encoded[j + k];
            positions.push(j + k + 1); // 1-indexed for display
          }
        }
      }
      
      encoded[parityPosition] = parity;
      steps.push({
        position: parityPosition + 1,
        checkingPositions: positions,
        parityValue: parity
      });
    }
    
    return { encoded: encoded.join(''), steps, parityPositions: Array.from({length: r}, (_, i) => Math.pow(2, i)) };
  };

  const crcResult = performCRC(crcInput, crcPolynomial);
  const hammingResult = generateHammingCode(hammingData);

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
              <Shield className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Data Link Layer</h1>
              <p className="text-blue-100 text-lg">Error detection, correction, and flow control mechanisms</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Key Concepts</h3>
              <p className="text-sm text-blue-100">CRC, Hamming codes, sliding window protocols</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Applications</h3>
              <p className="text-sm text-blue-100">Ethernet, Wi-Fi, reliable data transmission</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Exam Focus</h3>
              <p className="text-sm text-blue-100">CRC calculations, Hamming code construction, protocol analysis</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Topic Navigation */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Data Link Layer Topics</h2>
          
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
                  <div className="flex items-center justify-between mb-2">
                    <IconComponent className="h-8 w-8 text-blue-600" />
                    {topic.interactive && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Interactive</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">{topic.title}</h3>
                  <p className="text-sm text-gray-600">{topic.description}</p>
                </button>
              );
            })}
          </div>

          {/* Selected Topic Content */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              {selectedTopicData?.title} Details
            </h3>
            
            {selectedTopic === "error-detection" && (
              <div className="space-y-8">
                {/* CRC Interactive Calculator */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">CRC (Cyclic Redundancy Check) Calculator</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Data Bits</label>
                          <input
                            type="text"
                            value={crcInput}
                            onChange={(e) => setCrcInput(e.target.value.replace(/[^01]/g, ''))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter binary data"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Generator Polynomial</label>
                          <input
                            type="text"
                            value={crcPolynomial}
                            onChange={(e) => setCrcPolynomial(e.target.value.replace(/[^01]/g, ''))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter polynomial"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <h5 className="font-semibold text-blue-800 mb-2">CRC Result</h5>
                        <div className="text-sm space-y-1">
                          <div><span className="font-medium">Data:</span> {crcInput}</div>
                          <div><span className="font-medium">Polynomial:</span> {crcPolynomial}</div>
                          <div><span className="font-medium">CRC Remainder:</span> {crcResult.remainder}</div>
                          <div><span className="font-medium">Transmitted Data:</span> {crcInput + crcResult.remainder}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-3">Calculation Steps</h5>
                      <div className="max-h-64 overflow-y-auto bg-gray-100 p-3 rounded text-sm font-mono">
                        {crcResult.steps.map((step, index) => (
                          <div key={index} className="mb-1">{step}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Error Detection Methods */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Error Detection Methods</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div className="border border-gray-200 rounded p-4">
                        <h5 className="font-semibold text-blue-700 mb-2">Parity Check</h5>
                        <p className="text-sm text-gray-600 mb-2">Adds extra bit to make total 1s even or odd</p>
                        <div className="text-xs space-y-1">
                          <div><span className="font-medium">Even Parity:</span> Total 1s = even number</div>
                          <div><span className="font-medium">Odd Parity:</span> Total 1s = odd number</div>
                          <div><span className="font-medium">Detection:</span> Single bit errors</div>
                          <div><span className="font-medium">Limitation:</span> Cannot detect even number of errors</div>
                        </div>
                      </div>
                      
                      <div className="border border-gray-200 rounded p-4">
                        <h5 className="font-semibold text-green-700 mb-2">Checksum</h5>
                        <p className="text-sm text-gray-600 mb-2">Sum of data words, complement sent</p>
                        <div className="text-xs space-y-1">
                          <div><span className="font-medium">Process:</span> Add all data, send 1s complement</div>
                          <div><span className="font-medium">Verification:</span> Add received data + checksum = all 1s</div>
                          <div><span className="font-medium">Used in:</span> TCP, UDP, IP headers</div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="border border-gray-200 rounded p-4">
                        <h5 className="font-semibold text-purple-700 mb-2">CRC Properties</h5>
                        <div className="text-xs space-y-1">
                          <div><span className="font-medium">Detection Capability:</span></div>
                          <div>• All single bit errors</div>
                          <div>• All double bit errors</div>
                          <div>• All odd number of errors (if generator has factor (x+1))</div>
                          <div>• All burst errors ≤ degree of polynomial</div>
                          <div>• Most burst errors {'>'}  degree of polynomial</div>
                          <div className="mt-2"><span className="font-medium">Common Polynomials:</span></div>
                          <div>• CRC-8: x⁸ + x² + x + 1</div>
                          <div>• CRC-16: x¹⁶ + x¹⁵ + x² + 1</div>
                          <div>• CRC-32: x³² + x²⁶ + x²³ + ... + 1</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedTopic === "error-correction" && (
              <div className="space-y-8">
                {/* Hamming Code Interactive Calculator */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Hamming Code Generator</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Data Bits</label>
                        <input
                          type="text"
                          value={hammingData}
                          onChange={(e) => setHammingData(e.target.value.replace(/[^01]/g, ''))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter binary data"
                        />
                      </div>
                      
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h5 className="font-semibold text-green-800 mb-2">Hamming Code Result</h5>
                        <div className="text-sm space-y-1">
                          <div><span className="font-medium">Original Data:</span> {hammingData}</div>
                          <div><span className="font-medium">Data bits (m):</span> {hammingData.length}</div>
                          <div><span className="font-medium">Parity bits (r):</span> {hammingResult.parityPositions.length}</div>
                          <div><span className="font-medium">Encoded Data:</span> {hammingResult.encoded}</div>
                          <div><span className="font-medium">Parity Positions:</span> {hammingResult.parityPositions.join(', ')}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-3">Parity Calculation Steps</h5>
                      <div className="max-h-64 overflow-y-auto space-y-2">
                        {hammingResult.steps.map((step, index) => (
                          <div key={index} className="bg-gray-100 p-3 rounded text-sm">
                            <div className="font-medium">Parity bit P{step.position}:</div>
                            <div>Checking positions: {step.checkingPositions.join(', ')}</div>
                            <div>Parity value: {step.parityValue}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Error Correction Theory */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Error Correction Concepts</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-semibold text-blue-700 mb-3">Hamming Code Properties</h5>
                      <div className="text-sm space-y-2">
                        <div><span className="font-medium">Minimum Distance:</span> 3 (can correct 1 error)</div>
                        <div><span className="font-medium">Parity Positions:</span> Powers of 2 (1, 2, 4, 8, ...)</div>
                        <div><span className="font-medium">Formula:</span> 2ʳ ≥ m + r + 1</div>
                        <div><span className="font-medium">Where:</span> m = data bits, r = parity bits</div>
                      </div>
                      
                      <div className="mt-4 p-3 bg-blue-50 rounded">
                        <h6 className="font-medium text-blue-800 mb-2">Error Correction Process:</h6>
                        <ol className="text-xs text-blue-700 space-y-1">
                          <li>1. Calculate syndrome by checking all parity bits</li>
                          <li>2. Syndrome = 0: No error detected</li>
                          <li>3. Syndrome ≠ 0: Error at position indicated by syndrome</li>
                          <li>4. Flip the bit at error position to correct</li>
                        </ol>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-semibold text-green-700 mb-3">Forward Error Correction (FEC)</h5>
                      <div className="text-sm space-y-2">
                        <div><span className="font-medium">Concept:</span> Add redundancy to detect and correct errors</div>
                        <div><span className="font-medium">Advantage:</span> No retransmission needed</div>
                        <div><span className="font-medium">Disadvantage:</span> Higher overhead</div>
                      </div>
                      
                      <div className="mt-4">
                        <h6 className="font-medium text-gray-700 mb-2">Other FEC Codes:</h6>
                        <div className="space-y-2 text-xs">
                          <div className="border rounded p-2">
                            <div className="font-medium">Reed-Solomon Codes</div>
                            <div>Used in: CDs, DVDs, QR codes</div>
                            <div>Capability: Burst error correction</div>
                          </div>
                          <div className="border rounded p-2">
                            <div className="font-medium">Convolutional Codes</div>
                            <div>Used in: Satellite communication, mobile networks</div>
                            <div>Capability: Sequential decoding</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedTopic === "flow-control" && (
              <div className="space-y-8">
                {/* Flow Control Protocols */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Flow Control Protocols</h4>
                  
                  <div className="space-y-6">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h5 className="font-semibold text-purple-700 mb-3">Stop-and-Wait Protocol</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-3">Sender waits for acknowledgment before sending next frame</p>
                          <div className="text-xs space-y-1">
                            <div><span className="font-medium">Process:</span></div>
                            <div>1. Send frame and start timer</div>
                            <div>2. Wait for ACK</div>
                            <div>3. If ACK received: send next frame</div>
                            <div>4. If timeout: retransmit frame</div>
                          </div>
                        </div>
                        <div>
                          <div className="bg-gray-100 p-3 rounded">
                            <div className="text-xs font-medium mb-2">Efficiency Calculation:</div>
                            <div className="text-xs font-mono">
                              η = T_transmission / (T_transmission + 2 × T_propagation)
                            </div>
                            <div className="text-xs mt-2">
                              <div><span className="font-medium">Where:</span></div>
                              <div>T_transmission = L/B (frame size/bandwidth)</div>
                              <div>T_propagation = d/s (distance/speed)</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h5 className="font-semibold text-blue-700 mb-3">Sliding Window Protocol</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-3">Multiple frames can be in transit simultaneously</p>
                          <div className="text-xs space-y-1">
                            <div><span className="font-medium">Window Size (W):</span> Max unacknowledged frames</div>
                            <div><span className="font-medium">Go-Back-N:</span> Retransmit from error frame</div>
                            <div><span className="font-medium">Selective Repeat:</span> Retransmit only error frames</div>
                            <div><span className="font-medium">Sequence Numbers:</span> 2^n for n-bit field</div>
                          </div>
                        </div>
                        <div>
                          <div className="bg-gray-100 p-3 rounded">
                            <div className="text-xs font-medium mb-2">Efficiency Calculation:</div>
                            <div className="text-xs font-mono">
                              η = min(W, 1 + 2a) / (1 + 2a)
                            </div>
                            <div className="text-xs mt-2">
                              <div><span className="font-medium">Where:</span></div>
                              <div>a = T_propagation / T_transmission</div>
                              <div>W = window size</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Example Calculation */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Sample Calculation</h4>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h5 className="font-semibold text-yellow-800 mb-2">Problem:</h5>
                    <p className="text-sm text-yellow-700 mb-3">
                      Calculate efficiency of Stop-and-Wait protocol given:
                      Frame size = 1000 bits, Bandwidth = 1 Mbps, Distance = 2000 km, Speed = 2×10⁸ m/s
                    </p>
                    
                    <div className="bg-white rounded p-3">
                      <div className="text-sm space-y-2">
                        <div><span className="font-medium">Step 1:</span> Calculate transmission time</div>
                        <div className="font-mono text-xs">T_trans = 1000 bits / 1×10⁶ bps = 1 ms</div>
                        
                        <div><span className="font-medium">Step 2:</span> Calculate propagation time</div>
                        <div className="font-mono text-xs">T_prop = 2×10⁶ m / 2×10⁸ m/s = 10 ms</div>
                        
                        <div><span className="font-medium">Step 3:</span> Calculate efficiency</div>
                        <div className="font-mono text-xs">η = 1 / (1 + 2×10) = 1/21 = 4.76%</div>
                        
                        <div className="mt-2 p-2 bg-blue-50 rounded">
                          <span className="font-medium text-blue-800">Result: </span>
                          <span className="text-blue-700">Efficiency = 4.76% (very low due to long propagation delay)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Exam Tips */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">📝 Exam Preparation Tips</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-3">Key Topics to Master</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Practice CRC division step-by-step</li>
                <li>• Master Hamming code construction and error correction</li>
                <li>• Understand sliding window protocols and efficiency</li>
                <li>• Know error detection vs correction trade-offs</li>
                <li>• Calculate protocol efficiency for different scenarios</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-3">Common Exam Questions</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• "Calculate CRC for given data and polynomial" (8 marks)</li>
                <li>• "Generate Hamming code for 4-bit data" (6 marks)</li>
                <li>• "Find efficiency of sliding window protocol" (5 marks)</li>
                <li>• "Compare Go-Back-N vs Selective Repeat" (6 marks)</li>
                <li>• "Correct error using Hamming code" (4 marks)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
