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
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [animationSteps, setAnimationSteps] = useState<AnimationStep[]>([]);

  interface Job {
    id: number;
    deadline: number;
    profit: number;
    scheduledTime?: number;
  }

  interface AnimationStep {
    type: string;
    sortedJobs: Job[];
    timeline: (Job | null)[];
    selectedJobs: Job[];
    currentJob: Job | null;
    message: string;
  }

  const handleSolve = () => {
    const output = jobSequencing(jobs);
    setResult(output);
  };

  const handleAnimate = () => {
    const output = jobSequencing(jobs);
    setResult(output);
    
    // Generate animation steps
    const steps = generateJobSequencingAnimationSteps(jobs);
    setAnimationSteps(steps);
    setAnimationStep(0);
    setIsAnimating(true);
  };

  const generateJobSequencingAnimationSteps = (jobs: Job[]): AnimationStep[] => {
    const steps: AnimationStep[] = [];
    const sortedJobs = [...jobs].sort((a, b) => b.profit - a.profit);
    const maxDeadline = Math.max(...jobs.map(j => j.deadline));
    const timeline: (Job | null)[] = new Array(maxDeadline).fill(null);
    const selectedJobs: Job[] = [];

    // Step 1: Show sorted jobs
    steps.push({
      type: 'sort',
      sortedJobs: [...sortedJobs],
      timeline: [...timeline],
      selectedJobs: [],
      currentJob: null,
      message: 'Step 1: Sort jobs by profit in descending order'
    });

    // Process each job
    for (let i = 0; i < sortedJobs.length; i++) {
      const job = sortedJobs[i];
      let scheduled = false;

      // Try to schedule the job at the latest possible time
      for (let t = Math.min(job.deadline - 1, maxDeadline - 1); t >= 0; t--) {
        if (timeline[t] === null) {
          timeline[t] = job;
          selectedJobs.push({ ...job, scheduledTime: t + 1 });
          scheduled = true;
          
          steps.push({
            type: 'schedule',
            sortedJobs: [...sortedJobs],
            timeline: [...timeline],
            selectedJobs: [...selectedJobs],
            currentJob: job,
            message: `Scheduled Job ${job.id} at time ${t + 1} (profit: ${job.profit})`
          });
          break;
        }
      }

      if (!scheduled) {
        steps.push({
          type: 'reject',
          sortedJobs: [...sortedJobs],
          timeline: [...timeline],
          selectedJobs: [...selectedJobs],
          currentJob: job,
          message: `Job ${job.id} rejected - no available time slot before deadline ${job.deadline}`
        });
      }
    }

    steps.push({
      type: 'complete',
      sortedJobs: [...sortedJobs],
      timeline: [...timeline],
      selectedJobs: [...selectedJobs],
      currentJob: null,
      message: 'Job sequencing complete!'
    });

    return steps;
  };

  const nextAnimationStep = () => {
    if (animationStep < animationSteps.length - 1) {
      setAnimationStep(animationStep + 1);
    }
  };

  const prevAnimationStep = () => {
    if (animationStep > 0) {
      setAnimationStep(animationStep - 1);
    }
  };

  const resetAnimation = () => {
    setIsAnimating(false);
    setAnimationStep(0);
    setAnimationSteps([]);
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
                    className="w-20 border-4 border-gray-800 rounded px-3 py-2 text-black text-lg font-bold bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                    value={job.deadline}
                    onChange={(e) => updateJob(job.id, 'deadline', parseInt(e.target.value) || 1)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Profit:</label>
                  <input
                    type="number"
                    min="1"
                    className="w-20 border-4 border-gray-800 rounded px-3 py-2 text-black text-lg font-bold bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
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

          <div className="flex flex-wrap gap-4">
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
            <button
              onClick={handleAnimate}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2 rounded-md flex items-center gap-2"
            >
              <span>🎬</span>
              Animate Algorithm
            </button>
          </div>
        </div>

        {/* Animation Controls */}
        {isAnimating && animationSteps.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-2 border-purple-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center gap-2">
              <span>🎬</span>
              Job Sequencing Animation
            </h2>
            
            {/* Current Step Info */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-purple-800">
                  Step {animationStep + 1} of {animationSteps.length}
                </h3>
                <div className="text-sm text-purple-600">
                  {animationSteps[animationStep]?.type === 'sort' && '📊 Sorting Jobs'}
                  {animationSteps[animationStep]?.type === 'schedule' && '✅ Scheduling Job'}
                  {animationSteps[animationStep]?.type === 'reject' && '❌ Rejecting Job'}
                  {animationSteps[animationStep]?.type === 'complete' && '🎉 Complete'}
                </div>
              </div>
              <p className="text-purple-700 font-medium">
                {animationSteps[animationStep]?.message}
              </p>
            </div>

            {/* Animation Controls */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <button
                onClick={prevAnimationStep}
                disabled={animationStep === 0}
                className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-md flex items-center gap-2"
              >
                ⏮️ Previous
              </button>
              
              <div className="bg-gray-100 px-4 py-2 rounded-lg">
                <span className="text-sm font-medium text-gray-600">
                  {animationStep + 1} / {animationSteps.length}
                </span>
              </div>
              
              <button
                onClick={nextAnimationStep}
                disabled={animationStep >= animationSteps.length - 1}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2 rounded-md flex items-center gap-2"
              >
                Next ⏭️
              </button>
              
              <button
                onClick={resetAnimation}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
              >
                🔄 Reset
              </button>
            </div>

            {/* Current State Visualization */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Sorted Jobs by Profit</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {(animationSteps[animationStep]?.sortedJobs || []).map((job: Job, idx: number) => (
                    <div 
                      key={idx} 
                      className={`text-sm p-2 rounded flex justify-between ${
                        animationSteps[animationStep]?.currentJob?.id === job.id
                          ? 'bg-yellow-200 text-yellow-800 font-bold'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      <span>Job {job.id}</span>
                      <span>Profit: {job.profit}, Deadline: {job.deadline}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">Timeline & Selected Jobs</h4>
                <div className="space-y-2">
                  <div className="flex gap-1 mb-2">
                    {(animationSteps[animationStep]?.timeline || []).map((job: Job | null, timeSlot: number) => (
                      <div 
                        key={timeSlot}
                        className={`w-12 h-12 border-2 rounded flex items-center justify-center text-xs font-bold ${
                          job 
                            ? 'bg-green-200 border-green-400 text-green-800'
                            : 'bg-gray-100 border-gray-300 text-gray-500'
                        }`}
                      >
                        {job ? `J${job.id}` : `T${timeSlot + 1}`}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1 max-h-20 overflow-y-auto">
                    {(animationSteps[animationStep]?.selectedJobs || []).map((job: Job, idx: number) => (
                      <div key={idx} className="text-sm text-green-700">
                        Job {job.id}: Time {job.scheduledTime}, Profit {job.profit}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {result && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              {isAnimating ? 'Animation Progress' : 'Solution'}
            </h2>
            
            {!isAnimating && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">💼</span>
                  <div>
                    <p className="font-bold text-lg">
                      Maximum Profit: {result.maxProfit}
                    </p>
                    <p className="text-sm">
                      Jobs completed: {result.selectedJobs.length}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <JobSequencingChart 
              data={result} 
              animationData={isAnimating && animationSteps.length > 0 ? animationSteps[animationStep] : undefined}
              isAnimating={isAnimating}
            />
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
