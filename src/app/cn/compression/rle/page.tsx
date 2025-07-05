"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Zap, Play, RotateCcw } from "lucide-react";

interface CompressionStep {
  position: number;
  character: string;
  count: number;
  original: string;
  encoded: string;
  explanation: string;
}

interface CompressionResult {
  original: string;
  compressed: string;
  steps: CompressionStep[];
  originalSize: number;
  compressedSize: number;
  ratio: string;
}

export default function RLEPage() {
  const [inputText, setInputText] = useState("AAABBBCCCDDD");
  const [compressionResult, setCompressionResult] = useState<CompressionResult | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const compressRLE = () => {
    setIsCompressing(true);
    
    const steps: CompressionStep[] = [];
    let result = "";
    let i = 0;
    
    while (i < inputText.length) {
      const currentChar = inputText[i];
      let count = 1;
      
      // Count consecutive characters
      while (i + count < inputText.length && inputText[i + count] === currentChar) {
        count++;
      }
      
      const encoded = count > 1 ? `${count}${currentChar}` : currentChar;
      result += encoded;
      
      steps.push({
        position: i,
        character: currentChar,
        count: count,
        original: inputText.substring(i, i + count),
        encoded: encoded,
        explanation: count > 1 
          ? `${count} consecutive '${currentChar}' → ${encoded}` 
          : `Single '${currentChar}' → ${currentChar}`
      });
      
      i += count;
    }
    
    const compressionResult: CompressionResult = {
      original: inputText,
      compressed: result,
      steps: steps,
      originalSize: inputText.length,
      compressedSize: result.length,
      ratio: (inputText.length / result.length).toFixed(2)
    };
    
    setCompressionResult(compressionResult);
    
    setTimeout(() => setIsCompressing(false), 500);
  };

  const decompressRLE = (compressed: string): string => {
    let result = "";
    let i = 0;
    
    while (i < compressed.length) {
      if (i < compressed.length - 1 && /\d/.test(compressed[i])) {
        const count = parseInt(compressed[i]);
        const char = compressed[i + 1];
        result += char.repeat(count);
        i += 2;
      } else {
        result += compressed[i];
        i++;
      }
    }
    
    return result;
  };

  const reset = () => {
    setCompressionResult(null);
    setIsCompressing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/cn/compression" className="inline-flex items-center text-orange-200 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Compression
          </Link>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-white/20 p-3 rounded-xl">
              <Zap className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Run-Length Encoding (RLE)</h1>
              <p className="text-orange-100 text-lg">Simple compression for repetitive data sequences</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Algorithm Type</h3>
              <p className="text-sm text-orange-100">Lossless, sequence-based compression</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Time Complexity</h3>
              <p className="text-sm text-orange-100">O(n) - single pass through data</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Best Use Case</h3>
              <p className="text-sm text-orange-100">Images, fax transmission, simple graphics</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Interactive Simulator */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">RLE Compression Simulator</h2>
          
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
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter text with repetitive patterns (e.g., AAABBBCCCDDD)"
              />
              <button
                onClick={compressRLE}
                disabled={isCompressing || !inputText}
                className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 flex items-center space-x-2"
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

          {/* Preset Examples */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Try these examples:</h3>
            <div className="flex flex-wrap gap-2">
              {["AAABBBCCCDDD", "WWWWWWWWWWWWBWWWWWWWWWWWWBBBWWWWWWWW", "AAAAABBBBCCCCDDDD", "ABCABCABC"].map((example) => (
                <button
                  key={example}
                  onClick={() => setInputText(example)}
                  className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded border"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          {compressionResult && (
            <div className="space-y-6">
              {/* Compression Summary */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="font-semibold text-orange-800 mb-3">Compression Results</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Original:</span>
                    <div className="font-mono text-lg break-all">{compressionResult.original}</div>
                  </div>
                  <div>
                    <span className="font-medium">Compressed:</span>
                    <div className="font-mono text-lg break-all text-orange-600">{compressionResult.compressed}</div>
                  </div>
                  <div>
                    <span className="font-medium">Size Reduction:</span>
                    <div className="text-lg">{compressionResult.originalSize} → {compressionResult.compressedSize} chars</div>
                  </div>
                  <div>
                    <span className="font-medium">Compression Ratio:</span>
                    <div className="text-lg font-bold text-green-600">{compressionResult.ratio}:1</div>
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
                        <th className="border border-gray-300 px-4 py-2 text-left">Position</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Character</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Count</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Original Sequence</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Encoded As</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Explanation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {compressionResult.steps.map((step, index) => (
                        <tr key={index} className={step.count > 1 ? "bg-green-50" : "bg-yellow-50"}>
                          <td className="border border-gray-300 px-4 py-2">{step.position}</td>
                          <td className="border border-gray-300 px-4 py-2 font-mono text-lg">{step.character}</td>
                          <td className="border border-gray-300 px-4 py-2 font-bold">{step.count}</td>
                          <td className="border border-gray-300 px-4 py-2 font-mono">{step.original}</td>
                          <td className="border border-gray-300 px-4 py-2 font-mono font-bold text-orange-600">{step.encoded}</td>
                          <td className="border border-gray-300 px-4 py-2 text-sm">{step.explanation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Decompression Verification */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Decompression Verification</h3>
                <div className="space-y-2">
                  <div><span className="font-medium">Compressed:</span> <span className="font-mono">{compressionResult.compressed}</span></div>
                  <div><span className="font-medium">Decompressed:</span> <span className="font-mono">{decompressRLE(compressionResult.compressed)}</span></div>
                  <div className="text-sm text-blue-600">
                    ✓ {decompressRLE(compressionResult.compressed) === compressionResult.original ? "Perfect match!" : "Error in compression/decompression"}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Algorithm Explanation */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">RLE Algorithm Explanation</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">How RLE Works</h3>
              <div className="space-y-3 text-gray-600">
                <p>1. <strong>Scan Input:</strong> Read through the input data sequentially</p>
                <p>2. <strong>Count Runs:</strong> Count consecutive identical characters</p>
                <p>3. <strong>Encode Runs:</strong> Replace runs with count + character (e.g., "AAA" → "3A")</p>
                <p>4. <strong>Handle Singles:</strong> Single characters remain unchanged or use count 1</p>
                <p>5. <strong>Output Result:</strong> Concatenate all encoded sequences</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-3">Advantages</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Extremely simple to implement</li>
                  <li>• Very fast compression/decompression</li>
                  <li>• Low memory requirements</li>
                  <li>• Perfect for repetitive data</li>
                  <li>• Real-time compression possible</li>
                </ul>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-3">Disadvantages</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Poor compression for diverse data</li>
                  <li>• Can increase file size if no repetition</li>
                  <li>• Limited to consecutive sequences</li>
                  <li>• Not suitable for text with mixed content</li>
                  <li>• Count field limits run length</li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3">Real-world Applications</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <h5 className="font-medium text-gray-800">Image Compression:</h5>
                  <ul className="space-y-1">
                    <li>• Fax machines (CCITT Group 3/4)</li>
                    <li>• Simple bitmap images</li>
                    <li>• Icons and logos</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-gray-800">Other Uses:</h5>
                  <ul className="space-y-1">
                    <li>• Video compression (as preprocessing)</li>
                    <li>• Database compression</li>
                    <li>• Simple data streaming</li>
                  </ul>
                </div>
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
                <li>• RLE works best with consecutive repeated characters</li>
                <li>• Format: count + character (e.g., "5A" for "AAAAA")</li>
                <li>• Single characters may remain unchanged</li>
                <li>• Can increase size if no repetition exists</li>
                <li>• Decompression reverses the process</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-3">Common Exam Questions</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• "Compress given string using RLE" (5 marks)</li>
                <li>• "Calculate compression ratio" (3 marks)</li>
                <li>• "When is RLE most/least effective?" (4 marks)</li>
                <li>• "Decompress RLE encoded data" (4 marks)</li>
                <li>• "Compare RLE with other algorithms" (6 marks)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
