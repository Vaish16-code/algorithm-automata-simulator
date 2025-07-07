// Test the improved knapsack algorithm
function knapsackDP(capacity, weights, values) {
  const n = weights.length;
  const dp = Array(n + 1).fill(null).map(() => Array(capacity + 1).fill(0));
  const steps = [];
  
  steps.push("Step 1: Initialize DP table dp[0...n][0...capacity] with zeros");
  steps.push("Base case: dp[0][w] = 0 for all w (no items means zero value)");
  steps.push("Base case: dp[i][0] = 0 for all i (zero capacity means zero value)");
  steps.push("");
  
  // Fill the DP table
  for (let i = 1; i <= n; i++) {
    steps.push(`Processing Item ${i} (weight=${weights[i - 1]}, value=${values[i - 1]}):`);
    
    for (let w = 1; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        const include = values[i - 1] + dp[i - 1][w - weights[i - 1]];
        const exclude = dp[i - 1][w];
        
        dp[i][w] = Math.max(include, exclude);
        
        if (include > exclude) {
          steps.push(`  dp[${i}][${w}]: Include item ${i} → ${values[i - 1]} + dp[${i-1}][${w - weights[i - 1]}] = ${values[i - 1]} + ${dp[i - 1][w - weights[i - 1]]} = ${include} > ${exclude} (exclude)`);
          steps.push(`  Decision: INCLUDE item ${i}, dp[${i}][${w}] = ${dp[i][w]}`);
        } else if (include < exclude) {
          steps.push(`  dp[${i}][${w}]: Include item ${i} → ${values[i - 1]} + dp[${i-1}][${w - weights[i - 1]}] = ${values[i - 1]} + ${dp[i - 1][w - weights[i - 1]]} = ${include} < ${exclude} (exclude)`);
          steps.push(`  Decision: EXCLUDE item ${i}, dp[${i}][${w}] = ${dp[i][w]}`);
        } else {
          steps.push(`  dp[${i}][${w}]: Include item ${i} → ${values[i - 1]} + dp[${i-1}][${w - weights[i - 1]}] = ${values[i - 1]} + ${dp[i - 1][w - weights[i - 1]]} = ${include} = ${exclude} (exclude)`);
          steps.push(`  Decision: Either choice works, choose EXCLUDE, dp[${i}][${w}] = ${dp[i][w]}`);
        }
      } else {
        dp[i][w] = dp[i - 1][w];
        steps.push(`  dp[${i}][${w}]: Item ${i} too heavy (${weights[i - 1]} > ${w}), copy previous: dp[${i}][${w}] = dp[${i-1}][${w}] = ${dp[i][w]}`);
      }
    }
    steps.push("");
  }
  
  // Backtrack to find selected items
  steps.push("Backtracking to find selected items:");
  const selectedItems = [];
  let w = capacity;
  let backtrackSteps = [];
  
  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      selectedItems.unshift({
        index: i,
        weight: weights[i - 1],
        value: values[i - 1]
      });
      backtrackSteps.push(`Item ${i} selected: dp[${i}][${w}] = ${dp[i][w]} ≠ dp[${i-1}][${w}] = ${dp[i-1][w]}`);
      w -= weights[i - 1];
      backtrackSteps.push(`Remaining capacity: ${w + weights[i - 1]} - ${weights[i - 1]} = ${w}`);
    } else {
      backtrackSteps.push(`Item ${i} not selected: dp[${i}][${w}] = ${dp[i][w]} = dp[${i-1}][${w}] = ${dp[i-1][w]}`);
    }
  }
  
  steps.push(...backtrackSteps);
  steps.push("");
  steps.push(`Final solution: Select items ${selectedItems.map(item => item.index).join(', ')}`);
  steps.push(`Total weight: ${selectedItems.reduce((sum, item) => sum + item.weight, 0)} ≤ ${capacity}`);
  steps.push(`Maximum value: ${dp[n][capacity]}`);
  
  return {
    maxValue: dp[n][capacity],
    selectedItems,
    dpTable: dp,
    steps
  };
}

// Test with standard example: capacity=10, weights=[1,3,4,5], values=[1,4,5,7]
const capacity = 10;
const weights = [1, 3, 4, 5];
const values = [1, 4, 5, 7];

console.log("Test case:");
console.log("Capacity:", capacity);
console.log("Weights:", weights);
console.log("Values:", values);
console.log();

const result = knapsackDP(capacity, weights, values);

console.log("Sample Steps:");
result.steps.slice(0, 15).forEach(step => console.log(step));
console.log("... (more steps)");

console.log();
console.log("Max Value:", result.maxValue);
console.log("Selected Items:", result.selectedItems);
