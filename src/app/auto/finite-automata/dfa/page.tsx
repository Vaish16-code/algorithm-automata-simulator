"use client";

import { useState } from "react";
import { DFAChart } from "../../../components/DFAChart";
import { simulateDFA, FiniteAutomaton, State, Transition, FAResult } from "../../../utils/automataTheory";

export default function DFASimulatorPage() {
  const [states, setStates] = useState<State[]>([
    { name: "q0", isStart: true, isAccept: false },
    { name: "q1", isStart: false, isAccept: true }
  ]);
  
  const [alphabet, setAlphabet] = useState(["0", "1"]);
  const [transitions, setTransitions] = useState<Transition[]>([
    { from: "q0", to: "q1", symbol: "1" },
    { from: "q1", to: "q0", symbol: "0" },
    { from: "q0", to: "q0", symbol: "0" },
    { from: "q1", to: "q1", symbol: "1" }
  ]);
  
  const [inputString, setInputString] = useState("101");
  const [result, setResult] = useState<FAResult | null>(null);

  const handleSimulate = () => {
    const fa: FiniteAutomaton = {
      states,
      alphabet,
      transitions,
      startState: states.find(s => s.isStart)?.name || "q0",
      acceptStates: states.filter(s => s.isAccept).map(s => s.name)
    };

    const simulationResult = simulateDFA(fa, inputString);
    setResult(simulationResult);
  };

  const addState = () => {
    const newStateName = `q${states.length}`;
    setStates([...states, { name: newStateName, isStart: false, isAccept: false }]);
  };

  const removeState = (index: number) => {
    if (states.length <= 1) return;
    const stateToRemove = states[index];
    setStates(states.filter((_, i) => i !== index));
    setTransitions(transitions.filter(t => t.from !== stateToRemove.name && t.to !== stateToRemove.name));
  };

  const updateState = (index: number, field: keyof State, value: any) => {
    const newStates = [...states];
    if (field === 'isStart' && value) {
      // Only one start state allowed
      newStates.forEach(s => s.isStart = false);
    }
    newStates[index] = { ...newStates[index], [field]: value };
    setStates(newStates);
  };

  const addTransition = () => {
    if (states.length >= 2 && alphabet.length > 0) {
      setTransitions([...transitions, { 
        from: states[0].name, 
        to: states[1].name, 
        symbol: alphabet[0] 
      }]);
    }
  };

  const removeTransition = (index: number) => {
    setTransitions(transitions.filter((_, i) => i !== index));
  };

  const updateTransition = (index: number, field: keyof Transition, value: string) => {
    const newTransitions = [...transitions];
    newTransitions[index] = { ...newTransitions[index], [field]: value };
    setTransitions(newTransitions);
  };

  const addSymbol = () => {
    const newSymbol = String.fromCharCode(97 + alphabet.length); // a, b, c, ...
    setAlphabet([...alphabet, newSymbol]);
  };

  const removeSymbol = (index: number) => {
    if (alphabet.length <= 1) return;
    const symbolToRemove = alphabet[index];
    setAlphabet(alphabet.filter((_, i) => i !== index));
    setTransitions(transitions.filter(t => t.symbol !== symbolToRemove));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          DFA Simulator
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
                    value={state.name}
                    onChange={(e) => updateState(index, 'name', e.target.value)}
                    className="w-20 border rounded px-2 py-1"
                  />
                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={state.isStart}
                      onChange={(e) => updateState(index, 'isStart', e.target.checked)}
                    />
                    Start
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={state.isAccept}
                      onChange={(e) => updateState(index, 'isAccept', e.target.checked)}
                    />
                    Accept
                  </label>
                  <button
                    onClick={() => removeState(index)}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
                    disabled={states.length <= 1}
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

            {/* Alphabet */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Alphabet</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {alphabet.map((symbol, index) => (
                  <div key={index} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded">
                    <span className="font-mono">{symbol}</span>
                    <button
                      onClick={() => removeSymbol(index)}
                      className="text-red-500 hover:text-red-700"
                      disabled={alphabet.length <= 1}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={addSymbol}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Add Symbol
              </button>
            </div>

            {/* Transitions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Transitions</h2>
              {transitions.map((transition, index) => (
                <div key={index} className="flex items-center gap-2 mb-3 p-3 bg-gray-50 rounded">
                  <select
                    value={transition.from}
                    onChange={(e) => updateTransition(index, 'from', e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    {states.map(state => (
                      <option key={state.name} value={state.name}>{state.name}</option>
                    ))}
                  </select>
                  <span>→</span>
                  <select
                    value={transition.to}
                    onChange={(e) => updateTransition(index, 'to', e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    {states.map(state => (
                      <option key={state.name} value={state.name}>{state.name}</option>
                    ))}
                  </select>
                  <span>on</span>
                  <select
                    value={transition.symbol}
                    onChange={(e) => updateTransition(index, 'symbol', e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    {alphabet.map(symbol => (
                      <option key={symbol} value={symbol}>{symbol}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => removeTransition(index)}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
                  >
                    Remove
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
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Automaton Diagram</h2>
              <DFAChart 
                states={states}
                transitions={transitions}
                result={result}
              />
            </div>

            {result && (
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
                        Final State: {result.finalState}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Execution Steps:</h3>
                  <div className="max-h-60 overflow-y-auto">
                    {result.steps.map((step: any, index: number) => (
                      <div key={index} className="p-2 bg-gray-50 rounded text-sm mb-2">
                        <div className="flex justify-between">
                          <span className="font-medium">Step {index + 1}:</span>
                          <span className="text-blue-600">{step.currentState}</span>
                        </div>
                        <div className="text-gray-600">
                          Consumed: "{step.consumedInput}" | Remaining: "{step.remainingInput}"
                        </div>
                        {step.transition && (
                          <div className="text-purple-600">
                            Transition: {step.transition.from} → {step.transition.to} on '{step.transition.symbol}'
                          </div>
                        )}
                      </div>
                    ))}
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
