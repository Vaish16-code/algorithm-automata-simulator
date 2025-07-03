"use client";

import { useState } from "react";
import { simulateRegex, RegexResult } from "../../../utils/automataTheory";
import { EducationalInfo, ExamResult } from "../../../../components";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Regular Expression <span className="text-orange-600">Matcher</span>
          </h1>
          <p className="text-xl text-gray-900 max-w-3xl mx-auto">
            Test and validate regular expressions against multiple input strings with detailed matching analysis
          </p>
        </div>

        <EducationalInfo
          topic="Regular Expressions (Regex)"
          description="Regular expressions are formal language patterns used to match and manipulate strings. They provide a powerful and concise way to search, match, and replace text patterns."
          theory={{
            definition: "A regular expression is a sequence of characters that defines a search pattern for strings. They are formally equivalent to finite automata and define regular languages.",
            keyPoints: [
              "Metacharacters define special matching behaviors (* + ? . | [ ] ^ $)",
              "Character classes allow matching sets of characters",
              "Quantifiers specify how many times to match",
              "Equivalent to finite automata in computational power"
            ],
            applications: [
              "Text search and pattern matching in editors",
              "Data validation (email, phone numbers, URLs)",
              "Log file analysis and data extraction",
              "Programming language lexical analysis"
            ]
          }}
          mumbaiUniversity={{
            syllabus: [
              "Regular expression definition and syntax",
              "Metacharacters and quantifiers",
              "Character classes and ranges",
              "Equivalence with finite automata",
              "Converting regex to NFA and DFA"
            ],
            marks: "6-8 marks",
            commonQuestions: [
              "Design regex for given language patterns",
              "Convert regular expression to finite automaton",
              "Test strings against regular expressions",
              "Optimize regular expressions for efficiency"
            ],
            examTips: [
              "Practice constructing regex for common patterns",
              "Understand the equivalence with finite automata",
              "Know how to convert between regex and NFA/DFA",
              "Remember precedence rules for operators"
            ]
          }}
          algorithm={{
            steps: [
              "Parse the regular expression pattern",
              "Build NFA using Thompson's construction",
              "Test input string against the automaton",
              "Return match result and captured groups"
            ],
            complexity: {
              time: "O(n*m) where n=text length, m=pattern length",
              space: "O(m) for NFA states"
            }
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Pattern Input */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Regular Expression</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Pattern:
                  </label>
                  <input
                    type="text"
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                    className="w-full border-4 border-gray-800 rounded-md px-4 py-3 font-mono text-lg font-bold text-black bg-white focus:border-orange-600 focus:ring-4 focus:ring-orange-200"
                    placeholder="Enter regular expression"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
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
                        <div className="text-gray-900 font-mono text-sm">{p.pattern}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Test Strings */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Test Strings</h2>
              
              <div className="space-y-3 mb-4">
                {testStrings.map((str, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                    <span className="flex-1 font-mono font-bold text-black">{str || "(empty string)"}</span>
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
                  className="flex-1 border-4 border-gray-800 rounded px-4 py-3 text-lg font-bold text-black bg-white focus:border-green-600 focus:ring-2 focus:ring-green-200"
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
              <ExamResult
                title="Regular Expression Test Results"
                input={`Pattern: ${pattern}`}
                result={results.some(r => r.matches)}
                steps={results.map((result, index) => ({
                  stepNumber: index + 1,
                  description: `Testing: "${testStrings[index] || '(empty)'}"`,
                  currentState: result.matches ? "MATCH" : "NO MATCH",
                  explanation: result.matches 
                    ? "String matches the regular expression pattern"
                    : "String does not match the regular expression pattern"
                }))}
                finalAnswer={`Pattern "${pattern}" matched ${results.filter(r => r.matches).length} out of ${results.length} test strings`}
                examFormat={{
                  question: `Test the regular expression "${pattern}" against the given set of strings and analyze the results.`,
                  solution: [
                    `Regular Expression: ${pattern}`,
                    `Test Results:`,
                    ...results.map((result, index) => 
                      `  "${testStrings[index] || '(empty)'}" → ${result.matches ? 'ACCEPTED' : 'REJECTED'}`
                    ),
                    `Summary: ${results.filter(r => r.matches).length} matches, ${results.filter(r => !r.matches).length} non-matches`
                  ],
                  conclusion: `The regular expression "${pattern}" has a success rate of ${((results.filter(r => r.matches).length / results.length) * 100).toFixed(1)}% for the given test set.`,
                  marks: 10
                }}
              />
            )}

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Pattern Analysis</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Current Pattern:</h4>
                  <div className="font-mono text-lg bg-white p-3 rounded border border-gray-800 font-bold text-black">
                    {pattern}
                  </div>
                </div>
                
                {results.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Test Results Summary:</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 p-3 rounded">
                        <div className="text-green-800 font-semibold">Matches</div>
                        <div className="text-2xl font-bold text-green-600">
                          {results.filter(r => r.matches).length}
                        </div>
                      </div>
                      <div className="bg-red-50 p-3 rounded">
                        <div className="text-red-800 font-semibold">Non-matches</div>
                        <div className="text-2xl font-bold text-red-600">
                          {results.filter(r => !r.matches).length}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Regular Expression Reference</h3>
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Basic Operators:</h4>
                    <div className="space-y-1 text-sm text-black">
                      <div><code className="bg-gray-100 px-1 rounded">.</code> - Any single character</div>
                      <div><code className="bg-gray-100 px-1 rounded">*</code> - Zero or more repetitions</div>
                      <div><code className="bg-gray-100 px-1 rounded">+</code> - One or more repetitions</div>
                      <div><code className="bg-gray-100 px-1 rounded">?</code> - Zero or one occurrence</div>
                      <div><code className="bg-gray-100 px-1 rounded">|</code> - Alternation (OR)</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Character Classes:</h4>
                    <div className="space-y-1 text-sm text-black">
                      <div><code className="bg-gray-100 px-1 rounded">[abc]</code> - Any of a, b, or c</div>
                      <div><code className="bg-gray-100 px-1 rounded">[a-z]</code> - Any lowercase letter</div>
                      <div><code className="bg-gray-100 px-1 rounded">[0-9]</code> - Any digit</div>
                      <div><code className="bg-gray-100 px-1 rounded">\d</code> - Digit character</div>
                      <div><code className="bg-gray-100 px-1 rounded">\w</code> - Word character</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Example Patterns:</h4>
                  <div className="space-y-1 text-sm text-black">
                    <div><code className="bg-gray-100 px-1 rounded">ab*</code> - &quot;a&quot; followed by zero or more &quot;b&quot;s</div>
                    <div><code className="bg-gray-100 px-1 rounded">(ab)+</code> - One or more &quot;ab&quot; sequences</div>
                    <div><code className="bg-gray-100 px-1 rounded">a|b</code> - Either &quot;a&quot; or &quot;b&quot;</div>
                    <div><code className="bg-gray-100 px-1 rounded">^a.*b$</code> - Starts with &quot;a&quot;, ends with &quot;b&quot;</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
