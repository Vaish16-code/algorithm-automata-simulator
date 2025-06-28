"use client";

import { useState } from "react";
import { TMChart } from "../../../components/TMChart";
import { simulateTuringMachine, TuringMachine, TMTransition, TMResult } from "../../../utils/automataTheory";

export default function TuringMachineSimulatorPage() {
  const [states, setStates] = useState(["q0", "qaccept", "qreject"]);
  const [alphabet, setAlphabet] = useState(["0", "1"]);
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

  const updateTransition = (index: number, field: keyof TMTransition, value: any) => {
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Turing Machine Simulator
        </h1>

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
              <>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-700">Simulation Result</h2>
                  
                  <div className={`p-4 rounded-lg mb-4 ${
                    result.accepted 
                      ? 'bg-green-100 border border-green-400 text-green-700'
                      : 'bg-red-100 border border-red-400 text-red-700'
                  }`}>
                    <div className="flex items-center">
                      <span className="text-2xl mr-2">
                        {result.accepted ? '✅' : '❌'}
                      </span>
                      <div>
                        <p className="font-bold text-lg">
                          {result.accepted ? 'ACCEPTED' : 'REJECTED'}
                        </p>
                        <p className="text-sm">
                          Steps: {result.steps.length - 1}
                        </p>
                      </div>
                    </div>
                  </div>

                  <TMChart result={result} />
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="font-semibold mb-2">Execution Steps:</h3>
                  <div className="max-h-80 overflow-y-auto space-y-2">
                    {result.steps.map((step: any, index: number) => (
                      <div key={index} className="p-3 bg-gray-50 rounded text-sm">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">Step {step.step}:</span>
                          <span className="text-blue-600 font-mono">{step.state}</span>
                        </div>
                        <div className="font-mono text-xs bg-white p-2 rounded">
                          {step.tape.map((symbol: string, i: number) => (
                            <span 
                              key={i} 
                              className={i === step.headPosition ? 'bg-yellow-200 px-1' : 'px-1'}
                            >
                              {symbol}
                            </span>
                          ))}
                        </div>
                        {step.transition && (
                          <div className="text-purple-600 mt-1">
                            δ({step.transition.currentState}, {step.transition.readSymbol}) = 
                            ({step.transition.writeSymbol}, {step.transition.moveDirection}, {step.transition.nextState})
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">About Turing Machines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Key Components:</h3>
              <ul className="space-y-1 text-sm">
                <li>• Infinite tape with cells containing symbols</li>
                <li>• Read/write head that can move left or right</li>
                <li>• Finite set of states including start, accept, and reject</li>
                <li>• Transition function: δ(state, symbol) → (symbol, direction, state)</li>
                <li>• Tape alphabet including blank symbol</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Applications:</h3>
              <ul className="space-y-1 text-sm">
                <li>• Model of computation and computability theory</li>
                <li>• Theoretical foundation for modern computers</li>
                <li>• Study of decidable and undecidable problems</li>
                <li>• Complexity theory and algorithm analysis</li>
                <li>• Understanding limits of computation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
