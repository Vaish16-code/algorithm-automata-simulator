const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

class IntelligentAutomataBot {
  constructor(configPath = './bot-config.json') {
    this.browser = null;
    this.page = null;
    this.config = null;
    this.testResults = [];
    this.currentSession = {
      startTime: Date.now(),
      testsRun: 0,
      errors: 0,
      screenshots: 0
    };
    this.configPath = configPath;
  }

  async initialize() {
    console.log('🎓 Initializing Intelligent Automata Testing Bot...');
    
    // Load configuration
    try {
      const configData = await fs.readFile(this.configPath, 'utf8');
      this.config = JSON.parse(configData);
      console.log('✅ Configuration loaded successfully');
    } catch (error) {
      console.error('❌ Failed to load configuration:', error.message);
      throw new Error('Configuration file is required');
    }

    // Create directories
    await this.createDirectories();

    // Launch browser with student-like settings
    this.browser = await puppeteer.launch({
      headless: this.config.testSettings.headless,
      slowMo: this.config.testSettings.slowMo,
      args: ['--start-maximized'],
      defaultViewport: this.config.testSettings.viewport
    });

    this.page = await this.browser.newPage();
    
    // Set up page monitoring
    this.setupPageMonitoring();
    
    console.log('✅ Bot initialized and ready to learn!');
  }

  async createDirectories() {
    const dirs = ['bot-screenshots', 'bot-reports', 'bot-logs'];
    for (const dir of dirs) {
      try {
        await fs.mkdir(dir, { recursive: true });
      } catch (error) {
        // Directory already exists
      }
    }
  }

  setupPageMonitoring() {
    this.page.on('console', msg => {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] 📄 PAGE: ${msg.text()}`);
    });

    this.page.on('error', err => {
      console.error('❌ PAGE ERROR:', err.message);
      this.currentSession.errors++;
    });

    this.page.on('pageerror', err => {
      console.error('❌ PAGE SCRIPT ERROR:', err.message);
    });
  }

  async studentThink(action = 'thinking') {
    const { min, max } = this.config.studentBehavior.thinkingTime;
    const thinkTime = Math.random() * (max - min) + min;
    console.log(`🤔 Student is ${action}... (${Math.round(thinkTime/1000)}s)`);
    await this.page.waitForTimeout(thinkTime);
  }

  async studentType(element, text, hasErrors = false) {
    if (!element) return;

    const { min, max } = this.config.studentBehavior.typingSpeed;
    const delay = Math.random() * (max - min) + min;
    
    await element.click();
    await this.page.waitForTimeout(300);

    if (hasErrors && Math.random() < this.config.studentBehavior.errorProbability) {
      // Simulate typing error
      const wrongText = text + 'x';
      await element.type(wrongText, { delay });
      await this.page.waitForTimeout(1000);
      
      // Correct the error
      await this.page.keyboard.press('Backspace');
      await this.page.waitForTimeout(500);
    } else {
      await element.type(text, { delay });
    }
  }

  async explorePageLikeStudent() {
    console.log('👀 Student exploring the page...');
    
    // Scroll around like a curious student
    await this.page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight / 3);
    });
    await this.page.waitForTimeout(1000);
    
    await this.page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight / 2);
    });
    await this.page.waitForTimeout(1000);
    
    await this.page.evaluate(() => {
      window.scrollTo(0, 0);
    });
    await this.page.waitForTimeout(500);
  }

  async takeScreenshotWithContext(name, context = {}) {
    if (!this.config.reporting.generateScreenshots) return null;

    const timestamp = Date.now();
    const filename = `${name}_${timestamp}.png`;
    const filepath = path.join('bot-screenshots', filename);
    
    await this.page.screenshot({ 
      path: filepath, 
      fullPage: true,
      type: 'png'
    });
    
    this.currentSession.screenshots++;
    
    // Save context information
    const contextFile = path.join('bot-screenshots', `${name}_${timestamp}_context.json`);
    await fs.writeFile(contextFile, JSON.stringify({
      timestamp: new Date().toISOString(),
      url: this.page.url(),
      context,
      viewport: await this.page.viewport()
    }, null, 2));

    return filename;
  }

  async runDFATests() {
    console.log('🔧 Starting DFA Tests...');
    
    const dfaTests = this.config.testSuites.finiteAutomata.tests.filter(t => 
      t.url.includes('/dfa') && this.config.testSuites.finiteAutomata.enabled
    );

    for (const test of dfaTests) {
      await this.runDFATest(test);
    }
  }

  async runDFATest(testConfig) {
    console.log(`📝 Testing: ${testConfig.name} (${testConfig.difficulty})`);
    
    try {
      await this.page.goto(this.config.baseUrl + testConfig.url);
      await this.page.waitForSelector('body', { timeout: this.config.testSettings.timeout });
      
      // Student behavior: explore the page first
      await this.explorePageLikeStudent();
      
      const testCases = this.config.testCases.dfa[testConfig.difficulty] || [];
      
      for (const testCase of testCases) {
        console.log(`  🎯 Running test case: ${testCase.name}`);
        
        const result = await this.executeDFATestCase(testCase, testConfig);
        
        await this.logTestResult('DFA', testConfig.name, testCase, result);
        
        // Student behavior: think between tests
        await this.studentThink('analyzing results');
      }
      
    } catch (error) {
      console.error(`❌ Error in DFA test ${testConfig.name}:`, error.message);
      
      const result = {
        success: false,
        issues: [error.message],
        timestamp: new Date().toISOString(),
        screenshot: await this.takeScreenshotWithContext('error_dfa', { error: error.message })
      };
      
      await this.logTestResult('DFA', testConfig.name, { name: 'Error Case' }, result);
    }
  }

  async executeDFATestCase(testCase, testConfig) {
    const issues = [];
    let success = true;
    const startTime = Date.now();

    try {
      // Take initial screenshot
      const initialScreenshot = await this.takeScreenshotWithContext('dfa_initial', { 
        testCase: testCase.name,
        difficulty: testConfig.difficulty 
      });

      // Student behavior: read instructions first
      await this.studentThink('reading instructions');

      // Clear any existing automaton
      await this.clearAutomaton();

      // Add states with student-like behavior
      for (const state of testCase.states) {
        const stateAdded = await this.addState(state);
        if (!stateAdded) {
          issues.push(`Failed to add state: ${state}`);
          success = false;
        }
        await this.studentThink('adding next state');
      }

      // Set start state
      const startStateSet = await this.setStartState(testCase.startState);
      if (!startStateSet) {
        issues.push(`Failed to set start state: ${testCase.startState}`);
        success = false;
      }

      // Set accept states
      for (const acceptState of testCase.acceptStates) {
        const acceptStateSet = await this.setAcceptState(acceptState);
        if (!acceptStateSet) {
          issues.push(`Failed to set accept state: ${acceptState}`);
          success = false;
        }
      }

      // Add transitions
      for (const transition of testCase.transitions) {
        const transitionAdded = await this.addTransition(transition);
        if (!transitionAdded) {
          issues.push(`Failed to add transition: ${transition.from} --${transition.symbol}--> ${transition.to}`);
          success = false;
        }
        await this.studentThink('adding transition');
      }

      // Take screenshot after setup
      const setupScreenshot = await this.takeScreenshotWithContext('dfa_setup', { 
        testCase: testCase.name,
        statesAdded: testCase.states.length,
        transitionsAdded: testCase.transitions.length 
      });

      // Test strings with student-like behavior
      for (let i = 0; i < testCase.testStrings.length; i++) {
        const testString = testCase.testStrings[i];
        const expectedResult = testCase.expectedResults[i];
        
        console.log(`    Testing string: "${testString}" (expect: ${expectedResult ? 'ACCEPT' : 'REJECT'})`);
        
        const stringResult = await this.testString(testString, expectedResult);
        if (!stringResult.success) {
          issues.push(...stringResult.issues);
          success = false;
        }
        
        // Student behavior: think about result
        await this.studentThink('analyzing result');
      }

      // Take final screenshot
      const finalScreenshot = await this.takeScreenshotWithContext('dfa_complete', { 
        testCase: testCase.name,
        success,
        issuesCount: issues.length 
      });

      const endTime = Date.now();
      const duration = endTime - startTime;

      return {
        success,
        issues,
        timestamp: new Date().toISOString(),
        duration,
        screenshots: {
          initial: initialScreenshot,
          setup: setupScreenshot,
          final: finalScreenshot
        },
        metrics: {
          statesAdded: testCase.states.length,
          transitionsAdded: testCase.transitions.length,
          stringsTest: testCase.testStrings.length
        }
      };

    } catch (error) {
      issues.push(`Execution error: ${error.message}`);
      success = false;

      const errorScreenshot = await this.takeScreenshotWithContext('dfa_error', { 
        error: error.message,
        testCase: testCase.name 
      });

      return {
        success: false,
        issues,
        timestamp: new Date().toISOString(),
        screenshot: errorScreenshot,
        error: error.message
      };
    }
  }

  async clearAutomaton() {
    const selectors = [
      '[data-testid="clear-button"]',
      '[data-testid="reset-button"]',
      'button:has-text("Clear")',
      'button:has-text("Reset")',
      'button[title*="clear"]',
      'button[title*="reset"]'
    ];

    for (const selector of selectors) {
      try {
        const element = await this.page.$(selector);
        if (element) {
          await element.click();
          await this.page.waitForTimeout(1000);
          console.log('    ✅ Cleared automaton');
          return true;
        }
      } catch (error) {
        // Continue to next selector
      }
    }

    console.log('    ⚠️  Could not find clear button');
    return false;
  }

  async addState(stateName) {
    const selectors = [
      '[data-testid="add-state-button"]',
      '[data-testid="new-state-button"]',
      'button:has-text("Add State")',
      'button:has-text("New State")',
      'button[title*="add state"]'
    ];

    for (const selector of selectors) {
      try {
        const button = await this.page.$(selector);
        if (button) {
          await button.click();
          await this.page.waitForTimeout(500);
          
          // Find input field for state name
          const inputSelectors = [
            '[data-testid="state-name-input"]',
            '[data-testid="state-input"]',
            'input[placeholder*="state"]',
            'input[placeholder*="State"]',
            'input[name*="state"]'
          ];

          for (const inputSelector of inputSelectors) {
            const input = await this.page.$(inputSelector);
            if (input) {
              await this.studentType(input, stateName, true);
              
              // Look for confirm button
              const confirmSelectors = [
                '[data-testid="confirm-state"]',
                'button:has-text("Add")',
                'button:has-text("Confirm")',
                'button:has-text("OK")',
                'button[type="submit"]'
              ];

              for (const confirmSelector of confirmSelectors) {
                const confirmButton = await this.page.$(confirmSelector);
                if (confirmButton) {
                  await confirmButton.click();
                  await this.page.waitForTimeout(500);
                  console.log(`    ✅ Added state: ${stateName}`);
                  return true;
                }
              }
              
              // Try pressing Enter
              await this.page.keyboard.press('Enter');
              await this.page.waitForTimeout(500);
              console.log(`    ✅ Added state: ${stateName} (via Enter)`);
              return true;
            }
          }
        }
      } catch (error) {
        // Continue to next selector
      }
    }

    console.log(`    ❌ Could not add state: ${stateName}`);
    return false;
  }

  async setStartState(stateName) {
    const selectors = [
      '[data-testid="start-state-select"]',
      '[data-testid="start-state"]',
      'select[name*="start"]',
      'select[name*="initial"]',
      `option[value="${stateName}"]`,
      `input[value="${stateName}"][type="radio"]`
    ];

    for (const selector of selectors) {
      try {
        const element = await this.page.$(selector);
        if (element) {
          const tagName = await element.evaluate(el => el.tagName.toLowerCase());
          
          if (tagName === 'select') {
            await element.selectOption(stateName);
          } else if (tagName === 'input') {
            await element.click();
          } else {
            await element.click();
          }
          
          await this.page.waitForTimeout(500);
          console.log(`    ✅ Set start state: ${stateName}`);
          return true;
        }
      } catch (error) {
        // Continue to next selector
      }
    }

    console.log(`    ❌ Could not set start state: ${stateName}`);
    return false;
  }

  async setAcceptState(stateName) {
    const selectors = [
      `[data-testid="accept-${stateName}"]`,
      `[data-testid="final-${stateName}"]`,
      `input[value="${stateName}"][type="checkbox"]`,
      `label:has-text("${stateName}") input[type="checkbox"]`,
      `*:has-text("${stateName}") input[type="checkbox"]`
    ];

    for (const selector of selectors) {
      try {
        const element = await this.page.$(selector);
        if (element) {
          await element.check();
          await this.page.waitForTimeout(500);
          console.log(`    ✅ Set accept state: ${stateName}`);
          return true;
        }
      } catch (error) {
        // Continue to next selector
      }
    }

    console.log(`    ❌ Could not set accept state: ${stateName}`);
    return false;
  }

  async addTransition(transition) {
    const { from, symbol, to } = transition;
    
    try {
      // Find transition input fields
      const fromInput = await this.findTransitionInput('from');
      const symbolInput = await this.findTransitionInput('symbol');
      const toInput = await this.findTransitionInput('to');

      if (fromInput && symbolInput && toInput) {
        await this.studentType(fromInput, from, true);
        await this.studentType(symbolInput, symbol, true);
        await this.studentType(toInput, to, true);

        // Find add button
        const addButton = await this.findAddTransitionButton();
        if (addButton) {
          await addButton.click();
          await this.page.waitForTimeout(500);
          console.log(`    ✅ Added transition: ${from} --${symbol}--> ${to}`);
          return true;
        }
      }
    } catch (error) {
      console.log(`    ❌ Error adding transition: ${error.message}`);
    }

    console.log(`    ❌ Could not add transition: ${from} --${symbol}--> ${to}`);
    return false;
  }

  async findTransitionInput(type) {
    const selectors = [
      `[data-testid="${type}-state-input"]`,
      `[data-testid="${type}-input"]`,
      `input[placeholder*="${type}"]`,
      `input[name*="${type}"]`,
      `select[name*="${type}"]`
    ];

    for (const selector of selectors) {
      try {
        const element = await this.page.$(selector);
        if (element) return element;
      } catch (error) {
        // Continue
      }
    }
    return null;
  }

  async findAddTransitionButton() {
    const selectors = [
      '[data-testid="add-transition-button"]',
      '[data-testid="add-transition"]',
      'button:has-text("Add Transition")',
      'button:has-text("Add")',
      'button[title*="add transition"]'
    ];

    for (const selector of selectors) {
      try {
        const element = await this.page.$(selector);
        if (element) return element;
      } catch (error) {
        // Continue
      }
    }
    return null;
  }

  async testString(testString, expectedResult) {
    const issues = [];
    
    try {
      // Find test input field
      const testInput = await this.findTestStringInput();
      if (!testInput) {
        issues.push('Could not find test string input field');
        return { success: false, issues };
      }

      // Clear and type test string
      await testInput.click();
      await this.page.keyboard.down('Control');
      await this.page.keyboard.press('KeyA');
      await this.page.keyboard.up('Control');
      await this.page.keyboard.press('Delete');
      
      if (testString) {
        await this.studentType(testInput, testString, true);
      }

      // Find and click test button
      const testButton = await this.findTestButton();
      if (!testButton) {
        issues.push('Could not find test button');
        return { success: false, issues };
      }

      await testButton.click();
      await this.page.waitForTimeout(2000);

      // Get result
      const result = await this.getTestResult();
      if (result === null) {
        issues.push('Could not get test result');
        return { success: false, issues };
      }

      const isAccepted = result.toLowerCase().includes('accept') || 
                        result.toLowerCase().includes('yes') ||
                        result.toLowerCase().includes('true');

      if (isAccepted !== expectedResult) {
        issues.push(`String "${testString}" expected ${expectedResult ? 'ACCEPT' : 'REJECT'} but got ${isAccepted ? 'ACCEPT' : 'REJECT'} (result: "${result}")`);
        return { success: false, issues };
      }

      console.log(`      ✅ String "${testString}": ${isAccepted ? 'ACCEPTED' : 'REJECTED'} (correct)`);
      return { success: true, issues: [] };

    } catch (error) {
      issues.push(`Error testing string "${testString}": ${error.message}`);
      return { success: false, issues };
    }
  }

  async findTestStringInput() {
    const selectors = [
      '[data-testid="test-string-input"]',
      '[data-testid="input-string"]',
      'input[placeholder*="test"]',
      'input[placeholder*="string"]',
      'input[placeholder*="input"]',
      'textarea[placeholder*="test"]'
    ];

    for (const selector of selectors) {
      try {
        const element = await this.page.$(selector);
        if (element) return element;
      } catch (error) {
        // Continue
      }
    }
    return null;
  }

  async findTestButton() {
    const selectors = [
      '[data-testid="test-button"]',
      '[data-testid="run-button"]',
      'button:has-text("Test")',
      'button:has-text("Run")',
      'button:has-text("Check")',
      'button:has-text("Execute")',
      'button[title*="test"]',
      'button[title*="run"]'
    ];

    for (const selector of selectors) {
      try {
        const element = await this.page.$(selector);
        if (element) return element;
      } catch (error) {
        // Continue
      }
    }
    return null;
  }

  async getTestResult() {
    const selectors = [
      '[data-testid="result"]',
      '[data-testid="output"]',
      '.result',
      '.output',
      '.test-result',
      '[class*="result"]',
      '[class*="output"]'
    ];

    for (const selector of selectors) {
      try {
        const element = await this.page.$(selector);
        if (element) {
          const text = await element.textContent();
          if (text && text.trim()) {
            return text.trim();
          }
        }
      } catch (error) {
        // Continue
      }
    }
    
    // Try to find any text that looks like a result
    try {
      const possibleResults = await this.page.$$eval('*', elements => {
        return elements
          .map(el => el.textContent || '')
          .filter(text => text.match(/(accept|reject|yes|no|true|false|valid|invalid)/i))
          .filter(text => text.length < 100); // Avoid long paragraphs
      });
      
      if (possibleResults.length > 0) {
        return possibleResults[0];
      }
    } catch (error) {
      // Continue
    }
    
    return null;
  }

  async logTestResult(category, algorithmName, testCase, result) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      sessionId: this.currentSession.startTime,
      category,
      algorithm: algorithmName,
      testCase: testCase.name,
      difficulty: testCase.difficulty || 'unknown',
      result,
      url: this.page.url(),
      studentBehavior: {
        sessionTime: Date.now() - this.currentSession.startTime,
        testsRun: this.currentSession.testsRun++,
        errorsEncountered: this.currentSession.errors
      }
    };

    this.testResults.push(logEntry);

    // Save to file
    const logFile = `bot-logs/test-results-${this.currentSession.startTime}.json`;
    await fs.writeFile(logFile, JSON.stringify(this.testResults, null, 2));

    // Console output
    const status = result.success ? '✅ PASS' : '❌ FAIL';
    console.log(`    📝 ${status} - ${testCase.name}`);
    
    if (result.issues && result.issues.length > 0) {
      result.issues.forEach(issue => {
        console.log(`      🔍 Issue: ${issue}`);
      });
    }
  }

  async runAllTests() {
    console.log('🚀 Starting Comprehensive Automata Testing Session');
    console.log('Student Bot is ready to learn and test algorithms!');
    console.log('='.repeat(60));

    const startTime = Date.now();

    try {
      // Test DFA algorithms
      if (this.config.testSuites.finiteAutomata.enabled) {
        await this.runDFATests();
      }

      // Additional test suites can be added here
      // await this.runNFATests();
      // await this.runRegexTests();
      // await this.runCFGTests();
      // await this.runTMTests();

      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;

      console.log('='.repeat(60));
      console.log(`✅ Testing session completed in ${duration} seconds`);
      
      await this.generateReport();

    } catch (error) {
      console.error('❌ Testing session failed:', error);
      
      const errorReport = {
        error: error.message,
        timestamp: new Date().toISOString(),
        sessionDuration: Date.now() - startTime,
        testsCompleted: this.currentSession.testsRun,
        screenshot: await this.takeScreenshotWithContext('session_error', { error: error.message })
      };

      await fs.writeFile(`bot-reports/error-report-${this.currentSession.startTime}.json`, 
                        JSON.stringify(errorReport, null, 2));
    }
  }

  async generateReport() {
    const sessionDuration = Date.now() - this.currentSession.startTime;
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(r => r.result.success).length;
    const failedTests = totalTests - passedTests;

    const report = {
      summary: {
        sessionId: this.currentSession.startTime,
        timestamp: new Date().toISOString(),
        duration: sessionDuration,
        totalTests,
        passedTests,
        failedTests,
        successRate: totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(2) : 0,
        screenshotsTaken: this.currentSession.screenshots
      },
      studentBehavior: {
        averageThinkTime: this.config.studentBehavior.thinkingTime,
        errorsSimulated: this.currentSession.errors,
        explorationTime: this.config.studentBehavior.explorationTime
      },
      categories: {},
      detailedResults: this.testResults,
      issues: this.testResults
        .filter(r => !r.result.success)
        .map(r => ({
          category: r.category,
          algorithm: r.algorithm,
          testCase: r.testCase,
          issues: r.result.issues || []
        })),
      recommendations: this.generateRecommendations()
    };

    // Group by category
    this.testResults.forEach(result => {
      const category = result.category;
      if (!report.categories[category]) {
        report.categories[category] = {
          total: 0,
          passed: 0,
          failed: 0,
          algorithms: {}
        };
      }

      report.categories[category].total++;
      if (result.result.success) {
        report.categories[category].passed++;
      } else {
        report.categories[category].failed++;
      }

      const algorithm = result.algorithm;
      if (!report.categories[category].algorithms[algorithm]) {
        report.categories[category].algorithms[algorithm] = {
          total: 0,
          passed: 0,
          failed: 0,
          issues: []
        };
      }

      const alg = report.categories[category].algorithms[algorithm];
      alg.total++;
      if (result.result.success) {
        alg.passed++;
      } else {
        alg.failed++;
        alg.issues.push(...(result.result.issues || []));
      }
    });

    // Save report
    const reportFile = `bot-reports/test-report-${this.currentSession.startTime}.json`;
    await fs.writeFile(reportFile, JSON.stringify(report, null, 2));

    // Print summary
    this.printReportSummary(report);

    return report;
  }

  generateRecommendations() {
    const recommendations = [];
    const failedTests = this.testResults.filter(r => !r.result.success);

    if (failedTests.length === 0) {
      recommendations.push('🎉 All tests passed! Your automata implementations are working correctly.');
      return recommendations;
    }

    // Common issues analysis
    const commonIssues = {};
    failedTests.forEach(test => {
      test.result.issues?.forEach(issue => {
        commonIssues[issue] = (commonIssues[issue] || 0) + 1;
      });
    });

    const sortedIssues = Object.entries(commonIssues)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    recommendations.push('🔧 Most common issues found:');
    sortedIssues.forEach(([issue, count]) => {
      recommendations.push(`   • ${issue} (occurred ${count} times)`);
    });

    // Specific recommendations
    if (failedTests.some(t => t.result.issues?.some(i => i.includes('find') || i.includes('selector')))) {
      recommendations.push('💡 Consider adding more data-testid attributes to your components for better testing');
    }

    if (failedTests.some(t => t.result.issues?.some(i => i.includes('timeout')))) {
      recommendations.push('⚡ Some operations are taking too long - consider optimizing performance');
    }

    if (failedTests.some(t => t.category === 'DFA' && t.result.issues?.some(i => i.includes('transition')))) {
      recommendations.push('🔗 DFA transition logic may need review - check state management');
    }

    return recommendations;
  }

  printReportSummary(report) {
    console.log('\n📊 FINAL TEST REPORT');
    console.log('='.repeat(60));
    console.log(`Session Duration: ${Math.round(report.summary.duration / 1000)} seconds`);
    console.log(`Total Tests: ${report.summary.totalTests}`);
    console.log(`Passed: ${report.summary.passedTests} (${report.summary.successRate}%)`);
    console.log(`Failed: ${report.summary.failedTests}`);
    console.log(`Screenshots: ${report.summary.screenshotsTaken}`);
    
    console.log('\nBy Category:');
    Object.entries(report.categories).forEach(([category, stats]) => {
      console.log(`  ${category}: ${stats.passed}/${stats.total} passed`);
      Object.entries(stats.algorithms).forEach(([algorithm, algStats]) => {
        const status = algStats.failed === 0 ? '✅' : '❌';
        console.log(`    ${status} ${algorithm}: ${algStats.passed}/${algStats.total}`);
      });
    });

    if (report.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      report.recommendations.forEach(rec => console.log(`  ${rec}`));
    }

    console.log(`\n📁 Detailed reports saved in bot-reports/`);
    console.log(`📷 Screenshots saved in bot-screenshots/`);
    console.log('='.repeat(60));
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
    console.log('🧹 Student bot session ended. Thanks for learning with me!');
  }
}

module.exports = IntelligentAutomataBot;
