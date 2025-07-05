"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Binary, Play, RotateCcw } from "lucide-react";

interface HuffmanNode {
  char: string;
  freq: number;
  left?: HuffmanNode;
  right?: HuffmanNode;
  code?: string;
}

interface HuffmanStep {
  step: number;
  nodes: HuffmanNode[];
  description: string;
  tree?: HuffmanNode;
}

// Priority queue implementation
class PriorityQueue {
  private items: HuffmanNode[] = [];

  enqueue(node: HuffmanNode) {
    if (this.isEmpty()) {
      this.items.push(node);
    } else {
      let added = false;
      for (let i = 0; i < this.items.length; i++) {
        if (node.freq < this.items[i].freq) {
          this.items.splice(i, 0, node);
          added = true;
          break;
        }
      }
      if (!added) {
        this.items.push(node);
      }
    }
  }

  dequeue(): HuffmanNode | undefined {
    return this.items.shift();
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }

  getItems(): HuffmanNode[] {
    return [...this.items];
  }
}

export default function HuffmanPage() {
  const [inputText, setInputText] = useState("HELLO WORLD");
  const [huffmanTree, setHuffmanTree] = useState<HuffmanNode | null>(null);
  const [huffmanCodes, setHuffmanCodes] = useState<{ [key: string]: string }>({});
  const [steps, setSteps] = useState<HuffmanStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isBuilding, setIsBuilding] = useState(false);
  const [frequencyTable, setFrequencyTable] = useState<{ [key: string]: number }>({});
  const [encodedText, setEncodedText] = useState("");
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);

  // Build frequency table
  const buildFrequencyTable = useCallback((text: string) => {
    const freq: { [key: string]: number } = {};
    for (const char of text) {
      freq[char] = (freq[char] || 0) + 1;
    }
    return freq;
  }, []);

  // Generate Huffman codes
  const generateCodes = useCallback((node: HuffmanNode, code = "", codes: { [key: string]: string } = {}) => {
    if (!node.left && !node.right) {
      // Leaf node
      codes[node.char] = code || "0"; // Single character gets code "0"
      return codes;
    }

    if (node.left) {
      generateCodes(node.left, code + "0", codes);
    }
    if (node.right) {
      generateCodes(node.right, code + "1", codes);
    }

    return codes;
  }, []);

  // Build Huffman tree
  const buildHuffmanTree = useCallback(() => {
    setIsBuilding(true);
    const freq = buildFrequencyTable(inputText);
    setFrequencyTable(freq);

    const pq = new PriorityQueue();
    const buildSteps: HuffmanStep[] = [];

    // Create leaf nodes for each character
    const leafNodes = Object.entries(freq).map(([char, frequency]) => ({
      char,
      freq: frequency,
    }));

    leafNodes.forEach(node => pq.enqueue(node));

    buildSteps.push({
      step: 0,
      nodes: leafNodes,
      description: `Initialize: Create leaf nodes for each character with their frequencies`,
    });

    let stepCount = 1;

    // Build tree bottom-up
    while (pq.size() > 1) {
      const left = pq.dequeue()!;
      const right = pq.dequeue()!;

      const merged: HuffmanNode = {
        char: left.char + right.char,
        freq: left.freq + right.freq,
        left,
        right,
      };

      pq.enqueue(merged);

      buildSteps.push({
        step: stepCount++,
        nodes: [left, right],
        description: `Merge nodes "${left.char}" (${left.freq}) and "${right.char}" (${right.freq}) into new node with frequency ${merged.freq}`,
      });
    }

    const tree = pq.dequeue();
    if (tree) {
      setHuffmanTree(tree);
      const codes = generateCodes(tree);
      setHuffmanCodes(codes);

      // Calculate encoded text
      const encoded = inputText.split('').map(char => codes[char]).join('');
      setEncodedText(encoded);

      // Calculate sizes
      setOriginalSize(inputText.length * 8); // 8 bits per character (ASCII)
      setCompressedSize(encoded.length);

      buildSteps.push({
        step: stepCount,
        nodes: [],
        description: `Complete: Generated Huffman codes and encoded text`,
        tree,
      });
    }

    setSteps(buildSteps);
    setCurrentStep(0);
    setIsBuilding(false);
  }, [inputText, buildFrequencyTable, generateCodes]);

  const reset = () => {
    setHuffmanTree(null);
    setHuffmanCodes({});
    setSteps([]);
    setCurrentStep(0);
    setFrequencyTable({});
    setEncodedText("");
    setOriginalSize(0);
    setCompressedSize(0);
    setIsBuilding(false);
  };

  const stepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const stepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateCompressionRatio = () => {
    if (compressedSize === 0) return "N/A";
    return (originalSize / compressedSize).toFixed(2);
  };

  // Simple tree visualization component
  const TreeNode = ({ node, x, y, level = 0 }: { node: HuffmanNode; x: number; y: number; level?: number }) => {
    const isLeaf = !node.left && !node.right;
    const nodeRadius = 25;
    const levelHeight = 80;
    const levelWidth = 100;

    return (
      <g>
        <circle
          cx={x}
          cy={y}
          r={nodeRadius}
          fill={isLeaf ? "#3b82f6" : "#e5e7eb"}
          stroke="#374151"
          strokeWidth="2"
        />
        <text
          x={x}
          y={y - 5}
          textAnchor="middle"
          className="text-xs font-medium fill-gray-700"
        >
          {isLeaf ? node.char : ""}
        </text>
        <text
          x={x}
          y={y + 8}
          textAnchor="middle"
          className="text-xs fill-gray-700"
        >
          {node.freq}
        </text>
        
        {node.left && (
          <>
            <line
              x1={x}
              y1={y + nodeRadius}
              x2={x - levelWidth}
              y2={y + levelHeight - nodeRadius}
              stroke="#374151"
              strokeWidth="2"
            />
            <text
              x={x - levelWidth / 2}
              y={y + levelHeight / 2}
              textAnchor="middle"
              className="text-xs fill-red-600 font-medium"
            >
              0
            </text>
            <TreeNode node={node.left} x={x - levelWidth} y={y + levelHeight} level={level + 1} />
          </>
        )}
        
        {node.right && (
          <>
            <line
              x1={x}
              y1={y + nodeRadius}
              x2={x + levelWidth}
              y2={y + levelHeight - nodeRadius}
              stroke="#374151"
              strokeWidth="2"
            />
            <text
              x={x + levelWidth / 2}
              y={y + levelHeight / 2}
              textAnchor="middle"
              className="text-xs fill-green-600 font-medium"
            >
              1
            </text>
            <TreeNode node={node.right} x={x + levelWidth} y={y + levelHeight} level={level + 1} />
          </>
        )}
      </g>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/cn/compression" className="inline-flex items-center text-blue-200 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Compression
          </Link>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-white/20 p-3 rounded-xl">
              <Binary className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Huffman Coding</h1>
              <p className="text-blue-100 text-lg">Optimal prefix-free variable-length coding algorithm</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Algorithm Type</h3>
              <p className="text-sm text-blue-100">Greedy, optimal prefix coding</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Time Complexity</h3>
              <p className="text-sm text-blue-100">O(n log n) - tree construction</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Applications</h3>
              <p className="text-sm text-blue-100">JPEG, MP3, ZIP compression</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Input Text</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text to Encode:
                </label>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                  placeholder="Enter text to encode..."
                />
              </div>

              <div className="space-y-2">
                <button
                  onClick={buildHuffmanTree}
                  disabled={isBuilding || !inputText.trim()}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  <Play className="h-4 w-4" />
                  <span>Build Huffman Tree</span>
                </button>
                <button
                  onClick={reset}
                  className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 flex items-center justify-center space-x-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Reset</span>
                </button>
              </div>

              {steps.length > 0 && (
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Step {currentStep + 1} of {steps.length}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={stepBackward}
                      disabled={currentStep === 0}
                      className="flex-1 px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={stepForward}
                      disabled={currentStep === steps.length - 1}
                      className="flex-1 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {/* Frequency Table */}
              {Object.keys(frequencyTable).length > 0 && (
                <div className="pt-4 border-t">
                  <h3 className="font-semibold text-gray-800 mb-3">Character Frequencies</h3>
                  <div className="space-y-2">
                    {Object.entries(frequencyTable).map(([char, freq]) => (
                      <div key={char} className="flex justify-between items-center text-sm">
                        <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                          {char === ' ' ? '(space)' : char}
                        </span>
                        <span className="text-gray-600">{freq}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tree Visualization */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Huffman Tree Visualization</h2>
            
            {huffmanTree ? (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <svg width="600" height="400" className="border border-gray-200 rounded">
                    <TreeNode node={huffmanTree} x={300} y={50} />
                  </svg>
                </div>
                
                <div className="text-sm text-gray-600">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                      <span>Character Node</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                      <span>Internal Node</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-red-600 font-medium">0</span>
                      <span>Left Edge</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-600 font-medium">1</span>
                      <span>Right Edge</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Enter text and click "Build Huffman Tree" to see the visualization
              </div>
            )}
          </div>
        </div>

        {/* Algorithm Steps */}
        {steps.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Algorithm Steps</h2>
            
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div 
                  key={index}
                  className={`border rounded-lg p-4 ${
                    index === currentStep ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-800">Step {step.step}</span>
                    {index === currentStep && (
                      <span className="text-blue-600 text-sm font-medium">Current</span>
                    )}
                  </div>
                  <p className="text-gray-700 text-sm">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Huffman Codes */}
        {Object.keys(huffmanCodes).length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Generated Huffman Codes</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Character Codes</h3>
                <div className="space-y-2">
                  {Object.entries(huffmanCodes).map(([char, code]) => (
                    <div key={char} className="flex justify-between items-center text-sm border-b pb-2">
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                        {char === ' ' ? '(space)' : char}
                      </span>
                      <span className="font-mono text-blue-600">{code}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Compression Results</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Original Size:</span>
                    <span>{originalSize} bits</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Compressed Size:</span>
                    <span>{compressedSize} bits</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Compression Ratio:</span>
                    <span>{calculateCompressionRatio()}:1</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Space Saved:</span>
                    <span>{((originalSize - compressedSize) / originalSize * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Encoded Text */}
        {encodedText && (
          <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Encoded Text</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Original Text</h3>
                <div className="bg-gray-100 border rounded-lg p-3 font-mono text-sm">
                  {inputText}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Encoded Binary</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 font-mono text-sm break-all">
                  {encodedText}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Algorithm Explanation */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Huffman Coding Algorithm</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">How It Works</h3>
              <ol className="space-y-2 text-gray-600">
                <li><strong>1. Count Frequencies:</strong> Calculate frequency of each character</li>
                <li><strong>2. Create Leaf Nodes:</strong> Make a leaf node for each character</li>
                <li><strong>3. Build Priority Queue:</strong> Add all nodes to priority queue (min-heap)</li>
                <li><strong>4. Build Tree:</strong> Repeatedly merge two nodes with lowest frequencies</li>
                <li><strong>5. Assign Codes:</strong> Traverse tree to assign binary codes (0=left, 1=right)</li>
                <li><strong>6. Encode Text:</strong> Replace each character with its binary code</li>
              </ol>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-3">Advantages</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Optimal prefix-free coding</li>
                  <li>• No ambiguity in decoding</li>
                  <li>• Greedy algorithm gives optimal result</li>
                  <li>• Efficient for text compression</li>
                  <li>• Widely used in practice</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-3">Applications</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• JPEG image compression</li>
                  <li>• MP3 audio compression</li>
                  <li>• ZIP file compression</li>
                  <li>• Data transmission protocols</li>
                  <li>• Fax machine encoding</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
