"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

export default function HuffmanEncodingPage() {
  const [inputText, setInputText] = useState("ABRACADABRA");
  const [steps, setSteps] = useState<HuffmanStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [codes, setCodes] = useState<{[char: string]: string}>({});
  const [encodedText, setEncodedText] = useState("");
  const [compressionStats, setCompressionStats] = useState({
    originalBits: 0,
    encodedBits: 0,
    compressionRatio: 0,
    spaceSaved: 0
  });

  const buildHuffmanTree = useCallback(() => {
    // Calculate character frequencies
    const freqMap: {[char: string]: number} = {};
    for (const char of inputText) {
      freqMap[char] = (freqMap[char] || 0) + 1;
    }

    // Create initial nodes
    const pq = new PriorityQueue();
    const initialNodes: HuffmanNode[] = [];
    
    for (const [char, freq] of Object.entries(freqMap)) {
      const node: HuffmanNode = { char, freq };
      pq.enqueue(node);
      initialNodes.push(node);
    }

    const stepsArray: HuffmanStep[] = [];
    
    // Initial step
    stepsArray.push({
      step: 0,
      nodes: [...initialNodes],
      description: `Initial nodes created with character frequencies`
    });

    let stepCount = 1;

    // Build Huffman tree
    while (pq.size() > 1) {
      const left = pq.dequeue()!;
      const right = pq.dequeue()!;
      
      const merged: HuffmanNode = {
        char: `${left.char}+${right.char}`,
        freq: left.freq + right.freq,
        left,
        right
      };
      
      pq.enqueue(merged);
      
      stepsArray.push({
        step: stepCount++,
        nodes: pq.getItems(),
        description: `Merge nodes '${left.char}' (${left.freq}) and '${right.char}' (${right.freq}) → '${merged.char}' (${merged.freq})`,
        tree: pq.size() === 1 ? merged : undefined
      });
    }

    // Final tree
    const finalTree = pq.dequeue();
    if (finalTree) {
      stepsArray.push({
        step: stepCount,
        nodes: [],
        description: "Huffman tree construction complete!",
        tree: finalTree
      });
    }

    setSteps(stepsArray);
    setCurrentStep(0);

    // Generate codes
    if (finalTree) {
      const generatedCodes = generateCodes(finalTree);
      setCodes(generatedCodes);
      
      // Encode text
      const encoded = inputText.split('').map(char => generatedCodes[char] || '').join('');
      setEncodedText(encoded);
      
      // Calculate compression statistics
      const originalBits = inputText.length * 8; // Assuming 8 bits per character (ASCII)
      const encodedBits = encoded.length;
      const compressionRatio = encodedBits / originalBits;
      const spaceSaved = ((originalBits - encodedBits) / originalBits) * 100;
      
      setCompressionStats({
        originalBits,
        encodedBits,
        compressionRatio,
        spaceSaved
      });
    }
  }, [inputText]);

  const generateCodes = (root: HuffmanNode, code: string = "", codes: {[char: string]: string} = {}): {[char: string]: string} => {
    if (!root.left && !root.right) {
      // Leaf node
      codes[root.char] = code || "0"; // Handle single character case
      return codes;
    }
    
    if (root.left) {
      generateCodes(root.left, code + "0", codes);
    }
    if (root.right) {
      generateCodes(root.right, code + "1", codes);
    }
    
    return codes;
  };

  const renderTree = (node: HuffmanNode | undefined, x: number = 200, y: number = 50, level: number = 0): React.ReactElement[] => {
    if (!node) return [];
    
    const elements: React.ReactElement[] = [];
    const horizontalSpacing = 80 / (level + 1);
    
    // Draw current node
    elements.push(
      <g key={`node-${x}-${y}`}>
        <circle
          cx={x}
          cy={y}
          r="20"
          fill={!node.left && !node.right ? "#10B981" : "#3B82F6"}
          stroke="#F3F4F6"
          strokeWidth="3"
        />
        <text
          x={x}
          y={y - 2}
          textAnchor="middle"
          className="text-xs font-bold fill-white"
        >
          {node.char.length > 3 ? `${node.char.substring(0, 3)}...` : node.char}
        </text>
        <text
          x={x}
          y={y + 10}
          textAnchor="middle"
          className="text-xs fill-white"
        >
          {node.freq}
        </text>
      </g>
    );
    
    // Draw connections and child nodes
    if (node.left) {
      const leftX = x - horizontalSpacing;
      const leftY = y + 60;
      
      elements.push(
        <g key={`left-connection-${x}-${y}`}>
          <line
            x1={x}
            y1={y + 20}
            x2={leftX}
            y2={leftY - 20}
            stroke="#F3F4F6"
            strokeWidth="3"
          />
          <text
            x={(x + leftX) / 2 - 5}
            y={(y + leftY) / 2}
            className="text-sm font-bold fill-red-400"
          >
            0
          </text>
        </g>
      );
      
      elements.push(...renderTree(node.left, leftX, leftY, level + 1));
    }
    
    if (node.right) {
      const rightX = x + horizontalSpacing;
      const rightY = y + 60;
      
      elements.push(
        <g key={`right-connection-${x}-${y}`}>
          <line
            x1={x}
            y1={y + 20}
            x2={rightX}
            y2={rightY - 20}
            stroke="#F3F4F6"
            strokeWidth="3"
          />
          <text
            x={(x + rightX) / 2 + 5}
            y={(y + rightY) / 2}
            className="text-sm font-bold fill-blue-400"
          >
            1
          </text>
        </g>
      );
      
      elements.push(...renderTree(node.right, rightX, rightY, level + 1));
    }
    
    return elements;
  };

  const decodeText = (encodedText: string): string => {
    if (steps.length === 0 || !steps[steps.length - 1].tree) return "";
    
    const root = steps[steps.length - 1].tree!;
    let decoded = "";
    let current = root;
    
    for (const bit of encodedText) {
      if (bit === "0" && current.left) {
        current = current.left;
      } else if (bit === "1" && current.right) {
        current = current.right;
      }
      
      // If we reached a leaf node
      if (!current.left && !current.right) {
        decoded += current.char;
        current = root;
      }
    }
    
    return decoded;
  };

  useEffect(() => {
    if (inputText.trim()) {
      buildHuffmanTree();
    }
  }, [inputText, buildHuffmanTree]);

  const currentData = currentStep < steps.length ? steps[currentStep] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Huffman Encoding Algorithm
          </h1>
          <p className="text-lg text-gray-200 max-w-3xl mx-auto">
            Learn optimal prefix-free encoding for data compression. Build Huffman trees step-by-step 
            and understand how variable-length codes minimize total encoding length.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle>Input Text</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Text to Encode</label>
                <Input
                  type="text"
                  placeholder="Enter text..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value.toUpperCase())}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Example Texts</label>
                {[
                  "ABRACADABRA",
                  "HELLO WORLD",
                  "COMPRESSION",
                  "AAAAABBBCCDEE"
                ].map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setInputText(example)}
                    className="w-full text-left justify-start"
                  >
                    {example}
                  </Button>
                ))}
              </div>

              <Button onClick={buildHuffmanTree} className="w-full">
                Build Huffman Tree
              </Button>

              {/* Character Frequencies */}
              {inputText && (
                <div>
                  <h3 className="font-semibold mb-2">Character Frequencies</h3>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {Object.entries(
                      inputText.split('').reduce((freq: {[char: string]: number}, char) => {
                        freq[char] = (freq[char] || 0) + 1;
                        return freq;
                      }, {})
                    ).sort((a, b) => b[1] - a[1]).map(([char, freq]) => (
                      <div key={char} className="flex justify-between bg-gray-700 border border-gray-600 px-2 py-1 rounded text-sm">
                        <span className="font-mono text-gray-200">&apos;{char}&apos;</span>
                        <span className="text-gray-200">{freq}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tree Visualization */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Huffman Tree Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-800 rounded-lg border-2 border-gray-600 h-96 overflow-auto">
                <svg width="100%" height="400" viewBox="0 0 400 400" className="bg-gray-800">
                  {currentData?.tree && renderTree(currentData.tree)}
                </svg>
              </div>
              
              {/* Legend */}
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-200">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                  <span>Leaf Node (Character)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                  <span>Internal Node</span>
                </div>
                <div className="flex items-center">
                  <span className="text-red-400 font-bold mr-2">0</span>
                  <span>Left Edge</span>
                </div>
                <div className="flex items-center">
                  <span className="text-blue-400 font-bold mr-2">1</span>
                  <span>Right Edge</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Algorithm Steps */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Algorithm Steps</CardTitle>
            </CardHeader>
            <CardContent>
              {currentData && (
                <div className="space-y-4">
                  <div className="bg-purple-800 border border-purple-600 p-4 rounded-lg">
                    <h3 className="font-semibold text-purple-200 mb-2">
                      Step {currentData.step}: {currentData.description}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Current Nodes */}
                    <div>
                      <h4 className="font-semibold mb-2">Priority Queue Nodes</h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {currentData.nodes.map((node, index) => (
                          <div key={index} className="bg-gray-700 border border-gray-600 p-3 rounded-lg">
                            <div className="flex justify-between items-center">
                              <span className="font-mono text-sm text-gray-200">
                                &apos;{node.char}&apos;
                              </span>
                              <span className="font-bold text-blue-400">
                                {node.freq}
                              </span>
                            </div>
                          </div>
                        ))}
                        {currentData.nodes.length === 0 && (
                          <div className="text-gray-400 text-sm">Queue is empty</div>
                        )}
                      </div>
                    </div>

                    {/* Huffman Codes */}
                    {Object.keys(codes).length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Generated Codes</h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {Object.entries(codes).map(([char, code]) => (
                            <div key={char} className="bg-green-800 border border-green-600 p-3 rounded-lg">
                              <div className="flex justify-between items-center">
                                <span className="font-mono text-sm text-gray-200">&apos;{char}&apos;</span>
                                <span className="font-mono font-bold text-green-300">{code}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Step Navigation */}
                  <div className="flex items-center justify-between">
                    <Button
                      onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                      disabled={currentStep === 0}
                    >
                      Previous Step
                    </Button>
                    <span className="text-sm text-gray-300">
                      Step {currentStep + 1} of {steps.length}
                    </span>
                    <Button
                      onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                      disabled={currentStep === steps.length - 1}
                    >
                      Next Step
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Encoding Results */}
          {encodedText && (
            <>
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Encoding Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-200">Original Text</h3>
                    <div className="bg-gray-700 border border-gray-600 p-3 rounded font-mono text-sm break-all text-gray-200">
                      {inputText}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2 text-gray-200">Encoded Text</h3>
                    <div className="bg-blue-800 border border-blue-600 p-3 rounded font-mono text-sm break-all text-blue-200">
                      {encodedText}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2 text-gray-200">Character-by-Character Encoding</h3>
                    <div className="bg-green-800 border border-green-600 p-3 rounded text-sm">
                      {inputText.split('').map((char, index) => (
                        <span key={index} className="inline-block mr-2 mb-1">
                          <span className="bg-gray-700 text-gray-200 px-1 rounded">{char}</span>
                          <span className="text-green-300">→</span>
                          <span className="bg-green-700 text-green-200 px-1 rounded font-mono">{codes[char]}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2 text-gray-200">Decoded Text (Verification)</h3>
                    <div className="bg-purple-800 border border-purple-600 p-3 rounded font-mono text-sm text-purple-200">
                      {decodeText(encodedText)}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Compression Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>Compression Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-200">
                      <span>Original Size:</span>
                      <span className="font-mono">{compressionStats.originalBits} bits</span>
                    </div>
                    <div className="flex justify-between text-gray-200">
                      <span>Encoded Size:</span>
                      <span className="font-mono">{compressionStats.encodedBits} bits</span>
                    </div>
                    <div className="flex justify-between text-gray-200">
                      <span>Compression Ratio:</span>
                      <span className="font-mono">{compressionStats.compressionRatio.toFixed(3)}</span>
                    </div>
                    <div className="flex justify-between text-gray-200">
                      <span>Space Saved:</span>
                      <span className="font-mono text-green-400">
                        {compressionStats.spaceSaved.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div className="bg-yellow-800 border border-yellow-600 p-3 rounded text-sm text-yellow-200">
                    <strong>Average Code Length:</strong><br />
                    {Object.entries(codes).reduce((sum, [char, code]) => {
                      const freq = inputText.split('').filter(c => c === char).length;
                      return sum + (code.length * freq);
                    }, 0) / inputText.length} bits per character
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Algorithm Explanation */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Algorithm Explanation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">How Huffman Encoding Works:</h3>
                <ol className="space-y-2 text-sm">
                  <li><strong>1. Count Frequencies:</strong> Calculate frequency of each character</li>
                  <li><strong>2. Create Nodes:</strong> Make leaf nodes for each character</li>
                  <li><strong>3. Build Priority Queue:</strong> Sort nodes by frequency (ascending)</li>
                  <li><strong>4. Merge Nodes:</strong> Repeatedly take two minimum nodes and merge</li>
                  <li><strong>5. Assign Codes:</strong> Left edge = 0, Right edge = 1</li>
                  <li><strong>6. Encode:</strong> Replace each character with its code</li>
                </ol>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Key Properties:</h3>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Optimal:</strong> Produces minimum expected code length</li>
                  <li>• <strong>Prefix-Free:</strong> No code is prefix of another</li>
                  <li>• <strong>Variable Length:</strong> Frequent chars get shorter codes</li>
                  <li>• <strong>Greedy Algorithm:</strong> Makes locally optimal choices</li>
                  <li>• <strong>Time Complexity:</strong> O(n log n) where n = unique characters</li>
                  <li>• <strong>Applications:</strong> ZIP, JPEG, MP3 compression</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
