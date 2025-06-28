"use client";

import { useState } from "react";
import { JobSequencingChart } from "../../../components/JobSequencingChart";
import { jobSequencing, JobSequencingResult } from "../../../utils/greedyAlgorithms";

export default function JobSequencingPage() {
  const [jobs, setJobs] = useState([
    { id: 1, deadline: 2, profit: 100 },
    { id: 2, deadline: 1, profit: 19 },
    { id: 3, deadline: 2, profit: 27 },
    { id: 4, deadline: 1, profit: 25 },
    { id: 5, deadline: 3, profit: 15 }
  ]);
  const [result, setResult] = useState<JobSequencingResult | null>(null);

  const handleSolve = () => {
    const output = jobSequencing(jobs);
    setResult(output);
  };

  const addJob = () => {
    const newId = Math.max(...jobs.map(j => j.id)) + 1;
    setJobs([...jobs, { id: newId, deadline: 1, profit: 10 }]);
  };

  const removeJob = (id: number) => {
    setJobs(jobs.filter(j => j.id !== id));
  };

  const updateJob = (id: number, field: string, value: number) => {
    setJobs(jobs.map(j => 
      j.id === id ? { ...j, [field]: value } : j
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Job Sequencing with Deadlines
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Job Input</h2>
          
          <div className="space-y-4 mb-6">
            {jobs.map((job) => (
              <div key={job.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="font-semibold text-gray-700">Job {job.id}:</div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Deadline:</label>
                  <input
                    type="number"
                    min="1"
                    className="w-20 border border-gray-300 rounded px-2 py-1"
                    value={job.deadline}
                    onChange={(e) => updateJob(job.id, 'deadline', parseInt(e.target.value) || 1)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Profit:</label>
                  <input
                    type="number"
                    min="1"
                    className="w-20 border border-gray-300 rounded px-2 py-1"
                    value={job.profit}
                    onChange={(e) => updateJob(job.id, 'profit', parseInt(e.target.value) || 1)}
                  />
                </div>
                <button
                  onClick={() => removeJob(job.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  disabled={jobs.length <= 1}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={addJob}
              className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-md"
            >
              Add Job
            </button>
            <button
              onClick={handleSolve}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md"
            >
              Solve Job Sequencing
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Solution</h2>
            
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              <div className="flex items-center">
                <span className="text-2xl mr-2">💼</span>
                <div>
                  <p className="font-bold text-lg">
                    Maximum Profit: ${result.maxProfit}
                  </p>
                  <p className="text-sm">
                    Jobs completed: {result.selectedJobs.length}
                  </p>
                </div>
              </div>
            </div>

            <JobSequencingChart data={result} />
          </div>
        )}

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2 text-blue-800">How it works:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Sort jobs by profit in descending order</li>
            <li>• Try to schedule each job at its latest possible time</li>
            <li>• A job can only be scheduled if there&apos;s a free time slot before its deadline</li>
            <li>• Greedy approach: always pick the most profitable job that can be scheduled</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
