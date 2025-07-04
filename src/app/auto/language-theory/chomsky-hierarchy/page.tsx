"use client";

import { useState } from "react";
import { EducationalInfo } from "@/components";
import { BookOpen, ArrowDown, ArrowUp, Check } from "lucide-react";

export default function ChomskyHierarchyPage() {
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [selectedExample, setSelectedExample] = useState<string | null>(null);
  
  const grammarTypes = [
    {
      type: "Type 0",
      name: "Recursively Enumerable",
      description: "Unrestricted grammar; accepted by Turing machines",
      rules: "α → β, where α, β are strings of terminals and non-terminals, and α contains at least one non-terminal",
      examples: [
        "L = {a^n b^n c^n d^n | n ≥ 1}",
        "Halting Problem language"
      ],
      automaton: "Turing Machine",
      color: "bg-red-100 border-red-500 text-red-800",
      iconColor: "text-red-500"
    },
    {
      type: "Type 1",
      name: "Context-Sensitive",
      description: "Accepted by linear bounded automata",
      rules: "αAβ → αγβ, where A is a non-terminal, α, β are strings of terminals and non-terminals, and γ is a non-empty string of terminals and non-terminals",
      examples: [
        "L = {a^n b^n c^n | n ≥ 1}",
        "L = {ww | w ∈ {a,b}*}"
      ],
      automaton: "Linear Bounded Automaton",
      color: "bg-orange-100 border-orange-500 text-orange-800",
      iconColor: "text-orange-500"
    },
    {
      type: "Type 2",
      name: "Context-Free",
      description: "Accepted by pushdown automata",
      rules: "A → γ, where A is a non-terminal and γ is a string of terminals and non-terminals",
      examples: [
        "L = {a^n b^n | n ≥ 1}",
        "L = {w ∈ {a,b}* | w is a palindrome}"
      ],
      automaton: "Pushdown Automaton",
      color: "bg-green-100 border-green-500 text-green-800",
      iconColor: "text-green-500"
    },
    {
      type: "Type 3",
      name: "Regular",
      description: "Accepted by finite automata",
      rules: "A → aB or A → a, where A, B are non-terminals and a is a terminal",
      examples: [
        "L = {a^n | n ≥ 0}",
        "L = {w ∈ {a,b}* | w ends with ab}"
      ],
      automaton: "Finite Automaton",
      color: "bg-blue-100 border-blue-500 text-blue-800",
      iconColor: "text-blue-500"
    }
  ];

  const examples = [
    {
      language: "L = {a^n | n ≥ 0}",
      description: "Any number of a's",
      type: 3,
      grammar: "S → aS | ε",
      explanation: "This language can be accepted by a DFA with two states."
    },
    {
      language: "L = {a^n b^n | n ≥ 1}",
      description: "Equal number of a's followed by b's",
      type: 2,
      grammar: "S → aSb | ab",
      explanation: "This requires a stack to count and match the number of a's and b's."
    },
    {
      language: "L = {a^n b^n c^n | n ≥ 1}",
      description: "Equal number of a's, b's, and c's",
      type: 1,
      grammar: "S → aSBC | aBC\nCB → BC\naB → ab\nbB → bb\nbC → bc\ncC → cc",
      explanation: "This language needs a context-sensitive grammar as it requires two counters."
    },
    {
      language: "L = {ww | w ∈ {a,b}*}",
      description: "Any string concatenated with itself",
      type: 1,
      grammar: "Complex context-sensitive grammar",
      explanation: "This language requires a linear bounded automaton to recognize."
    },
    {
      language: "Halting Problem language",
      description: "The set of all Turing machines that halt on empty input",
      type: 0,
      grammar: "Unrestricted grammar (too complex to represent)",
      explanation: "This language is recursively enumerable but not recursive."
    }
  ];

  const handleTypeClick = (index: number) => {
    setSelectedType(selectedType === index ? null : index);
  };

  const handleExampleClick = (language: string) => {
    setSelectedExample(selectedExample === language ? null : language);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Chomsky <span className="text-teal-600">Hierarchy</span>
          </h1>
          <p className="text-xl text-black max-w-3xl mx-auto">
            Understanding the four types of formal grammars and their corresponding languages and automata
          </p>
        </div>

        <EducationalInfo
          topic="Chomsky Hierarchy"
          description="The Chomsky Hierarchy is a classification of formal grammars and languages that provides a framework for understanding computational power and expressiveness."
          theory={{
            definition: "The Chomsky Hierarchy classifies formal grammars into four types (0-3) based on their rule restrictions, with corresponding languages and automata models.",
            keyPoints: [
              "Type 0: Unrestricted grammars, recognized by Turing machines",
              "Type 1: Context-sensitive grammars, recognized by linear bounded automata",
              "Type 2: Context-free grammars, recognized by pushdown automata",
              "Type 3: Regular grammars, recognized by finite automata"
            ],
            applications: [
              "Compiler design and parsing algorithms",
              "Natural language processing",
              "Formal verification of systems",
              "Understanding computational complexity"
            ]
          }}
          mumbaiUniversity={{
            syllabus: [
              "Chomsky hierarchy of grammars and languages",
              "Regular, context-free, context-sensitive, and recursive languages",
              "Relationship between grammar types and automata",
              "Limitations of each language class"
            ],
            marks: "8-10 marks",
            commonQuestions: [
              "Explain the Chomsky hierarchy with examples",
              "Compare and contrast the four types of grammars",
              "Explain the relationship between grammars and corresponding automata",
              "Classify given grammars into appropriate Chomsky hierarchy types"
            ],
            examTips: [
              "Know the formal definitions of each grammar type",
              "Understand the containment relationship between language classes",
              "Be able to provide concrete examples for each grammar type",
              "Remember that each grammar type corresponds to a specific automaton model"
            ]
          }}
          algorithm={{
            steps: [
              "Identify the grammar rules",
              "Check the form of productions against the constraints of each type",
              "Type 0: No restrictions on productions",
              "Type 1: Productions can't decrease length (context-sensitive)",
              "Type 2: Left side must be a single non-terminal (context-free)",
              "Type 3: Right side must be a terminal optionally followed by a non-terminal (regular)"
            ],
            complexity: {
              time: "Varies by grammar type",
              space: "Varies by grammar type"
            }
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Hierarchy Visualization */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-black">Chomsky Hierarchy</h2>
              <div className="relative py-4">
                {/* Vertical line connecting all boxes */}
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-300 transform -translate-x-1/2"></div>
                
                {grammarTypes.map((type, index) => (
                  <div key={index} className="mb-8 relative">
                    <div 
                      className={`p-6 rounded-lg border-2 max-w-md mx-auto cursor-pointer ${
                        selectedType === index ? type.color : 'bg-white border-gray-200'
                      } transition-all duration-300 hover:shadow-md ${
                        selectedType === index ? 'shadow-lg transform scale-105' : ''
                      }`}
                      onClick={() => handleTypeClick(index)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-lg">{type.type}: {type.name}</h3>
                        {selectedType === index ? 
                          <ArrowUp className={`h-5 w-5 ${type.iconColor}`} /> :
                          <ArrowDown className={`h-5 w-5 ${type.iconColor}`} />
                        }
                      </div>
                      <p className="text-black mb-3">{type.description}</p>
                      {selectedType === index && (
                        <div className="mt-4 space-y-3 text-black">
                          <div>
                            <h4 className="font-semibold text-black mb-1">Grammar Rules:</h4>
                            <p className="text-sm bg-white/80 p-2 rounded font-mono">{type.rules}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-black mb-1">Corresponding Automaton:</h4>
                            <p className="text-sm font-medium">{type.automaton}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-black mb-1">Example Languages:</h4>
                            <ul className="space-y-1">
                              {type.examples.map((example, i) => (
                                <li 
                                  key={i} 
                                  className="text-sm font-mono bg-white/80 p-2 rounded cursor-pointer hover:bg-gray-100"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleExampleClick(example);
                                  }}
                                >
                                  {example}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Arrow connecting to next box */}
                    {index < grammarTypes.length - 1 && (
                      <div className="absolute left-1/2 -bottom-6 transform -translate-x-1/2">
                        <div className="bg-white rounded-full p-1 z-10 relative">
                          <ArrowDown className="h-5 w-5 text-gray-500" />
                        </div>
                        <div className="absolute left-1/2 text-xs text-gray-600 whitespace-nowrap transform translate-x-6 -translate-y-3">
                          subset of
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-black">Complexity and Power</h2>
              <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-1/3 text-right font-semibold text-black">Computational Power:</div>
                  <div className="w-2/3">
                    <div className="h-8 bg-gradient-to-r from-blue-500 to-red-500 rounded-lg relative">
                      <div className="absolute inset-0 flex justify-between items-center px-3 text-xs text-white font-bold">
                        <span>Less Powerful</span>
                        <span>More Powerful</span>
                      </div>
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-black font-medium">
                      <span>Regular</span>
                      <span>Context-Free</span>
                      <span>Context-Sensitive</span>
                      <span>Recursive</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-1/3 text-right font-semibold text-black">Recognition Complexity:</div>
                  <div className="w-2/3">
                    <div className="h-8 bg-gradient-to-r from-green-500 to-red-500 rounded-lg relative">
                      <div className="absolute inset-0 flex justify-between items-center px-3 text-xs text-white font-bold">
                        <span>Less Complex</span>
                        <span>More Complex</span>
                      </div>
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-black font-medium">
                      <span>O(n)</span>
                      <span>O(n³)</span>
                      <span>PSPACE</span>
                      <span>Undecidable</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Examples and Properties */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-black">Language Examples</h2>
              <div className="space-y-3">
                {examples.map((example, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      selectedExample === example.language
                        ? `bg-${grammarTypes[example.type].iconColor.split('-')[1]}-100 border-2 border-${grammarTypes[example.type].iconColor.split('-')[1]}-500`
                        : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                    }`}
                    onClick={() => handleExampleClick(example.language)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="font-mono font-bold text-black">{example.language}</div>
                        <div className="text-sm text-black">{example.description}</div>
                      </div>
                      <div className={`ml-4 px-2 py-1 rounded text-xs font-semibold ${grammarTypes[example.type].color}`}>
                        {grammarTypes[example.type].type}
                      </div>
                    </div>
                    
                    {selectedExample === example.language && (
                      <div className="mt-4 pt-4 border-t border-gray-200 text-black">
                        <div className="mb-3">
                          <div className="font-semibold mb-1">Grammar:</div>
                          <pre className="bg-gray-50 p-3 rounded font-mono text-sm whitespace-pre-wrap">
                            {example.grammar}
                          </pre>
                        </div>
                        <div>
                          <div className="font-semibold mb-1">Explanation:</div>
                          <p className="text-sm">{example.explanation}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-black">Hierarchy Relationships</h2>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-black mb-2">Containment</h3>
                  <p className="text-sm text-black">Each language class is a proper subset of the classes above it:</p>
                  <div className="flex items-center justify-center my-4 font-mono font-bold text-black">
                    Regular ⊂ Context-Free ⊂ Context-Sensitive ⊂ Recursive ⊂ Recursively Enumerable
                  </div>
                  <p className="text-xs text-black">This means that every regular language is context-free, but not every context-free language is regular, and so on.</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold text-black mb-2">Closure Properties</h3>
                    <ul className="text-sm space-y-1 text-black">
                      <li className="flex items-center">
                        <Check size={16} className="text-green-600 mr-2" />
                        Regular languages: Union, intersection, complement
                      </li>
                      <li className="flex items-center">
                        <Check size={16} className="text-green-600 mr-2" />
                        Context-free: Union, concatenation, Kleene star
                      </li>
                      <li className="flex items-center">
                        <Check size={16} className="text-green-600 mr-2" />
                        Not closed: Context-free languages under intersection
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h3 className="font-semibold text-black mb-2">Decision Problems</h3>
                    <ul className="text-sm space-y-1 text-black">
                      <li className="flex items-center">
                        <Check size={16} className="text-green-600 mr-2" />
                        Regular: Membership, emptiness, equivalence
                      </li>
                      <li className="flex items-center">
                        <Check size={16} className="text-green-600 mr-2" />
                        Context-free: Membership, emptiness
                      </li>
                      <li className="flex items-center">
                        <div className="text-red-600 mr-2">✗</div>
                        Context-free: Equivalence (undecidable)
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h3 className="font-semibold text-black mb-2">Practical Significance</h3>
                  <ul className="text-sm space-y-2 text-black">
                    <li className="flex items-center">
                      <BookOpen className="h-4 w-4 text-yellow-600 mr-2" />
                      <span><strong>Regular languages:</strong> Used for lexical analysis in compilers (tokens)</span>
                    </li>
                    <li className="flex items-center">
                      <BookOpen className="h-4 w-4 text-yellow-600 mr-2" />
                      <span><strong>Context-free languages:</strong> Used for syntax analysis (parsing) in compilers</span>
                    </li>
                    <li className="flex items-center">
                      <BookOpen className="h-4 w-4 text-yellow-600 mr-2" />
                      <span><strong>Context-sensitive and beyond:</strong> Natural languages and complex systems modeling</span>
                    </li>
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
