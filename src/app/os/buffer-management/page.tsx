"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Database, ArrowRight, RotateCcw, Layers, Zap } from "lucide-react";

export default function BufferManagementPage() {
  const [bufferType, setBufferType] = useState("single");
  const [simulation, setSimulation] = useState({
    buffer: [],
    input: "",
    output: "",
    steps: [],
    currentStep: 0
  });

  const bufferTypes = [
    {
      id: "single",
      name: "Single Buffer",
      description: "One buffer between producer and consumer",
      capacity: 1,
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: "double",
      name: "Double Buffer",
      description: "Two buffers alternate between read/write",
      capacity: 2,
      color: "from-purple-500 to-pink-500"
    },
    {
      id: "circular",
      name: "Circular Buffer",
      description: "Ring buffer with multiple slots",
      capacity: 4,
      color: "from-green-500 to-emerald-500"
    }
  ];

  const initializeSimulation = (type: string) => {
    const capacity = bufferTypes.find(t => t.id === type)?.capacity || 1;
    setSimulation({
      buffer: new Array(capacity).fill(null),
      input: "",
      output: "",
      steps: [],
      currentStep: 0
    });
  };

  const addToBuffer = (data: string) => {
    if (!data.trim()) return;
    
    const newBuffer = [...simulation.buffer];
    const newSteps = [...simulation.steps];
    
    if (bufferType === "single") {
      if (newBuffer[0] === null) {
        newBuffer[0] = data;
        newSteps.push({
          operation: "WRITE",
          data: data,
          buffer: [...newBuffer],
          message: `Added "${data}" to buffer`
        });
      } else {
        newSteps.push({
          operation: "WRITE_FAILED",
          data: data,
          buffer: [...newBuffer],
          message: `Buffer full! Cannot add "${data}"`
        });
      }
    } else if (bufferType === "double") {
      const emptyIndex = newBuffer.findIndex(slot => slot === null);
      if (emptyIndex !== -1) {
        newBuffer[emptyIndex] = data;
        newSteps.push({
          operation: "WRITE",
          data: data,
          buffer: [...newBuffer],
          message: `Added "${data}" to buffer ${emptyIndex + 1}`
        });
      } else {
        newSteps.push({
          operation: "WRITE_FAILED",
          data: data,
          buffer: [...newBuffer],
          message: `Both buffers full! Cannot add "${data}"`
        });
      }
    } else if (bufferType === "circular") {
      const emptyIndex = newBuffer.findIndex(slot => slot === null);
      if (emptyIndex !== -1) {
        newBuffer[emptyIndex] = data;
        newSteps.push({
          operation: "WRITE",
          data: data,
          buffer: [...newBuffer],
          message: `Added "${data}" to circular buffer at position ${emptyIndex}`
        });
      } else {
        // Circular buffer - overwrite oldest
        newBuffer[0] = data;
        newBuffer.push(newBuffer.shift());
        newSteps.push({
          operation: "WRITE_OVERWRITE",
          data: data,
          buffer: [...newBuffer],
          message: `Circular buffer full! Overwriting oldest with "${data}"`
        });
      }
    }
    
    setSimulation({
      ...simulation,
      buffer: newBuffer,
      steps: newSteps,
      input: ""
    });
  };

  const readFromBuffer = () => {
    const newBuffer = [...simulation.buffer];
    const newSteps = [...simulation.steps];
    
    if (bufferType === "single") {
      if (newBuffer[0] !== null) {
        const data = newBuffer[0];
        newBuffer[0] = null;
        newSteps.push({
          operation: "READ",
          data: data,
          buffer: [...newBuffer],
          message: `Read "${data}" from buffer`
        });
        setSimulation({
          ...simulation,
          buffer: newBuffer,
          steps: newSteps,
          output: data
        });
      } else {
        newSteps.push({
          operation: "READ_FAILED",
          data: "",
          buffer: [...newBuffer],
          message: "Buffer empty! Cannot read"
        });
        setSimulation({
          ...simulation,
          steps: newSteps
        });
      }
    } else if (bufferType === "double") {
      const filledIndex = newBuffer.findIndex(slot => slot !== null);
      if (filledIndex !== -1) {
        const data = newBuffer[filledIndex];
        newBuffer[filledIndex] = null;
        newSteps.push({
          operation: "READ",
          data: data,
          buffer: [...newBuffer],
          message: `Read "${data}" from buffer ${filledIndex + 1}`
        });
        setSimulation({
          ...simulation,
          buffer: newBuffer,
          steps: newSteps,
          output: data
        });
      } else {
        newSteps.push({
          operation: "READ_FAILED",
          data: "",
          buffer: [...newBuffer],
          message: "Both buffers empty! Cannot read"
        });
        setSimulation({
          ...simulation,
          steps: newSteps
        });
      }
    } else if (bufferType === "circular") {
      const filledIndex = newBuffer.findIndex(slot => slot !== null);
      if (filledIndex !== -1) {
        const data = newBuffer[filledIndex];
        newBuffer[filledIndex] = null;
        newSteps.push({
          operation: "READ",
          data: data,
          buffer: [...newBuffer],
          message: `Read "${data}" from circular buffer`
        });
        setSimulation({
          ...simulation,
          buffer: newBuffer,
          steps: newSteps,
          output: data
        });
      } else {
        newSteps.push({
          operation: "READ_FAILED",
          data: "",
          buffer: [...newBuffer],
          message: "Circular buffer empty! Cannot read"
        });
        setSimulation({
          ...simulation,
          steps: newSteps
        });
      }
    }
  };

  const resetSimulation = () => {
    initializeSimulation(bufferType);
  };

  const renderBuffer = () => {
    return (
      <div className="flex items-center justify-center space-x-2 mb-6">
        {simulation.buffer.map((slot, index) => (
          <div
            key={index}
            className={`w-16 h-16 border-2 rounded-lg flex items-center justify-center text-sm font-medium ${
              slot !== null
                ? 'bg-blue-100 border-blue-400 text-blue-800'
                : 'bg-gray-100 border-gray-300 text-gray-400'
            }`}
          >
            {slot || "Empty"}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/os" className="inline-flex items-center text-indigo-200 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Operating Systems
          </Link>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-white/20 p-3 rounded-xl">
              <Database className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Buffer Management</h1>
              <p className="text-indigo-100 text-lg">Single, double, and circular buffering strategies</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Key Concepts</h3>
              <p className="text-sm text-indigo-100">Buffer types, data flow, synchronization</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Applications</h3>
              <p className="text-sm text-indigo-100">I/O operations, streaming, data processing</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Exam Focus</h3>
              <p className="text-sm text-indigo-100">Buffer types, efficiency, data transfer</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Buffer Type Selection */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Buffer Management Types</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {bufferTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => {
                  setBufferType(type.id);
                  initializeSimulation(type.id);
                }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  bufferType === type.id 
                    ? 'border-indigo-500 bg-indigo-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h3 className="font-semibold text-gray-800 mb-2">{type.name}</h3>
                <p className="text-sm text-gray-600">{type.description}</p>
              </button>
            ))}
          </div>

          {/* Buffer Visualization */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {bufferTypes.find(t => t.id === bufferType)?.name} Simulation
            </h3>
            
            {/* Buffer Display */}
            {renderBuffer()}
            
            {/* Controls */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Input Data
                </label>
                <input
                  type="text"
                  value={simulation.input}
                  onChange={(e) => setSimulation({...simulation, input: e.target.value})}
                  placeholder="Enter data to add to buffer"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => addToBuffer(simulation.input)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Write
                </button>
                <button
                  onClick={readFromBuffer}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Read
                </button>
                <button
                  onClick={resetSimulation}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
            
            {/* Output */}
            {simulation.output && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-green-800 mb-2">Output</h4>
                <p className="text-green-700">{simulation.output}</p>
              </div>
            )}
            
            {/* Steps Log */}
            {simulation.steps.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">Operation Log</h4>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {simulation.steps.map((step, index) => (
                    <div key={index} className="text-sm">
                      <span className={`font-medium ${
                        step.operation.includes('FAILED') ? 'text-red-600' : 
                        step.operation.includes('READ') ? 'text-green-600' : 'text-blue-600'
                      }`}>
                        Step {index + 1}:
                      </span>
                      <span className="text-gray-700 ml-2">{step.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Buffer Comparison */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Buffer Type Comparison</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">Buffer Type</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Capacity</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Advantages</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Disadvantages</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">Single Buffer</td>
                  <td className="border border-gray-300 px-4 py-2">1 slot</td>
                  <td className="border border-gray-300 px-4 py-2">Simple, low memory usage</td>
                  <td className="border border-gray-300 px-4 py-2">Blocks frequently, poor performance</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">Double Buffer</td>
                  <td className="border border-gray-300 px-4 py-2">2 slots</td>
                  <td className="border border-gray-300 px-4 py-2">Better throughput, overlapped operations</td>
                  <td className="border border-gray-300 px-4 py-2">More complex, higher memory usage</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">Circular Buffer</td>
                  <td className="border border-gray-300 px-4 py-2">Multiple slots</td>
                  <td className="border border-gray-300 px-4 py-2">High throughput, efficient memory usage</td>
                  <td className="border border-gray-300 px-4 py-2">Complex implementation, potential data loss</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Buffer Applications */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Buffer Management Applications</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-3">I/O Operations</h3>
              <ul className="text-sm text-blue-700 space-y-2">
                <li>• Disk read/write operations</li>
                <li>• Network data transmission</li>
                <li>• Keyboard and mouse input</li>
                <li>• Screen display buffering</li>
              </ul>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-3">Data Processing</h3>
              <ul className="text-sm text-green-700 space-y-2">
                <li>• Audio/video streaming</li>
                <li>• Real-time data processing</li>
                <li>• Pipeline processing</li>
                <li>• Producer-consumer patterns</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">📝 Exam Tips</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Understand when to use each buffer type</li>
              <li>• Compare performance characteristics</li>
              <li>• Know implementation details and trade-offs</li>
              <li>• Practice buffer management problems</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
