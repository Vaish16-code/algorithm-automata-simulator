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
  from: string;
  to: string;
  weight: number;
}

export interface Graph {
  vertices: string[];
  edges: Edge[];
}

export interface MSTEdge extends Edge {
  step: number;
}

export interface PrimResult {
  totalWeight: number;
  mstEdges: MSTEdge[];
  steps: string[];
  allEdges: Edge[];
}

// Prim's Algorithm for Minimum Spanning Tree
export function primMST(graph: Graph): PrimResult {
  const { vertices, edges } = graph;
  const mstEdges: MSTEdge[] = [];
  const visited = new Set<string>();
  const steps: string[] = [];
  let totalWeight = 0;
  let stepCount = 1;

  if (vertices.length === 0) {
    return { totalWeight: 0, mstEdges: [], steps: [], allEdges: edges };
  }

  // Start with first vertex (alphabetically sorted for consistency)
  const sortedVertices = vertices.sort();
  const startVertex = sortedVertices[0];
  visited.add(startVertex);
  
  steps.push(`Step ${stepCount}: Start with vertex ${startVertex}`);
  steps.push(`Visited vertices: {${startVertex}}`);
  steps.push('');
  stepCount++;

  while (visited.size < vertices.length) {
    let minEdge: Edge | null = null;
    let minWeight = Infinity;
    const availableEdges: Edge[] = [];

    // Find all edges connecting visited to unvisited vertices
    for (const edge of edges) {
      const { from, to, weight } = edge;
      
      if ((visited.has(from) && !visited.has(to)) || 
          (visited.has(to) && !visited.has(from))) {
        availableEdges.push(edge);
        if (weight < minWeight) {
          minWeight = weight;
          minEdge = edge;
        }
      }
    }

    if (minEdge) {
      const newVertex = visited.has(minEdge.from) ? minEdge.to : minEdge.from;
      
      // Show available edges at this step
      const availableEdgesStr = availableEdges
        .sort((a, b) => a.weight - b.weight)
        .map(e => {
          const fromVertex = visited.has(e.from) ? e.from : e.to;
          const toVertex = visited.has(e.from) ? e.to : e.from;
          return `(${fromVertex}, ${toVertex}): ${e.weight}`;
        })
        .join(', ');
      
      steps.push(`Step ${stepCount}: Available edges from visited vertices: ${availableEdgesStr}`);
      
      // Add the minimum edge
      visited.add(newVertex);
      const mstEdgeWithStep: MSTEdge = { ...minEdge, step: mstEdges.length };
      mstEdges.push(mstEdgeWithStep);
      totalWeight += minEdge.weight;
      
      const fromVertex = visited.has(minEdge.from) ? minEdge.from : minEdge.to;
      const toVertex = visited.has(minEdge.from) ? minEdge.to : minEdge.from;
      
      steps.push(`Choose minimum weight edge (${fromVertex}, ${toVertex}) with weight ${minEdge.weight}`);
      steps.push(`Add vertex ${newVertex} to MST`);
      steps.push(`Visited vertices: {${Array.from(visited).sort().join(', ')}}`);
      steps.push(`Total weight so far: ${totalWeight}`);
      steps.push('');
      stepCount++;
    } else {
      steps.push(`No more edges available - graph may be disconnected`);
      break;
    }
  }

  if (mstEdges.length === vertices.length - 1) {
    steps.push(`MST Complete!`);
    steps.push(`Minimum spanning tree weight: ${totalWeight}`);
  }

  return { totalWeight, mstEdges, steps, allEdges: edges };
}

// Kruskal's Algorithm interfaces
export interface KruskalResult {
  totalWeight: number;
  mstEdges: MSTEdge[];
  steps: string[];
  allEdges: Edge[];
}

// Union-Find data structure for cycle detection
class UnionFind {
  parent: Map<string, string>;
  rank: Map<string, number>;

  constructor(vertices: string[]) {
    this.parent = new Map();
    this.rank = new Map();
    
    for (const vertex of vertices) {
      this.parent.set(vertex, vertex);
      this.rank.set(vertex, 0);
    }
  }

  find(x: string): string {
    if (this.parent.get(x) !== x) {
      this.parent.set(x, this.find(this.parent.get(x)!));
    }
    return this.parent.get(x)!;
  }

  union(x: string, y: string): boolean {
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) return false;

    const rankX = this.rank.get(rootX)!;
    const rankY = this.rank.get(rootY)!;

    if (rankX < rankY) {
      this.parent.set(rootX, rootY);
    } else if (rankX > rankY) {
      this.parent.set(rootY, rootX);
    } else {
      this.parent.set(rootY, rootX);
      this.rank.set(rootX, rankX + 1);
    }
    return true;
  }
}

export function kruskalMST(graph: Graph): KruskalResult {
  const { vertices, edges } = graph;
  const mstEdges: MSTEdge[] = [];
  const steps: string[] = [];
  let totalWeight = 0;
  let stepCount = 1;

  if (vertices.length === 0 || edges.length === 0) {
    return { totalWeight: 0, mstEdges: [], steps: [], allEdges: edges };
  }

  // Sort edges by weight (ascending order)
  const sortedEdges = [...edges].sort((a, b) => {
    if (a.weight !== b.weight) return a.weight - b.weight;
    // If weights are equal, sort by vertex names for consistency
    if (a.from !== b.from) return a.from.localeCompare(b.from);
    return a.to.localeCompare(b.to);
  });
  
  steps.push(`Step ${stepCount}: Sort all edges by weight`);
  steps.push(`Sorted edges: ${sortedEdges.map(e => `(${e.from}, ${e.to}): ${e.weight}`).join(', ')}`);
  steps.push('');
  stepCount++;

  // Initialize Union-Find data structure
  const unionFind = new UnionFind(vertices);
  
  steps.push(`Step ${stepCount}: Initialize Union-Find structure`);
  steps.push(`Each vertex is its own parent: ${vertices.map(v => `${v} -> ${v}`).join(', ')}`);
  steps.push('');
  stepCount++;

  // Process each edge in sorted order
  for (let i = 0; i < sortedEdges.length; i++) {
    const edge = sortedEdges[i];
    const { from, to, weight } = edge;
    
    steps.push(`Step ${stepCount}: Consider edge (${from}, ${to}) with weight ${weight}`);
    
    // Check if vertices are in same component (would create cycle)
    const rootFrom = unionFind.find(from);
    const rootTo = unionFind.find(to);
    
    if (rootFrom !== rootTo) {
      // No cycle, add edge to MST
      unionFind.union(from, to);
      const mstEdgeWithStep: MSTEdge = { ...edge, step: mstEdges.length };
      mstEdges.push(mstEdgeWithStep);
      totalWeight += weight;
      
      steps.push(`✓ Add edge (${from}, ${to}) - No cycle formed`);
      steps.push(`Union: ${from} and ${to} are now connected`);
      steps.push(`MST edges: ${mstEdges.map(e => `(${e.from}, ${e.to}): ${e.weight}`).join(', ')}`);
      steps.push(`Total weight: ${totalWeight}`);
    } else {
      // Cycle detected, reject edge
      steps.push(`✗ Reject edge (${from}, ${to}) - Creates cycle`);
      steps.push(`${from} and ${to} already connected (same component: ${rootFrom})`);
    }
    
    steps.push('');
    stepCount++;

    // Stop when we have vertices-1 edges (complete MST)
    if (mstEdges.length === vertices.length - 1) {
      steps.push(`MST Complete!`);
      steps.push(`Total edges in MST: ${mstEdges.length} (= vertices - 1)`);
      steps.push(`Minimum spanning tree weight: ${totalWeight}`);
      break;
    }
  }

  return { totalWeight, mstEdges, steps, allEdges: edges };
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