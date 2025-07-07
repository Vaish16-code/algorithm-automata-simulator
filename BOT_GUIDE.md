# 🤖 Automata Testing Bot - Quick Start Guide

## Overview
This intelligent bot will crawl your website and test all automata theory algorithms like a real student would. It simulates student behavior including:
- ⏰ Thinking time between actions
- 🔤 Realistic typing speed with occasional typos
- 👀 Page exploration before testing
- 📸 Screenshot documentation
- 📊 Detailed reporting

## Prerequisites
1. Make sure your Next.js app is running on `localhost:3000`
2. Install dependencies: `npm install`

## How to Run

### Option 1: Using npm script (Recommended)
```bash
npm run test-bot
```

### Option 2: Direct execution
```bash
node run-bot.js
```

### Option 3: Headless mode (no browser UI)
```bash
node run-bot.js --headless
```

## What the Bot Tests

### 🔧 DFA (Deterministic Finite Automata)
- **Easy Tests**: Simple single character acceptance
- **Medium Tests**: Even number of 1s, basic patterns
- **Hard Tests**: Complex patterns like "contains 101"

### 📝 Regular Expressions (Coming Soon)
- Basic literal matching
- Kleene star operations
- Union operations
- Complex patterns

### 🎯 Context-Free Grammar (Coming Soon)
- Simple productions
- Balanced parentheses
- a^n b^n patterns

### 🔄 Turing Machines (Coming Soon)
- Basic tape operations
- Binary arithmetic
- String manipulation

## Configuration

Edit `bot-config.json` to customize:

```json
{
  "baseUrl": "http://localhost:3000",
  "testSettings": {
    "slowMo": 1000,
    "headless": false
  },
  "studentBehavior": {
    "thinkingTime": {
      "min": 2000,
      "max": 5000
    },
    "typingSpeed": {
      "min": 50,
      "max": 200
    },
    "errorProbability": 0.1
  }
}
```

## Output Files

The bot generates several output files:

### 📊 Reports
- `bot-reports/test-report-{timestamp}.json` - Complete test report
- `bot-reports/error-report-{timestamp}.json` - Error details (if any)

### 📝 Logs
- `bot-logs/test-results-{timestamp}.json` - Detailed test logs

### 📸 Screenshots
- `bot-screenshots/` - Visual evidence of each test
- `{test-name}_{timestamp}.png` - Test screenshots
- `{test-name}_{timestamp}_context.json` - Screenshot context

## What You'll See

When running the bot, you'll see:

1. **Browser Window Opens** - You can watch the bot navigate your site
2. **Console Output** - Real-time progress and results
3. **Student Behavior** - Bot thinks, types, explores like a real student
4. **Test Results** - Pass/fail status for each test case

### Sample Console Output
```
🎓 Initializing Intelligent Automata Testing Bot...
✅ Configuration loaded successfully
✅ Bot initialized and ready to learn!
🔧 Starting DFA Tests...
📝 Testing: DFA Basic Test (easy)
👀 Student exploring the page...
🤔 Student is reading instructions... (3s)
    ✅ Added state: q0
🤔 Student is adding next state... (2s)
    ✅ Added state: q1
    ✅ Set start state: q0
    ✅ Set accept state: q1
    ✅ Added transition: q0 --a--> q1
    Testing string: "a" (expect: ACCEPT)
      ✅ String "a": ACCEPTED (correct)
    📝 ✅ PASS - Accept single character
```

## Troubleshooting

### Common Issues

**Bot can't find elements:**
- Add `data-testid` attributes to your components
- Check that your pages are accessible at the expected URLs

**Tests fail unexpectedly:**
- Verify your algorithm implementations are correct
- Check console for JavaScript errors
- Look at generated screenshots for visual debugging

**Bot runs too fast/slow:**
- Adjust `slowMo` in `bot-config.json`
- Modify `thinkingTime` for student behavior

### Debugging Tips

1. **Watch the browser** - Don't run headless mode to see what's happening
2. **Check screenshots** - Visual evidence of each test step
3. **Read the logs** - Detailed JSON logs in `bot-logs/`
4. **Look at console output** - Real-time feedback

## Customizing Tests

### Adding New Test Cases

Edit `bot-config.json` to add more test cases:

```json
{
  "testCases": {
    "dfa": {
      "easy": [
        {
          "name": "Your Custom Test",
          "states": ["q0", "q1"],
          "alphabet": ["a", "b"],
          "transitions": [
            {"from": "q0", "symbol": "a", "to": "q1"}
          ],
          "startState": "q0",
          "acceptStates": ["q1"],
          "testStrings": ["a", "b", ""],
          "expectedResults": [true, false, false]
        }
      ]
    }
  }
}
```

### Adding New Algorithms

1. Add the URL to `testSuites` in config
2. Implement test logic in `intelligent-bot.js`
3. Add test cases to configuration

## Understanding Results

### Success Rate
- **90-100%**: Excellent! Your algorithms work correctly
- **70-89%**: Good, but some edge cases may need fixing
- **50-69%**: Several issues found, review recommendations
- **Below 50%**: Major issues, check implementation

### Common Issues
- **Element not found**: Missing data-testid attributes
- **Timeout errors**: Performance issues or missing elements
- **Wrong results**: Algorithm logic errors
- **UI issues**: Responsive design or interaction problems

## Next Steps

1. **Fix identified issues** based on bot recommendations
2. **Add more test cases** for edge cases
3. **Improve UI accessibility** with better data-testid attributes
4. **Run regularly** during development to catch regressions

## Support

If you encounter issues:
1. Check the generated error reports
2. Look at screenshots for visual debugging
3. Verify your website is running correctly
4. Check console for JavaScript errors

Happy testing! 🚀
