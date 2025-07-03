"use client";

import { useState } from "react";
import { DFAChart } from "../../../components/DFAChart";
import { simulateNFA, FiniteAutomaton, State, Transition, FAResult } from "../../../utils/automataTheory";
import EducationalInfo from "@/components/EducationalInfo";
import ExamResult from "@/components/ExamResult";
import { Play, Plus, Trash2, Settings, BookOpen, Cpu, ArrowRight } from "lucide-react";

export default function NFASimulatorPage() {
  const [states, setStates] = useState<State[]>([
    { name: "q0", isStart: true, isAccept: false },
    { name: "q1", isStart: false, isAccept: true }
  ]);
  
  const [alphabet, setAlphabet] = useState(["0", "1", "ε"]);
  const [transitions, setTransitions] = useState<Transition[]>([
    { from: "q0", to: "q0", symbol: "0" },
    { from: "q0", to: "q1", symbol: "1" },
    { from: "q0", to: "q1", symbol: "ε" },
    { from: "q1", to: "q1", symbol: "1" }
  ]);
  
  const [inputString, setInputString] = useState("01");
  const [result, setResult] = useState<FAResult | null>(null);
  const [showEducationalInfo, setShowEducationalInfo] = useState(true);

  const educationalData = {
    topic: "Non-deterministic Finite Automaton (NFA)",
    description: "A mathematical model of computation that can be in multiple states simultaneously",
    theory: {
      definition: "An NFA is a 5-tuple (Q, Σ, δ, q₀, F) where Q is finite set of states, Σ is input alphabet, δ is transition function mapping a state and input symbol to a set of states, q₀ is start state, and F is set of final states.",
      keyPoints: [
        "May have multiple possible transitions for a state-symbol pair",
        "Can have ε-transitions (transitions without consuming input)",
        "Non-deterministic - can follow multiple paths simultaneously",
        "Recognizes regular languages only",
        "Equivalent in power to DFAs, but can be more concise"
      ],
      applications: [
        "Pattern matching in text processing",
        "Lexical analysis in compilers",
        "Regular expression implementation",
        "Protocol verification",
        "Natural language processing"
      ]
    },
    mumbaiUniversity: {
      syllabus: [
        "NFA Definition and Components",
        "ε-NFA and its significance",
        "State Transition Diagrams",
        "Subset Construction (NFA to DFA conversion)",
        "Relationship with Regular Languages",
        "Kleene's Theorem"
      ],
      marks: "15-20",
      commonQuestions: [
        "Design NFA for given language specifications",
        "Convert NFA to DFA using subset construction",
        "Prove equivalence of NFA and DFA",
        "Construct NFA for regular expressions"
      ],
      examTips: [
        "Show multiple transitions clearly for same symbol",
        "Mark ε-transitions distinctly",
        "Use set notation for transition function",
        "Verify by tracing all possible paths",
        "Be careful with acceptance conditions"
      ]
    },
    algorithm: {
      steps: [
        "Initialize current state set to {q₀}",
        "For each input symbol, compute next state set",
        "Follow all possible transitions for current states",
        "Include ε-closure at each step if applicable",
        "Accept if any final state is in the final state set"
      ],
      complexity: {
        time: "O(n|Q|²)",
        space: "O(|Q|)"
      }
    }
  };

  const handleSimulate = () => {
    const fa: FiniteAutomaton = {
      states,
      alphabet,
      transitions,
      startState: states.find(s => s.isStart)?.name || "q0",
      acceptStates: states.filter(s => s.isAccept).map(s => s.name)
    };

    const simulationResult = simulateNFA(fa, inputString);
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

  const updateState = (index: number, field: keyof State, value: string | boolean) => {
    const newStates = [...states];
    if (field === 'isStart' && value) {
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
    // Skip ε as it's already included
    const newSymbol = String.fromCharCode(97 + (alphabet.length - 1));
    setAlphabet([...alphabet, newSymbol]);
  };

  const removeSymbol = (index: number) => {
    if (alphabet.length <= 2) return; // Keep at least one symbol plus ε
    const symbolToRemove = alphabet[index];
    if (symbolToRemove === "ε") return; // Don't remove epsilon
    setAlphabet(alphabet.filter((_, i) => i !== index));
    setTransitions(transitions.filter(t => t.symbol !== symbolToRemove));
  };

  const getExamResult = () => {
    if (!result) return null;
    
    const examSteps = result.steps.map((step, index) => ({
      stepNumber: index + 1,
      description: index === 0 
        ? `Initialize: Start at state ${step.currentState}`
        : step.transition 
          ? `Read '${step.transition.symbol}', transition from ${step.transition.from} to ${step.transition.to}`
          : `Processing complete at state set {${step.currentState}}`,
      currentState: step.currentState,
      input: step.remainingInput || 'ε',
      transition: step.transition ? `δ(${step.transition.from}, ${step.transition.symbol}) = {${step.transition.to}}` : undefined,
      explanation: index === 0
        ? "NFA starts at the designated start state"
        : step.transition
          ? `Non-deterministic: may have multiple next states for a state-symbol pair`
          : result.accepted 
            ? "String completely processed and at least one current state is in final state set"
            : "String completely processed but no current state is in final state set"
    }));

    return (
      <ExamResult
        title="NFA Simulation"
        input={inputString}
        result={result.accepted}
        steps={examSteps}
        finalAnswer={result.accepted ? `String "${inputString}" is ACCEPTED` : `String "${inputString}" is REJECTED`}
        examFormat={{
          question: `Design and simulate an NFA that accepts the string "${inputString}". Show the step-by-step execution.`,
          solution: [
            `Given NFA M = (Q, Σ, δ, q₀, F) where:`,
            `Q = {${states.map(s => s.name).join(', ')}} (set of states)`,
            `Σ = {${alphabet.filter(s => s !== 'ε').join(', ')}} (input alphabet)`,
            `q₀ = ${states.find(s => s.isStart)?.name} (start state)`,
            `F = {${states.filter(s => s.isAccept).map(s => s.name).join(', ')}} (final states)`,
            `Transition function δ is defined by the transition table above`
          ],
          conclusion: result.accepted 
            ? `The string "${inputString}" is accepted by the NFA as at least one path leads to a final state.`
            : `The string "${inputString}" is rejected by the NFA as no path leads to a final state.`,
          marks: 15
        }}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <Cpu className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">NFA Simulator</h1>
                <p className="text-purple-100">Non-deterministic Finite Automaton Interactive Tool</p>
              </div>
            </div>
            <button
              onClick={() => setShowEducationalInfo(!showEducationalInfo)}
              className="flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
            >
              <BookOpen className="h-5 w-5 mr-2" />
              {showEducationalInfo ? 'Hide' : 'Show'} Theory
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Educational Information */}
        {showEducationalInfo && (
          <div className="mb-8">
            <EducationalInfo {...educationalData} />
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Configuration Panel */}
          <div className="space-y-6">
            {/* States Configuration */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 text-white">
                <h2 className="text-xl font-bold flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  States Configuration
                </h2>
              </div>
              <div className="p-6">
                {states.map((state, index) => (
                  <div key={index} className="flex items-center gap-4 mb-4 p-4 bg-gray-50 rounded-lg border">
                    <input
                      type="text"
                      value={state.name}
                      onChange={(e) => updateState(index, 'name', e.target.value)}
                      className="w-20 border-4 border-gray-800 rounded-lg px-3 py-2 text-center font-mono text-black text-lg font-bold bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
                      placeholder="q0"
                    />
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={state.isStart}
                        onChange={(e) => updateState(index, 'isStart', e.target.checked)}
                        className="w-4 h-4 text-purple-600 rounded"
                      />
                      <span className="text-sm font-medium text-gray-900">Start State</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={state.isAccept}
                        onChange={(e) => updateState(index, 'isAccept', e.target.checked)}
                        className="w-4 h-4 text-green-600 rounded"
                      />
                      <span className="text-sm font-medium text-gray-900">Final State</span>
                    </label>
                    <button
                      onClick={() => removeState(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      disabled={states.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addState}
                  className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add State
                </button>
              </div>
            </div>

            {/* Alphabet Configuration */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-white">
                <h2 className="text-xl font-bold">Input Alphabet (Σ)</h2>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {alphabet.map((symbol, index) => (
                    <div key={index} className="flex items-center gap-2 bg-purple-50 border border-purple-200 px-3 py-2 rounded-lg">
                      <span className="font-mono font-bold text-purple-800">{symbol}</span>
                      <button
                        onClick={() => removeSymbol(index)}
                        className="text-red-500 hover:text-red-700"
                        disabled={alphabet.length <= 2 || symbol === "ε"}
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={addSymbol}
                  className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Symbol
                </button>
                <div className="mt-2 text-xs text-gray-900 font-medium">Note: ε represents the empty string (epsilon)</div>
              </div>
            </div>

            {/* Transitions Configuration */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-violet-500 p-4 text-white">
                <h2 className="text-xl font-bold">Transition Function (δ)</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3 mb-4">
                  {transitions.map((transition, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                      <select
                        value={transition.from}
                        onChange={(e) => updateTransition(index, 'from', e.target.value)}
                        className="border-4 border-gray-800 rounded px-3 py-2 text-lg font-bold text-black bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
                      >
                        {states.map(state => (
                          <option key={state.name} value={state.name}>{state.name}</option>
                        ))}
                      </select>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                      <select
                        value={transition.symbol}
                        onChange={(e) => updateTransition(index, 'symbol', e.target.value)}
                        className="border-4 border-gray-800 rounded px-3 py-2 text-lg font-bold text-black font-mono bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
                      >
                        {alphabet.map(symbol => (
                          <option key={symbol} value={symbol}>{symbol}</option>
                        ))}
                      </select>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                      <select
                        value={transition.to}
                        onChange={(e) => updateTransition(index, 'to', e.target.value)}
                        className="border-4 border-gray-800 rounded px-3 py-2 text-lg font-bold text-black bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
                      >
                        {states.map(state => (
                          <option key={state.name} value={state.name}>{state.name}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => removeTransition(index)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={addTransition}
                  className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                  disabled={states.length < 2 || alphabet.length === 0}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Transition
                </button>
              </div>
            </div>

            {/* Input String */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 text-white">
                <h2 className="text-xl font-bold">Test Input</h2>
              </div>
              <div className="p-6">
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={inputString}
                    onChange={(e) => setInputString(e.target.value)}
                    className="flex-1 border-4 border-gray-800 rounded-lg px-4 py-3 font-mono text-lg text-black font-bold bg-white focus:border-orange-600 focus:ring-4 focus:ring-orange-200"
                    placeholder="Enter string to test..."
                  />
                  <button
                    onClick={handleSimulate}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg transition-colors font-semibold"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Simulate
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Visualization Panel */}
          <div className="space-y-6">
            {/* NFA Diagram */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 text-white">
                <h2 className="text-xl font-bold">State Diagram</h2>
              </div>
              <div className="p-6">
                <DFAChart states={states} transitions={transitions} result={result} />
              </div>
            </div>

            {/* Transition Table */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-teal-500 to-emerald-500 p-4 text-white">
                <h2 className="text-xl font-bold">Transition Table</h2>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border-4 border-gray-800">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border-4 border-gray-800 px-4 py-3 text-left font-bold text-lg text-black">State</th>
                        {alphabet.map(symbol => (
                          <th key={symbol} className="border-4 border-gray-800 px-4 py-3 text-center font-bold text-lg font-mono text-black">
                            {symbol}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {states.map(state => (
                        <tr key={state.name} className={state.isStart ? 'bg-blue-100' : state.isAccept ? 'bg-green-100' : 'bg-white'}>
                          <td className="border-4 border-gray-800 px-4 py-3 font-mono font-bold text-lg text-black">
                            {state.isStart && '→'}{state.name}{state.isAccept && '*'}
                          </td>
                          {alphabet.map(symbol => {
                            // For NFA, find all transitions for this state-symbol pair
                            const targetStates = transitions
                              .filter(t => t.from === state.name && t.symbol === symbol)
                              .map(t => t.to);
                            
                            return (
                              <td key={symbol} className="border-4 border-gray-800 px-4 py-3 text-center font-mono font-bold text-lg text-black">
                                {targetStates.length > 0 ? `{${targetStates.join(', ')}}` : '-'}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="mt-8">
            {getExamResult()}
          </div>
        )}
      </div>
    </div>
  );
}
