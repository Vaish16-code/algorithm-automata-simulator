"use client";

import { useState } from "react";
import { kmpStringMatch, KMPStep, KMPResult } from "@/app/utils/stringMatching";
import EducationalInfo from "@/components/EducationalInfo";

export default function KMPStringMatchingPage() {
  const [text, setText] = useState("AABAACAADAABAABA");
  const [pattern, setPattern] = useState("AABA");
  const [result, setResult] = useState<KMPResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const handleSearch = () => {
    if (!text || !pattern) return;
    
    setIsRunning(true);
    setCurrentStep(0);
    
    const searchResult = kmpStringMatch(text, pattern);
    setResult(searchResult);
    
    // Animate through steps
    animateSteps(searchResult.steps);
  };

  const animateSteps = (steps: KMPStep[]) => {
    steps.forEach((_, index) => {
      setTimeout(() => {
        setCurrentStep(index);
        if (index === steps.length - 1) {
          setIsRunning(false);
        }
      }, index * 1000);
    });
  };

  const renderKMPVisualization = () => {
    if (!result || !result.steps.length) return null;
    
    const step = result.steps[currentStep];
    const textArray = step.text.split('');
    const patternArray = step.pattern.split('');
    
    return (
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Step {step.step + 1}: {step.description}</h3>
        
        {/* LPS Array Display */}
        {result.lps && (
          <div className="mb-6">
            <div className="text-sm text-gray-600 mb-2">LPS Array (Longest Proper Prefix which is also Suffix):</div>
            <div className="flex gap-1 font-mono">
              {result.lps.map((value: number, index: number) => (
                <div key={index} className="flex flex-col items-center">
                  <span className="w-8 h-8 flex items-center justify-center border-2 border-purple-300 bg-purple-100 rounded text-sm">
                    {pattern[index]}
                  </span>
                  <span className="w-8 h-6 flex items-center justify-center text-xs bg-purple-200 rounded-b">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Text display */}
        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-2">Text:</div>
          <div className="font-mono text-lg flex gap-1">
            {textArray.map((char: string, index: number) => (
              <span
                key={index}
                className={`w-8 h-8 flex items-center justify-center border-2 rounded ${
                  index === step.textIndex
                    ? step.matched 
                      ? 'bg-green-200 border-green-500 text-green-800'
                      : 'bg-red-200 border-red-500 text-red-800'
                    : index >= step.textIndex - step.patternIndex && index < step.textIndex - step.patternIndex + pattern.length
                    ? 'bg-blue-100 border-blue-300'
                    : 'bg-white border-gray-300'
                }`}
              >
                {char}
              </span>
            ))}
          </div>
          <div className="text-xs text-gray-500 flex gap-1 mt-1">
            {textArray.map((_: string, index: number) => (
              <span key={index} className="w-8 text-center">{index}</span>
            ))}
          </div>
        </div>

        {/* Pattern display */}
        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-2">Pattern (at position {step.textIndex - step.patternIndex}):</div>
          <div className="font-mono text-lg flex gap-1">
            {/* Empty spaces before pattern */}
            {Array.from({ length: Math.max(0, step.textIndex - step.patternIndex) }, (_, i) => (
              <span key={`empty-${i}`} className="w-8 h-8"></span>
            ))}
            {/* Pattern characters */}
            {patternArray.map((char: string, index: number) => (
              <span
                key={index}
                className={`w-8 h-8 flex items-center justify-center border-2 rounded ${
                  index === step.patternIndex
                    ? step.matched
                      ? 'bg-green-200 border-green-500 text-green-800'
                      : 'bg-red-200 border-red-500 text-red-800'
                    : index < step.patternIndex
                    ? 'bg-green-100 border-green-300'
                    : 'bg-yellow-100 border-yellow-300'
                }`}
              >
                {char}
              </span>
            ))}
          </div>
        </div>

        <div className="text-sm space-y-1">
          <p><strong>Text Index:</strong> {step.textIndex}</p>
          <p><strong>Pattern Index:</strong> {step.patternIndex}</p>
          <p><strong>Comparison:</strong> {step.comparison}</p>
          <p><strong>Result:</strong> {step.matched ? 'Match!' : 'Mismatch'}</p>
          {step.shift > 0 && <p className="text-blue-600"><strong>Skip using LPS:</strong> {step.shift} positions</p>}
          {step.found && <p className="text-green-600 font-semibold">✓ Pattern found at position {step.textIndex - step.patternIndex}!</p>}
        </div>
      </div>
    );
  };

  const educationalInfo = {
    topic: "KMP String Matching",
    description: "The Knuth-Morris-Pratt (KMP) algorithm is an efficient string matching algorithm that uses preprocessing to avoid redundant comparisons.",
    theory: {
      definition: "KMP algorithm uses a failure function (LPS array) to determine how much of the pattern can be skipped when a mismatch occurs, achieving linear time complexity.",
      keyPoints: [
        "Preprocessing creates LPS (Longest Proper Prefix which is also Suffix) array",
        "Never moves backwards in the text",
        "Optimal time complexity O(n + m)",
        "Uses pattern's structure to avoid redundant comparisons"
      ],
      applications: [
        "Text processing in editors and IDEs",
        "Bioinformatics for DNA sequence matching",
        "Network intrusion detection systems",
        "Large-scale text search engines"
      ]
    },
    mumbaiUniversity: {
      syllabus: [
        "KMP algorithm and LPS array",
        "Preprocessing and failure function",
        "Time complexity analysis",
        "Comparison with naive approach"
      ],
      marks: "15-20 marks",
      commonQuestions: [
        "Explain KMP algorithm with LPS array construction",
        "What is the advantage of KMP over naive string matching?",
        "Construct LPS array for given pattern",
        "Trace KMP algorithm for given text and pattern"
      ],
      examTips: [
        "Practice LPS array construction thoroughly",
        "Understand the concept of proper prefix and suffix",
        "Draw step-by-step execution with text and pattern indices",
        "Explain why KMP never goes backward in text"
      ]
    },
    algorithm: {
      steps: [
        "Construct LPS (failure function) array for the pattern",
        "Initialize text index (i) and pattern index (j) to 0",
        "Compare text[i] with pattern[j]",
        "If match, increment both i and j",
        "If mismatch and j > 0, set j = LPS[j-1] (skip characters)",
        "If mismatch and j = 0, increment i",
        "Repeat until text is completely scanned"
      ],
      complexity: {
        time: "O(n + m) where n is text length and m is pattern length",
        space: "O(m) for storing the LPS array"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
            KMP String Matching Simulator
          </h1>

          {/* Input Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Text to Search In:
              </label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 bg-white focus:border-purple-500 focus:outline-none font-mono"
                placeholder="Enter text..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pattern to Find:
              </label>
              <input
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 bg-white focus:border-purple-500 focus:outline-none font-mono"
                placeholder="Enter pattern..."
              />
            </div>
          </div>

          <div className="text-center mb-8">
            <button
              onClick={handleSearch}
              disabled={isRunning || !text || !pattern}
              className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg transition-colors"
            >
              {isRunning ? "Searching..." : "Start KMP Search"}
            </button>
          </div>

          {/* Visualization */}
          {result && (
            <div className="mb-8">
              {renderKMPVisualization()}
              
              {/* Results Summary */}
              {!isRunning && (
                <div className="mt-6 p-6 bg-purple-50 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">Search Results</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{result.matches.length}</div>
                      <div className="text-sm text-gray-600">Matches Found</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{result.totalComparisons}</div>
                      <div className="text-sm text-gray-600">Total Comparisons</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{result.steps.length}</div>
                      <div className="text-sm text-gray-600">Algorithm Steps</div>
                    </div>
                  </div>
                  
                  {result.matches.length > 0 && (
                    <div className="mt-4">
                      <p className="font-semibold">Pattern found at positions: {result.matches.join(", ")}</p>
                    </div>
                  )}
                  
                  {result.lps && (
                    <div className="mt-4">
                      <p className="font-semibold">LPS Array: [{result.lps.join(", ")}]</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Educational Content */}
        <EducationalInfo {...educationalInfo} />

        {/* Quiz Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Test Your Understanding</h2>
          <div className="space-y-6">
            <div className="p-6 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">Key Concepts to Remember:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>KMP algorithm has O(n + m) time complexity</li>
                <li>LPS array helps in skipping redundant comparisons</li>
                <li>The algorithm never moves backward in the text</li>
                <li>Preprocessing phase constructs the failure function</li>
                <li>Space complexity is O(m) for the LPS array</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
