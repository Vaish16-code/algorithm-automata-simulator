// utils/greedyAlgorithms.ts

export interface KnapsackItem {
  index: number;
  weight: number;
  profit: number;
  ratio: number;
}

export interface SelectedItem {
  index: number;
  fraction: number;
  profit: number;
}

export interface KnapsackResult {
  totalProfit: number;
  selectedItems: SelectedItem[];
}

export function fractionalKnapsack(
  capacity: number,
  weights: number[],
  profits: number[]
): KnapsackResult {
  // Create items with profit-to-weight ratio
  const items: KnapsackItem[] = weights.map((weight, index) => ({
    index: index + 1, // 1-based indexing for display
    weight,
    profit: profits[index],
    ratio: profits[index] / weight
  }));

  // Sort items by profit-to-weight ratio in descending order
  items.sort((a, b) => b.ratio - a.ratio);

  let totalProfit = 0;
  let remainingCapacity = capacity;
  const selectedItems: SelectedItem[] = [];

  for (const item of items) {
    if (remainingCapacity === 0) break;

    if (item.weight <= remainingCapacity) {
      // Take the entire item
      selectedItems.push({
        index: item.index,
        fraction: 1,
        profit: item.profit
      });
      totalProfit += item.profit;
      remainingCapacity -= item.weight;
    } else if (remainingCapacity > 0) {
      // Take a fraction of the item
      const fraction = remainingCapacity / item.weight;
      const fractionalProfit = item.profit * fraction;
      
      selectedItems.push({
        index: item.index,
        fraction,
        profit: fractionalProfit
      });
      totalProfit += fractionalProfit;
      remainingCapacity = 0;
    }
  }

  return {
    totalProfit: Math.round(totalProfit * 100) / 100, // Round to 2 decimal places
    selectedItems
  };
}

// Job Sequencing interfaces
export interface Job {
  id: number;
  deadline: number;
  profit: number;
}

export interface ScheduledJob extends Job {
  scheduledTime: number;
}

export interface JobSequencingResult {
  maxProfit: number;
  selectedJobs: ScheduledJob[];
  timeline: (ScheduledJob | null)[];
}

// Job Sequencing with Deadlines Algorithm
export function jobSequencing(jobs: Job[]): JobSequencingResult {
  // Sort jobs by profit in descending order
  const sortedJobs = [...jobs].sort((a, b) => b.profit - a.profit);
  
  // Find maximum deadline to determine timeline length
  const maxDeadline = Math.max(...jobs.map(job => job.deadline));
  
  // Initialize timeline array
  const timeline: (ScheduledJob | null)[] = new Array(maxDeadline).fill(null);
  const selectedJobs: ScheduledJob[] = [];
  let maxProfit = 0;
  
  // Try to schedule each job
  for (const job of sortedJobs) {
    // Try to schedule the job at the latest possible time (before deadline)
    for (let time = Math.min(job.deadline - 1, maxDeadline - 1); time >= 0; time--) {
      if (timeline[time] === null) {
        const scheduledJob: ScheduledJob = { ...job, scheduledTime: time + 1 };
        timeline[time] = scheduledJob;
        selectedJobs.push(scheduledJob);
        maxProfit += job.profit;
        break;
      }
    }
  }
  
  return {
    maxProfit,
    selectedJobs: selectedJobs.sort((a, b) => a.scheduledTime - b.scheduledTime),
    timeline
  };
}

// Graph and MST interfaces
export interface Edge {
  from: number;
  to: number;
  weight: number;
}

export interface Graph {
  vertices: number;
  edges: Edge[];
}

export interface MSTEdge extends Edge {
  step: number;
}

export interface PrimResult {
  totalWeight: number;
  mstEdges: MSTEdge[];
  steps: string[];
}

// Prim's Algorithm for Minimum Spanning Tree
export function primMST(graph: Graph): PrimResult {
  const { vertices, edges } = graph;
  const mstEdges: MSTEdge[] = [];
  const visited = new Set<number>();
  const steps: string[] = [];
  let totalWeight = 0;
  let stepCount = 0;

  // Start with vertex 0
  visited.add(0);
  steps.push("Start with vertex 0");

  while (visited.size < vertices) {
    let minEdge: Edge | null = null;
    let minWeight = Infinity;

    // Find minimum weight edge connecting visited to unvisited vertex
    for (const edge of edges) {
      const { from, to, weight } = edge;
      
      if ((visited.has(from) && !visited.has(to)) || 
          (visited.has(to) && !visited.has(from))) {
        if (weight < minWeight) {
          minWeight = weight;
          minEdge = edge;
        }
      }
    }

    if (minEdge) {
      const newVertex = visited.has(minEdge.from) ? minEdge.to : minEdge.from;
      visited.add(newVertex);
      
      const mstEdgeWithStep: MSTEdge = { ...minEdge, step: stepCount++ };
      mstEdges.push(mstEdgeWithStep);
      totalWeight += minEdge.weight;
      
      steps.push(`Add edge (${minEdge.from}, ${minEdge.to}) with weight ${minEdge.weight}`);
    }
  }

  return { totalWeight, mstEdges, steps };
}

// Kruskal's Algorithm interfaces
export interface KruskalResult {
  totalWeight: number;
  mstEdges: MSTEdge[];
  steps: string[];
}

// Union-Find data structure for cycle detection
class UnionFind {
  parent: number[];
  rank: number[];

  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);
  }

  find(x: number): number {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(x: number, y: number): boolean {
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) return false;

    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }
    return true;
  }
}

export function kruskalMST(graph: Graph): KruskalResult {
  const { vertices, edges } = graph;
  const mstEdges: MSTEdge[] = [];
  const steps: string[] = [];
  let totalWeight = 0;
  let stepCount = 0;

  // Sort edges by weight
  const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
  steps.push(`Sort edges by weight: ${sortedEdges.map(e => `(${e.from},${e.to}):${e.weight}`).join(', ')}`);

  const unionFind = new UnionFind(vertices);

  for (const edge of sortedEdges) {
    const { from, to, weight } = edge;
    
    // Check if adding this edge creates a cycle
    if (unionFind.union(from, to)) {
      const mstEdgeWithStep: MSTEdge = { ...edge, step: stepCount++ };
      mstEdges.push(mstEdgeWithStep);
      totalWeight += weight;
      steps.push(`Add edge (${from}, ${to}) with weight ${weight} - no cycle formed`);
    } else {
      steps.push(`Skip edge (${from}, ${to}) with weight ${weight} - would create cycle`);
    }

    // Stop when we have vertices-1 edges
    if (mstEdges.length === vertices - 1) {
      break;
    }
  }

  return { totalWeight, mstEdges, steps };
}

// Dijkstra's Algorithm interfaces and implementation
export interface DijkstraStep {
  step: number;
  currentNode: number | null;
  description: string;
  action: string;
  distances: number[];
  visited: number[];
  previous: (number | null)[];
  edgesInPath?: { from: number; to: number }[];
}

export interface DijkstraResult {
  distances: number[];
  previous: (number | null)[];
  steps: DijkstraStep[];
  shortestPaths: number[][];
}

export function dijkstraAlgorithm(graph: number[][], source: number): DijkstraResult {
  const n = graph.length;
  const distances = new Array(n).fill(Infinity);
  const visited = new Array(n).fill(false);
  const previous = new Array(n).fill(null);
  const steps: DijkstraStep[] = [];
  const visitedNodes: number[] = [];

  // Initialize source distance
  distances[source] = 0;

  // Add initial step
  steps.push({
    step: 0,
    currentNode: null,
    description: "Initialize distances",
    action: `Set distance to source vertex ${source} = 0, all others = ∞`,
    distances: [...distances],
    visited: [...visitedNodes],
    previous: [...previous]
  });

  for (let count = 0; count < n; count++) {
    // Find the unvisited vertex with minimum distance
    let minDistance = Infinity;
    let currentNode = -1;

    for (let v = 0; v < n; v++) {
      if (!visited[v] && distances[v] < minDistance) {
        minDistance = distances[v];
        currentNode = v;
      }
    }

    // If no unvisited vertex is reachable, break
    if (currentNode === -1) break;

    // Mark the current vertex as visited
    visited[currentNode] = true;
    visitedNodes.push(currentNode);

    steps.push({
      step: steps.length,
      currentNode,
      description: `Select vertex ${currentNode} with minimum distance ${distances[currentNode]}`,
      action: `Mark vertex ${currentNode} as visited`,
      distances: [...distances],
      visited: [...visitedNodes],
      previous: [...previous]
    });

    // Update distances to adjacent vertices
    let updatedAny = false;
    for (let v = 0; v < n; v++) {
      if (!visited[v] && graph[currentNode][v] !== Infinity && graph[currentNode][v] > 0) {
        const newDistance = distances[currentNode] + graph[currentNode][v];
        if (newDistance < distances[v]) {
          distances[v] = newDistance;
          previous[v] = currentNode;
          updatedAny = true;
        }
      }
    }

    if (updatedAny) {
      steps.push({
        step: steps.length,
        currentNode,
        description: `Update distances to neighbors of vertex ${currentNode}`,
        action: `Relax edges from vertex ${currentNode}`,
        distances: [...distances],
        visited: [...visitedNodes],
        previous: [...previous]
      });
    }
  }

  // Generate shortest paths
  const shortestPaths: number[][] = [];
  for (let v = 0; v < n; v++) {
    const path: number[] = [];
    let current = v;
    
    if (distances[v] === Infinity) {
      shortestPaths[v] = [];
      continue;
    }

    while (current !== null) {
      path.unshift(current);
      current = previous[current];
    }
    shortestPaths[v] = path;
  }

  // Add final step
  steps.push({
    step: steps.length,
    currentNode: null,
    description: "Algorithm completed",
    action: "All vertices processed, shortest paths found",
    distances: [...distances],
    visited: [...visitedNodes],
    previous: [...previous]
  });

  return {
    distances,
    previous,
    steps,
    shortestPaths
  };
}