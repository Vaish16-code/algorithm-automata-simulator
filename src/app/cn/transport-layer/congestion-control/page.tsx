"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Activity, TrendingUp, AlertTriangle } from "lucide-react";

export default function CongestionControlPage() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("slow-start");

  const algorithms = [
    {
      id: "slow-start",
      title: "Slow Start",
      icon: TrendingUp,
      description: "Exponential increase of congestion window",
      details: {
        purpose: "Gradually probe network capacity to avoid congestion",
        mechanism: "Double cwnd every RTT until threshold reached",
        formula: "cwnd = cwnd + 1 for each ACK received",
        phases: ["Start with cwnd = 1 MSS", "Double every RTT", "Switch to Congestion Avoidance at ssthresh"]
      }
    },
    {
      id: "congestion-avoidance",
      title: "Congestion Avoidance",
      icon: Activity,
      description: "Linear increase of congestion window",
      details: {
        purpose: "Maintain network efficiency while avoiding congestion",
        mechanism: "Increase cwnd by 1 MSS per RTT",
        formula: "cwnd = cwnd + 1/cwnd for each ACK",
        phases: ["Linear increase", "Multiplicative decrease on loss", "AIMD (Additive Increase Multiplicative Decrease)"]
      }
    },
    {
      id: "fast-retransmit",
      title: "Fast Retransmit",
      icon: AlertTriangle,
      description: "Quick loss detection and recovery",
      details: {
        purpose: "Detect and recover from packet loss quickly",
        mechanism: "Retransmit on 3 duplicate ACKs",
        formula: "Trigger on receipt of 3rd duplicate ACK",
        phases: ["Receive 3 duplicate ACKs", "Retransmit lost segment", "Enter Fast Recovery"]
      }
    }
  ];

  const selectedAlg = algorithms.find(alg => alg.id === selectedAlgorithm);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/cn/transport-layer" className="inline-flex items-center text-red-200 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Transport Layer
          </Link>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-white/20 p-3 rounded-xl">
              <Activity className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Congestion Control</h1>
              <p className="text-red-100 text-lg">TCP algorithms for network congestion management</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Key Algorithms</h3>
              <p className="text-sm text-red-100">Slow Start, Congestion Avoidance, Fast Recovery</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">TCP Variants</h3>
              <p className="text-sm text-red-100">Tahoe, Reno, NewReno, CUBIC</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Performance</h3>
              <p className="text-sm text-red-100">Optimize throughput while preventing collapse</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Algorithm Selection */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Congestion Control Algorithms</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {algorithms.map((algorithm) => {
              const IconComponent = algorithm.icon;
              return (
                <button
                  key={algorithm.id}
                  onClick={() => setSelectedAlgorithm(algorithm.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedAlgorithm === algorithm.id 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="h-8 w-8 text-red-600 mb-3" />
                  <h3 className="font-semibold text-gray-800 mb-2">{algorithm.title}</h3>
                  <p className="text-sm text-gray-600">{algorithm.description}</p>
                </button>
              );
            })}
          </div>

          {/* Algorithm Details */}
          {selectedAlg && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">{selectedAlg.title} Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-700 mb-2">Purpose</h4>
                    <p className="text-sm text-gray-600">{selectedAlg.details.purpose}</p>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-700 mb-2">Mechanism</h4>
                    <p className="text-sm text-gray-600">{selectedAlg.details.mechanism}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-700 mb-2">Formula</h4>
                    <code className="text-sm text-blue-600">{selectedAlg.details.formula}</code>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-700 mb-2">Key Phases</h4>
                    <ul className="text-sm text-green-600 space-y-1">
                      {selectedAlg.details.phases.map((phase, index) => (
                        <li key={index}>• {phase}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* TCP Variants Comparison */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">TCP Variants Comparison</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">TCP Variant</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Slow Start</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Fast Retransmit</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Fast Recovery</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Key Feature</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">TCP Tahoe</td>
                  <td className="border border-gray-300 px-4 py-2 text-green-600">✓</td>
                  <td className="border border-gray-300 px-4 py-2 text-green-600">✓</td>
                  <td className="border border-gray-300 px-4 py-2 text-red-600">✗</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">Returns to slow start on any loss</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">TCP Reno</td>
                  <td className="border border-gray-300 px-4 py-2 text-green-600">✓</td>
                  <td className="border border-gray-300 px-4 py-2 text-green-600">✓</td>
                  <td className="border border-gray-300 px-4 py-2 text-green-600">✓</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">Avoids slow start on fast retransmit</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">TCP NewReno</td>
                  <td className="border border-gray-300 px-4 py-2 text-green-600">✓</td>
                  <td className="border border-gray-300 px-4 py-2 text-green-600">✓</td>
                  <td className="border border-gray-300 px-4 py-2 text-green-600">✓</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">Improved multiple loss handling</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">TCP CUBIC</td>
                  <td className="border border-gray-300 px-4 py-2 text-green-600">✓</td>
                  <td className="border border-gray-300 px-4 py-2 text-green-600">✓</td>
                  <td className="border border-gray-300 px-4 py-2 text-green-600">✓</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">Cubic function for window growth</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Exam Tips */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">📝 Exam Preparation Tips</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-3">Key Concepts</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Congestion window (cwnd) vs receiver window (rwnd)</li>
                <li>• Slow start threshold (ssthresh)</li>
                <li>• AIMD principle (Additive Increase Multiplicative Decrease)</li>
                <li>• Difference between Tahoe and Reno</li>
                <li>• Fast retransmit triggers on 3 duplicate ACKs</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-3">Common Questions</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• "Trace TCP congestion window over time" (8 marks)</li>
                <li>• "Compare TCP Tahoe vs Reno" (6 marks)</li>
                <li>• "Explain slow start algorithm" (5 marks)</li>
                <li>• "How does fast retransmit work?" (4 marks)</li>
                <li>• "Calculate throughput with given RTT and loss" (6 marks)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
