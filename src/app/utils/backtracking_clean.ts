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
      solutions.push(board.map(r => [...r]));
      steps.push({
        step: stepCount++,
        action: `Solution found! All ${n} queens placed successfully.`,
        board: board.map(r => [...r]),
        placedQueens: getPlacedQueens(board),
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
        board: board.map(r => [...r]),
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
          board: board.map(r => [...r]),
          placedQueens: getPlacedQueens(board),
          currentRow: row,
          currentCol: col,
          isValid: true,
          backtrack: false
        });

        if (solveNQueens(board, row + 1)) {
          return true; // Found solution
        }

        // Backtrack
        board[row][col] = 0;
        steps.push({
          step: stepCount++,
          action: `Backtracking: Removing queen from (${row}, ${col})`,
          board: board.map(r => [...r]),
          placedQueens: getPlacedQueens(board),
          currentRow: row,
          currentCol: col,
          isValid: false,
          backtrack: true
        });
      }
    }

    return false;
  }

  // Initialize board
  const board = Array(n).fill(null).map(() => Array(n).fill(0));
  
  steps.push({
    step: stepCount++,
    action: `Starting N-Queens problem with ${n}x${n} board`,
    board: board.map(r => [...r]),
    placedQueens: [],
    currentRow: 0,
    currentCol: 0,
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
  vertex: number;
  color: number;
  coloring: number[];
  isValid: boolean;
  backtrack: boolean;
}

export interface GraphColoringResult {
  isColorable: boolean;
  coloring: number[];
  chromaticNumber: number;
  steps: GraphColoringStep[];
}

// Graph Coloring Algorithm
export function graphColoring(graph: number[][], numColors: number): GraphColoringResult {
  const n = graph.length;
  const coloring = new Array(n).fill(-1);
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
        vertex: -1,
        color: -1,
        coloring: [...coloring],
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
        vertex,
        color,
        coloring: [...coloring],
        isValid: isValidColor,
        backtrack: false
      });

      if (isValidColor) {
        coloring[vertex] = color;
        
        steps.push({
          step: stepCount++,
          action: `Color ${color} assigned to vertex ${vertex}`,
          vertex,
          color,
          coloring: [...coloring],
          isValid: true,
          backtrack: false
        });

        if (solveColoring(vertex + 1)) {
          return true;
        }

        // Backtrack
        coloring[vertex] = -1;
        steps.push({
          step: stepCount++,
          action: `Backtracking: Removing color from vertex ${vertex}`,
          vertex,
          color: -1,
          coloring: [...coloring],
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
    vertex: -1,
    color: -1,
    coloring: [...coloring],
    isValid: true,
    backtrack: false
  });

  const isColorable = solveColoring(0);
  const chromaticNumber = isColorable ? Math.max(...coloring) + 1 : -1;

  return {
    isColorable,
    coloring: isColorable ? [...coloring] : [],
    chromaticNumber,
    steps
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
  isValid: boolean;
  backtrack: boolean;
}

export interface SubsetSumResult {
  hasSubset: boolean;
  subset: number[];
  steps: SubsetSumStep[];
}

// Subset Sum Algorithm
export function subsetSum(numbers: number[], targetSum: number): SubsetSumResult {
  const steps: SubsetSumStep[] = [];
  let stepCount = 0;
  let foundSubset: number[] = [];

  function findSubset(index: number, currentSubset: number[], currentSum: number): boolean {
    steps.push({
      step: stepCount++,
      action: `Exploring index ${index}, current sum: ${currentSum}, target: ${targetSum}`,
      currentSubset: [...currentSubset],
      currentSum,
      targetSum,
      index,
      isValid: true,
      backtrack: false
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
        isValid: true,
        backtrack: false
      });
      return true;
    }

    if (index >= numbers.length || currentSum > targetSum) {
      steps.push({
        step: stepCount++,
        action: `Dead end: ${index >= numbers.length ? 'No more numbers' : 'Sum exceeded target'}`,
        currentSubset: [...currentSubset],
        currentSum,
        targetSum,
        index,
        isValid: false,
        backtrack: true
      });
      return false;
    }

    // Include current number
    const newSubset = [...currentSubset, numbers[index]];
    const newSum = currentSum + numbers[index];
    
    steps.push({
      step: stepCount++,
      action: `Including ${numbers[index]}, new sum: ${newSum}`,
      currentSubset: newSubset,
      currentSum: newSum,
      targetSum,
      index,
      isValid: true,
      backtrack: false
    });

    if (findSubset(index + 1, newSubset, newSum)) {
      return true;
    }

    // Exclude current number (backtrack)
    steps.push({
      step: stepCount++,
      action: `Excluding ${numbers[index]}, trying next option`,
      currentSubset: [...currentSubset],
      currentSum,
      targetSum,
      index,
      isValid: true,
      backtrack: true
    });

    return findSubset(index + 1, currentSubset, currentSum);
  }

  steps.push({
    step: stepCount++,
    action: `Starting subset sum with target: ${targetSum}`,
    currentSubset: [],
    currentSum: 0,
    targetSum,
    index: 0,
    isValid: true,
    backtrack: false
  });

  const hasSubset = findSubset(0, [], 0);

  return {
    hasSubset,
    subset: foundSubset,
    steps
  };
}
