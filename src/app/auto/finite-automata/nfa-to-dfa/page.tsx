"use client";

import { useState } from "react";
import EducationalInfo from "@/components/EducationalInfo";
import ExamResult from "@/components/ExamResult";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Plus, Trash2 } from "lucide-react";

interface NFAState {
  name: string;
  isStart: boolean;
  isAccept: boolean;
}

interface NFATransition {
  from: string;
  to: string;
  symbol: string; // Can include 'ε' for epsilon transitions
}

interface DFAState {
  name: string;
  nfaStates: Set<string>;
  isStart: boolean;
  isAccept: boolean;
}

interface DFATransition {
  from: string;
  to: string;
  symbol: string;
}

export default function NFAtoDFAConverter() {
  const [nfaStates, setNfaStates] = useState<NFAState[]>([
    { name: "q0", isStart: true, isAccept: false },
    { name: "q1", isStart: false, isAccept: false },
    { name: "q2", isStart: false, isAccept: true }
  ]);

  const [alphabet, setAlphabet] = useState(["a", "b"]);
  const [nfaTransitions, setNfaTransitions] = useState<NFATransition[]>([
    { from: "q0", to: "q0", symbol: "a" },
    { from: "q0", to: "q0", symbol: "b" },
    { from: "q0", to: "q1", symbol: "a" },
    { from: "q1", to: "q2", symbol: "b" }
  ]);

  const [dfaStates, setDfaStates] = useState<DFAState[]>([]);
  const [dfaTransitions, setDfaTransitions] = useState<DFATransition[]>([]);
  const [conversionSteps, setConversionSteps] = useState<string[]>([]);
  const [isConverted, setIsConverted] = useState(false);

  // Epsilon closure computation
  const epsilonClosure = (states: Set<string>): Set<string> => {
    const closure = new Set(states);
    const stack = [...states];

    while (stack.length > 0) {
      const current = stack.pop()!;
      const epsilonTransitions = nfaTransitions.filter(
        t => t.from === current && t.symbol === "ε"
      );

      for (const transition of epsilonTransitions) {
        if (!closure.has(transition.to)) {
          closure.add(transition.to);
          stack.push(transition.to);
        }
      }
    }

    return closure;
  };

  // Move function - get all states reachable from a set of states on a symbol
  const move = (states: Set<string>, symbol: string): Set<string> => {
    const result = new Set<string>();
    
    for (const state of states) {
      const transitions = nfaTransitions.filter(
        t => t.from === state && t.symbol === symbol
      );
      
      for (const transition of transitions) {
        result.add(transition.to);
      }
    }

    return result;
  };

  // Convert NFA to DFA using subset construction algorithm
  const convertNFAtoDFA = () => {
    const steps: string[] = [];
    const newDfaStates: DFAState[] = [];
    const newDfaTransitions: DFATransition[] = [];
    const stateMap = new Map<string, Set<string>>();
    const workList: Set<string>[] = [];

    // Step 1: Create initial state (epsilon closure of NFA start state)
    const startState = nfaStates.find(s => s.isStart)?.name;
    if (!startState) {
      steps.push("Error: No start state found in NFA");
      setConversionSteps(steps);
      return;
    }

    const initialClosure = epsilonClosure(new Set([startState]));
    const initialStateName = `{${Array.from(initialClosure).sort().join(',')}}`;
    
    newDfaStates.push({
      name: initialStateName,
      nfaStates: initialClosure,
      isStart: true,
      isAccept: Array.from(initialClosure).some(s => 
        nfaStates.find(ns => ns.name === s)?.isAccept
      )
    });

    stateMap.set(initialStateName, initialClosure);
    workList.push(initialClosure);

    steps.push(`Step 1: Initial state = ε-closure(${startState}) = ${initialStateName}`);

    // Step 2: Process all states in worklist
    let stepCounter = 2;
    while (workList.length > 0) {
      const currentNFAStates = workList.shift()!;
      const currentDFAStateName = `{${Array.from(currentNFAStates).sort().join(',')}}`;

      steps.push(`\nStep ${stepCounter}: Processing state ${currentDFAStateName}`);

      // For each symbol in alphabet
      for (const symbol of alphabet) {
        // Compute move(current_states, symbol)
        const moveResult = move(currentNFAStates, symbol);
        
        if (moveResult.size === 0) {
          steps.push(`  δ(${currentDFAStateName}, ${symbol}) = ∅ (no transition)`);
          continue;
        }

        // Compute epsilon closure of move result
        const closure = epsilonClosure(moveResult);
        const newStateName = `{${Array.from(closure).sort().join(',')}}`;

        steps.push(`  move(${currentDFAStateName}, ${symbol}) = {${Array.from(moveResult).sort().join(',')}}`);
        steps.push(`  ε-closure({${Array.from(moveResult).sort().join(',')}}) = ${newStateName}`);

        // Check if this state already exists
        if (!stateMap.has(newStateName)) {
          // Create new DFA state
          newDfaStates.push({
            name: newStateName,
            nfaStates: closure,
            isStart: false,
            isAccept: Array.from(closure).some(s => 
              nfaStates.find(ns => ns.name === s)?.isAccept
            )
          });

          stateMap.set(newStateName, closure);
          workList.push(closure);
          steps.push(`  New state ${newStateName} created`);
        }

        // Create transition
        newDfaTransitions.push({
          from: currentDFAStateName,
          to: newStateName,
          symbol: symbol
        });

        steps.push(`  δ(${currentDFAStateName}, ${symbol}) = ${newStateName}`);
      }

      stepCounter++;
    }

    // Final summary
    steps.push(`\nConversion Complete!`);
    steps.push(`DFA States: ${newDfaStates.length}`);
    steps.push(`DFA Transitions: ${newDfaTransitions.length}`);
    steps.push(`Start State: ${newDfaStates.find(s => s.isStart)?.name}`);
    steps.push(`Accept States: ${newDfaStates.filter(s => s.isAccept).map(s => s.name).join(', ')}`);

    setDfaStates(newDfaStates);
    setDfaTransitions(newDfaTransitions);
    setConversionSteps(steps);
    setIsConverted(true);
  };

  const addNFAState = () => {
    const newStateName = `q${nfaStates.length}`;
    setNfaStates([...nfaStates, { name: newStateName, isStart: false, isAccept: false }]);
  };

  const removeNFAState = (index: number) => {
    const newStates = nfaStates.filter((_, i) => i !== index);
    setNfaStates(newStates);
  };

  const addNFATransition = () => {
    setNfaTransitions([...nfaTransitions, { from: "q0", to: "q0", symbol: "a" }]);
  };

  const removeNFATransition = (index: number) => {
    const newTransitions = nfaTransitions.filter((_, i) => i !== index);
    setNfaTransitions(newTransitions);
  };

  const resetConversion = () => {
    setDfaStates([]);
    setDfaTransitions([]);
    setConversionSteps([]);
    setIsConverted(false);
  };

  return (
    <div className="container mx-auto py-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-black mb-6">
        NFA to DFA Conversion
      </h1>

      <EducationalInfo
        topic="NFA to DFA Conversion (Subset Construction)"
        description="Learn the systematic process of converting Non-deterministic Finite Automata to Deterministic Finite Automata"
        theory={{
          definition: "The subset construction algorithm converts an NFA to an equivalent DFA by creating DFA states that represent sets of NFA states.",
          keyPoints: [
            "Each DFA state corresponds to a subset of NFA states",
            "Use ε-closure to handle epsilon transitions",
            "Move function computes reachable states on input symbols",
            "The resulting DFA recognizes the same language as the original NFA",
            "DFA may have exponentially more states than the NFA in worst case"
          ],
          applications: [
            "Compiler design for lexical analysis",
            "Regular expression engines",
            "Pattern matching algorithms",
            "Formal verification tools"
          ]
        }}
        mumbaiUniversity={{
          syllabus: ["NFA to DFA Conversion", "Subset Construction Algorithm", "Epsilon Closure"],
          marks: "8-10 marks",
          commonQuestions: [
            "Convert the given NFA to equivalent DFA",
            "Explain the subset construction algorithm",
            "Find epsilon closure of given states",
            "Show step-by-step conversion process"
          ],
          examTips: [
            "Always start with epsilon closure of start state",
            "Process each symbol for each new state systematically",
            "Keep track of which NFA states are accepting",
            "Use clear notation for DFA state names"
          ]
        }}
        algorithm={{
          steps: [
            "Compute ε-closure of NFA start state to create DFA start state",
            "For each unprocessed DFA state and each input symbol:",
            "Apply move function to get reachable NFA states",
            "Compute ε-closure of the result",
            "If this set of states is new, create a new DFA state",
            "Add transition from current DFA state to target DFA state",
            "Repeat until no new states are created"
          ],
          complexity: {
            time: "O(2^n * |Σ|) where n is number of NFA states",
            space: "O(2^n) for storing DFA states"
          }
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* NFA Input Section */}
        <Card className="p-6 bg-white border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-black">Input NFA</h2>
          
          {/* NFA States */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-2">NFA States</label>
            {nfaStates.map((state, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <Input
                  value={state.name}
                  onChange={(e) => {
                    const newStates = [...nfaStates];
                    newStates[index].name = e.target.value;
                    setNfaStates(newStates);
                  }}
                  className="w-24 text-black bg-white"
                />
                <label className="flex items-center text-black">
                  <input
                    type="checkbox"
                    checked={state.isStart}
                    onChange={(e) => {
                      const newStates = [...nfaStates];
                      newStates.forEach(s => s.isStart = false); // Only one start state
                      newStates[index].isStart = e.target.checked;
                      setNfaStates(newStates);
                    }}
                    className="mr-1"
                  />
                  Start
                </label>
                <label className="flex items-center text-black">
                  <input
                    type="checkbox"
                    checked={state.isAccept}
                    onChange={(e) => {
                      const newStates = [...nfaStates];
                      newStates[index].isAccept = e.target.checked;
                      setNfaStates(newStates);
                    }}
                    className="mr-1"
                  />
                  Accept
                </label>
                <Button
                  onClick={() => removeNFAState(index)}
                  variant="outline"
                  size="sm"
                  className="ml-2"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button onClick={addNFAState} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add State
            </Button>
          </div>

          {/* Alphabet */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-2">Alphabet</label>
            <Input
              value={alphabet.join(", ")}
              onChange={(e) => setAlphabet(e.target.value.split(",").map(s => s.trim()))}
              placeholder="a, b, c"
              className="text-black bg-white"
            />
          </div>

          {/* NFA Transitions */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-2">NFA Transitions</label>
            {nfaTransitions.map((transition, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <select
                  value={transition.from}
                  onChange={(e) => {
                    const newTransitions = [...nfaTransitions];
                    newTransitions[index].from = e.target.value;
                    setNfaTransitions(newTransitions);
                  }}
                  className="border rounded px-2 py-1 text-black bg-white"
                >
                  {nfaStates.map(state => (
                    <option key={state.name} value={state.name}>{state.name}</option>
                  ))}
                </select>
                <ArrowRight className="h-4 w-4" />
                <select
                  value={transition.to}
                  onChange={(e) => {
                    const newTransitions = [...nfaTransitions];
                    newTransitions[index].to = e.target.value;
                    setNfaTransitions(newTransitions);
                  }}
                  className="border rounded px-2 py-1 text-black bg-white"
                >
                  {nfaStates.map(state => (
                    <option key={state.name} value={state.name}>{state.name}</option>
                  ))}
                </select>
                <Input
                  value={transition.symbol}
                  onChange={(e) => {
                    const newTransitions = [...nfaTransitions];
                    newTransitions[index].symbol = e.target.value;
                    setNfaTransitions(newTransitions);
                  }}
                  className="w-16 text-black bg-white"
                  placeholder="a, ε"
                />
                <Button
                  onClick={() => removeNFATransition(index)}
                  variant="outline"
                  size="sm"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button onClick={addNFATransition} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Transition
            </Button>
          </div>

          <div className="flex gap-2">
            <Button onClick={convertNFAtoDFA} className="flex-1">
              Convert to DFA
            </Button>
            <Button onClick={resetConversion} variant="outline">
              Reset
            </Button>
          </div>
        </Card>

        {/* Conversion Steps */}
        <Card className="p-6 bg-white border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-black">Conversion Steps</h2>
          
          {conversionSteps.length > 0 ? (
            <div className="bg-gray-50 p-4 rounded-lg max-h-[400px] overflow-y-auto">
              <pre className="text-sm font-mono whitespace-pre-wrap text-black">
                {conversionSteps.join('\n')}
              </pre>
            </div>
          ) : (
            <p className="text-black">Click &quot;Convert to DFA&quot; to see the step-by-step conversion process.</p>
          )}
        </Card>
      </div>

      {/* Resulting DFA */}
      {isConverted && (
        <Card className="p-6 mb-8 bg-white border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-black">Resulting DFA</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2 text-black">DFA States</h3>
              <div className="space-y-2">
                {dfaStates.map((state, index) => (
                  <div key={index} className="p-2 bg-gray-50 rounded text-black">
                    <span className="font-mono">{state.name}</span>
                    {state.isStart && <span className="ml-2 text-green-600 text-sm">(Start)</span>}
                    {state.isAccept && <span className="ml-2 text-blue-600 text-sm">(Accept)</span>}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2 text-black">DFA Transitions</h3>
              <div className="space-y-2">
                {dfaTransitions.map((transition, index) => (
                  <div key={index} className="p-2 bg-gray-50 rounded text-black font-mono text-sm">
                    δ({transition.from}, {transition.symbol}) = {transition.to}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      <ExamResult
        title="NFA to DFA Conversion"
        input={`NFA with ${nfaStates.length} states and ${nfaTransitions.length} transitions`}
        result={isConverted}
        steps={conversionSteps.map((step, index) => ({
          stepNumber: index + 1,
          description: step,
          explanation: step
        }))}
        finalAnswer={isConverted ? `DFA with ${dfaStates.length} states successfully created` : "Conversion not completed"}
        examFormat={{
          question: "Convert the given NFA to an equivalent DFA using subset construction algorithm.",
          solution: conversionSteps,
          conclusion: "The resulting DFA recognizes the same language as the original NFA but without non-determinism.",
          marks: 10
        }}
      />
    </div>
  );
}
