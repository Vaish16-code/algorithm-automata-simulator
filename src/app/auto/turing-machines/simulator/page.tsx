"use client";

import { useState } from "react";
import { TMChart } from "../../../components/TMChart";
import { simulateTuringMachine, TuringMachine, TMTransition, TMResult, TMStep } from "../../../utils/automataTheory";
import { EducationalInfo, ExamResult } from "../../../../components";

export default function TuringMachineSimulatorPage() {
  const [states, setStates] = useState(["q0", "qaccept", "qreject"]);
  const [alphabet] = useState(["0", "1"]);
  const [tapeAlphabet, setTapeAlphabet] = useState(["0", "1", "_"]);
  const [transitions, setTransitions] = useState<TMTransition[]>([
    { currentState: "q0", readSymbol: "0", writeSymbol: "1", moveDirection: "R", nextState: "q0" },
    { currentState: "q0", readSymbol: "1", writeSymbol: "0", moveDirection: "R", nextState: "q0" },
    { currentState: "q0", readSymbol: "_", writeSymbol: "_", moveDirection: "L", nextState: "qaccept" }
  ]);
  
  const [inputString, setInputString] = useState("01101");
  const [result, setResult] = useState<TMResult | null>(null);

  const handleSimulate = () => {
    const tm: TuringMachine = {
      states,
      alphabet,
      tapeAlphabet,
      transitions,
      startState: "q0",
      acceptState: "qaccept",
      rejectState: "qreject",
      blankSymbol: "_"
    };

    const simulationResult = simulateTuringMachine(tm, inputString);
    setResult(simulationResult);
  };

  const addState = () => {
    const newStateName = `q${states.length}`;
    setStates([...states, newStateName]);
  };

  const removeState = (index: number) => {
    if (states.length <= 3) return; // Keep at least q0, qaccept, qreject
    const stateToRemove = states[index];
    setStates(states.filter((_, i) => i !== index));
    setTransitions(transitions.filter(t => 
      t.currentState !== stateToRemove && t.nextState !== stateToRemove
    ));
  };

  const addTransition = () => {
    if (states.length >= 1 && tapeAlphabet.length > 0) {
      setTransitions([...transitions, {
        currentState: states[0],
        readSymbol: tapeAlphabet[0],
        writeSymbol: tapeAlphabet[0],
        moveDirection: "R",
        nextState: states[0]
      }]);
    }
  };

  const removeTransition = (index: number) => {
    setTransitions(transitions.filter((_, i) => i !== index));
  };

  const updateTransition = (index: number, field: keyof TMTransition, value: string) => {
    const newTransitions = [...transitions];
    newTransitions[index] = { ...newTransitions[index], [field]: value };
    setTransitions(newTransitions);
  };

  const addTapeSymbol = () => {
    const newSymbol = String.fromCharCode(65 + tapeAlphabet.length - 3); // A, B, C, ...
    setTapeAlphabet([...tapeAlphabet, newSymbol]);
  };

  const removeTapeSymbol = (index: number) => {
    if (tapeAlphabet.length <= 3) return; // Keep at least 0, 1, _
    const symbolToRemove = tapeAlphabet[index];
    setTapeAlphabet(tapeAlphabet.filter((_, i) => i !== index));
    setTransitions(transitions.filter(t => 
      t.readSymbol !== symbolToRemove && t.writeSymbol !== symbolToRemove
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Turing Machine <span className="text-emerald-600">Simulator</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Design and simulate Turing machines to understand the fundamentals of computation theory
          </p>
        </div>

        <EducationalInfo
          topic="Turing Machine"
          description="Turing machines are abstract computational models that define the theoretical limits of computation. They consist of an infinite tape, a read/write head, and a finite state control."
          theory={{
            definition: "A Turing Machine is a 7-tuple M = (Q, Σ, Γ, δ, q₀, qaccept, qreject) where Q is finite set of states, Σ is input alphabet, Γ is tape alphabet, δ is transition function, q₀ is start state, qaccept is accept state, and qreject is reject state.",
            keyPoints: [
              "Infinite tape divided into cells, each containing a symbol",
              "Read/write head can move left or right on the tape",
              "Transition function determines next state, symbol to write, and head movement",
              "Fundamental model for understanding computability and complexity"
            ],
            applications: [
              "Theoretical foundation for modern computer science",
              "Computability theory and decidable problems",
              "Complexity theory and algorithm analysis",
              "Understanding limits of computation"
            ]
          }}
          mumbaiUniversity={{
            syllabus: [
              "Turing Machine definition and components",
              "Transition function and configurations",
              "Acceptance and rejection conditions",
              "Church-Turing thesis",
              "Decidable and undecidable problems"
            ],
            marks: "12-15 marks",
            commonQuestions: [
              "Design TM for simple string operations",
              "Trace execution of TM on given input",
              "Prove decidability/undecidability of problems",
              "Compare computational models"
            ],
            examTips: [
              "Practice designing TMs for simple string operations",
              "Understand the Church-Turing thesis",
              "Know the difference between deterministic and non-deterministic TMs",
              "Remember that TMs can simulate any algorithm"
            ]
          }}
          algorithm={{
            steps: [
              "Initialize tape with input string",
              "Set head to leftmost position and state to start state",
              "Read symbol under head and apply transition function",
              "Write new symbol, move head, and change state",
              "Repeat until accept, reject, or infinite loop",
              "Return result based on final state"
            ],
            complexity: {
              time: "Depends on specific TM design",
              space: "O(s(n)) where s(n) is space complexity function"
            }
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            {/* States */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">States</h2>
              {states.map((state, index) => (
                <div key={index} className="flex items-center gap-4 mb-3 p-3 bg-gray-50 rounded">
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => {
                      const newStates = [...states];
                      newStates[index] = e.target.value;
                      setStates(newStates);
                    }}
                    className="flex-1 border rounded px-2 py-1"
                  />
                  <span className={`text-xs px-2 py-1 rounded ${
                    state === 'q0' ? 'bg-blue-100 text-blue-700' :
                    state === 'qaccept' ? 'bg-green-100 text-green-700' :
                    state === 'qreject' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {state === 'q0' ? 'START' : 
                     state === 'qaccept' ? 'ACCEPT' :
                     state === 'qreject' ? 'REJECT' : 'NORMAL'}
                  </span>
                  <button
                    onClick={() => removeState(index)}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
                    disabled={states.length <= 3 || ['q0', 'qaccept', 'qreject'].includes(state)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={addState}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Add State
              </button>
            </div>

            {/* Tape Alphabet */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Tape Alphabet</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {tapeAlphabet.map((symbol, index) => (
                  <div key={index} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded">
                    <span className="font-mono">{symbol}</span>
                    <button
                      onClick={() => removeTapeSymbol(index)}
                      className="text-red-500 hover:text-red-700"
                      disabled={tapeAlphabet.length <= 3}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={addTapeSymbol}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Add Symbol
              </button>
            </div>

            {/* Transitions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Transitions</h2>
              <div className="text-xs text-gray-600 mb-4">
                Format: (state, read) → (write, direction, next_state)
              </div>
              {transitions.map((transition, index) => (
                <div key={index} className="grid grid-cols-6 gap-2 mb-3 p-3 bg-gray-50 rounded items-center">
                  <select
                    value={transition.currentState}
                    onChange={(e) => updateTransition(index, 'currentState', e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    {states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                  
                  <select
                    value={transition.readSymbol}
                    onChange={(e) => updateTransition(index, 'readSymbol', e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    {tapeAlphabet.map(symbol => (
                      <option key={symbol} value={symbol}>{symbol}</option>
                    ))}
                  </select>
                  
                  <select
                    value={transition.writeSymbol}
                    onChange={(e) => updateTransition(index, 'writeSymbol', e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    {tapeAlphabet.map(symbol => (
                      <option key={symbol} value={symbol}>{symbol}</option>
                    ))}
                  </select>
                  
                  <select
                    value={transition.moveDirection}
                    onChange={(e) => updateTransition(index, 'moveDirection', e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="L">L</option>
                    <option value="R">R</option>
                  </select>
                  
                  <select
                    value={transition.nextState}
                    onChange={(e) => updateTransition(index, 'nextState', e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    {states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                  
                  <button
                    onClick={() => removeTransition(index)}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                  >
                    Del
                  </button>
                </div>
              ))}
              <button
                onClick={addTransition}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
              >
                Add Transition
              </button>
            </div>

            {/* Input String */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Input String</h2>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={inputString}
                  onChange={(e) => setInputString(e.target.value)}
                  placeholder="Enter input string"
                  className="flex-1 border border-gray-300 rounded px-3 py-2"
                />
                <button
                  onClick={handleSimulate}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded font-medium"
                >
                  Simulate
                </button>
              </div>
            </div>
          </div>

          {/* Visualization Section */}
          <div className="space-y-6">
            {result && (
              <ExamResult
                title="Turing Machine Simulation"
                input={inputString}
                result={result.accepted}
                steps={result.steps.map((step: TMStep, index: number) => ({
                  stepNumber: index,
                  description: step.transition 
                    ? `δ(${step.transition.currentState}, ${step.transition.readSymbol}) = (${step.transition.writeSymbol}, ${step.transition.moveDirection}, ${step.transition.nextState})`
                    : "Initial configuration",
                  currentState: `State: ${step.state}, Head: ${step.headPosition}`,
                  explanation: step.transition
                    ? "Transition function applied to change state and tape"
                    : "Starting configuration of the Turing machine"
                }))}
                finalAnswer={result.accepted ? `String "${inputString}" is ACCEPTED` : `String "${inputString}" is REJECTED`}
                examFormat={{
                  question: `Design and simulate a Turing Machine for the input string "${inputString}". Show the step-by-step execution.`,
                  solution: [
                    `Given TM M = (Q, Σ, Γ, δ, q₀, qaccept, qreject) where:`,
                    `Q = {${states.join(', ')}} (states)`,
                    `Γ = {${tapeAlphabet.join(', ')}} (tape alphabet)`,
                    `q₀ = q0 (start state)`,
                    `Transition function δ:`,
                    ...transitions.map(t => `  δ(${t.currentState}, ${t.readSymbol}) = (${t.writeSymbol}, ${t.moveDirection}, ${t.nextState})`),
                    `Execution trace:`,
                    ...result.steps.slice(0, 8).map((step: TMStep, index: number) => 
                      `  Step ${index}: ${step.state} | ${step.tape.map((s: string, i: number) => 
                        i === step.headPosition ? `[${s}]` : s
                      ).join('')}`
                    )
                  ],
                  conclusion: result.accepted 
                    ? `The Turing Machine accepts the string "${inputString}" by reaching the accept state.`
                    : `The Turing Machine rejects the string "${inputString}" by reaching the reject state.`,
                  marks: 15
                }}
              />
            )}

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Machine Configuration</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">States:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {states.map(state => (
                        <span key={state} className={`px-2 py-1 rounded text-xs font-mono ${
                          state === 'q0' ? 'bg-blue-100 text-blue-800' :
                          state === 'qaccept' ? 'bg-green-100 text-green-800' :
                          state === 'qreject' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {state}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Tape Alphabet:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {tapeAlphabet.map(symbol => (
                        <span key={symbol} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-mono">
                          {symbol}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700">Transition Function:</span>
                  <div className="mt-2 space-y-1 max-h-48 overflow-y-auto">
                    {transitions.map((trans, index) => (
                      <div key={index} className="text-sm font-mono bg-gray-50 p-2 rounded border">
                        <span className="text-blue-600">δ({trans.currentState}, {trans.readSymbol})</span> 
                        <span className="mx-2">=</span> 
                        <span className="text-green-600">({trans.writeSymbol}, {trans.moveDirection}, {trans.nextState})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {result && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Tape Visualization</h3>
                <TMChart result={result} />
                
                <div className="mt-4">
                  <h4 className="font-medium text-gray-700 mb-2">Step-by-Step Execution:</h4>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {result.steps.slice(0, 10).map((step: TMStep, index: number) => (
                      <div key={index} className="p-3 bg-gray-50 rounded text-sm">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">Step {index}:</span>
                          <span className={`px-2 py-1 rounded text-xs font-mono ${
                            step.state === 'qaccept' ? 'bg-green-100 text-green-800' :
                            step.state === 'qreject' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {step.state}
                          </span>
                        </div>
                        <div className="font-mono text-xs bg-white p-2 rounded border">
                          {step.tape.map((symbol: string, i: number) => (
                            <span 
                              key={i} 
                              className={`px-1 border-r border-gray-200 ${
                                i === step.headPosition ? 'bg-yellow-200 font-bold' : ''
                              }`}
                            >
                              {symbol}
                            </span>
                          ))}
                        </div>
                        {step.transition && (
                          <div className="text-purple-600 mt-1 text-xs">
                            δ({step.transition.currentState}, {step.transition.readSymbol}) = 
                            ({step.transition.writeSymbol}, {step.transition.moveDirection}, {step.transition.nextState})
                          </div>
                        )}
                      </div>
                    ))}
                    {result.steps.length > 10 && (
                      <div className="text-center text-gray-500 text-sm">
                        ... and {result.steps.length - 10} more steps
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
