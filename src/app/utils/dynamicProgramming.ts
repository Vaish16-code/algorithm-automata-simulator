// Dynamic Programming Algorithms

// 0/1 Knapsack interfaces
export interface KnapsackItem {
  index: number;
  weight: number;
  value: number;
}

export interface KnapsackDPResult {
  maxValue: number;
  selectedItems: KnapsackItem[];
  dpTable: number[][];
  steps: string[];
}

// 0/1 Knapsack Algorithm using Dynamic Programming
export function knapsackDP(capacity: number, weights: number[], values: number[]): KnapsackDPResult {
  const n = weights.length;
  const dp: number[][] = Array(n + 1).fill(null).map(() => Array(capacity + 1).fill(0));
  const steps: string[] = [];
  
  steps.push("Initialize DP table with zeros");
  
  // Fill the DP table
  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        const include = values[i - 1] + dp[i - 1][w - weights[i - 1]];
        const exclude = dp[i - 1][w];
        
        dp[i][w] = Math.max(include, exclude);
        
        if (include > exclude) {
          steps.push(`Item ${i}: Include (value=${values[i - 1]}, weight=${weights[i - 1]})`);
        } else {
          steps.push(`Item ${i}: Exclude (better to keep previous solution)`);
        }
      } else {
        dp[i][w] = dp[i - 1][w];
        steps.push(`Item ${i}: Cannot fit (weight=${weights[i - 1]} > capacity=${w})`);
      }
    }
  }
  
  // Backtrack to find selected items
  const selectedItems: KnapsackItem[] = [];
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
  
  return {
    maxValue: dp[n][capacity],
    selectedItems,
    dpTable: dp,
    steps
  };
}

// Longest Common Subsequence interfaces
export interface LCSResult {
  length: number;
  lcs: string;
  dpTable: number[][];
  steps: string[];
}

// Longest Common Subsequence Algorithm
export function longestCommonSubsequence(str1: string, str2: string): LCSResult {
  const m = str1.length;
  const n = str2.length;
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
  const steps: string[] = [];
  
  steps.push("Initialize DP table for LCS");
  
  // Fill the DP table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        steps.push(`Match found: '${str1[i - 1]}' at position (${i},${j})`);
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        steps.push(`No match: take max of top (${dp[i - 1][j]}) or left (${dp[i][j - 1]})`);
      }
    }
  }
  
  // Backtrack to find the LCS
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
  
  return {
    length: dp[m][n],
    lcs,
    dpTable: dp,
    steps
  };
}

// Matrix Chain Multiplication interfaces
export interface MatrixChainResult {
  minMultiplications: number;
  dpTable: number[][];
  optimalParentheses: string;
  steps: string[];
}

// Matrix Chain Multiplication Algorithm
export function matrixChainMultiplication(dimensions: number[]): MatrixChainResult {
  const n = dimensions.length - 1; // number of matrices
  const dp: number[][] = Array(n).fill(null).map(() => Array(n).fill(0));
  const steps: string[] = [];
  
  steps.push("Initialize DP table for Matrix Chain Multiplication");
  
  // Fill the DP table
  for (let length = 2; length <= n; length++) {
    for (let i = 0; i <= n - length; i++) {
      const j = i + length - 1;
      dp[i][j] = Infinity;
      
      for (let k = i; k < j; k++) {
        const cost = dp[i][k] + dp[k + 1][j] + dimensions[i] * dimensions[k + 1] * dimensions[j + 1];
        
        if (cost < dp[i][j]) {
          dp[i][j] = cost;
          steps.push(`Matrix chain (${i},${j}): Split at ${k}, cost = ${cost}`);
        }
      }
    }
  }
  
  // Generate optimal parentheses
  const getOptimalParens = (i: number, j: number): string => {
    if (i === j) {
      return `M${i + 1}`;
    } else {
      let minK = i;
      let minCost = Infinity;
      
      for (let k = i; k < j; k++) {
        const cost = dp[i][k] + dp[k + 1][j] + dimensions[i] * dimensions[k + 1] * dimensions[j + 1];
        if (cost < minCost) {
          minCost = cost;
          minK = k;
        }
      }
      
      return `(${getOptimalParens(i, minK)} × ${getOptimalParens(minK + 1, j)})`;
    }
  };
  
  return {
    minMultiplications: dp[0][n - 1],
    dpTable: dp,
    optimalParentheses: getOptimalParens(0, n - 1),
    steps
  };
}

// Floyd-Warshall interfaces
export interface FloydWarshallResult {
  distances: number[][];
  steps: string[];
  hasNegativeCycle: boolean;
}

// Floyd-Warshall Algorithm for All-Pairs Shortest Path
export function floydWarshall(graph: number[][]): FloydWarshallResult {
  const n = graph.length;
  const dist: number[][] = graph.map(row => [...row]);
  const steps: string[] = [];
  const INF = Infinity;
  
  steps.push("Initialize distance matrix with input graph");
  
  for (let k = 0; k < n; k++) {
    steps.push(`Using vertex ${k} as intermediate vertex`);
    
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][k] !== INF && dist[k][j] !== INF && 
            dist[i][k] + dist[k][j] < dist[i][j]) {
          const oldDist = dist[i][j];
          dist[i][j] = dist[i][k] + dist[k][j];
          steps.push(`Update dist[${i}][${j}]: ${oldDist} → ${dist[i][j]} via vertex ${k}`);
        }
      }
    }
  }
  
  // Check for negative cycles
  let hasNegativeCycle = false;
  for (let i = 0; i < n; i++) {
    if (dist[i][i] < 0) {
      hasNegativeCycle = true;
      steps.push(`Negative cycle detected at vertex ${i}`);
      break;
    }
  }
  
  return {
    distances: dist,
    steps,
    hasNegativeCycle
  };
}
