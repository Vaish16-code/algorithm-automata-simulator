import React from 'react';
import { JobSequencingResult, ScheduledJob } from '../utils/greedyAlgorithms';

interface JobSequencingChartProps {
  data: JobSequencingResult;
}

export function JobSequencingChart({ data }: JobSequencingChartProps) {
  if (!data || !data.selectedJobs.length) return null;

  return (
    <div className="space-y-6">
      {/* Timeline Visualization */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
          📅 Job Schedule Timeline
        </h3>
        
        <div className="flex items-center gap-2 mb-4">
          {data.timeline.map((job, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="text-xs text-gray-500 mb-1">Time {index + 1}</div>
              <div
                className={`w-16 h-16 border-2 rounded-lg flex items-center justify-center font-bold text-sm ${
                  job 
                    ? 'bg-gradient-to-br from-green-400 to-blue-500 text-white border-green-500'
                    : 'bg-gray-200 text-gray-500 border-gray-300'
                }`}
              >
                {job ? `J${job.id}` : 'Free'}
              </div>
              {job && (
                <div className="text-xs text-green-600 mt-1 font-semibold">
                  ${job.profit}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Selected Jobs Table */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
          ✅ Selected Jobs Details
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-green-500 to-blue-600 text-white">
                <th className="border-2 border-gray-400 px-4 py-3 text-left font-bold">Job ID</th>
                <th className="border-2 border-gray-400 px-4 py-3 text-left font-bold">Deadline</th>
                <th className="border-2 border-gray-400 px-4 py-3 text-left font-bold">Scheduled Time</th>
                <th className="border-2 border-gray-400 px-4 py-3 text-left font-bold">Profit</th>
                <th className="border-2 border-gray-400 px-4 py-3 text-left font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.selectedJobs.map((job, idx) => (
                <tr key={job.id} className={idx % 2 === 0 ? "bg-white" : "bg-green-50"}>
                  <td className="border-2 border-gray-400 px-4 py-3 font-semibold text-gray-800">
                    Job {job.id}
                  </td>
                  <td className="border-2 border-gray-400 px-4 py-3 text-gray-700">
                    {job.deadline}
                  </td>
                  <td className="border-2 border-gray-400 px-4 py-3 text-blue-600 font-semibold">
                    {job.scheduledTime}
                  </td>
                  <td className="border-2 border-gray-400 px-4 py-3 text-green-600 font-bold">
                    ${job.profit}
                  </td>
                  <td className="border-2 border-gray-400 px-4 py-3">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                      ✓ Completed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Profit Analysis */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200 p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
          💰 Profit Analysis
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-yellow-300">
            <div className="text-2xl font-bold text-green-600">${data.maxProfit}</div>
            <div className="text-sm text-gray-600">Total Profit</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-yellow-300">
            <div className="text-2xl font-bold text-blue-600">{data.selectedJobs.length}</div>
            <div className="text-sm text-gray-600">Jobs Completed</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-yellow-300">
            <div className="text-2xl font-bold text-purple-600">
              ${data.selectedJobs.length > 0 ? (data.maxProfit / data.selectedJobs.length).toFixed(1) : 0}
            </div>
            <div className="text-sm text-gray-600">Avg Profit/Job</div>
          </div>
        </div>
      </div>
    </div>
  );
}
