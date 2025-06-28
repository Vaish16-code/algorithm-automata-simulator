"use client";

import { useState } from "react";
import { simulateCFG, ContextFreeGrammar, CFGProduction, CFGResult } from "../../../utils/automataTheory";

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

  const updateProduction = (index: number, field: 'left' | 'right', value: any) => {
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

  const loadExample = (example: any) => {
    setTerminals(example.terminals);
    setNonTerminals(example.nonTerminals);
    setProductions(example.productions);
    setStartSymbol(example.startSymbol);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Context-Free Grammar Parser
        </h1>

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
                    className="border rounded px-2 py-1"
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
                      className="border rounded px-2 py-1"
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
                      className="flex-1 border rounded px-2 py-1"
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
                  className="flex-1 border border-gray-300 rounded px-3 py-2"
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
              <>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-700">Parse Result</h2>
                  
                  <div className={`p-4 rounded-lg mb-4 ${
                    result.canDerive 
                      ? 'bg-green-100 border border-green-400 text-green-700'
                      : 'bg-red-100 border border-red-400 text-red-700'
                  }`}>
                    <div className="flex items-center">
                      <span className="text-2xl mr-2">
                        {result.canDerive ? '✅' : '❌'}
                      </span>
                      <div>
                        <p className="font-bold text-lg">
                          {result.canDerive ? 'DERIVABLE' : 'NOT DERIVABLE'}
                        </p>
                        <p className="text-sm">
                          String: "{targetString}"
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold">Derivation Steps:</h3>
                    <div className="max-h-80 overflow-y-auto space-y-2">
                      {result.derivation.map((step: any, index: number) => (
                        <div key={index} className="p-3 bg-gray-50 rounded">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">Step {step.step}:</span>
                            {step.productionUsed && (
                              <span className="text-purple-600 text-sm">
                                {step.productionUsed.left} → {step.productionUsed.right.join(' ') || 'ε'}
                              </span>
                            )}
                          </div>
                          <div className="font-mono bg-white p-2 rounded border">
                            {step.sententialForm.map((symbol: string, i: number) => (
                              <span 
                                key={i}
                                className={`px-1 ${
                                  step.appliedAt === i ? 'bg-yellow-200' : ''
                                } ${
                                  nonTerminals.includes(symbol) ? 'font-bold text-green-600' : 'text-blue-600'
                                }`}
                              >
                                {symbol}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-3">Grammar Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Terminals:</span> {terminals.join(', ')}
                    </div>
                    <div>
                      <span className="font-medium">Non-terminals:</span> {nonTerminals.join(', ')}
                    </div>
                    <div>
                      <span className="font-medium">Start Symbol:</span> {startSymbol}
                    </div>
                    <div>
                      <span className="font-medium">Productions:</span> {productions.length}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Grammar Rules:</h4>
                    <div className="space-y-1">
                      {productions.map((prod, index) => (
                        <div key={index} className="text-xs font-mono bg-gray-100 p-1 rounded">
                          {prod.left} → {prod.right.join(' ') || 'ε'}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">About Context-Free Grammars</h2>
              <div className="space-y-3 text-sm text-gray-600">
                <div>
                  <h3 className="font-medium text-gray-800 mb-1">Components:</h3>
                  <ul className="space-y-1 text-xs">
                    <li>• <strong>Terminals:</strong> Basic symbols of the language</li>
                    <li>• <strong>Non-terminals:</strong> Variables that can be expanded</li>
                    <li>• <strong>Productions:</strong> Rules for replacing non-terminals</li>
                    <li>• <strong>Start Symbol:</strong> The initial non-terminal</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-800 mb-1">Applications:</h3>
                  <ul className="space-y-1 text-xs">
                    <li>• Programming language syntax definition</li>
                    <li>• Parser construction and compiler design</li>
                    <li>• Natural language processing</li>
                    <li>• XML and markup language processing</li>
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
