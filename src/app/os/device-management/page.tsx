"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Settings, Cpu, HardDrive, Wifi, Monitor, Zap, Shield } from "lucide-react";

export default function DeviceManagementPage() {
  const [selectedDevice, setSelectedDevice] = useState("disk");
  const [driverStatus, setDriverStatus] = useState({
    loaded: false,
    initialized: false,
    active: false
  });

  const devices = [
    {
      id: "disk",
      name: "Hard Disk Drive",
      icon: HardDrive,
      type: "Block Device",
      description: "Mass storage device for data persistence",
      characteristics: ["Sequential/Random Access", "High Capacity", "Non-volatile"],
      operations: ["Read", "Write", "Seek", "Format"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: "network",
      name: "Network Interface",
      icon: Wifi,
      type: "Network Device",
      description: "Communication interface for network connectivity",
      characteristics: ["Packet-based", "Asynchronous", "Variable Speed"],
      operations: ["Send", "Receive", "Configure", "Monitor"],
      color: "from-green-500 to-emerald-500"
    },
    {
      id: "display",
      name: "Display Monitor",
      icon: Monitor,
      type: "Character Device",
      description: "Visual output device for user interface",
      characteristics: ["Stream-oriented", "Output Only", "Real-time"],
      operations: ["Write", "Scroll", "Clear", "Set Mode"],
      color: "from-purple-500 to-pink-500"
    },
    {
      id: "processor",
      name: "CPU Core",
      icon: Cpu,
      type: "System Device",
      description: "Central processing unit for computation",
      characteristics: ["Instruction Execution", "Register Management", "Cache Control"],
      operations: ["Execute", "Interrupt", "Context Switch", "Power Management"],
      color: "from-orange-500 to-red-500"
    }
  ];

  const interruptTypes = [
    {
      type: "Hardware Interrupt",
      source: "I/O Devices",
      priority: "High",
      examples: ["Disk completion", "Network packet arrival", "Timer expiry"],
      handling: "Immediate response required"
    },
    {
      type: "Software Interrupt",
      source: "System Calls",
      priority: "Medium",
      examples: ["File operations", "Memory allocation", "Process creation"],
      handling: "Scheduled processing"
    },
    {
      type: "Exception",
      source: "CPU Events",
      priority: "Critical",
      examples: ["Division by zero", "Page fault", "Invalid instruction"],
      handling: "Immediate exception handling"
    }
  ];

  const dmaSteps = [
    {
      step: 1,
      title: "DMA Request",
      description: "Device requests DMA controller for data transfer",
      detail: "Device signals DMA controller when ready for transfer"
    },
    {
      step: 2,
      title: "Bus Arbitration",
      description: "DMA controller requests bus control from CPU",
      detail: "CPU grants bus control to DMA controller"
    },
    {
      step: 3,
      title: "Direct Transfer",
      description: "Data transferred directly between device and memory",
      detail: "No CPU intervention during actual data transfer"
    },
    {
      step: 4,
      title: "Completion Interrupt",
      description: "DMA controller signals transfer completion",
      detail: "CPU resumes normal operation and processes completion"
    }
  ];

  const simulateDriverLoading = () => {
    setDriverStatus({ loaded: false, initialized: false, active: false });
    
    setTimeout(() => {
      setDriverStatus({ loaded: true, initialized: false, active: false });
      setTimeout(() => {
        setDriverStatus({ loaded: true, initialized: true, active: false });
        setTimeout(() => {
          setDriverStatus({ loaded: true, initialized: true, active: true });
        }, 1000);
      }, 1000);
    }, 1000);
  };

  const getDeviceIcon = (device: any) => {
    const IconComponent = device.icon;
    return <IconComponent className="h-6 w-6" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/os" className="inline-flex items-center text-orange-200 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Operating Systems
          </Link>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-white/20 p-3 rounded-xl">
              <Settings className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Device Management</h1>
              <p className="text-orange-100 text-lg">Device drivers, interrupt handling, and DMA operations</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Key Concepts</h3>
              <p className="text-sm text-orange-100">Device drivers, interrupts, DMA, I/O scheduling</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Applications</h3>
              <p className="text-sm text-orange-100">Hardware abstraction, driver development, system optimization</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Exam Focus</h3>
              <p className="text-sm text-orange-100">Device types, interrupt handling, DMA mechanisms</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Device Types */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Device Types and Management</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {devices.map((device) => (
              <button
                key={device.id}
                onClick={() => setSelectedDevice(device.id)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedDevice === device.id 
                    ? 'border-orange-500 bg-orange-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  {getDeviceIcon(device)}
                  <div>
                    <h3 className="font-semibold text-gray-800">{device.name}</h3>
                    <p className="text-sm text-gray-600">{device.type}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{device.description}</p>
              </button>
            ))}
          </div>

          {/* Selected Device Details */}
          <div className="bg-gray-50 rounded-lg p-6">
            {(() => {
              const device = devices.find(d => d.id === selectedDevice);
              if (!device) return null;
              
              return (
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    {device.name} Details
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Characteristics</h4>
                      <ul className="space-y-1">
                        {device.characteristics.map((char, index) => (
                          <li key={index} className="text-sm text-gray-600">• {char}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Operations</h4>
                      <ul className="space-y-1">
                        {device.operations.map((op, index) => (
                          <li key={index} className="text-sm text-gray-600">• {op}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Device Driver Simulation */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Device Driver Loading Simulation</h2>
          
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Driver Status</h3>
              <button
                onClick={simulateDriverLoading}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
              >
                Load Driver
              </button>
            </div>
            
            <div className="space-y-4">
              <div className={`flex items-center space-x-3 p-3 rounded-lg ${
                driverStatus.loaded ? 'bg-green-100 border border-green-300' : 'bg-gray-100 border border-gray-300'
              }`}>
                <div className={`w-4 h-4 rounded-full ${
                  driverStatus.loaded ? 'bg-green-500' : 'bg-gray-400'
                }`}></div>
                <span className={`font-medium ${
                  driverStatus.loaded ? 'text-green-800' : 'text-gray-600'
                }`}>
                  Driver Loaded
                </span>
              </div>
              
              <div className={`flex items-center space-x-3 p-3 rounded-lg ${
                driverStatus.initialized ? 'bg-green-100 border border-green-300' : 'bg-gray-100 border border-gray-300'
              }`}>
                <div className={`w-4 h-4 rounded-full ${
                  driverStatus.initialized ? 'bg-green-500' : 'bg-gray-400'
                }`}></div>
                <span className={`font-medium ${
                  driverStatus.initialized ? 'text-green-800' : 'text-gray-600'
                }`}>
                  Device Initialized
                </span>
              </div>
              
              <div className={`flex items-center space-x-3 p-3 rounded-lg ${
                driverStatus.active ? 'bg-green-100 border border-green-300' : 'bg-gray-100 border border-gray-300'
              }`}>
                <div className={`w-4 h-4 rounded-full ${
                  driverStatus.active ? 'bg-green-500' : 'bg-gray-400'
                }`}></div>
                <span className={`font-medium ${
                  driverStatus.active ? 'text-green-800' : 'text-gray-600'
                }`}>
                  Device Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Interrupt Handling */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Interrupt Handling</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {interruptTypes.map((interrupt, index) => (
              <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">{interrupt.type}</h3>
                <div className="space-y-2 text-sm text-blue-700">
                  <p><span className="font-medium">Source:</span> {interrupt.source}</p>
                  <p><span className="font-medium">Priority:</span> {interrupt.priority}</p>
                  <p><span className="font-medium">Handling:</span> {interrupt.handling}</p>
                  <div>
                    <span className="font-medium">Examples:</span>
                    <ul className="mt-1 space-y-1">
                      {interrupt.examples.map((example, exIndex) => (
                        <li key={exIndex}>• {example}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DMA Operations */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Direct Memory Access (DMA)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* DMA Steps */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">DMA Process Steps</h3>
              <div className="space-y-4">
                {dmaSteps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{step.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                      <p className="text-xs text-purple-600 mt-1">{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* DMA Advantages */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">DMA Advantages</h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <ul className="space-y-2 text-sm text-green-700">
                  <li>• <span className="font-medium">CPU Efficiency:</span> CPU free for other tasks during transfer</li>
                  <li>• <span className="font-medium">High Throughput:</span> Direct memory access without CPU intervention</li>
                  <li>• <span className="font-medium">Reduced Overhead:</span> Eliminates per-byte CPU involvement</li>
                  <li>• <span className="font-medium">Parallel Processing:</span> Multiple operations can occur simultaneously</li>
                </ul>
              </div>
              
              <h4 className="text-lg font-semibold text-gray-800 mt-6 mb-4">DMA Limitations</h4>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <ul className="space-y-2 text-sm text-red-700">
                  <li>• <span className="font-medium">Hardware Cost:</span> Requires additional DMA controller</li>
                  <li>• <span className="font-medium">Bus Conflicts:</span> Competition for bus access</li>
                  <li>• <span className="font-medium">Cache Coherency:</span> Potential cache consistency issues</li>
                  <li>• <span className="font-medium">Security Concerns:</span> Direct memory access bypass</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">📝 Exam Tips</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Understand different device types and their characteristics</li>
              <li>• Know interrupt handling mechanisms and priorities</li>
              <li>• Compare programmed I/O, interrupt-driven I/O, and DMA</li>
              <li>• Practice device driver architecture questions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
