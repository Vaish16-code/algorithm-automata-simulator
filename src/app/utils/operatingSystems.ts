// utils/operatingSystems.ts

// ========== CPU SCHEDULING ALGORITHMS ==========

export interface Process {
  id: string;
  arrivalTime: number;
  burstTime: number;
  priority?: number;
  waitingTime?: number;
  turnaroundTime?: number;
  completionTime?: number;
  remainingTime?: number;
}

export interface SchedulingResult {
  processes: Process[];
  averageWaitingTime: number;
  averageTurnaroundTime: number;
  ganttChart: GanttEntry[];
  totalTime: number;
}

export interface GanttEntry {
  processId: string;
  startTime: number;
  endTime: number;
  step: number;
}

// First Come First Serve (FCFS)
export function fcfsScheduling(processes: Process[]): SchedulingResult {
  const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  const ganttChart: GanttEntry[] = [];
  let currentTime = 0;
  let step = 0;

  sortedProcesses.forEach(process => {
    if (currentTime < process.arrivalTime) {
      currentTime = process.arrivalTime;
    }

    ganttChart.push({
      processId: process.id,
      startTime: currentTime,
      endTime: currentTime + process.burstTime,
      step: step++
    });

    process.completionTime = currentTime + process.burstTime;
    process.turnaroundTime = process.completionTime - process.arrivalTime;
    process.waitingTime = process.turnaroundTime - process.burstTime;
    
    currentTime += process.burstTime;
  });

  const averageWaitingTime = sortedProcesses.reduce((sum, p) => sum + (p.waitingTime || 0), 0) / sortedProcesses.length;
  const averageTurnaroundTime = sortedProcesses.reduce((sum, p) => sum + (p.turnaroundTime || 0), 0) / sortedProcesses.length;

  return {
    processes: sortedProcesses,
    averageWaitingTime,
    averageTurnaroundTime,
    ganttChart,
    totalTime: currentTime
  };
}

// Shortest Job First (SJF)
export function sjfScheduling(processes: Process[]): SchedulingResult {
  const processQueue = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  const completedProcesses: Process[] = [];
  const ganttChart: GanttEntry[] = [];
  let currentTime = 0;
  let step = 0;

  while (processQueue.length > 0 || completedProcesses.length < processes.length) {
    const availableProcesses = processQueue.filter(p => p.arrivalTime <= currentTime);
    
    if (availableProcesses.length === 0) {
      currentTime++;
      continue;
    }

    // Select shortest job
    const shortestJob = availableProcesses.reduce((prev, curr) => 
      prev.burstTime < curr.burstTime ? prev : curr
    );

    ganttChart.push({
      processId: shortestJob.id,
      startTime: currentTime,
      endTime: currentTime + shortestJob.burstTime,
      step: step++
    });

    shortestJob.completionTime = currentTime + shortestJob.burstTime;
    shortestJob.turnaroundTime = shortestJob.completionTime - shortestJob.arrivalTime;
    shortestJob.waitingTime = shortestJob.turnaroundTime - shortestJob.burstTime;

    currentTime += shortestJob.burstTime;
    completedProcesses.push(shortestJob);
    processQueue.splice(processQueue.indexOf(shortestJob), 1);
  }

  const averageWaitingTime = completedProcesses.reduce((sum, p) => sum + (p.waitingTime || 0), 0) / completedProcesses.length;
  const averageTurnaroundTime = completedProcesses.reduce((sum, p) => sum + (p.turnaroundTime || 0), 0) / completedProcesses.length;

  return {
    processes: completedProcesses,
    averageWaitingTime,
    averageTurnaroundTime,
    ganttChart,
    totalTime: currentTime
  };
}

// Round Robin Scheduling
export function roundRobinScheduling(processes: Process[], timeQuantum: number): SchedulingResult {
  const processQueue = [...processes].map(p => ({ ...p, remainingTime: p.burstTime }));
  const ganttChart: GanttEntry[] = [];
  let currentTime = 0;
  let step = 0;
  const readyQueue: Process[] = [];
  const completedProcesses: Process[] = [];

  // Sort by arrival time
  processQueue.sort((a, b) => a.arrivalTime - b.arrivalTime);

  while (completedProcesses.length < processes.length) {
    // Add processes that have arrived to ready queue
    processQueue.forEach(process => {
      if (process.arrivalTime <= currentTime && 
          !readyQueue.includes(process) && 
          !completedProcesses.includes(process)) {
        readyQueue.push(process);
      }
    });

    if (readyQueue.length === 0) {
      currentTime++;
      continue;
    }

    const currentProcess = readyQueue.shift()!;
    const timeSlice = Math.min(timeQuantum, currentProcess.remainingTime!);

    ganttChart.push({
      processId: currentProcess.id,
      startTime: currentTime,
      endTime: currentTime + timeSlice,
      step: step++
    });

    currentProcess.remainingTime! -= timeSlice;
    currentTime += timeSlice;

    if (currentProcess.remainingTime! === 0) {
      currentProcess.completionTime = currentTime;
      currentProcess.turnaroundTime = currentProcess.completionTime - currentProcess.arrivalTime;
      currentProcess.waitingTime = currentProcess.turnaroundTime - currentProcess.burstTime;
      completedProcesses.push(currentProcess);
    } else {
      // Add processes that arrived during execution
      processQueue.forEach(process => {
        if (process.arrivalTime <= currentTime && 
            !readyQueue.includes(process) && 
            !completedProcesses.includes(process) &&
            process !== currentProcess) {
          readyQueue.push(process);
        }
      });
      readyQueue.push(currentProcess);
    }
  }

  const totalWaitingTime = completedProcesses.reduce((sum, p) => sum + (p.waitingTime || 0), 0);
  const totalTurnaroundTime = completedProcesses.reduce((sum, p) => sum + (p.turnaroundTime || 0), 0);

  return {
    processes: completedProcesses,
    averageWaitingTime: totalWaitingTime / completedProcesses.length,
    averageTurnaroundTime: totalTurnaroundTime / completedProcesses.length,
    ganttChart,
    totalTime: currentTime
  };
}

// Priority Scheduling (Non-preemptive)
export function priorityScheduling(processes: Process[]): SchedulingResult {
  const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  const ganttChart: GanttEntry[] = [];
  const completedProcesses: Process[] = [];
  let currentTime = 0;
  let step = 0;

  while (completedProcesses.length < processes.length) {
    const availableProcesses = sortedProcesses.filter(p => 
      p.arrivalTime <= currentTime && !completedProcesses.includes(p)
    );

    if (availableProcesses.length === 0) {
      currentTime++;
      continue;
    }

    // Select highest priority process (lower number = higher priority)
    const highestPriorityProcess = availableProcesses.reduce((prev, curr) => 
      (prev.priority || 0) < (curr.priority || 0) ? prev : curr
    );

    ganttChart.push({
      processId: highestPriorityProcess.id,
      startTime: currentTime,
      endTime: currentTime + highestPriorityProcess.burstTime,
      step: step++
    });

    highestPriorityProcess.completionTime = currentTime + highestPriorityProcess.burstTime;
    highestPriorityProcess.turnaroundTime = highestPriorityProcess.completionTime - highestPriorityProcess.arrivalTime;
    highestPriorityProcess.waitingTime = highestPriorityProcess.turnaroundTime - highestPriorityProcess.burstTime;

    currentTime = highestPriorityProcess.completionTime;
    completedProcesses.push(highestPriorityProcess);
  }

  const totalWaitingTime = completedProcesses.reduce((sum, p) => sum + (p.waitingTime || 0), 0);
  const totalTurnaroundTime = completedProcesses.reduce((sum, p) => sum + (p.turnaroundTime || 0), 0);

  return {
    processes: completedProcesses,
    averageWaitingTime: totalWaitingTime / completedProcesses.length,
    averageTurnaroundTime: totalTurnaroundTime / completedProcesses.length,
    ganttChart,
    totalTime: currentTime
  };
}

// ========== MEMORY ALLOCATION ALGORITHMS ==========

export interface MemoryBlock {
  id: string;
  size: number;
  allocated: boolean;
  processId?: string;
  startAddress: number;
}

export interface AllocationRequest {
  processId: string;
  size: number;
}

export interface MemoryAllocationResult {
  blocks: MemoryBlock[];
  allocated: boolean;
  processId: string;
  allocatedBlock?: MemoryBlock;
  externalFragmentation: number;
  internalFragmentation: number;
}

// First Fit Algorithm
export function firstFit(blocks: MemoryBlock[], request: AllocationRequest): MemoryAllocationResult {
  const updatedBlocks = [...blocks];
  let allocatedBlock: MemoryBlock | undefined;

  for (const block of updatedBlocks) {
    if (!block.allocated && block.size >= request.size) {
      if (block.size > request.size) {
        // Split the block
        const newBlock: MemoryBlock = {
          id: `${block.id}_split`,
          size: block.size - request.size,
          allocated: false,
          startAddress: block.startAddress + request.size
        };
        updatedBlocks.splice(updatedBlocks.indexOf(block) + 1, 0, newBlock);
      }
      
      block.size = request.size;
      block.allocated = true;
      block.processId = request.processId;
      allocatedBlock = block;
      break;
    }
  }

  const totalMemory = updatedBlocks.reduce((sum, block) => sum + block.size, 0);
  const allocatedMemory = updatedBlocks.filter(b => b.allocated).reduce((sum, block) => sum + block.size, 0);
  const freeMemory = totalMemory - allocatedMemory;
  const largestFreeBlock = Math.max(...updatedBlocks.filter(b => !b.allocated).map(b => b.size), 0);

  return {
    blocks: updatedBlocks,
    allocated: !!allocatedBlock,
    processId: request.processId,
    allocatedBlock,
    externalFragmentation: freeMemory - largestFreeBlock,
    internalFragmentation: allocatedBlock ? allocatedBlock.size - request.size : 0
  };
}

// Best Fit Algorithm
export function bestFit(blocks: MemoryBlock[], request: AllocationRequest): MemoryAllocationResult {
  const updatedBlocks = [...blocks];
  let bestBlock: MemoryBlock | undefined;
  let minWaste = Infinity;

  for (const block of updatedBlocks) {
    if (!block.allocated && block.size >= request.size) {
      const waste = block.size - request.size;
      if (waste < minWaste) {
        minWaste = waste;
        bestBlock = block;
      }
    }
  }

  if (bestBlock) {
    if (bestBlock.size > request.size) {
      // Split the block
      const newBlock: MemoryBlock = {
        id: `${bestBlock.id}_split`,
        size: bestBlock.size - request.size,
        allocated: false,
        startAddress: bestBlock.startAddress + request.size
      };
      updatedBlocks.splice(updatedBlocks.indexOf(bestBlock) + 1, 0, newBlock);
    }
    
    bestBlock.size = request.size;
    bestBlock.allocated = true;
    bestBlock.processId = request.processId;
  }

  const totalMemory = updatedBlocks.reduce((sum, block) => sum + block.size, 0);
  const allocatedMemory = updatedBlocks.filter(b => b.allocated).reduce((sum, block) => sum + block.size, 0);
  const freeMemory = totalMemory - allocatedMemory;
  const largestFreeBlock = Math.max(...updatedBlocks.filter(b => !b.allocated).map(b => b.size), 0);

  return {
    blocks: updatedBlocks,
    allocated: !!bestBlock,
    processId: request.processId,
    allocatedBlock: bestBlock,
    externalFragmentation: freeMemory - largestFreeBlock,
    internalFragmentation: bestBlock ? bestBlock.size - request.size : 0
  };
}

// Worst Fit Algorithm
export function worstFit(blocks: MemoryBlock[], request: AllocationRequest): MemoryAllocationResult {
  const updatedBlocks = [...blocks];
  let worstBlock: MemoryBlock | undefined;
  let maxWaste = -1;

  for (const block of updatedBlocks) {
    if (!block.allocated && block.size >= request.size) {
      const waste = block.size - request.size;
      if (waste > maxWaste) {
        maxWaste = waste;
        worstBlock = block;
      }
    }
  }

  if (worstBlock) {
    if (worstBlock.size > request.size) {
      // Split the block
      const newBlock: MemoryBlock = {
        id: `${worstBlock.id}_split`,
        size: worstBlock.size - request.size,
        allocated: false,
        startAddress: worstBlock.startAddress + request.size
      };
      updatedBlocks.splice(updatedBlocks.indexOf(worstBlock) + 1, 0, newBlock);
    }
    
    worstBlock.size = request.size;
    worstBlock.allocated = true;
    worstBlock.processId = request.processId;
  }

  const totalMemory = updatedBlocks.reduce((sum, block) => sum + block.size, 0);
  const allocatedMemory = updatedBlocks.filter(b => b.allocated).reduce((sum, block) => sum + block.size, 0);
  const freeMemory = totalMemory - allocatedMemory;
  const largestFreeBlock = Math.max(...updatedBlocks.filter(b => !b.allocated).map(b => b.size), 0);

  return {
    blocks: updatedBlocks,
    allocated: !!worstBlock,
    processId: request.processId,
    allocatedBlock: worstBlock,
    externalFragmentation: freeMemory - largestFreeBlock,
    internalFragmentation: worstBlock ? worstBlock.size - request.size : 0
  };
}

// ========== DEADLOCK DETECTION ==========

export interface DeadlockProcess {
  id: string;
  allocation: number[];
  max: number[];
  need: number[];
}

export interface DeadlockResult {
  safeSequence: string[];
  isSafe: boolean;
  steps: string[];
}

// Banker's Algorithm for Deadlock Detection
export function bankersAlgorithm(
  processes: DeadlockProcess[],
  available: number[]
): DeadlockResult {
  const steps: string[] = [];
  const safeSequence: string[] = [];
  const work = [...available];
  const finish = new Array(processes.length).fill(false);
  
  steps.push(`Initial available resources: [${available.join(', ')}]`);
  
  let found = true;
  while (found && safeSequence.length < processes.length) {
    found = false;
    
    for (let i = 0; i < processes.length; i++) {
      if (!finish[i]) {
        const process = processes[i];
        const canAllocate = process.need.every((need, j) => need <= work[j]);
        
        if (canAllocate) {
          steps.push(`Process ${process.id} can be allocated resources`);
          steps.push(`Need: [${process.need.join(', ')}], Available: [${work.join(', ')}]`);
          
          // Add allocated resources back to work
          for (let j = 0; j < work.length; j++) {
            work[j] += process.allocation[j];
          }
          
          finish[i] = true;
          safeSequence.push(process.id);
          found = true;
          
          steps.push(`Process ${process.id} completes. Available becomes: [${work.join(', ')}]`);
          break;
        }
      }
    }
  }
  
  const isSafe = safeSequence.length === processes.length;
  
  if (isSafe) {
    steps.push(`Safe sequence found: ${safeSequence.join(' → ')}`);
  } else {
    steps.push('No safe sequence found. System is in deadlock state.');
  }
  
  return {
    safeSequence,
    isSafe,
    steps
  };
}
