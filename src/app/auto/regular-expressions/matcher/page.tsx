"use client";

import { useState } from "react";
import { simulateRegex, RegexResult } from "../../../utils/automataTheory";

export default function RegexMatcherPage() {
  const [pattern, setPattern] = useState("(a|b)*abb");
  const [testStrings, setTestStrings] = useState([
    "abb",
    "aabb", 
    "babb",
    "ababb",
    "ab",
    "ba",
    "abba"
  ]);
  const [newTestString, setNewTestString] = useState("");
  const [results, setResults] = useState<RegexResult[]>([]);

  const handleTest = () => {
    const testResults = testStrings.map(str => simulateRegex(pattern, str));
    setResults(testResults);
  };

  const addTestString = () => {
    if (newTestString.trim() && !testStrings.includes(newTestString)) {
      setTestStrings([...testStrings, newTestString.trim()]);
      setNewTestString("");
    }
  };

  const removeTestString = (index: number) => {
    setTestStrings(testStrings.filter((_, i) => i !== index));
  };

  const commonPatterns = [
    { name: "Email Pattern", pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}" },
    { name: "Phone Number", pattern: "\\d{3}-\\d{3}-\\d{4}" },
    { name: "Binary Numbers", pattern: "[01]+" },
    { name: "Even Length", pattern: "(..)*" },
    { name: "Starts with 'a'", pattern: "a.*" },
    { name: "Ends with 'b'", pattern: ".*b" },
    { name: "Contains 'ab'", pattern: ".*ab.*" },
    { name: "Palindrome (3 chars)", pattern: "(a.a|b.b)" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Regular Expression Matcher
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Pattern Input */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Regular Expression</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pattern:
                  </label>
                  <input
                    type="text"
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 font-mono"
                    placeholder="Enter regular expression"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Common Patterns:
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {commonPatterns.map((p, index) => (
                      <button
                        key={index}
                        onClick={() => setPattern(p.pattern)}
                        className="text-left p-2 bg-gray-50 hover:bg-gray-100 rounded border text-sm"
                      >
                        <div className="font-medium">{p.name}</div>
                        <div className="text-gray-600 font-mono text-xs">{p.pattern}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Test Strings */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Test Strings</h2>
              
              <div className="space-y-3 mb-4">
                {testStrings.map((str, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                    <span className="flex-1 font-mono">{str || "(empty string)"}</span>
                    {results.length > 0 && results[index] && (
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        results[index].matches 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {results[index].matches ? 'MATCH' : 'NO MATCH'}
                      </span>
                    )}
                    <button
                      onClick={() => removeTestString(index)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTestString}
                  onChange={(e) => setNewTestString(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTestString()}
                  placeholder="Add test string"
                  className="flex-1 border border-gray-300 rounded px-3 py-2"
                />
                <button
                  onClick={addTestString}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleTest}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-medium text-lg"
              >
                Test Pattern
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {results.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Test Results</h2>
                
                <div className="space-y-4">
                  {results.map((result, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-lg">{testStrings[index] || "(empty)"}</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          result.matches 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {result.matches ? 'MATCH' : 'NO MATCH'}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        <div className="mb-2">
                          <span className="font-medium">Pattern:</span> 
                          <span className="font-mono ml-2">{result.pattern}</span>
                        </div>
                        <div>
                          <span className="font-medium">Steps:</span>
                          <div className="mt-1 space-y-1">
                            {result.steps.map((step: string, stepIndex: number) => (
                              <div key={stepIndex} className="text-xs bg-gray-100 p-2 rounded">
                                {step}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Summary</h3>
                  <div className="text-sm text-blue-700">
                    <div>Total Tests: {results.length}</div>
                    <div>Matches: {results.filter(r => r.matches).length}</div>
                    <div>Non-matches: {results.filter(r => !r.matches).length}</div>
                    <div>Success Rate: {((results.filter(r => r.matches).length / results.length) * 100).toFixed(1)}%</div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Regular Expression Syntax</h2>
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">Basic Operators:</h3>
                    <ul className="space-y-1 text-xs">
                      <li><code className="bg-gray-100 px-1">.</code> - Any character</li>
                      <li><code className="bg-gray-100 px-1">*</code> - Zero or more</li>
                      <li><code className="bg-gray-100 px-1">+</code> - One or more</li>
                      <li><code className="bg-gray-100 px-1">?</code> - Zero or one</li>
                      <li><code className="bg-gray-100 px-1">|</code> - Alternation (OR)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Character Classes:</h3>
                    <ul className="space-y-1 text-xs">
                      <li><code className="bg-gray-100 px-1">[abc]</code> - Any of a, b, c</li>
                      <li><code className="bg-gray-100 px-1">[a-z]</code> - Any lowercase</li>
                      <li><code className="bg-gray-100 px-1">[0-9]</code> - Any digit</li>
                      <li><code className="bg-gray-100 px-1">\d</code> - Digit</li>
                      <li><code className="bg-gray-100 px-1">\w</code> - Word character</li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Examples:</h3>
                  <ul className="space-y-1 text-xs">
                    <li><code className="bg-gray-100 px-1">ab*</code> - "a" followed by zero or more "b"s</li>
                    <li><code className="bg-gray-100 px-1">(ab)+</code> - One or more "ab" sequences</li>
                    <li><code className="bg-gray-100 px-1">a|b</code> - Either "a" or "b"</li>
                    <li><code className="bg-gray-100 px-1">^a.*b$</code> - Starts with "a", ends with "b"</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
