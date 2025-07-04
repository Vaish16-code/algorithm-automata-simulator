/**
 * JavaScript version of automata theory utilities for Node.js testing
 * Converted from TypeScript for CLI testing compatibility
 */

// DFA Simulation
function simulateDFA(fa, input) {
  const steps = [];
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
    
    // Handle both formats: transitions array and transitions object
    let nextState = null;
    
    if (Array.isArray(fa.transitions)) {
      // Array format
      const transition = fa.transitions.find(t => 
        t.from === currentState && t.symbol === symbol
      );
      nextState = transition ? transition.to : null;
    } else {
      // Object format
      nextState = fa.transitions[currentState] && fa.transitions[currentState][symbol];
    }

    if (!nextState) {
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

    currentState = nextState;
    consumedInput += symbol;

    steps.push({
      currentState,
      remainingInput: input.substring(i + 1),
      consumedInput,
      transition: { from: steps[steps.length - 1].currentState, to: currentState, symbol }
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
function simulateNFA(fa, input) {
  const steps = [];
  
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
    const nextStates = new Set();

    // Find all possible transitions
    for (const state of currentStates) {
      if (Array.isArray(fa.transitions)) {
        // Array format
        const transitions = fa.transitions.filter(t => 
          t.from === state && t.symbol === symbol
        );
        transitions.forEach(t => nextStates.add(t.to));
      } else {
        // Object format
        const stateTransitions = fa.transitions[state];
        if (stateTransitions && stateTransitions[symbol]) {
          const destinations = Array.isArray(stateTransitions[symbol]) 
            ? stateTransitions[symbol] 
            : [stateTransitions[symbol]];
          destinations.forEach(dest => nextStates.add(dest));
        }
      }
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

// PDA Simulation (simplified)
function simulatePDA(pda, input) {
  const steps = [];
  let currentState = pda.startState;
  let stack = pda.startSymbol ? [pda.startSymbol] : [];
  let consumedInput = "";

  steps.push({
    currentState,
    remainingInput: input,
    consumedInput: "",
    stack: [...stack]
  });

  for (let i = 0; i < input.length; i++) {
    const symbol = input[i];
    const stackTop = stack.length > 0 ? stack[stack.length - 1] : '';
    
    const transition = pda.transitions.find(t => 
      t.from === currentState && 
      t.inputSymbol === symbol && 
      (t.stackSymbol === stackTop || t.stackSymbol === '')
    );

    if (!transition) {
      steps.push({
        currentState,
        remainingInput: input.substring(i),
        consumedInput,
        stack: [...stack],
        accepted: false
      });
      return {
        accepted: false,
        steps,
        finalState: currentState
      };
    }

    // Apply transition
    currentState = transition.to;
    consumedInput += symbol;
    
    // Handle stack operations
    if (transition.stackSymbol && stack.length > 0) {
      stack.pop(); // Pop the matching symbol
    }
    
    if (transition.pushSymbol && transition.pushSymbol !== '') {
      if (transition.pushSymbol.length > 1) {
        // Push multiple symbols (reverse order)
        for (let j = transition.pushSymbol.length - 1; j >= 0; j--) {
          stack.push(transition.pushSymbol[j]);
        }
      } else {
        stack.push(transition.pushSymbol);
      }
    }

    steps.push({
      currentState,
      remainingInput: input.substring(i + 1),
      consumedInput,
      stack: [...stack],
      transition
    });
  }

  const accepted = pda.acceptStates.includes(currentState) && 
                  (pda.acceptByEmptyStack ? stack.length === 0 : true);
  
  steps[steps.length - 1].accepted = accepted;

  return {
    accepted,
    steps,
    finalState: currentState
  };
}

// Turing Machine Simulation (simplified)
function simulateTM(tm, input) {
  const steps = [];
  let currentState = tm.startState;
  let tape = input.split('');
  let headPosition = 0;
  let stepCount = 0;
  const maxSteps = 1000; // Prevent infinite loops

  // Extend tape with blanks if needed
  while (tape.length < 20) {
    tape.push('_');
  }

  steps.push({
    currentState,
    tape: [...tape],
    headPosition,
    stepCount: 0
  });

  while (stepCount < maxSteps && !tm.acceptStates.includes(currentState)) {
    const currentSymbol = tape[headPosition] || '_';
    
    const transition = tm.transitions.find(t => 
      t.from === currentState && t.read === currentSymbol
    );

    if (!transition) {
      // No transition found - halt
      steps.push({
        currentState,
        tape: [...tape],
        headPosition,
        stepCount: stepCount + 1,
        accepted: false
      });
      return {
        accepted: false,
        steps,
        finalState: currentState
      };
    }

    // Apply transition
    currentState = transition.to;
    tape[headPosition] = transition.write;
    
    if (transition.direction === 'R') {
      headPosition++;
      if (headPosition >= tape.length) {
        tape.push('_');
      }
    } else if (transition.direction === 'L') {
      headPosition--;
      if (headPosition < 0) {
        tape.unshift('_');
        headPosition = 0;
      }
    }

    stepCount++;

    steps.push({
      currentState,
      tape: [...tape],
      headPosition,
      stepCount,
      transition
    });
  }

  const accepted = tm.acceptStates.includes(currentState);
  steps[steps.length - 1].accepted = accepted;

  return {
    accepted,
    steps,
    finalState: currentState
  };
}

// Regular Expression Matching (simple implementation)
function matchRegex(pattern, input) {
  try {
    const regex = new RegExp(`^${pattern}$`);
    const result = regex.test(input);
    
    return {
      matched: result,
      pattern,
      input,
      steps: [{
        description: `Testing pattern '${pattern}' against input '${input}'`,
        result
      }]
    };
  } catch (error) {
    return {
      matched: false,
      pattern,
      input,
      error: error.message,
      steps: [{
        description: `Error in pattern '${pattern}': ${error.message}`,
        result: false
      }]
    };
  }
}

// Context-Free Grammar parsing (simplified)
function parseWithCFG(cfg, input) {
  // This is a simplified parser - real CFG parsing is complex
  const rules = cfg.rules || [];
  const startSymbol = cfg.startSymbol || 'S';
  
  // Simple recursive descent for basic grammars
  function parseSymbol(symbol, inputStr, position) {
    if (position >= inputStr.length) return null;
    
    // Terminal symbol
    if (symbol === inputStr[position]) {
      return { consumed: 1, remaining: inputStr.substring(position + 1) };
    }
    
    // Non-terminal - try all rules
    const applicableRules = rules.filter(rule => rule.left === symbol);
    
    for (const rule of applicableRules) {
      let currentPos = position;
      let success = true;
      
      for (const rightSymbol of rule.right) {
        const result = parseSymbol(rightSymbol, inputStr, currentPos);
        if (!result) {
          success = false;
          break;
        }
        currentPos += result.consumed;
      }
      
      if (success) {
        return { consumed: currentPos - position, remaining: inputStr.substring(currentPos) };
      }
    }
    
    return null;
  }
  
  const result = parseSymbol(startSymbol, input, 0);
  const accepted = result && result.remaining === '';
  
  return {
    accepted,
    input,
    startSymbol,
    rules: cfg.rules,
    steps: [{
      description: `Parsing '${input}' with CFG starting from '${startSymbol}'`,
      result: accepted
    }]
  };
}

// Pumping Lemma checker (heuristic)
function checkPumpingLemma(language, type = 'regular') {
  // This is a heuristic checker for educational purposes
  const patterns = {
    regular: [
      /^(a+b+)+$/,  // a^n b^m
      /^(ab)+$/,    // (ab)^n
      /^a*b*$/      // a* b*
    ],
    contextFree: [
      /^a+b+$/,     // a^n b^n (not regular but context-free)
      /^(a+b+c+)+$/ // patterns that might be CF but not regular
    ]
  };
  
  const testPatterns = patterns[type] || patterns.regular;
  
  return {
    language,
    type,
    isPumpable: testPatterns.some(pattern => pattern.test(language.example || '')),
    analysis: `Heuristic analysis for ${type} pumping lemma`,
    steps: [{
      description: `Checking if language satisfies ${type} pumping lemma`,
      result: true
    }]
  };
}

module.exports = {
  simulateDFA,
  simulateNFA,
  simulatePDA,
  simulateTM,
  matchRegex,
  parseWithCFG,
  checkPumpingLemma
};
