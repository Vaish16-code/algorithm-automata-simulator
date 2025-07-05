"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Archive, Zap, FileText, BarChart3 } from "lucide-react";

export default function CompressionPage() {
  const [selectedTopic, setSelectedTopic] = useState("overview");

  const topics = [
    {
      id: "overview",
      title: "Compression Overview",
      icon: Archive,
      description: "Introduction to data compression techniques",
      content: {
        fundamentals: [
          {
            concept: "Data Compression",
            definition: "Process of encoding data using fewer bits than original representation",
            purpose: "Reduce storage space, transmission time, and bandwidth requirements",
            types: ["Lossless", "Lossy"]
          },
          {
            concept: "Compression Ratio",
            definition: "Ratio of uncompressed size to compressed size",
            formula: "Compression Ratio = Original Size / Compressed Size",
            example: "100KB file compressed to 25KB = 4:1 ratio"
          },
          {
            concept: "Redundancy",
            definition: "Repetitive or predictable patterns in data",
            types: ["Statistical", "Psychovisual", "Temporal", "Spatial"],
            exploitation: "Compression algorithms identify and remove redundancy"
          }
        ],
        categories: [
          {
            type: "Lossless Compression",
            description: "Perfect reconstruction of original data",
            algorithms: ["Huffman Coding", "LZW", "Run-Length Encoding", "Arithmetic Coding"],
            applications: ["Text files", "Executable files", "Medical images"],
            advantages: "No data loss, perfect reconstruction",
            disadvantages: "Lower compression ratios"
          },
          {
            type: "Lossy Compression",
            description: "Approximate reconstruction with some data loss",
            algorithms: ["JPEG", "MP3", "MPEG", "H.264"],
            applications: ["Images", "Audio", "Video"],
            advantages: "Higher compression ratios",
            disadvantages: "Quality degradation"
          }
        ]
      }
    },
    {
      id: "algorithms",
      title: "Compression Algorithms",
      icon: Zap,
      description: "Popular compression algorithms and their implementations",
      content: {
        algorithms: [
          {
            name: "Huffman Coding",
            type: "Lossless",
            principle: "Variable-length prefix codes based on symbol frequency",
            timeComplexity: "O(n log n)",
            spaceComplexity: "O(n)",
            applications: ["DEFLATE", "GZIP", "ZIP"],
            pros: ["Optimal for symbol-by-symbol encoding", "Simple implementation"],
            cons: ["Requires two passes", "Not adaptive"]
          },
          {
            name: "LZW (Lempel-Ziv-Welch)",
            type: "Lossless",
            principle: "Dictionary-based compression using string replacement",
            timeComplexity: "O(n)",
            spaceComplexity: "O(n)",
            applications: ["GIF", "TIFF", "PDF"],
            pros: ["Single pass", "Adaptive", "Good for text"],
            cons: ["Patent issues", "Dictionary overflow"]
          },
          {
            name: "Run-Length Encoding",
            type: "Lossless",
            principle: "Replace consecutive identical symbols with count and symbol",
            timeComplexity: "O(n)",
            spaceComplexity: "O(1)",
            applications: ["Fax transmission", "Simple graphics"],
            pros: ["Very simple", "Fast", "Low memory"],
            cons: ["Poor for complex data", "Can increase size"]
          }
        ]
      }
    },
    {
      id: "applications",
      title: "Real-world Applications",
      icon: FileText,
      description: "Compression in networking and storage systems",
      content: {
        networking: [
          {
            protocol: "HTTP Compression",
            methods: ["GZIP", "Deflate", "Brotli"],
            usage: "Web content compression for faster loading",
            savings: "60-80% bandwidth reduction",
            implementation: "Server-side compression, client decompression"
          },
          {
            protocol: "VPN Compression",
            methods: ["LZS", "STAC"],
            usage: "Reduce VPN tunnel overhead",
            savings: "20-50% bandwidth reduction",
            implementation: "Real-time compression/decompression"
          },
          {
            protocol: "Video Streaming",
            methods: ["H.264", "H.265/HEVC", "AV1"],
            usage: "Real-time video transmission",
            savings: "90%+ size reduction",
            implementation: "Hardware/software codecs"
          }
        ],
        storage: [
          {
            system: "File Systems",
            methods: ["ZFS", "Btrfs", "NTFS"],
            usage: "Transparent file compression",
            benefits: ["Space saving", "I/O reduction"],
            tradeoffs: ["CPU overhead", "Compression ratio"]
          },
          {
            system: "Database Compression",
            methods: ["Page compression", "Row compression"],
            usage: "Reduce storage and memory usage",
            benefits: ["Lower storage costs", "Improved cache efficiency"],
            tradeoffs: ["CPU overhead", "Query performance"]
          }
        ]
      }
    }
  ];

  const selectedTopicData = topics.find(t => t.id === selectedTopic);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/cn" className="inline-flex items-center text-purple-200 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Computer Networks
          </Link>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-white/20 p-3 rounded-xl">
              <Archive className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Data Compression</h1>
              <p className="text-purple-100 text-lg">Compression algorithms and their applications in networking</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Key Algorithms</h3>
              <p className="text-sm text-purple-100">Huffman, LZW, RLE, and modern compression techniques</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Applications</h3>
              <p className="text-sm text-purple-100">Web compression, file storage, multimedia streaming</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Interactive Tools</h3>
              <p className="text-sm text-purple-100">Compression simulators and performance analyzers</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Topic Navigation */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Compression Topics</h2>
          
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
                  <IconComponent className="h-8 w-8 text-purple-600 mb-3" />
                  <h3 className="font-semibold text-gray-800 mb-2">{topic.title}</h3>
                  <p className="text-sm text-gray-600">{topic.description}</p>
                </button>
              );
            })}
          </div>

          {/* Algorithm Tools */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Interactive Compression Tools</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/cn/compression/huffman" className="block">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg hover:shadow-lg transition-all">
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="h-6 w-6" />
                    <div>
                      <h4 className="font-semibold">Huffman Coding</h4>
                      <p className="text-sm text-blue-100">Build Huffman trees and encode text</p>
                    </div>
                  </div>
                </div>
              </Link>
              
              <Link href="/cn/compression/lzw" className="block">
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg hover:shadow-lg transition-all">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-6 w-6" />
                    <div>
                      <h4 className="font-semibold">LZW Compression</h4>
                      <p className="text-sm text-green-100">Dictionary-based compression simulator</p>
                    </div>
                  </div>
                </div>
              </Link>
              
              <Link href="/cn/compression/rle" className="block">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg hover:shadow-lg transition-all">
                  <div className="flex items-center space-x-3">
                    <Zap className="h-6 w-6" />
                    <div>
                      <h4 className="font-semibold">Run-Length Encoding</h4>
                      <p className="text-sm text-orange-100">Simple compression for repetitive data</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Selected Topic Content */}
          {selectedTopicData && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                {selectedTopicData.title} Details
              </h3>
              
              {selectedTopic === "overview" && (
                <div className="space-y-8">
                  {/* Fundamentals */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Compression Fundamentals</h4>
                    <div className="space-y-4">
                      {selectedTopicData.content.fundamentals?.map((item, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                          <h5 className="font-semibold text-purple-700 mb-3">{item.concept}</h5>
                          <p className="text-sm text-gray-600 mb-3">{item.definition}</p>
                          {item.formula && (
                            <div className="bg-purple-50 border border-purple-200 rounded p-2 mb-2">
                              <span className="font-medium">Formula:</span> {item.formula}
                            </div>
                          )}
                          {item.example && (
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Example:</span> {item.example}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Categories */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Compression Categories</h4>
                    <div className="space-y-4">
                      {selectedTopicData.content.categories?.map((category, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                          <h5 className="font-semibold text-indigo-700 mb-3">{category.type}</h5>
                          <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="mb-2"><span className="font-medium">Algorithms:</span> {category.algorithms.join(", ")}</div>
                              <div className="text-green-600"><span className="font-medium">Advantages:</span> {category.advantages}</div>
                            </div>
                            <div>
                              <div className="mb-2"><span className="font-medium">Applications:</span> {category.applications.join(", ")}</div>
                              <div className="text-red-600"><span className="font-medium">Disadvantages:</span> {category.disadvantages}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Add other topic content here similarly */}
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
                <li>• Understand lossless vs lossy compression</li>
                <li>• Know Huffman coding algorithm steps</li>
                <li>• Practice compression ratio calculations</li>
                <li>• Remember LZW dictionary building process</li>
                <li>• Understand compression applications in networking</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-3">Common Exam Questions</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• "Build Huffman tree for given text" (8 marks)</li>
                <li>• "Calculate compression ratio" (3 marks)</li>
                <li>• "Explain LZW encoding steps" (6 marks)</li>
                <li>• "Compare lossless vs lossy compression" (5 marks)</li>
                <li>• "Applications of compression in networks" (4 marks)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
