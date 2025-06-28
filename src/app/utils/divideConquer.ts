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

export interface MergeSortResult {
  sortedArray: number[];
  steps: MergeSortStep[];
  comparisons: number;
}

// Merge Sort Algorithm
export function mergeSort(arr: number[]): MergeSortResult {
  const steps: MergeSortStep[] = [];
  let stepCount = 0;
  let comparisons = 0;

  function mergeSortHelper(array: number[], start: number, end: number): number[] {
    if (start >= end) {
      steps.push({
        step: stepCount++,
        action: `Base case: single element [${array[start]}]`,
        array: [array[start]],
        range: [start, end]
      });
      return [array[start]];
    }

    const mid = Math.floor((start + end) / 2);
    
    steps.push({
      step: stepCount++,
      action: `Divide array at index ${mid}`,
      array: array.slice(start, end + 1),
      range: [start, end]
    });

    const left = mergeSortHelper(array, start, mid);
    const right = mergeSortHelper(array, mid + 1, end);

    return merge(left, right, start, end);
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

  const sortedArray = mergeSortHelper(arr, 0, arr.length - 1);

  return {
    sortedArray,
    steps,
    comparisons
  };
}

// Quick Sort interfaces
export interface QuickSortStep {
  step: number;
  action: string;
  array: number[];
  pivot: number;
  pivotIndex: number;
  left: number[];
  right: number[];
  range: [number, number];
}

export interface QuickSortResult {
  sortedArray: number[];
  steps: QuickSortStep[];
  comparisons: number;
}

// Quick Sort Algorithm
export function quickSort(arr: number[]): QuickSortResult {
  const steps: QuickSortStep[] = [];
  let stepCount = 0;
  let comparisons = 0;
  const result = [...arr];

  function quickSortHelper(array: number[], low: number, high: number): void {
    if (low < high) {
      const pivotIndex = partition(array, low, high);
      
      quickSortHelper(array, low, pivotIndex - 1);
      quickSortHelper(array, pivotIndex + 1, high);
    }
  }

  function partition(array: number[], low: number, high: number): number {
    const pivot = array[high];
    let i = low - 1;

    steps.push({
      step: stepCount++,
      action: `Choose pivot: ${pivot} at index ${high}`,
      array: array.slice(low, high + 1),
      pivot,
      pivotIndex: high,
      left: [],
      right: [],
      range: [low, high]
    });

    for (let j = low; j < high; j++) {
      comparisons++;
      if (array[j] < pivot) {
        i++;
        [array[i], array[j]] = [array[j], array[i]];
      }
    }

    [array[i + 1], array[high]] = [array[high], array[i + 1]];

    const left = array.slice(low, i + 1);
    const right = array.slice(i + 2, high + 1);

    steps.push({
      step: stepCount++,
      action: `Partitioned around pivot ${pivot}`,
      array: array.slice(low, high + 1),
      pivot,
      pivotIndex: i + 1,
      left,
      right,
      range: [low, high]
    });

    return i + 1;
  }

  quickSortHelper(result, 0, result.length - 1);

  return {
    sortedArray: result,
    steps,
    comparisons
  };
}

// Binary Search interfaces
export interface BinarySearchStep {
  step: number;
  action: string;
  array: number[];
  target: number;
  left: number;
  right: number;
  mid: number;
  found: boolean;
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

  steps.push({
    step: stepCount++,
    action: `Searching for ${target} in sorted array`,
    array: [...arr],
    target,
    left,
    right,
    mid: -1,
    found: false
  });

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    comparisons++;

    steps.push({
      step: stepCount++,
      action: `Check middle element at index ${mid}`,
      array: [...arr],
      target,
      left,
      right,
      mid,
      found: false
    });

    if (arr[mid] === target) {
      steps.push({
        step: stepCount++,
        action: `Found target ${target} at index ${mid}`,
        array: [...arr],
        target,
        left,
        right,
        mid,
        found: true
      });
      return { found: true, index: mid, steps, comparisons };
    } else if (arr[mid] < target) {
      left = mid + 1;
      steps.push({
        step: stepCount++,
        action: `${arr[mid]} < ${target}, search right half`,
        array: [...arr],
        target,
        left,
        right,
        mid,
        found: false
      });
    } else {
      right = mid - 1;
      steps.push({
        step: stepCount++,
        action: `${arr[mid]} > ${target}, search left half`,
        array: [...arr],
        target,
        left,
        right,
        mid,
        found: false
      });
    }
  }

  steps.push({
    step: stepCount++,
    action: `Target ${target} not found in array`,
    array: [...arr],
    target,
    left,
    right,
    mid: -1,
    found: false
  });

  return { found: false, index: -1, steps, comparisons };
}

// Maximum Subarray (Kadane's Algorithm) interfaces
export interface KadaneStep {
  step: number;
  index: number;
  currentElement: number;
  currentSum: number;
  maxSum: number;
  action: string;
}

export interface KadaneResult {
  maxSum: number;
  startIndex: number;
  endIndex: number;
  subarray: number[];
  steps: KadaneStep[];
}

// Maximum Subarray using Kadane's Algorithm
export function kadaneAlgorithm(arr: number[]): KadaneResult {
  const steps: KadaneStep[] = [];
  let maxSum = arr[0];
  let currentSum = arr[0];
  let startIndex = 0;
  let endIndex = 0;
  let tempStart = 0;

  steps.push({
    step: 0,
    index: 0,
    currentElement: arr[0],
    currentSum: arr[0],
    maxSum: arr[0],
    action: `Initialize with first element: ${arr[0]}`
  });

  for (let i = 1; i < arr.length; i++) {
    if (currentSum < 0) {
      currentSum = arr[i];
      tempStart = i;
      steps.push({
        step: i,
        index: i,
        currentElement: arr[i],
        currentSum,
        maxSum,
        action: `Previous sum was negative, start new subarray at index ${i}`
      });
    } else {
      currentSum += arr[i];
      steps.push({
        step: i,
        index: i,
        currentElement: arr[i],
        currentSum,
        maxSum,
        action: `Add ${arr[i]} to current sum: ${currentSum}`
      });
    }

    if (currentSum > maxSum) {
      maxSum = currentSum;
      startIndex = tempStart;
      endIndex = i;
      steps.push({
        step: i,
        index: i,
        currentElement: arr[i],
        currentSum,
        maxSum,
        action: `New maximum sum found: ${maxSum} (subarray from ${startIndex} to ${i})`
      });
    }
  }

  return {
    maxSum,
    startIndex,
    endIndex,
    subarray: arr.slice(startIndex, endIndex + 1),
    steps
  };
}
