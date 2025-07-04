"use client";

import EducationalInfo from '@/components/EducationalInfo';
import ExamResult from '@/components/ExamResult';
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function PdaToCfgConverter() {
  const [pdaTransitions, setPdaTransitions] = useState<string[]>([
    'q0,a,ε→q0,A', 
    'q0,b,A→q1,ε', 
    'q1,b,ε→q1,ε', 
    'q1,ε,Z0→q2,Z0'
  ]);
  const [startState, setStartState] = useState('q0');
  const [acceptStates, setAcceptStates] = useState<string[]>(['q2']);
  const [inputSymbols, setInputSymbols] = useState<string[]>(['a', 'b']);
  const [stackSymbols, setStackSymbols] = useState<string[]>(['Z0', 'A']);
  const [initialStackSymbol, setInitialStackSymbol] = useState('Z0');
  const [cfgProductions, setCfgProductions] = useState<string[]>([]);
  const [newTransition, setNewTransition] = useState('');

  const addTransition = () => {
    if (newTransition && !pdaTransitions.includes(newTransition)) {
      setPdaTransitions([...pdaTransitions, newTransition]);
      setNewTransition('');
    }
  };

  const removeTransition = (index: number) => {
    setPdaTransitions(pdaTransitions.filter((_, i) => i !== index));
  };

  const convertPdaToCfg = () => {
    // Implementation of PDA to CFG conversion algorithm
    const productions: string[] = [];
    
    // Step 1: Create the start production
    acceptStates.forEach(acceptState => {
      productions.push(`S → [${startState}, ${initialStackSymbol}, ${acceptState}]`);
    });
    
    // Step 2: Add productions for each PDA transition
    pdaTransitions.forEach(transition => {
      const [from, input, pop, to, push] = parseTransition(transition);
      const allStates = extractStates(pdaTransitions);
      
      if (push === 'ε') {
        // If nothing is pushed onto the stack (pop transition)
        productions.push(`[${from}, ${pop}, ${to}] → ${input === 'ε' ? 'ε' : input}`);
      } else if (push.length === 1) {
        // If one symbol is pushed onto the stack (replace transition)
        allStates.forEach(r => {
          productions.push(`[${from}, ${pop}, ${r}] → ${input === 'ε' ? '' : input}[${to}, ${push}, ${r}]`);
        });
      } else {
        // If multiple symbols are pushed onto the stack
        // Note: This is a simplified implementation that assumes at most 2 symbols
        // In real implementation, we would need to handle arbitrary push strings
        const pushSymbols = push.split('');
        if (pushSymbols.length === 2) {
          const [Y, Z] = pushSymbols;
          allStates.forEach(r => {
            allStates.forEach(s => {
              productions.push(`[${from}, ${pop}, ${r}] → ${input === 'ε' ? '' : input}[${to}, ${Y}, ${s}][${s}, ${Z}, ${r}]`);
            });
          });
        } else {
          // Handle single symbol push as fallback
          allStates.forEach(r => {
            productions.push(`[${from}, ${pop}, ${r}] → ${input === 'ε' ? '' : input}[${to}, ${push}, ${r}]`);
          });
        }
      }
    });
    
    // Step 3: Add unit productions for all states
    const states = extractStates(pdaTransitions);
    states.forEach(state => {
      productions.push(`[${state}, ε, ${state}] → ε`);
    });
    
    setCfgProductions(productions);
  };

  // Helper function to parse a PDA transition
  const parseTransition = (transition: string): [string, string, string, string, string] => {
    // Format: q0,a,ε→q0,A (from,input,pop→to,push)
    const [left, right] = transition.split('→');
    const [from, input, pop] = left.split(',');
    const [to, push] = right.split(',');
    return [from, input, pop, to, push];
  };

  // Helper function to extract all states from transitions
  const extractStates = (transitions: string[]): string[] => {
    const states = new Set<string>();
    transitions.forEach(transition => {
      const [from, , , to] = parseTransition(transition);
      states.add(from);
      states.add(to);
    });
    return Array.from(states);
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        PDA to CFG Conversion
      </h1>

      <EducationalInfo 
        topic="Pushdown Automata to Context-Free Grammar Conversion"
        description="Learn how to systematically convert any PDA to an equivalent CFG"
        theory={{
          definition: "A pushdown automaton (PDA) can be converted to an equivalent context-free grammar (CFG) that generates the same language.",
          keyPoints: [
            "For each PDA transition δ(q, a, X) = {(p, γ)}, create productions",
            "Create variables [q, X, p] for all states q, p and stack symbols X",
            "The variable [q, X, p] represents 'from state q, we can consume X from the stack and reach state p'",
            "The start variable S generates [q0, Z0, qf] for each accepting state qf"
          ],
          applications: [
            "Parser generators for context-free languages",
            "Syntax analysis in compilers",
            "Natural language processing systems"
          ]
        }}
        mumbaiUniversity={{
          syllabus: ["Theory of Computation", "Context-Free Languages", "Pushdown Automata"],
          marks: "15-20 marks",
          commonQuestions: [
            "Convert the given PDA to an equivalent CFG",
            "Prove that the language accepted by a PDA is a CFL",
            "Show the construction steps for converting PDA to CFG"
          ],
          examTips: [
            "Always follow the systematic conversion algorithm",
            "Make sure to create variables for all state-symbol combinations",
            "Don't forget the epsilon productions for self-transitions"
          ]
        }}
        algorithm={{
          steps: [
            "Create variable S as the start symbol",
            "For each accepting state qf, add production S -> [q0, Z0, qf]",
            "For each push transition delta(q, a, X) = {(p, YZ)}, add [q, X, r] -> a[p, Y, s][s, Z, r] for all states r, s",
            "For each pop transition delta(q, a, X) = {(p, epsilon)}, add [q, X, p] -> a",
            "For each state q, add epsilon production [q, epsilon, q] -> epsilon"
          ],
          complexity: {
            time: "O(n³)",
            space: "O(n²)"
          }
        }}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            PDA Specification
          </h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Start State
            </label>
            <Input 
              value={startState} 
              onChange={(e) => setStartState(e.target.value)} 
              placeholder="e.g., q0"
              className="text-gray-900 dark:text-white"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Accept States (comma separated)
            </label>
            <Input 
              value={acceptStates.join(',')} 
              onChange={(e) => setAcceptStates(e.target.value.split(',').map(s => s.trim()))} 
              placeholder="e.g., q2,q3"
              className="text-gray-900 dark:text-white"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Input Symbols (comma separated)
            </label>
            <Input 
              value={inputSymbols.join(',')} 
              onChange={(e) => setInputSymbols(e.target.value.split(',').map(s => s.trim()))} 
              placeholder="e.g., a,b"
              className="text-gray-900 dark:text-white"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Stack Symbols (comma separated)
            </label>
            <Input 
              value={stackSymbols.join(',')} 
              onChange={(e) => setStackSymbols(e.target.value.split(',').map(s => s.trim()))} 
              placeholder="e.g., Z0,A,B"
              className="text-gray-900 dark:text-white"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Initial Stack Symbol
            </label>
            <Input 
              value={initialStackSymbol} 
              onChange={(e) => setInitialStackSymbol(e.target.value)} 
              placeholder="e.g., Z0"
              className="text-gray-900 dark:text-white"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              PDA Transitions (format: q0,a,X→q1,Y)
            </label>
            <div className="flex mb-2">
              <Input 
                value={newTransition} 
                onChange={(e) => setNewTransition(e.target.value)} 
                placeholder="e.g., q0,a,ε→q0,A"
                className="flex-1 mr-2 text-gray-900 dark:text-white"
              />
              <Button onClick={addTransition}>Add</Button>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md max-h-60 overflow-y-auto">
              {pdaTransitions.map((transition, index) => (
                <div key={index} className="flex justify-between items-center mb-1 text-gray-900 dark:text-white">
                  <span>{transition}</span>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => removeTransition(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          <Button 
            onClick={convertPdaToCfg} 
            className="w-full mt-4"
          >
            Convert PDA to CFG
          </Button>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Equivalent Context-Free Grammar
          </h2>
          
          {cfgProductions.length > 0 ? (
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg max-h-[500px] overflow-y-auto">
              <h3 className="font-medium mb-2 text-gray-900 dark:text-white">Productions:</h3>
              {cfgProductions.map((production, index) => (
                <div key={index} className="mb-1 text-gray-900 dark:text-white">
                  {production}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              Click &quot;Convert PDA to CFG&quot; to see the equivalent context-free grammar
            </div>
          )}
        </Card>
      </div>
      
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Example Conversion
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-900 dark:text-white">
          <div>
            <h3 className="font-medium mb-2">Example PDA:</h3>
            <ul className="list-disc list-inside">
              <li>States: q0, q1, q2</li>
              <li>Input symbols: a, b</li>
              <li>Stack symbols: Z0, A</li>
              <li>Start state: q0</li>
              <li>Initial stack symbol: Z0</li>
              <li>Accept states: q2</li>
              <li>Transitions:
                <ul className="list-disc list-inside ml-4">
                  <li>δ(q0, a, ε) = (q0, A)</li>
                  <li>δ(q0, b, A) = (q1, ε)</li>
                  <li>δ(q1, b, ε) = (q1, ε)</li>
                  <li>δ(q1, ε, Z0) = (q2, Z0)</li>
                </ul>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Resulting CFG:</h3>
            <ul className="list-disc list-inside">
              <li>S → [q0, Z0, q2]</li>
              <li>[q0, ε, q0] → ε</li>
              <li>[q0, A, q1] → b</li>
              <li>[q1, ε, q1] → ε</li>
              <li>[q1, Z0, q2] → ε</li>
              <li>[q0, ε, q0] → a[q0, A, q1][q1, ε, q0]</li>
            </ul>
            <p className="mt-2">This grammar generates the language a^n b^n, n ≥ 1.</p>
          </div>    
        </div>
      </Card>
      
      <ExamResult
        title="PDA to CFG Conversion Example"
        input="PDA for language a^n b^n"
        result={true}
        steps={[
          {
            stepNumber: 1,
            description: "Create start variable S",
            explanation: "S → [q0, Z0, q2]"
          },
          {
            stepNumber: 2,
            description: "Handle push transition delta(q0, a, epsilon) = (q0, A)",
            currentState: "q0",
            input: "a",
            transition: "push A",
            explanation: "[q0, epsilon, q0] -> a[q0, A, q0]"
          },
          {
            stepNumber: 3,
            description: "Handle pop transition delta(q0, b, A) = (q1, epsilon)",
            currentState: "q0",
            input: "b",
            transition: "pop A",
            explanation: "[q0, A, q1] -> b"
          },
          {
            stepNumber: 4,
            description: "Handle epsilon transition delta(q1, epsilon, Z0) = (q2, Z0)",
            currentState: "q1",
            input: "epsilon",
            transition: "keep Z0",
            explanation: "[q1, Z0, q2] -> epsilon"
          },
          {
            stepNumber: 5,
            description: "Add epsilon productions for all states",
            explanation: "[q0, epsilon, q0] -> epsilon, [q1, epsilon, q1] -> epsilon, [q2, epsilon, q2] -> epsilon"
          }
        ]}
        finalAnswer="The resulting CFG has productions: S -> [q0, Z0, q2], [q0, epsilon, q0] -> a[q0, A, q0], [q0, A, q1] -> b, [q1, Z0, q2] -> epsilon, [q0, epsilon, q0] -> epsilon, [q1, epsilon, q1] -> epsilon, [q2, epsilon, q2] -> epsilon. This grammar generates the language a^n b^n, n >= 1."
        examFormat={{
          question: "Convert the given PDA for language a^n b^n to an equivalent CFG using the algorithm discussed in class.",
          solution: [
            "1. Create start variable S -> [q0, Z0, q2]",
            "2. For push transition (q0,a,epsilon) = (q0,A), add [q0, epsilon, r] -> a[q0, A, r] for all states r",
            "3. For pop transition (q0,b,A) = (q1,epsilon), add [q0, A, q1] -> b",
            "4. For the epsilon transition (q1,epsilon,Z0) = (q2,Z0), add [q1, Z0, q2] -> epsilon",
            "5. Add epsilon productions [q0, epsilon, q0] -> epsilon, [q1, epsilon, q1] -> epsilon, [q2, epsilon, q2] -> epsilon"
          ],
          conclusion: "The resulting grammar generates the language a^n b^n, n >= 1, which is the same language accepted by the PDA.",
          marks: 15
        }}
      />
    </div>
  );
}
