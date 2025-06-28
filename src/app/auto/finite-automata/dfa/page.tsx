"use client";

import { useState } from "react";
import { DFAChart } from "../../../components/DFAChart";
import { simulateDFA, FiniteAutomaton, State, Transition, FAResult } from "../../../utils/automataTheory";
import EducationalInfo from "@/components/EducationalInfo";
import ExamResult from "@/components/ExamResult";
import { Play, Plus, Trash2, Settings, BookOpen, Cpu, ArrowRight } from "lucide-react";

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
  const [showEducationalInfo, setShowEducationalInfo] = useState(true);

  const educationalData = {
    topic: "Deterministic Finite Automaton (DFA)",
    description: "A mathematical model of computation that can be in exactly one state at any given time",
    theory: {
      definition: "A DFA is a 5-tuple (Q, Σ, δ, q₀, F) where Q is finite set of states, Σ is input alphabet, δ is transition function, q₀ is start state, and F is set of final states.",
      keyPoints: [
        "Exactly one transition per state-symbol pair",
        "No ε-transitions allowed",
        "Always deterministic - no ambiguity in transitions",
        "Recognizes regular languages only",
        "Can be represented as transition table or state diagram"
      ],
      applications: [
        "Lexical analysis in compilers",
        "Text pattern matching algorithms",
        "Network protocol state machines",
        "Digital circuit design",
        "Tokenization in programming languages"
      ]
    },
    mumbaiUniversity: {
      syllabus: [
        "DFA Definition and Components",
        "State Transition Diagrams",
        "Transition Tables",
        "Language Acceptance",
        "DFA Construction",
        "Minimization of DFA"
      ],
      marks: "15-20",
      commonQuestions: [
        "Design DFA for given language specifications",
        "Convert NFA to DFA using subset construction",
        "Minimize given DFA using table filling method",
        "Prove that language is regular using DFA"
      ],
      examTips: [
        "Always label states clearly (q0, q1, q2...)",
        "Mark start state with arrow and final states with double circle",
        "Show all transitions including self-loops",
        "Verify by tracing sample strings",
        "Include dead/trap states if required"
      ]
    },
    algorithm: {
      steps: [
        "Initialize current state to start state q₀",
        "Read first symbol from input string",
        "Look up transition δ(current_state, symbol)",
        "Move to next state as per transition function",
        "Repeat steps 2-4 until string is completely processed",
        "Check if final state is in acceptance set F"
      ],
      complexity: {
        time: "O(n)",
        space: "O(1)"
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
    const newSymbol = String.fromCharCode(97 + alphabet.length);
    setAlphabet([...alphabet, newSymbol]);
  };

  const removeSymbol = (index: number) => {
    if (alphabet.length <= 1) return;
    const symbolToRemove = alphabet[index];
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
          : `Processing complete at state ${step.currentState}`,
      currentState: step.currentState,
      input: step.remainingInput || 'ε',
      transition: step.transition ? `δ(${step.transition.from}, ${step.transition.symbol}) = ${step.transition.to}` : undefined,
      explanation: index === 0
        ? "DFA always starts at the designated start state"
        : step.transition
          ? `Deterministic transition: exactly one next state for current state and input symbol`
          : result.accepted 
            ? "String completely processed and current state is in final state set"
            : "String completely processed but current state is not a final state"
    }));

    return (
      <ExamResult
        title="DFA Simulation"
        input={inputString}
        result={result.accepted}
        steps={examSteps}
        finalAnswer={result.accepted ? `String "${inputString}" is ACCEPTED` : `String "${inputString}" is REJECTED`}
        examFormat={{
          question: `Design and simulate a DFA that accepts the string "${inputString}". Show the step-by-step execution.`,
          solution: [
            `Given DFA M = (Q, Σ, δ, q₀, F) where:`,
            `Q = {${states.map(s => s.name).join(', ')}} (set of states)`,
            `Σ = {${alphabet.join(', ')}} (input alphabet)`,
            `q₀ = ${states.find(s => s.isStart)?.name} (start state)`,
            `F = {${states.filter(s => s.isAccept).map(s => s.name).join(', ')}} (final states)`,
            `Transition function δ is defined by the transition table above`
          ],
          conclusion: result.accepted 
            ? `The string "${inputString}" is accepted by the DFA as the final state ${result.finalState} is in the set of accepting states F.`
            : `The string "${inputString}" is rejected by the DFA as the final state ${result.finalState} is not in the set of accepting states F.`,
          marks: 15
        }}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <Cpu className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">DFA Simulator</h1>
                <p className="text-blue-100">Deterministic Finite Automaton Interactive Tool</p>
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
                      className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-center font-mono"
                      placeholder="q0"
                    />
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={state.isStart}
                        onChange={(e) => updateState(index, 'isStart', e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">Start State</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={state.isAccept}
                        onChange={(e) => updateState(index, 'isAccept', e.target.checked)}
                        className="w-4 h-4 text-green-600 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">Final State</span>
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
                        disabled={alphabet.length <= 1}
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
              </div>
            </div>

            {/* Transitions Configuration */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 text-white">
                <h2 className="text-xl font-bold">Transition Function (δ)</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3 mb-4">
                  {transitions.map((transition, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <select
                        value={transition.from}
                        onChange={(e) => updateTransition(index, 'from', e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                      >
                        {states.map(state => (
                          <option key={state.name} value={state.name}>{state.name}</option>
                        ))}
                      </select>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                      <select
                        value={transition.symbol}
                        onChange={(e) => updateTransition(index, 'symbol', e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm font-mono"
                      >
                        {alphabet.map(symbol => (
                          <option key={symbol} value={symbol}>{symbol}</option>
                        ))}
                      </select>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                      <select
                        value={transition.to}
                        onChange={(e) => updateTransition(index, 'to', e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
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
                  className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
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
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-3 font-mono text-lg"
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
            {/* DFA Diagram */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 text-white">
                <h2 className="text-xl font-bold">State Diagram</h2>
              </div>
              <div className="p-6">
                <DFAChart states={states} transitions={transitions} />
              </div>
            </div>

            {/* Transition Table */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-teal-500 to-green-500 p-4 text-white">
                <h2 className="text-xl font-bold">Transition Table</h2>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-2 text-left font-semibold">State</th>
                        {alphabet.map(symbol => (
                          <th key={symbol} className="border border-gray-300 px-4 py-2 text-center font-semibold font-mono">
                            {symbol}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {states.map(state => (
                        <tr key={state.name} className={state.isStart ? 'bg-blue-50' : state.isAccept ? 'bg-green-50' : ''}>
                          <td className="border border-gray-300 px-4 py-2 font-mono font-bold">
                            {state.isStart && '→'}{state.name}{state.isAccept && '*'}
                          </td>
                          {alphabet.map(symbol => {
                            const transition = transitions.find(t => t.from === state.name && t.symbol === symbol);
                            return (
                              <td key={symbol} className="border border-gray-300 px-4 py-2 text-center font-mono">
                                {transition ? transition.to : '-'}
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
