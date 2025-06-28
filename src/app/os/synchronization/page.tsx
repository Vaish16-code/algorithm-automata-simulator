"use client";

import { useState } from "react";
import { Play, RotateCcw, Users, Lock, Clock, AlertTriangle, CheckCircle } from "lucide-react";

interface SemaphoreAction {
  operation: 'wait' | 'signal';
  process: string;
  semaphore: string;
}

interface SimulationStep {
  step: number;
  action: SemaphoreAction;
  semaphoreValues: Record<string, number>;
  processStates: { [key: string]: 'running' | 'waiting' | 'completed' };
  message: string;
  blocked?: string[];
}

const synchronizationProblems = [
  {
    id: 'producer-consumer',
    name: 'Producer-Consumer Problem',
    description: 'Classic bounded buffer problem with producers and consumers',
    semaphores: ['mutex', 'empty', 'full'],
    initialValues: { mutex: 1, empty: 5, full: 0 } as Record<string, number>,
    processes: ['Producer', 'Consumer'],
    operations: [
      { process: 'Producer', operation: 'wait', semaphore: 'empty' },
      { process: 'Producer', operation: 'wait', semaphore: 'mutex' },
      { process: 'Producer', operation: 'signal', semaphore: 'mutex' },
      { process: 'Producer', operation: 'signal', semaphore: 'full' },
      { process: 'Consumer', operation: 'wait', semaphore: 'full' },
      { process: 'Consumer', operation: 'wait', semaphore: 'mutex' },
      { process: 'Consumer', operation: 'signal', semaphore: 'mutex' },
      { process: 'Consumer', operation: 'signal', semaphore: 'empty' }
    ]
  },
  {
    id: 'readers-writers',
    name: 'Readers-Writers Problem',
    description: 'Multiple readers or single writer access to shared resource',
    semaphores: ['mutex', 'wrt'],
    initialValues: { mutex: 1, wrt: 1 } as Record<string, number>,
    processes: ['Reader1', 'Reader2', 'Writer'],
    operations: [
      { process: 'Reader1', operation: 'wait', semaphore: 'mutex' },
      { process: 'Reader1', operation: 'wait', semaphore: 'wrt' },
      { process: 'Reader1', operation: 'signal', semaphore: 'mutex' },
      { process: 'Reader1', operation: 'signal', semaphore: 'wrt' },
      { process: 'Writer', operation: 'wait', semaphore: 'wrt' },
      { process: 'Writer', operation: 'signal', semaphore: 'wrt' }
    ]
  },
  {
    id: 'dining-philosophers',
    name: 'Dining Philosophers Problem',
    description: 'Five philosophers alternately thinking and eating with shared chopsticks',
    semaphores: ['chopstick0', 'chopstick1', 'chopstick2', 'chopstick3', 'chopstick4'],
    initialValues: { chopstick0: 1, chopstick1: 1, chopstick2: 1, chopstick3: 1, chopstick4: 1 } as Record<string, number>,
    processes: ['Philosopher0', 'Philosopher1', 'Philosopher2'],
    operations: [
      { process: 'Philosopher0', operation: 'wait', semaphore: 'chopstick0' },
      { process: 'Philosopher0', operation: 'wait', semaphore: 'chopstick1' },
      { process: 'Philosopher1', operation: 'wait', semaphore: 'chopstick1' },
      { process: 'Philosopher1', operation: 'wait', semaphore: 'chopstick2' },
      { process: 'Philosopher0', operation: 'signal', semaphore: 'chopstick0' },
      { process: 'Philosopher0', operation: 'signal', semaphore: 'chopstick1' }
    ]
  }
];

export default function SynchronizationPage() {
  const [selectedProblem, setSelectedProblem] = useState(synchronizationProblems[0]);
  const [customOperations, setCustomOperations] = useState<SemaphoreAction[]>([]);
  const [simulationSteps, setSimulationSteps] = useState<SimulationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const addCustomOperation = () => {
    setCustomOperations([...customOperations, {
      operation: 'wait',
      process: selectedProblem.processes[0],
      semaphore: selectedProblem.semaphores[0]
    }]);
  };

  const updateCustomOperation = (index: number, field: keyof SemaphoreAction, value: string) => {
    const updated = [...customOperations];
    updated[index] = { ...updated[index], [field]: value };
    setCustomOperations(updated);
  };

  const removeCustomOperation = (index: number) => {
    setCustomOperations(customOperations.filter((_, i) => i !== index));
  };

  const simulateOperations = async (operations: SemaphoreAction[]) => {
    setIsSimulating(true);
    setSimulationSteps([]);
    setCurrentStep(0);

    const semaphoreValues: Record<string, number> = { ...selectedProblem.initialValues };
    const processStates: { [key: string]: 'running' | 'waiting' | 'completed' } = {};
    const waitingQueues: { [key: string]: string[] } = {};
    
    // Initialize process states
    selectedProblem.processes.forEach(process => {
      processStates[process] = 'running';
    });

    // Initialize waiting queues for each semaphore
    selectedProblem.semaphores.forEach(semaphore => {
      waitingQueues[semaphore] = [];
    });

    const steps: SimulationStep[] = [];

    for (let i = 0; i < operations.length; i++) {
      const action = operations[i];
      let message = '';
      let blocked: string[] = [];

      if (action.operation === 'wait') {
        if (semaphoreValues[action.semaphore] > 0) {
          semaphoreValues[action.semaphore]--;
          message = `${action.process} successfully acquired ${action.semaphore} (${action.operation}(${action.semaphore}))`;
          processStates[action.process] = 'running';
        } else {
          message = `${action.process} blocked on ${action.semaphore} (${action.operation}(${action.semaphore}))`;
          processStates[action.process] = 'waiting';
          waitingQueues[action.semaphore].push(action.process);
          blocked = [...waitingQueues[action.semaphore]];
        }
      } else if (action.operation === 'signal') {
        semaphoreValues[action.semaphore]++;
        message = `${action.process} released ${action.semaphore} (${action.operation}(${action.semaphore}))`;
        
        // Wake up waiting process if any
        if (waitingQueues[action.semaphore].length > 0) {
          const wakenProcess = waitingQueues[action.semaphore].shift()!;
          processStates[wakenProcess] = 'running';
          semaphoreValues[action.semaphore]--; // Immediately allocated to waiting process
          message += ` - ${wakenProcess} awakened and acquired ${action.semaphore}`;
        }
      }

      steps.push({
        step: i + 1,
        action,
        semaphoreValues: { ...semaphoreValues },
        processStates: { ...processStates },
        message,
        blocked: blocked.length > 0 ? blocked : undefined
      });

      // Update UI progressively
      await new Promise(resolve => setTimeout(resolve, 500));
      setSimulationSteps([...steps]);
      setCurrentStep(i + 1);
    }

    setIsSimulating(false);
  };

  const runDefaultSimulation = () => {
    simulateOperations(selectedProblem.operations as SemaphoreAction[]);
  };

  const runCustomSimulation = () => {
    simulateOperations(customOperations);
  };

  const playStepByStep = async () => {
    if (simulationSteps.length === 0) return;
    
    setIsPlaying(true);
    for (let i = 0; i <= simulationSteps.length; i++) {
      setCurrentStep(i);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    setIsPlaying(false);
  };

  const reset = () => {
    setSimulationSteps([]);
    setCurrentStep(0);
    setCustomOperations([]);
    setIsPlaying(false);
  };

  const getProcessStateColor = (state: string) => {
    switch (state) {
      case 'running': return 'bg-green-100 text-green-800';
      case 'waiting': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Process Synchronization</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore classic synchronization problems using semaphores. Visualize process interactions and understand critical section management.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Problem Selection */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Select Synchronization Problem</h2>
              <div className="space-y-4">
                {synchronizationProblems.map((problem) => (
                  <button
                    key={problem.id}
                    onClick={() => {
                      setSelectedProblem(problem);
                      reset();
                    }}
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      selectedProblem.id === problem.id
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-indigo-300"
                    }`}
                  >
                    <h3 className="font-semibold text-gray-800">{problem.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{problem.description}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {problem.semaphores.map(sem => (
                        <span key={sem} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {sem}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Semaphore Values */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Current Semaphore Values</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {selectedProblem.semaphores.map(semaphore => {
                  const currentValue = simulationSteps.length > 0 && currentStep > 0
                    ? simulationSteps[currentStep - 1].semaphoreValues[semaphore]
                    : selectedProblem.initialValues[semaphore];
                  
                  return (
                    <div key={semaphore} className="bg-gray-50 rounded-lg p-4 text-center">
                      <h3 className="font-semibold text-gray-800 text-sm">{semaphore}</h3>
                      <div className={`text-2xl font-bold mt-2 ${
                        currentValue > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {currentValue}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Process States */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Process States</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {selectedProblem.processes.map(process => {
                  const currentState = simulationSteps.length > 0 && currentStep > 0
                    ? simulationSteps[currentStep - 1].processStates[process]
                    : 'running';
                  
                  return (
                    <div key={process} className="bg-gray-50 rounded-lg p-4 text-center">
                      <h3 className="font-semibold text-gray-800 text-sm">{process}</h3>
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${getProcessStateColor(currentState)}`}>
                        {currentState}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Simulation Controls */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Simulation Controls</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={runDefaultSimulation}
                  disabled={isSimulating}
                  className="flex items-center justify-center space-x-2 bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50"
                >
                  {isSimulating ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  <span>Run Default Sequence</span>
                </button>

                <button
                  onClick={reset}
                  className="flex items-center justify-center space-x-2 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Reset</span>
                </button>
              </div>

              {simulationSteps.length > 0 && (
                <div className="mt-4">
                  <button
                    onClick={playStepByStep}
                    disabled={isPlaying}
                    className="flex items-center space-x-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
                  >
                    <Clock className="h-4 w-4" />
                    <span>{isPlaying ? 'Playing...' : 'Play Step-by-Step'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Custom Operations */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Custom Operation Sequence</h2>
              
              {customOperations.map((op, index) => (
                <div key={index} className="flex items-center space-x-4 mb-3 p-3 bg-gray-50 rounded-lg">
                  <select
                    value={op.process}
                    onChange={(e) => updateCustomOperation(index, 'process', e.target.value)}
                    className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {selectedProblem.processes.map(process => (
                      <option key={process} value={process}>{process}</option>
                    ))}
                  </select>
                  
                  <select
                    value={op.operation}
                    onChange={(e) => updateCustomOperation(index, 'operation', e.target.value as 'wait' | 'signal')}
                    className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="wait">wait()</option>
                    <option value="signal">signal()</option>
                  </select>
                  
                  <select
                    value={op.semaphore}
                    onChange={(e) => updateCustomOperation(index, 'semaphore', e.target.value)}
                    className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {selectedProblem.semaphores.map(semaphore => (
                      <option key={semaphore} value={semaphore}>{semaphore}</option>
                    ))}
                  </select>
                  
                  <button
                    onClick={() => removeCustomOperation(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
              
              <div className="flex space-x-4">
                <button
                  onClick={addCustomOperation}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Add Operation
                </button>
                
                {customOperations.length > 0 && (
                  <button
                    onClick={runCustomSimulation}
                    disabled={isSimulating}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    Run Custom Sequence
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Problem Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">{selectedProblem.name}</h3>
              <p className="text-gray-600 mb-4">{selectedProblem.description}</p>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Semaphores:</h4>
                  <div className="space-y-1">
                    {selectedProblem.semaphores.map(sem => (
                      <div key={sem} className="flex justify-between text-sm">
                        <span>{sem}:</span>
                        <span className="font-mono">{selectedProblem.initialValues[sem]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Processes:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProblem.processes.map(process => (
                      <span key={process} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {process}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Process States</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-100 border border-green-500 rounded"></div>
                  <span className="text-sm">Running</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-red-100 border border-red-500 rounded"></div>
                  <span className="text-sm">Waiting (Blocked)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-100 border border-blue-500 rounded"></div>
                  <span className="text-sm">Completed</span>
                </div>
              </div>
            </div>

            {/* Mumbai University Tips */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-semibold mb-4">Mumbai University Tips</h3>
              <ul className="space-y-2 text-sm">
                <li>• Identify critical sections clearly</li>
                <li>• Show semaphore operations step by step</li>
                <li>• Explain deadlock prevention techniques</li>
                <li>• Draw process state diagrams</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Simulation Results */}
        {simulationSteps.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Simulation Timeline</h2>
            
            <div className="space-y-4">
              {simulationSteps.slice(0, currentStep).map((step, index) => (
                <div key={index} className="border-l-4 border-indigo-500 pl-4 py-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-800">Step {step.step}</span>
                    <span className="text-sm text-gray-500">
                      {step.action.process} • {step.action.operation}({step.action.semaphore})
                    </span>
                  </div>
                  <p className="text-gray-700 mt-1">{step.message}</p>
                  
                  {step.blocked && step.blocked.length > 0 && (
                    <div className="mt-2 flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      <span className="text-sm text-orange-700">
                        Blocked processes: {step.blocked.join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
