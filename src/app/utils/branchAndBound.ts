// Branch and Bound Algorithms

// Travelling Salesman Problem interfaces
export interface TSPStep {
  step: number;
  description: string;
  currentPath: number[];
  currentCost: number;
  bound: number;
  level: number;
  pruned: boolean;
}

export interface TSPResult {
  minCost: number;
  optimalPath: number[];
  steps: TSPStep[];
  totalNodes: number;
  prunedNodes: number;
}

// Travelling Salesman Problem using Branch and Bound
export function travelingSalesman(costMatrix: number[][]): TSPResult {
  const n = costMatrix.length;
  const steps: TSPStep[] = [];
  let stepCount = 0;
  let totalNodes = 0;
  let prunedNodes = 0;
  let minCost = Infinity;
  let optimalPath: number[] = [];
  const INF = Infinity;

  // Calculate lower bound for a node
  function calculateBound(path: number[], visited: boolean[]): number {
    let bound = 0;
    
    // Add cost of path so far
    for (let i = 0; i < path.length - 1; i++) {
      bound += costMatrix[path[i]][path[i + 1]];
    }
    
    // Add minimum outgoing edges for unvisited vertices
    for (let i = 0; i < n; i++) {
      if (!visited[i]) {
        let minEdge = INF;
        for (let j = 0; j < n; j++) {
          if (i !== j && costMatrix[i][j] < minEdge) {
            minEdge = costMatrix[i][j];
          }
        }
        if (minEdge !== INF) {
          bound += minEdge;
        }
      }
    }
    
    // Add cost to return to start if path is complete
    if (path.length === n) {
      bound += costMatrix[path[path.length - 1]][0];
    }
    
    return bound;
  }

  function branchAndBound(path: number[], visited: boolean[], level: number, currentCost: number): void {
    totalNodes++;
    
    if (level === n) {
      // Complete tour - add return cost
      const totalCost = currentCost + costMatrix[path[path.length - 1]][0];
      
      steps.push({
        step: stepCount++,
        description: `Complete tour found with cost ${totalCost}`,
        currentPath: [...path, 0],
        currentCost: totalCost,
        bound: totalCost,
        level,
        pruned: false
      });
      
      if (totalCost < minCost) {
        minCost = totalCost;
        optimalPath = [...path, 0];
        
        steps.push({
          step: stepCount++,
          description: `New best solution found! Cost: ${totalCost}`,
          currentPath: [...path, 0],
          currentCost: totalCost,
          bound: totalCost,
          level,
          pruned: false
        });
      }
      return;
    }

    for (let i = 1; i < n; i++) {
      if (!visited[i]) {
        const newPath = [...path, i];
        const newCost = currentCost + costMatrix[path[path.length - 1]][i];
        const newVisited = [...visited];
        newVisited[i] = true;
        
        const bound = calculateBound(newPath, newVisited);
        
        steps.push({
          step: stepCount++,
          description: `Exploring city ${i}, cost: ${newCost}, bound: ${bound}`,
          currentPath: [...newPath],
          currentCost: newCost,
          bound,
          level: level + 1,
          pruned: false
        });

        if (bound < minCost) {
          branchAndBound(newPath, newVisited, level + 1, newCost);
        } else {
          prunedNodes++;
          steps.push({
            step: stepCount++,
            description: `Pruned: bound ${bound} >= current best ${minCost}`,
            currentPath: [...newPath],
            currentCost: newCost,
            bound,
            level: level + 1,
            pruned: true
          });
        }
      }
    }
  }

  // Initialize
  const visited = new Array(n).fill(false);
  visited[0] = true;
  
  steps.push({
    step: stepCount++,
    description: `Starting TSP with ${n} cities, beginning at city 0`,
    currentPath: [0],
    currentCost: 0,
    bound: calculateBound([0], visited),
    level: 0,
    pruned: false
  });

  branchAndBound([0], visited, 1, 0);

  return {
    minCost,
    optimalPath,
    steps,
    totalNodes,
    prunedNodes
  };
}

// 15-Puzzle interfaces
export interface PuzzleState {
  board: number[][];
  emptyPos: { row: number; col: number };
  cost: number;
  heuristic: number;
  depth: number;
  path: string[];
}

export interface FifteenPuzzleStep {
  step: number;
  description: string;
  board: number[][];
  move: string;
  cost: number;
  heuristic: number;
  total: number;
}

export interface FifteenPuzzleResult {
  solved: boolean;
  solution: string[];
  steps: FifteenPuzzleStep[];
  totalMoves: number;
  nodesExplored: number;
}

// 15-Puzzle using Branch and Bound (A* algorithm)
export function fifteenPuzzle(initialBoard: number[][], targetBoard: number[][]): FifteenPuzzleResult {
  const steps: FifteenPuzzleStep[] = [];
  let stepCount = 0;
  let nodesExplored = 0;

  // Check if puzzle is solvable
  function isSolvable(board: number[][]): boolean {
    const size = board.length;
    const flatBoard = board.flat();
    
    // Count inversions (pairs where larger number appears before smaller number)
    let inversions = 0;
    for (let i = 0; i < flatBoard.length - 1; i++) {
      for (let j = i + 1; j < flatBoard.length; j++) {
        if (flatBoard[i] !== 0 && flatBoard[j] !== 0 && flatBoard[i] > flatBoard[j]) {
          inversions++;
        }
      }
    }
    
    // Find row of empty space (counting from bottom)
    let emptyRow = 0;
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (board[i][j] === 0) {
          emptyRow = size - i; // Count from bottom (1-indexed)
          break;
        }
      }
    }
    
    // For 4x4 grid (15-puzzle):
    // - If empty space is on even row (counting from bottom), then inversions must be odd
    // - If empty space is on odd row (counting from bottom), then inversions must be even
    if (size === 4) {
      if (emptyRow % 2 === 0) {
        return inversions % 2 === 1;
      } else {
        return inversions % 2 === 0;
      }
    }
    
    // For odd grid sizes (like 3x3), inversions must be even
    return inversions % 2 === 0;
  }

  // Early solvability check
  if (!isSolvable(initialBoard)) {
    steps.push({
      step: stepCount++,
      description: `Puzzle is mathematically unsolvable. The initial configuration cannot reach the target state.`,
      board: initialBoard.map(row => [...row]),
      move: 'UNSOLVABLE',
      cost: 0,
      heuristic: 0,
      total: 0
    });
    
    return {
      solved: false,
      solution: [],
      steps,
      totalMoves: 0,
      nodesExplored: 0
    };
  }

  // Calculate Manhattan distance heuristic
  function calculateHeuristic(board: number[][]): number {
    let distance = 0;
    const size = board.length;
    
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const value = board[i][j];
        if (value !== 0) {
          // Find target position
          for (let ti = 0; ti < size; ti++) {
            for (let tj = 0; tj < size; tj++) {
              if (targetBoard[ti][tj] === value) {
                distance += Math.abs(i - ti) + Math.abs(j - tj);
                break;
              }
            }
          }
        }
      }
    }
    return distance;
  }

  // Check if board matches target
  function isGoalState(board: number[][]): boolean {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[0].length; j++) {
        if (board[i][j] !== targetBoard[i][j]) {
          return false;
        }
      }
    }
    return true;
  }

  // Find empty space position
  function findEmptySpace(board: number[][]): { row: number; col: number } {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[0].length; j++) {
        if (board[i][j] === 0) {
          return { row: i, col: j };
        }
      }
    }
    return { row: -1, col: -1 };
  }

  // Generate possible moves
  function generateMoves(state: PuzzleState): PuzzleState[] {
    const moves: PuzzleState[] = [];
    const { row, col } = state.emptyPos;
    const size = state.board.length;
    const directions = [
      { dr: -1, dc: 0, move: 'UP' },
      { dr: 1, dc: 0, move: 'DOWN' },
      { dr: 0, dc: -1, move: 'LEFT' },
      { dr: 0, dc: 1, move: 'RIGHT' }
    ];

    for (const dir of directions) {
      const newRow = row + dir.dr;
      const newCol = col + dir.dc;
      
      if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size) {
        const newBoard = state.board.map(row => [...row]);
        newBoard[row][col] = newBoard[newRow][newCol];
        newBoard[newRow][newCol] = 0;
        
        const newState: PuzzleState = {
          board: newBoard,
          emptyPos: { row: newRow, col: newCol },
          cost: state.cost + 1,
          heuristic: calculateHeuristic(newBoard),
          depth: state.depth + 1,
          path: [...state.path, dir.move]
        };
        
        moves.push(newState);
      }
    }
    
    return moves;
  }

  // Priority queue simulation (simplified for demo)
  const queue: PuzzleState[] = [];
  const visited = new Set<string>();
  
  const initialState: PuzzleState = {
    board: initialBoard.map(row => [...row]),
    emptyPos: findEmptySpace(initialBoard),
    cost: 0,
    heuristic: calculateHeuristic(initialBoard),
    depth: 0,
    path: []
  };
  
  queue.push(initialState);
  
  steps.push({
    step: stepCount++,
    description: `Starting 15-Puzzle with initial heuristic ${initialState.heuristic}`,
    board: initialState.board.map(row => [...row]),
    move: 'START',
    cost: 0,
    heuristic: initialState.heuristic,
    total: initialState.heuristic
  });

  while (queue.length > 0 && stepCount < 20) { // Limit steps for demo
    // Sort by f(n) = g(n) + h(n)
    queue.sort((a, b) => (a.cost + a.heuristic) - (b.cost + b.heuristic));
    const currentState = queue.shift()!;
    nodesExplored++;
    
    const stateKey = JSON.stringify(currentState.board);
    if (visited.has(stateKey)) continue;
    visited.add(stateKey);
    
    if (isGoalState(currentState.board)) {
      steps.push({
        step: stepCount++,
        description: `Solution found! Total moves: ${currentState.path.length}`,
        board: currentState.board.map(row => [...row]),
        move: 'SOLVED',
        cost: currentState.cost,
        heuristic: 0,
        total: currentState.cost
      });
      
      return {
        solved: true,
        solution: currentState.path,
        steps,
        totalMoves: currentState.path.length,
        nodesExplored
      };
    }
    
    const moves = generateMoves(currentState);
    for (const move of moves) {
      const moveStateKey = JSON.stringify(move.board);
      if (!visited.has(moveStateKey)) {
        queue.push(move);
        
        steps.push({
          step: stepCount++,
          description: `Move ${move.path[move.path.length - 1]}: cost=${move.cost}, h=${move.heuristic}`,
          board: move.board.map(row => [...row]),
          move: move.path[move.path.length - 1] || '',
          cost: move.cost,
          heuristic: move.heuristic,
          total: move.cost + move.heuristic
        });
      }
    }
  }

  return {
    solved: false,
    solution: [],
    steps,
    totalMoves: 0,
    nodesExplored
  };
}
