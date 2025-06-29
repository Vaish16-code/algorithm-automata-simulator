"use client";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Define the DiskResult interface
interface DiskResult {
  seekTime: number;
  sequence: number[];
  detailedSteps?: string[];
}

// Disk scheduling algorithms
const fcfs = (queue: number[], head: number): DiskResult => {
  const sequence = [head, ...queue];
  let seekTime = 0;
  const detailedSteps = [];
  
  for (let i = 1; i < sequence.length; i++) {
    const movement = Math.abs(sequence[i] - sequence[i - 1]);
    seekTime += movement;
    detailedSteps.push(`|${sequence[i]} - ${sequence[i - 1]}| = ${movement}`);
  }
  
  return { seekTime, sequence, detailedSteps };
};

const sstf = (queue: number[], head: number): DiskResult => {
  const sequence = [head];
  const remaining = [...queue];
  let current = head;
  let seekTime = 0;
  const detailedSteps = [];

  while (remaining.length > 0) {
    let closestIndex = 0;
    let minDistance = Math.abs(remaining[0] - current);
    
    for (let i = 1; i < remaining.length; i++) {
      const distance = Math.abs(remaining[i] - current);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    }
    
    const next = remaining[closestIndex];
    const movement = Math.abs(next - current);
    seekTime += movement;
    detailedSteps.push(`|${next} - ${current}| = ${movement}`);
    sequence.push(next);
    current = next;
    remaining.splice(closestIndex, 1);
  }
  
  return { seekTime, sequence, detailedSteps };
};

const scan = (queue: number[], head: number, direction: "left" | "right"): DiskResult => {
  const sequence = [head];
  const sorted = [...queue].sort((a, b) => a - b);
  let seekTime = 0;
  let current = head;
  const detailedSteps = [];
  
  if (direction === "right") {
    const rightRequests = sorted.filter(req => req >= head);
    const leftRequests = sorted.filter(req => req < head).reverse();
    
    for (const req of rightRequests) {
      const movement = Math.abs(req - current);
      seekTime += movement;
      detailedSteps.push(`|${req} - ${current}| = ${movement}`);
      sequence.push(req);
      current = req;
    }
    
    if (rightRequests.length > 0) {
      const movement = Math.abs(199 - current);
      seekTime += movement;
      detailedSteps.push(`|199 - ${current}| = ${movement} (to end)`);
      current = 199;
    }
    
    for (const req of leftRequests) {
      const movement = Math.abs(req - current);
      seekTime += movement;
      detailedSteps.push(`|${req} - ${current}| = ${movement}`);
      sequence.push(req);
      current = req;
    }
  } else {
    const leftRequests = sorted.filter(req => req <= head).reverse();
    const rightRequests = sorted.filter(req => req > head);
    
    for (const req of leftRequests) {
      const movement = Math.abs(req - current);
      seekTime += movement;
      detailedSteps.push(`|${req} - ${current}| = ${movement}`);
      sequence.push(req);
      current = req;
    }
    
    if (leftRequests.length > 0) {
      const movement = Math.abs(0 - current);
      seekTime += movement;
      detailedSteps.push(`|0 - ${current}| = ${movement} (to start)`);
      current = 0;
    }
    
    for (const req of rightRequests) {
      const movement = Math.abs(req - current);
      seekTime += movement;
      detailedSteps.push(`|${req} - ${current}| = ${movement}`);
      sequence.push(req);
      current = req;
    }
  }
  
  return { seekTime, sequence, detailedSteps };
};

const cscan = (queue: number[], head: number): DiskResult => {
  const sequence = [head];
  const sorted = [...queue].sort((a, b) => a - b);
  let seekTime = 0;
  let current = head;
  const detailedSteps = [];
  
  const rightRequests = sorted.filter(req => req >= head);
  const leftRequests = sorted.filter(req => req < head);
  
  for (const req of rightRequests) {
    const movement = Math.abs(req - current);
    seekTime += movement;
    detailedSteps.push(`|${req} - ${current}| = ${movement}`);
    sequence.push(req);
    current = req;
  }
  
  if (leftRequests.length > 0) {
    const movementToEnd = Math.abs(199 - current);
    const jumpMovement = 199;
    seekTime += movementToEnd + jumpMovement;
    detailedSteps.push(`|199 - ${current}| + 199 = ${movementToEnd + jumpMovement} (circular jump)`);
    current = 0;
    
    for (const req of leftRequests) {
      const movement = Math.abs(req - current);
      seekTime += movement;
      detailedSteps.push(`|${req} - ${current}| = ${movement}`);
      sequence.push(req);
      current = req;
    }
  }
  
  return { seekTime, sequence, detailedSteps };
};

const look = (queue: number[], head: number, direction: "left" | "right"): DiskResult => {
  const sequence = [head];
  const sorted = [...queue].sort((a, b) => a - b);
  let seekTime = 0;
  let current = head;
  const detailedSteps = [];
  
  if (direction === "right") {
    const rightRequests = sorted.filter(req => req >= head);
    const leftRequests = sorted.filter(req => req < head).reverse();
    
    for (const req of rightRequests) {
      const movement = Math.abs(req - current);
      seekTime += movement;
      detailedSteps.push(`|${req} - ${current}| = ${movement}`);
      sequence.push(req);
      current = req;
    }
    
    for (const req of leftRequests) {
      const movement = Math.abs(req - current);
      seekTime += movement;
      detailedSteps.push(`|${req} - ${current}| = ${movement}`);
      sequence.push(req);
      current = req;
    }
  } else {
    const leftRequests = sorted.filter(req => req <= head).reverse();
    const rightRequests = sorted.filter(req => req > head);
    
    for (const req of leftRequests) {
      const movement = Math.abs(req - current);
      seekTime += movement;
      detailedSteps.push(`|${req} - ${current}| = ${movement}`);
      sequence.push(req);
      current = req;
    }
    
    for (const req of rightRequests) {
      const movement = Math.abs(req - current);
      seekTime += movement;
      detailedSteps.push(`|${req} - ${current}| = ${movement}`);
      sequence.push(req);
      current = req;
    }
  }
  
  return { seekTime, sequence, detailedSteps };
};

const clook = (queue: number[], head: number): DiskResult => {
  const sequence = [head];
  const sorted = [...queue].sort((a, b) => a - b);
  let seekTime = 0;
  let current = head;
  const detailedSteps = [];
  
  const rightRequests = sorted.filter(req => req >= head);
  const leftRequests = sorted.filter(req => req < head);
  
  for (const req of rightRequests) {
    const movement = Math.abs(req - current);
    seekTime += movement;
    detailedSteps.push(`|${req} - ${current}| = ${movement}`);
    sequence.push(req);
    current = req;
  }
  
  for (const req of leftRequests) {
    const movement = Math.abs(req - current);
    seekTime += movement;
    detailedSteps.push(`|${req} - ${current}| = ${movement}`);
    sequence.push(req);
    current = req;
  }
  
  return { seekTime, sequence, detailedSteps };
};

// Visual Disk Diagram Component
const DiskDiagram = ({ sequence, algorithm, queue }: { sequence: number[], algorithm: string, queue: number[] }) => {
  const diskSize = 200;
  const margin = 50;
  const svgWidth = 800;
  const svgHeight = 400;
  
  // Create scale for positioning
  const scale = (value: number) => margin + (value / diskSize) * (svgWidth - 2 * margin);
  
  // Get all unique positions for track marks
  const allPositions = [...new Set([...sequence, ...queue, 0, diskSize - 1])].sort((a, b) => a - b);
  
  return (
    <div className="w-full mt-6">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border-2 border-green-200">
        <h3 className="text-xl font-bold mb-4 text-gray-800 text-center">
          🎯 {algorithm} - Disk Head Movement Diagram
        </h3>
        
        <div className="bg-white rounded-lg p-4 border-2 border-gray-200 overflow-x-auto">
          <svg width={svgWidth} height={svgHeight} className="w-full">
            {/* Disk track line */}
            <line 
              x1={margin} 
              y1={50} 
              x2={svgWidth - margin} 
              y2={50} 
              stroke="#374151" 
              strokeWidth="3"
            />
            
            {/* Track position markers */}
            {allPositions.map((pos, index) => (
              <g key={index}>
                <line 
                  x1={scale(pos)} 
                  y1={30} 
                  x2={scale(pos)} 
                  y2={70} 
                  stroke="#6b7280" 
                  strokeWidth="2"
                />
                <text 
                  x={scale(pos)} 
                  y={25} 
                  textAnchor="middle" 
                  className="text-sm font-bold fill-gray-700"
                >
                  {pos}
                </text>
                {queue.includes(pos) && (
                  <circle 
                    cx={scale(pos)} 
                    cy={50} 
                    r="8" 
                    fill="#f59e0b" 
                    stroke="#d97706" 
                    strokeWidth="2"
                  />
                )}
              </g>
            ))}
            
            {/* Movement arrows */}
            {sequence.map((pos, index) => {
              if (index === 0) return null;
              const prevPos = sequence[index - 1];
              const currentPos = pos;
              const y = 100 + (index - 1) * 30;
              
              return (
                <g key={index}>
                  {/* Movement line */}
                  <line 
                    x1={scale(prevPos)} 
                    y1={y} 
                    x2={scale(currentPos)} 
                    y2={y} 
                    stroke="#dc2626" 
                    strokeWidth="3"
                    markerEnd="url(#arrowhead)"
                  />
                  
                  {/* Start point */}
                  <circle 
                    cx={scale(prevPos)} 
                    cy={y} 
                    r="6" 
                    fill="#dc2626" 
                    stroke="#ffffff" 
                    strokeWidth="2"
                  />
                  
                  {/* End point */}
                  <circle 
                    cx={scale(currentPos)} 
                    cy={y} 
                    r="6" 
                    fill="#16a34a" 
                    stroke="#ffffff" 
                    strokeWidth="2"
                  />
                  
                  {/* Movement distance label */}
                  <text 
                    x={(scale(prevPos) + scale(currentPos)) / 2} 
                    y={y - 8} 
                    textAnchor="middle" 
                    className="text-xs font-bold fill-red-600"
                  >
                    {Math.abs(currentPos - prevPos)}
                  </text>
                  
                  {/* Step label */}
                  <text 
                    x={20} 
                    y={y + 5} 
                    textAnchor="start" 
                    className="text-sm font-bold fill-gray-700"
                  >
                    {index}
                  </text>
                </g>
              );
            })}
            
            {/* Arrow marker definition */}
            <defs>
              <marker 
                id="arrowhead" 
                markerWidth="10" 
                markerHeight="7" 
                refX="9" 
                refY="3.5" 
                orient="auto"
              >
                <polygon 
                  points="0 0, 10 3.5, 0 7" 
                  fill="#dc2626"
                />
              </marker>
            </defs>
            
            {/* Legend */}
            <g transform="translate(50, 350)">
              <text className="text-sm font-bold fill-gray-700" x="0" y="0">Legend:</text>
              <circle cx="60" cy="-5" r="6" fill="#dc2626" stroke="#ffffff" strokeWidth="2"/>
              <text className="text-xs fill-gray-600" x="75" y="0">Start Position</text>
              <circle cx="180" cy="-5" r="6" fill="#16a34a" stroke="#ffffff" strokeWidth="2"/>
              <text className="text-xs fill-gray-600" x="195" y="0">End Position</text>
              <circle cx="300" cy="-5" r="8" fill="#f59e0b" stroke="#d97706" strokeWidth="2"/>
              <text className="text-xs fill-gray-600" x="315" y="0">Request Queue</text>
            </g>
          </svg>
        </div>
        
        {/* Algorithm name at bottom */}
        <div className="text-center mt-4">
          <p className="text-lg font-bold text-gray-600 italic">{algorithm}</p>
        </div>
      </div>
    </div>
  );
};

// Enhanced Line Chart component
const DiskChart = ({ sequence, algorithm, seekTime, detailedSteps }: { 
  sequence: number[], 
  algorithm: string, 
  seekTime: number,
  detailedSteps?: string[]
}) => {
  const chartData = sequence.map((position, index) => ({
    step: index,
    position: position,
  }));

  return (
    <div className="w-full mt-6">
      <div className="bg-white rounded-lg p-6 border-2 border-gray-300 shadow-lg">
        <h3 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          📈 {algorithm} Algorithm - Head Movement Chart
        </h3>
        
        <div className="h-96 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 40, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeWidth={1} />
              <XAxis 
                dataKey="step" 
                label={{ value: 'Steps', position: 'insideBottom', offset: -10, style: { textAnchor: 'middle', fontSize: '16px', fontWeight: 'bold' } }}
                tick={{ fontSize: 14, fill: '#374151', fontWeight: 'bold' }}
                stroke="#374151"
                strokeWidth={2}
                type="number"
                domain={[0, sequence.length - 1]}
              />
              <YAxis 
                label={{ value: 'Track Position', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '16px', fontWeight: 'bold' } }}
                tick={{ fontSize: 14, fill: '#374151', fontWeight: 'bold' }}
                stroke="#374151"
                strokeWidth={2}
                domain={[0, 200]}
              />
              <Tooltip 
                formatter={(value: number) => [value, 'Track Position']}
                labelFormatter={(step: number) => `Step: ${step}`}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '2px solid #3b82f6',
                  borderRadius: '8px',
                  color: '#374151',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
              />
              <Line 
                type="linear" 
                dataKey="position" 
                stroke="#22c55e" 
                strokeWidth={3}
                dot={{ fill: '#22c55e', strokeWidth: 2, r: 4, stroke: '#ffffff' }}
                activeDot={{ r: 6, stroke: '#22c55e', strokeWidth: 3, fill: '#dcfce7' }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
            <h4 className="text-lg font-bold text-gray-800 mb-3">📋 Execution Summary</h4>
            <div className="space-y-2">
              <p className="text-sm"><span className="font-bold">Algorithm:</span> {algorithm}</p>
              <p className="text-sm"><span className="font-bold">Total Seek Time:</span> {seekTime} cylinders</p>
              <p className="text-sm"><span className="font-bold">Total Steps:</span> {sequence.length - 1}</p>
              <p className="text-sm"><span className="font-bold">Average Seek Time:</span> {(seekTime / (sequence.length - 1)).toFixed(2)} cylinders/step</p>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
            <h4 className="text-lg font-bold text-gray-800 mb-3">🎯 Sequence Path</h4>
            <p className="text-sm font-mono bg-white p-3 rounded border text-gray-800 break-all">
              {sequence.join(' → ')}
            </p>
          </div>
        </div>
        
        {detailedSteps && (
          <div className="mt-6 bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
            <h4 className="text-lg font-bold text-gray-800 mb-3">🔢 Step-by-Step Calculation</h4>
            <div className="max-h-32 overflow-y-auto text-sm font-mono bg-white p-3 rounded border">
              {detailedSteps.map((step, index) => (
                <div key={index} className="text-gray-700 mb-1">
                  Step {index + 1}: {step}
                </div>
              ))}
              <div className="font-bold text-green-700 border-t pt-2 mt-2">
                Total Seek Time: {seekTime} cylinders
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function DiskPage() {
  const [queue, setQueue] = useState<number[]>([82, 170, 43, 140, 24, 16, 190]);
  const [head, setHead] = useState(50);
  const [algo, setAlgo] = useState("FCFS");
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [result, setResult] = useState<DiskResult | null>(null);

  const run = () => {
    let output: DiskResult;
    switch (algo) {
      case "FCFS":
        output = fcfs(queue, head);
        break;
      case "SSTF":
        output = sstf(queue, head);
        break;
      case "SCAN":
        output = scan(queue, head, direction);
        break;
      case "C-SCAN":
        output = cscan(queue, head);
        break;
      case "LOOK":
        output = look(queue, head, direction);
        break;
      case "C-LOOK":
        output = clook(queue, head);
        break;
      default:
        return;
    }
    setResult(output);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800 drop-shadow-lg">
          🔄 Disk Scheduling Simulator
        </h1>
        
        <div className="bg-white rounded-xl shadow-xl p-8 border-2 border-gray-200">
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-bold mb-2 text-gray-700">
                📋 Request Queue (comma-separated):
              </label>
              <input
                type="text"
                value={queue.join(",")}
                onChange={(e) =>
                  setQueue(e.target.value.split(",").map((x) => parseInt(x.trim())).filter(x => !isNaN(x)))
                }
                className="border-4 border-gray-800 rounded-lg w-full p-4 text-xl font-bold bg-white text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 shadow-lg"
                placeholder="82, 170, 43, 140, 24, 16, 190"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-lg font-bold mb-2 text-gray-700">
                  📍 Head Position:
                </label>
                <input
                  type="number"
                  value={head}
                  onChange={(e) => setHead(+e.target.value)}
                  className="border-4 border-gray-800 rounded-lg p-4 w-full text-xl font-bold bg-white text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 shadow-lg"
                  min="0"
                  max="199"
                />
              </div>
              
              <div>
                <label className="block text-lg font-bold mb-2 text-gray-700">
                  ⚙️ Algorithm:
                </label>
                <select
                  value={algo}
                  onChange={(e) => setAlgo(e.target.value)}
                  className="border-4 border-gray-800 rounded-lg p-4 w-full text-xl font-bold bg-white text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 shadow-lg"
                >
                  <option value="FCFS">FCFS (First Come First Serve)</option>
                  <option value="SSTF">SSTF (Shortest Seek Time First)</option>
                  <option value="SCAN">SCAN (Elevator)</option>
                  <option value="C-SCAN">C-SCAN (Circular SCAN)</option>
                  <option value="LOOK">LOOK</option>
                  <option value="C-LOOK">C-LOOK (Circular LOOK)</option>
                </select>
              </div>
              
              {(algo === "SCAN" || algo === "LOOK") && (
                <div>
                  <label className="block text-lg font-bold mb-2 text-gray-700">
                    🔄 Direction:
                  </label>
                  <select
                    value={direction}
                    onChange={(e) => setDirection(e.target.value as "left" | "right")}
                    className="border-4 border-gray-800 rounded-lg p-4 w-full text-xl font-bold bg-white text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 shadow-lg"
                  >
                    <option value="left">⬅️ Left (Decreasing)</option>
                    <option value="right">➡️ Right (Increasing)</option>
                  </select>
                </div>
              )}
            </div>
            
            <button
              onClick={run}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg text-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
            >
              🚀 Simulate Algorithm
            </button>
          </div>
        </div>

        {result && (
          <div className="mt-8">
            <div className="bg-white rounded-xl shadow-xl p-8 border-2 border-green-200">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-green-600 mb-2">
                  📊 Results for {algo} Algorithm
                </h2>
                <div className="grid md:grid-cols-2 gap-4 max-w-md mx-auto">
                  <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                    <p className="text-sm font-semibold text-green-700">Total Seek Time</p>
                    <p className="text-2xl font-bold text-green-800">{result.seekTime}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                    <p className="text-sm font-semibold text-blue-700">Average Seek Time</p>
                    <p className="text-2xl font-bold text-blue-800">
                      {(result.seekTime / queue.length).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Visual Disk Diagram */}
              <DiskDiagram 
                sequence={result.sequence} 
                algorithm={algo}
                queue={queue}
              />
              
              {/* Line Chart */}
              <DiskChart 
                sequence={result.sequence} 
                algorithm={algo}
                seekTime={result.seekTime}
                detailedSteps={result.detailedSteps}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}