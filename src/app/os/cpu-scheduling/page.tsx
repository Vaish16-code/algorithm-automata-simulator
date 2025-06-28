"use client";

import { useState } from "react";
import { Plus, Trash2, Play, RotateCcw, Clock, TrendingUp, Users } from "lucide-react";
import { Process, fcfsScheduling, sjfScheduling, roundRobinScheduling, priorityScheduling } from "../../utils/operatingSystems";

interface SchedulingAlgorithm {
  name: string;
  key: string;
  description: string;
  timeComplexity: string;
  advantages: string[];
  disadvantages: string[];
}

const algorithms: SchedulingAlgorithm[] = [
  {
    name: "First Come First Serve (FCFS)",
    key: "fcfs",
    description: "Non-preemptive scheduling based on arrival time",
    timeComplexity: "O(n)",
    advantages: ["Simple implementation", "No starvation", "Fair in arrival order"],
    disadvantages: ["High average waiting time", "Convoy effect", "Not suitable for time-sharing"]
  },
  {
    name: "Shortest Job First (SJF)",
    key: "sjf",
    description: "Non-preemptive scheduling based on burst time",
    timeComplexity: "O(n log n)",
    advantages: ["Optimal average waiting time", "Good throughput"],
    disadvantages: ["Starvation possible", "Requires future knowledge", "Not practical for interactive systems"]
  },
  {
    name: "Round Robin (RR)",
    key: "rr",
    description: "Preemptive scheduling with time quantum",
    timeComplexity: "O(n)",
    advantages: ["Good for time-sharing", "No starvation", "Fair allocation"],
    disadvantages: ["High context switching overhead", "Performance depends on quantum size"]
  },
  {
    name: "Priority Scheduling",
    key: "priority",
    description: "Scheduling based on process priority",
    timeComplexity: "O(n log n)",
    advantages: ["Supports different priority levels", "Flexible"],
    disadvantages: ["Starvation of low priority", "Priority inversion problem"]
  }
];
export default function CPUSchedulingPage() {
  const [processes, setProcesses] = useState<Process[]>([
    { id: "P1", arrivalTime: 0, burstTime: 7, priority: 3 },
    { id: "P2", arrivalTime: 2, burstTime: 4, priority: 1 },
    { id: "P3", arrivalTime: 4, burstTime: 1, priority: 2 },
    { id: "P4", arrivalTime: 5, burstTime: 4, priority: 4 }
  ]);
  
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("fcfs");
  const [timeQuantum, setTimeQuantum] = useState(2);
  const [result, setResult] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const addProcess = () => {
    const newId = `P${processes.length + 1}`;
    setProcesses([...processes, {
      id: newId,
      arrivalTime: 0,
      burstTime: 1,
      priority: 1
    }]);
  };

  const updateProcess = (index: number, field: keyof Process, value: string | number) => {
    const updatedProcesses = [...processes];
    updatedProcesses[index] = { ...updatedProcesses[index], [field]: value };
    setProcesses(updatedProcesses);
  };

  const removeProcess = (index: number) => {
    setProcesses(processes.filter((_, i) => i !== index));
  };

  const runScheduling = async () => {
    setIsCalculating(true);
    
    // Simulate calculation delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let schedulingResult;
    
    switch (selectedAlgorithm) {
      case "fcfs":
        schedulingResult = fcfsScheduling(processes);
        break;
      case "sjf":
        schedulingResult = sjfScheduling(processes);
        break;
      case "rr":
        schedulingResult = roundRobinScheduling(processes, timeQuantum);
        break;
      case "priority":
        schedulingResult = priorityScheduling(processes);
        break;
      default:
        schedulingResult = fcfsScheduling(processes);
    }
    
    setResult(schedulingResult);
    setIsCalculating(false);
  };

  const reset = () => {
    setResult(null);
    setProcesses([
      { id: "P1", arrivalTime: 0, burstTime: 7, priority: 3 },
      { id: "P2", arrivalTime: 2, burstTime: 4, priority: 1 },
      { id: "P3", arrivalTime: 4, burstTime: 1, priority: 2 },
      { id: "P4", arrivalTime: 5, burstTime: 4, priority: 4 }
    ]);
  };

  const selectedAlgInfo = algorithms.find(alg => alg.key === selectedAlgorithm);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">CPU Scheduling Algorithms</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Visualize and compare different CPU scheduling algorithms. Input processes and see step-by-step execution with Gantt charts.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Algorithm Selection */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Select Algorithm</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {algorithms.map((alg) => (
                  <button
                    key={alg.key}
                    onClick={() => setSelectedAlgorithm(alg.key)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      selectedAlgorithm === alg.key
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <h3 className="font-semibold text-gray-800">{alg.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{alg.description}</p>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded mt-2 inline-block">
                      {alg.timeComplexity}
                    </span>
                  </button>
                ))}
              </div>

              {/* Time Quantum for Round Robin */}
              {selectedAlgorithm === "rr" && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Quantum
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={timeQuantum}
                    onChange={(e) => setTimeQuantum(parseInt(e.target.value) || 1)}
                    className="w-20 px-3 py-2 border-2 border-gray-400 rounded-md bg-white text-black font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}
            </div>

            {/* Process Input */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">Process Table</h2>
                <button
                  onClick={addProcess}
                  className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Process</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border-2 border-gray-400">
                  <thead>
                    <tr className="bg-gray-800 text-white">
                      <th className="border-2 border-gray-400 px-4 py-3 text-left font-semibold">Process ID</th>
                      <th className="border-2 border-gray-400 px-4 py-3 text-left font-semibold">Arrival Time</th>
                      <th className="border-2 border-gray-400 px-4 py-3 text-left font-semibold">Burst Time</th>
                      {selectedAlgorithm === "priority" && (
                        <th className="border-2 border-gray-400 px-4 py-3 text-left font-semibold">Priority</th>
                      )}
                      <th className="border-2 border-gray-400 px-4 py-3 text-left font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processes.map((process, index) => (
                      <tr key={process.id} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition-colors`}>
                        <td className="border-2 border-gray-400 px-4 py-3">
                          <input
                            type="text"
                            value={process.id}
                            onChange={(e) => updateProcess(index, "id", e.target.value)}
                            className="w-full px-2 py-1 border-2 border-gray-400 rounded bg-white text-black font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </td>
                        <td className="border-2 border-gray-400 px-4 py-3">
                          <input
                            type="number"
                            min="0"
                            value={process.arrivalTime}
                            onChange={(e) => updateProcess(index, "arrivalTime", parseInt(e.target.value) || 0)}
                            className="w-full px-2 py-1 border-2 border-gray-400 rounded bg-white text-black font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </td>
                        <td className="border-2 border-gray-400 px-4 py-3">
                          <input
                            type="number"
                            min="1"
                            value={process.burstTime}
                            onChange={(e) => updateProcess(index, "burstTime", parseInt(e.target.value) || 1)}
                            className="w-full px-2 py-1 border-2 border-gray-400 rounded bg-white text-black font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </td>
                        {selectedAlgorithm === "priority" && (
                          <td className="border-2 border-gray-400 px-4 py-3">
                            <input
                              type="number"
                              min="1"
                              value={process.priority || 1}
                              onChange={(e) => updateProcess(index, "priority", parseInt(e.target.value) || 1)}
                              className="w-full px-2 py-1 border-2 border-gray-400 rounded bg-white text-black font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </td>
                        )}
                        <td className="border-2 border-gray-400 px-4 py-3">
                          <button
                            onClick={() => removeProcess(index)}
                            className="text-red-500 hover:text-red-700 p-1"
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
                  onClick={runScheduling}
                  disabled={isCalculating || processes.length === 0}
                  className="flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCalculating ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  <span>{isCalculating ? "Calculating..." : "Run Scheduling"}</span>
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

          {/* Algorithm Info Sidebar */}
          <div className="space-y-6">
            {selectedAlgInfo && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">{selectedAlgInfo.name}</h3>
                <p className="text-gray-600 mb-4">{selectedAlgInfo.description}</p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2">Advantages:</h4>
                    <ul className="space-y-1">
                      {selectedAlgInfo.advantages.map((advantage, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          {advantage}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-red-700 mb-2">Disadvantages:</h4>
                    <ul className="space-y-1">
                      {selectedAlgInfo.disadvantages.map((disadvantage, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <span className="text-red-500 mr-2">✗</span>
                          {disadvantage}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Tips */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-semibold mb-4">Mumbai University Tips</h3>
              <ul className="space-y-2 text-sm">
                <li>• Always draw the Gantt chart</li>
                <li>• Calculate waiting time = turnaround time - burst time</li>
                <li>• Show all calculation steps</li>
                <li>• Compare algorithms in conclusion</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Scheduling Results</h2>
            
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-gray-800">Avg Waiting Time</span>
                </div>
                <p className="text-2xl font-bold text-blue-600 mt-2">{result.averageWaitingTime.toFixed(2)}</p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-gray-800">Avg Turnaround Time</span>
                </div>
                <p className="text-2xl font-bold text-green-600 mt-2">{result.averageTurnaroundTime.toFixed(2)}</p>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  <span className="font-semibold text-gray-800">Total Time</span>
                </div>
                <p className="text-2xl font-bold text-purple-600 mt-2">{result.totalTime}</p>
              </div>
            </div>

            {/* Gantt Chart */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Gantt Chart</h3>
              <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                <div className="flex min-w-max">
                  {result.ganttChart.map((entry: any, index: number) => (
                    <div key={index} className="flex flex-col items-center">
                      <div 
                        className="bg-blue-500 text-white px-4 py-2 border border-gray-300 flex items-center justify-center"
                        style={{ minWidth: `${(entry.endTime - entry.startTime) * 40}px` }}
                      >
                        {entry.processId}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">{entry.startTime}</div>
                    </div>
                  ))}
                  <div className="text-xs text-gray-600 mt-8 ml-2">{result.totalTime}</div>
                </div>
              </div>
            </div>

            {/* Process Table Results */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Process Details</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border-2 border-gray-400">
                  <thead>
                    <tr className="bg-gray-800 text-white">
                      <th className="border-2 border-gray-400 px-4 py-3 text-left font-semibold">Process</th>
                      <th className="border-2 border-gray-400 px-4 py-3 text-left font-semibold">Arrival Time</th>
                      <th className="border-2 border-gray-400 px-4 py-3 text-left font-semibold">Burst Time</th>
                      <th className="border-2 border-gray-400 px-4 py-3 text-left font-semibold">Completion Time</th>
                      <th className="border-2 border-gray-400 px-4 py-3 text-left font-semibold">Turnaround Time</th>
                      <th className="border-2 border-gray-400 px-4 py-3 text-left font-semibold">Waiting Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.processes.map((process: Process, index: number) => (
                      <tr key={process.id} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition-colors`}>
                        <td className="border-2 border-gray-400 px-4 py-3 font-medium text-gray-800">{process.id}</td>
                        <td className="border-2 border-gray-400 px-4 py-3 font-medium text-gray-800">{process.arrivalTime}</td>
                        <td className="border-2 border-gray-400 px-4 py-3 font-medium text-gray-800">{process.burstTime}</td>
                        <td className="border-2 border-gray-400 px-4 py-3 font-medium text-gray-800">{process.completionTime}</td>
                        <td className="border-2 border-gray-400 px-4 py-3 font-medium text-blue-600">{process.turnaroundTime}</td>
                        <td className="border-2 border-gray-400 px-4 py-3 font-medium text-green-600">{process.waitingTime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
