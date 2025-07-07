#!/usr/bin/env node

/**
 * Simple Automata Testing Bot
 * 
 * A student-like bot that tests your DFA simulator
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;

class SimpleAutomataBot {
  constructor() {
    this.results = [];
    this.screenshots = [];
  }

  async runTest() {
    console.log('🎓 Starting Automata Student Bot');
    console.log('================================');
    console.log('');
    console.log('The bot will:');
    console.log('• Navigate to your DFA simulator');
    console.log('• Test different input strings');
    console.log('• Take screenshots of results');
    console.log('• Generate a report');
    console.log('');
    console.log('💻 Browser will open - watch the bot in action!');
    console.log('');

    const browser = await puppeteer.launch({
      headless: false,
      slowMo: 1500, // Slow down to see actions
      args: ['--start-maximized'],
      defaultViewport: null
    });

    const page = await browser.newPage();

    try {
      // Navigate to DFA page
      console.log('🌐 Loading DFA simulator...');
      await page.goto('http://localhost:3000/auto/finite-automata/dfa');
      await page.waitForSelector('body', { timeout: 10000 });
      console.log('✅ Page loaded!');

      // Wait and explore like a student
      await this.studentPause('Reading the page', 3000);
      await page.screenshot({ path: 'bot-dfa-initial.png', fullPage: true });
      this.screenshots.push('bot-dfa-initial.png');

      // Test different strings
      const testStrings = ['101', '110', '1', '0', '', '1010', '1111'];
      
      for (const testString of testStrings) {
        console.log(`🧪 Testing string: "${testString || 'empty'}"`);
        
        const result = await this.testString(page, testString);
        this.results.push({
          input: testString,
          ...result,
          timestamp: new Date().toISOString()
        });

        await this.studentPause('Thinking about result', 2000);
      }

      // Generate report
      await this.generateReport();

      console.log('');
      console.log('🎉 Testing completed!');
      console.log('📊 Check bot-report.json for detailed results');
      console.log('📸 Screenshots saved as bot-dfa-*.png');

    } catch (error) {
      console.error('❌ Test failed:', error.message);
      
      // Save error screenshot
      try {
        await page.screenshot({ path: 'bot-error.png', fullPage: true });
        console.log('📸 Error screenshot saved: bot-error.png');
      } catch (e) {
        // Ignore screenshot error
      }
    } finally {
      await browser.close();
    }
  }

  async studentPause(action, duration) {
    console.log(`🤔 Bot is ${action}... (${duration/1000}s)`);
    await new Promise(resolve => setTimeout(resolve, duration));
  }

  async testString(page, testString) {
    try {
      // Find and clear input field
      const inputField = await page.$('[data-testid="test-string-input"]') || 
                        await page.$('input[placeholder*="test"]') ||
                        await page.$('input[placeholder*="string"]');

      if (!inputField) {
        return { success: false, error: 'Could not find input field' };
      }

      // Clear and type new string
      await inputField.click();
      await page.keyboard.down('Control');
      await page.keyboard.press('KeyA');
      await page.keyboard.up('Control');
      
      if (testString) {
        await inputField.type(testString, { delay: 100 });
      }

      // Find and click simulate button
      const simulateButton = await page.$('[data-testid="simulate-button"]') ||
                           await page.$('button:has-text("Simulate")') ||
                           await page.$('button:has-text("Test")') ||
                           await page.$('button:has-text("Run")');

      if (!simulateButton) {
        return { success: false, error: 'Could not find simulate button' };
      }

      await simulateButton.click();
      await page.waitForTimeout(2000);

      // Take screenshot
      const screenshotName = `bot-dfa-test-${testString || 'empty'}-${Date.now()}.png`;
      await page.screenshot({ path: screenshotName, fullPage: true });
      this.screenshots.push(screenshotName);

      // Try to get result
      const result = await this.getResult(page);
      
      return {
        success: true,
        result: result.text,
        accepted: result.accepted,
        screenshot: screenshotName
      };

    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getResult(page) {
    // Try multiple ways to find the result
    const selectors = [
      '[data-testid="result-section"]',
      '[data-testid="result"]',
      '.exam-result',
      '*:contains("ACCEPTED")',
      '*:contains("REJECTED")',
      '*:contains("Accept")',
      '*:contains("Reject")'
    ];

    for (const selector of selectors) {
      try {
        const element = await page.$(selector);
        if (element) {
          const text = await element.textContent();
          if (text && text.trim()) {
            const accepted = text.toLowerCase().includes('accept');
            return {
              text: text.trim().substring(0, 200), // Limit text length
              accepted
            };
          }
        }
      } catch (error) {
        // Continue to next selector
      }
    }

    // Fallback: look for any text containing accept/reject
    try {
      const allText = await page.evaluate(() => document.body.innerText);
      const lines = allText.split('\n');
      
      for (const line of lines) {
        if (line.toLowerCase().includes('accept') || line.toLowerCase().includes('reject')) {
          return {
            text: line.trim(),
            accepted: line.toLowerCase().includes('accept')
          };
        }
      }
    } catch (error) {
      // Continue
    }

    return { text: 'No result found', accepted: null };
  }

  async generateReport() {
    const totalTests = this.results.length;
    const successfulTests = this.results.filter(r => r.success).length;
    const acceptedStrings = this.results.filter(r => r.accepted === true);
    const rejectedStrings = this.results.filter(r => r.accepted === false);

    const report = {
      summary: {
        timestamp: new Date().toISOString(),
        totalTests,
        successfulTests,
        failedTests: totalTests - successfulTests,
        successRate: `${((successfulTests / totalTests) * 100).toFixed(1)}%`,
        acceptedStrings: acceptedStrings.length,
        rejectedStrings: rejectedStrings.length
      },
      testResults: this.results,
      screenshots: this.screenshots,
      analysis: {
        workingCorrectly: successfulTests === totalTests,
        commonIssues: this.results
          .filter(r => !r.success)
          .map(r => r.error)
          .filter((error, index, arr) => arr.indexOf(error) === index), // Unique errors
        recommendations: this.generateRecommendations()
      }
    };

    await fs.writeFile('bot-report.json', JSON.stringify(report, null, 2));
    
    // Console summary
    console.log('');
    console.log('📊 TEST SUMMARY');
    console.log('===============');
    console.log(`Total tests: ${totalTests}`);
    console.log(`Successful: ${successfulTests} (${report.summary.successRate})`);
    console.log(`Failed: ${totalTests - successfulTests}`);
    console.log(`Strings accepted: ${acceptedStrings.length}`);
    console.log(`Strings rejected: ${rejectedStrings.length}`);
    
    if (acceptedStrings.length > 0) {
      console.log('✅ Accepted strings:', acceptedStrings.map(r => r.input || 'empty').join(', '));
    }
    
    if (rejectedStrings.length > 0) {
      console.log('❌ Rejected strings:', rejectedStrings.map(r => r.input || 'empty').join(', '));
    }

    if (report.analysis.commonIssues.length > 0) {
      console.log('');
      console.log('🔧 Issues found:');
      report.analysis.commonIssues.forEach(issue => console.log(`  • ${issue}`));
    }

    console.log('');
    console.log('💡 Recommendations:');
    report.analysis.recommendations.forEach(rec => console.log(`  • ${rec}`));
  }

  generateRecommendations() {
    const recommendations = [];
    const failedTests = this.results.filter(r => !r.success);
    
    if (failedTests.length === 0) {
      recommendations.push('Great! All tests passed successfully');
      recommendations.push('Your DFA simulator is working correctly');
    } else {
      if (failedTests.some(t => t.error?.includes('input field'))) {
        recommendations.push('Add data-testid="test-string-input" to your input field');
      }
      
      if (failedTests.some(t => t.error?.includes('simulate button'))) {
        recommendations.push('Add data-testid="simulate-button" to your simulate button');
      }
      
      if (failedTests.some(t => t.error?.includes('result'))) {
        recommendations.push('Add data-testid="result-section" to your result display');
      }
      
      recommendations.push('Check browser console for JavaScript errors');
    }

    // Logic analysis
    const accepted = this.results.filter(r => r.accepted === true);
    const rejected = this.results.filter(r => r.accepted === false);
    
    if (accepted.length === 0 && rejected.length === 0) {
      recommendations.push('Unable to determine DFA logic - check result display');
    } else if (accepted.length === 0) {
      recommendations.push('DFA rejects all strings - check if this is expected');
    } else if (rejected.length === 0) {
      recommendations.push('DFA accepts all strings - check if this is expected');
    } else {
      recommendations.push('DFA shows mixed results - this looks normal');
    }

    return recommendations;
  }
}

// Check if Next.js is running
async function checkServer() {
  try {
    const response = await fetch('http://localhost:3000');
    return response.ok;
  } catch (error) {
    return false;
  }
}

// Main execution
async function main() {
  console.log('🚀 Automata Testing Bot v1.0');
  console.log('');
  
  // Check if server is running
  console.log('🔍 Checking if Next.js server is running...');
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.log('❌ Next.js server not found on localhost:3000');
    console.log('');
    console.log('🔧 Please start your Next.js app first:');
    console.log('   npm run dev');
    console.log('');
    console.log('Then run the bot again:');
    console.log('   node simple-bot.js');
    return;
  }
  
  console.log('✅ Server is running!');
  console.log('');

  const bot = new SimpleAutomataBot();
  await bot.runTest();
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Bot stopped by user');
  process.exit(0);
});

// Run the bot
main().catch(console.error);
