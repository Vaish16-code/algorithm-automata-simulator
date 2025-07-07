#!/usr/bin/env node

/**
 * Automata Testing Bot Runner
 * 
 * This script runs the testing bot that will crawl your website
 * and test all automata theory algorithms like a student would.
 * 
 * Usage:
 *   npm run test-bot
 *   node run-bot.js
 *   node run-bot.js --headless (to run without UI)
 */

const IntelligentAutomataBot = require('./intelligent-bot');

async function runBot() {
  console.log('🎓 Automata Theory Algorithm Testing Bot');
  console.log('=========================================');
  console.log('');
  console.log('This bot will:');
  console.log('✅ Test DFA simulators with various test cases');
  console.log('✅ Test Regular Expression matchers');
  console.log('✅ Test Context-Free Grammar parsers');
  console.log('✅ Test Turing Machine simulators');
  console.log('✅ Generate detailed reports with screenshots');
  console.log('✅ Identify bugs and issues automatically');
  console.log('');
  console.log('📝 Results will be saved to:');
  console.log('   - bot-test-results.json (detailed logs)');
  console.log('   - bot-test-summary.json (summary report)');
  console.log('   - bot-screenshots/ (visual evidence)');
  console.log('');
  console.log('🌐 Make sure your Next.js app is running on localhost:3000');
  console.log('');

  // Check if user wants to proceed
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const shouldProceed = await new Promise((resolve) => {
    rl.question('Ready to start testing? (y/n): ', (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });

  if (!shouldProceed) {
    console.log('👋 Bot testing cancelled. Run again when ready!');
    return;
  }

  const bot = new IntelligentAutomataBot();
  
  // Check for headless mode
  if (process.argv.includes('--headless')) {
    console.log('🤖 Running in headless mode (no browser UI)');
    bot.headless = true;
  }

  try {
    await bot.initialize();
    await bot.runAllTests();
    
    console.log('');
    console.log('🎉 Testing completed successfully!');
    console.log('📊 Check the generated reports for detailed results.');
    
  } catch (error) {
    console.error('❌ Bot execution failed:', error);
    console.log('');
    console.log('🔧 Troubleshooting tips:');
    console.log('   1. Make sure your Next.js app is running on localhost:3000');
    console.log('   2. Ensure all automata pages are accessible');
    console.log('   3. Check that your components have proper data-testid attributes');
    console.log('   4. Run with --headless flag if you have display issues');
  } finally {
    await bot.cleanup();
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Bot interrupted by user');
  process.exit(0);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Run the bot
if (require.main === module) {
  runBot().catch(console.error);
}

module.exports = runBot;
