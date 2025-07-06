// Divide and Conquer Algorithms

// Merge Sort interfaces
export interface MergeSortStep {
  step: number;
  action: string;
  array: number[];
  left?: number[];
  right?: number[];
  merged?: number[];
  range: [number, number];
}

export interface MergeSortTreeNode {
  id: string;
  array: number[];           // Shows the current state of this node
  originalArray: number[];   // Original unsorted subarray for this node
  mergedArray?: number[];    // Sorted result after merging (only for merged nodes)
  range: [number, number];
  level: number;
  left?: MergeSortTreeNode;
  right?: MergeSortTreeNode;
  isLeaf: boolean;
  isDividing: boolean;       // True during division phase (shows original unsorted)
  isMerged: boolean;         // True after merging (shows sorted result)
}

export interface MergeSortResult {
  sortedArray: number[];
  steps: MergeSortStep[];
  comparisons: number;
  tree: MergeSortTreeNode;
}

// Merge Sort Algorithm
export function mergeSort(arr: number[]): MergeSortResult {
  const steps: MergeSortStep[] = [];
  let stepCount = 0;
  let comparisons = 0;
  let nodeId = 0;

  function createTreeNode(array: number[], start: number, end: number, level: number): MergeSortTreeNode {
    const id = `node-${nodeId++}`;
    const isLeaf = start === end;
    const nodeArray = array.slice(start, end + 1);
    
    return {
      id,
      array: [...nodeArray],        // Initially shows the original unsorted subarray
      originalArray: [...nodeArray], // Keep track of original unsorted subarray
      range: [start, end],
      level,
      isLeaf,
      isDividing: true,
      isMerged: false
    };
  }

  function mergeSortHelper(array: number[], start: number, end: number, level: number): { result: number[], node: MergeSortTreeNode } {
    const node = createTreeNode(array, start, end, level);
    
    if (start >= end) {
      steps.push({
        step: stepCount++,
        action: `Base case: single element [${array[start]}]`,
        array: [array[start]],
        range: [start, end]
      });
      // For leaf nodes, they are already "sorted" (single element)
      node.isDividing = false;
      node.isMerged = true;
      node.mergedArray = [array[start]];
      node.array = [array[start]]; // Update display array to show sorted result
      return { result: [array[start]], node };
    }

    const mid = Math.floor((start + end) / 2);
    
    steps.push({
      step: stepCount++,
      action: `Divide array at index ${mid}`,
      array: array.slice(start, end + 1),
      range: [start, end]
    });

    const leftResult = mergeSortHelper(array, start, mid, level + 1);
    const rightResult = mergeSortHelper(array, mid + 1, end, level + 1);

    node.left = leftResult.node;
    node.right = rightResult.node;

    const merged = merge(leftResult.result, rightResult.result, start, end);
    
    // Update node to show it's now merged
    node.isDividing = false;
    node.isMerged = true;
    node.mergedArray = [...merged];
    node.array = [...merged]; // Update display array to show sorted result

    return { result: merged, node };
  }

  function merge(left: number[], right: number[], start: number, end: number): number[] {
    const merged: number[] = [];
    let i = 0, j = 0;

    steps.push({
      step: stepCount++,
      action: `Merging arrays`,
      array: [],
      left: [...left],
      right: [...right],
      range: [start, end]
    });

    while (i < left.length && j < right.length) {
      comparisons++;
      if (left[i] <= right[j]) {
        merged.push(left[i]);
        i++;
      } else {
        merged.push(right[j]);
        j++;
      }
    }

    while (i < left.length) {
      merged.push(left[i]);
      i++;
    }

    while (j < right.length) {
      merged.push(right[j]);
      j++;
    }

    steps.push({
      step: stepCount++,
      action: `Merged result`,
      array: [...merged],
      left: [...left],
      right: [...right],
      merged: [...merged],
      range: [start, end]
    });

    return merged;
  }

  const { result: sortedArray, node: tree } = mergeSortHelper(arr, 0, arr.length - 1, 0);

  return {
    sortedArray,
    steps,
    comparisons,
    tree
  };
}

// Quick Sort interfaces
export interface QuickSortStep {
  step: number;
  description: string;
  array: number[];
  pivotIndex: number;
  compareIndices?: number[];
  range: [number, number];
}

export interface QuickSortResult {
  sortedArray: number[];
  steps: QuickSortStep[];
  comparisons: number;
  swaps: number;
  recursionDepth: number;
}

// Quick Sort Algorithm
export function quickSort(arr: number[], pivotStrategy: 'first' | 'last' | 'middle' | 'random' = 'last'): QuickSortResult {
  const steps: QuickSortStep[] = [];
  const sortedArray = [...arr];
  let stepCount = 0;
  let comparisons = 0;
  let swaps = 0;
  let maxDepth = 0;

  function quickSortHelper(array: number[], low: number, high: number, depth: number): void {
    maxDepth = Math.max(maxDepth, depth);
    
    if (low < high) {
      const pivotIndex = partition(array, low, high);
      quickSortHelper(array, low, pivotIndex - 1, depth + 1);
      quickSortHelper(array, pivotIndex + 1, high, depth + 1);
    }
  }

  function partition(array: number[], low: number, high: number): number {
    // Select pivot based on strategy
    let pivotIndex = high; // default to last
    switch (pivotStrategy) {
      case 'first':
        pivotIndex = low;
        break;
      case 'middle':
        pivotIndex = Math.floor((low + high) / 2);
        break;
      case 'random':
        pivotIndex = Math.floor(Math.random() * (high - low + 1)) + low;
        break;
    }

    // Move pivot to end if not already there
    if (pivotIndex !== high) {
      [array[pivotIndex], array[high]] = [array[high], array[pivotIndex]];
      swaps++;
    }

    const pivot = array[high];
    steps.push({
      step: stepCount++,
      description: `Selected pivot: ${pivot} at position ${high}`,
      array: [...array],
      pivotIndex: high,
      range: [low, high]
    });

    let i = low - 1;

    for (let j = low; j < high; j++) {
      comparisons++;
      steps.push({
        step: stepCount++,
        description: `Comparing ${array[j]} with pivot ${pivot}`,
        array: [...array],
        pivotIndex: high,
        compareIndices: [j],
        range: [low, high]
      });

      if (array[j] < pivot) {
        i++;
        if (i !== j) {
          [array[i], array[j]] = [array[j], array[i]];
          swaps++;
          steps.push({
            step: stepCount++,
            description: `Swapped ${array[j]} and ${array[i]} (moving ${array[j]} to left partition)`,
            array: [...array],
            pivotIndex: high,
            compareIndices: [i, j],
            range: [low, high]
          });
        }
      }
    }

    // Place pivot in correct position
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    swaps++;
    steps.push({
      step: stepCount++,
      description: `Placed pivot ${pivot} in correct position ${i + 1}`,
      array: [...array],
      pivotIndex: i + 1,
      range: [low, high]
    });

    return i + 1;
  }

  quickSortHelper(sortedArray, 0, arr.length - 1, 0);

  return {
    sortedArray,
    steps,
    comparisons,
    swaps,
    recursionDepth: maxDepth
  };
}

// Binary Search interfaces
export interface BinarySearchStep {
  step: number;
  description: string;
  array: number[];
  left: number;
  right: number;
  mid: number;
  target: number;
  found?: boolean;
}

export interface BinarySearchResult {
  found: boolean;
  index: number;
  steps: BinarySearchStep[];
  comparisons: number;
}

// Binary Search Algorithm
export function binarySearch(arr: number[], target: number): BinarySearchResult {
  const steps: BinarySearchStep[] = [];
  let stepCount = 0;
  let comparisons = 0;
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    comparisons++;

    steps.push({
      step: stepCount++,
      description: `Checking middle element at index ${mid}: ${arr[mid]}`,
      array: [...arr],
      left,
      right,
      mid,
      target
    });

    if (arr[mid] === target) {
      steps.push({
        step: stepCount++,
        description: `Found target ${target} at index ${mid}!`,
        array: [...arr],
        left,
        right,
        mid,
        target,
        found: true
      });
      return { found: true, index: mid, steps, comparisons };
    } else if (arr[mid] < target) {
      steps.push({
        step: stepCount++,
        description: `${arr[mid]} < ${target}, searching right half`,
        array: [...arr],
        left,
        right,
        mid,
        target
      });
      left = mid + 1;
    } else {
      steps.push({
        step: stepCount++,
        description: `${arr[mid]} > ${target}, searching left half`,
        array: [...arr],
        left,
        right,
        mid,
        target
      });
      right = mid - 1;
    }
  }

  steps.push({
    step: stepCount++,
    description: `Target ${target} not found in array`,
    array: [...arr],
    left,
    right,
    mid: -1,
    target,
    found: false
  });

  return { found: false, index: -1, steps, comparisons };
}

// Maximum Subarray (Kadane's Algorithm) interfaces
export interface MaxSubarrayStep {
  step: number;
  description: string;
  array: number[];
  currentIndex: number;
  currentSum: number;
  maxSum: number;
  maxStart: number;
  maxEnd: number;
  currentStart: number;
}

export interface MaxSubarrayResult {
  maxSum: number;
  subarray: number[];
  startIndex: number;
  endIndex: number;
  steps: MaxSubarrayStep[];
}

// Maximum Subarray Algorithm (Kadane's Algorithm)
export function maxSubarray(arr: number[]): MaxSubarrayResult {
  const steps: MaxSubarrayStep[] = [];
  let stepCount = 0;
  let maxSum = arr[0];
  let currentSum = arr[0];
  let maxStart = 0;
  let maxEnd = 0;
  let currentStart = 0;

  steps.push({
    step: stepCount++,
    description: `Initialize: maxSum = currentSum = ${arr[0]}`,
    array: [...arr],
    currentIndex: 0,
    currentSum,
    maxSum,
    maxStart,
    maxEnd,
    currentStart
  });

  for (let i = 1; i < arr.length; i++) {
    if (currentSum < 0) {
      currentSum = arr[i];
      currentStart = i;
      steps.push({
        step: stepCount++,
        description: `Previous sum was negative, restart from index ${i} with value ${arr[i]}`,
        array: [...arr],
        currentIndex: i,
        currentSum,
        maxSum,
        maxStart,
        maxEnd,
        currentStart
      });
    } else {
      currentSum += arr[i];
      steps.push({
        step: stepCount++,
        description: `Add ${arr[i]} to current sum: ${currentSum}`,
        array: [...arr],
        currentIndex: i,
        currentSum,
        maxSum,
        maxStart,
        maxEnd,
        currentStart
      });
    }

    if (currentSum > maxSum) {
      maxSum = currentSum;
      maxStart = currentStart;
      maxEnd = i;
      steps.push({
        step: stepCount++,
        description: `New maximum sum found: ${maxSum} from index ${maxStart} to ${maxEnd}`,
        array: [...arr],
        currentIndex: i,
        currentSum,
        maxSum,
        maxStart,
        maxEnd,
        currentStart
      });
    }
  }

  return {
    maxSum,
    subarray: arr.slice(maxStart, maxEnd + 1),
    startIndex: maxStart,
    endIndex: maxEnd,
    steps
  };
}

// Min-Max Tree interfaces
export interface MinMaxTreeNode {
  id: string;
  array: number[];
  left: number;
  right: number;
  min: number;
  max: number;
  level: number;
  isBaseCase: boolean;
  isDividing: boolean;
  isCombining: boolean;
  leftChild?: MinMaxTreeNode;
  rightChild?: MinMaxTreeNode;
  leftResult?: { min: number; max: number };
  rightResult?: { min: number; max: number };
}

export interface MinMaxTreeResult {
  root: MinMaxTreeNode;
  min: number;
  max: number;
  comparisons: number;
}

// Build Min-Max Tree
export function buildMinMaxTree(arr: number[]): MinMaxTreeResult {
  let comparisons = 0;
  let nodeId = 0;

  const generateId = () => `node-${nodeId++}`;

  const buildTree = (array: number[], left: number, right: number, level: number): MinMaxTreeNode => {
    const node: MinMaxTreeNode = {
      id: generateId(),
      array: array.slice(left, right + 1),
      left,
      right,
      min: -1,
      max: -1,
      level,
      isBaseCase: false,
      isDividing: true,
      isCombining: false
    };

    if (left === right) {
      // Base case: single element
      node.min = array[left];
      node.max = array[left];
      node.isBaseCase = true;
      node.isDividing = false;
      return node;
    }

    if (right === left + 1) {
      // Base case: two elements
      comparisons++;
      node.min = Math.min(array[left], array[right]);
      node.max = Math.max(array[left], array[right]);
      node.isBaseCase = true;
      node.isDividing = false;
      return node;
    }

    // Divide
    const mid = Math.floor((left + right) / 2);
    node.leftChild = buildTree(array, left, mid, level + 1);
    node.rightChild = buildTree(array, mid + 1, right, level + 1);

    // Combine
    comparisons += 2; // Two comparisons to find overall min and max
    node.leftResult = { min: node.leftChild.min, max: node.leftChild.max };
    node.rightResult = { min: node.rightChild.min, max: node.rightChild.max };
    node.min = Math.min(node.leftResult.min, node.rightResult.min);
    node.max = Math.max(node.leftResult.max, node.rightResult.max);
    node.isDividing = false;
    node.isCombining = true;

    return node;
  };

  const root = buildTree(arr, 0, arr.length - 1, 0);
  return {
    root,
    min: root.min,
    max: root.max,
    comparisons
  };
}
