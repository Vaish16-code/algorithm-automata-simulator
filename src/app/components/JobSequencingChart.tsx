import React from 'react';
import { JobSequencingResult } from '../utils/greedyAlgorithms';

interface Job {
  id: number;
  deadline: number;
  profit: number;
  scheduledTime?: number;
}

interface AnimationStep {
  sortedJobs: Job[];
  timeline: (Job | null)[];
  selectedJobs: Job[];
  currentJob: Job | null;
  message: string;
  type: string;
}

interface JobSequencingChartProps {
  data: JobSequencingResult;
  animationData?: AnimationStep;
  isAnimating?: boolean;
}

export function JobSequencingChart({ data, animationData, isAnimating }: JobSequencingChartProps) {
  if (!data || !data.selectedJobs.length) return null;

  // Use animation data if available, otherwise use final result data
  const timeline = isAnimating ? animationData?.timeline || [] : data.timeline;
  const selectedJobs = isAnimating ? animationData?.selectedJobs || [] : data.selectedJobs;

  return (
    <div className="space-y-6">
      {/* Animation Step Info - Only show during animation */}
      {isAnimating && animationData && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
            🎬 Current Step Visualization
          </h3>
          <div className="bg-purple-100 border border-purple-300 rounded-lg p-4">
            <p className="text-purple-800 font-semibold text-lg">{animationData.message}</p>
            {animationData.currentJob && (
              <p className="text-purple-600 mt-2">
                Currently processing: Job {animationData.currentJob.id} (Profit: {animationData.currentJob.profit}, Deadline: {animationData.currentJob.deadline})
              </p>
            )}
          </div>
        </div>
      )}

      {/* Timeline Visualization */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
          📅 Job Schedule Timeline
        </h3>
        
        <div className="flex items-center gap-2 mb-4 justify-center">
          {timeline.map((job: Job | null, index: number) => (
            <div key={index} className="flex flex-col items-center">
              <div className="text-xs text-gray-500 mb-1">Time {index + 1}</div>
              <div
                className={`w-16 h-16 border-2 rounded-lg flex items-center justify-center font-bold text-sm transition-all duration-500 ${
                  job 
                    ? `bg-gradient-to-br from-green-400 to-blue-500 text-white border-green-500 ${
                        isAnimating && animationData?.currentJob?.id === job.id ? 'ring-4 ring-yellow-400 scale-110' : ''
                      }`
                    : 'bg-gray-200 text-gray-500 border-gray-300'
                }`}
              >
                {job ? `J${job.id}` : 'Free'}
              </div>
              {job && (
                <div className="text-xs text-green-600 mt-1 font-semibold">
                  {job.profit}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Jobs Processing Status - Show during animation */}
      {isAnimating && animationData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sorted Jobs List */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
              📊 Jobs by Priority (Sorted by Profit)
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {animationData.sortedJobs.map((job: Job, idx: number) => (
                <div 
                  key={idx} 
                  className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                    animationData.currentJob?.id === job.id
                      ? 'bg-yellow-200 border-yellow-400 text-yellow-800 font-bold transform scale-105'
                      : selectedJobs.some((sj: Job) => sj.id === job.id)
                      ? 'bg-green-100 border-green-300 text-green-800'
                      : 'bg-gray-50 border-gray-200 text-gray-700'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Job {job.id}</span>
                    <div className="text-sm">
                      <span>Profit: {job.profit}</span>
                      <span className="ml-2">Deadline: {job.deadline}</span>
                    </div>
                  </div>
                  {selectedJobs.some((sj: Job) => sj.id === job.id) && (
                    <div className="text-xs text-green-600 mt-1">
                      ✅ Scheduled at time {selectedJobs.find((sj: Job) => sj.id === job.id)?.scheduledTime}
                    </div>
                  )}
                  {animationData.currentJob?.id === job.id && (
                    <div className="text-xs text-yellow-700 mt-1">
                      🔄 Currently processing...
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Selected Jobs Status */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
              ✅ Scheduled Jobs
            </h3>
            <div className="space-y-2">
              {selectedJobs.length === 0 ? (
                <p className="text-gray-500 italic">No jobs scheduled yet...</p>
              ) : (
                selectedJobs.map((job: Job, idx: number) => (
                  <div key={idx} className="bg-green-100 border border-green-300 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-green-800">Job {job.id}</span>
                      <span className="text-green-600">Time {job.scheduledTime}</span>
                    </div>
                    <div className="text-sm text-green-700">
                      Profit: {job.profit} | Deadline: {job.deadline}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {selectedJobs.length > 0 && (
              <div className="mt-4 p-3 bg-green-200 rounded-lg">
                <div className="text-green-800 font-bold">
                  Total Profit: {selectedJobs.reduce((sum: number, job: Job) => sum + job.profit, 0)}
                </div>
                <div className="text-green-700 text-sm">
                  Jobs Completed: {selectedJobs.length}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Final Results Table - Show when not animating */}
      {!isAnimating && (
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border-2 border-green-200 p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
            📊 Final Job Schedule
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border-2 border-gray-400 bg-white rounded-lg overflow-hidden">
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
                      {job.profit}
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
      )}

      {/* Profit Analysis */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200 p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
          💰 Profit Analysis
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-yellow-300">
            <div className="text-2xl font-bold text-green-600">{isAnimating ? selectedJobs.reduce((sum: number, job: Job) => sum + job.profit, 0) : data.maxProfit}</div>
            <div className="text-sm text-gray-600">Total Profit</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-yellow-300">
            <div className="text-2xl font-bold text-blue-600">{isAnimating ? selectedJobs.length : data.selectedJobs.length}</div>
            <div className="text-sm text-gray-600">Jobs Completed</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-yellow-300">
            <div className="text-2xl font-bold text-purple-600">
              {isAnimating 
                ? (selectedJobs.length > 0 ? (selectedJobs.reduce((sum: number, job: Job) => sum + job.profit, 0) / selectedJobs.length).toFixed(1) : 0)
                : (data.selectedJobs.length > 0 ? (data.maxProfit / data.selectedJobs.length).toFixed(1) : 0)
              }
            </div>
            <div className="text-sm text-gray-600">Avg Profit/Job</div>
          </div>
        </div>
      </div>
    </div>
  );
}
