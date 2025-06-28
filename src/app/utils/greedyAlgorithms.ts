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
    } else {
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
    totalProfit,
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