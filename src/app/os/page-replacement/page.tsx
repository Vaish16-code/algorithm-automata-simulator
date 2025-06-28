'use client';

import React, { useState } from 'react';

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

// FIFO Algorithm Implementation
const fifoAlgorithm = (sequence: number[], frameSize: number): PageReplacementResult => {
  const frames: (number | null)[] = new Array(frameSize).fill(null);
  const steps: PageReplacementStep[] = [];
  let pageFaults = 0;
  let pageHits = 0;
  let fifoIndex = 0;

  sequence.forEach(page => {
    const frameIndex = frames.indexOf(page);
    
    if (frameIndex !== -1) {
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
      let replacedIndex = -1;
      let replacedPage: number | undefined;

      if (frames.includes(null)) {
        // Empty frame available
        const emptyIndex = frames.indexOf(null);
        frames[emptyIndex] = page;
        replacedIndex = emptyIndex;
      } else {
        // Replace using FIFO
        replacedPage = frames[fifoIndex] || undefined;
        frames[fifoIndex] = page;
        replacedIndex = fifoIndex;
        fifoIndex = (fifoIndex + 1) % frameSize;
      }

      steps.push({
        page,
        frames: [...frames],
        hit: false,
        replacedIndex,
        replacedPage
      });
    }
  });

  return {
    algorithm: 'FIFO',
    steps,
    pageFaults,
    pageHits,
    hitRatio: sequence.length > 0 ? (pageHits / sequence.length) * 100 : 0
  };
};

// LRU Algorithm Implementation
const lruAlgorithm = (sequence: number[], frameSize: number): PageReplacementResult => {
  const frames: (number | null)[] = new Array(frameSize).fill(null);
  const lastUsed: number[] = new Array(frameSize).fill(-1);
  const steps: PageReplacementStep[] = [];
  let pageFaults = 0;
  let pageHits = 0;
  let time = 0;

  sequence.forEach(page => {
    const frameIndex = frames.indexOf(page);
    time++;
    
    if (frameIndex !== -1) {
      // Page hit
      pageHits++;
      lastUsed[frameIndex] = time;
      steps.push({
        page,
        frames: [...frames],
        hit: true
      });
    } else {
      // Page fault
      pageFaults++;
      let replacedIndex = -1;
      let replacedPage: number | undefined;

      if (frames.includes(null)) {
        // Empty frame available
        const emptyIndex = frames.indexOf(null);
        frames[emptyIndex] = page;
        lastUsed[emptyIndex] = time;
        replacedIndex = emptyIndex;
      } else {
        // Replace LRU page
        const lruIndex = lastUsed.indexOf(Math.min(...lastUsed));
        replacedPage = frames[lruIndex] || undefined;
        frames[lruIndex] = page;
        lastUsed[lruIndex] = time;
        replacedIndex = lruIndex;
      }

      steps.push({
        page,
        frames: [...frames],
        hit: false,
        replacedIndex,
        replacedPage
      });
    }
  });

  return {
    algorithm: 'LRU',
    steps,
    pageFaults,
    pageHits,
    hitRatio: sequence.length > 0 ? (pageHits / sequence.length) * 100 : 0
  };
};

// Optimal Algorithm Implementation
const optimalAlgorithm = (sequence: number[], frameSize: number): PageReplacementResult => {
  const frames: (number | null)[] = new Array(frameSize).fill(null);
  const steps: PageReplacementStep[] = [];
  let pageFaults = 0;
  let pageHits = 0;

  sequence.forEach((page, currentIndex) => {
    const frameIndex = frames.indexOf(page);
    
    if (frameIndex !== -1) {
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
      let replacedIndex = -1;
      let replacedPage: number | undefined;

      if (frames.includes(null)) {
        // Empty frame available
        const emptyIndex = frames.indexOf(null);
        frames[emptyIndex] = page;
        replacedIndex = emptyIndex;
      } else {
        // Find the page that will be used farthest in the future (or never)
        let farthestIndex = -1;
        let farthestDistance = -1;

        for (let i = 0; i < frameSize; i++) {
          const currentPage = frames[i];
          let nextUse = sequence.length; // Default to never used again

          for (let j = currentIndex + 1; j < sequence.length; j++) {
            if (sequence[j] === currentPage) {
              nextUse = j;
              break;
            }
          }

          if (nextUse > farthestDistance) {
            farthestDistance = nextUse;
            farthestIndex = i;
          }
        }

        replacedPage = frames[farthestIndex] || undefined;
        frames[farthestIndex] = page;
        replacedIndex = farthestIndex;
      }

      steps.push({
        page,
        frames: [...frames],
        hit: false,
        replacedIndex,
        replacedPage
      });
    }
  });

  return {
    algorithm: 'Optimal',
    steps,
    pageFaults,
    pageHits,
    hitRatio: sequence.length > 0 ? (pageHits / sequence.length) * 100 : 0
  };
};

// Chart Component
const PageReplacementChart: React.FC<{
  result: PageReplacementResult;
  sequence: number[];
  frameSize: number;
}> = ({ result, sequence, frameSize }) => {
  if (!result || !result.steps) {
    return null;
  }

  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4 text-center text-gray-800">
        {result.algorithm} Algorithm Visualization
      </h3>
      
      {/* Statistics */}
      <div className="mb-6 grid grid-cols-3 gap-4 text-center">
        <div className="bg-red-100 p-3 rounded-lg border border-red-200">
          <div className="text-sm font-semibold text-red-700">Page Faults</div>
          <div className="text-2xl font-bold text-red-800">{result.pageFaults}</div>
        </div>
        <div className="bg-green-100 p-3 rounded-lg border border-green-200">
          <div className="text-sm font-semibold text-green-700">Page Hits</div>
          <div className="text-2xl font-bold text-green-800">{result.pageHits}</div>
        </div>
        <div className="bg-blue-100 p-3 rounded-lg border border-blue-200">
          <div className="text-sm font-semibold text-blue-700">Hit Ratio</div>
          <div className="text-2xl font-bold text-blue-800">{result.hitRatio.toFixed(2)}%</div>
        </div>
      </div>

      {/* Page Reference Sequence */}
      <div className="mb-4">
        <h4 className="text-lg font-semibold mb-2 text-gray-700">Page Reference Sequence:</h4>
        <div className="flex flex-wrap gap-2">
          {sequence.map((page, index) => (
            <div
              key={index}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md font-medium"
            >
              {page}
            </div>
          ))}
        </div>
      </div>

      {/* Visualization Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-3 py-2 text-center font-semibold">
                Page
              </th>
              {Array.from({ length: frameSize }, (_, i) => (
                <th key={i} className="border border-gray-300 px-3 py-2 text-center font-semibold">
                  Frame {i + 1}
                </th>
              ))}
              <th className="border border-gray-300 px-3 py-2 text-center font-semibold">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {result.steps.map((step, index) => (
              <tr key={index} className={step.hit ? 'bg-green-50' : 'bg-red-50'}>
                <td className="border border-gray-300 px-3 py-2 text-center font-medium">
                  {step.page}
                </td>
                {step.frames.map((frame, frameIndex) => (
                  <td
                    key={frameIndex}
                    className={`border border-gray-300 px-3 py-2 text-center ${
                      step.replacedIndex === frameIndex && !step.hit
                        ? 'bg-red-200 font-bold'
                        : frame !== null
                        ? 'bg-gray-100'
                        : ''
                    }`}
                  >
                    {frame !== null ? frame : '-'}
                  </td>
                ))}
                <td className="border border-gray-300 px-3 py-2 text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      step.hit
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {step.hit ? 'HIT' : 'FAULT'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-4 text-sm text-gray-600">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-50 border border-green-200 rounded"></div>
            <span>Page Hit</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-50 border border-red-200 rounded"></div>
            <span>Page Fault</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-200 border border-red-300 rounded"></div>
            <span>Replaced Frame</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
const PageReplacementSimulator = () => {
  const [sequence, setSequence] = useState<string>('7,0,1,2,0,3,0,4,2,3,0,3,2,1,2,0,1,7,0,1');
  const [frameSize, setFrameSize] = useState<number>(3);
  const [algorithm, setAlgorithm] = useState<string>('FIFO');
  const [result, setResult] = useState<PageReplacementResult | null>(null);

  const algorithms = {
    FIFO: fifoAlgorithm,
    LRU: lruAlgorithm,
    Optimal: optimalAlgorithm
  };

  const handleSimulate = () => {
    try {
      const pageSequence = sequence
        .split(',')
        .map(s => parseInt(s.trim()))
        .filter(n => !isNaN(n));

      if (pageSequence.length === 0) {
        alert('Please enter a valid page sequence');
        return;
      }

      if (frameSize < 1 || frameSize > 10) {
        alert('Frame size must be between 1 and 10');
        return;
      }

      const algorithmFunc = algorithms[algorithm as keyof typeof algorithms];
      const simulationResult = algorithmFunc(pageSequence, frameSize);
      setResult(simulationResult);
    } catch (error) {
      alert('Error in simulation. Please check your inputs.');
      console.error(error);
    }
  };

  const handleCompareAll = () => {
    try {
      const pageSequence = sequence
        .split(',')
        .map(s => parseInt(s.trim()))
        .filter(n => !isNaN(n));

      if (pageSequence.length === 0) {
        alert('Please enter a valid page sequence');
        return;
      }

      const results = Object.entries(algorithms).map(([name, func]) => 
        func(pageSequence, frameSize)
      );

      // Show comparison in alert (you could make this more sophisticated)
      const comparison = results.map(r => 
        `${r.algorithm}: ${r.pageFaults} faults, ${r.hitRatio.toFixed(2)}% hit ratio`
      ).join('\n');
      
      alert(`Algorithm Comparison:\n\n${comparison}`);
    } catch (error) {
      alert('Error in comparison. Please check your inputs.');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Page Replacement Algorithm Simulator
          </h1>
          <p className="text-gray-600">
            Visualize and compare FIFO, LRU, and Optimal page replacement algorithms
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Page Reference Sequence
              </label>
              <input
                type="text"
                value={sequence}
                onChange={(e) => setSequence(e.target.value)}
                placeholder="e.g., 7,0,1,2,0,3,0,4,2,3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Comma-separated page numbers
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Frames
              </label>
              <input
                type="number"
                value={frameSize}
                onChange={(e) => setFrameSize(parseInt(e.target.value))}
                min="1"
                max="10"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Algorithm
              </label>
              <select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="FIFO">FIFO (First In First Out)</option>
                <option value="LRU">LRU (Least Recently Used)</option>
                <option value="Optimal">Optimal</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={handleSimulate}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              Simulate Algorithm
            </button>
            <button
              onClick={handleCompareAll}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
            >
              Compare All Algorithms
            </button>
          </div>
        </div>

        {result && (
          <PageReplacementChart
            result={result}
            sequence={sequence.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n))}
            frameSize={frameSize}
          />
        )}

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Algorithm Descriptions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">FIFO</h4>
              <p className="text-sm text-blue-700">
                Replaces the page that has been in memory the longest. Simple but not always optimal.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">LRU</h4>
              <p className="text-sm text-green-700">
                Replaces the page that hasn't been used for the longest time. More complex but often better performance.
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">Optimal</h4>
              <p className="text-sm text-purple-700">
                Replaces the page that will be used farthest in the future. Theoretical optimum but impractical.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageReplacementSimulator;