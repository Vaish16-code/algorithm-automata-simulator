"use client";

import { useState } from "react";
import { naiveStringMatch, NaiveStringStep, NaiveStringResult } from "@/app/utils/stringMatching";
import EducationalInfo from "@/components/EducationalInfo";

export default function NaiveStringMatchingPage() {
  const [text, setText] = useState("AABAACAADAABAABA");
  const [pattern, setPattern] = useState("AABA");
  const [result, setResult] = useState<NaiveStringResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const handleSearch = () => {
    if (!text || !pattern) return;
    
    setIsRunning(true);
    setCurrentStep(0);
    
    const searchResult = naiveStringMatch(text, pattern);
    setResult(searchResult);
    
    // Animate through steps
    animateSteps(searchResult.steps);
  };

  const animateSteps = (steps: NaiveStringStep[]) => {
    steps.forEach((_, index) => {
      setTimeout(() => {
        setCurrentStep(index);
        if (index === steps.length - 1) {
          setIsRunning(false);
        }
      }, index * 800);
    });
  };

  const renderStringComparison = () => {
    if (!result || !result.steps.length) return null;
    
    const step = result.steps[currentStep];
    const textArray = step.text.split('');
    const patternArray = step.pattern.split('');
    
    return (
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Step {step.step + 1}: {step.description}</h3>
        
        {/* Text display */}
        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-2">Text:</div>
          <div className="font-mono text-lg flex gap-1">
            {textArray.map((char: string, index: number) => (
              <span
                key={index}
                className={`w-8 h-8 flex items-center justify-center border-2 rounded ${
                  index === step.textIndex + step.patternIndex
                    ? step.matched 
                      ? 'bg-green-200 border-green-500 text-green-800'
                      : 'bg-red-200 border-red-500 text-red-800'
                    : index >= step.textIndex && index < step.textIndex + pattern.length
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
          <div className="text-sm text-gray-600 mb-2">Pattern (aligned at position {step.textIndex}):</div>
          <div className="font-mono text-lg flex gap-1">
            {/* Empty spaces before pattern */}
            {Array.from({ length: step.textIndex }, (_, i) => (
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
                    : 'bg-yellow-100 border-yellow-300'
                }`}
              >
                {char}
              </span>
            ))}
          </div>
        </div>

        <div className="text-sm">
          <p><strong>Comparison:</strong> {step.comparison}</p>
          <p><strong>Result:</strong> {step.matched ? 'Match!' : 'No match'}</p>
          {step.found && <p className="text-green-600 font-semibold">✓ Pattern found at position {step.textIndex}!</p>}
        </div>
      </div>
    );
  };

  const educationalInfo = {
    topic: "Naive String Matching",
    description: "The naive (or brute-force) string matching algorithm is the simplest approach to find occurrences of a pattern in a text.",
    theory: {
      definition: "Naive string matching is a straightforward algorithm that checks for pattern occurrences by comparing the pattern with every possible position in the text.",
      keyPoints: [
        "Compares pattern character by character with text",
        "Shifts pattern by one position on mismatch",
        "Simple but inefficient for large texts",
        "No preprocessing required"
      ],
      applications: [
        "Text editors for simple search functionality",
        "Basic pattern matching in small documents",
        "Teaching fundamental string algorithms",
        "Baseline for algorithm comparison"
      ]
    },
    mumbaiUniversity: {
      syllabus: [
        "String matching algorithms",
        "Brute force approach",
        "Time and space complexity analysis",
        "Comparison with efficient algorithms"
      ],
      marks: "10-15 marks",
      commonQuestions: [
        "Explain naive string matching with example",
        "What is the time complexity of naive string matching?",
        "Compare naive approach with KMP algorithm",
        "Trace naive algorithm for given text and pattern"
      ],
      examTips: [
        "Draw step-by-step comparison diagrams",
        "Calculate exact number of comparisons",
        "Mention worst-case scenario examples",
        "Compare with other string matching algorithms"
      ]
    },
    algorithm: {
      steps: [
        "Start at the beginning of the text",
        "Compare pattern with text at current position character by character",
        "If all characters match, record the position as a match",
        "If mismatch occurs, shift pattern by one position to the right",
        "Repeat until pattern is found or end of text is reached"
      ],
      complexity: {
        time: "O(n*m) where n is text length and m is pattern length",
        space: "O(1) - constant space"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
            Naive String Matching Simulator
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
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 bg-white focus:border-blue-500 focus:outline-none font-mono"
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
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 bg-white focus:border-blue-500 focus:outline-none font-mono"
                placeholder="Enter pattern..."
              />
            </div>
          </div>

          <div className="text-center mb-8">
            <button
              onClick={handleSearch}
              disabled={isRunning || !text || !pattern}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg transition-colors"
            >
              {isRunning ? "Searching..." : "Start Search"}
            </button>
          </div>

          {/* Visualization */}
          {result && (
            <div className="mb-8">
              {renderStringComparison()}
              
              {/* Results Summary */}
              {!isRunning && (
                <div className="mt-6 p-6 bg-blue-50 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">Search Results</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{result.matches.length}</div>
                      <div className="text-sm text-gray-600">Matches Found</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{result.totalComparisons}</div>
                      <div className="text-sm text-gray-600">Total Comparisons</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{result.steps.length}</div>
                      <div className="text-sm text-gray-600">Algorithm Steps</div>
                    </div>
                  </div>
                  
                  {result.matches.length > 0 && (
                    <div className="mt-4">
                      <p className="font-semibold">Pattern found at positions: {result.matches.join(", ")}</p>
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
            <div className="p-6 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">Key Concepts to Remember:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Naive string matching has O(n*m) time complexity</li>
                <li>It uses O(1) space complexity</li>
                <li>The algorithm shifts pattern by one position on each mismatch</li>
                <li>It&apos;s simple but inefficient for large texts with repetitive patterns</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
