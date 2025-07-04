"use client";

import { useState } from "react";
import EducationalInfo from "@/components/EducationalInfo";
import ExamResult from "@/components/ExamResult";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Plus, Trash2 } from "lucide-react";

interface DFAState {
  name: string;
  isStart: boolean;
  isAccept: boolean;
}

interface DFATransition {
  from: string;
  to: string;
  symbol: string;
}

interface Partition {
  states: Set<string>;
  id: string;
}

export default function DFAMinimization() {
  const [states, setStates] = useState<DFAState[]>([
    { name: "q0", isStart: true, isAccept: false },
    { name: "q1", isStart: false, isAccept: false },
    { name: "q2", isStart: false, isAccept: true },
    { name: "q3", isStart: false, isAccept: true },
    { name: "q4", isStart: false, isAccept: false }
  ]);

  const [alphabet, setAlphabet] = useState(["0", "1"]);
  const [transitions, setTransitions] = useState<DFATransition[]>([
    { from: "q0", to: "q1", symbol: "0" },
    { from: "q0", to: "q2", symbol: "1" },
    { from: "q1", to: "q0", symbol: "0" },
    { from: "q1", to: "q3", symbol: "1" },
    { from: "q2", to: "q4", symbol: "0" },
    { from: "q2", to: "q0", symbol: "1" },
    { from: "q3", to: "q4", symbol: "0" },
    { from: "q3", to: "q0", symbol: "1" },
    { from: "q4", to: "q4", symbol: "0" },
    { from: "q4", to: "q4", symbol: "1" }
  ]);

  const [minimizedStates, setMinimizedStates] = useState<DFAState[]>([]);
  const [minimizedTransitions, setMinimizedTransitions] = useState<DFATransition[]>([]);
  const [minimizationSteps, setMinimizationSteps] = useState<string[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);

  // Check if two states are distinguishable
  const areDistinguishable = (state1: string, state2: string, partitionMap: Map<string, string>): boolean => {
    // Check if they have different accepting status
    const s1Accept = states.find(s => s.name === state1)?.isAccept;
    const s2Accept = states.find(s => s.name === state2)?.isAccept;
    
    if (s1Accept !== s2Accept) {
      return true;
    }

    // Check if transitions lead to different partitions
    for (const symbol of alphabet) {
      const s1Transition = transitions.find(t => t.from === state1 && t.symbol === symbol);
      const s2Transition = transitions.find(t => t.from === state2 && t.symbol === symbol);

      const s1Target = s1Transition?.to || "";
      const s2Target = s2Transition?.to || "";

      if (partitionMap.get(s1Target) !== partitionMap.get(s2Target)) {
        return true;
      }
    }

    return false;
  };

  // Minimize DFA using partition refinement algorithm
  const minimizeDFA = () => {
    const steps: string[] = [];
    
    // Step 1: Initial partition - separate accepting and non-accepting states
    const acceptingStates = new Set(states.filter(s => s.isAccept).map(s => s.name));
    const nonAcceptingStates = new Set(states.filter(s => !s.isAccept).map(s => s.name));

    let currentPartitions: Partition[] = [];
    if (nonAcceptingStates.size > 0) {
      currentPartitions.push({
        states: nonAcceptingStates,
        id: "P0"
      });
    }
    if (acceptingStates.size > 0) {
      currentPartitions.push({
        states: acceptingStates,
        id: "P1"
      });
    }

    steps.push("Step 1: Initial partition based on accepting/non-accepting states");
    steps.push(`P0 (Non-accepting): {${Array.from(nonAcceptingStates).join(', ')}}`);
    steps.push(`P1 (Accepting): {${Array.from(acceptingStates).join(', ')}}`);

    let iteration = 1;
    let changed = true;

    while (changed) {
      changed = false;
      const newPartitions: Partition[] = [];
      
      steps.push(`\nIteration ${iteration}:`);

      for (const partition of currentPartitions) {
        if (partition.states.size <= 1) {
          // Partition with single state cannot be refined
          newPartitions.push(partition);
          continue;
        }

        // Try to refine this partition
        const stateArray = Array.from(partition.states);
        const subPartitions: Set<string>[] = [];

        // Create partition map for current iteration
        const partitionMap = new Map<string, string>();
        currentPartitions.forEach((p, index) => {
          p.states.forEach(state => {
            partitionMap.set(state, `P${index}`);
          });
        });

        for (const state of stateArray) {
          let placed = false;
          
          for (const subPartition of subPartitions) {
            const representative = Array.from(subPartition)[0];
            
            if (!areDistinguishable(state, representative, partitionMap)) {
              subPartition.add(state);
              placed = true;
              break;
            }
          }

          if (!placed) {
            subPartitions.push(new Set([state]));
          }
        }

        // Add refined partitions
        if (subPartitions.length > 1) {
          changed = true;
          steps.push(`  Partition ${partition.id} refined into ${subPartitions.length} sub-partitions:`);
          
          subPartitions.forEach((subPartition, index) => {
            const newId = `${partition.id}.${index}`;
            newPartitions.push({
              states: subPartition,
              id: newId
            });
            steps.push(`    ${newId}: {${Array.from(subPartition).join(', ')}}`);
          });
        } else {
          newPartitions.push(partition);
          steps.push(`  Partition ${partition.id} cannot be refined further`);
        }
      }

      currentPartitions = newPartitions;
      iteration++;

      if (iteration > 10) { // Safety check
        steps.push("Maximum iterations reached");
        break;
      }
    }

    // Step 3: Construct minimized DFA
    steps.push(`\nFinal partitions:`);
    currentPartitions.forEach(partition => {
      steps.push(`${partition.id}: {${Array.from(partition.states).join(', ')}}`);
    });

    // Create minimized states
    const newStates: DFAState[] = [];
    const partitionMap = new Map<string, string>();

    currentPartitions.forEach(partition => {
      const representative = Array.from(partition.states)[0];
      const originalState = states.find(s => s.name === representative)!;
      
      newStates.push({
        name: partition.id,
        isStart: Array.from(partition.states).some(stateName => 
          states.find(s => s.name === stateName)?.isStart
        ),
        isAccept: originalState.isAccept
      });

      // Map all states in partition to the partition id
      partition.states.forEach(stateName => {
        partitionMap.set(stateName, partition.id);
      });
    });

    // Create minimized transitions
    const newTransitions: DFATransition[] = [];
    const transitionSet = new Set<string>();

    for (const transition of transitions) {
      const fromPartition = partitionMap.get(transition.from);
      const toPartition = partitionMap.get(transition.to);
      
      if (fromPartition && toPartition) {
        const transitionKey = `${fromPartition}-${transition.symbol}-${toPartition}`;
        
        if (!transitionSet.has(transitionKey)) {
          transitionSet.add(transitionKey);
          newTransitions.push({
            from: fromPartition,
            to: toPartition,
            symbol: transition.symbol
          });
        }
      }
    }

    steps.push(`\nMinimized DFA:`);
    steps.push(`States: ${newStates.length} (reduced from ${states.length})`);
    steps.push(`Transitions: ${newTransitions.length}`);

    setMinimizedStates(newStates);
    setMinimizedTransitions(newTransitions);
    setMinimizationSteps(steps);
    setIsMinimized(true);
  };

  const addState = () => {
    const newStateName = `q${states.length}`;
    setStates([...states, { name: newStateName, isStart: false, isAccept: false }]);
  };

  const removeState = (index: number) => {
    const newStates = states.filter((_, i) => i !== index);
    setStates(newStates);
  };

  const addTransition = () => {
    setTransitions([...transitions, { from: "q0", to: "q0", symbol: "0" }]);
  };

  const removeTransition = (index: number) => {
    const newTransitions = transitions.filter((_, i) => i !== index);
    setTransitions(newTransitions);
  };

  const reset = () => {
    setMinimizedStates([]);
    setMinimizedTransitions([]);
    setMinimizationSteps([]);
    setIsMinimized(false);
  };

  return (
    <div className="container mx-auto py-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-black mb-6">
        DFA Minimization
      </h1>

      <EducationalInfo
        topic="DFA Minimization (Partition Refinement)"
        description="Learn to reduce the number of states in a DFA while preserving the language it recognizes"
        theory={{
          definition: "DFA minimization creates an equivalent DFA with the minimum number of states by merging indistinguishable states.",
          keyPoints: [
            "Two states are distinguishable if one is accepting and the other is not",
            "Two states are distinguishable if they transition to distinguishable states on some input",
            "The algorithm iteratively refines partitions until no further refinement is possible",
            "The resulting minimal DFA is unique (up to state renaming)",
            "Minimization reduces both space and time complexity"
          ],
          applications: [
            "Optimizing finite state machines in hardware",
            "Reducing memory usage in pattern matching",
            "Compiler optimization",
            "Digital circuit minimization"
          ]
        }}
        mumbaiUniversity={{
          syllabus: ["DFA Minimization", "Partition Refinement Algorithm", "Distinguishable States"],
          marks: "8-10 marks",
          commonQuestions: [
            "Minimize the given DFA using partition refinement",
            "Identify distinguishable and indistinguishable states",
            "Show step-by-step minimization process",
            "Compare original and minimized DFA"
          ],
          examTips: [
            "Start with initial partition: accepting vs non-accepting states",
            "For each partition, check if states can be distinguished",
            "Keep refining until no further refinement is possible",
            "Verify that the minimized DFA accepts the same language"
          ]
        }}
        algorithm={{
          steps: [
            "Create initial partition: separate accepting and non-accepting states",
            "For each partition with more than one state:",
            "Check if any two states in the partition are distinguishable",
            "If distinguishable states found, split the partition",
            "Repeat until no partition can be refined further",
            "Create minimized DFA using final partitions as states"
          ],
          complexity: {
            time: "O(n² * |Σ|) where n is number of states",
            space: "O(n²) for storing distinguishability information"
          }
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Original DFA Input */}
        <Card className="p-6 bg-white border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-black">Original DFA</h2>
          
          {/* DFA States */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-2">DFA States</label>
            {states.map((state, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <Input
                  value={state.name}
                  onChange={(e) => {
                    const newStates = [...states];
                    newStates[index].name = e.target.value;
                    setStates(newStates);
                  }}
                  className="w-24 text-black bg-white"
                />
                <label className="flex items-center text-black">
                  <input
                    type="checkbox"
                    checked={state.isStart}
                    onChange={(e) => {
                      const newStates = [...states];
                      newStates.forEach(s => s.isStart = false);
                      newStates[index].isStart = e.target.checked;
                      setStates(newStates);
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
                      const newStates = [...states];
                      newStates[index].isAccept = e.target.checked;
                      setStates(newStates);
                    }}
                    className="mr-1"
                  />
                  Accept
                </label>
                <Button
                  onClick={() => removeState(index)}
                  variant="outline"
                  size="sm"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button onClick={addState} variant="outline" size="sm">
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
              placeholder="0, 1"
              className="text-black bg-white"
            />
          </div>

          {/* DFA Transitions */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-2">DFA Transitions</label>
            {transitions.map((transition, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <select
                  value={transition.from}
                  onChange={(e) => {
                    const newTransitions = [...transitions];
                    newTransitions[index].from = e.target.value;
                    setTransitions(newTransitions);
                  }}
                  className="border rounded px-2 py-1 text-black bg-white"
                >
                  {states.map(state => (
                    <option key={state.name} value={state.name}>{state.name}</option>
                  ))}
                </select>
                <ArrowRight className="h-4 w-4" />
                <select
                  value={transition.to}
                  onChange={(e) => {
                    const newTransitions = [...transitions];
                    newTransitions[index].to = e.target.value;
                    setTransitions(newTransitions);
                  }}
                  className="border rounded px-2 py-1 text-black bg-white"
                >
                  {states.map(state => (
                    <option key={state.name} value={state.name}>{state.name}</option>
                  ))}
                </select>
                <Input
                  value={transition.symbol}
                  onChange={(e) => {
                    const newTransitions = [...transitions];
                    newTransitions[index].symbol = e.target.value;
                    setTransitions(newTransitions);
                  }}
                  className="w-16 text-black bg-white"
                  placeholder="0"
                />
                <Button
                  onClick={() => removeTransition(index)}
                  variant="outline"
                  size="sm"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button onClick={addTransition} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Transition
            </Button>
          </div>

          <div className="flex gap-2">
            <Button onClick={minimizeDFA} className="flex-1">
              Minimize DFA
            </Button>
            <Button onClick={reset} variant="outline">
              Reset
            </Button>
          </div>
        </Card>

        {/* Minimization Steps */}
        <Card className="p-6 bg-white border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-black">Minimization Steps</h2>
          
          {minimizationSteps.length > 0 ? (
            <div className="bg-gray-50 p-4 rounded-lg max-h-[400px] overflow-y-auto">
              <pre className="text-sm font-mono whitespace-pre-wrap text-black">
                {minimizationSteps.join('\n')}
              </pre>
            </div>
          ) : (
            <p className="text-black">Click &quot;Minimize DFA&quot; to see the step-by-step minimization process.</p>
          )}
        </Card>
      </div>

      {/* Minimized DFA */}
      {isMinimized && (
        <Card className="p-6 mb-8 bg-white border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-black">Minimized DFA</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2 text-black">Minimized States</h3>
              <div className="space-y-2">
                {minimizedStates.map((state, index) => (
                  <div key={index} className="p-2 bg-gray-50 rounded text-black">
                    <span className="font-mono">{state.name}</span>
                    {state.isStart && <span className="ml-2 text-green-600 text-sm">(Start)</span>}
                    {state.isAccept && <span className="ml-2 text-blue-600 text-sm">(Accept)</span>}
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded">
                <p className="text-sm text-black">
                  <strong>Reduction:</strong> {states.length} → {minimizedStates.length} states
                  ({Math.round((1 - minimizedStates.length / states.length) * 100)}% reduction)
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2 text-black">Minimized Transitions</h3>
              <div className="space-y-2">
                {minimizedTransitions.map((transition, index) => (
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
        title="DFA Minimization"
        input={`DFA with ${states.length} states and ${transitions.length} transitions`}
        result={isMinimized}
        steps={minimizationSteps.map((step, index) => ({
          stepNumber: index + 1,
          description: step,
          explanation: step
        }))}
        finalAnswer={isMinimized ? 
          `Minimized DFA with ${minimizedStates.length} states (${Math.round((1 - minimizedStates.length / states.length) * 100)}% reduction)` : 
          "Minimization not completed"
        }
        examFormat={{
          question: "Minimize the given DFA using the partition refinement algorithm.",
          solution: minimizationSteps,
          conclusion: "The minimized DFA has the minimum possible number of states while recognizing the same language.",
          marks: 10
        }}
      />
    </div>
  );
}
