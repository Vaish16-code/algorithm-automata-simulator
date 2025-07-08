"use client";

import { useState } from "react";
import { Plus, Trash2, Play, RotateCcw, Shield, AlertTriangle, CheckCircle } from "lucide-react";

interface Process {
  id: string;
  allocation: number[];
  max: number[];
  need?: number[];
}

interface BankersState {
  processes: Process[];
  available: number[];
  safeSequence?: string[];
  isSafe: boolean;
  executionSteps: string[];
}

export default function DeadlockPage() {
  const [numResources, setNumResources] = useState(3);
  const [processes, setProcesses] = useState<Process[]>([
    { id: "P0", allocation: [0, 1, 0], max: [7, 5, 3] },
    { id: "P1", allocation: [2, 0, 0], max: [3, 2, 2] },
    { id: "P2", allocation: [3, 0, 2], max: [9, 0, 2] },
    { id: "P3", allocation: [2, 1, 1], max: [2, 2, 2] },
    { id: "P4", allocation: [0, 0, 2], max: [4, 3, 3] }
  ]);
  const [available, setAvailable] = useState([3, 3, 2]);
  const [result, setResult] = useState<BankersState | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const updateNumResources = (newNum: number) => {
    setNumResources(newNum);
    
    // Adjust process arrays
    const updatedProcesses = processes.map(process => ({
      ...process,
      allocation: process.allocation.slice(0, newNum).concat(Array(Math.max(0, newNum - process.allocation.length)).fill(0)),
      max: process.max.slice(0, newNum).concat(Array(Math.max(0, newNum - process.max.length)).fill(0))
    }));
    setProcesses(updatedProcesses);
    
    // Adjust available array
    setAvailable(prev => prev.slice(0, newNum).concat(Array(Math.max(0, newNum - prev.length)).fill(0)));
  };

  const addProcess = () => {
    const newProcess: Process = {
      id: `P${processes.length}`,
      allocation: Array(numResources).fill(0),
      max: Array(numResources).fill(0)
    };
    setProcesses([...processes, newProcess]);
  };

  const removeProcess = (index: number) => {
    setProcesses(processes.filter((_, i) => i !== index));
  };

  const updateProcess = (processIndex: number, field: 'allocation' | 'max', resourceIndex: number, value: number) => {
    const updatedProcesses = [...processes];
    updatedProcesses[processIndex][field][resourceIndex] = value;
    setProcesses(updatedProcesses);
  };

  const updateProcessId = (processIndex: number, newId: string) => {
    const updatedProcesses = [...processes];
    updatedProcesses[processIndex].id = newId;
    setProcesses(updatedProcesses);
  };

  const updateAvailable = (resourceIndex: number, value: number) => {
    const updatedAvailable = [...available];
    updatedAvailable[resourceIndex] = value;
    setAvailable(updatedAvailable);
  };

  const calculateNeed = (process: Process): number[] => {
    return process.max.map((max, i) => max - process.allocation[i]);
  };

  const canAllocate = (need: number[], available: number[]): boolean => {
    return need.every((n, i) => n <= available[i]);
  };

  const runBankersAlgorithm = async () => {
    setIsCalculating(true);
    
    // Simulate calculation delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Calculate need matrix
    const processesWithNeed = processes.map(process => ({
      ...process,
      need: calculateNeed(process)
    }));

    const safeSequence: string[] = [];
    const executionSteps: string[] = [];
    const currentAvailable = [...available];
    const finished = Array(processes.length).fill(false);
    let foundProcess = true;

    // Calculate total allocated resources
    const totalAllocated = Array(numResources).fill(0);
    processesWithNeed.forEach(process => {
      process.allocation.forEach((alloc, idx) => {
        totalAllocated[idx] += alloc;
      });
    });

    // Show initial resource calculation
    executionSteps.push(`📊 Initial Resource Calculation:`);
    executionSteps.push(`Total System Resources: [${available.map((avail, idx) => avail + totalAllocated[idx]).join(', ')}]`);
    executionSteps.push(`Total Allocated Resources: [${totalAllocated.join(', ')}]`);
    executionSteps.push(`Available Resources = Total - Allocated = [${available.join(', ')}]`);
    executionSteps.push(`\n🔄 Starting Banker's Algorithm Execution:`);

    let stepCount = 1;
    while (foundProcess && safeSequence.length < processes.length) {
      foundProcess = false;
      executionSteps.push(`\n--- Step ${stepCount} ---`);
      executionSteps.push(`Current Available: [${currentAvailable.join(', ')}]`);
      executionSteps.push(`Looking for a process that can execute...`);

      for (let i = 0; i < processesWithNeed.length; i++) {
        if (!finished[i]) {
          const process = processesWithNeed[i];
          const need = process.need!;

          executionSteps.push(`Checking ${process.id}: Need [${need.join(', ')}] vs Available [${currentAvailable.join(', ')}]`);

          if (canAllocate(need, currentAvailable)) {
            // Process can complete
            finished[i] = true;
            foundProcess = true;
            safeSequence.push(process.id);

            // Show resource calculation before updating
            executionSteps.push(`✅ ${process.id} can execute (Need ≤ Available)`);
            executionSteps.push(`📊 Resource Update Calculation for ${process.id}:`);
            executionSteps.push(`Current Available: [${currentAvailable.join(', ')}]`);
            executionSteps.push(`${process.id} Allocation: [${process.allocation.join(', ')}]`);
            
            // Store the old available for calculation display
            const oldAvailable = [...currentAvailable];
            
            // Release resources and show calculation step by step
            for (let j = 0; j < numResources; j++) {
              currentAvailable[j] += process.allocation[j];
            }

            // Show detailed calculation
            const calculationSteps = Array.from({ length: numResources }, (_, j) => 
              `R${j}: ${oldAvailable[j]} + ${process.allocation[j]} = ${currentAvailable[j]}`
            );
            executionSteps.push(`Formula: Available = Available + Allocation`);
            executionSteps.push(`Calculation: [${calculationSteps.join(', ')}]`);
            executionSteps.push(`New Available: [${currentAvailable.join(', ')}]`);
            executionSteps.push(`${process.id} added to safe sequence: [${safeSequence.join(', ')}]`);
            
            stepCount++;
            break;
          } else {
            executionSteps.push(`❌ ${process.id} cannot execute (Need > Available)`);
          }
        }
      }

      if (!foundProcess && safeSequence.length < processes.length) {
        executionSteps.push(`⚠️ No process can execute with current available resources`);
      }
    }

    const isSafe = safeSequence.length === processes.length;

    if (!isSafe) {
      executionSteps.push(`\n🚨 DEADLOCK DETECTED!`);
      executionSteps.push(`No safe sequence found - System is in deadlock!`);
      executionSteps.push(`Safe sequence: NONE (Deadlock)`);
    } else {
      executionSteps.push(`\n✅ SAFE STATE DETECTED!`);
      executionSteps.push(`Safe sequence found: ${safeSequence.join(' → ')}`);
      executionSteps.push(`All processes can complete successfully`);
    }

    setResult({
      processes: processesWithNeed,
      available,
      safeSequence: isSafe ? safeSequence : undefined,
      isSafe,
      executionSteps
    });

    setIsCalculating(false);
  };

  const reset = () => {
    setResult(null);
    setProcesses([
      { id: "P0", allocation: [0, 1, 0], max: [7, 5, 3] },
      { id: "P1", allocation: [2, 0, 0], max: [3, 2, 2] },
      { id: "P2", allocation: [3, 0, 2], max: [9, 0, 2] },
      { id: "P3", allocation: [2, 1, 1], max: [2, 2, 2] },
      { id: "P4", allocation: [0, 0, 2], max: [4, 3, 3] }
    ]);
    setAvailable([3, 3, 2]);
    setNumResources(3);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Banker's Algorithm - Deadlock Detection</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Analyze system state for deadlock avoidance using Banker's algorithm. Determine if the system is in a safe state.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Resource Configuration */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">System Configuration</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Resource Types
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={numResources}
                    onChange={(e) => updateNumResources(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-black bg-white font-medium"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Resources
                  </label>
                  <div className="flex space-x-2">
                    {available.map((value, index) => (
                      <input
                        key={index}
                        type="number"
                        min="0"
                        value={value}
                        onChange={(e) => updateAvailable(index, parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-black bg-white font-medium text-center"
                        placeholder={`R${index}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Process Table */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">Process Resource Table</h2>
                <button
                  onClick={addProcess}
                  className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Process</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border-2 border-gray-400">
                  <thead>
                    <tr className="bg-gray-800 text-white">
                      <th className="border-2 border-gray-400 px-4 py-3 text-left font-semibold">Process</th>
                      <th className="border-2 border-gray-400 px-4 py-3 text-center font-semibold" colSpan={numResources}>
                        Allocation
                      </th>
                      <th className="border-2 border-gray-400 px-4 py-3 text-center font-semibold" colSpan={numResources}>
                        Max Demand
                      </th>
                      <th className="border-2 border-gray-400 px-4 py-3 text-left font-semibold">Action</th>
                    </tr>
                    <tr className="bg-gray-700 text-white">
                      <th className="border-2 border-gray-400 px-4 py-2"></th>
                      {Array.from({ length: numResources }, (_, i) => (
                        <th key={`alloc-${i}`} className="border-2 border-gray-400 px-2 py-2 text-sm font-semibold">R{i}</th>
                      ))}
                      {Array.from({ length: numResources }, (_, i) => (
                        <th key={`max-${i}`} className="border-2 border-gray-400 px-2 py-2 text-sm font-semibold">R{i}</th>
                      ))}
                      <th className="border-2 border-gray-400 px-4 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {processes.map((process, processIndex) => (
                      <tr key={process.id} className={`${processIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100`}>
                        <td className="border-2 border-gray-400 px-4 py-2">
                          <input
                            type="text"
                            value={process.id}
                            onChange={(e) => updateProcessId(processIndex, e.target.value)}
                            className="w-full px-2 py-1 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 text-black bg-white font-medium"
                          />
                        </td>
                        
                        {/* Allocation columns */}
                        {process.allocation.map((value, resourceIndex) => (
                          <td key={`alloc-${resourceIndex}`} className="border-2 border-gray-400 px-2 py-2">
                            <input
                              type="number"
                              min="0"
                              value={value}
                              onChange={(e) => updateProcess(processIndex, 'allocation', resourceIndex, parseInt(e.target.value) || 0)}
                              className="w-full px-1 py-1 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 text-center text-black bg-white font-medium"
                            />
                          </td>
                        ))}
                        
                        {/* Max columns */}
                        {process.max.map((value, resourceIndex) => (
                          <td key={`max-${resourceIndex}`} className="border-2 border-gray-400 px-2 py-2">
                            <input
                              type="number"
                              min="0"
                              value={value}
                              onChange={(e) => updateProcess(processIndex, 'max', resourceIndex, parseInt(e.target.value) || 0)}
                              className="w-full px-1 py-1 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 text-center text-black bg-white font-medium"
                            />
                          </td>
                        ))}
                        
                        <td className="border-2 border-gray-400 px-4 py-2 text-center">
                          <button
                            onClick={() => removeProcess(processIndex)}
                            className="text-red-600 hover:text-red-800 p-1 bg-red-100 hover:bg-red-200 rounded-full"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  onClick={runBankersAlgorithm}
                  disabled={isCalculating || processes.length === 0}
                  className="flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCalculating ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  <span>{isCalculating ? "Analyzing..." : "Run Banker's Algorithm"}</span>
                </button>

                <button
                  onClick={reset}
                  className="flex items-center space-x-2 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Algorithm Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Banker's Algorithm</h3>
              <p className="text-gray-600 mb-4">
                A deadlock avoidance algorithm that determines if resource allocation will lead to a safe state.
              </p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-blue-700 mb-2">Key Concepts:</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Safe State: All processes can complete</li>
                    <li>• Need = Max - Allocation</li>
                    <li>• Available resources after completion</li>
                    <li>• Safe sequence exists</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-green-700 mb-2">Steps:</h4>
                  <ol className="space-y-1 text-sm text-gray-600">
                    <li>1. Calculate Need matrix</li>
                    <li>2. Find process with Need ≤ Available</li>
                    <li>3. Simulate process completion</li>
                    <li>4. Release resources</li>
                    <li>5. Repeat until all processes complete</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Current State */}
            {result && (
              <div className={`rounded-2xl shadow-lg p-6 text-white ${
                result.isSafe ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-red-500 to-red-600'
              }`}>
                <div className="flex items-center space-x-2 mb-4">
                  {result.isSafe ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <AlertTriangle className="h-6 w-6" />
                  )}
                  <h3 className="text-xl font-semibold">
                    {result.isSafe ? 'Safe State' : 'Unsafe State'}
                  </h3>
                </div>
                
                <p className="text-sm opacity-90">
                  {result.isSafe 
                    ? 'The system is in a safe state. No deadlock will occur.'
                    : 'The system is in an unsafe state. Deadlock may occur.'
                  }
                </p>
                
                {result.safeSequence && (
                  <div className="mt-4">
                    <p className="text-sm font-medium">Safe Sequence:</p>
                    <p className="text-lg font-bold">{result.safeSequence.join(' → ')}</p>
                  </div>
                )}
              </div>
            )}

            {/* University Exam Tips */}
            <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-semibold mb-4">University Exam Tips</h3>
              <ul className="space-y-2 text-sm">
                <li>• Show Need matrix calculation</li>
                <li>• Draw resource allocation graph</li>
                <li>• Explain each step of algorithm</li>
                <li>• Prove safe/unsafe state conclusion</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="mt-8 space-y-6">
            {/* System State Summary */}
            <div className={`rounded-2xl shadow-lg p-6 ${result.isSafe ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}`}>
              <div className="flex items-center space-x-3 mb-4">
                {result.isSafe ? (
                  <CheckCircle className="text-green-600 w-8 h-8" />
                ) : (
                  <AlertTriangle className="text-red-600 w-8 h-8" />
                )}
                <h2 className={`text-2xl font-bold ${result.isSafe ? 'text-green-800' : 'text-red-800'}`}>
                  {result.isSafe ? 'SAFE STATE' : 'UNSAFE STATE (DEADLOCK)'}
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Safe Sequence:</p>
                  <p className={`text-lg font-mono ${result.isSafe ? 'text-green-700' : 'text-red-700'}`}>
                    {result.safeSequence ? result.safeSequence.join(' → ') : 'NONE (Deadlock)'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">System Status:</p>
                  <p className={`text-lg font-semibold ${result.isSafe ? 'text-green-700' : 'text-red-700'}`}>
                    {result.isSafe ? 'All processes can complete' : 'Deadlock detected'}
                  </p>
                </div>
              </div>
            </div>

            {/* Comprehensive Process Table */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                System State Table (Process Analysis)
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border-2 border-gray-400">
                  <thead>
                    <tr className="bg-gray-800 text-white">
                      <th className="border-2 border-gray-400 px-4 py-3 text-left font-bold">Process</th>
                      <th className="border-2 border-gray-400 px-4 py-3 text-center font-bold">
                        Allocation
                        <div className="text-xs font-normal mt-1">
                          [{Array.from({ length: numResources }, (_, i) => `R${i}`).join(', ')}]
                        </div>
                      </th>
                      <th className="border-2 border-gray-400 px-4 py-3 text-center font-bold">
                        Max Demand
                        <div className="text-xs font-normal mt-1">
                          [{Array.from({ length: numResources }, (_, i) => `R${i}`).join(', ')}]
                        </div>
                      </th>
                      <th className="border-2 border-gray-400 px-4 py-3 text-center font-bold">
                        Need
                        <div className="text-xs font-normal mt-1">
                          [{Array.from({ length: numResources }, (_, i) => `R${i}`).join(', ')}]
                        </div>
                      </th>
                      <th className="border-2 border-gray-400 px-4 py-3 text-center font-bold">
                        Can Execute?
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.processes.map((process, index) => {
                      const canExecute = canAllocate(process.need!, result.available);
                      return (
                        <tr key={process.id} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100`}>
                          <td className="border-2 border-gray-400 px-4 py-3 font-semibold text-blue-800 text-lg">
                            {process.id}
                          </td>
                          <td className="border-2 border-gray-400 px-4 py-3 text-center">
                            <div className="font-mono text-sm bg-blue-100 px-2 py-1 rounded">
                              [{process.allocation.join(', ')}]
                            </div>
                          </td>
                          <td className="border-2 border-gray-400 px-4 py-3 text-center">
                            <div className="font-mono text-sm bg-purple-100 px-2 py-1 rounded">
                              [{process.max.join(', ')}]
                            </div>
                          </td>
                          <td className="border-2 border-gray-400 px-4 py-3 text-center">
                            <div className="font-mono text-sm bg-orange-100 px-2 py-1 rounded">
                              [{process.need!.join(', ')}]
                            </div>
                          </td>
                          <td className="border-2 border-gray-400 px-4 py-3 text-center">
                            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              canExecute 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {canExecute ? '✅ Yes' : '❌ No'}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Available Resources Table */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Available Resources Calculation
              </h2>
              
              <div className="space-y-4">
                {/* Resource Calculation Formula */}
                <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-2">Formula:</h3>
                  <p className="text-blue-700 font-mono text-sm">
                    Available = Total System Resources - Total Allocated Resources
                  </p>
                </div>

                {/* Resource Breakdown Table */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border-2 border-gray-400">
                    <thead>
                      <tr className="bg-indigo-600 text-white">
                        <th className="border-2 border-gray-400 px-4 py-3 text-left font-bold">Resource Type</th>
                        <th className="border-2 border-gray-400 px-4 py-3 text-center font-bold">Total System</th>
                        <th className="border-2 border-gray-400 px-4 py-3 text-center font-bold">Total Allocated</th>
                        <th className="border-2 border-gray-400 px-4 py-3 text-center font-bold">Available</th>
                        <th className="border-2 border-gray-400 px-4 py-3 text-center font-bold">Calculation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: numResources }, (_, i) => {
                        const totalAllocated = result.processes.reduce((sum, process) => {
                          const allocation = process.allocation[i];
                          return sum + (typeof allocation === 'number' && !isNaN(allocation) ? allocation : 0);
                        }, 0);
                        const availableValue = typeof result.available[i] === 'number' && !isNaN(result.available[i]) ? result.available[i] : 0;
                        const totalSystem = availableValue + totalAllocated;
                        return (
                          <tr key={i} className={`${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100`}>
                            <td className="border-2 border-gray-400 px-4 py-3 font-semibold text-indigo-800">
                              Resource R{i}
                            </td>
                            <td className="border-2 border-gray-400 px-4 py-3 text-center">
                              <div className="font-mono text-lg bg-green-100 px-2 py-1 rounded font-bold text-green-800">
                                {totalSystem}
                              </div>
                            </td>
                            <td className="border-2 border-gray-400 px-4 py-3 text-center">
                              <div className="font-mono text-lg bg-red-100 px-2 py-1 rounded font-bold text-red-800">
                                {totalAllocated}
                              </div>
                            </td>
                            <td className="border-2 border-gray-400 px-4 py-3 text-center">
                              <div className="font-mono text-lg bg-blue-100 px-2 py-1 rounded font-bold text-blue-800">
                                {availableValue}
                              </div>
                            </td>
                            <td className="border-2 border-gray-400 px-4 py-3 text-center">
                              <div className="font-mono text-sm text-gray-700">
                                {totalSystem} - {totalAllocated} = {availableValue}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Algorithm Execution Steps */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Algorithm Execution Steps
              </h2>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {result.executionSteps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded min-w-fit">
                      {index + 1}
                    </span>
                    <p className={`text-gray-700 ${
                      step.includes('✅') ? 'text-green-700 font-semibold' :
                      step.includes('❌') ? 'text-red-700 font-semibold' :
                      step.includes('🚨') ? 'text-red-800 font-bold' :
                      step.includes('📊') ? 'text-blue-700 font-semibold' :
                      step.includes('🔄') ? 'text-purple-700 font-semibold' :
                      step.includes('Available =') ? 'text-indigo-700 font-mono' :
                      'text-gray-700'
                    }`}>
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
