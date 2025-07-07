#!/usr/bin/env node

/**
 * Quick Demo Script for Testing Bot
 * 
 * This script runs a simple test to demonstrate how the bot works
 * without needing the full configuration setup.
 */

const puppeteer = require('puppeteer');

async function quickDemo() {
  console.log('🎯 Quick Bot Demo - Testing DFA Page');
  console.log('=====================================');
  console.log('');
  console.log('This demo will:');
  console.log('✅ Open your DFA simulator page');
  console.log('✅ Take a screenshot');
  console.log('✅ Find interactive elements');
  console.log('✅ Simulate basic user interactions');
  console.log('✅ Report what it finds');
  console.log('');

  const browser = await puppeteer.launch({ 
    headless: false, 
    slowMo: 2000,
    args: ['--start-maximized'],
    defaultViewport: null
  });

  const page = await browser.newPage();
  
  try {
    console.log('🌐 Navigating to DFA page...');
    await page.goto('http://localhost:3000/auto/finite-automata/dfa');
    await page.waitForSelector('body', { timeout: 10000 });
    
    console.log('✅ Page loaded successfully!');
    await page.waitForTimeout(2000);
    
    // Take initial screenshot
    await page.screenshot({ path: 'demo-initial.png', fullPage: true });
    console.log('📸 Screenshot saved: demo-initial.png');
    
    // Find input elements
    console.log('');
    console.log('🔍 Scanning for interactive elements...');
    
    // Look for test string input
    const testInputs = await page.$$('input[type="text"], input:not([type]), textarea');
    console.log(`📝 Found ${testInputs.length} text input fields`);
    
    // Look for buttons
    const buttons = await page.$$('button');
    console.log(`🔘 Found ${buttons.length} buttons`);
    
    // Look for the specific input string field
    const inputStringField = await page.$('input[value="101"], input[placeholder*="string"], input[placeholder*="input"]');
    if (inputStringField) {
      console.log('✅ Found input string field!');
      
      // Try to interact with it
      await inputStringField.click();
      await page.waitForTimeout(1000);
      
      // Clear and type new value
      await page.keyboard.down('Control');
      await page.keyboard.press('KeyA');
      await page.keyboard.up('Control');
      await inputStringField.type('110');
      
      console.log('✏️  Changed input string to "110"');
      await page.waitForTimeout(1000);
    } else {
      console.log('⚠️  Could not find input string field');
    }
    
    // Look for simulate/run button
    const runButtons = await page.$$('button');
    let runButtonFound = false;
    
    for (const button of runButtons) {
      const text = await button.textContent();
      if (text && (text.includes('Simulate') || text.includes('Run') || text.includes('Test'))) {
        console.log(`✅ Found potential run button: "${text}"`);
        
        // Try clicking it
        await button.click();
        await page.waitForTimeout(2000);
        
        console.log('🎯 Clicked the button!');
        runButtonFound = true;
        break;
      }
    }
    
    if (!runButtonFound) {
      console.log('⚠️  Could not find a run/simulate button');
    }
    
    // Look for results
    const resultElements = await page.$$('*');
    let resultFound = false;
    
    for (const element of resultElements.slice(0, 50)) { // Check first 50 elements to avoid timeout
      try {
        const text = await element.textContent();
        if (text && (text.includes('Accept') || text.includes('Reject') || text.includes('Result'))) {
          console.log(`📊 Found potential result: "${text.substring(0, 100)}..."`);
          resultFound = true;
          break;
        }
      } catch (error) {
        // Skip elements that can't be accessed
      }
    }
    
    if (!resultFound) {
      console.log('⚠️  Could not find result display');
    }
    
    // Take final screenshot
    await page.screenshot({ path: 'demo-final.png', fullPage: true });
    console.log('📸 Final screenshot saved: demo-final.png');
    
    console.log('');
    console.log('🎉 Demo completed successfully!');
    console.log('');
    console.log('📝 Summary:');
    console.log(`   - Page loaded: ✅`);
    console.log(`   - Input fields found: ${testInputs.length}`);
    console.log(`   - Buttons found: ${buttons.length}`);
    console.log(`   - Input interaction: ${inputStringField ? '✅' : '❌'}`);
    console.log(`   - Run button: ${runButtonFound ? '✅' : '❌'}`);
    console.log(`   - Result detection: ${resultFound ? '✅' : '❌'}`);
    console.log('');
    console.log('💡 Tips for improving bot compatibility:');
    console.log('   1. Add data-testid attributes to key elements');
    console.log('   2. Use consistent naming for buttons (e.g., "Test String")');
    console.log('   3. Ensure result area has identifiable class/id');
    console.log('');
    console.log('🚀 Ready to run the full bot? Use: npm run test-bot');
    
  } catch (error) {
    console.error('❌ Demo failed:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('   1. Make sure your Next.js app is running on localhost:3000');
    console.log('   2. Check that the DFA page exists at /auto/finite-automata/dfa');
    console.log('   3. Verify there are no JavaScript errors in the browser');
  } finally {
    await browser.close();
  }
}

// Run the demo
quickDemo().catch(console.error);
