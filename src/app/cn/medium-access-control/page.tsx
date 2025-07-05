"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Network, Radio, Users, BarChart3 } from "lucide-react";

export default function MediumAccessControlPage() {
  const [selectedTopic, setSelectedTopic] = useState("aloha");
  const [throughputG, setThroughputG] = useState(0.5);

  const topics = [
    {
      id: "aloha",
      title: "ALOHA Protocols",
      icon: Radio,
      description: "Pure and Slotted ALOHA performance analysis",
      interactive: true
    },
    {
      id: "csma",
      title: "CSMA Protocols", 
      icon: Users,
      description: "Carrier sense multiple access with collision detection",
      interactive: false
    },
    {
      id: "token-ring",
      title: "Token Ring",
      icon: Network,
      description: "Token passing protocol and ring topology",
      interactive: false
    }
  ];

  // ALOHA throughput calculations
  const pureAlohaS = throughputG * Math.exp(-2 * throughputG);
  const slottedAlohaS = throughputG * Math.exp(-throughputG);

  const selectedTopicData = topics.find(t => t.id === selectedTopic);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/cn" className="inline-flex items-center text-purple-200 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Computer Networks
          </Link>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-white/20 p-3 rounded-xl">
              <Network className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Medium Access Control</h1>
              <p className="text-purple-100 text-lg">Channel access methods and collision resolution protocols</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Key Concepts</h3>
              <p className="text-sm text-purple-100">ALOHA, CSMA/CD, token passing, collision detection</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Applications</h3>
              <p className="text-sm text-purple-100">Ethernet, Wi-Fi, satellite networks, token ring LANs</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Exam Focus</h3>
              <p className="text-sm text-purple-100">Throughput calculations, protocol comparison, efficiency analysis</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Topic Navigation */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">MAC Protocol Topics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {topics.map((topic) => {
              const IconComponent = topic.icon;
              return (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedTopic === topic.id 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <IconComponent className="h-8 w-8 text-purple-600" />
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
            
            {selectedTopic === "aloha" && (
              <div className="space-y-8">
                {/* Interactive ALOHA Calculator */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">ALOHA Throughput Calculator</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Offered Load (G)
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="2"
                          step="0.1"
                          value={throughputG}
                          onChange={(e) => setThroughputG(parseFloat(e.target.value))}
                          className="w-full"
                        />
                        <div className="text-sm text-gray-600 mt-1">G = {throughputG}</div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <h5 className="font-semibold text-blue-800 mb-2">Pure ALOHA</h5>
                          <div className="text-sm space-y-1">
                            <div><span className="font-medium">Formula:</span> S = G × e^(-2G)</div>
                            <div><span className="font-medium">Throughput (S):</span> {pureAlohaS.toFixed(4)}</div>
                            <div><span className="font-medium">Maximum S:</span> 0.184 at G = 0.5</div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-green-50 rounded-lg">
                          <h5 className="font-semibold text-green-800 mb-2">Slotted ALOHA</h5>
                          <div className="text-sm space-y-1">
                            <div><span className="font-medium">Formula:</span> S = G × e^(-G)</div>
                            <div><span className="font-medium">Throughput (S):</span> {slottedAlohaS.toFixed(4)}</div>
                            <div><span className="font-medium">Maximum S:</span> 0.368 at G = 1</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-3">Throughput Comparison</h5>
                      <div className="bg-gray-100 p-4 rounded-lg">
                        <BarChart3 className="h-32 w-full text-gray-400" />
                        <div className="text-center text-sm text-gray-600 mt-2">
                          Throughput vs Offered Load Graph
                        </div>
                      </div>
                      
                      <div className="mt-4 space-y-2">
                        <div className="text-sm">
                          <span className="font-medium">Current Performance:</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Pure ALOHA:</span>
                          <span className="font-mono">{(pureAlohaS * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Slotted ALOHA:</span>
                          <span className="font-mono">{(slottedAlohaS * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between text-sm font-medium">
                          <span>Improvement:</span>
                          <span className="font-mono text-green-600">
                            {((slottedAlohaS / pureAlohaS - 1) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ALOHA Protocol Details */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">ALOHA Protocol Comparison</h4>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-4 py-2 text-left">Aspect</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Pure ALOHA</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Slotted ALOHA</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2 font-medium">Transmission</td>
                          <td className="border border-gray-300 px-4 py-2">Anytime</td>
                          <td className="border border-gray-300 px-4 py-2">Only at slot boundaries</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2 font-medium">Vulnerable Period</td>
                          <td className="border border-gray-300 px-4 py-2">2 × Frame time</td>
                          <td className="border border-gray-300 px-4 py-2">1 × Frame time</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2 font-medium">Maximum Throughput</td>
                          <td className="border border-gray-300 px-4 py-2">18.4%</td>
                          <td className="border border-gray-300 px-4 py-2">36.8%</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2 font-medium">Synchronization</td>
                          <td className="border border-gray-300 px-4 py-2">Not required</td>
                          <td className="border border-gray-300 px-4 py-2">Required</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2 font-medium">Complexity</td>
                          <td className="border border-gray-300 px-4 py-2">Simple</td>
                          <td className="border border-gray-300 px-4 py-2">Moderate</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2 font-medium">Applications</td>
                          <td className="border border-gray-300 px-4 py-2">Early satellite networks</td>
                          <td className="border border-gray-300 px-4 py-2">RFID, some wireless systems</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {selectedTopic === "csma" && (
              <div className="space-y-8">
                {/* CSMA Protocol Types */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">CSMA Protocol Variants</h4>
                  
                  <div className="space-y-6">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h5 className="font-semibold text-blue-700 mb-3">CSMA (Carrier Sense Multiple Access)</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-3">Listen before transmit principle</p>
                          <div className="text-xs space-y-1">
                            <div><span className="font-medium">1-persistent:</span> Transmit immediately when channel free</div>
                            <div><span className="font-medium">Non-persistent:</span> Wait random time if busy</div>
                            <div><span className="font-medium">p-persistent:</span> Transmit with probability p when free</div>
                          </div>
                        </div>
                        <div>
                          <div className="bg-blue-50 p-3 rounded">
                            <div className="text-xs font-medium mb-2">Propagation Time Impact:</div>
                            <div className="text-xs">
                              Hidden terminal problem occurs when propagation delay {'>'}  0
                              Efficiency depends on ratio a = τ/T (propagation/transmission time)
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h5 className="font-semibold text-green-700 mb-3">CSMA/CD (Collision Detection)</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-3">Detects collisions and stops transmission</p>
                          <div className="text-xs space-y-1">
                            <div><span className="font-medium">Process:</span></div>
                            <div>1. Listen before transmit</div>
                            <div>2. Listen while transmitting</div>
                            <div>3. If collision detected, send jam signal</div>
                            <div>4. Backoff using binary exponential algorithm</div>
                          </div>
                        </div>
                        <div>
                          <div className="bg-green-50 p-3 rounded">
                            <div className="text-xs font-medium mb-2">Binary Exponential Backoff:</div>
                            <div className="text-xs">
                              After i-th collision, wait random time from [0, 2^min(i,10) - 1] × slot time
                              Maximum attempts: 16, then frame dropped
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h5 className="font-semibold text-purple-700 mb-3">CSMA/CA (Collision Avoidance)</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-3">Tries to avoid collisions (used in wireless)</p>
                          <div className="text-xs space-y-1">
                            <div><span className="font-medium">RTS/CTS:</span> Request/Clear to Send handshake</div>
                            <div><span className="font-medium">NAV:</span> Network Allocation Vector</div>
                            <div><span className="font-medium">Hidden Terminal:</span> Solved by RTS/CTS</div>
                            <div><span className="font-medium">Exposed Terminal:</span> Reduced interference</div>
                          </div>
                        </div>
                        <div>
                          <div className="bg-purple-50 p-3 rounded">
                            <div className="text-xs font-medium mb-2">CSMA/CA Process:</div>
                            <div className="text-xs">
                              1. DIFS wait → 2. Random backoff → 3. RTS → 4. CTS → 
                              5. Data → 6. ACK → 7. SIFS between frames
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ethernet Frame Format */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Ethernet Frame Format (IEEE 802.3)</h4>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 text-sm">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-3 py-2">Field</th>
                          <th className="border border-gray-300 px-3 py-2">Size (bytes)</th>
                          <th className="border border-gray-300 px-3 py-2">Purpose</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 px-3 py-2 font-medium">Preamble</td>
                          <td className="border border-gray-300 px-3 py-2">7</td>
                          <td className="border border-gray-300 px-3 py-2">Clock synchronization (10101010)</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-3 py-2 font-medium">SFD</td>
                          <td className="border border-gray-300 px-3 py-2">1</td>
                          <td className="border border-gray-300 px-3 py-2">Start Frame Delimiter (10101011)</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-3 py-2 font-medium">Dest Address</td>
                          <td className="border border-gray-300 px-3 py-2">6</td>
                          <td className="border border-gray-300 px-3 py-2">MAC address of destination</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-3 py-2 font-medium">Source Address</td>
                          <td className="border border-gray-300 px-3 py-2">6</td>
                          <td className="border border-gray-300 px-3 py-2">MAC address of source</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-3 py-2 font-medium">Length/Type</td>
                          <td className="border border-gray-300 px-3 py-2">2</td>
                          <td className="border border-gray-300 px-3 py-2">Frame length or EtherType</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-3 py-2 font-medium">Data + Padding</td>
                          <td className="border border-gray-300 px-3 py-2">46-1500</td>
                          <td className="border border-gray-300 px-3 py-2">Payload (min 46 bytes)</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-3 py-2 font-medium">FCS</td>
                          <td className="border border-gray-300 px-3 py-2">4</td>
                          <td className="border border-gray-300 px-3 py-2">Frame Check Sequence (CRC-32)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                      <h5 className="font-semibold text-yellow-800 mb-2">Key Parameters:</h5>
                      <div className="text-xs text-yellow-700 space-y-1">
                        <div>• Minimum frame size: 64 bytes (512 bits)</div>
                        <div>• Maximum frame size: 1518 bytes</div>
                        <div>• Slot time: 512 bit times</div>
                        <div>• Jam sequence: 32 bits</div>
                      </div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded p-3">
                      <h5 className="font-semibold text-blue-800 mb-2">Collision Domain:</h5>
                      <div className="text-xs text-blue-700 space-y-1">
                        <div>• Hub-based: Single collision domain</div>
                        <div>• Switch-based: Each port = separate domain</div>
                        <div>• Full-duplex: No collisions possible</div>
                        <div>• CSMA/CD not needed in switched networks</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedTopic === "token-ring" && (
              <div className="space-y-8">
                {/* Token Ring Protocol */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Token Ring Protocol (IEEE 802.5)</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-semibold text-blue-700 mb-3">Protocol Operation</h5>
                      <div className="text-sm space-y-2">
                        <div><span className="font-medium">Token Circulation:</span> Free token circulates around ring</div>
                        <div><span className="font-medium">Frame Transmission:</span> Station captures token, sends data</div>
                        <div><span className="font-medium">Token Release:</span> After sending, release new token</div>
                        <div><span className="font-medium">Frame Removal:</span> Sender removes its frame from ring</div>
                      </div>
                      
                      <div className="mt-4 p-3 bg-blue-50 rounded">
                        <h6 className="font-medium text-blue-800 mb-2">Token Format (3 bytes):</h6>
                        <div className="text-xs text-blue-700 space-y-1">
                          <div>• Starting Delimiter (1 byte): J K 0 J K 0 0 0</div>
                          <div>• Access Control (1 byte): P P P T M R R R</div>
                          <div>• Ending Delimiter (1 byte): J K 1 J K 1 I E</div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-semibold text-green-700 mb-3">Frame Format</h5>
                      <div className="text-xs space-y-2">
                        <div className="border rounded p-2">
                          <div className="font-medium">Data Frame Fields:</div>
                          <div>• Starting Delimiter (1 byte)</div>
                          <div>• Access Control (1 byte)</div>
                          <div>• Frame Control (1 byte)</div>
                          <div>• Destination Address (2-6 bytes)</div>
                          <div>• Source Address (2-6 bytes)</div>
                          <div>• Data (variable length)</div>
                          <div>• Frame Check Sequence (4 bytes)</div>
                          <div>• Ending Delimiter (1 byte)</div>
                          <div>• Frame Status (1 byte)</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Token Ring Features */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Token Ring Features & Mechanisms</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="border border-gray-200 rounded p-4">
                        <h5 className="font-semibold text-purple-700 mb-2">Priority Mechanism</h5>
                        <div className="text-xs space-y-1">
                          <div>• 8 priority levels (0-7)</div>
                          <div>• Higher priority frames can reserve token</div>
                          <div>• Reservation field in access control</div>
                          <div>• Station must wait for appropriate priority token</div>
                        </div>
                      </div>
                      
                      <div className="border border-gray-200 rounded p-4">
                        <h5 className="font-semibold text-orange-700 mb-2">Ring Maintenance</h5>
                        <div className="text-xs space-y-1">
                          <div>• Active Monitor: Ring monitoring station</div>
                          <div>• Standby Monitors: Backup monitoring stations</div>
                          <div>• Ring purge: Remove corrupted frames/tokens</div>
                          <div>• Neighbor notification: Detect link failures</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="border border-gray-200 rounded p-4">
                        <h5 className="font-semibold text-red-700 mb-2">Error Recovery</h5>
                        <div className="text-xs space-y-1">
                          <div>• Lost token: Active monitor generates new token</div>
                          <div>• Duplicate token: Remove extra tokens</div>
                          <div>• Orphan frame: Remove frames without owner</div>
                          <div>• Ring purge: Clear all frames and generate token</div>
                        </div>
                      </div>
                      
                      <div className="border border-gray-200 rounded p-4">
                        <h5 className="font-semibold text-indigo-700 mb-2">Performance</h5>
                        <div className="text-xs space-y-1">
                          <div>• Deterministic access time</div>
                          <div>• No collisions</div>
                          <div>• Efficiency decreases with ring size</div>
                          <div>• Maximum throughput approaches channel capacity</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Token Ring vs Ethernet */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Token Ring vs Ethernet Comparison</h4>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-4 py-2 text-left">Aspect</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Token Ring</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Ethernet</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2 font-medium">Topology</td>
                          <td className="border border-gray-300 px-4 py-2">Ring (logical)</td>
                          <td className="border border-gray-300 px-4 py-2">Bus/Star</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2 font-medium">Access Method</td>
                          <td className="border border-gray-300 px-4 py-2">Token passing</td>
                          <td className="border border-gray-300 px-4 py-2">CSMA/CD</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2 font-medium">Collisions</td>
                          <td className="border border-gray-300 px-4 py-2">None</td>
                          <td className="border border-gray-300 px-4 py-2">Possible</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2 font-medium">Deterministic</td>
                          <td className="border border-gray-300 px-4 py-2">Yes</td>
                          <td className="border border-gray-300 px-4 py-2">No</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2 font-medium">Priority Support</td>
                          <td className="border border-gray-300 px-4 py-2">Built-in</td>
                          <td className="border border-gray-300 px-4 py-2">Limited</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2 font-medium">Fault Tolerance</td>
                          <td className="border border-gray-300 px-4 py-2">Dual ring</td>
                          <td className="border border-gray-300 px-4 py-2">Switch redundancy</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2 font-medium">Cost</td>
                          <td className="border border-gray-300 px-4 py-2">Higher</td>
                          <td className="border border-gray-300 px-4 py-2">Lower</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2 font-medium">Market Adoption</td>
                          <td className="border border-gray-300 px-4 py-2">Obsolete</td>
                          <td className="border border-gray-300 px-4 py-2">Dominant</td>
                        </tr>
                      </tbody>
                    </table>
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
                <li>• Calculate ALOHA throughput for different offered loads</li>
                <li>• Understand CSMA/CD binary exponential backoff</li>
                <li>• Know token ring frame format and priority mechanism</li>
                <li>• Compare efficiency of different MAC protocols</li>
                <li>• Analyze collision domains and broadcast domains</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-3">Common Exam Questions</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• "Calculate maximum throughput of Slotted ALOHA" (4 marks)</li>
                <li>• "Explain CSMA/CD operation with timing diagram" (6 marks)</li>
                <li>• "Compare token ring vs Ethernet protocols" (8 marks)</li>
                <li>• "Analyze binary exponential backoff algorithm" (5 marks)</li>
                <li>• "Draw and explain token ring frame format" (4 marks)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
