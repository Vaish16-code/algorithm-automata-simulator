#!/usr/bin/env node

/**
 * Node.js Compatible Algorithm Testing Script for DAA Folder
 * Tests all Design and Analysis of Algorithms with multiple test cases
 * Covers: Greedy, Dynamic Programming, Divide & Conquer, Backtracking, Branch & Bound, String Matching
 * 
 * Usage: node test-daa-algorithms-node.js
 */

// Color codes for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// Test results tracking
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failedTestDetails = [];

// Utility functions
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(testName, expected, actual, passed) {
  totalTests++;
  if (passed) {
    passedTests++;
    log(`✓ ${testName}`, 'green');
  } else {
    failedTests++;
    log(`✗ ${testName}`, 'red');
    log(`  Expected: ${expected}`, 'yellow');
    log(`  Actual: ${actual}`, 'yellow');
    failedTestDetails.push({
      test: testName,
      expected,
      actual
    });
  }
}

function logSection(title) {
  log(`\n${colors.bold}${colors.cyan}=== ${title} ===${colors.reset}`);
}

// ==================== ALGORITHM IMPLEMENTATIONS ====================

// GREEDY ALGORITHMS
function fractionalKnapsack(capacity, weights, profits) {
  const items = weights.map((weight, index) => ({
    index: index + 1,
    weight,
    profit: profits[index],
    ratio: profits[index] / weight
  }));

  items.sort((a, b) => b.ratio - a.ratio);

  let totalProfit = 0;
  let remainingCapacity = capacity;
  const selectedItems = [];

  for (const item of items) {
    if (remainingCapacity === 0) break;

    if (item.weight <= remainingCapacity) {
      selectedItems.push({ index: item.index, fraction: 1, profit: item.profit });
      totalProfit += item.profit;
      remainingCapacity -= item.weight;
    } else {
      const fraction = remainingCapacity / item.weight;
      const fractionalProfit = fraction * item.profit;
      selectedItems.push({ index: item.index, fraction, profit: fractionalProfit });
      totalProfit += fractionalProfit;
      remainingCapacity = 0;
    }
  }

  return { totalProfit: Math.round(totalProfit * 100) / 100, selectedItems };
}

function jobSequencing(jobs) {
  // Sort jobs by profit in descending order
  const sortedJobs = [...jobs].sort((a, b) => b.profit - a.profit);
  
  const maxDeadline = Math.max(...jobs.map(job => job.deadline));
  const timeSlots = new Array(maxDeadline).fill(null);
  const selectedJobs = [];
  let totalProfit = 0;

  for (const job of sortedJobs) {
    // Find a free slot for this job (starting from its deadline)
    for (let slot = Math.min(job.deadline - 1, maxDeadline - 1); slot >= 0; slot--) {
      if (timeSlots[slot] === null) {
        timeSlots[slot] = job;
        selectedJobs.push(job);
        totalProfit += job.profit;
        break;
      }
    }
  }

  return { selectedJobs, totalProfit, schedule: timeSlots };
}

function primMST(graph) {
  const n = graph.length;
  const visited = new Array(n).fill(false);
  const mstEdges = [];
  let totalCost = 0;

  // Start from vertex 0
  visited[0] = true;

  for (let edgeCount = 0; edgeCount < n - 1; edgeCount++) {
    let minCost = Infinity;
    let minEdge = null;

    for (let u = 0; u < n; u++) {
      if (visited[u]) {
        for (let v = 0; v < n; v++) {
          if (!visited[v] && graph[u][v] !== 0 && graph[u][v] < minCost) {
            minCost = graph[u][v];
            minEdge = { from: u, to: v, weight: graph[u][v] };
          }
        }
      }
    }

    if (minEdge) {
      visited[minEdge.to] = true;
      mstEdges.push(minEdge);
      totalCost += minEdge.weight;
    }
  }

  return { mstEdges, totalCost };
}

function dijkstra(graph, start) {
  const n = graph.length;
  const distances = new Array(n).fill(Infinity);
  const visited = new Array(n).fill(false);
  const previous = new Array(n).fill(null);

  distances[start] = 0;

  for (let i = 0; i < n; i++) {
    let minDistance = Infinity;
    let current = -1;

    // Find unvisited vertex with minimum distance
    for (let v = 0; v < n; v++) {
      if (!visited[v] && distances[v] < minDistance) {
        minDistance = distances[v];
        current = v;
      }
    }

    if (current === -1) break;
    visited[current] = true;

    // Update distances to neighbors
    for (let neighbor = 0; neighbor < n; neighbor++) {
      if (!visited[neighbor] && graph[current][neighbor] !== 0) {
        const newDistance = distances[current] + graph[current][neighbor];
        if (newDistance < distances[neighbor]) {
          distances[neighbor] = newDistance;
          previous[neighbor] = current;
        }
      }
    }
  }

  return { distances, previous };
}

// DYNAMIC PROGRAMMING
function knapsackDP(capacity, weights, values) {
  const n = weights.length;
  const dp = Array(n + 1).fill(null).map(() => Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(
          values[i - 1] + dp[i - 1][w - weights[i - 1]],
          dp[i - 1][w]
        );
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
      selectedItems.push({ index: i - 1, weight: weights[i - 1], value: values[i - 1] });
      w -= weights[i - 1];
    }
  }

  return { maxValue: dp[n][capacity], selectedItems: selectedItems.reverse() };
}

function longestCommonSubsequence(str1, str2) {
  const m = str1.length;
  const n = str2.length;
  const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Reconstruct LCS
  let lcs = '';
  let i = m, j = n;
  while (i > 0 && j > 0) {
    if (str1[i - 1] === str2[j - 1]) {
      lcs = str1[i - 1] + lcs;
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  return { length: dp[m][n], sequence: lcs };
}

function matrixChainMultiplication(dimensions) {
  const n = dimensions.length - 1;
  const dp = Array(n).fill(null).map(() => Array(n).fill(0));

  for (let length = 2; length <= n; length++) {
    for (let i = 0; i <= n - length; i++) {
      const j = i + length - 1;
      dp[i][j] = Infinity;
      
      for (let k = i; k < j; k++) {
        const cost = dp[i][k] + dp[k + 1][j] + dimensions[i] * dimensions[k + 1] * dimensions[j + 1];
        if (cost < dp[i][j]) {
          dp[i][j] = cost;
        }
      }
    }
  }

  return { minOperations: dp[0][n - 1] };
}

function floydWarshall(graph) {
  const n = graph.length;
  const dist = graph.map(row => [...row]);

  // Replace 0s with Infinity except diagonal
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i !== j && dist[i][j] === 0) {
        dist[i][j] = Infinity;
      }
    }
  }

  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
        }
      }
    }
  }

  return { distances: dist };
}

// DIVIDE AND CONQUER
function mergeSort(arr) {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }

  return result.concat(left.slice(i)).concat(right.slice(j));
}

function quickSort(arr) {
  if (arr.length <= 1) return arr;

  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter(x => x < pivot);
  const middle = arr.filter(x => x === pivot);
  const right = arr.filter(x => x > pivot);

  return quickSort(left).concat(middle).concat(quickSort(right));
}

function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
}

function findMinMax(arr) {
  if (arr.length === 1) {
    return { min: arr[0], max: arr[0], comparisons: 0 };
  }

  if (arr.length === 2) {
    return {
      min: Math.min(arr[0], arr[1]),
      max: Math.max(arr[0], arr[1]),
      comparisons: 1
    };
  }

  const mid = Math.floor(arr.length / 2);
  const leftResult = findMinMax(arr.slice(0, mid));
  const rightResult = findMinMax(arr.slice(mid));

  const min = Math.min(leftResult.min, rightResult.min);
  const max = Math.max(leftResult.max, rightResult.max);
  const comparisons = leftResult.comparisons + rightResult.comparisons + 2;

  return { min, max, comparisons };
}

function kadaneMaxSubarray(arr) {
  let maxCurrent = arr[0];
  let maxGlobal = arr[0];
  let start = 0, end = 0, tempStart = 0;

  for (let i = 1; i < arr.length; i++) {
    if (maxCurrent < 0) {
      maxCurrent = arr[i];
      tempStart = i;
    } else {
      maxCurrent += arr[i];
    }

    if (maxCurrent > maxGlobal) {
      maxGlobal = maxCurrent;
      start = tempStart;
      end = i;
    }
  }

  return { maxSum: maxGlobal, start, end, subarray: arr.slice(start, end + 1) };
}

// BACKTRACKING
function solveNQueens(n) {
  const solutions = [];
  const board = Array(n).fill(null).map(() => Array(n).fill(0));

  function isSafe(board, row, col) {
    // Check column
    for (let i = 0; i < row; i++) {
      if (board[i][col] === 1) return false;
    }

    // Check upper diagonal on left side
    for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
      if (board[i][j] === 1) return false;
    }

    // Check upper diagonal on right side
    for (let i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
      if (board[i][j] === 1) return false;
    }

    return true;
  }

  function solveNQUtil(board, row) {
    if (row === n) {
      solutions.push(board.map(row => [...row]));
      return;
    }

    for (let col = 0; col < n; col++) {
      if (isSafe(board, row, col)) {
        board[row][col] = 1;
        solveNQUtil(board, row + 1);
        board[row][col] = 0; // backtrack
      }
    }
  }

  solveNQUtil(board, 0);
  return { solutions, totalSolutions: solutions.length };
}

function subsetSum(arr, targetSum) {
  const solutions = [];

  function findSubsets(index, currentSum, currentSubset) {
    if (currentSum === targetSum) {
      solutions.push([...currentSubset]);
      return;
    }

    if (index >= arr.length || currentSum > targetSum) {
      return;
    }

    // Include current element
    currentSubset.push(arr[index]);
    findSubsets(index + 1, currentSum + arr[index], currentSubset);
    
    // Exclude current element (backtrack)
    currentSubset.pop();
    findSubsets(index + 1, currentSum, currentSubset);
  }

  findSubsets(0, 0, []);
  return { solutions, totalSolutions: solutions.length };
}

// STRING MATCHING
function naiveStringMatch(text, pattern) {
  const matches = [];
  let comparisons = 0;

  for (let i = 0; i <= text.length - pattern.length; i++) {
    let j = 0;
    while (j < pattern.length && text[i + j] === pattern[j]) {
      comparisons++;
      j++;
    }
    
    if (j < pattern.length) {
      comparisons++; // Count the failed comparison
    }

    if (j === pattern.length) {
      matches.push(i);
    }
  }

  return { matches, comparisons };
}

function kmpStringMatch(text, pattern) {
  function computeLPS(pattern) {
    const lps = new Array(pattern.length).fill(0);
    let len = 0;
    let i = 1;

    while (i < pattern.length) {
      if (pattern[i] === pattern[len]) {
        len++;
        lps[i] = len;
        i++;
      } else {
        if (len !== 0) {
          len = lps[len - 1];
        } else {
          lps[i] = 0;
          i++;
        }
      }
    }
    return lps;
  }

  const lps = computeLPS(pattern);
  const matches = [];
  let i = 0; // text index
  let j = 0; // pattern index
  let comparisons = 0;

  while (i < text.length) {
    comparisons++;
    if (pattern[j] === text[i]) {
      i++;
      j++;
    }

    if (j === pattern.length) {
      matches.push(i - j);
      j = lps[j - 1];
    } else if (i < text.length && pattern[j] !== text[i]) {
      if (j !== 0) {
        j = lps[j - 1];
      } else {
        i++;
      }
    }
  }

  return { matches, comparisons, lps };
}

// ==================== TEST DATA DEFINITIONS ====================

const testData = {
  // Greedy Algorithm Test Cases
  greedyTests: {
    fractionalKnapsack: [
      {
        name: "Standard Fractional Knapsack - Easy",
        input: { capacity: 50, weights: [10, 20, 30], profits: [60, 100, 120] },
        expected: { totalProfit: 240, itemsCount: 3 }
      },
      {
        name: "Fractional Knapsack - Medium",
        input: { capacity: 15, weights: [2, 3, 5, 7], profits: [1, 4, 7, 9] },
        expected: { totalProfit: 20, itemsCount: 3 }
      },
      {
        name: "Fractional Knapsack - Hard",
        input: { capacity: 100, weights: [10, 20, 15, 25, 30], profits: [100, 60, 40, 120, 80] },
        expected: { totalProfit: 400, itemsCount: 5 }
      },
      {
        name: "Single Item Knapsack",
        input: { capacity: 10, weights: [5], profits: [50] },
        expected: { totalProfit: 50, itemsCount: 1 }
      },
      {
        name: "Exact Capacity Match",
        input: { capacity: 10, weights: [5, 5], profits: [25, 30] },
        expected: { totalProfit: 55, itemsCount: 2 }
      },
      {
        name: "Fractional Knapsack - Expert",
        input: { capacity: 200, weights: [12, 18, 25, 32, 45, 55, 68, 72], profits: [150, 180, 220, 280, 360, 440, 520, 600] },
        expected: { totalProfit: 1758, itemsCount: 6 }
      },
      {
        name: "Fractional Knapsack - Extreme",
        input: { capacity: 500, weights: [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80], profits: [120, 200, 240, 300, 350, 400, 480, 540, 600, 650, 720, 780, 840, 900, 960] },
        expected: { totalProfit: 6020, itemsCount: 12 }
      }
    ],

    jobSequencing: [
      {
        name: "Job Sequencing - Easy",
        input: [
          { id: 'J1', deadline: 2, profit: 100 },
          { id: 'J2', deadline: 1, profit: 19 },
          { id: 'J3', deadline: 2, profit: 27 }
        ],
        expected: { totalProfit: 127, jobsCount: 2 }
      },
      {
        name: "Job Sequencing - Medium",
        input: [
          { id: 'J1', deadline: 4, profit: 20 },
          { id: 'J2', deadline: 1, profit: 10 },
          { id: 'J3', deadline: 1, profit: 40 },
          { id: 'J4', deadline: 1, profit: 30 }
        ],
        expected: { totalProfit: 60, jobsCount: 2 }
      },
      {
        name: "Job Sequencing - Hard",
        input: [
          { id: 'J1', deadline: 2, profit: 100 },
          { id: 'J2', deadline: 1, profit: 19 },
          { id: 'J3', deadline: 2, profit: 27 },
          { id: 'J4', deadline: 1, profit: 25 },
          { id: 'J5', deadline: 3, profit: 15 }
        ],
        expected: { totalProfit: 142, jobsCount: 3 }
      },
      {
        name: "Job Sequencing - Expert",
        input: [
          { id: 'J1', deadline: 4, profit: 200 },
          { id: 'J2', deadline: 1, profit: 180 },
          { id: 'J3', deadline: 3, profit: 190 },
          { id: 'J4', deadline: 2, profit: 300 },
          { id: 'J5', deadline: 2, profit: 120 },
          { id: 'J6', deadline: 4, profit: 100 },
          { id: 'J7', deadline: 3, profit: 250 }
        ],
        expected: { totalProfit: 940, jobsCount: 4 }
      },
      {
        name: "Job Sequencing - Extreme",
        input: [
          { id: 'J1', deadline: 5, profit: 500 },
          { id: 'J2', deadline: 3, profit: 450 },
          { id: 'J3', deadline: 4, profit: 400 },
          { id: 'J4', deadline: 2, profit: 350 },
          { id: 'J5', deadline: 1, profit: 300 },
          { id: 'J6', deadline: 6, profit: 250 },
          { id: 'J7', deadline: 5, profit: 200 },
          { id: 'J8', deadline: 4, profit: 150 },
          { id: 'J9', deadline: 3, profit: 100 },
          { id: 'J10', deadline: 2, profit: 80 }
        ],
        expected: { totalProfit: 2250, jobsCount: 6 }
      }
    ],

    primMST: [
      {
        name: "Prim's MST - Easy (4 vertices)",
        input: [
          [0, 2, 0, 6],
          [2, 0, 3, 8],
          [0, 3, 0, 5],
          [6, 8, 5, 0]
        ],
        expected: { totalCost: 10, edgesCount: 3 }
      },
      {
        name: "Prim's MST - Medium (5 vertices)",
        input: [
          [0, 2, 0, 6, 0],
          [2, 0, 3, 8, 5],
          [0, 3, 0, 0, 7],
          [6, 8, 0, 0, 9],
          [0, 5, 7, 9, 0]
        ],
        expected: { totalCost: 16, edgesCount: 4 }
      }
    ],

    dijkstra: [
      {
        name: "Dijkstra's Shortest Path - Easy",
        input: {
          graph: [
            [0, 4, 0, 0, 0, 0, 0, 8, 0],
            [4, 0, 8, 0, 0, 0, 0, 11, 0],
            [0, 8, 0, 7, 0, 4, 0, 0, 2],
            [0, 0, 7, 0, 9, 14, 0, 0, 0],
            [0, 0, 0, 9, 0, 10, 0, 0, 0],
            [0, 0, 4, 14, 10, 0, 2, 0, 0],
            [0, 0, 0, 0, 0, 2, 0, 1, 6],
            [8, 11, 0, 0, 0, 0, 1, 0, 7],
            [0, 0, 2, 0, 0, 0, 6, 7, 0]
          ],
          start: 0
        },
        expected: { distanceToNode4: 21, distanceToNode8: 14 }
      }
    ]
  },

  // Dynamic Programming Test Cases
  dynamicProgrammingTests: {
    knapsackDP: [
      {
        name: "0/1 Knapsack - Easy",
        input: { capacity: 10, weights: [5, 4, 6, 3], values: [10, 40, 30, 50] },
        expected: { maxValue: 90, itemsSelected: 2 }
      },
      {
        name: "0/1 Knapsack - Medium",
        input: { capacity: 50, weights: [10, 20, 30], values: [60, 100, 120] },
        expected: { maxValue: 220, itemsSelected: 2 }
      },
      {
        name: "0/1 Knapsack - Hard",
        input: { capacity: 100, weights: [10, 20, 30, 40, 50], values: [20, 30, 66, 40, 60] },
        expected: { maxValue: 156, itemsSelected: 4 }
      },
      {
        name: "0/1 Knapsack - Expert",
        input: { capacity: 150, weights: [15, 25, 35, 45, 55, 65, 75], values: [180, 300, 420, 540, 660, 780, 900] },
        expected: { maxValue: 1800, itemsSelected: 4 }
      },
      {
        name: "0/1 Knapsack - Extreme",
        input: { capacity: 200, weights: [12, 18, 22, 28, 32, 38, 42, 48, 52, 58], values: [150, 220, 280, 350, 400, 480, 520, 600, 650, 720] },
        expected: { maxValue: 2510, itemsSelected: 6 }
      }
    ],

    lcs: [
      {
        name: "LCS - Easy",
        input: { str1: "ABCDGH", str2: "AEDFHR" },
        expected: { length: 3, sequence: "ADH" }
      },
      {
        name: "LCS - Medium",
        input: { str1: "AGGTAB", str2: "GXTXAYB" },
        expected: { length: 4, sequence: "GTAB" }
      },
      {
        name: "LCS - Hard",
        input: { str1: "ABCDEFGHIJKLMNOP", str2: "ACEGIKMOQSUWY" },
        expected: { length: 8, sequence: "ACEGIKMO" }
      },
      {
        name: "LCS - No Common",
        input: { str1: "ABC", str2: "DEF" },
        expected: { length: 0, sequence: "" }
      },
      {
        name: "LCS - Identical Strings",
        input: { str1: "HELLO", str2: "HELLO" },
        expected: { length: 5, sequence: "HELLO" }
      }
    ],

    matrixChain: [
      {
        name: "Matrix Chain - Easy",
        input: [1, 2, 3, 4],
        expected: { minOperations: 18 }
      },
      {
        name: "Matrix Chain - Medium",
        input: [40, 20, 30, 10, 30],
        expected: { minOperations: 26000 }
      },
      {
        name: "Matrix Chain - Hard",
        input: [5, 4, 6, 2, 7, 3],
        expected: { minOperations: 160 }
      },
      {
        name: "Matrix Chain - Expert",
        input: [10, 20, 30, 40, 30, 20, 10],
        expected: { minOperations: 38000 }
      },
      {
        name: "Matrix Chain - Extreme",
        input: [8, 15, 12, 25, 18, 30, 22, 35, 28, 40],
        expected: { minOperations: 40000 }
      }
    ],

    floydWarshall: [
      {
        name: "Floyd-Warshall - Easy",
        input: [
          [0, 5, 0, 10],
          [0, 0, 3, 0],
          [0, 0, 0, 1],
          [0, 0, 0, 0]
        ],
        expected: { path0to3: 9, path1to3: 4 }
      }
    ]
  },

  // Divide and Conquer Test Cases
  divideConquerTests: {
    mergeSort: [
      {
        name: "Merge Sort - Easy",
        input: [64, 34, 25, 12, 22, 11, 90],
        expected: [11, 12, 22, 25, 34, 64, 90]
      },
      {
        name: "Merge Sort - Medium",
        input: [5, 2, 4, 6, 1, 3, 8, 7, 10, 9],
        expected: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      },
      {
        name: "Merge Sort - Hard (Random)",
        input: [73, 19, 45, 82, 36, 91, 27, 64, 18, 55],
        expected: [18, 19, 27, 36, 45, 55, 64, 73, 82, 91]
      },
      {
        name: "Merge Sort - Already Sorted",
        input: [1, 2, 3, 4, 5],
        expected: [1, 2, 3, 4, 5]
      },
      {
        name: "Merge Sort - Reverse Sorted",
        input: [5, 4, 3, 2, 1],
        expected: [1, 2, 3, 4, 5]
      },
      {
        name: "Merge Sort - Expert (Large Random)",
        input: [987, 654, 321, 123, 456, 789, 159, 753, 842, 267, 394, 618, 925, 137, 864, 592, 73, 486, 719, 350],
        expected: [73, 123, 137, 159, 267, 321, 350, 394, 456, 486, 592, 618, 654, 719, 753, 789, 842, 864, 925, 987]
      },
      {
        name: "Merge Sort - Extreme (Mixed Pattern)",
        input: [100, 1, 99, 2, 98, 3, 97, 4, 96, 5, 95, 6, 94, 7, 93, 8, 92, 9, 91, 10, 90, 11, 89, 12, 88, 13],
        expected: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100]
      }
    ],

    quickSort: [
      {
        name: "Quick Sort - Easy",
        input: [3, 6, 8, 10, 1, 2, 1],
        expected: [1, 1, 2, 3, 6, 8, 10]
      },
      {
        name: "Quick Sort - Medium",
        input: [10, 7, 8, 9, 1, 5],
        expected: [1, 5, 7, 8, 9, 10]
      },
      {
        name: "Quick Sort - Hard",
        input: [64, 34, 25, 12, 22, 11, 90, 5, 77, 30],
        expected: [5, 11, 12, 22, 25, 30, 34, 64, 77, 90]
      },
      {
        name: "Quick Sort - Expert (Nearly Sorted)",
        input: [1, 3, 2, 5, 4, 7, 6, 9, 8, 11, 10, 13, 12, 15, 14],
        expected: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
      },
      {
        name: "Quick Sort - Extreme (Many Duplicates)",
        input: [5, 2, 8, 2, 9, 1, 5, 5, 2, 8, 9, 1, 5, 2, 8, 9, 1, 5, 2, 8],
        expected: [1, 1, 1, 2, 2, 2, 2, 2, 5, 5, 5, 5, 5, 8, 8, 8, 8, 9, 9, 9]
      }
    ],

    binarySearch: [
      {
        name: "Binary Search - Easy (Found)",
        input: { arr: [2, 3, 4, 10, 40], target: 10 },
        expected: 3
      },
      {
        name: "Binary Search - Medium (Found)",
        input: { arr: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19], target: 13 },
        expected: 6
      },
      {
        name: "Binary Search - Hard (Not Found)",
        input: { arr: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19], target: 12 },
        expected: -1
      },
      {
        name: "Binary Search - First Element",
        input: { arr: [1, 2, 3, 4, 5], target: 1 },
        expected: 0
      },
      {
        name: "Binary Search - Last Element",
        input: { arr: [1, 2, 3, 4, 5], target: 5 },
        expected: 4
      }
    ],

    minMax: [
      {
        name: "Min-Max - Easy",
        input: [3, 5, 1, 8, 2],
        expected: { min: 1, max: 8 }
      },
      {
        name: "Min-Max - Medium",
        input: [10, 20, 30, 5, 15, 25, 35],
        expected: { min: 5, max: 35 }
      },
      {
        name: "Min-Max - Hard",
        input: [100, 50, 75, 25, 60, 80, 90, 40, 70, 30],
        expected: { min: 25, max: 100 }
      },
      {
        name: "Min-Max - Expert",
        input: [999, 123, 876, 245, 654, 432, 789, 567, 321, 890, 456, 678, 234, 901, 345],
        expected: { min: 123, max: 999 }
      },
      {
        name: "Min-Max - Extreme",
        input: [50, 150, 25, 175, 75, 125, 100, 200, 1, 249, 199, 51, 149, 26, 174, 76, 124, 101, 2, 248],
        expected: { min: 1, max: 249 }
      }
    ],

    kadane: [
      {
        name: "Kadane's Algorithm - Easy",
        input: [1, -3, 2, 1, -1],
        expected: { maxSum: 3, subarray: [2, 1] }
      },
      {
        name: "Kadane's Algorithm - Medium",
        input: [-2, -3, 4, -1, -2, 1, 5, -3],
        expected: { maxSum: 7, subarray: [4, -1, -2, 1, 5] }
      },
      {
        name: "Kadane's Algorithm - Hard",
        input: [5, -2, 4, -3, 1, 2, 0, -4, 6],
        expected: { maxSum: 9, subarray: [5, -2, 4, -3, 1, 2, 0, -4, 6] }
      },
      {
        name: "Kadane's Algorithm - All Negative",
        input: [-5, -2, -8, -1],
        expected: { maxSum: -1, subarray: [-1] }
      },
      {
        name: "Kadane's Algorithm - Expert",
        input: [12, -8, 15, -3, 9, -12, 18, -6, 21, -15, 24],
        expected: { maxSum: 55, subarray: [12, -8, 15, -3, 9, -12, 18, -6, 21, -15, 24] }
      },
      {
        name: "Kadane's Algorithm - Extreme",
        input: [25, -15, 30, -20, 35, -25, 40, -30, 45, -35, 50, -40, 55, -45, 60],
        expected: { maxSum: 130, subarray: [25, -15, 30, -20, 35, -25, 40, -30, 45, -35, 50, -40, 55, -45, 60] }
      }
    ]
  },

  // Backtracking Test Cases
  backtrackingTests: {
    nQueens: [
      {
        name: "N-Queens - Easy (4x4)",
        input: 4,
        expected: { totalSolutions: 2 }
      },
      {
        name: "N-Queens - Medium (6x6)",
        input: 6,
        expected: { totalSolutions: 4 }
      },
      {
        name: "N-Queens - Hard (8x8)",
        input: 8,
        expected: { totalSolutions: 92 }
      },
      {
        name: "N-Queens - No Solution (2x2)",
        input: 2,
        expected: { totalSolutions: 0 }
      },
      {
        name: "N-Queens - No Solution (3x3)",
        input: 3,
        expected: { totalSolutions: 0 }
      },
      {
        name: "N-Queens - Expert (10x10)",
        input: 10,
        expected: { totalSolutions: 724 }
      },
      {
        name: "N-Queens - Extreme (12x12)",
        input: 12,
        expected: { totalSolutions: 14200 }
      }
    ],

    subsetSum: [
      {
        name: "Subset Sum - Easy",
        input: { arr: [3, 34, 4, 12, 5, 2], targetSum: 9 },
        expected: { hasSolution: true, minSolutions: 1 }
      },
      {
        name: "Subset Sum - Medium",
        input: { arr: [1, 3, 5, 7], targetSum: 8 },
        expected: { hasSolution: true, minSolutions: 2 }
      },
      {
        name: "Subset Sum - Hard",
        input: { arr: [2, 3, 7, 8, 10], targetSum: 11 },
        expected: { hasSolution: true, minSolutions: 1 }
      },
      {
        name: "Subset Sum - No Solution",
        input: { arr: [2, 4, 6, 8], targetSum: 15 },
        expected: { hasSolution: false, minSolutions: 0 }
      },
      {
        name: "Subset Sum - Expert",
        input: { arr: [5, 10, 15, 20, 25, 30, 35], targetSum: 50 },
        expected: { hasSolution: true, minSolutions: 2 }
      },
      {
        name: "Subset Sum - Extreme",
        input: { arr: [12, 18, 24, 30, 36, 42, 48, 54, 60, 66], targetSum: 120 },
        expected: { hasSolution: true, minSolutions: 3 }
      }
    ]
  },

  // String Matching Test Cases
  stringMatchingTests: {
    naiveStringMatch: [
      {
        name: "Naive String Match - Easy",
        input: { text: "ABABDABACDABABCABCABCABCABC", pattern: "ABABCABCABCABC" },
        expected: { matchesCount: 1, firstMatch: 10 }
      },
      {
        name: "Naive String Match - Medium",
        input: { text: "AABAACAADAABAABA", pattern: "AABA" },
        expected: { matchesCount: 3, firstMatch: 0 }
      },
      {
        name: "Naive String Match - Hard",
        input: { text: "ABAAABCDABABCABCABCABCABC", pattern: "ABC" },
        expected: { matchesCount: 6, firstMatch: 4 }
      },
      {
        name: "Naive String Match - No Match",
        input: { text: "AAAAAAA", pattern: "AAB" },
        expected: { matchesCount: 0, firstMatch: -1 }
      },
      {
        name: "Naive String Match - Expert",
        input: { text: "ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJK", pattern: "ABCDEF" },
        expected: { matchesCount: 2, firstMatch: 0 }
      },
      {
        name: "Naive String Match - Extreme",
        input: { text: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", pattern: "AAAA" },
        expected: { matchesCount: 37, firstMatch: 0 }
      }
    ],

    kmpStringMatch: [
      {
        name: "KMP String Match - Easy",
        input: { text: "ABABDABACDABABCABCABCABCABC", pattern: "ABABCABCABCABC" },
        expected: { matchesCount: 1, firstMatch: 10 }
      },
      {
        name: "KMP String Match - Medium",
        input: { text: "AABAACAADAABAABA", pattern: "AABA" },
        expected: { matchesCount: 3, firstMatch: 0 }
      },
      {
        name: "KMP String Match - Hard",
        input: { text: "ABCABCABCABCABC", pattern: "ABCABC" },
        expected: { matchesCount: 4, firstMatch: 0 }
      },
      {
        name: "KMP String Match - Expert",
        input: { text: "ABABCABCABCABCABABCABCABCABC", pattern: "ABCABCABC" },
        expected: { matchesCount: 4, firstMatch: 2 }
      },
      {
        name: "KMP String Match - Extreme",
        input: { text: "ABCDABCDABCDABCDABCDABCDABCDABCDABCDABCD", pattern: "ABCDABCDABCD" },
        expected: { matchesCount: 8, firstMatch: 0 }
      }
    ]
  }
};

// ==================== TEST EXECUTION FUNCTIONS ====================

function runGreedyTests() {
  logSection("GREEDY ALGORITHMS");
  
  // Fractional Knapsack Tests
  log("\n--- Fractional Knapsack Tests ---", 'magenta');
  testData.greedyTests.fractionalKnapsack.forEach((test, index) => {
    const result = fractionalKnapsack(test.input.capacity, test.input.weights, test.input.profits);
    const passed = Math.abs(result.totalProfit - test.expected.totalProfit) < 0.1 && 
                   result.selectedItems.length === test.expected.itemsCount;
    
    logTest(
      test.name,
      `Profit: ${test.expected.totalProfit}, Items: ${test.expected.itemsCount}`,
      `Profit: ${result.totalProfit}, Items: ${result.selectedItems.length}`,
      passed
    );
  });

  // Job Sequencing Tests
  log("\n--- Job Sequencing Tests ---", 'magenta');
  testData.greedyTests.jobSequencing.forEach((test, index) => {
    const result = jobSequencing(test.input);
    const passed = result.totalProfit === test.expected.totalProfit && 
                   result.selectedJobs.length === test.expected.jobsCount;
    
    logTest(
      test.name,
      `Profit: ${test.expected.totalProfit}, Jobs: ${test.expected.jobsCount}`,
      `Profit: ${result.totalProfit}, Jobs: ${result.selectedJobs.length}`,
      passed
    );
  });

  // Prim's MST Tests
  log("\n--- Prim's MST Tests ---", 'magenta');
  testData.greedyTests.primMST.forEach((test, index) => {
    const result = primMST(test.input);
    const passed = result.totalCost === test.expected.totalCost && 
                   result.mstEdges.length === test.expected.edgesCount;
    
    logTest(
      test.name,
      `Cost: ${test.expected.totalCost}, Edges: ${test.expected.edgesCount}`,
      `Cost: ${result.totalCost}, Edges: ${result.mstEdges.length}`,
      passed
    );
  });

  // Dijkstra's Tests
  log("\n--- Dijkstra's Shortest Path Tests ---", 'magenta');
  testData.greedyTests.dijkstra.forEach((test, index) => {
    const result = dijkstra(test.input.graph, test.input.start);
    const passed = result.distances[4] === test.expected.distanceToNode4 && 
                   result.distances[8] === test.expected.distanceToNode8;
    
    logTest(
      test.name,
      `Dist[4]: ${test.expected.distanceToNode4}, Dist[8]: ${test.expected.distanceToNode8}`,
      `Dist[4]: ${result.distances[4]}, Dist[8]: ${result.distances[8]}`,
      passed
    );
  });
}

function runDynamicProgrammingTests() {
  logSection("DYNAMIC PROGRAMMING ALGORITHMS");
  
  // 0/1 Knapsack Tests
  log("\n--- 0/1 Knapsack Tests ---", 'magenta');
  testData.dynamicProgrammingTests.knapsackDP.forEach((test, index) => {
    const result = knapsackDP(test.input.capacity, test.input.weights, test.input.values);
    const passed = result.maxValue === test.expected.maxValue && 
                   result.selectedItems.length === test.expected.itemsSelected;
    
    logTest(
      test.name,
      `Value: ${test.expected.maxValue}, Items: ${test.expected.itemsSelected}`,
      `Value: ${result.maxValue}, Items: ${result.selectedItems.length}`,
      passed
    );
  });

  // LCS Tests
  log("\n--- Longest Common Subsequence Tests ---", 'magenta');
  testData.dynamicProgrammingTests.lcs.forEach((test, index) => {
    const result = longestCommonSubsequence(test.input.str1, test.input.str2);
    const passed = result.length === test.expected.length && 
                   result.sequence === test.expected.sequence;
    
    logTest(
      test.name,
      `Length: ${test.expected.length}, LCS: "${test.expected.sequence}"`,
      `Length: ${result.length}, LCS: "${result.sequence}"`,
      passed
    );
  });

  // Matrix Chain Multiplication Tests
  log("\n--- Matrix Chain Multiplication Tests ---", 'magenta');
  testData.dynamicProgrammingTests.matrixChain.forEach((test, index) => {
    const result = matrixChainMultiplication(test.input);
    const passed = result.minOperations === test.expected.minOperations;
    
    logTest(
      test.name,
      `Min Operations: ${test.expected.minOperations}`,
      `Min Operations: ${result.minOperations}`,
      passed
    );
  });

  // Floyd-Warshall Tests
  log("\n--- Floyd-Warshall All-Pairs Shortest Path Tests ---", 'magenta');
  testData.dynamicProgrammingTests.floydWarshall.forEach((test, index) => {
    const result = floydWarshall(test.input);
    const passed = result.distances[0][3] === test.expected.path0to3 && 
                   result.distances[1][3] === test.expected.path1to3;
    
    logTest(
      test.name,
      `Path[0→3]: ${test.expected.path0to3}, Path[1→3]: ${test.expected.path1to3}`,
      `Path[0→3]: ${result.distances[0][3]}, Path[1→3]: ${result.distances[1][3]}`,
      passed
    );
  });
}

function runDivideConquerTests() {
  logSection("DIVIDE AND CONQUER ALGORITHMS");
  
  // Merge Sort Tests
  log("\n--- Merge Sort Tests ---", 'magenta');
  testData.divideConquerTests.mergeSort.forEach((test, index) => {
    const result = mergeSort([...test.input]); // Create copy to avoid modifying original
    const passed = JSON.stringify(result) === JSON.stringify(test.expected);
    
    logTest(
      test.name,
      `[${test.expected.join(', ')}]`,
      `[${result.join(', ')}]`,
      passed
    );
  });

  // Quick Sort Tests
  log("\n--- Quick Sort Tests ---", 'magenta');
  testData.divideConquerTests.quickSort.forEach((test, index) => {
    const result = quickSort([...test.input]);
    const passed = JSON.stringify(result) === JSON.stringify(test.expected);
    
    logTest(
      test.name,
      `[${test.expected.join(', ')}]`,
      `[${result.join(', ')}]`,
      passed
    );
  });

  // Binary Search Tests
  log("\n--- Binary Search Tests ---", 'magenta');
  testData.divideConquerTests.binarySearch.forEach((test, index) => {
    const result = binarySearch(test.input.arr, test.input.target);
    const passed = result === test.expected;
    
    logTest(
      test.name,
      `Index: ${test.expected}`,
      `Index: ${result}`,
      passed
    );
  });

  // Min-Max Tests
  log("\n--- Min-Max Finding Tests ---", 'magenta');
  testData.divideConquerTests.minMax.forEach((test, index) => {
    const result = findMinMax(test.input);
    const passed = result.min === test.expected.min && result.max === test.expected.max;
    
    logTest(
      test.name,
      `Min: ${test.expected.min}, Max: ${test.expected.max}`,
      `Min: ${result.min}, Max: ${result.max}`,
      passed
    );
  });

  // Kadane's Algorithm Tests
  log("\n--- Kadane's Maximum Subarray Tests ---", 'magenta');
  testData.divideConquerTests.kadane.forEach((test, index) => {
    const result = kadaneMaxSubarray(test.input);
    const passed = result.maxSum === test.expected.maxSum && 
                   JSON.stringify(result.subarray) === JSON.stringify(test.expected.subarray);
    
    logTest(
      test.name,
      `Sum: ${test.expected.maxSum}, Subarray: [${test.expected.subarray.join(', ')}]`,
      `Sum: ${result.maxSum}, Subarray: [${result.subarray.join(', ')}]`,
      passed
    );
  });
}

function runBacktrackingTests() {
  logSection("BACKTRACKING ALGORITHMS");
  
  // N-Queens Tests
  log("\n--- N-Queens Problem Tests ---", 'magenta');
  testData.backtrackingTests.nQueens.forEach((test, index) => {
    const result = solveNQueens(test.input);
    const passed = result.totalSolutions === test.expected.totalSolutions;
    
    logTest(
      test.name,
      `Solutions: ${test.expected.totalSolutions}`,
      `Solutions: ${result.totalSolutions}`,
      passed
    );
  });

  // Subset Sum Tests
  log("\n--- Subset Sum Problem Tests ---", 'magenta');
  testData.backtrackingTests.subsetSum.forEach((test, index) => {
    const result = subsetSum(test.input.arr, test.input.targetSum);
    const hasSolution = result.totalSolutions > 0;
    const passed = hasSolution === test.expected.hasSolution && 
                   result.totalSolutions >= test.expected.minSolutions;
    
    logTest(
      test.name,
      `Has Solution: ${test.expected.hasSolution}, Min Solutions: ${test.expected.minSolutions}`,
      `Has Solution: ${hasSolution}, Total Solutions: ${result.totalSolutions}`,
      passed
    );
  });
}

function runStringMatchingTests() {
  logSection("STRING MATCHING ALGORITHMS");
  
  // Naive String Matching Tests
  log("\n--- Naive String Matching Tests ---", 'magenta');
  testData.stringMatchingTests.naiveStringMatch.forEach((test, index) => {
    const result = naiveStringMatch(test.input.text, test.input.pattern);
    const firstMatch = result.matches.length > 0 ? result.matches[0] : -1;
    const passed = result.matches.length === test.expected.matchesCount && 
                   firstMatch === test.expected.firstMatch;
    
    logTest(
      test.name,
      `Matches: ${test.expected.matchesCount}, First: ${test.expected.firstMatch}`,
      `Matches: ${result.matches.length}, First: ${firstMatch}`,
      passed
    );
  });

  // KMP String Matching Tests
  log("\n--- KMP String Matching Tests ---", 'magenta');
  testData.stringMatchingTests.kmpStringMatch.forEach((test, index) => {
    const result = kmpStringMatch(test.input.text, test.input.pattern);
    const firstMatch = result.matches.length > 0 ? result.matches[0] : -1;
    const passed = result.matches.length === test.expected.matchesCount && 
                   firstMatch === test.expected.firstMatch;
    
    logTest(
      test.name,
      `Matches: ${test.expected.matchesCount}, First: ${test.expected.firstMatch}`,
      `Matches: ${result.matches.length}, First: ${firstMatch}`,
      passed
    );
  });
}

// Additional Algorithm Tests for completeness
function runAdditionalTests() {
  logSection("ADDITIONAL ALGORITHM VERIFICATIONS");
  
  // Test algorithm complexity and edge cases
  log("\n--- Edge Case and Complexity Tests ---", 'magenta');
  
  // Empty array tests
  const emptyMergeSort = mergeSort([]);
  const emptyQuickSort = quickSort([]);
  
  logTest(
    "Empty Array - Merge Sort",
    "[]",
    `[${emptyMergeSort.join(', ')}]`,
    emptyMergeSort.length === 0
  );

  logTest(
    "Empty Array - Quick Sort", 
    "[]",
    `[${emptyQuickSort.join(', ')}]`,
    emptyQuickSort.length === 0
  );

  // Single element tests
  const singleMergeSort = mergeSort([42]);
  const singleQuickSort = quickSort([42]);
  
  logTest(
    "Single Element - Merge Sort",
    "[42]",
    `[${singleMergeSort.join(', ')}]`,
    singleMergeSort.length === 1 && singleMergeSort[0] === 42
  );

  logTest(
    "Single Element - Quick Sort",
    "[42]",
    `[${singleQuickSort.join(', ')}]`,
    singleQuickSort.length === 1 && singleQuickSort[0] === 42
  );

  // Duplicate elements test
  const duplicateArray = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3];
  const duplicateMerge = mergeSort([...duplicateArray]);
  const duplicateQuick = quickSort([...duplicateArray]);
  const expectedDuplicate = [1, 1, 2, 3, 3, 4, 5, 5, 6, 9];
  
  logTest(
    "Duplicates - Merge Sort",
    `[${expectedDuplicate.join(', ')}]`,
    `[${duplicateMerge.join(', ')}]`,
    JSON.stringify(duplicateMerge) === JSON.stringify(expectedDuplicate)
  );

  logTest(
    "Duplicates - Quick Sort",
    `[${expectedDuplicate.join(', ')}]`,
    `[${duplicateQuick.join(', ')}]`,
    JSON.stringify(duplicateQuick) === JSON.stringify(expectedDuplicate)
  );

  // Large array performance test (simplified)
  const largeArray = Array.from({length: 1000}, () => Math.floor(Math.random() * 1000));
  const largeArrayCopy = [...largeArray];
  
  const startTime = Date.now();
  const largeMergeResult = mergeSort(largeArray);
  const mergeTime = Date.now() - startTime;

  const startTime2 = Date.now();
  const largeQuickResult = quickSort(largeArrayCopy);
  const quickTime = Date.now() - startTime2;

  // Verify both are sorted
  function isSorted(arr) {
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] < arr[i-1]) return false;
    }
    return true;
  }

  logTest(
    "Large Array (1000 elements) - Merge Sort",
    "Sorted correctly",
    `Sorted: ${isSorted(largeMergeResult)}, Time: ${mergeTime}ms`,
    isSorted(largeMergeResult)
  );

  logTest(
    "Large Array (1000 elements) - Quick Sort",
    "Sorted correctly", 
    `Sorted: ${isSorted(largeQuickResult)}, Time: ${quickTime}ms`,
    isSorted(largeQuickResult)
  );

  // Expert level performance tests
  log("\n--- Expert Performance Tests ---", 'magenta');
  
  // Very large array test (5000 elements)
  const veryLargeArray = Array.from({length: 5000}, () => Math.floor(Math.random() * 10000));
  const veryLargeArrayCopy = [...veryLargeArray];
  
  const expertStartTime = Date.now();
  const expertMergeResult = mergeSort(veryLargeArray);
  const expertMergeTime = Date.now() - expertStartTime;

  logTest(
    "Expert Performance - Merge Sort (5000 elements)",
    "Sorted correctly under 100ms",
    `Sorted: ${isSorted(expertMergeResult)}, Time: ${expertMergeTime}ms`,
    isSorted(expertMergeResult) && expertMergeTime < 100
  );

  // Extreme level performance tests
  log("\n--- Extreme Performance Tests ---", 'magenta');
  
  // Extremely large array test (10000 elements)
  const extremeArray = Array.from({length: 10000}, () => Math.floor(Math.random() * 100000));
  
  const extremeStartTime = Date.now();
  const extremeMergeResult = mergeSort(extremeArray);
  const extremeMergeTime = Date.now() - extremeStartTime;

  logTest(
    "Extreme Performance - Merge Sort (10000 elements)",
    "Sorted correctly under 200ms",
    `Sorted: ${isSorted(extremeMergeResult)}, Time: ${extremeMergeTime}ms`,
    isSorted(extremeMergeResult) && extremeMergeTime < 200
  );
}

// Summary and Results
function printSummary() {
  logSection("TEST SUMMARY");
  
  log(`Total Tests: ${totalTests}`, 'bold');
  log(`Passed: ${passedTests}`, 'green');
  log(`Failed: ${failedTests}`, failedTests > 0 ? 'red' : 'green');
  
  if (failedTests > 0) {
    log('\nFailed Test Details:', 'yellow');
    failedTestDetails.forEach(failure => {
      log(`- ${failure.test}`, 'red');
      log(`  Expected: ${failure.expected}`, 'yellow');
      log(`  Got: ${failure.actual}`, 'yellow');
    });
  }
  
  const passRate = ((passedTests / totalTests) * 100).toFixed(1);
  log(`\nPass Rate: ${passRate}%`, passRate >= 90 ? 'green' : passRate >= 70 ? 'yellow' : 'red');
  
  // Algorithm category breakdown
  const categoryBreakdown = {
    'Greedy Algorithms': 0,
    'Dynamic Programming': 0,
    'Divide & Conquer': 0,
    'Backtracking': 0,
    'String Matching': 0,
    'Additional Tests': 0
  };
  
  log('\n📊 Algorithm Categories Tested:', 'cyan');
  log('✅ Greedy Algorithms: Fractional Knapsack, Job Sequencing, MST, Dijkstra', 'blue');
  log('✅ Dynamic Programming: 0/1 Knapsack, LCS, Matrix Chain, Floyd-Warshall', 'blue');
  log('✅ Divide & Conquer: Merge Sort, Quick Sort, Binary Search, Min-Max, Kadane', 'blue');
  log('✅ Backtracking: N-Queens, Subset Sum', 'blue');
  log('✅ String Matching: Naive, KMP Pattern Matching', 'blue');
  log('✅ Edge Cases: Empty arrays, Single elements, Duplicates, Large arrays', 'blue');
  
  if (passRate >= 95) {
    log('\n🎉 Excellent! All DAA algorithms are working perfectly.', 'green');
    log('📚 Your implementation covers all major algorithmic paradigms!', 'green');
  } else if (passRate >= 85) {
    log('\n👍 Great! Most algorithms are working well.', 'green');
    log('⚠️  A few minor issues to address.', 'yellow');
  } else if (passRate >= 70) {
    log('\n⚠️  Good progress, but some algorithms need attention.', 'yellow');
  } else {
    log('\n❌ Several algorithms have critical issues that need fixing.', 'red');
  }

  log('\n📋 Algorithm Difficulty Levels Tested:', 'cyan');
  log('🟢 Easy: Basic test cases with simple inputs', 'green');
  log('🟡 Medium: Moderate complexity with edge cases', 'yellow');
  log('🔴 Hard: Complex scenarios and performance tests', 'red');
  log('🟣 Expert: Advanced algorithms with larger datasets', 'magenta');
  log('⚫ Extreme: Maximum complexity with performance constraints', 'blue');
}

// Main execution
function main() {
  log(`${colors.bold}${colors.blue}Design and Analysis of Algorithms Test Suite${colors.reset}`);
  log(`${colors.cyan}Comprehensive testing for all DAA paradigms and algorithms${colors.reset}\n`);
  
  try {
    // Run all test categories
    runGreedyTests();
    runDynamicProgrammingTests();
    runDivideConquerTests();
    runBacktrackingTests();
    runStringMatchingTests();
    runAdditionalTests();
    
    printSummary();
    
    // Exit with appropriate code
    process.exit(failedTests > 0 ? 1 : 0);
    
  } catch (error) {
    log(`\n❌ Test execution failed: ${error.message}`, 'red');
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the tests
if (require.main === module) {
  main();
}

// Export functions for potential use in other files
module.exports = {
  // Greedy algorithms
  fractionalKnapsack,
  jobSequencing,
  primMST,
  dijkstra,
  
  // Dynamic programming
  knapsackDP,
  longestCommonSubsequence,
  matrixChainMultiplication,
  floydWarshall,
  
  // Divide and conquer
  mergeSort,
  quickSort,
  binarySearch,
  findMinMax,
  kadaneMaxSubarray,
  
  // Backtracking
  solveNQueens,
  subsetSum,
  
  // String matching
  naiveStringMatch,
  kmpStringMatch
};
