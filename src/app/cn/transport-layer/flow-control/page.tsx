"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Network, Play, RotateCcw, ArrowRight } from "lucide-react";

interface FlowControlStep {
  step: number;
  action: string;
  windowSize: number;
  dataInTransit: number;
  ackReceived: boolean;
  description: string;
}

export default function FlowControlPage() {
  const [windowSize, setWindowSize] = useState(4);
  const [dataRate, setDataRate] = useState(2);
  const [steps, setSteps] = useState<FlowControlStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const simulateFlowControl = () => {
    setIsRunning(true);
    const simulationSteps: FlowControlStep[] = [];
    let currentWindow = windowSize;
    let dataInFlight = 0;
    
    // Initial state
    simulationSteps.push({
      step: 0,
      action: "Initialize",
      windowSize: currentWindow,
      dataInTransit: 0,
      ackReceived: false,
      description: `Initial window size: ${currentWindow} packets`
    });

    // Simulate sending data
    for (let i = 1; i <= 10; i++) {
      if (dataInFlight < currentWindow) {
        dataInFlight += dataRate;
        simulationSteps.push({
          step: i,
          action: "Send Data",
          windowSize: currentWindow,
          dataInTransit: Math.min(dataInFlight, currentWindow),
          ackReceived: false,
          description: `Sent ${dataRate} packets, ${Math.min(dataInFlight, currentWindow)} in transit`
        });
      }

      // Simulate ACK reception
      if (i % 3 === 0) {
        dataInFlight = Math.max(0, dataInFlight - 2);
        simulationSteps.push({
          step: i + 0.5,
          action: "Receive ACK",
          windowSize: currentWindow,
          dataInTransit: dataInFlight,
          ackReceived: true,
          description: `ACK received, 2 packets acknowledged, ${dataInFlight} still in transit`
        });
      }

      // Simulate window adjustment
      if (i === 6) {
        currentWindow = Math.max(1, currentWindow - 2);
        simulationSteps.push({
          step: i + 0.7,
          action: "Adjust Window",
          windowSize: currentWindow,
          dataInTransit: dataInFlight,
          ackReceived: false,
          description: `Receiver reduced window size to ${currentWindow} (buffer filling up)`
        });
      }
    }

    setSteps(simulationSteps);
    setCurrentStep(0);
    setIsRunning(false);
  };

  const resetSimulation = () => {
    setSteps([]);
    setCurrentStep(0);
    setIsRunning(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/cn/transport-layer" className="inline-flex items-center text-blue-200 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Transport Layer
          </Link>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-white/20 p-3 rounded-xl">
              <Network className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Flow Control</h1>
              <p className="text-blue-100 text-lg">Managing data flow between sender and receiver</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Mechanism</h3>
              <p className="text-sm text-blue-100">Sliding window protocol</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Purpose</h3>
              <p className="text-sm text-blue-100">Prevent buffer overflow</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Protocol</h3>
              <p className="text-sm text-blue-100">TCP window management</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Flow Control Simulator */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Flow Control Simulator</h2>
          
          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Initial Window Size</label>
              <input
                type="number"
                value={windowSize}
                onChange={(e) => setWindowSize(parseInt(e.target.value) || 4)}
                min="1"
                max="10"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data Rate (packets/step)</label>
              <input
                type="number"
                value={dataRate}
                onChange={(e) => setDataRate(parseInt(e.target.value) || 2)}
                min="1"
                max="5"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end">
              <div className="space-y-2 w-full">
                <button
                  onClick={simulateFlowControl}
                  disabled={isRunning}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  <Play className="h-4 w-4" />
                  <span>Start Simulation</span>
                </button>
                <button
                  onClick={resetSimulation}
                  className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 flex items-center justify-center space-x-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>

          {/* Visualization */}
          {steps.length > 0 && (
            <div className="space-y-6">
              {/* Current Step Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">
                  Step {Math.floor(steps[currentStep].step)}: {steps[currentStep].action}
                </h3>
                <p className="text-blue-700">{steps[currentStep].description}</p>
              </div>

              {/* Visual Representation */}
              <div className="bg-gray-100 rounded-lg p-6">
                <h4 className="font-semibold text-gray-800 mb-4">Window Status</h4>
                <div className="space-y-4">
                  {/* Window Size Bar */}
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Window Size: {steps[currentStep].windowSize}</span>
                      <span>Data in Transit: {steps[currentStep].dataInTransit}</span>
                    </div>
                    <div className="w-full bg-gray-300 rounded-full h-6 relative">
                      <div 
                        className="bg-blue-600 h-6 rounded-full flex items-center justify-center text-white text-sm font-medium"
                        style={{ width: `${(steps[currentStep].windowSize / 10) * 100}%` }}
                      >
                        Window: {steps[currentStep].windowSize}
                      </div>
                      <div 
                        className="absolute top-0 bg-red-500 h-6 rounded-full flex items-center justify-center text-white text-sm opacity-75"
                        style={{ 
                          width: `${(steps[currentStep].dataInTransit / 10) * 100}%`,
                          left: 0
                        }}
                      >
                        {steps[currentStep].dataInTransit > 0 && `${steps[currentStep].dataInTransit} in transit`}
                      </div>
                    </div>
                  </div>

                  {/* Packet Representation */}
                  <div className="grid grid-cols-10 gap-1">
                    {Array.from({ length: 10 }).map((_, index) => (
                      <div
                        key={index}
                        className={`h-8 rounded border-2 flex items-center justify-center text-xs font-medium ${
                          index < steps[currentStep].dataInTransit
                            ? "bg-red-200 border-red-400 text-red-800"
                            : index < steps[currentStep].windowSize
                            ? "bg-blue-100 border-blue-300 text-blue-700"
                            : "bg-gray-200 border-gray-300 text-gray-500"
                        }`}
                      >
                        {index + 1}
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex space-x-6 text-sm text-gray-600">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded mr-2"></div>
                      <span>Available Window</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-red-200 border border-red-400 rounded mr-2"></div>
                      <span>Data in Transit</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-gray-200 border border-gray-300 rounded mr-2"></div>
                      <span>Outside Window</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Step {currentStep + 1} of {steps.length}
                </span>
                <button
                  onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                  disabled={currentStep === steps.length - 1}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Flow Control Mechanisms */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Flow Control Mechanisms</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Stop-and-Wait</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Send one packet, wait for ACK</li>
                <li>• Simple but inefficient</li>
                <li>• Window size = 1</li>
                <li>• High latency impact</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Sliding Window</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Send multiple packets before ACK</li>
                <li>• Dynamic window size</li>
                <li>• Better bandwidth utilization</li>
                <li>• Used in TCP</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Key Concepts */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Key Concepts</h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-3">Window Size</h4>
                <p className="text-sm text-green-700">
                  Maximum number of unacknowledged packets that can be in transit simultaneously.
                </p>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-3">Acknowledgments</h4>
                <p className="text-sm text-blue-700">
                  Receiver confirms receipt of data, allowing sender to slide the window forward.
                </p>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-semibold text-purple-800 mb-3">Buffer Management</h4>
                <p className="text-sm text-purple-700">
                  Prevents receiver buffer overflow by controlling transmission rate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
