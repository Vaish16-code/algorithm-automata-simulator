const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

class AutomataTestingBot {
  constructor() {
    this.browser = null;
    this.page = null;
    this.testResults = [];
    this.baseUrl = 'http://localhost:3000';
    this.logFile = 'bot-test-results.json';
    this.screenshotDir = 'bot-screenshots';
    this.currentTest = null;
  }

  async initialize() {
    console.log('🤖 Starting Automata Testing Bot...');
    
    // Create screenshots directory
    try {
      await fs.mkdir(this.screenshotDir, { recursive: true });
    } catch (error) {
      // Directory already exists
    }

    // Launch browser with visible UI so you can see what bot is doing
    this.browser = await puppeteer.launch({ 
      headless: false,
      slowMo: 1000, // Slow down actions so you can see them
      args: ['--start-maximized'],
      defaultViewport: null
    });

    this.page = await this.browser.newPage();
    
    // Add console logging from the page
    this.page.on('console', msg => {
      console.log('📄 PAGE LOG:', msg.text());
    });

    // Add error handling
    this.page.on('error', err => {
      console.error('❌ PAGE ERROR:', err);
    });

    console.log('✅ Bot initialized successfully');
  }

  async logTest(category, algorithm, testCase, result, screenshot = null) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      category,
      algorithm,
      testCase,
      result,
      screenshot,
      issues: result.issues || [],
      success: result.success || false
    };

    this.testResults.push(logEntry);
    
    // Save to file after each test
    await fs.writeFile(this.logFile, JSON.stringify(this.testResults, null, 2));
    
    console.log(`📝 Test logged: ${category} > ${algorithm} > ${testCase.name}`);
    console.log(`   Result: ${result.success ? '✅ PASS' : '❌ FAIL'}`);
    if (result.issues && result.issues.length > 0) {
      result.issues.forEach(issue => console.log(`   Issue: ${issue}`));
    }
  }

  async takeScreenshot(name) {
    const timestamp = Date.now();
    const filename = `${name}_${timestamp}.png`;
    const filepath = path.join(this.screenshotDir, filename);
    await this.page.screenshot({ path: filepath, fullPage: true });
    return filename;
  }

  async waitForElementSafely(selector, timeout = 5000) {
    try {
      await this.page.waitForSelector(selector, { timeout });
      return true;
    } catch (error) {
      console.log(`⚠️  Element not found: ${selector}`);
      return false;
    }
  }

  async testDFA() {
    console.log('🔍 Testing DFA Simulator...');
    
    const testCases = [
      {
        name: 'Simple DFA - Accept "01"',
        states: ['q0', 'q1', 'q2'],
        alphabet: ['0', '1'],
        transitions: [
          { from: 'q0', symbol: '0', to: 'q1' },
          { from: 'q1', symbol: '1', to: 'q2' }
        ],
        startState: 'q0',
        acceptStates: ['q2'],
        testStrings: ['01', '10', '001', '011', ''],
        expectedResults: [true, false, false, false, false]
      },
      {
        name: 'Even number of 1s',
        states: ['q0', 'q1'],
        alphabet: ['0', '1'],
        transitions: [
          { from: 'q0', symbol: '0', to: 'q0' },
          { from: 'q0', symbol: '1', to: 'q1' },
          { from: 'q1', symbol: '0', to: 'q1' },
          { from: 'q1', symbol: '1', to: 'q0' }
        ],
        startState: 'q0',
        acceptStates: ['q0'],
        testStrings: ['', '11', '101', '1', '111'],
        expectedResults: [true, true, false, false, false]
      },
      {
        name: 'Ends with 01',
        states: ['q0', 'q1', 'q2'],
        alphabet: ['0', '1'],
        transitions: [
          { from: 'q0', symbol: '0', to: 'q1' },
          { from: 'q0', symbol: '1', to: 'q0' },
          { from: 'q1', symbol: '0', to: 'q1' },
          { from: 'q1', symbol: '1', to: 'q2' },
          { from: 'q2', symbol: '0', to: 'q1' },
          { from: 'q2', symbol: '1', to: 'q0' }
        ],
        startState: 'q0',
        acceptStates: ['q2'],
        testStrings: ['01', '101', '001', '10', '1'],
        expectedResults: [true, true, true, false, false]
      }
    ];

    try {
      await this.page.goto(`${this.baseUrl}/auto/finite-automata/dfa`);
      await this.page.waitForSelector('body', { timeout: 10000 });
      
      for (const testCase of testCases) {
        console.log(`  Testing: ${testCase.name}`);
        
        const result = await this.runDFATest(testCase);
        const screenshot = await this.takeScreenshot(`dfa_${testCase.name.replace(/\s+/g, '_')}`);
        
        await this.logTest('Finite Automata', 'DFA', testCase, result, screenshot);
        
        // Wait between tests
        await this.page.waitForTimeout(2000);
      }
      
    } catch (error) {
      console.error('❌ Error testing DFA:', error);
      const result = { success: false, issues: [error.message] };
      await this.logTest('Finite Automata', 'DFA', { name: 'Navigation Error' }, result);
    }
  }

  async runDFATest(testCase) {
    const issues = [];
    let success = true;

    try {
      // Clear any existing automaton
      const clearButton = await this.page.$('[data-testid="clear-automaton"], button:contains("Clear"), button:contains("Reset")');
      if (clearButton) {
        await clearButton.click();
        await this.page.waitForTimeout(1000);
      }

      // Add states
      for (const state of testCase.states) {
        try {
          // Look for add state button or input
          const addStateButton = await this.page.$('[data-testid="add-state"], button:contains("Add State")');
          if (addStateButton) {
            await addStateButton.click();
            await this.page.waitForTimeout(500);
          }

          // Try to find state input field
          const stateInput = await this.page.$('[data-testid="state-input"], input[placeholder*="state"], input[placeholder*="State"]');
          if (stateInput) {
            await stateInput.clear();
            await stateInput.type(state);
            
            // Look for confirm button
            const confirmButton = await this.page.$('[data-testid="confirm-state"], button:contains("Add"), button:contains("Confirm")');
            if (confirmButton) {
              await confirmButton.click();
              await this.page.waitForTimeout(500);
            }
          }
        } catch (error) {
          issues.push(`Failed to add state ${state}: ${error.message}`);
          success = false;
        }
      }

      // Set start state
      try {
        const startStateSelect = await this.page.$('[data-testid="start-state"], select:contains("Start State")');
        if (startStateSelect) {
          await startStateSelect.selectOption(testCase.startState);
        }
      } catch (error) {
        issues.push(`Failed to set start state: ${error.message}`);
        success = false;
      }

      // Set accept states
      for (const acceptState of testCase.acceptStates) {
        try {
          const acceptStateCheckbox = await this.page.$(`[data-testid="accept-${acceptState}"], input[value="${acceptState}"]`);
          if (acceptStateCheckbox) {
            await acceptStateCheckbox.check();
          }
        } catch (error) {
          issues.push(`Failed to set accept state ${acceptState}: ${error.message}`);
          success = false;
        }
      }

      // Add transitions
      for (const transition of testCase.transitions) {
        try {
          // Look for transition input fields
          const fromInput = await this.page.$('[data-testid="from-state"], input[placeholder*="from"], select[name*="from"]');
          const symbolInput = await this.page.$('[data-testid="symbol"], input[placeholder*="symbol"], input[placeholder*="Symbol"]');
          const toInput = await this.page.$('[data-testid="to-state"], input[placeholder*="to"], select[name*="to"]');

          if (fromInput && symbolInput && toInput) {
            await fromInput.clear();
            await fromInput.type(transition.from);
            await symbolInput.clear();
            await symbolInput.type(transition.symbol);
            await toInput.clear();
            await toInput.type(transition.to);

            const addTransitionButton = await this.page.$('[data-testid="add-transition"], button:contains("Add Transition")');
            if (addTransitionButton) {
              await addTransitionButton.click();
              await this.page.waitForTimeout(500);
            }
          }
        } catch (error) {
          issues.push(`Failed to add transition ${transition.from} --${transition.symbol}--> ${transition.to}: ${error.message}`);
          success = false;
        }
      }

      // Test strings
      for (let i = 0; i < testCase.testStrings.length; i++) {
        const testString = testCase.testStrings[i];
        const expectedResult = testCase.expectedResults[i];

        try {
          // Find input field for test string
          const testInput = await this.page.$('[data-testid="test-string"], input[placeholder*="test"], input[placeholder*="Test String"]');
          if (testInput) {
            await testInput.clear();
            await testInput.type(testString || 'ε'); // Use epsilon for empty string
            
            // Find and click test button
            const testButton = await this.page.$('[data-testid="test-string-button"], button:contains("Test"), button:contains("Run")');
            if (testButton) {
              await testButton.click();
              await this.page.waitForTimeout(2000);

              // Try to get result
              const resultElement = await this.page.$('[data-testid="result"], .result, .output');
              if (resultElement) {
                const resultText = await resultElement.textContent();
                const isAccepted = resultText.toLowerCase().includes('accept') || resultText.toLowerCase().includes('yes');
                
                if (isAccepted !== expectedResult) {
                  issues.push(`String "${testString}" expected ${expectedResult ? 'ACCEPT' : 'REJECT'} but got ${isAccepted ? 'ACCEPT' : 'REJECT'}`);
                  success = false;
                }
              } else {
                issues.push(`No result displayed for string "${testString}"`);
                success = false;
              }
            }
          }
        } catch (error) {
          issues.push(`Failed to test string "${testString}": ${error.message}`);
          success = false;
        }
      }

    } catch (error) {
      issues.push(`General DFA test error: ${error.message}`);
      success = false;
    }

    return { success, issues };
  }

  async testRegularExpressions() {
    console.log('🔍 Testing Regular Expressions...');
    
    const testCases = [
      {
        name: 'Simple concatenation',
        regex: 'ab',
        testStrings: ['ab', 'a', 'b', 'abc', 'ba'],
        expectedResults: [true, false, false, false, false]
      },
      {
        name: 'Kleene star',
        regex: 'a*',
        testStrings: ['', 'a', 'aa', 'aaa', 'b'],
        expectedResults: [true, true, true, true, false]
      },
      {
        name: 'Union',
        regex: 'a|b',
        testStrings: ['a', 'b', 'ab', 'c', ''],
        expectedResults: [true, true, false, false, false]
      },
      {
        name: 'Complex pattern',
        regex: '(a|b)*abb',
        testStrings: ['abb', 'aabb', 'babb', 'ababb', 'ab'],
        expectedResults: [true, true, true, true, false]
      }
    ];

    try {
      await this.page.goto(`${this.baseUrl}/auto/regular-expressions`);
      await this.page.waitForSelector('body', { timeout: 10000 });
      
      for (const testCase of testCases) {
        console.log(`  Testing: ${testCase.name}`);
        
        const result = await this.runRegexTest(testCase);
        const screenshot = await this.takeScreenshot(`regex_${testCase.name.replace(/\s+/g, '_')}`);
        
        await this.logTest('Regular Expressions', 'Regex Matcher', testCase, result, screenshot);
        
        await this.page.waitForTimeout(2000);
      }
      
    } catch (error) {
      console.error('❌ Error testing Regular Expressions:', error);
      const result = { success: false, issues: [error.message] };
      await this.logTest('Regular Expressions', 'Regex Matcher', { name: 'Navigation Error' }, result);
    }
  }

  async runRegexTest(testCase) {
    const issues = [];
    let success = true;

    try {
      // Find regex input field
      const regexInput = await this.page.$('[data-testid="regex-input"], input[placeholder*="regex"], input[placeholder*="Regular Expression"]');
      if (regexInput) {
        await regexInput.clear();
        await regexInput.type(testCase.regex);
        await this.page.waitForTimeout(1000);
      } else {
        issues.push('Could not find regex input field');
        success = false;
        return { success, issues };
      }

      // Test each string
      for (let i = 0; i < testCase.testStrings.length; i++) {
        const testString = testCase.testStrings[i];
        const expectedResult = testCase.expectedResults[i];

        try {
          const testInput = await this.page.$('[data-testid="test-string"], input[placeholder*="test"], input[placeholder*="Test String"]');
          if (testInput) {
            await testInput.clear();
            await testInput.type(testString || 'ε');
            
            const testButton = await this.page.$('[data-testid="test-button"], button:contains("Test"), button:contains("Match")');
            if (testButton) {
              await testButton.click();
              await this.page.waitForTimeout(2000);

              const resultElement = await this.page.$('[data-testid="result"], .result, .output');
              if (resultElement) {
                const resultText = await resultElement.textContent();
                const isMatch = resultText.toLowerCase().includes('match') || resultText.toLowerCase().includes('accept');
                
                if (isMatch !== expectedResult) {
                  issues.push(`String "${testString}" expected ${expectedResult ? 'MATCH' : 'NO MATCH'} but got ${isMatch ? 'MATCH' : 'NO MATCH'}`);
                  success = false;
                }
              }
            }
          }
        } catch (error) {
          issues.push(`Failed to test string "${testString}": ${error.message}`);
          success = false;
        }
      }

    } catch (error) {
      issues.push(`General regex test error: ${error.message}`);
      success = false;
    }

    return { success, issues };
  }

  async testContextFreeGrammar() {
    console.log('🔍 Testing Context-Free Grammar...');
    
    const testCases = [
      {
        name: 'Simple CFG - Balanced Parentheses',
        productions: [
          'S -> (S)',
          'S -> SS',
          'S -> ε'
        ],
        testStrings: ['()', '(())', '((()))', '(()', ')))'],
        expectedResults: [true, true, true, false, false]
      },
      {
        name: 'CFG - a^n b^n',
        productions: [
          'S -> aSb',
          'S -> ε'
        ],
        testStrings: ['ab', 'aabb', 'aaabbb', 'a', 'aab'],
        expectedResults: [true, true, true, false, false]
      }
    ];

    try {
      await this.page.goto(`${this.baseUrl}/auto/context-free-grammar`);
      await this.page.waitForSelector('body', { timeout: 10000 });
      
      for (const testCase of testCases) {
        console.log(`  Testing: ${testCase.name}`);
        
        const result = await this.runCFGTest(testCase);
        const screenshot = await this.takeScreenshot(`cfg_${testCase.name.replace(/\s+/g, '_')}`);
        
        await this.logTest('Context-Free Grammar', 'CFG Parser', testCase, result, screenshot);
        
        await this.page.waitForTimeout(2000);
      }
      
    } catch (error) {
      console.error('❌ Error testing CFG:', error);
      const result = { success: false, issues: [error.message] };
      await this.logTest('Context-Free Grammar', 'CFG Parser', { name: 'Navigation Error' }, result);
    }
  }

  async runCFGTest(testCase) {
    const issues = [];
    let success = true;

    try {
      // Add productions
      for (const production of testCase.productions) {
        try {
          const productionInput = await this.page.$('[data-testid="production-input"], input[placeholder*="production"], textarea[placeholder*="Production"]');
          if (productionInput) {
            await productionInput.clear();
            await productionInput.type(production);
            
            const addButton = await this.page.$('[data-testid="add-production"], button:contains("Add Production")');
            if (addButton) {
              await addButton.click();
              await this.page.waitForTimeout(500);
            }
          }
        } catch (error) {
          issues.push(`Failed to add production "${production}": ${error.message}`);
          success = false;
        }
      }

      // Test strings
      for (let i = 0; i < testCase.testStrings.length; i++) {
        const testString = testCase.testStrings[i];
        const expectedResult = testCase.expectedResults[i];

        try {
          const testInput = await this.page.$('[data-testid="test-string"], input[placeholder*="test"], input[placeholder*="Test String"]');
          if (testInput) {
            await testInput.clear();
            await testInput.type(testString || 'ε');
            
            const parseButton = await this.page.$('[data-testid="parse-button"], button:contains("Parse"), button:contains("Check")');
            if (parseButton) {
              await parseButton.click();
              await this.page.waitForTimeout(3000);

              const resultElement = await this.page.$('[data-testid="result"], .result, .output');
              if (resultElement) {
                const resultText = await resultElement.textContent();
                const isAccepted = resultText.toLowerCase().includes('accept') || resultText.toLowerCase().includes('valid');
                
                if (isAccepted !== expectedResult) {
                  issues.push(`String "${testString}" expected ${expectedResult ? 'ACCEPT' : 'REJECT'} but got ${isAccepted ? 'ACCEPT' : 'REJECT'}`);
                  success = false;
                }
              }
            }
          }
        } catch (error) {
          issues.push(`Failed to test string "${testString}": ${error.message}`);
          success = false;
        }
      }

    } catch (error) {
      issues.push(`General CFG test error: ${error.message}`);
      success = false;
    }

    return { success, issues };
  }

  async testTuringMachine() {
    console.log('🔍 Testing Turing Machine...');
    
    const testCases = [
      {
        name: 'Simple TM - Add 1 to binary number',
        tape: '101',
        transitions: [
          { state: 'q0', symbol: '0', newSymbol: '0', direction: 'R', newState: 'q0' },
          { state: 'q0', symbol: '1', newSymbol: '1', direction: 'R', newState: 'q0' },
          { state: 'q0', symbol: 'B', newSymbol: 'B', direction: 'L', newState: 'q1' },
          { state: 'q1', symbol: '0', newSymbol: '1', direction: 'L', newState: 'q2' },
          { state: 'q1', symbol: '1', newSymbol: '0', direction: 'L', newState: 'q1' },
          { state: 'q1', symbol: 'B', newSymbol: '1', direction: 'R', newState: 'q2' }
        ],
        startState: 'q0',
        acceptStates: ['q2'],
        expectedOutput: '110'
      },
      {
        name: 'TM - Copy string',
        tape: 'abc',
        transitions: [
          // This is a simplified version - real copy TM would be more complex
          { state: 'q0', symbol: 'a', newSymbol: 'X', direction: 'R', newState: 'q1' },
          { state: 'q1', symbol: 'b', newSymbol: 'b', direction: 'R', newState: 'q1' },
          { state: 'q1', symbol: 'c', newSymbol: 'c', direction: 'R', newState: 'q1' },
          { state: 'q1', symbol: 'B', newSymbol: 'a', direction: 'L', newState: 'q2' }
        ],
        startState: 'q0',
        acceptStates: ['q2'],
        expectedOutput: 'Xbca'
      }
    ];

    try {
      await this.page.goto(`${this.baseUrl}/auto/turing-machines/simulator`);
      await this.page.waitForSelector('body', { timeout: 10000 });
      
      for (const testCase of testCases) {
        console.log(`  Testing: ${testCase.name}`);
        
        const result = await this.runTMTest(testCase);
        const screenshot = await this.takeScreenshot(`tm_${testCase.name.replace(/\s+/g, '_')}`);
        
        await this.logTest('Turing Machine', 'TM Simulator', testCase, result, screenshot);
        
        await this.page.waitForTimeout(2000);
      }
      
    } catch (error) {
      console.error('❌ Error testing Turing Machine:', error);
      const result = { success: false, issues: [error.message] };
      await this.logTest('Turing Machine', 'TM Simulator', { name: 'Navigation Error' }, result);
    }
  }

  async runTMTest(testCase) {
    const issues = [];
    let success = true;

    try {
      // Set initial tape
      const tapeInput = await this.page.$('[data-testid="tape-input"], input[placeholder*="tape"], input[placeholder*="Tape"]');
      if (tapeInput) {
        await tapeInput.clear();
        await tapeInput.type(testCase.tape);
      }

      // Add transitions
      for (const transition of testCase.transitions) {
        try {
          // Fill transition form
          const stateInput = await this.page.$('[data-testid="state-input"], input[placeholder*="state"]');
          const symbolInput = await this.page.$('[data-testid="symbol-input"], input[placeholder*="symbol"]');
          const newSymbolInput = await this.page.$('[data-testid="new-symbol-input"], input[placeholder*="new symbol"]');
          const directionSelect = await this.page.$('[data-testid="direction-select"], select');
          const newStateInput = await this.page.$('[data-testid="new-state-input"], input[placeholder*="new state"]');

          if (stateInput && symbolInput && newSymbolInput && directionSelect && newStateInput) {
            await stateInput.clear();
            await stateInput.type(transition.state);
            await symbolInput.clear();
            await symbolInput.type(transition.symbol);
            await newSymbolInput.clear();
            await newSymbolInput.type(transition.newSymbol);
            await directionSelect.selectOption(transition.direction);
            await newStateInput.clear();
            await newStateInput.type(transition.newState);

            const addTransitionButton = await this.page.$('[data-testid="add-transition"], button:contains("Add Transition")');
            if (addTransitionButton) {
              await addTransitionButton.click();
              await this.page.waitForTimeout(500);
            }
          }
        } catch (error) {
          issues.push(`Failed to add transition: ${error.message}`);
          success = false;
        }
      }

      // Set start state
      const startStateInput = await this.page.$('[data-testid="start-state"], input[placeholder*="start state"]');
      if (startStateInput) {
        await startStateInput.clear();
        await startStateInput.type(testCase.startState);
      }

      // Run the machine
      const runButton = await this.page.$('[data-testid="run-button"], button:contains("Run"), button:contains("Start")');
      if (runButton) {
        await runButton.click();
        await this.page.waitForTimeout(5000); // Wait for execution

        // Check result
        const resultElement = await this.page.$('[data-testid="tape-result"], .tape-display, .result');
        if (resultElement) {
          const resultText = await resultElement.textContent();
          
          // Simple check - in real implementation, this would be more sophisticated
          if (!resultText.includes(testCase.expectedOutput)) {
            issues.push(`Expected output to contain "${testCase.expectedOutput}" but got "${resultText}"`);
            success = false;
          }
        } else {
          issues.push('No result displayed');
          success = false;
        }
      }

    } catch (error) {
      issues.push(`General TM test error: ${error.message}`);
      success = false;
    }

    return { success, issues };
  }

  async runAllTests() {
    console.log('🚀 Starting comprehensive Automata Theory testing...');
    
    const startTime = Date.now();
    
    try {
      // Test DFA
      await this.testDFA();
      
      // Test Regular Expressions
      await this.testRegularExpressions();
      
      // Test Context-Free Grammar
      await this.testContextFreeGrammar();
      
      // Test Turing Machine
      await this.testTuringMachine();
      
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;
      
      console.log(`\n✅ All tests completed in ${duration} seconds`);
      
      // Generate summary
      await this.generateSummary();
      
    } catch (error) {
      console.error('❌ Error during testing:', error);
    }
  }

  async generateSummary() {
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(r => r.result.success).length;
    const failedTests = totalTests - passedTests;
    
    const summary = {
      timestamp: new Date().toISOString(),
      totalTests,
      passedTests,
      failedTests,
      passRate: ((passedTests / totalTests) * 100).toFixed(2),
      categories: {}
    };

    // Group by category
    this.testResults.forEach(result => {
      if (!summary.categories[result.category]) {
        summary.categories[result.category] = {
          total: 0,
          passed: 0,
          failed: 0,
          algorithms: {}
        };
      }
      
      const category = summary.categories[result.category];
      category.total++;
      
      if (result.result.success) {
        category.passed++;
      } else {
        category.failed++;
      }
      
      if (!category.algorithms[result.algorithm]) {
        category.algorithms[result.algorithm] = {
          total: 0,
          passed: 0,
          failed: 0,
          issues: []
        };
      }
      
      const algorithm = category.algorithms[result.algorithm];
      algorithm.total++;
      
      if (result.result.success) {
        algorithm.passed++;
      } else {
        algorithm.failed++;
        algorithm.issues.push(...(result.result.issues || []));
      }
    });

    // Save summary
    await fs.writeFile('bot-test-summary.json', JSON.stringify(summary, null, 2));
    
    // Print summary
    console.log('\n📊 TEST SUMMARY');
    console.log('='.repeat(50));
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests} (${summary.passRate}%)`);
    console.log(`Failed: ${failedTests}`);
    console.log('\nBy Category:');
    
    Object.entries(summary.categories).forEach(([category, stats]) => {
      console.log(`\n${category}:`);
      console.log(`  Total: ${stats.total}`);
      console.log(`  Passed: ${stats.passed}`);
      console.log(`  Failed: ${stats.failed}`);
      console.log(`  Pass Rate: ${((stats.passed / stats.total) * 100).toFixed(2)}%`);
      
      Object.entries(stats.algorithms).forEach(([algorithm, algStats]) => {
        console.log(`    ${algorithm}: ${algStats.passed}/${algStats.total} passed`);
        if (algStats.issues.length > 0) {
          console.log(`      Issues: ${algStats.issues.slice(0, 3).join(', ')}${algStats.issues.length > 3 ? '...' : ''}`);
        }
      });
    });
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
    console.log('🧹 Bot cleanup completed');
  }
}

// Main execution
async function main() {
  const bot = new AutomataTestingBot();
  
  try {
    await bot.initialize();
    await bot.runAllTests();
  } catch (error) {
    console.error('❌ Bot execution failed:', error);
  } finally {
    await bot.cleanup();
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Bot interrupted by user');
  process.exit(0);
});

// Export for potential use as module
module.exports = AutomataTestingBot;

// Run if called directly
if (require.main === module) {
  main();
}
