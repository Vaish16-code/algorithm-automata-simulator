"use client";

import { useState } from "react";
import { EducationalInfo, ExamResult } from "@/components";
import { BookOpen, CheckCircle2, X, ArrowRight, Check } from "lucide-react";

export default function PumpingLemmaPage() {
  const [language, setLanguage] = useState<string>("{a^n b^n | n ≥ 0}");
  const [pumpingLength, setPumpingLength] = useState<number>(3);
  const [string, setString] = useState<string>("aabb");
  const [decomposition, setDecomposition] = useState<{x: string, y: string, z: string}>({
    x: "a",
    y: "a",
    z: "bb"
  });
  const [showProof, setShowProof] = useState<boolean>(false);
  const [selectedExampleIndex, setSelectedExampleIndex] = useState<number | null>(null);

  const examples = [
    {
      language: "{a^n b^n | n ≥ 0}",
      description: "Equal number of a's followed by b's",
      pumpingLength: 3,
      string: "aabb",
      decomposition: {x: "a", y: "a", z: "bb"},
      proof: "For any pumping length p, choose string a^p b^p. If y contains only a's, then pumping y will create too many a's. If y contains only b's, pumping will create too many b's. If y contains both a's and b's, pumping will disturb the order of a's and b's."
    },
    {
      language: "{a^n b^n c^n | n ≥ 0}",
      description: "Equal number of a's, b's, and c's",
      pumpingLength: 4,
      string: "aaabbbccc",
      decomposition: {x: "aa", y: "a", z: "bbbccc"},
      proof: "Similar to the previous example, we can choose a^p b^p c^p for any pumping length p. No matter how we decompose the string, pumping will disrupt the equality of a's, b's, and c's."
    },
    {
      language: "{a^i | i is prime}",
      description: "String of a's with prime length",
      pumpingLength: 5,
      string: "aaaaa",
      decomposition: {x: "aa", y: "a", z: "aa"},
      proof: "For any pumping length p, choose a prime q > p. The string a^q must be pumpable, but pumping will produce strings of length that are not prime."
    },
    {
      language: "{ww | w ∈ {a,b}*}",
      description: "Any string concatenated with itself",
      pumpingLength: 4,
      string: "abab",
      decomposition: {x: "a", y: "b", z: "ab"},
      proof: "For pumping length p, choose w = a^p b^p, so ww = a^p b^p a^p b^p. No matter how we decompose, pumping will disrupt the pattern of the first half matching the second half."
    }
  ];

  const handleSelectExample = (index: number) => {
    const example = examples[index];
    setLanguage(example.language);
    setPumpingLength(example.pumpingLength);
    setString(example.string);
    setDecomposition(example.decomposition);
    setSelectedExampleIndex(index);
    setShowProof(false);
  };

  const handleProve = () => {
    setShowProof(true);
  };

  // Simulates pumping the string
  const pumpString = (i: number) => {
    const { x, y, z } = decomposition;
    return x + y.repeat(i) + z;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Pumping Lemma <span className="text-blue-600">for Regular Languages</span>
          </h1>
          <p className="text-xl text-black max-w-3xl mx-auto">
            Understand and apply the pumping lemma to prove languages are not regular
          </p>
        </div>

        <EducationalInfo
          topic="Pumping Lemma for Regular Languages"
          description="The Pumping Lemma is a powerful tool used to prove that certain languages are not regular. It establishes necessary conditions for a language to be regular."
          theory={{
            definition: "If A is a regular language, then there exists a pumping length p ≥ 1 such that any string s ∈ A with |s| ≥ p can be decomposed as s = xyz where |y| ≥ 1, |xy| ≤ p, and for all i ≥ 0, xy^iz ∈ A.",
            keyPoints: [
              "The pumping lemma provides a necessary (but not sufficient) condition for a language to be regular",
              "It's typically used as a proof by contradiction to show languages are not regular",
              "The pumping constant p is related to the number of states in the minimum DFA",
              "The decomposition ensures that y can be 'pumped' (repeated) any number of times while keeping the resulting string in the language"
            ],
            applications: [
              "Proving context-free languages are not regular",
              "Understanding limitations of finite state machines",
              "Establishing language hierarchies",
              "Compiler design and formal verification"
            ]
          }}
          mumbaiUniversity={{
            syllabus: [
              "Regular Languages and their properties",
              "Pumping Lemma for Regular Languages",
              "Closure properties of Regular Languages",
              "Decision algorithms for Regular Languages"
            ],
            marks: "10-15 marks",
            commonQuestions: [
              "Use the pumping lemma to prove that language L is not regular",
              "Explain the statement of the pumping lemma with an example",
              "Prove that the language {a^n b^n | n ≥ 1} is not regular",
              "Show that the language {a^n b^m | n > m} is not regular"
            ],
            examTips: [
              "Know the formal statement of the pumping lemma thoroughly",
              "Practice applying the lemma step by step with different languages",
              "Understand the adversarial nature of choosing strings vs. decompositions",
              "Be familiar with standard non-regular language examples"
            ]
          }}
          algorithm={{
            steps: [
              "Assume by contradiction that the language L is regular",
              "By the pumping lemma, there exists a pumping length p ≥ 1",
              "Choose a string s in L where |s| ≥ p carefully to lead to contradiction",
              "For any decomposition s = xyz where |y| ≥ 1 and |xy| ≤ p",
              "Find a value of i such that xy^iz is not in L",
              "This contradicts the pumping lemma, so L is not regular"
            ],
            complexity: {
              time: "Not applicable (proof technique)",
              space: "Not applicable (proof technique)"
            }
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Interactive Section */}
          <div className="space-y-6">
            {/* Examples */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Common Non-Regular Languages</h2>
              <div className="space-y-3">
                {examples.map((example, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      selectedExampleIndex === index 
                        ? 'bg-blue-100 border-2 border-blue-500' 
                        : 'bg-gray-50 hover:bg-blue-50 border border-gray-200'
                    }`}
                    onClick={() => handleSelectExample(index)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-lg font-mono font-bold text-black">{example.language}</div>
                        <div className="text-sm text-black">{example.description}</div>
                      </div>
                      <CheckCircle2 className={`h-5 w-5 ${selectedExampleIndex === index ? 'text-blue-600' : 'text-gray-300'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Language and String Selection */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Pumping Lemma Application</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Language:</label>
                  <input
                    type="text"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full border-4 border-gray-800 rounded-lg p-3 font-mono text-black font-bold bg-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Pumping Length (p):</label>
                  <input
                    type="number"
                    value={pumpingLength}
                    onChange={(e) => setPumpingLength(parseInt(e.target.value) || 1)}
                    min={1}
                    className="w-full border-4 border-gray-800 rounded-lg p-3 font-mono text-black font-bold bg-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-black mb-1">String to Test:</label>
                  <input
                    type="text"
                    value={string}
                    onChange={(e) => setString(e.target.value)}
                    className="w-full border-4 border-gray-800 rounded-lg p-3 font-mono text-black font-bold bg-white"
                  />
                  <p className="mt-1 text-xs text-black">
                    String length: {string.length} {string.length >= pumpingLength ? '(≥ p)' : '(< p, must be ≥ p)'}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-black mb-2">Decomposition (s = xyz):</h3>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">x:</label>
                    <input
                      type="text"
                      value={decomposition.x}
                      onChange={(e) => setDecomposition({...decomposition, x: e.target.value})}
                      className="w-full border-4 border-gray-800 rounded-lg p-2 font-mono text-black font-bold bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">y (to pump):</label>
                    <input
                      type="text"
                      value={decomposition.y}
                      onChange={(e) => setDecomposition({...decomposition, y: e.target.value})}
                      className="w-full border-4 border-gray-800 rounded-lg p-2 font-mono text-black font-bold bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">z:</label>
                    <input
                      type="text"
                      value={decomposition.z}
                      onChange={(e) => setDecomposition({...decomposition, z: e.target.value})}
                      className="w-full border-4 border-gray-800 rounded-lg p-2 font-mono text-black font-bold bg-white"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex items-center mb-1">
                    <div className="h-2 w-2 bg-blue-500 rounded-full mr-2"></div>
                    <div className="text-sm text-black font-medium">Constraints:</div>
                  </div>
                  <ul className="text-xs space-y-1 text-black ml-4">
                    <li className="flex items-center">
                      <span className={decomposition.y.length >= 1 ? 'text-green-600' : 'text-red-600'}>
                        {decomposition.y.length >= 1 ? <Check size={12} className="inline mr-1" /> : <X size={12} className="inline mr-1" />}
                      </span>
                      |y| ≥ 1: y must be non-empty
                    </li>
                    <li className="flex items-center">
                      <span className={(decomposition.x.length + decomposition.y.length) <= pumpingLength ? 'text-green-600' : 'text-red-600'}>
                        {(decomposition.x.length + decomposition.y.length) <= pumpingLength ? <Check size={12} className="inline mr-1" /> : <X size={12} className="inline mr-1" />}
                      </span>
                      |xy| ≤ p: Combined length of x and y must be at most p ({pumpingLength})
                    </li>
                    <li className="flex items-center">
                      <span className={decomposition.x.length + decomposition.y.length + decomposition.z.length === string.length ? 'text-green-600' : 'text-red-600'}>
                        {decomposition.x.length + decomposition.y.length + decomposition.z.length === string.length ? <Check size={12} className="inline mr-1" /> : <X size={12} className="inline mr-1" />}
                      </span>
                      xyz = s: Concatenation must equal the original string
                    </li>
                  </ul>
                </div>
              </div>
              
              <button
                onClick={handleProve}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold flex items-center justify-center"
                disabled={decomposition.y.length < 1 || 
                  (decomposition.x.length + decomposition.y.length) > pumpingLength ||
                  decomposition.x.length + decomposition.y.length + decomposition.z.length !== string.length}
              >
                <BookOpen className="h-5 w-5 mr-2" />
                Apply Pumping Lemma
              </button>
            </div>
          </div>

          {/* Visualization Section */}
          <div className="space-y-6">
            {showProof && (
              <ExamResult
                title={`Pumping Lemma Application: ${language}`}
                input={string}
                result={false}
                steps={[
                  {
                    stepNumber: 1,
                    description: "Assume by contradiction that the language is regular",
                    explanation: "By the Pumping Lemma, there exists a pumping length p ≥ 1"
                  },
                  {
                    stepNumber: 2,
                    description: `Choose string s = "${string}" where |s| = ${string.length} ≥ p = ${pumpingLength}`,
                    explanation: "We need a string that satisfies the minimum length requirement"
                  },
                  {
                    stepNumber: 3,
                    description: `Decompose s = xyz where x = "${decomposition.x}", y = "${decomposition.y}", z = "${decomposition.z}"`,
                    explanation: `|y| = ${decomposition.y.length} ≥ 1, |xy| = ${decomposition.x.length + decomposition.y.length} ≤ ${pumpingLength}`
                  },
                  {
                    stepNumber: 4,
                    description: "Check if xy^iz ∈ L for all i ≥ 0",
                    explanation: "If not, then L is not regular"
                  },
                  {
                    stepNumber: 5,
                    description: `xy^0z = "${decomposition.x}${decomposition.z}"`,
                    explanation: "This string may or may not be in the language"
                  },
                  {
                    stepNumber: 6,
                    description: `xy^2z = "${decomposition.x}${decomposition.y.repeat(2)}${decomposition.z}"`,
                    explanation: "This string may or may not be in the language"
                  }
                ]}
                finalAnswer={`The language ${language} is not regular`}
                examFormat={{
                  question: `Prove that the language ${language} is not regular using the pumping lemma.`,
                  solution: [
                    `1. Assume by contradiction that ${language} is regular.`,
                    `2. By the pumping lemma, there exists a pumping length p = ${pumpingLength} such that any string s ∈ L with |s| ≥ p can be decomposed as s = xyz where:`,
                    `   - |y| ≥ 1 (y is non-empty)`,
                    `   - |xy| ≤ p (x and y together are at most p characters long)`,
                    `   - For all i ≥ 0, xy^iz ∈ L (pumping y any number of times keeps the string in the language)`,
                    `3. Choose s = ${string} where |s| = ${string.length} ≥ p`,
                    `4. For any decomposition s = xyz where |y| ≥ 1 and |xy| ≤ p, we consider:`,
                    `   - x = "${decomposition.x}"`,
                    `   - y = "${decomposition.y}"`,
                    `   - z = "${decomposition.z}"`,
                    `5. Now, consider i = 2: xy^2z = "${pumpString(2)}"`,
                    `   This string is not in ${language} because:`,
                    selectedExampleIndex !== null ? examples[selectedExampleIndex].proof : "The structure of the language is violated when pumping the y component.",
                    `6. This contradicts the pumping lemma, so ${language} is not regular.`
                  ],
                  conclusion: `Since we have found a contradiction to the pumping lemma, the language ${language} is not regular.`,
                  marks: 10
                }}
              />
            )}

            {!showProof && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-black">Pumping Lemma Visualization</h2>
                <div className="p-8 bg-blue-50 rounded-lg flex flex-col items-center justify-center">
                  <div className="text-center mb-8">
                    <div className="text-lg font-semibold text-gray-900 mb-2">String Decomposition</div>
                    <div className="flex items-center justify-center">
                      <div className="px-4 py-2 bg-blue-100 rounded-l-lg border-r border-blue-300">
                        <div className="text-xs text-blue-800 font-semibold">x</div>
                        <div className="font-mono text-black font-bold">{decomposition.x || "ε"}</div>
                      </div>
                      <div className="px-4 py-2 bg-green-100 border-r border-green-300">
                        <div className="text-xs text-green-800 font-semibold">y (pumped)</div>
                        <div className="font-mono text-black font-bold">{decomposition.y || "ε"}</div>
                      </div>
                      <div className="px-4 py-2 bg-purple-100 rounded-r-lg">
                        <div className="text-xs text-purple-800 font-semibold">z</div>
                        <div className="font-mono text-black font-bold">{decomposition.z || "ε"}</div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full space-y-4">
                    <div className="text-black font-semibold mb-2">Pumping Results:</div>
                    
                    {[0, 1, 2, 3].map(i => (
                      <div key={i} className="flex items-center">
                        <div className="w-16 flex-shrink-0">
                          <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-gray-200 text-gray-800">i = {i}</span>
                        </div>
                        <div className="ml-2 flex-grow">
                          <div className="p-3 bg-white rounded border-2 border-gray-300 font-mono text-black font-bold text-sm">
                            {pumpString(i)}
                          </div>
                        </div>
                        <div className="ml-2 w-20 text-right">
                          <span className="text-xs">{pumpString(i).length} chars</span>
                        </div>
                      </div>
                    ))}
                    
                    <div className="mt-4 pt-4 border-t-2 border-blue-200">
                      <div className="text-sm text-gray-900">
                        <span className="font-semibold">Pumping strategy:</span> Find a value of i where xy<sup>i</sup>z is not in the language
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-black">Pumping Lemma Proof Structure</h2>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-black mb-2">Step 1: Assume the language is regular</h3>
                  <p className="text-sm text-black">We start with the assumption that the language in question is regular. This leads to the conclusion that the pumping lemma must apply.</p>
                </div>
                
                <ArrowRight className="w-6 h-6 mx-auto text-blue-500" />
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-black mb-2">Step 2: Choose an appropriate string</h3>
                  <p className="text-sm text-black">Select a string s in the language with length at least p (the pumping length). The string should be chosen carefully to lead to a contradiction.</p>
                </div>
                
                <ArrowRight className="w-6 h-6 mx-auto text-blue-500" />
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-black mb-2">Step 3: Consider all possible decompositions</h3>
                  <p className="text-sm text-black">For any way to decompose s = xyz where |y| ≥ 1 and |xy| ≤ p, we need to show a contradiction.</p>
                </div>
                
                <ArrowRight className="w-6 h-6 mx-auto text-blue-500" />
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-black mb-2">Step 4: Find a value of i where xy<sup>i</sup>z is not in the language</h3>
                  <p className="text-sm text-black">Show that there exists an i ≥ 0 such that xy<sup>i</sup>z is not in the language. Often i = 0 or i = 2 works well.</p>
                </div>
                
                <ArrowRight className="w-6 h-6 mx-auto text-blue-500" />
                
                <div className="p-4 bg-blue-100 rounded-lg">
                  <h3 className="font-semibold text-black mb-2">Step 5: Reach a contradiction</h3>
                  <p className="text-sm text-black">Since we've found a case where the pumping property is violated, we have a contradiction to our assumption that the language is regular.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
