"use client";

import React, { useState } from 'react';
import { Plus, Minus, Github } from 'lucide-react';
import { Process, SchedulingResult, solveFCFS, solveSJF, solvePriority, solveRoundRobin, solveSRTF } from '../utils/scheduling';
import GanttChart from '../components/GanttChart';

const OSSchedulingPage = () => {
  const [algorithm, setAlgorithm] = useState('FCFS');
  const [processes, setProcesses] = useState<Process[]>([
    { id: 'P1', arrivalTime: 0, burstTime: 0, priority: 1 },
    { id: 'P2', arrivalTime: 0, burstTime: 0, priority: 2 },
    { id: 'P3', arrivalTime: 0, burstTime: 0, priority: 3 }
  ]);
  const [results, setResults] = useState<SchedulingResult | null>(null);
  const [timeQuantum, setTimeQuantum] = useState(2);

  const algorithms = ['FCFS', 'SJF', 'Priority', 'Round Robin', 'SRTF'];

  const addProcess = () => {
    const newId = `P${processes.length + 1}`;
    setProcesses([...processes, { 
      id: newId, 
      arrivalTime: 0, 
      burstTime: 0, 
      priority: processes.length + 1 
    }]);
  };

  const removeProcess = () => {
    if (processes.length > 1) {
      setProcesses(processes.slice(0, -1));
    }
  };

  const updateProcess = (index: number, field: keyof Process, value: string) => {
    const updated = [...processes];
    const numValue = parseInt(value) || 0;
    if (field === 'id') {
      updated[index][field] = value;
    } else {
      updated[index][field] = numValue;
    }
    setProcesses(updated);
  };

  const calculate = () => {
    let result: SchedulingResult;
    
    switch (algorithm) {
      case 'FCFS':
        result = solveFCFS(processes);
        break;
      case 'SJF':
        result = solveSJF(processes);
        break;
      case 'Priority':
        result = solvePriority(processes);
        break;
      case 'Round Robin':
        result = solveRoundRobin(processes, timeQuantum);
        break;
      case 'SRTF':
        result = solveSRTF(processes);
        break;
      default:
        result = solveFCFS(processes);
    }
    
    setResults(result);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-800 text-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-semibold">OS-Scheduling Algorithms</h1>
          <Github className="w-6 h-6" />
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {/* Algorithm Selection and Title */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">{algorithm} Algorithm</h2>
          <div className="relative inline-block">
            <select 
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              className="bg-gray-600 text-white px-4 py-2 rounded-md border-0 appearance-none cursor-pointer pr-8"
            >
              {algorithms.map(alg => (
                <option key={alg} value={alg}>{alg}</option>
              ))}
            </select>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white pointer-events-none">
              ▼
            </div>
          </div>
        </div>

        {/* Time Quantum for Round Robin */}
        {algorithm === 'Round Robin' && (
          <div className="mb-6 text-center">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Quantum
            </label>
            <input
              type="number"
              value={timeQuantum}
              onChange={(e) => setTimeQuantum(parseInt(e.target.value) || 1)}
              className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
            />
          </div>
        )}

        {/* Process Input Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border-r">Process</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border-r">Arrival Time</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border-r">Burst Time</th>
                {algorithm === 'Priority' && (
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Priority</th>
                )}
              </tr>
            </thead>
            <tbody>
              {processes.map((process, index) => (
                <tr key={process.id} className="border-t">
                  <td className="px-6 py-4 text-sm text-gray-800 border-r bg-gray-50">
                    {process.id}
                  </td>
                  <td className="px-6 py-4 border-r">
                    <input
                      type="number"
                      value={process.arrivalTime}
                      onChange={(e) => updateProcess(index, 'arrivalTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </td>
                  <td className="px-6 py-4 border-r">
                    <input
                      type="number"
                      value={process.burstTime}
                      onChange={(e) => updateProcess(index, 'burstTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                    />
                  </td>
                  {algorithm === 'Priority' && (
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        value={process.priority || 0}
                        onChange={(e) => updateProcess(index, 'priority', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="1"
                      />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add/Remove Process Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={addProcess}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
          <button
            onClick={removeProcess}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
            disabled={processes.length <= 1}
          >
            <Minus className="w-5 h-5" />
          </button>
        </div>

        {/* Calculate Button */}
        <div className="text-center mb-8">
          <button
            onClick={calculate}
            className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition-colors"
          >
            Calculate
          </button>
        </div>

        {/* Gantt Chart */}
        {results && <GanttChart ganttChart={results.ganttChart} />}

        {/* Results Table */}
        {results && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <h3 className="text-xl font-semibold p-4 bg-gray-100 border-b">Results</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">Process</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">Arrival Time</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">Burst Time</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">Start Time</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">Completion Time</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">Waiting Time</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Turnaround Time</th>
                  </tr>
                </thead>
                <tbody>
                  {results.processes.map((process) => (
                    <tr key={process.id} className="border-t">
                      <td className="px-4 py-3 text-sm text-gray-800 border-r">{process.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-800 border-r">{process.arrivalTime}</td>
                      <td className="px-4 py-3 text-sm text-gray-800 border-r">{process.burstTime}</td>
                      <td className="px-4 py-3 text-sm text-gray-800 border-r">{process.startTime}</td>
                      <td className="px-4 py-3 text-sm text-gray-800 border-r">{process.completionTime}</td>
                      <td className="px-4 py-3 text-sm text-gray-800 border-r">{process.waitingTime}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{process.turnaroundTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Averages */}
            <div className="bg-gray-50 p-4 border-t">
              <div className="flex justify-center gap-8">
                <div className="text-center">
                  <div className="text-sm text-gray-600">Average Waiting Time</div>
                  <div className="text-lg font-semibold text-gray-800">{results.averageWaitingTime.toFixed(2)}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">Average Turnaround Time</div>
                  <div className="text-lg font-semibold text-gray-800">{results.averageTurnaroundTime.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OSSchedulingPage;