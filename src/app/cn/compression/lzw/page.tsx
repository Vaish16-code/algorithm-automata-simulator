"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Play, RotateCcw } from "lucide-react";

interface CompressionStep {
  step: number;
  char: string;
  current: string;
  found: boolean;
  action: string;
  dictionary: {[key: string]: number};
  output: number | null;
}

export default function LZWPage() {
  const [inputText, setInputText] = useState("ABABABAB");
  const [compressionSteps, setCompressionSteps] = useState<CompressionStep[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);

  const initializeDictionary = (): {[key: string]: number} => {
    const dict: {[key: string]: number} = {};
    // Initialize with single characters
    for (let i = 0; i < 256; i++) {
      dict[String.fromCharCode(i)] = i;
    }
    return dict;
  };

  const compressLZW = () => {
    setIsCompressing(true);
    const dict = initializeDictionary();
    const result: number[] = [];
    const steps: CompressionStep[] = [];
    let code = 256;
    let current = "";
    
    for (let i = 0; i < inputText.length; i++) {
      const char = inputText[i];
      const newString = current + char;
      
      if (dict.hasOwnProperty(newString)) {
        current = newString;
        steps.push({
          step: i + 1,
          char: char,
          current: current,
          found: true,
          action: `"${newString}" found in dictionary`,
          dictionary: {...dict},
          output: null
        });
      } else {
        result.push(dict[current]);
        steps.push({
          step: i + 1,
          char: char,
          current: current,
          found: false,
          action: `Output: ${dict[current]}, Add "${newString}" to dictionary with code ${code}`,
          dictionary: {...dict},
          output: dict[current]
        });
        
        dict[newString] = code++;
        current = char;
      }
    }
    
    if (current !== "") {
      result.push(dict[current]);
      steps.push({
        step: inputText.length + 1,
        char: "EOF",
        current: current,
        found: false,
        action: `Final output: ${dict[current]}`,
        dictionary: {...dict},
        output: dict[current]
      });
    }
    
    setCompressionSteps(steps);
    setTimeout(() => setIsCompressing(false), 500);
  };

  const reset = () => {
    setCompressionSteps([]);
    setIsCompressing(false);
  };

  const calculateCompressionRatio = () => {
    if (compressionSteps.length === 0) return "N/A";
    const originalBits = inputText.length * 8; // ASCII characters
    const compressedCodes = compressionSteps.filter(step => step.output !== null).length;
    const compressedBits = compressedCodes * 12; // Assuming 12-bit codes
    return (originalBits / compressedBits).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/cn/compression" className="inline-flex items-center text-green-200 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Compression
          </Link>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-white/20 p-3 rounded-xl">
              <FileText className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">LZW Compression</h1>
              <p className="text-green-100 text-lg">Lempel-Ziv-Welch dictionary-based compression algorithm</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Algorithm Type</h3>
              <p className="text-sm text-green-100">Dictionary-based, lossless compression</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Time Complexity</h3>
              <p className="text-sm text-green-100">O(n) - single pass through data</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Applications</h3>
              <p className="text-sm text-green-100">GIF, TIFF, PDF compression formats</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Interactive Simulator */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">LZW Compression Simulator</h2>
          
          {/* Input Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Input Text to Compress:
            </label>
            <div className="flex space-x-4">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value.toUpperCase())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter text (e.g., ABABABAB)"
              />
              <button
                onClick={compressLZW}
                disabled={isCompressing || !inputText}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
              >
                <Play className="h-4 w-4" />
                <span>Compress</span>
              </button>
              <button
                onClick={reset}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 flex items-center space-x-2"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Results */}
          {compressionSteps.length > 0 && (
            <div className="space-y-6">
              {/* Compression Ratio */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">Compression Results</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Original Size:</span> {inputText.length * 8} bits
                  </div>
                  <div>
                    <span className="font-medium">Compressed Size:</span> {compressionSteps.filter(s => s.output !== null).length * 12} bits
                  </div>
                  <div>
                    <span className="font-medium">Compression Ratio:</span> {calculateCompressionRatio()}:1
                  </div>
                </div>
              </div>

              {/* Step-by-step Process */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Compression Steps</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2 text-left">Step</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Input Char</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Current String</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Action</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Output</th>
                      </tr>
                    </thead>
                    <tbody>
                      {compressionSteps.map((step, index) => (
                        <tr key={index} className={step.output !== null ? "bg-yellow-50" : ""}>
                          <td className="border border-gray-300 px-4 py-2">{step.step}</td>
                          <td className="border border-gray-300 px-4 py-2 font-mono">{step.char}</td>
                          <td className="border border-gray-300 px-4 py-2 font-mono">{step.current}</td>
                          <td className="border border-gray-300 px-4 py-2 text-sm">{step.action}</td>
                          <td className="border border-gray-300 px-4 py-2 font-mono font-bold">
                            {step.output !== null ? step.output : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Final Output */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Compressed Output</h3>
                <div className="font-mono text-lg">
                  [{compressionSteps.filter(s => s.output !== null).map(s => s.output).join(", ")}]
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Algorithm Explanation */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">LZW Algorithm Explanation</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">How LZW Works</h3>
              <div className="space-y-3 text-gray-600">
                <p>1. <strong>Initialize Dictionary:</strong> Start with all single characters (0-255 for ASCII)</p>
                <p>2. <strong>Read Input:</strong> Process input character by character</p>
                <p>3. <strong>String Matching:</strong> Find the longest string in dictionary that matches current input</p>
                <p>4. <strong>Output Code:</strong> Output the code for the matched string</p>
                <p>5. <strong>Update Dictionary:</strong> Add the matched string + next character to dictionary with new code</p>
                <p>6. <strong>Repeat:</strong> Continue until all input is processed</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-3">Advantages</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Single pass compression</li>
                  <li>• Adaptive dictionary building</li>
                  <li>• Good compression for repetitive text</li>
                  <li>• No need to store dictionary</li>
                  <li>• Suitable for streaming data</li>
                </ul>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-3">Disadvantages</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Dictionary can grow very large</li>
                  <li>• Poor performance on random data</li>
                  <li>• Patent restrictions (expired now)</li>
                  <li>• Fixed-width codes limit efficiency</li>
                  <li>• Memory intensive for large dictionaries</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Exam Tips */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">📝 Exam Preparation Tips</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-3">Key Points to Remember</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Dictionary starts with all single characters (0-255)</li>
                <li>• Always output code for longest match found</li>
                <li>• Add concatenation of match + next char to dictionary</li>
                <li>• New dictionary entries get sequential codes (256, 257, ...)</li>
                <li>• Decompression can rebuild dictionary from codes alone</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-3">Common Exam Questions</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• "Compress given string using LZW" (10 marks)</li>
                <li>• "Show dictionary building process" (8 marks)</li>
                <li>• "Explain LZW compression steps" (6 marks)</li>
                <li>• "Compare LZW with Huffman coding" (5 marks)</li>
                <li>• "Calculate compression ratio" (3 marks)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
