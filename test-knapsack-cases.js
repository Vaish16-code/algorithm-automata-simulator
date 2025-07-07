// Test with the specific example from the image
function knapsackDP(capacity, weights, values) {
  const n = weights.length;
  const dp = Array(n + 1).fill(null).map(() => Array(capacity + 1).fill(0));
  
  // Fill the DP table
  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        const include = values[i - 1] + dp[i - 1][w - weights[i - 1]];
        const exclude = dp[i - 1][w];
        dp[i][w] = Math.max(include, exclude);
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }
  
  // Backtrack to find selected items
  const selectedItems = [];
  let w = capacity;
  
  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      selectedItems.unshift({
        index: i,
        weight: weights[i - 1],
        value: values[i - 1]
      });
      w -= weights[i - 1];
    }
  }
  
  return { maxValue: dp[n][capacity], selectedItems, dpTable: dp };
}

// Common test cases from textbooks
console.log("=== Test Case 1: Classic Example ===");
const test1 = knapsackDP(10, [1, 3, 4, 5], [1, 4, 5, 7]);
console.log("Capacity: 10, Weights: [1,3,4,5], Values: [1,4,5,7]");
console.log("Expected: Value 13, Items [1,3,4] (weights 1+4+5=10)");
console.log("Actual: Value", test1.maxValue, "Items", test1.selectedItems.map(i => i.index));
console.log("Weights used:", test1.selectedItems.reduce((s,i) => s + i.weight, 0));
console.log();

console.log("=== Test Case 2: Small Example ===");
const test2 = knapsackDP(5, [2, 1, 3], [3, 2, 4]);
console.log("Capacity: 5, Weights: [2,1,3], Values: [3,2,4]");
console.log("Actual: Value", test2.maxValue, "Items", test2.selectedItems.map(i => i.index));
console.log("Weights used:", test2.selectedItems.reduce((s,i) => s + i.weight, 0));
console.log();

console.log("=== Test Case 3: Another Classic ===");
const test3 = knapsackDP(7, [1, 3, 4, 5], [1, 4, 5, 7]);
console.log("Capacity: 7, Weights: [1,3,4,5], Values: [1,4,5,7]");
console.log("Actual: Value", test3.maxValue, "Items", test3.selectedItems.map(i => i.index));
console.log("Weights used:", test3.selectedItems.reduce((s,i) => s + i.weight, 0));

console.log("\n=== DP Table for Test Case 1 ===");
test1.dpTable.forEach((row, i) => {
  console.log(`Row ${i}: [${row.join(', ')}]`);
});
