"use client";

import { useState } from "react";
import { simulateCFG, ContextFreeGrammar, CFGProduction, CFGResult } from "../../../utils/automataTheory";
import { EducationalInfo, ExamResult } from "../../../../components";

export default function CFGParserPage() {
  const [terminals, setTerminals] = useState(["a", "b"]);
  const [nonTerminals, setNonTerminals] = useState(["S", "A", "B"]);
  const [productions, setProductions] = useState<CFGProduction[]>([
    { left: "S", right: ["A", "B"] },
    { left: "A", right: ["a", "A"] },
    { left: "A", right: ["a"] },
    { left: "B", right: ["b", "B"] },
    { left: "B", right: ["b"] }
  ]);
  const [startSymbol, setStartSymbol] = useState("S");
  const [targetString, setTargetString] = useState("aabb");
  const [result, setResult] = useState<CFGResult | null>(null);

  const handleParse = () => {
    const cfg: ContextFreeGrammar = {
      terminals,
      nonTerminals,
      productions,
      startSymbol
    };

    const parseResult = simulateCFG(cfg, targetString);
    setResult(parseResult);
  };

  const addTerminal = () => {
    const newTerminal = String.fromCharCode(97 + terminals.length); // a, b, c, ...
    if (!terminals.includes(newTerminal)) {
      setTerminals([...terminals, newTerminal]);
    }
  };

  const removeTerminal = (index: number) => {
    if (terminals.length <= 1) return;
    const terminalToRemove = terminals[index];
    setTerminals(terminals.filter((_, i) => i !== index));
    // Remove productions containing this terminal
    setProductions(productions.filter(p => 
      !p.right.includes(terminalToRemove)
    ));
  };

  const addNonTerminal = () => {
    const newNonTerminal = String.fromCharCode(65 + nonTerminals.length); // A, B, C, ...
    if (!nonTerminals.includes(newNonTerminal)) {
      setNonTerminals([...nonTerminals, newNonTerminal]);
    }
  };

  const removeNonTerminal = (index: number) => {
    if (nonTerminals.length <= 1) return;
    const nonTerminalToRemove = nonTerminals[index];
    setNonTerminals(nonTerminals.filter((_, i) => i !== index));
    // Remove productions with this non-terminal
    setProductions(productions.filter(p => 
      p.left !== nonTerminalToRemove && !p.right.includes(nonTerminalToRemove)
    ));
  };

  const addProduction = () => {
    if (nonTerminals.length > 0) {
      setProductions([...productions, { 
        left: nonTerminals[0], 
        right: [terminals[0] || "a"] 
      }]);
    }
  };

  const removeProduction = (index: number) => {
    setProductions(productions.filter((_, i) => i !== index));
  };

  const updateProduction = (index: number, field: 'left' | 'right', value: string) => {
    const newProductions = [...productions];
    if (field === 'right') {
      newProductions[index] = { ...newProductions[index], right: value.split(' ').filter((s: string) => s.trim()) };
    } else {
      newProductions[index] = { ...newProductions[index], [field]: value };
    }
    setProductions(newProductions);
  };

  const exampleGrammars = [
    {
      name: "Balanced Parentheses",
      terminals: ["(", ")"],
      nonTerminals: ["S"],
      productions: [
        { left: "S", right: ["(", "S", ")"] },
        { left: "S", right: ["S", "S"] },
        { left: "S", right: [] } // epsilon
      ],
      startSymbol: "S"
    },
    {
      name: "Arithmetic Expressions",
      terminals: ["+", "*", "(", ")", "id"],
      nonTerminals: ["E", "T", "F"],
      productions: [
        { left: "E", right: ["E", "+", "T"] },
        { left: "E", right: ["T"] },
        { left: "T", right: ["T", "*", "F"] },
        { left: "T", right: ["F"] },
        { left: "F", right: ["(", "E", ")"] },
        { left: "F", right: ["id"] }
      ],
      startSymbol: "E"
    }
  ];

  const loadExample = (example: {
    name: string;
    terminals: string[];
    nonTerminals: string[];
    productions: CFGProduction[];
    startSymbol: string;
  }) => {
    setTerminals(example.terminals);
    setNonTerminals(example.nonTerminals);
    setProductions(example.productions);
    setStartSymbol(example.startSymbol);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Context-Free Grammar <span className="text-blue-600">Parser</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Design and test context-free grammars for parsing structured languages and expressions
          </p>
        </div>

        <EducationalInfo
          topic="Context-Free Grammar (CFG)"
          description="Context-Free Grammars are formal grammar systems that define the syntax of context-free languages. They are essential for parsing programming languages, XML, and mathematical expressions."
          theory={{
            definition: "A Context-Free Grammar is a 4-tuple G = (V, Σ, R, S) where V is a finite set of non-terminals, Σ is a finite set of terminals, R is a finite set of production rules, and S is the start symbol.",
            keyPoints: [
              "Production rules define how non-terminals expand into terminals and non-terminals",
              "Supports nested structures and recursive definitions",
              "Foundation for compiler design and parser construction",
              "Used in programming language syntax specification"
            ],
            applications: [
              "Programming language parsers and compilers",
              "XML and markup language processing",
              "Mathematical expression evaluation",
              "Natural language processing systems"
            ]
          }}
          mumbaiUniversity={{
            syllabus: [
              "Context-Free Grammar definition and components",
              "Derivations: leftmost and rightmost",
              "Parse trees and ambiguity",
              "Chomsky Normal Form and Greibach Normal Form",
              "Pumping Lemma for Context-Free Languages"
            ],
            marks: "8-10 marks",
            commonQuestions: [
              "Design CFG for given language specifications",
              "Convert CFG to CNF or GNF",
              "Check if a string belongs to a given CFG",
              "Eliminate left recursion and left factoring"
            ],
            examTips: [
              "Focus on leftmost and rightmost derivations",
              "Practice converting between different normal forms",
              "Remember the pumping lemma for context-free languages",
              "Understand the relationship between CFGs and pushdown automata"
            ]
          }}
          algorithm={{
            steps: [
              "Define terminals, non-terminals, and start symbol",
              "Create production rules for the language",
              "Apply productions to derive target string",
              "Verify derivation and parse tree construction"
            ],
            complexity: {
              time: "O(n³) for CYK parsing",
              space: "O(n²) for parse table"
            }
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Example Grammars */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Example Grammars</h2>
              <div className="space-y-2">
                {exampleGrammars.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => loadExample(example)}
                    className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded border"
                  >
                    <div className="font-medium">{example.name}</div>
                    <div className="text-sm text-gray-600">
                      {example.productions.length} productions, {example.terminals.length} terminals
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Terminals */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Terminals</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {terminals.map((terminal, index) => (
                  <div key={index} className="flex items-center gap-2 bg-blue-100 px-3 py-1 rounded">
                    <span className="font-mono">{terminal}</span>
                    <button
                      onClick={() => removeTerminal(index)}
                      className="text-red-500 hover:text-red-700"
                      disabled={terminals.length <= 1}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={addTerminal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Add Terminal
              </button>
            </div>

            {/* Non-terminals */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Non-terminals</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {nonTerminals.map((nonTerminal, index) => (
                  <div key={index} className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded">
                    <span className="font-mono font-bold">{nonTerminal}</span>
                    <button
                      onClick={() => removeNonTerminal(index)}
                      className="text-red-500 hover:text-red-700"
                      disabled={nonTerminals.length <= 1}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={addNonTerminal}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  Add Non-terminal
                </button>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Start Symbol:</label>
                  <select
                    value={startSymbol}
                    onChange={(e) => setStartSymbol(e.target.value)}
                    className="border-4 border-gray-800 rounded px-3 py-2 text-lg font-bold text-black bg-white focus:border-green-600 focus:ring-2 focus:ring-green-200"
                  >
                    {nonTerminals.map(nt => (
                      <option key={nt} value={nt}>{nt}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Productions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Productions</h2>
              <div className="space-y-3 mb-4">
                {productions.map((production, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                    <select
                      value={production.left}
                      onChange={(e) => updateProduction(index, 'left', e.target.value)}
                      className="border-4 border-gray-800 rounded px-3 py-2 text-lg font-bold text-black bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
                    >
                      {nonTerminals.map(nt => (
                        <option key={nt} value={nt}>{nt}</option>
                      ))}
                    </select>
                    <span>→</span>
                    <input
                      type="text"
                      value={production.right.join(' ')}
                      onChange={(e) => updateProduction(index, 'right', e.target.value)}
                      placeholder="Space-separated symbols (empty for ε)"
                      className="flex-1 border-4 border-gray-800 rounded px-4 py-2 text-lg font-bold text-black bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
                    />
                    <button
                      onClick={() => removeProduction(index)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={addProduction}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
              >
                Add Production
              </button>
            </div>

            {/* Target String */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Target String</h2>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={targetString}
                  onChange={(e) => setTargetString(e.target.value)}
                  placeholder="Enter string to parse"
                  className="flex-1 border-4 border-gray-800 rounded px-4 py-3 text-lg font-bold text-black bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-200"
                />
                <button
                  onClick={handleParse}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded font-medium"
                >
                  Parse
                </button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {result && (
              <ExamResult
                title="CFG Parse Analysis"
                input={targetString}
                result={result.canDerive}
                steps={result.derivation.map((step: { sententialForm: string[]; productionUsed?: CFGProduction }, index: number) => ({
                  stepNumber: index + 1,
                  description: step.productionUsed 
                    ? `Applied: ${step.productionUsed.left} → ${step.productionUsed.right.join(' ') || 'ε'}`
                    : "Initial sentential form",
                  currentState: step.sententialForm.join(' '),
                  explanation: step.productionUsed
                    ? `Production rule applied to derive new sentential form`
                    : "Starting with the start symbol"
                }))}
                finalAnswer={result.canDerive ? `String "${targetString}" is DERIVABLE` : `String "${targetString}" is NOT DERIVABLE`}
                examFormat={{
                  question: `Design a Context-Free Grammar and check if the string "${targetString}" can be derived from it.`,
                  solution: [
                    `Given CFG G = (V, Σ, R, S) where:`,
                    `V = {${nonTerminals.join(', ')}} (non-terminals)`,
                    `Σ = {${terminals.join(', ')}} (terminals)`,
                    `S = ${startSymbol} (start symbol)`,
                    `Production rules R:`,
                    ...productions.map(p => `  ${p.left} → ${p.right.join(' ') || 'ε'}`),
                    `Derivation sequence:`,
                    ...result.derivation.map((step: { sententialForm: string[] }) => `  ${step.sententialForm.join(' ')}`)
                  ],
                  conclusion: result.canDerive 
                    ? `The string "${targetString}" can be derived from the given CFG through the above derivation sequence.`
                    : `The string "${targetString}" cannot be derived from the given CFG.`,
                  marks: 12
                }}
              />
            )}

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Grammar Visualization</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Terminals:</span> 
                    <div className="mt-1 flex flex-wrap gap-1">
                      {terminals.map(t => (
                        <span key={t} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-mono">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Non-terminals:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {nonTerminals.map(nt => (
                        <span key={nt} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-mono font-bold">{nt}</span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700">Production Rules:</span>
                  <div className="mt-2 space-y-1 max-h-48 overflow-y-auto">
                    {productions.map((prod, index) => (
                      <div key={index} className="text-sm font-mono bg-gray-50 p-2 rounded border">
                        <span className="text-green-600 font-bold">{prod.left}</span> 
                        <span className="mx-2">→</span> 
                        <span className="text-blue-600">
                          {prod.right.length > 0 ? prod.right.join(' ') : 'ε'}
                        </span>
                      </div>
                    ))}
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
