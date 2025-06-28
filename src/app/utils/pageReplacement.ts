interface PageReplacementStep {
  page: number;
  frames: (number | null)[];
  hit: boolean;
  replacedIndex?: number;
  replacedPage?: number;
}

interface PageReplacementResult {
  algorithm: string;
  steps: PageReplacementStep[];
  pageFaults: number;
  pageHits: number;
  hitRatio: number;
}

// FIFO (First In First Out) Algorithm
export function fifoPageReplacement(sequence: number[], frameSize: number): PageReplacementResult {
  const frames: (number | null)[] = Array(frameSize).fill(null);
  const steps: PageReplacementStep[] = [];
  let pageFaults = 0;
  let pageHits = 0;
  let nextFrameIndex = 0;

  for (const page of sequence) {
    // Check if page is already in frames (hit)
    const hitIndex = frames.indexOf(page);
    
    if (hitIndex !== -1) {
      // Page hit
      pageHits++;
      steps.push({
        page,
        frames: [...frames],
        hit: true
      });
    } else {
      // Page fault
      pageFaults++;
      const replacedPage = frames[nextFrameIndex];
      frames[nextFrameIndex] = page;
      
      steps.push({
        page,
        frames: [...frames],
        hit: false,
        replacedIndex: nextFrameIndex,
        replacedPage: replacedPage || undefined
      });
      
      nextFrameIndex = (nextFrameIndex + 1) % frameSize;
    }
  }

  return {
    algorithm: 'FIFO (First In First Out)',
    steps,
    pageFaults,
    pageHits,
    hitRatio: (pageHits / sequence.length) * 100
  };
}

// LRU (Least Recently Used) Algorithm
export function lruPageReplacement(sequence: number[], frameSize: number): PageReplacementResult {
  const frames: (number | null)[] = Array(frameSize).fill(null);
  const steps: PageReplacementStep[] = [];
  const recentlyUsed: number[] = [];
  let pageFaults = 0;
  let pageHits = 0;

  for (const page of sequence) {
    const hitIndex = frames.indexOf(page);
    
    if (hitIndex !== -1) {
      // Page hit - update recently used list
      pageHits++;
      const recentIndex = recentlyUsed.indexOf(page);
      if (recentIndex > -1) {
        recentlyUsed.splice(recentIndex, 1);
      }
      recentlyUsed.push(page);
      
      steps.push({
        page,
        frames: [...frames],
        hit: true
      });
    } else {
      // Page fault
      pageFaults++;
      let replacedIndex = 0;
      let replacedPage: number | null = null;

      // Find empty frame first
      const emptyIndex = frames.indexOf(null);
      if (emptyIndex !== -1) {
        replacedIndex = emptyIndex;
      } else {
        // Find least recently used page
        let lruPage = recentlyUsed[0];
        for (let i = 0; i < recentlyUsed.length; i++) {
          const frameIndex = frames.indexOf(recentlyUsed[i]);
          if (frameIndex !== -1) {
            lruPage = recentlyUsed[i];
            replacedIndex = frameIndex;
            break;
          }
        }
        replacedPage = frames[replacedIndex];
        
        // Remove from recently used list
        const recentIndex = recentlyUsed.indexOf(lruPage);
        if (recentIndex > -1) {
          recentlyUsed.splice(recentIndex, 1);
        }
      }

      frames[replacedIndex] = page;
      recentlyUsed.push(page);
      
      steps.push({
        page,
        frames: [...frames],
        hit: false,
        replacedIndex,
        replacedPage: replacedPage || undefined
      });
    }
  }

  return {
    algorithm: 'LRU (Least Recently Used)',
    steps,
    pageFaults,
    pageHits,
    hitRatio: (pageHits / sequence.length) * 100
  };
}

// Optimal Page Replacement Algorithm
export function optimalPageReplacement(sequence: number[], frameSize: number): PageReplacementResult {
  const frames: (number | null)[] = Array(frameSize).fill(null);
  const steps: PageReplacementStep[] = [];
  let pageFaults = 0;
  let pageHits = 0;

  for (let i = 0; i < sequence.length; i++) {
    const page = sequence[i];
    const hitIndex = frames.indexOf(page);
    
    if (hitIndex !== -1) {
      // Page hit
      pageHits++;
      steps.push({
        page,
        frames: [...frames],
        hit: true
      });
    } else {
      // Page fault
      pageFaults++;
      let replacedIndex = 0;
      let replacedPage: number | null = null;

      // Find empty frame first
      const emptyIndex = frames.indexOf(null);
      if (emptyIndex !== -1) {
        replacedIndex = emptyIndex;
      } else {
        // Find the page that will be used farthest in the future
        let farthestIndex = -1;
        let farthestDistance = -1;

        for (let j = 0; j < frames.length; j++) {
          const currentPage = frames[j];
          let nextUse = sequence.length; // Default to end of sequence

          // Find next occurrence of this page
          for (let k = i + 1; k < sequence.length; k++) {
            if (sequence[k] === currentPage) {
              nextUse = k;
              break;
            }
          }

          if (nextUse > farthestDistance) {
            farthestDistance = nextUse;
            farthestIndex = j;
          }
        }

        replacedIndex = farthestIndex;
        replacedPage = frames[replacedIndex];
      }

      frames[replacedIndex] = page;
      
      steps.push({
        page,
        frames: [...frames],
        hit: false,
        replacedIndex,
        replacedPage: replacedPage || undefined
      });
    }
  }

  return {
    algorithm: 'Optimal Page Replacement',
    steps,
    pageFaults,
    pageHits,
    hitRatio: (pageHits / sequence.length) * 100
  };
}

// LFU (Least Frequently Used) Algorithm
export function lfuPageReplacement(sequence: number[], frameSize: number): PageReplacementResult {
  const frames: (number | null)[] = Array(frameSize).fill(null);
  const steps: PageReplacementStep[] = [];
  const frequency: Map<number, number> = new Map();
  const lastUsed: Map<number, number> = new Map();
  let pageFaults = 0;
  let pageHits = 0;

  for (let i = 0; i < sequence.length; i++) {
    const page = sequence[i];
    const hitIndex = frames.indexOf(page);
    
    if (hitIndex !== -1) {
      // Page hit
      pageHits++;
      frequency.set(page, (frequency.get(page) || 0) + 1);
      lastUsed.set(page, i);
      
      steps.push({
        page,
        frames: [...frames],
        hit: true
      });
    } else {
      // Page fault
      pageFaults++;
      let replacedIndex = 0;
      let replacedPage: number | null = null;

      // Find empty frame first
      const emptyIndex = frames.indexOf(null);
      if (emptyIndex !== -1) {
        replacedIndex = emptyIndex;
      } else {
        // Find least frequently used page
        let minFreq = Infinity;
        let earliestTime = Infinity;
        
        for (let j = 0; j < frames.length; j++) {
          const currentPage = frames[j]!;
          const freq = frequency.get(currentPage) || 0;
          const time = lastUsed.get(currentPage) || 0;
          
          if (freq < minFreq || (freq === minFreq && time < earliestTime)) {
            minFreq = freq;
            earliestTime = time;
            replacedIndex = j;
          }
        }
        
        replacedPage = frames[replacedIndex];
        if (replacedPage !== null) {
          frequency.delete(replacedPage);
          lastUsed.delete(replacedPage);
        }
      }

      frames[replacedIndex] = page;
      frequency.set(page, (frequency.get(page) || 0) + 1);
      lastUsed.set(page, i);
      
      steps.push({
        page,
        frames: [...frames],
        hit: false,
        replacedIndex,
        replacedPage: replacedPage || undefined
      });
    }
  }

  return {
    algorithm: 'LFU (Least Frequently Used)',
    steps,
    pageFaults,
    pageHits,
    hitRatio: (pageHits / sequence.length) * 100
  };
}

// Function to get all algorithms
export function getAllPageReplacementAlgorithms() {
  return {
    fifo: fifoPageReplacement,
    lru: lruPageReplacement,
    optimal: optimalPageReplacement,
    lfu: lfuPageReplacement
  };
}

// Function to compare all algorithms
export function compareAllAlgorithms(sequence: number[], frameSize: number) {
  const algorithms = getAllPageReplacementAlgorithms();
  const results: { [key: string]: PageReplacementResult } = {};

  Object.entries(algorithms).forEach(([key, algorithm]) => {
    results[key] = algorithm(sequence, frameSize);
  });

  return results;
}