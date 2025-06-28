"use client";

import React, { useState } from "react";
import { Cpu, Play, RotateCcw, Plus, Trash2, Info, Activity } from "lucide-react";

interface IORequest {
  id: string;
  track: number;
  arrivalTime: number;
  processTime: number;
  priority?: number;
}

interface IOResult {
  algorithm: string;
  requests: IORequest[];
  executionOrder: IORequest[];
  totalSeekTime: number;
  averageSeekTime: number;
  maxWaitTime: number;
  averageWaitTime: number;
  timeline: TimelineEntry[];
}

interface TimelineEntry {
  requestId: string;
  startTime: number;
  endTime: number;
  seekTime: number;
  currentTrack: number;
}

export default function IOSchedulingPage() {
  const [requests, setRequests] = useState<IORequest[]>([
    { id: "R1", track: 82, arrivalTime: 0, processTime: 3 },
    { id: "R2", track: 170, arrivalTime: 1, processTime: 2 },
    { id: "R3", track: 43, arrivalTime: 2, processTime: 4 },
    { id: "R4", track: 140, arrivalTime: 3, processTime: 1 },
    { id: "R5", track: 24, arrivalTime: 4, processTime: 3 },
    { id: "R6", track: 16, arrivalTime: 5, processTime: 2 },
    { id: "R7", track: 190, arrivalTime: 6, processTime: 3 }
  ]);
  
  const [algorithm, setAlgorithm] = useState<string>("fcfs");
  const [headPosition, setHeadPosition] = useState(50);
  const [result, setResult] = useState<IOResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const algorithms = [
    {
      value: "fcfs",
      label: "First Come First Serve (FCFS)",
      description: "I/O requests processed in arrival order",
      advantages: ["Simple implementation", "Fair for all requests", "No starvation"],
      disadvantages: ["High seek time", "Poor throughput", "No optimization"]
    },
    {
      value: "sstf",
      label: "Shortest Seek Time First (SSTF)",
      description: "Process request closest to current head position",
      advantages: ["Better seek time than FCFS", "Good throughput", "Reduces head movement"],
      disadvantages: ["Starvation possible", "Not optimal", "Unfair to distant requests"]
    },
    {
      value: "scan",
      label: "SCAN (Elevator Algorithm)",
      description: "Head moves in one direction, serving requests until end",
      advantages: ["No starvation", "Good seek time", "Predictable behavior"],
      disadvantages: ["Long wait for requests just missed", "Biased against middle tracks"]
    },
    {
      value: "c-scan",
      label: "C-SCAN (Circular SCAN)",
      description: "Head moves in one direction, then jumps to beginning",
      advantages: ["More uniform wait time", "Better for heavy loads", "Reduces bias"],
      disadvantages: ["Longer seek time", "Head return overhead", "Complex implementation"]
    }
  ];

  const addRequest = () => {
    const newId = `R${requests.length + 1}`;
    setRequests([
      ...requests,
      { id: newId, track: 0, arrivalTime: requests.length, processTime: 1 }
    ]);
  };

  const removeRequest = (index: number) => {
    if (requests.length > 2) {
      setRequests(requests.filter((_, i) => i !== index));
    }
  };

  const updateRequest = (index: number, field: keyof IORequest, value: number | string) => {
    const updated = [...requests];
    updated[index] = { ...updated[index], [field]: value };
    setRequests(updated);
  };

  const fcfsScheduling = (reqs: IORequest[], head: number): IOResult => {
    const sortedRequests = [...reqs].sort((a, b) => a.arrivalTime - b.arrivalTime);
    const timeline: TimelineEntry[] = [];
    let currentTime = 0;
    let currentHead = head;
    let totalSeekTime = 0;
    const waitTimes: number[] = [];

    sortedRequests.forEach(request => {
      const seekTime = Math.abs(currentHead - request.track);
      const startTime = Math.max(currentTime, request.arrivalTime);
      const endTime = startTime + seekTime + request.processTime;
      
      timeline.push({
        requestId: request.id,
        startTime,
        endTime,
        seekTime,
        currentTrack: request.track
      });

      totalSeekTime += seekTime;
      waitTimes.push(startTime - request.arrivalTime);
      currentHead = request.track;
      currentTime = endTime;
    });

    return {
      algorithm: "FCFS",
      requests: reqs,
      executionOrder: sortedRequests,
      totalSeekTime,
      averageSeekTime: totalSeekTime / sortedRequests.length,
      maxWaitTime: Math.max(...waitTimes),
      averageWaitTime: waitTimes.reduce((sum, wt) => sum + wt, 0) / waitTimes.length,
      timeline
    };
  };

  const sstfScheduling = (reqs: IORequest[], head: number): IOResult => {
    const timeline: TimelineEntry[] = [];
    let currentTime = 0;
    let currentHead = head;
    let totalSeekTime = 0;
    const processedRequests: IORequest[] = [];
    const remainingRequests = [...reqs];
    const waitTimes: number[] = [];

    while (remainingRequests.length > 0) {
      // Find closest request that has arrived
      const availableRequests = remainingRequests.filter(r => r.arrivalTime <= currentTime);
      
      if (availableRequests.length === 0) {
        currentTime++;
        continue;
      }

      const closestRequest = availableRequests.reduce((closest, current) => {
        const closestDistance = Math.abs(currentHead - closest.track);
        const currentDistance = Math.abs(currentHead - current.track);
        return currentDistance < closestDistance ? current : closest;
      });

      const seekTime = Math.abs(currentHead - closestRequest.track);
      const startTime = currentTime;
      const endTime = startTime + seekTime + closestRequest.processTime;

      timeline.push({
        requestId: closestRequest.id,
        startTime,
        endTime,
        seekTime,
        currentTrack: closestRequest.track
      });

      totalSeekTime += seekTime;
      waitTimes.push(startTime - closestRequest.arrivalTime);
      processedRequests.push(closestRequest);
      remainingRequests.splice(remainingRequests.indexOf(closestRequest), 1);
      currentHead = closestRequest.track;
      currentTime = endTime;
    }

    return {
      algorithm: "SSTF",
      requests: reqs,
      executionOrder: processedRequests,
      totalSeekTime,
      averageSeekTime: totalSeekTime / processedRequests.length,
      maxWaitTime: Math.max(...waitTimes),
      averageWaitTime: waitTimes.reduce((sum, wt) => sum + wt, 0) / waitTimes.length,
      timeline
    };
  };

  const scanScheduling = (reqs: IORequest[], head: number): IOResult => {
    const timeline: TimelineEntry[] = [];
    let currentTime = 0;
    let currentHead = head;
    let totalSeekTime = 0;
    const processedRequests: IORequest[] = [];
    let direction = 1; // 1 for up, -1 for down
    const waitTimes: number[] = [];

    // Sort requests by track number
    const sortedRequests = [...reqs].sort((a, b) => a.track - b.track);
    
    // Split into requests above and below current head
    const belowHead = sortedRequests.filter(r => r.track < head);
    const aboveHead = sortedRequests.filter(r => r.track >= head);

    // Process requests in scan order
    const scanOrder = direction === 1 ? aboveHead.concat(belowHead.reverse()) : belowHead.reverse().concat(aboveHead);

    scanOrder.forEach(request => {
      currentTime = Math.max(currentTime, request.arrivalTime);
      const seekTime = Math.abs(currentHead - request.track);
      const startTime = currentTime;
      const endTime = startTime + seekTime + request.processTime;

      timeline.push({
        requestId: request.id,
        startTime,
        endTime,
        seekTime,
        currentTrack: request.track
      });

      totalSeekTime += seekTime;
      waitTimes.push(startTime - request.arrivalTime);
      processedRequests.push(request);
      currentHead = request.track;
      currentTime = endTime;
    });

    return {
      algorithm: "SCAN",
      requests: reqs,
      executionOrder: processedRequests,
      totalSeekTime,
      averageSeekTime: totalSeekTime / processedRequests.length,
      maxWaitTime: Math.max(...waitTimes),
      averageWaitTime: waitTimes.reduce((sum, wt) => sum + wt, 0) / waitTimes.length,
      timeline
    };
  };

  const cscanScheduling = (reqs: IORequest[], head: number): IOResult => {
    const timeline: TimelineEntry[] = [];
    let currentTime = 0;
    let currentHead = head;
    let totalSeekTime = 0;
    const processedRequests: IORequest[] = [];
    const waitTimes: number[] = [];

    // Sort requests by track number
    const sortedRequests = [...reqs].sort((a, b) => a.track - b.track);
    
    // Split into requests above and below current head
    const belowHead = sortedRequests.filter(r => r.track < head).sort((a, b) => a.track - b.track);
    const aboveHead = sortedRequests.filter(r => r.track >= head).sort((a, b) => a.track - b.track);

    // Process requests in C-SCAN order (up then wrap to beginning)
    const cscanOrder = aboveHead.concat(belowHead);

    cscanOrder.forEach((request, index) => {
      currentTime = Math.max(currentTime, request.arrivalTime);
      
      // Add wrap-around seek time if we jump from end to beginning
      if (index === aboveHead.length && belowHead.length > 0) {
        totalSeekTime += 199; // Assume disk size of 200 tracks
        currentHead = 0;
      }

      const seekTime = Math.abs(currentHead - request.track);
      const startTime = currentTime;
      const endTime = startTime + seekTime + request.processTime;

      timeline.push({
        requestId: request.id,
        startTime,
        endTime,
        seekTime,
        currentTrack: request.track
      });

      totalSeekTime += seekTime;
      waitTimes.push(startTime - request.arrivalTime);
      processedRequests.push(request);
      currentHead = request.track;
      currentTime = endTime;
    });

    return {
      algorithm: "C-SCAN",
      requests: reqs,
      executionOrder: processedRequests,
      totalSeekTime,
      averageSeekTime: totalSeekTime / processedRequests.length,
      maxWaitTime: Math.max(...waitTimes),
      averageWaitTime: waitTimes.reduce((sum, wt) => sum + wt, 0) / waitTimes.length,
      timeline
    };
  };

  const runSimulation = () => {
    setIsSimulating(true);
    
    setTimeout(() => {
      let simulationResult: IOResult;
      
      switch (algorithm) {
        case "fcfs":
          simulationResult = fcfsScheduling(requests, headPosition);
          break;
        case "sstf":
          simulationResult = sstfScheduling(requests, headPosition);
          break;
        case "scan":
          simulationResult = scanScheduling(requests, headPosition);
          break;
        case "c-scan":
          simulationResult = cscanScheduling(requests, headPosition);
          break;
        default:
          simulationResult = fcfsScheduling(requests, headPosition);
      }
      
      setResult(simulationResult);
      setIsSimulating(false);
    }, 1000);
  };

  const resetSimulation = () => {
    setResult(null);
    setRequests([
      { id: "R1", track: 82, arrivalTime: 0, processTime: 3 },
      { id: "R2", track: 170, arrivalTime: 1, processTime: 2 },
      { id: "R3", track: 43, arrivalTime: 2, processTime: 4 },
      { id: "R4", track: 140, arrivalTime: 3, processTime: 1 },
      { id: "R5", track: 24, arrivalTime: 4, processTime: 3 },
      { id: "R6", track: 16, arrivalTime: 5, processTime: 2 },
      { id: "R7", track: 190, arrivalTime: 6, processTime: 3 }
    ]);
    setHeadPosition(50);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-orange-300 text-sm font-medium mb-4">
              <Activity className="h-4 w-4 mr-2" />
              I/O Management
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              I/O Scheduling Algorithms
            </h1>
            <p className="text-xl text-orange-100 max-w-3xl mx-auto">
              Interactive simulation of I/O request scheduling algorithms with disk head movement 
              visualization and performance analysis.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Algorithm Selection */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Cpu className="h-5 w-5 mr-2 text-orange-600" />
                I/O Scheduling Algorithm
              </h3>
              
              <div className="space-y-3">
                {algorithms.map((algo) => (
                  <label key={algo.value} className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="algorithm"
                      value={algo.value}
                      checked={algorithm === algo.value}
                      onChange={(e) => setAlgorithm(e.target.value)}
                      className="mt-1 text-orange-600"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{algo.label}</div>
                      <div className="text-sm text-gray-600">{algo.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Head Configuration */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Disk Configuration</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Initial Head Position
                </label>
                <input
                  type="number"
                  min="0"
                  max="199"
                  value={headPosition}
                  onChange={(e) => setHeadPosition(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* I/O Requests */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">I/O Request Queue</h3>
                <button
                  onClick={addRequest}
                  className="flex items-center px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Request
                </button>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {requests.map((request, index) => (
                  <div key={index} className="grid grid-cols-5 gap-2 items-center">
                    <input
                      type="text"
                      value={request.id}
                      onChange={(e) => updateRequest(index, "id", e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded text-center text-sm"
                      placeholder="ID"
                    />
                    <input
                      type="number"
                      value={request.track}
                      onChange={(e) => updateRequest(index, "track", Number(e.target.value))}
                      className="px-2 py-1 border border-gray-300 rounded text-center text-sm"
                      placeholder="Track"
                      min="0"
                      max="199"
                    />
                    <input
                      type="number"
                      value={request.arrivalTime}
                      onChange={(e) => updateRequest(index, "arrivalTime", Number(e.target.value))}
                      className="px-2 py-1 border border-gray-300 rounded text-center text-sm"
                      placeholder="Arrival"
                      min="0"
                    />
                    <input
                      type="number"
                      value={request.processTime}
                      onChange={(e) => updateRequest(index, "processTime", Number(e.target.value))}
                      className="px-2 py-1 border border-gray-300 rounded text-center text-sm"
                      placeholder="Process"
                      min="1"
                    />
                    <button
                      onClick={() => removeRequest(index)}
                      className="text-red-600 hover:text-red-800 flex justify-center"
                      disabled={requests.length <= 2}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-5 gap-2 mt-2 text-xs text-gray-600 font-medium">
                <div className="text-center">ID</div>
                <div className="text-center">Track</div>
                <div className="text-center">Arrival</div>
                <div className="text-center">Process</div>
                <div className="text-center">Action</div>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="space-y-3">
              <button
                onClick={runSimulation}
                disabled={isSimulating || requests.length === 0}
                className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSimulating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Simulating...
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 mr-2" />
                    Run Simulation
                  </>
                )}
              </button>

              <button
                onClick={resetSimulation}
                className="w-full flex items-center justify-center px-6 py-3 bg-gray-600 text-white font-semibold rounded-xl hover:bg-gray-700"
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                Reset
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-6">
            {result ? (
              <>
                {/* Performance Metrics */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Metrics</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center bg-orange-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{result.totalSeekTime}</div>
                      <div className="text-sm text-orange-800">Total Seek Time</div>
                    </div>
                    <div className="text-center bg-blue-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{result.averageSeekTime.toFixed(2)}</div>
                      <div className="text-sm text-blue-800">Avg Seek Time</div>
                    </div>
                    <div className="text-center bg-green-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{result.averageWaitTime.toFixed(2)}</div>
                      <div className="text-sm text-green-800">Avg Wait Time</div>
                    </div>
                    <div className="text-center bg-purple-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{result.maxWaitTime}</div>
                      <div className="text-sm text-purple-800">Max Wait Time</div>
                    </div>
                  </div>
                </div>

                {/* Execution Timeline */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Execution Order</h3>
                  
                  <div className="space-y-3">
                    {result.timeline.map((entry, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800">{entry.requestId}</div>
                            <div className="text-sm text-gray-600">Track: {entry.currentTrack}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">Seek Time: {entry.seekTime}</div>
                          <div className="text-sm text-gray-600">Time: {entry.startTime}-{entry.endTime}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Head Movement Visualization */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Head Movement Pattern</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <div className="w-4 h-4 bg-orange-600 rounded"></div>
                      <span>Head Position</span>
                      <div className="w-4 h-4 bg-blue-600 rounded ml-4"></div>
                      <span>Request Track</span>
                    </div>
                    
                    <div className="relative">
                      <div className="flex justify-between text-xs text-gray-500 mb-2">
                        <span>0</span>
                        <span>50</span>
                        <span>100</span>
                        <span>150</span>
                        <span>199</span>
                      </div>
                      
                      <div className="relative h-8 bg-gray-200 rounded-lg">
                        {/* Initial head position */}
                        <div 
                          className="absolute top-0 w-2 h-8 bg-orange-600 rounded"
                          style={{ left: `${(headPosition / 199) * 100}%` }}
                        ></div>
                        
                        {/* Request tracks */}
                        {requests.map((request, index) => (
                          <div
                            key={index}
                            className="absolute top-1 w-1 h-6 bg-blue-600"
                            style={{ left: `${(request.track / 199) * 100}%` }}
                            title={`${request.id}: Track ${request.track}`}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <Activity className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Ready to Simulate</h3>
                <p className="text-gray-500">
                  Configure your I/O requests and algorithm settings, then click "Run Simulation" to see the scheduling process.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Algorithm Information */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Info className="h-5 w-5 mr-2 text-orange-600" />
            Algorithm Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">
                Current Algorithm: {algorithms.find(a => a.value === algorithm)?.label}
              </h4>
              <p className="text-gray-600 text-sm mb-4">
                {algorithms.find(a => a.value === algorithm)?.description}
              </p>
              
              <div className="text-sm">
                <div className="font-medium text-gray-700 mb-2">Advantages:</div>
                <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                  {algorithms.find(a => a.value === algorithm)?.advantages.map((adv, i) => (
                    <li key={i}>{adv}</li>
                  ))}
                </ul>
                
                <div className="font-medium text-gray-700 mb-2">Disadvantages:</div>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {algorithms.find(a => a.value === algorithm)?.disadvantages.map((dis, i) => (
                    <li key={i}>{dis}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Mumbai University Exam Tips</h4>
              <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                <li>Draw disk track diagrams showing head movement</li>
                <li>Calculate total seek time step by step</li>
                <li>Show the order of request processing</li>
                <li>Compare algorithms based on seek time and fairness</li>
                <li>Explain the concept of starvation</li>
                <li>Discuss real-world hard disk implementations</li>
              </ul>
              
              <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                <div className="font-medium text-orange-800 text-sm">Performance Metrics:</div>
                <div className="text-orange-700 text-xs mt-1 space-y-1">
                  <div>• Seek Time: Time to move head to target track</div>
                  <div>• Rotational Latency: Time for sector to reach head</div>
                  <div>• Transfer Time: Time to read/write data</div>
                  <div>• Total Access Time = Seek + Rotational + Transfer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
