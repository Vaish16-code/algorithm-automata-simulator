// utils/automataTheory.ts

// Finite Automata Types
export interface State {
  name: string;
  isStart: boolean;
  isAccept: boolean;
}

export interface Transition {
  from: string;
  to: string;
  symbol: string;
}

export interface FiniteAutomaton {
  states: State[];
  alphabet: string[];
  transitions: Transition[];
  startState: string;
  acceptStates: string[];
}

export interface FASimulationStep {
  currentState: string;
  remainingInput: string;
  consumedInput: string;
  transition?: Transition;
  accepted?: boolean;
}

export interface FAResult {
  accepted: boolean;
  steps: FASimulationStep[];
  finalState: string;
}

// DFA Simulation
export function simulateDFA(fa: FiniteAutomaton, input: string): FAResult {
  const steps: FASimulationStep[] = [];
  let currentState = fa.startState;
  let consumedInput = "";
  
  // Initial step
  steps.push({
    currentState,
    remainingInput: input,
    consumedInput: ""
  });

  for (let i = 0; i < input.length; i++) {
    const symbol = input[i];
    const transition = fa.transitions.find(t => 
      t.from === currentState && t.symbol === symbol
    );

    if (!transition) {
      // No transition found - reject
      steps.push({
        currentState,
        remainingInput: input.substring(i),
        consumedInput: consumedInput,
        accepted: false
      });
      return {
        accepted: false,
        steps,
        finalState: currentState
      };
    }

    currentState = transition.to;
    consumedInput += symbol;

    steps.push({
      currentState,
      remainingInput: input.substring(i + 1),
      consumedInput,
      transition
    });
  }

  const accepted = fa.acceptStates.includes(currentState);
  steps[steps.length - 1].accepted = accepted;

  return {
    accepted,
    steps,
    finalState: currentState
  };
}

// NFA Simulation
export function simulateNFA(fa: FiniteAutomaton, input: string): FAResult {
  const steps: FASimulationStep[] = [];
  
  // For NFA, we need to track multiple possible states
  let currentStates = new Set([fa.startState]);
  let consumedInput = "";

  steps.push({
    currentState: Array.from(currentStates).join(','),
    remainingInput: input,
    consumedInput: ""
  });

  for (let i = 0; i < input.length; i++) {
    const symbol = input[i];
    const nextStates = new Set<string>();

    // Find all possible transitions
    for (const state of currentStates) {
      const transitions = fa.transitions.filter(t => 
        t.from === state && t.symbol === symbol
      );
      
      transitions.forEach(t => nextStates.add(t.to));
    }

    if (nextStates.size === 0) {
      // No transitions possible - reject
      steps.push({
        currentState: Array.from(currentStates).join(','),
        remainingInput: input.substring(i),
        consumedInput,
        accepted: false
      });
      return {
        accepted: false,
        steps,
        finalState: Array.from(currentStates).join(',')
      };
    }

    currentStates = nextStates;
    consumedInput += symbol;

    steps.push({
      currentState: Array.from(currentStates).join(','),
      remainingInput: input.substring(i + 1),
      consumedInput
    });
  }

  // Check if any final state is an accept state
  const accepted = Array.from(currentStates).some(state => 
    fa.acceptStates.includes(state)
  );
  
  steps[steps.length - 1].accepted = accepted;

  return {
    accepted,
    steps,
    finalState: Array.from(currentStates).join(',')
  };
}

// Regular Expression Types
export interface RegexResult {
  matches: boolean;
  pattern: string;
  input: string;
  steps: string[];
}

export function simulateRegex(pattern: string, input: string): RegexResult {
  const steps: string[] = [];
  steps.push(`Pattern: ${pattern}`);
  steps.push(`Input: ${input}`);
  
  try {
    const regex = new RegExp(`^${pattern}$`);
    const matches = regex.test(input);
    
    steps.push(`Testing pattern against input...`);
    steps.push(`Result: ${matches ? 'MATCH' : 'NO MATCH'}`);
    
    return {
      matches,
      pattern,
      input,
      steps
    };
  } catch {
    steps.push(`Error: Invalid regular expression`);
    return {
      matches: false,
      pattern,
      input,
      steps
    };
  }
}

// Turing Machine Types
export interface TMTransition {
  currentState: string;
  readSymbol: string;
  writeSymbol: string;
  moveDirection: 'L' | 'R';
  nextState: string;
}

export interface TuringMachine {
  states: string[];
  alphabet: string[];
  tapeAlphabet: string[];
  transitions: TMTransition[];
  startState: string;
  acceptState: string;
  rejectState: string;
  blankSymbol: string;
}

export interface TMStep {
  step: number;
  state: string;
  tape: string[];
  headPosition: number;
  transition?: TMTransition;
  accepted?: boolean;
  rejected?: boolean;
}

export interface TMResult {
  accepted: boolean;
  rejected: boolean;
  steps: TMStep[];
  finalTape: string[];
}

export function simulateTuringMachine(tm: TuringMachine, input: string): TMResult {
  const steps: TMStep[] = [];
  let currentState = tm.startState;
  let headPosition = 0;
  const tape = input.split('');
  
  // Ensure tape has blank symbols on both sides
  while (tape.length < 20) tape.push(tm.blankSymbol);
  while (headPosition > 0) {
    tape.unshift(tm.blankSymbol);
    headPosition++;
  }
  
  let stepCount = 0;
  const maxSteps = 1000; // Prevent infinite loops

  // Initial step
  steps.push({
    step: stepCount,
    state: currentState,
    tape: [...tape],
    headPosition
  });

  while (stepCount < maxSteps) {
    if (currentState === tm.acceptState) {
      steps[steps.length - 1].accepted = true;
      return {
        accepted: true,
        rejected: false,
        steps,
        finalTape: tape
      };
    }

    if (currentState === tm.rejectState) {
      steps[steps.length - 1].rejected = true;
      return {
        accepted: false,
        rejected: true,
        steps,
        finalTape: tape
      };
    }

    const currentSymbol = tape[headPosition] || tm.blankSymbol;
    const transition = tm.transitions.find(t => 
      t.currentState === currentState && t.readSymbol === currentSymbol
    );

    if (!transition) {
      // No transition found - implicit reject
      steps.push({
        step: ++stepCount,
        state: tm.rejectState,
        tape: [...tape],
        headPosition,
        rejected: true
      });
      return {
        accepted: false,
        rejected: true,
        steps,
        finalTape: tape
      };
    }

    // Apply transition
    tape[headPosition] = transition.writeSymbol;
    currentState = transition.nextState;
    
    if (transition.moveDirection === 'L') {
      headPosition--;
      if (headPosition < 0) {
        tape.unshift(tm.blankSymbol);
        headPosition = 0;
      }
    } else {
      headPosition++;
      if (headPosition >= tape.length) {
        tape.push(tm.blankSymbol);
      }
    }

    steps.push({
      step: ++stepCount,
      state: currentState,
      tape: [...tape],
      headPosition,
      transition
    });
  }

  // Max steps reached - assume rejection
  return {
    accepted: false,
    rejected: true,
    steps,
    finalTape: tape
  };
}

// Pushdown Automata Types
export interface PDATransition {
  fromState: string;
  inputSymbol: string; // can be ε
  popSymbol: string;   // can be ε
  toState: string;
  pushSymbols: string[]; // can be empty for pop-only
}

export interface PushdownAutomaton {
  states: string[];
  inputAlphabet: string[];
  stackAlphabet: string[];
  transitions: PDATransition[];
  startState: string;
  initialStackSymbol: string;
  acceptStates: string[];
}

export interface PDAStackSymbol {
  value: string;
  index: number;
}

export interface PDASimulationStep {
  step: number;
  state: string;
  remainingInput: string;
  consumedInput: string;
  stack: PDAStackSymbol[];
  transition?: PDATransition;
  accepted?: boolean;
}

export interface PDAResult {
  accepted: boolean;
  steps: PDASimulationStep[];
  finalState: string;
}

export function simulatePDA(pda: PushdownAutomaton, input: string): PDAResult {
  const steps: PDASimulationStep[] = [];
  let currentState = pda.startState;
  const stack: PDAStackSymbol[] = [{ value: pda.initialStackSymbol, index: 0 }];
  let consumedInput = "";
  let stepCount = 0;
  
  // Initial step
  steps.push({
    step: stepCount++,
    state: currentState,
    remainingInput: input,
    consumedInput: "",
    stack: [...stack]
  });
  
  let i = 0;
  const maxSteps = 100; // Prevent infinite loops from ε-transitions
  
  while (stepCount < maxSteps) {
    // Check if we're done processing input
    if (i >= input.length) {
      // Try epsilon transitions after consuming all input
      const topStack = stack.length > 0 ? stack[stack.length - 1].value : "ε";
      
      // Look for epsilon transitions
      const epsilonTransitions = pda.transitions.filter(t => 
        t.fromState === currentState && 
        t.inputSymbol === "ε" &&
        (t.popSymbol === topStack || t.popSymbol === "ε")
      );
      
      if (epsilonTransitions.length > 0) {
        // Take the first epsilon transition
        const transition = epsilonTransitions[0];
        currentState = transition.toState;
        
        // Update stack
        if (transition.popSymbol !== "ε" && stack.length > 0) {
          stack.pop();
        }
        
        // Push new symbols
        for (let j = transition.pushSymbols.length - 1; j >= 0; j--) {
          if (transition.pushSymbols[j] !== "ε") {
            stack.push({ 
              value: transition.pushSymbols[j], 
              index: stack.length > 0 ? stack[stack.length - 1].index + 1 : 0 
            });
          }
        }
        
        // Record step
        steps.push({
          step: stepCount++,
          state: currentState,
          remainingInput: "",
          consumedInput: input,
          stack: [...stack],
          transition
        });
        
        continue; // Try more epsilon transitions
      }
      
      // No more epsilon transitions, check if we're in an accept state
      const accepted = pda.acceptStates.includes(currentState);
      if (steps.length > 0) {
        steps[steps.length - 1].accepted = accepted;
      }
      return {
        accepted,
        steps,
        finalState: currentState
      };
    }
    
    const inputSymbol = i < input.length ? input[i] : "ε";
    const topStack = stack.length > 0 ? stack[stack.length - 1].value : "ε";
    
    // Find applicable transitions
    // First, check for transitions that consume input
    let possibleTransitions = pda.transitions.filter(t => 
      t.fromState === currentState && 
      t.inputSymbol === inputSymbol &&
      (t.popSymbol === topStack || t.popSymbol === "ε")
    );
    
    // If no transitions consume input, try ε-transitions
    if (possibleTransitions.length === 0 && inputSymbol !== "ε") {
      possibleTransitions = pda.transitions.filter(t => 
        t.fromState === currentState && 
        t.inputSymbol === "ε" &&
        (t.popSymbol === topStack || t.popSymbol === "ε")
      );
    }
    
    if (possibleTransitions.length === 0) {
      // No valid transition, reject
      return {
        accepted: false,
        steps,
        finalState: currentState
      };
    }
    
    // For simplicity, take the first applicable transition
    // In a real NFA, we would explore all possibilities
    const transition = possibleTransitions[0];
    
    // Update state
    currentState = transition.toState;
    
    // Update stack
    if (transition.popSymbol !== "ε" && stack.length > 0) {
      stack.pop(); // Pop the top symbol
    }
    
    // Push new symbols (in reverse order)
    for (let j = transition.pushSymbols.length - 1; j >= 0; j--) {
      if (transition.pushSymbols[j] !== "ε") {
        stack.push({ 
          value: transition.pushSymbols[j], 
          index: stack.length > 0 ? stack[stack.length - 1].index + 1 : 0 
        });
      }
    }
    
    // If we consumed input, move to next symbol
    if (transition.inputSymbol !== "ε") {
      consumedInput += input[i];
      i++;
    }
    
    // Record step
    steps.push({
      step: stepCount++,
      state: currentState,
      remainingInput: input.substring(i),
      consumedInput,
      stack: [...stack],
      transition
    });
  }
  
  // If we reach here, we hit the step limit
  return {
    accepted: false,
    steps,
    finalState: currentState
  };
}

// Context-Free Grammar Types
export interface CFGProduction {
  left: string;
  right: string[];
}

export interface ContextFreeGrammar {
  terminals: string[];
  nonTerminals: string[];
  productions: CFGProduction[];
  startSymbol: string;
}

export interface CFGDerivationStep {
  step: number;
  sententialForm: string[];
  productionUsed?: CFGProduction;
  appliedAt?: number;
}

export interface CFGResult {
  canDerive: boolean;
  derivation: CFGDerivationStep[];
}

export function simulateCFG(cfg: ContextFreeGrammar, target: string): CFGResult {
  const steps: CFGDerivationStep[] = [];
  
  // Use iterative deepening to find a derivation
  for (let maxDepth = 1; maxDepth <= 20; maxDepth++) {
    const result = tryDerive(cfg, target, maxDepth);
    if (result.success) {
      return {
        canDerive: true,
        derivation: result.steps
      };
    }
  }
  
  return {
    canDerive: false,
    derivation: steps
  };
}

function tryDerive(cfg: ContextFreeGrammar, target: string, maxDepth: number): { success: boolean, steps: CFGDerivationStep[] } {
  const steps: CFGDerivationStep[] = [];
  
  function derive(current: string[], depth: number): boolean {
    // Add current step
    steps.push({
      step: steps.length,
      sententialForm: [...current]
    });

    // Check if we've reached the target
    const currentString = current.join('');
    if (currentString === target) {
      return true;
    }

    // If we've reached max depth or the string is too long, stop
    if (depth >= maxDepth || currentString.length > target.length) {
      return false;
    }

    // Find leftmost non-terminal
    const nonTerminalIndex = current.findIndex(symbol => 
      cfg.nonTerminals.includes(symbol)
    );

    if (nonTerminalIndex === -1) {
      // No more non-terminals, check if we match target
      return currentString === target;
    }

    const nonTerminal = current[nonTerminalIndex];
    
    // Find applicable productions
    const productions = cfg.productions.filter(p => p.left === nonTerminal);
    
    // Try each production
    for (const production of productions) {
      // Apply production
      const newSententialForm = [
        ...current.slice(0, nonTerminalIndex),
        ...production.right.filter(symbol => symbol !== 'ε'), // Handle epsilon
        ...current.slice(nonTerminalIndex + 1)
      ];

      // Save current steps length to backtrack if needed
      const stepsBefore = steps.length;

      // Add step for this production
      steps.push({
        step: steps.length,
        sententialForm: [...newSententialForm],
        productionUsed: production,
        appliedAt: nonTerminalIndex
      });

      // Recursively try to derive
      if (derive(newSententialForm, depth + 1)) {
        return true;
      }

      // Backtrack - remove steps added in this branch
      steps.splice(stepsBefore);
    }

    return false;
  }

  // Start with the start symbol
  const initialForm = [cfg.startSymbol];
  const success = derive(initialForm, 0);

  return { success, steps };
}
