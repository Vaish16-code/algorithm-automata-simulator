"use client";

import { useState } from "react";

interface Point {
  x: number;
  y: number;
  id: number;
}

interface ClosestPairResult {
  pair: [Point, Point];
  distance: number;
  steps: string[];
}

export default function ClosestPairPage() {
  const [points, setPoints] = useState<Point[]>([
    { x: 2, y: 3, id: 1 },
    { x: 12, y: 30, id: 2 },
    { x: 40, y: 50, id: 3 },
    { x: 5, y: 1, id: 4 },
    { x: 12, y: 10, id: 5 },
    { x: 3, y: 4, id: 6 }
  ]);
  const [result, setResult] = useState<ClosestPairResult | null>(null);
  const [showVisualization, setShowVisualization] = useState(false);

  // Calculate Euclidean distance between two points
  const distance = (p1: Point, p2: Point): number => {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  };

  // Brute force approach for comparison
  const bruteForceClosestPair = (points: Point[]): ClosestPairResult => {
    const steps: string[] = [];
    let minDistance = Infinity;
    let closestPair: [Point, Point] = [points[0], points[1]];

    steps.push(`Starting brute force with ${points.length} points`);
    
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dist = distance(points[i], points[j]);
        steps.push(`Distance between P${points[i].id}(${points[i].x},${points[i].y}) and P${points[j].id}(${points[j].x},${points[j].y}) = ${dist.toFixed(2)}`);
        
        if (dist < minDistance) {
          minDistance = dist;
          closestPair = [points[i], points[j]];
          steps.push(`New minimum distance found: ${dist.toFixed(2)}`);
        }
      }
    }

    return { pair: closestPair, distance: minDistance, steps };
  };

  // Divide and conquer approach
  const divideAndConquerClosestPair = (points: Point[]): ClosestPairResult => {
    const steps: string[] = [];
    
    // Sort points by x-coordinate
    const sortedByX = [...points].sort((a, b) => a.x - b.x);
    const sortedByY = [...points].sort((a, b) => a.y - b.y);
    
    steps.push("Sorted points by x and y coordinates");

    const closestPairRec = (pointsByX: Point[], pointsByY: Point[]): { pair: [Point, Point], distance: number } => {
      const n = pointsByX.length;

      // Base case: use brute force for small arrays
      if (n <= 3) {
        steps.push(`Base case: ${n} points, using brute force`);
        let minDist = Infinity;
        let closestPair: [Point, Point] = [pointsByX[0], pointsByX[1]];
        
        for (let i = 0; i < n; i++) {
          for (let j = i + 1; j < n; j++) {
            const dist = distance(pointsByX[i], pointsByX[j]);
            if (dist < minDist) {
              minDist = dist;
              closestPair = [pointsByX[i], pointsByX[j]];
            }
          }
        }
        return { pair: closestPair, distance: minDist };
      }

      // Divide
      const mid = Math.floor(n / 2);
      const midPoint = pointsByX[mid];
      
      const leftByX = pointsByX.slice(0, mid);
      const rightByX = pointsByX.slice(mid);
      
      const leftByY = pointsByY.filter(point => point.x <= midPoint.x);
      const rightByY = pointsByY.filter(point => point.x > midPoint.x);
      
      steps.push(`Divided into left (${leftByX.length}) and right (${rightByX.length}) halves at x = ${midPoint.x}`);

      // Conquer
      const leftResult = closestPairRec(leftByX, leftByY);
      const rightResult = closestPairRec(rightByX, rightByY);
      
      let minDist = Math.min(leftResult.distance, rightResult.distance);
      let closestPair = leftResult.distance < rightResult.distance ? leftResult.pair : rightResult.pair;
      
      steps.push(`Left minimum: ${leftResult.distance.toFixed(2)}, Right minimum: ${rightResult.distance.toFixed(2)}`);

      // Check strip around the middle line
      const strip: Point[] = [];
      for (const point of pointsByY) {
        if (Math.abs(point.x - midPoint.x) < minDist) {
          strip.push(point);
        }
      }
      
      steps.push(`Checking strip with ${strip.length} points`);

      // Check distances in strip
      for (let i = 0; i < strip.length; i++) {
        for (let j = i + 1; j < strip.length && (strip[j].y - strip[i].y) < minDist; j++) {
          const dist = distance(strip[i], strip[j]);
          if (dist < minDist) {
            minDist = dist;
            closestPair = [strip[i], strip[j]];
            steps.push(`New minimum found in strip: ${dist.toFixed(2)}`);
          }
        }
      }

      return { pair: closestPair, distance: minDist };
    };

    const result = closestPairRec(sortedByX, sortedByY);
    return { ...result, steps };
  };

  const handleSolveBruteForce = () => {
    const result = bruteForceClosestPair(points);
    setResult(result);
  };

  const handleSolveDivideConquer = () => {
    if (points.length < 2) {
      alert("Need at least 2 points");
      return;
    }
    const result = divideAndConquerClosestPair(points);
    setResult(result);
  };

  const addPoint = () => {
    const newPoint: Point = {
      x: Math.floor(Math.random() * 50) + 1,
      y: Math.floor(Math.random() * 50) + 1,
      id: points.length + 1
    };
    setPoints([...points, newPoint]);
  };

  const removePoint = (id: number) => {
    setPoints(points.filter(p => p.id !== id));
  };

  const generateRandomPoints = () => {
    const numPoints = Math.floor(Math.random() * 6) + 4; // 4-9 points
    const newPoints: Point[] = [];
    for (let i = 1; i <= numPoints; i++) {
      newPoints.push({
        x: Math.floor(Math.random() * 50) + 1,
        y: Math.floor(Math.random() * 50) + 1,
        id: i
      });
    }
    setPoints(newPoints);
    setResult(null);
  };

  const updatePoint = (id: number, x: number, y: number) => {
    setPoints(points.map(p => p.id === id ? { ...p, x, y } : p));
  };

  const PointVisualization = () => {
    const maxX = Math.max(...points.map(p => p.x)) + 5;
    const maxY = Math.max(...points.map(p => p.y)) + 5;
    const svgWidth = 400;
    const svgHeight = 300;
    
    const scaleX = svgWidth / maxX;
    const scaleY = svgHeight / maxY;

    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Point Visualization</h3>
        <svg width={svgWidth} height={svgHeight} className="border border-gray-300 bg-white">
          {/* Draw grid lines */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f0f0f0" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Draw closest pair line if result exists */}
          {result && (
            <line
              x1={result.pair[0].x * scaleX}
              y1={svgHeight - result.pair[0].y * scaleY}
              x2={result.pair[1].x * scaleX}
              y2={svgHeight - result.pair[1].y * scaleY}
              stroke="red"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          )}
          
          {/* Draw points */}
          {points.map((point) => (
            <g key={point.id}>
              <circle
                cx={point.x * scaleX}
                cy={svgHeight - point.y * scaleY}
                r="6"
                fill={result && (result.pair[0].id === point.id || result.pair[1].id === point.id) ? "red" : "blue"}
                stroke="white"
                strokeWidth="2"
              />
              <text
                x={point.x * scaleX + 10}
                y={svgHeight - point.y * scaleY - 10}
                fontSize="12"
                fill="black"
              >
                P{point.id}({point.x},{point.y})
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  const educationalContent = {
    introduction: "The closest pair of points problem finds the two points with minimum Euclidean distance in a set of points. The divide-and-conquer approach achieves O(n log n) complexity compared to O(n²) brute force.",
    steps: [
      "Sort points by x-coordinate and y-coordinate",
      "Divide points into left and right halves",
      "Recursively find closest pairs in each half",
      "Check the strip around the dividing line",
      "Return the minimum distance found"
    ],
    complexity: {
      divideConquer: "O(n log n) - optimal for this problem",
      bruteForce: "O(n²) - checks all pairs"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Closest Pair of <span className="text-green-600">Points</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find the closest pair of points using divide and conquer algorithm
          </p>
        </div>

        {/* Interactive Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Closest Pair Finder</h2>
            <div className="flex gap-4">
              <button
                onClick={generateRandomPoints}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Random Points
              </button>
              <button
                onClick={addPoint}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add Point
              </button>
              <button
                onClick={() => setShowVisualization(!showVisualization)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                {showVisualization ? "Hide" : "Show"} Visualization
              </button>
            </div>
          </div>

          {/* Points Input */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Points ({points.length})</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {points.map((point) => (
                  <div key={point.id} className="flex items-center gap-4 p-2 bg-gray-50 rounded">
                    <span className="w-8 text-center font-mono">P{point.id}</span>
                    <input
                      type="number"
                      value={point.x}
                      onChange={(e) => updatePoint(point.id, parseInt(e.target.value) || 0, point.y)}
                      className="w-16 px-2 py-1 border rounded text-center"
                      placeholder="x"
                    />
                    <input
                      type="number"
                      value={point.y}
                      onChange={(e) => updatePoint(point.id, point.x, parseInt(e.target.value) || 0)}
                      className="w-16 px-2 py-1 border rounded text-center"
                      placeholder="y"
                    />
                    <button
                      onClick={() => removePoint(point.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {showVisualization && (
              <div>
                <PointVisualization />
              </div>
            )}
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={handleSolveBruteForce}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Solve (Brute Force O(n²))
            </button>
            <button
              onClick={handleSolveDivideConquer}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Solve (Divide & Conquer O(n log n))
            </button>
          </div>

          {/* Results */}
          {result && (
            <div className="mt-8 space-y-6">
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-green-800 mb-4">Result</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-green-700">
                      <span className="font-semibold">Closest Pair:</span> P{result.pair[0].id}({result.pair[0].x}, {result.pair[0].y}) and P{result.pair[1].id}({result.pair[1].x}, {result.pair[1].y})
                    </p>
                    <p className="text-green-700">
                      <span className="font-semibold">Distance:</span> {result.distance.toFixed(4)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Algorithm Steps */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Algorithm Steps</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {result.steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs font-mono">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 text-sm">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Educational Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Understanding the Algorithm</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-green-600 mb-4">Key Concepts</h3>
              <p className="text-gray-700 mb-4">{educationalContent.introduction}</p>
              <div>
                <h4 className="font-semibold mb-2">Algorithm Steps:</h4>
                <ol className="list-decimal list-inside space-y-1">
                  {educationalContent.steps.map((step, index) => (
                    <li key={index} className="text-gray-600 text-sm">{step}</li>
                  ))}
                </ol>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-green-600 mb-4">Complexity Analysis</h3>
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Divide & Conquer</h4>
                  <p className="text-gray-700">{educationalContent.complexity.divideConquer}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Brute Force</h4>
                  <p className="text-gray-700">{educationalContent.complexity.bruteForce}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Exam Information */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Exam Preparation</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-blue-600 mb-4">Common Questions</h3>
              <ul className="space-y-2">
                <li className="text-gray-700 text-sm">• Explain the divide-and-conquer approach for closest pair</li>
                <li className="text-gray-700 text-sm">• Compare time complexities of different approaches</li>
                <li className="text-gray-700 text-sm">• Why do we need to check the strip in the middle?</li>
                <li className="text-gray-700 text-sm">• Prove that we only need to check 7 points in the strip</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-blue-600 mb-4">Study Tips</h3>
              <ul className="space-y-2">
                <li className="text-gray-700 text-sm">• Understand the geometric intuition behind the algorithm</li>
                <li className="text-gray-700 text-sm">• Practice the strip checking step carefully</li>
                <li className="text-gray-700 text-sm">• Remember the recurrence relation T(n) = 2T(n/2) + O(n)</li>
                <li className="text-gray-700 text-sm">• Know when the algorithm is optimal vs. when brute force is better</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
