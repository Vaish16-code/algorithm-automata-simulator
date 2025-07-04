"use client";

import { useState } from "react";
import { PDAChart } from "../../../components/PDAChart";
import { 
  simulatePDA, 
  PushdownAutomaton, 
  PDATransition, 
  PDAResult 
} from "../../../utils/automataTheory";
import EducationalInfo from "@/components/EducationalInfo";
import ExamResult from "@/components/ExamResult";
import { Play, Plus, Trash2, Settings, BookOpen, Cpu } from "lucide-react";

export default function PDASimulatorPage() {
  const [states, setStates] = useState<string[]>([
    "q0", "q1"
  ]);
  
  const [inputAlphabet, setInputAlphabet] = useState(["(", ")", "ε"]);
  const [stackAlphabet, setStackAlphabet] = useState(["Z", "(", "ε"]);
  const [transitions, setTransitions] = useState<PDATransition[]>([
    { 
      fromState: "q0", 
      inputSymbol: "(", 
      popSymbol: "Z", 
      toState: "q0", 
      pushSymbols: ["(", "Z"] 
    },
    { 
      fromState: "q0", 
      inputSymbol: "(", 
      popSymbol: "(", 
      toState: "q0", 
      pushSymbols: ["(", "("] 
    },
    { 
      fromState: "q0", 
      inputSymbol: ")", 
      popSymbol: "(", 
      toState: "q0", 
      pushSymbols: [] 
    },
    { 
      fromState: "q0", 
      inputSymbol: "ε", 
      popSymbol: "Z", 
      toState: "q1", 
      pushSymbols: ["Z"] 
    }
  ]);
  
  const [acceptStates, setAcceptStates] = useState(["q1"]);
  const [startState, setStartState] = useState("q0");
  const [initialStackSymbol, setInitialStackSymbol] = useState("Z");
  
  const [inputString, setInputString] = useState("(())");
  const [result, setResult] = useState<PDAResult | null>(null);
  const [showEducationalInfo, setShowEducationalInfo] = useState(true);

  const educationalData = {
    topic: "Pushdown Automaton (PDA)",
    description: "A computational model that extends finite automata with a stack memory",
    theory: {
      definition: "A PDA is a 7-tuple (Q, Σ, Γ, δ, q₀, Z₀, F) where Q is set of states, Σ is input alphabet, Γ is stack alphabet, δ is transition function, q₀ is start state, Z₀ is initial stack symbol, and F is set of accept states.",
      keyPoints: [
        "Extends finite automata with an unlimited stack memory",
        "Can recognize context-free languages",
        "More powerful than finite automata, less powerful than Turing machines",
        "Can use ε-transitions for stack manipulation without consuming input",
        "Acceptance can be by final state or empty stack (or both)"
      ],
      applications: [
        "Parsing programming languages",
        "Expression evaluation",
        "Syntax validation",
        "Recursive function calls tracking",
        "Balanced parentheses and bracket checking"
      ]
    },
    mumbaiUniversity: {
      syllabus: [
        "PDA Definition and Components",
        "Stack Operations (Push, Pop)",
        "Transition Functions",
        "Deterministic vs. Non-deterministic PDAs",
        "Acceptance by Final State vs. Empty Stack",
        "Relationship with Context-Free Languages"
      ],
      marks: "10-15",
      commonQuestions: [
        "Design PDA for given context-free languages",
        "Convert CFG to PDA and vice versa",
        "Trace PDA execution on input strings",
        "Explain deterministic vs. non-deterministic PDAs"
      ],
      examTips: [
        "Show stack contents at each step",
        "Clearly indicate push and pop operations",
        "Use transition notation (q, a, X) → (p, α)",
        "Explain acceptance condition used",
        "Handle ε-transitions carefully"
      ]
    },
    algorithm: {
      steps: [
        "Initialize with start state and initial stack symbol",
        "For each input symbol, find applicable transition",
        "Update state and stack based on transition",
        "Continue until input is consumed",
        "Accept if in final state (or stack is empty)"
      ],
      complexity: {
        time: "O(n³) for general CFL parsing",
        space: "O(n) for stack space"
      }
    }
  };

  const handleSimulate = () => {
    const pda: PushdownAutomaton = {
      states,
      inputAlphabet,
      stackAlphabet,
      transitions,
      startState,
      initialStackSymbol,
      acceptStates
    };

    const simulationResult = simulatePDA(pda, inputString);
    setResult(simulationResult);
  };

  const addState = () => {
    const newStateName = `q${states.length}`;
    setStates([...states, newStateName]);
  };

  const removeState = (index: number) => {
    if (states.length <= 1) return;
    const stateToRemove = states[index];
    
    if (stateToRemove === startState) {
      alert("Cannot remove start state. Please change the start state first.");
      return;
    }
    
    if (acceptStates.includes(stateToRemove)) {
      setAcceptStates(acceptStates.filter(s => s !== stateToRemove));
    }
    
    setStates(states.filter((_, i) => i !== index));
    setTransitions(transitions.filter(t => 
      t.fromState !== stateToRemove && t.toState !== stateToRemove
    ));
  };

  const updateState = (index: number, newValue: string) => {
    const oldState = states[index];
    const newStates = [...states];
    newStates[index] = newValue;
    setStates(newStates);
    
    // Update transitions
    const newTransitions = transitions.map(t => {
      if (t.fromState === oldState) {
        return { ...t, fromState: newValue };
      }
      if (t.toState === oldState) {
        return { ...t, toState: newValue };
      }
      return t;
    });
    setTransitions(newTransitions);
    
    // Update start state
    if (startState === oldState) {
      setStartState(newValue);
    }
    
    // Update accept states
    if (acceptStates.includes(oldState)) {
      setAcceptStates(acceptStates.map(s => s === oldState ? newValue : s));
    }
  };

  const toggleAcceptState = (state: string) => {
    if (acceptStates.includes(state)) {
      setAcceptStates(acceptStates.filter(s => s !== state));
    } else {
      setAcceptStates([...acceptStates, state]);
    }
  };

  const setAsStartState = (state: string) => {
    setStartState(state);
  };

  const addInputSymbol = () => {
    // Skip ε as it's already included
    const newSymbol = String.fromCharCode(97 + (inputAlphabet.length - 1));
    setInputAlphabet([...inputAlphabet, newSymbol]);
  };

  const removeInputSymbol = (index: number) => {
    if (inputAlphabet.length <= 2) return; // Keep at least one symbol plus ε
    const symbolToRemove = inputAlphabet[index];
    if (symbolToRemove === "ε") return; // Don't remove epsilon
    setInputAlphabet(inputAlphabet.filter((_, i) => i !== index));
    setTransitions(transitions.filter(t => t.inputSymbol !== symbolToRemove));
  };

  const addStackSymbol = () => {
    // Skip ε as it's already included
    const commonSymbols = ["Z", "X", "Y", "A", "B"];
    let newSymbol = "";
    for (const sym of commonSymbols) {
      if (!stackAlphabet.includes(sym)) {
        newSymbol = sym;
        break;
      }
    }
    if (newSymbol === "") {
      newSymbol = String.fromCharCode(65 + (stackAlphabet.length - 1));
    }
    setStackAlphabet([...stackAlphabet, newSymbol]);
  };

  const removeStackSymbol = (index: number) => {
    if (stackAlphabet.length <= 2) return; // Keep at least one symbol plus ε
    const symbolToRemove = stackAlphabet[index];
    if (symbolToRemove === "ε") return; // Don't remove epsilon
    if (symbolToRemove === initialStackSymbol) {
      alert("Cannot remove initial stack symbol. Please change it first.");
      return;
    }
    setStackAlphabet(stackAlphabet.filter((_, i) => i !== index));
    // Remove transitions that use this symbol
    setTransitions(transitions.filter(t => 
      t.popSymbol !== symbolToRemove && !t.pushSymbols.includes(symbolToRemove)
    ));
  };

  const addTransition = () => {
    if (states.length >= 1 && inputAlphabet.length > 0 && stackAlphabet.length > 0) {
      const inputSym = inputAlphabet[0] === "ε" ? inputAlphabet[1] || "ε" : inputAlphabet[0];
      const popSym = stackAlphabet[0] === "ε" ? stackAlphabet[1] || "ε" : stackAlphabet[0];
      
      setTransitions([...transitions, { 
        fromState: states[0], 
        inputSymbol: inputSym, 
        popSymbol: popSym, 
        toState: states[0], 
        pushSymbols: [popSym] 
      }]);
    }
  };

  const removeTransition = (index: number) => {
    setTransitions(transitions.filter((_, i) => i !== index));
  };

  const updateTransition = (index: number, field: keyof PDATransition, value: string | string[]) => {
    const newTransitions = [...transitions];
    newTransitions[index] = { ...newTransitions[index], [field]: value };
    setTransitions(newTransitions);
  };

  const updatePushSymbols = (index: number, value: string) => {
    // Parse comma-separated string to array
    const symbols = value.split(',').map(s => s.trim()).filter(s => s);
    updateTransition(index, 'pushSymbols', symbols);
  };

  const getExamResult = () => {
    if (!result) return null;
    
    const examSteps = result.steps.map((step) => ({
      stepNumber: step.step + 1,
      description: step.step === 0 
        ? `Initialize: Start at state ${step.state} with stack [${step.stack.map(s => s.value).join(', ')}]`
        : step.transition 
          ? `Read '${step.transition.inputSymbol === "ε" ? "ε" : step.transition.inputSymbol}', ` +
            `Pop '${step.transition.popSymbol === "ε" ? "nothing" : step.transition.popSymbol}', ` +
            `Push '${step.transition.pushSymbols.length ? step.transition.pushSymbols.join(', ') : "nothing"}', ` +
            `Move to ${step.transition.toState}`
          : `Processing complete at state ${step.state}`,
      currentState: step.state,
      input: step.remainingInput || 'ε',
      stack: `[${step.stack.map(s => s.value).join(', ')}]`,
      transition: step.transition 
        ? `δ(${step.transition.fromState}, ${step.transition.inputSymbol}, ${step.transition.popSymbol}) = ` +
          `(${step.transition.toState}, ${step.transition.pushSymbols.join('')})`
        : undefined,
      explanation: step.step === 0
        ? "PDA starts at the designated start state with initial stack symbol"
        : step.transition
          ? `Transition changes state and updates stack`
          : result.accepted 
            ? "Input consumed and in accept state"
            : "Input consumed but not in accept state"
    }));

    return (
      <ExamResult
        title="PDA Simulation"
        input={inputString}
        result={result.accepted}
        steps={examSteps}
        finalAnswer={result.accepted ? `String "${inputString}" is ACCEPTED` : `String "${inputString}" is REJECTED`}
        examFormat={{
          question: `Design and simulate a PDA that accepts the string "${inputString}". Show the step-by-step execution.`,
          solution: [
            `Given PDA M = (Q, Σ, Γ, δ, q₀, Z₀, F) where:`,
            `Q = {${states.join(', ')}} (set of states)`,
            `Σ = {${inputAlphabet.filter(s => s !== 'ε').join(', ')}} (input alphabet)`,
            `Γ = {${stackAlphabet.filter(s => s !== 'ε').join(', ')}} (stack alphabet)`,
            `q₀ = ${startState} (start state)`,
            `Z₀ = ${initialStackSymbol} (initial stack symbol)`,
            `F = {${acceptStates.join(', ')}} (accept states)`,
            `Transition function δ is defined by the transition table`
          ],
          conclusion: result.accepted 
            ? `The string "${inputString}" is accepted by the PDA as it reaches an accept state after consuming all input.`
            : `The string "${inputString}" is rejected by the PDA as it does not reach an accept state after consuming all input.`,
          marks: 15
        }}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <Cpu className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">PDA Simulator</h1>
                <p className="text-green-100">Pushdown Automaton Interactive Tool</p>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  {states.map((state, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border">
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => updateState(index, e.target.value)}
                        className="w-16 border-4 border-gray-800 rounded-lg px-2 py-1 text-center font-mono text-black text-lg font-bold bg-white focus:border-green-600 focus:ring-2 focus:ring-green-200"
                        placeholder="q0"
                      />
                      <div className="flex space-x-1">
                        <button
                          onClick={() => setAsStartState(state)}
                          className={`p-1 rounded-lg ${startState === state ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}
                          title="Set as start state"
                        >
                          S
                        </button>
                        <button
                          onClick={() => toggleAcceptState(state)}
                          className={`p-1 rounded-lg ${acceptStates.includes(state) ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}
                          title="Toggle accept state"
                        >
                          A
                        </button>
                        <button
                          onClick={() => removeState(index)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded-lg"
                          disabled={states.length <= 1 || state === startState}
                          title="Remove state"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={addState}
                  className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add State
                </button>
                
                <div className="mt-4 text-xs text-gray-900 grid grid-cols-2 gap-x-4 gap-y-1">
                  <div><span className="font-medium">S</span> = Start State</div>
                  <div><span className="font-medium">A</span> = Accept State</div>
                </div>
              </div>
            </div>

            {/* Input Alphabet Configuration */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-white">
                <h2 className="text-xl font-bold">Input Alphabet (Σ)</h2>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {inputAlphabet.map((symbol, index) => (
                    <div key={index} className="flex items-center gap-2 bg-purple-50 border border-purple-200 px-3 py-2 rounded-lg">
                      <span className="font-mono font-bold text-purple-800">{symbol}</span>
                      <button
                        onClick={() => removeInputSymbol(index)}
                        className="text-red-500 hover:text-red-700"
                        disabled={inputAlphabet.length <= 2 || symbol === "ε"}
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={addInputSymbol}
                  className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Symbol
                </button>
                <div className="mt-2 text-xs text-gray-900 font-medium">Note: ε represents the empty string (epsilon)</div>
              </div>
            </div>

            {/* Stack Alphabet Configuration */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-4 text-white">
                <h2 className="text-xl font-bold">Stack Alphabet (Γ)</h2>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {stackAlphabet.map((symbol, index) => (
                    <div key={index} className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-2 rounded-lg">
                      <span className="font-mono font-bold text-blue-800">{symbol}</span>
                      <button
                        onClick={() => removeStackSymbol(index)}
                        className="text-red-500 hover:text-red-700"
                        disabled={stackAlphabet.length <= 2 || symbol === "ε" || symbol === initialStackSymbol}
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Initial Stack Symbol (Z₀):
                    </label>
                    <select
                      value={initialStackSymbol}
                      onChange={(e) => setInitialStackSymbol(e.target.value)}
                      className="border-4 border-gray-800 rounded px-3 py-2 text-lg font-bold text-black bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                    >
                      {stackAlphabet.filter(s => s !== 'ε').map(symbol => (
                        <option key={symbol} value={symbol}>{symbol}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  onClick={addStackSymbol}
                  className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Symbol
                </button>
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
                    <div key={index} className="flex flex-col md:flex-row md:items-center gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-black font-medium">From:</span>
                        <select
                          value={transition.fromState}
                          onChange={(e) => updateTransition(index, 'fromState', e.target.value)}
                          className="border-2 border-gray-300 rounded px-2 py-1 text-md font-medium text-black bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
                        >
                          {states.map(state => (
                            <option key={state} value={state}>{state}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-sm text-black font-medium">Read:</span>
                        <select
                          value={transition.inputSymbol}
                          onChange={(e) => updateTransition(index, 'inputSymbol', e.target.value)}
                          className="border-2 border-gray-300 rounded px-2 py-1 text-md font-medium text-black font-mono bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
                        >
                          {inputAlphabet.map(symbol => (
                            <option key={symbol} value={symbol}>{symbol}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-sm text-black font-medium">Pop:</span>
                        <select
                          value={transition.popSymbol}
                          onChange={(e) => updateTransition(index, 'popSymbol', e.target.value)}
                          className="border-2 border-gray-300 rounded px-2 py-1 text-md font-medium text-black font-mono bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
                        >
                          {stackAlphabet.map(symbol => (
                            <option key={symbol} value={symbol}>{symbol}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-sm text-black font-medium">To:</span>
                        <select
                          value={transition.toState}
                          onChange={(e) => updateTransition(index, 'toState', e.target.value)}
                          className="border-2 border-gray-300 rounded px-2 py-1 text-md font-medium text-black bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
                        >
                          {states.map(state => (
                            <option key={state} value={state}>{state}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-sm text-black font-medium">Push:</span>
                        <input
                          type="text"
                          value={transition.pushSymbols.join(',')}
                          onChange={(e) => updatePushSymbols(index, e.target.value)}
                          className="w-24 border-4 border-gray-800 rounded px-2 py-1 text-md font-bold text-black font-mono bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
                          placeholder="Z,A"
                          title="Comma-separated symbols to push (leave empty for no push)"
                        />
                      </div>

                      <button
                        onClick={() => removeTransition(index)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors ml-auto"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={addTransition}
                  className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                  disabled={states.length < 1 || inputAlphabet.length === 0 || stackAlphabet.length === 0}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Transition
                </button>
                <div className="mt-2 text-xs text-gray-900 font-medium">
                  <p>Push format: comma-separated list of symbols (empty for no push)</p>
                  <p>Example: &quot;Z,A&quot; pushes A then Z (Z will be on top)</p>
                </div>
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
            {/* PDA Diagram */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 text-white">
                <h2 className="text-xl font-bold">State Diagram</h2>
              </div>
              <div className="p-6">
                <PDAChart 
                  states={states} 
                  transitions={transitions} 
                  acceptStates={acceptStates}
                  startState={startState}
                  result={result} 
                />
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
                        <th className="border-4 border-gray-800 px-4 py-3 text-center font-bold text-lg text-black" colSpan={stackAlphabet.length + 1}>
                          Transitions δ(q, a, X) = (p, α)
                        </th>
                      </tr>
                      <tr className="bg-gray-100">
                        <th className="border-4 border-gray-800 px-4 py-3 text-left font-bold text-black">
                          State + Input
                        </th>
                        {stackAlphabet.map(stackSym => (
                          <th key={stackSym} className="border-4 border-gray-800 px-4 py-3 text-center font-bold text-black font-mono">
                            {stackSym}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {states.flatMap(state => 
                        inputAlphabet.map(inputSym => (
                          <tr key={`${state}-${inputSym}`} className={
                            state === startState ? 'bg-blue-100' : 
                            acceptStates.includes(state) ? 'bg-green-100' : 'bg-white'
                          }>
                            <td className="border-4 border-gray-800 px-4 py-3 font-mono font-bold text-black">
                              ({state}, {inputSym})
                            </td>
                            {stackAlphabet.map(stackSym => {
                              const transition = transitions.find(t => 
                                t.fromState === state && 
                                t.inputSymbol === inputSym &&
                                t.popSymbol === stackSym
                              );
                              
                              return (
                                <td key={stackSym} className="border-4 border-gray-800 px-4 py-3 text-center font-mono text-black">
                                  {transition ? 
                                    `(${transition.toState}, ${transition.pushSymbols.join('')})` : 
                                    '-'}
                                </td>
                              );
                            })}
                          </tr>
                        ))
                      )}
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
