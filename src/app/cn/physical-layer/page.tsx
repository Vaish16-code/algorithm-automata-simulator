"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Cpu, Zap, Radio, Cable } from "lucide-react";

export default function PhysicalLayerPage() {
  const [selectedTopic, setSelectedTopic] = useState("transmission-media");

  const topics = [
    {
      id: "transmission-media",
      title: "Transmission Media",
      icon: Cable,
      description: "Guided and unguided transmission media characteristics",
      content: {
        guidedMedia: [
          {
            type: "Twisted Pair Cable",
            categories: ["UTP (Unshielded)", "STP (Shielded)"],
            bandwidth: "Up to 100 MHz",
            applications: "Ethernet, Telephone systems",
            advantages: "Low cost, easy installation",
            disadvantages: "Limited bandwidth, susceptible to interference"
          },
          {
            type: "Coaxial Cable",
            categories: ["Thin coax (10Base2)", "Thick coax (10Base5)"],
            bandwidth: "Up to 1 GHz",
            applications: "Cable TV, Legacy Ethernet",
            advantages: "Higher bandwidth than twisted pair",
            disadvantages: "More expensive, rigid"
          },
          {
            type: "Fiber Optic Cable",
            categories: ["Single-mode", "Multi-mode"],
            bandwidth: "Up to 100 THz",
            applications: "Long-distance communication, Backbone networks",
            advantages: "Very high bandwidth, immune to interference",
            disadvantages: "Expensive, difficult installation"
          }
        ],
        unguidedMedia: [
          {
            type: "Radio Waves",
            frequency: "3 KHz - 1 GHz",
            propagation: "Ground wave, Sky wave",
            applications: "AM/FM radio, TV broadcasting",
            characteristics: "Omnidirectional, can penetrate walls"
          },
          {
            type: "Microwaves",
            frequency: "1 GHz - 300 GHz",
            propagation: "Line of sight",
            applications: "Satellite communication, Cellular networks",
            characteristics: "Unidirectional, affected by weather"
          },
          {
            type: "Infrared",
            frequency: "300 GHz - 400 THz",
            propagation: "Line of sight",
            applications: "Remote controls, Short-range communication",
            characteristics: "Cannot penetrate walls, high security"
          }
        ]
      }
    },
    {
      id: "encoding",
      title: "Signal Encoding",
      icon: Zap,
      description: "Digital and analog signal encoding techniques",
      content: {
        digitalEncoding: [
          {
            name: "Non-Return-to-Zero (NRZ)",
            types: ["NRZ-L (Level)", "NRZ-I (Invert)"],
            description: "Signal doesn't return to zero between bits",
            advantages: "Simple implementation, efficient bandwidth use",
            disadvantages: "Clock recovery difficult, DC component"
          },
          {
            name: "Manchester Encoding",
            types: ["Differential Manchester"],
            description: "Each bit period divided into two intervals",
            advantages: "Self-synchronizing, no DC component",
            disadvantages: "Requires twice the bandwidth"
          },
          {
            name: "Bipolar Encoding",
            types: ["AMI (Alternate Mark Inversion)", "B8ZS"],
            description: "Uses three voltage levels (+V, 0, -V)",
            advantages: "No DC component, error detection",
            disadvantages: "Complex circuitry"
          }
        ],
        analogEncoding: [
          {
            name: "Amplitude Shift Keying (ASK)",
            description: "Varies amplitude to represent digital data",
            formula: "s(t) = A cos(2πfct) for binary 1, 0 for binary 0",
            bandwidth: "Minimum bandwidth = bit rate",
            applications: "Optical fiber communication"
          },
          {
            name: "Frequency Shift Keying (FSK)",
            description: "Varies frequency to represent digital data",
            formula: "s(t) = A cos(2πf1t) for 1, A cos(2πf2t) for 0",
            bandwidth: "Bandwidth = |f1 - f2| + 2 × bit rate",
            applications: "Low-speed modems, RFID"
          },
          {
            name: "Phase Shift Keying (PSK)",
            description: "Varies phase to represent digital data",
            formula: "s(t) = A cos(2πfct + φ)",
            bandwidth: "Minimum bandwidth = bit rate",
            applications: "High-speed modems, Wi-Fi"
          }
        ]
      }
    },
    {
      id: "multiplexing",
      title: "Multiplexing",
      icon: Radio,
      description: "FDM, TDM, and WDM techniques",
      content: {
        techniques: [
          {
            name: "Frequency Division Multiplexing (FDM)",
            description: "Different signals use different frequency bands",
            process: "Each signal modulated to different carrier frequency",
            advantages: "Simple implementation, continuous transmission",
            disadvantages: "Guard bands required, crosstalk possible",
            applications: "AM/FM radio, Cable TV",
            example: "FM radio: 88-108 MHz band divided into 200 KHz channels"
          },
          {
            name: "Time Division Multiplexing (TDM)",
            description: "Different signals use different time slots",
            process: "Each signal allocated specific time intervals",
            advantages: "No crosstalk, efficient bandwidth use",
            disadvantages: "Synchronization required, variable delay",
            applications: "Digital telephony, T1/E1 lines",
            example: "T1 line: 24 voice channels, each 64 Kbps"
          },
          {
            name: "Wavelength Division Multiplexing (WDM)",
            description: "Different optical signals use different wavelengths",
            process: "Multiple laser sources at different wavelengths",
            advantages: "Huge capacity increase, transparent to bit rate",
            disadvantages: "Expensive equipment, limited by fiber dispersion",
            applications: "Fiber optic networks, Internet backbone",
            example: "DWDM: 160+ channels on single fiber"
          }
        ],
        calculations: [
          {
            problem: "Calculate bandwidth efficiency for FDM system",
            given: "10 channels, each 4 KHz, guard band 500 Hz",
            solution: "Total bandwidth = 10 × 4000 + 9 × 500 = 44.5 KHz\nEfficiency = (40/44.5) × 100% = 89.9%",
            steps: [
              "Calculate useful bandwidth: 10 × 4 KHz = 40 KHz",
              "Calculate guard band overhead: 9 × 500 Hz = 4.5 KHz",
              "Total bandwidth = 40 + 4.5 = 44.5 KHz",
              "Efficiency = (40/44.5) × 100% = 89.9%"
            ]
          }
        ]
      }
    }
  ];

  const selectedTopicData = topics.find(t => t.id === selectedTopic);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/cn" className="inline-flex items-center text-orange-200 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Computer Networks
          </Link>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-white/20 p-3 rounded-xl">
              <Cpu className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Physical Layer</h1>
              <p className="text-orange-100 text-lg">Transmission media, signal encoding, and multiplexing techniques</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Key Concepts</h3>
              <p className="text-sm text-orange-100">Signal transmission, encoding schemes, multiplexing methods</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Applications</h3>
              <p className="text-sm text-orange-100">Network cabling, wireless communication, signal processing</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Exam Focus</h3>
              <p className="text-sm text-orange-100">Media comparison, encoding techniques, multiplexing calculations</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Topic Navigation */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Physical Layer Topics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {topics.map((topic) => {
              const IconComponent = topic.icon;
              return (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedTopic === topic.id 
                      ? 'border-orange-500 bg-orange-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="h-8 w-8 text-orange-600 mb-3" />
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
              
              {selectedTopic === "transmission-media" && (
                <div className="space-y-8">
                  {/* Guided Media */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Guided Transmission Media</h4>
                    <div className="space-y-4">
                      {selectedTopicData.content.guidedMedia?.map((media, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                          <h5 className="font-semibold text-blue-700 mb-3">{media.type}</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="mb-2"><span className="font-medium">Categories:</span> {media.categories.join(", ")}</div>
                              <div className="mb-2"><span className="font-medium">Bandwidth:</span> {media.bandwidth}</div>
                              <div><span className="font-medium">Applications:</span> {media.applications}</div>
                            </div>
                            <div>
                              <div className="mb-2 text-green-600"><span className="font-medium">Advantages:</span> {media.advantages}</div>
                              <div className="text-red-600"><span className="font-medium">Disadvantages:</span> {media.disadvantages}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Unguided Media */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Unguided Transmission Media</h4>
                    <div className="space-y-4">
                      {selectedTopicData.content.unguidedMedia?.map((media, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                          <h5 className="font-semibold text-purple-700 mb-3">{media.type}</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="mb-2"><span className="font-medium">Frequency:</span> {media.frequency}</div>
                              <div className="mb-2"><span className="font-medium">Propagation:</span> {media.propagation}</div>
                            </div>
                            <div>
                              <div className="mb-2"><span className="font-medium">Applications:</span> {media.applications}</div>
                              <div><span className="font-medium">Characteristics:</span> {media.characteristics}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {selectedTopic === "encoding" && (
                <div className="space-y-8">
                  {/* Digital Encoding */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Digital Signal Encoding</h4>
                    <div className="space-y-4">
                      {selectedTopicData.content.digitalEncoding?.map((encoding, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                          <h5 className="font-semibold text-blue-700 mb-3">{encoding.name}</h5>
                          <p className="text-sm text-gray-600 mb-3">{encoding.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="mb-2"><span className="font-medium">Types:</span> {encoding.types.join(", ")}</div>
                              <div className="text-green-600"><span className="font-medium">Advantages:</span> {encoding.advantages}</div>
                            </div>
                            <div>
                              <div className="text-red-600"><span className="font-medium">Disadvantages:</span> {encoding.disadvantages}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Analog Encoding */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Analog Signal Encoding</h4>
                    <div className="space-y-4">
                      {selectedTopicData.content.analogEncoding?.map((encoding, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                          <h5 className="font-semibold text-purple-700 mb-3">{encoding.name}</h5>
                          <p className="text-sm text-gray-600 mb-3">{encoding.description}</p>
                          <div className="space-y-2 text-sm">
                            <div className="bg-gray-100 p-2 rounded"><span className="font-medium">Formula:</span> {encoding.formula}</div>
                            <div><span className="font-medium">Bandwidth:</span> {encoding.bandwidth}</div>
                            <div><span className="font-medium">Applications:</span> {encoding.applications}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {selectedTopic === "multiplexing" && (
                <div className="space-y-8">
                  {/* Multiplexing Techniques */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Multiplexing Techniques</h4>
                    <div className="space-y-4">
                      {selectedTopicData.content.techniques?.map((technique, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                          <h5 className="font-semibold text-indigo-700 mb-3">{technique.name}</h5>
                          <p className="text-sm text-gray-600 mb-3">{technique.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="mb-2"><span className="font-medium">Process:</span> {technique.process}</div>
                              <div className="mb-2 text-green-600"><span className="font-medium">Advantages:</span> {technique.advantages}</div>
                              <div className="text-red-600"><span className="font-medium">Disadvantages:</span> {technique.disadvantages}</div>
                            </div>
                            <div>
                              <div className="mb-2"><span className="font-medium">Applications:</span> {technique.applications}</div>
                              <div className="bg-blue-50 p-2 rounded">
                                <span className="font-medium">Example:</span> {technique.example}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sample Calculations */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Sample Calculations</h4>
                    <div className="space-y-4">
                      {selectedTopicData.content.calculations?.map((calc, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                          <h5 className="font-semibold text-blue-700 mb-2">Problem {index + 1}</h5>
                          <p className="text-sm text-gray-800 mb-2">{calc.problem}</p>
                          <div className="text-sm text-gray-600 mb-3"><span className="font-medium">Given:</span> {calc.given}</div>
                          <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3">
                            <div className="text-sm font-medium text-blue-800">Solution:</div>
                            <pre className="text-sm text-blue-700 whitespace-pre-wrap">{calc.solution}</pre>
                          </div>
                          <div>
                            <div className="text-xs font-medium text-gray-700 mb-1">Steps:</div>
                            <ol className="text-xs text-gray-600 space-y-1">
                              {calc.steps.map((step, stepIndex) => (
                                <li key={stepIndex}>{stepIndex + 1}. {step}</li>
                              ))}
                            </ol>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
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
                <li>• Compare guided vs unguided transmission media</li>
                <li>• Understand different encoding techniques (NRZ, Manchester)</li>
                <li>• Know multiplexing methods and their applications</li>
                <li>• Practice bandwidth and efficiency calculations</li>
                <li>• Remember signal characteristics and frequencies</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-3">Common Exam Questions</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• "Compare fiber optic vs copper cables" (5 marks)</li>
                <li>• "Explain Manchester encoding with diagram" (4 marks)</li>
                <li>• "Calculate efficiency of FDM system" (3 marks)</li>
                <li>• "Differentiate between FDM and TDM" (6 marks)</li>
                <li>• "Draw signal waveforms for NRZ encoding" (4 marks)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
