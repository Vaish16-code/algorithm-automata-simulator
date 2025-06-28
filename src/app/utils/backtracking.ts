// Backtracking Algorithms

// N-Queens interfaces
export interface QueenPosition {
  row: number;
  col: number;
}

export interface NQueensStep {
  step: number;
  action: string;
  board: number[][];
  placedQueens: QueenPosition[];
  currentRow: number;
  currentCol: number;
  isValid: boolean;
  backtrack: boolean;
}

export interface NQueensResult {
  solutions: number[][][];
  steps: NQueensStep[];
  totalSolutions: number;
}

// N-Queens Problem Algorithm
export function nQueens(n: number): NQueensResult {
  const solutions: number[][][] = [];
  const steps: NQueensStep[] = [];
  let stepCount = 0;

  function isSafe(board: number[][], row: number, col: number): boolean {
    // Check this column on upper rows
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

  function getPlacedQueens(board: number[][]): QueenPosition[] {
    const queens: QueenPosition[] = [];
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (board[i][j] === 1) {
          queens.push({ row: i, col: j });
        }
      }
    }
    return queens;
  }

  function solveNQueens(board: number[][], row: number): boolean {
    if (row >= n) {
      // Found a solution
      const solution = board.map(row => [...row]);
      solutions.push(solution);
      
      steps.push({
        step: stepCount++,
        action: `Solution found! All ${n} queens placed safely.`,
        board: solution,
        placedQueens: getPlacedQueens(solution),
        currentRow: row,
        currentCol: -1,
        isValid: true,
        backtrack: false
      });
      
      return true;
    }

    for (let col = 0; col < n; col++) {
      const isValidPosition = isSafe(board, row, col);
      
      steps.push({
        step: stepCount++,
        action: `Trying to place queen at position (${row}, ${col})`,
        board: board.map(row => [...row]),
        placedQueens: getPlacedQueens(board),
        currentRow: row,
        currentCol: col,
        isValid: isValidPosition,
        backtrack: false
      });

      if (isValidPosition) {
        board[row][col] = 1;
        
        steps.push({
          step: stepCount++,
          action: `Queen placed at (${row}, ${col}). Position is safe.`,
          board: board.map(row => [...row]),
          placedQueens: getPlacedQueens(board),
          currentRow: row,
          currentCol: col,
          isValid: true,
          backtrack: false
        });

        if (solveNQueens(board, row + 1)) {
          return true;
        }

        // Backtrack
        board[row][col] = 0;
        
        steps.push({
          step: stepCount++,
          action: `Backtracking: Remove queen from (${row}, ${col})`,
          board: board.map(row => [...row]),
          placedQueens: getPlacedQueens(board),
          currentRow: row,
          currentCol: col,
          isValid: false,
          backtrack: true
        });
      } else {
        steps.push({
          step: stepCount++,
          action: `Position (${row}, ${col}) is under attack. Cannot place queen.`,
          board: board.map(row => [...row]),
          placedQueens: getPlacedQueens(board),
          currentRow: row,
          currentCol: col,
          isValid: false,
          backtrack: false
        });
      }
    }

    return false;
  }

  const board = Array(n).fill(null).map(() => Array(n).fill(0));
  
  steps.push({
    step: stepCount++,
    action: `Starting N-Queens problem for ${n}x${n} board`,
    board: board.map(row => [...row]),
    placedQueens: [],
    currentRow: 0,
    currentCol: -1,
    isValid: true,
    backtrack: false
  });

  solveNQueens(board, 0);

  return {
    solutions,
    steps,
    totalSolutions: solutions.length
  };
}

// Graph Coloring interfaces
export interface GraphColoringStep {
  step: number;
  action: string;
  coloring: number[];
  vertex: number;
  color: number;
  isValid: boolean;
  backtrack: boolean;
}

export interface GraphColoringResult {
  coloring: number[];
  steps: GraphColoringStep[];
  chromaticNumber: number;
  isColorable: boolean;
}

// Graph Coloring Algorithm
export function graphColoring(graph: number[][], numColors: number): GraphColoringResult {
  const n = graph.length;
  const coloring: number[] = new Array(n).fill(-1);
  const steps: GraphColoringStep[] = [];
  let stepCount = 0;

  function isSafe(vertex: number, color: number): boolean {
    for (let i = 0; i < n; i++) {
      if (graph[vertex][i] === 1 && coloring[i] === color) {
        return false;
      }
    }
    return true;
  }

  function solveColoring(vertex: number): boolean {
    if (vertex === n) {
      steps.push({
        step: stepCount++,
        action: `All vertices colored successfully!`,
        coloring: [...coloring],
        vertex,
        color: -1,
        isValid: true,
        backtrack: false
      });
      return true;
    }

    for (let color = 0; color < numColors; color++) {
      const isValidColor = isSafe(vertex, color);
      
      steps.push({
        step: stepCount++,
        action: `Trying color ${color} for vertex ${vertex}`,
        coloring: [...coloring],
        vertex,
        color,
        isValid: isValidColor,
        backtrack: false
      });

      if (isValidColor) {
        coloring[vertex] = color;
        
        steps.push({
          step: stepCount++,
          action: `Assigned color ${color} to vertex ${vertex}`,
          coloring: [...coloring],
          vertex,
          color,
          isValid: true,
          backtrack: false
        });

        if (solveColoring(vertex + 1)) {
          return true;
        }

        coloring[vertex] = -1;
        
        steps.push({
          step: stepCount++,
          action: `Backtrack: Remove color from vertex ${vertex}`,
          coloring: [...coloring],
          vertex,
          color: -1,
          isValid: false,
          backtrack: true
        });
      }
    }

    return false;
  }

  steps.push({
    step: stepCount++,
    action: `Starting graph coloring with ${numColors} colors`,
    coloring: [...coloring],
    vertex: 0,
    color: -1,
    isValid: true,
    backtrack: false
  });

  const isColorable = solveColoring(0);

  return {
    coloring: isColorable ? coloring : [],
    steps,
    chromaticNumber: isColorable ? Math.max(...coloring) + 1 : -1,
    isColorable
  };
}

// Subset Sum interfaces
export interface SubsetSumStep {
  step: number;
  action: string;
  currentSubset: number[];
  currentSum: number;
  targetSum: number;
  index: number;
  include: boolean;
  found: boolean;
}

export interface SubsetSumResult {
  hasSubset: boolean;
  subset: number[];
  steps: SubsetSumStep[];
}

// Subset Sum Problem Algorithm
export function subsetSum(arr: number[], targetSum: number): SubsetSumResult {
  const steps: SubsetSumStep[] = [];
  let stepCount = 0;
  let foundSubset: number[] = [];

  function findSubset(index: number, currentSubset: number[], currentSum: number): boolean {
    steps.push({
      step: stepCount++,
      action: `Checking index ${index}, current sum: ${currentSum}, target: ${targetSum}`,
      currentSubset: [...currentSubset],
      currentSum,
      targetSum,
      index,
      include: false,
      found: currentSum === targetSum
    });

    if (currentSum === targetSum) {
      foundSubset = [...currentSubset];
      steps.push({
        step: stepCount++,
        action: `Target sum ${targetSum} found! Subset: [${currentSubset.join(', ')}]`,
        currentSubset: [...currentSubset],
        currentSum,
        targetSum,
        index,
        include: false,
        found: true
      });
      return true;
    }

    if (index >= arr.length || currentSum > targetSum) {
      steps.push({
        step: stepCount++,
        action: `Base case reached. ${currentSum > targetSum ? 'Sum exceeded target' : 'No more elements'}`,
        currentSubset: [...currentSubset],
        currentSum,
        targetSum,
        index,
        include: false,
        found: false
      });
      return false;
    }

    // Include current element
    steps.push({
      step: stepCount++,
      action: `Including element ${arr[index]} at index ${index}`,
      currentSubset: [...currentSubset],
      currentSum,
      targetSum,
      index,
      include: true,
      found: false
    });

    if (findSubset(index + 1, [...currentSubset, arr[index]], currentSum + arr[index])) {
      return true;
    }

    // Exclude current element
    steps.push({
      step: stepCount++,
      action: `Excluding element ${arr[index]} at index ${index}`,
      currentSubset: [...currentSubset],
      currentSum,
      targetSum,
      index,
      include: false,
      found: false
    });

    return findSubset(index + 1, currentSubset, currentSum);
  }

  const hasSubset = findSubset(0, [], 0);

  return {
    hasSubset,
    subset: foundSubset,
    steps
  };
}
