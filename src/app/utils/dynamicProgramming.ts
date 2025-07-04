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

// Bellman-Ford interfaces
export interface BellmanFordStep {
  iteration: number;
  description: string;
  action: string;
  edgeBeingRelaxed?: { from: number; to: number; weight: number };
  distances: number[];
  previous?: (number | null)[];
}

export interface BellmanFordResult {
  distances: number[];
  steps: BellmanFordStep[];
  hasNegativeCycle: boolean;
  negativeCycle?: number[];
  shortestPaths?: number[][];
}

// Bellman-Ford Algorithm for Single Source Shortest Path
export function bellmanFordAlgorithm(edges: { from: number; to: number; weight: number }[], numVertices: number, source: number): BellmanFordResult {
  const distances = Array(numVertices).fill(Infinity);
  const previous = Array(numVertices).fill(null);
  const steps: BellmanFordStep[] = [];
  
  distances[source] = 0;
  
  steps.push({
    iteration: 0,
    description: "Initialize distances",
    action: `Set source vertex ${source} distance to 0, all others to infinity`,
    distances: [...distances],
    previous: [...previous]
  });

  // Relax edges V-1 times
  for (let i = 0; i < numVertices - 1; i++) {
    let updated = false;
    
    for (const edge of edges) {
      if (distances[edge.from] !== Infinity && 
          distances[edge.from] + edge.weight < distances[edge.to]) {
        
        const oldDistance = distances[edge.to];
        distances[edge.to] = distances[edge.from] + edge.weight;
        previous[edge.to] = edge.from;
        updated = true;
        
        steps.push({
          iteration: i + 1,
          description: `Relaxing edge (${edge.from}, ${edge.to})`,
          action: `Update distance[${edge.to}]: ${oldDistance === Infinity ? '∞' : oldDistance} → ${distances[edge.to]}`,
          edgeBeingRelaxed: edge,
          distances: [...distances],
          previous: [...previous]
        });
      }
    }
    
    if (!updated) {
      steps.push({
        iteration: i + 1,
        description: `No updates in iteration ${i + 1}`,
        action: "Algorithm can terminate early - no more improvements possible",
        distances: [...distances],
        previous: [...previous]
      });
      break;
    }
  }

  // Check for negative cycles
  let hasNegativeCycle = false;
  const negativeCycle: number[] = [];
  
  for (const edge of edges) {
    if (distances[edge.from] !== Infinity && 
        distances[edge.from] + edge.weight < distances[edge.to]) {
      hasNegativeCycle = true;
      
      // Find vertices in negative cycle
      let current = edge.to;
      const visited = new Set<number>();
      
      while (!visited.has(current)) {
        visited.add(current);
        negativeCycle.push(current);
        current = previous[current];
        if (current === null) break;
      }
      
      steps.push({
        iteration: numVertices,
        description: "Negative cycle detection",
        action: `Negative cycle detected involving vertices: ${negativeCycle.join(', ')}`,
        edgeBeingRelaxed: edge,
        distances: [...distances],
        previous: [...previous]
      });
      break;
    }
  }
  
  if (!hasNegativeCycle) {
    steps.push({
      iteration: numVertices,
      description: "Negative cycle detection",
      action: "No negative cycles found - shortest paths are valid",
      distances: [...distances],
      previous: [...previous]
    });
  }

  return {
    distances,
    steps,
    hasNegativeCycle,
    negativeCycle: hasNegativeCycle ? negativeCycle : undefined
  };
}

// Multistage Graph interfaces
export interface MultistageGraphStep {
  stage: number;
  description: string;
  action: string;
  costs: { [nodeId: number]: number };
  decisions: { [nodeId: number]: number | null };
}

export interface MultistageGraphResult {
  minCost: number;
  optimalPath: number[];
  steps: MultistageGraphStep[];
}

// Multistage Graph Algorithm using Dynamic Programming
export function multistageGraphAlgorithm(
  edges: { from: number; to: number; weight: number }[], 
  nodes: { id: number; stage: number; label: string }[], 
  source: number, 
  target: number, 
  numStages: number
): MultistageGraphResult {
  const steps: MultistageGraphStep[] = [];
  const costs: { [nodeId: number]: number } = {};
  const decisions: { [nodeId: number]: number | null } = {};
  
  // Initialize all costs to infinity
  nodes.forEach(node => {
    costs[node.id] = Infinity;
    decisions[node.id] = null;
  });
  
  // Set target node cost to 0
  costs[target] = 0;
  
  steps.push({
    stage: numStages - 1,
    description: "Initialize target stage",
    action: `Set target node cost to 0, all others to infinity`,
    costs: { ...costs },
    decisions: { ...decisions }
  });

  // Work backwards from stage k-2 to 0
  for (let stage = numStages - 2; stage >= 0; stage--) {
    const stageNodes = nodes.filter(n => n.stage === stage);
    
    for (const node of stageNodes) {
      let minCost = Infinity;
      let bestNext = null;
      
      // Find all edges from this node to next stage
      const outgoingEdges = edges.filter(e => e.from === node.id);
      
      for (const edge of outgoingEdges) {
        const nextNodeCost = costs[edge.to];
        if (nextNodeCost !== Infinity) {
          const totalCost = edge.weight + nextNodeCost;
          if (totalCost < minCost) {
            minCost = totalCost;
            bestNext = edge.to;
          }
        }
      }
      
      costs[node.id] = minCost;
      decisions[node.id] = bestNext;
      
      steps.push({
        stage,
        description: `Process stage ${stage}`,
        action: `Node ${node.label}: min cost = ${minCost === Infinity ? '∞' : minCost}, next = ${bestNext !== null ? nodes.find(n => n.id === bestNext)?.label : 'none'}`,
        costs: { ...costs },
        decisions: { ...decisions }
      });
    }
  }

  // Reconstruct optimal path
  const optimalPath: number[] = [];
  let current: number | null = source;
  
  while (current !== null && current !== undefined) {
    optimalPath.push(current);
    current = decisions[current];
  }

  return {
    minCost: costs[source],
    optimalPath,
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

// TSP Dynamic Programming interfaces and functions
export interface TSPDPStep {
  mask: string;
  current: number;
  currentCity?: number;
  cost: number;
  description: string;
  action: string;
}

export interface TSPDPResult {
  minCost: number;
  optimalPath: number[];
  dpTable: { [key: string]: { cost: number; parent?: number } };
  steps: TSPDPStep[];
  statesComputed: number;
}

export function tspDynamicProgramming(costMatrix: number[][]): TSPDPResult {
  const n = costMatrix.length;
  if (n === 0) {
    return {
      minCost: 0,
      optimalPath: [],
      dpTable: {},
      steps: [],
      statesComputed: 0
    };
  }

  const dp: { [key: string]: { cost: number; parent?: number } } = {};
  const steps: TSPDPStep[] = [];
  let statesComputed = 0;

  // Initialize: start from city 0, visit only city 0 (mask = 1)
  dp["1-0"] = { cost: 0 };
  statesComputed++;
  steps.push({
    mask: "1",
    current: 0,
    currentCity: 0,
    cost: 0,
    description: "Starting at city 0 with no other cities visited",
    action: "Initialize starting position"
  });

  // Fill DP table
  for (let mask = 1; mask < (1 << n); mask++) {
    for (let current = 0; current < n; current++) {
      if (!(mask & (1 << current))) continue; // current city must be in the mask
      
      const key = `${mask}-${current}`;
      if (mask === 1 && current !== 0) continue; // Only start from city 0
      
      if (mask === 1) continue; // Already handled base case
      
      let minCost = Infinity;
      let bestParent = -1;
      
      for (let prev = 0; prev < n; prev++) {
        if (prev === current || !(mask & (1 << prev))) continue;
        
        const prevMask = mask ^ (1 << current); // Remove current city from mask
        const prevKey = `${prevMask}-${prev}`;
        
        if (dp[prevKey] && dp[prevKey].cost !== Infinity) {
          const cost = dp[prevKey].cost + costMatrix[prev][current];
          if (cost < minCost) {
            minCost = cost;
            bestParent = prev;
          }
        }
      }
      
      if (minCost !== Infinity) {
        dp[key] = { cost: minCost, parent: bestParent };
        statesComputed++;
        
        const visitedCities = [];
        for (let i = 0; i < n; i++) {
          if (mask & (1 << i)) visitedCities.push(i);
        }
        
        steps.push({
          mask: mask.toString(2).padStart(n, '0'),
          current,
          currentCity: current,
          cost: minCost,
          description: `At city ${current}, visited cities: {${visitedCities.join(', ')}}, cost: ${minCost}`,
          action: `Move to city ${current} from city ${bestParent}`
        });
      }
    }
  }

  // Find minimum cost to return to starting city
  let minFinalCost = Infinity;
  let lastCity = -1;
  const finalMask = (1 << n) - 1; // All cities visited
  
  for (let i = 1; i < n; i++) {
    const key = `${finalMask}-${i}`;
    if (dp[key] && costMatrix[i][0] !== Infinity) {
      const totalCost = dp[key].cost + costMatrix[i][0];
      if (totalCost < minFinalCost) {
        minFinalCost = totalCost;
        lastCity = i;
      }
    }
  }

  // Reconstruct path
  const path: number[] = [];
  if (lastCity !== -1 && minFinalCost !== Infinity) {
    let currentMask = finalMask;
    let currentCity = lastCity;
    
    path.unshift(currentCity);
    
    while (currentCity !== 0) {
      const key = `${currentMask}-${currentCity}`;
      const parent = dp[key]?.parent;
      if (parent === undefined) break;
      
      currentMask ^= (1 << currentCity);
      currentCity = parent;
      path.unshift(currentCity);
    }
    
    steps.push({
      mask: finalMask.toString(2).padStart(n, '0'),
      current: 0,
      currentCity: 0,
      cost: minFinalCost,
      description: `Final step: return to starting city 0, total cost: ${minFinalCost}`,
      action: `Return to starting city 0 from city ${lastCity}`
    });
  }

  return {
    minCost: minFinalCost,
    optimalPath: path,
    dpTable: dp,
    steps,
    statesComputed
  };
}
